export function convertMBToBytes(mb) {
  return BigInt(mb) * BigInt(1024) * BigInt(1024); // Convert MB to bytes correctly
}

export function formatSize(mb) {
  let bytes = convertMBToBytes(mb); // Ensure bytes is BigInt
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;

  while (bytes >= 1024n && i < units.length - 1) {
    // Use `n` for BigInt comparison
    bytes /= 1024n; // BigInt division
    i++;
  }

  return `${bytes.toString()} ${units[i]}`; // Convert BigInt to string
}

export const convertTimestampToDate = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000);

  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDocumentData = (doc) => {
  return {
    id: doc.documentHash, // Using documentHash as the ID
    name: `${doc.fileName}.${doc.fileType}`, // Concatenating filename and file type
    owner: doc.owner,
    uploadDate: convertTimestampToDate(Number(doc.timestamp)), // Convert BigInt to number
    size: formatSize(Number(doc.fileSize)), // Convert BigInt to number
    ...doc, // Keep all other properties unchanged
  };
};
