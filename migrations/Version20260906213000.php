<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260906213000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the realisation content table';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('realisation');
        $table->addColumn('id', 'integer', ['autoincrement' => true]);
        $table->addColumn('title', 'string', ['length' => 255]);
        $table->addColumn('category', 'string', ['length' => 40]);
        $table->addColumn('client', 'string', ['length' => 255, 'notnull' => false]);
        $table->addColumn('year', 'integer', ['notnull' => false]);
        $table->addColumn('description', 'text');
        $table->addColumn('image_path', 'string', ['length' => 255, 'notnull' => false]);
        $table->addColumn('status', 'string', ['length' => 20]);
        $table->addColumn('created_at', 'datetime_immutable');
        $table->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('realisation');
    }
}
