// Mock data for jobs
export const jobsList = [
  {
    id: 'job1',
    property: 'Stanford GSB',
    owner: 'John Smith',
    priority: 'High',
    status: 'Pending',
    statusValue: 'pending',
    description: 'HVAC System Maintenance - Annual Service',
    requested: '2024-01-20',
    notes: 'Annual service required by vendor contract.',
    technician: 'Alice Johnson',
    techStatus: 'Not Started',
    preApprovalStatus: 'Required',
    cost: 2500,
  },
  {
    id: 'job2',
    property: 'Sunnyvale 432',
    owner: 'Mike Chen',
    priority: 'Medium',
    status: 'Approved',
    statusValue: 'approved',
    description: 'Emergency Plumbing Repair - Kitchen Sink',
    requested: '2024-01-18',
    notes: 'Owner approved after urgent call.',
    technician: 'Alice Johnson',
    techStatus: 'In Progress',
    preApprovalStatus: 'Not Required',
    cost: 850,
  },
  {
    id: 'job3',
    property: 'Downtown Lofts',
    owner: 'Alex Rodriguez',
    priority: 'Low',
    status: 'Rejected',
    statusValue: 'rejected',
    description: 'Lobby Painting',
    requested: '2024-01-10',
    notes: 'Budget not available this quarter.',
    technician: 'Alice Johnson',
    techStatus: 'Finished',
    preApprovalStatus: 'Required',
    cost: 500,
  },
  {
    id: 'job4',
    property: 'Stanford GSB',
    owner: 'John Smith',
    priority: 'Medium',
    status: 'Approved',
    statusValue: 'approved',
    description: 'Kitchen Renovation - Countertop Replacement',
    requested: '2024-01-15',
    notes: 'Replace outdated kitchen countertops with quartz.',
    technician: 'Alice Johnson',
    techStatus: 'In Progress',
    preApprovalStatus: 'Required',
    cost: 5000,
  },
  {
    id: 'job5',
    property: 'Sunnyvale 432',
    owner: 'Mike Chen',
    priority: 'High',
    status: 'Approved',
    statusValue: 'approved',
    description: 'Electrical Panel Upgrade',
    requested: '2024-01-12',
    notes: 'Upgrade electrical panel to meet current code requirements.',
    technician: 'Bob Wilson',
    techStatus: 'Not Started',
    preApprovalStatus: 'Required',
    cost: 3500,
  }
];

// Mock data for activity milestones
export const activityMilestones = [
  {
    milestone: 'Work Order Received',
    owner: 'PM',
    description: 'Initial request received from owner',
    responsibility: 'Property Manager receives and logs the work order'
  },
  {
    milestone: 'Pre-Approval Sent',
    owner: 'PM',
    description: 'Approval request sent to owner',
    responsibility: 'Property Manager sends approval request to owner'
  },
  {
    milestone: 'Pre-Approval Received',
    owner: 'PM',
    description: 'Owner approval received',
    responsibility: 'Property Manager receives and processes owner approval'
  },
  {
    milestone: 'Assigned to Technician',
    owner: 'Central Office',
    description: 'Job assigned to technician',
    responsibility: 'Central Office assigns appropriate technician based on skills and availability'
  },
  {
    milestone: 'Work Started',
    owner: 'Technician',
    description: 'Technician begins work',
    responsibility: 'Technician starts the assigned work'
  },
  {
    milestone: 'Work Completed',
    owner: 'Technician',
    description: 'Technician completes work',
    responsibility: 'Technician completes and reports work done'
  },
  {
    milestone: 'Work Verified',
    owner: 'PM',
    description: 'PM verifies completed work',
    responsibility: 'Property Manager verifies work quality and completion'
  },
  {
    milestone: 'Other',
    owner: 'PM',
    description: 'Other or custom milestone',
    responsibility: 'Track any other activity or note'
  }
];

