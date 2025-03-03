import { useState, useEffect, useRef } from "react";
import BlockDocsLogo from "../assets/BlockDocsLogo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Files, Upload, Search, X } from "lucide-react";
import axios from "axios";
import { useAccount } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import {
  uploadDocument,
  fetchAllUserDocuments,
  reconnectAccount,
  fetchSharedDocuments,
} from "../utils/contract.jsx";
import { formatDocumentData } from "../utils/utils.js";
import DocumentRow from "../components/DocumentRow.jsx";
import ShareWindow from "../components/ShareWindow.jsx";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("my-documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedDocument, setSearchedDocument] = useState(null);
  const [myDocuments, setMyDocuments] = useState([]);
  const [sharedDocumentsWithMe, setSharedDocumentsWithMe] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isShareWindowOpen, setIsShareWindowOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const account = useAccount();

  const fileInputRef = useRef(null);

  const documents =
    activeTab === "my-documents" ? myDocuments : sharedDocumentsWithMe;

  // Function to fetch documents
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllUserDocuments();
      if (result) {
        setMyDocuments(result.map(formatDocumentData));
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSharedDocumentsWithMe = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSharedDocuments();
      if (result) {
        setSharedDocumentsWithMe(result.map(formatDocumentData));
      }
    } catch (error) {
      console.error("Error fetching shared documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Try to reconnect if needed
      if (!account.isConnected) {
        await reconnectAccount();
      }

      fetchDocuments();
      fetchSharedDocumentsWithMe();
    };

    // Add a small delay to ensure wallet connection is established
    const timer = setTimeout(() => {
      initializeData();
    }, 500);

    return () => {
      clearTimeout(timer);
      setMyDocuments([]);
      setSharedDocumentsWithMe([]);
    };
  }, [account.address, account.isConnected]);

  const handleUploadDocument = () => {
    // This line opens the file manager/file selection dialog
    fileInputRef.current.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    if (e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      // Pass the selected file to your uploadDocument function
      const success = await uploadDocument(file);
      if (success) {
        setTimeout(() => {
          fetchDocuments();
        }, 2000);
      }
    } catch (error) {
      console.error("Error in upload process:", error);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // Handle search functionality
  const handleSearchDocument = (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchedDocument(null);
      return;
    }
    const filteredDocs = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchedDocument(filteredDocs.length > 0 ? filteredDocs : null);
  };

  const downloadOrSeeFileHandler = async (doc, action) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/file/${doc.ipfsHash}`,
            {
              responseType: "blob", // Get response as a file (binary)
            },
          );
          const blob = response.data;
          const url = URL.createObjectURL(blob);

          if (action === "see") {
            window.open(url, "_blank"); // Open file in a new tab
          } else if (action === "download") {
            const a = document.createElement("a");
            a.href = url;
            a.download = doc.name || "downloadedFile";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }

          // Release the object URL after some time
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (error) {
          console.error("File not found:", error);
          throw new Error("File not found");
        }
      })(),
      {
        loading: "Downloading...",
        success: <b>Download complete!</b>,
        error: <b>Failed to download file.</b>,
      },
    );
  };

  const openShareWindowHandler = (doc) => {
    setSelectedDocument(doc);
    setIsShareWindowOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isShareWindowOpen && (
        <ShareWindow
          doc={selectedDocument}
          onClose={() => setIsShareWindowOpen(false)}
          activeTab={activeTab}
        />
      )}
      <div>
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
      </div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={BlockDocsLogo} alt="BlockDocs Logo" className="h-10 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevents form submission behavior
                      handleSearchDocument(searchQuery);
                    }
                  }}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "my-documents"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("my-documents")}
            >
              My Documents
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "shared-with-me"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("shared-with-me")}
            >
              Shared with Me
            </button>
          </div>
          {/* Hidden file input that opens the file manager */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isUploading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={handleUploadDocument}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Document
              </>
            )}
          </button>
        </div>
        {/* Manual refresh button */}
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            onClick={fetchDocuments}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 mr-1 border-t-2 border-blue-600 rounded-full"></div>
            ) : (
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Refresh
          </button>
        </div>
        {/* {Searched Document} */}
        {searchedDocument && (
          <div className="bg-blue-100 border border-blue-300 shadow-md rounded-xl p-4 my-6">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Search Result
              </h2>
              <button
                className="text-gray-600 hover:text-gray-900 transition"
                onClick={() => setSearchedDocument(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {searchedDocument.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  downloadOrSeeFileHandler={downloadOrSeeFileHandler}
                  openShareWindowHandler={openShareWindowHandler}
                />
              ))}
            </div>
          </div>
        )}
        {/* Document List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <Files className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500">
                {activeTab === "my-documents"
                  ? "Upload your first document to get started"
                  : "No documents have been shared with you yet"}
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                downloadOrSeeFileHandler={downloadOrSeeFileHandler}
                openShareWindowHandler={openShareWindowHandler}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
