import { DocumentStorageABI } from "../abi/DocumentStorageABI.js";
import { DocumentSharingABI } from "../abi/DocumentSharingABI.js";
import { createConfig, http } from "@wagmi/core";
import { injected } from "@wagmi/connectors";
import {
  writeContract,
  getAccount,
  readContract,
  reconnect,
  simulateContract,
} from "wagmi/actions";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { anvilChain } from "./customChains.js";
import toast from "react-hot-toast";
import axios from "axios";
import FormData from "form-data";

const documentStorageAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const documentSharingAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base, anvilChain],
  transports: {
    [anvilChain.id]: http("http://127.0.0.1:8545"), // Use Anvil's RPC transport
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  connectors: [injected()],
});

export const reconnectAccount = async () => {
  try {
    const result = await reconnect(config);
    return result;
  } catch (error) {
    console.error("Error reconnecting:", error);
    return null;
  }
};

export const uploadDocument = async (file) => {
  const account = getAccount(config);

  if (!account.isConnected) {
    await reconnectAccount();
    const updatedAccount = getAccount(config);

    if (!updatedAccount.isConnected) {
      toast.error("Please connect wallet");
      return false;
    }
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      toast.error("Upload Failed!");
      return false;
    }

    // use metadata received
    const { metadata } = response.data;
    const ipfsHash = metadata.ipfsHash;
    const _thumbNailHash = "";
    const fileName = metadata.fileName;
    const fileType = metadata.fileType;
    const fileSize = file.size;
    const isEncrypted = true;
    const documentHash = metadata.documentHash;

    // Simulate contract call first to check for potential errors
    const { request } = await simulateContract(config, {
      abi: DocumentStorageABI,
      address: documentStorageAddress,
      functionName: "uploadDocument",
      args: [
        ipfsHash,
        _thumbNailHash,
        fileName,
        fileType,
        fileSize,
        isEncrypted,
        documentHash,
      ],
    });

    // If simulation succeeds, proceed with actual transaction
    const result = await writeContract(config, request);

    if (result) {
      toast.success("Upload successful");
      return true; // Return true to indicate successful upload
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    toast.error(error.message || "Upload failed");
    return false;
  }

  return false;
};

export const fetchDocument = async (documentId) => {
  const account = getAccount(config);
  if (!account.isConnected) {
    await reconnectAccount();
    const updatedAccount = getAccount(config);

    if (!updatedAccount.isConnected) {
      toast.error("Please connect wallet");
      return;
    }
  }

  try {
    const result = await readContract(config, {
      abi: DocumentStorageABI,
      address: documentStorageAddress,
      functionName: "getDocument",
      args: [documentId],
      chainId: anvilChain.id,
      account: account,
    });
    if (!result) {
      throw new Error("Document not found");
    }
    toast.success("Document fetched successfully");
    return result;
  } catch (error) {
    toast.error(
      "Failed to fetch document \n Ensure it exists and you have access."
    );
    return null;
  }
};

// fetch all documents owned by the user
export const fetchAllUserDocuments = async () => {
  let account = getAccount(config);
  if (!account.isConnected) {
    await reconnectAccount();
    account = getAccount(config); // Get the updated account after reconnecting
    if (!account.isConnected) {
      toast.error("Please connect wallet");
      return [];
    }
  }

  try {
    const result = await readContract(config, {
      abi: DocumentStorageABI,
      address: documentStorageAddress,
      functionName: "getUserDocuments",
      args: [],
      chainId: anvilChain.id,
      account: account,
    });
    if (result.length === 0) {
      toast.success("No documents found\n Please upload one.");
      return [];
    }
    toast.success("Documents fetched successfully");
    return result;
  } catch (error) {
    console.error("Error fetching documents:", error);
    toast.error(
      "Failed to fetch documents \n Ensure you have access to this page."
    );
    return [];
  }
};

// share doc
export const shareDocumentWithUserByOwner = async (
  docId,
  recipient,
  isShareable
) => {
  let account = getAccount(config);
  if (!account.isConnected) {
    await reconnectAccount();
    account = getAccount(config); // Get the updated account after reconnecting
    if (!account.isConnected) {
      toast.error("Please connect wallet");
      return false;
    }
  }
  try {
    // Simulate contract call first
    const { request } = await simulateContract(config, {
      abi: DocumentSharingABI,
      address: documentSharingAddress,
      functionName: "shareDocument",
      args: [docId, recipient, isShareable],
    });

    // If simulation succeeds, proceed with the transaction
    const hash = await writeContract(config, request);
    toast.success("Document shared successfully");
    return true;
  } catch (error) {
    console.error("Error sharing document:", error);
    toast.error(error.message || "Failed to share document");
    return false;
  }
};

// share document with user by viewer of document
export const shareDocumentWithUserByViewer = async (docId, recipient) => {
  if (!docId || !recipient) {
    toast.error("Both document ID and recipient address are required");
    return false;
  }

  let account = getAccount(config);
  if (!account.isConnected) {
    await reconnectAccount();
    account = getAccount(config); // Get the updated account after reconnecting
    if (!account.isConnected) {
      toast.error("Please connect wallet");
      return false;
    }
  }

  try {
    const { request } = await simulateContract(config, {
      abi: DocumentSharingABI,
      address: documentSharingAddress,
      functionName: "shareDocumentByViewer",
      args: [docId, recipient],
    });

    const hash = await writeContract(config, request);
    toast.success("Document shared successfully");
    return true;
  } catch (error) {
    toast.error("Unauthorized to Share");
    return false;
  }
};

export const fetchSharedDocuments = async () => {
  let account = getAccount(config);
  if (!account.isConnected) {
    await reconnectAccount();
    account = getAccount(config); // Get the updated account after reconnecting
    if (!account.isConnected) {
      toast.error("Please connect wallet");
      return [];
    }
  }
  try {
    const sharedDocuments = await readContract(config, {
      abi: DocumentStorageABI,
      address: documentStorageAddress,
      functionName: "getAllSharedDocuments",
      args: [],
      chainId: anvilChain.id,
      account: account,
    });

    return sharedDocuments;
  } catch (error) {
    console.error("Error fetching shared documents:", error);
    toast.error(error.message || "Failed to fetch shared documents");
    return [];
  }
};

// delete a document
export const deleteDocument = async (docId) => {
  let account = getAccount(config);
  if (!account.isConnected) {
    await reconnectAccount();
    account = getAccount(config); // Get the updated account after reconnecting
    if (!account.isConnected) {
      toast.error("Please connect wallet");
      return false;
    }
  }

  try {
    const { request } = await simulateContract(config, {
      abi: DocumentStorageABI,
      address: documentStorageAddress,
      functionName: "deleteDocument",
      args: [docId],
    });

    const hash = await writeContract(config, request);
    toast.success("Document deleted successfully");
    return true;
  } catch (error) {
    toast.error("Unauthorized to delete");
    return false;
  }
};
