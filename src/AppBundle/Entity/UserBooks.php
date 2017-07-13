<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 *
 * @ORM\Table(name="UserBooks")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserBooksRepository")
 */
class UserBooks
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
     * @ORM\ManyToOne(targetEntity="Media")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_media", referencedColumnName="id_media")
     * })
     */
    private $idMedia;

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
     * @var boolean
     *
     * @ORM\Column(name="is_active", type="boolean", nullable=false)
     */
    private $isActive;


    /**
     * Get id
     *
     * return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set idMedia
     *
     * @param integer $idMedia
     *
     * @return UserBooks
     */
    public function setIdMedia($idMedia)
    {
        $this->idMedia = $idMedia;

        return $this;
    }

    /**
     * Set idUser
     *
     * @param integer $idUser
     *
     * @return UserBooks
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;

        return $this;
    }


    /**
     * Set isActive
     *
     * @param boolean $isActive
     *
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get idMedia
     *
     * @return int
     */
    public function getIdMedia()
    {
        return $this->idMedia;
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
}
