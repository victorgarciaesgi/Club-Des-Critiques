<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\DependencyInjection\Tests\Compiler\C;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Validator\Constraints\DateTime;

use AppBundle\Entity\Note;

class NoteController extends Controller
{

    function decodeAjaxRequest($request){
        $data = json_decode($request->getContent(), true);
        return $data['data'];
    }

    /**
     * @Route("/note/add", options = { "expose" = true }, name="addNote")
     * @Method({"POST"})
     */
    public function addNoteAction(Request $request){

        $note = new Note();

        $data = $this->decodeAjaxRequest($request);

        $em = $this->getDoctrine()->getManager();
        $findMedia = $em->getRepository('AppBundle:Media')->findOneBy(array('idMedia' => $data['idMedia']));
        $note->setIdMedia($findMedia);
        $note->setIdUsers($this->getUser());
        $note->setNote($data['note']);

        $em->persist($note);
        $em->flush();
        $em->clear();

        $success = json_encode(array('success' => "Merci d'avoir noté ce livre"), JSON_FORCE_OBJECT);
        return new JsonResponse($success);
    }

}