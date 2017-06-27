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
use AppBundle\Repository\CategoryAffiliationRepository;

class MediaController extends Controller
{

    /**
     * @Route("/library/addBook", options = { "expose" = true }, name="library_addBook")
     * @Method({"POST"})
     */
    public function addBookAction(Request $request){

        $media = new Media();

        $data = json_decode($request->getContent(), true);

        $media->setName($data['search']);
        $media->setAuthor($data['author']);
        $media->setDescription($data['description']);
        $media->setNumberPage($data['pages']);
        $media->setImg($data['illustration']);
        $media->setNote($data['rating']);
        $media->setBuyLink($data['buyLink']);

        //verifie si un isbn 13 est présent, sinon verifie pour l'isbn 10
        //renvoi 0 si aucun des 2 n'est trouvé
        $isbn = $this->findIsbn($data['isbn']);
        $media->setIsbn($isbn);
        $media->setPrice($data['price']);

        //si l'isbn est à 0 le livre n'est pas validé
        $valid = $this->isValid($isbn);
        $media->setValid($valid);

        //formattage de la date
        $rawDate = $data['date'];
        $media->setReleaseDate(\DateTime::createFromFormat('Y-m-d\TH:i:s\.u\Z', $rawDate));
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
        $em->flush();
        $this->setCategories($media, $data['categories']);
        $em->clear();

        return new Response('Media bien créé');
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

    public function isValid($valueIsbn){
        if($valueIsbn!="0"){
            return 1;
        }else{
            return 0;
        }
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
        $em->flush();
        $em->clear();
    }
}