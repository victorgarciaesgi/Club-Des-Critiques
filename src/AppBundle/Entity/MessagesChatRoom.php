<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MessagesChatRoom
 *
 * @ORM\Table(name="messages_chat_room",  indexes={@ORM\Index(name="id_user", columns={"id"})}, indexes={@ORM\Index(name="id_chatRoom", columns={"id_chatRoom"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MessagesChatRoomRepository")
 */
class MessagesChatRoom
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \Chatroom
     *
     * @ORM\ManyToOne(targetEntity="Chatroom")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_chatRoom", referencedColumnName="id_chatRoom")
     * })
     */
    private $idChatroom;

    /**
     * @var \User
     *
     * @ORM\ManyToOne(targetEntity="User")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     */
    private $idUser;

    /**
     * @var string
     *
     * @ORM\Column(name="message", type="string", length=255)
     */
    private $message;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="string", length=15)
     */
    private $dateCreated;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set idChatroom
     *
     * @param integer $idChatroom
     *
     * @return MessagesChatRoom
     */
    public function setIdChatroom($idChatroom)
    {
        $this->idChatroom = $idChatroom;

        return $this;
    }

    /**
     * Get idChatroom
     *
     * @return int
     */
    public function getIdChatroom()
    {
        return $this->idChatroom;
    }

    /**
     * Set idUser
     *
     * @param integer $idUser
     *
     * @return MessagesChatRoom
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return int
     */
    public function getIdUser()
    {
        return $this->idUser;
    }

    /**
     * Set messages
     *
     * @param string $message
     *
     * @return MessagesChatRoom
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get messages
     *
     * @return string
     */
    public function getMessages()
    {
        return $this->messages;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     *
     * @return MessagesChatRoom
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }
}
