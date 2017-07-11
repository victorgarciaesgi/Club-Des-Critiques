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

    function getSerializer(){
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      return new Serializer($normalizers, $encoders);
    }

    function returnOneBookInfos($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT m as media, avg(n.note) as note, count(n.note) as nbrNotes, u.username as username
                           FROM AppBundle:Media m
                           LEFT JOIN AppBundle:Note n
                           WITH m.idMedia = n.idMedia
                           LEFT JOIN AppBundle:User u
                           WITH u.id = m.idUsers
                           WHERE m.idMedia = :idMedia
                           GROUP by m.idMedia"
      )->setParameter('idMedia',$idMedia)
      ->setMaxResults(1);
      $result = $query->getResult();
      $book = $this->getSerializer()->normalize($result, 'null');
      $book = $book[0];
      $media = $book['media'];
      $media['username'] = $book['username'];
      $media['note'] = $book['note'];
      $media['nbrNotes'] = $book['nbrNotes'];
      $media['categories'] = $this->returnCategoriesByBook($media['idMedia']);
      return $media;
    }
    
    function returnCategoriesByBook($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT c
                                 FROM AppBundle:Media m, AppBundle:Category c, AppBundle:CategoryAffiliation mc
                                 WHERE m.idMedia = :idMedia
                                 AND mc.idMedia = m.idMedia
                                 AND mc.idCategory = c.idCategory"
      )->setParameter('idMedia',$idMedia);
      $result = $query->getResult();
      return json_decode($this->getSerializer()->serialize($result, 'json'));
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
        $newMedia = $this->returnOneBookInfos($data['idMedia']);
        $success = json_encode(array('success' => "Votre note a été rajoutée", 'media' => $newMedia), JSON_FORCE_OBJECT);
        return new JsonResponse($success);
    }

}
