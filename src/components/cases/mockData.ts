// Mock data for case details
export const caseMockData = {
  "CIV-2023-45": {
    id: "CIV-2023-45",
    title: "Smith vs. Albany Corp",
    type: "Civil",
    status: "pending",
    priority: "high",
    filingDate: "2023-04-12",
    description: "Plaintiff alleges breach of contract and seeks damages of $150,000 for financial losses incurred due to the defendant's failure to deliver services as specified in the agreement dated January 15, 2023.",
    plaintiff: "James Smith",
    defendant: "Albany Corporation",
    judge: "Hon. Rebecca Martinez",
    attorneys: [
      { name: "Sarah Johnson", party: "Plaintiff", firm: "Johnson & Associates" },
      { name: "Michael Williams", party: "Defendant", firm: "Williams Legal Group" }
    ],
    hearings: [
      { id: "H-1234", type: "Pre-trial Conference", date: "2023-05-15", time: "09:30 AM", location: "Courtroom 3B", virtual: true },
      { id: "H-1235", type: "Evidence Hearing", date: "2023-06-10", time: "10:00 AM", location: "Courtroom 3B", virtual: false }
    ],
    documents: [
      { id: "DOC-1", name: "Initial Complaint", date: "2023-04-12", type: "PDF", size: "1.2 MB" },
      { id: "DOC-2", name: "Response to Complaint", date: "2023-04-28", type: "PDF", size: "0.9 MB" },
      { id: "DOC-3", name: "Evidence Exhibit A", date: "2023-05-02", type: "PDF", size: "3.5 MB" }
    ],
    updates: [
      { date: "2023-04-28", user: "System", update: "Response to complaint filed by defendant" },
      { date: "2023-04-20", user: "Hon. Rebecca Martinez", update: "Pre-trial conference scheduled for May 15, 2023" },
      { date: "2023-04-12", user: "Sarah Johnson", update: "Initial complaint filed" }
    ]
  },
  "CRM-2023-28": {
    id: "CRM-2023-28",
    title: "State vs. Johnson",
    type: "Criminal",
    status: "in-progress",
    priority: "medium",
    filingDate: "2023-04-10",
    description: "Defendant charged with felony theft under state statute 18.4.401. Prosecution alleges the defendant unlawfully took property valued at approximately $5,000 from a local retail establishment on March 15, 2023.",
    plaintiff: "State",
    defendant: "Robert Johnson",
    judge: "Hon. Daniel Chen",
    attorneys: [
      { name: "Lisa Montgomery", party: "Prosecution", firm: "District Attorney's Office" },
      { name: "Thomas Baker", party: "Defense", firm: "Public Defender's Office" }
    ],
    hearings: [
      { id: "H-1236", type: "Arraignment", date: "2023-04-20", time: "11:00 AM", location: "Courtroom 5A", virtual: false, completed: true },
      { id: "H-1237", type: "Bail Hearing", date: "2023-04-25", time: "09:00 AM", location: "Courtroom 5A", virtual: false, completed: true },
      { id: "H-1238", type: "Preliminary Hearing", date: "2023-05-12", time: "10:30 AM", location: "Courtroom 5A", virtual: true }
    ],
    documents: [
      { id: "DOC-4", name: "Criminal Complaint", date: "2023-04-10", type: "PDF", size: "0.8 MB" },
      { id: "DOC-5", name: "Police Report", date: "2023-04-10", type: "PDF", size: "1.7 MB" },
      { id: "DOC-6", name: "Bail Motion", date: "2023-04-22", type: "PDF", size: "0.5 MB" }
    ],
    updates: [
      { date: "2023-04-25", user: "Hon. Daniel Chen", update: "Bail set at $10,000" },
      { date: "2023-04-20", user: "System", update: "Defendant arraigned, pleaded not guilty" },
      { date: "2023-04-10", user: "Lisa Montgomery", update: "Criminal charges filed" }
    ]
  }
}; 