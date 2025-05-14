-- AlterTable
ALTER TABLE `status` ADD COLUMN `currentQuestionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `status` ADD CONSTRAINT `status_currentQuestionId_fkey` FOREIGN KEY (`currentQuestionId`) REFERENCES `questions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
