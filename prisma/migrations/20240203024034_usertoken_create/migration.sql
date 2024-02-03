-- CreateTable
CREATE TABLE "usertoken" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,

    CONSTRAINT "usertoken_pkey" PRIMARY KEY ("id")
);
