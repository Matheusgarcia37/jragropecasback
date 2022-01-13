import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient()
class AuthController {
    async authenticate(req: Request, res: Response) {
        const { username, password } = req.body;

        const user = await prisma.user.findFirst({ where: { username } });

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                error: 'Invalid password'
            });
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, process.env.APP_SECRET || '', {
            expiresIn: '1d'
        });

        user.password = undefined as any;


        return res.json({
            user,
            token
        });
    }

    async getUserByToken(req: Request, res: Response) {
        const { token } = req.body;
        try {
            const decodeToken: any = jwt.decode(token);
            const userId = decodeToken?.id;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            user.password = undefined as any;
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({
                error: 'Invalid token'
            });
        }
    }
}

export default new AuthController();