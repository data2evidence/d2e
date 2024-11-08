import express from 'npm:express'
import { DBRouter } from './DBRouter.ts';
const app = express()

app.use(express.json())
app.use('/gateway/api/alpdb', new DBRouter().router);
app.listen(8000);