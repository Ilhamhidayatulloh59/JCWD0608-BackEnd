-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "invoiceUrl" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
