<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Chatroom
 *
 * @ORM\Table(name="chatroom", indexes={@ORM\Index(name="id_book", columns={"id_media"}), @ORM\Index(name="created_by", columns={"created_by"})})
 * @ORM\Entity
 */
class Chatroom
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_chatRoom", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idChatroom;

    /**
     * Pour le nom de la personne qui à créer le Salons (default : admin)
     *
     * @var \User
     *
     * @ORM\ManyToOne(targetEntity="User")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="created_by", referencedColumnName="id")
     * })
     */
    private $createdBy;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", nullable=false)
     */
    private $name;

    /**
     * Numéro du room , utilisé pour différencié les room avec plus de 20 personnes pour la répartition
     * @var integer
     *
     * @ORM\Column(name="number_room", type="integer", nullable=false)
     */
    private $number_room;

    /**
     * Description du salon
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=false)
     */
    private $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="string", length=15)
     */
    private $dateCreated;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_updated", type="string", length=15)
     */
    private $dateUpdate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_closed", type="string", length=15, nullable=true)
     */
    private $dateClosed;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_start", type="string", length=15)
     */
    private $dateStart;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_end", type="string", length=15)
     */
    private $dateEnd;

    /**
     * @var \Media
     *
     * @ORM\ManyToOne(targetEntity="Media")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_media", referencedColumnName="id_media")
     * })
     */
    private $idMedia;

    /**
     * @var integer
     *
     * @ORM\Column(name="is_valid", type="integer", nullable=false)
     */
    private $is_valid;

    /**
     * Status : Terminé/en cours / Fermé /blocked
     * @var integer
     *
     * @ORM\Column(name="status", type="integer", nullable=false)
     */
    private $status;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_active", type="boolean", nullable=false)
     */
    private $is_active;


    /**
     * Get idChatroom
     *
     * @return integer
     */
    public function getIdChatroom()
    {
        return $this->idChatroom;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Chatroom
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set numberRoom
     *
     * @param integer $numberRoom
     *
     * @return Chatroom
     */
    public function setNumberRoom($numberRoom)
    {
        $this->number_room = $numberRoom;

        return $this;
    }

    /**
     * Get numberRoom
     *
     * @return integer
     */
    public function getNumberRoom()
    {
        return $this->number_room;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Chatroom
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     *
     * @return Chatroom
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
     * Set dateUpdate
     *
     * @param \DateTime $dateUpdate
     *
     * @return Chatroom
     */
    public function setDateUpdate($dateUpdate)
    {
        $this->dateUpdate = $dateUpdate;

        return $this;
    }

    /**
     * Get dateUpdate
     *
     * @return \DateTime
     */
    public function getDateUpdate()
    {
        return $this->dateUpdate;
    }

    /**
     * Set dateClosed
     *
     * @param \DateTime $dateClosed
     *
     * @return Chatroom
     */
    public function setDateClosed($dateClosed)
    {
        $this->dateClosed = $dateClosed;

        return $this;
    }

    /**
     * Get dateClosed
     *
     * @return \DateTime
     */
    public function getDateClosed()
    {
        return $this->dateClosed;
    }

    /**
     * Set dateStart
     *
     * @param \DateTime $dateStart
     *
     * @return Chatroom
     */
    public function setDateStart($dateStart)
    {
        $this->dateStart = $dateStart;

        return $this;
    }

    /**
     * Get dateStart
     *
     * @return \DateTime
     */
    public function getDateStart()
    {
        return $this->dateStart;
    }

    /**
     * Set dateEnd
     *
     * @param \DateTime $dateEnd
     *
     * @return Chatroom
     */
    public function setDateEnd($dateEnd)
    {
        $this->dateEnd = $dateEnd;

        return $this;
    }

    /**
     * Get dateEnd
     *
     * @return \DateTime
     */
    public function getDateEnd()
    {
        return $this->dateEnd;
    }

    /**
     * Set note
     *
     * @param integer $note
     *
     * @return Chatroom
     */
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
    }

    /**
     * Get note
     *
     * @return integer
     */
    public function getNote()
    {
        return $this->note;
    }

    /**
     * Set status
     *
     * @param integer $status
     *
     * @return Chatroom
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
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return Chatroom
     */
    public function setIsActive($isActive)
    {
        $this->is_active = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
     */
    public function getIsActive()
    {
        return $this->is_active;
    }

    /**
     * Set createdBy
     *
     * @param \AppBundle\Entity\User $createdBy
     *
     * @return Chatroom
     */
    public function setCreatedBy(\AppBundle\Entity\User $createdBy = null)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return \AppBundle\Entity\User
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set idMedia
     *
     * @param \AppBundle\Entity\Media $idMedia
     *
     * @return Chatroom
     */
    public function setIdMedia(\AppBundle\Entity\Media $idMedia = null)
    {
        $this->idMedia = $idMedia;

        return $this;
    }

    /**
     * Get idMedia
     *
     * @return \AppBundle\Entity\Media
     */
    public function getIdMedia()
    {
        return $this->idMedia;
    }
}
