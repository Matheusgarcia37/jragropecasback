"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/files', express_1.default.static(path_1.default.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(routes_1.default);
exports.default = app;
