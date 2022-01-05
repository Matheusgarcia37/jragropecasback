import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient()

class UserController {
    async store(req: Request, res: Response) {
        const { username, password } = req.body;
    
        const userExist = await prisma.user.findFirst({
            where: {
                username
            }
        })
        if(userExist) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        //hash password
        const hash = await bcrypt.hash(password, 8);

        const user = await prisma.user.create({
            data: {
                username,
                password: hash
            }
        });

        return res.json(user);
    }

    async index(req: Request, res: Response) {
        const users = await prisma.user.findMany();
        return res.json(users);
    }
}

export default new UserController();