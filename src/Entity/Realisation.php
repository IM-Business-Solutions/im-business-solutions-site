<?php

namespace App\Entity;

use App\Repository\RealisationRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RealisationRepository::class)]
class Realisation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(length: 40)]
    #[Assert\NotBlank]
    private ?string $category = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $client = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Range(min: 2000, max: 2100)]
    private ?int $year = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagePath = null;

    #[ORM\Column(length: 20)]
    private string $status = 'brouillon';

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getCategory(): ?string { return $this->category; }
    public function setCategory(string $category): static { $this->category = $category; return $this; }
    public function getClient(): ?string { return $this->client; }
    public function setClient(?string $client): static { $this->client = $client; return $this; }
    public function getYear(): ?int { return $this->year; }
    public function setYear(?int $year): static { $this->year = $year; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(string $description): static { $this->description = $description; return $this; }
    public function getImagePath(): ?string { return $this->imagePath; }
    public function setImagePath(?string $imagePath): static { $this->imagePath = $imagePath; return $this; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getCreatedAt(): DateTimeImmutable { return $this->createdAt; }
}
