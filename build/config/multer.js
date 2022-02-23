"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const storage_type = process.env.STORAGE_TYPE;
const storageTypes = {
    local: multer_1.default.diskStorage({
        destination: (req, file, cb) => { cb(null, path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads')); },
        filename: (req, file, cb) => {
            crypto_1.default.randomBytes(16, (err, hash) => {
                if (err)
                    throw new Error('Erro ao gerar hash');
                file.key = `${hash.toString('hex')}-${file.originalname}`;
                file.location = `${process.env.APP_URL}/files/${file.key}`;
                cb(null, file.key);
            });
        },
    }),
    s3: (0, multer_s3_1.default)({
        s3: new aws_sdk_1.default.S3(),
        bucket: process.env.AWS_BUCKET || "",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto_1.default.randomBytes(16, (err, hash) => {
                if (err)
                    throw new Error('Erro ao gerar hash');
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            });
        }
    })
};
exports.default = {
    dest: path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[storage_type],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new Error('Invalid file type');
        }
        cb(null, true);
    }
};
