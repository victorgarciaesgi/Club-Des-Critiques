<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Doctrine\ORM\EntityManagerInterface;

use AppBundle\Entity\UserBooks;


class UserController extends Controller
{

    function getSerializer(){
      $encoders = array(new XmlEncoder(), new JsonEncoder());
      $normalizers = array(new ObjectNormalizer());
      return new Serializer($normalizers, $encoders);
    }

    function decodeAjaxRequest($request){
      $data = json_decode($request->getContent(), true);
      return $data['data'];
    }

    function doesBookExistsInCollection($idMedia){
      $em = $this->getDoctrine()->getManager();
      $query = $em->createQuery("SELECT ub
                           FROM AppBundle:UserBooks ub
                           WHERE ub.idMedia = ".$idMedia."
                           AND ub.idUser =".$this->getUser()->getId()
      )->setMaxResults(1);
      $result = $query->getResult();
      return $result;
    }


    /**
     * @Route("/library/addCollection", options = { "expose" = true }, name="library_addCollection")
     * @Method({"POST"})
     */


    public function addBookCollection(Request $request){

      $data = $this->decodeAjaxRequest($request);

      $exists = $this->doesBookExistsInCollection($data['idMedia']);
      $decode = $this->getSerializer()->normalize($exists, 'null');
      $em = $this->getDoctrine()->getManager();

      if (sizeof($decode) > 0){
        $userbook = $exists{0};
        $userbook->setIsActive(1);
      }
      else{
        $userbook = new UserBooks();
        $userbook->setIdUser($this->getUser());
        $findMedia = $em->getRepository('AppBundle:Media')->findOneBy(array('idMedia' => $data['idMedia']));
        $userbook->setIdMedia($findMedia);
        $userbook->setIsActive(1);
      }
      $em->persist($userbook);
      $em->flush();
      $em->clear();

      $success = json_encode(array('success' => "Le livre a bien été rajouté à votre collection"), JSON_FORCE_OBJECT);
      return new JsonResponse($success);
    }


    /**
     * @Route("/library/removeCollection", options = { "expose" = true }, name="library_removeCollection")
     * @Method({"POST"})
     */


    public function removeBookCollection(Request $request){

      $data = $this->decodeAjaxRequest($request);

      $exists = $this->doesBookExistsInCollection($data['idMedia']);
      $decode = $this->getSerializer()->normalize($exists, 'null');
      $em = $this->getDoctrine()->getManager();

      if (sizeof($decode) > 0){
        $userbook = $exists{0};
        $userbook->setIsActive(0);
        $em->persist($userbook);
        $em->flush();
        $em->clear();
      }



      $success = json_encode(array('success' => "Le livre a bien été retiré de votre collection"), JSON_FORCE_OBJECT);
      return new JsonResponse($success);
    }




}
