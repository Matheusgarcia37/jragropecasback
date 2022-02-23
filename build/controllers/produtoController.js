"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ProdutoController {
    import(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const produtos = req.body;
            try {
                const resProds = [];
                for (let prod of produtos) {
                    const { codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = prod;
                    //procurar um produto com o mesmo codigo interno
                    const produto = yield prisma.produto.findUnique({
                        where: {
                            codigo_interno
                        }
                    });
                    if (produto) {
                        //atualizar o produto
                        produto.descricao = descricao;
                        produto.codigo_referencia = codigo_referencia;
                        produto.aplicacao = aplicacao;
                        yield prisma.produto.update({
                            where: {
                                id: produto.id
                            },
                            data: produto,
                        });
                        resProds.push(produto);
                    }
                    else {
                        //criar um novo produto
                        const res = yield prisma.produto.create({
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
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: "Erro ao importar produtos"
                });
            }
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = req.body;
                const responseProduto = yield prisma.produto.create({
                    data: {
                        codigo_interno,
                        descricao,
                        codigo_referencia,
                        aplicacao,
                    }
                });
                const { files } = req;
                if (files && files.length > 0) {
                    for (let file of files) {
                        const { key, originalname, encoding, mimetype, destination, path, size, location: url = "" } = file;
                        yield prisma.upload.create({
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
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: "Erro ao cadastrar produto"
                });
            }
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const produtos = yield prisma.produto.findMany({
                    include: {
                        uploads: true
                    }
                });
                return res.status(200).json(produtos);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: "Erro ao listar produtos"
                });
            }
        });
    }
    getProdutoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const produto = yield prisma.produto.findUnique({
                    where: { id },
                    include: {
                        uploads: true
                    }
                });
                if (produto) {
                    return res.status(200).json(produto);
                }
                else {
                    return res.status(400).json({
                        error: 'Produto não encontrado'
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: 'Produto não encontrado'
                });
            }
        });
    }
    alter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, codigo_interno, descricao, codigo_referencia, aplicacao, marca, preco } = req.body;
            const { files } = req;
            try {
                const produto = yield prisma.produto.findUnique({
                    where: { id }
                });
                if (produto) {
                    produto.codigo_interno = codigo_interno;
                    produto.descricao = descricao;
                    produto.codigo_referencia = codigo_referencia;
                    produto.aplicacao = aplicacao;
                    //produto.marca = marca;
                    produto.preco = Number(preco);
                    yield prisma.produto.update({
                        where: {
                            id
                        },
                        data: produto
                    });
                    if (files && files.length > 0) {
                        for (let file of files) {
                            const { key, originalname, encoding, mimetype, destination, path, size, location: url = "" } = file;
                            yield prisma.upload.create({
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
                }
                else {
                    return res.status(400).json({
                        error: 'Produto não encontrado'
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: 'Produto não encontrado'
                });
            }
        });
    }
    alterImagesOfProd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const { files } = req;
            //delete uploads
            const uploads = yield prisma.upload.findMany({
                where: {
                    Produto: {
                        id
                    }
                }
            });
            for (let upload of uploads) {
                yield prisma.upload.delete({
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
                            }
                            else {
                                console.log(data);
                            }
                        });
                    }
                }
                else {
                    const { key } = upload;
                    if (key) {
                        console.log("key", key);
                        (fs_1.default.unlink)(path_1.default.resolve(__dirname, "..", "..", "tmp", "uploads", key), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }
            }
            try {
                if (files && files.length > 0) {
                    for (let file of files) {
                        const { key, originalname, encoding, mimetype, destination, path, size, location: url = "" } = file;
                        yield prisma.upload.create({
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
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: 'Produto não encontrado'
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                //delete uploads
                const uploads = yield prisma.upload.findMany({
                    where: {
                        Produto: {
                            id
                        }
                    }
                });
                for (let upload of uploads) {
                    yield prisma.upload.delete({
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
                                }
                                else {
                                    console.log(data);
                                }
                            });
                        }
                    }
                    else {
                        const { key } = upload;
                        if (key) {
                            console.log("key", key);
                            (fs_1.default.unlink)(path_1.default.resolve(__dirname, "..", "..", "tmp", "uploads", key), (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    }
                }
                //delete produto
                yield prisma.produto.delete({
                    where: {
                        id
                    }
                });
                return res.status(200).json({
                    message: 'Produto deletado'
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({
                    error: 'Produto não encontrado'
                });
            }
        });
    }
    deleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleteImage");
            const { id } = req.params;
            try {
                const upload = yield prisma.upload.findUnique({
                    where: {
                        id
                    }
                });
                if (upload) {
                    yield prisma.upload.delete({
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
                                }
                                else {
                                    console.log(data);
                                }
                            });
                        }
                    }
                    else {
                        const { key } = upload;
                        if (key) {
                            (fs_1.default.unlink)(path_1.default.resolve(__dirname, "..", "..", "tmp", "uploads", key), (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    }
                    return res.status(200).json({
                        message: 'Imagem deletada'
                    });
                }
                else {
                    return res.status(400).json({
                        error: 'Imagem não encontrada'
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: 'Imagem não encontrada'
                });
            }
        });
    }
}
exports.default = new ProdutoController();
