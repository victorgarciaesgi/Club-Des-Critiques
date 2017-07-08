<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Entity\CMS;
use AppBundle\Entity\ContactUS;

use AppBundle\Entity\CustomPages;
use AppBundle\Form\CMSType;
use AppBundle\Form\CustomPagesType;
use AppBundle\Form\WebsiteType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

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

        //

        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:CustomPages');

        $listCMS = $repository->findAll();

        // PAGES CMS
        $cms = new CustomPages();
        $form_cms = $this->get('form.factory')->create(CustomPagesType::class, $cms);

        if ($request->isMethod('POST')){
            $form_cms->handleRequest($request);
            if ($form_cms->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($cms);
                $em->flush();
                $request->getSession()->getFlashBag()->add('notice', 'Page CMS bien enregistrée.');
                return $this->redirectToRoute('homepage_admin');
            }
        }

        //Listes des salons
        $hasOneRepo = $this->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:Chatroom');
        $resultChatRoom = $hasOneRepo->findAll();

        // replace this example code with whatever you need
        return $this->render('private/index-admin.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'form' => $form->createView(),
            'has_one_list' => $resultHasOne,
            'list_cms' => $listCMS,
            'cms_form' => $form_cms->createView(),
            'list_chatroom' => $resultChatRoom,
        ]);
    }


    /**
     * @Route("/admin/form/context-update/",name="update_context")
     */
    public function updateContextAction(Request $request){
        $em = $this->getDoctrine()->getManager();
        $param = $em->getRepository('AppBundle:Website')->find(1);
        $form_context = $this->get('form.factory')->create(WebsiteType::class, $param);

        if ($request->isMethod('POST')) {
            $form_context->handleRequest($request);
            if ($form_context->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($param);
                $em->flush();
                $request->getSession()->getFlashBag()->add('notice', 'Mise à jour du contexte réussi.');
                return $this->redirectToRoute('homepage_admin');
            }
        }
        return $this->render('private/form/update-context.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'form' => $form_context->createView(),
        ]);
    }

    /**
     * @Route("/admin/show-salons/",name="show_cms")
     */
    public function showCMSAction(){
        $hasOneRepo = $this->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:Chatroom');
        $resultChatRoom = $hasOneRepo->findAll();
    }

    /**
     * @Route("/admin/show-cms/", name="cms_admin_area")
     */
    public function cmsAction(Request $request)
    {

        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);

        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:CustomPages');

        $listAdverts = $repository->findAll();

        $jsonContent = $serializer->serialize($listAdverts, 'json');

        return $this->json($jsonContent);
    }


    /**
     * @Route("/admin/hasone/delete/{id_has_one}/", name="delete_hasone")
     */
    public function deleteHasOneAction(Request $request, $id_has_one)
    {
        $em = $this->getDoctrine()->getManager();
        $hasone = $em->getRepository('AppBundle:hasOne')->find($id_has_one);
        $em->remove($hasone);
        $em->flush();
        return $this->redirectToRoute('homepage_admin');
    }

    /**
     * @Route("/admin/delete-cms/{id_cms}/", name="delete_cms")
     */
    public function deleteCMSAction(Request $request, $id_cms)
    {
        $em = $this->getDoctrine()->getManager();
        $customPage = $em->getRepository('AppBundle:CustomPages')->find($id_cms);
        $em->remove($customPage);
        $em->flush();
        return $this->redirectToRoute('homepage_admin');
    }

    /**
     * @Route("/admin/delete-room/{id_room}/", name="delete_room")
     */
    public function deleteRoomAction(Request $request, $id_room)
    {
        $em = $this->getDoctrine()->getManager();
        $customPage = $em->getRepository('AppBundle:Chatroom')->find($id_room);
        $em->remove($customPage);
        $em->flush();
        return $this->redirectToRoute('homepage_admin');
    }
}
