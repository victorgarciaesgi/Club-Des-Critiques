<?php

namespace AppBundle\Controller;

use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class SuccessHandlerController implements AuthenticationSuccessHandlerInterface
{
    protected $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        if($request->isXmlHttpRequest()){
            /*
            $response = new Response(json_encode(array(
                'success'=> 1,
            )));
            */
            //$response->headers->set('Content-Type', 'application/json');
            //return $response;

            return new RedirectResponse($this->router->generate('fos_user_security_login'));
        }else{
            if ($token->getUser()->isSuperAdmin()) {
                return new RedirectResponse($this->router->generate('homepage'));
            }
            else {
                return new RedirectResponse($this->router->generate('homepage'));
            }
        }
    }
}
?>