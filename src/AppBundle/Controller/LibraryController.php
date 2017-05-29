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
     * @Route("/library/addCategories", options = { "expose" = true }, name="library_addCategories")
     * @Method({"POST"})
     */

    public function AddCategoriesAction(Request $request)
    {
      $data = json_decode($request->getContent(), true);

      return new JsonResponse($data);
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

    // public function actuAction(Request $request)
    // {
    //     $repository = $this->getDoctrine()
    //         ->getManager()
    //         ->getRepository('AppBundle:Category');
    //     $categories = $repository->findAll();
    //
    //     return new JsonResponse($categories);
    // }
}
