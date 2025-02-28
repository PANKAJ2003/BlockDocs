import { DocumentStorageABI } from "../abi/DocumentStorageABI.js";
import { createConfig, http } from "@wagmi/core";
import { injected } from "@wagmi/connectors";
import {
  writeContract,
  getAccount,
  readContract,
  reconnect,
} from "wagmi/actions";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { anvilChain } from "./customChains.js";
import toast from "react-hot-toast";

const documentStorageAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
  console.log("File: ", file);

  const account = getAccount(config);

  if (!account.isConnected) {
    await reconnectAccount();
    const updatedAccount = getAccount(config);

    if (!updatedAccount.isConnected) {
      toast.error("Please connect wallet");
      return false;
    }
  }

  const ipfsHash = "QmQvzdefcae";
  const _thumbNailHash = "AFefadfda";
  const fileName = "first";
  const fileType = "pdf";
  const fileSize = 1024;
  const isEncrypted = true;
  const documentHash =
    "0xf4c67563f8888d8d3e88142d6320ed41e47c7f894af7153ccbdb4fb6d16bc5fc";

  try {
    const result = await writeContract(config, {
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
    if (result) {
      toast.success("Upload successful");
      return true; // Return true to indicate successful upload
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    toast.error("Upload failed");
    return false;
  }

  return false;
};

export const fetchDocument = async (documentId) => {
  console.log(documentId);
  const account = getAccount(config);
  console.log(account);

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

export const fetchAllUserDocuments = async () => {
  let account = getAccount(config);
  console.log("Initial Account:", account);

  if (!account.isConnected) {
    console.log("Attempting to reconnect...");
    await reconnectAccount();
    account = getAccount(config); // Get the updated account after reconnecting
    console.log("Account after reconnect:", account);

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
