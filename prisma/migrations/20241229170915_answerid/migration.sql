/*
  Warnings:

  - Added the required column `answerId` to the `participant_answers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `participant_answers` ADD COLUMN `answerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `participant_answers` ADD CONSTRAINT `participant_answers_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `answers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
