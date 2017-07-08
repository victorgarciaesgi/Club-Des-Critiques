<?php

namespace AppBundle\Controller;

use AppBundle\Entity\CategoryAffiliation;
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

use AppBundle\Entity\Media;
use AppBundle\Entity\Category;
use AppBundle\Entity\Note;
use AppBundle\Repository\CategoryAffiliationRepository;

class MediaController extends Controller
{

    function decodeAjaxRequest($request){
      $data = json_decode($request->getContent(), true);
      return $data['data'];
    }

    /**
     * @Route("/library/addBook", options = { "expose" = true }, name="library_addBook")
     * @Method({"POST"})
     */
    public function addBookAction(Request $request){

        $media = new Media();

        $data = $this->decodeAjaxRequest($request);

        $media->setName($data['search']);
        $media->setAuthor($data['author']);
        $media->setDescription($data['description']);
        $media->setNumberPage($data['pages']);
        $media->setImg($data['illustration']);

        if(!empty($data['buyLink']))
            $media->setBuyLink($data['buyLink']);

        //verifie si un isbn 13 est présent, sinon verifie pour l'isbn 10
        //renvoi 0 si aucun des 2 n'est trouvé
        if(!empty($data['isbn']))
            $isbn = $this->findIsbn($data['isbn']);
        else
            $isbn = "0";

        $media->setIsbn($isbn);
        if(!empty($data['price']))
            $media->setPrice($data['price']);

        $media->setValid(0);

        //formattage de la date
        $rawDate = $data['date'];
        $media->setReleaseDate(\DateTime::createFromFormat('Y-m-d\TH:i:s\.u\Z', $rawDate));
        $media->setIdUsers($this->getUser());
        $media->setIsActive(1);

        $validator = $this->get('validator');
        $errors = $validator->validate($media);

        if (count($errors) > 0) {
            /*
             * Uses a __toString method on the $errors variable which is a
             * ConstraintViolationList object. This gives us a nice string
             * for debugging.
             */
            $errorsString = (string) $errors;

            return new Response($errorsString);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($media);
        $this->setCategories($media, $data['categories']);
        $em->flush();
        $this->setNote($media, $data['rating']);
        $em->flush();
        $em->clear();

        $success = json_encode(array('success' => $media->getName() . " a bien été ajouté à la librairie"), JSON_FORCE_OBJECT);
        return new JsonResponse($success);
    }

    public function findIsbn($array){
        foreach ($array as $value){
           if($value['type']==="ISBN_10")
                $isbn10 = $value['identifier'];
           if($value['type']==="ISBN_13")
                return $value['identifier'];
        }
        if(!empty($isbn10))
            return $isbn10;

        return "0";
    }

    public function setCategories($media ,$array){

        $em = $this->getDoctrine()->getManager();

        foreach ($array as $value){
            $category = new CategoryAffiliation();
            $category->setIdMedia($media);
            $findCategory = $em->getRepository('AppBundle:Category')->findOneBy(array('idCategory' => $value['idCategory']));
            $category->setIdCategory($findCategory);
            $em->persist($category);
        }
    }

    public function setNote($media, $note){
        $em = $this->getDoctrine()->getManager();

        $noteObject = new Note();
        $noteObject->setIdMedia($media);
        $noteObject->setIdUsers($this->getUser());
        $noteObject->setNote($note);

        $em->persist($noteObject);
    }
}
