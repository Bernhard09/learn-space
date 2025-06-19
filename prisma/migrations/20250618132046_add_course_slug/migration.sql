/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Course` table without a default value. This is not possible if the table is not empty.

*/

-- First add the column as nullable
ALTER TABLE `Course` ADD COLUMN `slug` VARCHAR(191) NULL;

-- Update existing records with a slug based on title only
UPDATE `Course` SET `slug` = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', ''), '"', ''), "'", ''));

-- Now make the column NOT NULL
ALTER TABLE `Course` MODIFY COLUMN `slug` VARCHAR(191) NOT NULL;

-- Create the unique index
CREATE UNIQUE INDEX `Course_slug_key` ON `Course`(`slug`);
