<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * LendBook
 *
 * @ORM\Table(name="lend_book")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\LendBookRepository")
 */
class LendBook
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
     * @var \User

     * @ORM\OneToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_origin", referencedColumnName="id")
     * })
     *
     */
    private $userOrigin;

    /**
     * @var \User

     * @ORM\OneToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_target", referencedColumnName="id")
     * })
     */
    private $userTarget;

    /**
     * @var \Media
     * @ORM\OneToOne(targetEntity="Media")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="media", referencedColumnName="id_media")
     * })
     */
    private $media;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_exchange", type="datetime")
     */
    private $dateExchange;

    /**
     * Date du retour
     *
     * @var \DateTime
     *
     * @ORM\Column(name="date_update", type="datetime", nullable=true)
     */
    private $dateReturn;

    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="integer")
     */
    private $status;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @return int
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param int $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

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
     * Set userOrigin
     *
     * @param integer $userOrigin
     *
     * @return LendBook
     */
    public function setUserOrigin($userOrigin)
    {
        $this->userOrigin = $userOrigin;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDateReturn()
    {
        return $this->dateReturn;
    }

    /**
     * @param \DateTime $dateReturn
     */
    public function setDateReturn($dateReturn)
    {
        $this->dateReturn = $dateReturn;
    }

    /**
     * Get userOrigin
     *
     * @return int
     */
    public function getUserOrigin()
    {
        return $this->userOrigin;
    }

    /**
     * Set userTarget
     *
     * @param integer $userTarget
     *
     * @return LendBook
     */
    public function setUserTarget($userTarget)
    {
        $this->userTarget = $userTarget;

        return $this;
    }

    /**
     * Get userTarget
     *
     * @return int
     */
    public function getUserTarget()
    {
        return $this->userTarget;
    }

    /**
     * Set media
     *
     * @param integer $media
     *
     * @return LendBook
     */
    public function setMedia($media)
    {
        $this->media = $media;

        return $this;
    }

    /**
     * Get media
     *
     * @return int
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * Set dateExchange
     *
     * @param \DateTime $dateExchange
     *
     * @return LendBook
     */
    public function setDateExchange($dateExchange)
    {
        $this->dateExchange = new \DateTime();

        return $this;
    }

    /**
     * Get dateExchange
     *
     * @return \DateTime
     */
    public function getDateExchange()
    {
        return $this->dateExchange;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return LendBook
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return bool
     */
    public function getIsActive()
    {
        return $this->isActive;
    }
}

