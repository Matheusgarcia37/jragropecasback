//create index of page routes
import { Router} from 'express';
const router = Router();

import userRoutes from './user.routes';
import produtoRoutes from './produto.routes';
//rotas da aplicação

router.use('/user', userRoutes);
router.use('/produto', produtoRoutes);
export default router;
