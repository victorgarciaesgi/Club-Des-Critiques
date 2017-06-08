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


class LibraryController extends Controller
{
    function __construct(){

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
      // return new JsonResponse($data);
      $querry = $request->request->get('querry');
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/books/v1/volumes?q='.$data['data']);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json')); // Assuming you're requesting JSON
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      $response = curl_exec($ch);
      $data = json_decode($response);
      if (isset($data->items)) {
        return new JsonResponse($data->items);
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
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      $serializer = new Serializer($normalizers, $encoders);
      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Media');
      $content = $repository->findAll();
      $books = $serializer->serialize($content, 'json');

      return new JsonResponse($books);
    }

    /**
     * @Route("/library/getOrderBooks", options = { "expose" = true }, name="library_getOrderBooks")
     * @Method({"POST"})
     */

    public function GetOrderBooks(Request $request)
    {
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      $serializer = new Serializer($normalizers, $encoders);

      $data = json_decode($request->getContent(), true);

      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Media');
      $content = $repository->findBy(array(), array($data['data']['value'] => 'asc'));
      $books = $serializer->serialize($content, 'json');

      return new JsonResponse($books);

    }

    /**
     * @Route("/library/getFilterBooks", options = { "expose" = true }, name="library_getFilterBooks")
     * @Method({"POST"})
     */

    public function GetFilterBooks(Request $request)
    {
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      $serializer = new Serializer($normalizers, $encoders);
      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Category');
      $content = $repository->findAll();
      $categories = $serializer->serialize($content, 'json');
      $data = json_decode($request->getContent(), true);
      return new JsonResponse($data);
    }


    /**
     * @Route("/library/searchCategories", options = { "expose" = true }, name="library_searchCategories")
     * @Method({"POST"})
     */

    public function SearchCategoriesAction(Request $request)
    {
      $data = json_decode($request->getContent(), true);
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      $serializer = new Serializer($normalizers, $encoders);

      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Category');
      $content = $repository->createQueryBuilder('c')
               ->where('c.name LIKE :name')
               ->setParameter('name', '%'.$data['data'].'%')
               ->setMaxResults(3)
               ->getQuery();
      $results = $content->getArrayResult();
      // $categories = $serializer->serialize($content, 'json');
      return new JsonResponse($results);
    }

    /**
     * @Route("/library/GetCategories", options = { "expose" = true }, name="library_getCategories")
     * @Method({"POST"})
     */

    public function GetCategoriesAction(Request $request){
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      $serializer = new Serializer($normalizers, $encoders);
      $repository = $this->getDoctrine()
          ->getManager()
          ->getRepository('AppBundle:Category');
      $content = $repository->findAll();
      $categories = $serializer->serialize($content, 'json');

      return new JsonResponse($categories);
    }


}
