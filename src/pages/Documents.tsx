
import { useState } from "react";
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
  UserPlus 
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

// Mock document data
const documents = [
  { id: "DOC-1234", name: "Initial Complaint - Smith vs. Albany Corp", type: "pdf", caseId: "CIV-2023-45", size: "1.2 MB", uploadedBy: "Sarah Johnson", uploadDate: "2023-04-12", category: "Pleading" },
  { id: "DOC-1235", name: "Response to Complaint - Albany Corp", type: "pdf", caseId: "CIV-2023-45", size: "0.9 MB", uploadedBy: "Michael Williams", uploadDate: "2023-04-28", category: "Pleading" },
  { id: "DOC-1236", name: "Evidence Exhibit A - Contract Copy", type: "pdf", caseId: "CIV-2023-45", size: "3.5 MB", uploadedBy: "Sarah Johnson", uploadDate: "2023-05-02", category: "Evidence" },
  { id: "DOC-1237", name: "Criminal Complaint - State vs. Johnson", type: "pdf", caseId: "CRM-2023-28", size: "0.8 MB", uploadedBy: "Lisa Montgomery", uploadDate: "2023-04-10", category: "Complaint" },
  { id: "DOC-1238", name: "Police Report - Johnson Case", type: "pdf", caseId: "CRM-2023-28", size: "1.7 MB", uploadedBy: "Lisa Montgomery", uploadDate: "2023-04-10", category: "Report" },
  { id: "DOC-1239", name: "Bail Motion - Johnson Defense", type: "pdf", caseId: "CRM-2023-28", size: "0.5 MB", uploadedBy: "Thomas Baker", uploadDate: "2023-04-22", category: "Motion" },
  { id: "DOC-1240", name: "Custody Agreement Draft", type: "docx", caseId: "FAM-2023-15", size: "0.4 MB", uploadedBy: "Jennifer Lee", uploadDate: "2023-04-08", category: "Agreement" },
  { id: "DOC-1241", name: "Financial Disclosures", type: "xlsx", caseId: "FAM-2023-15", size: "0.7 MB", uploadedBy: "Jennifer Lee", uploadDate: "2023-04-07", category: "Disclosure" },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const role = useUserRole();
  
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
            <UploadDocumentDialog />
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
                    {filteredDocuments.length > 0 ? (
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
                          No documents found
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
                  {documents
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
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className={`h-4 w-4 text-red-500 ${className}`} />;
    case "docx":
    case "doc":
      return <FileText className={`h-4 w-4 text-blue-500 ${className}`} />;
    case "xlsx":
    case "xls":
      return <FileText className={`h-4 w-4 text-green-500 ${className}`} />;
    default:
      return <File className={`h-4 w-4 ${className}`} />;
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
          <span>Preview</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          <span>Add to Favorites</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canEdit && (
          <>
            <DropdownMenuItem>
              <PenLine className="mr-2 h-4 w-4" />
              <span>Edit Metadata</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Move to Folder</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DocumentCardProps {
  document: typeof documents[0];
}

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-md bg-muted">
          <DocumentIcon type={document.type} className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate" title={document.name}>
            {document.name}
          </h3>
          <div className="text-sm text-muted-foreground">
            {document.caseId} • {document.size}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <Badge variant="outline">{document.category}</Badge>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function UploadDocumentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-1 h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload case-related documents to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="document-case">Associated Case</Label>
            <Input id="document-case" placeholder="Enter or select case ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title</Label>
            <Input id="document-title" placeholder="Enter document title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-category">Document Category</Label>
            <Input id="document-category" placeholder="E.g., Pleading, Evidence, Motion" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-description">Description (Optional)</Label>
            <Textarea id="document-description" placeholder="Brief description of the document" />
          </div>
          <div className="space-y-2">
            <Label>File</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center hover:bg-muted transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
              <p className="text-xs text-muted-foreground mb-3">Support PDF, Word, Excel files up to 20MB</p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Access Control</Label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <UserPlus className="h-3 w-3 mr-1" />
                Add Users
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Link className="h-3 w-3 mr-1" />
                Generate Share Link
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Upload Document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
