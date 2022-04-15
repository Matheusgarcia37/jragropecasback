//create index of page routes
import { Router} from 'express';
const router = Router();

import userRoutes from './user.routes';
import produtoRoutes from './produto.routes';
//rotas da aplicação

router.use('/user', userRoutes);
router.use('/produto', produtoRoutes);

router.get('/', (re, res) => {
    return res.status(200).send({ message: 'Bem vindo ao app jr-agropecas.' });
})
export default router;
