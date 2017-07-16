<?php
// src/AppBundle/Entity/User.php

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    public function __construct()
    {
        parent::__construct();
        // your own logic
    }

    /**
     *
     * note utilisateur attribuer par les membres
     * @var integer
     *
     * @ORM\Column(name="note", type="integer", nullable=false)
     */
    private $note = 0;

    /**
     * Classement d'activité sur le site
     * @var integer
     *
     * @ORM\Column(name="ranking", type="integer", nullable=true)
     */
    private $ranking;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=false)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="img", type="string",length=500, nullable=true)
     */
    private $img;

    /**
     * @var string
     *
     * @ORM\Column(name="address_ip", type="string",length=50, nullable=true)
     */
    private $addressIP;

    /**
     * Bloquer accès à l'utilisateur
     *
     * @var boolean
     *
     * @ORM\Column(name="is_blocked", type="boolean", nullable=false)
     */
    private $isBlocked = 0;

    /**
     * Mot clé de l'utilisateur
     *
     * @var string
     *
     * @ORM\Column(name="keyword", type="text", nullable=true)
     */
    private $keyword;

    /**
     * Photo de profils
     *
     * @var string
     *
     * @ORM\Column(name="path_img", type="string", length=255,nullable=true)
     */
    private $pathImg;

    /**
     * @return string
     */
    public function getPathImg()
    {
        return $this->pathImg;
    }

    /**
     * @param string $pathImg
     */
    public function setPathImg($pathImg)
    {
        $this->pathImg = $pathImg;
    }

    /**
     * @return string
     */
    public function getImg()
    {
        return $this->img;
    }

    /**
     * @param string $img
     */
    public function setImg($img)
    {
        $this->img = $img;
    }


    /**
     * Set note
     *
     * @param integer $note
     *
     * @return User
     */
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
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
     * Set ranking
     *
     * @param integer $ranking
     *
     * @return User
     */
    public function setRanking($ranking)
    {
        $this->ranking = $ranking;

        return $this;
    }

    /**
     * Get ranking
     *
     * @return integer
     */
    public function getRanking()
    {
        return $this->ranking;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return User
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
     * Set addressIP
     *
     * @param string $addressIP
     *
     * @return User
     */
    public function setAddressIP($addressIP)
    {
        $this->addressIP = $addressIP;

        return $this;
    }

    /**
     * Get addressIP
     *
     * @return string
     */
    public function getAddressIP()
    {
        return $this->addressIP;
    }

    /**
     * Set isBlocked
     *
     * @param boolean $isBlocked
     *
     * @return User
     */
    public function setIsBlocked($isBlocked)
    {
        $this->isBlocked = $isBlocked;

        return $this;
    }

    /**
     * Get isBlocked
     *
     * @return boolean
     */
    public function getIsBlocked()
    {
        return $this->isBlocked;
    }

    /**
     * Set keyword
     *
     * @param string $keyword
     *
     * @return User
     */
    public function setKeyword($keyword)
    {
        $this->keyword = $keyword;

        return $this;
    }

    /**
     * Get keyword
     *
     * @return string
     */
    public function getKeyword()
    {
        return $this->keyword;
    }

    /**
     * Récupération de l'adresse IP du Client
     * @ORM\PrePersist()
     *
     */
    public function setCurrentAdressIP(){
        $adressClient = $_SERVER['HTTP_CLIENT_IP'];
        $this->setAddressIP($adressClient);

    }
}
