<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ContactUS;
use AppBundle\Entity\MessagesPrivate;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;



class MessagePrivateController extends Controller
{
    function decodeAjaxRequest($request){
      $data = json_decode($request->getContent(), true);
      return $data['data'];
    }


    /**
     * @Route("/message/private/send",options = { "expose" = true }, name="send_message_private")
     * @Method({"POST"})
     */
    public function SendMessageAction(Request $request)
    {
        $data = $this->decodeAjaxRequest($request);

        $name = $data['name'];
        $mail = $data['mail'];
        $subject = $data['subject'];
        $message = $data['message'];
        $target_user = intval($data['target_user']);

        $em = $this->getDoctrine()->getManager();

        $MessagePrivate = new MessagesPrivate();
        $MessagePrivate->setName($name);
        $MessagePrivate->setSubject($subject);
        $MessagePrivate->setMessages($message);
        $MessagePrivate->setMail($mail);
        $MessagePrivate->setIdUser($target_user);

        $em->persist($MessagePrivate);

        $em->flush();

        $error_data = json_encode(array('success' => "Le message est bien envoyé"), JSON_FORCE_OBJECT);
        return new JsonResponse($error_data);;
    }
}
