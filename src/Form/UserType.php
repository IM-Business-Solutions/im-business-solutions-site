<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstName', TextType::class, [
                'label' => 'Prénom',
            ])
            ->add('lastName', TextType::class, [
                'label' => 'Nom',
            ])
            ->add('email', EmailType::class, [
                'label' => 'Email',
            ])
            ->add('role', ChoiceType::class, [
                'label' => 'Rôle',
                'choices' => [
                    'Administrateur' => 'Administrateur',
                    'Éditeur' => 'Éditeur',
                ],
            ])
            ->add('plainPassword', PasswordType::class, [
                'label' => $options['require_password'] ? 'Mot de passe' : 'Nouveau mot de passe',
                'mapped' => false,
                'required' => $options['require_password'],
                'help' => $options['require_password']
                    ? '8 caractères minimum.'
                    : 'Laissez vide pour conserver le mot de passe actuel.',
                'constraints' => $this->passwordConstraints($options['require_password']),
                'attr' => ['autocomplete' => 'new-password'],
            ]);
    }

    /**
     * @return list<Assert\Constraint>
     */
    private function passwordConstraints(bool $required): array
    {
        $length = new Assert\Length(
            min: 8,
            minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.',
            max: 4096,
        );

        if ($required) {
            return [new Assert\NotBlank(message: 'Le mot de passe est obligatoire.'), $length];
        }

        // On edit: only validate the length when a value was actually provided.
        return [new Assert\When(
            expression: 'value !== null and value !== ""',
            constraints: [$length],
        )];
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'require_password' => true,
        ]);
        $resolver->setAllowedTypes('require_password', 'bool');
    }
}
