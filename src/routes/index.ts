//create index of page routes
import { Router} from 'express';
const router = Router();

import userRoutes from './user.routes';

//rotas da aplicação

router.use('/user', userRoutes);

export default router;
