/*
  Warnings:

  - Added the required column `roomId` to the `voting_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `voting_sessions` ADD COLUMN `roomId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `voting_sessions` ADD CONSTRAINT `voting_sessions_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
