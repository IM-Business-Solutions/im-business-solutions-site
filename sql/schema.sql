-- =========================================================
-- IM BUSINESS SOLUTIONS — Schéma de base de données (MySQL)
-- À importer une fois dans la base créée chez l'hébergeur
-- (phpMyAdmin -> Importer, ou ligne de commande mysql).
-- =========================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(80) NOT NULL,
  nom VARCHAR(80) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'Administrateur',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(160) NOT NULL,
  entreprise VARCHAR(160) NULL,
  email VARCHAR(190) NOT NULL,
  telephone VARCHAR(40) NULL,
  service VARCHAR(120) NULL,
  budget VARCHAR(60) NULL,
  message TEXT NOT NULL,
  status ENUM('nouveau','en_cours','traite','archive') NOT NULL DEFAULT 'nouveau',
  ip VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_quote_status (status),
  KEY idx_quote_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(160) NOT NULL,
  entreprise VARCHAR(160) NULL,
  email VARCHAR(190) NOT NULL,
  telephone VARCHAR(40) NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  ip VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_msg_read (is_read),
  KEY idx_msg_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS realisations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(190) NOT NULL,
  categorie VARCHAR(60) NOT NULL, -- communication | developpement | apport
  client VARCHAR(160) NULL,
  annee VARCHAR(4) NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255) NULL,
  status ENUM('publie','brouillon') NOT NULL DEFAULT 'brouillon',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_real_status (status),
  KEY idx_real_cat (categorie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
