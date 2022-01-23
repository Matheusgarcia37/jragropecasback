import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient()

class ProdutoController {
    async import(req: Request, res: Response) {
        const produtos = req.body;
        try {
            const resProds = [];
            for (let prod of produtos) {
                const { codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = prod;
                const res = await prisma.produto.create({
                    data: {
                        codigo_interno,
                        descricao,
                        codigo_referencia,
                        aplicacao,
                    }
                });
                resProds.push(res);
            }
            return res.status(200).json(resProds);
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: "Erro ao importar produtos"
            });
        }
    }

    async index(req: Request, res: Response) {
        try {
            const produtos = await prisma.produto.findMany();
            return res.status(200).json(produtos);
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: "Erro ao listar produtos"
            });
        }
    }
}

export default new ProdutoController();