// Mock job notes (empty for now)
export const jobNotes: { [jobId: string]: { author: string, content: string, timestamp: string }[] } = {};

// Mock activity files (empty for now)
export const activityFiles: { [key: string]: File[] } = {};

// Mock RFP/Bid data
export type RFPBid = {
  id: string;
  jobId: string;
  vendorName: string;
  vendorContact: string;
  vendorEmail: string;
  vendorPhone: string;
  bidAmount: number;
  submittedDate: string;
  estimatedDuration: string;
  scope: string;
  materials: string;
  labor: string;
  pmComments: string;
  status: 'submitted' | 'under_review' | 'selected' | 'rejected';
  attachments: string[];
  warranty: string;
  startDate: string;
  completionDate: string;
  bidLink: string;
};

export const rfpBids: { [jobId: string]: RFPBid[] } = {
  'job1': [
    {
      id: 'bid1',
      jobId: 'job1',
      vendorName: 'HVAC Pro Services',
      vendorContact: 'John Martinez',
      vendorEmail: 'john@hvacpro.com',
      vendorPhone: '(555) 123-4567',
      bidAmount: 2200,
      submittedDate: '2024-01-22',
      estimatedDuration: '2 days',
      scope: 'Complete HVAC system maintenance including filter replacement, duct cleaning, and system diagnostics',
      materials: 'New filters, cleaning supplies, replacement parts as needed',
      labor: '16 hours - 2 technicians for 2 days',
      pmComments: 'Good reputation, competitive price. Need to verify insurance.',
      status: 'under_review',
      attachments: ['hvac_maintenance_plan.pdf', 'insurance_cert.pdf'],
      warranty: '1 year on parts, 6 months on labor',
      startDate: '2024-02-01',
      completionDate: '2024-02-03',
      bidLink: 'https://hvacpro.com/bids/job1-maintenance-proposal.pdf'
    },
    {
      id: 'bid2',
      jobId: 'job1',
      vendorName: 'Climate Control Experts',
      vendorContact: 'Sarah Williams',
      vendorEmail: 'sarah@climateexperts.com',
      vendorPhone: '(555) 987-6543',
      bidAmount: 2800,
      submittedDate: '2024-01-23',
      estimatedDuration: '1.5 days',
      scope: 'Comprehensive HVAC maintenance with energy efficiency assessment',
      materials: 'Premium filters, eco-friendly cleaning agents, energy monitoring equipment',
      labor: '12 hours - 2 certified technicians',
      pmComments: 'Higher price but includes energy assessment. Premium service provider.',
      status: 'submitted',
      attachments: ['detailed_proposal.pdf', 'energy_assessment_sample.pdf'],
      warranty: '2 years on parts, 1 year on labor',
      startDate: '2024-01-28',
      completionDate: '2024-01-30',
      bidLink: 'https://climateexperts.com/proposals/stanford-hvac-bid-2024.pdf'
    },
    {
      id: 'bid3',
      jobId: 'job1',
      vendorName: 'Budget HVAC Solutions',
      vendorContact: 'Mike Thompson',
      vendorEmail: 'mike@budgethvac.com',
      vendorPhone: '(555) 456-7890',
      bidAmount: 1800,
      submittedDate: '2024-01-21',
      estimatedDuration: '3 days',
      scope: 'Basic HVAC maintenance and cleaning',
      materials: 'Standard filters, basic cleaning supplies',
      labor: '24 hours - 1 technician for 3 days',
      pmComments: 'Lowest bid but longer timeline. Need to check references.',
      status: 'rejected',
      attachments: ['basic_proposal.pdf'],
      warranty: '90 days on parts and labor',
      startDate: '2024-02-05',
      completionDate: '2024-02-08',
      bidLink: 'https://budgethvac.com/bids/stanford-basic-maintenance.pdf'
    }
  ],
  'job4': [
    {
      id: 'bid4',
      jobId: 'job4',
      vendorName: 'Premium Countertops Inc',
      vendorContact: 'Lisa Chen',
      vendorEmail: 'lisa@premiumcountertops.com',
      vendorPhone: '(555) 234-5678',
      bidAmount: 4800,
      submittedDate: '2024-01-16',
      estimatedDuration: '3 days',
      scope: 'Remove existing countertops, install new quartz countertops with undermount sink',
      materials: 'Premium quartz slabs, undermount sink, new faucet, installation hardware',
      labor: '24 hours - 2 experienced installers',
      pmComments: 'Excellent portfolio, includes sink upgrade. Slightly over budget.',
      status: 'selected',
      attachments: ['countertop_samples.pdf', 'installation_timeline.pdf'],
      warranty: '10 years on quartz, 2 years on installation',
      startDate: '2024-02-10',
      completionDate: '2024-02-13',
      bidLink: 'https://premiumcountertops.com/proposals/kitchen-renovation-stanford.pdf'
    },
    {
      id: 'bid5',
      jobId: 'job4',
      vendorName: 'Kitchen Renovations Plus',
      vendorContact: 'David Rodriguez',
      vendorEmail: 'david@kitchenreno.com',
      vendorPhone: '(555) 345-6789',
      bidAmount: 5200,
      submittedDate: '2024-01-17',
      estimatedDuration: '2 days',
      scope: 'Complete countertop replacement with premium quartz and backsplash update',
      materials: 'Premium quartz, new backsplash tiles, upgraded fixtures',
      labor: '16 hours - 3 skilled craftsmen',
      pmComments: 'Includes backsplash which is nice but pushes over budget significantly.',
      status: 'under_review',
      attachments: ['full_kitchen_proposal.pdf', 'backsplash_options.pdf'],
      warranty: '15 years on materials, 5 years on installation',
      startDate: '2024-02-15',
      completionDate: '2024-02-17',
      bidLink: 'https://kitchenreno.com/bids/stanford-premium-kitchen-renovation.pdf'
    }
  ]
};

