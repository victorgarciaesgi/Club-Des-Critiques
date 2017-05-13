<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ChatroomAccess : Table pour regrouper les personnes dans chaque room
 *
 * @ORM\Table(name="chatroom_access", indexes={@ORM\Index(name="id_chatroom", columns={"id_chatroom"}), @ORM\Index(name="id_user", columns={"id_user"})})
 * @ORM\Entity
 */
class ChatroomAccess
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_chatroom_access", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idChatroomAccess;

    /**
     * @var integer
     *
     * @ORM\Column(name="id_user", type="integer", nullable=false)
     */
    private $idUser;

    /**
     * Exclusion
     *
     * @var integer
     *
     * @ORM\Column(name="status", type="integer", nullable=false)
     */
    private $status;

    /**
     * @var \Chatroom
     *
     * @ORM\ManyToOne(targetEntity="Chatroom")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_chatroom", referencedColumnName="id_chatRoom")
     * })
     */
    private $idChatroom;

    /**
     * @var boolean
     *
     * @ORM\Column(name="connected", type="boolean", nullable=false)
     */
    private $isConnected;

}

