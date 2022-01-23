-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "codigo_interno" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "codigo_referencia" TEXT NOT NULL,
    "aplicacao" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produto_codigo_interno_key" ON "Produto"("codigo_interno");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nome_key" ON "Marca"("nome");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
