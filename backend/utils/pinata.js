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

    // Directly use response.data as the Blob
    const blobData = response.data;

    // Convert the Blob to an ArrayBuffer
    const arrayBuffer = await blobData.arrayBuffer();

    // Now create a Buffer from the ArrayBuffer
    const buffer = Buffer.from(arrayBuffer);

    // Continue processing with 'buffer'
    return buffer; // or further handling
  } catch (error) {
    console.log("Error getting file from Pinata:", error);
  }
}
