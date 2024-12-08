import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "../middlewares/Key.json" assert { type: "json" };

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
