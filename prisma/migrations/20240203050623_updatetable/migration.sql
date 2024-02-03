/*
  Warnings:

  - You are about to drop the column `user` on the `usertoken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `usertoken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `usertoken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `usertoken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usertoken" DROP COLUMN "user",
ADD COLUMN     "login" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usertoken_login_key" ON "usertoken"("login");

-- CreateIndex
CREATE UNIQUE INDEX "usertoken_token_key" ON "usertoken"("token");
