<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ContactUS;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $contextRepo = $this->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:Website');
        $resultContext = $contextRepo->find(1);

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'context' => $resultContext
        ]);
    }

    /**
     * Route pour le formulaire de contact
     *
     * @Route("/contact", name="contact", options = { "expose" = true })
     */
    public function contactAction(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $data = $data['data'];
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
     * Route pour le formulaire de contact
     *
     * @Route("/login-ajax/", name="login_ajax", options = { "expose" = true })
     */
    public function loginAction(Request $request)
    {
        return $this->render('default/login_content.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }
}