// Collateral Hub Document Types
export type DocumentType =
  | 'vendor_contract'
  | 'warranty'
  | 'insurance_certificate'
  | 'bid_response'
  | 'receipt'
  | 'invoice'
  | 'communication_log'
  | 'compliance_doc'
  | 'other';

export type CollateralDocument = {
  id: string;
  filename: string;
  documentType: DocumentType;
  uploadDate: string;
  uploadedBy: string;
  propertyId: string;
  propertyName: string;
  glExpenseId?: string;
  tags: string[];
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  description?: string;
  expiryDate?: string;
  linkedJobId?: string;
  linkedVendor?: string;
  amount?: number;
  status?: 'active' | 'expired' | 'pending' | 'archived';
};

// Mock Collateral Documents
export const collateralDocuments: CollateralDocument[] = [
  {
    id: 'doc1',
    filename: 'HVAC_Service_Agreement_2024.pdf',
    documentType: 'vendor_contract',
    uploadDate: '2024-01-15',
    uploadedBy: 'John Smith',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    tags: ['HVAC', 'Service Agreement', 'Annual'],
    fileSize: 2048000,
    fileUrl: '/documents/hvac_service_agreement.pdf',
    thumbnailUrl: '/thumbnails/hvac_service_agreement.jpg',
    description: 'Annual HVAC maintenance service agreement',
    expiryDate: '2024-12-31',
    linkedVendor: 'HVAC Pro Services',
    status: 'active'
  },
  {
    id: 'doc2',
    filename: 'Property_Insurance_Certificate_2024.pdf',
    documentType: 'insurance_certificate',
    uploadDate: '2024-01-10',
    uploadedBy: 'Sarah Chen',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    tags: ['Insurance', 'Property', 'Liability'],
    fileSize: 1024000,
    fileUrl: '/documents/property_insurance_cert.pdf',
    thumbnailUrl: '/thumbnails/property_insurance_cert.jpg',
    description: 'Property and liability insurance certificate',
    expiryDate: '2024-12-31',
    status: 'active'
  },
  {
    id: 'doc3',
    filename: 'Kitchen_Renovation_Bid_Response.pdf',
    documentType: 'bid_response',
    uploadDate: '2024-01-20',
    uploadedBy: 'Mike Chen',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    glExpenseId: 'exp_001',
    tags: ['Kitchen', 'Renovation', 'Bid'],
    fileSize: 3072000,
    fileUrl: '/documents/kitchen_renovation_bid.pdf',
    thumbnailUrl: '/thumbnails/kitchen_renovation_bid.jpg',
    description: 'Kitchen renovation bid response from contractor',
    linkedJobId: 'job4',
    linkedVendor: 'Premium Contractors LLC',
    amount: 5000,
    status: 'active'
  },
  {
    id: 'doc4',
    filename: 'Home_Depot_Receipt_Jan_2024.pdf',
    documentType: 'receipt',
    uploadDate: '2024-01-18',
    uploadedBy: 'Alice Johnson',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    glExpenseId: 'exp_002',
    tags: ['Home Depot', 'Receipt', 'HVAC Parts'],
    fileSize: 512000,
    fileUrl: '/documents/home_depot_receipt.pdf',
    thumbnailUrl: '/thumbnails/home_depot_receipt.jpg',
    description: 'HVAC parts purchase receipt',
    linkedJobId: 'job1',
    amount: 425.00,
    status: 'active'
  },
  {
    id: 'doc5',
    filename: 'Plumbing_Warranty_Certificate.pdf',
    documentType: 'warranty',
    uploadDate: '2024-01-12',
    uploadedBy: 'Bob Wilson',
    propertyId: 'prop2',
    propertyName: 'Sunnyvale 432',
    tags: ['Plumbing', 'Warranty', 'Emergency Repair'],
    fileSize: 768000,
    fileUrl: '/documents/plumbing_warranty.pdf',
    thumbnailUrl: '/thumbnails/plumbing_warranty.jpg',
    description: 'Emergency plumbing repair warranty certificate',
    expiryDate: '2025-01-12',
    linkedJobId: 'job2',
    linkedVendor: 'Quick Fix Plumbing',
    status: 'active'
  },
  {
    id: 'doc6',
    filename: 'Electrical_Panel_Invoice_2024.pdf',
    documentType: 'invoice',
    uploadDate: '2024-01-14',
    uploadedBy: 'Central Office',
    propertyId: 'prop2',
    propertyName: 'Sunnyvale 432',
    glExpenseId: 'exp_003',
    tags: ['Electrical', 'Invoice', 'Panel Upgrade'],
    fileSize: 1536000,
    fileUrl: '/documents/electrical_invoice.pdf',
    thumbnailUrl: '/thumbnails/electrical_invoice.jpg',
    description: 'Electrical panel upgrade invoice',
    linkedJobId: 'job5',
    linkedVendor: 'Elite Electrical Services',
    amount: 3500,
    status: 'active'
  },
  {
    id: 'doc7',
    filename: 'Workers_Comp_Insurance_2024.pdf',
    documentType: 'insurance_certificate',
    uploadDate: '2024-01-08',
    uploadedBy: 'Sarah Chen',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    tags: ['Workers Comp', 'Insurance', 'Contractors'],
    fileSize: 896000,
    fileUrl: '/documents/workers_comp_insurance.pdf',
    thumbnailUrl: '/thumbnails/workers_comp_insurance.jpg',
    description: 'Workers compensation insurance certificate',
    expiryDate: '2024-12-31',
    status: 'active'
  },
  {
    id: 'doc8',
    filename: 'Owner_Communication_Log_Jan2024.pdf',
    documentType: 'communication_log',
    uploadDate: '2024-01-25',
    uploadedBy: 'John Smith',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    tags: ['Communication', 'Owner', 'Log'],
    fileSize: 640000,
    fileUrl: '/documents/owner_communication_log.pdf',
    thumbnailUrl: '/thumbnails/owner_communication_log.jpg',
    description: 'Monthly owner communication log',
    status: 'active'
  },
  {
    id: 'doc9',
    filename: 'Expired_HVAC_Warranty_2023.pdf',
    documentType: 'warranty',
    uploadDate: '2023-12-01',
    uploadedBy: 'Mike Chen',
    propertyId: 'prop2',
    propertyName: 'Sunnyvale 432',
    tags: ['HVAC', 'Warranty', 'Expired'],
    fileSize: 1024000,
    fileUrl: '/documents/expired_hvac_warranty.pdf',
    thumbnailUrl: '/thumbnails/expired_hvac_warranty.jpg',
    description: 'HVAC equipment warranty (expired)',
    expiryDate: '2023-12-31',
    linkedVendor: 'Old HVAC Company',
    status: 'expired'
  },
  {
    id: 'doc10',
    filename: 'Compliance_Report_Q4_2023.pdf',
    documentType: 'compliance_doc',
    uploadDate: '2024-01-05',
    uploadedBy: 'Central Office',
    propertyId: 'prop1',
    propertyName: 'Stanford GSB',
    tags: ['Compliance', 'Q4', 'Report'],
    fileSize: 2560000,
    fileUrl: '/documents/compliance_report_q4.pdf',
    thumbnailUrl: '/thumbnails/compliance_report_q4.jpg',
    description: 'Quarterly compliance report',
    status: 'active'
  }
];

