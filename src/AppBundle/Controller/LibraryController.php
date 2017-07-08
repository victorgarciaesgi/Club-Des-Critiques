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

    function returnAllBooks($column, $tri, $limit){
      $em = $this->getDoctrine()->getManager();
      $content = $this->getDoctrine()->getManager()->getRepository('AppBundle:Media')
      ->setMaxResults(15)
      ->setFirstResult($limit)
      ->findBy(array(), array($column => $tri));

      $books = $this->getSerializer()->normalize($content, 'null');
      return $books;
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

    function returnOneBookInfos($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT m as media, avg(n.note) as note
                           FROM AppBundle:Media m
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
                           WHERE m.idMedia = :idMedia
                           GROUP by m.idMedia"
      )->setParameter('idMedia',$idMedia)
      ->setMaxResults(1);
      $result = $query->getResult();
      $book = $this->getSerializer()->normalize($result, 'null');
      return $book[0];
    }

    function sortArray($object){
      return strcmp($a->name, $b->name);
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
      $data = json_decode($response);
      if (isset($data->items)) {
        $array = array_slice($data->items,0,4);
        foreach ($array as $key => $value) {
          if (isset($value->volumeInfo->imageLinks)) {
            $value->volumeInfo->imageLinks->thumbnail = str_replace('&edge=curl','',$value->volumeInfo->imageLinks->thumbnail);
            $value->volumeInfo->imageLinks->smallThumbnail = str_replace('&edge=curl','',$value->volumeInfo->imageLinks->smallThumbnail);
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
     * @Route("/library/getAllBooks", options = { "expose" = true }, name="library_getAllBooks")
     * @Method({"POST"})
     */

    public function GetAllBooks(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $listBooks = $this->returnAllBooks($data['column']['value'], $data['tri']['value']);

      foreach ($listBooks as $key => $value) {
        $listBooks[$key]['categories'] = $this->returnCategoriesByBook($value['idMedia']);
      }

      foreach ($listBooks as $key => $value) {
        $listBooks[$key]['note'] = $this->returnNoteByBook($value['idMedia']);
      }
      return new JsonResponse($listBooks);
    }

    /**
     * @Route("/library/getOneBook", options = { "expose" = true }, name="library_getOneBook")
     * @Method({"POST"})
     */

    public function GetOneBook(Request $request) {
      $data = $this->decodeAjaxRequest($request);

      $book = $this->returnOneBookInfos($data);

      $media = $book['media'];
      $media['note'] = $book['note'];

      $media['categories'] = $this->returnCategoriesByBook($media['idMedia']);

      return new JsonResponse($media);
    }

    /**
     * @Route("/library/getFilterBooks", options = { "expose" = true }, name="library_getFilterBooks")
     * @Method({"POST"})
     */

    public function GetFilteredBooks(Request $request) {
      $data = $this->decodeAjaxRequest($request);
      $em = $this->getDoctrine()->getManager();


      $books = [];
      if (isset($data['categories'])) {
        $query = $em->createQuery("SELECT m as media, avg(n.note) as note
                           FROM AppBundle:Media m
                           INNER JOIN AppBundle:CategoryAffiliation mc
                           WITH mc.idCategory IN (".implode(",",array_keys($data['categories'])).")
                           AND mc.idMedia = m.idMedia
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
                           GROUP by m.idMedia
                           ORDER BY ".$data['column']['value']." ".$data['tri']['value']);
        $query->setMaxResults(20)
        ->setFirstResult($data['limit']);
        $books = $query->getResult();
      }
      else{
        $query = $em->createQuery("SELECT m as media, avg(n.note) as note
                           FROM AppBundle:Media m
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
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
          $media['note'] = $value['note'];
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
               ->where('m.name LIKE :name')
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
