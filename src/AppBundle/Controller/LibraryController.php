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

class LibraryController extends Controller
{
    /**
     * @Route("/library", name="library")
     */
    public function LibraryAction()
    {
        return $this->render('default/library.html.twig');
    }
}