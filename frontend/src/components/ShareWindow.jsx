import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import {
  shareDocumentWithUserByOwner,
  shareDocumentWithUserByViewer,
} from "../utils/contract.jsx";

const ShareWindow = ({ doc, onClose, activeTab }) => {
  const [address, setAddress] = useState("");
  const [allowResharing, setAllowResharing] = useState(false);
  const [isResharable, setIsResharable] = useState();

  // UseEffect to set resharing permissions based on the active tab
  useEffect(() => {
    if (activeTab === "my-documents") {
      setIsResharable(true);
    } else if (activeTab === "shared-with-me") {
      setIsResharable(doc.isSharableByViewer);
    }
  }, [activeTab, doc.isSharableByViewer]);

  // Validate the Ethereum address format
  const isValidAddress = (address) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();

      if (!address.trim()) {
        alert("Please enter a valid wallet address");
        return;
      }

      if (!isValidAddress(address)) {
        alert("Please enter a valid Ethereum address");
        return;
      }

      // Show loading or validation here if needed
      if (activeTab === "my-documents") {
        await shareDocumentWithUserByOwner(doc.id, address, allowResharing);
      } else {
        await shareDocumentWithUserByViewer(doc.id, address);
      }
      onClose();
    },
    [activeTab, doc.id, address, allowResharing, onClose]
  );

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleAddressChange = (e) => setAddress(e.target.value);

  const handleResharingChange = () => setAllowResharing((prev) => !prev);

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-xl max-w-full rounded-2xl shadow-xl p-6 transform transition-all"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Share Document</h2>
          <div onClick={handleClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="recipient-address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recipient&apos;s Wallet Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="recipient-address"
                value={address}
                onChange={handleAddressChange}
                required
                placeholder="0x1234...abcd"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 py-1">
            <div className="relative inline-block">
              <input
                type="checkbox"
                id="allow-resharing"
                checked={allowResharing}
                onChange={handleResharingChange}
                disabled={!isResharable}
                className="peer sr-only"
              />
              <label
                htmlFor="allow-resharing"
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500"
              >
                {allowResharing && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </label>
            </div>
            <span
              className={`font-medium ${
                isResharable ? "text-gray-700 " : "text-gray-400"
              }`}
            >
              Allow resharing
            </span>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-4"
            onClick={submitHandler}
          >
            Share Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareWindow;
