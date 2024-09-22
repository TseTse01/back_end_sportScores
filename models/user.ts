import mongoose, { Schema, Document, Model } from "mongoose";

// Définition d'une interface pour typer les utilisateurs
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// Création du schéma avec les types appropriés
const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Création du modèle mongoose typé avec IUser
const User: Model<IUser> = mongoose.model<IUser>("users", userSchema);

export default User;