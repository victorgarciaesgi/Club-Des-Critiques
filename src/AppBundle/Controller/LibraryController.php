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



    /**
     * @Route("/library", name="library")
     */
    public function LibraryAction()
    {
        return $this->render('default/library.html.twig');
    }

    /**
     * @Route("/library/addSearch", options = { "expose" = true }, name="library_addSearch")
     * @Method({"POST"})
     */

    public function AddSearchAction(Request $request)
    {
      $data = json_decode($request->getContent(), true);
      $querry = $request->request->get('querry');
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/books/v1/volumes?q='.$data['data']);
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

    public function GetAllBooks()
    {
      $em = $this->getDoctrine()->getManager();
      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Media');
      $content = $repository->findAll();
      $books = $this->getSerializer()->normalize($content, 'null');

      foreach ($books as $key => $value) {
        $query = $em->createQuery("SELECT c
                                   FROM AppBundle:Media m, AppBundle:Category c, AppBundle:CategoryAffiliation mc
                                   WHERE m.idMedia = ".$value['idMedia']."
                                   AND mc.idMedia = m.idMedia
                                   AND mc.idCategory = c.idCategory");
        $result = $query->getResult();
        array_push($books[$key], ['categories', []]);
        $books[$key]['categories'] = json_decode($this->getSerializer()->serialize($result, 'json'));
      }
      return new JsonResponse($books);
    }

    /**
     * @Route("/library/getOneBook", options = { "expose" = true }, name="library_getOneBook")
     * @Method({"POST"})
     */

    public function GetOneBook(Request $request)
    {
      $data = json_decode($request->getContent(), true);

      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Media');
      $content = $repository->find($data['data']);
      $book = $this->getSerializer()->serialize($content, 'json');

      return new JsonResponse($book);
    }

    /**
     * @Route("/library/getOrderBooks", options = { "expose" = true }, name="library_getOrderBooks")
     * @Method({"POST"})
     */

    public function GetOrderBooks(Request $request)
    {

      $data = json_decode($request->getContent(), true);

      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Media');
      $content = $repository->findBy(array(), array($data['data']['key']['value'] => $data['data']['tri']['value']));
      $books = $this->getSerializer()->serialize($content, 'json');

      return new JsonResponse($books);

    }

    /**
     * @Route("/library/getFilterBooks", options = { "expose" = true }, name="library_getFilterBooks")
     * @Method({"POST"})
     */

    public function GetFilterBooks(Request $request)
    {
      $data = json_decode($request->getContent(), true);
      $em = $this->getDoctrine()->getManager();

      $books = [];

      foreach ($data as $categ){
        foreach ($categ as $key => $value) {
          $query = $em->createQuery("SELECT m
                                     FROM AppBundle:Media m, AppBundle:Category c, AppBundle:CategoryAffiliation mc
                                     WHERE m.idMedia = mc.idMedia
                                     AND mc.idCategory = ".$key."
                                     GROUP by m.idMedia");
          $result = $query->getResult();
          foreach ($result as $book) {
            array_push($books, $book);
          }
        }
      }
      $books = $this->getSerializer()->normalize($books, 'null');
      foreach ($books as $key => $value) {
        $query = $em->createQuery("SELECT c
                                   FROM AppBundle:Media m, AppBundle:Category c, AppBundle:CategoryAffiliation mc
                                   WHERE m.idMedia = ".$value['idMedia']."
                                   AND mc.idMedia = m.idMedia
                                   AND mc.idCategory = c.idCategory");
        $result = $query->getResult();
        array_push($books[$key], ['categories', []]);
        $books[$key]['categories'] = json_decode($this->getSerializer()->serialize($result, 'json'));
      }
      return new JsonResponse($books);
    }


    /**
     * @Route("/library/searchCategories", options = { "expose" = true }, name="library_searchCategories")
     * @Method({"POST"})
     */

    public function SearchCategoriesAction(Request $request)
    {
      $data = json_decode($request->getContent(), true);

      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Category');
      $content = $repository->createQueryBuilder('c')
               ->where('c.name LIKE :name')
               ->setParameter('name', '%'.$data['data'].'%')
               ->setMaxResults(3)
               ->getQuery();
      $results = $content->getArrayResult();
      return new JsonResponse($results);
    }

    /**
     * @Route("/library/GetCategories", options = { "expose" = true }, name="library_getCategories")
     * @Method({"POST"})
     */

    public function GetCategoriesAction(Request $request){
      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Category');
      $content = $repository->findAll();
      $categories = $this->getSerializer()->serialize($content, 'json');

      return new JsonResponse($categories);
    }


}
