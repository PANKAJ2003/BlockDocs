import { PinataSDK } from "pinata-web3";
import dotenv from "dotenv";
dotenv.config();

// setup a pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});
export async function uploadFileToPinata(encryptedData, fileInfo) {
  try {
    const file = new File([encryptedData], fileInfo.name || "encrypted-file", {
      type: fileInfo.mimetype || "application/octet-stream",
    });

    //upload to pinata
    const result = await pinata.upload.file(file, {
      name: fileInfo.name,
      metadata: {
        ...fileInfo.metadata,
        encrypted: true,
        timestamp: new Date().toISOString(),
      },
    });

    return result;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    return;
  }
}

// get file from pinata
export async function getFileFromPinata(ipfsHash) {
  try {
    const response = await pinata.gateways.get(ipfsHash);

    if (!response || !response.data) {
      throw new Error("File not found on Pinata");
    }

    const blobData = response.data;
    const arrayBuffer = await blobData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  } catch (error) {
    console.error("Error getting file from Pinata:", error.message || error);
    throw new Error("Failed to get file from Pinata");
  }
}

// delete file from pinata
export async function deleteFileFromPinata(ipfsHash) {
  try {
    const unpin = await pinata.unpin([ipfsHash]);
  } catch (error) {
    console.error("Error deleting file from Pinata:", error);
    return null;
  }
}
