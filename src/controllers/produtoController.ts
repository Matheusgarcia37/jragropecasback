import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient()
import aws from 'aws-sdk';
const s3 = new aws.S3();
import fs from 'fs';
import path from 'path';
type File = {
    filename: string;
    key: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    path: string;
    size: number;
    location: string;
}

class ProdutoController {
    async import(req: Request, res: Response) {
        const produtos = req.body;
        try {
            const resProds = [];
            for (let prod of produtos) {
                const { codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = prod;
                //procurar um produto com o mesmo codigo interno
                const produto = await prisma.produto.findUnique({
                    where: {
                        codigo_interno
                    }
                });

                if(produto) {
                    //atualizar o produto
                    produto.descricao = descricao;
                    produto.codigo_referencia = codigo_referencia;
                    produto.aplicacao = aplicacao;
                    await prisma.produto.update({
                        where: {
                            id: produto.id
                        },
                        data: produto,
                    });
                    resProds.push(produto);
                } else {
                    //criar um novo produto
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
            }
            return res.status(200).json(resProds);
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: "Erro ao importar produtos"
            });
        }
    }

    async store(req: Request, res: Response) {
        try {
            const { codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = req.body;
            const responseProduto = await prisma.produto.create({
                data: {
                    codigo_interno,
                    descricao,
                    codigo_referencia,
                    aplicacao,
                }
            });

            const { files } = req;
            if (files && files.length > 0) {
                for (let file of files as unknown as File[]) {
                    const { key, originalname, encoding, mimetype, destination, path, size, location: url = "" } = file;
                    await prisma.upload.create({
                        data: {
                            name: originalname,
                            key,
                            url,
                            Produto: {
                                connect: {
                                    id: responseProduto.id
                                }
                            }
                        }
                    });
                }
            }
            return res.status(200).json(responseProduto);
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: "Erro ao cadastrar produto"
            });
        }
    }

    async index(req: Request, res: Response) {
        try {
            const produtos = await prisma.produto.findMany({
                include: {
                    uploads: true
                }
            });
            return res.status(200).json(produtos);
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: "Erro ao listar produtos"
            });
        }
    }

    async getProdutoById(req: Request, res: Response) {
        const { id } = req.body;
        try {
            const produto: any = await prisma.produto.findUnique({
                where: { id },
                include: {
                    uploads: true
                }
            })
            if (produto) {
                return res.status(200).json(produto);
            } else {
                return res.status(400).json({
                    error: 'Produto não encontrado'
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: 'Produto não encontrado'
            });
        }
    }

    async alter(req: Request, res: Response) {
        const { id, codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = req.body;
        const { files } = req;
        try {
            const produto: any = await prisma.produto.findUnique({
                where: { id }
            })
            if (produto) {
                produto.codigo_interno = codigo_interno;
                produto.descricao = descricao;
                produto.codigo_referencia = codigo_referencia;
                produto.aplicacao = aplicacao;
                //produto.marca = marca;
                produto.preco = Number(preco);
                await prisma.produto.update({
                    where: {
                        id
                    },
                    data: produto
                });

                if (files && files.length > 0) {
                    for (let file of files as unknown as File[]) {
                        const { key, originalname, encoding, mimetype, destination, path, size, location: url = "" } = file;
                        await prisma.upload.create({
                            data: {
                                name: originalname,
                                key,
                                url,
                                Produto: {
                                    connect: {
                                        id
                                    }
                                }
                            }
                        });
                    }
                }

                return res.status(200).json({
                    message: 'Produto Atualizado'
                });
            } else {
                return res.status(400).json({
                    error: 'Produto não encontrado'
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: 'Produto não encontrado'
            });
        }
    }

    async alterImagesOfProd(req: Request, res: Response) {
        const { id } = req.body;
        const { files } = req;
        
         //delete uploads
         const uploads = await prisma.upload.findMany({
            where: {
                Produto: {
                    id
                }
            }
        });
        for (let upload of uploads) {
            await prisma.upload.delete({
                where: {
                    id: upload.id
                }
            });

            //delete file
            if (process.env.STORAGE_TYPE === 's3') {
                const { key } = upload;
                if (process.env.AWS_BUCKET) {
                    const params = {
                        Bucket: process.env.AWS_BUCKET,
                        Key: key
                    };
                    s3.deleteObject(params, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(data);
                        }
                    });
                }
            } else {
                const { key } = upload;

                if (key) {
                    console.log("key", key);
                    (fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", key), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        }
        
        try {
            if (files && files.length > 0) {
                for (let file of files as unknown as File[]) {
                    const { key, originalname, encoding, mimetype, destination, path, size, location: url = "" } = file;
                    await prisma.upload.create({
                        data: {
                            name: originalname,
                            key,
                            url,
                            Produto: {
                                connect: {
                                    id
                                }
                            }
                        }
                    });
                }
            }

            return res.status(200).json({
                message: 'Produto Atualizado'
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: 'Produto não encontrado'
            });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.body;
        try {
            //delete uploads
            const uploads = await prisma.upload.findMany({
                where: {
                    Produto: {
                        id
                    }
                }
            });
            for (let upload of uploads) {
                await prisma.upload.delete({
                    where: {
                        id: upload.id
                    }
                });

                //delete file
                if (process.env.STORAGE_TYPE === 's3') {
                    const { key } = upload;
                    if (process.env.AWS_BUCKET) {
                        const params = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: key
                        };
                        s3.deleteObject(params, (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                            }
                        });
                    }
                } else {
                    const { key } = upload;

                    if (key) {
                        console.log("key", key);
                        (fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", key), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }
            }

            //delete produto
            await prisma.produto.delete({
                where: {
                    id
                }
            });

            return res.status(200).json({
                message: 'Produto deletado'
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: 'Produto não encontrado'
            });
        }
    }


    async deleteImage(req: Request, res: Response) {
        console.log("deleteImage");
        const { id } = req.params;
        try {
            const upload = await prisma.upload.findUnique({
                where: {
                    id
                }
            });
            if (upload) {
                await prisma.upload.delete({
                    where: {
                        id
                    }
                });

                if (process.env.STORAGE_TYPE === 's3') {
                    const { key } = upload;
                    if (process.env.AWS_BUCKET) {
                        const params = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: key
                        };
                        s3.deleteObject(params, (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                            }
                        });
                    }
                } else {
                    const { key } = upload;

                    if (key) {
                        (fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", key), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }

                return res.status(200).json({
                    message: 'Imagem deletada'
                });
            } else {
                return res.status(400).json({
                    error: 'Imagem não encontrada'
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: 'Imagem não encontrada'
            });
        }
    }
}

export default new ProdutoController();