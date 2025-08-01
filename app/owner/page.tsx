"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  DollarSign, 
  FileText, 
  Home, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Receipt, 
  FileArchive,
  Settings,
  Database,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CreditCard,
  Activity,
  TrendingDown,
  Flag,
  Bot,
  Sparkles,
  FileWarning,
  Award,
  MessageSquare,
  LinkIcon,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Check,
  X,
  Info,
  Send,
  Paperclip,
  Trash2,
  Copy,
  RefreshCw,
  Target,
  Zap,
  Calculator,
  FileSpreadsheet,
  Folder,
  DownloadCloud,
  Grid,
  List,
  Save
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  collateralDocuments, 
  documentTypeLabels, 
  propertyOptions, 
  areaOptions,
  staffOptions, 
  DocumentType, 
  CollateralDocument,
  jobsList,
  activityMilestones,
  jobNotes,
  activityFiles
} from "../mockData"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const OWNER_PASSWORD = "owner123"
const PM_PASSWORD = "pm123"

// Owner Dashboard Main Component
export default function OwnerDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [passwordError, setPasswordError] = useState("")
  
  // PM Dashboard access states
  const [showPMPasswordDialog, setShowPMPasswordDialog] = useState(false)
  const [pmPasswordInput, setPmPasswordInput] = useState("")
  const [pmPasswordError, setPmPasswordError] = useState("")

  // Shared messages state for all tabs
  const [sharedMessages, setSharedMessages] = useState<{
    id: string;
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    status: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }[]>([
    {
      id: "1",
          propertyId: "redwood",
    propertyName: "03 DOWNTOWN",
    senderId: "pm1",
      senderName: "Jessica Chen",
      senderRole: "pm",
      content: "Hi! I wanted to update you on the HVAC repair work order. We've received quotes from 3 contractors and are ready to proceed with the work.",
      timestamp: new Date("2024-01-15T10:30:00Z"),
      status: "read",
      threadId: "thread_redwood_1"
    },
    {
      id: "2",
      propertyId: "redwood",
      propertyName: "Redwood Shores Office Complex",
      senderId: "owner1",
      senderName: "Property Owner",
      senderRole: "owner",
      content: "Thanks for the update! Could you please send me the quotes for review? I want to make sure we're getting the best value.",
      timestamp: new Date("2024-01-15T14:45:00Z"),
      status: "sent",
      threadId: "thread_redwood_1"
    },
    {
      id: "3",
      propertyId: "mission",
      propertyName: "02 SUNNYVALE",
      senderId: "pm2",
      senderName: "James Wilson",
      senderRole: "pm",
      content: "The plumbing repair has been completed successfully. All systems are now working properly.",
      timestamp: new Date("2024-01-16T09:15:00Z"),
      status: "unread",
      threadId: "thread_mission_1"
    }
  ])

  // Function to add message to shared state
  const addMessage = (message: {
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }) => {
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      status: "sent",
      ...message
    }
    setSharedMessages(prev => [...prev, newMessage])
  }

  // Check authentication on mount
  useEffect(() => {
    const ownerAuth = localStorage.getItem('ownerAuthenticated')
    if (ownerAuth === 'true') {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
    }
  }, [])

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [])

  const handlePasswordSubmit = () => {
    if (passwordInput === OWNER_PASSWORD) {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
      localStorage.setItem('ownerAuthenticated', 'true')
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password")
    }
  }

  const handleBackToPM = () => {
    setShowPMPasswordDialog(true)
    setPmPasswordInput("")
    setPmPasswordError("")
  }

  const handlePMPasswordSubmit = () => {
    if (pmPasswordInput === PM_PASSWORD) {
      localStorage.removeItem('ownerAuthenticated')
      setShowPMPasswordDialog(false)
      router.push('/')
      setPmPasswordError("")
    } else {
      setPmPasswordError("Incorrect password")
    }
  }

  // Sidebar navigation tabs
  const ownerSidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Folder },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'smart-insights', label: 'Smart Insights', icon: Brain },
    { id: 'reimbursements', label: 'Reimbursements', icon: Receipt },
    { id: 'reporting', label: 'Reporting', icon: FileText },
    { id: 'collateral', label: 'Collateral Hub', icon: FileArchive },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Dialog open={showPasswordDialog} onOpenChange={() => {}}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Owner Portal Access</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the owner password to access the dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Password</Label>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter owner password"
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handlePasswordSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Access Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackToPM}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                PM Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">JobVault</h1>
            <p className="text-sm text-gray-400">Owner Portal</p>
          </div>
          
          <nav className="space-y-1">
            {ownerSidebarTabs.map((item) => (
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
              <Button 
                variant="outline" 
                className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackToPM}
                className="w-full justify-start bg-red-900 border-red-700 text-red-300 hover:bg-red-800 hover:text-white"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                PM Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
                  <p className="text-sm text-gray-400">Last updated: 7/8/2025</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Tab Content */}
            {activeTab === "dashboard" && <DashboardTab setActiveTab={setActiveTab} />}
            {activeTab === "expenses" && <ExpensesTab setActiveTab={setActiveTab} setSharedMessages={setSharedMessages} />}
            {activeTab === "properties" && <PropertiesTab setActiveTab={setActiveTab} />}
            {activeTab === "forecasting" && <ForecastingTab setActiveTab={setActiveTab} addMessage={addMessage} />}
            {activeTab === "smart-insights" && <SmartInsightsTab />}
            {activeTab === "reimbursements" && <ReimbursementsTab setActiveTab={setActiveTab} addMessage={addMessage} />}
            {activeTab === "reporting" && <ReportingTab />}
            {activeTab === "collateral" && <CollateralTab />}
            {activeTab === "communications" && <CommunicationsTab messages={sharedMessages} setMessages={setSharedMessages} />}
          </div>
        </div>
      </div>

      {/* PM Dashboard Password Dialog */}
      <Dialog open={showPMPasswordDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">PM Dashboard Access</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the PM password to access the dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Password</Label>
              <Input
                type="password"
                value={pmPasswordInput}
                onChange={(e) => setPmPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePMPasswordSubmit()}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter PM password"
              />
              {pmPasswordError && (
                <p className="text-red-400 text-sm mt-1">{pmPasswordError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handlePMPasswordSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Access PM Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPMPasswordDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dashboard Tab Component
function DashboardTab({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  // Calculate percentage of year elapsed (same as properties tab)
  const yearElapsed = 0.58

  // Properties data (same as properties tab)
  const properties = [
    {
      id: 1,
      name: "Stanford Graduate School of Business",
      type: "Academic",
      size: "285,000 sq ft",
      ytdSpent: 2.2,
      annualBudget: 4.3,
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
      ytdSpent: 3.4,
      annualBudget: 5.4,
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
      ytdSpent: 1.9,
      annualBudget: 3.8,
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
      ytdSpent: 1.5,
      annualBudget: 3.0,
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
      ytdSpent: 2.9,
      annualBudget: 4.8,
      get expectedSpend() { return this.annualBudget * yearElapsed },
      get budgetVariance() { return (this.ytdSpent / this.expectedSpend) * 100 },
      get isUnderBudget() { return this.budgetVariance < 100 },
      get varianceAmount() { return this.ytdSpent - this.expectedSpend },
      get variancePercentage() { return Math.abs(100 - this.budgetVariance) }
    }
  ]

  // Portfolio calculations
  const totalBudget = properties.reduce((sum, prop) => sum + prop.annualBudget, 0)
  const totalSpent = properties.reduce((sum, prop) => sum + prop.ytdSpent, 0)
  const totalExpected = properties.reduce((sum, prop) => sum + prop.expectedSpend, 0)
  const propertiesUnderBudget = properties.filter(prop => prop.isUnderBudget).length
  const propertiesOverBudget = properties.length - propertiesUnderBudget
  const portfolioVariance = (totalSpent / totalExpected) * 100
  const portfolioVarianceAmount = totalSpent - totalExpected
  const isPortfolioUnderBudget = portfolioVariance < 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Portfolio Budget Variance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Portfolio Budget Variance</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-medium">Portfolio Calculation:</div>
                      <div>Total YTD Spend: ${totalSpent.toFixed(1)}M</div>
                      <div>Total Expected (58% of year): ${totalExpected.toFixed(1)}M</div>
                      <div>Total Variance: ${portfolioVarianceAmount.toFixed(1)}M</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              {isPortfolioUnderBudget ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm text-white">
                {isPortfolioUnderBudget ? 'Under budget' : 'Over budget'}
              </span>
            </div>
            <div className="mt-1">
              <span className={`text-lg font-bold ${isPortfolioUnderBudget ? 'text-green-400' : 'text-red-400'}`}>
                {isPortfolioUnderBudget ? '-' : '+'}{Math.abs(100 - portfolioVariance).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <div>${totalSpent.toFixed(1)}M of ${totalBudget.toFixed(1)}M budget</div>
              <div>58% of year complete</div>
              <div>{propertiesUnderBudget} under • {propertiesOverBudget} over</div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Performance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Properties Performance</h3>
              <Home className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white">Majority under budget</span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold text-green-400">{propertiesUnderBudget}</span>
              <span className="text-sm text-white ml-1">of {properties.length} properties</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <div>{propertiesUnderBudget} under budget</div>
              <div>{propertiesOverBudget} over budget</div>
              <div>Strong expense management</div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Savings Opportunities */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Cost Savings Opportunities</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$4.2M</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>Identified savings potential</div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Balance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Trust Balance</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$235K</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>Across 3 accounts</div>
            </div>
          </CardContent>
        </Card>

        {/* Cashback Earned */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Cashback Earned</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$24K</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>YTD from credit cards</div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Pending Approvals</h3>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>$15,550 total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Action Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActionItem
              title="Emergency HVAC repair - classroom 245"
              property="Stanford Graduate School of Business"
              amount="$2,500"
              status="urgent"
              button="Review"
              setActiveTab={setActiveTab}
            />
            <ActionItem
              title="Elevator modernization - safety compliance"
              property="Mission Bay Tech Campus"
              amount="$45,000"
              status="urgent"
              button="Review"
              setActiveTab={setActiveTab}
            />
            <ActionItem
              title="LED lighting upgrade - Building A"
              property="Redwood Shores Office Complex"
              amount="$12,000"
              status="low"
              button="Review"
              setActiveTab={setActiveTab}
            />
            <ActionItem
              title="Security system upgrade"
              property="Palo Alto Research Center"
              amount="$8,900"
              status="medium"
              button="Review"
              setActiveTab={setActiveTab}
            />
            <ActionItem
              title="Weekend emergency lockout service"
              property="South Bay Industrial Park"
              amount="$2,800"
              status="urgent"
              button="Review"
              setActiveTab={setActiveTab}
            />
            <ActionItem
              title="Major HVAC component replacement"
              property="Santa Clara Hub"
              amount="$5,200"
              status="urgent"
              button="Review"
              setActiveTab={setActiveTab}
            />
          </CardContent>
        </Card>

        {/* Portfolio Expense Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Portfolio Expense Status
              <Info className="h-4 w-4 text-gray-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{propertiesUnderBudget}</div>
                <div className="text-sm text-gray-400">Under Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{propertiesOverBudget}</div>
                <div className="text-sm text-gray-400">Over Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">${totalBudget.toFixed(1)}M</div>
                <div className="text-sm text-gray-400">Total Budget</div>
              </div>
            </div>

            {/* Properties Breakdown */}
            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${property.isUnderBudget ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-sm font-medium text-white">{property.name}</div>
                      <div className="text-xs text-gray-400">{property.type} • {property.size}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${property.isUnderBudget ? 'text-green-400' : 'text-red-400'}`}>
                      {property.isUnderBudget ? '-' : '+'}{property.variancePercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      ${property.ytdSpent.toFixed(1)}M YTD / ${property.annualBudget.toFixed(1)}M Annual
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio Variance Summary */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Portfolio Variance</span>
                <span className={`text-lg font-bold ${isPortfolioUnderBudget ? 'text-green-400' : 'text-red-400'}`}>
                  {isPortfolioUnderBudget ? '-' : '+'}{Math.abs(100 - portfolioVariance).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Total YTD Spend: ${totalSpent.toFixed(1)}M • Expected YTD: ${totalExpected.toFixed(1)}M • Variance: ${portfolioVarianceAmount.toFixed(1)}M
              </div>
            </div>

            {/* Top Manager Performance */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-400">Property Manager Performance</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-900 rounded">
                  <div className="text-xs text-green-400">Best Performance</div>
                  <div className="text-sm text-white">Sarah Chen</div>
                  <div className="text-xs text-gray-400">01 STANFORD • -11.6%</div>
                </div>
                <div className="p-2 bg-gray-900 rounded">
                  <div className="text-xs text-red-400">Needs Attention</div>
                  <div className="text-sm text-white">Angela Martinez</div>
                  <div className="text-xs text-gray-400">Industrial Park • +4.3%</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setActiveTab?.('properties')}
            >
              View All Properties
            </Button>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}



// Helper Components
function ActionItem({ title, property, amount, status, button, setActiveTab }: {
  title: string
  property: string
  amount: string
  status: 'urgent' | 'medium' | 'low'
  button: string
  setActiveTab?: (tab: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleReview = () => {
    if (setActiveTab) {
      setActiveTab('expenses')
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-gray-400">{property} • {amount}</div>
        </div>
      </div>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleReview}>
        {button}
      </Button>
    </div>
  )
}

function PropertyExpenseStatus({ name, ytdSpent, budget, isUnderBudget, variancePercentage, varianceAmount }: {
  name: string
  ytdSpent: number
  budget: number
  isUnderBudget: boolean
  variancePercentage: number
  varianceAmount: number
}) {
  // Calculate YTD and July percentages (ytdSpent and budget are already in millions)
  const ytdPercentage = Math.round((ytdSpent / budget) * 100)
  const julyPercentage = Math.round(ytdPercentage * 1.7) // Simulate July being higher pace
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white font-medium">{name}</div>
        <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Behind pace by {Math.abs(variancePercentage).toFixed(0)}%
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-gray-400 text-sm">
            YTD: <span className="text-red-400 font-medium">{ytdPercentage}%</span>
          </div>
          <div className="text-gray-400 text-sm">
            Budget: <span className="text-white">${budget.toFixed(1)}M</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-gray-400 text-sm">
            July: <span className="text-red-400 font-medium">{julyPercentage}%</span>
          </div>
          <div className="text-gray-400 text-sm">
            Spent: <span className="text-white">${ytdSpent.toFixed(1)}M</span>
          </div>
        </div>
      </div>
    </div>
  )
}



// Expenses Tab Component
function ExpensesTab({ setActiveTab, setSharedMessages }: { 
  setActiveTab: (tab: string) => void;
  setSharedMessages: React.Dispatch<React.SetStateAction<{
    id: string;
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    status: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }[]>>;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("MTD")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [propertyFilter, setPropertyFilter] = useState("All")
  const [madeByFilter, setMadeByFilter] = useState("All")
  const [dateFromFilter, setDateFromFilter] = useState("")
  const [dateToFilter, setDateToFilter] = useState("")
  const [showEditRules, setShowEditRules] = useState(false)
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [expenseDetailDialog, setExpenseDetailDialog] = useState<any>(null)
  const [approveExpenseDialog, setApproveExpenseDialog] = useState<any>(null)

  // All Expenses Table Filters
  const [allExpensesStatusFilter, setAllExpensesStatusFilter] = useState("all")
  const [allExpensesTypeFilter, setAllExpensesTypeFilter] = useState("all")
  const [allExpensesPropertyFilter, setAllExpensesPropertyFilter] = useState("all")
  const [allExpensesMadeByFilter, setAllExpensesMadeByFilter] = useState("all")
  const [allExpensesDateFromFilter, setAllExpensesDateFromFilter] = useState("")
  const [allExpensesDateToFilter, setAllExpensesDateToFilter] = useState("")

  // Expense Errors States
  const [approvedErrors, setApprovedErrors] = useState<Set<string>>(new Set())

  // Mock expense data for approval
  const expensesNeedingApproval = [
    {
      id: "exp1",
      date: "2024-02-23",
      merchant: "Oracle Facilities",
      amount: 5500.00,
      type: "Vendor",
      madeBy: "Jessica Chen (Property Manager)",
      property: "01 STANFORD",
      workOrder: "HVAC System Maintenance - Annual Service",
      workOrderId: "job1",
      isWorkOrderRelated: true,
      memo: "Energy efficient retrofit for entire building",
      receipt: "✓",
      status: "Flagged",
      glCode: "522.1",
      glName: "HVAC Repairs"
    },
    {
      id: "exp2",
      date: "2024-02-14",
      merchant: "Security Systems Inc",
      amount: 4800.00,
      type: "Vendor",
      madeBy: "David Chen (Property Manager)",
      property: "02 SUNNYVALE",
      workOrder: "Emergency Plumbing Repair - Kitchen Sink",
      workOrderId: "job2",
      isWorkOrderRelated: true,
      memo: "Upgrade req...",
      receipt: "✓",
      status: "Flagged",
      glCode: "522.2",
      glName: "Plumbing Repairs"
    },
    {
      id: "exp3",
      date: "2024-01-08",
      merchant: "Emergency Plumbing",
      amount: 2800.00,
      type: "Card",
      madeBy: "Mike Rodriguez (Property Manager)",
      property: "03 DOWNTOWN",
      workOrder: "Kitchen Renovation - Countertop Replacement",
      workOrderId: "job4",
      isWorkOrderRelated: true,
      memo: "Emergency t...",
      receipt: "✓",
      status: "Flagged",
      glCode: "522.2",
      glName: "Plumbing Repairs"
    },
    {
      id: "exp3a",
      date: "2024-01-05",
      merchant: "Office Supplies Plus",
      amount: 245.00,
      type: "Card",
      madeBy: "Alice Johnson (Technician)",
      property: "01 STANFORD",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      memo: "General office supplies",
      receipt: "✓",
      status: "Flagged",
      glCode: "505.3",
      glName: "Maintenance Supplies"
    }
  ]

  // Mock processed expenses
  const processedExpenses = [
    {
      id: "exp4",
      date: "2024-02-16",
      merchant: "PlumbPro",
      amount: 1850.00,
      type: "Card",
      madeBy: "Alice Johnson (Technician)",
      property: "01 STANFORD",
      workOrder: "Electrical Panel Upgrade",
      workOrderId: "job5",
      isWorkOrderRelated: true,
      status: "Processed",
      memo: "Routine task leak fix",
      receipt: "✓",
      glCode: "522.3",
      glName: "Electrical Repairs"
    },
    {
      id: "exp5",
      date: "2024-02-16",
      merchant: "CleanTech Solutions",
      amount: 320.00,
      type: "Card",
      madeBy: "Bob Wilson (Technician)",
      property: "02 SUNNYVALE",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Processed",
      memo: "Monthly cleaning service",
      receipt: "✓",
      glCode: "520.1",
      glName: "Cleaning Services"
    },
    {
      id: "exp6",
      date: "2024-02-16",
      merchant: "Landscaping Pro",
      amount: 12000.00,
      type: "Vendor",
      madeBy: "Sarah Kim (Property Manager)",
      property: "03 DOWNTOWN",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Processed",
      memo: "Quarterly maintenance",
      receipt: "✓",
      glCode: "521.1",
      glName: "Landscaping & Grounds"
    },
    {
      id: "exp7",
      date: "2024-02-15",
      merchant: "Office Depot",
      amount: 450.00,
      type: "Card",
      madeBy: "Jennifer Lopez (Technician)",
      property: "01 STANFORD",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Processed",
      memo: "Regular office supplies",
      receipt: "✓",
      glCode: "505.3",
      glName: "Maintenance Supplies"
    }
  ]

  // Mock expense errors data - AI-flagged potential PM errors
  const expenseErrors = [
    {
      id: "error1",
      date: "2025-01-15",
      merchant: "Home Depot",
      amount: 150.00,
      type: "Card",
      madeBy: "John Smith",
      property: "01 STANFORD",
      workOrder: "HVAC System Maintenance - Annual Service",
      errorType: "Missing receipt",
      aiFlag: "Missing receipt",
      billable: "Yes",
      status: "Reimbursed",
      description: "Purchase receipt not uploaded to system",
      glCode: "522.1",
      glName: "HVAC Repairs"
    },
    {
      id: "error2", 
      date: "2025-01-17",
      merchant: "Ace Hardware",
      amount: 45.25,
      type: "Card",
      madeBy: "Alice Johnson",
      property: "01 STANFORD",
      workOrder: "HVAC System Maintenance - Annual Service",
      errorType: "Wrong property",
      aiFlag: "Wrong property",
      billable: "No",
      status: "Non-Reimbursable",
      description: "Expense charged to wrong property code",
      glCode: "522.1",
      glName: "HVAC Repairs"
    },
    {
      id: "error3",
      date: "2025-01-19", 
      merchant: "Staples",
      amount: 89.99,
      type: "Card",
      madeBy: "Lisa Wong",
      property: "02 SUNNYVALE",
      workOrder: "Emergency Plumbing Repair - Kitchen Sink",
      errorType: "Unusual amount",
      aiFlag: "Unusual amount",
      billable: "No",
      status: "Non-Reimbursable", 
      description: "Amount significantly higher than typical for this vendor/category",
      glCode: "505.3",
      glName: "Maintenance Supplies"
    },
    {
      id: "error4",
      date: "2025-01-20",
      merchant: "ABC Electrical Services", 
      amount: 2500.00,
      type: "Vendor",
      madeBy: "Property Manager",
      property: "02 SUNNYVALE",
      workOrder: "Electrical Panel Upgrade",
      errorType: "Missing receipt",
      aiFlag: "Missing receipt",
      billable: "Yes",
      status: "Pending",
      description: "High-value transaction without supporting documentation",
      glCode: "522.3",
      glName: "Electrical Repairs"
    }
  ]

  // All expenses data (combination of all expense types)
  const allExpensesData = [
    {
      id: "exp1",
      date: "2024-02-23",
      merchant: "Oracle Facilities",
      amount: 5500.00,
      type: "Vendor",
      madeBy: "Jessica Chen (Property Manager)",
      property: "01 STANFORD",
      workOrder: "HVAC System Maintenance - Annual Service",
      workOrderId: "job1",
      isWorkOrderRelated: true,
      memo: "Energy efficient retrofit for entire building",
      receipt: "✓",
      status: "Flagged",
      glCode: "522.1",
      glName: "HVAC Repairs"
    },
    {
      id: "exp2",
      date: "2024-02-14",
      merchant: "Security Systems Inc",
      amount: 4800.00,
      type: "Vendor",
      madeBy: "David Chen (Property Manager)",
      property: "02 SUNNYVALE",
      workOrder: "Emergency Plumbing Repair - Kitchen Sink",
      workOrderId: "job2",
      isWorkOrderRelated: true,
      memo: "Upgrade req...",
      receipt: "✓",
      status: "Flagged",
      glCode: "522.2",
      glName: "Plumbing Repairs"
    },
    {
      id: "exp4",
      date: "2024-02-16",
      merchant: "PlumbPro",
      amount: 1850.00,
      type: "Card",
      madeBy: "Alice Johnson (Technician)",
      property: "03 DOWNTOWN",
      workOrder: "Electrical Panel Upgrade",
      workOrderId: "job5",
      isWorkOrderRelated: true,
      status: "Processed",
      memo: "Routine task leak fix",
      receipt: "✓",
      glCode: "522.3",
      glName: "Electrical Repairs"
    },
    {
      id: "exp5",
      date: "2024-02-16",
      merchant: "CleanTech Solutions",
      amount: 320.00,
      type: "Card",
      madeBy: "Bob Wilson (Technician)",
      property: "02 SUNNYVALE",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Processed",
      memo: "Monthly cleaning service",
      receipt: "✓",
      glCode: "520.1",
      glName: "Cleaning Services"
    },
    {
      id: "exp6",
      date: "2024-02-16",
      merchant: "Landscaping Pro",
      amount: 12000.00,
      type: "Vendor",
      madeBy: "Sarah Kim (Property Manager)",
      property: "03 DOWNTOWN",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Processed",
      memo: "Quarterly maintenance",
      receipt: "✓",
      glCode: "521.1",
      glName: "Landscaping & Grounds"
    },
    {
      id: "exp7",
      date: "2024-02-15",
      merchant: "Office Depot",
      amount: 450.00,
      type: "Card",
      madeBy: "Jennifer Lopez (Technician)",
      property: "01 STANFORD",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Processed",
      memo: "Regular office supplies",
      receipt: "✓",
      glCode: "505.3",
      glName: "Maintenance Supplies"
    },
    {
      id: "exp8",
      date: "2024-02-20",
      merchant: "ServiceMaster",
      amount: 750.00,
      type: "Vendor",
      madeBy: "Jessica Chen (Property Manager)",
      property: "01 STANFORD",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Pending",
      memo: "Critical system failure during finals week. Temporary solution in place.",
      receipt: "✓",
      glCode: "522.0",
      glName: "General Maintenance"
    },
    {
      id: "exp9",
      date: "2024-02-19",
      merchant: "Elevator Services Inc.",
      amount: 200.00,
      type: "Vendor",
      madeBy: "Michael Rodriguez (Property Manager)",
      property: "02 SUNNYVALE",
      workOrder: null,
      workOrderId: null,
      isWorkOrderRelated: false,
      status: "Not Uploaded",
      memo: "City inspector flagged elevator safety issues. Accommodation required for compliance.",
      receipt: "✓",
      glCode: "523.1",
      glName: "Elevator Services"
    }
  ]

  // Filter functions
  const filterExpenses = (expenses: any[]) => {
    return expenses.filter(expense => {
      // Status filter
      if (statusFilter !== "All" && expense.status !== statusFilter) return false
      
      // Type filter
      if (typeFilter !== "All" && expense.type !== typeFilter) return false
      
      // Property filter
      if (propertyFilter !== "All") {
        if (propertyFilter === "01 STANFORD" && !expense.property.includes("STANFORD")) return false
        if (propertyFilter === "Mission Bay" && !expense.property.includes("Mission Bay")) return false
      }
      
      // Made By filter
      if (madeByFilter !== "All") {
        if (madeByFilter === "PM" && !expense.madeBy.includes("Property Manager")) return false
        if (madeByFilter === "Technician" && !expense.madeBy.includes("Technician")) return false
      }
      
      // Date filters
      if (dateFromFilter && new Date(expense.date) < new Date(dateFromFilter)) return false
      if (dateToFilter && new Date(expense.date) > new Date(dateToFilter)) return false
      
      return true
    })
  }

  const filterAllExpenses = (expenses: any[]) => {
    return expenses.filter(expense => {
      // Status filter
      if (allExpensesStatusFilter !== "all") {
        if (allExpensesStatusFilter === "pending" && expense.status !== "Pending") return false
        if (allExpensesStatusFilter === "approved" && expense.status !== "Processed") return false
      }
      
      // Type filter
      if (allExpensesTypeFilter !== "all") {
        if (allExpensesTypeFilter === "card" && expense.type !== "Card") return false
        if (allExpensesTypeFilter === "invoice" && expense.type !== "Invoice") return false
        if (allExpensesTypeFilter === "vendor" && expense.type !== "Vendor") return false
      }
      
      // Property filter
      if (allExpensesPropertyFilter !== "all") {
        if (allExpensesPropertyFilter === "stanford" && !expense.property.includes("Stanford")) return false
        if (allExpensesPropertyFilter === "mission" && !expense.property.includes("Mission")) return false
      }
      
      // Made By filter
      if (allExpensesMadeByFilter !== "all") {
        if (allExpensesMadeByFilter === "pm" && !expense.madeBy.includes("Property Manager")) return false
        if (allExpensesMadeByFilter === "tech" && !expense.madeBy.includes("Technician")) return false
      }
      
      // Date filters
      if (allExpensesDateFromFilter && new Date(expense.date) < new Date(allExpensesDateFromFilter)) return false
      if (allExpensesDateToFilter && new Date(expense.date) > new Date(allExpensesDateToFilter)) return false
      
      return true
    })
  }

  const filteredExpensesNeedingApproval = filterExpenses(expensesNeedingApproval)
  const filteredProcessedExpenses = filterExpenses(processedExpenses)
  const filteredAllExpenses = filterAllExpenses(allExpensesData)

  const handleApprove = (expenseId: string) => {
    const expense = [...expensesNeedingApproval, ...processedExpenses].find(e => e.id === expenseId)
    if (expense) {
      setApproveExpenseDialog(expense)
    }
  }

  const handleDeny = (expenseId: string) => {
    console.log(`Denying expense: ${expenseId}`)
    // TODO: Implement deny functionality
  }

  const handleViewDetails = (expenseId: string) => {
    const expense = [...expensesNeedingApproval, ...processedExpenses, ...allExpensesData].find(e => e.id === expenseId)
    if (expense) {
      if (expense.isWorkOrderRelated && expense.workOrderId) {
        // Navigate to work order detail page (exact same page as PM > Work orders > view details but for owners)
        window.location.href = `/workorders/${expense.workOrderId}?role=owner`
      } else {
        // Show popup dialog for non-work order expenses (like PM > Expenses > eye icon)
        setExpenseDetailDialog(expense)
      }
    }
  }

  const confirmApproval = () => {
    if (approveExpenseDialog) {
      console.log(`Approved expense: ${approveExpenseDialog.id}`)
      setApproveExpenseDialog(null)
      // TODO: Update expense status
    }
  }

  // Expense Error Handlers
  const handleApproveError = (errorId: string) => {
    // Add to approved errors set
    setApprovedErrors(prev => new Set([...prev, errorId]))
    console.log(`Approved expense error: ${errorId}`)
  }

  const handleContactPM = (error: any) => {
    // Directly send message to communications hub without dialog
    const messageContent = `Hi, I noticed an issue with the expense from ${error.merchant} on ${error.date} for $${error.amount.toFixed(2)}. The AI system flagged this as: ${error.description}. Can you please review and clarify?`
    
    const newMessage = {
      id: Date.now().toString(),
      propertyId: error.property.toLowerCase().replace(/\s+/g, ''),
      propertyName: error.property,
      senderId: "owner1",
      senderName: "Property Owner",
      senderRole: "owner",
      content: messageContent,
      timestamp: new Date(),
      status: "sent",
      threadId: `expense_error_${error.id}`,
      type: "expense_error",
      relatedExpenses: [error.id]
    }
    
    setSharedMessages((prev: any) => [...prev, newMessage])
    
    // Navigate directly to communications tab
    setActiveTab("communications")
  }

  const handleBulkExport = (type: 'csv' | 'receipts' | 'bookkeeper') => {
    const selectedCount = selectedExpenses.length
    
    if (type === 'csv') {
      // Create CSV data
      const csvData = filteredAllExpenses.map(expense => ({
        Date: expense.date,
        Merchant: expense.merchant,
        Amount: expense.amount,
        Type: expense.type,
        'Made By': expense.madeBy,
        Property: expense.property,
        Status: expense.status,
        'Work Order Related': expense.isWorkOrderRelated ? 'Yes' : 'No',
        Memo: expense.memo
      }))
      
      // Convert to CSV string
      const csvString = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n')
      
      // Download
      const blob = new Blob([csvString], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      
    } else if (type === 'receipts') {
      // Create zip file with receipts (mock functionality)
      alert(`Downloading ${selectedCount || filteredAllExpenses.length} receipts as ZIP file...`)
      
    } else if (type === 'bookkeeper') {
      // Send to bookkeeper (mock functionality)
      alert(`Sending ${selectedCount || filteredAllExpenses.length} expenses to bookkeeper...`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Expenses</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Period:</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="MTD" className="text-white">MTD</SelectItem>
                <SelectItem value="YTD" className="text-white">YTD</SelectItem>
                <SelectItem value="QTD" className="text-white">QTD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">$2,450,000</div>
            <div className="text-sm text-gray-400">Total Expenses (MTD)</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">6</div>
            <div className="text-sm text-gray-400">Need Approval</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">4</div>
            <div className="text-sm text-gray-400">Processed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">$24,150</div>
            <div className="text-sm text-gray-400">Cashback (MTD)</div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Policy Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5" />
              Expense Policy Summary
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditRules(!showEditRules)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Rules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600 text-white">
              <Flag className="h-3 w-3 mr-1" />
              Auto-flag &gt; $2,000
            </Badge>
            <Badge className="bg-green-600 text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Auto-flag &gt; 10% of budget
            </Badge>
            <Badge className="bg-purple-600 text-white">
              <Receipt className="h-3 w-3 mr-1" />
              Receipts required
            </Badge>
            <Badge className="bg-yellow-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Pre-approval &gt; $500
            </Badge>
            <Badge className="bg-red-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Maintenance &gt; $5K
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Export & Bookkeeping */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              <span className="text-white">Export & Bookkeeping</span>
              <Badge className="bg-gray-700 text-gray-300">{selectedExpenses.length} selected</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkExport('csv')}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV ({selectedExpenses.length || filteredAllExpenses.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkExport('receipts')}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Download Receipts ({selectedExpenses.length || filteredAllExpenses.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkExport('bookkeeper')}
                className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Bookkeeper ({selectedExpenses.length || filteredAllExpenses.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-6 gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All" className="text-white">All</SelectItem>
            <SelectItem value="Flagged" className="text-white">Flagged</SelectItem>
            <SelectItem value="Processed" className="text-white">Processed</SelectItem>
            <SelectItem value="Pending" className="text-white">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All" className="text-white">All</SelectItem>
            <SelectItem value="Card" className="text-white">Card</SelectItem>
            <SelectItem value="Invoice" className="text-white">Invoice</SelectItem>
            <SelectItem value="Vendor" className="text-white">Vendor</SelectItem>
          </SelectContent>
        </Select>
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Property" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All" className="text-white">All</SelectItem>
                                    <SelectItem value="01 STANFORD" className="text-white">01 STANFORD</SelectItem>
            <SelectItem value="Mission Bay" className="text-white">Mission Bay</SelectItem>
          </SelectContent>
        </Select>
        <Select value={madeByFilter} onValueChange={setMadeByFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Made By" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All" className="text-white">All</SelectItem>
            <SelectItem value="PM" className="text-white">Property Manager</SelectItem>
            <SelectItem value="Technician" className="text-white">Technician</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFromFilter}
          onChange={(e) => setDateFromFilter(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="mm/dd/yyyy"
        />
        <Input
          type="date"
          value={dateToFilter}
          onChange={(e) => setDateToFilter(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="mm/dd/yyyy"
        />
      </div>

      {/* Expenses Needing Approval */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Expenses Needing Approval ({filteredExpensesNeedingApproval.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Work Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">GL Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Memo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {filteredExpensesNeedingApproval.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.merchant}</td>
                    <td className="py-3 px-4 text-white">${expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={expense.type === 'Vendor' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.madeBy}</td>
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4">
                      {expense.isWorkOrderRelated && expense.workOrderId ? (
                        <button
                          className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          onClick={() => window.location.href = `/workorders/${expense.workOrderId}?role=owner&returnTo=expenses`}
                        >
                          {expense.workOrder}
                        </button>
                      ) : (
                        <span className="text-white">{expense.workOrder || 'N/A'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-blue-300">{expense.glCode || 'N/A'}</div>
                      <div className="text-xs text-blue-200">{expense.glName || ''}</div>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.memo}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(expense.id)}
                          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(expense.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeny(expense.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          Deny
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Errors */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-orange-400" />
            Expense Errors ({expenseErrors.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            AI-detected potential errors that need review. These include missing receipts, wrong property assignments, unusual amounts, and other data inconsistencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Work Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">GL Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Billable</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">AI Flag</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenseErrors.map((error) => (
                  <tr key={error.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{error.date}</td>
                    <td className="py-3 px-4 text-white">{error.merchant}</td>
                    <td className="py-3 px-4 text-white">${error.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-white">{error.madeBy}</td>
                    <td className="py-3 px-4 text-white">{error.property}</td>
                    <td className="py-3 px-4">
                      {error.workOrder ? (
                        <button
                          className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          onClick={() => window.location.href = `/workorders/job1?role=owner&returnTo=expenses`}
                        >
                          {error.workOrder}
                        </button>
                      ) : (
                        <span className="text-white">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-blue-300">{error.glCode || 'N/A'}</div>
                      <div className="text-xs text-blue-200">{error.glName || ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={error.billable === 'Yes' ? 'bg-green-600' : 'bg-red-600'}>
                        {error.billable}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={
                        error.status === 'Reimbursed' ? 'bg-blue-600' : 
                        error.status === 'Pending' ? 'bg-yellow-600' : 
                        'bg-gray-600'
                      }>
                        {error.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-orange-600 text-white">
                        {error.aiFlag}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {approvedErrors.has(error.id) ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Approved</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleApproveError(error.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleContactPM(error)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact PM
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Processed Expenses */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Processed Expenses ({filteredProcessedExpenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Work Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">GL Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Memo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {filteredProcessedExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.merchant}</td>
                    <td className="py-3 px-4 text-white">${expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={expense.type === 'Vendor' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.madeBy}</td>
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4">
                      {expense.isWorkOrderRelated && expense.workOrderId ? (
                        <button
                          className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          onClick={() => window.location.href = `/workorders/${expense.workOrderId}?role=owner&returnTo=expenses`}
                        >
                          {expense.workOrder}
                        </button>
                      ) : (
                        <span className="text-white">{expense.workOrder || 'N/A'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-blue-300">{expense.glCode || 'N/A'}</div>
                      <div className="text-xs text-blue-200">{expense.glName || ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-600 text-white">
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.memo}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(expense.id)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Expenses Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <Select value={allExpensesStatusFilter} onValueChange={setAllExpensesStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">All</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="approved" className="text-white">Approved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={allExpensesTypeFilter} onValueChange={setAllExpensesTypeFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">All</SelectItem>
                <SelectItem value="card" className="text-white">Card</SelectItem>
                <SelectItem value="invoice" className="text-white">Invoice</SelectItem>
                <SelectItem value="vendor" className="text-white">Vendor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={allExpensesPropertyFilter} onValueChange={setAllExpensesPropertyFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">All</SelectItem>
                                      <SelectItem value="stanford" className="text-white">01 STANFORD</SelectItem>
                <SelectItem value="mission" className="text-white">Mission Bay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={allExpensesMadeByFilter} onValueChange={setAllExpensesMadeByFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Made By" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">All</SelectItem>
                <SelectItem value="pm" className="text-white">Property Manager</SelectItem>
                <SelectItem value="tech" className="text-white">Technician</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={allExpensesDateFromFilter}
              onChange={(e) => setAllExpensesDateFromFilter(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="mm/dd/yyyy"
            />
            <Input
              type="date"
              value={allExpensesDateToFilter}
              onChange={(e) => setAllExpensesDateToFilter(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="mm/dd/yyyy"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Work Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">GL Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Memo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.merchant}</td>
                    <td className="py-3 px-4 text-white">${expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={expense.type === 'Vendor' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.madeBy}</td>
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4">
                      {expense.isWorkOrderRelated && expense.workOrderId ? (
                        <button
                          className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          onClick={() => window.location.href = `/workorders/${expense.workOrderId}?role=owner&returnTo=expenses`}
                        >
                          {expense.workOrder}
                        </button>
                      ) : (
                        <span className="text-white">{expense.workOrder || 'N/A'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-blue-300">{expense.glCode || 'N/A'}</div>
                      <div className="text-xs text-blue-200">{expense.glName || ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={
                        expense.status === 'Processed' ? 'bg-green-600' : 
                        expense.status === 'Pending' ? 'bg-yellow-600' : 
                        expense.status === 'Flagged' ? 'bg-red-600' : 'bg-gray-600'
                      }>
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.memo}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(expense.id)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Rules Dialog */}
      <Dialog open={showEditRules} onOpenChange={setShowEditRules}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit AI Policy Rules</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure automatic flagging rules for expense approvals
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current Rules */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Current Policy Rules</h3>
              <div className="space-y-3">
                {[
                  { category: 'Amount Threshold', rule: 'Auto-flag expenses over $2,000', aiEnabled: true, active: true },
                  { category: 'Budget Variance', rule: 'Auto-flag expenses over 10% of budget', aiEnabled: true, active: true },
                  { category: 'Receipt Requirements', rule: 'Flag expenses without receipts', aiEnabled: false, active: true },
                  { category: 'Pre-approval', rule: 'Require pre-approval for expenses over $500', aiEnabled: false, active: true },
                  { category: 'Maintenance Threshold', rule: 'Flag maintenance expenses over $5,000', aiEnabled: true, active: true }
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-purple-600 text-white">{rule.category}</Badge>
                        {rule.aiEnabled && <Badge className="bg-blue-600 text-white">AI Enabled</Badge>}
                      </div>
                      <p className="text-white mt-2">{rule.rule}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={rule.active} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Rule */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Add New Rule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="amount" className="text-white">Amount Threshold</SelectItem>
                      <SelectItem value="vendor" className="text-white">Vendor Restrictions</SelectItem>
                      <SelectItem value="category" className="text-white">Expense Category</SelectItem>
                      <SelectItem value="property" className="text-white">Property Specific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Rule Type</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="flag" className="text-white">Auto-flag</SelectItem>
                      <SelectItem value="approve" className="text-white">Auto-approve</SelectItem>
                      <SelectItem value="deny" className="text-white">Auto-deny</SelectItem>
                      <SelectItem value="require" className="text-white">Require approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-gray-300">Rule Description</Label>
                <Textarea
                  placeholder="Describe the rule logic..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditRules(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Detail Dialog (for non-work order expenses) */}
      <Dialog open={!!expenseDetailDialog} onOpenChange={() => setExpenseDetailDialog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information for this expense
            </DialogDescription>
          </DialogHeader>
          
          {expenseDetailDialog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Date</Label>
                  <div className="text-white">{expenseDetailDialog.date}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Amount</Label>
                  <div className="text-white text-xl font-bold">${expenseDetailDialog.amount.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Merchant</Label>
                  <div className="text-white">{expenseDetailDialog.merchant}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Type</Label>
                  <Badge className={expenseDetailDialog.type === 'Vendor' ? 'bg-purple-600' : 'bg-blue-600'}>
                    {expenseDetailDialog.type}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Made By</Label>
                <div className="text-white">{expenseDetailDialog.madeBy}</div>
              </div>

              <div>
                <Label className="text-gray-300">Property</Label>
                <div className="text-white">{expenseDetailDialog.property}</div>
              </div>

              <div>
                <Label className="text-gray-300">Memo</Label>
                <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.memo}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-300">Receipt Available:</Label>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <a
                    href={`/receipts/${expenseDetailDialog.id}_receipt.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline ml-2"
                  >
                    View Receipt
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-300">Work Order Related:</Label>
                  {expenseDetailDialog.isWorkOrderRelated ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExpenseDetailDialog(null)}
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
            {expenseDetailDialog?.status === 'Flagged' && (
              <Button
                onClick={() => handleApprove(expenseDetailDialog.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Expense
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Expense Dialog */}
      <Dialog open={!!approveExpenseDialog} onOpenChange={() => setApproveExpenseDialog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Approve Expense</DialogTitle>
            <DialogDescription className="text-gray-400">
              Confirm approval for this expense
            </DialogDescription>
          </DialogHeader>
          
          {approveExpenseDialog && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Merchant:</span>
                  <span className="text-white font-medium">{approveExpenseDialog.merchant}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-white text-xl font-bold">${approveExpenseDialog.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Property:</span>
                  <span className="text-white">{approveExpenseDialog.property}</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Approval Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any notes about this approval..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveExpenseDialog(null)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproval}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}

function PropertiesTab({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
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

  // Owner Information Data
  const ownerInfo = {
    name: "N/A",
    email: "N/A", 
    address: "N/A",
    phone: "N/A",
    preferredContact: "Email"
  }

  // Staff Data  
  const staffMembers: Array<{name: string, role: string, phone: string, email: string}> = [
    // No staff assigned to General
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
    // Navigate to transactions tab
    if (setActiveTab) {
      setActiveTab('transactions');
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

      {/* Properties Table - Matching Screenshot */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Staff list</h3>
        
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

function ForecastingTab({ setActiveTab, addMessage }: { 
  setActiveTab: (tab: string) => void;
  addMessage: (message: {
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }) => void;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly")
  const [dateRange, setDateRange] = useState("Rest of 2025")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showEditExpenses, setShowEditExpenses] = useState(false)
  const [showAdjustForecast, setShowAdjustForecast] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null)
  const [showApplyRecommendation, setShowApplyRecommendation] = useState(false)
  const [selectedRecommendationType, setSelectedRecommendationType] = useState("")
  const [communicationMessage, setCommunicationMessage] = useState("")

  // Mock data for the chart
  const monthlyData = [
    { month: 'Jan', actual: 1200000, forecast: 1250000, budget: 1300000 },
    { month: 'Feb', actual: 1150000, forecast: 1200000, budget: 1280000 },
    { month: 'Mar', actual: 1300000, forecast: 1350000, budget: 1400000 },
    { month: 'Apr', actual: 1100000, forecast: 1150000, budget: 1200000 },
    { month: 'May', actual: 1250000, forecast: 1300000, budget: 1350000 },
    { month: 'Jun', actual: 1180000, forecast: 1220000, budget: 1250000 },
    { month: 'Jul', actual: 0, forecast: 1400000, budget: 1450000 },
    { month: 'Aug', actual: 0, forecast: 1350000, budget: 1400000 },
    { month: 'Sep', actual: 0, forecast: 1300000, budget: 1350000 },
    { month: 'Oct', actual: 0, forecast: 1250000, budget: 1300000 },
    { month: 'Nov', actual: 0, forecast: 1200000, budget: 1250000 },
    { month: 'Dec', actual: 0, forecast: 1150000, budget: 1200000 }
  ]

  const quarterlyData = [
    { month: 'Q1', actual: 3650000, forecast: 3800000, budget: 3980000 },
    { month: 'Q2', actual: 3530000, forecast: 3670000, budget: 3800000 },
    { month: 'Q3', actual: 0, forecast: 4050000, budget: 4200000 },
    { month: 'Q4', actual: 0, forecast: 3600000, budget: 3750000 }
  ]

  const getChartData = () => {
    return selectedPeriod === "Monthly" ? monthlyData : quarterlyData
  }

  const getKPIData = () => {
    const data = getChartData()
    const totalForecast = data.reduce((sum, item) => sum + item.forecast, 0)
    const totalBudget = data.reduce((sum, item) => sum + item.budget, 0)
    const remainingBudget = totalBudget - totalForecast
    
    return {
      forecastedSpend: totalForecast,
      remainingBudget: totalBudget,
      budgetDelta: remainingBudget,
      budgetStatus: remainingBudget > 0 ? "Under Budget" : remainingBudget < 0 ? "Over Budget" : "At Budget",
      budgetStatusColor: remainingBudget > 0 ? "text-green-400" : remainingBudget < 0 ? "text-red-400" : "text-yellow-400"
    }
  }

  const upcomingExpenses = [
    {
      id: 1,
      property: "03 DOWNTOWN",
      date: "12/14/2024",
      category: "Maintenance",
      amount: 18500,
      source: "Smart Insights"
    },
    {
      id: 2,
      property: "02 SUNNYVALE",
      date: "1/7/2025",
      category: "Capital Improvements",
      amount: 45000,
      source: "Contract"
    },
    {
      id: 3,
      property: "01 STANFORD",
      date: "1/31/2025",
      category: "Recurring OpEx",
      amount: 12000,
      source: "Manual Entry"
    }
  ]

  const handleExportReport = () => {
    // Create a mock CSV export
    const csvData = [
      ['Property', 'Month', 'Actual', 'Forecast', 'Budget', 'Variance'],
      ['Redwood Shores', 'Jan 2025', '1200000', '1250000', '1300000', '-100000'],
      ['Mission Bay', 'Jan 2025', '1150000', '1200000', '1280000', '-130000'],
      ['Skyline Vista', 'Jan 2025', '1100000', '1150000', '1200000', '-100000']
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forecast-report-${dateRange.replace(' ', '-').toLowerCase()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleAddExpense = () => {
    setShowAddExpense(true)
  }

  const handleEditExpense = (id: number) => {
    setSelectedExpenseId(id)
    setShowEditExpenses(true)
  }

  const handleViewInExpenses = () => {
    // Navigate to expenses tab filtered for Mission Bay property
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('tab', 'expenses')
    searchParams.set('property', 'Mission Bay Tech Campus')
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`)
    setActiveTab('expenses')
  }

  const handleAdjustForecast = () => {
    setShowAdjustForecast(true)
  }

  const handleApplyRecommendation = (type: string) => {
    setSelectedRecommendationType(type)
    
    // Auto-populate communication message based on recommendation type
    let message = ""
    switch (type) {
      case "early_maintenance":
        message = "Hi Team,\n\nBased on our Smart Forecast analysis, we recommend scheduling early maintenance for the HVAC system at Mission Bay Tech Campus. This proactive approach will help prevent potential failures and reduce overall costs.\n\nPlease coordinate with the maintenance team to schedule this within the next 2 weeks.\n\nDetails:\n- Property: Mission Bay Tech Campus\n- System: HVAC\n- Recommended Action: Early maintenance\n- Expected Cost Savings: $8,500\n- Timeline: Next 2 weeks\n\nLet me know if you need any additional information.\n\nBest regards,\nProperty Owner"
        break
      case "vendor_contract":
        message = "Hi Team,\n\nOur Smart Forecast analysis indicates we should renegotiate the vendor contract for plumbing services at Mission Bay Tech Campus. Current rates are above market averages.\n\nPlease review the following:\n- Current contract terms\n- Market rate analysis\n- Alternative vendor options\n- Negotiate better rates or find replacement vendor\n\nExpected savings: $12,000 annually\n\nPlease provide an update within 1 week.\n\nBest regards,\nProperty Owner"
        break
      case "emergency_fund":
        message = "Hi Team,\n\nSmart Forecast analysis recommends increasing the emergency fund allocation for Mission Bay Tech Campus due to aging infrastructure.\n\nRecommendation:\n- Increase emergency fund by $25,000\n- Focus on electrical and plumbing systems\n- Schedule preventive assessments\n\nThis will help us avoid costly emergency repairs and maintain property value.\n\nPlease confirm receipt and let me know about implementation timeline.\n\nBest regards,\nProperty Owner"
        break
      default:
        message = "Hi Team,\n\nBased on our Smart Forecast analysis, we have a recommendation for Mission Bay Tech Campus that requires your attention.\n\nPlease review the forecast data and coordinate the recommended actions.\n\nLet me know if you need any clarification.\n\nBest regards,\nProperty Owner"
    }
    
    setCommunicationMessage(message)
    setShowApplyRecommendation(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Forecasting</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Date Range:</span>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="Rest of 2025" className="text-white">Rest of 2025</SelectItem>
                <SelectItem value="2026" className="text-white">2026</SelectItem>
                <SelectItem value="Next 6 months" className="text-white">Next 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleExportReport}
          >
            Export Forecast Report
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Forecasted Spend</div>
            <div className="text-2xl font-bold text-white">${getKPIData().forecastedSpend.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total Forecasted ({selectedPeriod})</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-blue-400">${getKPIData().remainingBudget.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total Budget ({selectedPeriod})</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Remaining Budget - Forecasted Spend</div>
            <div className={`text-2xl font-bold ${getKPIData().budgetStatusColor}`}>${Math.abs(getKPIData().budgetDelta).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">{getKPIData().budgetStatus}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Risk Level</div>
            <Badge className={getKPIData().budgetDelta < 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}>
              {getKPIData().budgetDelta < 0 ? "High Risk" : "Low Risk"}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              {getKPIData().budgetDelta < 0 ? "Over budget - immediate action required" : "Within budget parameters"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Curve */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Spend Curve</CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedPeriod("Monthly")}
                  className={selectedPeriod === "Monthly" ? "bg-blue-600 border-blue-600 text-white" : "border-gray-600 text-gray-300"}
                >
                  Monthly
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedPeriod("Quarterly")}
                  className={selectedPeriod === "Quarterly" ? "bg-blue-600 border-blue-600 text-white" : "border-gray-600 text-gray-300"}
                >
                  Quarterly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #4B5563',
                      borderRadius: '6px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Actual"
                    dot={{ fill: '#3B82F6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                    dot={{ fill: '#8B5CF6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Budget"
                    dot={{ fill: '#EF4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-lg font-bold text-orange-400">Medium Risk</span>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              1 properties exceed budget threshold
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Action required on flagged properties
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Expenses */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Upcoming Expenses</CardTitle>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddExpense}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Projected Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        expense.category === 'Maintenance' ? 'bg-blue-600' :
                        expense.category === 'Capital Improvements' ? 'bg-purple-600' :
                        'bg-green-600'
                      }>
                        {expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">${expense.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">{expense.source}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExpense(expense.id)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-orange-300">Medium Risk</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Redwood Shores projected to exceed budget by $42K in November. Drivers: Maintenance (65%), Unexpected Repairs (35%)
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Maintenance 65% Unexpected Repairs 35%
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewInExpenses}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                View in Expenses
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAdjustForecast}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Adjust Forecast
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Forecast Recommendations */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Smart Forecast Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cost Optimization */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-blue-300">Cost Optimization</span>
            </div>
            <h4 className="font-medium text-white mb-2">Delay elevator modernization → save $45K (Q1 2025)</h4>
            <p className="text-sm text-gray-300 mb-4">
              Delay Mission Bay elevator modernization to Q1 2025 to reduce current quarter spend and improve cash flow
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Potential savings: $45K | Risk level: Low
            </div>
            <Button
              size="sm"
              onClick={() => handleApplyRecommendation('delay-elevator')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Recommendation
            </Button>
          </div>

          {/* Budget Opportunity */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-300">Budget Opportunity</span>
            </div>
            <h4 className="font-medium text-white mb-2">Advance HVAC upgrade at Skyline Vista → use remaining budget</h4>
            <p className="text-sm text-gray-300 mb-4">
              Skyline Vista is significantly under budget. Consider advancing planned HVAC efficiency upgrades to capture winter rates
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Available budget: $32K | Recommended action: advance
            </div>
            <Button
              size="sm"
              onClick={() => handleApplyRecommendation('advance-hvac')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Apply Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Projected Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Property</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="redwood" className="text-white">Redwood Shores</SelectItem>
                  <SelectItem value="mission" className="text-white">Mission Bay</SelectItem>
                  <SelectItem value="skyline" className="text-white">Skyline Vista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Date</Label>
              <Input type="date" className="bg-gray-800 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Category</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="maintenance" className="text-white">Maintenance</SelectItem>
                  <SelectItem value="capital" className="text-white">Capital Improvements</SelectItem>
                  <SelectItem value="opex" className="text-white">Recurring OpEx</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Amount</Label>
              <Input type="number" placeholder="Enter amount" className="bg-gray-800 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea placeholder="Enter description" className="bg-gray-800 border-gray-600 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExpense(false)}>Cancel</Button>
            <Button onClick={() => setShowAddExpense(false)} className="bg-green-600 hover:bg-green-700">Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expenses Dialog */}
      <Dialog open={showEditExpenses} onOpenChange={setShowEditExpenses}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Upcoming Expenses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {upcomingExpenses.map((expense) => (
                <div key={expense.id} className="border border-gray-600 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Property</Label>
                      <Select defaultValue={expense.property}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="Redwood Shores" className="text-white">Redwood Shores</SelectItem>
                          <SelectItem value="Mission Bay" className="text-white">Mission Bay</SelectItem>
                          <SelectItem value="Skyline Vista" className="text-white">Skyline Vista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Date</Label>
                      <Input type="date" defaultValue={expense.date} className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Category</Label>
                      <Select defaultValue={expense.category}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="Maintenance" className="text-white">Maintenance</SelectItem>
                          <SelectItem value="Capital Improvements" className="text-white">Capital Improvements</SelectItem>
                          <SelectItem value="Recurring OpEx" className="text-white">Recurring OpEx</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Amount</Label>
                      <Input type="number" defaultValue={expense.amount} className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="bg-red-600 hover:bg-red-700 text-white">
                      Delete
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditExpenses(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Forecast Dialog */}
      <Dialog open={showAdjustForecast} onOpenChange={setShowAdjustForecast}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adjust Forecast</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Property</Label>
              <Select defaultValue="mission">
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="redwood" className="text-white">Redwood Shores</SelectItem>
                  <SelectItem value="mission" className="text-white">Mission Bay</SelectItem>
                  <SelectItem value="skyline" className="text-white">Skyline Vista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Adjustment Type</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select adjustment type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="increase" className="text-white">Increase Budget</SelectItem>
                  <SelectItem value="decrease" className="text-white">Decrease Budget</SelectItem>
                  <SelectItem value="reallocation" className="text-white">Reallocate Funds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Amount</Label>
              <Input type="number" placeholder="Enter adjustment amount" className="bg-gray-800 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Reason</Label>
              <Textarea placeholder="Explain the reason for this adjustment" className="bg-gray-800 border-gray-600 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustForecast(false)}>Cancel</Button>
            <Button onClick={() => setShowAdjustForecast(false)} className="bg-blue-600 hover:bg-blue-700">Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Recommendation Dialog */}
      <Dialog open={showApplyRecommendation} onOpenChange={setShowApplyRecommendation}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Apply Recommendation - Communications</DialogTitle>
            <DialogDescription className="text-gray-400">
              This message will be sent to the property manager with details about the recommended action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Recommendation Type</Label>
              <div className="text-white font-medium">{selectedRecommendationType.replace('_', ' ').toUpperCase()}</div>
            </div>
            <div>
              <Label className="text-gray-300">Message to Property Manager</Label>
              <Textarea 
                value={communicationMessage}
                onChange={(e) => setCommunicationMessage(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white min-h-[200px]"
                placeholder="Message will be auto-populated based on recommendation type"
              />
            </div>
            <div>
              <Label className="text-gray-300">Priority Level</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                  <SelectItem value="normal" className="text-white">Normal</SelectItem>
                  <SelectItem value="high" className="text-white">High</SelectItem>
                  <SelectItem value="urgent" className="text-white">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyRecommendation(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                // Add the message to the shared state
                addMessage({
                  propertyId: "redwood",
                  propertyName: "Redwood Shores Office Complex",
                  senderId: "owner1",
                  senderName: "Property Owner",
                  senderRole: "owner",
                  content: communicationMessage,
                  threadId: "thread_redwood_forecasting",
                  type: "forecast_recommendation",
                  relatedExpenses: [],
                  packetId: selectedRecommendationType
                })
                
                setShowApplyRecommendation(false)
                setActiveTab('communications')
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Send Message & Go to Communications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SmartInsightsTab() {
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
  const [selectedProperty, setSelectedProperty] = useState("Stanford Graduate School...")
  const [selectedTimeRange, setSelectedTimeRange] = useState("Quarterly")
  const [selectedRegion, setSelectedRegion] = useState("Bay Area")
  const [selectedViewType, setSelectedViewType] = useState("$/sqft")
  
  // New filter states
  const [selectedPMFirm, setSelectedPMFirm] = useState("All")
  const [selectedPropertyClass, setSelectedPropertyClass] = useState("All")
  
  // Checkbox states for comparables
  const [showActuals, setShowActuals] = useState(true)
  const [showMarket, setShowMarket] = useState(true)
  const [showPortfolio, setShowPortfolio] = useState(true)
  const [showYearOverYear, setShowYearOverYear] = useState(false)

  // Base data for different filter combinations
  const benchmarkingDataSets = {
    "Stanford Graduate School...": {
      "Quarterly": {
        "HVAC": { actual: 8400, market: 11800, shouldCost: 8200, portfolio: 8600, yearOverYear: 8900 },
        "Elevator": { actual: 6300, market: 8100, shouldCost: 6500, portfolio: 6400, yearOverYear: 6650 },
        "Fire Safety": { actual: 4100, market: 5900, shouldCost: 4200, portfolio: 4300, yearOverYear: 4350 },
        "Plumbing": { actual: 5900, market: 7800, shouldCost: 5800, portfolio: 6100, yearOverYear: 6200 },
        "General R&M": { actual: 11800, market: 15200, shouldCost: 11500, portfolio: 12000, yearOverYear: 12400 }
      },
      "Monthly": {
        "HVAC": { actual: 2800, market: 3930, shouldCost: 2733, portfolio: 2867, yearOverYear: 2967 },
        "Elevator": { actual: 2100, market: 2700, shouldCost: 2167, portfolio: 2133, yearOverYear: 2217 },
        "Fire Safety": { actual: 1367, market: 1967, shouldCost: 1400, portfolio: 1433, yearOverYear: 1450 },
        "Plumbing": { actual: 1967, market: 2600, shouldCost: 1933, portfolio: 2033, yearOverYear: 2067 },
        "General R&M": { actual: 3933, market: 5067, shouldCost: 3833, portfolio: 4000, yearOverYear: 4133 }
      }
    },
    "Mission Bay Tech Campus": {
      "Quarterly": {
        "HVAC": { actual: 9200, market: 12800, shouldCost: 9000, portfolio: 9400, yearOverYear: 9600 },
        "Elevator": { actual: 6800, market: 8600, shouldCost: 6600, portfolio: 6900, yearOverYear: 7100 },
        "Fire Safety": { actual: 4400, market: 6200, shouldCost: 4300, portfolio: 4500, yearOverYear: 4600 },
        "Plumbing": { actual: 6200, market: 8100, shouldCost: 6000, portfolio: 6300, yearOverYear: 6500 },
        "General R&M": { actual: 12500, market: 16200, shouldCost: 12200, portfolio: 12800, yearOverYear: 13100 }
      },
      "Monthly": {
        "HVAC": { actual: 3067, market: 4267, shouldCost: 3000, portfolio: 3133, yearOverYear: 3200 },
        "Elevator": { actual: 2267, market: 2867, shouldCost: 2200, portfolio: 2300, yearOverYear: 2367 },
        "Fire Safety": { actual: 1467, market: 2067, shouldCost: 1433, portfolio: 1500, yearOverYear: 1533 },
        "Plumbing": { actual: 2067, market: 2700, shouldCost: 2000, portfolio: 2100, yearOverYear: 2167 },
        "General R&M": { actual: 4167, market: 5400, shouldCost: 4067, portfolio: 4267, yearOverYear: 4367 }
      }
    },
    "Redwood Shores Office Complex": {
      "Quarterly": {
        "HVAC": { actual: 7800, market: 11200, shouldCost: 7600, portfolio: 8000, yearOverYear: 8300 },
        "Elevator": { actual: 5900, market: 7800, shouldCost: 5700, portfolio: 6000, yearOverYear: 6200 },
        "Fire Safety": { actual: 3800, market: 5600, shouldCost: 3700, portfolio: 3900, yearOverYear: 4000 },
        "Plumbing": { actual: 5500, market: 7400, shouldCost: 5300, portfolio: 5700, yearOverYear: 5800 },
        "General R&M": { actual: 11200, market: 14800, shouldCost: 10900, portfolio: 11500, yearOverYear: 11800 }
      },
      "Monthly": {
        "HVAC": { actual: 2600, market: 3733, shouldCost: 2533, portfolio: 2667, yearOverYear: 2767 },
        "Elevator": { actual: 1967, market: 2600, shouldCost: 1900, portfolio: 2000, yearOverYear: 2067 },
        "Fire Safety": { actual: 1267, market: 1867, shouldCost: 1233, portfolio: 1300, yearOverYear: 1333 },
        "Plumbing": { actual: 1833, market: 2467, shouldCost: 1767, portfolio: 1900, yearOverYear: 1933 },
        "General R&M": { actual: 3733, market: 4933, shouldCost: 3633, portfolio: 3833, yearOverYear: 3933 }
      }
    },
    "Palo Alto Research Center": {
      "Quarterly": {
        "HVAC": { actual: 6900, market: 10600, shouldCost: 6700, portfolio: 7100, yearOverYear: 7400 },
        "Elevator": { actual: 5200, market: 7300, shouldCost: 5000, portfolio: 5300, yearOverYear: 5500 },
        "Fire Safety": { actual: 3300, market: 5200, shouldCost: 3200, portfolio: 3400, yearOverYear: 3500 },
        "Plumbing": { actual: 4800, market: 6900, shouldCost: 4600, portfolio: 4900, yearOverYear: 5100 },
        "General R&M": { actual: 10100, market: 13900, shouldCost: 9800, portfolio: 10400, yearOverYear: 10700 }
      },
      "Monthly": {
        "HVAC": { actual: 2300, market: 3533, shouldCost: 2233, portfolio: 2367, yearOverYear: 2467 },
        "Elevator": { actual: 1733, market: 2433, shouldCost: 1667, portfolio: 1767, yearOverYear: 1833 },
        "Fire Safety": { actual: 1100, market: 1733, shouldCost: 1067, portfolio: 1133, yearOverYear: 1167 },
        "Plumbing": { actual: 1600, market: 2300, shouldCost: 1533, portfolio: 1633, yearOverYear: 1700 },
        "General R&M": { actual: 3367, market: 4633, shouldCost: 3267, portfolio: 3467, yearOverYear: 3567 }
      }
    },
    "South Bay Industrial Park": {
      "Quarterly": {
        "HVAC": { actual: 11800, market: 15400, shouldCost: 11500, portfolio: 12100, yearOverYear: 12500 },
        "Elevator": { actual: 8200, market: 10300, shouldCost: 8000, portfolio: 8400, yearOverYear: 8700 },
        "Fire Safety": { actual: 5100, market: 7300, shouldCost: 4900, portfolio: 5200, yearOverYear: 5400 },
        "Plumbing": { actual: 7300, market: 9800, shouldCost: 7100, portfolio: 7500, yearOverYear: 7800 },
        "General R&M": { actual: 14200, market: 18600, shouldCost: 13900, portfolio: 14500, yearOverYear: 15000 }
      },
      "Monthly": {
        "HVAC": { actual: 3933, market: 5133, shouldCost: 3833, portfolio: 4033, yearOverYear: 4167 },
        "Elevator": { actual: 2733, market: 3433, shouldCost: 2667, portfolio: 2800, yearOverYear: 2900 },
        "Fire Safety": { actual: 1700, market: 2433, shouldCost: 1633, portfolio: 1733, yearOverYear: 1800 },
        "Plumbing": { actual: 2433, market: 3267, shouldCost: 2367, portfolio: 2500, yearOverYear: 2600 },
        "General R&M": { actual: 4733, market: 6200, shouldCost: 4633, portfolio: 4833, yearOverYear: 5000 }
      }
    },
    "Financial District Tower": {
      "Quarterly": {
        "HVAC": { actual: 9800, market: 13200, shouldCost: 9600, portfolio: 10000, yearOverYear: 10300 },
        "Elevator": { actual: 7100, market: 8900, shouldCost: 6900, portfolio: 7300, yearOverYear: 7500 },
        "Fire Safety": { actual: 4500, market: 6400, shouldCost: 4400, portfolio: 4600, yearOverYear: 4700 },
        "Plumbing": { actual: 6500, market: 8600, shouldCost: 6300, portfolio: 6700, yearOverYear: 6900 },
        "General R&M": { actual: 12800, market: 16800, shouldCost: 12500, portfolio: 13100, yearOverYear: 13500 }
      },
      "Monthly": {
        "HVAC": { actual: 3267, market: 4400, shouldCost: 3200, portfolio: 3333, yearOverYear: 3433 },
        "Elevator": { actual: 2367, market: 2967, shouldCost: 2300, portfolio: 2433, yearOverYear: 2500 },
        "Fire Safety": { actual: 1500, market: 2133, shouldCost: 1467, portfolio: 1533, yearOverYear: 1567 },
        "Plumbing": { actual: 2167, market: 2867, shouldCost: 2100, portfolio: 2233, yearOverYear: 2300 },
        "General R&M": { actual: 4267, market: 5600, shouldCost: 4167, portfolio: 4367, yearOverYear: 4500 }
      }
    },
    "All Properties": {
      "Quarterly": {
        "HVAC": { actual: 10200, market: 13800, shouldCost: 9800, portfolio: 10400, yearOverYear: 10800 },
        "Elevator": { actual: 7500, market: 9200, shouldCost: 7200, portfolio: 7600, yearOverYear: 7900 },
        "Fire Safety": { actual: 5200, market: 7100, shouldCost: 4900, portfolio: 5300, yearOverYear: 5500 },
        "Plumbing": { actual: 6800, market: 8900, shouldCost: 6500, portfolio: 7100, yearOverYear: 7300 },
        "General R&M": { actual: 13500, market: 17200, shouldCost: 13000, portfolio: 13800, yearOverYear: 14200 }
      },
      "Monthly": {
        "HVAC": { actual: 3400, market: 4600, shouldCost: 3267, portfolio: 3467, yearOverYear: 3600 },
        "Elevator": { actual: 2500, market: 3067, shouldCost: 2400, portfolio: 2533, yearOverYear: 2633 },
        "Fire Safety": { actual: 1733, market: 2367, shouldCost: 1633, portfolio: 1767, yearOverYear: 1833 },
        "Plumbing": { actual: 2267, market: 2967, shouldCost: 2167, portfolio: 2367, yearOverYear: 2433 },
        "General R&M": { actual: 4500, market: 5733, shouldCost: 4333, portfolio: 4600, yearOverYear: 4733 }
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
      const maxValue = Math.max(data.actual, data.market, data.shouldCost, data.portfolio, data.yearOverYear)
      
      return {
        category,
        actual: data.actual,
        actualWidth: (data.actual / maxValue) * 100,
        market: data.market,
        marketWidth: (data.market / maxValue) * 100,
        shouldCost: data.shouldCost,
        shouldCostWidth: (data.shouldCost / maxValue) * 100,
        portfolio: data.portfolio,
        portfolioWidth: (data.portfolio / maxValue) * 100,
        yearOverYear: data.yearOverYear,
        yearOverYearWidth: (data.yearOverYear / maxValue) * 100,
        overShouldCost: data.actual > data.shouldCost ? 
          `${Math.round(((data.actual - data.shouldCost) / data.shouldCost) * 100)}% over should cost` :
          `${Math.round(((data.shouldCost - data.actual) / data.shouldCost) * 100)}% under should cost`,
        recommendations: ["Contract optimization", "Vendor consolidation"]
      }
    })
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
              <div className="text-4xl font-bold text-green-400 mb-2">$6.6M</div>
              <div className="text-sm text-gray-300">Total $ Saved vs Clean Sheet</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">3</div>
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
            <div className="grid grid-cols-6 gap-4 text-center text-sm font-medium text-gray-300 mb-4">
              <div>Properties</div>
              <div>Time Range</div>
              <div>Region</div>
              <div>View Type</div>
              <div>PM Firm</div>
              <div>Property Class</div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 mb-6">
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="All Properties" className="text-white">All Properties</SelectItem>
                  <SelectItem value="Stanford Graduate School..." className="text-white">Stanford Graduate School</SelectItem>
                  <SelectItem value="Mission Bay Tech Campus" className="text-white">Mission Bay Tech Campus</SelectItem>
                  <SelectItem value="Redwood Shores Office Complex" className="text-white">Redwood Shores Office Complex</SelectItem>
                  <SelectItem value="Palo Alto Research Center" className="text-white">Palo Alto Research Center</SelectItem>
                  <SelectItem value="South Bay Industrial Park" className="text-white">South Bay Industrial Park</SelectItem>
                  <SelectItem value="Financial District Tower" className="text-white">Financial District Tower</SelectItem>
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
              
              <Select value={selectedPMFirm} onValueChange={setSelectedPMFirm}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="All" className="text-white">All PM Firms</SelectItem>
                  <SelectItem value="CBRE" className="text-white">CBRE</SelectItem>
                  <SelectItem value="JLL" className="text-white">JLL</SelectItem>
                  <SelectItem value="Local PM" className="text-white">Local PM</SelectItem>
                  <SelectItem value="Mainstreet PM" className="text-white">Mainstreet PM</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPropertyClass} onValueChange={setSelectedPropertyClass}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="All" className="text-white">All Classes</SelectItem>
                  <SelectItem value="Residential" className="text-white">Residential</SelectItem>
                  <SelectItem value="Commercial" className="text-white">Commercial</SelectItem>
                  <SelectItem value="Mixed Use" className="text-white">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Comparables Checkboxes */}
            <div className="mb-6 p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-medium text-gray-300">Show Comparables:</h4>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActuals}
                    onChange={(e) => setShowActuals(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Actuals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMarket}
                    onChange={(e) => setShowMarket(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Market</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPortfolio}
                    onChange={(e) => setShowPortfolio(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Portfolio</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showYearOverYear}
                    onChange={(e) => setShowYearOverYear(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Year-over-Year</span>
                </label>
              </div>
            </div>
            
            {getCurrentData().map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{item.category}</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Versus: Market Median, Should Cost Pro, Chambre Diversified</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded ${
                      item.overShouldCost.includes('under') 
                        ? 'text-green-400 bg-green-900' 
                        : 'text-red-400 bg-red-900'
                    }`}>
                      {item.overShouldCost}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {showActuals && (
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
                  )}
                  
                  {showMarket && (
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
                  )}
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-4">
                          <div className="w-20 text-xs text-gray-400 flex items-center gap-1">
                            Should cost
                            <Info className="h-3 w-3 text-gray-500 cursor-help" />
                          </div>
                          <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                            <div 
                              className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                              style={{ width: `${item.shouldCostWidth}%` }}
                            >
                              ${item.shouldCost.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 border-gray-600 text-white max-w-xs">
                        <p className="text-sm">
                          AI-led clean sheet estimate based on market rates, trends, seasonality, and other factors.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {showPortfolio && (
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
                  )}
                  
                  {showYearOverYear && (
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-gray-400">YoY</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                        <div 
                          className="bg-orange-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                          style={{ width: `${item.yearOverYearWidth}%` }}
                        >
                          ${item.yearOverYear.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
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
                    "Should we repair or replace the elevator at 01 STANFORD?",
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

function ReimbursementsTab({ setActiveTab, addMessage }: { 
  setActiveTab: (tab: string) => void;
  addMessage: (message: {
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }) => void;
}) {
  const [selectedPacket, setSelectedPacket] = useState<string | null>(null)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [showExpenseFilterDialog, setShowExpenseFilterDialog] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [showGetInTouchDialog, setShowGetInTouchDialog] = useState(false)
  const [selectedReimbursementPacket, setSelectedReimbursementPacket] = useState<any>(null)
  const [selectedExpenseItems, setSelectedExpenseItems] = useState<string[]>([])
  const [messageContent, setMessageContent] = useState("")
  const [selectedGLAccount, setSelectedGLAccount] = useState<any>(null)
  const [showGLAccountDialog, setShowGLAccountDialog] = useState(false)
  const [processForm, setProcessForm] = useState({
    workOrder: "HVAC System Maintenance - Annual Service",
    jobId: "#job1",
    amount: "241.00",
    notes: "",
    ownerName: "01 STANFORD Administration",
    ownerPhone: "650-725-3341",
    ownerEmail: "owner@stanford.edu",
    ccEmail: "",
    attachReport: false
  })

  const trustAccounts = [
    {
      id: "redwood",
      name: "Redwood Shores Office Complex",
      bankName: "Wells Fargo Business Banking",
      accountId: "TA-2024-001",
      currentBalance: 285000,
      ytdDeposits: 450000,
      ytdWithdrawals: 165000,
      pendingReimbursements: 0
    },
    {
      id: "mission",
      name: "Mission Bay Tech Campus",
      bankName: "Bank of America Commercial",
      accountId: "TA-2024-002",  
      currentBalance: 195000,
      ytdDeposits: 320000,
      ytdWithdrawals: 125000,
      pendingReimbursements: 0
    },
    {
      id: "skyline",
      name: "Skyline Vista",
      bankName: "Chase Business Complete",
      accountId: "TA-2024-003",
      currentBalance: 125000,
      ytdDeposits: 200000,
      ytdWithdrawals: 75000,
      pendingReimbursements: 0
    }
  ]

  // Expense Report data structure
  const expenseReportData = [
    {
      id: "exp_001",
      date: "2024-12-15",
      employee: "Sarah Johnson",
      merchant: "Home Depot",
      cost: 245.75,
      property: "01 STANFORD",
      billable: true,
      receiptUrl: "/receipts/exp_001_receipt.pdf",
      category: "Maintenance Supplies",
      description: "Emergency plumbing repair materials"
    },
    {
      id: "exp_002", 
      date: "2024-12-14",
      employee: "Mike Rodriguez",
      merchant: "Office Depot",
      cost: 89.99,
      property: "02 SUNNYVALE",
      billable: false,
      receiptUrl: "/receipts/exp_002_receipt.pdf",
      category: "Office Supplies",
      description: "Administrative office materials"
    },
    {
      id: "exp_003",
      date: "2024-12-13",
      employee: "Jennifer Davis",
      merchant: "Ace Hardware",
      cost: 67.50,
      property: "01 STANFORD",
      billable: true,
      receiptUrl: "/receipts/exp_003_receipt.pdf",
      category: "Tools & Equipment",
      description: "Replacement tools for maintenance team"
    },
    {
      id: "exp_004",
      date: "2024-12-12",
      employee: "David Chen",
      merchant: "AutoZone",
      cost: 156.25,
      property: "02 SUNNYVALE",
      billable: true,
      receiptUrl: "/receipts/exp_004_receipt.pdf",
      category: "Vehicle Maintenance",
      description: "Service van maintenance and oil change"
    },
    {
      id: "exp_005",
      date: "2024-12-11",
      employee: "Sarah Johnson",
      merchant: "Staples",
      cost: 34.99,
      property: "01 STANFORD",
      billable: false,
      receiptUrl: "/receipts/exp_005_receipt.pdf",
      category: "Office Supplies",
      description: "Printer ink and paper supplies"
    },
    {
      id: "exp_006",
      date: "2024-12-10",
      employee: "Mike Rodriguez",
      merchant: "Lowe's",
      cost: 312.45,
      property: "03 DOWNTOWN",
      billable: true,
      receiptUrl: "/receipts/exp_006_receipt.pdf",
      category: "Building Materials",
      description: "Flooring repair materials for lobby"
    },
    {
      id: "exp_007",
      date: "2024-12-09",
      employee: "Jennifer Davis",
      merchant: "Costco Business",
      cost: 127.88,
      property: "02 SUNNYVALE",
      billable: false,
      receiptUrl: "/receipts/exp_007_receipt.pdf",
      category: "Cleaning Supplies",
      description: "Bulk cleaning supplies for janitorial"
    },
    {
      id: "exp_008",
      date: "2024-12-08",
      employee: "David Chen",
      merchant: "Best Buy",
      cost: 189.99,
      property: "01 STANFORD",
      billable: true,
      receiptUrl: "/receipts/exp_008_receipt.pdf",
      category: "Technology",
      description: "Security camera replacement parts"
    },
    {
      id: "exp_009",
      date: "2024-12-07",
      employee: "Sarah Johnson",
      merchant: "Amazon Business",
      cost: 78.50,
      property: "03 DOWNTOWN",
      billable: true,
      receiptUrl: "/receipts/exp_009_receipt.pdf",
      category: "Maintenance Supplies",
      description: "HVAC filter replacements"
    },
    {
      id: "exp_010",
      date: "2024-12-06",
      employee: "Mike Rodriguez",
      merchant: "Sherwin Williams",
      cost: 234.67,
      property: "02 SUNNYVALE",
      billable: true,
      receiptUrl: "/receipts/exp_010_receipt.pdf",
      category: "Building Materials",
      description: "Interior paint for unit renovations"
    }
  ]

  // GL Account data structure for monthly reports
  const glAccountData = [
    {
      id: "gl1",
      account: "7200 - HVAC System Maintenance",
      property: "01 STANFORD",
      ptdActual: 2186.49,
      ptdBudget: 1500,
      ptdVariance: 686.49,
      ptdVariancePercent: 45.8,
      ytdActual: 15850,
      ytdBudget: 12000,
      ytdVariance: 3850,
      ytdVariancePercent: 32.1,
      annual: 35000,
      status: "Submitted 2024-12-15",
      pmMemo: "Emergency repairs and preventive maintenance completed.",
      flagged: false
    },
    {
      id: "gl2", 
      account: "6425 - Property Insurance",
      property: "01 STANFORD",
      ptdActual: 1725,
      ptdBudget: 1200,
      ptdVariance: 525,
      ptdVariancePercent: 43.8,
      ytdActual: 8950,
      ytdBudget: 7200,
      ytdVariance: 1750,
      ytdVariancePercent: 24.3,
      annual: 18500,
      status: "Submitted 2024-12-14",
      pmMemo: "Annual policy renewal with coverage adjustments.",
      flagged: false
    },
    {
      id: "gl3",
      account: "7315 - Water & Sewer",
      property: "01 STANFORD", 
      ptdActual: 945.5,
      ptdBudget: 850,
      ptdVariance: 95.5,
      ptdVariancePercent: 11.2,
      ytdActual: 5680,
      ytdBudget: 5100,
      ytdVariance: 580,
      ytdVariancePercent: 11.4,
      annual: 12200,
      status: "Submitted 2024-12-13",
      pmMemo: "Seasonal usage increase due to irrigation needs.",
      flagged: false
    },
    {
      id: "gl4",
      account: "6100 - Building Maintenance",
      property: "01 STANFORD",
      ptdActual: 3245.75,
      ptdBudget: 2800,
      ptdVariance: 445.75,
      ptdVariancePercent: 15.9,
      ytdActual: 24580,
      ytdBudget: 22400,
      ytdVariance: 2180,
      ytdVariancePercent: 9.7,
      annual: 33600,
      status: "Submitted 2024-12-12",
      pmMemo: "Scheduled elevator maintenance and lobby repairs.",
      flagged: false
    },
    {
      id: "gl5",
      account: "6150 - Landscaping",
      property: "01 STANFORD",
      ptdActual: 1850.25,
      ptdBudget: 1600,
      ptdVariance: 250.25,
      ptdVariancePercent: 15.6,
      ytdActual: 18750,
      ytdBudget: 19200,
      ytdVariance: -450,
      ytdVariancePercent: -2.3,
      annual: 28800,
      status: "Pending Review",
      pmMemo: "Winter maintenance and tree trimming services.",
      flagged: true
    },
    {
      id: "gl6",
      account: "6200 - Cleaning Services",
      property: "01 STANFORD",
      ptdActual: 4125.50,
      ptdBudget: 4000,
      ptdVariance: 125.50,
      ptdVariancePercent: 3.1,
      ytdActual: 49500,
      ytdBudget: 48000,
      ytdVariance: 1500,
      ytdVariancePercent: 3.1,
      annual: 72000,
      status: "Submitted 2024-12-11",
      pmMemo: "Regular janitorial services with carpet cleaning.",
      flagged: false
    },
    {
      id: "gl7",
      account: "6250 - Security Services",
      property: "01 STANFORD",
      ptdActual: 2890.00,
      ptdBudget: 3000,
      ptdVariance: -110.00,
      ptdVariancePercent: -3.7,
      ytdActual: 34680,
      ytdBudget: 36000,
      ytdVariance: -1320,
      ytdVariancePercent: -3.7,
      annual: 54000,
      status: "Submitted 2024-12-10",
      pmMemo: "24/7 security monitoring and patrol services.",
      flagged: false
    },
    {
      id: "gl8",
      account: "6300 - Utilities - Electric",
      property: "01 STANFORD",
      ptdActual: 8450.75,
      ptdBudget: 7800,
      ptdVariance: 650.75,
      ptdVariancePercent: 8.3,
      ytdActual: 89250,
      ytdBudget: 93600,
      ytdVariance: -4350,
      ytdVariancePercent: -4.6,
      annual: 140400,
      status: "Submitted 2024-12-09",
      pmMemo: "Higher winter usage due to increased lighting.",
      flagged: false
    },
    {
      id: "gl9",
      account: "6350 - Utilities - Gas",
      property: "01 STANFORD",
      ptdActual: 3675.25,
      ptdBudget: 4200,
      ptdVariance: -524.75,
      ptdVariancePercent: -12.5,
      ytdActual: 42850,
      ytdBudget: 50400,
      ytdVariance: -7550,
      ytdVariancePercent: -15.0,
      annual: 75600,
      status: "Submitted 2024-12-08",
      pmMemo: "Lower than expected usage due to mild weather.",
      flagged: false
    },
    {
      id: "gl10",
      account: "7500 - Capital Improvements",
      property: "01 STANFORD",
      ptdActual: 15750.00,
      ptdBudget: 12000,
      ptdVariance: 3750.00,
      ptdVariancePercent: 31.3,
      ytdActual: 125400,
      ytdBudget: 144000,
      ytdVariance: -18600,
      ytdVariancePercent: -12.9,
      annual: 216000,
      status: "Pending Review",
      pmMemo: "Elevator modernization project Phase 1 completed.",
      flagged: true
    },
    {
      id: "gl11",
      account: "6400 - Property Management Fees",
      property: "01 STANFORD",
      ptdActual: 5500.00,
      ptdBudget: 5500,
      ptdVariance: 0.00,
      ptdVariancePercent: 0.0,
      ytdActual: 66000,
      ytdBudget: 66000,
      ytdVariance: 0,
      ytdVariancePercent: 0.0,
      annual: 99000,
      status: "Submitted 2024-12-07",
      pmMemo: "Standard monthly management fee as per contract.",
      flagged: false
    },
    {
      id: "gl12",
      account: "6450 - Legal & Professional",
      property: "01 STANFORD",
      ptdActual: 1250.00,
      ptdBudget: 800,
      ptdVariance: 450.00,
      ptdVariancePercent: 56.3,
      ytdActual: 8750,
      ytdBudget: 9600,
      ytdVariance: -850,
      ytdVariancePercent: -8.9,
      annual: 14400,
      status: "Submitted 2024-12-06",
      pmMemo: "Legal consultation for tenant lease agreements.",
      flagged: false
    }
  ]

  const reimbursementPackets = [
    {
      id: "RMB-2024-001",
      status: "PENDING REVIEW",
      submittedBy: "Sarah Johnson",
      submittedDate: "6/30/2024",
      property: "01 STANFORD",
      propertyName: "Stanford Office Complex",
      total: 45650,
      expenseCount: 4,
      trustBalance: 285000,
      releaseAmount: 45650,
      remainingBalance: 239350,
      flaggedItems: [
        "Bay Area HVAC Solutions: Over $15K threshold",
        "Pacific Landscaping: Missing receipt"
      ],
      glAccounts: glAccountData,
      expenseReport: expenseReportData,
      expenses: [
        {
          id: "exp1",
          date: "2024-06-28",
          vendor: "Bay Area HVAC Solutions",
          amount: 18500,
          type: "Vendor",
          category: "Emergency Repairs",
          glCode: "6200",
          receipt: true,
          flagged: true,
          status: "Uploaded",
          madeBy: "Jessica Chen (Property Manager)",
          property: "01 STANFORD",
          workOrder: "HVAC System Maintenance - Annual Service",
          workOrderId: "job1",
          isWorkOrderRelated: true,
          memo: "Emergency HVAC repair - main compressor unit replacement"
        },
        {
          id: "exp2", 
          date: "2024-06-29",
          vendor: "Citywide Cleaning Services",
          amount: 12450,
          type: "Vendor",
          category: "Operations",
          glCode: "6100",
          receipt: true,
          flagged: false,
          status: "Uploaded",
          madeBy: "David Chen (Property Manager)",
          property: "01 STANFORD",
          workOrder: null,
          workOrderId: null,
          isWorkOrderRelated: false,
          memo: "Monthly cleaning service contract"
        },
        {
          id: "exp3",
          date: "2024-06-30",
          vendor: "Elite Security Systems",
          amount: 8750,
          type: "Vendor",
          category: "Capital Improvements",
          glCode: "7500",
          receipt: true,
          flagged: false,
          status: "Uploaded",
          madeBy: "Mike Rodriguez (Property Manager)",
          property: "01 STANFORD",
          workOrder: "Security System Upgrade - Building A",
          workOrderId: "job2",
          isWorkOrderRelated: true,
          memo: "Security system upgrade for Building A"
        },
        {
          id: "exp4",
          date: "2024-06-30",
          vendor: "Pacific Landscaping",
          amount: 6000,
          type: "Vendor",
          category: "Operations",
          glCode: "6150",
          receipt: false,
          flagged: true,
          status: "Missing",
          madeBy: "Sarah Johnson (Property Manager)",
          property: "01 STANFORD",
          workOrder: null,
          workOrderId: null,
          isWorkOrderRelated: false,
          memo: "Quarterly landscaping maintenance"
        }
      ]
    },
    {
      id: "RMB-2024-002",
      status: "PENDING REVIEW",
      submittedBy: "James Wilson",
      submittedDate: "7/1/2024",
      property: "02 SUNNYVALE",
      propertyName: "Sunnyvale Business Park",
      total: 23750,
      expenseCount: 2,
      trustBalance: 195000,
      releaseAmount: -23750,
      remainingBalance: 171250,
      flaggedItems: [
        "Metro Office Supplies: Non-billable expense over $5K"
      ],
      glAccounts: glAccountData.map(gl => ({ ...gl, property: "02 SUNNYVALE" })),
      expenseReport: expenseReportData.map(exp => ({ ...exp, property: exp.property === "01 STANFORD" ? "02 SUNNYVALE" : exp.property })),
      expenses: [
        {
          id: "exp5",
          date: "2024-07-01",
          vendor: "TechFlow Plumbing",
          amount: 15250,
          type: "Vendor",
          category: "Emergency Repairs",
          glCode: "6250",
          receipt: true,
          flagged: false,
          status: "Uploaded",
          madeBy: "James Wilson (Property Manager)",
          property: "02 SUNNYVALE",
          workOrder: "Emergency Plumbing Repair - Kitchen Sink",
          workOrderId: "job3",
          isWorkOrderRelated: true,
          memo: "Emergency plumbing repair in kitchen facility"
        },
        {
          id: "exp6",
          date: "2024-07-01",
          vendor: "Metro Office Supplies",
          amount: 8500,
          type: "Vendor",
          category: "Operations",
          glCode: "6300",
          receipt: true,
          flagged: true,
          status: "Flagged",
          madeBy: "Jennifer Davis (Property Manager)",
          property: "02 SUNNYVALE",
          workOrder: null,
          workOrderId: null,
          isWorkOrderRelated: false,
          memo: "Office supplies for administrative staff"
        }
      ]
    }
  ]

  const handleFlagPacket = (packetId: string) => {
    const packet = reimbursementPackets.find(p => p.id === packetId)
    if (packet) {
      setSelectedReimbursementPacket(packet)
      setSelectedExpenseItems([])
      setMessageContent("")
      setShowFlagDialog(true)
    }
  }

  const handleGetInTouch = (packetId: string) => {
    const packet = reimbursementPackets.find(p => p.id === packetId)
    if (packet) {
      setSelectedReimbursementPacket(packet)
      setSelectedExpenseItems([])
      setMessageContent("")
      setShowGetInTouchDialog(true)
    }
  }

  const handleProcessReimbursement = () => {
    console.log("Processing reimbursement", processForm)
    setShowProcessModal(false)
  }

  const handleExportPDF = (packetId: string) => {
    const packet = reimbursementPackets.find(p => p.id === packetId)
    if (!packet) return

    // Create comprehensive PDF content for GL report
    const currentDate = new Date().toLocaleString()
    const pdfContent = `MONTHLY GL REPORT - ${packet.propertyName.toUpperCase()}
${packet.property} | Period: December 2024
Generated: ${currentDate}

=============================================================================
TRUST ACCOUNT DETAILS
=============================================================================
Bank: Wells Fargo
Account: ****2847  
Routing: 121000248
Current Balance: $${packet.trustBalance.toLocaleString()}
Release Amount: $${packet.releaseAmount.toLocaleString()}
Remaining Balance: $${packet.remainingBalance.toLocaleString()}

=============================================================================
GL ACCOUNT VARIANCE REPORT
=============================================================================

${packet.glAccounts.map(account => {
  const ptdActual = '$' + account.ptdActual.toFixed(2)
  const ptdBudget = '$' + account.ptdBudget.toFixed(2)
  const ptdVariance = (account.ptdVariance >= 0 ? '+' : '') + '$' + account.ptdVariance.toFixed(2)
  const ptdVariancePercent = (account.ptdVariancePercent >= 0 ? '+' : '') + account.ptdVariancePercent.toFixed(1) + '%'
  const ytdActual = '$' + account.ytdActual.toFixed(2)
  const ytdBudget = '$' + account.ytdBudget.toFixed(2)
  const ytdVariance = (account.ytdVariance >= 0 ? '+' : '') + '$' + account.ytdVariance.toFixed(2)
  const ytdVariancePercent = (account.ytdVariancePercent >= 0 ? '+' : '') + account.ytdVariancePercent.toFixed(1) + '%'
  const annual = '$' + account.annual.toFixed(2)
  
  return account.account.padEnd(35) + ' | ' + 
         ptdActual.padStart(12) + ' | ' + 
         ptdBudget.padStart(12) + ' | ' + 
         ptdVariance.padStart(12) + ' | ' + 
         ptdVariancePercent.padStart(8) + ' | ' + 
         ytdActual.padStart(12) + ' | ' + 
         ytdBudget.padStart(12) + ' | ' + 
         ytdVariance.padStart(12) + ' | ' + 
         ytdVariancePercent.padStart(8) + ' | ' + 
         annual.padStart(12) + ' | ' + 
         account.status.padEnd(15) + ' | ' + 
         account.pmMemo
}).join('\n')}

=============================================================================
FLAGGED ITEMS REQUIRING ATTENTION
=============================================================================
${packet.flaggedItems.map(item => '• ' + item).join('\n')}

=============================================================================
SUMMARY
=============================================================================
Reimbursement Packet: ${packet.id}
Status: ${packet.status}
Submitted By: ${packet.submittedBy}
Submitted Date: ${packet.submittedDate}
Total Amount: $${packet.total.toLocaleString()}
Number of Expenses: ${packet.expenseCount}

Property Manager Comments:
${packet.glAccounts.filter(acc => acc.flagged).map(acc => '- ' + acc.account + ': ' + acc.pmMemo).join('\n')}

This GL variance report has been included with the monthly reimbursement processing.
Report generated on ${currentDate} for ${packet.propertyName}.`

    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `GL_Report_${packet.property}_${packetId}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleViewDetails = (packetId: string) => {
    // Navigate to expenses page with filters applied to show only this packet's expenses
    setShowExpenseFilterDialog(true)
  }

  const handleExpenseViewDetails = (expenseId: string) => {
    // Find the expense from all packets
    const allExpenses = reimbursementPackets.flatMap(p => p.expenses)
    const expense = allExpenses.find(e => e.id === expenseId)
    if (expense) {
      if (expense.isWorkOrderRelated && expense.workOrderId) {
        // Navigate to work order detail page (same as owner expenses)
        window.location.href = `/workorders/${expense.workOrderId}?role=owner`
      } else {
        // Show popup dialog for non-work order expenses (same as owner expenses)
        setExpenseDetailDialog(expense)
      }
    }
  }

  const handleViewGLAccount = (account: any) => {
    setSelectedGLAccount(account)
    setShowGLAccountDialog(true)
  }

  const handleSendMessage = (isFlag: boolean) => {
    if (messageContent.trim() && selectedReimbursementPacket) {
      // Add the message to the shared state
      addMessage({
        propertyId: selectedReimbursementPacket.id,
        propertyName: selectedReimbursementPacket.propertyName || "Unknown Property",
        senderId: "owner1",
        senderName: "Property Owner",
        senderRole: "owner",
        content: messageContent,
        threadId: `thread_${selectedReimbursementPacket.id}`,
        type: isFlag ? "flag" : "inquiry",
        relatedExpenses: selectedExpenseItems,
        packetId: selectedReimbursementPacket.id
      })
      
      // Close dialog and navigate to communications tab
      setShowFlagDialog(false)
      setShowGetInTouchDialog(false)
      setMessageContent("")
      setSelectedExpenseItems([])
      setSelectedReimbursementPacket(null)
      
      // Navigate to communications tab
      setActiveTab("communications")
    }
  }

  const handleExportReport = () => {
    // Create comprehensive CSV report with GL account data
    const currentDate = new Date().toISOString().split('T')[0]
    
    let csvContent = `Monthly GL Reimbursement Report\nGenerated: ${new Date().toLocaleString()}\n\n`
    
    // Summary section
    csvContent += `SUMMARY\n`
    csvContent += `Packet ID,Property,Property Name,Status,Submitted By,Date,Total,Expense Count,Trust Balance,Release Amount,Remaining Balance\n`
    
    reimbursementPackets.forEach(packet => {
      csvContent += `${packet.id},${packet.property},${packet.propertyName},${packet.status},${packet.submittedBy},${packet.submittedDate},${packet.total},${packet.expenseCount},${packet.trustBalance},${packet.releaseAmount},${packet.remainingBalance}\n`
    })
    
    csvContent += `\n\nGL ACCOUNT DETAILS\n`
    csvContent += `Packet ID,Property,Account,PTD Actual,PTD Budget,PTD Variance,PTD Variance %,YTD Actual,YTD Budget,YTD Variance,YTD Variance %,Annual,Status,PM Memo,Flagged\n`
    
    // GL Account details
    reimbursementPackets.forEach(packet => {
      packet.glAccounts.forEach(account => {
        csvContent += `${packet.id},${account.property},"${account.account}",${account.ptdActual.toFixed(2)},${account.ptdBudget.toFixed(2)},${account.ptdVariance.toFixed(2)},${account.ptdVariancePercent.toFixed(1)},${account.ytdActual.toFixed(2)},${account.ytdBudget.toFixed(2)},${account.ytdVariance.toFixed(2)},${account.ytdVariancePercent.toFixed(1)},${account.annual.toFixed(2)},"${account.status}","${account.pmMemo}",${account.flagged}\n`
      })
    })
    
    csvContent += `\n\nFLAGGED ITEMS\n`
    csvContent += `Packet ID,Property,Flagged Item\n`
    
    // Flagged items
    reimbursementPackets.forEach(packet => {
      packet.flaggedItems.forEach(item => {
        csvContent += `${packet.id},${packet.property},"${item}"\n`
      })
    })

    csvContent += `\n\nEXPENSE REPORT DETAILS\n`
    csvContent += `Packet ID,Property,Date,Employee,Merchant,Cost,Billable,Category,Description,Receipt URL\n`
    
    // Expense report details
    reimbursementPackets.forEach(packet => {
      packet.expenseReport.forEach(expense => {
        csvContent += `${packet.id},${expense.property},${expense.date},"${expense.employee}","${expense.merchant}",${expense.cost.toFixed(2)},${expense.billable ? 'Yes' : 'No'},"${expense.category}","${expense.description}",${expense.receiptUrl}\n`
      })
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `GL_Reimbursement_Report_${currentDate}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // State for expense detail dialog (copied from ExpensesTab)
  const [expenseDetailDialog, setExpenseDetailDialog] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Monthly Reimbursements</h2>
          <p className="text-sm text-gray-400">Review monthly expense packets submitted by property managers</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">2 packets pending review</span>
          <Button 
            onClick={handleExportReport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Trust Account Balances */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Trust Account Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trustAccounts.map((account) => (
            <Card key={account.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-white">
                  {account.name}
                </CardTitle>
                <p className="text-xs text-gray-400">Account ID: {account.accountId}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ${account.currentBalance.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Current Balance</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400">YTD Deposits</div>
                    <div className="text-green-400 font-medium">
                      ${account.ytdDeposits.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">YTD Withdrawals</div>
                    <div className="text-red-400 font-medium">
                      ${account.ytdWithdrawals.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="text-gray-400">Pending Reimbursements</div>
                  <div className="text-white font-medium">
                    ${account.pendingReimbursements.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="text-gray-400">Bank Account</div>
                  <div className="text-white font-medium">
                    {account.bankName}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monthly Reimbursement Packets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Monthly Reimbursement Packets</h3>
        <p className="text-sm text-gray-400">Monthly expense packets are automatically processed. Flag any items that need attention.</p>
        
        {reimbursementPackets.map((packet) => (
          <Card key={packet.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {packet.id}
                    <Badge className="bg-yellow-600 text-white">{packet.status}</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    {packet.submittedBy} • Submitted by {packet.submittedBy} on {packet.submittedDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ${packet.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {packet.expenseCount} expense(s)
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trust Account Impact Preview */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Trust Account Impact Preview
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Current Balance</div>
                    <div className="text-white font-medium">
                      ${packet.trustBalance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Release Amount</div>
                    <div className="text-white font-medium">
                      ${packet.releaseAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Remaining Balance</div>
                    <div className="text-white font-medium">
                      ${packet.remainingBalance.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flagged Items */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-red-300">Items Requiring Attention</span>
                </div>
                <ul className="text-sm text-red-200 space-y-1">
                  {packet.flaggedItems.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Monthly GL Report Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Budget Variances - {packet.propertyName}
                  </h4>
                  <div className="text-sm text-gray-400">
                    Property: {packet.property} | Period: December 2024
                  </div>
                </div>
                
                {/* Trust Account Details */}
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-white">Trust Account Details</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Bank:</div>
                      <div className="text-white font-medium">Wells Fargo</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Account:</div>
                      <div className="text-white font-medium">****2847</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Routing:</div>
                      <div className="text-white font-medium">121000248</div>
                    </div>
                  </div>
                </div>

                {/* GL Report Table - Scrollable */}
                <div className="bg-gray-700 rounded-lg">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-gray-700 border-b border-gray-600">
                        <tr>
                          <th className="text-left py-3 px-2 font-medium text-gray-300 min-w-[200px]">Account</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">PTD Actual</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">PTD Budget</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">Variance</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[60px]">% Var</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">YTD Actual</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">YTD Budget</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">Variance</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[60px]">% Var</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">Annual</th>
                          <th className="text-center py-3 px-2 font-medium text-gray-300 min-w-[80px]">Status</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-300 min-w-[200px]">PM Memo</th>
                          <th className="text-center py-3 px-2 font-medium text-gray-300 min-w-[60px]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packet.glAccounts.map((account) => (
                          <tr key={account.id} className="border-b border-gray-600 hover:bg-gray-600/50">
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-1">
                                {account.flagged && (
                                  <AlertTriangle className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                                )}
                                <span className="text-white text-xs font-medium">{account.account}</span>
                              </div>
                              <div className="text-xs text-gray-400">{account.property}</div>
                            </td>
                            <td className="py-2 px-2 text-right text-white font-mono">
                              ${account.ptdActual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className="py-2 px-2 text-right text-white font-mono">
                              ${account.ptdBudget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className={`py-2 px-2 text-right font-mono ${account.ptdVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {account.ptdVariance >= 0 ? '+' : ''}${account.ptdVariance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className={`py-2 px-2 text-right font-mono text-xs ${account.ptdVariancePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {account.ptdVariancePercent >= 0 ? '+' : ''}{account.ptdVariancePercent.toFixed(1)}%
                            </td>
                            <td className="py-2 px-2 text-right text-white font-mono">
                              ${account.ytdActual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className="py-2 px-2 text-right text-white font-mono">
                              ${account.ytdBudget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className={`py-2 px-2 text-right font-mono ${account.ytdVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {account.ytdVariance >= 0 ? '+' : ''}${account.ytdVariance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className={`py-2 px-2 text-right font-mono text-xs ${account.ytdVariancePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {account.ytdVariancePercent >= 0 ? '+' : ''}{account.ytdVariancePercent.toFixed(1)}%
                            </td>
                            <td className="py-2 px-2 text-right text-white font-mono">
                              ${account.annual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {account.status.includes("Submitted") ? (
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-400" />
                                )}
                                <span className="text-xs text-gray-300">{account.status.replace("Submitted ", "")}</span>
                              </div>
                            </td>
                            <td className="py-2 px-2 text-xs text-gray-300 max-w-[200px] truncate" title={account.pmMemo}>
                              {account.pmMemo}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 w-12 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 text-xs"
                                onClick={() => handleViewGLAccount(account)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 italic">
                  * This GL variance report will be included with the monthly reimbursement processing
                </div>
              </div>

              {/* Expense Report Table */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Expense Report - {packet.propertyName}
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportExpenseReport(packet.id)}
                      className="bg-purple-600 border-purple-600 text-white hover:bg-purple-700 text-xs"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Export PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportReport}
                      className="bg-purple-600 border-purple-600 text-white hover:bg-purple-700 text-xs"
                    >
                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                {/* Expense Summary Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{packet.expenseReport.length}</div>
                    <div className="text-xs text-gray-400">Total Expenses</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">${packet.expenseReport.reduce((sum, exp) => sum + exp.cost, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-gray-400">Total Cost</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-400">{packet.expenseReport.filter(exp => exp.billable).length}</div>
                    <div className="text-xs text-gray-400">Billable</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-400">{packet.expenseReport.filter(exp => !exp.billable).length}</div>
                    <div className="text-xs text-gray-400">Non-Billable</div>
                  </div>
                </div>

                {/* Expense Report Table - Scrollable */}
                <div className="bg-gray-700 rounded-lg">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-gray-700 border-b border-gray-600">
                        <tr>
                          <th className="text-left py-3 px-2 font-medium text-gray-300 min-w-[80px]">Date</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-300 min-w-[120px]">Employee</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-300 min-w-[120px]">Merchant</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-300 min-w-[80px]">Cost</th>
                          <th className="text-center py-3 px-2 font-medium text-gray-300 min-w-[80px]">Property</th>
                          <th className="text-center py-3 px-2 font-medium text-gray-300 min-w-[80px]">Billable</th>
                          <th className="text-center py-3 px-2 font-medium text-gray-300 min-w-[80px]">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packet.expenseReport.map((expense) => (
                          <tr key={expense.id} className="border-b border-gray-600 hover:bg-gray-600/50">
                            <td className="py-2 px-2 text-white font-mono">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-2 text-white">
                              {expense.employee}
                            </td>
                            <td className="py-2 px-2 text-white">
                              {expense.merchant}
                            </td>
                            <td className="py-2 px-2 text-right text-white font-mono">
                              ${expense.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <Badge className="bg-blue-600 text-white text-xs">
                                {expense.property}
                              </Badge>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <Badge className={expense.billable ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                {expense.billable ? "Billable" : "Non-Billable"}
                              </Badge>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-16 bg-gray-600 border-gray-600 text-white hover:bg-gray-500 text-xs"
                                onClick={() => {
                                  // Open receipt in new tab
                                  window.open(expense.receiptUrl, '_blank')
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-xs text-gray-400 italic">
                  * Employee expense report for reimbursement processing and audit trail
                </div>
              </div>

              {/* Trust Account Impact Summary */}
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Trust Account Impact</span>
                  <span className="text-white">
                    TA-2024-001 • Current Balance: ${packet.trustBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  After withdrawal: ${packet.remainingBalance.toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(packet.id)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportPDF(packet.id)}
                  className="bg-green-600 border-green-600 text-white hover:bg-green-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export GL Report (PDF)
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  className="bg-green-600 border-green-600 text-white hover:bg-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export GL Report (CSV)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFlagPacket(packet.id)}
                  className="bg-yellow-600 border-yellow-600 text-white hover:bg-yellow-700"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Flag Items
                </Button>
                <Button
                  onClick={() => handleGetInTouch(packet.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get In Touch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expense Filter Dialog */}
      <Dialog open={showExpenseFilterDialog} onOpenChange={setShowExpenseFilterDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Expense Details - Filtered View</DialogTitle>
            <DialogDescription className="text-gray-400">
              Showing expenses from the selected reimbursement packet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">GL Code</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-300">Receipt</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reimbursementPackets[0].expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-white">6/30/2024</td>
                      <td className="py-3 px-4 text-white">{expense.vendor}</td>
                      <td className="py-3 px-4 text-white">${expense.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-white">{expense.category}</td>
                      <td className="py-3 px-4 text-white">{expense.glCode}</td>
                      <td className="py-3 px-4 text-center">
                        {expense.receipt ? (
                          <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          expense.status === "Uploaded" ? "bg-green-600" :
                          expense.status === "Flagged" ? "bg-yellow-600" :
                          "bg-red-600"
                        }>
                          {expense.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            onClick={() => handleExpenseViewDetails(expense.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flag Items Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Flag Reimbursement Items</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select expense items to flag and send a message to the property manager
            </DialogDescription>
          </DialogHeader>
          {selectedReimbursementPacket && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Reimbursement Packet: {selectedReimbursementPacket.id}</h4>
                <p className="text-sm text-gray-400">Select specific expense items to flag (optional)</p>
              </div>
              
              <div className="space-y-2">
                {selectedReimbursementPacket.expenses.map((expense: any) => (
                  <div key={expense.id} className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg">
                    <input
                      type="checkbox"
                      id={expense.id}
                      checked={selectedExpenseItems.includes(expense.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExpenseItems([...selectedExpenseItems, expense.id])
                        } else {
                          setSelectedExpenseItems(selectedExpenseItems.filter(id => id !== expense.id))
                        }
                      }}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded"
                    />
                    <label htmlFor={expense.id} className="flex-1 text-sm text-white cursor-pointer">
                      <span className="font-medium">{expense.vendor}</span> - ${expense.amount.toLocaleString()} ({expense.category})
                    </label>
                  </div>
                ))}
              </div>
              
              <div>
                <Label className="text-gray-300">Message to Property Manager</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-2"
                  placeholder="Describe your concerns about these expenses..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFlagDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSendMessage(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!messageContent.trim()}
            >
              <Flag className="h-4 w-4 mr-2" />
              Flag Items & Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Get In Touch Dialog */}
      <Dialog open={showGetInTouchDialog} onOpenChange={setShowGetInTouchDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Get In Touch About Reimbursement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a message to the property manager about this reimbursement packet
            </DialogDescription>
          </DialogHeader>
          {selectedReimbursementPacket && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Reimbursement Packet: {selectedReimbursementPacket.id}</h4>
                <p className="text-sm text-gray-400">Total: ${selectedReimbursementPacket.total.toLocaleString()}</p>
              </div>
              
              <div>
                <Label className="text-gray-300">Message to Property Manager</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-2"
                  placeholder="Type your message or questions about this reimbursement..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGetInTouchDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSendMessage(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!messageContent.trim()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Detail Dialog (copied from ExpensesTab) */}
      <Dialog open={!!expenseDetailDialog} onOpenChange={() => setExpenseDetailDialog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              View detailed information about this expense
            </DialogDescription>
          </DialogHeader>
          {expenseDetailDialog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Date</Label>
                  <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.date}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Merchant</Label>
                  <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.vendor}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Amount</Label>
                  <div className="text-white bg-gray-800 rounded p-3">${expenseDetailDialog.amount?.toFixed(2)}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Type</Label>
                  <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.type}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Made By</Label>
                  <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.madeBy}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Property</Label>
                  <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.property}</div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Work Order</Label>
                <div className="text-white bg-gray-800 rounded p-3">
                  {expenseDetailDialog.workOrder || 'N/A'}
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Status</Label>
                <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.status}</div>
              </div>

              <div>
                <Label className="text-gray-300">Memo</Label>
                <div className="text-white bg-gray-800 rounded p-3">{expenseDetailDialog.memo}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-300">Receipt Available:</Label>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <a
                    href={`/receipts/${expenseDetailDialog.id}_receipt.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline ml-2"
                  >
                    View Receipt
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-300">Work Order Related:</Label>
                  {expenseDetailDialog.isWorkOrderRelated ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExpenseDetailDialog(null)}
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GL Account Details Dialog */}
      <Dialog open={showGLAccountDialog} onOpenChange={setShowGLAccountDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>GL Account Details - Budget Variance Analysis</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed breakdown of budget vs actual performance
            </DialogDescription>
          </DialogHeader>
          {selectedGLAccount && (
            <div className="space-y-6">
              {/* Account Header */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedGLAccount.account}</h3>
                    <p className="text-sm text-gray-400">Property: {selectedGLAccount.property}</p>
                  </div>
                  <div className="text-right">
                    {selectedGLAccount.flagged && (
                      <Badge className="bg-yellow-600 text-white">Flagged for Review</Badge>
                    )}
                    <div className="text-xs text-gray-400 mt-1">Status: {selectedGLAccount.status}</div>
                  </div>
                </div>
              </div>

              {/* Financial Summary Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* PTD Analysis */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Period to Date (PTD) Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Actual:</span>
                      <span className="text-white font-mono">${selectedGLAccount.ptdActual.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white font-mono">${selectedGLAccount.ptdBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Variance:</span>
                        <span className={`font-mono ${selectedGLAccount.ptdVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedGLAccount.ptdVariance >= 0 ? '+' : ''}${selectedGLAccount.ptdVariance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Variance %:</span>
                        <span className={`font-mono ${selectedGLAccount.ptdVariancePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedGLAccount.ptdVariancePercent >= 0 ? '+' : ''}{selectedGLAccount.ptdVariancePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YTD Analysis */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Year to Date (YTD) Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Actual:</span>
                      <span className="text-white font-mono">${selectedGLAccount.ytdActual.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white font-mono">${selectedGLAccount.ytdBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Variance:</span>
                        <span className={`font-mono ${selectedGLAccount.ytdVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedGLAccount.ytdVariance >= 0 ? '+' : ''}${selectedGLAccount.ytdVariance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Variance %:</span>
                        <span className={`font-mono ${selectedGLAccount.ytdVariancePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedGLAccount.ytdVariancePercent >= 0 ? '+' : ''}{selectedGLAccount.ytdVariancePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Budget */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Annual Budget Overview
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">${selectedGLAccount.annual.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-gray-400">Annual Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">${selectedGLAccount.ytdActual.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-gray-400">YTD Actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">${(selectedGLAccount.annual - selectedGLAccount.ytdActual).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-gray-400">Remaining Budget</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress 
                    value={(selectedGLAccount.ytdActual / selectedGLAccount.annual) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-400 mt-1 text-center">
                    {((selectedGLAccount.ytdActual / selectedGLAccount.annual) * 100).toFixed(1)}% of annual budget used
                  </div>
                </div>
              </div>

              {/* Property Manager Notes */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Property Manager Notes
                </h4>
                <p className="text-gray-300">{selectedGLAccount.pmMemo}</p>
                <div className="mt-3 text-xs text-gray-400">
                  Last Updated: {selectedGLAccount.status.includes("Submitted") ? selectedGLAccount.status.replace("Submitted ", "") : "Pending"}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGLAccountDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // Export individual account details
                if (selectedGLAccount) {
                  const accountData = `GL Account Details - ${selectedGLAccount.account}\nProperty: ${selectedGLAccount.property}\nGenerated: ${new Date().toLocaleString()}\n\nPTD Actual: $${selectedGLAccount.ptdActual.toFixed(2)}\nPTD Budget: $${selectedGLAccount.ptdBudget.toFixed(2)}\nPTD Variance: ${selectedGLAccount.ptdVariance >= 0 ? '+' : ''}$${selectedGLAccount.ptdVariance.toFixed(2)} (${selectedGLAccount.ptdVariancePercent.toFixed(1)}%)\n\nYTD Actual: $${selectedGLAccount.ytdActual.toFixed(2)}\nYTD Budget: $${selectedGLAccount.ytdBudget.toFixed(2)}\nYTD Variance: ${selectedGLAccount.ytdVariance >= 0 ? '+' : ''}$${selectedGLAccount.ytdVariance.toFixed(2)} (${selectedGLAccount.ytdVariancePercent.toFixed(1)}%)\n\nAnnual Budget: $${selectedGLAccount.annual.toFixed(2)}\nRemaining Budget: $${(selectedGLAccount.annual - selectedGLAccount.ytdActual).toFixed(2)}\nBudget Utilization: ${((selectedGLAccount.ytdActual / selectedGLAccount.annual) * 100).toFixed(1)}%\n\nStatus: ${selectedGLAccount.status}\nProperty Manager Notes: ${selectedGLAccount.pmMemo}`
                  
                  const blob = new Blob([accountData], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `GL_Account_${selectedGLAccount.account.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Reimbursement Modal */}
      <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Process Reimbursement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Review and process reimbursement for this work order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Work Order</Label>
              <div className="text-white font-medium">{processForm.workOrder}</div>
              <div className="text-gray-400 text-sm">{processForm.jobId}</div>
            </div>
            
            <div>
              <Label className="text-gray-300">Reimbursement Amount</Label>
              <div className="text-2xl font-bold text-white">${processForm.amount}</div>
            </div>
            
            <div>
              <Label className="text-gray-300">Notes</Label>
              <Textarea
                value={processForm.notes}
                onChange={(e) => setProcessForm(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Add any notes about this reimbursement..."
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Owner Contact Information</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-gray-300 text-sm">Owner Name</Label>
                  <Input
                    value={processForm.ownerName}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Owner Phone</Label>
                  <Input
                    value={processForm.ownerPhone}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Owner Email</Label>
                  <Input
                    value={processForm.ownerEmail}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, ownerEmail: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">CC Email (Optional)</Label>
              <Input
                value={processForm.ccEmail}
                onChange={(e) => setProcessForm(prev => ({ ...prev, ccEmail: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Additional email to notify"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="attach-report"
                checked={processForm.attachReport}
                onCheckedChange={(checked) => setProcessForm(prev => ({ ...prev, attachReport: checked }))}
              />
              <Label htmlFor="attach-report" className="text-gray-300">
                Attach monthly report with comments
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProcessModal(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessReimbursement}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Process Reimbursement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CommunicationsTab({ 
  messages, 
  setMessages 
}: { 
  messages: {
    id: string;
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    status: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }[];
  setMessages: React.Dispatch<React.SetStateAction<{
    id: string;
    propertyId: string;
    propertyName: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    status: string;
    threadId: string;
    type?: string;
    relatedExpenses?: string[];
    packetId?: string;
  }[]>>;
}) {
  const [selectedProperty, setSelectedProperty] = useState("all")
  const [newMessage, setNewMessage] = useState("")
  const [selectedCommThread, setSelectedCommThread] = useState<string | null>(null)

  const properties = [
    { id: "all", name: "All Properties" },
    { id: "redwood", name: "Redwood Shores Office Complex" },
    { id: "mission", name: "Mission Bay Tech Campus" },
    { id: "skyline", name: "Skyline Vista" }
  ]

  const filteredMessages = selectedProperty === "all" 
    ? messages 
    : messages.filter(msg => msg.propertyId === selectedProperty)

  const groupedMessages = filteredMessages.reduce((acc, message) => {
    const key = `${message.propertyId}_${message.threadId}`
    if (!acc[key]) {
      acc[key] = {
        threadId: message.threadId,
        propertyId: message.propertyId,
        propertyName: message.propertyName,
        lastMessage: message,
        messages: []
      }
    }
    acc[key].messages.push(message)
    if (message.timestamp > acc[key].lastMessage.timestamp) {
      acc[key].lastMessage = message
    }
    return acc
  }, {} as any)

  const handleSendMessage = (propertyId: string, threadId: string) => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        propertyId,
        propertyName: properties.find(p => p.id === propertyId)?.name || "",
        senderId: "owner1",
        senderName: "Property Owner",
        senderRole: "owner",
        content: newMessage,
        timestamp: new Date(),
        status: "sent",
        threadId
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Communications</h2>
          <p className="text-sm text-gray-400">Messaging with property managers, technicians, and central office</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-64 bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
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
            {Object.values(groupedMessages).map((thread: any) => (
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
                  {thread.lastMessage.status === "unread" && (
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
                    {thread.lastMessage.timestamp.toLocaleDateString()}
                  </span>
                  <Badge className="bg-gray-700 text-gray-300 text-xs">
                    {thread.messages.length}
                  </Badge>
                </div>
              </div>
            ))}

            {Object.keys(groupedMessages).length === 0 && (
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
            const thread = Object.values(groupedMessages).find((t: any) => t.threadId === selectedCommThread) as any;

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
                          message.senderRole === 'owner' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-3 ${
                            message.type === 'flag'
                              ? 'bg-red-600/20 border border-red-500/30 text-red-100'
                              : message.type === 'nudge'
                              ? 'bg-orange-600/20 border border-orange-500/30 text-orange-100'
                              : message.senderRole === 'owner'
                              ? 'bg-green-600 text-white'
                              : message.senderRole === 'pm'
                              ? 'bg-blue-600 text-white'
                              : message.senderRole === 'centralOffice'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.senderName}
                            </span>
                            {message.type === 'flag' && (
                              <Badge className="bg-red-500/20 text-red-300 text-xs">
                                <Flag className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                            {message.type === 'nudge' && (
                              <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                                <Send className="h-3 w-3 mr-1" />
                                Nudge
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleDateString()} at{' '}
                            {message.timestamp.toLocaleTimeString([], {
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
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={() => {
                        if (newMessage.trim()) {
                          const message = {
                            id: Date.now().toString(),
                            propertyId: thread.propertyId,
                            propertyName: thread.propertyName,
                            senderId: "owner1",
                            senderName: "Property Owner",
                            senderRole: "owner",
                            content: newMessage,
                            timestamp: new Date(),
                            status: "sent",
                            threadId: thread.threadId,
                            type: thread.type
                          };
                          setMessages([...messages, message]);
                          setNewMessage("");
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white self-end"
                      disabled={!newMessage.trim()}
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
    </div>
  )
}

function ReportingTab() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [selectedGLCodes, setSelectedGLCodes] = useState<string[]>([])
  const [selectedExpenseStatus, setSelectedExpenseStatus] = useState<string[]>([])
  const [selectedTrustAccount, setSelectedTrustAccount] = useState("all")
  const [reportType, setReportType] = useState("trust-reconciliation")
  const [isGenerating, setIsGenerating] = useState(false)

  const propertyOptions = [
    "Stanford Graduate School of Business",
    "Mission Bay Tech Campus", 
    "Redwood Shores Office Complex",
    "Palo Alto Research Center",
    "South Bay Industrial Park"
  ]

  const glCodeOptions = [
    "REP-HVAC", "REP-PLUMB", "REP-ELEC", "REP-GEN",
    "OPS-CLEAN", "OPS-LAND", "OPS-SUPP", "OPS-MAINT",
    "CAP-SEC", "CAP-HVAC", "CAP-ELEC", "CAP-BLDG",
    "ADMIN-MGMT", "ADMIN-LEGAL", "ADMIN-ACCT"
  ]

  const expenseStatusOptions = [
    "Flagged", "Approved", "Missing Receipt", "Pending Review", "Processed"
  ]

  const trustAccountOptions = [
    "TA-2024-001 (Redwood Shores)",
    "TA-2024-002 (Mission Bay)",
    "TA-2024-003 (Skyline Vista)"
  ]

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
      id: "quarterly-lp-report",
      name: "Quarterly LP Report",
      description: "Comprehensive quarterly report for Limited Partners including: Property-level financial summary (gross income, operating expenses, NOI, CapEx, net cash flow), Budget vs. Actuals analysis, Distribution history and status, Key metrics (occupancy, rent roll, delinquencies), Major events, Forward-looking forecast, and tax-ready attachments."
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
  ]

  const handleGenerateReport = async (format: 'csv' | 'pdf') => {
    setIsGenerating(true)
    
    // Simulate report generation
    const selectedReportType = reportTypes.find(r => r.id === reportType)
    const timestamp = new Date().toISOString()
    
    const filters = {
      dateRange: dateRange.from && dateRange.to ? `${dateRange.from} to ${dateRange.to}` : "All time",
      properties: selectedProperties.length > 0 ? selectedProperties.join(", ") : "All properties",
      glCodes: selectedGLCodes.length > 0 ? selectedGLCodes.join(", ") : "All GL codes",
      expenseStatus: selectedExpenseStatus.length > 0 ? selectedExpenseStatus.join(", ") : "All statuses",
      trustAccount: selectedTrustAccount === "all" ? "All trust accounts" : selectedTrustAccount
    }

    console.log("Generating report:", {
      type: selectedReportType?.name,
      format,
      filters,
      timestamp
    })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    
    // Mock download
    const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`
    alert(`Report generated: ${fileName}`)
  }

  const handlePropertyToggle = (property: string) => {
    setSelectedProperties(prev => 
      prev.includes(property) 
        ? prev.filter(p => p !== property)
        : [...prev, property]
    )
  }

  const handleGLCodeToggle = (code: string) => {
    setSelectedGLCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const handleExpenseStatusToggle = (status: string) => {
    setSelectedExpenseStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearAllFilters = () => {
    setDateRange({ from: "", to: "" })
    setSelectedProperties([])
    setSelectedGLCodes([])
    setSelectedExpenseStatus([])
    setSelectedTrustAccount("all")
  }

  return (
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
                  onClick={clearAllFilters}
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
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">To</Label>
                    <Input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div>
                <Label className="text-gray-300 text-sm font-medium">Properties</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {propertyOptions.map((property) => (
                    <div key={property} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={property}
                        checked={selectedProperties.includes(property)}
                        onChange={() => handlePropertyToggle(property)}
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
                  {glCodeOptions.map((code) => (
                    <div key={code} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={code}
                        checked={selectedGLCodes.includes(code)}
                        onChange={() => handleGLCodeToggle(code)}
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
                  {expenseStatusOptions.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={status}
                        checked={selectedExpenseStatus.includes(status)}
                        onChange={() => handleExpenseStatusToggle(status)}
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
                <Select value={selectedTrustAccount} onValueChange={setSelectedTrustAccount}>
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="All trust accounts" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">All trust accounts</SelectItem>
                    {trustAccountOptions.map((account) => (
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
                        dateRange.from && dateRange.to 
                          ? `${dateRange.from} to ${dateRange.to}`
                          : "All time"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Properties:</span> {
                        selectedProperties.length > 0 
                          ? `${selectedProperties.length} selected`
                          : "All properties"
                      }
                    </div>
                    <div>
                      <span className="font-medium">GL Codes:</span> {
                        selectedGLCodes.length > 0 
                          ? `${selectedGLCodes.length} selected`
                          : "All GL codes"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Expense Status:</span> {
                        selectedExpenseStatus.length > 0 
                          ? `${selectedExpenseStatus.length} selected`
                          : "All statuses"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Trust Account:</span> {
                        selectedTrustAccount === "all" ? "All trust accounts" : selectedTrustAccount
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
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGenerating}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isGenerating ? (
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
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGenerating}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isGenerating ? (
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
                    {reportType === "quarterly-lp-report" && (
                      <Button
                        onClick={() => window.open('/quarterly-lp-dashboard', '_blank')}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Dashboard
                      </Button>
                    )}
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
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">Trust Account Reconciliation Report</div>
                <div className="text-sm text-gray-400">Generated on: 2024-07-08 14:30:22 • All properties • CSV</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">Tax Deduction Summary</div>
                <div className="text-sm text-gray-400">Generated on: 2024-07-07 09:15:45 • YTD • PDF</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">Flagged Expense Report</div>
                <div className="text-sm text-gray-400">Generated on: 2024-07-05 16:22:18 • Q2 2024 • CSV</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CollateralTab() {
  const [collateralViewMode, setCollateralViewMode] = useState<'card' | 'list'>('card')
  const [collateralSearchQuery, setCollateralSearchQuery] = useState('')
  const [collateralDebouncedSearchQuery, setCollateralDebouncedSearchQuery] = useState('')
  const [collateralIsSearching, setCollateralIsSearching] = useState(false)
  const [collateralFilterProperty, setCollateralFilterProperty] = useState('all')
  const [collateralFilterDocType, setCollateralFilterDocType] = useState('all')
  const [collateralFilterUploadedBy, setCollateralFilterUploadedBy] = useState('all')
  const [collateralFilterArea, setCollateralFilterArea] = useState('all')
  const [collateralFilterDateFrom, setCollateralFilterDateFrom] = useState('')
  const [collateralFilterDateTo, setCollateralFilterDateTo] = useState('')
  const [collateralUploadDialogOpen, setCollateralUploadDialogOpen] = useState(false)
  const [collateralPreviewDialogOpen, setCollateralPreviewDialogOpen] = useState(false)
  const [askAiModalOpen, setAskAiModalOpen] = useState(false)
  const [collateralSelectedDocs, setCollateralSelectedDocs] = useState<string[]>([])
  const [collateralDocs, setCollateralDocs] = useState<CollateralDocument[]>(collateralDocuments)
  const [selectedCollateralDoc, setSelectedCollateralDoc] = useState<CollateralDocument | null>(null)
  
  // Collateral Documents Needing Review state
  const [collateralReviewTableExpanded, setCollateralReviewTableExpanded] = useState(false)
  const [showUploadCallout, setShowUploadCallout] = useState(false)
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null)
  const [confirmingDocumentId, setConfirmingDocumentId] = useState<string | null>(null)

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
  ]
  
  // AI Search State
  const [aiSearchQuery, setAiSearchQuery] = useState('')
  const [aiSearchResults, setAiSearchResults] = useState<any>(null)
  const [aiSearchLoading, setAiSearchLoading] = useState(false)
  const [aiSearchSuggestions, setAiSearchSuggestions] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [aiChatMessages, setAiChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, documents?: any[]}>>([])
  const [aiChatInput, setAiChatInput] = useState('')

  // Debounced search for CollateralHub to prevent UI freezing
  useEffect(() => {
    if (collateralSearchQuery === '') {
      setCollateralDebouncedSearchQuery('')
      setCollateralIsSearching(false)
      return
    }

    setCollateralIsSearching(true)
    const handler = setTimeout(() => {
      setCollateralDebouncedSearchQuery(collateralSearchQuery)
      setCollateralIsSearching(false)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [collateralSearchQuery])

  // AI Search Functions
  const getCurrentUserName = () => "Owner Portal User"

  // Collateral Documents Review Handlers
  const handleCollateralFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        // For demo purposes, just show the upload dialog
        setCollateralUploadDialogOpen(true)
        // In a real app, you would handle the file upload here
        console.log('Files selected for upload:', files)
      }
    }
    input.click()
  }

  const handleDocumentReview = (docId: string, action: 'edit' | 'confirm') => {
    // In a real app, this would make an API call
    console.log(`Document ${docId} ${action}`)
    
    if (action === 'edit') {
      setEditingDocumentId(docId)
      setConfirmingDocumentId(null)
    } else if (action === 'confirm') {
      setConfirmingDocumentId(docId)
      setEditingDocumentId(null)
    }
  }

  const handleSaveEdit = (docId: string) => {
    // In a real app, this would save the changes via API
    console.log(`Saving changes for document ${docId}`)
    setEditingDocumentId(null)
  }

  const handleCancelEdit = () => {
    setEditingDocumentId(null)
  }

  const handleConfirmDocument = (docId: string) => {
    // In a real app, this would confirm and move the document
    console.log(`Confirming document ${docId} and adding to collateral hub`)
    setConfirmingDocumentId(null)
    // Remove from pending review list (in real app, this would be handled by backend)
  }

  const handleCancelConfirm = () => {
    setConfirmingDocumentId(null)
  }

  const handleCollateralExportSelected = useCallback(() => {
    const selectedDocsData = collateralDocs.filter(doc => collateralSelectedDocs.includes(doc.id))
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
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'collateral_documents_export.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [collateralDocs, collateralSelectedDocs])

  // AI Search functionality - copied exactly from PM dashboard
  const getAiSearchSuggestions = (query: string) => {
    const roleSuggestions = {
      owner: [
        // Property Performance & Financial Analysis
        "What properties have the highest maintenance costs?",
        "Show me monthly spending by property",
        "Find all budget vs actual reports",
        "What expense categories are over budget?",
        "Show me year-over-year cost comparisons",
        "What were the most expensive repairs last quarter?",
        "Find all expenses over $1000",
        "Show me cash flow projections",
        "What maintenance costs exceeded budget?",
        "Show me property ROI comparisons",
        
        // HVAC & Major Systems
        "How much did we spend on HVAC repairs this year?",
        "Find all HVAC maintenance contracts",
        "Show me heating system invoices from last winter",
        "What HVAC vendors do we use most frequently?",
        "Find air conditioning repair receipts over $500",
        "Show me all furnace replacement quotes",
        "What HVAC warranties are expiring soon?",
        
        // Property-Specific Queries
              "Find all receipts for 01 STANFORD property",
      "Show me 02 SUNNYVALE maintenance costs",
        "What repairs were done at Mission Bay?",
        "Find all Redwood Shores expenses",
        "Show me 01 STANFORD inspection reports",
        "What vendors service our properties?",
        
        // Insurance & Compliance
        "Find all insurance certificates",
        "Show me property insurance claims",
        "What insurance policies are expiring?",
        "Find liability insurance documents",
        "Show me all damage assessment reports",
        "What compliance documents are due?",
        "Show me inspection reports",
        "Find all safety inspection certificates",
        
        // Vendor & Contractor Analysis
        "What contractors do we use most?",
        "Find all vendor contact information",
        "Show me contractor performance reviews",
        "What vendors offer the best rates?",
        "Find all preferred vendor agreements",
        "Show me vendor response time reports",
        "What vendors have the highest invoices?",
        
        // Emergency & Urgent Repairs
        "Show me all emergency repair receipts",
        "Find after-hours service call costs",
        "What emergency repairs happened last month?",
        "Find all urgent maintenance requests",
        "What emergency vendors do we use?",
        "Show me emergency repair response times",
        
        // Document & Contract Management
        "Find contracts expiring in the next 30 days",
        "Show me all service agreements",
        "What maintenance contracts are active?",
        "Find all warranty documents",
        "Show me all documents uploaded this week",
        "What documents are missing or incomplete?",
        
        // Seasonal & Weather-Related
        "Find all winter weather damage costs",
        "Show me storm damage assessments",
        "What seasonal maintenance schedules are due?",
        "Find all weather-related insurance claims",
        "Show me seasonal equipment rentals",
        
        // Tax & Financial Reporting
        "Find all tax-deductible expenses",
        "Show me financial variance reports",
        "What expenses need owner approval?",
        "Find all capital expenditure receipts",
        "Show me quarterly expense summaries"
      ]
    };

    const currentSuggestions = roleSuggestions.owner;
    
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
        summary: "Found 8 HVAC-related documents totaling $12,450 in expenses across 3 properties. The most recent service was a $3,200 repair at 01 STANFORD on December 15th.",
        documents: collateralDocuments.filter(doc => 
          doc.filename.toLowerCase().includes('hvac') || 
          doc.tags.some(tag => tag.toLowerCase().includes('hvac'))
        ).slice(0, 4),
        insights: [
          "01 STANFORD has the highest HVAC maintenance costs ($8,200 YTD)",
          "Most common issue: Filter replacements and duct cleaning",
          "Average cost per HVAC service: $1,556"
        ]
      };
    }
    
    if (queryLower.includes('warranty') || queryLower.includes('expiring')) {
      return {
        summary: "Found 5 warranty documents with 2 expiring in the next 90 days.",
        documents: collateralDocuments.filter(doc => 
          doc.documentType === 'warranty'
        ).slice(0, 3),
        insights: [
          "2 warranties expire in Q1 2025",
          "Total warranty coverage value: $45,000",
          "Most warranties are for HVAC and electrical systems"
        ]
      };
    }
    
    return {
      summary: `Found ${Math.floor(Math.random() * 10) + 1} relevant documents for your query.`,
      documents: collateralDocuments.slice(0, 3),
      insights: [
        "Based on your query, here are the most relevant documents",
        "Consider reviewing similar documents in this category",
        "AI found potential cost savings opportunities"
      ]
    };
  };

  // Optimized Collateral Hub Helper Functions with memoization
  const filteredCollateralDocs = useMemo(() => {
    // Show previous results while searching to prevent UI freezing
    if (collateralIsSearching && collateralDebouncedSearchQuery !== '') {
      return collateralDocs
    }
    
    return collateralDocs.filter(doc => {
      const searchQuery = collateralDebouncedSearchQuery
      
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = (
          doc.filename.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
          doc.linkedVendor?.toLowerCase().includes(query)
        )
        if (!matchesSearch) return false
      }
      
      // Property filter
      if (collateralFilterProperty !== 'all' && doc.propertyId !== collateralFilterProperty) {
        return false
      }
      
      // Area filter
      if (collateralFilterArea !== 'all') {
        const property = propertyOptions.find(p => p.id === doc.propertyId)
        if (!property || property.area !== collateralFilterArea) {
          return false
        }
      }
      
      // Document type filter
      if (collateralFilterDocType !== 'all' && doc.documentType !== collateralFilterDocType) {
        return false
      }
      
      // Uploaded by filter
      if (collateralFilterUploadedBy !== 'all' && doc.uploadedBy !== collateralFilterUploadedBy) {
        return false
      }
      
      // Date range filter
      if (collateralFilterDateFrom && new Date(doc.uploadDate) < new Date(collateralFilterDateFrom)) {
        return false
      }
      if (collateralFilterDateTo && new Date(doc.uploadDate) > new Date(collateralFilterDateTo)) {
        return false
      }
      
      return true
    })
  }, [
    collateralDocs,
    collateralDebouncedSearchQuery,
    collateralFilterProperty,
    collateralFilterDocType,
    collateralFilterUploadedBy,
    collateralFilterDateFrom,
    collateralFilterDateTo,
    collateralIsSearching
  ])

  const handleCollateralDocPreview = (doc: CollateralDocument) => {
    setSelectedCollateralDoc(doc)
    setCollateralPreviewDialogOpen(true)
  }



  const getDocumentTypeIcon = (docType: DocumentType) => {
    switch (docType) {
      case 'vendor_contract': return FileText
      case 'warranty': return Award
      case 'insurance_certificate': return FileWarning
      case 'bid_response': return Receipt
      case 'receipt': return Receipt
      case 'invoice': return DollarSign
      case 'communication_log': return MessageSquare
      case 'compliance_doc': return FileWarning
      default: return FileText
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
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

      {/* AI Search Bar - copied exactly from PM dashboard */}
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

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={collateralSearchQuery}
              onChange={(e) => setCollateralSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
        
        <Select value={collateralFilterProperty} onValueChange={setCollateralFilterProperty}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all" className="text-white">All Properties</SelectItem>
            {propertyOptions.map((property) => (
              <SelectItem key={property.id} value={property.id} className="text-white">
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={collateralFilterArea} onValueChange={setCollateralFilterArea}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="All Areas" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {areaOptions.map((area) => (
              <SelectItem key={area.id} value={area.id} className="text-white">
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={collateralFilterDocType} onValueChange={setCollateralFilterDocType}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            {Object.entries(documentTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={collateralFilterUploadedBy} onValueChange={setCollateralFilterUploadedBy}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Uploaded By" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all" className="text-white">All Uploaders</SelectItem>
            {staffOptions.map((staff) => (
              <SelectItem key={staff.id} value={staff.name} className="text-white">
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollateralViewMode('card')}
            className={collateralViewMode === 'card' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-300'}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollateralViewMode('list')}
            className={collateralViewMode === 'list' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-300'}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
                      const IconComponent = getDocumentTypeIcon(doc.documentType)
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
                                        <option value="prop1">01 STANFORD</option>
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
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {collateralViewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollateralDocs.map((doc) => {
            const IconComponent = getDocumentTypeIcon(doc.documentType)
            const isSelected = collateralSelectedDocs.includes(doc.id)
            
            return (
              <Card 
                key={doc.id} 
                className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                  isSelected ? 'border-blue-500 bg-blue-900/20' : ''
                }`}
                onClick={() => {
                  if (isSelected) {
                    setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id))
                  } else {
                    setCollateralSelectedDocs(prev => [...prev, doc.id])
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
                  
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>By:</span>
                      <span>{doc.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Property:</span>
                      <span>{doc.propertyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </div>
                    {doc.amount && (
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="text-green-400">${doc.amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {doc.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} className="bg-gray-700 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
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
                        e.stopPropagation()
                        handleCollateralDocPreview(doc)
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
                        e.stopPropagation()
                        window.open(doc.fileUrl, '_blank')
                      }}
                    >
                      <LinkIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
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
                          setCollateralSelectedDocs(filteredCollateralDocs.map(doc => doc.id))
                        } else {
                          setCollateralSelectedDocs([])
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
                  const IconComponent = getDocumentTypeIcon(doc.documentType)
                  const isSelected = collateralSelectedDocs.includes(doc.id)
                  
                  return (
                    <tr key={doc.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="rounded bg-gray-700 border-gray-600"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCollateralSelectedDocs(prev => [...prev, doc.id])
                            } else {
                              setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id))
                            }
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-blue-400" />
                          <div className="min-w-0">
                            <div className="text-white font-medium break-words">{doc.filename}</div>
                            <div className="text-xs text-gray-400">{doc.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-gray-700 text-gray-300">
                          {documentTypeLabels[doc.documentType]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-white">{doc.uploadDate}</td>
                      <td className="py-3 px-4 text-white">{doc.uploadedBy}</td>
                      <td className="py-3 px-4 text-white">{doc.propertyName}</td>
                      <td className="py-3 px-4 text-white">{formatFileSize(doc.fileSize)}</td>
                      <td className="py-3 px-4 text-white">
                        {doc.amount ? (
                          <span className="text-green-400">${doc.amount.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
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
                  )
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

      {/* Upload Dialog */}
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
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-300">Demo Mode</span>
              </div>
              <p className="text-sm text-yellow-200">
                This is a demonstration of the file upload interface. No files will actually be uploaded in this demo.
              </p>
            </div>

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
          </div>

          <DialogFooter className="mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                alert('Demo: Files would be uploaded successfully!')
                setCollateralUploadDialogOpen(false)
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

      {/* Ask AI Modal */}
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
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">AI Assistant Demo</span>
              </div>
              <p className="text-sm text-purple-200">
                This is a demonstration of the AI assistant for document analysis. In the full version, you could ask questions like "Find all warranties expiring in 2025" or "Show me invoices from Sarah Chen over $5,000".
              </p>
            </div>
          </div>

          <DialogFooter>
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

      {/* Preview Dialog */}
      <Dialog open={collateralPreviewDialogOpen} onOpenChange={setCollateralPreviewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto m-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              Document Preview
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preview and details for {selectedCollateralDoc?.filename}
            </DialogDescription>
          </DialogHeader>

          {selectedCollateralDoc && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Document Type:</span>
                    <span className="text-white ml-2">{documentTypeLabels[selectedCollateralDoc.documentType]}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Upload Date:</span>
                    <span className="text-white ml-2">{selectedCollateralDoc.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Uploaded By:</span>
                    <span className="text-white ml-2">{selectedCollateralDoc.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Property:</span>
                    <span className="text-white ml-2">{selectedCollateralDoc.propertyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">File Size:</span>
                    <span className="text-white ml-2">{formatFileSize(selectedCollateralDoc.fileSize)}</span>
                  </div>
                  {selectedCollateralDoc.amount && (
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-green-400 ml-2">${selectedCollateralDoc.amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Document preview would appear here in the full version</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => selectedCollateralDoc && window.open(selectedCollateralDoc.fileUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Document
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => setCollateralPreviewDialogOpen(false)}
            >
              Close
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
            <div className="bg-gray-800 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              {aiChatMessages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                  <p className="text-lg font-medium mb-2">AI Document Assistant</p>
                  <p className="text-sm">Ask me anything about your collateral documents, expenses, or properties!</p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button 
                      className="p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors"
                      onClick={() => setAiChatInput("Show me all warranties expiring in 2025")}
                    >
                      <div className="text-sm font-medium text-white">📋 Document Search</div>
                      <div className="text-xs text-gray-400">Find specific document types</div>
                    </button>
                    <button 
                      className="p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors"
                      onClick={() => setAiChatInput("What's the total value of all invoices this month?")}
                    >
                      <div className="text-sm font-medium text-white">💰 Financial Analysis</div>
                      <div className="text-xs text-gray-400">Analyze document values</div>
                    </button>
                    <button 
                      className="p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors"
                      onClick={() => setAiChatInput("Which properties have missing insurance certificates?")}
                    >
                      <div className="text-sm font-medium text-white">🏢 Property Insights</div>
                      <div className="text-xs text-gray-400">Property-specific queries</div>
                    </button>
                    <button 
                      className="p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors"
                      onClick={() => setAiChatInput("Show me recent uploads by Sarah Chen")}
                    >
                      <div className="text-sm font-medium text-white">👤 User Activity</div>
                      <div className="text-xs text-gray-400">Track user contributions</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiChatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        <div className="text-sm">{message.content}</div>
                        {message.documents && message.documents.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <div className="text-xs text-gray-300 mb-2">Found {message.documents.length} relevant document(s):</div>
                            {message.documents.map((doc, docIndex) => (
                              <div key={docIndex} className="text-xs bg-gray-600 p-2 rounded mb-1">
                                📄 {doc.filename} - {doc.propertyName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask about your documents..."
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    // Handle sending message - implement as needed
                  }
                }}
                className="flex-1 bg-gray-800 border-gray-600 text-white"
              />
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  // Handle sending message - implement as needed
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => setAiChatInput("Show me all documents uploaded this week")}
              >
                Recent uploads
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => setAiChatInput("Find documents with missing required information")}
              >
                Missing info
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => setAiChatInput("What contracts are expiring soon?")}
              >
                Expiring soon
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAskAiModalOpen(false)}
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  )
} 