import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
// Mise en place de la connexion avec la BDD via une variable d'environnement
const connectionString: string | undefined = process.env.CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Connection string is undefined");
}


mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error: ", error));