<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Invoice;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Exception;

/**
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    // Recuperer le prochain chrono
    public function findNextChrono(User $user)
    {
        try {
            return $this->createQueryBuilder("i") // Invoices
                ->select("i.chrono") // Chrono des invoices
                ->join("i.customer", "c") // Jointure les Customers de ces invoices alias c
                ->where("c.user = :user") // Invoices qui ont pour Customer un Customer dont l'utilisateur est $user
                ->setParameter("user", $user) // Bind du user
                ->orderBy("i.chrono", "DESC") // Tri descendant sur Chrono
                ->setMaxResults(1) // Le dernier (le plus grand)
                ->getQuery() // Recuperer la requete
                ->getSingleScalarResult() + 1; // Uniquement le numero + 1
        } catch (\Exception $e) {
            return 1;
        }
    }

    // /**
    //  * @return Invoice[] Returns an array of Invoice objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Invoice
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
