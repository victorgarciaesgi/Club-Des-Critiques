<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ContactUS;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class BookController extends Controller
{
    /**
     * Controller pour l'ajout d'un livre
     *
     * @Route("/add-book/", name="add_book", options = { "expose" = true })
     */
    public function contactAction(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $data = $data['data'];
        /*
            {
            "search": "naruto",
            "categories": [
            {
              "label": "test"
            },
            {
              "label": "test"
            }
            ],
            "rating": 0,
            "author": "dazdazdzadzdazdz",
            "illustration": "dazdazdazdaz",
            "description": "adzadza",
            "pages": 160
            }
        */

        $currentDate = new \Datetime("now");
        $MessageContact = new ContactUS();
        $MessageContact->setName($data['name']);
        $MessageContact->setMail($data['mail']);
        $MessageContact->setMessage($data['message']);
        $MessageContact->setSubject($data['subject']);
        $MessageContact->setDateCreated($currentDate);
        $MessageContact->setStatus(0);// 0 non lu par l'admin
        $em = $this->getDoctrine()->getManager();
        $em->persist($MessageContact);
        $em->flush();

        return new Response('Envoi formulaire de contact OK');
    }

    /**
     * @Route("/get-book-info/{id_media}", name="get_info_media")
     */
    public function getBookInfoAction(Request $request,$id_media)
    {
        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);

        $getInfoMedia= $this->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:Media');
        $resultInfoMedia = $getInfoMedia->find($id_media);

        $json_result = $serializer->serialize($resultInfoMedia,"json");

        return $this->json($json_result);
    }


}
