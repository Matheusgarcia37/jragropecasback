-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_marcaId_fkey";

-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "codigo_referencia" DROP NOT NULL,
ALTER COLUMN "aplicacao" DROP NOT NULL,
ALTER COLUMN "marcaId" DROP NOT NULL,
ALTER COLUMN "preco" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;
