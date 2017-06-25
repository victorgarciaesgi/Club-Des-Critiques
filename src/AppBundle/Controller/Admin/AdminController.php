<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Entity\ContactUS;
use AppBundle\Form\WebsiteType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AdminController extends Controller
{
    /**
     * @Route("/admin/", name="homepage_admin")
     */
    public function adminAction(Request $request)
    {

        // Le Concept
        $em = $this->getDoctrine()->getManager();
        $param = $em->getRepository('AppBundle:Website')->find(1);
        $form = $this->get('form.factory')->create(WebsiteType::class, $param);

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($param);
                $em->flush();
                $request->getSession()->getFlashBag()->add('notice', 'Mise à jour du contexte réussi.');
                return $this->redirectToRoute('homepage_admin');
            }
        }

        // A la Une

        $hasOneRepo = $this->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:hasOne');
        $resultHasOne = $hasOneRepo->findAll();

        // replace this example code with whatever you need
        return $this->render('private/index-admin.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'form' => $form->createView(),
            'has_one_list' => $resultHasOne,
        ]);
    }
}
