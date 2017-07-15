<?php
/**
 * Created by PhpStorm.
 * User: cyriaque_maldat
 * Date: 27/12/2016
 * Time: 11:20
 */
namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

use SocketIO\Emitter;

class ChatroomController extends Controller
{
    function __construct(){

    }

    /**
     * @Route("/chatroom", name="chatroom")
     */
    public function ChatRoomAction()
    {
        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        // Calling PHP Redis from global namespace
        $redis = new \Redis();

        // Connecting on localhost and port 6379
        $redis->connect('127.0.0.1', '6379');

        // Creating Emitter
        $emitter = new Emitter($redis);

        $rooms = $this->getDoctrine()
            ->getManager()
            ->getRepository('AppBundle:Chat');
        $resultHasOne = $rooms->findAll();


        $jsonContent = $serializer->serialize($resultHasOne, 'json');

        $emitter->emit('pushRooms', $jsonContent);

        return $this->render('default/chatroom.html.twig');
    }


}
