/*
  Warnings:

  - You are about to drop the column `prompts` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "prompts",
ADD COLUMN     "promptss" INTEGER NOT NULL DEFAULT 0;
