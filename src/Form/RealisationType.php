<?php

namespace App\Form;

use App\Entity\Realisation;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Image;

final class RealisationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, ['label' => 'Titre du projet'])
            ->add('category', ChoiceType::class, [
                'label' => 'Catégorie',
                'choices' => [
                    'Communication' => 'communication',
                    'Développement commercial' => 'developpement',
                    "Apport d'affaires" => 'apport',
                ],
            ])
            ->add('client', TextType::class, ['label' => 'Client', 'required' => false])
            ->add('year', IntegerType::class, ['label' => 'Année', 'required' => false])
            ->add('description', TextareaType::class, ['label' => 'Description'])
            ->add('status', ChoiceType::class, [
                'label' => 'Statut',
                'choices' => ['Publié' => 'publie', 'Brouillon' => 'brouillon'],
            ])
            ->add('image', FileType::class, [
                'label' => 'Image du projet',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new Image(
                        maxSize: '5M',
                        mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                        mimeTypesMessage: 'Veuillez sélectionner une image JPG, PNG ou WebP.',
                    ),
                ],
            ]);

    }
}
