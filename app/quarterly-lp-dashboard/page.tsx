"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Download,
  Calendar,
  Building,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Filter,
  RefreshCw
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from 'recharts'

export default function QuarterlyLPDashboard() {
  const [selectedFund, setSelectedFund] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState("all")
  const [selectedAssetClass, setSelectedAssetClass] = useState("all")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Q4-2024")

  // Mock data for the dashboard
  const fundOptions = [
    { id: "all", name: "All Funds" },
    { id: "fund-1", name: "Real Estate Fund I" },
    { id: "fund-2", name: "Commercial Growth Fund" },
    { id: "fund-3", name: "Mixed-Use Development Fund" }
  ]

  const propertyOptions = [
    { id: "all", name: "All Properties" },
    { id: "stanford", name: "Stanford GSB" },
    { id: "mission", name: "Mission Bay Tech Campus" },
    { id: "redwood", name: "Redwood Shores Office Complex" },
    { id: "skyline", name: "Skyline Vista" }
  ]

  const assetClassOptions = [
    { id: "all", name: "All Asset Classes" },
    { id: "office", name: "Office" },
    { id: "retail", name: "Retail" },
    { id: "mixed-use", name: "Mixed-Use" },
    { id: "industrial", name: "Industrial" }
  ]

  const timePeriodOptions = [
    { id: "Q4-2024", name: "Q4 2024" },
    { id: "Q3-2024", name: "Q3 2024" },
    { id: "Q2-2024", name: "Q2 2024" },
    { id: "Q1-2024", name: "Q1 2024" },
    { id: "YTD-2024", name: "YTD 2024" }
  ]

  // Property-Level Financial Summary Data
  const propertyFinancials = [
    {
      property: "Stanford GSB",
      grossIncome: 2400000,
      operatingExpenses: 720000,
      noi: 1680000,
      capex: 150000,
      netCashFlow: 1530000,
      noiMargin: 70.0,
      cashFlowMargin: 63.8
    },
    {
      property: "Mission Bay Tech Campus",
      grossIncome: 1850000,
      operatingExpenses: 555000,
      noi: 1295000,
      capex: 85000,
      netCashFlow: 1210000,
      noiMargin: 70.0,
      cashFlowMargin: 65.4
    },
    {
      property: "Redwood Shores Office Complex",
      grossIncome: 1650000,
      operatingExpenses: 512000,
      noi: 1138000,
      capex: 95000,
      netCashFlow: 1043000,
      noiMargin: 69.0,
      cashFlowMargin: 63.2
    }
  ]

  // Budget vs. Actuals Data
  const budgetActuals = [
    { category: "Rental Income", budget: 5200000, actual: 5900000, variance: 13.5, status: "positive" },
    { category: "Operating Expenses", budget: 1800000, actual: 1787000, variance: -0.7, status: "positive" },
    { category: "Repairs & Maintenance", budget: 280000, actual: 325000, variance: 16.1, status: "negative" },
    { category: "Utilities", budget: 180000, actual: 165000, variance: -8.3, status: "positive" },
    { category: "Property Management", budget: 312000, actual: 298000, variance: -4.5, status: "positive" },
    { category: "Insurance", budget: 95000, actual: 98000, variance: 3.2, status: "negative" }
  ]

  // Distributions Data
  const distributionHistory = [
    { period: "Q4 2024", amount: 485000, preferredReturn: 8.5, distributionYield: 6.2, status: "Paid" },
    { period: "Q3 2024", amount: 465000, preferredReturn: 8.5, distributionYield: 5.9, status: "Paid" },
    { period: "Q2 2024", amount: 445000, preferredReturn: 8.5, distributionYield: 5.7, status: "Paid" },
    { period: "Q1 2024", amount: 425000, preferredReturn: 8.5, distributionYield: 5.4, status: "Paid" }
  ]

  // Key Metrics Data
  const keyMetrics = {
    occupancy: 94.2,
    averageRent: 45.50,
    delinquencies: 1.8,
    turnover: 12.5,
    totalUnits: 428,
    occupiedUnits: 403,
    vacantUnits: 25,
    rentRoll: 18354000
  }

  // Major Events Data
  const majorEvents = [
    {
      category: "CapEx",
      event: "HVAC System Upgrade - Stanford GSB",
      status: "Completed",
      cost: 185000,
      impact: "Improved energy efficiency by 15%, reduced operating costs",
      date: "Dec 2024"
    },
    {
      category: "Tenant",
      event: "New 10-year lease signed - Mission Bay",
      status: "Completed",
      cost: 0,
      impact: "Secured 15,000 sq ft at $52/sq ft, 8% above market",
      date: "Nov 2024"
    },
    {
      category: "Legal",
      event: "Zoning variance approved - Redwood Shores",
      status: "In Progress",
      cost: 25000,
      impact: "Enables future expansion project, potential 20% NOI increase",
      date: "Oct 2024"
    }
  ]

  // Forward Look Data
  const forwardLook = {
    nextQuarterNOI: 4250000,
    currentQuarterNOI: 4113000,
    noiGrowth: 3.3,
    upcomingCapital: [
      { project: "Electrical Panel Upgrades", cost: 125000, timeline: "Q1 2025" },
      { project: "Parking Lot Resurfacing", cost: 85000, timeline: "Q2 2025" },
      { project: "Elevator Modernization", cost: 245000, timeline: "Q2 2025" }
    ],
    strategyUpdates: [
      "Evaluating refinancing opportunities with current low rates",
      "Considering sale of non-core asset (Skyline Vista) in Q3 2025",
      "Exploring acquisition of adjacent parcel for Mission Bay expansion"
    ]
  }

  // Chart data
  const quarterlyNOIData = [
    { quarter: "Q1 2024", noi: 3850000, budget: 3900000 },
    { quarter: "Q2 2024", noi: 3950000, budget: 4000000 },
    { quarter: "Q3 2024", noi: 4050000, budget: 4100000 },
    { quarter: "Q4 2024", noi: 4113000, budget: 4200000 }
  ]

  const occupancyTrendData = [
    { month: "Jan", occupancy: 92.1 },
    { month: "Feb", occupancy: 93.2 },
    { month: "Mar", occupancy: 94.1 },
    { month: "Apr", occupancy: 93.8 },
    { month: "May", occupancy: 94.5 },
    { month: "Jun", occupancy: 94.2 },
    { month: "Jul", occupancy: 93.9 },
    { month: "Aug", occupancy: 94.8 },
    { month: "Sep", occupancy: 94.3 },
    { month: "Oct", occupancy: 94.7 },
    { month: "Nov", occupancy: 94.1 },
    { month: "Dec", occupancy: 94.2 }
  ]

  const portfolioComposition = [
    { name: "Office", value: 65, color: "#3b82f6" },
    { name: "Retail", value: 20, color: "#10b981" },
    { name: "Mixed-Use", value: 15, color: "#f59e0b" }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Quarterly LP Report Dashboard</h1>
              <p className="text-sm text-gray-400">Real-time portfolio performance and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/owner'}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Fund</label>
                <Select value={selectedFund} onValueChange={setSelectedFund}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {fundOptions.map(fund => (
                      <SelectItem key={fund.id} value={fund.id} className="text-white">
                        {fund.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Property</label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {propertyOptions.map(property => (
                      <SelectItem key={property.id} value={property.id} className="text-white">
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Asset Class</label>
                <Select value={selectedAssetClass} onValueChange={setSelectedAssetClass}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {assetClassOptions.map(assetClass => (
                      <SelectItem key={assetClass.id} value={assetClass.id} className="text-white">
                        {assetClass.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
                <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {timePeriodOptions.map(period => (
                      <SelectItem key={period.id} value={period.id} className="text-white">
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1. Property-Level Financial Summary */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="h-5 w-5" />
              Property-Level Financial Summary
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gross income, operating expenses, NOI, CapEx, and net cash flow by property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Property</TableHead>
                    <TableHead className="text-gray-300">Gross Income</TableHead>
                    <TableHead className="text-gray-300">Op Expenses</TableHead>
                    <TableHead className="text-gray-300">NOI</TableHead>
                    <TableHead className="text-gray-300">CapEx</TableHead>
                    <TableHead className="text-gray-300">Net Cash Flow</TableHead>
                    <TableHead className="text-gray-300">NOI Margin</TableHead>
                    <TableHead className="text-gray-300">CF Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyFinancials.map((property) => (
                    <TableRow key={property.property} className="border-gray-700">
                      <TableCell className="text-white font-medium">{property.property}</TableCell>
                      <TableCell className="text-white">${property.grossIncome.toLocaleString()}</TableCell>
                      <TableCell className="text-white">${property.operatingExpenses.toLocaleString()}</TableCell>
                      <TableCell className="text-green-400 font-medium">${property.noi.toLocaleString()}</TableCell>
                      <TableCell className="text-white">${property.capex.toLocaleString()}</TableCell>
                      <TableCell className="text-blue-400 font-medium">${property.netCashFlow.toLocaleString()}</TableCell>
                      <TableCell className="text-white">{property.noiMargin}%</TableCell>
                      <TableCell className="text-white">{property.cashFlowMargin}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-gray-600 bg-gray-800">
                    <TableCell className="text-white font-bold">Portfolio Total</TableCell>
                    <TableCell className="text-white font-bold">
                      ${propertyFinancials.reduce((sum, p) => sum + p.grossIncome, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white font-bold">
                      ${propertyFinancials.reduce((sum, p) => sum + p.operatingExpenses, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-green-400 font-bold">
                      ${propertyFinancials.reduce((sum, p) => sum + p.noi, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white font-bold">
                      ${propertyFinancials.reduce((sum, p) => sum + p.capex, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-blue-400 font-bold">
                      ${propertyFinancials.reduce((sum, p) => sum + p.netCashFlow, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white font-bold">69.7%</TableCell>
                    <TableCell className="text-white font-bold">64.1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quarterly NOI Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quarterlyNOIData}>
                  <XAxis dataKey="quarter" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Bar dataKey="actual" fill="#3b82f6" name="Actual NOI" />
                  <Bar dataKey="budget" fill="#6b7280" name="Budgeted NOI" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Portfolio Composition by Asset Class</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={portfolioComposition}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {portfolioComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 2. Budget vs. Actuals */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Budget vs. Actuals
            </CardTitle>
            <CardDescription className="text-gray-400">
              Quarterly variance analysis by line item with % over/under budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Budget</TableHead>
                    <TableHead className="text-gray-300">Actual</TableHead>
                    <TableHead className="text-gray-300">Variance ($)</TableHead>
                    <TableHead className="text-gray-300">Variance (%)</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetActuals.map((item) => (
                    <TableRow key={item.category} className="border-gray-700">
                      <TableCell className="text-white font-medium">{item.category}</TableCell>
                      <TableCell className="text-white">${item.budget.toLocaleString()}</TableCell>
                      <TableCell className="text-white">${item.actual.toLocaleString()}</TableCell>
                      <TableCell className={`font-medium ${item.status === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                        {item.status === 'positive' ? '+' : ''}${(item.actual - item.budget).toLocaleString()}
                      </TableCell>
                      <TableCell className={`font-medium ${item.status === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                        {item.variance > 0 ? '+' : ''}{item.variance}%
                      </TableCell>
                      <TableCell>
                        {item.status === 'positive' ? (
                          <Badge className="bg-green-600 text-white">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            Under Budget
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            Over Budget
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 3. Distributions */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Distributions
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution history, current quarter distributions, and preferred return status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-4">Distribution History</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Period</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Yield</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributionHistory.map((dist) => (
                        <TableRow key={dist.period} className="border-gray-700">
                          <TableCell className="text-white">{dist.period}</TableCell>
                          <TableCell className="text-green-400 font-medium">${dist.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-white">{dist.distributionYield}%</TableCell>
                          <TableCell>
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {dist.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Preferred Return Status</h4>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Target Preferred Return</span>
                      <span className="text-white font-bold">8.5%</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">YTD Actual Return</span>
                      <span className="text-green-400 font-bold">9.2%</span>
                    </div>
                    <Progress value={108} className="h-2" />
                    <p className="text-xs text-gray-400 mt-2">108% of target achieved</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium">Preferred Return Met</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      All quarterly preferred returns have been met or exceeded this year
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Key Metrics */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Metrics
            </CardTitle>
            <CardDescription className="text-gray-400">
              Occupancy, rent roll, average rent, delinquencies, and turnover metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">Occupancy Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">{keyMetrics.occupancy}%</div>
                <div className="text-xs text-green-400">+1.2% from last quarter</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Average Rent/SF</span>
                </div>
                <div className="text-2xl font-bold text-white">${keyMetrics.averageRent}</div>
                <div className="text-xs text-green-400">+3.8% from last quarter</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">Delinquencies</span>
                </div>
                <div className="text-2xl font-bold text-white">{keyMetrics.delinquencies}%</div>
                <div className="text-xs text-red-400">+0.3% from last quarter</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300 text-sm">Turnover Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">{keyMetrics.turnover}%</div>
                <div className="text-xs text-green-400">-2.1% from last quarter</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-4">Occupancy Trend (12 Months)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={occupancyTrendData}>
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Area type="monotone" dataKey="occupancy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Portfolio Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Units</span>
                    <span className="text-white font-medium">{keyMetrics.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Occupied Units</span>
                    <span className="text-green-400 font-medium">{keyMetrics.occupiedUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Vacant Units</span>
                    <span className="text-red-400 font-medium">{keyMetrics.vacantUnits}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-300">Annual Rent Roll</span>
                    <span className="text-white font-bold">${keyMetrics.rentRoll.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. Major Events */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Major Events
            </CardTitle>
            <CardDescription className="text-gray-400">
              CapEx projects, significant tenant changes, legal/insurance issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {majorEvents.map((event, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={
                        event.category === 'CapEx' ? 'bg-blue-600' :
                        event.category === 'Tenant' ? 'bg-green-600' :
                        'bg-yellow-600'
                      }>
                        {event.category}
                      </Badge>
                      <h4 className="text-white font-medium">{event.event}</h4>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        event.status === 'Completed' ? 'bg-green-600' :
                        event.status === 'In Progress' ? 'bg-yellow-600' :
                        'bg-gray-600'
                      }>
                        {event.status}
                      </Badge>
                      <div className="text-xs text-gray-400 mt-1">{event.date}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{event.impact}</p>
                  {event.cost > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-400">Cost: </span>
                      <span className="text-white font-medium">${event.cost.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 6. Forward Look */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Forward Look
            </CardTitle>
            <CardDescription className="text-gray-400">
              Next quarter NOI forecast, upcoming capital needs, and strategy updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="text-white font-medium mb-4">NOI Forecast</h4>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Current Quarter NOI</span>
                    <span className="text-white">${forwardLook.currentQuarterNOI.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Next Quarter Forecast</span>
                    <span className="text-green-400 font-bold">${forwardLook.nextQuarterNOI.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium">+{forwardLook.noiGrowth}% growth</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-4">Upcoming Capital Needs</h4>
                <div className="space-y-3">
                  {forwardLook.upcomingCapital.map((project, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white text-sm font-medium">{project.project}</span>
                        <Badge variant="outline" className="text-xs">
                          {project.timeline}
                        </Badge>
                      </div>
                      <span className="text-gray-400 text-sm">${project.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="bg-gray-700 rounded-lg p-3 border-t border-gray-600">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Total Planned CapEx</span>
                      <span className="text-white font-bold">
                        ${forwardLook.upcomingCapital.reduce((sum, p) => sum + p.cost, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Strategy Updates</h4>
                <div className="space-y-3">
                  {forwardLook.strategyUpdates.map((update, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-300 text-sm">{update}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7. Attachments */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attachments
            </CardTitle>
            <CardDescription className="text-gray-400">
              GL-coded expense summary, owner draw report, and tax-ready documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-auto p-4">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">GL-Coded Expense Summary</span>
                  <span className="text-xs text-gray-400">Q4_2024_GL_Summary.csv</span>
                </div>
              </Button>
              <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-auto p-4">
                <div className="flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="font-medium">Owner Draw Report</span>
                  <span className="text-xs text-gray-400">Q4_2024_Owner_Draws.pdf</span>
                </div>
              </Button>
              <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-auto p-4">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Tax-Ready P&L Summary</span>
                  <span className="text-xs text-gray-400">2024_Tax_Summary_1099.xlsx</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} • 
            Data as of Q4 2024 • All figures in USD
          </p>
        </div>
      </div>
    </div>
  )
} 