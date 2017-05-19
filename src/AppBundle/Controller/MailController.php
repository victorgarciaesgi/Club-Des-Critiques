<?php

namespace AppBundle\Controller;

use AppBundle\Entity\RegisterMail;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class MailController extends Controller
{
    /**
     * @Route("/mail_register",name="mail_register", options = { "expose" = true })
     */
    public function SendRegisterMailAction(Request $request)
    {
        $data = json_decode($request->getContent(), true);


        $currentDate = new \Datetime("now");
        $timestamp = $currentDate->getTimestamp();

        $uniqueLink = hash('sha256',$data['data']['mail'].$timestamp);

        $RegisterMail = new RegisterMail();
        $RegisterMail->setMail($data['data']['mail']);
        $RegisterMail->setDateCreated($currentDate);
        $RegisterMail->setStatus(0);
        $RegisterMail->setAccessPermalink($uniqueLink);
        $em = $this->getDoctrine()->getManager();

        $em->persist($RegisterMail);
        $em->flush();

        // Envoie du mail pour l'inscription

        $message = \Swift_Message::newInstance()
            ->setSubject('Hello Email Symfony 3')
            ->setFrom('clu_critique@gmail.com') // Changer de mail
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
        $this->get('mailer')->send($message);

        return new Response('Un mail vous à été envoyé');
    }
}
