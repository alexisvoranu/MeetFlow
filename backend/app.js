import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
// import {router} from './routes/config.js'

dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan(process.env.LOG_LEVEL || 'dev')); 

//app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serverul ruleaza la adresa http://localhost:${PORT}`);
});
