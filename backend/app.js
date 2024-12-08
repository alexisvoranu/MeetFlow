import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authenticateToken from "./middlewares/authenticateToken.js";
// import {router} from './routes/config.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.LOG_LEVEL || "dev"));

//app.use("/api/v1", router);
app.get("/participantHome", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serverul ruleaza la adresa http://localhost:${PORT}`);
});
