<?php

namespace App\Controller;

use App\Repository\RealisationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PublicRealisationController extends AbstractController
{
    #[Route('/realisations', name: 'app_public_realisations', methods: ['GET'])]
    public function index(RealisationRepository $repository): Response
    {
        return $this->render('realisation/public.html.twig', [
            'realisations' => $repository->findPublished(),
        ]);
    }
}
