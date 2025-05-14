-- CreateTable
CREATE TABLE `participants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSocket` VARCHAR(191) NULL,
    `sEmail` VARCHAR(191) NULL,
    `sFirstName` VARCHAR(191) NULL,
    `sLastName` VARCHAR(191) NULL,
    `dtmLogin` DATETIME(3) NULL,
    `dtmLogout` DATETIME(3) NULL,
    `dtmConnected` DATETIME(3) NULL,
    `dtmDisconnected` DATETIME(3) NULL,
    `dtmSurveyOpened` DATETIME(3) NULL,
    `teamId` INTEGER NULL,
    `bTeamPointsEnabled` BOOLEAN NOT NULL DEFAULT true,
    `bRoomPointsEnabled` BOOLEAN NOT NULL DEFAULT true,
    `roomId` INTEGER NULL,

    UNIQUE INDEX `participants_sEmail_key`(`sEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sName` VARCHAR(191) NOT NULL,
    `iScore` INTEGER NOT NULL DEFAULT 0,
    `sColor` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sName` VARCHAR(191) NOT NULL,
    `iScore` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sTextOriginal` VARCHAR(191) NOT NULL,
    `sTextEdited` VARCHAR(191) NULL,
    `bApproved` BOOLEAN NOT NULL DEFAULT false,
    `bArchived` BOOLEAN NOT NULL DEFAULT false,
    `bOnScreen` BOOLEAN NOT NULL DEFAULT false,
    `dtmCreated` DATETIME(3) NOT NULL,
    `dtmApproved` DATETIME(3) NULL,
    `dtmArchived` DATETIME(3) NULL,
    `dtmOnScreen` DATETIME(3) NULL,
    `participantId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sText` TEXT NOT NULL,
    `iMaxChoice` INTEGER NOT NULL DEFAULT 1,
    `iScore` INTEGER NOT NULL,
    `iTimerSeconds` INTEGER NOT NULL,
    `iDefaultOrder` INTEGER NULL,
    `iFrontEndOrder` INTEGER NULL,
    `eType` ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT') NOT NULL,
    `sFooterNotes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sText` VARCHAR(255) NOT NULL,
    `bCorrect` BOOLEAN NOT NULL DEFAULT false,
    `iOrder` INTEGER NOT NULL,
    `sLetter` VARCHAR(1) NOT NULL,
    `sAdditionalClasses` VARCHAR(191) NULL,
    `questionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voting_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questionId` INTEGER NOT NULL,
    `dtmStarted` DATETIME(3) NOT NULL,
    `dtmEnded` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participant_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `participantId` INTEGER NOT NULL,
    `votingSessionId` INTEGER NOT NULL,
    `dtmVoted` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sActiveCommandScreen` VARCHAR(191) NULL,
    `sActiveCommandParticipant` VARCHAR(191) NULL,
    `dtmCreated` DATETIME(3) NOT NULL,
    `bQRCodeEnabled` BOOLEAN NOT NULL DEFAULT false,
    `bTweetEnabled` BOOLEAN NOT NULL DEFAULT false,
    `sSurveyLink` VARCHAR(191) NULL,
    `currentVotingSessionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_rooms` (
    `statusId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`statusId`, `roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_questions` (
    `roomId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,

    PRIMARY KEY (`roomId`, `questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `participants` ADD CONSTRAINT `participants_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participants` ADD CONSTRAINT `participants_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweets` ADD CONSTRAINT `tweets_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `participants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voting_sessions` ADD CONSTRAINT `voting_sessions_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participant_answers` ADD CONSTRAINT `participant_answers_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `participants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participant_answers` ADD CONSTRAINT `participant_answers_votingSessionId_fkey` FOREIGN KEY (`votingSessionId`) REFERENCES `voting_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status` ADD CONSTRAINT `status_currentVotingSessionId_fkey` FOREIGN KEY (`currentVotingSessionId`) REFERENCES `voting_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_rooms` ADD CONSTRAINT `status_rooms_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_rooms` ADD CONSTRAINT `status_rooms_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_questions` ADD CONSTRAINT `room_questions_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_questions` ADD CONSTRAINT `room_questions_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
