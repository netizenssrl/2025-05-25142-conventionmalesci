/*
  Warnings:

  - You are about to drop the column `iScore` on the `voting_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `iTimerSeconds` on the `voting_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `status` ADD COLUMN `iScore` INTEGER NULL,
    ADD COLUMN `iTimerSeconds` INTEGER NULL;

-- AlterTable
ALTER TABLE `voting_sessions` DROP COLUMN `iScore`,
    DROP COLUMN `iTimerSeconds`;
