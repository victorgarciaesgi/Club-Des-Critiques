<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PrivateChat : En Face To Face entre deux personnes seulement
 *
 * @ORM\Table(name="private_chat")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PrivateChatRepository")
 */
class PrivateChat
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
     * @ORM\Column(name="id_user1", type="integer")
     */
    private $idUser1;

    /**
     * @var int
     *
     * @ORM\Column(name="id_user2", type="integer")
     */
    private $idUser2;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_update", type="datetime")
     */
    private $dateUpdate;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;


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
     * Set idUser1
     *
     * @param integer $idUser1
     *
     * @return PrivateChat
     */
    public function setIdUser1($idUser1)
    {
        $this->idUser1 = $idUser1;

        return $this;
    }

    /**
     * Get idUser1
     *
     * @return int
     */
    public function getIdUser1()
    {
        return $this->idUser1;
    }

    /**
     * Set idUser2
     *
     * @param integer $idUser2
     *
     * @return PrivateChat
     */
    public function setIdUser2($idUser2)
    {
        $this->idUser2 = $idUser2;

        return $this;
    }

    /**
     * Get idUser2
     *
     * @return int
     */
    public function getIdUser2()
    {
        return $this->idUser2;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return PrivateChat
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return bool
     */
    public function getIsActive()
    {
        return $this->isActive;
    }
}

