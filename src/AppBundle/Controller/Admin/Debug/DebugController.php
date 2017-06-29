<?php

namespace AppBundle\Controller\Admin\Debug;

use AppBundle\Entity\ContactUS;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DebugController extends Controller
{
    /**
     * @Route("/debug/", name="homepage_admin_debug")
     */
    public function debugIndexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('private/debug/debug-index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }
}
