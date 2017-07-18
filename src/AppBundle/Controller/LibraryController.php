<?php
/**
 * Created by PhpStorm.
 * User: cyriaque_maldat
 * Date: 27/12/2016
 * Time: 11:20
 */
namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Doctrine\ORM\EntityManagerInterface;


class LibraryController extends Controller
{

    function getSerializer(){
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      return new Serializer($normalizers, $encoders);
    }

    function decodeAjaxRequest($request){
      $data = json_decode($request->getContent(), true);
      return $data['data'];
    }

    function returnCategoriesByBook($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT c
                                 FROM AppBundle:Media m, AppBundle:Category c, AppBundle:CategoryAffiliation mc
                                 WHERE m.idMedia = :idMedia
                                 AND mc.idMedia = m.idMedia
                                 AND mc.idCategory = c.idCategory"
      )->setParameter('idMedia',$idMedia);
      $result = $query->getResult();
      return json_decode($this->getSerializer()->serialize($result, 'json'));
    }

    function returnNoteByBook($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT avg(n.note) as note
                                 FROM AppBundle:Media m, AppBundle:Note n
                                 WHERE m.idMedia = :idMedia
                                 AND n.idMedia = m.idMedia"
      )->setParameter('idMedia',$idMedia);
      $result = $query->getResult();
      return json_decode($this->getSerializer()->serialize($result, 'json'));
    }

    function returnMyNoteByBook($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT n.note as note
                                 FROM AppBundle:Media m, AppBundle:Note n
                                 WHERE m.idMedia = :idMedia
                                 AND n.idMedia = m.idMedia
                                 AND n.idUser = ".$this->getUser()
      )->setParameter('idMedia',$idMedia);
      $result = $query->getResult();
      return json_decode($this->getSerializer()->serialize($result, 'json'));
    }

    function returnOneBookInfos($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT m as media, avg(n.note) as note, count(n.note) as nbrNotes,u.id as userId, u.username as username
                           FROM AppBundle:Media m
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
                           LEFT JOIN AppBundle:User u
                           WITH u.id = m.idUsers
                           WHERE m.idMedia = :idMedia
                           GROUP by m.idMedia"
      )->setParameter('idMedia',$idMedia)
      ->setMaxResults(1);
      $result = $query->getResult();
      $book = $this->getSerializer()->normalize($result, 'null');
      $book = $book[0];
      $media = $book['media'];
      $media['username'] = $book['username'];
      $media['userId'] = $book['userId'];
      $media['note'] = $book['note'];
      $media['nbrNotes'] = $book['nbrNotes'];
      $media['idUsers'] = $book['media']['idUsers']['id'];
      $media['categories'] = $this->returnCategoriesByBook($media['idMedia']);
      return $media;
    }

    function doesBookExists($isbn){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT m
                           FROM AppBundle:Media m
                           WHERE m.isbn = :isbn
                           AND m.isbn != 0"
      )->setParameter('isbn',$isbn)
      ->setMaxResults(1);
      $result = $query->getResult();
      $book = $this->getSerializer()->normalize($result, 'null');
      return (sizeof($book) > 0)?true:false;
    }

    function sortArray($object){
      return strcmp($a->name, $b->name);
    }

    function findIsbn($array){
        foreach ($array as $value){
           if($value->type==="ISBN_10")
                $isbn10 = $value->identifier;
           if($value->type==="ISBN_13")
                return $value->identifier;
        }
        if(!empty($isbn10))
            return $isbn10;

        return "0";
    }



    /**
     * @Route("/library", name="library")
     */
    public function LibraryAction(){
        return $this->render('default/library.html.twig');
    }

    /**
     * @Route("/library/addSearch", options = { "expose" = true }, name="library_addSearch")
     * @Method({"POST"})
     */

    public function AddSearchAction(Request $request){
      $data = $this->decodeAjaxRequest($request);
      $querry = $request->request->get('querry');
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/books/v1/volumes?q='.$data);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json')); // Assuming you're requesting JSON
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      $response = curl_exec($ch);
      curl_close($ch);
      $data = json_decode($response);
      if (isset($data->items)) {
        $array = array_slice($data->items,0,4);
        foreach ($array as $key => $value) {
          if (isset($value->volumeInfo->imageLinks)) {
            $value->volumeInfo->imageLinks->thumbnail = str_replace('&edge=curl','',$value->volumeInfo->imageLinks->thumbnail);
            $value->volumeInfo->imageLinks->smallThumbnail = str_replace('&edge=curl','',$value->volumeInfo->imageLinks->smallThumbnail);
          }
          if (isset($value->volumeInfo->industryIdentifiers)){
            $exist = $this->doesBookExists($this->findIsbn($value->volumeInfo->industryIdentifiers));
            $value->volumeInfo->bookExist = $exist;
          }
        }
        return new JsonResponse($array);
      }
      else {
        $error_data = json_encode(array('error' => "Aucun résultat"), JSON_FORCE_OBJECT);
        return new JsonResponse($error_data);
      }
    }


    /**
     * @Route("/library/getOneBook", options = { "expose" = true }, name="library_getOneBook")
     * @Method({"POST"})
     */

    public function GetOneBook(Request $request) {
      $data = $this->decodeAjaxRequest($request);

      $book = $this->returnOneBookInfos($data);

      return new JsonResponse($book);
    }

    /**
     * @Route("/library/getFilterBooks", options = { "expose" = true }, name="library_getFilterBooks")
     * @Method({"POST"})
     */

    public function GetFilteredBooks(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $em = $this->getDoctrine()->getManager();

      $books = [];
      if ($this->getUser() != null){
        $UserConnected = true;
      }
      else{
        $UserConnected = false;
      }

      if (isset($data['categories'])) {
        $query = $em->createQuery("SELECT m as media, avg(n.note) as note, count(n.note) as nbrNotes,u.id as userId, u.username as username ". (($UserConnected)?",count(ub.id) as isInCollection":"")."
                           FROM AppBundle:Media m
                           INNER JOIN AppBundle:CategoryAffiliation mc
                           WITH mc.idCategory IN (".implode(",",array_keys($data['categories'])).")
                           AND mc.idMedia = m.idMedia
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
                           LEFT JOIN AppBundle:User u
                           WITH u.id = m.idUsers"
                           . (($UserConnected)?" LEFT JOIN AppBundle:UserBooks ub WITH ub.idUser = " .$this->getUser()->getId()."AND ub.isActive = 1 AND ub.idMedia = m.idMedia":"")."
                           WHERE m.valid = ".$data['active']."
                           AND m.isActive = 1 "
                           . ((strlen($data['search']) > 0)?"AND m.name LIKE '".$data['search']."%' ":"")."
                           GROUP by m.idMedia
                           ORDER BY ".$data['column']['value']." ".$data['tri']['value']);
        $query->setMaxResults(20)
        ->setFirstResult($data['limit']);
        $books = $query->getResult();
      }
      else{
        $query = $em->createQuery("SELECT m as media, avg(n.note) as note, count(n.note) as nbrNotes,u.id as userId, u.username as username ". (($UserConnected)?",count(ub.id) as isInCollection":"")."
                           FROM AppBundle:Media m
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
                           LEFT JOIN AppBundle:User u
                           WITH u.id = m.idUsers"
                           . (($UserConnected)?" LEFT JOIN AppBundle:UserBooks ub WITH ub.idUser = " .$this->getUser()->getId()."AND ub.isActive = 1 AND ub.idMedia = m.idMedia":"")."
                           WHERE m.valid = ".$data['active']."
                           AND m.isActive = 1 "
                           . ((strlen($data['search']) > 1)?"AND m.name LIKE '".$data['search']."%' ":"")."
                           GROUP by m.idMedia
                           ORDER BY ".$data['column']['value']." ".$data['tri']['value']);
        $query->setMaxResults(20)
        ->setFirstResult($data['limit']);
        $books = $query->getResult();
      }

      $books = $this->getSerializer()->normalize($books, 'null');
      if (isset($books[0]['media'])){
        foreach ($books as $key => $value) {
          $media = $value['media'];
          $media['username'] = $value['username'];
          $media['userId'] = $value['userId'];
          $media['note'] = $value['note'];
          $media['isInCollection'] = isset($value['isInCollection'])?$value['isInCollection']:null;
          $media['nbrNotes'] = $value['nbrNotes'];
          $media['idUsers'] = $value['media']['idUsers']['id'];
          $books[$key] = $media;
        }
        foreach ($books as $key => $value) {
          $books[$key]['categories'] = $this->returnCategoriesByBook($value['idMedia']);
        }
      }
      else{
        $books = [];
      }

      return new JsonResponse($books);
    }


    /**
     * @Route("/library/searchBaseBooks", options = { "expose" = true }, name="library_searchBooks")
     * @Method({"POST"})
     */

    public function SearchBooksAction(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $repository = $this->getDoctrine()->getManager()->getRepository('AppBundle:Media');
      $content = $repository->createQueryBuilder('m')
               ->where('m.name LIKE :name AND m.isActive = 1 AND m.valid = 1')
               ->setParameter('name', $data.'%')
               ->setMaxResults(4)
               ->getQuery();
      $results = $content->getArrayResult();
      if (sizeof($results) > 0) {
        return new JsonResponse($results);
      }
      else {
        $error_data = json_encode(array('error' => "Aucun résultat"), JSON_FORCE_OBJECT);
        return new JsonResponse($error_data);
      }
    }


    /**
     * @Route("/library/searchUsers", options = { "expose" = true }, name="library_searchUsers")
     * @Method({"POST"})
     */

    public function SearchUsersAction(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $em = $this->getDoctrine()->getManager();

      $query = $em->createQuery("SELECT u.username, u.id, u.pathImg
                         FROM AppBundle:User u
                         WHERE u.username LIKE :username
                         AND u.enabled = 1
                         AND u.isBlocked = 0")
      ->setParameter('username', $data.'%')
      ->setMaxResults(20);
      $results = $query->getResult();
      if (sizeof($results) > 0) {
        return new JsonResponse($results);
      }
      else {
        $error_data = json_encode(array('error' => "Aucun résultat"), JSON_FORCE_OBJECT);
        return new JsonResponse($error_data);
      }
    }


    /**
     * @Route("/library/getUserBooks", options = { "expose" = true }, name="getUserBooks")
     * @Method({"POST"})
     */

    public function getUserBooks(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $em = $this->getDoctrine()->getManager();

      $table = ["À prêter","Prêté","Je le veux","Je ne le veux plus","Je ne veux pas le prêter"];

      $query = $em->createQuery("SELECT m as media, avg(n.note) as note, count(n.note) as nbrNotes,u.id as userId, u.username as username, ub.userState as userState
                         FROM AppBundle:Media m
                         INNER JOIN AppBundle:UserBooks ub
                         WITH ub.idUser = ".$data."
                         AND ub.isActive = 1
                         AND ub.idMedia = m.idMedia
                         LEFT JOIN AppBundle:Note n
                         WITH m.idMedia = n.idMedia
                         LEFT JOIN AppBundle:User u
                         WITH u.id = m.idUsers
                         WHERE m.valid = 1
                         AND m.isActive = 1
                         GROUP by ub.idMedia");
      $query->setMaxResults(20)
      ->setFirstResult($data['limit']);
      $books = $query->getResult();

      $books = $this->getSerializer()->normalize($books, 'null');
      if (isset($books[0]['media'])){
        foreach ($books as $key => $value) {
          $media = $value['media'];
          $media['username'] = $value['username'];
          $media['userId'] = $value['userId'];
          $media['note'] = $value['note'];
          $media['userState'] = $table[$value['userState'] - 1];
          $media['nbrNotes'] = $value['nbrNotes'];
          $media['idUsers'] = $value['media']['idUsers']['id'];
          $books[$key] = $media;
        }
        foreach ($books as $key => $value) {
          $books[$key]['categories'] = $this->returnCategoriesByBook($value['idMedia']);
        }
      }
      else{
        $books = [];
      }

      return new JsonResponse($books);
    }



    /**
     * @Route("/library/getBooksUne", options = { "expose" = true }, name="library_booksUne")
     * @Method({"POST"})
     */

    public function getBooksUne(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $em = $this->getDoctrine()->getManager();

      $query = $em->createQuery("SELECT m as media, avg(n.note) as note, count(n.note) as nbrNotes,u.id as userId, u.username as username
                         FROM AppBundle:Media m
                         INNER JOIN AppBundle:hasOne h
                         WITH h.idMedia = m.idMedia
                         LEFT JOIN AppBundle:Note n
                         WITH m.idMedia = n.idMedia
                         LEFT JOIN AppBundle:User u
                         WITH u.id = m.idUsers
                         WHERE m.valid = 1
                         AND m.isActive = 1
                         GROUP by m.idMedia");
      $query->setMaxResults(20)
      ->setFirstResult($data['limit']);
      $books = $query->getResult();

      $books = $this->getSerializer()->normalize($books, 'null');
      if (isset($books[0]['media'])){
        foreach ($books as $key => $value) {
          $media = $value['media'];
          $media['username'] = $value['username'];
          $media['userId'] = $value['userId'];
          $media['note'] = $value['note'];
          $media['nbrNotes'] = $value['nbrNotes'];
          $media['idUsers'] = $value['media']['idUsers']['id'];
          $books[$key] = $media;
        }
        foreach ($books as $key => $value) {
          $books[$key]['categories'] = $this->returnCategoriesByBook($value['idMedia']);
        }
      }
      else{
        $books = [];
      }

      return new JsonResponse($books);
    }


    /**
     * @Route("/library/searchCategories", options = { "expose" = true }, name="library_searchCategories")
     * @Method({"POST"})
     */

    public function SearchCategoriesAction(Request $request) {
      $data = $this->decodeAjaxRequest($request);

      $repository = $this->getDoctrine()->getManager()->getRepository('AppBundle:Category');
      $content = $repository->createQueryBuilder('c')
               ->where('c.name LIKE :name')
               ->setParameter('name',$data.'%')
               ->setMaxResults(3)
               ->getQuery();
      $results = $content->getArrayResult();
      if (sizeof($results) > 0) {
        return new JsonResponse($results);
      }
      else {
        $error_data = json_encode(array('error' => "Aucun résultat"), JSON_FORCE_OBJECT);
        return new JsonResponse($error_data);
      }
    }

    /**
     * @Route("/library/GetCategories", options = { "expose" = true }, name="library_getCategories")
     * @Method({"POST"})
     */

    public function GetCategoriesAction(Request $request){
      $repository = $this->getDoctrine()->getManager()->getRepository('AppBundle:Category');
      $content = $repository->findBy(array(), array('name' => 'asc'));;
      $categories = $this->getSerializer()->serialize($content, 'json');

      return new JsonResponse($categories);
    }


}
