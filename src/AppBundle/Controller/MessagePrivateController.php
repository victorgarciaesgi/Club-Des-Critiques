<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ContactUS;
use AppBundle\Entity\MessagesPrivate;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

class MessagePrivateController extends Controller
{
    /**
     * @Route("/message/private/send", name="send_message_private")
     */
    public function SendMessageAction(Request $request)
    {
        $name = $request->request->get('name');
        $mail = $request->request->get('mail');
        $subject = $request->request->get('subject');
        $message = $request->request->get('message');
        $target_user = intval($request->request->get('target_user'));

        $em = $this->getDoctrine()->getManager();

        $MessagePrivate = new MessagesPrivate();
        $MessagePrivate->setName($name);
        $MessagePrivate->setSubject($subject);
        $MessagePrivate->setMessages($message);
        $MessagePrivate->setMail($mail);
        $MessagePrivate->setIdUser($target_user);

        $em->persist($MessagePrivate);

        $em->flush();

        return $this->json(true);
    }
}
