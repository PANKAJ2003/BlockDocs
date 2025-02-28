import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variable
if (!process.env.ENCRYPTION_SECRET) {
    throw new Error("ENCRYPTION_SECRET environment variable is missing");
}

// Generate 32-byte secret key as Buffer
const SECRET_KEY = crypto.createHash("sha256")
    .update(process.env.ENCRYPTION_SECRET)
    .digest(); // Returns Buffer

const ALGORITHM = "aes-256-cbc";

// Encrypt the file encryption key
function encryptKey(key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(key, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted; // Store IV with encrypted key
}

// Decrypt the file encryption key
function decryptKey(encryptedKey) {
    const [iv, encrypted] = encryptedKey.split(":");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    encryptionData: {
        algorithm: { type: String, required: true },
        key: { type: String, required: true }, // Encrypted key
        iv: { type: String, required: true }    // IV for file encryption
    },
    documentHash: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

// Encrypt key before saving to DB
FileSchema.pre("save", function (next) {
    if (this.isModified("encryptionData.key") && this.encryptionData?.key) {
        this.encryptionData.key = encryptKey(this.encryptionData.key);
    }
    next();
});

// Method to retrieve decrypted key
FileSchema.methods.getDecryptedKey = function () {
    return decryptKey(this.encryptionData.key);
};

const FileModel = mongoose.model("File", FileSchema);
export default FileModel;