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


    /**
     * Get idChatroomAccess
     *
     * @return integer
     */
    public function getIdChatroomAccess()
    {
        return $this->idChatroomAccess;
    }

    /**
     * Set idUser
     *
     * @param integer $idUser
     *
     * @return ChatroomAccess
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return integer
     */
    public function getIdUser()
    {
        return $this->idUser;
    }

    /**
     * Set status
     *
     * @param integer $status
     *
     * @return ChatroomAccess
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set isConnected
     *
     * @param boolean $isConnected
     *
     * @return ChatroomAccess
     */
    public function setIsConnected($isConnected)
    {
        $this->isConnected = $isConnected;

        return $this;
    }

    /**
     * Get isConnected
     *
     * @return boolean
     */
    public function getIsConnected()
    {
        return $this->isConnected;
    }

    /**
     * Set idChatroom
     *
     * @param \AppBundle\Entity\Chatroom $idChatroom
     *
     * @return ChatroomAccess
     */
    public function setIdChatroom(\AppBundle\Entity\Chatroom $idChatroom = null)
    {
        $this->idChatroom = $idChatroom;

        return $this;
    }

    /**
     * Get idChatroom
     *
     * @return \AppBundle\Entity\Chatroom
     */
    public function getIdChatroom()
    {
        return $this->idChatroom;
    }
}
