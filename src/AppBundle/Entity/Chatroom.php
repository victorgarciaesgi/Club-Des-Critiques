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
     * @ORM\Column(name="date_created", type="date", nullable=false)
     */
    private $dateCreated;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_update", type="date", nullable=false)
     */
    private $dateUpdate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_closed", type="date", nullable=false)
     */
    private $dateClosed;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_start", type="date", nullable=false)
     */
    private $dateStart;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_end", type="date", nullable=false)
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
     * @ORM\Column(name="note", type="integer", nullable=false)
     */
    private $note;

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

}

