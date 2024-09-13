import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  publicKey: { type: String, required: true },
  encryptedPrivateKey: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
