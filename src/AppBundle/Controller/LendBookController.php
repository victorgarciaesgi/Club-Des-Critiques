<?php

namespace AppBundle\Controller;

use AppBundle\Entity\LendBook;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class LendBookController extends Controller
{
    /**
     * Controller pour l'ajout d'un livre
     *
     * @Route("/lend-book", name="add_book", options = { "expose" = true })
     */
    public function lendBookAction(Request $request)
    {
        $user_origin = intval($request->request->get('user_origin'));
        $media = intval($request->request->get('subject'));
        $user_target = intval($this->getUser()->getId());

        $em = $this->getDoctrine()->getManager();

        $LendBook = new LendBook();
        $LendBook->setUserOrigin($user_origin);
        $LendBook->setMedia($media);
        $LendBook->setUserTarget($user_target);
        $LendBook->setStatus(1);

        $em->persist($LendBook);

        $em->flush();

        return $this->json(true);

    }
}
