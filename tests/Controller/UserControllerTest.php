<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $em;
    private UserRepository $users;
    private User $admin;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = static::getContainer()->get(EntityManagerInterface::class);
        $this->users = static::getContainer()->get(UserRepository::class);

        $this->em->getConnection()->executeStatement(
            $this->em->getConnection()->getDatabasePlatform()->getTruncateTableSQL('`user`', false)
        );

        $this->admin = $this->makeUser('admin@example.com');
        $this->client->loginUser($this->admin);
    }

    public function testIndexIsSuccessful(): void
    {
        $this->client->request('GET', '/user');

        self::assertResponseIsSuccessful();
        self::assertSelectorTextContains('h1', 'Utilisateurs');
    }

    public function testCreateUserHashesPasswordAndMapsRole(): void
    {
        $this->client->request('GET', '/user/new');
        self::assertResponseIsSuccessful();

        $this->client->submitForm('Créer', [
            'user[firstName]' => 'Ilyes',
            'user[lastName]' => 'Mesbah',
            'user[email]' => 'ilyes@example.com',
            'user[role]' => 'Administrateur',
            'user[plainPassword]' => 'motdepasse123',
        ]);

        self::assertResponseRedirects('/user');

        $user = $this->users->findOneBy(['email' => 'ilyes@example.com']);
        self::assertInstanceOf(User::class, $user);
        self::assertSame('Ilyes Mesbah', $user->getFullName());
        self::assertContains('ROLE_ADMIN', $user->getRoles());
        self::assertNotSame('motdepasse123', $user->getPassword());
        self::assertTrue(
            static::getContainer()->get(UserPasswordHasherInterface::class)->isPasswordValid($user, 'motdepasse123')
        );
    }

    public function testCreateUserRejectsShortPasswordAndDuplicateEmail(): void
    {
        $this->makeUser('taken@example.com');

        $this->client->request('GET', '/user/new');
        $this->client->submitForm('Créer', [
            'user[firstName]' => 'A',
            'user[lastName]' => 'B',
            'user[email]' => 'taken@example.com',
            'user[role]' => 'Administrateur',
            'user[plainPassword]' => 'short',
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertSelectorTextContains('body', 'au moins 8 caractères');
        self::assertSelectorTextContains('body', 'existe déjà');
        self::assertCount(2, $this->users->findAll());
    }

    public function testEditUpdatesUserAndKeepsPasswordWhenBlank(): void
    {
        $user = $this->makeUser('edit@example.com');
        $originalHash = $user->getPassword();
        $id = $user->getId();

        $this->client->request('GET', '/user/'.$id.'/edit');
        $this->client->submitForm('Mettre à jour', [
            'user[firstName]' => 'Edited',
            'user[lastName]' => 'Name',
            'user[email]' => 'edit@example.com',
            'user[role]' => 'Éditeur',
            'user[plainPassword]' => '',
        ]);

        self::assertResponseRedirects('/user');
        $this->em->clear();
        $updated = $this->users->find($id);
        self::assertSame('Edited', $updated->getFirstName());
        self::assertContains('ROLE_EDITOR', $updated->getRoles());
        self::assertSame($originalHash, $updated->getPassword());
    }

    public function testDeleteRemovesUser(): void
    {
        $user = $this->makeUser('delete@example.com');
        $id = $user->getId();

        $this->client->request('GET', '/user/'.$id);
        $this->client->submitForm('Supprimer');

        self::assertResponseRedirects('/user');
        self::assertCount(1, $this->users->findAll());
    }

    private function makeUser(string $email): User
    {
        $hasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $user = (new User())
            ->setFirstName('Test')
            ->setLastName('User')
            ->setEmail($email)
            ->setRole('Administrateur')
            ->setRoles(['ROLE_ADMIN']);
        $user->setPassword($hasher->hashPassword($user, 'motdepasse123'));

        $this->users->save($user);
        $this->em->clear();

        return $this->users->findOneBy(['email' => $email]);
    }
}
