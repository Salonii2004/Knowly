import { useState, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  Upload as UploadIcon, 
  X, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Zap,
  Shield
} from "lucide-react";
import { pdfjs, Document, Page } from "react-pdf";
import api from "../api/api"; // Import the api instance

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentInput {
  id: string;
  title?: string;
  text?: string;
  metadata?: { source?: string; fileName?: string; size?: number; type?: string };
  status?: "pending" | "uploading" | "uploaded" | "error";
  file?: File;
  progress?: number;
  uploadedAt?: string;
}

export default function Upload() {
  const { getToken } = useAuth();
  const [docs, setDocs] = useState<DocumentInput[]>([
    { 
      id: `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`, 
      title: "", 
      text: "", 
      metadata: {}, 
      status: "pending",
      uploadedAt: new Date().toISOString()
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<number | null>(0);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // -----------------------
  // Helpers
  // -----------------------
  const generateId = () => `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const createNewDocument = (): DocumentInput => ({
    id: generateId(), 
    title: "", 
    text: "", 
    metadata: {}, 
    status: "pending",
    uploadedAt: new Date().toISOString()
  });

  const handleDocChange = useCallback((index: number, field: keyof DocumentInput, value: any) => {
    setDocs((prev) => prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc)));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    return '📎';
  };

  const extractPDFText = async (file: File, index: number) => {
    try {
      handleDocChange(index, "status", "uploading");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let text = "";
      
      // Simulate progress for PDF processing
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ");
        
        // Update progress
        const progress = Math.round((i / pdf.numPages) * 100);
        setUploadProgress(prev => ({ ...prev, [docs[index].id]: progress }));
      }
      
      handleDocChange(index, "text", text);
      handleDocChange(index, "file", file);
      handleDocChange(index, "metadata", { 
        fileName: file.name,
        size: file.size,
        type: file.type
      });
      handleDocChange(index, "status", "uploaded");
      setUploadProgress(prev => ({ ...prev, [docs[index].id]: 100 }));
    } catch (err) {
      handleDocChange(index, "status", "error");
      setError(err instanceof Error ? err.message : "Failed to parse PDF");
    }
  };

  const handleFileChange = async (index: number, file: File) => {
    if (!file) return;
    
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Only PDF and DOCX files are allowed");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    handleDocChange(index, "status", "uploading");
    setUploadProgress(prev => ({ ...prev, [docs[index].id]: 0 }));

    if (file.type === "application/pdf") {
      await extractPDFText(file, index);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        handleDocChange(index, "text", reader.result as string);
        handleDocChange(index, "file", file);
        handleDocChange(index, "metadata", { 
          fileName: file.name,
          size: file.size,
          type: file.type
        });
        handleDocChange(index, "status", "uploaded");
        setUploadProgress(prev => ({ ...prev, [docs[index].id]: 100 }));
      };
      reader.onerror = () => {
        setError("Failed to read file");
        handleDocChange(index, "status", "error");
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(index, e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleAddDoc = () => {
    const newDoc = createNewDocument();
    setDocs((prev) => [...prev, newDoc]);
    setExpandedDoc(docs.length);
  };

  const handleRemoveDoc = (index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
    setSelectedDocs(selectedDocs.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const handleToggleSelect = (index: number) => setSelectedDocs((prev) => 
    prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
  );

  const handleRemoveSelected = () => {
    setDocs((prev) => prev.filter((_, i) => !selectedDocs.includes(i)));
    setSelectedDocs([]);
  };

  const toggleExpandDoc = (index: number) => {
    setExpandedDoc(expandedDoc === index ? null : index);
  };

  // -----------------------
  // Upload Handler - FIXED
  // -----------------------
  const handleUpload = async () => {
    console.log("📤 Upload started with docs:", docs.length);
    console.log("🔑 Token present:", !!getToken());
    
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized. Please log in.");

      const formData = new FormData();
      docs.forEach((doc, index) => {
        if (doc.file) {
          console.log(`📄 Adding file ${index}:`, doc.file.name);
          formData.append("docs", doc.file, doc.file.name);
        }
        formData.append("docs_meta", JSON.stringify({
          id: doc.id,
          title: doc.title,
          text: doc.text,
          metadata: doc.metadata
        }));
      });

      console.log("🚀 Making upload request to /api/rag/upload...");
      
      // ✅ FIXED: Use the api instance with correct endpoint
      const response = await api.post('/api/rag/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ Upload successful:", response.data);
      
      setSuccess("All documents uploaded successfully!");
      setDocs([createNewDocument()]);
      setUploadProgress({});
    } catch (err: any) {
      console.error("❌ Upload failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Query Handler - FIXED
  // -----------------------
  const handleQuery = async () => {
    console.log("🔍 Query started:", query);
    console.log("🔑 Token present:", !!getToken());
    
    setSuccess(null);
    setError(null);
    setQueryResult(null);
    
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized. Please log in.");
      
      console.log("🚀 Making query request to /api/rag/query...");
      
      // ✅ FIXED: Use the api instance with correct endpoint
      const response = await api.post('/api/rag/query', { 
        query,
        model: 'mistral:latest'
      });
      
      console.log("✅ Query successful:", response.data);
      
      setQueryResult(response.data.answer || "No results found");
    } catch (err: any) {
      console.error("❌ Query failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.error || err.message || "Query failed");
    }
  };

  // -----------------------
  // File Preview Component
  // -----------------------
  const FilePreview = ({ file }: { file: File }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{file.name}</h3>
            <button 
              onClick={() => setPreviewFile(null)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-auto max-h-[70vh]">
            {file.type === "application/pdf" ? (
              <Document 
                file={file} 
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div className="text-center py-8">Loading PDF...</div>}
              >
                <Page 
                  pageNumber={currentPage} 
                  width={600} 
                  loading={<div className="text-center py-8">Loading page...</div>}
                />
              </Document>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Preview not available for DOCX files</p>
              </div>
            )}
          </div>
          
          {file.type === "application/pdf" && numPages && numPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
                disabled={currentPage >= numPages}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // -----------------------
  // Document Card Component
  // -----------------------
  const DocumentCard = ({ doc, index }: { doc: DocumentInput; index: number }) => {
    const isExpanded = expandedDoc === index;
    const progress = uploadProgress[doc.id] || 0;

    return (
      <div 
        className={`w-full max-w-4xl bg-white/95 rounded-2xl p-6 mb-6 shadow-lg border transition-all duration-300 ${
          dragActive ? "border-dashed border-indigo-500 bg-indigo-50/50" : "border-gray-200/60"
        } ${isExpanded ? 'ring-2 ring-indigo-200' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={(e) => handleDrop(e, index)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedDocs.includes(index)}
              onChange={() => handleToggleSelect(index)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {doc.title || `Document ${index + 1}`}
              </h3>
              <p className="text-sm text-gray-500">
                {doc.metadata?.fileName ? `${getFileIcon(doc.metadata.type || '')} ${doc.metadata.fileName}` : 'Untitled Document'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {doc.status === "uploading" && (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            )}
            {doc.status === "uploaded" && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {doc.status === "error" && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            
            <button 
              onClick={() => toggleExpandDoc(index)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {docs.length > 1 && (
              <button 
                onClick={() => handleRemoveDoc(index)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 animate-fadeIn">
            <input
              type="text"
              placeholder="Document Title (optional)"
              value={doc.title}
              onChange={(e) => handleDocChange(index, "title", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            
            <textarea
              placeholder="Document Text (optional)"
              value={doc.text || ""}
              onChange={(e) => handleDocChange(index, "text", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y transition-all"
              rows={4}
            />

            {/* File Upload Area */}
            <div
              className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-indigo-500 bg-indigo-50/50" 
                  : doc.file 
                    ? "border-green-200 bg-green-50/50" 
                    : "border-gray-300 bg-gray-50/50 hover:border-indigo-400"
              }`}
              onClick={() => fileInputRefs.current[index]?.click()}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleFileChange(index, e.target.files[0]);
                }}
                className="hidden"
                ref={(el) => (fileInputRefs.current[index] = el)}
              />
              
              <div className="flex flex-col items-center gap-3">
                {doc.file ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">{doc.metadata?.fileName}</p>
                      {doc.metadata?.size && (
                        <p className="text-sm text-gray-600">
                          {formatFileSize(doc.metadata.size)} • {doc.metadata.type?.split('/')[1]?.toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewFile(doc.file!); }}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        Preview
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-12 h-12 text-indigo-400" />
                    <div>
                      <p className="font-medium text-gray-700">Drag & drop or click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">PDF or DOCX files up to 10MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {doc.status === "uploading" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing...</span>
                  <span className="text-indigo-600 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-6xl text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-white rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Document Intelligence
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload, analyze, and query your documents with AI-powered insights
        </p>
      </div>

      {/* Stats & Actions */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{docs.length}</p>
              <p className="text-sm text-gray-600">Documents</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{docs.filter(d => d.status === 'uploaded').length}</p>
              <p className="text-sm text-gray-600">Processed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{selectedDocs.length}</p>
              <p className="text-sm text-gray-600">Selected</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <UploadIcon className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {docs.reduce((acc, doc) => acc + (doc.metadata?.size || 0), 0) > 0 
                  ? formatFileSize(docs.reduce((acc, doc) => acc + (doc.metadata?.size || 0), 0))
                  : '0 Bytes'
                }
              </p>
              <p className="text-sm text-gray-600">Total Size</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedDocs.length > 0 && (
        <div className="w-full max-w-6xl mb-6 flex gap-3">
          <button 
            onClick={handleRemoveSelected}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedDocs.length})
          </button>
        </div>
      )}

      {/* Document Cards */}
      <div className="w-full max-w-6xl space-y-4">
        {docs.map((doc, i) => (
          <DocumentCard key={doc.id} doc={doc} index={i} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12 mt-6">
        <button 
          onClick={handleAddDoc}
          className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all shadow-lg border border-gray-200/60 flex items-center gap-3 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New Document
        </button>
        
        <button
          onClick={handleUpload}
          disabled={loading || docs.length === 0}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-3 font-semibold"
        >
          <UploadIcon className="w-5 h-5" />
          {loading ? "Uploading..." : `Upload All (${docs.length})`}
        </button>
      </div>

      {/* Query Section */}
      <div className="w-full max-w-4xl bg-white/95 rounded-2xl p-8 shadow-lg border border-gray-200/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Search className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Ask Your Documents</h2>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="What would you like to know about your documents?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
            <button 
              onClick={handleQuery}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          {queryResult && (
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 animate-fadeIn">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">AI Response:</h4>
                  <p className="text-gray-700 leading-relaxed">{queryResult}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && <FilePreview file={previewFile} />}

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-3 z-50 max-w-sm">
        {success && (
          <div className="flex items-center gap-3 bg-green-500 text-white p-4 rounded-xl shadow-lg animate-slideIn">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-red-500 text-white p-4 rounded-xl shadow-lg animate-slideIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}