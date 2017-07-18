<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Media / représente les livres, Film, musique... etc
 *
 * @ORM\Table(name="media")
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
     * @Assert\NotBlank()
     * @Assert\Length(
     *  min = 1,
     *  max = 255
     * )
     */
    private $name;

    /**
     *  Soit autheur pour les livre ou réalisateur pour les films
     *
     * @var string
     *
     * @ORM\Column(name="author", type="string", length=255, nullable=false)
     * @Assert\NotBlank()
     * @Assert\Length(
     *  min = 1,
     *  max = 255
     * )
     */
    private $author;

    /**
     * @var string
     *
     * @ORM\Column(name="img", type="string", length=1000, nullable=false)
     * @Assert\NotBlank()
     * @Assert\Url()
     *
     */
    private $img;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", length=65535, nullable=false)
     * @Assert\NotBlank()
     *
     */
    private $description;

    /**
     * Dans le cas d'un livre mettre le nombre de page
     *
     * @var integer
     *
     * @ORM\Column(name="number_page", type="integer", nullable=true)
     * @Assert\Range(
     *      min = 0
     * )
     *
     */
    private $number_page;

    /**
     * Dans le cas d'un film mettre la durée en minute
     *
     * @var float
     *
     * @ORM\Column(name="price", type="float", nullable=true)
     * @Assert\Range(
     *      min = 0
     * )
     */
    private $price;

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
     * @Assert\NotBlank()
     * @Assert\DateTime()
     */
    private $releaseDate;

    /**
     * Code ISBN
     *
     * @var string
     * @ORM\Column(name="isbn", type="string", length=13, nullable=false)
     * @Assert\NotBlank()
     */
    private $isbn;

    /**
     * Lien d'achat du livre
     *
     * @var \DateTime
     * @ORM\Column(name="buy_link", type="string",length=500 , nullable=true)
     * @Assert\Url()
     *
     */
    private $buyLink;

    /**
     * @var int
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_users", referencedColumnName="id")
     * })
     */
    private $idUsers;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_active", type="boolean", nullable=false)
     */
    private $isActive;

    /**
     * @return \DateTime
     */
    public function getBuyLink()
    {
        return $this->buyLink;
    }


    /**
     * @param \DateTime $buyLink
     */
    public function setBuyLink($buyLink)
    {
        $this->buyLink = $buyLink;
    }

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
     * @return float
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param float $price
     */
    public function setPrice($price)
    {
        $this->price = $price;
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
     * @return int
     */
    public function getIdUsers()
    {
        return $this->idUsers;
    }

    /**
     * @param int $idUsers
     */
    public function setIdUsers($idUsers)
    {
        $this->idUsers = $idUsers;
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
}
