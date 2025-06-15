-- AlterTable
ALTER TABLE `course` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `thumbnailUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` TEXT NOT NULL;
