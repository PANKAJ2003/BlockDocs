import express from "express";
import multer from "multer";
import { encryptFile, decryptFile, generateDocumentHash, verifyDocument} from "../utils/utility.js";
import { uploadFileToPinata, getFileFromPinata } from "../utils/pinata.js";
import FileModel from "../models/fileModel.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {

        //generate document hash
        const documentHash = generateDocumentHash(req.file.buffer);
        // Encrypt file and get metadata
        const { encryptedData, encryptionData } = await encryptFile(req.file.buffer);

        // Upload to IPFS
        const pinataResponse = await uploadFileToPinata(encryptedData, {
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            metadata: {
                size: req.file.size,
                filename: req.file.originalname,
                contentType: req.file.mimetype
            }
        });

        if (!pinataResponse) {
            return res.status(500).json({ error: "IPFS upload failed" });
        }

        // Save to MongoDB
        const file = new FileModel({
            filename: req.file.originalname,
            ipfsHash: pinataResponse.IpfsHash,
            encryptionData: {
                algorithm: encryptionData.algorithm,
                key: encryptionData.key, // Will be encrypted by pre-save hook
                iv: encryptionData.iv
            },
            documentHash: documentHash
        });
        await file.save();

        return res.status(200).json({
            success: true,
            metadata: {
                ipfsHash: pinataResponse.IpfsHash,
                filename: req.file.originalname,
                documentHash: documentHash,
                fileType: req.file.mimetype,
            }
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.get("/file/:ipfsHash", async (req, res) => {
    try {
        const { ipfsHash } = req.params;
        // retrive file metadata stored in DB
        const fileMetadata = await FileModel.findOne({ ipfsHash });
        if (!fileMetadata) return res.status(404).json({ error: "File not found" });

        // Get encrypted data as Buffer
        const encryptedBuffer = await getFileFromPinata(ipfsHash);
        if (!Buffer.isBuffer(encryptedBuffer)) { // Validate Buffer
            return res.status(500).json({ error: "Invalid file data from IPFS" });
        }

        // Decrypt key and file
        const decryptedKey = fileMetadata.getDecryptedKey();
        const decryptedBuffer = await decryptFile(encryptedBuffer, {
            algorithm: fileMetadata.encryptionData.algorithm,
            key: decryptedKey,
            iv: fileMetadata.encryptionData.iv
        });

        if (!decryptedBuffer) return res.status(500).json({ error: "Decryption failed" });

        // Verify document hash
        const isValid = verifyDocument(decryptedBuffer,fileMetadata.documentHash);
        if(!isValid){
            return res.status(400).json({error: "File is tampered"});
        }

        // Send decrypted file
        res.setHeader("Content-Type", fileMetadata.encryptionData.mimetype || "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${fileMetadata.filename}"`);
        return res.send(decryptedBuffer);

    } catch (error) {
        console.error("Download error:", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

export { router as fileRouter };