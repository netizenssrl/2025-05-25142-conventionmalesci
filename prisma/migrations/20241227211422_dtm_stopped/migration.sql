/*
  Warnings:

  - You are about to drop the column `dtmEnded` on the `voting_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `voting_sessions` DROP COLUMN `dtmEnded`,
    ADD COLUMN `dtmStopped` DATETIME(3) NULL;
