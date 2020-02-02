<?php

namespace App\Doctrine;

use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\User;

// Dans le cas d'une collection et d'un item je veux etendre Symfony avec les methodes de ces interfaces
class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {

    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    // Centraliser le code des fonctions apply...
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass) {
        $user = $this->security->getUser();

        // Si la classe sur laquelle on fait une requete est Customer ou Invoice ET si pas Admin ET si l'utilisateur est connecte (si l'utilisateur n'est pas connecte $user vaudra null)
        if(($resourceClass === Customer::class || $resourceClass === Invoice::class) && !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User) {
            // dd($queryBuilder); // faire un dump du QueryBuilder et un GET sur Postman pour voir
            // Recuperer le 1er alias de la requete
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } else if($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer", "c")
                             ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user); // Binder le user avec celui recupere via Security
        }
    }

    // Quand on va aller chercher une collection (=plusieurs factures ou customers), Doctrine va voir l'extension et on va pouvoir appliquer des correctifs / ameliorations a la requete
    // string $resourceClass => Nom de la classe sur laquelle on fait une requete
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    // Quand on va aller chercher un item (=une facture ou customer)
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}