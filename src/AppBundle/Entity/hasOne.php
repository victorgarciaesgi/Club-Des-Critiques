<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * hasOne Table des livre à la Une
 *
 * @ORM\Table(name="has_one")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\hasOneRepository")
 */
class hasOne
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
     *   @ORM\JoinColumn(name="id_media", referencedColumnName="id_media",unique=true)
     * })
     */
    private $idMedia;


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
     * @return hasOne
     */
    public function setIdMedia($idMedia)
    {
        $this->idMedia = $idMedia;

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
}

