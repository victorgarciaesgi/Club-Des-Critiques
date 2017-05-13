<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RejectAddress
 *
 * @ORM\Table(name="reject_address")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\RejectAddressRepository")
 */
class RejectAddress
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
     * Adresse IP à rejeté
     *
     * @var string
     *
     * @ORM\Column(name="address", type="string", length=50)
     */
    private $address;

    /**
     * Activer / Désactiver le rejet de l'adresse
     *
     * @var bool
     *
     * @ORM\Column(name="reject", type="boolean")
     */
    private $reject;


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
     * Set adress
     *
     * @param string $adress
     *
     * @return RejectAddress
     */
    public function setAdress($adress)
    {
        $this->adress = $adress;

        return $this;
    }

    /**
     * Get adress
     *
     * @return string
     */
    public function getAdress()
    {
        return $this->adress;
    }

    /**
     * Set reject
     *
     * @param boolean $reject
     *
     * @return RejectAddress
     */
    public function setReject($reject)
    {
        $this->reject = $reject;

        return $this;
    }

    /**
     * Get reject
     *
     * @return bool
     */
    public function getReject()
    {
        return $this->reject;
    }
}