// Document type labels for UI
export const documentTypeLabels: Record<DocumentType, string> = {
  vendor_contract: 'Vendor Contract',
  warranty: 'Warranty',
  insurance_certificate: 'Insurance Certificate',
  bid_response: 'Bid Response',
  receipt: 'Receipt',
  invoice: 'Invoice',
  communication_log: 'Communication Log',
  compliance_doc: 'Compliance Document',
  other: 'Other'
};

// Property options for filters
export const propertyOptions = [
  { id: 'prop1', name: 'Stanford GSB' },
  { id: 'prop2', name: 'Sunnyvale 432' },
  { id: 'prop3', name: 'Downtown Lofts' },
  { id: 'prop4', name: 'Redwood Shores' }
];

// Staff options for filters
export const staffOptions = [
  { id: 'staff1', name: 'John Smith' },
  { id: 'staff2', name: 'Sarah Chen' },
  { id: 'staff3', name: 'Mike Chen' },
  { id: 'staff4', name: 'Alice Johnson' },
  { id: 'staff5', name: 'Bob Wilson' },
  { id: 'staff6', name: 'Central Office' }
];

// Mock data for Advanced Payment Tools

// Bank accounts data
export const bankAccounts = [
  {
    id: 'bank1',
    name: 'Wells Fargo Business Account',
    accountNumber: '****1234',
    routingNumber: '121000248',
    status: 'linked',
    balance: 25000,
    type: 'checking'
  },
  {
    id: 'bank2',
    name: 'Chase Business Savings',
    accountNumber: '****5678',
    routingNumber: '021000021',
    status: 'linked',
    balance: 150000,
    type: 'savings'
  },
  {
    id: 'bank3',
    name: 'Bank of America Business',
    accountNumber: '****9012',
    routingNumber: '026009593',
    status: 'not_linked',
    balance: 0,
    type: 'checking'
  }
];

