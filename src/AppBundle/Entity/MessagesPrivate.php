<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MessagesPrivate
 *
 * @ORM\Table(name="messages_private", indexes={@ORM\Index(name="id_user", columns={"id"})}, indexes={@ORM\Index(name="id_private_chat", columns={"id_private_chat"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MessagesPrivateRepository")
 */
class MessagesPrivate
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
     * @var \PrivateChat
     *
     * @ORM\ManyToOne(targetEntity="PrivateChat")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_private_chat", referencedColumnName="id")
     * })
     */
    private $idPrivateChat;

    /**
     * @var string
     *
     * @ORM\Column(name="messages", type="string", length=500)
     */
    private $messages;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="date")
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
     * Set idUser
     *
     * @param integer $idUser
     *
     * @return MessagesPrivate
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
     * Set idPrivateMessage
     *
     * @param integer $idPrivateMessage
     *
     * @return MessagesPrivate
     */
    public function setIdPrivateMessage($idPrivateMessage)
    {
        $this->idPrivateMessage = $idPrivateMessage;

        return $this;
    }

    /**
     * Get idPrivateMessage
     *
     * @return int
     */
    public function getIdPrivateMessage()
    {
        return $this->idPrivateMessage;
    }

    /**
     * Set messages
     *
     * @param string $messages
     *
     * @return MessagesPrivate
     */
    public function setMessages($messages)
    {
        $this->messages = $messages;

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
     * @return MessagesPrivate
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

    /**
     * Set idPrivateChat
     *
     * @param \AppBundle\Entity\PrivateChat $idPrivateChat
     *
     * @return MessagesPrivate
     */
    public function setIdPrivateChat(\AppBundle\Entity\PrivateChat $idPrivateChat = null)
    {
        $this->idPrivateChat = $idPrivateChat;

        return $this;
    }

    /**
     * Get idPrivateChat
     *
     * @return \AppBundle\Entity\PrivateChat
     */
    public function getIdPrivateChat()
    {
        return $this->idPrivateChat;
    }
}
