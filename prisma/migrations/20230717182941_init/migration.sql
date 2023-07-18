/*
  Warnings:

  - Changed the type of `cargo` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cargo",
ADD COLUMN     "cargo" TEXT NOT NULL;