// Owner trust accounts data
export const ownerTrustAccounts = [
  {
    id: 'trust1',
    propertyName: 'Stanford GSB',
    ownerName: 'John Smith',
    accountNumber: '****3456',
    bankName: 'Wells Fargo',
    status: 'linked',
    autoSync: true,
    balance: 45000
  },
  {
    id: 'trust2',
    propertyName: 'Sunnyvale 432',
    ownerName: 'Mike Chen',
    accountNumber: '****7890',
    bankName: 'Chase',
    status: 'linked',
    autoSync: true,
    balance: 32000
  },
  {
    id: 'trust3',
    propertyName: 'Downtown Lofts',
    ownerName: 'Alex Rodriguez',
    accountNumber: '****2345',
    bankName: 'Bank of America',
    status: 'not_linked',
    autoSync: false,
    balance: 0
  }
];

// Invoices data
export const invoices = [
  {
    id: 'inv1',
    vendor: 'ABC Plumbing',
    amount: 1250.00,
    dueDate: '2025-02-15',
    origin: 'Direct',
    status: 'pending',
    description: 'Emergency plumbing repair - Stanford GSB',
    linkedExpenseId: 'exp1',
    propertyName: 'Stanford GSB',
    invoiceNumber: 'INV-2025-001'
  },
  {
    id: 'inv2',
    vendor: 'HVAC Solutions Inc',
    amount: 2500.00,
    dueDate: '2025-02-20',
    origin: 'PM',
    status: 'pending',
    description: 'Annual HVAC maintenance service',
    linkedExpenseId: 'exp2',
    propertyName: 'Stanford GSB',
    invoiceNumber: 'INV-2025-002'
  },
  {
    id: 'inv3',
    vendor: 'Electrical Works LLC',
    amount: 875.50,
    dueDate: '2025-02-10',
    origin: 'Direct',
    status: 'pending',
    description: 'Electrical panel upgrade - Sunnyvale 432',
    linkedExpenseId: 'exp3',
    propertyName: 'Sunnyvale 432',
    invoiceNumber: 'INV-2025-003'
  }
];

