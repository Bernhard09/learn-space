/*
  Warnings:

  - You are about to drop the column `description` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `description`,
    DROP COLUMN `thumbnailUrl`;
