export const DocumentSharingABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_documentStorage",
        type: "address",
        internalType: "address",
      },
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
    name: "hasAccess",
    inputs: [
      { name: "_docId", type: "uint256", internalType: "uint256" },
      { name: "_viewer", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revokeDocumentAccess",
    inputs: [
      { name: "_docId", type: "uint256", internalType: "uint256" },
      { name: "_viewer", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "shareDocument",
    inputs: [
      { name: "_docId", type: "uint256", internalType: "uint256" },
      { name: "_viewer", type: "address", internalType: "address" },
      { name: "_sharable", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "shareDocumentByViewer",
    inputs: [
      { name: "_docId", type: "uint256", internalType: "uint256" },
      { name: "_viewer", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DocumentShared",
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
    name: "RevokedDocumentAccess",
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
    type: "error",
    name: "DocumentSharing_AlreadyHasAccess",
    inputs: [],
  },
  {
    type: "error",
    name: "DocumentSharing_UnauthorizedAccess",
    inputs: [],
  },
  {
    type: "error",
    name: "DocumentSharing_UnauthorizedAccess_ToShare",
    inputs: [],
  },
];
