import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  Eye, 
  File, 
  FileText, 
  Filter, 
  FolderOpen, 
  Link, 
  MoreHorizontal, 
  PenLine, 
  Search, 
  Share2, 
  Star, 
  Trash2, 
  Upload, 
  UserPlus,
  Plus,
  Image as ImageIcon,
  FileIcon,
  Table2,
  Terminal,
  Package,
  Music,
  Video,
  Trash,
  Edit,
  UploadCloud,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserRole } from "@/hooks/useUserRole";
import { db } from "@/integrations/firebase/client";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

// Define document type
interface Document {
  id: string;
  name: string;
  type: string;
  caseId: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const role = useUserRole();
  
  // Fetch documents from Firebase
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "documents"), 
          orderBy("created_at", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure uploadDate exists for UI display
          uploadDate: doc.data().uploadDate || doc.data().created_at
        })) as Document[];
        
        setDocuments(docsData);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents");
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [toast]);
  
  const filteredDocuments = documents.filter(
    doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Dashboard>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
            <p className="text-muted-foreground">
              Upload, organize, and access all case-related documents
            </p>
          </div>
          
          <div className="flex space-x-2">
            <UploadDocumentDialog onDocumentUploaded={(doc) => {
              setDocuments(prev => [doc, ...prev]);
              toast({
                title: "Document Uploaded",
                description: "Your document has been successfully uploaded."
              });
            }} />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="shared">Shared with Me</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">All Documents</CardTitle>
                <CardDescription>
                  All documents available in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading documents...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredDocuments.length > 0 ? (
                      filteredDocuments.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium flex items-center">
                            <DocumentIcon type={doc.type} className="mr-2 flex-shrink-0" />
                            <span className="truncate max-w-[200px]" title={doc.name}>
                              {doc.name}
                            </span>
                          </TableCell>
                          <TableCell>{doc.caseId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.category}</Badge>
                          </TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell>{doc.uploadedBy}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <DocumentActionsDropdown canEdit={role === "judge" || role === "clerk"} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          {searchQuery ? 
                            "No documents matching your search" : 
                            "No documents found. Upload your first document."
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Recent Documents</CardTitle>
                <CardDescription>
                  Recently added or modified documents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="border rounded-md p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-muted rounded-md animate-pulse"></div>
                          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        </div>
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/3 animate-pulse"></div>
                      </div>
                    ))
                  ) : documents
                    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                    .slice(0, 6)
                    .map(doc => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Favorites</CardTitle>
                <CardDescription>
                  Your favorite documents for quick access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="mb-4">Mark documents as favorites for quick access</p>
                  <Button variant="outline">Browse All Documents</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shared">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Shared with Me</CardTitle>
                <CardDescription>
                  Documents shared with you by other users
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="w-12 h-12 mx-auto mb-4 text-muted" />
                  <h3 className="text-lg font-medium mb-2">No shared documents</h3>
                  <p>Documents shared with you will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}

interface DocumentIconProps {
  type: string;
  className?: string;
}

function DocumentIcon({ type, className = "" }: DocumentIconProps) {
  const iconProps = { className: `h-5 w-5 ${className}` };
  
  switch (type.toLowerCase()) {
    case 'pdf':
      return <FileIcon {...iconProps} />;
    case 'doc':
    case 'docx':
    case 'text':
    case 'txt':
      return <FileText {...iconProps} />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <Table2 {...iconProps} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <ImageIcon {...iconProps} />;
    case 'zip':
    case 'rar':
      return <Package {...iconProps} />;
    case 'mp3':
    case 'wav':
      return <Music {...iconProps} />;
    case 'mp4':
    case 'mov':
      return <Video {...iconProps} />;
    case 'html':
    case 'js':
    case 'css':
    case 'json':
      return <Terminal {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
}

function DocumentActionsDropdown({ canEdit = false }: { canEdit?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          Add to Favorites
        </DropdownMenuItem>
        
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Properties
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-md bg-muted">
            <DocumentIcon type={document.type} />
          </div>
          <div>
            <h3 className="font-medium truncate" title={document.name}>{document.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {document.category} • {document.size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(document.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex space-x-2 mt-4">
        <Button variant="outline" size="sm" className="w-full">
          <Eye className="mr-1 h-3 w-3" />
          View
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Download className="mr-1 h-3 w-3" />
          Download
        </Button>
      </div>
    </div>
  );
}

interface UploadDocumentDialogProps {
  onDocumentUploaded?: (document: Document) => void;
}

function UploadDocumentDialog({ onDocumentUploaded }: UploadDocumentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally handle the actual file upload to storage
    // and then create a document record in Firestore
    
    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock document for demo
      const newDocument: Document = {
        id: `DOC-${Date.now()}`,
        name: "New Uploaded Document.pdf",
        type: "pdf",
        caseId: "CIV-2023-45",
        size: "1.5 MB",
        uploadedBy: "Current User",
        uploadDate: new Date().toISOString(),
        category: "Evidence",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Trigger callback if provided
      if (onDocumentUploaded) {
        onDocumentUploaded(newDocument);
      }
      
      setIsOpen(false);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to associate with a case
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpload}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Document File</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 hover:bg-muted/80"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX up to 10MB
                    </p>
                  </div>
                  <input id="file-upload" type="file" className="hidden" />
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="case">Associated Case</Label>
              <select
                id="case"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="CIV-2023-45">CIV-2023-45 - Smith vs. Albany Corp</option>
                <option value="CRM-2023-28">CRM-2023-28 - State vs. Johnson</option>
                <option value="FAM-2023-15">FAM-2023-15 - Thompson Custody</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Document Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Pleading">Pleading</option>
                <option value="Evidence">Evidence</option>
                <option value="Motion">Motion</option>
                <option value="Report">Report</option>
                <option value="Order">Court Order</option>
                <option value="Disclosure">Disclosure</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of the document"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
