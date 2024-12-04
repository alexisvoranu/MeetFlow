import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan(process.env.LOG_LEVEL || 'dev')); 

import indexRoutes from './routes/script.js';
app.use('/', indexRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serverul ruleaza la adresa http://localhost:${PORT}`);
});
