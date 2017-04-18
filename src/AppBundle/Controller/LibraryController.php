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

class LibraryController extends Controller
{
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
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/books/v1/volumes?q:hunger');
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json')); // Assuming you're requesting JSON
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      $response = curl_exec($ch);

      // If using JSON...
      $data = json_decode($response);
      return new JsonResponse($data);
    }
}
