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


}

