import { db } from '@/integrations/firebase/client';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

// Sample case data
const sampleCases = [
  {
    title: "Smith v. Johnson",
    type: "Civil",
    status: "in-progress",
    case_number: "CV-2025-001",
    client: "John Smith",
    created_at: new Date().toISOString(),
  },
  {
    title: "State v. Williams",
    type: "Criminal",
    status: "pending",
    case_number: "CR-2025-002",
    client: "David Williams",
    created_at: new Date().toISOString(),
  },
  {
    title: "Brown v. City Council",
    type: "Administrative",
    status: "adjourned",
    case_number: "AD-2025-003",
    client: "Sarah Brown",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Garcia Property Dispute",
    type: "Civil",
    status: "closed",
    case_number: "CV-2025-004",
    client: "Maria Garcia",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Peterson Inheritance",
    type: "Probate",
    status: "in-progress",
    case_number: "PR-2025-005",
    client: "James Peterson",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Extended sample hearing data (with more dates)
const sampleHearings = [
  // Today's hearing
  {
    caseId: "CV-2025-001",
    title: "Initial Hearing - Smith v. Johnson",
    type: "Initial Appearance",
    date: new Date().toISOString().split('T')[0],
    time: "14:30 PM",
    virtual: true,
    judge: "Judge Adams",
    participants: ["John Smith", "Jane Johnson", "Atty. Robert Clark"],
    notes: "Initial hearing to establish timeline and discovery process",
  },
  // Tomorrow's hearing
  {
    caseId: "CR-2025-002",
    title: "Arraignment - State v. Williams",
    type: "Arraignment",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "10:00 AM",
    virtual: false,
    courtroom: "Courtroom 3B",
    judge: "Judge Martinez",
    participants: ["David Williams", "Prosecutor Thompson", "Atty. Lisa Wong"],
    notes: "Formal reading of charges and plea entry",
  },
  // 3 days from now
  {
    caseId: "AD-2025-003",
    title: "Administrative Review - Brown v. City Council",
    type: "Review Hearing",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "11:15 AM",
    virtual: true,
    judge: "Judge Stevens",
    participants: ["Sarah Brown", "City Attorney Davis", "Councilwoman Rodriguez"],
    notes: "Review of administrative decision and appeal process",
  },
  // 5 days from now
  {
    caseId: "PR-2025-005",
    title: "Estate Inventory Hearing - Peterson Inheritance",
    type: "Status Conference",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "09:00 AM",
    virtual: false,
    courtroom: "Courtroom 2A",
    judge: "Judge Wilson",
    participants: ["James Peterson", "Family Attorney Chang"],
    notes: "Review of estate inventory and distribution plan",
  },
  // Next week
  {
    caseId: "CV-2025-001",
    title: "Discovery Hearing - Smith v. Johnson",
    type: "Motion Hearing",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "13:30 PM",
    virtual: true,
    judge: "Judge Adams",
    participants: ["John Smith", "Jane Johnson", "Atty. Robert Clark", "Expert Witness Dr. Taylor"],
    notes: "Hearing on motion to compel discovery documents",
  },
  // 2 weeks from now
  {
    caseId: "CR-2025-002",
    title: "Pre-Trial Conference - State v. Williams",
    type: "Pre-Trial",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "11:00 AM",
    virtual: false,
    courtroom: "Courtroom 3B",
    judge: "Judge Martinez",
    participants: ["David Williams", "Prosecutor Thompson", "Atty. Lisa Wong"],
    notes: "Final pre-trial conference before trial date",
  },
  // 3 weeks from now
  {
    caseId: "CV-2025-004",
    title: "Settlement Conference - Garcia Property",
    type: "Settlement Conference",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "14:00 PM",
    virtual: true,
    judge: "Judge Patel",
    participants: ["Maria Garcia", "Defendant's Attorney", "Mediator Wilson"],
    notes: "Attempt to reach settlement before trial",
  },
  // Next month
  {
    caseId: "CR-2025-002",
    title: "Trial - State v. Williams",
    type: "Trial",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "09:30 AM",
    virtual: false,
    courtroom: "Courtroom 5A",
    judge: "Judge Martinez",
    participants: ["David Williams", "Prosecutor Thompson", "Atty. Lisa Wong", "Jury"],
    notes: "First day of trial proceedings",
  },
];

// Sample document data
const sampleDocuments = [
  {
    caseId: "CV-2025-001",
    name: "Complaint",
    type: "Legal Filing",
    status: "Filed",
    filed_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    filed_by: "Atty. Robert Clark",
    description: "Initial complaint document detailing allegations",
    url: "https://example.com/documents/complaint-001.pdf",
  },
  {
    caseId: "CV-2025-001",
    name: "Response to Complaint",
    type: "Legal Filing",
    status: "Filed",
    filed_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    filed_by: "Defense Attorney",
    description: "Formal response to allegations in complaint",
    url: "https://example.com/documents/response-001.pdf",
  },
  {
    caseId: "CR-2025-002",
    name: "Arrest Report",
    type: "Police Record",
    status: "Filed",
    filed_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    filed_by: "Officer Johnson",
    description: "Police report detailing circumstances of arrest",
    url: "https://example.com/documents/arrest-002.pdf",
  },
  {
    caseId: "CR-2025-002",
    name: "Evidence List",
    type: "Evidence",
    status: "Filed",
    filed_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    filed_by: "Prosecutor Thompson",
    description: "Itemized list of evidence for case",
    url: "https://example.com/documents/evidence-002.pdf",
  },
  {
    caseId: "AD-2025-003",
    name: "Administrative Appeal",
    type: "Appeal",
    status: "Filed",
    filed_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    filed_by: "Atty. Michael Brown",
    description: "Formal appeal of administrative decision",
    url: "https://example.com/documents/appeal-003.pdf",
  },
];

// Function to check if data already exists to avoid duplicates
const checkDataExists = async (collectionName: string, identifierField: string, identifier: string) => {
  const q = query(collection(db, collectionName), where(identifierField, '==', identifier));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Function to upload sample data to Firestore
export const uploadSampleData = async () => {
  try {
    console.log('Starting to upload sample data to Firestore...');
    
    // Upload cases if they don't exist
    for (const caseData of sampleCases) {
      const exists = await checkDataExists('cases', 'case_number', caseData.case_number as string);
      if (!exists) {
        await addDoc(collection(db, 'cases'), {
          ...caseData,
          created_at: caseData.created_at,
          updated_at: serverTimestamp()
        });
        console.log(`Case added: ${caseData.title}`);
      } else {
        console.log(`Case already exists: ${caseData.title}`);
      }
    }
    
    // Upload hearings if they don't exist
    for (const hearingData of sampleHearings) {
      const exists = await checkDataExists('hearings', 'title', hearingData.title);
      if (!exists) {
        await addDoc(collection(db, 'hearings'), {
          ...hearingData,
          created_at: new Date().toISOString(),
          updated_at: serverTimestamp()
        });
        console.log(`Hearing added: ${hearingData.title}`);
      } else {
        console.log(`Hearing already exists: ${hearingData.title}`);
      }
    }
    
    // Upload documents if they don't exist
    for (const documentData of sampleDocuments) {
      const exists = await checkDataExists('documents', 'name', documentData.name);
      if (!exists) {
        await addDoc(collection(db, 'documents'), {
          ...documentData,
          created_at: new Date().toISOString(),
          updated_at: serverTimestamp()
        });
        console.log(`Document added: ${documentData.name}`);
      } else {
        console.log(`Document already exists: ${documentData.name}`);
      }
    }
    
    console.log('Sample data upload completed successfully.');
    return { success: true, message: 'Sample data uploaded to Firebase' };
  } catch (error) {
    console.error('Error uploading sample data:', error);
    return { 
      success: false, 
      message: `Error uploading sample data: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

export default uploadSampleData;