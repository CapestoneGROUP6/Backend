/*
  Warnings:

  - You are about to drop the column `Usercol` on the `user` table. All the data in the column will be lost.
  - Added the required column `OTP` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `EMAIL` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `Usercol`,
    ADD COLUMN `OTP` INTEGER NOT NULL,
    MODIFY `EMAIL` VARCHAR(45) NOT NULL;
