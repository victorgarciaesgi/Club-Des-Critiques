<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Contact
 *
 * @ORM\Table(name="contact", indexes={@ORM\Index(name="id_user", columns={"id"})}, indexes={@ORM\Index(name="id_user_contact", columns={"id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ContactRepository")
 */
class Contact
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
     * Attention ce champ correspond à l'utilisateur en lui même
     *
     * @var \User
     * @ORM\ManyToOne(targetEntity="User")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     */
    private $idUser;

    /**
     * Celui-ci correspond au (CONTACT)
     *
     * @var \User
     *
     * @ORM\ManyToOne(targetEntity="User")
     *
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user_contact", referencedColumnName="id")
     * })
     *
     */
    private $idUserContact;


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
     * @return Contact
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
     * Set idUserContact
     *
     * @param integer $idUserContact
     *
     * @return Contact
     */
    public function setIdUserContact($idUserContact)
    {
        $this->idUserContact = $idUserContact;

        return $this;
    }

    /**
     * Get idUserContact
     *
     * @return int
     */
    public function getIdUserContact()
    {
        return $this->idUserContact;
    }
}
