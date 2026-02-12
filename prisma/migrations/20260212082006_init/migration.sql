/*
  Warnings:

  - You are about to drop the column `promptss` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "promptss",
ADD COLUMN     "prompts" INTEGER NOT NULL DEFAULT 0;
