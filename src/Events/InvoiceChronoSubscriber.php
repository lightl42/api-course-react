<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EventChronoSubscriber implements EventSubscriberInterface {
    
    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }
    
    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event) {
        $invoice = $event->getControllerResult(); // Objet
        $method = $event->getRequest()->getMethod(); // Methode
        if($invoice instanceof Invoice && $method === "POST") {
            // Recuperer le prochain chrono de la facture
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            // Assigner le prochain chrono a la facture
            $invoice->setChrono($nextChrono);
            // TODO : A deplacer dans une classe dediee pour attribuer une nouvelle date automatiquement si il n'y en a pas !
            if(empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \DateTime());
            }
        }
    }
}