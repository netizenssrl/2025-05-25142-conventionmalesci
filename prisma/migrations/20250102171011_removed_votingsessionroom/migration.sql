/*
  Warnings:

  - You are about to drop the column `roomId` on the `voting_sessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `voting_sessions` DROP FOREIGN KEY `voting_sessions_roomId_fkey`;

-- DropIndex
DROP INDEX `voting_sessions_roomId_fkey` ON `voting_sessions`;

-- AlterTable
ALTER TABLE `voting_sessions` DROP COLUMN `roomId`;
