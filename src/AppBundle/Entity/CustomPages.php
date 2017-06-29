<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CustomPages
 *
 * @ORM\Table(name="custom_pages")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CustomPagesRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class CustomPages
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
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;

    /**
     * @var string
     *
     * @ORM\Column(name="img", type="string", length=255)
     */
    private $img;

    /**
     * @var string
     *
     * @ORM\Column(name="permalink", type="string", length=255, unique=true)
     */
    private $permalink;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="date")
     */
    private $dateCreated;

    /**
     * @var string
     *
     * @ORM\Column(name="date_update", type="string", length=255, nullable=true)
     */
    private $dateUpdate;


    /**
     * @var boolean
     *
     * @ORM\ManyToOne(targetEntity="CustomPageCategory")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_category", referencedColumnName="id")
     * })
     *
     */
    private $Category;

    /**
     * @var int
     *
     * @ORM\Column(name="level_access", type="integer")
     */
    private $levelAccess;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive = false;


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
     * Set title
     *
     * @param string $title
     *
     * @return CustomPages
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return CustomPages
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set img
     *
     * @param string $img
     *
     * @return CustomPages
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
     * Set permalink
     *
     * @param string $permalink
     *
     * @return CustomPages
     */
    public function setPermalink($permalink)
    {
        $this->permalink = $permalink;

        return $this;
    }

    /**
     * Get permalink
     *
     * @return string
     */
    public function getPermalink()
    {
        return $this->permalink;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     *
     * @return CustomPages
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set dateUpdate
     *
     * @param string $dateUpdate
     *
     * @return CustomPages
     */
    public function setDateUpdate($dateUpdate)
    {
        $this->dateUpdate = $dateUpdate;

        return $this;
    }

    /**
     * Get dateUpdate
     *
     * @return string
     */
    public function getDateUpdate()
    {
        return $this->dateUpdate;
    }

    /**
     * Set levelAccess
     *
     * @param integer $levelAccess
     *
     * @return CustomPages
     */
    public function setLevelAccess($levelAccess)
    {
        $this->levelAccess = $levelAccess;

        return $this;
    }

    /**
     * Get levelAccess
     *
     * @return int
     */
    public function getLevelAccess()
    {
        return $this->levelAccess;
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return $this->isActive;
    }

    /**
     * @param bool $isActive
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
    }

    /**
     * @return bool
     */
    public function isCategory()
    {
        return $this->Category;
    }

    /**
     * @param bool $Category
     */
    public function setCategory($Category)
    {
        $this->Category = $Category;
    }

    /**
     * @ORM\PrePersist
     */
    public function setDate(){
        $this->setDateCreated(new \Datetime("now"));
    }

    /**
     * @ORM\PrePersist
     */
    public function generatePermalink(){

        $title = rtrim($this->getTitle());
        $title = strtolower($title);

        $search = array ('@[éèêëÊË]@i','@[àâäÂÄ]@i','@[îïÎÏ]@i','@[ûùüÛÜ]@i','@[ôöÔÖ]@i','@[ç]@i','@[ ]@i','@[\'"]@i','@[&]@i','@[,!:?]@i');
        $replace = array ('e','a','i','u','o','c','-','-','et','');
        $title = preg_replace($search, $replace, $title);
        $permalink = rtrim($title,'-');
        $this->setPermalink($permalink);
    }
}

