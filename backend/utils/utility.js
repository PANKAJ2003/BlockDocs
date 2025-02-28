import crypto, { verify } from "crypto";
export const encryptFile = async (fileBuffer) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // create cipher
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    // encrypt the data
    const encryptedBuffer = Buffer.concat([
      iv, // for later decryption
      cipher.update(fileBuffer),
      cipher.final(),
    ]);

    return {
      encryptedData: encryptedBuffer,
      encryptionData: {
        algorithm,
        key: key.toString("hex"),
        iv: iv.toString("hex"),
      },
    };
  } catch (error) {
    console.error("Error encrypting file:", error);
  }
};

export const decryptFile = async (encryptedBuffer, encryptionData) => {
  if (!Buffer.isBuffer(encryptedBuffer)) {
    // Validate input
    console.error("Invalid encryptedBuffer: Expected Buffer");
    return null;
  }

  try {
    const { algorithm, key, iv } = encryptionData;
    const keyBuffer = Buffer.from(key, "hex");
    const ivBuffer = Buffer.from(iv, "hex");

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer), // ✅ Now a valid Buffer
      decipher.final(),
    ]);

    return decryptedBuffer;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export const generateDocumentHash = (fileBuffer) => {
  try {
    const documentHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");
    return documentHash;
  } catch (error) {
    console.error("Error generating document hash:", error);
  }
};

export const verifyDocument = (fileBuffer, storedHash) => {
  if (!fileBuffer || storedHash) {
    console.error(
      "❌Failed to verify document! FileBuffer or storedHash is missing"
    );
  }
  try {
    const documentHash = generateDocumentHash(fileBuffer);
    if (documentHash !== storedHash) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in verifying document: ", error);
  }
};
