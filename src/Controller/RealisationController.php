<?php

namespace App\Controller;

use App\Entity\Realisation;
use App\Form\RealisationType;
use App\Repository\RealisationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/admin/realisations')]
final class RealisationController extends AbstractController
{
    #[Route('', name: 'app_realisation_index', methods: ['GET'])]
    public function index(RealisationRepository $repository): Response
    {
        return $this->render('realisation/index.html.twig', ['realisations' => $repository->findAllOrdered()]);
    }

    #[Route('/new', name: 'app_realisation_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $realisation = new Realisation();
        $form = $this->createForm(RealisationType::class, $realisation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->storeImage($form->get('image')->getData(), $realisation, $slugger);
            $entityManager->persist($realisation);
            $entityManager->flush();
            $this->addFlash('success', 'Réalisation ajoutée.');

            return $this->redirectToRoute('app_realisation_index');
        }

        return $this->render('realisation/new.html.twig', ['form' => $form]);
    }

    #[Route('/{id}/edit', name: 'app_realisation_edit', methods: ['GET', 'POST'])]
    public function edit(Realisation $realisation, Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createForm(RealisationType::class, $realisation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->storeImage($form->get('image')->getData(), $realisation, $slugger);
            $entityManager->flush();
            $this->addFlash('success', 'Réalisation mise à jour.');

            return $this->redirectToRoute('app_realisation_index');
        }

        return $this->render('realisation/edit.html.twig', ['form' => $form, 'realisation' => $realisation]);
    }

    #[Route('/{id}', name: 'app_realisation_delete', methods: ['POST'])]
    public function delete(Realisation $realisation, Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$realisation->getId(), (string) $request->request->get('_token'))) {
            $entityManager->remove($realisation);
            $entityManager->flush();
            $this->addFlash('success', 'Réalisation supprimée.');
        }

        return $this->redirectToRoute('app_realisation_index');
    }

    private function storeImage(?UploadedFile $image, Realisation $realisation, SluggerInterface $slugger): void
    {
        if (!$image instanceof UploadedFile) {
            return;
        }

        $filename = $slugger->slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
        $safeFilename = $filename.'-'.bin2hex(random_bytes(6)).'.'.$image->guessExtension();
        $uploadDirectory = $this->getParameter('kernel.project_dir').'/public/uploads/realisations';

        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
            throw new FileException('Le dossier de téléchargement ne peut pas être créé.');
        }

        $image->move($uploadDirectory, $safeFilename);
        $realisation->setImagePath('/uploads/realisations/'.$safeFilename);
    }
}
