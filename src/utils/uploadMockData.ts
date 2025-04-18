import { db } from "@/integrations/firebase/client";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";

// Import mock data
import { caseMockData } from "@/components/cases/CaseDetail";

// Document mock data
const documentMockData = [
  { id: "DOC-1234", name: "Initial Complaint - Smith vs. Albany Corp", type: "pdf", caseId: "CIV-2023-45", size: "1.2 MB", uploadedBy: "Sarah Johnson", uploadDate: "2023-04-12", category: "Pleading" },
  { id: "DOC-1235", name: "Response to Complaint - Albany Corp", type: "pdf", caseId: "CIV-2023-45", size: "0.9 MB", uploadedBy: "Michael Williams", uploadDate: "2023-04-28", category: "Pleading" },
  { id: "DOC-1236", name: "Evidence Exhibit A - Contract Copy", type: "pdf", caseId: "CIV-2023-45", size: "3.5 MB", uploadedBy: "Sarah Johnson", uploadDate: "2023-05-02", category: "Evidence" },
  { id: "DOC-1237", name: "Criminal Complaint - State vs. Johnson", type: "pdf", caseId: "CRM-2023-28", size: "0.8 MB", uploadedBy: "Lisa Montgomery", uploadDate: "2023-04-10", category: "Complaint" },
  { id: "DOC-1238", name: "Police Report - Johnson Case", type: "pdf", caseId: "CRM-2023-28", size: "1.7 MB", uploadedBy: "Lisa Montgomery", uploadDate: "2023-04-10", category: "Report" },
  { id: "DOC-1239", name: "Bail Motion - Johnson Defense", type: "pdf", caseId: "CRM-2023-28", size: "0.5 MB", uploadedBy: "Thomas Baker", uploadDate: "2023-04-22", category: "Motion" },
  { id: "DOC-1240", name: "Custody Agreement Draft", type: "docx", caseId: "FAM-2023-15", size: "0.4 MB", uploadedBy: "Jennifer Lee", uploadDate: "2023-04-08", category: "Agreement" },
  { id: "DOC-1241", name: "Financial Disclosures", type: "xlsx", caseId: "FAM-2023-15", size: "0.7 MB", uploadedBy: "Jennifer Lee", uploadDate: "2023-04-07", category: "Disclosure" },
];

// Hearing mock data
const hearingMockData = [
  { id: "H-1234", caseId: "CIV-2023-45", title: "Smith vs. Albany Corp", type: "Pre-trial Conference", date: "2023-04-20", time: "09:30", virtual: true, judge: "Hon. Rebecca Martinez" },
  { id: "H-1235", caseId: "CRM-2023-28", title: "State vs. Johnson", type: "Hearing", date: "2023-04-20", time: "11:00", virtual: true, judge: "Hon. Daniel Chen" },
  { id: "H-1236", caseId: "FAM-2023-15", title: "Thompson Custody", type: "Mediation", date: "2023-04-22", time: "14:00", virtual: false, judge: "Hon. Rebecca Martinez" },
  { id: "H-1237", caseId: "CIV-2023-42", title: "Roberts vs. City Council", type: "Status Conference", date: "2023-04-25", time: "10:00", virtual: true, judge: "Hon. Rebecca Martinez" },
  { id: "H-1238", caseId: "CRM-2023-27", title: "State vs. Williams", type: "Arraignment", date: "2023-04-21", time: "09:00", virtual: false, judge: "Hon. Daniel Chen" },
];

/**
 * Uploads all mock data to Firebase Firestore
 */
export const uploadAllMockData = async () => {
  try {
    console.log("Starting upload of mock data to Firebase...");
    
    // Upload cases
    await uploadCaseMockData();
    
    // Upload documents
    await uploadDocumentMockData();
    
    // Upload hearings
    await uploadHearingMockData();
    
    console.log("Successfully uploaded all mock data to Firebase!");
    return { success: true };
  } catch (error) {
    console.error("Error uploading mock data:", error);
    return { success: false, error };
  }
};

/**
 * Upload case mock data to Firebase
 */
const uploadCaseMockData = async () => {
  const batch = writeBatch(db);
  
  // Convert the case mock data object to an array
  const caseDataArray = Object.values(caseMockData);
  
  // Add each case to the batch
  caseDataArray.forEach(caseData => {
    const caseRef = doc(db, "cases", caseData.id);
    
    // Convert case data to proper format
    const formattedCase = {
      id: caseData.id,
      title: caseData.title,
      type: caseData.type,
      status: caseData.status,
      priority: caseData.priority,
      created_at: new Date(caseData.filingDate).toISOString(),
      updated_at: new Date().toISOString(),
      description: caseData.description,
      plaintiff: caseData.plaintiff,
      defendant: caseData.defendant,
      judge_id: caseData.judge,
      case_number: caseData.id
    };
    
    batch.set(caseRef, formattedCase);
  });
  
  // Commit the batch
  await batch.commit();
  console.log(`Successfully uploaded ${caseDataArray.length} cases`);
};

/**
 * Upload document mock data to Firebase
 */
const uploadDocumentMockData = async () => {
  const batch = writeBatch(db);
  
  // Add each document to the batch
  documentMockData.forEach(docData => {
    const docRef = doc(db, "documents", docData.id);
    
    // Add created_at and updated_at fields
    const formattedDoc = {
      ...docData,
      created_at: new Date(docData.uploadDate).toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    batch.set(docRef, formattedDoc);
  });
  
  // Commit the batch
  await batch.commit();
  console.log(`Successfully uploaded ${documentMockData.length} documents`);
};

/**
 * Upload hearing mock data to Firebase
 */
const uploadHearingMockData = async () => {
  const batch = writeBatch(db);
  
  // Add each hearing to the batch
  hearingMockData.forEach(hearingData => {
    const hearingRef = doc(db, "hearings", hearingData.id);
    
    // Format the hearing data
    const formattedHearing = {
      ...hearingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      duration: 30, // default 30 minutes
      location: "Courtroom 3B", // default location
    };
    
    batch.set(hearingRef, formattedHearing);
  });
  
  // Commit the batch
  await batch.commit();
  console.log(`Successfully uploaded ${hearingMockData.length} hearings`);
};

export default uploadAllMockData; 