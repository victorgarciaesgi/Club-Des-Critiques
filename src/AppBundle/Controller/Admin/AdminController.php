<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Entity\ContactUS;
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
        // replace this example code with whatever you need
        return $this->render('private/index-admin.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }
}
