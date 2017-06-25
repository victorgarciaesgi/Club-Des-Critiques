<?php

namespace AppBundle\Handler;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

/**
 * Class AuthenticationHandler
 * @package AppBundle\Handler
 */
class AuthenticationHandler implements AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{
    /**
     * @var RouterInterface
     */
    private $router;
    /**
     * @var Session
     */
    private $session;


    /**
     * AuthenticationHandler constructor.
     * @param RouterInterface $router
     * @param Session $session
     */
    public function __construct(RouterInterface $router, Session $session)
    {
        $this->router = $router;
        $this->session = $session;
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @return JsonResponse|RedirectResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {

        if ($request->isXmlHttpRequest()) {
            //return new JsonResponse(array('success' => true));
            $url = $this->router->generate('fos_user_profile_show');
            return new JsonResponse(array('success' => true));
        }
        else {
            $url = $this->router->generate('fos_user_profile_show');
            return new RedirectResponse($url);
        }

    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse|RedirectResponse
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        if ($request->isXmlHttpRequest()) {
            return new JsonResponse(array('success' => false, 'message' => $exception->getMessage()));
        } else {
            //$request->get('session')->set(Security::AUTHENTICATION_ERROR, $exception);
            //return new RedirectResponse($this->router->generate('fos_user_security_login'));
            //$url = $this->router->generate('fos_user_profile_show');
            return new JsonResponse(array('success' => true));
        }
    }
}