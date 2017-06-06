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
     * @ORM\Column(name="img", type="string", length=1000, nullable=false)
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
     * Code ISBN
     *
     * @var integer
     * @ORM\Column(name="isbn", type="integer",nullable=false)
     */
    private $isbn;

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


    /**
     * Get idMedia
     *
     * @return integer
     */
    public function getIdMedia()
    {
        return $this->idMedia;
    }

    /**
     * @return int
     */
    public function getIsbn()
    {
        return $this->isbn;
    }

    /**
     * @param int $isbn
     */
    public function setIsbn($isbn)
    {
        $this->isbn = $isbn;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Media
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set author
     *
     * @param string $author
     *
     * @return Media
     */
    public function setAuthor($author)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return string
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * Set img
     *
     * @param string $img
     *
     * @return Media
     */
    public function setImg($img)
    {
        $this->img = $img;

        return $this;
    }

    /**
     * Get img
     *
     * @return string
     */
    public function getImg()
    {
        return $this->img;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Media
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
     * Set numberPage
     *
     * @param integer $numberPage
     *
     * @return Media
     */
    public function setNumberPage($numberPage)
    {
        $this->number_page = $numberPage;

        return $this;
    }

    /**
     * Get numberPage
     *
     * @return integer
     */
    public function getNumberPage()
    {
        return $this->number_page;
    }

    /**
     * Set duration
     *
     * @param integer $duration
     *
     * @return Media
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * Get duration
     *
     * @return integer
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set valid
     *
     * @param boolean $valid
     *
     * @return Media
     */
    public function setValid($valid)
    {
        $this->valid = $valid;

        return $this;
    }

    /**
     * Get valid
     *
     * @return boolean
     */
    public function getValid()
    {
        return $this->valid;
    }

    /**
     * Set releaseDate
     *
     * @param \DateTime $releaseDate
     *
     * @return Media
     */
    public function setReleaseDate($releaseDate)
    {
        $this->releaseDate = $releaseDate;

        return $this;
    }

    /**
     * Get releaseDate
     *
     * @return \DateTime
     */
    public function getReleaseDate()
    {
        return $this->releaseDate;
    }

    /**
     * Set releaseDateCine
     *
     * @param \DateTime $releaseDateCine
     *
     * @return Media
     */
    public function setReleaseDateCine($releaseDateCine)
    {
        $this->releaseDateCine = $releaseDateCine;

        return $this;
    }

    /**
     * Get releaseDateCine
     *
     * @return \DateTime
     */
    public function getReleaseDateCine()
    {
        return $this->releaseDateCine;
    }

    /**
     * Set note
     *
     * @param integer $note
     *
     * @return Media
     */
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
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
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return Media
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set idCategory
     *
     * @param \AppBundle\Entity\Category $idCategory
     *
     * @return Media
     */
    public function setIdCategory(\AppBundle\Entity\Category $idCategory = null)
    {
        $this->idCategory = $idCategory;

        return $this;
    }

    /**
     * Get idCategory
     *
     * @return \AppBundle\Entity\Category
     */
    public function getIdCategory()
    {
        return $this->idCategory;
    }

    /**
     * Set idSubCategory
     *
     * @param \AppBundle\Entity\SubCategory $idSubCategory
     *
     * @return Media
     */
    public function setIdSubCategory(\AppBundle\Entity\SubCategory $idSubCategory = null)
    {
        $this->idSubCategory = $idSubCategory;

        return $this;
    }

    /**
     * Get idSubCategory
     *
     * @return \AppBundle\Entity\SubCategory
     */
    public function getIdSubCategory()
    {
        return $this->idSubCategory;
    }
}
