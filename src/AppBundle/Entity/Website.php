<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Website
 *
 * @ORM\Table(name="website")
 * @ORM\Entity
 */
class Website
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_website", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idWebsite;

    /**
     * @var string
     *
     * @ORM\Column(name="concept", type="text", nullable=false)
     */
    private $concept;

    /**
     * Limite de signalement max par utilisateur dans un chatroom
     * @var integer
     *
     * @ORM\Column(name="report_chatroom_limit", type="integer", nullable=false)
     */
    private $reportChatroomLimit;

    /**
     * Nombre utilisateur max par salons (chatroom)
     * @var integer
     *
     * @ORM\Column(name="max_user_in_rooms", type="integer", nullable=false)
     */
    private $maxUserChatroom;

    /**
     * @var integer
     *
     * @ORM\Column(name="param_3", type="integer", nullable=false)
     */
    private $param3;

    /**
     * @var integer
     *
     * @ORM\Column(name="param_4", type="integer", nullable=false)
     */
    private $param4;



    /**
     * Get idWebsite
     *
     * @return integer
     */
    public function getIdWebsite()
    {
        return $this->idWebsite;
    }

    /**
     * Set concept
     *
     * @param string $concept
     *
     * @return Website
     */
    public function setConcept($concept)
    {
        $this->concept = $concept;

        return $this;
    }

    /**
     * Get concept
     *
     * @return string
     */
    public function getConcept()
    {
        return $this->concept;
    }

    /**
     * Set reportChatroomLimit
     *
     * @param integer $reportChatroomLimit
     *
     * @return Website
     */
    public function setReportChatroomLimit($reportChatroomLimit)
    {
        $this->reportChatroomLimit = $reportChatroomLimit;

        return $this;
    }

    /**
     * Get reportChatroomLimit
     *
     * @return integer
     */
    public function getReportChatroomLimit()
    {
        return $this->reportChatroomLimit;
    }

    /**
     * Set maxUserChatroom
     *
     * @param integer $maxUserChatroom
     *
     * @return Website
     */
    public function setMaxUserChatroom($maxUserChatroom)
    {
        $this->maxUserChatroom = $maxUserChatroom;

        return $this;
    }

    /**
     * Get maxUserChatroom
     *
     * @return integer
     */
    public function getMaxUserChatroom()
    {
        return $this->maxUserChatroom;
    }

    /**
     * Set param3
     *
     * @param integer $param3
     *
     * @return Website
     */
    public function setParam3($param3)
    {
        $this->param3 = $param3;

        return $this;
    }

    /**
     * Get param3
     *
     * @return integer
     */
    public function getParam3()
    {
        return $this->param3;
    }

    /**
     * Set param4
     *
     * @param integer $param4
     *
     * @return Website
     */
    public function setParam4($param4)
    {
        $this->param4 = $param4;

        return $this;
    }

    /**
     * Get param4
     *
     * @return integer
     */
    public function getParam4()
    {
        return $this->param4;
    }
}
