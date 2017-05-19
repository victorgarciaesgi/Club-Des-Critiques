<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * chatroom_alert : Table qui prend tout les avertissement pour chaque utilisateur en fonction du chatroom auxquels il participe
 *
 * @ORM\Table(name="chatroom_alert",indexes={@ORM\Index(name="id_user", columns={"id"}), @ORM\Index(name="id_chatRoom", columns={"id_chatRoom"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\chatroom_alertRepository")
 */
class chatroom_alert
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
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     */
    private $idUser;

    /**
     * @var int
     *
     * @ORM\ManyToOne(targetEntity="chatroom")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_chatRoom", referencedColumnName="id_chatRoom")
     * })
     */
    private $idChatroom;

    /**
     * @var int
     *
     * @ORM\Column(name="nb", type="integer", nullable=true)
     */
    private $nb;


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
     * @return chatroom_alert
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
     * Set nb
     *
     * @param integer $nb
     *
     * @return chatroom_alert
     */
    public function setNb($nb)
    {
        $this->nb = $nb;

        return $this;
    }

    /**
     * Get nb
     *
     * @return int
     */
    public function getNb()
    {
        return $this->nb;
    }

    /**
     * Set idChatroom
     *
     * @param \AppBundle\Entity\chatroom $idChatroom
     *
     * @return chatroom_alert
     */
    public function setIdChatroom(\AppBundle\Entity\chatroom $idChatroom = null)
    {
        $this->idChatroom = $idChatroom;

        return $this;
    }

    /**
     * Get idChatroom
     *
     * @return \AppBundle\Entity\chatroom
     */
    public function getIdChatroom()
    {
        return $this->idChatroom;
    }
}
