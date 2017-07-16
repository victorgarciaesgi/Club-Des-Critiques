<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MessagesPrivate
 *
 * @ORM\Table(name="messages_private")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MessagesPrivateRepository")
 * @ORM\HasLifecycleCallbacks()
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
     * @var integer
     *
     * @ORM\Column(name="id_User", type="integer")
     * })
     */
    private $idUser;

    /**
     * @var \User
     *
     * @ORM\OneToOne(targetEntity="User")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="senders", referencedColumnName="id",nullable=true)
     * })
     */
    private $senders;

    /**
     * @var string
     *
     * @ORM\Column(name="messages", type="text")
     */
    private $messages;

    /**
     * @var string
     *
     * @ORM\Column(name="subject", type="text",length=255)
     */
    private $subject;

    /**
     * @var string
     *
     * @ORM\Column(name="mail", type="text",length=255)
     */
    private $mail;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text",length=500)
     */
    private $name;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime")
     */
    private $dateCreated;

    /**
     * @return \User
     */
    public function getSenders()
    {
        return $this->senders;
    }

    /**
     * @param \User $senders
     */
    public function setSenders($senders)
    {
        $this->senders = $senders;
    }

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
     * @return string
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * @param string $subject
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    /**
     * @return string
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * @param string $mail
     */
    public function setMail($mail)
    {
        $this->mail = $mail;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @ORM\PrePersist
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = new \DateTime();

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
