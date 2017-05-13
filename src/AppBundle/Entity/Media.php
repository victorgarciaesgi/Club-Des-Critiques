<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Media / représente les livres, Film, musique... etc
 *
 * @ORM\Table(name="media", indexes={@ORM\Index(name="id_category", columns={"id_category"}), @ORM\Index(name="id_sub_category", columns={"id_sub_category"})})
 * @ORM\Entity
 */
class Media
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_media", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idMedia;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name;

    /**
     *  Soit autheur pour les livre ou réalisateur pour les films
     *
     * @var string
     *
     * @ORM\Column(name="author", type="string", length=255, nullable=false)
     */
    private $author;

    /**
     * @var string
     *
     * @ORM\Column(name="img", type="string", length=255, nullable=false)
     */
    private $img;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", length=65535, nullable=false)
     */
    private $description;

    /**
     * Dans le cas d'un livre mettre le nombre de page
     *
     * @var integer
     *
     * @ORM\Column(name="number_page", type="integer", nullable=true)
     */
    private $number_page;

    /**
     * Dans le cas d'un film mettre la durée en minute
     *
     * @var integer
     *
     * @ORM\Column(name="duration", type="integer", nullable=true)
     */
    private $duration;

    /**
     * Validation du livre ajouter par les utilisateurs
     *
     * @var boolean
     * @ORM\Column(name="valid", type="boolean", nullable=false)
     */
    private $valid;

    /**
     * date de parution pour les livres ou date de sortie DVD Bluray
     *
     * @var \DateTime
     * @ORM\Column(name="release_date", type="datetime", nullable=false)
     */
    private $releaseDate;

    /**
     * Date de sortie cinéma
     *
     * @var \DateTime
     * @ORM\Column(name="release_date_cine", type="datetime", nullable=false)
     */
    private $releaseDateCine;

    /**
     * Date de sortie cinéma
     *
     * @var integer
     * @ORM\Column(name="note", type="integer", nullable=false)
     */
    private $note;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_active", type="boolean", nullable=false)
     */
    private $isActive;

    /**
     * @var \Category
     *
     * @ORM\ManyToOne(targetEntity="Category")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_category", referencedColumnName="id_category")
     * })
     */
    private $idCategory;

    /**
     * @var \SubCategory
     *
     * @ORM\ManyToOne(targetEntity="SubCategory")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_sub_category", referencedColumnName="id_sub_category")
     * })
     */
    private $idSubCategory;

}

