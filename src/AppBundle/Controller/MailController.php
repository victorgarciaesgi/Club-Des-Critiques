<?php

namespace AppBundle\Controller;

use AppBundle\Entity\RegisterMail;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class MailController extends Controller
{
    /**
     * @Route("/mail_register",name="mail_register", options = { "expose" = true })
     */
    public function SendRegisterMailAction(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        dump($data);

        $currentDate = new \Datetime("now");
        $timestamp = $currentDate->getTimestamp();

        $uniqueLink = hash('sha256',$data['data']['mail'].$timestamp);

        $RegisterMail = new RegisterMail();
        $RegisterMail->setMail($data['data']['mail']);
        $RegisterMail->setDateCreated($currentDate);
        $RegisterMail->setStatus(0);
        $RegisterMail->setAccessPermalink($uniqueLink);
        $em = $this->getDoctrine()->getManager();

        $uniqueMail = $em->persist($RegisterMail);
        $em->flush();

        if(!$uniqueMail){
            $error = json_encode(array('error' => "Mail déja existant"), JSON_FORCE_OBJECT);
            return new JsonResponse($error);
        }

        // Envoie du mail pour l'inscription

        $message = \Swift_Message::newInstance()
            ->setSubject('Hello Email Symfony 3')
            ->setFrom('club_critique@gmail.com') // Changer de mail
            ->setTo($data['data']['mail'])
            ->setBody(
                $this->renderView(
                    'Emails/registration.html.twig',
                    array(
                        'name' => 'Mail de test',
                        'unique_link' => $uniqueLink
                    )
                ),
                'text/html'
            );
        $status = $this->get('mailer')->send($message);

        if($status){
            $success = json_encode(array('success' => "Un mail vous à été envoyé. Cliquez sur le lien envoyé dans votre boite mail."), JSON_FORCE_OBJECT);
            return new JsonResponse($success);
        }
        else{
            $error = json_encode(array('error' => "Une erreur est survenu lors de l'envoie du mail"), JSON_FORCE_OBJECT);
            return new JsonResponse($error);
        }
    }
}
