<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ContactUS;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

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
}
