import {
  Share2,
  Trash2,
  Eye,
  MoreVertical,
  Download,
  FileText,
  Users,
} from "lucide-react";
import { useAccount } from "wagmi";
const DocumentRow = ({
  doc,
  downloadOrSeeFileHandler,
  openShareWindowHandler,
  deleteFileHandler,
}) => {
  const { address } = useAccount();
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{doc.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Owner: {doc.owner}</span>
              <span>Modified: {doc.uploadDate}</span>
              <span>{doc.size}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {doc.owner === address && (
            <div className="p-2 rounded-full hover:bg-gray-100">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
          )}
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              downloadOrSeeFileHandler(doc, "see");
            }}
          >
            <Eye className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              openShareWindowHandler(doc);
            }}
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              downloadOrSeeFileHandler(doc, "download");
            }}
          >
            <Download className="h-5 w-5 text-gray-600" />
          </button>
          {doc.owner === address && (
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => {
                deleteFileHandler(doc);
              }}
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          )}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentRow;
