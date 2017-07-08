<?php
/**
 * Created by PhpStorm.
 * User: Cyriaque MALDAT
 * Date: 29/06/2017
 * Time: 08:40
 */

namespace AppBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use AppBundle\Entity\CustomPages;

class CustomPageController extends Controller
{

    /**
     * @Route("/cms/{permalink}/", name="cms_page")
     */
    public function showCustomPageAction(Request $request,$permalink)
    {
        // Récupération du contenu de l'actu
        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:CustomPages');

        $content = $repository->findOneBy(array('permalink' => $permalink));

        return $this->render('default/showCMS.html.twig',array(
            'permalink_actu' => $permalink,
            'content' => $content,
        ));

    }

}