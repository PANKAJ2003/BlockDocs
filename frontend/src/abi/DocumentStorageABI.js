export const DocumentStorageABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_accessControlManager",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addSharedDocumentByViewer",
    inputs: [
      {
        name: "_viewer",
        type: "address",
        internalType: "address",
      },
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addSharedDocumentToUserByOwner",
    inputs: [
      {
        name: "_viewer",
        type: "address",
        internalType: "address",
      },
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deleteDocument",
    inputs: [
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllSharedDocuments",
    inputs: [
      {
        name: "_viewer",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct DocumentStorage.Document[]",
        components: [
          {
            name: "ipfsHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "thumbNailHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fileName",
            type: "string",
            internalType: "string",
          },
          {
            name: "fileType",
            type: "string",
            internalType: "string",
          },
          {
            name: "fileSize",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "isEncrypted",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "documentHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "isVerified",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isDeleted",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isSharableByViewer",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllSharedDocumentsIdToUser",
    inputs: [
      {
        name: "_viewer",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDocument",
    inputs: [
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct DocumentStorage.Document",
        components: [
          {
            name: "ipfsHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "thumbNailHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fileName",
            type: "string",
            internalType: "string",
          },
          {
            name: "fileType",
            type: "string",
            internalType: "string",
          },
          {
            name: "fileSize",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "isEncrypted",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "documentHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "isVerified",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isDeleted",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isSharableByViewer",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDocumentOwner",
    inputs: [
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMsgSender",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserDocuments",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct DocumentStorage.Document[]",
        components: [
          {
            name: "ipfsHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "thumbNailHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "timestamp",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fileName",
            type: "string",
            internalType: "string",
          },
          {
            name: "fileType",
            type: "string",
            internalType: "string",
          },
          {
            name: "fileSize",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "isEncrypted",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "documentHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "isVerified",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isDeleted",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "isSharableByViewer",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUsersHavingDocAccess",
    inputs: [
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasDocAccess",
    inputs: [
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_viewer",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeSharedDocumentForUser",
    inputs: [
      {
        name: "_viewer",
        type: "address",
        internalType: "address",
      },
      {
        name: "_docId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "uploadDocument",
    inputs: [
      {
        name: "_ipfsHash",
        type: "string",
        internalType: "string",
      },
      {
        name: "_thumbNailHash",
        type: "string",
        internalType: "string",
      },
      {
        name: "_fileName",
        type: "string",
        internalType: "string",
      },
      {
        name: "_fileType",
        type: "string",
        internalType: "string",
      },
      {
        name: "_fileSize",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_isEncrypted",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "_documentHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DocumentAccessGranted",
    inputs: [
      {
        name: "docId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "viewer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DocumentDeleted",
    inputs: [
      {
        name: "docId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DocumentUploaded",
    inputs: [
      {
        name: "docId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "ipfsHash",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "DocumentStorage_AlreadyHasAccess",
    inputs: [],
  },
  {
    type: "error",
    name: "DocumentStorage_DocumentDoesNotExist",
    inputs: [],
  },
  {
    type: "error",
    name: "DocumentStorage_FileAlreadyDeleted",
    inputs: [],
  },
  {
    type: "error",
    name: "DocumentStorage_UnauthorizedAccess",
    inputs: [],
  },
];
