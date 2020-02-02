<?php

namespace App\Events;

use App\Kernel;
use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {
    
    /** @var UserPasswordEncoderInterface */
    private $encoder;

    // Injecter l'encodeur pour hasher le mot de passe
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents()
    {
        // ['eventName' => ['methodName', $priority]]
        return [
            // Le VIEW intervient après la deserialisation i.e au moment ou l'API va persister l’entité User ou plus precisement en PRE_WRITE avant que Doctrine n'envoie l'entité en base
            // Appeler avant l'écriture la fonction encodePassword()
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    // Encoder le mot de passe
    public function encodePassword(ViewEvent $event)
    {
        $user = $event->getControllerResult(); // Résultat du contrôleur d'API Platform (deserialise le JSON en une entité et la renvoie)
        // dd($user);
        $method = $event->getRequest()->getMethod(); // POST, GET, PUT, ...
        // Comme l'evenement kernel.view va etre appele a chaque requete, tester si on est dans le cas d'un POST User !
        if($user instanceof User && $method === "POST") {
            $hash = $this->encoder->encodePassword($user, $user->getPassword());
            $user->setPassword($hash);
        }
    }
}