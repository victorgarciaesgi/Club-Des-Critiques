<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * HistoryParticipant
 *
 * @ORM\Table(name="history_participant", indexes={@ORM\Index(name="id_chatroom", columns={"id_chatroom"}), @ORM\Index(name="id_user", columns={"id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\HistoryParticipantRepository")
 */
class HistoryParticipant
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
     * @var int
     * @ORM\ManyToOne(targetEntity="ChatRoom")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_chatRoom", referencedColumnName="id_chatRoom")
     * })
     */
    private $idChatRoom;

    /**
     * @var int
     *
     * @ORM\ManyToOne(targetEntity="User")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     */
    private $idUser;

    /**
     * @var bool
     *
     * @ORM\Column(name="archive", type="boolean")
     */
    private $archive;


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
     * Set idChatRoom
     *
     * @param integer $idChatRoom
     *
     * @return HistoryParticipant
     */
    public function setIdChatRoom($idChatRoom)
    {
        $this->idChatRoom = $idChatRoom;

        return $this;
    }

    /**
     * Get idChatRoom
     *
     * @return int
     */
    public function getIdChatRoom()
    {
        return $this->idChatRoom;
    }

    /**
     * Set idUser
     *
     * @param integer $idUser
     *
     * @return HistoryParticipant
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
     * Set archive
     *
     * @param boolean $archive
     *
     * @return HistoryParticipant
     */
    public function setArchive($archive)
    {
        $this->archive = $archive;

        return $this;
    }

    /**
     * Get archive
     *
     * @return bool
     */
    public function getArchive()
    {
        return $this->archive;
    }
}
