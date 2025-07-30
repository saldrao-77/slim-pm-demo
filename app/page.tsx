"use client"

import React from "react"
import { useRouter } from 'next/navigation'
import { DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import {
  DollarSign,
  FileText,
  Mail,
  Receipt,
  Settings,
  Eye,
  Download,
  Building,
  CheckCircle,
  AlertCircle,
  Zap,
  Flag,
  ExternalLink,
  FolderSyncIcon as Sync,
  Database,
  FileSpreadsheet,
  Send,
  RefreshCw,
  Clock,
  MoreVertical,
  CreditCard,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  User,
  Calendar,
  Folder,
  Phone,
  Home,
  Trash2,
  StickyNote,
  ChevronRight,
  Paperclip,
  Sparkles,
  DownloadCloud,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Plus,
  Pencil,
  BarChart3,
  Award,
  AlertTriangle,
  ChevronDown,
  Edit,
  BookOpen,
  Check,
  HelpCircle,
  FileArchive,
  Upload,
  Grid,
  List,
  Tag,
  Bot,
  FileImage,
  FileCheck,
  FileWarning,
  Archive,
  Calendar as CalendarIcon,
  ExternalLink as LinkIcon,
  Calculator,
  Info,
  Save
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { jobsList, activityMilestones, jobNotes, activityFiles, collateralDocuments, documentTypeLabels, propertyOptions, areaOptions, staffOptions, DocumentType, CollateralDocument, bankAccounts, ownerTrustAccounts, invoices, creditCards, teamMembers } from './mockData';

// Sample staff list
const staffList = [
  { id: 'tech1', name: 'Alice Johnson', phone: '555-111-2222', email: 'alice.johnson@email.com' },
  { id: 'tech2', name: 'Bob Martinez', phone: '555-333-4444', email: 'bob.martinez@email.com' },
  { id: 'tech3', name: 'Carlos Lee', phone: '555-555-6666', email: 'carlos.lee@email.com' },
]

// Add transactions type and data near the top with other data definitions
type Transaction = {
  id: string
  date: string
  vendor: string
  amount: number
  status: 'reconciled' | 'pending'
  billable: boolean
  jobId: string
  madeBy: string
  cardHolder?: string // Add card holder information
  memo?: string
  receipt?: string
  expenseType?: 'credit_card' | 'invoice' // Track expense type
  invoiceNumber?: string // For invoice expenses
  dueDate?: string // For invoice expenses
  supportingDocs?: string[] // Array of uploaded document names
  flaggedForApproval?: boolean // Whether invoice is flagged for C.O./owner approval
  flaggedTo?: 'co' | 'owner' // Who the invoice is flagged to
  flaggedReason?: string // Reason for flagging
}

// Enhanced Card Types
type CardType = 'virtual' | 'physical';
type CardStatus = 'active' | 'inactive' | 'blocked' | 'pending';

type EnhancedCard = {
  id: string;
  type: CardType;
  number: string;
  holder: string;
  position: 'PM' | 'Technician' | 'Super' | 'Admin';
  balance: number;
  limit: number;
  status: CardStatus;
  assignedProperties: string[]; // Property IDs
  vendorRestrictions: string[]; // Vendor names or categories
  isExistingCard: boolean; // For connected Amex, etc.
  brand: 'Amex' | 'Chase' | 'Visa' | 'Mastercard';
  expiryDate: string;
  lastUsed?: string;
  monthlySpend: number;
  assignedStaff: string[]; // Staff member IDs
};

// Enhanced Expense Request Types
type ExpenseRequest = {
  id: string;
  technicianName: string;
  expenseId: string;
  question: string;
  amount: number;
  vendor: string;
  date: string;
  urgency: 'low' | 'normal' | 'high';
  status: 'pending' | 'approved' | 'denied';
  type: 'billable_question' | 'approval_required' | 'policy_clarification' | 'receipt_issue' | 'amount_verification';
  createdAt: string;
  aiSuggestion: string;
  category: string;
  property?: string;
  workOrder?: string;
};

const transactionsList: Transaction[] = [
  {
    id: 'txn1',
    date: '2025-01-15',
    vendor: 'Home Depot',
    amount: 150.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job1',
    madeBy: 'John Smith',
    cardHolder: 'John Smith',
    memo: 'HVAC parts',
    receipt: 'receipt1.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn2',
    date: '2025-01-16',
    vendor: 'Lowes',
    amount: 75.50,
    status: 'pending',
    billable: true,
    jobId: 'job1',
    madeBy: 'Sarah Johnson',
    cardHolder: 'Sarah Johnson',
    memo: 'Paint supplies',
    receipt: 'receipt2.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn3',
    date: '2025-01-17',
    vendor: 'Ace Hardware',
    amount: 45.25,
    status: 'reconciled',
    billable: false,
    jobId: 'job1',
    madeBy: 'Alice Johnson',
    cardHolder: 'Alice Johnson',
    memo: 'Tools',
    receipt: 'receipt3.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn4',
    date: '2025-01-18',
    vendor: 'Office Depot',
    amount: 125.75,
    status: 'pending',
    billable: true,
    jobId: 'job2',
    madeBy: 'Mike Chen',
    cardHolder: 'Mike Chen',
    memo: 'Office supplies',
    receipt: 'receipt4.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn5',
    date: '2025-01-19',
    vendor: 'Staples',
    amount: 89.99,
    status: 'reconciled',
    billable: false,
    jobId: 'job2',
    madeBy: 'Lisa Wong',
    cardHolder: 'Lisa Wong',
    memo: 'Paper and ink',
    receipt: 'receipt5.pdf',
    expenseType: 'credit_card'
  },
  // Invoice Expenses
  {
    id: 'inv1',
    date: '2025-01-20',
    vendor: 'ABC Electrical Services',
    amount: 2500.00,
    status: 'pending',
    billable: true,
    jobId: 'job5',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'INV-2025-001',
    dueDate: '2025-02-19',
    memo: 'Electrical panel upgrade for Sunnyvale 432',
    supportingDocs: ['invoice-ABC-001.pdf', 'work-authorization.pdf'],
    flaggedForApproval: true,
    flaggedTo: 'co',
    flaggedReason: 'Large electrical work requires Central Office approval'
  },
  {
    id: 'inv2',
    date: '2025-01-18',
    vendor: 'Premier HVAC Solutions',
    amount: 3200.00,
    status: 'pending',
    billable: true,
    jobId: 'job1',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'HVAC-2025-0045',
    dueDate: '2025-02-17',
    memo: 'Annual HVAC maintenance and repair',
    supportingDocs: ['hvac-invoice-045.pdf', 'maintenance-report.pdf'],
    flaggedForApproval: true,
    flaggedTo: 'owner',
    flaggedReason: 'Amount exceeds $3000 limit - requires owner approval'
  },
  {
    id: 'inv3',
    date: '2025-01-22',
    vendor: 'Professional Cleaning Co',
    amount: 850.00,
    status: 'reconciled',
    billable: false,
    jobId: 'job3',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'PCC-2025-078',
    dueDate: '2025-02-21',
    memo: 'Deep cleaning after lobby renovation',
    supportingDocs: ['cleaning-invoice-078.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv4',
    date: '2025-01-21',
    vendor: 'City Building Inspector',
    amount: 450.00,
    status: 'pending',
    billable: true,
    jobId: 'job4',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'CBI-2025-123',
    dueDate: '2025-02-05',
    memo: 'Kitchen renovation permit and inspection fees',
    supportingDocs: ['permit-invoice-123.pdf', 'inspection-schedule.pdf'],
    flaggedForApproval: true,
    flaggedTo: 'co',
    flaggedReason: 'Government fee - requires Central Office processing'
  },
  {
    id: 'inv5',
    date: '2025-01-17',
    vendor: 'Luxury Countertops Inc',
    amount: 4200.00,
    status: 'pending',
    billable: true,
    jobId: 'job4',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'LCI-2025-890',
    dueDate: '2025-03-15',
    memo: 'Quartz countertop installation for kitchen renovation',
    supportingDocs: ['countertop-invoice-890.pdf', 'installation-photos.pdf', 'warranty-cert.pdf'],
    flaggedForApproval: true,
    flaggedTo: 'owner',
    flaggedReason: 'High-value purchase over $4000 - owner approval required per policy'
  },
  // Additional completed invoice expenses
  {
    id: 'inv6',
    date: '2025-01-12',
    vendor: 'Superior Roofing Solutions',
    amount: 1850.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job2',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'SRS-2025-456',
    dueDate: '2025-02-11',
    memo: 'Roof leak repair and waterproofing - Stanford GSB',
    supportingDocs: ['roofing-invoice-456.pdf', 'before-after-photos.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv7',
    date: '2025-01-10',
    vendor: 'Metro Landscaping Corp',
    amount: 925.00,
    status: 'reconciled',
    billable: false,
    jobId: 'job3',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'MLC-2025-789',
    dueDate: '2025-02-09',
    memo: 'Monthly landscape maintenance and winter preparations',
    supportingDocs: ['landscape-invoice-789.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv8',
    date: '2025-01-08',
    vendor: 'TechSecure Systems',
    amount: 3150.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job5',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'TSS-2025-341',
    dueDate: '2025-02-07',
    memo: 'Security camera system upgrade and installation',
    supportingDocs: ['security-invoice-341.pdf', 'system-diagram.pdf', 'installation-cert.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv9',
    date: '2025-01-05',
    vendor: 'Elite Painting Services',
    amount: 2400.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job1',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'EPS-2025-112',
    dueDate: '2025-02-04',
    memo: 'Interior painting for lobby and common areas renovation',
    supportingDocs: ['painting-invoice-112.pdf', 'color-samples.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv10',
    date: '2025-01-03',
    vendor: 'GreenClean Janitorial',
    amount: 680.00,
    status: 'reconciled',
    billable: false,
    jobId: 'job2',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'GCJ-2025-023',
    dueDate: '2025-02-02',
    memo: 'Deep cleaning after maintenance work completion',
    supportingDocs: ['janitorial-invoice-023.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv11',
    date: '2024-12-28',
    vendor: 'FloorMaster Installations',
    amount: 5200.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job4',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'FMI-2024-998',
    dueDate: '2025-01-27',
    memo: 'Hardwood flooring replacement in executive conference room',
    supportingDocs: ['flooring-invoice-998.pdf', 'material-specs.pdf', 'completion-photos.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv12',
    date: '2024-12-22',
    vendor: 'AquaTech Pool Services',
    amount: 1275.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job3',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'ATS-2024-567',
    dueDate: '2025-01-21',
    memo: 'Pool filtration system maintenance and chemical balancing',
    supportingDocs: ['pool-invoice-567.pdf', 'water-test-results.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv13',
    date: '2024-12-20',
    vendor: 'Digital Signage Pro',
    amount: 1890.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job5',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'DSP-2024-445',
    dueDate: '2025-01-19',
    memo: 'Digital directory board installation in main lobby',
    supportingDocs: ['signage-invoice-445.pdf', 'installation-manual.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv14',
    date: '2024-12-15',
    vendor: 'EcoWaste Management',
    amount: 420.00,
    status: 'reconciled',
    billable: false,
    jobId: 'job1',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'EWM-2024-789',
    dueDate: '2025-01-14',
    memo: 'Specialized waste disposal after renovation work',
    supportingDocs: ['waste-invoice-789.pdf', 'disposal-certificate.pdf'],
    flaggedForApproval: false
  },
  {
    id: 'inv15',
    date: '2024-12-12',
    vendor: 'ProFire Safety Systems',
    amount: 2650.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job2',
    madeBy: 'Property Manager',
    expenseType: 'invoice',
    invoiceNumber: 'PFS-2024-334',
    dueDate: '2025-01-11',
    memo: 'Fire safety system inspection and sprinkler head replacement',
    supportingDocs: ['fire-safety-invoice-334.pdf', 'inspection-report.pdf', 'compliance-cert.pdf'],
    flaggedForApproval: false
  },
  // Unassigned property transactions
  {
    id: 'txn_unassigned1',
    date: '2025-01-22',
    vendor: 'Office Max',
    amount: 125.50,
    status: 'pending',
    billable: true,
    jobId: '', // No job assignment
    madeBy: 'John Smith',
    cardHolder: 'John Smith',
    memo: 'General office supplies',
    receipt: 'receipt-unassigned1.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn_unassigned2',
    date: '2025-01-23',
    vendor: 'Shell Gas Station',
    amount: 45.75,
    status: 'pending',
    billable: false,
    jobId: '', // No job assignment
    madeBy: 'Sarah Johnson',
    cardHolder: 'Sarah Johnson',
    memo: 'Vehicle fuel for general property visits',
    receipt: 'receipt-unassigned2.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn_unassigned3',
    date: '2025-01-24',
    vendor: 'Costco Business',
    amount: 89.99,
    status: 'reconciled',
    billable: true,
    jobId: '', // No job assignment
    madeBy: 'Mike Chen',
    cardHolder: 'Mike Chen',
    memo: 'Bulk cleaning supplies',
    receipt: 'receipt-unassigned3.pdf',
    expenseType: 'credit_card'
  },
  {
    id: 'txn_unassigned4',
    date: '2025-01-25',
    vendor: 'Amazon Business',
    amount: 234.20,
    status: 'pending',
    billable: true,
    jobId: '', // No job assignment
    madeBy: 'Lisa Wong',
    cardHolder: 'Lisa Wong',
    memo: 'General maintenance tools and equipment',
    receipt: 'receipt-unassigned4.pdf',
    expenseType: 'credit_card'
  }
]

// Mock enhanced cards data
const enhancedCards: EnhancedCard[] = [
  {
    id: 'card1',
    type: 'virtual',
    number: '**** 4532',
    holder: 'Alice Johnson',
    position: 'Technician',
    balance: 2350,
    limit: 5000,
    status: 'active',
    assignedProperties: ['stanford', 'sunnyvale'],
    vendorRestrictions: ['Home Depot', 'Lowes', 'Ace Hardware'],
    isExistingCard: false,
    brand: 'Chase',
    expiryDate: '12/26',
    lastUsed: '2 hours ago',
    monthlySpend: 1650,
    assignedStaff: ['tech1']
  },
  {
    id: 'card2',
    type: 'physical',
    number: '**** 7891',
    holder: 'Bob Martinez',
    position: 'PM',
    balance: 1875,
    limit: 3000,
    status: 'active',
    assignedProperties: ['downtown'],
    vendorRestrictions: ['Office Depot', 'Staples', 'Amazon Business'],
    isExistingCard: true, // Connected existing Amex
    brand: 'Amex',
    expiryDate: '08/27',
    lastUsed: '1 day ago',
    monthlySpend: 1125,
    assignedStaff: ['tech2']
  },
  {
    id: 'card3',
    type: 'virtual',
    number: '**** 2468',
    holder: 'Carlos Lee',
    position: 'Super',
    balance: 4200,
    limit: 7500,
    status: 'active',
    assignedProperties: ['highland', 'westside'],
    vendorRestrictions: ['Home Depot', 'Lowes', 'Sherwin Williams', 'Benjamin Moore'],
    isExistingCard: false,
    brand: 'Visa',
    expiryDate: '03/28',
    lastUsed: '3 hours ago',
    monthlySpend: 2850,
    assignedStaff: ['tech3']
  },
  {
    id: 'card4',
    type: 'physical',
    number: '**** 9876',
    holder: 'Diana Smith',
    position: 'Admin',
    balance: 1200,
    limit: 2500,
    status: 'active',
    assignedProperties: ['stanford', 'downtown'],
    vendorRestrictions: ['Office Depot', 'Staples', 'Amazon Business', 'Fedex'],
    isExistingCard: true, // Connected existing Mastercard
    brand: 'Mastercard',
    expiryDate: '11/26',
    lastUsed: '4 days ago',
    monthlySpend: 890,
    assignedStaff: ['admin1']
  },
  {
    id: 'card5',
    type: 'virtual',
    number: '**** 5432',
    holder: 'Mike Thompson',
    position: 'Technician',
    balance: 3100,
    limit: 4000,
    status: 'active',
    assignedProperties: ['highland'],
    vendorRestrictions: ['Home Depot', 'Lowes', 'Benjamin Moore', 'Sherwin Williams'],
    isExistingCard: false,
    brand: 'Chase',
    expiryDate: '09/27',
    lastUsed: '1 hour ago',
    monthlySpend: 2200,
    assignedStaff: ['tech4']
  },
  {
    id: 'card6',
    type: 'physical',
    number: '**** 1357',
    holder: 'Sarah Wilson',
    position: 'PM',
    balance: 2800,
    limit: 6000,
    status: 'active',
    assignedProperties: ['westside', 'sunnyvale'],
    vendorRestrictions: ['Office Depot', 'Home Depot', 'Amazon Business', 'Lowes'],
    isExistingCard: true, // Connected existing Visa
    brand: 'Visa',
    expiryDate: '05/28',
    lastUsed: '6 hours ago',
    monthlySpend: 1950,
    assignedStaff: ['pm2']
  }
];

// Mock comprehensive expense requests data
const mockExpenseRequests: ExpenseRequest[] = [
  {
    id: 'req1',
    technicianName: 'Alice Johnson',
    expenseId: 'txn1',
    question: 'Is emergency plumbing repair billable to owner?',
    amount: 450,
    vendor: 'Quick Fix Plumbing',
    date: '2024-01-20',
    urgency: 'high',
    status: 'pending',
    type: 'billable_question',
    createdAt: '2024-01-20T09:00:00',
    aiSuggestion: 'Yes - Emergency repairs are typically billable to owner when related to property maintenance. Recommend approval with receipt requirement.',
    category: 'Emergency Repair',
    property: 'Stanford GSB',
    workOrder: 'job1'
  },
  {
    id: 'req2',
    technicianName: 'Bob Martinez',
    expenseId: 'txn3',
    question: 'Do I need pre-approval for $750 office supplies?',
    amount: 750,
    vendor: 'Office Depot',
    date: '2024-01-19',
    urgency: 'normal',
    status: 'pending',
    type: 'approval_required',
    createdAt: '2024-01-19T14:30:00',
    aiSuggestion: 'Yes - Expenses over $500 require pre-approval per company policy. Request should include itemized list and business justification.',
    category: 'Office Supplies',
    property: 'Downtown Lofts'
  },
  {
    id: 'req3',
    technicianName: 'Diana Roberts',
    expenseId: 'txn8',
    question: 'Can I expense gas for emergency call-out?',
    amount: 35,
    vendor: 'Shell Gas Station',
    date: '2024-01-18',
    urgency: 'low',
    status: 'approved',
    type: 'policy_clarification',
    createdAt: '2024-01-18T16:45:00',
    aiSuggestion: 'Yes - Vehicle expenses for emergency work orders are reimbursable. Ensure receipt shows business purpose.',
    category: 'Vehicle Expenses',
    property: 'Sunnyvale 432'
  },
  {
    id: 'req4',
    technicianName: 'Mark Thompson',
    expenseId: 'txn9',
    question: 'Receipt is damaged - can I submit alternative proof?',
    amount: 125,
    vendor: 'Home Depot',
    date: '2024-01-17',
    urgency: 'normal',
    status: 'pending',
    type: 'receipt_issue',
    createdAt: '2024-01-17T11:20:00',
    aiSuggestion: 'Bank/credit card statement can serve as backup. Contact vendor for duplicate receipt or submit detailed purchase description.',
    category: 'Documentation Issue',
    property: 'Highland Park'
  },
  {
    id: 'req5',
    technicianName: 'Sarah Kim',
    expenseId: 'txn10',
    question: 'Is $1,200 HVAC part cost reasonable?',
    amount: 1200,
    vendor: 'HVAC Supply Co',
    date: '2024-01-16',
    urgency: 'high',
    status: 'pending',
    type: 'amount_verification',
    createdAt: '2024-01-16T08:15:00',
    aiSuggestion: 'Request additional quotes for comparison. HVAC parts can vary significantly - verify part number and necessity with property manager.',
    category: 'HVAC Maintenance',
    property: 'Stanford GSB',
    workOrder: 'job4'
  },
  {
    id: 'req6',
    technicianName: 'Carlos Lee',
    expenseId: 'txn11',
    question: 'Should paint supplies be billable or operational?',
    amount: 280,
    vendor: 'Sherwin Williams',
    date: '2024-01-15',
    urgency: 'normal',
    status: 'denied',
    type: 'billable_question',
    createdAt: '2024-01-15T13:45:00',
    aiSuggestion: 'Routine maintenance painting is typically operational. Unit-specific repairs would be billable. Need more context on scope.',
    category: 'Maintenance',
    property: 'Westside Complex'
  },
  {
    id: 'req7',
    technicianName: 'Lisa Chang',
    expenseId: 'txn12',
    question: 'Can I expense overnight tools for urgent repair?',
    amount: 95,
    vendor: 'Amazon',
    date: '2024-01-14',
    urgency: 'high',
    status: 'approved',
    type: 'policy_clarification',
    createdAt: '2024-01-14T19:30:00',
    aiSuggestion: 'Emergency tool purchases are acceptable for urgent repairs. Ensure tools remain company property and document necessity.',
    category: 'Tools & Equipment',
    property: 'Downtown Lofts'
  },
  {
    id: 'req8',
    technicianName: 'Mike Rodriguez',
    expenseId: 'txn13',
    question: 'Multiple small receipts - combine or separate submissions?',
    amount: 180,
    vendor: 'Various',
    date: '2024-01-13',
    urgency: 'low',
    status: 'pending',
    type: 'policy_clarification',
    createdAt: '2024-01-13T10:00:00',
    aiSuggestion: 'Combine related purchases by work order. Submit separately if different properties or categories. Include clear itemization.',
    category: 'Process Question',
    property: 'Multiple Properties'
  }
];

// Add type for milestone ownership
type MilestoneOwner = 'PM' | 'Technician' | 'Central Office';

// Remove the local activityMilestones array definition (lines 113-152)
// The activityMilestones is now imported from './mockData'

// Add 'Work Order Update' after 'Work Started' in activityMilestones
const workStartedIndex = activityMilestones.findIndex(m => m.milestone === 'Work Started');
let activityMilestonesWithUpdate: typeof activityMilestones = [];
if (workStartedIndex !== -1) {
  activityMilestonesWithUpdate = [
    ...activityMilestones.slice(0, workStartedIndex + 1),
    { milestone: 'Work Order Update', owner: 'PM' as MilestoneOwner, description: 'General update to work order', responsibility: 'Any update or note related to the work order' },
    ...activityMilestones.slice(workStartedIndex + 1)
  ];
} else {
  activityMilestonesWithUpdate = [
    ...activityMilestones,
    { milestone: 'Work Order Update', owner: 'PM' as MilestoneOwner, description: 'General update to work order', responsibility: 'Any update or note related to the work order' }
  ];
}

// Budgeting Tab Component
function BudgetingTab() {
  const [selectedProperty, setSelectedProperty] = useState<string>('prop1')
  const [selectedBudgetYear, setSelectedBudgetYear] = useState<string>('2025')
  const [viewMode, setViewMode] = useState<'overview' | 'property' | 'create'>('property')
  const [selectedPropertyForBudget, setSelectedPropertyForBudget] = useState<any>(null)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [budgetData, setBudgetData] = useState<any>({})
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [shareWithOwnerDialog, setShareWithOwnerDialog] = useState(false)
  const [selectedBudgetForSharing, setSelectedBudgetForSharing] = useState<any>(null)
  const [editingLineItem, setEditingLineItem] = useState<string | null>(null)
  const [glLineItems, setGlLineItems] = useState<any>({})
  const [aiGenerateDialog, setAiGenerateDialog] = useState(false)
  const [aiGenerateForm, setAiGenerateForm] = useState({
    targetProperty: 'prop1',
    basedOnHistorical: true,
    includeInflation: true,
    includeMarketRates: true,
    includeUtilityRates: true,
    includeContractRenewals: true,
    includeEnergyEfficiency: true,
    conservativeApproach: false,
    aggressiveGrowth: false,
    freeformNotes: ''
  })
  const [expandedSubGL, setExpandedSubGL] = useState<Set<number>>(new Set())
  const [accountingMethod, setAccountingMethod] = useState<'cash' | 'accrual'>('accrual')
  const [uploadDialog, setUploadDialog] = useState<'chartOfAccounts' | null>(null)
  const [previousBudgetFile, setPreviousBudgetFile] = useState<File | null>(null)

    // Property budget data structure
  const properties = [
    { id: 'prop1', name: '01 STANFORD' },
    { id: 'prop2', name: '02 MISSION BAY' },
    { id: 'prop3', name: '03 REDWOOD' }
  ]

  // Sub GL accounts data
  const subGLAccounts = {
    412: [ // Rent Income sub accounts
      { subAccount: '412.1', name: 'Base Rent', lastYear: 2200000, budget2025: 2300000, ytdActual: 1340000 },
      { subAccount: '412.2', name: 'Late Fees', lastYear: 120000, budget2025: 130000, ytdActual: 75000 },
      { subAccount: '412.3', name: 'Rent Escalations', lastYear: 80000, budget2025: 90000, ytdActual: 45000 }
    ],
    413: [ // Renters Insurance Income sub accounts
      { subAccount: '413.1', name: 'Insurance Commission', lastYear: 15000, budget2025: 16000, ytdActual: 9000 },
      { subAccount: '413.2', name: 'Administrative Fee', lastYear: 9000, budget2025: 10000, ytdActual: 6000 }
    ],
    414: [ // Repairs Income sub accounts
      { subAccount: '414.1', name: 'Tenant Damage Reimbursement', lastYear: 12000, budget2025: 13000, ytdActual: 8000 },
      { subAccount: '414.2', name: 'Insurance Claims', lastYear: 6000, budget2025: 7000, ytdActual: 4000 }
    ],
    415: [ // Utility Income sub accounts
      { subAccount: '415.1', name: 'Electricity Reimbursement', lastYear: 85000, budget2025: 90000, ytdActual: 52000 },
      { subAccount: '415.2', name: 'Water/Sewer Reimbursement', lastYear: 35000, budget2025: 38000, ytdActual: 22000 },
      { subAccount: '415.3', name: 'Gas Reimbursement', lastYear: 25000, budget2025: 27000, ytdActual: 15000 }
    ],
    416: [ // Pet Fee Income sub accounts
      { subAccount: '416.1', name: 'Pet Deposits', lastYear: 20000, budget2025: 22000, ytdActual: 13000 },
      { subAccount: '416.2', name: 'Monthly Pet Fees', lastYear: 16000, budget2025: 17000, ytdActual: 9500 }
    ],
    505: [ // Cleaning and Maintenance sub accounts
      { subAccount: '505.1', name: 'Regular Cleaning', lastYear: 120000, budget2025: 125000, ytdActual: 72000 },
      { subAccount: '505.2', name: 'Deep Cleaning', lastYear: 35000, budget2025: 35000, ytdActual: 20000 },
      { subAccount: '505.3', name: 'Maintenance Supplies', lastYear: 25000, budget2025: 25000, ytdActual: 16000 }
    ],
    509: [ // Insurance sub accounts
      { subAccount: '509.1', name: 'Property Insurance', lastYear: 65000, budget2025: 70000, ytdActual: 35000 },
      { subAccount: '509.2', name: 'Liability Insurance', lastYear: 20000, budget2025: 22000, ytdActual: 11000 },
      { subAccount: '509.3', name: 'Workers Comp', lastYear: 10000, budget2025: 10000, ytdActual: 5000 }
    ],
    510: [ // Landscaping sub accounts
      { subAccount: '510.1', name: 'Regular Maintenance', lastYear: 45000, budget2025: 48000, ytdActual: 28000 },
      { subAccount: '510.2', name: 'Seasonal Plantings', lastYear: 15000, budget2025: 16000, ytdActual: 9000 },
      { subAccount: '510.3', name: 'Irrigation', lastYear: 8000, budget2025: 8000, ytdActual: 5000 }
    ],
    511: [ // Legal and Professional Fees sub accounts
      { subAccount: '511.1', name: 'Legal Fees', lastYear: 25000, budget2025: 30000, ytdActual: 18000 },
      { subAccount: '511.2', name: 'Accounting Fees', lastYear: 15000, budget2025: 15000, ytdActual: 8000 },
      { subAccount: '511.3', name: 'Consulting Fees', lastYear: 5000, budget2025: 5000, ytdActual: 2000 }
    ],
    513: [ // Management Fees sub accounts
      { subAccount: '513.1', name: 'Base Management Fee', lastYear: 120000, budget2025: 126000, ytdActual: 73000 },
      { subAccount: '513.2', name: 'Leasing Fees', lastYear: 24000, budget2025: 25200, ytdActual: 14600 }
    ],
    522: [ // Repairs sub accounts
      { subAccount: '522.1', name: 'Emergency Repairs', lastYear: 45000, budget2025: 50000, ytdActual: 28000 },
      { subAccount: '522.2', name: 'Scheduled Maintenance', lastYear: 25000, budget2025: 25000, ytdActual: 15000 },
      { subAccount: '522.3', name: 'Tenant Damage Repairs', lastYear: 15000, budget2025: 15000, ytdActual: 9000 }
    ],
    524: [ // Appliance Repairs sub accounts
      { subAccount: '524.1', name: 'HVAC Appliances', lastYear: 18000, budget2025: 20000, ytdActual: 10000 },
      { subAccount: '524.2', name: 'Kitchen Appliances', lastYear: 14000, budget2025: 15000, ytdActual: 8000 }
    ],
    525: [ // Bathroom Repairs sub accounts
      { subAccount: '525.1', name: 'Plumbing Fixtures', lastYear: 15000, budget2025: 16000, ytdActual: 8000 },
      { subAccount: '525.2', name: 'Tile and Flooring', lastYear: 13000, budget2025: 14000, ytdActual: 7000 }
    ],
    537: [ // Electric sub accounts
      { subAccount: '537.1', name: 'Common Area Electric', lastYear: 110000, budget2025: 98000, ytdActual: 56000 },
      { subAccount: '537.2', name: 'Unit Electric', lastYear: 75000, budget2025: 67000, ytdActual: 39000 }
    ],
    538: [ // Gas sub accounts
      { subAccount: '538.1', name: 'Heating Gas', lastYear: 45000, budget2025: 48000, ytdActual: 27000 },
      { subAccount: '538.2', name: 'Hot Water Gas', lastYear: 23000, budget2025: 24000, ytdActual: 14000 }
    ],
    539: [ // Water/Sewer sub accounts
      { subAccount: '539.1', name: 'Water Usage', lastYear: 65000, budget2025: 60000, ytdActual: 35000 },
      { subAccount: '539.2', name: 'Sewer Fees', lastYear: 30000, budget2025: 28000, ytdActual: 17000 }
    ]
  }

  // Complete GL Chart of Accounts structure based on provided chart
  const chartOfAccounts = {
    // Income Accounts (4000s)
    income: [
      { account: 412, name: 'Rent Income', type: 'Income', lastYear: 2400000, budget2025: 2520000, ytdActual: 1460000, aiGenerated: true, rationale: 'AI: 5% increase based on market rates + 2 new leases', hasSubGL: true },
      { account: 413, name: 'Renters Insurance Income', type: 'Income', lastYear: 24000, budget2025: 26000, ytdActual: 15000, aiGenerated: true, rationale: 'AI: Optional insurance program growth', hasSubGL: true },
      { account: 414, name: 'Repairs Income', type: 'Income', lastYear: 18000, budget2025: 20000, ytdActual: 12000, aiGenerated: true, rationale: 'AI: Tenant-caused damage reimbursements', hasSubGL: true },
      { account: 415, name: 'Utility Income', type: 'Income', lastYear: 145000, budget2025: 155000, ytdActual: 89000, aiGenerated: true, rationale: 'AI: Utility reimbursement from tenants, 7% rate increase', hasSubGL: true },
      { account: 416, name: 'Pet Fee Income', type: 'Income', lastYear: 36000, budget2025: 39000, ytdActual: 22500, aiGenerated: true, rationale: 'AI: Pet policy expansion, $50/month per pet', hasSubGL: true }
    ],
    // Operating Expenses (5000s)
    operatingExpenses: [
      { account: 505, name: 'Cleaning and Maintenance', type: 'Operating Expenses', lastYear: 180000, budget2025: 185000, ytdActual: 108000, aiGenerated: true, rationale: 'AI: Contract renewal +2.8% inflation adjustment', hasSubGL: true },
      { account: 509, name: 'Insurance', type: 'Operating Expenses', lastYear: 95000, budget2025: 102000, ytdActual: 51000, aiGenerated: true, rationale: 'AI: Property insurance +7% premium increase', hasSubGL: true },
      { account: 510, name: 'Landscaping', type: 'Operating Expenses', lastYear: 68000, budget2025: 72000, ytdActual: 42000, aiGenerated: true, rationale: 'AI: Drought-resistant plants reducing water costs', hasSubGL: true },
      { account: 511, name: 'Legal and Professional Fees', type: 'Operating Expenses', lastYear: 45000, budget2025: 50000, ytdActual: 28000, aiGenerated: false, rationale: 'Manual: Anticipated legal work for lease updates', hasSubGL: true },
      { account: 513, name: 'Management Fees', type: 'Operating Expenses', lastYear: 144000, budget2025: 151200, ytdActual: 87600, aiGenerated: true, rationale: 'AI: 6% of gross rent income', hasSubGL: true },
      
      // Repairs subcategories
      { account: 522, name: 'Repairs', type: 'Operating Expenses', lastYear: 85000, budget2025: 90000, ytdActual: 52000, aiGenerated: true, rationale: 'AI: General repair reserves', hasSubGL: true },
      { account: 524, name: 'Appliance Repairs', type: 'Operating Expenses', lastYear: 32000, budget2025: 35000, ytdActual: 18000, aiGenerated: true, rationale: 'AI: Aging appliances require more service', hasSubGL: true },
      { account: 525, name: 'Bathroom Repairs', type: 'Operating Expenses', lastYear: 28000, budget2025: 30000, ytdActual: 15000, aiGenerated: true, rationale: 'AI: Fixture replacements scheduled', hasSubGL: true },
      { account: 526, name: 'Electrical Repairs', type: 'Operating Expenses', lastYear: 42000, budget2025: 45000, ytdActual: 26000, aiGenerated: true, rationale: 'AI: Panel upgrades in progress' },
      { account: 527, name: 'Flooring Repairs', type: 'Operating Expenses', lastYear: 55000, budget2025: 60000, ytdActual: 32000, aiGenerated: true, rationale: 'AI: High-traffic area replacements' },
      { account: 529, name: 'HVAC Repairs', type: 'Operating Expenses', lastYear: 125000, budget2025: 140000, ytdActual: 78000, aiGenerated: true, rationale: 'AI: Equipment age analysis suggests increased maintenance' },
      { account: 530, name: 'Kitchen Repairs', type: 'Operating Expenses', lastYear: 38000, budget2025: 42000, ytdActual: 22000, aiGenerated: true, rationale: 'AI: Cabinet and fixture refresh needed' },
      { account: 531, name: 'Plumbing Repairs', type: 'Operating Expenses', lastYear: 67000, budget2025: 65000, ytdActual: 35000, aiGenerated: true, rationale: 'AI: Recent pipe replacements reducing future costs' },
      
      // Utilities
      { account: 536, name: 'Utilities', type: 'Operating Expenses', lastYear: 0, budget2025: 0, ytdActual: 0, aiGenerated: true, rationale: 'AI: Parent category - see subcategories below', hasSubGL: false },
      { account: 537, name: 'Electric', type: 'Operating Expenses', lastYear: 185000, budget2025: 165000, ytdActual: 95000, aiGenerated: true, rationale: 'AI: LED upgrades + solar panels = 11% reduction estimated', utilityRate: '$0.32/kWh', utilityEstimate: '515,625 kWh annually', hasSubGL: true },
      { account: 538, name: 'Gas', type: 'Operating Expenses', lastYear: 68000, budget2025: 72000, ytdActual: 41000, aiGenerated: true, rationale: 'AI: Winter heating + 6% rate increase', utilityRate: '$1.20/therm', utilityEstimate: '60,000 therms annually', hasSubGL: true },
      { account: 539, name: 'Water/Sewer', type: 'Operating Expenses', lastYear: 95000, budget2025: 88000, ytdActual: 52000, aiGenerated: true, rationale: 'AI: Water-efficient fixtures installed, 7% reduction', utilityRate: '$12.50/CCF', utilityEstimate: '7,040 CCF annually', hasSubGL: true },
      { account: 540, name: 'Trash', type: 'Operating Expenses', lastYear: 24000, budget2025: 25000, ytdActual: 14500, aiGenerated: true, rationale: 'AI: Waste contract renewal +4% increase' }
    ],
    // Fixed Assets / Capital Improvements (100s)
    capitalImprovements: [
      { account: 110, name: 'General Improvements', type: 'Fixed Asset', lastYear: 0, budget2025: 0, ytdActual: 0, aiGenerated: false, rationale: 'Parent category - see specific improvements below' },
      { account: 111, name: 'Appliance Improvements', type: 'Fixed Asset', lastYear: 85000, budget2025: 120000, ytdActual: 65000, aiGenerated: false, rationale: 'Manual: Energy-efficient appliance replacements scheduled' },
      { account: 113, name: 'Electrical Improvements', type: 'Fixed Asset', lastYear: 125000, budget2025: 180000, ytdActual: 95000, aiGenerated: false, rationale: 'Manual: Smart building system installation Q3-Q4' },
      { account: 114, name: 'Flooring Improvements', type: 'Fixed Asset', lastYear: 210000, budget2025: 150000, ytdActual: 85000, aiGenerated: true, rationale: 'AI: Luxury vinyl plank replacement in common areas' },
      { account: 116, name: 'HVAC Improvements', type: 'Fixed Asset', lastYear: 180000, budget2025: 450000, ytdActual: 225000, aiGenerated: false, rationale: 'Manual: Chiller replacement and smart controls installation' },
      { account: 117, name: 'Kitchen Improvements', type: 'Fixed Asset', lastYear: 65000, budget2025: 95000, ytdActual: 45000, aiGenerated: false, rationale: 'Manual: Countertop and cabinet upgrades for premium units' },
      { account: 119, name: 'Plumbing Improvements', type: 'Fixed Asset', lastYear: 95000, budget2025: 75000, ytdActual: 42000, aiGenerated: true, rationale: 'AI: Water-efficient fixture installations completing' }
    ]
  }

  // Calculate totals for the selected property budget
  const calculateTotals = () => {
    const allItems = [...chartOfAccounts.income, ...chartOfAccounts.operatingExpenses, ...chartOfAccounts.capitalImprovements]
    return {
      totalBudget: allItems.reduce((sum, item) => sum + item.budget2025, 0),
      totalLastYear: allItems.reduce((sum, item) => sum + item.lastYear, 0),
      totalYTDActual: allItems.reduce((sum, item) => sum + item.ytdActual, 0),
      incomeTotal: chartOfAccounts.income.reduce((sum, item) => sum + item.budget2025, 0),
      expenseTotal: chartOfAccounts.operatingExpenses.reduce((sum, item) => sum + item.budget2025, 0),
      capitalTotal: chartOfAccounts.capitalImprovements.reduce((sum, item) => sum + item.budget2025, 0)
    }
  }

  const handleCreateNewBudget = () => {
    setViewMode('create')
  }

  const handleAiGenerate = () => {
    // Initialize form with current property selection
    setAiGenerateForm(prev => ({
      ...prev,
      targetProperty: selectedProperty
    }))
    setAiGenerateDialog(true)
  }

  const handleAiGenerateSubmit = async () => {
    setAiAssistantOpen(true)
    setAiGenerateDialog(false)
    
    // Simulate AI budget generation with custom parameters
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const targetPropertyName = properties.find(p => p.id === aiGenerateForm.targetProperty)?.name || 'Unknown Property'
    
    // Build AI generation summary message
    let message = `AI has generated a new budget for ${targetPropertyName} with the following parameters:\n\n`
    
    if (aiGenerateForm.basedOnHistorical) message += '✓ 3-year historical data analysis\n'
    if (aiGenerateForm.includeInflation) message += '✓ 2025 inflation projections (3.2%)\n'
    if (aiGenerateForm.includeMarketRates) message += '✓ Local market rate adjustments\n'
    if (aiGenerateForm.includeUtilityRates) message += '✓ Updated utility rate schedules\n'
    if (aiGenerateForm.includeContractRenewals) message += '✓ Contract renewal analysis\n'
    if (aiGenerateForm.includeEnergyEfficiency) message += '✓ Energy efficiency savings projections\n'
    if (aiGenerateForm.conservativeApproach) message += '✓ Conservative growth assumptions\n'
    if (aiGenerateForm.aggressiveGrowth) message += '✓ Aggressive growth targets\n'
    
    if (aiGenerateForm.freeformNotes.trim()) {
      message += `\nCustom Notes: "${aiGenerateForm.freeformNotes}"\n`
    }
    
    message += '\n🤖 Budget has been updated with 87% AI confidence'
    
    alert(message)
    setAiAssistantOpen(false)
    
    // Reset form
    setAiGenerateForm({
      targetProperty: selectedProperty,
      basedOnHistorical: true,
      includeInflation: true,
      includeMarketRates: true,
      includeUtilityRates: true,
      includeContractRenewals: true,
      includeEnergyEfficiency: true,
      conservativeApproach: false,
      aggressiveGrowth: false,
      freeformNotes: ''
    })
  }

  const handleShareWithOwner = (budget: any) => {
    setSelectedBudgetForSharing(budget)
    setShareWithOwnerDialog(true)
  }

  const handleOwnerShare = () => {
    const selectedPropertyName = properties.find(p => p.id === selectedProperty)?.name || 'Unknown Property'
    alert(`Budget for ${selectedPropertyName} (${selectedBudgetYear}) has been shared with owner for review and approval.`)
    setShareWithOwnerDialog(false)
    setSelectedBudgetForSharing(null)
  }

  const handleEditLineItem = (accountNumber: number) => {
    setEditingLineItem(accountNumber.toString())
  }

  const handleSaveLineItem = (accountNumber: number, newValue: number) => {
    // Update the budget value for this line item
    const allCategories = [chartOfAccounts.income, chartOfAccounts.operatingExpenses, chartOfAccounts.capitalImprovements]
    for (const category of allCategories) {
      const item = category.find(item => item.account === accountNumber)
      if (item) {
        item.budget2025 = newValue
        break
      }
    }
    setEditingLineItem(null)
  }

  const toggleSubGL = (accountNumber: number) => {
    const newExpanded = new Set(expandedSubGL)
    if (newExpanded.has(accountNumber)) {
      newExpanded.delete(accountNumber)
    } else {
      newExpanded.add(accountNumber)
    }
    setExpandedSubGL(newExpanded)
  }

  const handleExportToXLS = () => {
    // Create CSV content (Excel will open CSV files)
    const csvContent = [
      ['Account #', 'Account Name', 'Type', 'Last Year Actual', '2025 Budget', 'YTD Actual', 'Variance %', 'AI Rationale'],
      ...chartOfAccounts.income.map(item => {
        const variance = ((item.ytdActual / (item.budget2025 * 0.58)) * 100) - 100
        return [
          item.account,
          item.name,
          item.type,
          item.lastYear,
          item.budget2025,
          item.ytdActual,
          variance.toFixed(1) + '%',
          item.rationale
        ]
      }),
      ...chartOfAccounts.operatingExpenses.map(item => {
        const variance = ((item.ytdActual / (item.budget2025 * 0.58)) * 100) - 100
        return [
          item.account,
          item.name,
          item.type,
          item.lastYear,
          item.budget2025,
          item.ytdActual,
          variance.toFixed(1) + '%',
          item.rationale
        ]
      }),
      ...chartOfAccounts.capitalImprovements.map(item => {
        const variance = ((item.ytdActual / (item.budget2025 * 0.58)) * 100) - 100
        return [
          item.account,
          item.name,
          item.type,
          item.lastYear,
          item.budget2025,
          item.ytdActual,
          variance.toFixed(1) + '%',
          item.rationale
        ]
      })
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget_${selectedPropertyName.replace(/\s+/g, '_')}_${selectedBudgetYear}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'chartOfAccounts' | 'previousBudget') => {
    const file = event.target.files?.[0]
    if (file) {
      console.log(`Uploading ${type}:`, file.name)
      if (type === 'chartOfAccounts') {
        alert(`Chart of Accounts file "${file.name}" uploaded successfully!`)
        setUploadDialog(null)
      } else if (type === 'previousBudget') {
        setPreviousBudgetFile(file)
        console.log(`Previous budget file "${file.name}" selected for AI analysis`)
      }
    }
  }

  const handlePreviousBudgetRemove = () => {
    setPreviousBudgetFile(null)
  }

  const totals = calculateTotals()
  const selectedPropertyName = properties.find(p => p.id === selectedProperty)?.name || 'Unknown Property'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Budget: {selectedPropertyName}</h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">General Ledger Budget for {selectedBudgetYear}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Accounting Method:</span>
              <Select value={accountingMethod} onValueChange={(value: 'cash' | 'accrual') => setAccountingMethod(value)}>
                <SelectTrigger className="w-24 bg-gray-800 border-gray-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="accrual" className="text-white">Accrual</SelectItem>
                  <SelectItem value="cash" className="text-white">Cash</SelectItem>
                </SelectContent>
              </Select>
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <div className="font-medium text-white mb-1">Accounting Methods:</div>
                  <div className="mb-2"><span className="font-medium text-blue-300">Accrual:</span> Records income when earned and expenses when incurred, regardless of cash flow. Provides accurate financial position.</div>
                  <div><span className="font-medium text-green-300">Cash:</span> Records transactions only when money changes hands. Shows actual cash flow but may not reflect true financial health.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-52 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {properties.map((prop) => (
                <SelectItem key={prop.id} value={prop.id} className="text-white">{prop.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedBudgetYear} onValueChange={setSelectedBudgetYear}>
            <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="2024" className="text-white">2024</SelectItem>
              <SelectItem value="2025" className="text-white">2025</SelectItem>
              <SelectItem value="2026" className="text-white">2026</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setUploadDialog('chartOfAccounts')}
            variant="outline"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload COA
          </Button>
          <Button 
            onClick={handleExportToXLS}
            variant="outline"
            className="bg-green-600 border-green-600 text-white hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export XLS
          </Button>
          <Button 
            onClick={handleAiGenerate}
            variant="outline"
            className="bg-purple-600 border-purple-600 text-white hover:bg-purple-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            Generate
          </Button>
          <Button 
            onClick={() => setShareWithOwnerDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Share with Owner
          </Button>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Total Income</div>
                <div className="text-xl font-bold text-green-400">${(totals.incomeTotal / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-sm text-gray-400">Operating Expenses</div>
                <div className="text-xl font-bold text-red-400">${(totals.expenseTotal / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Capital Improvements</div>
                <div className="text-xl font-bold text-blue-400">${(totals.capitalTotal / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-white" />
              <div>
                <div className="text-sm text-gray-400">Net Operating Income</div>
                <div className="text-xl font-bold text-white">${((totals.incomeTotal - totals.expenseTotal) / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-purple-400" />
          <div>
            <div className="text-purple-300 font-medium">AI Budget Analysis</div>
            <div className="text-purple-200 text-sm">
              87% of line items AI-generated • Based on 3-year historical data + inflation + market rates • 
              <span className="text-green-300">Projected 12% utility savings</span> from energy efficiency upgrades
            </div>
          </div>
        </div>
      </div>

      {/* Income Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Income Accounts (4000s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Account #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Account Name</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">Last Year Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">{selectedBudgetYear} Budget</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">YTD Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">Variance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">AI Rationale</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chartOfAccounts.income.map((item) => {
                  const variance = ((item.ytdActual / (item.budget2025 * 0.58)) * 100) - 100 // Assuming 58% through year
                  const hasSubAccounts = item.hasSubGL && subGLAccounts[item.account]
                  const isExpanded = expandedSubGL.has(item.account)
                  
                  return (
                    <React.Fragment key={item.account}>
                      <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-blue-300 font-mono">
                          <div className="flex items-center gap-2">
                            {hasSubAccounts && (
                              <button
                                onClick={() => toggleSubGL(item.account)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                            {item.account}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right text-gray-300">${item.lastYear.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-white font-medium">
                          {editingLineItem === item.account.toString() ? (
                            <Input
                              type="number"
                              defaultValue={item.budget2025}
                              className="w-32 text-right bg-gray-700 border-gray-600 text-white"
                              onBlur={(e) => handleSaveLineItem(item.account, parseInt(e.target.value))}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveLineItem(item.account, parseInt((e.target as HTMLInputElement).value))}
                              autoFocus
                            />
                          ) : (
                            `$${item.budget2025.toLocaleString()}`
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-green-300">${item.ytdActual.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-right font-medium ${variance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-gray-300 max-w-xs">
                          <div className="flex items-center gap-2">
                            {item.aiGenerated && <Bot className="h-3 w-3 text-purple-400 flex-shrink-0" />}
                            <span className="truncate">{item.rationale}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditLineItem(item.account)}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                      
                      {/* Sub GL Accounts */}
                      {hasSubAccounts && isExpanded && subGLAccounts[item.account].map((subItem) => {
                        const subVariance = ((subItem.ytdActual / (subItem.budget2025 * 0.58)) * 100) - 100
                        return (
                          <tr key={subItem.subAccount} className="border-b border-gray-700 hover:bg-gray-700/30 bg-gray-800/50">
                            <td className="py-2 px-4 pl-12 text-blue-200 font-mono text-sm">{subItem.subAccount}</td>
                            <td className="py-2 px-4 text-gray-300 text-sm">{subItem.name}</td>
                            <td className="py-2 px-4 text-right text-gray-400 text-sm">${subItem.lastYear.toLocaleString()}</td>
                            <td className="py-2 px-4 text-right text-gray-300 text-sm">${subItem.budget2025.toLocaleString()}</td>
                            <td className="py-2 px-4 text-right text-green-200 text-sm">${subItem.ytdActual.toLocaleString()}</td>
                            <td className={`py-2 px-4 text-right text-sm ${subVariance > 0 ? 'text-green-300' : 'text-red-300'}`}>
                              {subVariance > 0 ? '+' : ''}{subVariance.toFixed(1)}%
                            </td>
                            <td className="py-2 px-4 text-gray-500 text-sm">Sub-account detail</td>
                            <td className="py-2 px-4"></td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Operating Expenses Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            Operating Expenses (5000s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Account #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Account Name</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">Last Year Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">{selectedBudgetYear} Budget</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">YTD Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">Variance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">AI Rationale</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Utility Details</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chartOfAccounts.operatingExpenses.map((item) => {
                  const variance = ((item.ytdActual / (item.budget2025 * 0.58)) * 100) - 100
                  const hasSubAccounts = item.hasSubGL && subGLAccounts[item.account]
                  const isExpanded = expandedSubGL.has(item.account)
                  
                  return (
                    <React.Fragment key={item.account}>
                      <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-red-300 font-mono">
                          <div className="flex items-center gap-2">
                            {hasSubAccounts && (
                              <button
                                onClick={() => toggleSubGL(item.account)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                            {item.account}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right text-gray-300">${item.lastYear.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-white font-medium">
                          {editingLineItem === item.account.toString() ? (
                            <Input
                              type="number"
                              defaultValue={item.budget2025}
                              className="w-32 text-right bg-gray-700 border-gray-600 text-white"
                              onBlur={(e) => handleSaveLineItem(item.account, parseInt(e.target.value))}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveLineItem(item.account, parseInt((e.target as HTMLInputElement).value))}
                              autoFocus
                            />
                          ) : (
                            `$${item.budget2025.toLocaleString()}`
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-red-300">${item.ytdActual.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-right font-medium ${variance < 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-gray-300 max-w-xs">
                          <div className="flex items-center gap-2">
                            {item.aiGenerated && <Bot className="h-3 w-3 text-purple-400 flex-shrink-0" />}
                            <span className="truncate">{item.rationale}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-xs max-w-xs">
                          {(item as any).utilityRate && (
                            <div>
                              <div>Rate: {(item as any).utilityRate}</div>
                              <div>Est: {(item as any).utilityEstimate}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditLineItem(item.account)}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                      
                      {/* Sub GL Accounts */}
                      {hasSubAccounts && isExpanded && subGLAccounts[item.account].map((subItem) => {
                        const subVariance = ((subItem.ytdActual / (subItem.budget2025 * 0.58)) * 100) - 100
                        return (
                          <tr key={subItem.subAccount} className="border-b border-gray-700 hover:bg-gray-700/30 bg-gray-800/50">
                            <td className="py-2 px-4 pl-12 text-red-200 font-mono text-sm">{subItem.subAccount}</td>
                            <td className="py-2 px-4 text-gray-300 text-sm">{subItem.name}</td>
                            <td className="py-2 px-4 text-right text-gray-400 text-sm">${subItem.lastYear.toLocaleString()}</td>
                            <td className="py-2 px-4 text-right text-gray-300 text-sm">${subItem.budget2025.toLocaleString()}</td>
                            <td className="py-2 px-4 text-right text-red-200 text-sm">${subItem.ytdActual.toLocaleString()}</td>
                            <td className={`py-2 px-4 text-right text-sm ${subVariance < 0 ? 'text-green-300' : 'text-red-300'}`}>
                              {subVariance > 0 ? '+' : ''}{subVariance.toFixed(1)}%
                            </td>
                            <td className="py-2 px-4 text-gray-500 text-sm">Sub-account detail</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Capital Improvements Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-400" />
            Capital Improvements (100s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Account #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Account Name</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">Last Year Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">{selectedBudgetYear} Budget</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">YTD Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-300">Variance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Project Rationale</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chartOfAccounts.capitalImprovements.map((item) => {
                  const variance = item.budget2025 > 0 ? ((item.ytdActual / (item.budget2025 * 0.58)) * 100) - 100 : 0
                  return (
                    <tr key={item.account} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-blue-300 font-mono">{item.account}</td>
                      <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-right text-gray-300">${item.lastYear.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-white font-medium">
                        {editingLineItem === item.account.toString() ? (
                          <Input
                            type="number"
                            defaultValue={item.budget2025}
                            className="w-32 text-right bg-gray-700 border-gray-600 text-white"
                            onBlur={(e) => handleSaveLineItem(item.account, parseInt(e.target.value))}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveLineItem(item.account, parseInt((e.target as HTMLInputElement).value))}
                            autoFocus
                          />
                        ) : (
                          `$${item.budget2025.toLocaleString()}`
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-300">${item.ytdActual.toLocaleString()}</td>
                      <td className={`py-3 px-4 text-right font-medium ${item.budget2025 === 0 ? 'text-gray-400' : variance < 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.budget2025 === 0 ? 'N/A' : `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`}
                      </td>
                      <td className="py-3 px-4 text-gray-300 max-w-xs">
                        <div className="flex items-center gap-2">
                          {item.aiGenerated && <Bot className="h-3 w-3 text-purple-400 flex-shrink-0" />}
                          <span className="truncate">{item.rationale}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditLineItem(item.account)}
                          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Share with Owner Dialog */}
      <Dialog open={shareWithOwnerDialog} onOpenChange={setShareWithOwnerDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Share Budget with Owner</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send budget for {selectedPropertyName} ({selectedBudgetYear}) for review and approval
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Property:</span>
                <span className="text-white font-medium">{selectedPropertyName}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Total Budget:</span>
                <span className="text-white text-lg font-bold">
                  ${(totals.totalBudget / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Net Operating Income:</span>
                <span className="text-green-400 font-bold">
                  ${((totals.incomeTotal - totals.expenseTotal) / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">AI Confidence:</span>
                <span className="text-purple-400">87%</span>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Message to Owner (Optional)</Label>
              <Textarea
                placeholder="Add any notes or context for the owner..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="includeAI" className="rounded" defaultChecked />
              <Label htmlFor="includeAI" className="text-gray-300">
                Include AI insights and utility estimates
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="includeGL" className="rounded" defaultChecked />
              <Label htmlFor="includeGL" className="text-gray-300">
                Include detailed GL line items
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShareWithOwnerDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOwnerShare}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Share Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generate Budget Dialog */}
      <Dialog open={aiGenerateDialog} onOpenChange={setAiGenerateDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              AI Budget Generation
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure AI parameters to generate a comprehensive budget for your property
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Property Selection */}
            <div>
              <Label className="text-gray-300 text-sm font-medium">Target Property</Label>
              <Select 
                value={aiGenerateForm.targetProperty} 
                onValueChange={(value) => setAiGenerateForm(prev => ({...prev, targetProperty: value}))}
              >
                <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {properties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.id} className="text-white">{prop.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AI Generation Options */}
            <div>
              <Label className="text-gray-300 text-sm font-medium mb-3 block">AI Data Sources & Analysis</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="historical" 
                      checked={aiGenerateForm.basedOnHistorical}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, basedOnHistorical: e.target.checked}))}
                      className="rounded" 
                    />
                    <Label htmlFor="historical" className="text-gray-300">
                      3-Year Historical Data Analysis
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="inflation" 
                      checked={aiGenerateForm.includeInflation}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, includeInflation: e.target.checked}))}
                      className="rounded" 
                    />
                    <Label htmlFor="inflation" className="text-gray-300">
                      2025 Inflation Projections (3.2%)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="marketRates" 
                      checked={aiGenerateForm.includeMarketRates}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, includeMarketRates: e.target.checked}))}
                      className="rounded" 
                    />
                    <Label htmlFor="marketRates" className="text-gray-300">
                      Local Market Rate Analysis
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="utilityRates" 
                      checked={aiGenerateForm.includeUtilityRates}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, includeUtilityRates: e.target.checked}))}
                      className="rounded" 
                    />
                    <Label htmlFor="utilityRates" className="text-gray-300">
                      Updated Utility Rate Schedules
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="contracts" 
                      checked={aiGenerateForm.includeContractRenewals}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, includeContractRenewals: e.target.checked}))}
                      className="rounded" 
                    />
                    <Label htmlFor="contracts" className="text-gray-300">
                      Contract Renewal Analysis
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="efficiency" 
                      checked={aiGenerateForm.includeEnergyEfficiency}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, includeEnergyEfficiency: e.target.checked}))}
                      className="rounded" 
                    />
                    <Label htmlFor="efficiency" className="text-gray-300">
                      Energy Efficiency Savings
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="conservative" 
                      checked={aiGenerateForm.conservativeApproach}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, conservativeApproach: e.target.checked, aggressiveGrowth: e.target.checked ? false : prev.aggressiveGrowth}))}
                      className="rounded" 
                    />
                    <Label htmlFor="conservative" className="text-gray-300">
                      Conservative Growth Assumptions
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="aggressive" 
                      checked={aiGenerateForm.aggressiveGrowth}
                      onChange={(e) => setAiGenerateForm(prev => ({...prev, aggressiveGrowth: e.target.checked, conservativeApproach: e.target.checked ? false : prev.conservativeApproach}))}
                      className="rounded" 
                    />
                    <Label htmlFor="aggressive" className="text-gray-300">
                      Aggressive Growth Targets
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Budget Upload */}
            <div>
              <Label className="text-gray-300 text-sm font-medium mb-3 block">Previous Year Budget (Optional)</Label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
                {previousBudgetFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-green-400" />
                      <div>
                        <div className="text-white font-medium">{previousBudgetFile.name}</div>
                        <div className="text-sm text-gray-400">
                          {(previousBudgetFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI analysis
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousBudgetRemove}
                      className="bg-red-600 border-red-600 text-white hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-2">Upload previous year's budget for enhanced AI accuracy</p>
                    <p className="text-sm text-gray-500 mb-4">CSV, XLS, XLSX supported • AI will analyze patterns and trends</p>
                    <input
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'previousBudget')}
                      className="hidden"
                      id="previousBudgetUploadInline"
                    />
                    <label htmlFor="previousBudgetUploadInline">
                      <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Previous Budget File
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
              {previousBudgetFile && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  AI will use this budget as a baseline for more accurate projections
                </div>
              )}
            </div>

            {/* Freeform Notes */}
            <div>
              <Label className="text-gray-300 text-sm font-medium">Special Instructions & Notes</Label>
              <Textarea
                value={aiGenerateForm.freeformNotes}
                onChange={(e) => setAiGenerateForm(prev => ({...prev, freeformNotes: e.target.value}))}
                placeholder="Add any special considerations, upcoming projects, known changes, or specific areas to focus on..."
                className="mt-2 bg-gray-800 border-gray-600 text-white h-24"
              />
              <div className="text-xs text-gray-500 mt-1">
                Example: "Factor in planned HVAC replacement Q3, new maintenance contract starting Jan, expecting 5% rent increase"
              </div>
            </div>

            {/* AI Preview */}
            <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 font-medium">AI Generation Preview</span>
              </div>
              <div className="text-purple-200 text-sm">
                {aiGenerateForm.targetProperty && (
                  <>
                    Generating budget for <strong>{properties.find(p => p.id === aiGenerateForm.targetProperty)?.name}</strong> using{' '}
                    {[
                      aiGenerateForm.basedOnHistorical && 'historical data',
                      aiGenerateForm.includeInflation && 'inflation analysis',
                      aiGenerateForm.includeMarketRates && 'market rates',
                      aiGenerateForm.includeUtilityRates && 'utility rates',
                      aiGenerateForm.includeContractRenewals && 'contract renewals',
                      aiGenerateForm.includeEnergyEfficiency && 'efficiency savings'
                    ].filter(Boolean).join(', ')}
                    {aiGenerateForm.conservativeApproach && ' with conservative assumptions'}
                    {aiGenerateForm.aggressiveGrowth && ' with aggressive growth targets'}
                    .
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAiGenerateDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAiGenerateSubmit}
              disabled={aiAssistantOpen}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {aiAssistantOpen ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Generate Budget
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog for Chart of Accounts */}
      <Dialog open={uploadDialog === 'chartOfAccounts'} onOpenChange={() => setUploadDialog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              Upload Chart of Accounts
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload a CSV or Excel file containing your chart of accounts structure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Drag and drop your file here, or click to browse</p>
              <p className="text-sm text-gray-500">Supports CSV, XLS, XLSX files</p>
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={(e) => handleFileUpload(e, 'chartOfAccounts')}
                className="hidden"
                id="chartOfAccountsUpload"
              />
              <label htmlFor="chartOfAccountsUpload">
                <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 mt-4" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialog(null)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}

// Enhanced Properties Tab Component with Cash Flow and Trust Account Features
function EnhancedPropertiesTab({ 
  role, 
  setActiveTab 
}: { 
  role: 'pm' | 'centralOffice' | 'owner',
  setActiveTab: (tab: string) => void 
}) {
  // Calculate percentage of year elapsed (assuming July, so ~58% of year)
  const yearElapsed = 0.58
  const [expandedProperty, setExpandedProperty] = useState<number | null>(null)
  const [expandedTableRow, setExpandedTableRow] = useState<string | null>(null)

  const properties = [
    {
      id: 1,
      name: "Stanford Graduate School of Business",
      address: "655 Knight Way, Stanford, CA 94305",
      manager: {
        name: "Sarah Chen",
        email: "sarah.chen@stanford.edu",
        phone: "(650) 723-2146"
      },
      type: "Academic",
      size: "285,000 sq ft",
      ytdSpent: 2.2, // In millions - UNDER budget
      annualBudget: 4.3, // In millions
      // Cash Flow Data
      cashFlow: {
        monthly: [
          { month: "Jan", income: 180, expenses: 165, net: 15 },
          { month: "Feb", income: 185, expenses: 172, net: 13 },
          { month: "Mar", income: 190, expenses: 178, net: 12 },
          { month: "Apr", income: 175, expenses: 169, net: 6 },
          { month: "May", income: 195, expenses: 185, net: 10 },
          { month: "Jun", income: 200, expenses: 190, net: 10 },
          { month: "Jul", income: 188, expenses: 175, net: 13 }
        ],
        projectedIncome: 2.1,
        projectedExpenses: 2.0,
        projectedNet: 0.1
      },
      // Trust Account Data
      trustAccount: {
        balance: 485000,
        accountNumber: "TA-2024-001",
        forecastBalance: 520000,
        nextReimbursement: 45000,
        dueDate: "2024-07-25"
      },
      // Cash Flow Issues/Flags
      cashFlowFlags: [],
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 2,
      name: "Mission Bay Tech Campus",
      address: "1700 Owens Street, San Francisco, CA 94158",
      manager: {
        name: "Marcus Rodriguez",
        email: "marcus.rodriguez@consult.com",
        phone: "(415) 555-0123"
      },
      type: "Office",
      size: "450,000 sq ft",
      ytdSpent: 3.4, // In millions - OVER budget
      annualBudget: 5.4, // In millions
      // Cash Flow Data
      cashFlow: {
        monthly: [
          { month: "Jan", income: 280, expenses: 295, net: -15 },
          { month: "Feb", income: 275, expenses: 310, net: -35 },
          { month: "Mar", income: 290, expenses: 320, net: -30 },
          { month: "Apr", income: 285, expenses: 315, net: -30 },
          { month: "May", income: 295, expenses: 325, net: -30 },
          { month: "Jun", income: 300, expenses: 335, net: -35 },
          { month: "Jul", income: 288, expenses: 305, net: -17 }
        ],
        projectedIncome: 3.8,
        projectedExpenses: 4.2,
        projectedNet: -0.4
      },
      // Trust Account Data
      trustAccount: {
        balance: 125000,
        accountNumber: "TA-2024-002",
        forecastBalance: 85000,
        nextReimbursement: 85000,
        dueDate: "2024-07-20"
      },
      // Cash Flow Issues/Flags
      cashFlowFlags: [
        { type: "budget_overage", message: "Over budget by $270K due to unexpected HVAC system replacement and emergency roof repairs. Major capital expenditures exceeded reserve allocations." },
        { type: "cash_flow_negative", message: "Negative cash flow for 6 consecutive months. Trust account running low." }
      ],
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 3,
      name: "Redwood Shores Office Complex",
      address: "500 Oracle Parkway, Redwood City, CA 94065",
      manager: {
        name: "Sarah Kim",
        email: "sarah.kim@oracle.com",
        phone: "(650) 506-7000"
      },
      type: "Office",
      size: "320,000 sq ft",
      ytdSpent: 1.9, // In millions - UNDER budget
      annualBudget: 3.8, // In millions
      // Cash Flow Data
      cashFlow: {
        monthly: [
          { month: "Jan", income: 220, expenses: 195, net: 25 },
          { month: "Feb", income: 225, expenses: 200, net: 25 },
          { month: "Mar", income: 230, expenses: 205, net: 25 },
          { month: "Apr", income: 215, expenses: 190, net: 25 },
          { month: "May", income: 235, expenses: 210, net: 25 },
          { month: "Jun", income: 240, expenses: 215, net: 25 },
          { month: "Jul", income: 228, expenses: 203, net: 25 }
        ],
        projectedIncome: 3.1,
        projectedExpenses: 2.8,
        projectedNet: 0.3
      },
      // Trust Account Data
      trustAccount: {
        balance: 650000,
        accountNumber: "TA-2024-003",
        forecastBalance: 720000,
        nextReimbursement: 25000,
        dueDate: "2024-08-01"
      },
      // Cash Flow Issues/Flags
      cashFlowFlags: [],
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 4,
      name: "Palo Alto Research Center",
      address: "3333 Coyote Hill Road, Palo Alto, CA 94304",
      manager: {
        name: "David Rodriguez",
        email: "david.rodriguez@xerox.com",
        phone: "(650) 812-4000"
      },
      type: "Research",
      size: "200,000 sq ft",
      ytdSpent: 1.5, // In millions - UNDER budget
      annualBudget: 3.0, // In millions
      // Cash Flow Data
      cashFlow: {
        monthly: [
          { month: "Jan", income: 165, expenses: 150, net: 15 },
          { month: "Feb", income: 170, expenses: 155, net: 15 },
          { month: "Mar", income: 175, expenses: 160, net: 15 },
          { month: "Apr", income: 160, expenses: 145, net: 15 },
          { month: "May", income: 180, expenses: 165, net: 15 },
          { month: "Jun", income: 185, expenses: 170, net: 15 },
          { month: "Jul", income: 173, expenses: 158, net: 15 }
        ],
        projectedIncome: 2.4,
        projectedExpenses: 2.2,
        projectedNet: 0.2
      },
      // Trust Account Data
      trustAccount: {
        balance: 420000,
        accountNumber: "TA-2024-004",
        forecastBalance: 465000,
        nextReimbursement: 35000,
        dueDate: "2024-07-30"
      },
      // Cash Flow Issues/Flags
      cashFlowFlags: [],
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 5,
      name: "South Bay Industrial Park",
      address: "1000 Innovation Drive, San Jose, CA 95110",
      manager: {
        name: "Angela Martinez",
        email: "angela.martinez@seogate.com",
        phone: "(408) 555-7890"
      },
      type: "Industrial",
      size: "600,000 sq ft",
      ytdSpent: 2.9, // In millions - OVER budget
      annualBudget: 4.8, // In millions
      // Cash Flow Data
      cashFlow: {
        monthly: [
          { month: "Jan", income: 310, expenses: 330, net: -20 },
          { month: "Feb", income: 305, expenses: 325, net: -20 },
          { month: "Mar", income: 315, expenses: 340, net: -25 },
          { month: "Apr", income: 300, expenses: 320, net: -20 },
          { month: "May", income: 320, expenses: 345, net: -25 },
          { month: "Jun", income: 325, expenses: 350, net: -25 },
          { month: "Jul", income: 312, expenses: 330, net: -18 }
        ],
        projectedIncome: 4.2,
        projectedExpenses: 4.5,
        projectedNet: -0.3
      },
      // Trust Account Data
      trustAccount: {
        balance: 180000,
        accountNumber: "TA-2024-005",
        forecastBalance: 140000,
        nextReimbursement: 65000,
        dueDate: "2024-07-22"
      },
      // Cash Flow Issues/Flags
      cashFlowFlags: [
        { type: "budget_overage", message: "Over budget by $120K due to increased maintenance costs from aging industrial equipment and higher utility expenses." }
      ],
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    }
  ]

  // Property-specific data for table
  const propertyTableData = [
    { 
      name: "01 STANFORD", 
      address: "655 Knight Way, Stanford, CA",
      staff: [
        { name: "Sarah Chen", role: "Property Manager", phone: "(650) 723-2146", email: "sarah.chen@stanford.edu" }
      ]
    },
    { 
      name: "02 SUNNYVALE", 
      address: "432 Sunnyvale Ave, Sunnyvale, CA",
      staff: [
        { name: "Mike Johnson", role: "Site Manager", phone: "(408) 555-0198", email: "mike.johnson@sunnyvale.com" }
      ]
    },
    { 
      name: "03 DOWNTOWN", 
      address: "123 Market St, San Francisco, CA",
      staff: [
        { name: "Lisa Wong", role: "Building Manager", phone: "(415) 555-0142", email: "lisa.wong@dtlofts.com" }
      ]
    }
  ]

  const handleViewExpenses = (propertyId: number) => {
    // Role-based navigation
    if (role === 'pm') {
      setActiveTab('wallet'); // PM > Expenses
    } else if (role === 'centralOffice') {
      setActiveTab('transactions'); // Central Office > Transactions
    } else {
      setActiveTab('transactions'); // Owner > Transactions
    }
  }

  const totalBudget = properties.reduce((sum, prop) => sum + prop.annualBudget, 0)
  const totalSpent = properties.reduce((sum, prop) => sum + prop.ytdSpent, 0)
  const propertiesUnderBudget = properties.filter(prop => prop.isUnderBudget).length
  const propertiesOverBudget = properties.length - propertiesUnderBudget

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Properties</h2>
        <div className="text-sm text-gray-400">
          {propertiesUnderBudget} under budget • {propertiesOverBudget} over budget • ${totalBudget.toFixed(1)}M total budget
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-white mb-1">
                    {property.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{property.address}</p>
                </div>
                <Badge className={`${property.isUnderBudget ? 'bg-green-500' : 'bg-red-500'} text-white text-xs ml-2`}>
                  {property.isUnderBudget ? 'Under' : 'Over'} budget by {property.variancePercentage.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cash Flow Issues/Flags - Show at top if any exist */}
              {property.cashFlowFlags.length > 0 && (
                <div className="space-y-2">
                  {property.cashFlowFlags.map((flag, idx) => (
                    <div key={idx} className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-red-300 mb-1">
                            {flag.type === 'budget_overage' ? 'Budget Overage' : 'Cash Flow Issue'}
                          </div>
                          <div className="text-xs text-red-200">{flag.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Budget Variance - Primary Metric */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Budget Variance</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div className="font-medium">Calculation:</div>
                          <div>YTD Spend: ${property.ytdSpent.toFixed(1)}M</div>
                          <div>Expected (58% of year): ${property.expectedSpend.toFixed(1)}M</div>
                          <div>Variance: ${property.varianceAmount.toFixed(1)}M ({property.isUnderBudget ? 'under' : 'over'} budget)</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Budget Variance Display */}
                <div className="text-center">
                  <div className={`text-3xl font-bold ${property.isUnderBudget ? 'text-green-400' : 'text-red-400'} mb-2`}>
                    {property.isUnderBudget ? '-' : '+'}{property.variancePercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {property.isUnderBudget ? 'Under' : 'Over'} budget by ${Math.abs(property.varianceAmount).toFixed(1)}M
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`${property.isUnderBudget ? 'bg-green-500' : 'bg-red-500'} h-3 rounded-full`}
                    style={{ width: `${Math.min(property.budgetVariance, 100)}%` }}
                  />
                </div>
              </div>

              {/* Trust Account Balance + Forecast */}
              <div className="bg-gray-900 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Trust Account</h4>
                  <Badge className="bg-blue-600 text-white text-xs">{property.trustAccount.accountNumber}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Current Balance</div>
                    <div className="text-lg font-bold text-white">${property.trustAccount.balance.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Forecasted</div>
                    <div className={`text-lg font-bold ${property.trustAccount.forecastBalance > property.trustAccount.balance ? 'text-green-400' : 'text-yellow-400'}`}>
                      ${property.trustAccount.forecastBalance.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-400">Next Reimbursement: ${property.trustAccount.nextReimbursement.toLocaleString()} on {property.trustAccount.dueDate}</div>
                </div>
              </div>

              {/* Cash Flow View - Expandable */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => setExpandedProperty(expandedProperty === property.id ? null : property.id)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Cash Flow View
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${expandedProperty === property.id ? 'rotate-180' : ''}`} />
                </Button>

                {expandedProperty === property.id && (
                  <div className="bg-gray-900 rounded-lg p-4 space-y-4">
                    {/* Monthly Cash Flow Chart */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Monthly Cash Flow (YTD)</h5>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={property.cashFlow.monthly}>
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                              labelStyle={{ color: '#F3F4F6' }}
                            />
                            <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={2} />
                            <Line type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={1} />
                            <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={1} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Cash Flow Projections */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Projected Income</div>
                        <div className="text-sm font-bold text-blue-400">${property.cashFlow.projectedIncome.toFixed(1)}M</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Projected Expenses</div>
                        <div className="text-sm font-bold text-red-400">${property.cashFlow.projectedExpenses.toFixed(1)}M</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Net Cash Flow</div>
                        <div className={`text-sm font-bold ${property.cashFlow.projectedNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${property.cashFlow.projectedNet.toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">YTD Spend</div>
                  <div className="text-lg font-bold text-white">${property.ytdSpent.toFixed(1)}M</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Annual Budget</div>
                  <div className="text-lg font-bold text-white">${property.annualBudget.toFixed(1)}M</div>
                </div>
              </div>

              {/* Property Manager */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Property Manager</h4>
                <div className="text-sm text-white">
                  <div className="font-medium">{property.manager.name}</div>
                  <div className="text-gray-400">{property.manager.email}</div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Type</h4>
                  <p className="text-sm text-white">{property.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Size</h4>
                  <p className="text-sm text-white">{property.size}</p>
                </div>
              </div>

              {/* View Expenses Button */}
              <Button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => handleViewExpenses(property.id)}
              >
                View Expenses
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Properties Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Properties</h3>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm font-medium text-gray-300">Property</div>
              <div className="text-sm font-medium text-gray-300">Address</div>
            </div>
          </div>

          {/* Individual Property Rows */}
          {propertyTableData.map((property, idx) => (
            <div key={property.name} className={`${idx === propertyTableData.length - 1 ? '' : 'border-b border-gray-700'}`}>
              <div 
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() => setExpandedTableRow(expandedTableRow === property.name ? null : property.name)}
              >
                <ChevronRight className={`h-4 w-4 text-gray-400 mr-2 transition-transform ${expandedTableRow === property.name ? 'rotate-90' : ''}`} />
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="text-white">{property.name}</div>
                  <div className="text-gray-400">{property.address}</div>
                </div>
              </div>

              {/* Property Expanded Content */}
              {expandedTableRow === property.name && (
                <div className="bg-gray-900 px-8 py-4">
                  {/* Staff at Property */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-4 w-4 text-blue-400" />
                      <h4 className="text-blue-400 font-medium">Staff at {property.name}</h4>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-2 text-gray-400 font-medium">Name</th>
                            <th className="text-left py-2 text-gray-400 font-medium">Role</th>
                            <th className="text-left py-2 text-gray-400 font-medium">Phone</th>
                            <th className="text-left py-2 text-gray-400 font-medium">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {property.staff.map((staff, staffIdx) => (
                            <tr key={staffIdx} className="border-b border-gray-800">
                              <td className="py-2 text-white">{staff.name}</td>
                              <td className="py-2 text-white">{staff.role}</td>
                              <td className="py-2 text-white">{staff.phone}</td>
                              <td className="py-2 text-white">{staff.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PMFinancialDashboard() {
  const router = useRouter()
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [approvalSearch, setApprovalSearch] = useState("")
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false)
  const [newPropertyDialogOpen, setNewPropertyDialogOpen] = useState(false)
  const [importAppFolioDialogOpen, setImportAppFolioDialogOpen] = useState(false)
  const [jobViewDialogOpen, setJobViewDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<typeof jobsList[0] | null>(null)
  const [jobs, setJobs] = useState(jobsList)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<typeof jobsList[0] | null>(null)
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false)
  const [editJob, setEditJob] = useState<typeof jobsList[0] | null>(null)
  const [staff, setStaff] = useState(staffList)
  const [newStaffDialogOpen, setNewStaffDialogOpen] = useState(false)
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false)
  const [viewStaffJobsDialogOpen, setViewStaffJobsDialogOpen] = useState(false)
  const [viewStaff, setViewStaff] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [editStaff, setEditStaff] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [newStaffName, setNewStaffName] = useState("")
  const [newStaffPhone, setNewStaffPhone] = useState("")
  const [editStaffName, setEditStaffName] = useState("")
  const [editStaffPhone, setEditStaffPhone] = useState("")
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null)
  const [walletBillable, setWalletBillable] = useState<{ [key: number]: boolean }>({})
  const [newJobCost, setNewJobCost] = useState(0)
  const [newJobPreApproval, setNewJobPreApproval] = useState<'Required' | 'Not Required'>('Not Required')
  const [approvalJobs, setApprovalJobs] = useState<{ [id: string]: { sentAt: string, status: string, note?: string } }>({})
  // State for pre-approval workflow
  const [showPreApprovalDialog, setShowPreApprovalDialog] = useState(false);
  const [showSendEmailDialog, setShowSendEmailDialog] = useState(false);
  const [pendingJob, setPendingJob] = useState<any>(null);
  // Update role state to include 'owner'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice' | 'owner'>('pm');
  // For demo, use Alice Johnson as the logged-in technician
  const technicianName = 'Alice Johnson';
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesJob, setNotesJob] = useState<any>(null);
  const [newNote, setNewNote] = useState("");
  // Store notes per job (mock for now, can be persisted)
  const [jobNotes, setJobNotes] = useState<{ [jobId: string]: { author: string, content: string, timestamp: string }[] }>({});
  const [pendingAssignments, setPendingAssignments] = useState<{ [txnId: string]: string } | null>(null);
  // Add state for selected job transactions
  const [selectedJobForTransactions, setSelectedJobForTransactions] = useState<typeof jobsList[0] | null>(null);
  // Add state for selected transaction details
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  // Add state for expanded job expenses
  const [expandedJobExpenses, setExpandedJobExpenses] = useState<string | null>(null);
  // Add state for expanded property employees
  const [expandedPropertyEmployees, setExpandedPropertyEmployees] = useState<string | null>(null);
  // Add state for Expenses tab filters
  const [expensesJobFilter, setExpensesJobFilter] = useState<string>('not_assigned');
  const [expensesPropertyFilter, setExpensesPropertyFilter] = useState<string>('not_assigned');
  // Add state for transaction assignments in Expenses tab
  const [txnAssignments, setTxnAssignments] = useState<{ [txnId: string]: { property?: string; job?: string } }>({});
  // Add state for memo and receipt uploads in Expenses tab
  const [txnMemos, setTxnMemos] = useState<{ [txnId: string]: string }>({});
  const [txnReceipts, setTxnReceipts] = useState<{ [txnId: string]: File | null }>({});
  // Add state for Activity tab filters
  const [activityPropertyFilter, setActivityPropertyFilter] = useState<string>('all');
  const [activityJobFilter, setActivityJobFilter] = useState<string>('all');
  const [activityMilestoneFilter, setActivityMilestoneFilter] = useState<string>('all');
  const [activityOwnerFilter, setActivityOwnerFilter] = useState<string>('all');
  // Add state for new activity row in Activity tab
  const [newActivity, setNewActivity] = useState<any | null>(null);
  // Add state for uploaded files in Activity tab
  const [activityFiles, setActivityFiles] = useState<{ [key: string]: File[] }>({});
  // State for Smart Assist chat
  const [smartAssistInput, setSmartAssistInput] = useState("");
  const [smartAssistChat, setSmartAssistChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  // State for Transactions tab filters
  const [txnFilterStatus, setTxnFilterStatus] = useState<string>('all');
  const [txnFilterBillable, setTxnFilterBillable] = useState<string>('all');
  const [txnFilterProperty, setTxnFilterProperty] = useState<string>('all');
  const [txnFilterJob, setTxnFilterJob] = useState<string>('all');
  const [txnFilterDateFrom, setTxnFilterDateFrom] = useState<string>('');
  const [txnFilterDateTo, setTxnFilterDateTo] = useState<string>('');
  const [txnFilterMadeBy, setTxnFilterMadeBy] = useState<string>('all');
  // State for job timeline modal
  const [timelineJob, setTimelineJob] = useState<typeof jobsList[0] | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  // State for new work order form
  const [newWorkOrder, setNewWorkOrder] = useState({
    property: '',
    description: '',
    
    notes: '',
    cost: '',
    priority: 'Medium'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // Add state for new activity dialog
  const [newActivityDialogOpen, setNewActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activityFile, setActivityFile] = useState<File | null>(null);
  
  // Add state for new expense dialog
  const [newExpenseDialogOpen, setNewExpenseDialogOpen] = useState(false);
  
  // Add state for invoice flagging
  const [flagInvoiceDialogOpen, setFlagInvoiceDialogOpen] = useState(false);
  const [selectedInvoiceForFlagging, setSelectedInvoiceForFlagging] = useState<Transaction | null>(null);
  const [flagInvoiceForm, setFlagInvoiceForm] = useState({
    flaggedTo: 'co' as 'co' | 'owner',
    reason: ''
  });
  
  const [selectedInvoiceForPing, setSelectedInvoiceForPing] = useState<Transaction | null>(null);
  
  // Add state for main expense form (for adding new expenses)
  const [mainExpenseForm, setMainExpenseForm] = useState({
    vendor: '',
    amount: '',
    madeBy: '',
    billable: true,
    memo: '',
    receipt: '',
    expenseType: 'credit_card' as 'credit_card' | 'invoice',
    invoiceNumber: '',
    dueDate: '',
    supportingDocs: [] as File[]
  });
  
  // Add state for editing expense in form
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: '' // store as string
  });
  
  // Add state for edit job form
  const [editJobForm, setEditJobForm] = useState({
    property: '',
    description: '',
    cost: '',
    priority: 'Medium'
  });
  
  // Add state for transactions
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsList);

  // Add state for inline editing of uncategorized expenses
  const [inlineEditingExpense, setInlineEditingExpense] = useState<string | null>(null);
  const [inlineExpenseForm, setInlineExpenseForm] = useState({
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: '' // store as string
  });

  // Add state for new transaction form (Central Office)
  const [newTransactionDialogOpen, setNewTransactionDialogOpen] = useState(false);
  const [newTransactionForm, setNewTransactionForm] = useState({
    date: '',
    vendor: '',
    amount: '',
    madeBy: '',
    cardHolder: '',
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: ''
  });

  // Add state for transaction review flags
  const [transactionReviewFlags, setTransactionReviewFlags] = useState<{ [txnId: string]: string }>({
    'txn1': 'Missing receipt',
    'txn3': 'Wrong property',
    'txn5': 'Unusual amount',
    'txn7': 'Missing memo'
  });

  // Add state for toggling review table visibility
  const [reviewTableExpanded, setReviewTableExpanded] = useState(false);

  // Add state for payment ping functionality
  const [pingPaymentDialogOpen, setPingPaymentDialogOpen] = useState(false);
  const [pingRecipient, setPingRecipient] = useState<'co' | 'owner'>('co');
  const [pingMessage, setPingMessage] = useState('');

  // Add state for editing transactions (Central Office)
  const [editTransactionDialogOpen, setEditTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editTransactionForm, setEditTransactionForm] = useState({
    date: '',
    vendor: '',
    amount: '',
    madeBy: '',
    cardHolder: '',
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: ''
  });

  // Card dialog states
  const [issueCardDialogOpen, setIssueCardDialogOpen] = useState(false);
  const [connectCardDialogOpen, setConnectCardDialogOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    type: 'virtual' as CardType,
    holder: '',
    position: 'Technician' as EnhancedCard['position'],
    limit: '',
    assignedProperties: [] as string[],
    vendorRestrictions: [] as string[],
    isExistingCard: false,
    brand: 'Chase' as EnhancedCard['brand'],
    assignedStaff: [] as string[]
  });

  // Nudge dialog states
  const [nudgeDialogOpen, setNudgeDialogOpen] = useState(false);
  const [selectedNudgeTransaction, setSelectedNudgeTransaction] = useState<any>(null);
  const [nudgeMessage, setNudgeMessage] = useState('');

  // Communications state
  const [messages, setMessages] = useState([
    {
      id: "1",
      propertyId: "stanford",
      propertyName: "Stanford Graduate School of Business",
      senderId: "owner1",
      senderName: "Property Owner",
      senderRole: "owner",
      content: "Hi! I need an update on the HVAC maintenance work order. When can we expect it to be completed?",
      timestamp: new Date("2024-01-20T10:00:00"),
      status: "unread",
      threadId: "thread_stanford_1",
      type: "property_specific"
    },
    {
      id: "2",
      propertyId: "central",
      propertyName: "Central Office",
      senderId: "co1",
      senderName: "Central Office",
      senderRole: "centralOffice",
      content: "Please review the updated expense policy for vendor restrictions. New limits have been set for office supplies.",
      timestamp: new Date("2024-01-19T14:30:00"),
      status: "unread",
      threadId: "thread_central_1",
      type: "property_agnostic"
    },
    {
      id: "3",
      propertyId: "stanford",
      propertyName: "Stanford Graduate School of Business",
      senderId: "tech1",
      senderName: "Alice Johnson",
      senderRole: "technician",
      content: "I've completed the plumbing repair at Stanford GSB. All fixtures are working properly now.",
      timestamp: new Date("2024-01-18T16:45:00"),
      status: "read",
      threadId: "thread_stanford_2",
      type: "property_specific"
    }
  ]);
  const [communicationMessage, setCommunicationMessage] = useState("");
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState("all");
  const [selectedCommThread, setSelectedCommThread] = useState<string | null>(null);

  // Expense Requests state
  const [expenseRequests, setExpenseRequests] = useState<ExpenseRequest[]>(mockExpenseRequests);
  const [expensePolicyDialogOpen, setExpensePolicyDialogOpen] = useState(false);
  const [policyRules, setPolicyRules] = useState([
    {
      id: 1,
      category: 'Emergency Repairs',
      rule: 'Emergency repairs over $300 are automatically billable to owner',
      aiEnabled: true,
      active: true
    },
    {
      id: 2,
      category: 'Pre-approval',
      rule: 'Expenses over $500 require pre-approval',
      aiEnabled: true,
      active: true
    },
    {
      id: 3,
      category: 'Receipt Requirements',
      rule: 'All expenses over $25 require receipt within 48 hours',
      aiEnabled: true,
      active: true
    },
    {
      id: 4,
      category: 'Vehicle Expenses',
      rule: 'Mileage and gas for emergency calls are reimbursable',
      aiEnabled: true,
      active: true
    }
  ]);

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // State for enhanced reimbursement functionality
  const [reimbursementDialogOpen, setReimbursementDialogOpen] = useState(false);
  const [selectedReimbursementJob, setSelectedReimbursementJob] = useState<any>(null);
  const [reimbursementAmount, setReimbursementAmount] = useState(0);
  const [reimbursementNote, setReimbursementNote] = useState('');
  const [reimbursementMethod, setReimbursementMethod] = useState('check'); // check, wire, ach
  const [sendReportToOwner, setSendReportToOwner] = useState(true);
  const [reimbursementDate, setReimbursementDate] = useState(new Date().toISOString().split('T')[0]);
  const [ownerNotificationMethod, setOwnerNotificationMethod] = useState('email'); // email, phone, text, none
  
  // State for Policy tab
  const [aiPolicyContent, setAiPolicyContent] = useState(`# AI Expense Policy Guidelines

## General Principles
- All expenses must be reasonable and necessary for business operations
- Receipts are required for all purchases over $25
- Pre-approval required for expenses over $500
- All expenses must be properly categorized as billable or non-billable

## Billable vs Non-Billable Guidelines

### Billable Expenses
- Property-specific repairs and maintenance
- Materials and supplies for work orders
- Emergency repairs (with proper documentation)
- Property-specific tools and equipment

### Non-Billable Expenses
- General office supplies
- Personal tools and equipment
- Non-property-specific expenses
- Administrative costs

## Receipt Requirements
- All receipts must be clear and legible
- Receipts must show date, vendor, items, and total amount
- Digital receipts are acceptable
- Receipts must be uploaded within 48 hours of purchase

## Pre-Approval Process
- Expenses over $500 require pre-approval
- Emergency repairs may be approved after the fact
- All pre-approval requests must include detailed justification
- Response time: within 24 hours during business days`);

  const [policyEditMode, setPolicyEditMode] = useState(false);
  const [expenseQuestions, setExpenseQuestions] = useState<{
    id: number;
    question: string;
    answer: 'yes' | 'no' | null;
    timestamp: string | null;
    category: string;
  }[]>([
    { id: 1, question: "Is this expense reasonable and necessary?", answer: null, timestamp: null, category: "general" },
    { id: 2, question: "Should this be billable to the property/owner?", answer: null, timestamp: null, category: "billing" },
    { id: 3, question: "Is a receipt required for this purchase?", answer: null, timestamp: null, category: "documentation" },
    { id: 4, question: "Does this require pre-approval?", answer: null, timestamp: null, category: "approval" },
    { id: 5, question: "Is this an emergency repair?", answer: null, timestamp: null, category: "priority" },
    { id: 6, question: "Is this a property-specific expense?", answer: null, timestamp: null, category: "billing" },
    { id: 7, question: "Is this a recurring expense?", answer: null, timestamp: null, category: "general" },
    { id: 8, question: "Is this expense within budget?", answer: null, timestamp: null, category: "approval" }
  ]);
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', category: 'general' });

  // State for help request functionality
  const [helpRequestDialogOpen, setHelpRequestDialogOpen] = useState(false);
  const [helpRequestForm, setHelpRequestForm] = useState({
    expenseId: 'none',
    question: '',
    urgency: 'normal',
    additionalDetails: ''
  });
  const [helpRequests, setHelpRequests] = useState<{
    id: string;
    expenseId: string;
    technicianName: string;
    question: string;
    urgency: 'low' | 'normal' | 'high';
    additionalDetails: string;
    status: 'pending' | 'answered' | 'resolved';
    createdAt: string;
    answeredAt?: string;
    answer?: string;
  }[]>([]);

  // State for help request response dialog
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedHelpRequest, setSelectedHelpRequest] = useState<any>(null);
  const [responseForm, setResponseForm] = useState({
    answer: '',
    decisionTrackerAnswers: {
      'Is this expense reasonable and necessary?': null,
      'Should this be billable to the property/owner?': null,
      'Is a receipt required?': null,
      'Does this require pre-approval?': null,
      'Is this an emergency repair?': null,
      'Is this a capital improvement?': null,
      'Should this be reimbursed?': null,
      'Is this within budget limits?': null
    }
  });

  // State for expanded work orders in payments tab
  const [expandedWorkOrders, setExpandedWorkOrders] = useState<Set<string>>(new Set());
  
  // State for monthly reports
  const [monthlyReportDialogOpen, setMonthlyReportDialogOpen] = useState(false);
  const [selectedReportProperty, setSelectedReportProperty] = useState<any>(null);
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  // Enhanced state for monthly reimbursements and trust accounts
  const [monthlyReimbursementDialogOpen, setMonthlyReimbursementDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedPropertyForMonthly, setSelectedPropertyForMonthly] = useState<any>(null);
  const [ccRecipient, setCcRecipient] = useState({ name: '', email: '' });
  const [editingPolicyRule, setEditingPolicyRule] = useState<any>(null);
  const [policyRuleEditDialogOpen, setPolicyRuleEditDialogOpen] = useState(false);
  const [editedRule, setEditedRule] = useState({ category: '', rule: '', aiEnabled: false, active: false });

  // Flagged Expenses and Property Manager Communication state
  const [pmMessagePopupOpen, setPmMessagePopupOpen] = useState(false);
  const [selectedFlaggedExpense, setSelectedFlaggedExpense] = useState<any>(null);
  const [pmMessageForm, setPmMessageForm] = useState({
    subject: '',
    message: '',
    urgent: false,
    requestType: 'clarification' // clarification, correction, approval
  });

  // Variance Comments state
  const [selectedVarianceProperty, setSelectedVarianceProperty] = useState('all');
  const [varianceCommentDialog, setVarianceCommentDialog] = useState(false);
  const [selectedVarianceItem, setSelectedVarianceItem] = useState<any>(null);
  const [varianceCommentForm, setVarianceCommentForm] = useState({
    comment: '',
    reason: '',
    correctiveAction: ''
  });

  // Collateral Hub state variables
  const [collateralViewMode, setCollateralViewMode] = useState<'card' | 'list'>('card');
  const [collateralSearchQuery, setCollateralSearchQuery] = useState('');
  const [collateralDebouncedSearchQuery, setCollateralDebouncedSearchQuery] = useState('');
  const [collateralIsSearching, setCollateralIsSearching] = useState(false);
  const [collateralFilterProperty, setCollateralFilterProperty] = useState('all');
  const [collateralFilterDocType, setCollateralFilterDocType] = useState('all');
  const [collateralFilterUploadedBy, setCollateralFilterUploadedBy] = useState('all');
  const [collateralFilterArea, setCollateralFilterArea] = useState('all');
  const [collateralFilterDateFrom, setCollateralFilterDateFrom] = useState('');
  const [collateralFilterDateTo, setCollateralFilterDateTo] = useState('');
  const [collateralUploadDialogOpen, setCollateralUploadDialogOpen] = useState(false);
  const [collateralPreviewDialogOpen, setCollateralPreviewDialogOpen] = useState(false);
  
  // AI Search State
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState<any>(null);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchSuggestions, setAiSearchSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [askAiModalOpen, setAskAiModalOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, documents?: any[]}>>([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [selectedCollateralDoc, setSelectedCollateralDoc] = useState<CollateralDocument | null>(null);
  const [collateralAIAssistOpen, setCollateralAIAssistOpen] = useState(false);
  const [collateralAIQuery, setCollateralAIQuery] = useState('');
  const [collateralAIResults, setCollateralAIResults] = useState<CollateralDocument[]>([]);
  const [collateralSelectedDocs, setCollateralSelectedDocs] = useState<string[]>([]);
  const [collateralDocs, setCollateralDocs] = useState<CollateralDocument[]>(collateralDocuments);
  const [collateralUploadForm, setCollateralUploadForm] = useState({
    files: [] as File[],
    documentType: 'other' as DocumentType,
    propertyId: '',
    tags: [] as string[],
    newTag: '',
    description: '',
    linkedExpenseId: '',
    linkedJobId: '',
    linkedVendor: '',
    amount: '',
    expiryDate: ''
  });

  // Collateral Documents Needing Review state
  const [collateralReviewTableExpanded, setCollateralReviewTableExpanded] = useState(false);
  const [showUploadCallout, setShowUploadCallout] = useState(false);
  const [collateralFileInput, setCollateralFileInput] = useState<HTMLInputElement | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [confirmingDocumentId, setConfirmingDocumentId] = useState<string | null>(null);

  // Mock data for documents needing review/categorization
  const documentsNeedingReview = [
    {
      id: 'rev1',
      filename: 'Invoice_HomeDepot_2024_07_15.pdf',
      documentType: 'invoice' as DocumentType,
      uploadDate: '2024-07-15',
      uploadedBy: 'alice.johnson@company.com',
      propertyId: 'prop1',
      propertyName: 'Stanford GSB',
      description: 'HVAC repair materials',
      amount: 1250.75,
      tags: ['HVAC', 'repair'],
      linkedVendor: 'Home Depot',
      status: 'pending_review',
      reviewFlags: ['Missing work order link', 'Verify correct property assignment'],
      assignedTo: 'Property Manager'
    },
    {
      id: 'rev2',
      filename: 'Receipt_Lowes_Emergency_Plumbing.jpg',
      documentType: 'receipt' as DocumentType,
      uploadDate: '2024-07-14',
      uploadedBy: 'mike.tech@company.com',
      propertyId: 'prop2',
      propertyName: 'Mission Bay Tech Campus',
      description: 'Emergency plumbing supplies',
      amount: 485.20,
      tags: ['plumbing', 'emergency'],
      linkedVendor: 'Lowes',
      status: 'pending_review',
      reviewFlags: ['Verify property assignment', 'Add work order reference'],
      assignedTo: 'Central Office'
    },
    {
      id: 'rev3',
      filename: 'Contract_HVAC_Annual_Service.pdf',
      documentType: 'contract' as DocumentType,
      uploadDate: '2024-07-13',
      uploadedBy: 'sarah.pm@company.com',
      propertyId: 'prop1',
      propertyName: 'Stanford GSB',
      description: 'Annual HVAC service contract',
      amount: 5200.00,
      tags: ['HVAC', 'contract', 'annual'],
      linkedVendor: 'CoolAir Services',
      status: 'pending_review',
      reviewFlags: ['Confirm property assignment', 'Add contract tags'],
      assignedTo: 'Legal & Finance'
    }
  ];

  // State for Advanced Payment Tools
  const [linkAccountsExpanded, setLinkAccountsExpanded] = useState(false);
  const [creditCardBillsExpanded, setCreditCardBillsExpanded] = useState(false);
  const [pendingInvoicesExpanded, setPendingInvoicesExpanded] = useState(false);
  const [paymentActionsExpanded, setPaymentActionsExpanded] = useState(true);
  const [reimburseExpensesExpanded, setReimburseExpensesExpanded] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [paymentType, setPaymentType] = useState<'one-time' | 'installments'>('one-time');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedPersonalExpenses, setSelectedPersonalExpenses] = useState<string[]>([]);
  
  // Dialog states for Advanced Payment Tools
  const [linkAccountDialogOpen, setLinkAccountDialogOpen] = useState(false);
  const [selectedAccountForLinking, setSelectedAccountForLinking] = useState<any>(null);
  const [expenseDetailsDialogOpen, setExpenseDetailsDialogOpen] = useState(false);
  const [selectedExpenseForView, setSelectedExpenseForView] = useState<any>(null);
  const [payNowDialogOpen, setPayNowDialogOpen] = useState(false);
  const [selectedCardForPayment, setSelectedCardForPayment] = useState<any>(null);
  const [processPaymentDialogOpen, setProcessPaymentDialogOpen] = useState(false);
  const [reimbursementReviewDialogOpen, setReimbursementReviewDialogOpen] = useState(false);
  const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false);
  
  // Mock state for bank accounts and trust accounts (to simulate updates)
  const [bankAccountsState, setBankAccountsState] = useState(bankAccounts);
  const [trustAccountsState, setTrustAccountsState] = useState(ownerTrustAccounts);
  
  // State for Reports functionality
  const [reportDateRange, setReportDateRange] = useState({ from: "", to: "" });
  const [reportSelectedProperties, setReportSelectedProperties] = useState<string[]>([]);
  const [reportSelectedGLCodes, setReportSelectedGLCodes] = useState<string[]>([]);
  const [reportSelectedExpenseStatus, setReportSelectedExpenseStatus] = useState<string[]>([]);
  const [reportSelectedTrustAccount, setReportSelectedTrustAccount] = useState("all");
  const [reportType, setReportType] = useState("trust-reconciliation");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [emailReportDialogOpen, setEmailReportDialogOpen] = useState(false);
  const [downloadReportDialogOpen, setDownloadReportDialogOpen] = useState(false);
  const [reportEmailForm, setReportEmailForm] = useState({
    recipientName: '',
    recipientEmail: '',
    message: '',
    format: 'csv' as 'csv' | 'pdf'
  });
  const [reportDownloadForm, setReportDownloadForm] = useState({
    format: 'csv' as 'csv' | 'pdf'
  });
  const [selectedRecentReport, setSelectedRecentReport] = useState<any>(null);

  // Helper functions for Advanced Payment Tools
  const handleLinkAccount = (account: any, shouldLink: boolean) => {
    setSelectedAccountForLinking({ ...account, actionType: shouldLink ? 'link' : 'unlink' });
    setLinkAccountDialogOpen(true);
  };

  const confirmLinkAccount = () => {
    if (!selectedAccountForLinking) return;
    
    const { actionType } = selectedAccountForLinking;
    const newStatus = actionType === 'link' ? 'linked' : 'not_linked';
    
    // Update bank accounts state
    setBankAccountsState(prev => prev.map(acc => 
      acc.id === selectedAccountForLinking.id 
        ? { ...acc, status: newStatus }
        : acc
    ));
    
    // Update corresponding trust accounts based on bank name matching
    const bankName = selectedAccountForLinking.name.toLowerCase().split(' ')[0]; // e.g., "wells", "chase", "bank"
    
    setTrustAccountsState(prev => prev.map(trust => {
      const trustBankName = trust.bankName.toLowerCase();
      const shouldBeLinked = trustBankName.includes(bankName) || bankName.includes(trustBankName.split(' ')[0]);
      
      if (shouldBeLinked) {
        return { 
          ...trust, 
          status: newStatus,
          autoSync: newStatus === 'linked'
        };
      }
      return trust;
    }));
    
    setLinkAccountDialogOpen(false);
    setSelectedAccountForLinking(null);
  };

  const handleViewExpense = (invoice: any) => {
    // Mock expense details
    setSelectedExpenseForView({
      ...invoice,
      expenseDetails: {
        submittedBy: 'Alice Johnson',
        submittedDate: '2025-01-15',
        category: 'Maintenance & Repairs',
        jobId: 'job1',
        receiptUrl: '/receipts/sample.pdf',
        approvalStatus: 'Approved',
        notes: 'Emergency repair required for property maintenance'
      }
    });
    setExpenseDetailsDialogOpen(true);
  };

  const handlePayNow = (card: any) => {
    setSelectedCardForPayment(card);
    setPayNowDialogOpen(true);
  };

  const handleProcessPayment = () => {
    if (selectedInvoices.length === 0) return;
    setProcessPaymentDialogOpen(true);
  };

  const handleReviewReimburse = () => {
    if (selectedPersonalExpenses.length === 0 || !selectedTeamMember) return;
    setReimbursementReviewDialogOpen(true);
  };

  // Helper functions for Reports functionality
  const reportPropertyOptions = [
    "Stanford Graduate School of Business",
    "Mission Bay Tech Campus", 
    "Redwood Shores Office Complex",
    "Palo Alto Research Center",
    "South Bay Industrial Park"
  ];

  const reportGlCodeOptions = [
    "REP-HVAC", "REP-PLUMB", "REP-ELEC", "REP-GEN",
    "OPS-CLEAN", "OPS-LAND", "OPS-SUPP", "OPS-MAINT",
    "CAP-SEC", "CAP-HVAC", "CAP-ELEC", "CAP-BLDG",
    "ADMIN-MGMT", "ADMIN-LEGAL", "ADMIN-ACCT"
  ];

  const reportExpenseStatusOptions = [
    "Flagged", "Approved", "Missing Receipt", "Pending Review", "Processed"
  ];

  const reportTrustAccountOptions = [
    "TA-2024-001 (Redwood Shores)",
    "TA-2024-002 (Mission Bay)",
    "TA-2024-003 (Skyline Vista)"
  ];

  const reportTypes = [
    {
      id: "trust-reconciliation",
      name: "Trust Account Reconciliation Report",
      description: "Lists all withdrawals, reimbursements, and trust balances by property. Tracks packet approvals, flagged items, and final balance snapshot. Includes PM and Owner notes."
    },
    {
      id: "tax-deduction",
      name: "Tax Deduction Summary",
      description: "Breaks down expenses by deductible/non-deductible GL categories. Totals by property and time period. CSV includes memo fields, category mapping, and receipt links."
    },
    {
      id: "tax-report",
      name: "Annual Expense Summary for Tax Filing",
      description: "A clean, downloadable PDF or Excel report that includes:\n\n• All billable expenses across the portfolio\n\n• GL-coded line items (Date, Vendor, Property, Category, Amount)\n\n• Attached receipts and memos\n\n• Trust account tie-outs\n\n• Tax-deductible vs. non-deductible flagging\n\nPurpose: To make it one-click easy to forward a complete, accountant-ready expense package—no chasing PMs, no missing documentation."
    },
    {
      id: "annual-expense-tax",
      name: "Annual Expense Summary for Tax Filing",
      description: "Clean, downloadable PDF or Excel report including all billable expenses across the portfolio, GL-coded line items (Date, Vendor, Property, Category, Amount), attached receipts and memos, trust account tie-outs, and tax-deductible vs. non-deductible flagging."
    },
    {
      id: "flagged-expenses",
      name: "Flagged Expense Report",
      description: "Includes all items auto- or manually-flagged. Lists policy rule violated (e.g. over $2K, missing receipt, >10% budget). Includes comments, property, GL, amount, flag type, and reviewer."
    },
    {
      id: "cost-savings",
      name: "Cost-Saving Summary Report",
      description: "Shows Smart Insight savings suggestions accepted/rejected. Itemized view of projected vs realized savings per suggestion. Groups by category and property."
    }
  ];

  const handleGenerateExportReport = async (format: 'csv' | 'pdf', shouldEmail: boolean = false) => {
    if (shouldEmail) {
      setReportEmailForm(prev => ({ ...prev, format }));
      setEmailReportDialogOpen(true);
      return;
    }

    // Show download confirmation popup
    setReportDownloadForm({ format });
    setDownloadReportDialogOpen(true);
  };

  const handleDownloadReport = async () => {
    if (!reportDownloadForm.format) return;

    setIsGeneratingReport(true);
    setDownloadReportDialogOpen(false);
    
    // Simulate download
    if (selectedRecentReport) {
      // Downloading a recent report
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsGeneratingReport(false);
      const fileName = `${selectedRecentReport.name.replace(/\s+/g, '-').toLowerCase()}-${selectedRecentReport.generatedOn.split(' ')[0]}.${selectedRecentReport.format}`;
      alert(`Recent report downloaded: ${fileName}`);
      setSelectedRecentReport(null);
    } else {
      // Generating and downloading a new report
      const selectedReportType = reportTypes.find(r => r.id === reportType);
      const timestamp = new Date().toISOString();
      
      const filters = {
        dateRange: reportDateRange.from && reportDateRange.to ? `${reportDateRange.from} to ${reportDateRange.to}` : "All time",
        properties: reportSelectedProperties.length > 0 ? reportSelectedProperties.join(", ") : "All properties",
        glCodes: reportSelectedGLCodes.length > 0 ? reportSelectedGLCodes.join(", ") : "All GL codes",
        expenseStatus: reportSelectedExpenseStatus.length > 0 ? reportSelectedExpenseStatus.join(", ") : "All statuses",
        trustAccount: reportSelectedTrustAccount === "all" ? "All trust accounts" : reportSelectedTrustAccount
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsGeneratingReport(false);
      
      // Mock download
      const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${reportDownloadForm.format}`;
      alert(`Report generated and downloaded: ${fileName}`);
    }
  };

  const handleEmailReport = async () => {
    if (!reportEmailForm.recipientEmail || !reportEmailForm.recipientName) return;

    setIsGeneratingReport(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGeneratingReport(false);
    setEmailReportDialogOpen(false);
    
    if (selectedRecentReport) {
      // Emailing a recent report
      alert(`Recent report "${selectedRecentReport.name}" has been emailed to ${reportEmailForm.recipientName} (${reportEmailForm.recipientEmail})`);
      setSelectedRecentReport(null);
    } else {
      // Emailing a newly generated report
      const selectedReportType = reportTypes.find(r => r.id === reportType);
      alert(`Report "${selectedReportType?.name}" has been emailed to ${reportEmailForm.recipientName} (${reportEmailForm.recipientEmail})`);
    }
    
    // Reset form
    setReportEmailForm({
      recipientName: '',
      recipientEmail: '',
      message: '',
      format: 'csv'
    });
  };

  const handleReportPropertyToggle = (property: string) => {
    setReportSelectedProperties(prev => 
      prev.includes(property) 
        ? prev.filter(p => p !== property)
        : [...prev, property]
    );
  };

  const handleReportGLCodeToggle = (code: string) => {
    setReportSelectedGLCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleReportExpenseStatusToggle = (status: string) => {
    setReportSelectedExpenseStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearAllReportFilters = () => {
    setReportDateRange({ from: "", to: "" });
    setReportSelectedProperties([]);
    setReportSelectedGLCodes([]);
    setReportSelectedExpenseStatus([]);
    setReportSelectedTrustAccount("all");
  };

  // Handlers for Recent Reports buttons
  const handleRecentReportDownload = (report: any) => {
    setSelectedRecentReport(report);
    setReportDownloadForm({ format: report.format });
    setDownloadReportDialogOpen(true);
  };

  const handleRecentReportEmail = (report: any) => {
    setSelectedRecentReport(report);
    setReportEmailForm(prev => ({ ...prev, format: report.format }));
    setEmailReportDialogOpen(true);
  };

  // Handle URL parameters for tab navigation and role detection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const roleParam = urlParams.get('role');
    
    // Handle tab navigation
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments', 'reporting', 'cards', 'policy', 'smart-insights', 'collateral', 'communications', 'technicianExpenses', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Handle role detection from URL parameters or localStorage
    if (roleParam && ['pm', 'technician', 'centralOffice'].includes(roleParam)) {
      setRole(roleParam as 'pm' | 'technician' | 'centralOffice');
      localStorage.setItem('currentRole', roleParam);
    } else {
      // Fallback to localStorage if URL param is missing
      const roleFromStorage = localStorage.getItem('currentRole');
      if (roleFromStorage && ['pm', 'technician', 'centralOffice'].includes(roleFromStorage)) {
        setRole(roleFromStorage as 'pm' | 'technician' | 'centralOffice');
      }
    }
  }, []);

  // Debounced search for CollateralHub to prevent UI freezing
  useEffect(() => {
    if (collateralSearchQuery === '') {
      // Immediately clear search if empty
      setCollateralDebouncedSearchQuery('');
      setCollateralIsSearching(false);
      return;
    }

    setCollateralIsSearching(true);
    const handler = setTimeout(() => {
      setCollateralDebouncedSearchQuery(collateralSearchQuery);
      setCollateralIsSearching(false);
    }, 500); // Increased delay to reduce filtering frequency

    return () => {
      clearTimeout(handler);
    };
  }, [collateralSearchQuery]);

  // Mock data for technicians
  const technicians = [
    { id: 'tech1', name: 'John Smith' },
    { id: 'tech2', name: 'Sarah Johnson' },
    { id: 'tech3', name: 'Mike Wilson' }
  ];

  const properties = [
    {
      id: "general",
      name: "General",
      address: "Not Assigned",
      totalBalance: 0,
      cardCount: 0,
      pendingBills: 0,
      trustBalance: 0,
      lastSync: "N/A",
      qboStatus: "n/a",
      reconciliationStatus: "n/a",
      pendingTransactions: 0,
      lastReport: "N/A",
      trustAccount: {
        bankName: "N/A",
        accountNumber: "N/A",
        routingNumber: "N/A",
        accountType: "General",
        autoMapping: false,
        lastReimbursement: "N/A"
      },
      ownerEmail: "N/A",
      ownerName: "N/A",
      ownerPhone: "N/A",
      ownerAddress: "N/A",
      ownerPreferredContact: "email",
      staff: [],
      cards: [],
      recentActivity: [],
      transactions: []
    },
    {
      id: "stanford",
      name: "01 STANFORD",
      address: "655 Knight Way, Stanford, CA",
      totalBalance: 1250.0,
      cardCount: 2,
      pendingBills: 3,
      trustBalance: 15420.5,
      lastSync: "2 hours ago",
      qboStatus: "synced",
      reconciliationStatus: "balanced",
      pendingTransactions: 5,
      lastReport: "Jan 15, 2024",
      trustAccount: {
        bankName: "Wells Fargo",
        accountNumber: "****2847",
        routingNumber: "121000248",
        accountType: "Trust Account",
        autoMapping: true,
        lastReimbursement: "2025-01-10"
      },
      ownerEmail: "owner@stanford.edu",
      ownerName: "Dr. Sarah Wilson",
      ownerPhone: "650-723-2273",
      ownerAddress: "Graduate School of Business, 655 Knight Way, Stanford, CA 94305",
      ownerPreferredContact: "email", // email, phone, text
      staff: [
        { name: "Linda Evans", role: "Receptionist", phone: "555-101-2020", email: "linda.evans@stanford.edu" },
        { name: "Mark Lee", role: "Property Manager", phone: "555-303-4040", email: "mark.lee@stanford.edu" },
        { name: "Carlos Ramirez", role: "Maintenance Technician", phone: "555-111-2222", email: "carlos.ramirez@stanford.edu" },
        { name: "Janet Kim", role: "Porter / Janitor", phone: "555-333-4444", email: "janet.kim@stanford.edu" },
        { name: "Samantha Green", role: "Leasing Agent", phone: "555-555-6666", email: "samantha.green@stanford.edu" },
        { name: "Alexis Chen", role: "Concierge / Front Desk", phone: "555-777-8888", email: "alexis.chen@stanford.edu" },
        { name: "Robert King", role: "Security Guard", phone: "555-999-0000", email: "robert.king@stanford.edu" }
      ],
      cards: [
        { id: "1", number: "**** 4532", holder: "John Smith", balance: 635.0, status: "active" },
        { id: "2", number: "**** 7891", holder: "Sarah Johnson", balance: 615.0, status: "active" },
      ],
      recentActivity: [
        { type: "expense", description: "Home Depot purchase", amount: 635.0, date: "2 hours ago" },
        { type: "payment", description: "Trust transfer", amount: 1200.0, date: "1 day ago" },
        { type: "report", description: "Monthly statement sent", amount: 0, date: "3 days ago" },
      ],
      transactions: [
        {
          id: "1",
          date: "2024-01-15",
          vendor: "Home Depot",
          amount: 635.0,
          category: "Repairs & Maintenance",
          status: "pending",
          receipt: true,
        },
        {
          id: "2",
          date: "2024-01-14",
          vendor: "Trader Joe's",
          amount: 51.91,
          category: "Office Supplies",
          status: "reconciled",
          receipt: true,
        },
      ],
    },
    {
      id: "sunnyvale",
      name: "02 SUNNYVALE",
      address: "432 Sunnyvale Ave, Sunnyvale, CA",
      totalBalance: 2991.25,
      cardCount: 2,
      pendingBills: 5,
      trustBalance: 28750.75,
      lastSync: "5 minutes ago",
      qboStatus: "synced",
      reconciliationStatus: "balanced",
      pendingTransactions: 8,
      lastReport: "Jan 10, 2024",
      trustAccount: {
        bankName: "Wells Fargo",
        accountNumber: "****5923",
        routingNumber: "121000248",
        accountType: "Trust Account",
        autoMapping: true,
        lastReimbursement: "2025-01-08"
      },
      ownerEmail: "owner@sunnyvale.com", 
      ownerName: "Michael Chen",
      ownerPhone: "408-555-0123",
      ownerAddress: "432 Sunnyvale Ave, Sunnyvale, CA 94086",
      ownerPreferredContact: "phone", // email, phone, text
      staff: [
        { name: "Maria Gomez", role: "Receptionist", phone: "555-505-6060", email: "maria.gomez@sunnyvale.com" },
        { name: "James Wu", role: "Property Manager", phone: "555-707-8080", email: "james.wu@sunnyvale.com" },
        { name: "Miguel Torres", role: "Maintenance Technician", phone: "555-121-2323", email: "miguel.torres@sunnyvale.com" },
        { name: "Patricia Lee", role: "Porter / Janitor", phone: "555-343-4545", email: "patricia.lee@sunnyvale.com" },
        { name: "Emily Brown", role: "Leasing Agent", phone: "555-565-6767", email: "emily.brown@sunnyvale.com" },
        { name: "Brian Smith", role: "Concierge / Front Desk", phone: "555-787-8989", email: "brian.smith@sunnyvale.com" },
        { name: "Angela White", role: "Security Guard", phone: "555-909-1011", email: "angela.white@sunnyvale.com" }
      ],
      cards: [
        { id: "3", number: "**** 2345", holder: "Mike Chen", balance: 1200.0, status: "active" },
        { id: "4", number: "**** 6789", holder: "Lisa Wong", balance: 1791.25, status: "active" },
      ],
      recentActivity: [
        { type: "expense", description: "Lowe's purchase", amount: 289.5, date: "1 hour ago" },
        { type: "expense", description: "Office Depot", amount: 125.75, date: "6 hours ago" },
        { type: "sync", description: "QuickBooks sync", amount: 0, date: "5 minutes ago" },
      ],
      transactions: [
        {
          id: "3",
          date: "2024-01-14",
          vendor: "Lowe's",
          amount: 289.5,
          category: "Repairs & Maintenance",
          status: "pending",
          receipt: false,
        },
        {
          id: "4",
          date: "2024-01-13",
          vendor: "Office Depot",
          amount: 125.75,
          category: "Office Supplies",
          status: "reconciled",
          receipt: true,
        },
      ],
    },
    {
      id: "downtown",
      name: "03 DOWNTOWN",
      address: "123 Market St, San Francisco, CA",
      totalBalance: 450.0,
      cardCount: 1,
      pendingBills: 2,
      trustBalance: 12300.0,
      lastSync: "1 hour ago",
      qboStatus: "pending",
      reconciliationStatus: "variance",
      pendingTransactions: 3,
      lastReport: "Jan 8, 2024",
      trustAccount: {
        bankName: "Wells Fargo",
        accountNumber: "****7461",
        routingNumber: "121000248",
        accountType: "Trust Account",
        autoMapping: true,
        lastReimbursement: "2025-01-05"
      },
      ownerEmail: "owner@downtownlofts.com",
      ownerName: "Alex Rodriguez",
      ownerPhone: "415-555-7890",
      ownerAddress: "123 Market St, San Francisco, CA 94103",
      ownerPreferredContact: "text", // email, phone, text
      staff: [
        { name: "Sophie Tran", role: "Receptionist", phone: "555-909-1010", email: "sophie.tran@downtownlofts.com" },
        { name: "David Kim", role: "Property Manager", phone: "555-111-2121", email: "david.kim@downtownlofts.com" },
        { name: "Oscar Martinez", role: "Maintenance Technician", phone: "555-232-3434", email: "oscar.martinez@downtownlofts.com" },
        { name: "Grace Lin", role: "Porter / Janitor", phone: "555-454-5656", email: "grace.lin@downtownlofts.com" },
        { name: "Kevin Patel", role: "Leasing Agent", phone: "555-676-7878", email: "kevin.patel@downtownlofts.com" },
        { name: "Tina Brooks", role: "Concierge / Front Desk", phone: "555-898-9090", email: "tina.brooks@downtownlofts.com" },
        { name: "Victor Cruz", role: "Security Guard", phone: "555-101-1121", email: "victor.cruz@downtownlofts.com" }
      ],
      cards: [{ id: "5", number: "**** 9876", holder: "Alex Rodriguez", balance: 450.0, status: "active" }],
      recentActivity: [
        { type: "expense", description: "Ace Hardware", amount: 89.99, date: "3 hours ago" },
        { type: "alert", description: "Trust reconciliation variance", amount: 0, date: "1 day ago" },
      ],
      transactions: [
        {
          id: "5",
          date: "2024-01-12",
          vendor: "Ace Hardware",
          amount: 89.99,
          category: "Repairs & Maintenance",
          status: "pending",
          receipt: true,
        },
      ],
    },
  ]

  // Mock data for communications
  const communications = {
    messages: [
      {
        id: "1",
        propertyId: "stanford",
        senderId: "owner1",
        senderName: "John Smith",
        senderRole: "owner",
        content: "Can you approve the new HVAC maintenance request?",
        timestamp: new Date("2024-01-20T10:00:00"),
        status: "unread",
        threadId: "thread1"
      },
      {
        id: "2",
        propertyId: "stanford",
        senderId: "pm1",
        senderName: "Property Manager",
        senderRole: "pm",
        content: "I've reviewed the request. The quote seems reasonable.",
        timestamp: new Date("2024-01-20T10:30:00"),
        status: "read",
        threadId: "thread1"
      }
    ],
    approvals: [
      {
        id: "1",
        propertyId: "stanford",
        type: "maintenance",
        status: "pending",
        requestedBy: "John Smith",
        requestedAt: new Date("2024-01-20T09:00:00"),
        amount: 2500,
        description: "HVAC System Maintenance - Annual Service",
        priority: "high",
        comments: [],
        vendor: "ABC HVAC Services",
        category: "Maintenance"
      },
      {
        id: "2",
        propertyId: "sunnyvale",
        type: "expense",
        status: "pending",
        requestedBy: "Mike Chen",
        requestedAt: new Date("2024-01-20T08:30:00"),
        amount: 850,
        description: "Emergency Plumbing Repair - Kitchen Sink",
        priority: "high",
        comments: [],
        vendor: "Quick Plumb Inc",
        category: "Repairs"
      },
      {
        id: "3",
        propertyId: "downtown",
        type: "document",
        status: "approved",
        requestedBy: "Alex Rodriguez",
        requestedAt: new Date("2024-01-19T15:00:00"),
        description: "New Lease Agreement Review",
        priority: "medium",
        comments: [],
        category: "Documentation"
      }
    ]
  }

  // Mock data for property approvals
  const propertyApprovals = {
    approvals: [
      {
        id: "1",
        propertyId: "stanford",
        propertyName: "Stanford GSB",
        ownerName: "John Smith",
        ownerEmail: "owner@stanford.edu",
        type: "maintenance",
        status: "pending",
        requestedAt: new Date("2024-01-20T09:00:00"),
        dueDate: new Date("2024-01-25T00:00:00"),
        amount: 2500,
        description: "HVAC System Maintenance - Annual Service",
        priority: "high",
        vendor: "ABC HVAC Services",
        category: "Maintenance",
        details: "Annual maintenance service for the HVAC system. Includes filter replacement, system inspection, and performance optimization.",
        attachments: ["quote.pdf", "maintenance_contract.pdf"],
        comments: [
          {
            id: "1",
            author: "Property Manager",
            content: "Received quote from vendor. Awaiting owner approval.",
            timestamp: new Date("2024-01-20T09:30:00")
          }
        ]
      },
      {
        id: "2",
        propertyId: "sunnyvale",
        propertyName: "Sunnyvale 432",
        ownerName: "Mike Chen",
        ownerEmail: "owner@sunnyvale.com",
        type: "repair",
        status: "pending",
        requestedAt: new Date("2024-01-20T08:30:00"),
        dueDate: new Date("2024-01-22T00:00:00"),
        amount: 850,
        description: "Emergency Plumbing Repair - Kitchen Sink",
        priority: "high",
        vendor: "Quick Plumb Inc",
        category: "Emergency Repairs",
        details: "Kitchen sink is leaking and causing water damage. Vendor has assessed and provided quote for immediate repair.",
        attachments: ["plumbing_quote.pdf", "damage_photos.zip"],
        comments: [
          {
            id: "1",
            author: "Property Manager",
            content: "Emergency repair needed. Sent urgent approval request to owner.",
            timestamp: new Date("2024-01-20T08:35:00")
          }
        ]
      },
      {
        id: "3",
        propertyId: "downtown",
        propertyName: "Downtown Lofts",
        ownerName: "Alex Rodriguez",
        ownerEmail: "owner@downtownlofts.com",
        type: "improvement",
        status: "approved",
        requestedAt: new Date("2024-01-19T15:00:00"),
        approvedAt: new Date("2024-01-20T10:00:00"),
        amount: 5000,
        description: "Kitchen Renovation - Countertop Replacement",
        priority: "medium",
        vendor: "Modern Interiors LLC",
        category: "Improvements",
        details: "Replace outdated kitchen countertops with quartz. Includes removal, installation, and minor cabinet modifications.",
        attachments: ["renovation_quote.pdf", "material_samples.pdf"],
        comments: [
          {
            id: "1",
            author: "Property Manager",
            content: "Submitted renovation proposal to owner",
            timestamp: new Date("2024-01-19T15:30:00")
          },
          {
            id: "2",
            author: "Alex Rodriguez",
            content: "Approved. Please proceed with the renovation.",
            timestamp: new Date("2024-01-20T10:00:00")
          }
        ]
      }
    ]
  }

  // Mock cards for technician
  const technicianCards = [
    { id: 't1', number: '**** 1122', holder: technicianName, balance: 1200, status: 'active' },
    { id: 't2', number: '**** 3344', holder: technicianName, balance: 800, status: 'active' },
  ];
  // Mock transactions for technician
  const technicianTransactions: Transaction[] = [
    { 
      id: 't1', 
      date: '2025-01-15', 
      vendor: 'Home Depot', 
      amount: 120.5, 
      status: 'pending', 
      jobId: 'job1', 
      billable: true, 
      madeBy: 'Alice Johnson', 
      cardHolder: 'Alice Johnson', 
      memo: 'HVAC parts',
      receipt: 'receipt-t1.pdf',
      expenseType: 'credit_card'
    },
    { 
      id: 't2', 
      date: '2025-01-14', 
      vendor: 'Lowe\'s', 
      amount: 89.99, 
      status: 'reconciled', 
      jobId: 'job2', 
      billable: false, 
      madeBy: 'Alice Johnson', 
      cardHolder: 'Alice Johnson', 
      memo: 'Paint supplies',
      receipt: 'receipt-t2.pdf',
      expenseType: 'credit_card'
    },
    { 
      id: 't3', 
      date: '2025-01-13', 
      vendor: 'Ace Hardware', 
      amount: 45.00, 
      status: 'pending', 
      jobId: 'job3', 
      billable: true, 
      madeBy: 'Alice Johnson', 
      cardHolder: 'Alice Johnson', 
      memo: 'Hardware supplies',
      receipt: 'receipt-t3.pdf',
      expenseType: 'credit_card'
    },
    { 
      id: 't4', 
      date: '2025-01-12', 
      vendor: 'Office Depot', 
      amount: 67.50, 
      status: 'reconciled', 
      jobId: 'job4', 
      billable: true, 
      madeBy: 'Alice Johnson', 
      cardHolder: 'Alice Johnson', 
      memo: 'Office supplies for work site',
      receipt: 'receipt-t4.pdf',
      expenseType: 'credit_card'
    },
    { 
      id: 't5', 
      date: '2025-01-11', 
      vendor: 'AutoZone', 
      amount: 34.99, 
      status: 'pending', 
      jobId: 'job5', 
      billable: false, 
      madeBy: 'Alice Johnson', 
      cardHolder: 'Alice Johnson', 
      memo: 'Van maintenance',
      receipt: 'receipt-t5.pdf',
      expenseType: 'credit_card'
    },
    { 
      id: 't6', 
      date: '2025-01-10', 
      vendor: 'Staples', 
      amount: 23.45, 
      status: 'reconciled', 
      jobId: '', 
      billable: false, 
      madeBy: 'Alice Johnson', 
      cardHolder: 'Alice Johnson', 
      memo: 'General office supplies',
      receipt: 'receipt-t6.pdf',
      expenseType: 'credit_card'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Synced
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "balanced":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Balanced
          </Badge>
        )
      case "variance":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Variance
          </Badge>
        )
      case "reconciled":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Reconciled</Badge>
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "expense":
        return <Receipt className="h-4 w-4 text-red-400" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-400" />
      case "report":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "sync":
        return <Sync className="h-4 w-4 text-purple-400" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const handlePayBills = (property: any) => {
    setSelectedProperty(property)
    setPaymentDialogOpen(true)
  }

  const handleGeneratePropertyReport = (property: any) => {
    setSelectedProperty(property)
    setReportDialogOpen(true)
  }

  const handleViewApproval = (approval: any) => {
    setSelectedApproval(approval)
    setApprovalDialogOpen(true)
  }

  // Handle reimbursement for work orders
  const handleReimburseWorkOrder = (job: any, amount: number) => {
    setSelectedReimbursementJob(job);
    setReimbursementAmount(amount);
    setReimbursementDialogOpen(true);
  };

  // Enhanced reimbursement processing
  const processReimbursement = () => {
    if (!selectedReimbursementJob || reimbursementAmount <= 0) return;
    
    // Get property information for owner contact
    const property = properties.find(p => p.name === selectedReimbursementJob.property);
    
    // Mock reimbursement processing
    console.log(`Processing reimbursement for ${selectedReimbursementJob.description}: $${reimbursementAmount}`);
    console.log(`Method: ${reimbursementMethod}, Date: ${reimbursementDate}`);
    
    // Send owner notification if requested
    if (ownerNotificationMethod !== 'none' && property) {
      const contactMethod = ownerNotificationMethod === 'email' ? property.ownerEmail : 
                           ownerNotificationMethod === 'phone' ? property.ownerPhone : 
                           ownerNotificationMethod === 'text' ? property.ownerPhone : '';
      console.log(`Sending ${ownerNotificationMethod} notification to ${property.ownerName} at ${contactMethod}`);
    }
    
    // Generate and send report if requested
    if (sendReportToOwner && property) {
      console.log(`Generating and sending expense report to ${property.ownerName} (${property.ownerEmail})`);
    }
    
    // Update transaction status to reconciled
    setTransactions(prev => prev.map(txn => 
      txn.jobId === selectedReimbursementJob.id 
        ? { ...txn, status: 'reconciled' as const }
        : txn
    ));
    
    // Show success message
    alert(`Reimbursement processed successfully!\n\nAmount: $${reimbursementAmount}\nMethod: ${reimbursementMethod}\n${sendReportToOwner ? 'Report sent to owner' : 'No report sent'}\n${ownerNotificationMethod !== 'none' ? `Owner notified via ${ownerNotificationMethod}` : 'No notification sent'}`);
    
    // Close dialog and reset state
    setReimbursementDialogOpen(false);
    setSelectedReimbursementJob(null);
    setReimbursementAmount(0);
    setReimbursementNote('');
    setReimbursementMethod('check');
    setSendReportToOwner(true);
    setReimbursementDate(new Date().toISOString().split('T')[0]);
    setOwnerNotificationMethod('email');
  };

  // Toggle work order expansion in payments tab
  const toggleWorkOrderExpansion = (jobId: string) => {
    setExpandedWorkOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Handle monthly report generation
  const handleGenerateMonthlyReport = (property: any) => {
    setSelectedReportProperty(property);
    setMonthlyReportDialogOpen(true);
  };

  // Generate monthly report data
  const generateMonthlyReportData = (property: any, month: string) => {
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
    
    // Get all transactions for this property in the specified month
    const propertyJobs = jobs.filter(job => job.property === property.name);
    const propertyTransactions = [...transactions, ...technicianTransactions].filter(txn => {
      const job = jobs.find(j => j.id === txn.jobId);
      if (!job || job.property !== property.name) return false;
      
      const txnDate = new Date(txn.date);
      return txnDate >= startDate && txnDate <= endDate;
    });

    // Group by work order
    const workOrderGroups = propertyJobs.map(job => {
      const jobTransactions = propertyTransactions.filter(txn => txn.jobId === job.id);
      const totalAmount = jobTransactions.reduce((sum, txn) => sum + txn.amount, 0);
      const billableAmount = jobTransactions.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
      const nonBillableAmount = jobTransactions.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
      
      return {
        job,
        transactions: jobTransactions,
        totalAmount,
        billableAmount,
        nonBillableAmount,
        transactionCount: jobTransactions.length
      };
    }).filter(group => group.transactions.length > 0);

    // Calculate totals
    const totalSpend = propertyTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const billableSpend = propertyTransactions.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
    const nonBillableSpend = propertyTransactions.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
    const pendingAmount = propertyTransactions.filter(txn => txn.status === 'pending').reduce((sum, txn) => sum + txn.amount, 0);
    const reconciledAmount = propertyTransactions.filter(txn => txn.status === 'reconciled').reduce((sum, txn) => sum + txn.amount, 0);

    return {
      property,
      month,
      workOrderGroups,
      summary: {
        totalSpend,
        billableSpend,
        nonBillableSpend,
        pendingAmount,
        reconciledAmount,
        transactionCount: propertyTransactions.length,
        workOrderCount: workOrderGroups.length
      }
    };
  };

  // Export monthly report to CSV
  const exportMonthlyReportToCSV = (reportData: any) => {
    const { property, month, workOrderGroups, summary } = reportData;
    
    // Create CSV content
    let csvContent = `Monthly Spending Report - ${property.name}\n`;
    csvContent += `Month: ${month}\n\n`;
    
    // Summary section
    csvContent += `Summary\n`;
    csvContent += `Total Spend,${summary.totalSpend.toFixed(2)}\n`;
    csvContent += `Billable Spend,${summary.billableSpend.toFixed(2)}\n`;
    csvContent += `Non-Billable Spend,${summary.nonBillableSpend.toFixed(2)}\n`;
    csvContent += `Pending Amount,${summary.pendingAmount.toFixed(2)}\n`;
    csvContent += `Reconciled Amount,${summary.reconciledAmount.toFixed(2)}\n`;
    csvContent += `Total Transactions,${summary.transactionCount}\n`;
    csvContent += `Work Orders with Expenses,${summary.workOrderCount}\n\n`;
    
    // Work order details
    csvContent += `Work Order Details\n`;
    csvContent += `Work Order ID,Description,Technician,Total Amount,Billable Amount,Non-Billable Amount,Transaction Count\n`;
    
    workOrderGroups.forEach((group: any) => {
      csvContent += `${group.job.id},"${group.job.description}","${group.job.technician || 'Unassigned'}",${group.totalAmount.toFixed(2)},${group.billableAmount.toFixed(2)},${group.nonBillableAmount.toFixed(2)},${group.transactionCount}\n`;
    });
    
    csvContent += `\nTransaction Details\n`;
    csvContent += `Date,Vendor,Made By,Amount,Status,Billable,Work Order,Memo\n`;
    
    workOrderGroups.forEach((group: any) => {
      group.transactions.forEach((txn: any) => {
        csvContent += `${txn.date},"${txn.vendor}","${txn.madeBy}",${txn.amount.toFixed(2)},${txn.status},${txn.billable ? 'Yes' : 'No'},"${group.job.description}","${txn.memo || ''}"\n`;
      });
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-report-${property.name}-${month}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'variance-comments', label: 'Variance Comments', icon: AlertTriangle },
          { id: 'smart-insights', label: 'Smart Insights', icon: Bot },
          { id: 'collateral', label: 'Collateral Hub', icon: FileArchive },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
          { id: 'communications', label: 'Communications', icon: MessageSquare },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'cards', label: 'Cards', icon: CreditCard },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'policy', label: 'Expense Requests', icon: MessageSquare },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'smart-insights', label: 'Smart Insights', icon: Bot },
          { id: 'budgeting', label: 'Budgeting', icon: Calculator },
          { id: 'reporting', label: 'Reporting', icon: FileText },
          { id: 'collateral', label: 'Collateral Hub', icon: FileArchive },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
          { id: 'communications', label: 'Communications', icon: MessageSquare },
        ]
      : [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'technicianExpenses', label: 'Expenses', icon: CreditCard },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'communications', label: 'Communications', icon: MessageSquare },
        ];

  // Sample properties for dropdown
  const propertyOptions = [
    { id: 'general', name: 'General' },
    { id: 'prop1', name: '01 STANFORD' },
    { id: 'prop2', name: '02 SUNNYVALE' },
  ]

  type JobType = typeof jobsList[0];

  // Helper for status badge style
  const getStatusBadgeClass = (statusValue: string) => {
    if (statusValue === 'approved') return 'bg-green-700 text-green-100';
    if (statusValue === 'pending') return 'bg-gray-700 text-gray-200';
    if (statusValue === 'rejected') return 'bg-red-700 text-red-100';
    return 'bg-gray-700 text-gray-300';
  }

  // Helper to get time since sent (mocked for now)
  function getTimeSince(dateString: string) {
    const now = new Date();
    const sent = new Date(dateString);
    const diff = Math.floor((now.getTime() - sent.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  }

  function addNote() {
    if (!notesJob || !newNote.trim()) return;
    setJobNotes(prev => ({
      ...prev,
      [notesJob.id]: [
        ...(prev[notesJob.id] || []),
        {
          author: role === 'technician' ? technicianName : 'Property Manager',
          content: newNote.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setNewNote("");
  }



  // Helper: get jobs by status
  const openJobs = jobs.filter(j => j.techStatus !== 'Finished');
  const pendingOwnerApprovals = jobs.filter(j => j.preApprovalStatus === 'Required' && j.statusValue === 'pending');
  const jobsAssignedToSubs = jobs.filter(j => j.technician && (j.techStatus === 'Started' || j.techStatus === 'Not Started'));
  const overdueJobs = jobs.filter(j => {
    // For demo, overdue if requested date is >7 days ago and not finished
    const daysAgo = (dateStr: string) => {
      const now = new Date();
      const d = new Date(dateStr);
      return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    };
    return j.techStatus !== 'Finished' && daysAgo(j.requested) > 7;
  });

  // Helper: get current month transactions
  const allTxns = [...transactions, ...technicianTransactions];
  const isThisMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const txnsThisMonth = allTxns.filter(txn => isThisMonth(txn.date));
  
  // Override with realistic fixed amounts that add up correctly for dashboard
  const totalSpend = 18750.00;  // Total monthly expenses
  const billableSpend = 14250.00;  // Billable to owners (76%)
  const nonBillableSpend = 4500.00;  // Non-billable expenses (24%)
  const uncategorizedSpend = 2850.00;  // Needs review/categorization
  
  // Reimbursement overview calculations (for Central Office dashboard)
  const reconciledSpend = 11400.00;  // Already reimbursed
  const pendingBillableSpend = 2850.00;  // Awaiting reimbursement (pending + billable)
  const issuesSpend = 4500.00;  // Issues/needs review (no job assignment)

  // Budget tracking calculations (similar to owner dashboard)
  const yearElapsed = 0.58; // 58% of year complete

  // Properties data with budget information (same as owner dashboard)
  const allProperties = [
    {
      id: 1,
      name: "Stanford Graduate School of Business",
      type: "Academic",
      size: "285,000 sq ft",
      ytdSpent: 2.2, // In millions
      annualBudget: 4.3, // In millions
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 2,
      name: "Mission Bay Tech Campus",
      type: "Office",
      size: "450,000 sq ft",
      ytdSpent: 3.4, // In millions
      annualBudget: 5.4, // In millions
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 3,
      name: "Redwood Shores Office Complex",
      type: "Office",
      size: "320,000 sq ft",
      ytdSpent: 1.9, // In millions
      annualBudget: 3.8, // In millions
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 4,
      name: "Palo Alto Research Center",
      type: "Research",
      size: "200,000 sq ft",
      ytdSpent: 1.5, // In millions
      annualBudget: 3.0, // In millions
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    },
    {
      id: 5,
      name: "South Bay Industrial Park",
      type: "Industrial",
      size: "600,000 sq ft",
      ytdSpent: 2.9, // In millions
      annualBudget: 4.8, // In millions
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    }
  ];

  // Role-based property filtering
  const getPropertiesForRole = (role: string) => {
    if (role === 'pm') {
      // PM sees subset of properties
      return allProperties.filter(p => p.id === 1 || p.id === 2); // Stanford GSB and Mission Bay
    } else {
      // Central Office sees all properties
      return allProperties;
    }
  };

  // Calculate budget metrics for role
  const getBudgetMetricsForRole = (role: string) => {
    const properties = getPropertiesForRole(role);
    const totalBudget = properties.reduce((sum, prop) => sum + prop.annualBudget, 0);
    const totalSpent = properties.reduce((sum, prop) => sum + prop.ytdSpent, 0);
    const totalExpected = properties.reduce((sum, prop) => sum + prop.expectedSpend, 0);
    const propertiesUnderBudget = properties.filter(prop => prop.isUnderBudget).length;
    const propertiesOverBudget = properties.length - propertiesUnderBudget;
    const portfolioVariance = (totalSpent / totalExpected) * 100;
    const portfolioVarianceAmount = totalSpent - totalExpected;
    const isPortfolioUnderBudget = portfolioVariance < 100;

    return {
      properties,
      totalBudget,
      totalSpent,
      totalExpected,
      propertiesUnderBudget,
      propertiesOverBudget,
      portfolioVariance,
      portfolioVarianceAmount,
      isPortfolioUnderBudget
    };
  };

  // Spend by type calculations (for Central Office only)
  const spendByTypeData = {
    creditCard: 12500.00, // Credit card expenses
    invoice: 6250.00, // Invoice/check payments
    cashback: 187.50, // Cashback earned (1.5% of credit card spend)
    get creditCardPercentage() { return (this.creditCard / (this.creditCard + this.invoice)) * 100 }
  };

  function handleSmartAssistSend() {
    if (!smartAssistInput.trim()) return;
    setSmartAssistChat((prev) => [
      ...prev,
      { role: 'user', content: smartAssistInput.trim() },
      { role: 'assistant', content: `This is a mock answer to: "${smartAssistInput.trim()}". (LLM integration coming soon!)` }
    ]);
    setSmartAssistInput("");
  }

  // Helper to filter transactions
  const filteredTransactions = [...transactions, ...technicianTransactions].filter(txn => {
    const job = jobs.find(j => j.id === txn.jobId);
    const property = job ? properties.find(p => p.name === job.property) : undefined;
    let pass = true;
    if (txnFilterStatus !== 'all') pass = pass && txn.status === txnFilterStatus;
    if (txnFilterBillable !== 'all') pass = pass && ((txnFilterBillable === 'billable' && txn.billable) || (txnFilterBillable === 'nonbillable' && !txn.billable));
    if (txnFilterProperty !== 'all') pass = pass && !!property && property.id === txnFilterProperty;
    if (txnFilterJob !== 'all') pass = pass && txn.jobId === txnFilterJob;
    if (txnFilterDateFrom) pass = pass && new Date(txn.date) >= new Date(txnFilterDateFrom);
    if (txnFilterDateTo) pass = pass && new Date(txn.date) <= new Date(txnFilterDateTo);
    if (txnFilterMadeBy !== 'all') pass = pass && txn.madeBy === txnFilterMadeBy;
    return pass;
  });

  // Helper to get transactions that need review
  const getTransactionsNeedingReview = () => {
    return [...transactions, ...technicianTransactions].filter(txn => {
      // Check if transaction has a review flag
      if (transactionReviewFlags[txn.id]) return true;
      
      // Check for missing critical information
      if (!txn.receipt) return true;
      if (!txn.memo) return true;
      if (!txn.jobId) return true;
      
      // Check for unusual amounts (over $1000)
      if (txn.amount > 1000) return true;
      
      return false;
    });
  };

  // Helper to validate new transaction form
  const validateNewTransactionForm = () => {
    const errors: Record<string, string> = {};
    if (!newTransactionForm.date) errors.date = 'Date is required';
    if (!newTransactionForm.vendor) errors.vendor = 'Vendor is required';
    if (!newTransactionForm.amount) errors.amount = 'Amount is required';
    if (!newTransactionForm.madeBy) errors.madeBy = 'Made By is required';
    if (!newTransactionForm.cardHolder) errors.cardHolder = 'Card Holder is required';
    if (!newTransactionForm.property) errors.property = 'Property is required';
    if (!newTransactionForm.memo) errors.memo = 'Memo is required';
    return errors;
  };

  // Helper to create new transaction
  const handleCreateNewTransaction = () => {
    const errors = validateNewTransactionForm();
    if (Object.keys(errors).length > 0) {
      // Handle validation errors (could show toast or set error state)
      console.log('Validation errors:', errors);
      return;
    }

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      date: newTransactionForm.date,
      vendor: newTransactionForm.vendor,
      amount: parseFloat(newTransactionForm.amount),
      status: 'pending',
      billable: newTransactionForm.billable,
      jobId: newTransactionForm.job === 'none' ? '' : newTransactionForm.job,
      madeBy: newTransactionForm.madeBy,
      cardHolder: newTransactionForm.cardHolder,
      memo: newTransactionForm.memo,
      receipt: newTransactionForm.receipt
    };

    setTransactions(prev => [...prev, newTxn]);
    setNewTransactionDialogOpen(false);
    setNewTransactionForm({
      date: '',
      vendor: '',
      amount: '',
      madeBy: '',
      cardHolder: '',
      property: '',
      job: '',
      billable: true,
      memo: '',
      receipt: ''
    });
  };

  // Helper to open edit transaction dialog
  const handleEditTransaction = (transaction: Transaction) => {
    const job = jobs.find(j => j.id === transaction.jobId);
    const property = job ? properties.find(p => p.name === job.property) : undefined;
    
    setEditingTransaction(transaction);
    setEditTransactionForm({
      date: transaction.date,
      vendor: transaction.vendor,
      amount: transaction.amount.toString(),
      madeBy: transaction.madeBy,
      cardHolder: transaction.cardHolder || '',
      property: property ? property.name : '',
      job: transaction.jobId || 'none',
      billable: transaction.billable,
      memo: transaction.memo || '',
      receipt: transaction.receipt || ''
    });
    setEditTransactionDialogOpen(true);
  };

  // Helper to update transaction
  const handleUpdateTransaction = () => {
    if (!editingTransaction) return;

    const updatedTxn: Transaction = {
      ...editingTransaction,
      date: editTransactionForm.date,
      vendor: editTransactionForm.vendor,
      amount: parseFloat(editTransactionForm.amount),
      billable: editTransactionForm.billable,
      jobId: editTransactionForm.job === 'none' ? '' : editTransactionForm.job,
      madeBy: editTransactionForm.madeBy,
      cardHolder: editTransactionForm.cardHolder,
      memo: editTransactionForm.memo,
      receipt: editTransactionForm.receipt
    };

    setTransactions(prev => prev.map(txn => txn.id === editingTransaction.id ? updatedTxn : txn));
    setEditTransactionDialogOpen(false);
    setEditingTransaction(null);
    setEditTransactionForm({
      date: '',
      vendor: '',
      amount: '',
      madeBy: '',
      cardHolder: '',
      property: '',
      job: '',
      billable: true,
      memo: '',
      receipt: ''
    });
  };

  // Helper to filter expenses by role (for technicians, only show their own expenses)
  const filterExpensesByRole = useCallback((expenses: Transaction[]) => {
    return expenses.filter(txn => {
      if (role === 'technician') {
        // For technicians, only show expenses from their own cards
        return txn.cardHolder === technicianName;
      } else if (role === 'pm') {
        // For PM, show all expenses (they can see everything)
        return true;
      } else if (role === 'centralOffice') {
        // For Central Office, show all expenses (they can see everything)
        return true;
      }
      return true;
    });
  }, [role, technicianName]);

  // Export to CSV (browser-based, no dependency)
  function exportTransactionsToCSV() {
    const headers = [
      'Date', 'Merchant', 'Amount', 'Made By', 'Property', 'Job', 'Billable', 'Memo', 'Receipt'
    ];
    const rows = filteredTransactions.map(txn => {
      const job = jobs.find(j => j.id === txn.jobId);
      const property = job ? properties.find(p => p.name === job.property) : undefined;
      return [
        txn.date,
        txn.vendor,
        txn.amount,
        txn.madeBy,
        property ? property.name : '',
        job ? job.description : '',
        txn.billable ? 'Billable' : 'Non-Billable',
        txn.memo || '',
        txn.receipt || ''
      ];
    });
    const csv = [headers, ...rows].map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  const validateWorkOrderForm = () => {
    const errors: Record<string, string> = {};
    if (!newWorkOrder.property) errors.property = 'Property is required';
    if (!newWorkOrder.description) errors.description = 'Description is required';
    if (!newWorkOrder.priority) errors.priority = 'Priority is required';
    if (!newWorkOrder.cost) errors.cost = 'Estimated cost is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateWorkOrder = () => {
    if (!validateWorkOrderForm()) return;
    
    // Auto-set approval status based on cost
    const finalApprovalStatus = Number(newWorkOrder.cost) >= 1000 ? 'Required' : 'Not Required';
    
    const newJob = {
      id: `job-${Date.now()}`,
      property: newWorkOrder.property,
      description: newWorkOrder.description,
      preApprovalStatus: finalApprovalStatus,
      technician: 'Unassigned',
      techStatus: 'Not Started',
      requested: new Date().toLocaleDateString(),
      owner: 'PM',
      priority: newWorkOrder.priority,
      status: 'Open',
      statusValue: 'open',
      notes: newWorkOrder.notes || '',
      cost: Number(newWorkOrder.cost) || 0
    };

    setJobs(prev => [...prev, newJob]);
    
    // If approval is required, show the approval workflow
    if (finalApprovalStatus === 'Required') {
      setPendingJob(newJob);
      setShowPreApprovalDialog(true);
    }
    
    setNewJobDialogOpen(false);
    setNewWorkOrder({
      property: '',
      description: '',
      
      notes: '',
      cost: '',
      priority: 'Medium'
    });
    setFormErrors({});
  };

  const handleUpdateWorkOrder = () => {
    if (!editJob || !editJobForm.property || !editJobForm.description) return;
    
    const updatedJob = {
      ...editJob,
      property: editJobForm.property,
      description: editJobForm.description,
      cost: Number(editJobForm.cost) || 0,
      priority: editJobForm.priority
    };

    setJobs(prev => prev.map(job => job.id === editJob.id ? updatedJob : job));
    
    setEditJobDialogOpen(false);
    setEditJob(null);
    setEditJobForm({
      property: '',
      description: '',
      cost: '',
      priority: 'Medium'
    });
  };

  // State for Smart Assist drawer
  const [smartAssistOpen, setSmartAssistOpen] = useState(false);

  // State for approval file uploads per job
  const [approvalFiles, setApprovalFiles] = useState<{ [jobId: string]: File | null }>({});

  // Add state for viewing technician work orders
  const [viewTechnicianWorkOrders, setViewTechnicianWorkOrders] = useState<string | null>(null);
  
  // Add state for transaction details dialog
  const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);

  // Get current user name based on role
  const getCurrentUserName = useCallback(() => {
    if (role === 'technician') {
      return technicianName;
    } else if (role === 'pm') {
      return 'Property Manager'; // PM can see all expenses
    } else if (role === 'centralOffice') {
      return 'Central Office'; // Central Office can see all expenses
    }
    return '';
  }, [role, technicianName]);

  // Helper to filter work orders by role (for technicians, only show their assigned work orders)
  const filterWorkOrdersByRole = useCallback((workOrders: typeof jobs) => {
    if (role === 'technician') {
      // For technicians, only show work orders assigned to them
      return workOrders.filter(job => job.technician === technicianName);
    } else if (role === 'pm') {
      // For PM, show all work orders (they can see everything)
      return workOrders;
    } else {
      // For Central Office, show all work orders
      return workOrders;
    }
  }, [role, technicianName]);

  // Memoize expensive role-based computations
  const technicianWorkOrders = useMemo(() => filterWorkOrdersByRole(jobs), [filterWorkOrdersByRole, jobs]);
  const technicianExpenses = useMemo(() => filterExpensesByRole([...transactions, ...technicianTransactions]), [filterExpensesByRole, transactions, technicianTransactions]);
  
  // Calculate technician-specific KPIs with memoization
  const technicianOpenJobs = useMemo(() => technicianWorkOrders.filter(job => job.statusValue === 'open'), [technicianWorkOrders]);
  const technicianInProgressJobs = useMemo(() => technicianWorkOrders.filter(job => job.techStatus === 'In Progress'), [technicianWorkOrders]);
  const technicianFinishedJobs = technicianWorkOrders.filter(job => job.techStatus === 'Finished');
  const technicianOverdueJobs = technicianWorkOrders.filter(job => {
    const dueDate = new Date(job.requested);
    const today = new Date();
    return dueDate < today && job.statusValue !== 'closed';
  });

  // Calculate technician-specific expense KPIs
  const technicianTxnsThisMonth = technicianExpenses.filter(txn => isThisMonth(txn.date));
  const technicianTotalSpend = technicianTxnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const technicianBillableSpend = technicianTxnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const technicianNonBillableSpend = technicianTxnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const technicianUncategorized = technicianTxnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const technicianUncategorizedSpend = technicianUncategorized.reduce((sum, txn) => sum + txn.amount, 0);

  // Smart Insights Component
  function SmartInsightsTab({ role }: { role: string }) {
    const [roiCalcForm, setRoiCalcForm] = useState({
      assetType: "",
      actionType: "",
      cost: "",
      opex: ""
    })
    const [aiQuery, setAiQuery] = useState("")
    const [aiDirectInput, setAiDirectInput] = useState("")
    const [aiResults, setAiResults] = useState<string>("")
    const [showAiResults, setShowAiResults] = useState(false)
    const [showRoiPopup, setShowRoiPopup] = useState(false)
    const [roiResults, setRoiResults] = useState<any>(null)
    
    // Filter states that actually work
    const [selectedProperty, setSelectedProperty] = useState(role === 'pm' ? "Stanford Graduate School..." : "Stanford Graduate School...")
    const [selectedTimeRange, setSelectedTimeRange] = useState("Quarterly")
    const [selectedRegion, setSelectedRegion] = useState("Bay Area")
    const [selectedViewType, setSelectedViewType] = useState("$/sqft")

    // Base data for different filter combinations
    const benchmarkingDataSets = {
      "Stanford Graduate School...": {
        "Quarterly": {
          "HVAC": { actual: 8400, market: 11800, cleanSheet: 8200, portfolio: 8600 },
          "Elevator": { actual: 6300, market: 8100, cleanSheet: 6500, portfolio: 6400 },
          "Fire Safety": { actual: 4100, market: 5900, cleanSheet: 4200, portfolio: 4300 },
          "Plumbing": { actual: 5900, market: 7800, cleanSheet: 5800, portfolio: 6100 },
          "General R&M": { actual: 11800, market: 15200, cleanSheet: 11500, portfolio: 12000 }
        },
        "Monthly": {
          "HVAC": { actual: 2800, market: 3930, cleanSheet: 2733, portfolio: 2867 },
          "Elevator": { actual: 2100, market: 2700, cleanSheet: 2167, portfolio: 2133 },
          "Fire Safety": { actual: 1367, market: 1967, cleanSheet: 1400, portfolio: 1433 },
          "Plumbing": { actual: 1967, market: 2600, cleanSheet: 1933, portfolio: 2033 },
          "General R&M": { actual: 3933, market: 5067, cleanSheet: 3833, portfolio: 4000 }
        }
      },
      "Mission Bay Tech Campus": {
        "Quarterly": {
          "HVAC": { actual: 9200, market: 12800, cleanSheet: 9000, portfolio: 9400 },
          "Elevator": { actual: 6800, market: 8600, cleanSheet: 6600, portfolio: 6900 },
          "Fire Safety": { actual: 4400, market: 6200, cleanSheet: 4300, portfolio: 4500 },
          "Plumbing": { actual: 6200, market: 8100, cleanSheet: 6000, portfolio: 6300 },
          "General R&M": { actual: 12500, market: 16200, cleanSheet: 12200, portfolio: 12800 }
        },
        "Monthly": {
          "HVAC": { actual: 3067, market: 4267, cleanSheet: 3000, portfolio: 3133 },
          "Elevator": { actual: 2267, market: 2867, cleanSheet: 2200, portfolio: 2300 },
          "Fire Safety": { actual: 1467, market: 2067, cleanSheet: 1433, portfolio: 1500 },
          "Plumbing": { actual: 2067, market: 2700, cleanSheet: 2000, portfolio: 2100 },
          "General R&M": { actual: 4167, market: 5400, cleanSheet: 4067, portfolio: 4267 }
        }
      },
      "All Properties": {
        "Quarterly": {
          "HVAC": { actual: 10200, market: 13800, cleanSheet: 9800, portfolio: 10400 },
          "Elevator": { actual: 7500, market: 9200, cleanSheet: 7200, portfolio: 7600 },
          "Fire Safety": { actual: 5200, market: 7100, cleanSheet: 4900, portfolio: 5300 },
          "Plumbing": { actual: 6800, market: 8900, cleanSheet: 6500, portfolio: 7100 },
          "General R&M": { actual: 13500, market: 17200, cleanSheet: 13000, portfolio: 13800 }
        },
        "Monthly": {
          "HVAC": { actual: 3400, market: 4600, cleanSheet: 3267, portfolio: 3467 },
          "Elevator": { actual: 2500, market: 3067, cleanSheet: 2400, portfolio: 2533 },
          "Fire Safety": { actual: 1733, market: 2367, cleanSheet: 1633, portfolio: 1767 },
          "Plumbing": { actual: 2267, market: 2967, cleanSheet: 2167, portfolio: 2367 },
          "General R&M": { actual: 4500, market: 5733, cleanSheet: 4333, portfolio: 4600 }
        }
      }
    }

    const handleAiQuestion = (question: string) => {
      setAiQuery(question)
      setShowAiResults(true)
      // Simulate AI response processing
      setTimeout(() => {
        setAiResults(`AI Analysis for: "${question}"\n\nBased on your portfolio data, here are the key insights:\n\n• Current spend analysis shows patterns across your properties\n• Cost optimization opportunities identified\n• Recommended actions for immediate implementation\n\nThis analysis is based on your current portfolio performance and benchmarking data.`)
      }, 1000)
    }

    const handleAskAIDirect = () => {
      if (aiDirectInput.trim()) {
        handleAiQuestion(aiDirectInput)
        setAiDirectInput("")
      }
    }

    const scrollToRoiCalculator = () => {
      document.getElementById('roi-calculator-section')?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleRoiCalculation = () => {
      let formToUse = roiCalcForm
      
      // If form fields are empty but AI input has content, try to auto-fill from AI input
      if ((!roiCalcForm.assetType || !roiCalcForm.actionType || !roiCalcForm.cost) && aiDirectInput.trim()) {
        const input = aiDirectInput.toLowerCase()
        let autoFilledForm = { ...roiCalcForm }
        
        // Auto-detect asset type
        if (input.includes("hvac") || input.includes("heating") || input.includes("cooling")) {
          autoFilledForm.assetType = "hvac"
        } else if (input.includes("elevator")) {
          autoFilledForm.assetType = "elevator"
        } else if (input.includes("plumbing") || input.includes("leak")) {
          autoFilledForm.assetType = "plumbing"
        } else if (input.includes("electrical") || input.includes("lighting")) {
          autoFilledForm.assetType = "electrical"
        }
        
        // Auto-detect action type
        if (input.includes("replace") || input.includes("replacing")) {
          autoFilledForm.actionType = "Replace"
        } else if (input.includes("repair") || input.includes("repairing")) {
          autoFilledForm.actionType = "Repair"
        } else if (input.includes("upgrade") || input.includes("upgrading")) {
          autoFilledForm.actionType = "Upgrade"
        }
        
        // Set default cost based on asset type
        if (!autoFilledForm.cost) {
          if (autoFilledForm.assetType === "hvac") {
            autoFilledForm.cost = "$45,000"
            autoFilledForm.opex = "$8,500"
          } else if (autoFilledForm.assetType === "elevator") {
            autoFilledForm.cost = "$75,000"
            autoFilledForm.opex = "$12,000"
          } else if (autoFilledForm.assetType === "plumbing") {
            autoFilledForm.cost = "$15,000"
            autoFilledForm.opex = "$2,500"
          } else if (autoFilledForm.assetType === "electrical") {
            autoFilledForm.cost = "$25,000"
            autoFilledForm.opex = "$3,200"
          } else {
            autoFilledForm.cost = "$30,000"
            autoFilledForm.opex = "$5,000"
          }
        }
        
        // Check if we have enough info now
        if (!autoFilledForm.assetType || !autoFilledForm.actionType || !autoFilledForm.cost) {
          alert("Please fill in all required fields (Asset Type, Action Type, and Estimated Cost) or provide more specific information in the AI input field.")
          return
        }
        
        // Use the auto-filled form for calculation
        formToUse = autoFilledForm
        setRoiCalcForm(autoFilledForm)
      } else if (!roiCalcForm.assetType || !roiCalcForm.actionType || !roiCalcForm.cost) {
        alert("Please fill in all required fields (Asset Type, Action Type, and Estimated Cost) or use the Quick Questions to auto-fill the form.")
        return
      }

      // Use the determined form for calculations
      const cost = parseFloat(formToUse.cost.replace(/[^0-9.-]+/g, ""))
      const opex = parseFloat(formToUse.opex.replace(/[^0-9.-]+/g, "")) || 0
      
      // Calculate ROI based on asset type and action
      let paybackYears = 0
      let savings = 0
      let recommendation = ""

      if (formToUse.assetType === "elevator" && formToUse.actionType === "Replace") {
        paybackYears = 2.3
        savings = cost * 0.15 // 15% annual savings
        recommendation = "Replace"
      } else if (formToUse.assetType === "hvac" && formToUse.actionType === "Replace") {
        paybackYears = 3.2
        savings = cost * 0.18 // 18% annual savings
        recommendation = "Replace"
      } else if (formToUse.actionType === "Repair") {
        paybackYears = 1.8
        savings = cost * 0.25 // 25% annual savings
        recommendation = "Repair"
      } else {
        paybackYears = 4.5
        savings = cost * 0.12 // 12% annual savings
        recommendation = "Repair"
      }

      // Set the results and show popup
      setRoiResults({
        asset: formToUse.assetType,
        action: formToUse.actionType,
        cost: formToUse.cost,
        opex: formToUse.opex,
        paybackYears,
        savings,
        recommendation
      })
      setShowRoiPopup(true)
    }

    // Get current data based on filters
    const getCurrentData = () => {
      const propertyData = benchmarkingDataSets[selectedProperty as keyof typeof benchmarkingDataSets] || benchmarkingDataSets["Stanford Graduate School..."]
      const timeData = propertyData[selectedTimeRange as keyof typeof propertyData] || propertyData["Quarterly"]
      
      return Object.keys(timeData).map(category => {
        const data = timeData[category as keyof typeof timeData]
        const maxValue = Math.max(data.actual, data.market, data.cleanSheet, data.portfolio)
        
        return {
          category,
          actual: data.actual,
          actualWidth: (data.actual / maxValue) * 100,
          market: data.market,
          marketWidth: (data.market / maxValue) * 100,
          cleanSheet: data.cleanSheet,
          cleanSheetWidth: (data.cleanSheet / maxValue) * 100,
          portfolio: data.portfolio,
          portfolioWidth: (data.portfolio / maxValue) * 100,
          overCleanSheet: data.actual > data.cleanSheet ? 
            `${Math.round(((data.actual - data.cleanSheet) / data.cleanSheet) * 100)}% over clean sheet` :
            `${Math.round(((data.cleanSheet - data.actual) / data.cleanSheet) * 100)}% under clean sheet`,
          recommendations: ["Contract optimization", "Vendor consolidation"]
        }
      })
    }

    // Property options based on role
    const getPropertyOptions = () => {
      if (role === 'pm') {
        // PM sees only properties they manage
        return [
          { value: "Stanford Graduate School...", label: "Stanford Graduate School..." },
          { value: "Mission Bay Tech Campus", label: "Mission Bay Tech Campus" }
        ]
      } else {
        // Central Office sees all properties (same as owner)
        return [
          { value: "Stanford Graduate School...", label: "Stanford Graduate School..." },
          { value: "Mission Bay Tech Campus", label: "Mission Bay Tech Campus" },
          { value: "All Properties", label: "All Properties" }
        ]
      }
    }

    // Recent Analyses for ROI Calculator
    const recentAnalyses = [
      {
        type: "HVAC System - Building A",
        action: "Repair vs Replace",
        cost: "$8500",
        payback: "2-3 years",
        savings: "Better long-term value, energy savings",
        recommendation: "Replace",
        status: "Replace"
      },
      {
        type: "Leak Detection System",
        action: "Insurance Optimization",
        cost: "$15000",
        payback: "4.4 years",
        savings: "Reduces insurance premiums, prevents water damage",
        recommendation: "Install",
        status: "Install"
      }
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Smart Insights</h2>
        </div>

        {/* Portfolio Performance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">69%</div>
                <div className="text-sm text-gray-300">Expense Budget Utilized</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{role === 'pm' ? '$2.1M' : '$6.6M'}</div>
                <div className="text-sm text-gray-300">Total $ Saved vs Clean Sheet</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{role === 'pm' ? '1' : '3'}</div>
                <div className="text-sm text-gray-300">Properties Over Budget</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ask AI Smart Analysis */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Ask AI Smart Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showAiResults ? (
              <>
                <div className="text-sm text-gray-300 mb-4 p-3 bg-gray-700 rounded">
                  How much did we spend on HVAC across all properties in Q4?
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {[
                    "How much did we spend on HVAC across all properties in Q4?",
                    "What's our insurance premium optimization potential?",
                    "What's our total R&M spend vs. benchmark by property?",
                    "Show me all emergency repairs over $5,000 this year",
                    "Which insurance policies need renewal this quarter?",
                    "What are our biggest budget variances by category?"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-left"
                      onClick={() => handleAiQuestion(question)}
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-sm">{question}</span>
                    </Button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Ask AI about your property portfolio..."
                      value={aiDirectInput}
                      onChange={(e) => setAiDirectInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAIDirect()}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={handleAskAIDirect}
                  >
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Ask AI
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={scrollToRoiCalculator}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    ROI Calculator
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">AI Analysis Results</h4>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAiResults(false)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    Back to Questions
                  </Button>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-300 whitespace-pre-line">
                    {aiResults}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interactive Cost Benchmarking */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Interactive Cost Benchmarking</CardTitle>
            <p className="text-sm text-gray-400">
              Compare your spend against market and clean-sheet benchmarks
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium text-gray-300 mb-4">
                <div>Properties</div>
                <div>Time Range</div>
                <div>Region</div>
                <div>View Type</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {getPropertyOptions().map(property => (
                      <SelectItem key={property.value} value={property.value} className="text-white">
                        {property.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="Quarterly" className="text-white">Quarterly</SelectItem>
                    <SelectItem value="Monthly" className="text-white">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="Bay Area" className="text-white">Bay Area</SelectItem>
                    <SelectItem value="Los Angeles" className="text-white">Los Angeles</SelectItem>
                    <SelectItem value="San Diego" className="text-white">San Diego</SelectItem>
                    <SelectItem value="California" className="text-white">California</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedViewType} onValueChange={setSelectedViewType}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="$/sqft" className="text-white">$/sqft</SelectItem>
                    <SelectItem value="Total $" className="text-white">Total $</SelectItem>
                    <SelectItem value="% of Budget" className="text-white">% of Budget</SelectItem>
                    <SelectItem value="Variance" className="text-white">Variance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {getCurrentData().map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{item.category}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">Versus: Market Median, Clean Sheet Pro, Chambre Diversified</span>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${
                        item.overCleanSheet.includes('under') 
                          ? 'text-green-400 bg-green-900' 
                          : 'text-red-400 bg-red-900'
                      }`}>
                        {item.overCleanSheet}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-gray-400">Actual</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                        <div 
                          className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                          style={{ width: `${item.actualWidth}%` }}
                        >
                          ${item.actual.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-gray-400">Market</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                        <div 
                          className="bg-gray-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                          style={{ width: `${item.marketWidth}%` }}
                        >
                          ${item.market.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-gray-400">Clean Sheet</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                        <div 
                          className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                          style={{ width: `${item.cleanSheetWidth}%` }}
                        >
                          ${item.cleanSheet.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-gray-400">Portfolio</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                        <div 
                          className="bg-purple-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                          style={{ width: `${item.portfolioWidth}%` }}
                        >
                          ${item.portfolio.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.recommendations.map((rec, recIndex) => (
                      <Badge key={recIndex} className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer">
                        {rec}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card className="bg-gray-800 border-gray-700" id="roi-calculator-section">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-400" />
              ROI Calculator
            </CardTitle>
            <p className="text-sm text-gray-400">
              AI-powered calculations for repair vs replace decisions
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Calculation Inputs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Asset Type</Label>
                    <Select value={roiCalcForm.assetType} onValueChange={(value) => setRoiCalcForm(prev => ({ ...prev, assetType: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Elevator" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="elevator" className="text-white">Elevator</SelectItem>
                        <SelectItem value="hvac" className="text-white">HVAC System</SelectItem>
                        <SelectItem value="plumbing" className="text-white">Plumbing</SelectItem>
                        <SelectItem value="electrical" className="text-white">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Action Type</Label>
                    <Select value={roiCalcForm.actionType} onValueChange={(value) => setRoiCalcForm(prev => ({ ...prev, actionType: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Replace" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Replace" className="text-white">Replace</SelectItem>
                        <SelectItem value="Repair" className="text-white">Repair</SelectItem>
                        <SelectItem value="Upgrade" className="text-white">Upgrade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300">Estimated Cost</Label>
                  <Input
                    placeholder="e.g., $45,000"
                    value={roiCalcForm.cost}
                    onChange={(e) => setRoiCalcForm(prev => ({ ...prev, cost: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Current Annual OpEx (optional)</Label>
                  <Input
                    placeholder="e.g., $8,500"
                    value={roiCalcForm.opex}
                    onChange={(e) => setRoiCalcForm(prev => ({ ...prev, opex: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">Or Ask AI Directly</Label>
                  <Input
                    placeholder="What's the ROI on replacing HVAC in Building A?"
                    value={aiDirectInput}
                    onChange={(e) => setAiDirectInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAIDirect()}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">Quick Questions</Label>
                  <div className="space-y-2">
                    {[
                      "What's the ROI on replacing HVAC in Building A?",
                      "Should we repair or replace the elevator at Stanford GSB?",
                      "ROI analysis for LED lighting upgrade across all properties",
                      "Insurance optimization for leak detection system"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => {
                          setAiDirectInput(question)
                          
                          // Auto-fill form based on question content
                          if (question.includes("HVAC") && question.includes("replacing")) {
                            setRoiCalcForm({
                              assetType: "hvac",
                              actionType: "Replace",
                              cost: "$45,000",
                              opex: "$8,500"
                            })
                          } else if (question.includes("elevator") && question.includes("replace")) {
                            setRoiCalcForm({
                              assetType: "elevator",
                              actionType: "Replace",
                              cost: "$75,000",
                              opex: "$12,000"
                            })
                          } else if (question.includes("LED lighting")) {
                            setRoiCalcForm({
                              assetType: "electrical",
                              actionType: "Upgrade",
                              cost: "$25,000",
                              opex: "$3,200"
                            })
                          } else if (question.includes("leak detection")) {
                            setRoiCalcForm({
                              assetType: "plumbing",
                              actionType: "Upgrade",
                              cost: "$15,000",
                              opex: "$2,500"
                            })
                          }
                        }}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                        <span className="text-sm">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleRoiCalculation}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate ROI
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-white">Recent Analyses</h4>
                <div className="space-y-3">
                  {recentAnalyses.map((analysis, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{analysis.type}</span>
                        <Badge className={`text-white ${analysis.status === 'Replace' ? 'bg-green-600' : 'bg-green-600'}`}>
                          {analysis.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {analysis.action}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        Cost: {analysis.cost}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        Payback: {analysis.payback}
                      </div>
                      <div className="text-xs text-gray-400">
                        {analysis.savings}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculation Popup */}
        <Dialog open={showRoiPopup} onOpenChange={setShowRoiPopup}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-400" />
                ROI Calculation Results
              </DialogTitle>
            </DialogHeader>
            {roiResults && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Asset Type</Label>
                    <div className="text-white font-medium">{roiResults.asset}</div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Action Type</Label>
                    <div className="text-white font-medium">{roiResults.action}</div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Estimated Cost</Label>
                    <div className="text-white font-medium">{roiResults.cost}</div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Annual OpEx</Label>
                    <div className="text-white font-medium">{roiResults.opex || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">{roiResults.paybackYears} years</div>
                      <div className="text-sm text-gray-300">Payback Period</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">${roiResults.savings.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Annual Savings</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">{roiResults.recommendation}</div>
                      <div className="text-sm text-gray-300">Recommendation</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-300">
                    <strong>Analysis Summary:</strong> Based on the asset type and action, this investment will provide positive ROI within the calculated timeframe. The recommendation is to {roiResults.recommendation.toLowerCase()} based on cost-benefit analysis and long-term value considerations.
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRoiPopup(false)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowRoiPopup(false)
                      // Add to recent analyses
                      // This would typically save to a database
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Analysis
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Helper to calculate YTD spending for a property
  // Card management functions
  const handleIssueNewCard = () => {
    const newCard: EnhancedCard = {
      id: `card-${Date.now()}`,
      type: cardForm.type,
      number: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      holder: cardForm.holder,
      position: cardForm.position,
      balance: Number(cardForm.limit) * 0.8, // Start with 80% available
      limit: Number(cardForm.limit),
      status: 'active',
      assignedProperties: cardForm.assignedProperties,
      vendorRestrictions: cardForm.vendorRestrictions,
      isExistingCard: cardForm.isExistingCard,
      brand: cardForm.brand,
      expiryDate: '12/28',
      lastUsed: 'Never',
      monthlySpend: 0,
      assignedStaff: cardForm.assignedStaff
    };

    // Add to enhanced cards (in a real app, this would call an API)
    enhancedCards.push(newCard);
    
    // Reset form and close dialog
    setCardForm({
    type: 'virtual',
      holder: '',
    position: 'Technician',
      limit: '',
      assignedProperties: [],
      vendorRestrictions: [],
      isExistingCard: false,
      brand: 'Chase',
      assignedStaff: []
    });
    setIssueCardDialogOpen(false);
  };

  const handleConnectExistingCard = () => {
    const connectedCard: EnhancedCard = {
      id: `connected-card-${Date.now()}`,
      type: cardForm.type,
      number: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      holder: cardForm.holder,
      position: cardForm.position,
      balance: Number(cardForm.limit) * 0.6, // Existing card might have usage
      limit: Number(cardForm.limit),
    status: 'active',
      assignedProperties: cardForm.assignedProperties,
      vendorRestrictions: cardForm.vendorRestrictions,
      isExistingCard: true, // Mark as connected existing card
      brand: cardForm.brand,
      expiryDate: '06/27',
      lastUsed: '5 days ago',
      monthlySpend: Math.floor(Math.random() * 500),
      assignedStaff: cardForm.assignedStaff
    };

    // Add to enhanced cards (in a real app, this would call an API)
    enhancedCards.push(connectedCard);
    
    // Reset form and close dialog
    setCardForm({
      type: 'virtual',
      holder: '',
      position: 'Technician',
      limit: '',
      assignedProperties: [],
      vendorRestrictions: [],
    isExistingCard: false,
    brand: 'Chase',
      assignedStaff: []
    });
    setConnectCardDialogOpen(false);
  };

  // Expense request handling functions
  const handleApproveExpenseRequest = (requestId: string) => {
    setExpenseRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleDenyExpenseRequest = (requestId: string) => {
    setExpenseRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    ));
  };

  // Invoice flagging function
  const handleFlagInvoice = () => {
    if (!selectedInvoiceForFlagging) return;

    // Update the transaction to mark it as flagged
    setTransactions(prev => prev.map(txn =>
      txn.id === selectedInvoiceForFlagging.id 
        ? { 
            ...txn, 
            flaggedForApproval: true, 
            flaggedTo: flagInvoiceForm.flaggedTo,
            flaggedReason: flagInvoiceForm.reason
          } 
        : txn
    ));

    // Create a new expense request
    const newExpenseRequest: ExpenseRequest = {
      id: `req-${Date.now()}`,
      technicianName: selectedInvoiceForFlagging.madeBy,
      expenseId: selectedInvoiceForFlagging.id,
      question: `Invoice payment approval required: ${flagInvoiceForm.reason}`,
      amount: selectedInvoiceForFlagging.amount,
      vendor: selectedInvoiceForFlagging.vendor,
      date: selectedInvoiceForFlagging.date,
      urgency: selectedInvoiceForFlagging.amount > 2000 ? 'high' : 'normal',
      status: 'pending',
      type: 'approval_required',
      createdAt: new Date().toISOString(),
      aiSuggestion: `This invoice from ${selectedInvoiceForFlagging.vendor} for $${selectedInvoiceForFlagging.amount} has been flagged for ${flagInvoiceForm.flaggedTo === 'co' ? 'Central Office' : 'Owner'} approval. ${flagInvoiceForm.reason}`,
      category: 'Invoice Payment',
      property: selectedInvoiceForFlagging.jobId ? jobsList.find(j => j.id === selectedInvoiceForFlagging.jobId)?.property : undefined,
      workOrder: selectedInvoiceForFlagging.jobId
    };

    setExpenseRequests(prev => [...prev, newExpenseRequest]);

    // Reset dialog state
    setFlagInvoiceDialogOpen(false);
    setSelectedInvoiceForFlagging(null);
    setFlagInvoiceForm({ flaggedTo: 'co', reason: '' });
  };

  // Ping owner for invoice payment
  const handlePingOwner = () => {
    if (!selectedInvoiceForPing) return;

    // Create a payment reminder/request 
    const paymentRequest = {
      id: `ping-${Date.now()}`,
      invoiceId: selectedInvoiceForPing.id,
      vendor: selectedInvoiceForPing.vendor,
      amount: selectedInvoiceForPing.amount,
      dueDate: selectedInvoiceForPing.dueDate,
      urgency: 'normal',
      message: pingMessage,
      requestedBy: 'Property Manager',
      requestedAt: new Date().toISOString(),
      status: 'sent',
      sentTo: pingRecipient
    };

    // Create a communication thread message
    const recipientName = pingRecipient === 'co' ? 'Central Office' : 'Property Owner';
    
    // Find the property associated with this invoice
    const job = jobs.find(j => j.id === selectedInvoiceForPing.jobId);
    const property = job ? properties.find(p => p.name === job.property) : properties[0];
    
    const messageContent = `Payment request sent to ${recipientName}:

Invoice: ${selectedInvoiceForPing.vendor} - ${selectedInvoiceForPing.invoiceNumber}
Amount: $${selectedInvoiceForPing.amount.toFixed(2)}
Due Date: ${selectedInvoiceForPing.dueDate}

${pingMessage ? `Additional Notes: ${pingMessage}` : ''}

This payment request has been automatically forwarded to ${recipientName} for processing.`;

    // Add the message to communications
    if (property) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        propertyId: property.id,
        propertyName: property.name,
        senderId: 'pm-001',
        senderName: 'Property Manager',
        senderRole: 'pm',
        content: messageContent,
        timestamp: new Date(),
        status: 'unread',
        threadId: `payment-${selectedInvoiceForPing.id}`,
        type: 'payment_request',
        relatedInvoice: selectedInvoiceForPing.id
      };
      
      setMessages(prev => [newMessage, ...prev]);
    }

    // Reset dialog state
    setPingPaymentDialogOpen(false);
    setSelectedInvoiceForPing(null);
    setPingMessage('');
    setPingRecipient('co');

    // Automatically switch to communications tab
    setActiveTab('communications');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'normal': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/20';
      case 'denied': return 'text-red-400 bg-red-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'billable_question': return 'Billability';
      case 'approval_required': return 'Pre-approval';
      case 'policy_clarification': return 'Policy';
      case 'receipt_issue': return 'Documentation';
      case 'amount_verification': return 'Amount Check';
      default: return 'General';
    }
  };

  const getPropertyYTDSpending = (propertyName: string) => {
    const currentYear = new Date().getFullYear();
    const propertyJobs = jobs.filter(job => job.property === propertyName);
    const propertyTransactions = [...transactions, ...technicianTransactions].filter(txn => {
      const job = jobs.find(j => j.id === txn.jobId);
      if (!job || job.property !== propertyName) return false;
      
      const txnDate = new Date(txn.date);
      return txnDate.getFullYear() === currentYear;
    });
    
    return propertyTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  };

  // Enhanced functions for new functionality
  const handleEditPolicyRule = (rule: any) => {
    setEditingPolicyRule(rule);
    setEditedRule({
      category: rule.category,
      rule: rule.rule,
      aiEnabled: rule.aiEnabled,
      active: rule.active
    });
    setPolicyRuleEditDialogOpen(true);
  };

  const handleSavePolicyRule = () => {
    if (editingPolicyRule) {
      setPolicyRules(prev => prev.map(rule => 
        rule.id === editingPolicyRule.id 
          ? { ...rule, ...editedRule }
          : rule
      ));
      setPolicyRuleEditDialogOpen(false);
      setEditingPolicyRule(null);
    }
  };

  const handleMonthlyReimbursement = (property: any, month: string) => {
    setSelectedPropertyForMonthly(property);
    setSelectedMonth(month);
    setMonthlyReimbursementDialogOpen(true);
  };

  const processMonthlyReimbursement = () => {
    if (!selectedPropertyForMonthly) return;
    
    // Mock processing - in real app would call API
    console.log(`Processing monthly reimbursement for ${selectedPropertyForMonthly.name} for ${selectedMonth}`);
    if (ccRecipient.email) {
      console.log(`CC'ing report to ${ccRecipient.name} (${ccRecipient.email})`);
    }
    
    // Close dialog and reset state
    setMonthlyReimbursementDialogOpen(false);
    setSelectedPropertyForMonthly(null);
    setCcRecipient({ name: '', email: '' });
  };

  // Function to handle property manager message requests
  const handleRequestInfoFromPM = (flaggedExpense: any) => {
    console.log('Request Info button clicked for expense:', flaggedExpense)
    // Close the reimbursement dialog first to avoid layering issues
    setMonthlyReimbursementDialogOpen(false)
    setSelectedFlaggedExpense(flaggedExpense)
    setPmMessageForm({
      subject: `Request Information: ${flaggedExpense.merchant} - $${flaggedExpense.amount.toFixed(2)}`,
      message: `Hi [Property Manager Name],

I need additional information regarding this flagged expense:

**Expense Details:**
- Date: ${flaggedExpense.date}
- Merchant: ${flaggedExpense.merchant}
- Amount: $${flaggedExpense.amount.toFixed(2)}
- GL Code: ${flaggedExpense.glCode} - ${flaggedExpense.glName}
- Sub-GL: ${flaggedExpense.subGlCode} - ${flaggedExpense.subGlName}

**Your Original Memo:** "${flaggedExpense.pmMemo}"

**AI Analysis:** ${flaggedExpense.aiMemo}

**Flag Reason:** ${flaggedExpense.flagReason}

**Required Action:** Please provide additional clarification, correction, or supporting documentation for this expense. Specifically, we need verification of the circumstances and approval status.

Thanks,
Central Office`,
      urgent: flaggedExpense.amount >= 1000,
      requestType: flaggedExpense.amount >= 1000 ? 'approval' : 'clarification'
    })
    setPmMessagePopupOpen(true)
  }

  // Function to send message to property manager
  const sendMessageToPM = () => {
    // Add message to communications tab (simulated)
    const newMessage = {
      id: `msg-${Date.now()}`,
      from: 'Central Office',
      to: 'Property Manager',
      subject: pmMessageForm.subject,
      content: pmMessageForm.message,
      timestamp: new Date().toISOString(),
      urgent: pmMessageForm.urgent,
      type: pmMessageForm.requestType,
      relatedExpense: selectedFlaggedExpense,
      status: 'sent'
    }

    // Close popup and reset form
    setPmMessagePopupOpen(false)
    setPmMessageForm({
      subject: '',
      message: '',
      urgent: false,
      requestType: 'clarification'
    })
    setSelectedFlaggedExpense(null)

    // Route directly to communications tab
    setActiveTab('communications')
  };

  // Optimized Collateral Hub Helper Functions with memoization
  const filteredCollateralDocs = useMemo(() => {
    // Show previous results while searching to prevent UI freezing
    if (collateralIsSearching && collateralDebouncedSearchQuery !== '') {
      // Return previous results to maintain UI responsiveness
      return collateralDocs;
    }
    
    return collateralDocs.filter(doc => {
      // Use only debounced search query for filtering
      const searchQuery = collateralDebouncedSearchQuery;
      
      // Search query filter - only apply if debounced query exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
          doc.filename.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
          doc.linkedVendor?.toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;
      }
      
      // Property filter
      if (collateralFilterProperty !== 'all' && doc.propertyId !== collateralFilterProperty) {
        return false;
      }
      
      // Area filter
      if (collateralFilterArea !== 'all') {
        const property = propertyOptions.find(p => p.id === doc.propertyId);
        if (!property || property.area !== collateralFilterArea) {
          return false;
        }
      }
      
      // Document type filter
      if (collateralFilterDocType !== 'all' && doc.documentType !== collateralFilterDocType) {
        return false;
      }
      
      // Uploaded by filter
      if (collateralFilterUploadedBy !== 'all' && doc.uploadedBy !== collateralFilterUploadedBy) {
        return false;
      }
      
      // Date range filter
      if (collateralFilterDateFrom && new Date(doc.uploadDate) < new Date(collateralFilterDateFrom)) {
        return false;
      }
      if (collateralFilterDateTo && new Date(doc.uploadDate) > new Date(collateralFilterDateTo)) {
        return false;
      }
      
      return true;
    });
  }, [
    collateralDocs,
    collateralDebouncedSearchQuery,
    collateralFilterProperty,
    collateralFilterArea,
    collateralFilterDocType,
    collateralFilterUploadedBy,
    collateralFilterDateFrom,
    collateralFilterDateTo,
    collateralIsSearching
  ]);

  const handleCollateralUpload = useCallback(() => {
    if (collateralUploadForm.files.length === 0) return;
    
    const newDocs: CollateralDocument[] = collateralUploadForm.files.map((file, index) => ({
      id: `doc_${Date.now()}_${index}`,
      filename: file.name,
      documentType: collateralUploadForm.documentType,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: getCurrentUserName(),
      propertyId: collateralUploadForm.propertyId,
      propertyName: propertyOptions.find(p => p.id === collateralUploadForm.propertyId)?.name || '',
      glExpenseId: collateralUploadForm.linkedExpenseId || undefined,
      tags: collateralUploadForm.tags,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
      description: collateralUploadForm.description || undefined,
      linkedJobId: collateralUploadForm.linkedJobId || undefined,
      linkedVendor: collateralUploadForm.linkedVendor || undefined,
      amount: collateralUploadForm.amount ? parseFloat(collateralUploadForm.amount) : undefined,
      expiryDate: collateralUploadForm.expiryDate || undefined,
      status: 'active'
    }));
    
    setCollateralDocs(prev => [...prev, ...newDocs]);
    setCollateralUploadDialogOpen(false);
    
    // Reset form
    setCollateralUploadForm({
      files: [],
      documentType: 'other',
      propertyId: '',
      tags: [],
      newTag: '',
      description: '',
      linkedExpenseId: '',
      linkedJobId: '',
      linkedVendor: '',
      amount: '',
      expiryDate: ''
    });
  }, [collateralUploadForm]);

  const handleCollateralAIQuery = (query: string) => {
    setCollateralAIQuery(query);
    
    // Mock AI processing - in real app would call AI API
    let results: CollateralDocument[] = [];
    
    if (query.toLowerCase().includes('warranty') && query.toLowerCase().includes('2025')) {
      results = collateralDocs.filter(doc => 
        doc.documentType === 'warranty' && 
        doc.expiryDate && 
        doc.expiryDate.includes('2025')
      );
    } else if (query.toLowerCase().includes('sarah chen')) {
      results = collateralDocs.filter(doc => doc.uploadedBy === 'Sarah Chen');
    } else if (query.toLowerCase().includes('invoice') && query.toLowerCase().includes('5000')) {
      results = collateralDocs.filter(doc => 
        doc.documentType === 'invoice' && 
        doc.amount && 
        doc.amount >= 5000
      );
    } else if (query.toLowerCase().includes('insurance') && query.toLowerCase().includes('redwood shores')) {
      results = collateralDocs.filter(doc => 
        doc.documentType === 'insurance_certificate' && 
        doc.propertyName === 'Redwood Shores'
      );
    } else {
      // Generic search
      results = collateralDocs.filter(doc => {
        const searchTerms = query.toLowerCase().split(' ');
        return searchTerms.some(term => 
          doc.filename.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term) ||
          doc.tags.some(tag => tag.toLowerCase().includes(term))
        );
      });
    }
    
    setCollateralAIResults(results);
  };

  const handleCollateralDocPreview = (doc: CollateralDocument) => {
    setSelectedCollateralDoc(doc);
    setCollateralPreviewDialogOpen(true);
  };

  const handleCollateralExportSelected = () => {
    if (collateralSelectedDocs.length === 0) return;
    
    // Mock export - in real app would create zip file
    console.log('Exporting documents:', collateralSelectedDocs);
    
    // Create mock download
    const selectedDocsData = collateralDocs.filter(doc => collateralSelectedDocs.includes(doc.id));
    const csvContent = [
      ['Filename', 'Document Type', 'Upload Date', 'Uploaded By', 'Property', 'Tags', 'Amount'],
      ...selectedDocsData.map(doc => [
        doc.filename,
        documentTypeLabels[doc.documentType],
        doc.uploadDate,
        doc.uploadedBy,
        doc.propertyName,
        doc.tags.join(', '),
        doc.amount?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collateral_documents_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDocumentTypeIcon = (docType: DocumentType) => {
    switch (docType) {
      case 'vendor_contract': return FileText;
      case 'warranty': return Award;
      case 'insurance_certificate': return FileCheck;
      case 'bid_response': return Receipt;
      case 'receipt': return Receipt;
      case 'invoice': return DollarSign;
      case 'communication_log': return MessageSquare;
      case 'compliance_doc': return FileWarning;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Collateral Documents Review Handlers
  const handleCollateralFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // For demo purposes, just show the upload dialog
        setCollateralUploadDialogOpen(true);
        // In a real app, you would handle the file upload here
        console.log('Files selected for upload:', files);
      }
    };
    input.click();
  };

  const handleDocumentReview = (docId: string, action: 'edit' | 'confirm') => {
    // In a real app, this would make an API call
    console.log(`Document ${docId} ${action}`);
    
    if (action === 'edit') {
      setEditingDocumentId(docId);
      setConfirmingDocumentId(null);
    } else if (action === 'confirm') {
      setConfirmingDocumentId(docId);
      setEditingDocumentId(null);
    }
  };

  const handleSaveEdit = (docId: string) => {
    // In a real app, this would save the changes via API
    console.log(`Saving changes for document ${docId}`);
    setEditingDocumentId(null);
  };

  const handleCancelEdit = () => {
    setEditingDocumentId(null);
  };

  const handleConfirmDocument = (docId: string) => {
    // In a real app, this would confirm and move the document
    console.log(`Confirming document ${docId} and adding to collateral hub`);
    setConfirmingDocumentId(null);
    // Remove from pending review list (in real app, this would be handled by backend)
  };

  const handleCancelConfirm = () => {
    setConfirmingDocumentId(null);
  };

  // AI Search functionality
  const getAiSearchSuggestions = (query: string) => {
    const roleSuggestions = {
      pm: [
        // HVAC & Heating/Cooling
        "How much did we spend on HVAC repairs this year?",
        "Find all HVAC maintenance contracts",
        "Show me heating system invoices from last winter",
        "What HVAC vendors do we use most frequently?",
        "Find air conditioning repair receipts over $500",
        "Show me all furnace replacement quotes",
        "Find HVAC emergency repair calls",
        "What properties need HVAC filter replacements?",
        "Show me duct cleaning service records",
        "Find thermostat installation receipts",
        "What HVAC warranties are expiring soon?",
        "Show me cooling system maintenance logs",
        
        // Plumbing
        "Find all plumbing repair receipts",
        "Show me water damage insurance claims",
        "What plumbing emergencies happened this month?",
        "Find pipe replacement invoices",
        "Show me toilet repair receipts",
        "Find water heater maintenance records",
        "What plumbing vendors charge the most?",
        "Show me leak detection service calls",
        "Find drain cleaning receipts",
        "Show me faucet replacement invoices",
        "Find water pressure issue reports",
        "What plumbing warranties do we have?",
        
        // Electrical
        "Find all electrical repair invoices",
        "Show me panel upgrade receipts",
        "What electrical permits do we have?",
        "Find outlet installation costs",
        "Show me lighting repair receipts",
        "Find electrical inspection reports",
        "What electrical emergencies occurred?",
        "Show me wiring replacement quotes",
        "Find circuit breaker repair costs",
        "Show me electrical safety certificates",
        "Find generator maintenance records",
        "What electrical contractors do we use?",
        
        // Roofing
        "Find all roofing repair receipts",
        "Show me roof replacement quotes",
        "What roofing warranties are active?",
        "Find gutter cleaning service records",
        "Show me leak repair invoices",
        "Find roofing inspection reports",
        "What roofing materials did we purchase?",
        "Show me shingle replacement costs",
        "Find roof maintenance contracts",
        "Show me storm damage assessments",
        "Find chimney repair receipts",
        "What roofing vendors do we recommend?",
        
        // Flooring
        "Find all flooring replacement receipts",
        "Show me carpet cleaning service records",
        "What flooring warranties are valid?",
        "Find hardwood floor refinishing costs",
        "Show me tile repair invoices",
        "Find flooring installation quotes",
        "What flooring vendors do we use?",
        "Show me subfloor repair receipts",
        "Find laminate flooring purchases",
        "Show me floor polishing service records",
        "Find vinyl flooring installation costs",
        "What flooring inspections were done?",
        
        // Painting & Drywall
        "Find all painting service receipts",
        "Show me drywall repair invoices",
        "What paint supplies did we purchase?",
        "Find exterior painting quotes",
        "Show me interior painting costs",
        "Find drywall installation receipts",
        "What painting contractors do we use?",
        "Show me wallpaper removal costs",
        "Find texture repair invoices",
        "Show me primer and paint purchases",
        "Find painting equipment rental receipts",
        "What painting warranties are active?",
        
        // Appliances
        "Find all appliance repair receipts",
        "Show me refrigerator replacement costs",
        "What appliance warranties are valid?",
        "Find dishwasher installation invoices",
        "Show me washer and dryer repair costs",
        "Find oven and stove maintenance records",
        "What appliance vendors do we use?",
        "Show me microwave replacement receipts",
        "Find garbage disposal repair costs",
        "Show me appliance delivery receipts",
        "Find extended warranty purchases",
        "What appliances need replacement soon?",
        
        // Landscaping & Grounds
        "Find all landscaping service receipts",
        "Show me lawn care maintenance costs",
        "What landscaping contracts are active?",
        "Find tree removal service invoices",
        "Show me irrigation system repair costs",
        "Find fertilizer and pesticide purchases",
        "What landscaping equipment did we buy?",
        "Show me snow removal service receipts",
        "Find sprinkler system maintenance records",
        "Show me mulch and soil purchases",
        "Find landscaping design costs",
        "What seasonal maintenance was done?",
        
        // Security & Safety
        "Find all security system receipts",
        "Show me fire alarm inspection reports",
        "What security equipment did we install?",
        "Find smoke detector replacement costs",
        "Show me security camera installation invoices",
        "Find access control system receipts",
        "What safety inspections were completed?",
        "Show me emergency lighting maintenance",
        "Find security monitoring service costs",
        "Show me lock replacement receipts",
        "Find fire extinguisher service records",
        "What security upgrades were made?",
        
        // Cleaning & Maintenance
        "Find all cleaning service receipts",
        "Show me janitorial supply purchases",
        "What cleaning contracts are active?",
        "Find carpet cleaning service costs",
        "Show me window cleaning receipts",
        "Find pressure washing service invoices",
        "What cleaning equipment did we buy?",
        "Show me floor waxing service records",
        "Find sanitization service costs",
        "Show me cleaning supply deliveries",
        "Find deep cleaning service receipts",
        "What maintenance schedules are due?",
        
        // Property-Specific Queries
        "Find all receipts for Stanford GSB property",
        "Show me Sunnyvale 432 maintenance costs",
        "What repairs were done at Menlo Park?",
        "Find all Palo Alto Office expenses",
        "Show me Stanford GSB inspection reports",
        "What vendors service Sunnyvale 432?",
        "Find Menlo Park utility bills",
        "Show me Palo Alto Office insurance docs",
        "What maintenance is scheduled for Stanford GSB?",
        "Find all multi-property service contracts",
        
        // Financial & Cost Analysis
        "What were the most expensive repairs last quarter?",
        "Find receipts where we were overcharged",
        "Show me all expenses over $1000",
        "What maintenance costs exceeded budget?",
        "Find all emergency repair costs",
        "Show me year-over-year cost comparisons",
        "What vendors have the highest invoices?",
        "Find all tax-deductible expenses",
        "Show me monthly spending trends",
        "What repairs had cost overruns?",
        "Find all warranty claim savings",
        "Show me preventive vs reactive maintenance costs",
        
        // Vendor & Contractor Management
        "Find all Home Depot receipts",
        "Show me Lowe's purchase history",
        "What contractors do we use most?",
        "Find all vendor contact information",
        "Show me contractor performance reviews",
        "What vendors offer the best rates?",
        "Find all vendor insurance certificates",
        "Show me contractor licensing documents",
        "What vendors have payment terms?",
        "Find all preferred vendor agreements",
        "Show me vendor response time reports",
        "What contractors specialize in emergencies?",
        
        // Insurance & Claims
        "Find all insurance certificates",
        "Show me property insurance claims",
        "What insurance policies are expiring?",
        "Find liability insurance documents",
        "Show me workers comp certificates",
        "Find all insurance claim receipts",
        "What insurance coverage do we have?",
        "Show me insurance premium payments",
        "Find all damage assessment reports",
        "Show me insurance adjuster communications",
        "What claims are still pending?",
        "Find all insurance policy renewals",
        
        // Compliance & Inspections
        "Show me inspection reports that mention mold",
        "Find all safety inspection certificates",
        "What compliance documents are due?",
        "Show me fire safety inspection reports",
        "Find all building permit applications",
        "What health department inspections occurred?",
        "Show me elevator inspection certificates",
        "Find all environmental compliance docs",
        "What code violations need addressing?",
        "Show me occupancy permit renewals",
        "Find all accessibility compliance reports",
        "What inspections are scheduled this month?",
        
        // Contracts & Agreements
        "Find contracts expiring in the next 30 days",
        "Show me all service agreements",
        "What maintenance contracts are active?",
        "Find all vendor agreements",
        "Show me lease agreement amendments",
        "Find all warranty documents",
        "What contracts need renewal soon?",
        "Show me all purchase agreements",
        "Find contractor licensing agreements",
        "Show me all service level agreements",
        "What contracts have auto-renewal clauses?",
        "Find all non-disclosure agreements",
        
        // Utilities & Services
        "Find all utility bills this year",
        "Show me electricity usage reports",
        "What utility vendors do we use?",
        "Find all water and sewer bills",
        "Show me gas utility expenses",
        "Find internet and cable service costs",
        "What utility deposits did we pay?",
        "Show me utility connection fees",
        "Find all utility meter readings",
        "Show me energy efficiency reports",
        "What utility rebates did we receive?",
        "Find all utility service agreements",
        
        // Emergency & Urgent Repairs
        "Show me all emergency repair receipts",
        "Find after-hours service call costs",
        "What emergency repairs happened last month?",
        "Show me weekend emergency expenses",
        "Find all urgent maintenance requests",
        "What emergency vendors do we use?",
        "Show me holiday emergency repair costs",
        "Find all emergency contact information",
        "What emergencies required multiple visits?",
        "Show me emergency repair response times",
        "Find all emergency equipment rentals",
        "What emergency repairs exceeded estimates?",
        
        // Seasonal & Weather-Related
        "Find all winter weather damage costs",
        "Show me summer cooling system repairs",
        "What storm damage occurred this year?",
        "Find all freeze damage repair receipts",
        "Show me seasonal maintenance schedules",
        "Find all weather-related insurance claims",
        "What seasonal equipment rentals occurred?",
        "Show me ice dam removal costs",
        "Find all spring maintenance receipts",
        "Show me fall preparation service costs",
        "What weather monitoring equipment do we have?",
        "Find all seasonal vendor agreements"
      ],
      centralOffice: [
        // Approvals & Review
        "Show me all pending approvals",
        "Find high-value transactions needing review",
        "What expenses require CO approval?",
        "Show me all flagged transactions",
        "Find all contracts requiring CO approval",
        "What large purchases need authorization?",
        "Show me all budget variance reports",
        "Find all emergency spending approvals",
        "What vendor agreements need CO review?",
        "Show me all policy exception requests",
        "Find all capital expenditure approvals",
        "What insurance claims need CO review?",
        
        // Property Performance & Analytics
        "What properties have the highest maintenance costs?",
        "Show me property performance rankings",
        "Find all underperforming properties",
        "What properties exceed budget most often?",
        "Show me property ROI comparisons",
        "Find all property efficiency reports",
        "What properties need capital improvements?",
        "Show me tenant satisfaction by property",
        "Find all property vacancy reports",
        "What properties have recurring issues?",
        "Show me property maintenance trends",
        "Find all property valuation reports",
        
        // Compliance & Risk Management
        "Show me all compliance documents",
        "Find all regulatory violation reports",
        "What compliance audits are due?",
        "Show me all safety incident reports",
        "Find all environmental compliance issues",
        "What legal notices have we received?",
        "Show me all insurance policy reviews",
        "Find all risk assessment reports",
        "What compliance training is required?",
        "Show me all regulatory correspondence",
        "Find all permit violation notices",
        "What compliance certifications expire soon?",
        
        // Financial Oversight
        "Show me monthly spending by property",
        "Find all budget vs actual reports",
        "What expense categories are over budget?",
        "Show me all financial variance reports",
        "Find all cost center performance data",
        "What properties have declining margins?",
        "Show me all cash flow projections",
        "Find all accounts payable aging reports",
        "What vendors have payment disputes?",
        "Show me all financial audit findings",
        "Find all expense allocation reports",
        "What financial controls need strengthening?",
        
        // Vendor & Contract Oversight
        "Find all vendor performance reviews",
        "Show me vendor spending by category",
        "What vendors exceed spending limits?",
        "Find all vendor contract renewals",
        "Show me vendor insurance compliance",
        "What vendors have quality issues?",
        "Find all vendor dispute resolutions",
        "Show me vendor payment terms analysis",
        "What vendors offer volume discounts?",
        "Find all vendor risk assessments",
        "Show me vendor diversity reports",
        "What vendor agreements need renegotiation?",
        
        // AI & System Analytics
        "What expenses were flagged by AI?",
        "Show me AI-detected anomalies",
        "Find all system-generated alerts",
        "What patterns has AI identified?",
        "Show me predictive maintenance recommendations",
        "Find all automated expense categorizations",
        "What AI insights are available?",
        "Show me machine learning predictions",
        "Find all data quality issues",
        "What system optimizations are suggested?",
        "Show me AI performance metrics",
        "Find all automated workflow results",
        
        // Document & Data Management
        "Find all documents uploaded this week",
        "Show me document compliance status",
        "What documents are missing or incomplete?",
        "Find all document retention schedules",
        "Show me document access logs",
        "What documents need digital conversion?",
        "Find all document approval workflows",
        "Show me document version control issues",
        "What documents have security restrictions?",
        "Find all document backup statuses",
        "Show me document search analytics",
        "What documents are frequently accessed?",
        
        // Operational Efficiency
        "What are the most common repair types?",
        "Show me operational efficiency metrics",
        "Find all process improvement opportunities",
        "What workflows need optimization?",
        "Show me resource utilization reports",
        "Find all bottleneck analyses",
        "What best practices should be standardized?",
        "Show me cross-property comparisons",
        "Find all efficiency benchmark reports",
        "What automation opportunities exist?",
        "Show me staff productivity metrics",
        "Find all operational cost savings",
        
        // Strategic Planning
        "Show me 5-year maintenance projections",
        "Find all capital planning documents",
        "What strategic initiatives are active?",
        "Show me market analysis reports",
        "Find all competitive analysis data",
        "What expansion opportunities exist?",
        "Show me portfolio optimization studies",
        "Find all investment analysis reports",
        "What strategic partnerships are available?",
        "Show me long-term budget forecasts",
        "Find all scenario planning documents",
        "What strategic risks need mitigation?",
        
        // Quality Assurance
        "Show me all quality control reports",
        "Find all customer satisfaction surveys",
        "What quality issues are recurring?",
        "Show me service level agreement compliance",
        "Find all quality improvement initiatives",
        "What quality metrics are declining?",
        "Show me all quality audit results",
        "Find all corrective action plans",
        "What quality training is needed?",
        "Show me quality benchmark comparisons",
        "Find all quality certification documents",
        "What quality standards need updating?",
        
        // Emergency Management
        "Show me all emergency response plans",
        "Find all emergency contact directories",
        "What emergency procedures need updating?",
        "Show me emergency preparedness reports",
        "Find all disaster recovery plans",
        "What emergency equipment needs inspection?",
        "Show me emergency communication logs",
        "Find all emergency training records",
        "What emergency scenarios need planning?",
        "Show me emergency response metrics",
        "Find all emergency vendor agreements",
        "What emergency protocols need revision?",
        
        // Technology & Innovation
        "Show me all technology upgrade plans",
        "Find all digital transformation initiatives",
        "What technology investments are planned?",
        "Show me system integration reports",
        "Find all software licensing agreements",
        "What technology training is required?",
        "Show me cybersecurity assessment reports",
        "Find all data migration plans",
        "What technology partnerships exist?",
        "Show me innovation pilot programs",
        "Find all technology performance metrics",
        "What emerging technologies should we consider?"
      ]
    };

    const currentSuggestions = roleSuggestions[role as keyof typeof roleSuggestions] || roleSuggestions.pm;
    
    if (!query.trim()) {
      return currentSuggestions.slice(0, 5);
    }
    
    return currentSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  const handleAiSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setAiSearchLoading(true);
    setShowAiSuggestions(false);
    
    // Simulate AI search processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI search results based on query
    const mockResults = generateMockAiResults(query);
    setAiSearchResults(mockResults);
    setAiSearchLoading(false);
  };

  const generateMockAiResults = (query: string) => {
    const queryLower = query.toLowerCase();
    
    // Mock AI reasoning and document matching
    if (queryLower.includes('hvac') || queryLower.includes('heating') || queryLower.includes('cooling')) {
      return {
        summary: "Found 8 HVAC-related documents totaling $12,450 in expenses across 3 properties. The most recent service was a $3,200 repair at Stanford GSB on December 15th.",
        documents: collateralDocuments.filter(doc => 
          doc.filename.toLowerCase().includes('hvac') || 
          doc.tags.some(tag => tag.toLowerCase().includes('hvac'))
        ).slice(0, 4),
        insights: [
          "Stanford GSB has the highest HVAC maintenance costs ($8,200 YTD)",
          "Most common issue: Filter replacements and duct cleaning",
          "Average cost per HVAC service: $1,556"
        ]
      };
    }
    
    if (queryLower.includes('mold') || queryLower.includes('inspection')) {
      return {
        summary: "Found 3 inspection reports mentioning mold concerns. Two properties require immediate attention based on recent findings.",
        documents: collateralDocuments.filter(doc => 
          doc.documentType === 'compliance_doc' || 
          doc.tags.some(tag => tag.toLowerCase().includes('mold'))
        ).slice(0, 3),
        insights: [
          "Sunnyvale 432 - Mold detected in basement (requires remediation)",
          "Stanford GSB - Minor mold concerns in bathroom (resolved)",
          "Menlo Park - Preventive inspection scheduled for next month"
        ]
      };
    }
    
    if (queryLower.includes('overcharged') || queryLower.includes('expensive') || queryLower.includes('cost')) {
      return {
        summary: "Identified 5 potentially overcharged transactions totaling $2,340. Analysis shows 3 vendors with pricing above market average.",
        documents: collateralDocuments.filter(doc => 
          doc.amount && doc.amount > 1000
        ).slice(0, 5),
        insights: [
          "Home Depot charges 15% above average for similar services",
          "Plumbing services at Stanford GSB were 23% higher than typical",
          "Consider negotiating bulk rates with frequent vendors"
        ]
      };
    }
    
    // Default search results
    return {
      summary: `Found ${Math.floor(Math.random() * 12) + 3} documents related to "${query}". Results include receipts, contracts, and inspection reports.`,
      documents: collateralDocuments.slice(0, Math.floor(Math.random() * 6) + 2),
      insights: [
        "Most documents are from the last 6 months",
        "Average document value: $1,234",
        "All required compliance documents are current"
      ]
    };
  };

  const handleAskAi = async (message: string) => {
    if (!message.trim()) return;
    
    const newUserMessage = { role: 'user' as const, content: message };
    setAiChatMessages(prev => [...prev, newUserMessage]);
    setAiChatInput('');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiResponse = generateAiChatResponse(message);
    setAiChatMessages(prev => [...prev, aiResponse]);
  };

  const generateAiChatResponse = (message: string) => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('spend') || messageLower.includes('cost') || messageLower.includes('money')) {
      return {
        role: 'assistant' as const,
        content: "Based on your collateral documents, here's a breakdown of spending:\n\n• Total documented expenses: $45,230\n• Highest category: HVAC maintenance ($12,450)\n• Most active property: Stanford GSB\n• Average monthly spend: $7,538\n\nWould you like me to break this down by property or time period?",
        documents: collateralDocuments.filter(doc => doc.amount && doc.amount > 500).slice(0, 3)
      };
    }
    
    if (messageLower.includes('mold') || messageLower.includes('inspection')) {
      return {
        role: 'assistant' as const,
        content: "I found several inspection reports in your documents:\n\n• 2 properties have mold-related findings\n• 1 requires immediate remediation\n• 3 preventive inspections scheduled\n\nThe most critical issue is at Sunnyvale 432 where basement mold was detected. I recommend prioritizing this repair.",
        documents: collateralDocuments.filter(doc => doc.documentType === 'compliance_doc').slice(0, 2)
      };
    }
    
    return {
      role: 'assistant' as const,
      content: `I understand you're asking about "${message}". Based on your document collection, I can help you find relevant information. Let me search through your receipts, contracts, and reports to provide specific insights.\n\nWhat specific aspect would you like me to focus on?`,
      documents: collateralDocuments.slice(0, 2)
    };
  };

  // Keyboard shortcuts for AI search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K or Ctrl+K to focus AI search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (activeTab === 'collateral') {
          const searchInput = document.querySelector('[placeholder*="Ask anything"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        } else {
          setActiveTab('collateral');
          setTimeout(() => {
            const searchInput = document.querySelector('[placeholder*="Ask anything"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
          }, 100);
        }
      }
      // CMD+Shift+K or Ctrl+Shift+K to open Ask AI modal
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setAskAiModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Role Toggle for Demo */}
      <div className="flex justify-end p-4 bg-gray-900 border-b border-gray-800">
        <span className="mr-2 text-gray-400">Role:</span>
        <Button
          size="sm"
          className={role === 'pm' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'pm' ? 'default' : 'outline'}
          onClick={() => { 
            setRole('pm'); 
            setActiveTab('dashboard'); 
            localStorage.setItem('currentRole', 'pm');
          }}
        >
          Property Manager
        </Button>
        <Button
          size="sm"
          className={role === 'technician' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'technician' ? 'default' : 'outline'}
          onClick={() => { 
            setRole('technician'); 
            setActiveTab('dashboard'); 
            localStorage.setItem('currentRole', 'technician');
          }}
        >
          Technician
        </Button>
        <Button
          size="sm"
          className={role === 'centralOffice' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-400'}
          variant={role === 'centralOffice' ? 'default' : 'outline'}
          onClick={() => { 
            setRole('centralOffice'); 
            setActiveTab('dashboard'); 
            localStorage.setItem('currentRole', 'centralOffice');
          }}
        >
          Central Office
        </Button>
      </div>
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Job Vault</h1>
          </div>
          <nav className="space-y-1">
            {sidebarTabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300 hover:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Database className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  window.location.href = '/owner';
                }}
                className="w-full justify-start bg-blue-900 border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Owner Dashboard
              </Button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Remove QuickBooks Ready badge and Export All button */}
          </div>
        </div>
      </header>
          <div className="p-6">
            {/* Main content area controlled by activeTab */}
            {activeTab === "dashboard" && (
              <>
                {/* Dashboard Summary Section */}
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                    <p className="text-blue-200 text-lg">
                      {role === 'technician' ? (
                        <>
                          You have <span className="font-semibold text-blue-300">{technicianOpenJobs.length}</span> open work orders, <span className="font-semibold text-blue-200">{technicianInProgressJobs.length}</span> in progress, <span className="font-semibold text-blue-100">{technicianFinishedJobs.length}</span> finished, and <span className="font-semibold text-blue-100">${technicianTotalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}</span> spent this month.
                        </>
                      ) : (
                        <>
                          You have <span className="font-semibold text-blue-300">{openJobs.length}</span> open work orders, <span className="font-semibold text-blue-200">{pendingOwnerApprovals.length}</span> pending owner approvals, and <span className="font-semibold text-blue-100">${totalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}</span> spent this month.
                        </>
                      )}
                    </p>
                    <p className="text-blue-300 mt-2 text-sm">
                      {role === 'technician' 
                        ? "Keep track of your assigned work orders and expenses for efficient project management."
                        : "Keep an eye on overdue work orders and uncategorized expenses for a healthy workflow."
                      }
                    </p>
                  </div>
                  {/* Removed badges for Open Jobs, Pending Approvals, This Month */}
                </div>
                {/* Job Status Overview KPIs */}
                <div className="mb-2 mt-2">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {role === 'technician' ? 'My Work Order Status Overview' : 'Work Order Status Overview'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'Open Work Orders' : 'Open Work Orders'}
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {role === 'technician' ? technicianOpenJobs.length : openJobs.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'In Progress' : 'Pending Owner Approvals'}
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">
                          {role === 'technician' ? technicianInProgressJobs.length : pendingOwnerApprovals.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'Finished' : 'Work Orders Assigned to Subs'}
                        </div>
                        <div className="text-3xl font-bold text-blue-400">
                          {role === 'technician' ? technicianFinishedJobs.length : jobsAssignedToSubs.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'Overdue' : 'Overdue Work Orders'}
                        </div>
                        <div className="text-3xl font-bold text-red-400">
                          {role === 'technician' ? technicianOverdueJobs.length : overdueJobs.length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* Expenses This Month KPIs */}
                <div className="mb-2 mt-8">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {role === 'technician' ? 'My Expenses This Month' : 'Expenses This Month'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Total Spend</div>
                        <div className="text-3xl font-bold text-white">
                          ${role === 'technician' ? technicianTotalSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : totalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Billable</div>
                        <div className="text-3xl font-bold text-green-400">
                          ${role === 'technician' ? technicianBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : billableSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Non-Billable</div>
                        <div className="text-3xl font-bold text-gray-400">
                          ${role === 'technician' ? technicianNonBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : nonBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Uncategorized / Needs Review</div>
                        <div className="text-3xl font-bold text-yellow-400">
                          ${role === 'technician' ? technicianUncategorizedSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : uncategorizedSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* Reimbursement Overview - Central Office Only */}
                {role === 'centralOffice' && (
                  <div className="mb-2 mt-8">
                    <h4 className="text-lg font-semibold text-white mb-2">Reimbursement Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Total Expense Spend</div>
                          <div className="text-3xl font-bold text-white">
                            ${totalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Reimbursed</div>
                          <div className="text-3xl font-bold text-green-400">
                            ${reconciledSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Awaiting Reimbursement</div>
                          <div className="text-3xl font-bold text-yellow-400">
                            ${pendingBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Issues / Needs Review</div>
                          <div className="text-3xl font-bold text-red-400">
                            ${issuesSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                {/* Budget Tracking - PM and Central Office Only */}
                {(role === 'pm' || role === 'centralOffice') && (() => {
                  const budgetMetrics = getBudgetMetricsForRole(role);
                  return (
                    <div className="mb-2 mt-8">
                      <h4 className="text-lg font-semibold text-white mb-2">Budget Tracking</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="text-gray-400 text-xs mb-1">Portfolio Budget Variance</div>
                            <div className={`text-3xl font-bold ${budgetMetrics.isPortfolioUnderBudget ? 'text-green-400' : 'text-red-400'}`}>
                              {budgetMetrics.isPortfolioUnderBudget ? '-' : '+'}{Math.abs(100 - budgetMetrics.portfolioVariance).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ${budgetMetrics.totalSpent.toFixed(1)}M of ${budgetMetrics.totalBudget.toFixed(1)}M budget
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="text-gray-400 text-xs mb-1"># Properties Tracking to Budget</div>
                            <div className="text-3xl font-bold text-green-400">
                              {budgetMetrics.propertiesUnderBudget}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              of {budgetMetrics.properties.length} properties under budget
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="text-gray-400 text-xs mb-1">Total Spend vs Budget</div>
                            <div className={`text-3xl font-bold ${budgetMetrics.isPortfolioUnderBudget ? 'text-green-400' : 'text-red-400'}`}>
                              {budgetMetrics.isPortfolioUnderBudget ? 'Under' : 'Over'}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {budgetMetrics.isPortfolioUnderBudget ? 'Under' : 'Over'} by ${Math.abs(budgetMetrics.portfolioVarianceAmount).toFixed(1)}M
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="text-gray-400 text-xs mb-1">Properties Over Budget</div>
                            <div className="text-3xl font-bold text-red-400">
                              {budgetMetrics.propertiesOverBudget}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              properties need attention
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })()}

                {/* Variance Comments Due - PM Only */}
                {role === 'pm' && (
                  <div className="mb-2 mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Variance Comments Due</h4>
                      <Button
                        onClick={() => setActiveTab('variance-comments')}
                        variant="outline"
                        className="bg-red-600 border-red-600 text-white hover:bg-red-700"
                        size="sm"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        View All (6)
                      </Button>
                    </div>

                    {/* Slimmed Todo-Style Variance List */}
                    <div className="bg-gray-800 border-gray-700 rounded-lg p-4">
                      <div className="space-y-3">
                        {[
                          {
                            id: 1,
                            account: '7215 - Plumbing Repairs',
                            property: 'ap172',
                            variance: '+$8,750 (+58.3%)',
                            priority: 'high'
                          },
                          {
                            id: 2,
                            account: '6125 - Leasing Commissions',
                            property: 'ap172',
                            variance: '+$7,280 (+12.6%)',
                            priority: 'high'
                          },
                          {
                            id: 3,
                            account: '7420 - Electrical Systems',
                            property: 'mb401',
                            variance: '+$28,780 (+22.5%)',
                            priority: 'high'
                          },
                          {
                            id: 4,
                            account: '8115 - HVAC Equipment Financing',
                            property: 'ap172',
                            variance: '+$26,000 (+29.5%)',
                            priority: 'medium'
                          },
                          {
                            id: 5,
                            account: '4125 - Parking Revenue',
                            property: 'ap172',
                            variance: '+$28,800 (+25.7%)',
                            priority: 'low'
                          }
                        ].map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => setActiveTab('variance-comments')}
                            className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                item.priority === 'high' ? 'bg-red-400' : 
                                item.priority === 'medium' ? 'bg-orange-400' : 'bg-yellow-400'
                              }`} />
                              <div>
                                <div className="text-blue-300 text-sm font-medium group-hover:text-blue-200">
                                  {item.account}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {item.property} • Variance: <span className="text-red-300 font-medium">{item.variance}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white" />
                          </div>
                        ))}
                        
                        {/* Show more link */}
                        <button
                          onClick={() => setActiveTab('variance-comments')}
                          className="w-full text-center py-2 text-red-300 hover:text-red-200 text-sm font-medium"
                        >
                          + 1 more item • View All Details →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                                 {/* Spend by Type - Central Office Only */}
                 {role === 'centralOffice' && (
                   <div className="mb-2 mt-8">
                     <h4 className="text-lg font-semibold text-white mb-2">Spend by Type</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                       <Card className="bg-gray-800 border-gray-700">
                         <CardContent className="p-4">
                           <div className="text-gray-400 text-xs mb-1">Credit Card Spend</div>
                           <div className="text-3xl font-bold text-blue-400">
                             ${spendByTypeData.creditCard.toLocaleString(undefined, {minimumFractionDigits:2})}
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             {spendByTypeData.creditCardPercentage.toFixed(0)}% of total spend
                           </div>
                         </CardContent>
                       </Card>
                       <Card className="bg-gray-800 border-gray-700">
                         <CardContent className="p-4">
                           <div className="text-gray-400 text-xs mb-1">% of Spend on CC</div>
                           <div className="text-3xl font-bold text-cyan-400">
                             {spendByTypeData.creditCardPercentage.toFixed(1)}%
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             Credit card vs total spend
                           </div>
                         </CardContent>
                       </Card>
                       <Card className="bg-gray-800 border-gray-700">
                         <CardContent className="p-4">
                           <div className="text-gray-400 text-xs mb-1">Invoice / Check Spend</div>
                           <div className="text-3xl font-bold text-purple-400">
                             ${spendByTypeData.invoice.toLocaleString(undefined, {minimumFractionDigits:2})}
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             {(100 - spendByTypeData.creditCardPercentage).toFixed(0)}% of total spend
                           </div>
                         </CardContent>
                       </Card>
                       <Card className="bg-gray-800 border-gray-700">
                         <CardContent className="p-4">
                           <div className="text-gray-400 text-xs mb-1">Cashback Earned</div>
                           <div className="text-3xl font-bold text-green-400">
                             ${spendByTypeData.cashback.toLocaleString(undefined, {minimumFractionDigits:2})}
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             1.5% cashback rate
                           </div>
                         </CardContent>
                       </Card>
                     </div>
                   </div>
                 )}
                {/* Recent Activity Notifications */}
                <div className="mb-2 mt-8">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {role === 'technician' ? 'My Recent Activity' : 'Recent Activity'}
                  </h4>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Mock recent activity notifications */}
                        {role === 'technician' ? (
                          <>
                            {/* Technician-specific activities */}
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order assigned to you</p>
                                <p className="text-xs text-gray-400">HVAC System Maintenance - Annual Service at Stanford GSB</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order completed</p>
                                <p className="text-xs text-gray-400">Lobby Painting at Downtown Lofts finished by you</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-purple-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Expense recorded</p>
                                <p className="text-xs text-gray-400">$120.50 spent at Home Depot for HVAC parts</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order in progress</p>
                                <p className="text-xs text-gray-400">Kitchen Renovation at Stanford GSB - Started work</p>
                                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* PM/Central Office activities */}
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">New work order created</p>
                                <p className="text-xs text-gray-400">HVAC System Maintenance - Annual Service at Stanford GSB</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                  <AlertCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Approval required</p>
                                <p className="text-xs text-gray-400">Emergency Plumbing Repair at Sunnyvale 432 needs owner approval</p>
                                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order completed</p>
                                <p className="text-xs text-gray-400">Lobby Painting at Downtown Lofts finished by Alice Johnson</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-purple-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Expense recorded</p>
                                <p className="text-xs text-gray-400">$150.00 spent at Home Depot for HVAC parts</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-red-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Overdue work order</p>
                                <p className="text-xs text-gray-400">Kitchen Renovation at Stanford GSB is 3 days overdue</p>
                                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "workorders" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Work Orders</h3>
                  {(role === 'pm' || role === 'centralOffice') && (
                    <div className="flex gap-2">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setImportAppFolioDialogOpen(true)}>
                        <Sync className="h-4 w-4 mr-2" /> Appfolio Sync
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setNewJobDialogOpen(true)}>New Work Order</Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col h-[400px] rounded-lg mb-8">
                  <div className="flex-1 overflow-x-auto overflow-y-auto">
                    {/* Jobs table moved here from Dashboard */}
                    <TooltipProvider>
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700">
                            <th className="text-left py-3 px-4 min-w-[160px] font-semibold text-white">Property</th>
                            <th className="text-left py-3 px-4 min-w-[240px] font-semibold text-white">Name</th>
                            <th className="text-left py-3 px-4 min-w-[180px] font-semibold text-white">Approval</th>
                            <th className="text-left py-3 px-4 min-w-[140px] font-semibold text-white">Technician</th>
                            <th className="text-left py-3 px-4 min-w-[120px] font-semibold text-white">Requested</th>
                            <th className="text-center py-3 px-4 min-w-[100px] font-semibold text-white">Priority</th>
                            <th className="text-left py-3 px-4 min-w-[120px] font-semibold text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(role === 'technician'
                            ? jobs.filter((job) => job.technician === technicianName)
                            : jobs
                          ).map((job) => (
                            <React.Fragment key={job.id}>
                              <tr
                                className="group bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                                onClick={() => { router.push(`/workorders/${job.id}?role=${role}`); }}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium text-white" title={job.property}>
                                    {job.property}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-gray-200" title={job.description}>
                                    {job.description.charAt(0).toUpperCase() + job.description.slice(1)}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {/* Approval Status Pill System */}
                                    {job.preApprovalStatus === 'Approved' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-700 text-green-100">
                                        <CheckCircle className="h-4 w-4 mr-1 text-green-200" /> Approved
                                      </span>
                                    ) : job.preApprovalStatus === 'Required' && approvalJobs[job.id]?.status === 'No Response' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-yellow-100">
                                        <Clock className="h-4 w-4 mr-1 text-yellow-200" /> Approval Requested
                                      </span>
                                    ) : job.preApprovalStatus === 'Required' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-700 text-red-100">
                                        <AlertCircle className="h-4 w-4 mr-1 text-red-200" /> Approval Needed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-200">
                                        <Settings className="h-4 w-4 mr-1 text-gray-300" /> Automatic Approval
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-gray-300" title={job.technician || 'Unassigned'}>
                                    {job.technician || 'Unassigned'}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  {job.requested}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="flex justify-center items-center">
                                          {(() => {
                                            switch (job.priority) {
                                              case 'High':
                                                return <span className="inline-block w-4 h-4 rounded-full bg-red-500" />;
                                              case 'Medium':
                                                return <span className="inline-block w-4 h-4 rounded-full bg-orange-400" />;
                                              case 'Low':
                                                return <span className="inline-block w-4 h-4 rounded-full bg-blue-400" />;
                                              default:
                                                return <span className="inline-block w-4 h-4 rounded-full bg-gray-400" />;
                                            }
                                          })()}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>{job.priority || '-'}</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {(role === 'pm' || role === 'centralOffice') && (
                                      <>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="h-8 w-8 text-gray-300 hover:text-red-300 hover:bg-red-500/20"
                                              onClick={e => { e.stopPropagation(); setJobToDelete(job); setDeleteDialogOpen(true); }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Delete job</TooltipContent>
                                        </Tooltip>
                                      </>
                                    )}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-green-500/20"
                                          onClick={e => { 
                                            e.stopPropagation(); 
                                            setExpandedJobExpenses(expandedJobExpenses === job.id ? null : job.id); 
                                          }}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {expandedJobExpenses === job.id ? 'Hide Expenses' : 'View Expenses'}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className={`text-blue-400 hover:text-blue-600`}
                                      onClick={() => { router.push(`/workorders/${job.id}?role=${role}`); }}
                                      aria-label="View Work Order Details"
                                    >
                                      <ChevronRight className="h-5 w-5 transition-transform" />
                                    </Button>
                                  </div>
                                  {/* Separate Send Reminder button for jobs waiting for approval */}
                                  {(role === 'pm' || role === 'centralOffice') && approvalJobs[job.id]?.status === 'No Response' && (
                                    <div className="mt-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-blue-400 border-blue-700 hover:bg-blue-700/20"
                                          >
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Send Reminder
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Send reminder to owner</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  )}
                                </td>
                              </tr>
                              {/* Expanded expenses row */}
                              {expandedJobExpenses === job.id && (
                                <tr className="bg-gray-900">
                                  <td colSpan={8} className="p-0">
                                    <div className="p-4">
                                      <h5 className="text-sm font-semibold text-white mb-2">Expenses for this job</h5>
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-xs mb-2">
                                          <thead>
                                            <tr className="border-b border-gray-700">
                                              <th className="text-left py-2 px-3 font-semibold text-white">Date</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Vendor</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Made By</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Amount</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Memo</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {filterExpensesByRole([...transactions, ...technicianTransactions])
                                              .filter(txn => txn.jobId === job.id)
                                              .map((txn) => {
                                                return (
                                                  <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.date}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.vendor}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.madeBy}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">${txn.amount.toFixed(2)}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.memo || '-'}</td>
                                                  </tr>
                                                );
                                              })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </TooltipProvider>
                  </div>
                </div>
              </>
            )}
            {activeTab === "activity" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Activity Log</h3>
                        </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-4 items-end">
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select value={activityPropertyFilter} onValueChange={setActivityPropertyFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{activityPropertyFilter === 'all' ? 'All Properties' : activityPropertyFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Properties</SelectItem>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name}>{property.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>
                  <div>
                    <Label className="text-gray-300">Work Order</Label>
                    <Select value={activityJobFilter} onValueChange={setActivityJobFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{activityJobFilter === 'all' ? 'All Work Orders' : activityJobFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Work Orders</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.description}>{job.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>
                  <div>
                    <Label className="text-gray-300">Activity</Label>
                    <Select value={activityMilestoneFilter} onValueChange={setActivityMilestoneFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{activityMilestoneFilter === 'all' ? 'All Activities' : activityMilestoneFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Activities</SelectItem>
                        {activityMilestonesWithUpdate.map(milestone => (
                          <SelectItem key={milestone.milestone} value={milestone.milestone}>{milestone.milestone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>
                  <div>
                    <Label className="text-gray-300">Owner</Label>
                    <Select value={activityOwnerFilter} onValueChange={setActivityOwnerFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue>{activityOwnerFilter === 'all' ? 'All Owners' : activityOwnerFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Owners</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Central Office">Central Office</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                        </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Activity</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Owner</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Generate activity data from jobs and milestones
                        const activities = jobs.flatMap(job => 
                          activityMilestonesWithUpdate.map(milestone => ({
                            ...milestone,
                            job,
                            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            fileKey: `${job.id}-${milestone.milestone.toLowerCase().replace(/\s+/g, '-')}`
                          }))
                        );

                        // Apply filters
                        return activities
                          .filter(activity => {
                            if (activityPropertyFilter !== 'all' && activity.job.property !== activityPropertyFilter) return false;
                            if (activityJobFilter !== 'all' && activity.job.description !== activityJobFilter) return false;
                            if (activityMilestoneFilter !== 'all' && activity.milestone !== activityMilestoneFilter) return false;
                            if (activityOwnerFilter !== 'all' && activity.owner !== activityOwnerFilter) return false;
                            return true;
                          })
                          .map((activity, i) => (
                            <tr key={activity.milestone + i} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-gray-300">{activity.job.property}</td>
                              <td className="py-3 px-4 text-gray-300">{activity.job.description}</td>
                              <td className="py-3 px-4 text-gray-300">{activity.milestone}</td>
                              <td className="py-3 px-4 text-gray-300">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                  activity.owner === 'PM' ? 'bg-blue-700 text-blue-100' :
                                  activity.owner === 'Technician' ? 'bg-green-700 text-green-100' :
                                  'bg-purple-700 text-purple-100'
                                }`}>
                                  {activity.owner}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{activity.date}</td>
                              <td className="py-3 px-4 text-gray-300">
                                {activityFiles[activity.fileKey]?.length > 0 ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                                    onClick={() => {
                                      // Mock file preview - in real app this would show actual files
                                      alert(`Viewing files for ${activity.milestone}`);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                            </Button>
                                ) : '-'}
                              </td>
                            </tr>
                          ));
                      })()}
                    </tbody>
                  </table>
                          </div>
              </>
            )}
            {activeTab === "payments" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Trust Account Reimbursements</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      Manage reimbursements for logged transactions by work order
                    </div>
                    <Button 
                      onClick={() => setMonthlyReportDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Monthly Reports
                    </Button>
                  </div>
                </div>

                {/* Enhanced Trust Account Summary */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-white mb-3">Trust Account Balances & Auto-Mapping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.map((property) => {
                      const ytdSpending = getPropertyYTDSpending(property.name);
                      return (
                        <Card key={property.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-sm font-medium text-white">{property.name}</div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-green-400">Auto-mapped</span>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                              ${property.trustBalance.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400 mb-2">
                              Trust Balance • {property.trustAccount.bankName}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              Account: {property.trustAccount.accountNumber} • Routing: {property.trustAccount.routingNumber}
                            </div>
                            <div className="text-lg font-semibold text-blue-400 mb-1">
                              ${ytdSpending.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              YTD Spending • Last sync: {property.lastSync}
                            </div>
                            <div className="text-xs text-green-400 mt-1">
                              🔄 Reimbursements auto-sync to this account
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Outstanding Reimbursements Section */}
                <div className="mb-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    Outstanding Reimbursements - Current Month (January 2025)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.map((property) => {
                      const currentMonthPending = [...transactions, ...technicianTransactions]
                        .filter(txn => {
                          const job = jobs.find(j => j.id === txn.jobId);
                          const txnDate = new Date(txn.date);
                          return job && job.property === property.name && 
                                 txn.status === 'pending' &&
                                 txnDate.getMonth() === 0 && // January
                                 txnDate.getFullYear() === 2025;
                        })
                        .reduce((sum, txn) => sum + txn.amount, 0);
                      
                      if (currentMonthPending === 0) return null;
                      
                      return (
                        <Card key={property.id} className="bg-gray-800 border-yellow-500/30">
                          <CardContent className="p-4">
                            <div className="text-sm font-medium text-white mb-2">{property.name}</div>
                            <div className="text-xl font-bold text-yellow-400 mb-2">
                              ${currentMonthPending.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400 mb-3">
                              Pending • Auto-maps to {property.trustAccount.bankName}
                            </div>
                            <Button 
                              onClick={() => handleMonthlyReimbursement(property, '2025-01')}
                              className="bg-green-600 hover:bg-green-700 text-white w-full"
                              size="sm"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Reimburse January
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Expense Reports */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-semibold text-white">Monthly GL-Coded Expense Reports</h4>
                    <div className="text-sm text-gray-400">
                      📊 Auto-synced with AppFolio • Updated real-time
                    </div>
                  </div>
                  
                  {properties.map((property) => {
                    // Get all transactions for this property by month
                    const propertyJobs = jobs.filter(job => job.property === property.name);
                    const propertyTransactions = [...transactions, ...technicianTransactions].filter(txn => {
                      const job = jobs.find(j => j.id === txn.jobId);
                      return job && job.property === property.name;
                    });

                    // Group transactions by month (showing last 3 months)
                    const monthlyGroups = ['2025-01', '2024-12', '2024-11'].map(month => {
                      const [year, monthNum] = month.split('-').map(Number);
                      const monthTransactions = propertyTransactions.filter(txn => {
                        const txnDate = new Date(txn.date);
                        return txnDate.getFullYear() === year && txnDate.getMonth() === monthNum - 1;
                      });
                      
                      const totalAmount = monthTransactions.reduce((sum, txn) => sum + txn.amount, 0);
                      const reconciledAmount = monthTransactions.filter(txn => txn.status === 'reconciled').reduce((sum, txn) => sum + txn.amount, 0);
                      const pendingAmount = monthTransactions.filter(txn => txn.status === 'pending').reduce((sum, txn) => sum + txn.amount, 0);
                      
                      return {
                        month,
                        monthName: new Date(year, monthNum - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        transactions: monthTransactions,
                        totalAmount,
                        reconciledAmount,
                        pendingAmount,
                        property
                      };
                    }).filter(group => group.transactions.length > 0);

                    if (monthlyGroups.length === 0) return null;

                    return (
                      <div key={property.id} className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-lg font-semibold text-white">{property.name}</h5>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="text-blue-400">🔄 AppFolio Sync Active</span>
                            • {monthlyGroups.length} month{monthlyGroups.length !== 1 ? 's' : ''} with expenses
                          </div>
                        </div>

                        <div className="space-y-3">
                          {monthlyGroups.map((group) => {
                            const isExpanded = expandedWorkOrders.has(group.month);
                            return (
                              <div key={group.month} className="bg-gray-700 rounded-lg border border-gray-600">
                                {/* Monthly Report Header - Always Visible */}
                                <div 
                                  className="p-4 cursor-pointer hover:bg-gray-600/50 transition-colors"
                                  onClick={() => toggleWorkOrderExpansion(group.month)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                      <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <div>
                                        <h6 className="font-medium text-white">{group.monthName} GL Report</h6>
                                        <div className="text-sm text-gray-400 flex items-center gap-2">
                                          <span className="text-blue-400">📊 AppFolio</span>
                                          • {group.transactions.length} transaction{group.transactions.length !== 1 ? 's' : ''}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-white">
                                          ${group.totalAmount.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-green-400">
                                          ${group.reconciledAmount.toFixed(2)} reconciled
                                        </div>
                                        {group.pendingAmount > 0 && (
                                          <div className="text-sm text-yellow-400">
                                            ${group.pendingAmount.toFixed(2)} pending
                                          </div>
                                        )}
                                      </div>
                                      <Button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMonthlyReimbursement(group.property, group.month);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        size="sm"
                                        disabled={group.pendingAmount === 0}
                                      >
                                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                                        Process GL Report
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Collapsible GL Report Section */}
                                {isExpanded && (
                                  <div className="border-t border-gray-600 p-4 bg-gray-800/50">
                                    <div className="mb-3 flex justify-between items-center">
                                      <h6 className="text-sm font-medium text-gray-300">GL-Coded Expense Report</h6>
                                      <div className="text-xs text-blue-400">Auto-synced with AppFolio</div>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <TooltipProvider>
                                        <table className="w-full text-sm min-w-[800px]">
                                          <thead>
                                            <tr className="border-b border-gray-600">
                                              <th className="text-left py-2 text-gray-400">Date</th>
                                              <th className="text-left py-2 text-gray-400">Merchant</th>
                                              <th className="text-left py-2 text-gray-400">GL Code</th>
                                              <th className="text-left py-2 text-gray-400">Property Code</th>
                                              <th className="text-left py-2 text-gray-400">Billable?</th>
                                              <th className="text-left py-2 text-gray-400">
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <span className="cursor-help">
                                                      Flag spend
                                                    </span>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <div>
                                                      <div className="text-sm font-semibold">Auto-flagged spend that triggered owner's approval threshold</div>
                                                      <div className="text-xs text-gray-400">
                                                        Expenses over $500 require pre-approval
                                                      </div>
                                                    </div>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </th>
                                              <th className="text-left py-2 text-gray-400">Memo / Notes</th>
                                              <th className="text-left py-2 text-gray-400">Receipt</th>
                                              <th className="text-right py-2 text-gray-400">Amount</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {group.transactions.map((txn, idx) => {
                                              const job = jobs.find(j => j.id === txn.jobId);
                                              const glCode = txn.billable ? '7200 - Repairs & Maintenance' : '6100 - Office Expenses';
                                              const propertyCode = property.id.toUpperCase();
                                              
                                              // Demo flagging logic - flag specific items for demo purposes
                                              const shouldBeFlagged = txn.amount >= 120 || txn.vendor === 'Home Depot' || (txn.memo && txn.memo.includes('HVAC'));
                                              
                                              return (
                                                <tr key={idx} className="border-b border-gray-600/50">
                                                  <td className="py-2 px-3 text-gray-300">{txn.date}</td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.vendor}</td>
                                                  <td className="py-2 px-3 text-blue-300">{glCode}</td>
                                                  <td className="py-2 px-3 text-blue-300">{propertyCode}</td>
                                                  <td className="py-2 px-3">
                                                    <Badge className={txn.billable ? "bg-green-600 text-white text-xs" : "bg-gray-600 text-white text-xs"}>
                                                      {txn.billable ? 'Yes' : 'No'}
                                                    </Badge>
                                                  </td>
                                                  <td className="py-2 px-3">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <span className="cursor-help">
                                                          {shouldBeFlagged ? (
                                                            <Badge className="bg-orange-700 text-orange-100 text-xs flex items-center gap-1">
                                                              <AlertTriangle className="h-4 w-4" />
                                                              Flagged
                                                            </Badge>
                                                          ) : (
                                                            <Badge className="bg-gray-700 text-gray-300 text-xs flex items-center gap-1">
                                                              <CheckCircle className="h-4 w-4" />
                                                              Clear
                                                            </Badge>
                                                          )}
                                                        </span>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        {shouldBeFlagged ? (
                                                          <div>
                                                            <div className="text-sm font-semibold">Amount exceeds $500 threshold - requires owner approval</div>
                                                            <div className="text-xs text-gray-400">
                                                              {txn.amount >= 120 ? 'Amount exceeds $120 threshold' : ''}
                                                              {txn.vendor === 'Home Depot' ? 'High-spend vendor flagged' : ''}
                                                              {txn.memo && txn.memo.includes('HVAC') ? 'HVAC expenses require approval' : ''}
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div className="text-sm">No flags - approved for processing</div>
                                                        )}
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.memo || job?.description || 'N/A'}</td>
                                                  <td className="py-2 px-3">
                                                    {txn.receipt ? (
                                                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                                                        [View]
                                                      </Button>
                                                    ) : (
                                                      <span className="text-gray-500">Missing</span>
                                                    )}
                                                  </td>
                                                  <td className="py-2 px-3 text-right text-gray-300">${txn.amount.toFixed(2)}</td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </TooltipProvider>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                                      <div className="text-sm text-blue-300 flex items-center gap-2">
                                        <span className="text-blue-400">🏦</span>
                                        Trust Account: {property.trustAccount.bankName} {property.trustAccount.accountNumber}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Monthly Report Dialog */}
                <Dialog open={monthlyReportDialogOpen} onOpenChange={setMonthlyReportDialogOpen}>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Monthly Spending Report</DialogTitle>
                      <DialogDescription>
                        Generate detailed monthly spending reports for properties
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Property and Month Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="report-property" className="text-sm text-gray-400">
                            Property
                          </Label>
                          <Select 
                            value={selectedReportProperty?.id || ''} 
                            onValueChange={(value) => {
                              const property = properties.find(p => p.id === value);
                              setSelectedReportProperty(property || null);
                            }}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700 text-white">
                              {properties.map(property => (
                                <SelectItem key={property.id} value={property.id} className="bg-gray-900 text-white">
                                  {property.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="report-month" className="text-sm text-gray-400">
                            Month
                          </Label>
                          <Input
                            id="report-month"
                            type="month"
                            value={reportMonth}
                            onChange={(e) => setReportMonth(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                      </div>

                      {/* Report Preview */}
                      {selectedReportProperty && (
                        <div className="space-y-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold text-white mb-3">
                              Report Preview - {selectedReportProperty.name} ({reportMonth})
                            </h4>
                            
                            {(() => {
                              const reportData = generateMonthlyReportData(selectedReportProperty, reportMonth);
                              const { summary, workOrderGroups } = reportData;
                              
                              return (
                                <div className="space-y-4">
                                  {/* Summary Cards */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Total Spend</div>
                                        <div className="text-lg font-bold text-white">${summary.totalSpend.toFixed(2)}</div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Billable</div>
                                        <div className="text-lg font-bold text-green-400">${summary.billableSpend.toFixed(2)}</div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Non-Billable</div>
                                        <div className="text-lg font-bold text-gray-400">${summary.nonBillableSpend.toFixed(2)}</div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Transactions</div>
                                        <div className="text-lg font-bold text-blue-400">{summary.transactionCount}</div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Work Order Summary */}
                                  {workOrderGroups.length > 0 ? (
                                    <div>
                                      <h5 className="text-md font-semibold text-white mb-2">Work Orders with Expenses</h5>
                                      <div className="bg-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="bg-gray-800 border-b border-gray-600">
                                              <th className="text-left p-3 text-gray-300">Work Order</th>
                                              <th className="text-left p-3 text-gray-300">Technician</th>
                                              <th className="text-right p-3 text-gray-300">Total</th>
                                              <th className="text-right p-3 text-gray-300">Billable</th>
                                              <th className="text-right p-3 text-gray-300">Non-Billable</th>
                                              <th className="text-center p-3 text-gray-300">Transactions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {workOrderGroups.map(group => (
                                              <tr key={group.job.id} className="border-b border-gray-600/50">
                                                <td className="p-3 text-white">{group.job.description}</td>
                                                <td className="p-3 text-gray-300">{group.job.technician || 'Unassigned'}</td>
                                                <td className="p-3 text-right text-white">${group.totalAmount.toFixed(2)}</td>
                                                <td className="p-3 text-right text-green-400">${group.billableAmount.toFixed(2)}</td>
                                                <td className="p-3 text-right text-gray-400">${group.nonBillableAmount.toFixed(2)}</td>
                                                <td className="p-3 text-center text-blue-400">{group.transactionCount}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 text-gray-400">
                                      No expenses found for this property in {reportMonth}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMonthlyReportDialogOpen(false)}>
                        Cancel
                      </Button>
                      {selectedReportProperty && (
                        <Button 
                          onClick={() => {
                            const reportData = generateMonthlyReportData(selectedReportProperty, reportMonth);
                            exportMonthlyReportToCSV(reportData);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export to CSV
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Advanced Payment Tools Section */}
                <div className="mt-8 mb-32">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      🔧 Advanced Payment Tools
                    </h3>
                    <div className="text-sm text-gray-400">
                      Enhanced payment management features
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Link Accounts Card */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <LinkIcon className="h-5 w-5 text-blue-400" />
                            Link Accounts
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLinkAccountsExpanded(!linkAccountsExpanded)}
                            className="text-gray-400 hover:text-white"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${linkAccountsExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      <Collapsible open={linkAccountsExpanded}>
                        <CollapsibleContent>
                          <CardContent>
                            <div className="space-y-6">
                              {/* Property Manager Bank Account Section */}
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Property Manager Bank Account</h4>
                                <Button 
                                  className="bg-blue-600 hover:bg-blue-700 text-white mb-4"
                                  onClick={() => {
                                    // Mock functionality - show success message
                                    alert('Bank account linking initiated. You will be redirected to your bank\'s secure portal.');
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Link Property Manager Bank Account
                                </Button>
                                
                                {/* Current Bank Accounts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {bankAccountsState.map((account) => (
                                    <Card key={account.id} className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <div className="text-sm font-medium text-white">{account.name}</div>
                                            <div className="text-xs text-gray-400">{account.accountNumber}</div>
                                          </div>
                                          <Badge className={account.status === 'linked' ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                                            {account.status === 'linked' ? 'Linked' : 'Not Linked'}
                                          </Badge>
                                        </div>
                                        <div className="text-lg font-bold text-white mb-2">
                                          ${account.balance.toLocaleString()}
                                        </div>
                                        <div className="flex gap-2">
                                          {account.status === 'linked' ? (
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                                              onClick={() => handleLinkAccount(account, false)}
                                            >
                                              Unlink
                                            </Button>
                                          ) : (
                                            <Button 
                                              size="sm" 
                                              className="bg-blue-600 hover:bg-blue-700 text-white"
                                              onClick={() => handleLinkAccount(account, true)}
                                            >
                                              Link
                                            </Button>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              {/* Owner Trust Accounts Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-lg font-semibold text-white">Owner Trust Accounts</h4>
                                  <div className="text-sm text-gray-400">
                                    Auto-synced with Property Manager accounts
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  {trustAccountsState.map((trust) => (
                                    <div key={trust.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                                      <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${trust.status === 'linked' ? 'bg-green-400' : 'bg-gray-500'}`} />
                                        <div>
                                          <div className="text-white font-medium">{trust.propertyName}</div>
                                          <div className="text-sm text-gray-400">{trust.ownerName} • {trust.bankName} {trust.accountNumber}</div>
                                          {trust.status === 'linked' && trust.autoSync && (
                                            <div className="text-xs text-green-400 mt-1">
                                              🔄 Auto-sync enabled
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-white font-bold">${trust.balance.toLocaleString()}</div>
                                        <Badge className={trust.status === 'linked' ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                                          {trust.status === 'linked' ? 'Linked' : 'Not Linked'}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                                  <div className="text-sm text-blue-300">
                                    💡 Trust accounts automatically link/unlink when you connect matching Property Manager bank accounts
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>

                    {/* Credit Card Bills Dropdown */}
                    <Card className="bg-gray-800 border-gray-700">
                      <Collapsible open={creditCardBillsExpanded}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-blue-400" />
                              Credit Card Bills
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCreditCardBillsExpanded(!creditCardBillsExpanded)}
                              className="text-gray-400 hover:text-white"
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${creditCardBillsExpanded ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CollapsibleContent>
                          <CardContent>
                            <div className="space-y-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Credit Card Bills</h4>
                                <div className="text-sm text-gray-400">
                                  {creditCards.length} card{creditCards.length !== 1 ? 's' : ''} • Total: ${creditCards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {creditCards.map((card) => (
                                  <Card key={card.id} className="bg-gray-700 border-gray-600">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <div className="text-sm font-medium text-white">{card.name}</div>
                                          <div className="text-xs text-gray-400">****{card.lastFour}</div>
                                          <Badge className={card.type === 'internal' ? "bg-blue-600 text-white mt-1" : "bg-orange-600 text-white mt-1"}>
                                            {card.type === 'internal' ? 'Internal' : 'External'}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="text-lg font-bold text-white mb-2">
                                        ${card.balance.toFixed(2)}
                                      </div>
                                      <div className="text-xs text-gray-400 mb-3">
                                        Due: {card.dueDate}
                                      </div>
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                                        onClick={() => handlePayNow(card)}
                                      >
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Pay Now
                                      </Button>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>

                    {/* Pending Invoices Dropdown */}
                    <Card className="bg-gray-800 border-gray-700">
                      <Collapsible open={pendingInvoicesExpanded}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                              <FileText className="h-5 w-5 text-purple-400" />
                              Pending Invoices
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPendingInvoicesExpanded(!pendingInvoicesExpanded)}
                              className="text-gray-400 hover:text-white"
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${pendingInvoicesExpanded ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CollapsibleContent>
                          <CardContent>
                            <div className="space-y-6">
                              {/* Payment Type Toggle */}
                              <div className="flex items-center gap-4 mb-4">
                                <span className="text-white">Payment Type:</span>
                                <Tabs value={paymentType} onValueChange={(value) => setPaymentType(value as 'one-time' | 'installments')}>
                                  <TabsList className="bg-gray-700">
                                    <TabsTrigger value="one-time" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                      One-Time Payment
                                    </TabsTrigger>
                                    <TabsTrigger value="installments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                      Installments
                                    </TabsTrigger>
                                  </TabsList>
                                </Tabs>
                              </div>

                              {/* Invoices Table */}
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-lg font-semibold text-white">Pending Invoices</h4>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white"
                                      onClick={() => setSelectedInvoices(invoices.map(inv => inv.id))}
                                    >
                                      Select All
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-gray-400 border-gray-600 hover:bg-gray-600 hover:text-white"
                                      onClick={() => setSelectedInvoices([])}
                                    >
                                      Clear All
                                    </Button>
                                  </div>
                                </div>
                                <div className="bg-gray-700 rounded-lg overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-800 border-b border-gray-600">
                                        <th className="text-left p-3 text-gray-300">
                                          <input 
                                            type="checkbox" 
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setSelectedInvoices(invoices.map(inv => inv.id));
                                              } else {
                                                setSelectedInvoices([]);
                                              }
                                            }}
                                            className="rounded"
                                          />
                                        </th>
                                        <th className="text-left p-3 text-gray-300">Vendor</th>
                                        <th className="text-left p-3 text-gray-300">Amount</th>
                                        <th className="text-left p-3 text-gray-300">Due Date</th>
                                        <th className="text-left p-3 text-gray-300">Origin</th>
                                        <th className="text-left p-3 text-gray-300">Property</th>
                                        <th className="text-left p-3 text-gray-300">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-gray-600/50">
                                          <td className="p-3">
                                            <input 
                                              type="checkbox" 
                                              checked={selectedInvoices.includes(invoice.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedInvoices([...selectedInvoices, invoice.id]);
                                                } else {
                                                  setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                                                }
                                              }}
                                              className="rounded"
                                            />
                                          </td>
                                          <td className="p-3 text-white">{invoice.vendor}</td>
                                          <td className="p-3 text-white">${invoice.amount.toLocaleString()}</td>
                                          <td className="p-3 text-gray-300">{invoice.dueDate}</td>
                                          <td className="p-3">
                                            <Badge className={invoice.origin === 'Direct' ? "bg-blue-600 text-white" : "bg-green-600 text-white"}>
                                              {invoice.origin}
                                            </Badge>
                                          </td>
                                          <td className="p-3 text-gray-300">{invoice.propertyName}</td>
                                          <td className="p-3">
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white"
                                              onClick={() => handleViewExpense(invoice)}
                                            >
                                              View Expense
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Payment Actions for Invoices */}
                              {selectedInvoices.length > 0 && (
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                  <Collapsible open={paymentActionsExpanded}>
                                    <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
                                      <div>
                                        <div className="text-white font-medium flex items-center gap-2">
                                          <DollarSign className="h-4 w-4 text-green-400" />
                                          Payment Actions
                                        </div>
                                        <div className="text-sm text-blue-300">
                                          {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} selected • Total: ${invoices.filter(inv => selectedInvoices.includes(inv.id)).reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPaymentActionsExpanded(!paymentActionsExpanded)}
                                        className="text-gray-400 hover:text-white"
                                      >
                                        <ChevronDown className={`h-4 w-4 transition-transform ${paymentActionsExpanded ? 'rotate-180' : ''}`} />
                                      </Button>
                                    </div>
                                    
                                    <CollapsibleContent>
                                      <div className="p-4 space-y-4">
                                        {paymentType === 'one-time' ? (
                                          // One-time payment UI
                                          <div className="flex gap-2">
                                            <Select value={selectedBankAccount} onValueChange={(value) => {
                                              if (value === 'add-new-account') {
                                                setAddAccountDialogOpen(true);
                                              } else {
                                                setSelectedBankAccount(value);
                                              }
                                            }}>
                                              <SelectTrigger className="w-64 bg-gray-800 border-gray-600 text-white">
                                                <SelectValue placeholder="Select payment account" />
                                              </SelectTrigger>
                                              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                                <SelectGroup>
                                                  <SelectLabel className="text-blue-400 font-semibold">PM Accounts</SelectLabel>
                                                  {bankAccountsState.filter(acc => acc.status === 'linked' && acc.accountType === 'pm').map(account => (
                                                    <SelectItem key={account.id} value={account.id} className="text-white pl-6">
                                                      {account.name} (${account.balance?.toLocaleString() || '0'})
                                                    </SelectItem>
                                                  ))}
                                                </SelectGroup>
                                                <SelectGroup>
                                                  <SelectLabel className="text-green-400 font-semibold">Owner Accounts</SelectLabel>
                                                  {bankAccountsState.filter(acc => acc.status === 'linked' && acc.accountType === 'owner').map(account => (
                                                    <SelectItem key={account.id} value={account.id} className="text-white pl-6">
                                                      {account.name} (${account.balance?.toLocaleString() || '0'})
                                                    </SelectItem>
                                                  ))}
                                                </SelectGroup>
                                                <SelectItem value="add-new-account" className="text-blue-400 font-medium border-t border-gray-600 mt-1 pt-2">
                                                  + Add New Account
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <Button 
                                              className="bg-green-600 hover:bg-green-700 text-white"
                                              onClick={handleProcessPayment}
                                            >
                                              <DollarSign className="h-4 w-4 mr-2" />
                                              Process Payment{selectedInvoices.length > 1 ? 's' : ''}
                                            </Button>
                                          </div>
                                        ) : (
                                          // Installments payment UI
                                          <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-sm text-gray-400 mb-2 block">
                                                  Number of Installments
                                                </Label>
                                                <Select defaultValue="3">
                                                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                                    <SelectItem value="2" className="text-white">2 payments</SelectItem>
                                                    <SelectItem value="3" className="text-white">3 payments</SelectItem>
                                                    <SelectItem value="4" className="text-white">4 payments</SelectItem>
                                                    <SelectItem value="6" className="text-white">6 payments</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div>
                                                <Label className="text-sm text-gray-400 mb-2 block">
                                                  Payment Frequency
                                                </Label>
                                                <Select defaultValue="monthly">
                                                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                                    <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                                                    <SelectItem value="biweekly" className="text-white">Bi-weekly</SelectItem>
                                                    <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                            
                                            {/* Installment Schedule Preview */}
                                            <div className="bg-gray-800/50 rounded-lg p-3">
                                              <div className="text-sm font-medium text-white mb-2">Payment Schedule Preview</div>
                                              <div className="space-y-1 text-xs text-gray-300">
                                                {(() => {
                                                  const total = invoices.filter(inv => selectedInvoices.includes(inv.id)).reduce((sum, inv) => sum + inv.amount, 0);
                                                  const installmentAmount = total / 3;
                                                  return [
                                                    { date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toLocaleDateString(), amount: installmentAmount },
                                                    { date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), amount: installmentAmount },
                                                    { date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString(), amount: installmentAmount }
                                                  ].map((payment, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                      <span>Payment {idx + 1}: {payment.date}</span>
                                                      <span>${payment.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                                    </div>
                                                  ));
                                                })()}
                                              </div>
                                            </div>

                                            <div className="flex gap-2">
                                              <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                                                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                                                  <SelectValue placeholder="Select payment account" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                                  {bankAccountsState.filter(acc => acc.status === 'linked').map(account => (
                                                    <SelectItem key={account.id} value={account.id} className="text-white">
                                                      {account.name}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                              <Button 
                                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                                onClick={handleProcessPayment}
                                              >
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Setup Installment Plan
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>

                    {/* Reimburse Personal Expenses Card */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            🔁 Reimburse Team Members
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReimburseExpensesExpanded(!reimburseExpensesExpanded)}
                            className="text-gray-400 hover:text-white"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${reimburseExpensesExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      <Collapsible open={reimburseExpensesExpanded}>
                        <CollapsibleContent>
                          <CardContent>
                            <div className="space-y-6">
                              {/* Team Member Selection */}
                              <div>
                                <Label htmlFor="team-member" className="text-sm text-gray-400 mb-2 block">
                                  Select Team Member
                                </Label>
                                <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Choose a team member" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                    {teamMembers.map(member => (
                                      <SelectItem key={member.id} value={member.id} className="text-white">
                                        {member.name} - {member.role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Personal Expenses Table */}
                              {selectedTeamMember && (() => {
                                const member = teamMembers.find(m => m.id === selectedTeamMember);
                                if (!member) return null;
                                
                                return (
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="text-lg font-semibold text-white">
                                        Personal Expenses - {member.name}
                                      </h4>
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="text-green-400 border-green-600 hover:bg-green-600 hover:text-white"
                                          onClick={() => setSelectedPersonalExpenses(member.personalExpenses.map(exp => exp.id))}
                                        >
                                          Select All
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="text-gray-400 border-gray-600 hover:bg-gray-600 hover:text-white"
                                          onClick={() => setSelectedPersonalExpenses([])}
                                        >
                                          Clear All
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="bg-gray-700 rounded-lg overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-gray-800 border-b border-gray-600">
                                            <th className="text-left p-3 text-gray-300">
                                              <input 
                                                type="checkbox" 
                                                onChange={(e) => {
                                                  if (e.target.checked) {
                                                    setSelectedPersonalExpenses(member.personalExpenses.map(exp => exp.id));
                                                  } else {
                                                    setSelectedPersonalExpenses([]);
                                                  }
                                                }}
                                                className="rounded"
                                              />
                                            </th>
                                            <th className="text-left p-3 text-gray-300">Date</th>
                                            <th className="text-left p-3 text-gray-300">Vendor</th>
                                            <th className="text-left p-3 text-gray-300">Description</th>
                                            <th className="text-left p-3 text-gray-300">Property</th>
                                            <th className="text-left p-3 text-gray-300">GL Code</th>
                                            <th className="text-left p-3 text-gray-300">Amount</th>
                                            <th className="text-left p-3 text-gray-300">Receipt</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {member.personalExpenses.map((expense) => (
                                            <tr key={expense.id} className="border-b border-gray-600/50">
                                              <td className="p-3">
                                                <input 
                                                  type="checkbox" 
                                                  checked={selectedPersonalExpenses.includes(expense.id)}
                                                  onChange={(e) => {
                                                    if (e.target.checked) {
                                                      setSelectedPersonalExpenses([...selectedPersonalExpenses, expense.id]);
                                                    } else {
                                                      setSelectedPersonalExpenses(selectedPersonalExpenses.filter(id => id !== expense.id));
                                                    }
                                                  }}
                                                  className="rounded"
                                                />
                                              </td>
                                              <td className="p-3 text-gray-300">{expense.date}</td>
                                              <td className="p-3 text-white">{expense.vendor}</td>
                                              <td className="p-3 text-gray-300">{expense.description}</td>
                                              <td className="p-3 text-gray-300">{expense.propertyName}</td>
                                              <td className="p-3">
                                                <div className="text-blue-300">505.3</div>
                                                <div className="text-xs text-blue-200">Maintenance Supplies</div>
                                              </td>
                                              <td className="p-3 text-white">${expense.amount.toFixed(2)}</td>
                                              <td className="p-3">
                                                {expense.receipt ? (
                                                  <Badge className="bg-green-600 text-white">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Yes
                                                  </Badge>
                                                ) : (
                                                  <Badge className="bg-red-600 text-white">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    No
                                                  </Badge>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Reimbursement Actions */}
                              {selectedPersonalExpenses.length > 0 && selectedTeamMember && (() => {
                                const member = teamMembers.find(m => m.id === selectedTeamMember);
                                const selectedExpenses = member?.personalExpenses.filter(exp => selectedPersonalExpenses.includes(exp.id)) || [];
                                const totalAmount = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                                
                                return (
                                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="text-white font-medium">
                                            {selectedPersonalExpenses.length} expense{selectedPersonalExpenses.length !== 1 ? 's' : ''} selected for {member?.name}
                                          </div>
                                          <div className="text-sm text-green-300">
                                            Total: ${totalAmount.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                          <Label htmlFor="reimbursement-account" className="text-sm text-gray-400 mb-2 block">
                                            Payment Account
                                          </Label>
                                          <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                              <SelectValue placeholder="Select bank account" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                              {bankAccountsState.filter(acc => acc.status === 'linked').map(account => (
                                                <SelectItem key={account.id} value={account.id} className="text-white">
                                                  {account.name} ({account.type})
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        <Button 
                                          className="bg-green-600 hover:bg-green-700 text-white mt-6"
                                          onClick={handleReviewReimburse}
                                        >
                                          <User className="h-4 w-4 mr-2" />
                                          Review & Reimburse
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  </div>

                  {/* Dialog Components for Advanced Payment Tools */}
                  
                  {/* Link Account Dialog */}
                  <Dialog open={linkAccountDialogOpen} onOpenChange={setLinkAccountDialogOpen}>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedAccountForLinking?.actionType === 'link' ? 'Link Bank Account' : 'Unlink Bank Account'}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedAccountForLinking?.actionType === 'link' 
                            ? 'Confirm linking this bank account for payments and reimbursements.'
                            : 'Are you sure you want to unlink this bank account? This will affect payment processing.'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedAccountForLinking && (
                        <div className="py-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-white font-medium">{selectedAccountForLinking.name}</div>
                            <div className="text-gray-400 text-sm">{selectedAccountForLinking.accountNumber}</div>
                            <div className="text-white text-lg font-bold mt-2">
                              ${selectedAccountForLinking.balance?.toLocaleString()}
                            </div>
                          </div>
                          
                          {selectedAccountForLinking.actionType === 'link' && (
                            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                              <div className="text-sm text-blue-300">
                                💡 Linking this account will automatically sync related owner trust accounts
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkAccountDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={confirmLinkAccount}
                          className={selectedAccountForLinking?.actionType === 'link' 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-red-600 hover:bg-red-700"}
                        >
                          {selectedAccountForLinking?.actionType === 'link' ? 'Link Account' : 'Unlink Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Add Account Dialog */}
                  <Dialog open={addAccountDialogOpen} onOpenChange={setAddAccountDialogOpen}>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Payment Account</DialogTitle>
                        <DialogDescription>
                          Add a new bank account for processing payments
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">Account Name</Label>
                          <Input 
                            placeholder="e.g., Wells Fargo Business Checking"
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">Account Type</Label>
                          <Select defaultValue="pm">
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="pm" className="text-white">PM Account</SelectItem>
                              <SelectItem value="owner" className="text-white">Owner Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">Bank Type</Label>
                          <Select defaultValue="checking">
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="checking" className="text-white">Checking</SelectItem>
                              <SelectItem value="savings" className="text-white">Savings</SelectItem>
                              <SelectItem value="trust" className="text-white">Trust Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">Account Number</Label>
                          <Input 
                            placeholder="Account number"
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">Routing Number</Label>
                          <Input 
                            placeholder="Routing number"
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                          <div className="text-sm text-blue-300">
                            💡 New accounts will need verification before they can be used for payments
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddAccountDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => {
                            // Add logic to create new account here
                            setAddAccountDialogOpen(false);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Expense Details Dialog */}
                  <Dialog open={expenseDetailsDialogOpen} onOpenChange={setExpenseDetailsDialogOpen}>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Expense Details</DialogTitle>
                        <DialogDescription>
                          Review expense information and related records
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedExpenseForView && (
                        <div className="space-y-4">
                          {/* GL Code and Property Info Header */}
                          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-semibold text-white">
                                  {selectedExpenseForView.glCode} - {selectedExpenseForView.description}
                                </div>
                                <div className="text-blue-300 text-sm">
                                  Property: {selectedExpenseForView.property}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-400">Priority</div>
                                <Badge className={selectedExpenseForView.expenseDetails?.priority === 'High' ? 'bg-red-600' : 'bg-gray-600'}>
                                  {selectedExpenseForView.expenseDetails?.priority || 'Normal'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <div className="text-sm text-gray-400">Invoice Details</div>
                                <div className="text-white font-medium">{selectedExpenseForView.vendor}</div>
                                <div className="text-lg font-bold text-white">
                                  ${selectedExpenseForView.amount?.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-400">Due: {selectedExpenseForView.dueDate}</div>
                                <div className="text-sm text-gray-400">Invoice: {selectedExpenseForView.invoiceNumber}</div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <div className="text-sm text-gray-400">Expense Record</div>
                                <div className="text-white font-medium">{selectedExpenseForView.expenseDetails?.category}</div>
                                <div className="text-sm text-gray-400">Submitted by: {selectedExpenseForView.expenseDetails?.submittedBy}</div>
                                <div className="text-sm text-gray-400">Date: {selectedExpenseForView.expenseDetails?.submittedDate}</div>
                                <Badge className="bg-green-600 text-white mt-2">
                                  {selectedExpenseForView.expenseDetails?.approvalStatus}
                                </Badge>
                              </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <div className="text-sm text-gray-400">Budget Analysis</div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-xs">PTD Actual:</span>
                                    <span className="text-white text-xs">${selectedExpenseForView.ptdActual?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-xs">PTD Budget:</span>
                                    <span className="text-white text-xs">${selectedExpenseForView.ptdBudget?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-xs">Variance:</span>
                                    <span className={`text-xs ${
                                      (selectedExpenseForView.ptdActual - selectedExpenseForView.ptdBudget) >= 0 ? 'text-red-400' : 'text-green-400'
                                    }`}>
                                      ${Math.abs(selectedExpenseForView.ptdActual - selectedExpenseForView.ptdBudget).toLocaleString()}
                                      {(selectedExpenseForView.ptdActual - selectedExpenseForView.ptdBudget) >= 0 ? ' over' : ' under'}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Approval Details */}
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-2">Approval Details</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-gray-400">Approved by:</div>
                                <div className="text-white">{selectedExpenseForView.expenseDetails?.approvedBy}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400">Approved on:</div>
                                <div className="text-white">{selectedExpenseForView.expenseDetails?.approvedDate}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-2">Description & Notes</div>
                            <div className="text-white mb-3">{selectedExpenseForView.description}</div>
                            
                            {selectedExpenseForView.expenseDetails?.notes && (
                              <>
                                <div className="text-sm text-gray-400 mb-2">PM Notes</div>
                                <div className="text-gray-300 text-sm bg-gray-700 p-3 rounded">{selectedExpenseForView.expenseDetails.notes}</div>
                              </>
                            )}
                          </div>

                          {/* Attachments */}
                          {selectedExpenseForView.expenseDetails?.attachments && (
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <div className="text-sm text-gray-400 mb-2">Attachments</div>
                              <div className="space-y-1">
                                {selectedExpenseForView.expenseDetails.attachments.map((attachment: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 cursor-pointer">
                                    <Receipt className="h-3 w-3" />
                                    {attachment}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white"
                              onClick={() => {
                                // Open receipt in new tab
                                window.open(selectedExpenseForView.receiptUrl, '_blank');
                              }}
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              View Receipt
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-green-400 border-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => {
                                // Navigate to work order page
                                if (selectedExpenseForView.workOrderId) {
                                  router.push(`/workorders/${selectedExpenseForView.workOrderId}?role=centralOffice`);
                                }
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Work Order
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setExpenseDetailsDialogOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Pay Now Dialog */}
                  <Dialog open={payNowDialogOpen} onOpenChange={setPayNowDialogOpen}>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Pay Credit Card Bill</DialogTitle>
                        <DialogDescription>
                          Confirm payment for this credit card bill
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedCardForPayment && (
                        <div className="space-y-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-white font-medium">{selectedCardForPayment.name}</div>
                            <div className="text-gray-400 text-sm">****{selectedCardForPayment.lastFour}</div>
                            <div className="text-2xl font-bold text-white mt-2">
                              ${selectedCardForPayment.balance?.toFixed(2)}
                            </div>
                            <div className="text-red-400 text-sm">Due: {selectedCardForPayment.dueDate}</div>
                          </div>
                          
                          <div>
                            <Label htmlFor="payment-account" className="text-sm text-gray-400 mb-2 block">
                              Payment Account
                            </Label>
                            <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue placeholder="Select payment account" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                {bankAccountsState.filter(acc => acc.status === 'linked').map(account => (
                                  <SelectItem key={account.id} value={account.id} className="text-white">
                                    {account.name} - ${account.balance.toLocaleString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                            <div className="text-sm text-green-300">
                              ✅ Payment will be processed immediately and reflected in your account within 1-2 business days
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPayNowDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setPayNowDialogOpen(false);
                            alert('Payment processed successfully!');
                          }}
                          disabled={!selectedBankAccount}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Confirm Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Process Payment Dialog */}
                  <Dialog open={processPaymentDialogOpen} onOpenChange={setProcessPaymentDialogOpen}>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Process Invoice Payments</DialogTitle>
                        <DialogDescription>
                          Review and confirm payment for selected invoices
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="text-white font-medium mb-2">Payment Summary</div>
                          <div className="text-2xl font-bold text-white">
                            ${invoices.filter(inv => selectedInvoices.includes(inv.id)).reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} • {paymentType} payment
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-700">
                                <th className="text-left p-3 text-gray-300">Vendor</th>
                                <th className="text-left p-3 text-gray-300">Amount</th>
                                <th className="text-left p-3 text-gray-300">Due Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoices.filter(inv => selectedInvoices.includes(inv.id)).map(invoice => (
                                <tr key={invoice.id} className="border-b border-gray-600/50">
                                  <td className="p-3 text-white">{invoice.vendor}</td>
                                  <td className="p-3 text-white">${invoice.amount.toLocaleString()}</td>
                                  <td className="p-3 text-gray-300">{invoice.dueDate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div>
                          <Label htmlFor="payment-account" className="text-sm text-gray-400 mb-2 block">
                            Payment Account
                          </Label>
                          <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue placeholder="Select payment account" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 z-50">
                              {bankAccountsState.filter(acc => acc.status === 'linked').map(account => (
                                <SelectItem key={account.id} value={account.id} className="text-white">
                                  {account.name} - ${account.balance.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setProcessPaymentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setProcessPaymentDialogOpen(false);
                            setSelectedInvoices([]);
                            alert(`Successfully processed ${selectedInvoices.length} payment${selectedInvoices.length !== 1 ? 's' : ''}!`);
                          }}
                          disabled={!selectedBankAccount}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Process Payment{selectedInvoices.length > 1 ? 's' : ''}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Reimbursement Review Dialog */}
                  <Dialog open={reimbursementReviewDialogOpen} onOpenChange={setReimbursementReviewDialogOpen}>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review Reimbursement</DialogTitle>
                        <DialogDescription>
                          Confirm reimbursement for team member expenses
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedTeamMember && (() => {
                        const member = teamMembers.find(m => m.id === selectedTeamMember);
                        const selectedExpenses = member?.personalExpenses.filter(exp => selectedPersonalExpenses.includes(exp.id)) || [];
                        const totalAmount = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                        
                        return (
                          <div className="space-y-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <div className="text-white font-medium">{member?.name}</div>
                              <div className="text-gray-400 text-sm">{member?.role} • {member?.email}</div>
                              <div className="text-2xl font-bold text-white mt-2">
                                ${totalAmount.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {selectedExpenses.length} expense{selectedExpenses.length !== 1 ? 's' : ''} selected
                              </div>
                            </div>
                            
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-700">
                                    <th className="text-left p-3 text-gray-300">Date</th>
                                    <th className="text-left p-3 text-gray-300">Vendor</th>
                                    <th className="text-left p-3 text-gray-300">Amount</th>
                                    <th className="text-left p-3 text-gray-300">Property</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedExpenses.map(expense => (
                                    <tr key={expense.id} className="border-b border-gray-600/50">
                                      <td className="p-3 text-gray-300">{expense.date}</td>
                                      <td className="p-3 text-white">{expense.vendor}</td>
                                      <td className="p-3 text-white">${expense.amount.toFixed(2)}</td>
                                      <td className="p-3 text-gray-300">{expense.propertyName}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div>
                              <Label htmlFor="reimbursement-account" className="text-sm text-gray-400 mb-2 block">
                                Payment Account
                              </Label>
                              <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                  <SelectValue placeholder="Select payment account" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                  {bankAccountsState.filter(acc => acc.status === 'linked').map(account => (
                                    <SelectItem key={account.id} value={account.id} className="text-white">
                                      {account.name} - ${account.balance.toLocaleString()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                              <div className="text-sm text-blue-300">
                                💡 Reimbursement will be processed via ACH and typically takes 1-3 business days
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setReimbursementReviewDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setReimbursementReviewDialogOpen(false);
                            setSelectedPersonalExpenses([]);
                            setSelectedTeamMember('');
                            alert('Reimbursement processed successfully!');
                          }}
                          disabled={!selectedBankAccount}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Process Reimbursement
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Export Reports Section */}

                </div>
              </>
            )}
            {activeTab === "wallet" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {role === 'technician' ? `Active Cards for ${technicianName}` : 'Active Cards'}
                    </h3>
                    {role === 'pm' && (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        onClick={() => setHelpRequestDialogOpen(true)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Ask Central Office
                      </Button>
                    )}
                  </div>
                  {/* Filters for job and property */}
                  <div className="flex gap-6 overflow-x-auto pb-2">
                    {role === 'technician' ? (
                      technicianCards.map((card, idx) => {
                        // Mock card data for demo
                        const brand = idx % 2 === 0 ? "Amex" : "Chase";
                        const brandColor = brand === "Amex" ? "from-cyan-700 to-blue-900" : "from-indigo-700 to-purple-900";
                        const available = card.balance;
                        const limit = 5000;
                        const percent = Math.min(100, Math.round((available / limit) * 100));
                        return (
                          <div key={card.id} className={`relative w-80 h-48 rounded-2xl shadow-xl bg-gradient-to-br ${brandColor} p-6 flex flex-col justify-between text-white`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-lg font-bold tracking-wide">{brand}</span>
                              <CreditCard className="h-7 w-7 text-white/80" />
                            </div>
                            <div className="text-2xl font-mono tracking-widest mb-2">{card.number}</div>
                            <div className="flex justify-between text-xs mb-2">
                              <span>Exp: 12/26</span>
                              <span>Limit: ${limit.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs mb-1">
                              <span>Available: <span className="font-semibold">${available.toLocaleString()}</span></span>
                              <span className="text-white/70">{technicianName}</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                              <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // PM specific cards
                      [
                        {
                          id: 'amex-1122',
                          brand: 'Amex',
                          number: '**** 1122',
                          available: 1200,
                          limit: 5000,
                          holder: 'Alice Johnson'
                        },
                        {
                          id: 'chase-3344',
                          brand: 'Chase',
                          number: '**** 3344',
                          available: 800,
                          limit: 5000,
                          holder: 'Alice Johnson'
                        }
                      ].map((card) => {
                        const brandColor = card.brand === "Amex" ? "from-cyan-700 to-blue-900" : "from-indigo-700 to-purple-900";
                        const percent = Math.min(100, Math.round((card.available / card.limit) * 100));
                        return (
                          <div key={card.id} className={`relative w-80 h-48 rounded-2xl shadow-xl bg-gradient-to-br ${brandColor} p-6 flex flex-col justify-between text-white`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-lg font-bold tracking-wide">{card.brand}</span>
                              <CreditCard className="h-7 w-7 text-white/80" />
                            </div>
                            <div className="text-2xl font-mono tracking-widest mb-2">{card.number}</div>
                            <div className="flex justify-between text-xs mb-2">
                              <span>Exp: 12/26</span>
                              <span>Limit: ${card.limit.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs mb-1">
                              <span>Available: <span className="font-semibold">${card.available.toLocaleString()}</span></span>
                              <span className="text-white/70">{card.holder}</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                              <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                              </div>
                        </div>

                {/* Uncategorized / Needs Review Table */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Uncategorized / Needs Review</h3>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setNewExpenseDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Vendor</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Invoice #</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Due Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">GL Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Documents</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterExpensesByRole([...transactions, ...technicianTransactions])
                          .filter(txn => txn.status === 'pending' || !txn.jobId)
                          .sort((a, b) => {
                            // Sort credit cards first, then invoices
                            const aType = a.expenseType || 'credit_card';
                            const bType = b.expenseType || 'credit_card';
                            if (aType === 'credit_card' && bType === 'invoice') return -1;
                            if (aType === 'invoice' && bType === 'credit_card') return 1;
                            // Within same type, sort by date (newest first)
                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                          })
                          .map((txn, idx) => {
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            const isEditing = inlineEditingExpense === txn.id;
                            
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4">
                                  <Badge className={`rounded-md px-2 py-1 text-xs font-medium ${(txn.expenseType || 'credit_card') === 'invoice' ? 'bg-purple-600/90 text-purple-100 border border-purple-500/50' : 'bg-blue-600/90 text-blue-100 border border-blue-500/50'}`}>
                                    {(txn.expenseType || 'credit_card') === 'invoice' ? 'Invoice' : 'Credit Card'}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.expenseType === 'invoice' ? (txn.invoiceNumber || '-') : '-'}
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.expenseType === 'invoice' ? (txn.dueDate || '-') : '-'}
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.property} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, property: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Property" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        {properties.map(property => (
                                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                                            {property.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-gray-300">{property ? property.name : 'Not Assigned'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.job} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, job: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Job" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="none" className="bg-gray-900 text-white">No job assigned</SelectItem>
                                        {jobs.map(job => (
                                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                                            {job.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    job ? (
                                      <button
                                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                        onClick={() => router.push(`/workorders/${job.id}?role=${role}&returnTo=wallet`)}
                                      >
                                        {job.description}
                                      </button>
                                    ) : (
                                      <span className="text-gray-300">Not Assigned</span>
                                    )
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-blue-300">522.1</div>
                                  <div className="text-xs text-blue-200">HVAC Repairs</div>
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={inlineExpenseForm.billable ? 'yes' : 'no'}
                                      onValueChange={value => setInlineExpenseForm(prev => ({ ...prev, billable: value === 'yes' }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                                        <SelectValue placeholder="Billable" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                      {txn.billable ? 'Yes' : 'No'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Input
                                      className="bg-gray-700 border-gray-600 text-white w-32 text-xs"
                                      placeholder="Memo"
                                      value={inlineExpenseForm.memo}
                                      onChange={e => setInlineExpenseForm(prev => ({ ...prev, memo: e.target.value }))}
                                    />
                                  ) : (
                                    <span className="text-gray-300">{txn.memo || '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setInlineExpenseForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                                          }}
                                        />
                                        <Paperclip className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                                      </label>
                                      {inlineExpenseForm.receipt && (
                                        <span className="text-xs text-green-400">{inlineExpenseForm.receipt}</span>
                                      )}
                                  </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      {txn.expenseType === 'invoice' && txn.supportingDocs ? (
                                        <div className="flex items-center gap-1">
                                          <FileText className="h-4 w-4 text-blue-400" />
                                          <span className="text-xs text-gray-400">{txn.supportingDocs.length}</span>
                                        </div>
                                      ) : txn.receipt ? (
                                        <FileText className="h-4 w-4 text-blue-400" />
                                      ) : (
                                        <span className="text-gray-300">-</span>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {txn.expenseType === 'invoice' && txn.flaggedForApproval ? (
                                    <div className="flex items-center gap-2">
                                      <Flag className="h-4 w-4 text-orange-400" />
                                      <Badge className="bg-orange-600/90 text-orange-100 border border-orange-500/50 text-xs rounded-md px-2 py-1 font-medium">
                                        Flagged to {txn.flaggedTo === 'co' ? 'CO' : 'Owner'}
                                      </Badge>
                                    </div>
                                  ) : (
                                    <Badge className={`text-white text-xs ${txn.status === 'reconciled' ? 'bg-green-600' : 'bg-gray-600'}`}>
                                      {txn.status === 'reconciled' ? 'Reconciled' : 'Pending'}
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!inlineExpenseForm.property || !inlineExpenseForm.memo || !inlineExpenseForm.receipt}
                                        onClick={() => {
                                          if (inlineExpenseForm.property && inlineExpenseForm.memo && inlineExpenseForm.receipt) {
                                            // Update the transaction
                                            const updatedTxn = {
                                              ...txn,
                                              status: 'reconciled' as const,
                                              jobId: inlineExpenseForm.job === 'none' ? '' : inlineExpenseForm.job,
                                              memo: inlineExpenseForm.memo,
                                              receipt: inlineExpenseForm.receipt
                                            };
                                            
                                            setTransactions(prev => 
                                              prev.map(t => t.id === txn.id ? updatedTxn : t)
                                            );
                                            
                                            setInlineEditingExpense(null);
                                            setInlineExpenseForm({
                                              property: '',
                                              job: '',
                                              billable: true,
                                              memo: '',
                                              receipt: ''
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        onClick={() => {
                                          setInlineEditingExpense(null);
                                          setInlineExpenseForm({
                                            property: '',
                                            job: '',
                                            billable: true,
                                            memo: '',
                                            receipt: ''
                                          });
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                  </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-600/20"
                                              onClick={() => {
                                                setInlineEditingExpense(txn.id);
                                                setInlineExpenseForm({
                                                  property: property ? property.name : '',
                                                  job: job ? job.id : '',
                                                  billable: txn.billable,
                                                  memo: txn.memo || '',
                                                  receipt: ''
                                                });
                                              }}
                                            >
                                              <CheckCircle className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Categorize expense</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      
                                      {txn.expenseType === 'invoice' && (
                                        <>
                                          {!txn.flaggedForApproval && (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 border-orange-600 text-orange-400 hover:bg-orange-600/20"
                                                    onClick={() => {
                                                      setSelectedInvoiceForFlagging(txn);
                                                      setFlagInvoiceDialogOpen(true);
                                                    }}
                                                  >
                                                    <Flag className="h-3 w-3" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>Flag for approval</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          )}
                                          {role === 'pm' && (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 border-green-600 text-green-400 hover:bg-green-600/20"
                                                    onClick={() => {
                                                      setSelectedInvoiceForPing(txn);
                                                      setPingPaymentDialogOpen(true);
                                                    }}
                                                  >
                                                    <DollarSign className="h-3 w-3" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>Ping for payment</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                                </div>
                </div>

                {/* Completed Expenses Table */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Completed Expenses</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Vendor</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Invoice #</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Due Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">GL Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Documents</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterExpensesByRole([...transactions, ...technicianTransactions])
                          .filter(txn => txn.status === 'reconciled' && (txn.jobId || txnAssignments[txn.id]?.job))
                          .sort((a, b) => {
                            // Sort credit cards first, then invoices
                            const aType = a.expenseType || 'credit_card';
                            const bType = b.expenseType || 'credit_card';
                            if (aType === 'credit_card' && bType === 'invoice') return -1;
                            if (aType === 'invoice' && bType === 'credit_card') return 1;
                            // Within same type, sort by date (newest first)
                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                          })
                          .map((txn, idx) => {
                            const assignment = txnAssignments[txn.id] || {};
                            const memo = txnMemos[txn.id] || '';
                            const receipt = txnReceipts[txn.id] || null;
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            const isEditing = editingExpense && editingExpense.id === txn.id;
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4">
                                  <Badge className={`rounded-md px-2 py-1 text-xs font-medium ${(txn.expenseType || 'credit_card') === 'invoice' ? 'bg-purple-600/90 text-purple-100 border border-purple-500/50' : 'bg-blue-600/90 text-blue-100 border border-blue-500/50'}`}>
                                    {(txn.expenseType || 'credit_card') === 'invoice' ? 'Invoice' : 'Credit Card'}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.expenseType === 'invoice' ? (txn.invoiceNumber || '-') : '-'}
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.expenseType === 'invoice' ? (txn.dueDate || '-') : '-'}
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={expenseForm.property}
                                      onValueChange={value => setExpenseForm(prev => ({ ...prev, property: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Property" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        {properties.map(property => (
                                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                                            {property.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    assignment.property || (property ? property.name : 'Not Assigned')
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={expenseForm.job}
                                      onValueChange={value => setExpenseForm(prev => ({ ...prev, job: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Job" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="none" className="bg-gray-900 text-white">No job assigned</SelectItem>
                                        {jobs.map(job => (
                                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                                            {job.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    assignment.job ? (
                                      <button
                                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                        onClick={() => window.location.href = `/workorders/${assignment.job}?role=${role}&returnTo=expenses`}
                                      >
                                        {jobs.find(j => j.id === assignment.job)?.description || assignment.job}
                                      </button>
                                    ) : (job ? (
                                      <button
                                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                        onClick={() => window.location.href = `/workorders/${job.id}?role=${role}&returnTo=expenses`}
                                      >
                                        {job.description}
                                      </button>
                                    ) : 'Not Assigned')
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-blue-300">522.1</div>
                                  <div className="text-xs text-blue-200">HVAC Repairs</div>
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={expenseForm.billable ? 'yes' : 'no'}
                                      onValueChange={value => setExpenseForm(prev => ({ ...prev, billable: value === 'yes' }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                                        <SelectValue placeholder="Billable" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                      {txn.billable ? 'Yes' : 'No'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Input
                                      className="bg-gray-700 border-gray-600 text-white w-32 text-xs"
                                      placeholder="Memo"
                                      value={expenseForm.memo}
                                      onChange={e => setExpenseForm(prev => ({ ...prev, memo: e.target.value }))}
                                    />
                                  ) : (
                                    txn.memo || '-'
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setExpenseForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                                          }}
                                        />
                                        <Paperclip className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                                      </label>
                                      {expenseForm.receipt && (
                                        <span className="text-xs text-green-400">{expenseForm.receipt}</span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      {txn.expenseType === 'invoice' && txn.supportingDocs ? (
                                        <div className="flex items-center gap-1">
                                          <FileText className="h-4 w-4 text-blue-400" />
                                          <span className="text-xs text-gray-400">{txn.supportingDocs.length}</span>
                                        </div>
                                      ) : txn.receipt ? (
                                        <FileText className="h-4 w-4 text-blue-400" />
                                      ) : (
                                        <span className="text-gray-300">-</span>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {txn.expenseType === 'invoice' && txn.flaggedForApproval ? (
                                    <div className="flex items-center gap-2">
                                      <Flag className="h-4 w-4 text-orange-400" />
                                      <Badge className="bg-orange-600/90 text-orange-100 border border-orange-500/50 text-xs rounded-md px-2 py-1 font-medium">
                                        Flagged to {txn.flaggedTo === 'co' ? 'CO' : 'Owner'}
                                      </Badge>
                                    </div>
                                  ) : (
                                    <Badge className={`text-white text-xs ${txn.status === 'reconciled' ? 'bg-green-600' : 'bg-gray-600'}`}>
                                      {txn.status === 'reconciled' ? 'Reconciled' : 'Pending'}
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!expenseForm.property || !expenseForm.memo || !expenseForm.receipt}
                                        onClick={() => {
                                          if (expenseForm.property && expenseForm.memo && expenseForm.receipt) {
                                            const updatedTxn = {
                                              ...txn,
                                              jobId: expenseForm.job === 'none' ? '' : expenseForm.job,
                                              billable: expenseForm.billable,
                                              memo: expenseForm.memo,
                                              receipt: expenseForm.receipt,
                                              status: 'reconciled' as const // ensure status is valid and typed
                                            };
                                            setTransactions(prev => prev.map(t => t.id === txn.id ? updatedTxn : t));
                                            setEditingExpense(null);
                                            setExpenseForm({
                                              property: '',
                                              job: '',
                                              billable: true,
                                              memo: '',
                                              receipt: ''
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        onClick={() => {
                                          setEditingExpense(null);
                                          setExpenseForm({
                                            property: '',
                                            job: '',
                                            billable: true,
                                            memo: '',
                                            receipt: ''
                                          });
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                            </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-600/20"
                                              onClick={() => {
                                                setEditingExpense(txn as Transaction);
                                                setExpenseForm({
                                                  property: assignment.property || (property ? property.name : ''),
                                                  job: assignment.job || (job ? job.id : ''),
                                                  billable: txn.billable,
                                                  memo: txn.memo || '',
                                                  receipt: txn.receipt || ''
                                                });
                                              }}
                                            >
                                              <Pencil className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Edit expense details</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      
                                      {txn.expenseType === 'invoice' && role === 'pm' && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 border-green-600 text-green-400 hover:bg-green-600/20"
                                                onClick={() => {
                                                  setSelectedInvoiceForPing(txn as Transaction);
                                                  setPingPaymentDialogOpen(true);
                                                }}
                                              >
                                                <DollarSign className="h-3 w-3" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Ping for payment</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                        </div>
                        </div>


              </>
            )}
            {activeTab === "technicianExpenses" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white mb-4">My Expenses - {technicianName}</h3>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      onClick={() => setHelpRequestDialogOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Ask Central Office
                    </Button>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-2">
                    {technicianCards.map((card, idx) => {
                      // Mock card data for demo
                      const brand = idx % 2 === 0 ? "Amex" : "Chase";
                      const brandColor = brand === "Amex" ? "from-cyan-700 to-blue-900" : "from-indigo-700 to-purple-900";
                      const available = card.balance;
                      const limit = 5000;
                      const percent = Math.min(100, Math.round((available / limit) * 100));
                      return (
                        <div key={card.id} className={`relative w-80 h-48 rounded-2xl shadow-xl bg-gradient-to-br ${brandColor} p-6 flex flex-col justify-between text-white`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold tracking-wide">{brand}</span>
                            <CreditCard className="h-7 w-7 text-white/80" />
                          </div>
                          <div className="text-2xl font-mono tracking-widest mb-2">{card.number}</div>
                          <div className="flex justify-between text-xs mb-2">
                            <span>Exp: 12/26</span>
                            <span>Limit: ${limit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-end text-xs mb-1">
                            <span>Available: <span className="font-semibold">${available.toLocaleString()}</span></span>
                            <span className="text-white/70">{technicianName}</span>
                          </div>
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                            <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* My Completed Expenses Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">My Completed Expenses</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">GL Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...transactions, ...technicianTransactions]
                          .filter(txn => txn.cardHolder === technicianName && txn.status === 'reconciled' && (txn.jobId || txnAssignments[txn.id]?.job))
                          .sort((a, b) => {
                            // Sort credit cards first, then invoices
                            const aType = a.expenseType || 'credit_card';
                            const bType = b.expenseType || 'credit_card';
                            if (aType === 'credit_card' && bType === 'invoice') return -1;
                            if (aType === 'invoice' && bType === 'credit_card') return 1;
                            // Within same type, sort by date (newest first)
                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                          })
                          .map((txn, idx) => {
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4 text-gray-300">{property ? property.name : 'Not Assigned'}</td>
                                <td className="py-3 px-4">
                                  {job ? (
                                    <button
                                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                      onClick={() => router.push(`/workorders/${job.id}?role=${role}&returnTo=technicianExpenses`)}
                                    >
                                      {job.description}
                                    </button>
                                  ) : (
                                    <span className="text-gray-300">Not Assigned</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-blue-300">505.3</div>
                                  <div className="text-xs text-blue-200">Maintenance Supplies</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                    {txn.billable ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.memo || '-'}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.receipt ? <FileText className="h-4 w-4 text-blue-400" /> : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-500/20"
                                    onClick={() => {
                                      setSelectedTransaction(txn as Transaction);
                                      setTransactionDetailsOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* My Pending Expenses Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">My Pending Expenses</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">GL Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...transactions, ...technicianTransactions]
                          .filter(txn => txn.cardHolder === technicianName && (txn.status === 'pending' || !txn.jobId))
                          .sort((a, b) => {
                            // Sort credit cards first, then invoices
                            const aType = a.expenseType || 'credit_card';
                            const bType = b.expenseType || 'credit_card';
                            if (aType === 'credit_card' && bType === 'invoice') return -1;
                            if (aType === 'invoice' && bType === 'credit_card') return 1;
                            // Within same type, sort by date (newest first)
                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                          })
                          .map((txn, idx) => {
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            const isEditing = inlineEditingExpense === txn.id;
                            
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.property} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, property: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Property" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        {properties.map(property => (
                                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                                            {property.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-gray-300">{property ? property.name : 'Not Assigned'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.job} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, job: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Job" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="none" className="bg-gray-900 text-white">No job assigned</SelectItem>
                                        {jobs.map(job => (
                                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                                            {job.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    job ? (
                                      <button
                                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                        onClick={() => router.push(`/workorders/${job.id}?role=${role}&returnTo=expenses`)}
                                      >
                                        {job.description}
                                      </button>
                                    ) : (
                                      <span className="text-gray-300">Not Assigned</span>
                                    )
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-blue-300">522.1</div>
                                  <div className="text-xs text-blue-200">HVAC Repairs</div>
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={inlineExpenseForm.billable ? 'yes' : 'no'}
                                      onValueChange={value => setInlineExpenseForm(prev => ({ ...prev, billable: value === 'yes' }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                                        <SelectValue placeholder="Billable" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                      {txn.billable ? 'Yes' : 'No'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Input
                                      className="bg-gray-700 border-gray-600 text-white w-32 text-xs"
                                      placeholder="Memo"
                                      value={inlineExpenseForm.memo}
                                      onChange={e => setInlineExpenseForm(prev => ({ ...prev, memo: e.target.value }))}
                                    />
                                  ) : (
                                    <span className="text-gray-300">{txn.memo || '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setInlineExpenseForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                                          }}
                                        />
                                        <Paperclip className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                                      </label>
                                      {inlineExpenseForm.receipt && (
                                        <span className="text-xs text-green-400">{inlineExpenseForm.receipt}</span>
                                      )}
                                  </div>
                                  ) : (
                                    <span className="text-gray-300">{txn.receipt ? '✓' : '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!inlineExpenseForm.property || !inlineExpenseForm.memo || !inlineExpenseForm.receipt}
                                        onClick={() => {
                                          if (inlineExpenseForm.property && inlineExpenseForm.memo && inlineExpenseForm.receipt) {
                                            // Update the transaction
                                            const updatedTxn = {
                                              ...txn,
                                              status: 'reconciled' as const,
                                              jobId: inlineExpenseForm.job === 'none' ? '' : inlineExpenseForm.job,
                                              memo: inlineExpenseForm.memo,
                                              receipt: inlineExpenseForm.receipt
                                            };
                                            
                                            setTransactions(prev => 
                                              prev.map(t => t.id === txn.id ? updatedTxn : t)
                                            );
                                            
                                            setInlineEditingExpense(null);
                                            setInlineExpenseForm({
                                              property: '',
                                              job: '',
                                              billable: true,
                                              memo: '',
                                              receipt: ''
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        onClick={() => {
                                          setInlineEditingExpense(null);
                                          setInlineExpenseForm({
                                            property: '',
                                            job: '',
                                            billable: true,
                                            memo: '',
                                            receipt: ''
                                          });
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                  </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => {
                                        setInlineEditingExpense(txn.id);
                                        setInlineExpenseForm({
                                          property: property ? property.name : '',
                                          job: job ? job.id : '',
                                          billable: txn.billable,
                                          memo: txn.memo || '',
                                          receipt: ''
                                        });
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {activeTab === "transactions" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Transactions</h3>
                  <div className="flex gap-2">
                    {role === 'centralOffice' && (
                      <Button 
                        variant="outline" 
                        className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 flex items-center gap-2"
                        onClick={() => setNewTransactionDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Add Transaction
                      </Button>
                    )}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" onClick={exportTransactionsToCSV}>
                      <DownloadCloud className="h-4 w-4" /> Export to CSV
                    </Button>
                  </div>
                </div>



                {/* Need Review Table - Central Office Only */}
                {role === 'centralOffice' && getTransactionsNeedingReview().length > 0 && (
                  <div className="mb-8">
                    <div 
                      className="flex items-center justify-between p-4 bg-red-900/20 border border-red-700 rounded-lg cursor-pointer hover:bg-red-900/30 transition-colors"
                      onClick={() => setReviewTableExpanded(!reviewTableExpanded)}
                    >
                      <h4 className="text-md font-semibold text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Transactions Needing Review ({getTransactionsNeedingReview().length})
                      </h4>
                      <ChevronDown 
                        className={`h-5 w-5 text-red-400 transition-transform ${reviewTableExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    
                    {reviewTableExpanded && (
                      <div className="mt-4 flex flex-col h-[300px] rounded-lg">
                        <div className="flex-1 overflow-x-auto overflow-y-auto">
                          <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10">
                              <tr className="bg-red-900/30 border-b border-red-700">
                                <th className="text-left py-3 px-4 font-semibold text-white flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-red-400" />
                                  Date
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">GL Code</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">AI Flag</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTransactionsNeedingReview().map((txn, idx) => {
                                const job = jobs.find(j => j.id === txn.jobId);
                                const property = job ? properties.find(p => p.name === job.property) : undefined;
                                const aiFlag = transactionReviewFlags[txn.id] || 
                                  (!txn.receipt ? 'Missing receipt' : 
                                   !txn.memo ? 'Missing memo' : 
                                   !txn.jobId ? 'Missing job assignment' : 
                                   txn.amount > 1000 ? 'Unusual amount' : 'Review needed');
                                
                                return (
                                  <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                    <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                    <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                    <td className="py-3 px-4 text-gray-300">{property ? property.name : 'Not Assigned'}</td>
                                    <td className="py-3 px-4">
                                      {job ? (
                                        <button
                                          className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                          onClick={() => router.push(`/workorders/${job.id}?role=${role}&returnTo=transactions`)}
                                        >
                                          {job.description}
                                        </button>
                                      ) : (
                                        <span className="text-gray-300">Not Assigned</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="text-blue-300">522.1</div>
                                      <div className="text-xs text-blue-200">HVAC Repairs</div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                        txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                      }`}>
                                        {txn.billable ? 'Yes' : 'No'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      {txn.billable ? (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                          txn.status === 'reconciled' ? 'bg-blue-700 text-blue-100' : 'bg-red-700 text-red-100'
                                        }`}>
                                          {txn.status === 'reconciled' ? 'Reimbursed' : 'Pending'}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gray-700 text-gray-300">
                                          Non-Reimbursable
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-red-700 text-red-100">
                                        {aiFlag}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700 flex items-center gap-1"
                                        onClick={() => {
                                          setSelectedNudgeTransaction(txn);
                                          const missingItems = [];
                                          const flaggedReason = transactionReviewFlags[txn.id];
                                          
                                          // Check specific AI flag first, then check for missing items
                                          if (flaggedReason) {
                                            if (flaggedReason.toLowerCase().includes('receipt')) {
                                              missingItems.push('receipt');
                                            }
                                            if (flaggedReason.toLowerCase().includes('memo')) {
                                              missingItems.push('memo');
                                            }
                                            if (flaggedReason.toLowerCase().includes('property') || flaggedReason.toLowerCase().includes('assignment')) {
                                              missingItems.push('property/job assignment');
                                            }
                                            if (flaggedReason.toLowerCase().includes('unusual') || flaggedReason.toLowerCase().includes('amount')) {
                                              missingItems.push('justification for unusual amount');
                                            }
                                          } else {
                                            // Fallback to standard checks
                                            if (!txn.receipt) missingItems.push('receipt');
                                            if (!txn.memo) missingItems.push('memo');
                                            if (!txn.jobId) missingItems.push('property/job assignment');
                                          }
                                          
                                          const job = jobs.find(j => j.id === txn.jobId);
                                          const property = job ? properties.find(p => p.name === job.property) : undefined;
                                          
                                          setNudgeMessage(`Hi ${txn.madeBy},\n\nI'm reviewing the transaction from ${txn.vendor} for $${txn.amount.toFixed(2)} on ${txn.date} and need the following information to complete the review:\n\n${missingItems.map(item => `• Missing ${item}`).join('\n')}\n\n${property ? `Property: ${property.name}` : 'Property: Not assigned'}\n${job ? `Work Order: ${job.description}` : 'Work Order: Not assigned'}\n\nCould you please provide this information at your earliest convenience?\n\nThanks!`);
                                          setNudgeDialogOpen(true);
                                        }}
                                      >
                                        <Send className="h-3 w-3" />
                                        Nudge
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-4 items-end">
                  <div>
                    <Label className="text-gray-300">Status</Label>
                    <Select value={txnFilterStatus} onValueChange={setTxnFilterStatus}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue>{txnFilterStatus === 'all' ? 'All' : txnFilterStatus.charAt(0).toUpperCase() + txnFilterStatus.slice(1)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="reconciled">Reconciled</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select value={txnFilterBillable} onValueChange={setTxnFilterBillable}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue>{txnFilterBillable === 'all' ? 'All' : txnFilterBillable === 'billable' ? 'Billable' : 'Non-Billable'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="billable">Billable</SelectItem>
                        <SelectItem value="nonbillable">Non-Billable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select value={txnFilterProperty} onValueChange={setTxnFilterProperty}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{txnFilterProperty === 'all' ? 'All' : (properties.find(p => p.id === txnFilterProperty)?.name || '')}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Work Order</Label>
                    <Select value={txnFilterJob} onValueChange={setTxnFilterJob}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{txnFilterJob === 'all' ? 'All' : (jobs.find(j => j.id === txnFilterJob)?.description || '')}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>{job.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Select value={txnFilterMadeBy} onValueChange={setTxnFilterMadeBy}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{txnFilterMadeBy === 'all' ? 'All' : txnFilterMadeBy}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        {Array.from(new Set([...transactions, ...technicianTransactions].map(txn => txn.madeBy))).map(madeBy => (
                          <SelectItem key={madeBy} value={madeBy}>{madeBy}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Date From</Label>
                    <Input type="date" className="bg-gray-800 border-gray-600 text-white w-36" value={txnFilterDateFrom} onChange={e => setTxnFilterDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-gray-300">Date To</Label>
                    <Input type="date" className="bg-gray-800 border-gray-600 text-white w-36" value={txnFilterDateTo} onChange={e => setTxnFilterDateTo(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col h-[400px] rounded-lg">
                  <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">GL Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((txn, idx) => {
                          const assignment = txnAssignments[txn.id] || {};
                          const memo = txnMemos[txn.id] || '';
                          const receipt = txnReceipts[txn.id] || null;
                          const job = jobs.find(j => j.id === txn.jobId);
                          const property = job ? properties.find(p => p.name === job.property) : undefined;
                          return (
                            <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                              <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                              <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                              <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                              <td className="py-3 px-4 text-gray-300">{assignment.property || (property ? property.name : 'Not Assigned')}</td>
                              <td className="py-3 px-4">
                                {assignment.job || job ? (
                                  <button
                                    className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                    onClick={() => {
                                      const workOrderId = assignment.job || txn.jobId;
                                      if (workOrderId) {
                                        router.push(`/workorders/${workOrderId}?role=${role}`);
                                      }
                                    }}
                                  >
                                    {assignment.job ? (jobs.find(j => j.id === assignment.job)?.description || assignment.job) : (job ? job.description : 'Not Assigned')}
                                  </button>
                                ) : (
                                  <span className="text-gray-300">Not Assigned</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-blue-300">
                                {txn.billable ? '7200 - Repairs & Maintenance' : '6100 - Office Expenses'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                  txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                }`}>
                                  {txn.billable ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {txn.billable ? (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                    txn.status === 'reconciled' ? 'bg-blue-700 text-blue-100' : 'bg-red-700 text-red-100'
                                  }`}>
                                    {txn.status === 'reconciled' ? 'Reimbursed' : 'Pending'}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gray-700 text-gray-300">
                                    Non-Reimbursable
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-500/20"
                                    onClick={() => {
                                      setSelectedTransaction(txn as Transaction);
                                      setTransactionDetailsOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {role === 'centralOffice' && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-gray-300 hover:text-white hover:bg-green-500/20"
                                      onClick={() => handleEditTransaction(txn as Transaction)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Export Reports Section */}
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      📊 Export Reports
                    </h3>
                    <div className="text-sm text-gray-400">
                      Generate customized reports for reconciliation or tax purposes
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Filters Panel */}
                    <div className="lg:col-span-1">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center justify-between">
                            <span>Filters</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearAllReportFilters}
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            >
                              Clear All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Date Range */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Date Range</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <Label className="text-gray-400 text-xs">From</Label>
                                <Input
                                  type="date"
                                  value={reportDateRange.from}
                                  onChange={(e) => setReportDateRange(prev => ({ ...prev, from: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-gray-400 text-xs">To</Label>
                                <Input
                                  type="date"
                                  value={reportDateRange.to}
                                  onChange={(e) => setReportDateRange(prev => ({ ...prev, to: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Properties */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Properties</Label>
                            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                              {reportPropertyOptions.map((property) => (
                                <div key={property} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`report-${property}`}
                                    checked={reportSelectedProperties.includes(property)}
                                    onChange={() => handleReportPropertyToggle(property)}
                                    className="rounded bg-gray-700 border-gray-600"
                                  />
                                  <Label htmlFor={`report-${property}`} className="text-white text-xs cursor-pointer">
                                    {property}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* GL Codes */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">GL Codes</Label>
                            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                              {reportGlCodeOptions.map((code) => (
                                <div key={code} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`report-${code}`}
                                    checked={reportSelectedGLCodes.includes(code)}
                                    onChange={() => handleReportGLCodeToggle(code)}
                                    className="rounded bg-gray-700 border-gray-600"
                                  />
                                  <Label htmlFor={`report-${code}`} className="text-white text-xs cursor-pointer">
                                    {code}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Expense Status */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Expense Status</Label>
                            <div className="mt-2 space-y-2">
                              {reportExpenseStatusOptions.map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`report-${status}`}
                                    checked={reportSelectedExpenseStatus.includes(status)}
                                    onChange={() => handleReportExpenseStatusToggle(status)}
                                    className="rounded bg-gray-700 border-gray-600"
                                  />
                                  <Label htmlFor={`report-${status}`} className="text-white text-xs cursor-pointer">
                                    {status}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trust Account */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Trust Account (Optional)</Label>
                            <Select value={reportSelectedTrustAccount} onValueChange={setReportSelectedTrustAccount}>
                              <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="All trust accounts" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                                <SelectItem value="all" className="text-white">All trust accounts</SelectItem>
                                {reportTrustAccountOptions.map((account) => (
                                  <SelectItem key={account} value={account} className="text-white">
                                    {account}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Report Types Panel */}
                    <div className="lg:col-span-2">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Report Types</CardTitle>
                          <p className="text-sm text-gray-400">Select the type of report you want to generate</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {reportTypes.map((report) => (
                            <div
                              key={report.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                reportType === report.id
                                  ? "border-blue-500 bg-blue-900/20"
                                  : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                              }`}
                              onClick={() => setReportType(report.id)}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <input
                                  type="radio"
                                  id={report.id}
                                  name="reportType"
                                  checked={reportType === report.id}
                                  onChange={() => setReportType(report.id)}
                                  className="text-blue-600"
                                />
                                <Label htmlFor={report.id} className="text-white font-medium cursor-pointer">
                                  {report.name}
                                </Label>
                              </div>
                              <p className="text-sm text-gray-300 ml-6">{report.description}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Generate Report Section */}
                      <Card className="bg-gray-800 border-gray-700 mt-6">
                        <CardHeader>
                          <CardTitle className="text-white">Generate Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-gray-700 rounded-lg p-4">
                              <h4 className="font-medium text-white mb-2">Active Filters Summary</h4>
                              <div className="text-sm text-gray-300 space-y-1">
                                <div>
                                  <span className="font-medium">Date Range:</span> {
                                    reportDateRange.from && reportDateRange.to 
                                      ? `${reportDateRange.from} to ${reportDateRange.to}`
                                      : "All time"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Properties:</span> {
                                    reportSelectedProperties.length > 0 
                                      ? `${reportSelectedProperties.length} selected`
                                      : "All properties"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">GL Codes:</span> {
                                    reportSelectedGLCodes.length > 0 
                                      ? `${reportSelectedGLCodes.length} selected`
                                      : "All GL codes"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Expense Status:</span> {
                                    reportSelectedExpenseStatus.length > 0 
                                      ? `${reportSelectedExpenseStatus.length} selected`
                                      : "All statuses"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Trust Account:</span> {
                                    reportSelectedTrustAccount === "all" ? "All trust accounts" : reportSelectedTrustAccount
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                              <h4 className="font-medium text-blue-300 mb-2">Export Options</h4>
                              <div className="text-sm text-blue-200 mb-4">
                                Reports will include:
                                <ul className="mt-2 space-y-1 ml-4">
                                  <li>• Generated timestamp</li>
                                  <li>• Applied filters summary</li>
                                  <li>• Receipt links (where available)</li>
                                  <li>• Formatted tables matching expense views</li>
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label className="text-blue-300 text-sm font-medium">Download</Label>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleGenerateExportReport('csv')}
                                      disabled={isGeneratingReport}
                                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                      size="sm"
                                    >
                                      {isGeneratingReport ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                          Generating...
                                        </>
                                      ) : (
                                        <>
                                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                                          CSV
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() => handleGenerateExportReport('pdf')}
                                      disabled={isGeneratingReport}
                                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                                      size="sm"
                                    >
                                      {isGeneratingReport ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                          Generating...
                                        </>
                                      ) : (
                                        <>
                                          <FileText className="h-4 w-4 mr-2" />
                                          PDF
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-blue-300 text-sm font-medium">Email Report</Label>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleGenerateExportReport('csv', true)}
                                      disabled={isGeneratingReport}
                                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                                      size="sm"
                                    >
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email CSV
                                    </Button>
                                    <Button
                                      onClick={() => handleGenerateExportReport('pdf', true)}
                                      disabled={isGeneratingReport}
                                      className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                                      size="sm"
                                    >
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email PDF
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <Card className="bg-gray-800 border-gray-700 mt-6">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            id: 'trust-reconciliation-recent',
                            name: 'Trust Account Reconciliation Report',
                            generatedOn: '2024-07-08 14:30:22',
                            scope: 'All properties',
                            format: 'csv'
                          },
                          {
                            id: 'tax-deduction-recent',
                            name: 'Tax Deduction Summary',
                            generatedOn: '2024-07-07 09:15:45',
                            scope: 'YTD',
                            format: 'pdf'
                          },
                          {
                            id: 'flagged-expense-recent',
                            name: 'Flagged Expense Report',
                            generatedOn: '2024-07-05 16:22:18',
                            scope: 'Q2 2024',
                            format: 'csv'
                          }
                        ].map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div>
                              <div className="text-white font-medium">{report.name}</div>
                              <div className="text-sm text-gray-400">
                                Generated on: {report.generatedOn} • {report.scope} • {report.format.toUpperCase()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                                onClick={() => handleRecentReportDownload(report)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-blue-600 border-blue-500 text-white hover:bg-blue-500"
                                onClick={() => handleRecentReportEmail(report)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "budgeting" && role === 'centralOffice' && (
              <BudgetingTab />
            )}
            {activeTab === "collateral" && (role === 'pm' || role === 'centralOffice') && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Collateral Hub</h3>
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 flex items-center gap-2"
                        onClick={handleCollateralFileUpload}
                        onMouseEnter={() => setShowUploadCallout(true)}
                        onMouseLeave={() => setShowUploadCallout(false)}
                      >
                        <Upload className="h-4 w-4" /> Upload Files
                      </Button>
                      
                      {/* Upload Options Callout */}
                      {showUploadCallout && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 z-50">
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-400" />
                            File Upload Options
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <div className="text-white font-medium">Upload Directly</div>
                                <div className="text-gray-400">Click to select files from your device</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <div className="text-white font-medium">Email Documents</div>
                                <div className="text-gray-400">Send to: <span className="text-blue-300">docs@jobvault.co</span></div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <div className="text-white font-medium">Text Us</div>
                                <div className="text-gray-400">Send photos to: <span className="text-blue-300">(202) 202-3030</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 flex items-center gap-2"
                      onClick={() => setAskAiModalOpen(true)}
                    >
                      <Bot className="h-4 w-4" /> Ask AI
                      <span className="text-xs text-purple-200 ml-2">⌘⇧K</span>
                    </Button>
                    {collateralSelectedDocs.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 flex items-center gap-2"
                        onClick={handleCollateralExportSelected}
                      >
                        <DownloadCloud className="h-4 w-4" /> Export Selected ({collateralSelectedDocs.length})
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Search Bar */}
                <div className="relative mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Bot className="absolute left-11 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input 
                      placeholder="Ask anything — e.g. 'How much did we spend on Unit 22's plumbing?' or 'Find receipts where we were overcharged' (⌘K)"
                      className="bg-gray-800 border-gray-600 text-white pl-20 pr-4 py-4 text-lg rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      value={aiSearchQuery}
                      onChange={(e) => {
                        setAiSearchQuery(e.target.value);
                        const suggestions = getAiSearchSuggestions(e.target.value);
                        setAiSearchSuggestions(suggestions);
                        setShowAiSuggestions(e.target.value.length > 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAiSearch(aiSearchQuery);
                        } else if (e.key === 'Escape') {
                          setShowAiSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (aiSearchQuery.length > 0) {
                          setShowAiSuggestions(true);
                        }
                      }}
                    />
                    {aiSearchLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                      </div>
                    )}
                  </div>

                  {/* AI Search Suggestions */}
                  {showAiSuggestions && aiSearchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {aiSearchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-300 border-b border-gray-700 last:border-b-0"
                          onClick={() => {
                            setAiSearchQuery(suggestion);
                            setShowAiSuggestions(false);
                            handleAiSearch(suggestion);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-purple-400" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Search Results */}
                {aiSearchResults && (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 space-y-4 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                    </div>
                    
                    {/* AI Summary */}
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-purple-100">{aiSearchResults.summary}</p>
                    </div>

                    {/* AI Insights */}
                    {aiSearchResults.insights && aiSearchResults.insights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300">Key Insights:</h4>
                        <ul className="space-y-1">
                          {aiSearchResults.insights.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-blue-400 mt-1">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Documents */}
                    {aiSearchResults.documents && aiSearchResults.documents.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-300">Related Documents:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {aiSearchResults.documents.map((doc: any) => {
                            const IconComponent = getDocumentTypeIcon(doc.documentType);
                            return (
                              <div key={doc.id} className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:bg-gray-600 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                  <IconComponent className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm font-medium text-white truncate">{doc.filename}</span>
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                  <div>Property: {doc.propertyName}</div>
                                  <div>Uploaded: {doc.uploadDate}</div>
                                  {doc.amount && <div className="text-green-400">Amount: ${doc.amount.toLocaleString()}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Clear Results */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => {
                          setAiSearchResults(null);
                          setAiSearchQuery('');
                        }}
                      >
                        Clear Results
                      </Button>
                    </div>
                  </div>
                )}

                {/* Documents Needing Review */}
                {documentsNeedingReview.length > 0 && (
                  <div className="mb-8">
                    <div 
                      className="flex items-center justify-between p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg cursor-pointer hover:bg-yellow-900/30 transition-colors"
                      onClick={() => setCollateralReviewTableExpanded(!collateralReviewTableExpanded)}
                    >
                      <h4 className="text-md font-semibold text-yellow-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Documents Needing Review ({documentsNeedingReview.length})
                      </h4>
                      <ChevronDown 
                        className={`h-5 w-5 text-yellow-400 transition-transform ${collateralReviewTableExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    
                    {collateralReviewTableExpanded && (
                      <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-yellow-900/30 border-b border-yellow-700">
                              <tr>
                                <th className="text-left py-3 px-4 font-semibold text-white flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                  Document
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Uploaded By</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Upload Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Review Flags</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Assigned To</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {documentsNeedingReview.map((doc) => {
                                const IconComponent = getDocumentTypeIcon(doc.documentType);
                                return (
                                  <React.Fragment key={doc.id}>
                                    <tr className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                          <IconComponent className="h-4 w-4 text-blue-400" />
                                          <span className="text-white text-sm font-medium">{doc.filename}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-gray-300">
                                        {documentTypeLabels[doc.documentType]}
                                      </td>
                                      <td className="py-3 px-4 text-gray-300">{doc.propertyName}</td>
                                      <td className="py-3 px-4 text-gray-300">{doc.uploadedBy}</td>
                                      <td className="py-3 px-4 text-gray-300">
                                        {doc.amount ? `$${doc.amount.toFixed(2)}` : 'N/A'}
                                      </td>
                                      <td className="py-3 px-4 text-gray-300">{doc.uploadDate}</td>
                                      <td className="py-3 px-4">
                                        <div className="space-y-1">
                                          {doc.reviewFlags.map((flag, idx) => (
                                            <div key={idx} className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded">
                                              {flag}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-gray-300">{doc.assignedTo}</td>
                                      <td className="py-3 px-4">
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                            onClick={() => handleDocumentReview(doc.id, 'edit')}
                                          >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleDocumentReview(doc.id, 'confirm')}
                                          >
                                            <Check className="h-3 w-3 mr-1" />
                                            Confirm
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                    
                                    {/* Editing Form Row */}
                                    {editingDocumentId === doc.id && (
                                      <tr className="bg-blue-900/20 border-t-2 border-blue-500">
                                        <td colSpan={9} className="py-6 px-4">
                                          <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                                              <Edit className="h-4 w-4" />
                                              Edit Document: {doc.filename}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Property Assignment</label>
                                                <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                                  <option value="prop1">Stanford GSB</option>
                                                  <option value="prop2">Mission Bay Tech Campus</option>
                                                  <option value="prop3">Downtown Office Tower</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Document Type</label>
                                                <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                                  <option value="invoice">Invoice</option>
                                                  <option value="receipt">Receipt</option>
                                                  <option value="contract">Contract</option>
                                                  <option value="report">Report</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Work Order Reference</label>
                                                <input 
                                                  type="text" 
                                                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                                  placeholder="WO-2024-001"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                                                <input 
                                                  type="text" 
                                                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                                  placeholder="HVAC, repair, emergency"
                                                  defaultValue={doc.tags.join(', ')}
                                                />
                                              </div>
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                              <Button
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => handleSaveEdit(doc.id)}
                                              >
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                              </Button>
                                              <Button
                                                variant="outline"
                                                className="border-gray-500 text-gray-300 hover:bg-gray-700"
                                                onClick={handleCancelEdit}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}

                                    {/* Confirmation Form Row */}
                                    {confirmingDocumentId === doc.id && (
                                      <tr className="bg-green-900/20 border-t-2 border-green-500">
                                        <td colSpan={9} className="py-6 px-4">
                                          <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                                              <Check className="h-4 w-4" />
                                              Confirm Document: {doc.filename}
                                            </h4>
                                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                                              <p className="text-gray-300 mb-4">
                                                Are you sure you want to confirm this document and add it to the collateral hub? 
                                                This will move it from the review queue to the main document collection.
                                              </p>
                                              <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                  <span className="text-gray-400">Property:</span>
                                                  <span className="text-white ml-2">{doc.propertyName}</span>
                                                </div>
                                                <div>
                                                  <span className="text-gray-400">Type:</span>
                                                  <span className="text-white ml-2">{documentTypeLabels[doc.documentType]}</span>
                                                </div>
                                                <div>
                                                  <span className="text-gray-400">Amount:</span>
                                                  <span className="text-white ml-2">{doc.amount ? `$${doc.amount.toFixed(2)}` : 'N/A'}</span>
                                                </div>
                                                <div>
                                                  <span className="text-gray-400">Tags:</span>
                                                  <span className="text-white ml-2">{doc.tags.join(', ')}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                              <Button
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleConfirmDocument(doc.id)}
                                              >
                                                <Check className="h-4 w-4 mr-2" />
                                                Yes, Confirm & Add to Hub
                                              </Button>
                                              <Button
                                                variant="outline"
                                                className="border-gray-500 text-gray-300 hover:bg-gray-700"
                                                onClick={handleCancelConfirm}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Filters and Search */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-gray-300">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {collateralIsSearching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          </div>
                        )}
                        <Input 
                          placeholder="Search by filename, tags, or vendor..."
                          className="bg-gray-800 border-gray-600 text-white pl-10 pr-10"
                          value={collateralSearchQuery}
                          onChange={(e) => setCollateralSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Property</Label>
                      <Select value={collateralFilterProperty} onValueChange={setCollateralFilterProperty}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterProperty === 'all' ? 'All Properties' : 
                             propertyOptions.find(p => p.id === collateralFilterProperty)?.name || 'All Properties'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">All Properties</SelectItem>
                          {propertyOptions.map(property => (
                            <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Area</Label>
                      <Select value={collateralFilterArea} onValueChange={setCollateralFilterArea}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterArea === 'all' ? 'All Areas' : 
                             areaOptions.find(a => a.id === collateralFilterArea)?.name || 'All Areas'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          {areaOptions.map(area => (
                            <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Document Type</Label>
                      <Select value={collateralFilterDocType} onValueChange={setCollateralFilterDocType}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterDocType === 'all' ? 'All Types' : 
                             documentTypeLabels[collateralFilterDocType as DocumentType] || 'All Types'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">All Types</SelectItem>
                          {Object.entries(documentTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Uploaded By</Label>
                      <Select value={collateralFilterUploadedBy} onValueChange={setCollateralFilterUploadedBy}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterUploadedBy === 'all' ? 'All Users' : collateralFilterUploadedBy}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">All Users</SelectItem>
                          {staffOptions.map(staff => (
                            <SelectItem key={staff.id} value={staff.name}>{staff.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <Label className="text-gray-300">Date From</Label>
                      <Input 
                        type="date" 
                        className="bg-gray-800 border-gray-600 text-white w-36" 
                        value={collateralFilterDateFrom} 
                        onChange={(e) => setCollateralFilterDateFrom(e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Date To</Label>
                      <Input 
                        type="date" 
                        className="bg-gray-800 border-gray-600 text-white w-36" 
                        value={collateralFilterDateTo} 
                        onChange={(e) => setCollateralFilterDateTo(e.target.value)} 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCollateralViewMode('card')}
                        className={`${collateralViewMode === 'card' ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-600'} text-white`}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCollateralViewMode('list')}
                        className={`${collateralViewMode === 'list' ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-600'} text-white`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Document Display */}
                {collateralIsSearching && (
                  <div className="mb-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                      Searching...
                    </div>
                  </div>
                )}
                {collateralViewMode === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCollateralDocs.map((doc) => {
                      const IconComponent = getDocumentTypeIcon(doc.documentType);
                      const isSelected = collateralSelectedDocs.includes(doc.id);
                      return (
                        <Card 
                          key={doc.id} 
                          className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                            isSelected ? 'border-blue-500 bg-blue-900/20' : ''
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id));
                            } else {
                              setCollateralSelectedDocs(prev => [...prev, doc.id]);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-5 w-5 text-blue-400" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-white break-words">{doc.filename}</div>
                                  <div className="text-xs text-gray-400">{documentTypeLabels[doc.documentType]}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                                {doc.status === 'expired' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">Uploaded:</span>
                                <span className="text-gray-300 text-right">{doc.uploadDate}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">By:</span>
                                <span className="text-gray-300 text-right break-words ml-2">{doc.uploadedBy}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">Property:</span>
                                <span className="text-gray-300 text-right break-words ml-2">{doc.propertyName}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">Size:</span>
                                <span className="text-gray-300 text-right">{formatFileSize(doc.fileSize)}</span>
                              </div>
                              {doc.amount && (
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-400 shrink-0">Amount:</span>
                                  <span className="text-green-400 text-right">${doc.amount.toLocaleString()}</span>
                                </div>
                              )}
                              {doc.expiryDate && (
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-400 shrink-0">Expires:</span>
                                  <span className={`text-right ${doc.status === 'expired' ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {doc.expiryDate}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {doc.tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {doc.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                                {doc.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    +{doc.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCollateralDocPreview(doc);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(doc.fileUrl, '_blank');
                                }}
                              >
                                <LinkIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-900 border-b border-gray-700">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-white w-8">
                              <input
                                type="checkbox"
                                className="rounded bg-gray-700 border-gray-600"
                                checked={filteredCollateralDocs.length > 0 && filteredCollateralDocs.every(doc => collateralSelectedDocs.includes(doc.id))}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCollateralSelectedDocs(filteredCollateralDocs.map(doc => doc.id));
                                  } else {
                                    setCollateralSelectedDocs([]);
                                  }
                                }}
                              />
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[200px]">Document</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[120px]">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[100px]">Upload Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[120px]">Uploaded By</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[120px]">Property</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[80px]">Size</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[100px]">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[100px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCollateralDocs.map((doc) => {
                            const IconComponent = getDocumentTypeIcon(doc.documentType);
                            const isSelected = collateralSelectedDocs.includes(doc.id);
                            return (
                              <tr key={doc.id} className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                                isSelected ? 'bg-blue-900/20' : 'bg-gray-800'
                              }`}>
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded bg-gray-700 border-gray-600"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setCollateralSelectedDocs(prev => [...prev, doc.id]);
                                      } else {
                                        setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id));
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <IconComponent className="h-4 w-4 text-blue-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-white break-words">{doc.filename}</div>
                                      {doc.description && (
                                        <div className="text-xs text-gray-400 break-words">{doc.description}</div>
                                      )}
                                    </div>
                                    {doc.status === 'expired' && <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  <div className="break-words">
                                    {documentTypeLabels[doc.documentType]}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{doc.uploadDate}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  <div className="break-words">{doc.uploadedBy}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  <div className="break-words">{doc.propertyName}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{formatFileSize(doc.fileSize)}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {doc.amount ? `$${doc.amount.toLocaleString()}` : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                      onClick={() => handleCollateralDocPreview(doc)}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                      onClick={() => window.open(doc.fileUrl, '_blank')}
                                    >
                                      <LinkIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {filteredCollateralDocs.length === 0 && !collateralIsSearching && (
                  <div className="text-center py-12">
                    <FileArchive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No documents found</h3>
                    <p className="text-gray-400 mb-4">
                      {collateralDebouncedSearchQuery || collateralFilterProperty !== 'all' || collateralFilterDocType !== 'all' 
                        ? 'Try adjusting your search criteria or filters'
                        : 'Upload your first document to get started'}
                    </p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setCollateralUploadDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "properties" && role === 'pm' && (
              <EnhancedPropertiesTab role="pm" setActiveTab={setActiveTab} />
            )}
            {activeTab === "staff" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Technicians</h3>
    </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{technicianName}</h4>
                          <p className="text-gray-400">HVAC Technician</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Employee ID</Label>
                          <span className="text-white">TECH-001</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Email</Label>
                          <span className="text-white">alice.johnson@company.com</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Phone</Label>
                          <span className="text-white">(555) 123-4567</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Hire Date</Label>
                          <span className="text-white">March 15, 2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Status</Label>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Statistics Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Work Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">{technicianWorkOrders.length}</div>
                          <div className="text-sm text-gray-400">Total Work Orders</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{technicianFinishedJobs.length}</div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400">{technicianInProgressJobs.length}</div>
                          <div className="text-sm text-gray-400">In Progress</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">{technicianOverdueJobs.length}</div>
                          <div className="text-sm text-gray-400">Overdue</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-700">
                        <h5 className="text-sm font-semibold text-white mb-2">This Month's Expenses</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Spent</span>
                            <span className="text-white">${technicianTotalSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Billable</span>
                            <span className="text-green-400">${technicianBillableSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Non-Billable</span>
                            <span className="text-yellow-400">${technicianNonBillableSpend.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Certifications Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Skills & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">HVAC Installation</div>
                            <div className="text-sm text-gray-400">Certified Technician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Refrigeration Systems</div>
                            <div className="text-sm text-gray-400">EPA Certified</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Electrical Systems</div>
                            <div className="text-sm text-gray-400">Licensed Electrician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Plumbing</div>
                            <div className="text-sm text-gray-400">Basic Certification</div>
                          </div>
                          <Badge className="bg-yellow-600 text-white">Pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Completed HVAC maintenance at Stanford GSB</p>
                            <p className="text-xs text-gray-400">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Started work order at Sunnyvale 432</p>
                            <p className="text-xs text-gray-400">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Submitted expense report for $150.00</p>
                            <p className="text-xs text-gray-400">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Received new work order assignment</p>
                            <p className="text-xs text-gray-400">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "cards" && role === 'centralOffice' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Enhanced Card Management</h3>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                      onClick={() => setIssueCardDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Issue New Card
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      onClick={() => setConnectCardDialogOpen(true)}
                    >
                      <CreditCard className="h-4 w-4" />
                      Connect Existing Card
                    </Button>
                  </div>
                </div>

                {/* Enhanced Cards Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {enhancedCards.map((card) => (
                    <Card key={card.id} className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              <CreditCard className="h-5 w-5" />
                              {card.holder}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {card.position} • {card.type} Card
                            </CardDescription>
                          </div>
                          <Badge 
                            className={`${
                              card.status === 'active' ? 'bg-green-600' : 
                              card.status === 'inactive' ? 'bg-gray-600' : 
                              card.status === 'blocked' ? 'bg-red-600' : 'bg-yellow-600'
                            } text-white`}
                          >
                            {card.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">{card.brand}</span>
                            <span className="text-white font-mono">{card.number}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Expires</span>
                            <span className="text-white">{card.expiryDate}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Available</span>
                            <span className="text-green-400">${card.balance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Limit</span>
                            <span className="text-white">${card.limit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">This Month</span>
                            <span className="text-yellow-400">${card.monthlySpend.toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Assigned Properties:</div>
                          <div className="flex flex-wrap gap-1">
                            {card.assignedProperties.map((propId) => {
                              const property = properties.find(p => p.id === propId);
                              return (
                                <Badge key={propId} variant="outline" className="text-xs border-blue-500 text-blue-300">
                                  {property?.name || propId}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Vendor Restrictions:</div>
                          <div className="flex flex-wrap gap-1">
                            {card.vendorRestrictions.slice(0, 3).map((vendor) => (
                              <Badge key={vendor} variant="outline" className="text-xs border-purple-500 text-purple-300">
                                {vendor}
                              </Badge>
                            ))}
                            {card.vendorRestrictions.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                                +{card.vendorRestrictions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Last Used:</span>
                          <span className="text-gray-300">{card.lastUsed}</span>
                        </div>

                        {card.isExistingCard && (
                          <Badge className="w-full justify-center bg-orange-600 text-white">
                            Connected External Card
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {activeTab === "policy" && (
              <>
                {/* Expense Policy Section */}
                <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Expense Policy
                    </h3>
                    <Button 
                      variant="outline" 
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => setExpensePolicyDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Expense Policy
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {policyRules.map(rule => (
                      <div key={rule.id} className="p-3 bg-gray-900 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-300">{rule.category}</span>
                          <div className="flex items-center gap-2">
                            {rule.aiEnabled && (
                              <Badge className="bg-purple-600 text-white text-xs">AI</Badge>
                            )}
                            <Badge className={rule.active ? "bg-green-600 text-white text-xs" : "bg-gray-600 text-white text-xs"}>
                              {rule.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{rule.rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Expense Clarification Requests</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-orange-600 text-white">
                      {expenseRequests.filter(r => r.status === 'pending').length} Pending
                    </Badge>
                    <Badge className="bg-green-600 text-white">
                      {expenseRequests.filter(r => r.status === 'approved').length} Approved
                    </Badge>
                    <Badge className="bg-red-600 text-white">
                      {expenseRequests.filter(r => r.status === 'denied').length} Denied
                    </Badge>
                  </div>
                </div>

                {/* Enhanced Expense Requests Table */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-white">Technician</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Question</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Vendor</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Urgency</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">AI Suggestion</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseRequests.map((request) => (
                            <tr key={request.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="text-white font-medium">{request.technicianName}</div>
                                <div className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-gray-300 max-w-xs">{request.question}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-green-400 font-medium">${request.amount.toFixed(2)}</span>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{request.vendor}</td>
                              <td className="py-3 px-4 text-gray-300">{request.property || 'N/A'}</td>
                              <td className="py-3 px-4">
                                <Badge className="bg-blue-600 text-white text-xs">
                                  {getTypeLabel(request.type)}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                                  {request.urgency}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                                  {request.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="max-w-xs text-xs text-gray-400 bg-purple-900/20 p-2 rounded border border-purple-500/30">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="text-purple-300">🤖 AI:</span>
                                  </div>
                                  {request.aiSuggestion}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {request.status === 'pending' ? (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleApproveExpenseRequest(request.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleDenyExpenseRequest(request.id)}
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Deny
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    {request.status === 'approved' ? 'Approved' : 'Denied'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {activeTab === "properties" && role === 'centralOffice' && (
              <EnhancedPropertiesTab role="centralOffice" setActiveTab={setActiveTab} />
            )}
            {activeTab === "staff" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Technicians</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Work Orders Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((technician) => {
                        const assignedJobs = jobs.filter(job => job.technician === technician.name);
                        return (
                          <React.Fragment key={technician.id}>
                            <tr className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-medium text-white">{technician.name}</div>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{technician.phone}</td>
                              <td className="py-3 px-4 text-gray-300">{technician.email}</td>
                              <td className="py-3 px-4 text-gray-300">
                                <button
                                  className={`text-left hover:text-blue-400 transition-colors ${
                                    assignedJobs.length > 0 ? 'text-blue-400 cursor-pointer' : 'text-gray-500 cursor-default'
                                  }`}
                                  onClick={() => assignedJobs.length > 0 && setViewTechnicianWorkOrders(viewTechnicianWorkOrders === technician.id ? null : technician.id)}
                                  disabled={assignedJobs.length === 0}
                                >
                                  {assignedJobs.length} work order{assignedJobs.length !== 1 ? 's' : ''}
                                </button>
                              </td>
                            </tr>
                            {viewTechnicianWorkOrders === technician.id && assignedJobs.length > 0 && (
                              <tr className="bg-gray-900">
                                <td colSpan={4} className="p-0">
                                  <div className="p-4">
                                    <h5 className="text-sm font-semibold text-white mb-3">Work Orders for {technician.name}</h5>
                                    <table className="min-w-full text-sm">
                                      <thead>
                                        <tr className="bg-gray-800 border-b border-gray-700">
                                          <th className="text-left py-2 px-3 font-semibold text-white">Property</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Description</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Status</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Priority</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {assignedJobs.map((job) => (
                                          <tr key={job.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                            <td className="py-2 px-3 text-gray-300">{job.property}</td>
                                            <td className="py-2 px-3 text-gray-300">{job.description}</td>
                                            <td className="py-2 px-3 text-gray-300">{job.techStatus}</td>
                                            <td className="py-2 px-3 text-gray-300">{job.priority}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
            </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {activeTab === "profile" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">My Profile</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{technicianName}</h4>
                          <p className="text-gray-400">HVAC Technician</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Employee ID</Label>
                          <span className="text-white">TECH-001</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Email</Label>
                          <span className="text-white">alice.johnson@company.com</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Phone</Label>
                          <span className="text-white">(555) 123-4567</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Hire Date</Label>
                          <span className="text-white">March 15, 2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Status</Label>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Statistics Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Work Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">{technicianWorkOrders.length}</div>
                          <div className="text-sm text-gray-400">Total Work Orders</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{technicianFinishedJobs.length}</div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400">{technicianInProgressJobs.length}</div>
                          <div className="text-sm text-gray-400">In Progress</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">{technicianOverdueJobs.length}</div>
                          <div className="text-sm text-gray-400">Overdue</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-700">
                        <h5 className="text-sm font-semibold text-white mb-2">This Month's Expenses</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Spent</span>
                            <span className="text-white">${technicianTotalSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Billable</span>
                            <span className="text-green-400">${technicianBillableSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Non-Billable</span>
                            <span className="text-yellow-400">${technicianNonBillableSpend.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Certifications Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Skills & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">HVAC Installation</div>
                            <div className="text-sm text-gray-400">Certified Technician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Refrigeration Systems</div>
                            <div className="text-sm text-gray-400">EPA Certified</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Electrical Systems</div>
                            <div className="text-sm text-gray-400">Licensed Electrician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Plumbing</div>
                            <div className="text-sm text-gray-400">Basic Certification</div>
                          </div>
                          <Badge className="bg-yellow-600 text-white">Pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Completed HVAC maintenance at Stanford GSB</p>
                            <p className="text-xs text-gray-400">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Started work order at Sunnyvale 432</p>
                            <p className="text-xs text-gray-400">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Submitted expense report for $150.00</p>
                            <p className="text-xs text-gray-400">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Received new work order assignment</p>
                            <p className="text-xs text-gray-400">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "variance-comments" && role === 'pm' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Variance Comments Due</h3>
                  <div className="flex items-center gap-4">
                                         <div className="text-sm text-gray-400">
                       Track and submit variance comments for budget overages &gt;$5K or &gt;5% over
                     </div>
                    <Select value={selectedVarianceProperty} onValueChange={setSelectedVarianceProperty}>
                      <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all" className="text-white">All Properties</SelectItem>
                        {getPropertiesForRole('pm').map((property) => (
                          <SelectItem key={property.id} value={property.id.toString()} className="text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Variance Comments Alert */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h4 className="text-red-300 font-semibold">Critical: Variance Comments Required</h4>
                  </div>
                  <p className="text-red-200 text-sm mb-3">
                    You have <strong>6 variance items</strong> that require immediate attention. 
                    These represent budget variances &gt;$5K or &gt;5% that exceed established thresholds and need owner review.
                  </p>

                </div>

                {/* Due Comments Table */}
                <Card className="bg-gray-800 border-gray-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Due Comments - Budget Variance Items Requiring Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead className="border-b border-gray-600">
                          <tr>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">Account</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">PTD Actual</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">PTD Budget</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">Variance</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">% Var</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">YTD Actual</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">YTD Budget</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">Variance</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">% Var</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">Annual</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">Status</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">AI Suggestion</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Mock variance items requiring comments - GL Report Format
                            const varianceItems = [
                              {
                                id: 1,
                                property: 'Stanford GSB',
                                propertyCode: 'ap172',
                                glCode: '7200',
                                glName: 'Total Repairs and Maintenance',
                                subGL: '7215 - Plumbing Repairs',
                                ptdActual: 23750,
                                ptdBudget: 15000,
                                ptdVariance: 8750,
                                ptdVariancePercent: 58.3,
                                ytdActual: 89420,
                                ytdBudget: 75000,
                                ytdVariance: 14420,
                                ytdVariancePercent: 19.2,
                                annual: 300000,
                                reason: 'Emergency plumbing system replacement - quarterly overage',
                                hasComment: false,
                                aiSuggestion: 'PTD overage due to emergency plumbing failure. Suggest explaining emergency nature, age of pipes (20+ years), and preventive maintenance schedule.',
                                urgency: 'high'
                              },
                              {
                                id: 2,
                                property: 'Stanford GSB', 
                                propertyCode: 'ap172',
                                glCode: '6100',
                                glName: 'Total Advertising and Marketing',
                                subGL: '6125 - Leasing Commissions',
                                ptdActual: 18076,
                                ptdBudget: 20492,
                                ptdVariance: -2416,
                                ptdVariancePercent: -11.8,
                                ytdActual: 65280,
                                ytdBudget: 58000,
                                ytdVariance: 7280,
                                ytdVariancePercent: 12.6,
                                annual: 232000,
                                reason: 'Higher leasing commission rates for Q4 renewals',
                                hasComment: false,
                                aiSuggestion: 'YTD variance over 5% threshold. Detail commission structure changes and impact on future lease deals.',
                                urgency: 'high'
                              },
                              {
                                id: 3,
                                property: 'Mission Bay',
                                propertyCode: 'mb401',
                                glCode: '5200', 
                                glName: 'Total Turnover',
                                subGL: '5235 - Kitchen Renovations',
                                ptdActual: 17213,
                                ptdBudget: 31379,
                                ptdVariance: -14166,
                                ptdVariancePercent: -45.1,
                                ytdActual: 78945,
                                ytdBudget: 125000,
                                ytdVariance: -46055,
                                ytdVariancePercent: -36.8,
                                annual: 500000,
                                reason: 'Delayed kitchen renovation projects',
                                hasComment: true,
                                comment: 'Kitchen renovation projects delayed due to permit approval process and appliance supply chain issues. Projects rescheduled for Q1 next year.',
                                aiSuggestion: 'Good explanation. Consider adding timeline for delayed projects and budget carryover plan.',
                                urgency: 'medium'
                              },
                              {
                                id: 4,
                                property: 'Mission Bay',
                                propertyCode: 'mb401',
                                glCode: '7400',
                                glName: 'Operating Expenses before Replacements', 
                                subGL: '7420 - Electrical Systems',
                                ptdActual: 45823,
                                ptdBudget: 32000,
                                ptdVariance: 13823,
                                ptdVariancePercent: 43.2,
                                ytdActual: 156780,
                                ytdBudget: 128000,
                                ytdVariance: 28780,
                                ytdVariancePercent: 22.5,
                                annual: 512000,
                                reason: 'Increased electrical system maintenance and upgrades',
                                hasComment: false,
                                aiSuggestion: 'Significant overage. Break down emergency repairs vs planned upgrades. Include energy efficiency measures planned.',
                                urgency: 'high'
                              },
                              {
                                id: 5,
                                property: 'Stanford GSB',
                                propertyCode: 'ap172',
                                glCode: '8100',
                                glName: 'Total Debt Service',
                                subGL: '8115 - HVAC Equipment Financing',
                                ptdActual: 28500,
                                ptdBudget: 22000,
                                ptdVariance: 6500,
                                ptdVariancePercent: 29.5,
                                ytdActual: 114000,
                                ytdBudget: 88000,
                                ytdVariance: 26000,
                                ytdVariancePercent: 29.5,
                                annual: 352000,
                                reason: 'New HVAC equipment financing payments',
                                hasComment: false,
                                aiSuggestion: 'Overage above $5K threshold. Detail equipment financing terms, energy savings projections, and ROI timeline.',
                                urgency: 'medium'
                              },
                              {
                                id: 6,
                                property: 'Stanford GSB',
                                propertyCode: 'ap172',
                                glCode: '4100',
                                glName: 'Total Net Income',
                                subGL: '4125 - Parking Revenue',
                                ptdActual: 35200,
                                ptdBudget: 28000,
                                ptdVariance: 7200,
                                ptdVariancePercent: 25.7,
                                ytdActual: 140800,
                                ytdBudget: 112000,
                                ytdVariance: 28800,
                                ytdVariancePercent: 25.7,
                                annual: 448000,
                                reason: 'Above budget parking revenue - rate increases',
                                hasComment: false,
                                aiSuggestion: 'Positive variance exceeds 5% threshold. Detail parking rate changes, occupancy rates, and sustainability of performance.',
                                urgency: 'low'
                              }
                            ];

                            return varianceItems
                              .filter(item => selectedVarianceProperty === 'all' || item.property === 
                                getPropertiesForRole('pm').find(p => p.id.toString() === selectedVarianceProperty)?.name)
                              .filter(item => {
                                // Only show items with variance >$5K or >5%
                                const ptdVarianceAbs = Math.abs(item.ptdVariance);
                                const ytdVarianceAbs = Math.abs(item.ytdVariance);
                                const ptdPercentAbs = Math.abs(item.ptdVariancePercent);
                                const ytdPercentAbs = Math.abs(item.ytdVariancePercent);
                                return ptdVarianceAbs >= 5000 || ytdVarianceAbs >= 5000 || ptdPercentAbs >= 5 || ytdPercentAbs >= 5;
                              })
                              .filter(item => !item.hasComment) // Only show items without comments
                              .map((item) => (
                              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                {/* Account Column */}
                                <td className="py-2 px-2">
                                  <div className="text-blue-300 font-medium text-xs">{item.subGL}</div>
                                  <div className="text-purple-300 text-xs">{item.propertyCode} - {item.property}</div>
                                  <div className="text-gray-400 text-xs">{item.glCode} - {item.glName}</div>
                                </td>
                                
                                {/* PTD Actual */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-white text-xs">${item.ptdActual.toLocaleString()}</div>
                                </td>
                                
                                {/* PTD Budget */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-gray-300 text-xs">${item.ptdBudget.toLocaleString()}</div>
                                </td>
                                
                                {/* PTD Variance */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ptdVariance >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ptdVariance >= 0 ? '+' : ''}${item.ptdVariance.toLocaleString()}
                                  </div>
                                </td>
                                
                                {/* PTD % Var */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ptdVariancePercent >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ptdVariancePercent >= 0 ? '+' : ''}{item.ptdVariancePercent.toFixed(1)}%
                                  </div>
                                </td>
                                
                                {/* YTD Actual */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-white text-xs">${item.ytdActual.toLocaleString()}</div>
                                </td>
                                
                                {/* YTD Budget */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-gray-300 text-xs">${item.ytdBudget.toLocaleString()}</div>
                                </td>
                                
                                {/* YTD Variance */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ytdVariance >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ytdVariance >= 0 ? '+' : ''}${item.ytdVariance.toLocaleString()}
                                  </div>
                                </td>
                                
                                {/* YTD % Var */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ytdVariancePercent >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ytdVariancePercent >= 0 ? '+' : ''}{item.ytdVariancePercent.toFixed(1)}%
                                  </div>
                                </td>
                                
                                {/* Annual */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-gray-300 text-xs">${item.annual.toLocaleString()}</div>
                                </td>
                                
                                {/* Status */}
                                <td className="py-2 px-2">
                                  {item.hasComment ? (
                                    <Badge className="bg-green-600 text-green-100 text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Submitted
                                    </Badge>
                                  ) : (
                                    <Badge className={`text-xs ${
                                      item.urgency === 'high' 
                                        ? 'bg-red-600 text-red-100' 
                                        : item.urgency === 'medium'
                                        ? 'bg-orange-600 text-orange-100'
                                        : 'bg-yellow-600 text-yellow-100'
                                    }`}>
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      {item.urgency === 'high' ? 'Due Now' : item.urgency === 'medium' ? 'Due Soon' : 'Review'}
                                    </Badge>
                                  )}
                                </td>
                                
                                {/* AI Suggestion */}
                                <td className="py-2 px-2 max-w-xs">
                                  <div className="text-gray-300 text-xs leading-tight mb-1">{item.aiSuggestion}</div>
                                  <div className="flex items-center gap-1">
                                    <Bot className="h-3 w-3 text-purple-400" />
                                    <span className="text-xs text-purple-300">AI Assist</span>
                                  </div>
                                </td>
                                
                                {/* Action */}
                                <td className="py-2 px-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVarianceItem(item)
                                      setVarianceCommentForm({
                                        comment: item.comment || '',
                                        reason: item.reason || '',
                                        correctiveAction: ''
                                      })
                                      setVarianceCommentDialog(true)
                                    }}
                                    className={`text-xs px-2 py-1 ${
                                      item.hasComment 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                  >
                                    {item.hasComment ? (
                                      <>
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </>
                                    ) : (
                                      <>
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Add
                                      </>
                                    )}
                                  </Button>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Submitted Comments Table */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Submitted Comments - Completed Variance Explanations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                      <table className="min-w-full text-xs">
                        <thead className="border-b border-gray-600 sticky top-0 bg-gray-800">
                          <tr>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">Account</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">PTD Actual</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">PTD Budget</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">Variance</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">% Var</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">YTD Actual</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">YTD Budget</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">Variance</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">% Var</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-medium">Annual</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">Status</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">AI Suggestion</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Mock submitted variance comments - GL Report Format
                            const submittedVarianceItems = [
                              {
                                id: 101,
                                property: 'Mission Bay',
                                propertyCode: 'mb401',
                                glCode: '5200', 
                                glName: 'Total Turnover',
                                subGL: '5235 - Kitchen Renovations',
                                ptdActual: 17213,
                                ptdBudget: 31379,
                                ptdVariance: -14166,
                                ptdVariancePercent: -45.1,
                                ytdActual: 78945,
                                ytdBudget: 125000,
                                ytdVariance: -46055,
                                ytdVariancePercent: -36.8,
                                annual: 500000,
                                reason: 'Delayed kitchen renovation projects',
                                hasComment: true,
                                comment: 'Kitchen renovation projects delayed due to permit approval process and appliance supply chain issues. Projects rescheduled for Q1 next year.',
                                aiSuggestion: 'Good explanation. Consider adding timeline for delayed projects and budget carryover plan.',
                                urgency: 'completed',
                                submittedDate: '2024-12-15'
                              },
                              {
                                id: 102,
                                property: 'Stanford GSB',
                                propertyCode: 'ap172',
                                glCode: '6400',
                                glName: 'Total Insurance and Taxes',
                                subGL: '6425 - Property Insurance',
                                ptdActual: 42500,
                                ptdBudget: 35000,
                                ptdVariance: 7500,
                                ptdVariancePercent: 21.4,
                                ytdActual: 170000,
                                ytdBudget: 140000,
                                ytdVariance: 30000,
                                ytdVariancePercent: 21.4,
                                annual: 560000,
                                reason: 'Insurance premium increase due to market conditions',
                                hasComment: true,
                                comment: 'Property insurance premiums increased 21% due to current market conditions and increased property values. Rate locked for 3-year term to avoid future volatility.',
                                aiSuggestion: 'Comprehensive explanation covering market factors and future planning.',
                                urgency: 'completed',
                                submittedDate: '2024-12-14'
                              },
                              {
                                id: 103,
                                property: 'Mission Bay',
                                propertyCode: 'mb401',
                                glCode: '7300',
                                glName: 'Total Utilities',
                                subGL: '7315 - Water & Sewer',
                                ptdActual: 18750,
                                ptdBudget: 14000,
                                ptdVariance: 4750,
                                ptdVariancePercent: 33.9,
                                ytdActual: 75000,
                                ytdBudget: 56000,
                                ytdVariance: 19000,
                                ytdVariancePercent: 33.9,
                                annual: 224000,
                                reason: 'Water main leak and increased usage rates',
                                hasComment: true,
                                comment: 'Water costs increased due to undiscovered water main leak in Q3 that was repaired in October. Additionally, municipal water rates increased 8% effective July 1st.',
                                aiSuggestion: 'Clear explanation of both emergency issue and rate changes.',
                                urgency: 'completed',
                                submittedDate: '2024-12-13'
                              },
                              {
                                id: 104,
                                property: 'Stanford GSB',
                                propertyCode: 'ap172',
                                glCode: '5100',
                                glName: 'Total Administration',
                                subGL: '5125 - Legal & Professional',
                                ptdActual: 28900,
                                ptdBudget: 22000,
                                ptdVariance: 6900,
                                ptdVariancePercent: 31.4,
                                ytdActual: 115600,
                                ytdBudget: 88000,
                                ytdVariance: 27600,
                                ytdVariancePercent: 31.4,
                                annual: 352000,
                                reason: 'Tenant lease renegotiation legal fees',
                                hasComment: true,
                                comment: 'Higher legal fees due to complex lease renegotiation with anchor tenant. Process required additional legal counsel specializing in retail leases, resulting in favorable 10-year extension.',
                                aiSuggestion: 'Excellent detail on ROI justification for legal expenses.',
                                urgency: 'completed',
                                submittedDate: '2024-12-12'
                              },
                              {
                                id: 105,
                                property: 'Mission Bay',
                                propertyCode: 'mb401',
                                glCode: '8200',
                                glName: 'Total Reserves and Replacements',
                                subGL: '8235 - Roof Replacement Reserve',
                                ptdActual: 55000,
                                ptdBudget: 40000,
                                ptdVariance: 15000,
                                ptdVariancePercent: 37.5,
                                ytdActual: 220000,
                                ytdBudget: 160000,
                                ytdVariance: 60000,
                                ytdVariancePercent: 37.5,
                                annual: 640000,
                                reason: 'Accelerated roof replacement due to storm damage',
                                hasComment: true,
                                comment: 'Roof replacement accelerated due to storm damage in September. Insurance covered 70% of costs. New roof includes 20-year warranty and improved energy efficiency features.',
                                aiSuggestion: 'Good coverage of insurance and long-term benefits.',
                                urgency: 'completed',
                                submittedDate: '2024-12-11'
                              },
                              {
                                id: 106,
                                property: 'Stanford GSB',
                                propertyCode: 'ap172',
                                glCode: '7100',
                                glName: 'Total Repairs and Maintenance',
                                subGL: '7145 - Elevator Maintenance',
                                ptdActual: 31200,
                                ptdBudget: 24000,
                                ptdVariance: 7200,
                                ptdVariancePercent: 30.0,
                                ytdActual: 124800,
                                ytdBudget: 96000,
                                ytdVariance: 28800,
                                ytdVariancePercent: 30.0,
                                annual: 384000,
                                reason: 'Elevator modernization and code compliance',
                                hasComment: true,
                                comment: 'Elevator maintenance costs increased due to required modernization to meet new accessibility codes. Work includes controller upgrades and safety system enhancements completed in October.',
                                aiSuggestion: 'Comprehensive explanation of compliance requirements.',
                                urgency: 'completed',
                                submittedDate: '2024-12-10'
                              }
                            ];

                            return submittedVarianceItems
                              .filter(item => selectedVarianceProperty === 'all' || item.property === 
                                getPropertiesForRole('pm').find(p => p.id.toString() === selectedVarianceProperty)?.name)
                              .map((item) => (
                              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                {/* Account Column */}
                                <td className="py-2 px-2">
                                  <div className="text-blue-300 font-medium text-xs">{item.subGL}</div>
                                  <div className="text-purple-300 text-xs">{item.propertyCode} - {item.property}</div>
                                  <div className="text-gray-400 text-xs">{item.glCode} - {item.glName}</div>
                                </td>
                                
                                {/* PTD Actual */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-white text-xs">${item.ptdActual.toLocaleString()}</div>
                                </td>
                                
                                {/* PTD Budget */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-gray-300 text-xs">${item.ptdBudget.toLocaleString()}</div>
                                </td>
                                
                                {/* PTD Variance */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ptdVariance >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ptdVariance >= 0 ? '+' : ''}${item.ptdVariance.toLocaleString()}
                                  </div>
                                </td>
                                
                                {/* PTD % Var */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ptdVariancePercent >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ptdVariancePercent >= 0 ? '+' : ''}{item.ptdVariancePercent.toFixed(1)}%
                                  </div>
                                </td>
                                
                                {/* YTD Actual */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-white text-xs">${item.ytdActual.toLocaleString()}</div>
                                </td>
                                
                                {/* YTD Budget */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-gray-300 text-xs">${item.ytdBudget.toLocaleString()}</div>
                                </td>
                                
                                {/* YTD Variance */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ytdVariance >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ytdVariance >= 0 ? '+' : ''}${item.ytdVariance.toLocaleString()}
                                  </div>
                                </td>
                                
                                {/* YTD % Var */}
                                <td className="py-2 px-2 text-right">
                                  <div className={`text-xs font-semibold ${
                                    item.ytdVariancePercent >= 0 ? 'text-red-300' : 'text-green-300'
                                  }`}>
                                    {item.ytdVariancePercent >= 0 ? '+' : ''}{item.ytdVariancePercent.toFixed(1)}%
                                  </div>
                                </td>
                                
                                {/* Annual */}
                                <td className="py-2 px-2 text-right">
                                  <div className="text-gray-300 text-xs">${item.annual.toLocaleString()}</div>
                                </td>
                                
                                {/* Status */}
                                <td className="py-2 px-2">
                                  <Badge className="bg-green-600 text-green-100 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Submitted
                                  </Badge>
                                  <div className="text-gray-400 text-xs mt-1">{item.submittedDate}</div>
                                </td>
                                
                                {/* AI Suggestion */}
                                <td className="py-2 px-2 max-w-xs">
                                  <div className="text-gray-300 text-xs leading-tight mb-1">{item.aiSuggestion}</div>
                                  <div className="flex items-center gap-1">
                                    <Bot className="h-3 w-3 text-purple-400" />
                                    <span className="text-xs text-purple-300">AI Assist</span>
                                  </div>
                                </td>
                                
                                {/* Action */}
                                <td className="py-2 px-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVarianceItem(item)
                                      setVarianceCommentForm({
                                        comment: item.comment || '',
                                        reason: item.reason || '',
                                        correctiveAction: ''
                                      })
                                      setVarianceCommentDialog(true)
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Variance Comment Dialog */}
                <Dialog open={varianceCommentDialog} onOpenChange={setVarianceCommentDialog}>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        {selectedVarianceItem?.hasComment ? 'Edit' : 'Add'} Variance Comment
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Provide detailed explanation for budget variance for owner review
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedVarianceItem && (
                      <div className="space-y-6">
                        {/* Variance Details */}
                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                          <h4 className="text-red-300 font-medium mb-3">Variance Details</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Property:</span>
                              <span className="text-white ml-2">{selectedVarianceItem.propertyCode} - {selectedVarianceItem.property}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Account:</span>
                              <span className="text-blue-300 ml-2">{selectedVarianceItem.subGL}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">PTD Budget:</span>
                              <span className="text-white ml-2">${selectedVarianceItem.ptdBudget.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">PTD Actual:</span>
                              <span className="text-red-300 ml-2 font-semibold">${selectedVarianceItem.ptdActual.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">PTD Variance:</span>
                              <span className={`ml-2 font-semibold ${selectedVarianceItem.ptdVariance >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                                {selectedVarianceItem.ptdVariance >= 0 ? '+' : ''}${selectedVarianceItem.ptdVariance.toLocaleString()} ({selectedVarianceItem.ptdVariance >= 0 ? '+' : ''}{selectedVarianceItem.ptdVariancePercent.toFixed(1)}%)
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">YTD Variance:</span>
                              <span className={`ml-2 font-semibold ${selectedVarianceItem.ytdVariance >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                                {selectedVarianceItem.ytdVariance >= 0 ? '+' : ''}${selectedVarianceItem.ytdVariance.toLocaleString()} ({selectedVarianceItem.ytdVariance >= 0 ? '+' : ''}{selectedVarianceItem.ytdVariancePercent.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Suggestion */}
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-300 font-medium">AI Writing Suggestion</span>
                          </div>
                          <div className="text-purple-200 text-sm">
                            {selectedVarianceItem.aiSuggestion}
                          </div>
                        </div>

                        {/* Comment Form */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-300 mb-2 block">Variance Explanation</Label>
                            <Textarea
                              value={varianceCommentForm.comment}
                              onChange={(e) => setVarianceCommentForm(prev => ({ ...prev, comment: e.target.value }))}
                              className="bg-gray-800 border-gray-600 text-white h-24"
                              placeholder="Provide detailed explanation of what caused this variance..."
                            />
                          </div>

                          <div>
                            <Label className="text-gray-300 mb-2 block">Root Cause</Label>
                            <Input
                              value={varianceCommentForm.reason}
                              onChange={(e) => setVarianceCommentForm(prev => ({ ...prev, reason: e.target.value }))}
                              className="bg-gray-800 border-gray-600 text-white"
                              placeholder="Emergency repair, code compliance, etc."
                            />
                          </div>

                          <div>
                            <Label className="text-gray-300 mb-2 block">Corrective Action Plan</Label>
                            <Textarea
                              value={varianceCommentForm.correctiveAction}
                              onChange={(e) => setVarianceCommentForm(prev => ({ ...prev, correctiveAction: e.target.value }))}
                              className="bg-gray-800 border-gray-600 text-white h-20"
                              placeholder="Steps being taken to prevent similar overages in the future..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setVarianceCommentDialog(false)}
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Save variance comment
                          alert(`Variance comment saved for ${selectedVarianceItem?.subGL} at ${selectedVarianceItem?.propertyCode}. Owner will be notified.`)
                          setVarianceCommentDialog(false)
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!varianceCommentForm.comment.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Submit Comment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {activeTab === "communications" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Communications</h3>
                    <p className="text-sm text-gray-400">Messaging with property owners, technicians, and central office</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedPropertyFilter} onValueChange={setSelectedPropertyFilter}>
                      <SelectTrigger className="w-64 bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Filter by property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all" className="text-white">All Messages</SelectItem>
                        <SelectItem value="central" className="text-white">Central Office</SelectItem>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.id} className="text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Gmail/Apple Mail Style Layout */}
                <div className="flex h-[700px] bg-gray-900 rounded-lg border border-gray-700">
                  {/* Left Sidebar - Inbox */}
                  <div className="w-1/3 border-r border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                      <h4 className="text-white font-medium">Inbox</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {(() => {
                        const filteredMessages = messages.filter(msg => {
                          if (selectedPropertyFilter === "all") return true;
                          if (selectedPropertyFilter === "central") return msg.type === "property_agnostic";
                          return msg.propertyId === selectedPropertyFilter;
                        });

                        const groupedThreads = filteredMessages.reduce((acc, message) => {
                          const key = message.threadId;
                          if (!acc[key]) {
                            acc[key] = {
                              threadId: message.threadId,
                              propertyId: message.propertyId,
                              propertyName: message.propertyName,
                              type: message.type,
                              lastMessage: message,
                              messages: [],
                              unreadCount: 0
                            };
                          }
                          acc[key].messages.push(message);
                          if (message.timestamp > acc[key].lastMessage.timestamp) {
                            acc[key].lastMessage = message;
                          }
                          if (message.status === "unread") {
                            acc[key].unreadCount++;
                          }
                          return acc;
                        }, {} as any);

                        return Object.values(groupedThreads)
                          .sort((a: any, b: any) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime())
                          .map((thread: any) => (
                            <div
                              key={thread.threadId}
                              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                                selectedCommThread === thread.threadId ? 'bg-gray-800 border-l-4 border-l-blue-500' : ''
                              }`}
                              onClick={() => setSelectedCommThread(thread.threadId)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {thread.type === "property_agnostic" || thread.type === "nudge" ? (
                                    <Building className="h-4 w-4 text-blue-400" />
                                  ) : (
                                    <Home className="h-4 w-4 text-green-400" />
                                  )}
                                  <span className="font-medium text-white text-sm truncate">
                                    {thread.propertyName}
                                  </span>
                                </div>
                                {thread.unreadCount > 0 && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 mb-1">
                                {thread.lastMessage.senderName}
                              </div>
                              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                                {thread.lastMessage.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {new Date(thread.lastMessage.timestamp).toLocaleDateString()}
                                </span>
                                <Badge className="bg-gray-700 text-gray-300 text-xs">
                                  {thread.messages.length}
                                </Badge>
                              </div>
                            </div>
                          ));
                      })()}

                      {messages.length === 0 && (
                        <div className="p-8 text-center">
                          <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No messages</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Conversation View */}
                  <div className="flex-1 flex flex-col">
                    {selectedCommThread ? (() => {
                                             const thread = (() => {
                         const filteredMessages = messages.filter(msg => {
                           if (selectedPropertyFilter === "all") return true;
                           if (selectedPropertyFilter === "central") return msg.type === "property_agnostic";
                           return msg.propertyId === selectedPropertyFilter;
                         });

                         const groupedThreads = filteredMessages.reduce((acc, message) => {
                           const key = message.threadId;
                           if (!acc[key]) {
                             acc[key] = {
                               threadId: message.threadId,
                               propertyId: message.propertyId,
                               propertyName: message.propertyName,
                               type: message.type,
                               lastMessage: message,
                               messages: [],
                               unreadCount: 0
                             };
                           }
                           acc[key].messages.push(message);
                           if (message.timestamp > acc[key].lastMessage.timestamp) {
                             acc[key].lastMessage = message;
                           }
                           if (message.status === "unread") {
                             acc[key].unreadCount++;
                           }
                           return acc;
                         }, {} as any);

                         return Object.values(groupedThreads).find((t: any) => t.threadId === selectedCommThread) as any;
                       })();

                      if (!thread) return null;

                      return (
                        <>
                          {/* Thread Header */}
                          <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.type === "property_agnostic" || thread.type === "nudge" ? (
                                <Building className="h-5 w-5 text-blue-400" />
                              ) : (
                                <Home className="h-5 w-5 text-green-400" />
                              )}
                              <h4 className="text-white font-medium">{thread.propertyName}</h4>
                              {thread.type === "nudge" && (
                                <Badge className="bg-orange-600 text-white text-xs">Nudge</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{thread.messages.length} messages</p>
                          </div>

                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {thread.messages
                              .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                              .map((message: any) => (
                                <div
                                  key={message.id}
                                  className={`flex gap-3 ${
                                    message.senderRole === role ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div
                                    className={`max-w-[70%] rounded-lg px-4 py-3 ${
                                      message.type === 'nudge'
                                        ? 'bg-orange-600/20 border border-orange-500/30 text-orange-100'
                                        : message.senderRole === role
                                        ? 'bg-blue-600 text-white'
                                        : message.senderRole === 'owner'
                                        ? 'bg-green-600 text-white'
                                        : message.senderRole === 'centralOffice'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium">
                                        {message.senderName}
                                      </span>
                                      {message.type === 'nudge' && (
                                        <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                                          <Send className="h-3 w-3 mr-1" />
                                          Nudge
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-2">
                                      {new Date(message.timestamp).toLocaleDateString()} at{' '}
                                      {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Reply Box */}
                          <div className="border-t border-gray-700 p-4">
                            <div className="flex gap-2">
                              <Textarea
                                value={communicationMessage}
                                onChange={(e) => setCommunicationMessage(e.target.value)}
                                placeholder="Type your reply..."
                                className="flex-1 bg-gray-800 border-gray-600 text-white resize-none"
                                rows={3}
                              />
                              <Button
                                onClick={() => {
                                  if (communicationMessage.trim()) {
                                    const newMessage = {
                                      id: Date.now().toString(),
                                      propertyId: thread.propertyId,
                                      propertyName: thread.propertyName,
                                      senderId: role === 'pm' ? 'pm1' : role === 'technician' ? 'tech1' : 'co1',
                                      senderName: role === 'pm' ? 'Property Manager' : role === 'technician' ? 'Technician' : 'Central Office',
                                      senderRole: role,
                                      content: communicationMessage,
                                      timestamp: new Date(),
                                      status: "sent",
                                      threadId: thread.threadId,
                                      type: thread.type
                                    };
                                    setMessages(prev => [...prev, newMessage]);
                                    setCommunicationMessage("");
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white self-end"
                                disabled={!communicationMessage.trim()}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </div>
                          </div>
                        </>
                      );
                    })() : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-300 mb-2">Select a conversation</h4>
                          <p className="text-gray-500">Choose a thread from the inbox to start messaging</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {activeTab === "reporting" && role === 'centralOffice' && (
              <>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Reporting</h2>
                    <p className="text-sm text-gray-400">Generate high-fidelity exports for bookkeeping, tax prep, and compliance</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Filters Panel */}
                    <div className="lg:col-span-1">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center justify-between">
                            <span>Filters</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReportDateRange({ from: "", to: "" });
                                setReportSelectedProperties([]);
                                setReportSelectedGLCodes([]);
                                setReportSelectedExpenseStatus([]);
                                setReportSelectedTrustAccount("all");
                              }}
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            >
                              Clear All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Date Range */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Date Range</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <Label className="text-gray-400 text-xs">From</Label>
                                <Input
                                  type="date"
                                  value={reportDateRange.from}
                                  onChange={(e) => setReportDateRange(prev => ({ ...prev, from: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-gray-400 text-xs">To</Label>
                                <Input
                                  type="date"
                                  value={reportDateRange.to}
                                  onChange={(e) => setReportDateRange(prev => ({ ...prev, to: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Properties */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Properties</Label>
                            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                              {reportPropertyOptions.map((property) => (
                                <div key={property} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={property}
                                    checked={reportSelectedProperties.includes(property)}
                                    onChange={() => {
                                      setReportSelectedProperties(prev => 
                                        prev.includes(property) 
                                          ? prev.filter(p => p !== property)
                                          : [...prev, property]
                                      );
                                    }}
                                    className="rounded bg-gray-700 border-gray-600"
                                  />
                                  <Label htmlFor={property} className="text-white text-xs cursor-pointer">
                                    {property}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* GL Codes */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">GL Codes</Label>
                            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                              {reportGlCodeOptions.map((code) => (
                                <div key={code} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={code}
                                    checked={reportSelectedGLCodes.includes(code)}
                                    onChange={() => {
                                      setReportSelectedGLCodes(prev => 
                                        prev.includes(code) 
                                          ? prev.filter(c => c !== code)
                                          : [...prev, code]
                                      );
                                    }}
                                    className="rounded bg-gray-700 border-gray-600"
                                  />
                                  <Label htmlFor={code} className="text-white text-xs cursor-pointer">
                                    {code}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Expense Status */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Expense Status</Label>
                            <div className="mt-2 space-y-2">
                              {reportExpenseStatusOptions.map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={status}
                                    checked={reportSelectedExpenseStatus.includes(status)}
                                    onChange={() => {
                                      setReportSelectedExpenseStatus(prev => 
                                        prev.includes(status) 
                                          ? prev.filter(s => s !== status)
                                          : [...prev, status]
                                      );
                                    }}
                                    className="rounded bg-gray-700 border-gray-600"
                                  />
                                  <Label htmlFor={status} className="text-white text-xs cursor-pointer">
                                    {status}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trust Account */}
                          <div>
                            <Label className="text-gray-300 text-sm font-medium">Trust Account (Optional)</Label>
                            <Select value={reportSelectedTrustAccount} onValueChange={setReportSelectedTrustAccount}>
                              <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="All trust accounts" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="all" className="text-white">All trust accounts</SelectItem>
                                {reportTrustAccountOptions.map((account) => (
                                  <SelectItem key={account} value={account} className="text-white">
                                    {account}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Report Types Panel */}
                    <div className="lg:col-span-2">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Report Types</CardTitle>
                          <p className="text-sm text-gray-400">Select the type of report you want to generate</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {reportTypes.map((report) => (
                            <div
                              key={report.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                reportType === report.id
                                  ? "border-blue-500 bg-blue-900/20"
                                  : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                              }`}
                              onClick={() => setReportType(report.id)}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <input
                                  type="radio"
                                  id={report.id}
                                  name="reportType"
                                  checked={reportType === report.id}
                                  onChange={() => setReportType(report.id)}
                                  className="text-blue-600"
                                />
                                <Label htmlFor={report.id} className="text-white font-medium cursor-pointer">
                                  {report.name}
                                </Label>
                              </div>
                              <p className="text-sm text-gray-300 ml-6">{report.description}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Generate Report Section */}
                      <Card className="bg-gray-800 border-gray-700 mt-6">
                        <CardHeader>
                          <CardTitle className="text-white">Generate Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-gray-700 rounded-lg p-4">
                              <h4 className="font-medium text-white mb-2">Active Filters Summary</h4>
                              <div className="text-sm text-gray-300 space-y-1">
                                <div>
                                  <span className="font-medium">Date Range:</span> {
                                    reportDateRange.from && reportDateRange.to 
                                      ? `${reportDateRange.from} to ${reportDateRange.to}`
                                      : "All time"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Properties:</span> {
                                    reportSelectedProperties.length > 0 
                                      ? `${reportSelectedProperties.length} selected`
                                      : "All properties"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">GL Codes:</span> {
                                    reportSelectedGLCodes.length > 0 
                                      ? `${reportSelectedGLCodes.length} selected`
                                      : "All GL codes"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Expense Status:</span> {
                                    reportSelectedExpenseStatus.length > 0 
                                      ? `${reportSelectedExpenseStatus.length} selected`
                                      : "All statuses"
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Trust Account:</span> {
                                    reportSelectedTrustAccount === "all" ? "All trust accounts" : reportSelectedTrustAccount
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                              <h4 className="font-medium text-blue-300 mb-2">Export Options</h4>
                              <div className="text-sm text-blue-200 mb-4">
                                Reports will include:
                                <ul className="mt-2 space-y-1 ml-4">
                                  <li>• Generated timestamp</li>
                                  <li>• Applied filters summary</li>
                                  <li>• Receipt links (where available)</li>
                                  <li>• Formatted tables matching expense views</li>
                                </ul>
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleGenerateExportReport('csv')}
                                  disabled={isGeneratingReport}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  {isGeneratingReport ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                                      Generate CSV
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleGenerateExportReport('pdf')}
                                  disabled={isGeneratingReport}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {isGeneratingReport ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Generate PDF
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            id: 'trust-reconciliation-recent',
                            name: 'Trust Account Reconciliation Report',
                            generatedOn: '2024-07-08 14:30:22',
                            scope: 'All properties',
                            format: 'csv'
                          },
                          {
                            id: 'annual-expense-tax-recent',
                            name: 'Annual Expense Summary for Tax Filing',
                            generatedOn: '2024-07-07 09:15:45',
                            scope: 'YTD',
                            format: 'pdf'
                          },
                          {
                            id: 'flagged-expense-recent',
                            name: 'Flagged Expense Report',
                            generatedOn: '2024-07-05 16:22:18',
                            scope: 'Q2 2024',
                            format: 'csv'
                          }
                        ].map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div>
                              <div className="text-white font-medium">{report.name}</div>
                              <div className="text-sm text-gray-400">Generated on: {report.generatedOn} • {report.scope} • {report.format.toUpperCase()}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-gray-600 border-gray-500 text-white"
                                onClick={() => handleRecentReportDownload(report)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-gray-600 border-gray-500 text-white"
                                onClick={() => handleRecentReportEmail(report)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Regenerate
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "smart-insights" && <SmartInsightsTab role={role} />}
            {/* Floating Smart Assist Button */}
            <button
              className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setSmartAssistOpen(true)}
              aria-label="Open Smart Assist Chat"
            >
              <Sparkles className="h-7 w-7" />
            </button>

            {/* Smart Assist Drawer */}
            <Sheet open={smartAssistOpen} onOpenChange={setSmartAssistOpen}>
              <SheetContent side="right" className="w-full max-w-md bg-gray-900 border-l border-gray-700 p-0 flex flex-col">
                <SheetHeader className="p-6 pb-2">
                  <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-white"><Sparkles className="h-5 w-5 text-blue-400" /> Smart Assist</SheetTitle>
                  <SheetDescription className="text-gray-400">Ask any question about your properties, jobs, or expenses!</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-800 rounded p-4">
                  {smartAssistChat.length === 0 && (
                    <div className="text-gray-400 text-sm">Ask any question about your properties, jobs, or expenses!</div>
                  )}
                  {smartAssistChat.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-200'}`}>
                        {msg.content}
                  </div>
                </div>
                  ))}
                </div>
                <div className="flex gap-2 p-4 border-t border-gray-700 bg-gray-900">
                  <Input
                    className="bg-gray-800 border-gray-600 text-white flex-1"
                    placeholder="Ask a question..."
                    value={smartAssistInput}
                    onChange={e => setSmartAssistInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSmartAssistSend(); }}
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSmartAssistSend}>
                    <Send className="h-4 w-4 mr-1" /> Ask
                  </Button>
                          </div>
              </SheetContent>
            </Sheet>

            {/* New Work Order Dialog */}
            <Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>New Work Order</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Fill out the details to create a new work order.
                  </DialogDescription>
                </DialogHeader>
                      <div className="space-y-4">
                  {/* Property Dropdown */}
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={newWorkOrder.property}
                      onValueChange={value => setNewWorkOrder(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.property && <div className="text-red-400 text-xs mt-1">{formErrors.property}</div>}
                              </div>
                  {/* Work Order Name */}
                  <div>
                    <Label className="text-gray-300">Work Order Name</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white w-full"
                      placeholder="Enter work order name/description"
                      value={newWorkOrder.description}
                      onChange={e => setNewWorkOrder(prev => ({ ...prev, description: e.target.value }))}
                    />
                    {formErrors.description && <div className="text-red-400 text-xs mt-1">{formErrors.description}</div>}
                            </div>
                  {/* Estimated Cost Dropdown */}
                  <div>
                    <Label className="text-gray-300">Estimated Cost</Label>
                    <Select
                      value={newWorkOrder.cost ? (Number(newWorkOrder.cost) >= 1000 ? '1000+' : '<1000') : ''}
                      onValueChange={value => setNewWorkOrder(prev => ({ ...prev, cost: value === '1000+' ? '1000' : '999' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select estimated cost" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="<1000" className="bg-gray-900 text-white">Less than $1,000</SelectItem>
                        <SelectItem value="1000+" className="bg-gray-900 text-white">$1,000 or more</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.cost && <div className="text-red-400 text-xs mt-1">{formErrors.cost}</div>}
                  </div>
                  {/* Priority Dropdown */}
                  <div>
                    <Label className="text-gray-300">Priority</Label>
                    <Select
                      value={newWorkOrder.priority}
                      onValueChange={value => setNewWorkOrder(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Low" className="bg-gray-900 text-white">Low</SelectItem>
                        <SelectItem value="Medium" className="bg-gray-900 text-white">Medium</SelectItem>
                        <SelectItem value="High" className="bg-gray-900 text-white">High</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.priority && <div className="text-red-400 text-xs mt-1">{formErrors.priority}</div>}
                  </div>
                </div>
                <DialogFooter className="mt-4">
                              <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateWorkOrder}
                  >
                    Create Work Order
                              </Button>
                              <Button
                                variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setNewJobDialogOpen(false)}
                  >
                    Cancel
                              </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Work Order Dialog */}
            <Dialog open={editJobDialogOpen} onOpenChange={setEditJobDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Work Order</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Update the details for this work order.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Property Dropdown */}
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={editJobForm.property}
                      onValueChange={value => setEditJobForm(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                      </div>
                  {/* Work Order Name */}
                          <div>
                    <Label className="text-gray-300">Work Order Name</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white w-full"
                      placeholder="Enter work order name/description"
                      value={editJobForm.description}
                      onChange={e => setEditJobForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                            </div>
                  {/* Estimated Cost Dropdown */}
                          <div>
                    <Label className="text-gray-300">Estimated Cost</Label>
                    <Select
                      value={editJobForm.cost ? (Number(editJobForm.cost) >= 1000 ? '1000+' : '<1000') : ''}
                      onValueChange={value => setEditJobForm(prev => ({ ...prev, cost: value === '1000+' ? '1000' : '999' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select estimated cost" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="<1000" className="bg-gray-900 text-white">Less than $1,000</SelectItem>
                        <SelectItem value="1000+" className="bg-gray-900 text-white">$1,000 or more</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                  {/* Priority Dropdown */}
                          <div>
                    <Label className="text-gray-300">Priority</Label>
                    <Select
                      value={editJobForm.priority}
                      onValueChange={value => setEditJobForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Low" className="bg-gray-900 text-white">Low</SelectItem>
                        <SelectItem value="Medium" className="bg-gray-900 text-white">Medium</SelectItem>
                        <SelectItem value="High" className="bg-gray-900 text-white">High</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                          </div>
                <DialogFooter className="mt-4">
                        <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleUpdateWorkOrder}
                    disabled={!editJobForm.property || !editJobForm.description}
                  >
                    Update Work Order
                        </Button>
                        <Button 
                          variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => setEditJobDialogOpen(false)}
                  >
                    Cancel
                        </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Flag Invoice Dialog */}
            <Dialog open={flagInvoiceDialogOpen} onOpenChange={setFlagInvoiceDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Flag Invoice for Approval</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Flag this invoice to Central Office or Owner for payment approval.
                  </DialogDescription>
                </DialogHeader>
                {selectedInvoiceForFlagging && (
                  <div className="space-y-4">
                    {/* Invoice Details */}
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div><strong>Vendor:</strong> {selectedInvoiceForFlagging.vendor}</div>
                        <div><strong>Amount:</strong> ${selectedInvoiceForFlagging.amount.toFixed(2)}</div>
                        <div><strong>Invoice #:</strong> {selectedInvoiceForFlagging.invoiceNumber}</div>
                        <div><strong>Due Date:</strong> {selectedInvoiceForFlagging.dueDate}</div>
                      </div>
                    </div>

                    {/* Flag To Selection */}
                    <div>
                      <Label className="text-gray-300">Flag To</Label>
                      <Select value={flagInvoiceForm.flaggedTo} onValueChange={v => setFlagInvoiceForm(f => ({ ...f, flaggedTo: v as 'co' | 'owner' }))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="co">Central Office</SelectItem>
                          <SelectItem value="owner">Property Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reason */}
                    <div>
                      <Label className="text-gray-300">Reason for Flagging</Label>
                      <Textarea 
                        className="bg-gray-800 border-gray-600 text-white resize-none" 
                        rows={3}
                        value={flagInvoiceForm.reason} 
                        onChange={e => setFlagInvoiceForm(f => ({ ...f, reason: e.target.value }))} 
                        placeholder="Explain why this invoice needs approval (e.g., amount exceeds limit, requires special authorization, etc.)" 
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFlagInvoiceDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white" 
                    disabled={!flagInvoiceForm.reason.trim()} 
                    onClick={handleFlagInvoice}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag for Approval
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Payment Request Dialog */}
            <Dialog open={pingPaymentDialogOpen} onOpenChange={setPingPaymentDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Payment</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send a payment request for this invoice.
                  </DialogDescription>
                </DialogHeader>
                {selectedInvoiceForPing && (
                  <div className="space-y-4">
                    {/* Invoice Details */}
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div><strong>Vendor:</strong> {selectedInvoiceForPing.vendor}</div>
                        <div><strong>Amount:</strong> ${selectedInvoiceForPing.amount.toFixed(2)}</div>
                        <div><strong>Invoice #:</strong> {selectedInvoiceForPing.invoiceNumber}</div>
                        <div><strong>Due Date:</strong> {selectedInvoiceForPing.dueDate}</div>
                      </div>
                    </div>

                    {/* Recipient Selection */}
                    <div>
                      <Label className="text-gray-300">Send Payment Request To</Label>
                      <Select value={pingRecipient} onValueChange={v => setPingRecipient(v as 'co' | 'owner')}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="co">Central Office</SelectItem>
                          <SelectItem value="owner">Property Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Message */}
                    <div>
                      <Label className="text-gray-300">Message (Optional)</Label>
                      <Textarea 
                        className="bg-gray-800 border-gray-600 text-white resize-none" 
                        rows={3}
                        value={pingMessage} 
                        onChange={e => setPingMessage(e.target.value)} 
                        placeholder="Add any additional notes about this payment request..." 
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPingPaymentDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={handlePingOwner}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Send Payment Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* New Expense Dialog */}
            <Dialog open={newExpenseDialogOpen} onOpenChange={setNewExpenseDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter the details for the new expense. It will be added to the "Needs Review" table.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Expense Type Selection */}
                  <div>
                    <Label className="text-gray-300">Expense Type</Label>
                    <Select value={mainExpenseForm.expenseType} onValueChange={v => setMainExpenseForm(f => ({ ...f, expenseType: v as 'credit_card' | 'invoice' }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="credit_card">Credit Card Expense</SelectItem>
                        <SelectItem value="invoice">Invoice Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">
                        {mainExpenseForm.expenseType === 'invoice' ? 'Vendor/Company' : 'Merchant'}
                      </Label>
                      <Input 
                        className="bg-gray-800 border-gray-600 text-white" 
                        value={mainExpenseForm.vendor} 
                        onChange={e => setMainExpenseForm(f => ({ ...f, vendor: e.target.value }))} 
                        placeholder={mainExpenseForm.expenseType === 'invoice' ? 'Vendor company name' : 'Merchant name'} 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Amount</Label>
                      <Input 
                        className="bg-gray-800 border-gray-600 text-white" 
                        type="number" 
                        step="0.01"
                        value={mainExpenseForm.amount} 
                        onChange={e => setMainExpenseForm(f => ({ ...f, amount: e.target.value }))} 
                        placeholder="0.00" 
                      />
                    </div>
                  </div>

                  {/* Invoice-specific fields */}
                  {mainExpenseForm.expenseType === 'invoice' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Invoice Number</Label>
                        <Input 
                          className="bg-gray-800 border-gray-600 text-white" 
                          value={mainExpenseForm.invoiceNumber} 
                          onChange={e => setMainExpenseForm(f => ({ ...f, invoiceNumber: e.target.value }))} 
                          placeholder="INV-2025-001" 
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Due Date</Label>
                        <Input 
                          className="bg-gray-800 border-gray-600 text-white" 
                          type="date"
                          value={mainExpenseForm.dueDate} 
                          onChange={e => setMainExpenseForm(f => ({ ...f, dueDate: e.target.value }))} 
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Made By</Label>
                      <Input 
                        className="bg-gray-800 border-gray-600 text-white" 
                        value={mainExpenseForm.madeBy} 
                        onChange={e => setMainExpenseForm(f => ({ ...f, madeBy: e.target.value }))} 
                        placeholder="Name" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Billable</Label>
                      <Select value={mainExpenseForm.billable ? 'yes' : 'no'} onValueChange={v => setMainExpenseForm(f => ({ ...f, billable: v === 'yes' }))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Memo/Description</Label>
                    <Input 
                      className="bg-gray-800 border-gray-600 text-white" 
                      value={mainExpenseForm.memo} 
                      onChange={e => setMainExpenseForm(f => ({ ...f, memo: e.target.value }))} 
                      placeholder="Description of expense" 
                    />
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <Label className="text-gray-300">
                      {mainExpenseForm.expenseType === 'invoice' ? 'Supporting Documents' : 'Receipt'}
                    </Label>
                    <Input 
                      className="bg-gray-800 border-gray-600 text-white"
                      type="file" 
                      multiple={mainExpenseForm.expenseType === 'invoice'}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        if (mainExpenseForm.expenseType === 'invoice') {
                          setMainExpenseForm(f => ({ ...f, supportingDocs: files }));
                        } else {
                          setMainExpenseForm(f => ({ ...f, receipt: files[0]?.name || '' }));
                        }
                      }} 
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {mainExpenseForm.expenseType === 'invoice' 
                        ? 'Upload invoice, receipts, and supporting documents (PDF, JPG, PNG)'
                        : 'Upload receipt (PDF, JPG, PNG)'
                      }
                    </div>
                    {mainExpenseForm.expenseType === 'invoice' && mainExpenseForm.supportingDocs.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {mainExpenseForm.supportingDocs.map((file, idx) => (
                          <div key={idx} className="text-xs text-green-400 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {mainExpenseForm.expenseType === 'credit_card' && mainExpenseForm.receipt && (
                      <div className="text-xs text-green-400 flex items-center gap-2 mt-2">
                        <CheckCircle className="h-3 w-3" />
                        {mainExpenseForm.receipt}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewExpenseDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                                    <Button
                    className="bg-blue-600 hover:bg-blue-700" 
                    disabled={
                      !mainExpenseForm.vendor || 
                      !mainExpenseForm.amount || 
                      !mainExpenseForm.madeBy ||
                      (mainExpenseForm.expenseType === 'invoice' && !mainExpenseForm.invoiceNumber)
                    } 
                                      onClick={() => {
                      // Add new expense to transactions with pending status
                      const newExpense: Transaction = {
                        id: `${mainExpenseForm.expenseType === 'invoice' ? 'inv' : 'txn'}-${Date.now()}`,
                        date: new Date().toISOString().split('T')[0],
                        vendor: mainExpenseForm.vendor,
                        amount: Number(mainExpenseForm.amount),
                        status: 'pending',
                        billable: mainExpenseForm.billable,
                        jobId: '', // No job assigned initially
                        madeBy: mainExpenseForm.madeBy,
                        memo: mainExpenseForm.memo,
                        receipt: mainExpenseForm.receipt,
                        expenseType: mainExpenseForm.expenseType,
                        ...(mainExpenseForm.expenseType === 'invoice' && {
                          invoiceNumber: mainExpenseForm.invoiceNumber,
                          dueDate: mainExpenseForm.dueDate,
                          supportingDocs: mainExpenseForm.supportingDocs.map(f => f.name)
                        })
                      };
                      
                      setTransactions(prev => [...prev, newExpense]);
                      setNewExpenseDialogOpen(false);
                      setMainExpenseForm({ 
                        vendor: '', 
                        amount: '', 
                        madeBy: '', 
                        billable: true, 
                        memo: '', 
                        receipt: '',
                        expenseType: 'credit_card',
                        invoiceNumber: '',
                        dueDate: '',
                        supportingDocs: []
                      });
                    }}
                  >
                    Add Expense
                                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Transaction Details Dialog */}
            <Dialog open={transactionDetailsOpen} onOpenChange={setTransactionDetailsOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Transaction Details</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    View the details for this transaction.
                  </DialogDescription>
                </DialogHeader>
                {selectedTransaction ? (
                  <div className="space-y-2">
                    <div><b>Date:</b> {selectedTransaction.date}</div>
                    <div><b>Merchant:</b> {selectedTransaction.vendor}</div>
                    <div><b>Amount:</b> ${selectedTransaction.amount.toFixed(2)}</div>
                    <div><b>Made By:</b> {selectedTransaction.madeBy}</div>
                    <div><b>Status:</b> {selectedTransaction.status}</div>
                    <div><b>Billable:</b> {selectedTransaction.billable ? 'Yes' : 'No'}</div>
                    <div><b>Memo:</b> {selectedTransaction.memo || '-'}</div>
                    <div><b>Receipt:</b> {selectedTransaction.receipt ? (
                      <a
                        href={`/receipts/${selectedTransaction.receipt}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-200"
                      >
                        Download Receipt
                      </a>
                    ) : (
                      '-'
                    )}
                                  </div>
                                </div>
                ) : (
                  <div>No transaction selected.</div>
                )}
              </DialogContent>
            </Dialog>

            {/* New Transaction Dialog - Central Office Only */}
            <Dialog open={newTransactionDialogOpen} onOpenChange={setNewTransactionDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Manually add a new transaction to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Date</Label>
                    <Input
                      type="date"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.date}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                                  </div>
                  <div>
                    <Label className="text-gray-300">Vendor/Merchant</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.vendor}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Merchant name"
                    />
                                </div>
                  <div>
                    <Label className="text-gray-300">Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.amount}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                            </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.madeBy}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, madeBy: e.target.value }))}
                      placeholder="Person name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Card Holder</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.cardHolder}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                      placeholder="Card holder name"
                    />
                </div>
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={newTransactionForm.property}
                      onValueChange={value => setNewTransactionForm(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </div>
                  <div>
                    <Label className="text-gray-300">Work Order (Optional)</Label>
                    <Select
                      value={newTransactionForm.job}
                      onValueChange={value => setNewTransactionForm(prev => ({ ...prev, job: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select work order" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="none" className="bg-gray-900 text-white">No work order</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                            {job.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select
                      value={newTransactionForm.billable ? 'yes' : 'no'}
                      onValueChange={value => setNewTransactionForm(prev => ({ ...prev, billable: value === 'yes' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                      </SelectContent>
                    </Select>
            </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Memo</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.memo}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, memo: e.target.value }))}
                      placeholder="Transaction description/memo"
                    />
                </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Receipt</Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      className="bg-gray-800 border-gray-600 text-white"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        setNewTransactionForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                      }}
                    />
                    {newTransactionForm.receipt && (
                      <span className="text-xs text-green-400 mt-1">{newTransactionForm.receipt}</span>
                    )}
                </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCreateNewTransaction}
                    disabled={!newTransactionForm.date || !newTransactionForm.vendor || !newTransactionForm.amount || !newTransactionForm.madeBy || !newTransactionForm.cardHolder || !newTransactionForm.property || !newTransactionForm.memo}
                  >
                    Create Transaction
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setNewTransactionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Transaction Dialog - Central Office Only */}
            <Dialog open={editTransactionDialogOpen} onOpenChange={setEditTransactionDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Transaction</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Edit the details of this transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Date</Label>
                    <Input
                      type="date"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.date}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                        </div>
                        <div>
                    <Label className="text-gray-300">Vendor/Merchant</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.vendor}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Merchant name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.amount}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                      </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.madeBy}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, madeBy: e.target.value }))}
                      placeholder="Person name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Card Holder</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.cardHolder}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                      placeholder="Card holder name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={editTransactionForm.property}
                      onValueChange={value => setEditTransactionForm(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                        </div>
                  <div>
                    <Label className="text-gray-300">Work Order (Optional)</Label>
                    <Select
                      value={editTransactionForm.job}
                      onValueChange={value => setEditTransactionForm(prev => ({ ...prev, job: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select work order" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="none" className="bg-gray-900 text-white">No work order</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                            {job.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                        </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select
                      value={editTransactionForm.billable ? 'yes' : 'no'}
                      onValueChange={value => setEditTransactionForm(prev => ({ ...prev, billable: value === 'yes' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                      </SelectContent>
                    </Select>
                        </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Memo</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.memo}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, memo: e.target.value }))}
                      placeholder="Transaction description/memo"
                    />
                      </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Receipt</Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      className="bg-gray-800 border-gray-600 text-white"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        setEditTransactionForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                      }}
                    />
                    {editTransactionForm.receipt && (
                      <span className="text-xs text-green-400 mt-1">{editTransactionForm.receipt}</span>
                    )}
                        </div>
                        </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleUpdateTransaction}
                    disabled={!editTransactionForm.date || !editTransactionForm.vendor || !editTransactionForm.amount || !editTransactionForm.madeBy || !editTransactionForm.cardHolder || !editTransactionForm.property || !editTransactionForm.memo}
                  >
                    Update Transaction
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setEditTransactionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add New Question Dialog - Policy Tab */}
            <Dialog open={newQuestionDialogOpen} onOpenChange={setNewQuestionDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Expense Question</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new question to the expense decision tracker.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Question</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newQuestion.question}
                      onChange={e => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter the expense question..."
                      rows={3}
                    />
                          </div>
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Select
                      value={newQuestion.category}
                      onValueChange={value => setNewQuestion(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="General" className="bg-gray-900 text-white">General</SelectItem>
                        <SelectItem value="Categorization" className="bg-gray-900 text-white">Categorization</SelectItem>
                        <SelectItem value="Documentation" className="bg-gray-900 text-white">Documentation</SelectItem>
                        <SelectItem value="Approval" className="bg-gray-900 text-white">Approval</SelectItem>
                        <SelectItem value="Emergency" className="bg-gray-900 text-white">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                          </div>
                          </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (newQuestion.question.trim()) {
                        setExpenseQuestions(prev => [
                          ...prev,
                          {
                            id: Math.max(...prev.map(q => q.id)) + 1,
                            question: newQuestion.question.trim(),
                            answer: null,
                            timestamp: null,
                            category: newQuestion.category
                          }
                        ]);
                        setNewQuestion({ question: '', category: 'General' });
                        setNewQuestionDialogOpen(false);
                      }
                    }}
                    disabled={!newQuestion.question.trim()}
                  >
                    Add Question
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setNewQuestion({ question: '', category: 'General' });
                      setNewQuestionDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Help Request Dialog - Technician to Central Office */}
            <Dialog open={helpRequestDialogOpen} onOpenChange={setHelpRequestDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ask Central Office for Help</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Submit a question about expense policies or categorization. The central office will review and respond.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                          <div>
                    <Label className="text-gray-300">Related Expense (Optional)</Label>
                    <Select
                      value={helpRequestForm.expenseId}
                      onValueChange={value => setHelpRequestForm(prev => ({ ...prev, expenseId: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select an expense (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="none" className="bg-gray-900 text-white">No specific expense</SelectItem>
                        {[...transactions, ...technicianTransactions]
                          .filter(txn => txn.cardHolder === technicianName)
                          .map(txn => (
                            <SelectItem key={txn.id} value={txn.id} className="bg-gray-900 text-white">
                              {txn.date} - {txn.vendor} - ${txn.amount.toFixed(2)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                          </div>
                          <div>
                    <Label className="text-gray-300">Your Question *</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={helpRequestForm.question}
                      onChange={e => setHelpRequestForm(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="What would you like to ask about this expense or expense policy?"
                      rows={4}
                    />
                          </div>
                          <div>
                    <Label className="text-gray-300">Urgency Level</Label>
                    <Select
                      value={helpRequestForm.urgency}
                      onValueChange={value => setHelpRequestForm(prev => ({ ...prev, urgency: value as 'low' | 'normal' | 'high' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="low" className="bg-gray-900 text-white">Low - General question</SelectItem>
                        <SelectItem value="normal" className="bg-gray-900 text-white">Normal - Need guidance</SelectItem>
                        <SelectItem value="high" className="bg-gray-900 text-white">High - Urgent decision needed</SelectItem>
                      </SelectContent>
                    </Select>
                          </div>
                          <div>
                    <Label className="text-gray-300">Additional Details</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={helpRequestForm.additionalDetails}
                      onChange={e => setHelpRequestForm(prev => ({ ...prev, additionalDetails: e.target.value }))}
                      placeholder="Any additional context or details that might help..."
                      rows={3}
                    />
                          </div>
                        </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (helpRequestForm.question.trim()) {
                        const newRequest = {
                          id: `help_${Date.now()}`,
                          expenseId: helpRequestForm.expenseId,
                          technicianName: technicianName,
                          question: helpRequestForm.question.trim(),
                          urgency: helpRequestForm.urgency as 'low' | 'normal' | 'high',
                          additionalDetails: helpRequestForm.additionalDetails,
                          status: 'pending' as const,
                          createdAt: new Date().toISOString()
                        };
                        setHelpRequests(prev => [newRequest, ...prev]);
                        setHelpRequestForm({
                          expenseId: 'none',
                          question: '',
                          urgency: 'normal',
                          additionalDetails: ''
                        });
                        setHelpRequestDialogOpen(false);
                      }
                    }}
                    disabled={!helpRequestForm.question.trim()}
                  >
                    Submit Help Request
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setHelpRequestForm({
                        expenseId: 'none',
                        question: '',
                        urgency: 'normal',
                        additionalDetails: ''
                      });
                      setHelpRequestDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Help Request Response Dialog - Central Office Response */}
            <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Respond to Help Request</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Review the technician's question and provide guidance.
                  </DialogDescription>
                </DialogHeader>
                
                {selectedHelpRequest && (
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">Question from {selectedHelpRequest.technicianName}</h4>
                      <div className="text-gray-300 mb-2">{selectedHelpRequest.question}</div>
                      {selectedHelpRequest.additionalDetails && (
                        <div className="text-sm text-gray-400">
                          <strong>Additional Details:</strong> {selectedHelpRequest.additionalDetails}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-gray-300">Your Response</Label>
                      <Textarea
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                        value={responseForm.answer}
                        onChange={e => setResponseForm(prev => ({ ...prev, answer: e.target.value }))}
                        placeholder="Provide your guidance and decision to the technician..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (selectedHelpRequest && responseForm.answer.trim()) {
                        setHelpRequests(prev => prev.map(req => 
                          req.id === selectedHelpRequest.id 
                            ? {
                                ...req,
                                status: 'answered',
                                answer: responseForm.answer.trim(),
                                answeredAt: new Date().toISOString()
                              }
                            : req
                        ));
                        setResponseForm({ 
                          answer: '', 
                          decisionTrackerAnswers: {
                            'Is this expense reasonable and necessary?': null,
                            'Should this be billable to the property/owner?': null,
                            'Is a receipt required?': null,
                            'Does this require pre-approval?': null,
                            'Is this an emergency repair?': null,
                            'Is this a capital improvement?': null,
                            'Should this be reimbursed?': null,
                            'Is this within budget limits?': null
                          }
                        });
                        setSelectedHelpRequest(null);
                        setResponseDialogOpen(false);
                      }
                    }}
                    disabled={!responseForm.answer.trim()}
                  >
                    Send Response
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setResponseForm({ 
                        answer: '', 
                        decisionTrackerAnswers: {
                          'Is this expense reasonable and necessary?': null,
                          'Should this be billable to the property/owner?': null,
                          'Is a receipt required?': null,
                          'Does this require pre-approval?': null,
                          'Is this an emergency repair?': null,
                          'Is this a capital improvement?': null,
                          'Should this be reimbursed?': null,
                          'Is this within budget limits?': null
                        }
                      });
                      setSelectedHelpRequest(null);
                      setResponseDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Issue New Card Dialog */}
            <Dialog open={issueCardDialogOpen} onOpenChange={setIssueCardDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Issue New Card</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new virtual or physical card with limits and restrictions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Card Type</Label>
                      <Select
                        value={cardForm.type}
                        onValueChange={value => setCardForm(prev => ({ ...prev, type: value as CardType }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="virtual" className="bg-gray-900 text-white">Virtual Card</SelectItem>
                          <SelectItem value="physical" className="bg-gray-900 text-white">Physical Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Card Holder Name</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.holder}
                        onChange={e => setCardForm(prev => ({ ...prev, holder: e.target.value }))}
                        placeholder="Enter cardholder name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Position</Label>
                      <Select
                        value={cardForm.position}
                        onValueChange={value => setCardForm(prev => ({ ...prev, position: value as EnhancedCard['position'] }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="Technician" className="bg-gray-900 text-white">Technician</SelectItem>
                          <SelectItem value="PM" className="bg-gray-900 text-white">Property Manager</SelectItem>
                          <SelectItem value="Super" className="bg-gray-900 text-white">Superintendent</SelectItem>
                          <SelectItem value="Admin" className="bg-gray-900 text-white">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Credit Limit</Label>
                      <Input
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.limit}
                        onChange={e => setCardForm(prev => ({ ...prev, limit: e.target.value }))}
                        placeholder="Enter credit limit"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Assigned Properties</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {properties.map(property => (
                        <label key={property.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={cardForm.assignedProperties.includes(property.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: [...prev.assignedProperties, property.id] 
                                }));
                              } else {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: prev.assignedProperties.filter(id => id !== property.id) 
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-gray-300 text-sm">{property.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Vendor Restrictions</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={cardForm.vendorRestrictions.join(', ')}
                      onChange={e => setCardForm(prev => ({ 
                        ...prev, 
                        vendorRestrictions: e.target.value.split(',').map(v => v.trim()).filter(v => v) 
                      }))}
                      placeholder="Home Depot, Lowes, Office Depot (comma-separated)"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Card Brand</Label>
                    <Select
                      value={cardForm.brand}
                      onValueChange={value => setCardForm(prev => ({ ...prev, brand: value as EnhancedCard['brand'] }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Chase" className="bg-gray-900 text-white">Chase</SelectItem>
                        <SelectItem value="Amex" className="bg-gray-900 text-white">American Express</SelectItem>
                        <SelectItem value="Visa" className="bg-gray-900 text-white">Visa</SelectItem>
                        <SelectItem value="Mastercard" className="bg-gray-900 text-white">Mastercard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleIssueNewCard}
                    disabled={!cardForm.holder || !cardForm.limit || cardForm.assignedProperties.length === 0}
                  >
                    Issue Card
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setIssueCardDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Connect Existing Card Dialog */}
            <Dialog open={connectCardDialogOpen} onOpenChange={setConnectCardDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Connect Existing Card</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Connect an existing Amex, Visa, or other card to your property management system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Existing Card Type</Label>
                      <Select
                        value={cardForm.type}
                        onValueChange={value => setCardForm(prev => ({ ...prev, type: value as CardType }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="virtual" className="bg-gray-900 text-white">Virtual Card</SelectItem>
                          <SelectItem value="physical" className="bg-gray-900 text-white">Physical Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Card Holder Name</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.holder}
                        onChange={e => setCardForm(prev => ({ ...prev, holder: e.target.value }))}
                        placeholder="Name on existing card"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Position</Label>
                      <Select
                        value={cardForm.position}
                        onValueChange={value => setCardForm(prev => ({ ...prev, position: value as EnhancedCard['position'] }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="Technician" className="bg-gray-900 text-white">Technician</SelectItem>
                          <SelectItem value="PM" className="bg-gray-900 text-white">Property Manager</SelectItem>
                          <SelectItem value="Super" className="bg-gray-900 text-white">Superintendent</SelectItem>
                          <SelectItem value="Admin" className="bg-gray-900 text-white">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Current Credit Limit</Label>
                      <Input
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.limit}
                        onChange={e => setCardForm(prev => ({ ...prev, limit: e.target.value }))}
                        placeholder="Enter current limit"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Existing Card Brand</Label>
                    <Select
                      value={cardForm.brand}
                      onValueChange={value => setCardForm(prev => ({ ...prev, brand: value as EnhancedCard['brand'] }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Amex" className="bg-gray-900 text-white">American Express</SelectItem>
                        <SelectItem value="Chase" className="bg-gray-900 text-white">Chase</SelectItem>
                        <SelectItem value="Visa" className="bg-gray-900 text-white">Visa</SelectItem>
                        <SelectItem value="Mastercard" className="bg-gray-900 text-white">Mastercard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Assign to Properties</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {properties.map(property => (
                        <label key={property.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={cardForm.assignedProperties.includes(property.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: [...prev.assignedProperties, property.id] 
                                }));
                              } else {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: prev.assignedProperties.filter(id => id !== property.id) 
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-gray-300 text-sm">{property.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Vendor Restrictions</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={cardForm.vendorRestrictions.join(', ')}
                      onChange={e => setCardForm(prev => ({ 
                        ...prev, 
                        vendorRestrictions: e.target.value.split(',').map(v => v.trim()).filter(v => v) 
                      }))}
                      placeholder="Home Depot, Lowes, Office Depot (comma-separated)"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleConnectExistingCard}
                    disabled={!cardForm.holder || !cardForm.limit || cardForm.assignedProperties.length === 0}
                  >
                    Connect Card
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setConnectCardDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Monthly Reimbursement Dialog */}
            <Dialog open={monthlyReimbursementDialogOpen} onOpenChange={setMonthlyReimbursementDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-6xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Process Monthly GL Report Reimbursement</DialogTitle>
                  <DialogDescription>
                    Generate GL-coded expense report and process reimbursement with AppFolio sync
                  </DialogDescription>
                </DialogHeader>
                
                {selectedPropertyForMonthly && (
                  <div className="space-y-6">
                    {/* Property & Month Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-blue-400">Property & Month</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-400">Property</div>
                            <div className="font-medium text-white">{selectedPropertyForMonthly.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Report Month</div>
                            <div className="text-sm text-gray-300">{new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">AppFolio Sync</div>
                            <div className="text-sm text-green-400 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              Active
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-blue-400">Trust Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-400">Bank</div>
                            <div className="font-medium text-white">{selectedPropertyForMonthly.trustAccount.bankName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Account</div>
                            <div className="text-sm text-gray-300">{selectedPropertyForMonthly.trustAccount.accountNumber}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Routing</div>
                            <div className="text-sm text-gray-300">{selectedPropertyForMonthly.trustAccount.routingNumber}</div>
                          </div>
                          <div className="text-xs text-green-400 mt-2">
                            🔄 Auto-mapping enabled
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Owner Information - Report Recipient */}
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                        📧 Report Recipient (Owner)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white ml-2 font-medium">{selectedPropertyForMonthly.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-green-300 ml-2">{selectedPropertyForMonthly.ownerEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white ml-2">{selectedPropertyForMonthly.ownerPhone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Preferred Contact:</span>
                          <span className="text-yellow-300 ml-2 capitalize">{selectedPropertyForMonthly.ownerPreferredContact}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-green-400">
                        ✉️ This GL report will be automatically sent to the property owner above
                      </div>
                    </div>

                    {/* CC Recipient */}
                    <div>
                      <Label className="text-gray-300">CC Additional Recipient on GL Report (Optional)</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Input
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Recipient name"
                          value={ccRecipient.name}
                          onChange={e => setCcRecipient(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                          type="email"
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="recipient@email.com"
                          value={ccRecipient.email}
                          onChange={e => setCcRecipient(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Flagged Expenses Requiring Attention */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">⚠️ Flagged Expenses Requiring Attention</Label>
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-orange-300 mb-1 flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            AI-Detected Overages & Policy Violations
                          </h4>
                          <div className="text-xs text-orange-200">
                            These expenses exceed threshold amounts or policy guidelines and require owner review
                          </div>
                        </div>

                        <div className="max-h-48 overflow-y-auto border border-orange-500/30 rounded">
                          <table className="min-w-full text-xs">
                            <thead className="sticky top-0 bg-orange-900/40 border-b border-orange-500/30">
                                                             <tr>
                                 <th className="text-left py-2 px-3 text-orange-200">Date</th>
                                 <th className="text-left py-2 px-3 text-orange-200">Merchant</th>
                                 <th className="text-left py-2 px-3 text-orange-200">GL Sub-Code</th>
                                 <th className="text-left py-2 px-3 text-orange-200">Amount</th>
                                 <th className="text-right py-2 px-3 text-orange-200">Budget</th>
                                 <th className="text-right py-2 px-3 text-orange-200">Variance</th>
                                 <th className="text-right py-2 px-3 text-orange-200">% Var</th>
                                 <th className="text-left py-2 px-3 text-orange-200">PM Memo</th>
                                 <th className="text-left py-2 px-3 text-orange-200">AI Analysis</th>
                                 <th className="text-left py-2 px-3 text-orange-200">Action</th>
                               </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                // Generate flagged expenses with AI memos and budget data
                                                                 const flaggedExpenses = [
                                   {
                                     date: '2025-01-15',
                                     merchant: 'Home Depot',
                                     amount: 750.00,
                                     glCode: '7200',
                                     glName: 'Repairs & Maintenance',
                                     subGlCode: '7210',
                                     subGlName: 'HVAC Repairs',
                                     monthlyBudget: 1200,
                                     budgetVariance: -450,
                                     budgetVariancePercent: -37.5,
                                     ytdBudget: 14400,
                                     ytdActual: 8950,
                                     ytdVariance: -5450,
                                     ytdVariancePercent: -37.8,
                                     pmMemo: 'Emergency heating failure - Unit #3B. Approved by owner Smith via phone call. Parts needed ASAP for tenant comfort.',
                                     aiMemo: 'Over $500 threshold. 40% increase vs Q4. Needs owner approval.',
                                     aiConfidence: 94,
                                     flagReason: 'Amount threshold exceeded'
                                   },
                                   {
                                     date: '2025-01-17',
                                     merchant: 'Office Depot',
                                     amount: 625.75,
                                     glCode: '6100',
                                     glName: 'Office Expenses',
                                     subGlCode: '6110',
                                     subGlName: 'Office Supplies',
                                     monthlyBudget: 250,
                                     budgetVariance: 375.75,
                                     budgetVariancePercent: 150.3,
                                     ytdBudget: 3000,
                                     ytdActual: 2850,
                                     ytdVariance: -150,
                                     ytdVariancePercent: -5.0,
                                     pmMemo: 'Bulk supplies for Q1 tenant move-outs. Includes cleaning supplies, paint, and office materials for leasing office setup.',
                                     aiMemo: '250% over monthly budget. Check if should be property improvement.',
                                     aiConfidence: 87,
                                     flagReason: 'Unusual amount pattern'
                                   },
                                   {
                                     date: '2025-01-20',
                                     merchant: 'ABC Plumbing Services',
                                     amount: 1250.00,
                                     glCode: '7200',
                                     glName: 'Repairs & Maintenance',
                                     subGlCode: '7220',
                                     subGlName: 'Plumbing Repairs',
                                     monthlyBudget: 800,
                                     budgetVariance: 450,
                                     budgetVariancePercent: 56.3,
                                     ytdBudget: 9600,
                                     ytdActual: 11250,
                                     ytdVariance: 1650,
                                     ytdVariancePercent: 17.2,
                                     pmMemo: 'Water main break in basement - emergency repair. Contacted owner but no response. Made executive decision to prevent water damage.',
                                     aiMemo: 'Over $1000, requires pre-approval. Missing emergency docs.',
                                     aiConfidence: 96,
                                     flagReason: 'Policy violation - Missing pre-approval'
                                   }
                                 ];

                                return flaggedExpenses.map((expense, idx) => (
                                  <tr key={idx} className="border-b border-orange-500/20 hover:bg-orange-900/20">
                                    <td className="py-2 px-3 text-gray-300">{expense.date}</td>
                                    <td className="py-2 px-3 text-gray-300">{expense.merchant}</td>
                                    <td className="py-2 px-3">
                                      <div className="text-blue-300 font-medium">{expense.subGlCode} - {expense.subGlName}</div>
                                      <div className="text-xs text-blue-200">{expense.glCode} - {expense.glName}</div>
                                    </td>
                                    <td className="py-2 px-3">
                                       <div className="text-red-300 font-semibold">${expense.amount.toFixed(2)}</div>
                                       <div className="text-xs text-orange-300">{expense.flagReason}</div>
                                     </td>
                                     <td className="py-2 px-3 text-right">
                                       <div className="text-gray-300">${expense.monthlyBudget.toLocaleString()}</div>
                                       <div className="text-xs text-gray-400">Monthly</div>
                                     </td>
                                     <td className="py-2 px-3 text-right">
                                       <div className={`font-semibold ${
                                         expense.budgetVariance >= 0 ? 'text-red-300' : 'text-green-300'
                                       }`}>
                                         {expense.budgetVariance >= 0 ? '+' : ''}${expense.budgetVariance.toLocaleString()}
                                       </div>
                                       <div className="text-xs text-gray-400">vs Budget</div>
                                     </td>
                                     <td className="py-2 px-3 text-right">
                                       <div className={`font-semibold ${
                                         expense.budgetVariancePercent >= 0 ? 'text-red-300' : 'text-green-300'
                                       }`}>
                                         {expense.budgetVariancePercent >= 0 ? '+' : ''}{expense.budgetVariancePercent.toFixed(1)}%
                                       </div>
                                       <div className="text-xs text-gray-400">Monthly</div>
                                     </td>
                                     <td className="py-2 px-3 max-w-xs">
                                       <div className="text-gray-300 text-xs leading-tight mb-1">{expense.pmMemo}</div>
                                       <div className="text-xs text-blue-300 flex items-center gap-1">
                                         <User className="h-3 w-3" />
                                         Property Manager
                                       </div>
                                     </td>
                                     <td className="py-2 px-3 max-w-xs">
                                       <div className="text-gray-300 text-xs leading-tight mb-1">{expense.aiMemo}</div>
                                       <div className="flex items-center gap-1">
                                         <Bot className="h-3 w-3 text-purple-400" />
                                         <span className="text-xs text-purple-300">{expense.aiConfidence}% confidence</span>
                                       </div>
                                     </td>
                                    <td className="py-2 px-3">
                                      <Button
                                        size="sm"
                                        onClick={() => handleRequestInfoFromPM(expense)}
                                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1"
                                      >
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        More Info
                                      </Button>
                                    </td>
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-3 text-xs text-orange-300 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            3 expenses flagged for review • Total: $2,625.75
                          </div>
                          <div className="text-xs text-red-300">
                            Budget variance: +$375.75 (+23.5% avg)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GL Report Preview */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">📊 Monthly GL Report Preview</Label>
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="text-sm font-semibold text-white">✓ Submitted Comments - Completed Variance Explanations</h4>
                          </div>
                          <div className="text-xs text-gray-400">
                            {selectedPropertyForMonthly.name} • {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        
                        {/* Trust Account Details */}
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                          <div className="text-sm text-blue-300 flex items-center gap-2 mb-2">
                            <span className="text-blue-400">🏦</span>
                            Trust Account Details
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-300">
                            <div>
                              <span className="text-gray-400">Bank:</span>
                              <span className="ml-2">{selectedPropertyForMonthly.trustAccount.bankName}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Account:</span>
                              <span className="ml-2">{selectedPropertyForMonthly.trustAccount.accountNumber}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Routing:</span>
                              <span className="ml-2">{selectedPropertyForMonthly.trustAccount.routingNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto border border-gray-600 rounded">
                          <table className="min-w-full text-xs">
                            <thead className="sticky top-0 bg-gray-900 border-b border-gray-600">
                              <tr>
                                <th className="text-left py-3 px-4 font-semibold text-white">Account</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">PTD Actual</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">PTD Budget</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Variance</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">% Var</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">YTD Actual</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">YTD Budget</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Variance</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">% Var</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Annual</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">PM Memo</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                // Multiple GL Code Entries
                                const glEntries = [
                                  {
                                    glCode: '7200',
                                    glDescription: 'HVAC System Maintenance',
                                    property: selectedPropertyForMonthly.name.split(' ')[0] + ' ' + selectedPropertyForMonthly.name.split(' ')[1] || '01 STANFORD',
                                    parentCode: '7200 - Total Maintenance and Repairs',
                                    ptdActual: 2186.49,
                                    ptdBudget: 1500.00,
                                    ytdActual: 15850.00,
                                    ytdBudget: 12000.00,
                                    annual: 35000,
                                    memo: 'Emergency repairs and preventive maintenance completed.',
                                    submittedDate: '2024-12-15'
                                  },
                                  {
                                    glCode: '6425',
                                    glDescription: 'Property Insurance',
                                    property: selectedPropertyForMonthly.name.split(' ')[0] + ' ' + selectedPropertyForMonthly.name.split(' ')[1] || '01 STANFORD',
                                    parentCode: '6400 - Insurance and Taxes',
                                    ptdActual: 1725.00,
                                    ptdBudget: 1200.00,
                                    ytdActual: 8950.00,
                                    ytdBudget: 7200.00,
                                    annual: 18500,
                                    memo: 'Annual policy renewal with coverage adjustments.',
                                    submittedDate: '2024-12-14'
                                  },
                                  {
                                    glCode: '7315',
                                    glDescription: 'Water & Sewer',
                                    property: selectedPropertyForMonthly.name.split(' ')[0] + ' ' + selectedPropertyForMonthly.name.split(' ')[1] || '01 STANFORD',
                                    parentCode: '7300 - Total Utilities',
                                    ptdActual: 945.50,
                                    ptdBudget: 850.00,
                                    ytdActual: 5680.00,
                                    ytdBudget: 5100.00,
                                    annual: 12200,
                                    memo: 'Seasonal usage increase due to irrigation needs.',
                                    submittedDate: '2024-12-13'
                                  },
                                  {
                                    glCode: '5125',
                                    glDescription: 'Legal & Professional',
                                    property: selectedPropertyForMonthly.name.split(' ')[0] + ' ' + selectedPropertyForMonthly.name.split(' ')[1] || '01 STANFORD',
                                    parentCode: '5100 - Total Administration',
                                    ptdActual: 850.00,
                                    ptdBudget: 600.00,
                                    ytdActual: 4950.00,
                                    ytdBudget: 3600.00,
                                    annual: 9500,
                                    memo: 'Tenant lease consultation and compliance review.',
                                    submittedDate: '2024-12-12'
                                  },
                                  {
                                    glCode: '8235',
                                    glDescription: 'Roof Replacement Reserve',
                                    property: selectedPropertyForMonthly.name.split(' ')[0] + ' ' + selectedPropertyForMonthly.name.split(' ')[1] || '01 STANFORD',
                                    parentCode: '8200 - Total Reserves and Replacements',
                                    ptdActual: 3200.00,
                                    ptdBudget: 2500.00,
                                    ytdActual: 18900.00,
                                    ytdBudget: 15000.00,
                                    annual: 32000,
                                    memo: 'Accelerated reserve funding for upcoming roof work.',
                                    submittedDate: '2024-12-11'
                                  }
                                ];
                                
                                return glEntries.map((glEntry, idx) => {
                                  const ptdVariance = glEntry.ptdActual - glEntry.ptdBudget;
                                  const ptdVariancePercent = ((ptdVariance / glEntry.ptdBudget) * 100);
                                  const ytdVariance = glEntry.ytdActual - glEntry.ytdBudget;
                                  const ytdVariancePercent = ((ytdVariance / glEntry.ytdBudget) * 100);
                                  
                                  return (
                                    <tr key={idx} className="border-b border-gray-600/50">
                                      <td className="p-3">
                                        <div className="text-white font-medium">
                                          {glEntry.glCode} - {glEntry.glDescription}
                                        </div>
                                        <div className="text-purple-400 text-xs font-medium">
                                          {glEntry.property}
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                          {glEntry.parentCode}
                                        </div>
                                      </td>
                                      <td className="p-3 text-white">${glEntry.ptdActual.toLocaleString()}</td>
                                      <td className="p-3 text-white">${glEntry.ptdBudget.toLocaleString()}</td>
                                      <td className="p-3">
                                        <span className={ptdVariance >= 0 ? "text-green-400" : "text-red-400"}>
                                          {ptdVariance >= 0 ? '+' : ''}${ptdVariance.toLocaleString()}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <span className={ptdVariancePercent >= 0 ? "text-green-400" : "text-red-400"}>
                                          {ptdVariancePercent >= 0 ? '+' : ''}{ptdVariancePercent.toFixed(1)}%
                                        </span>
                                      </td>
                                      <td className="p-3 text-white">${glEntry.ytdActual.toLocaleString()}</td>
                                      <td className="p-3 text-white">${glEntry.ytdBudget.toLocaleString()}</td>
                                      <td className="p-3">
                                        <span className={ytdVariance >= 0 ? "text-green-400" : "text-red-400"}>
                                          {ytdVariance >= 0 ? '+' : ''}${ytdVariance.toLocaleString()}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <span className={ytdVariancePercent >= 0 ? "text-green-400" : "text-red-400"}>
                                          {ytdVariancePercent >= 0 ? '+' : ''}{ytdVariancePercent.toFixed(1)}%
                                        </span>
                                      </td>
                                      <td className="p-3 text-white">${glEntry.annual.toLocaleString()}</td>
                                      <td className="p-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                          <div>
                                            <div className="text-green-400 font-medium text-xs">✓ Submitted</div>
                                            <div className="text-gray-400 text-xs">{glEntry.submittedDate}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-gray-300 text-xs max-w-xs">
                                          {glEntry.memo}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                                          onClick={() => {
                                            // Set up expense for viewing
                                            setSelectedExpenseForView({
                                              id: `gl-${glEntry.glCode}`,
                                              glCode: glEntry.glCode,
                                              description: glEntry.glDescription,
                                              amount: glEntry.ptdActual,
                                              property: glEntry.property,
                                              memo: glEntry.memo,
                                              submittedDate: glEntry.submittedDate,
                                              ptdActual: glEntry.ptdActual,
                                              ptdBudget: glEntry.ptdBudget,
                                              ytdActual: glEntry.ytdActual,
                                              ytdBudget: glEntry.ytdBudget,
                                              annual: glEntry.annual,
                                              // Enhanced data for comprehensive view
                                              vendor: glEntry.glCode === '7200' ? 'HVAC Solutions Inc' : 
                                                     glEntry.glCode === '6425' ? 'Nationwide Insurance' :
                                                     glEntry.glCode === '7315' ? 'Metro Water District' :
                                                     glEntry.glCode === '5125' ? 'Legal Associates LLC' : 'Construction Reserve Fund',
                                              invoiceNumber: `INV-2024-${1000 + idx}`,
                                              dueDate: new Date(Date.now() + (7 + idx) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                                              workOrderId: `job${idx + 1}`,
                                              receiptUrl: `/receipts/gl-${glEntry.glCode}-receipt.pdf`,
                                              expenseDetails: {
                                                category: glEntry.glCode === '7200' ? 'Maintenance & Repairs' : 
                                                         glEntry.glCode === '6425' ? 'Property Insurance' :
                                                         glEntry.glCode === '7315' ? 'Utilities' :
                                                         glEntry.glCode === '5125' ? 'Legal & Professional' : 'Capital Reserve',
                                                submittedBy: 'Property Manager',
                                                submittedDate: glEntry.submittedDate,
                                                approvalStatus: 'Approved',
                                                approvedBy: 'Central Office',
                                                approvedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                                                notes: `${glEntry.memo} Budget variance: ${((glEntry.ptdActual - glEntry.ptdBudget) / glEntry.ptdBudget * 100).toFixed(1)}% over PTD budget due to seasonal adjustments and emergency requirements.`,
                                                priority: glEntry.ptdActual > glEntry.ptdBudget * 1.2 ? 'High' : 'Normal',
                                                billable: glEntry.glCode.startsWith('7') || glEntry.glCode.startsWith('8'),
                                                relatedWorkOrders: [`job${idx + 1}`],
                                                attachments: [
                                                  `invoice-${glEntry.glCode}.pdf`,
                                                  `receipt-${glEntry.glCode}.pdf`,
                                                  `approval-${glEntry.glCode}.pdf`
                                                ]
                                              }
                                            });
                                            setExpenseDetailsDialogOpen(true);
                                          }}
                                        >
                                          View
                                        </Button>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-400">
                          * This GL variance report will be included with the monthly reimbursement processing
                        </div>
                      </div>
                    </div>

                    {/* Process Information */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">Processing Details</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>• GL report will be generated and sent to property owner</div>
                        <div>• AppFolio sync will update all transaction statuses</div>
                        <div>• Reimbursement will auto-map to correct trust account</div>
                        <div>• All pending transactions will be marked as reconciled</div>
                        {ccRecipient.email && (
                          <div className="text-blue-400">• Additional copy will be sent to {ccRecipient.name} ({ccRecipient.email})</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={processMonthlyReimbursement}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Process GL Report & Reimburse
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setMonthlyReimbursementDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Collateral Upload Demo Dialog */}
            <Dialog open={collateralUploadDialogOpen} onOpenChange={setCollateralUploadDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto m-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    Upload Collateral Documents
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Upload documents to the collateral hub for this property.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Demo Notice */}
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-300">Demo Mode</span>
                    </div>
                    <p className="text-sm text-yellow-200">
                      This is a demonstration of the file upload interface. No files will actually be uploaded in this demo.
                    </p>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Drop files here or click to browse</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB per file)
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>

                  {/* Document Details Form */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Custom Filename</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter custom filename (e.g., HVAC_Service_Agreement_2024)"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Document Type</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                          <SelectItem value="insurance">Insurance Certificate</SelectItem>
                          <SelectItem value="warranty">Warranty</SelectItem>
                          <SelectItem value="permit">Permit</SelectItem>
                          <SelectItem value="inspection">Inspection Report</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-300">Property</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="stanford-gsb">Stanford GSB</SelectItem>
                          <SelectItem value="sunnyvale-432">Sunnyvale 432</SelectItem>
                          <SelectItem value="menlo-park">Menlo Park Complex</SelectItem>
                          <SelectItem value="palo-alto">Palo Alto Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-300">Description (Optional)</Label>
                      <Textarea
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Add a description for this document..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Tags (Optional)</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter tags separated by commas (e.g., HVAC, Annual, Service)"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Amount (If applicable)</Label>
                      <Input
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Expiry Date (If applicable)</Label>
                      <Input
                        type="date"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  {/* Upload Progress (Demo) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Demo File 1.pdf</span>
                      <span className="text-green-400">Ready to upload</span>
                    </div>

                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      // Demo success message
                      alert('Demo: Files would be uploaded successfully!');
                      setCollateralUploadDialogOpen(false);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files (Demo)
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setCollateralUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Ask AI Modal Dialog */}
            <Dialog open={askAiModalOpen} onOpenChange={setAskAiModalOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                    Ask AI - Collateral Document Assistant
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Ask questions about your documents, expenses, and property management data. AI will analyze your collateral hub and provide insights.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="bg-gray-800 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                    {aiChatMessages.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-lg font-semibold mb-2">Ask me anything about your documents</h3>
                        <p className="text-sm mb-4">I can help you find information, analyze spending, and provide insights from your collateral hub.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("How much did we spend on HVAC repairs this year?")}>
                            <div className="text-sm font-medium text-white">💰 Spending Analysis</div>
                            <div className="text-xs text-gray-400">How much did we spend on HVAC repairs this year?</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("Show me inspection reports that mention mold")}>
                            <div className="text-sm font-medium text-white">🔍 Document Search</div>
                            <div className="text-xs text-gray-400">Show me inspection reports that mention mold</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("What properties have the highest maintenance costs?")}>
                            <div className="text-sm font-medium text-white">📊 Property Insights</div>
                            <div className="text-xs text-gray-400">What properties have the highest maintenance costs?</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("Find receipts where we were overcharged")}>
                            <div className="text-sm font-medium text-white">⚠️ Cost Analysis</div>
                            <div className="text-xs text-gray-400">Find receipts where we were overcharged</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {aiChatMessages.map((message, index) => (
                          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-100'
                            }`}>
                              <div className="flex items-start gap-2">
                                {message.role === 'assistant' && <Bot className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />}
                                <div className="flex-1">
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                  
                                  {/* Related Documents */}
                                  {message.documents && message.documents.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      <div className="text-xs font-semibold text-gray-300">Related Documents:</div>
                                      <div className="grid grid-cols-1 gap-2">
                                        {message.documents.map((doc: any) => {
                                          const IconComponent = getDocumentTypeIcon(doc.documentType);
                                          return (
                                            <div key={doc.id} className="bg-gray-600 rounded-lg p-2 hover:bg-gray-500 transition-colors">
                                              <div className="flex items-center gap-2">
                                                <IconComponent className="h-3 w-3 text-blue-400" />
                                                <span className="text-xs font-medium text-white truncate">{doc.filename}</span>
                                              </div>
                                              <div className="text-xs text-gray-300 mt-1">
                                                {doc.propertyName} • {doc.uploadDate}
                                                {doc.amount && <span className="text-green-400 ml-2">${doc.amount.toLocaleString()}</span>}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      className="bg-gray-800 border-gray-600 text-white flex-1"
                      placeholder="Ask about your documents, expenses, or properties..."
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAskAi(aiChatInput);
                        }
                      }}
                    />
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleAskAi(aiChatInput)}
                      disabled={!aiChatInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => handleAskAi("Show me a summary of all expenses this month")}
                    >
                      Monthly Summary
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => handleAskAi("What contracts are expiring soon?")}
                    >
                      Expiring Contracts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => handleAskAi("Find all warranty documents")}
                    >
                      Warranty Docs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        setAiChatMessages([]);
                        setAiChatInput('');
                      }}
                    >
                      Clear Chat
                    </Button>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setAskAiModalOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Policy Rule Dialog */}
            <Dialog open={policyRuleEditDialogOpen} onOpenChange={setPolicyRuleEditDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Expense Policy Rule</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Modify the expense policy rule and AI settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editedRule.category}
                      onChange={e => setEditedRule(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Rule category"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Rule Description</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editedRule.rule}
                      onChange={e => setEditedRule(prev => ({ ...prev, rule: e.target.value }))}
                      placeholder="Describe the expense policy rule..."
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">AI Enabled</Label>
                      <div className="text-sm text-gray-400">Allow AI to automatically apply this rule</div>
                    </div>
                    <Switch
                      checked={editedRule.aiEnabled}
                      onCheckedChange={checked => setEditedRule(prev => ({ ...prev, aiEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Active</Label>
                      <div className="text-sm text-gray-400">Rule is currently active and enforced</div>
                    </div>
                    <Switch
                      checked={editedRule.active}
                      onCheckedChange={checked => setEditedRule(prev => ({ ...prev, active: checked }))}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSavePolicyRule}
                    disabled={!editedRule.category || !editedRule.rule}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setPolicyRuleEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Expense Policy Edit Dialog */}
            <Dialog open={expensePolicyDialogOpen} onOpenChange={setExpensePolicyDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Expense Policy Rules</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Manage expense policy rules and AI automation settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Current Policy Rules</h4>
                    <div className="space-y-3">
                      {policyRules.map(rule => (
                        <div key={rule.id} className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-300">{rule.category}</span>
                            <div className="flex items-center gap-2">
                              {rule.aiEnabled && (
                                <Badge className="bg-purple-600 text-white text-xs">AI</Badge>
                              )}
                              <Badge className={rule.active ? "bg-green-600 text-white text-xs" : "bg-gray-600 text-white text-xs"}>
                                {rule.active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 p-1 h-auto"
                                onClick={() => handleEditPolicyRule(rule)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{rule.rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setExpensePolicyDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Nudge Dialog */}
            <Dialog open={nudgeDialogOpen} onOpenChange={setNudgeDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nudge Responsible Party</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send a message requesting missing information for this transaction
                  </DialogDescription>
                </DialogHeader>
                {selectedNudgeTransaction && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                      <h4 className="text-sm font-medium text-white mb-2">Transaction Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{selectedNudgeTransaction.date}</span>
                        <span className="text-gray-400">Vendor:</span>
                        <span className="text-white">{selectedNudgeTransaction.vendor}</span>
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-white">${selectedNudgeTransaction.amount?.toFixed(2)}</span>
                        <span className="text-gray-400">Made By:</span>
                        <span className="text-white">{selectedNudgeTransaction.madeBy}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Message</Label>
                      <Textarea
                        value={nudgeMessage}
                        onChange={(e) => setNudgeMessage(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white h-40"
                        placeholder="Enter your message..."
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setNudgeDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => {
                      if (selectedNudgeTransaction && nudgeMessage.trim()) {
                        // Create new message thread
                        const newMessage = {
                          id: Date.now().toString(),
                          propertyId: selectedNudgeTransaction.jobId ? 
                            (() => {
                              const job = jobs.find(j => j.id === selectedNudgeTransaction.jobId);
                              const property = job ? properties.find(p => p.name === job.property) : undefined;
                              return property ? property.id : 'unassigned';
                            })() : 'unassigned',
                          propertyName: selectedNudgeTransaction.jobId ? 
                            (() => {
                              const job = jobs.find(j => j.id === selectedNudgeTransaction.jobId);
                              const property = job ? properties.find(p => p.name === job.property) : undefined;
                              return property ? property.name : 'Unassigned Property';
                            })() : 'Unassigned Property',
                          senderId: "centralOffice1",
                          senderName: "Central Office",
                          senderRole: "centralOffice",
                          content: nudgeMessage,
                          timestamp: new Date(),
                          status: "sent",
                          threadId: `thread_nudge_${selectedNudgeTransaction.id}_${Date.now()}`,
                          type: "nudge",
                          relatedTransactionId: selectedNudgeTransaction.id
                        };
                        
                        // Add to messages
                        setMessages(prev => [...prev, newMessage]);
                        
                        // Navigate to communications tab
                        setActiveTab('communications');
                        
                        // Reset and close
                        setNudgeDialogOpen(false);
                        setSelectedNudgeTransaction(null);
                        setNudgeMessage('');
                      }
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Nudge
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Download Report Confirmation Dialog */}
            <Dialog open={downloadReportDialogOpen} onOpenChange={(open) => {
              setDownloadReportDialogOpen(open);
              if (!open) setSelectedRecentReport(null);
            }}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Download Report</DialogTitle>
                  <DialogDescription>
                    Confirm download of the selected report
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white font-medium">
                      {selectedRecentReport ? selectedRecentReport.name : reportTypes.find(r => r.id === reportType)?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      Format: {reportDownloadForm.format.toUpperCase()}
                    </div>
                    {selectedRecentReport && (
                      <div className="text-sm text-gray-400 mt-2">
                        Generated: {selectedRecentReport.generatedOn} • {selectedRecentReport.scope}
                      </div>
                    )}
                  </div>

                  {selectedRecentReport ? (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-blue-300 font-medium mb-2">Recent Report Details</div>
                      <div className="text-sm text-blue-200 space-y-1">
                        <div>
                          <span className="font-medium">Generated:</span> {selectedRecentReport.generatedOn}
                        </div>
                        <div>
                          <span className="font-medium">Scope:</span> {selectedRecentReport.scope}
                        </div>
                        <div>
                          <span className="font-medium">Format:</span> {selectedRecentReport.format.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-blue-300 font-medium mb-2">Report Summary</div>
                      <div className="text-sm text-blue-200 space-y-1">
                        <div>
                          <span className="font-medium">Date Range:</span> {
                            reportDateRange.from && reportDateRange.to 
                              ? `${reportDateRange.from} to ${reportDateRange.to}`
                              : "All time"
                          }
                        </div>
                        <div>
                          <span className="font-medium">Properties:</span> {
                            reportSelectedProperties.length > 0 
                              ? `${reportSelectedProperties.length} selected`
                              : "All properties"
                          }
                        </div>
                        <div>
                          <span className="font-medium">GL Codes:</span> {
                            reportSelectedGLCodes.length > 0 
                              ? `${reportSelectedGLCodes.length} selected`
                              : "All GL codes"
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setDownloadReportDialogOpen(false);
                    setSelectedRecentReport(null);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleDownloadReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download {reportDownloadForm.format.toUpperCase()}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Email Report Dialog */}
            <Dialog open={emailReportDialogOpen} onOpenChange={(open) => {
              setEmailReportDialogOpen(open);
              if (!open) setSelectedRecentReport(null);
            }}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Email Report</DialogTitle>
                  <DialogDescription>
                    Send report to recipient via email
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white font-medium">
                      {selectedRecentReport ? selectedRecentReport.name : reportTypes.find(r => r.id === reportType)?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      Format: {reportEmailForm.format.toUpperCase()}
                    </div>
                    {selectedRecentReport && (
                      <div className="text-sm text-gray-400 mt-2">
                        Generated: {selectedRecentReport.generatedOn} • {selectedRecentReport.scope}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipient-name" className="text-sm text-gray-400 mb-2 block">
                        Recipient Name
                      </Label>
                      <Input
                        id="recipient-name"
                        value={reportEmailForm.recipientName}
                        onChange={(e) => setReportEmailForm(prev => ({ ...prev, recipientName: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter recipient name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipient-email" className="text-sm text-gray-400 mb-2 block">
                        Email Address
                      </Label>
                      <Input
                        id="recipient-email"
                        type="email"
                        value={reportEmailForm.recipientEmail}
                        onChange={(e) => setReportEmailForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email-message" className="text-sm text-gray-400 mb-2 block">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="email-message"
                      value={reportEmailForm.message}
                      onChange={(e) => setReportEmailForm(prev => ({ ...prev, message: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Add a custom message..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setEmailReportDialogOpen(false);
                    setSelectedRecentReport(null);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleEmailReport}
                    disabled={!reportEmailForm.recipientEmail || !reportEmailForm.recipientName || isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Report
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Property Manager Message Popup (not a dialog - overlay style) */}
            {pmMessagePopupOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-blue-500 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="border-b border-gray-700 p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">Message Property Manager</h3>
                          <p className="text-blue-200">Request information about flagged expense</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setPmMessagePopupOpen(false)}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Expense Details Summary */}
                    {selectedFlaggedExpense && (
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                        <h4 className="text-orange-300 font-medium mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Flagged Expense Details
                        </h4>
                                                 <div className="grid grid-cols-2 gap-4 text-sm">
                           <div>
                             <span className="text-gray-400">Date:</span>
                             <span className="text-white ml-2">{selectedFlaggedExpense.date}</span>
                           </div>
                           <div>
                             <span className="text-gray-400">Amount:</span>
                             <span className="text-red-300 ml-2 font-semibold">${selectedFlaggedExpense.amount?.toFixed(2)}</span>
                           </div>
                           <div>
                             <span className="text-gray-400">Merchant:</span>
                             <span className="text-white ml-2">{selectedFlaggedExpense.merchant}</span>
                           </div>
                           <div>
                             <span className="text-gray-400">Flag Reason:</span>
                             <span className="text-orange-300 ml-2">{selectedFlaggedExpense.flagReason}</span>
                           </div>
                           <div>
                             <span className="text-gray-400">GL Code:</span>
                             <span className="text-blue-300 ml-2">{selectedFlaggedExpense.glCode} - {selectedFlaggedExpense.glName}</span>
                           </div>
                           <div>
                             <span className="text-gray-400">Sub-GL:</span>
                             <span className="text-purple-300 ml-2">{selectedFlaggedExpense.subGlCode} - {selectedFlaggedExpense.subGlName}</span>
                           </div>
                           <div className="col-span-2">
                             <span className="text-gray-400">PM Original Memo:</span>
                             <div className="text-blue-200 ml-2 text-xs italic mt-1 p-2 bg-blue-900/20 rounded border border-blue-500/30">
                               "{selectedFlaggedExpense.pmMemo}"
                             </div>
                           </div>
                         </div>
                      </div>
                    )}

                    {/* Message Type Selection */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Request Type</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'clarification', label: 'Clarification', icon: HelpCircle },
                          { value: 'correction', label: 'Correction', icon: Edit },
                          { value: 'approval', label: 'Approval', icon: CheckCircle }
                        ].map(({ value, label, icon: Icon }) => (
                          <Button
                            key={value}
                            onClick={() => setPmMessageForm(prev => ({ ...prev, requestType: value }))}
                            variant={pmMessageForm.requestType === value ? 'default' : 'outline'}
                            className={`${
                              pmMessageForm.requestType === value
                                ? 'bg-blue-600 text-white'
                                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            } text-sm`}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <Label className="text-gray-300 mb-2 block">Subject</Label>
                      <Input
                        value={pmMessageForm.subject}
                        onChange={(e) => setPmMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Message subject..."
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <Label className="text-gray-300 mb-2 block">Message</Label>
                      <Textarea
                        value={pmMessageForm.message}
                        onChange={(e) => setPmMessageForm(prev => ({ ...prev, message: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white h-32"
                        placeholder="Type your message to the property manager..."
                      />
                    </div>

                    {/* Priority Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="urgent"
                          checked={pmMessageForm.urgent}
                          onChange={(e) => setPmMessageForm(prev => ({ ...prev, urgent: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="urgent" className="text-gray-300 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-400" />
                          Mark as urgent
                        </Label>
                      </div>
                    </div>

                    {/* Auto-fill Preview */}
                                         <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                       <div className="text-green-300 text-sm flex items-center gap-2 mb-2">
                         <ArrowRight className="h-4 w-4" />
                         This message will be automatically added to the Communications tab
                       </div>
                      <div className="text-green-200 text-xs">
                        Both you and the property manager will be able to track this conversation and responses in the Communications section.
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 p-6 bg-gray-800/50">
                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={() => setPmMessagePopupOpen(false)}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={sendMessageToPM}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!pmMessageForm.subject.trim() || !pmMessageForm.message.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
