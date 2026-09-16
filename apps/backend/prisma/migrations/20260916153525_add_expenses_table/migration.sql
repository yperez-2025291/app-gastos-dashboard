-- CreateEnum
CREATE TYPE "DeductionType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "AppliesTo" AS ENUM ('FIXED', 'INVOICED', 'TOTAL');

-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "fixedSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invoicedIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_deductions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeductionType" NOT NULL DEFAULT 'PERCENTAGE',
    "value" DOUBLE PRECISION NOT NULL,
    "appliesTo" "AppliesTo" NOT NULL DEFAULT 'INVOICED',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_deductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_budgets" (
    "id" TEXT NOT NULL,
    "budgetedAmount" DOUBLE PRECISION NOT NULL,
    "budgetId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budgets_userId_month_year_key" ON "budgets"("userId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "category_budgets_budgetId_categoryId_key" ON "category_budgets"("budgetId", "categoryId");

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_deductions" ADD CONSTRAINT "tax_deductions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_budgets" ADD CONSTRAINT "category_budgets_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_budgets" ADD CONSTRAINT "category_budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