// Credit card data
export const creditCards = [
  {
    id: 'cc1',
    name: 'Company Amex Gold',
    lastFour: '1234',
    type: 'internal',
    balance: 3240.50,
    dueDate: '2025-02-15',
    linkedAccount: 'bank1'
  },
  {
    id: 'cc2',
    name: 'Chase Business Card',
    lastFour: '5678',
    type: 'internal',
    balance: 1850.75,
    dueDate: '2025-02-20',
    linkedAccount: 'bank2'
  },
  {
    id: 'cc3',
    name: 'External Vendor Card',
    lastFour: '9012',
    type: 'external',
    balance: 425.00,
    dueDate: '2025-02-12',
    linkedAccount: null
  }
];

// Team members for reimbursement
export const teamMembers = [
  {
    id: 'team1',
    name: 'Alice Johnson',
    role: 'Technician',
    email: 'alice.johnson@company.com',
    personalExpenses: [
      {
        id: 'exp1',
        date: '2025-01-15',
        vendor: 'Home Depot',
        amount: 67.50,
        description: 'Emergency plumbing supplies',
        status: 'pending_reimbursement',
        receipt: true,
        propertyName: 'Stanford GSB'
      },
      {
        id: 'exp2',
        date: '2025-01-18',
        vendor: 'AutoZone',
        amount: 45.25,
        description: 'Van maintenance supplies',
        status: 'pending_reimbursement',
        receipt: true,
        propertyName: 'General'
      }
    ]
  },
  {
    id: 'team2',
    name: 'Bob Wilson',
    role: 'Technician',
    email: 'bob.wilson@company.com',
    personalExpenses: [
      {
        id: 'exp3',
        date: '2025-01-20',
        vendor: 'Lowes',
        amount: 124.75,
        description: 'Electrical supplies for emergency repair',
        status: 'pending_reimbursement',
        receipt: true,
        propertyName: 'Sunnyvale 432'
      }
    ]
  },
  {
    id: 'team3',
    name: 'Sarah Chen',
    role: 'Property Manager',
    email: 'sarah.chen@company.com',
    personalExpenses: [
      {
        id: 'exp4',
        date: '2025-01-12',
        vendor: 'Office Depot',
        amount: 89.99,
        description: 'Office supplies for property management',
        status: 'pending_reimbursement',
        receipt: true,
        propertyName: 'General'
      }
    ]
  }
]; 