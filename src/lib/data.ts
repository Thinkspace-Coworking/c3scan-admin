// Mock data for C3scan Admin Tool

export type MailItemStatus = 
  | "uploaded"
  | "open_scan_requested"
  | "open_scan_completed"
  | "forward_requested"
  | "forward_shipped"
  | "pickup_requested"
  | "picked_up"
  | "shred_requested"
  | "recycle_requested"
  | "disposed"
  | "deposit_requested"
  | "deposited"
  | "left_at_office"
  | "archived";

export type RequestType = 
  | "open_scan"
  | "forward"
  | "pickup"
  | "shred"
  | "recycle"
  | "deposit"
  | "leave_at_office"
  | "weekly_forward"
  | "biweekly_forward";

export type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type ComplianceStatus = "pending" | "under_review" | "compliant" | "non_compliant" | "rejected";

export type PackageType = "correspondence" | "package";

export interface MailItem {
  id: string;
  pmb: string;
  mailboxName: string;
  mailboxId: string;
  packageType: PackageType;
  status: MailItemStatus;
  uploadedAt: string;
  receivedAt: string;
  carrier?: string;
  trackingNumber?: string;
  thumbnailUrl?: string;
  hasRequest: boolean;
  requestType?: RequestType;
}

export interface Mailbox {
  id: string;
  pmb: string;
  name: string;
  status: "active" | "cancelled";
  complianceStatus: ComplianceStatus;
  createdAt: string;
  offeringPlan?: string;
  companyName?: string;
  phone?: string;
  address?: string;
  managers: MailboxManager[];
  pendingInvitations: Invitation[];
}

export interface MailboxManager {
  id: string;
  email: string;
  name: string;
  role: "manager" | "read_only";
  status: "active" | "pending";
}

export interface Invitation {
  id: string;
  email: string;
  invitedAt: string;
  expiresAt: string;
}

export interface Request {
  id: string;
  type: RequestType;
  status: RequestStatus;
  mailItemId: string;
  mailboxId: string;
  mailboxName: string;
  pmb: string;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  thumbnailUrl?: string;
  // Forward specific
  forwardAddress?: ForwardAddress;
  carrier?: string;
  trackingNumber?: string;
  // Open & Scan specific
  attachments?: RequestAttachment[];
  notes?: RequestNote[];
}

export interface ForwardAddress {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface RequestAttachment {
  id: string;
  filename: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  pageCount?: number;
}

export interface RequestNote {
  id: string;
  body: string;
  visibility: "staff_only" | "customer_visible";
  createdAt: string;
  createdBy: string;
}

export interface Renter {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registrationDate: string;
  mailboxId: string;
  mailboxPmb: string;
  mailboxName: string;
}

export interface ComplianceCase {
  mailboxId: string;
  pmb: string;
  mailboxName: string;
  status: ComplianceStatus;
  graceDeadline: string;
  rentersCount: number;
  businessUse: boolean;
  documentsUploaded: boolean;
  lastReminderAt?: string;
}

export interface Invoice {
  id: string;
  operatorId: string;
  mailboxId?: string;
  mailboxName?: string;
  periodStart: string;
  periodEnd: string;
  amountCents: number;
  status: "draft" | "open" | "paid" | "failed";
  dueDate: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface Operator {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Location {
  id: string;
  operatorId: string;
  name: string;
  address: string;
  isActive: boolean;
}

// Mock Data
export const mockOperators: Operator[] = [
  { id: "op-1", name: "Thinkspace", isActive: true },
  { id: "op-2", name: "Acme Coworking", isActive: true },
];

export const mockLocations: Location[] = [
  { id: "loc-1", operatorId: "op-1", name: "Seattle", address: "830 Trafalgar Ct, Seattle, WA 98125", isActive: true },
  { id: "loc-2", operatorId: "op-1", name: "Redmond", address: "16150 NE 85th St, Redmond, WA 98052", isActive: true },
  { id: "loc-3", operatorId: "op-2", name: "Downtown", address: "123 Main St, Seattle, WA 98101", isActive: true },
];

export const mockMailItems: MailItem[] = [
  { id: "MI-1001", pmb: "1201", mailboxName: "TechCorp Inc.", mailboxId: "mb-1", packageType: "correspondence", status: "uploaded", uploadedAt: "2026-02-08T10:30:00Z", receivedAt: "2026-02-08T09:00:00Z", carrier: "USPS", hasRequest: false },
  { id: "MI-1002", pmb: "1203", mailboxName: "Sarah Johnson LLC", mailboxId: "mb-2", packageType: "package", status: "open_scan_requested", uploadedAt: "2026-02-08T09:15:00Z", receivedAt: "2026-02-08T08:30:00Z", carrier: "UPS", trackingNumber: "1Z999AA10123456784", hasRequest: true, requestType: "open_scan" },
  { id: "MI-1003", pmb: "1205", mailboxName: "Design Studio Co.", mailboxId: "mb-3", packageType: "correspondence", status: "forward_requested", uploadedAt: "2026-02-07T16:45:00Z", receivedAt: "2026-02-07T14:00:00Z", carrier: "FedEx", hasRequest: true, requestType: "forward" },
  { id: "MI-1004", pmb: "1201", mailboxName: "TechCorp Inc.", mailboxId: "mb-1", packageType: "package", status: "open_scan_completed", uploadedAt: "2026-02-06T11:20:00Z", receivedAt: "2026-02-06T10:00:00Z", carrier: "USPS", trackingNumber: "9400100000000000000001", hasRequest: true, requestType: "open_scan" },
  { id: "MI-1005", pmb: "1208", mailboxName: "Global Ventures", mailboxId: "mb-4", packageType: "correspondence", status: "shred_requested", uploadedAt: "2026-02-06T09:00:00Z", receivedAt: "2026-02-06T08:00:00Z", carrier: "USPS", hasRequest: true, requestType: "shred" },
  { id: "MI-1006", pmb: "1210", mailboxName: "Smith Consulting", mailboxId: "mb-5", packageType: "package", status: "forward_shipped", uploadedAt: "2026-02-05T14:30:00Z", receivedAt: "2026-02-05T12:00:00Z", carrier: "UPS", trackingNumber: "1Z888AA10123456784", hasRequest: true, requestType: "forward" },
  { id: "MI-1007", pmb: "1203", mailboxName: "Sarah Johnson LLC", mailboxId: "mb-2", packageType: "correspondence", status: "uploaded", uploadedAt: "2026-02-05T10:00:00Z", receivedAt: "2026-02-05T09:30:00Z", carrier: "USPS", hasRequest: false },
  { id: "MI-1008", pmb: "1212", mailboxName: "Blue Ocean Partners", mailboxId: "mb-6", packageType: "correspondence", status: "pickup_requested", uploadedAt: "2026-02-04T16:00:00Z", receivedAt: "2026-02-04T14:00:00Z", carrier: "USPS", hasRequest: true, requestType: "pickup" },
  { id: "MI-1009", pmb: "1215", mailboxName: "Mountain View LLC", mailboxId: "mb-7", packageType: "package", status: "disposed", uploadedAt: "2026-02-03T11:00:00Z", receivedAt: "2026-02-03T10:00:00Z", carrier: "FedEx", hasRequest: true, requestType: "recycle" },
  { id: "MI-1010", pmb: "1218", mailboxName: "Peak Performance", mailboxId: "mb-8", packageType: "correspondence", status: "deposit_requested", uploadedAt: "2026-02-02T09:30:00Z", receivedAt: "2026-02-02T09:00:00Z", carrier: "USPS", hasRequest: true, requestType: "deposit" },
];

export const mockMailboxes: Mailbox[] = [
  {
    id: "mb-1",
    pmb: "1201",
    name: "TechCorp Inc.",
    status: "active",
    complianceStatus: "compliant",
    createdAt: "2025-06-15T00:00:00Z",
    offeringPlan: "Business Premium",
    companyName: "TechCorp Inc.",
    phone: "(206) 555-0101",
    address: "830 Trafalgar Ct, Seattle, WA 98125",
    managers: [
      { id: "u-1", email: "john@techcorp.com", name: "John Smith", role: "manager", status: "active" },
    ],
    pendingInvitations: [],
  },
  {
    id: "mb-2",
    pmb: "1203",
    name: "Sarah Johnson LLC",
    status: "active",
    complianceStatus: "compliant",
    createdAt: "2025-07-20T00:00:00Z",
    offeringPlan: "Professional",
    companyName: "Sarah Johnson LLC",
    phone: "(206) 555-0102",
    address: "830 Trafalgar Ct, Seattle, WA 98125",
    managers: [
      { id: "u-2", email: "sarah@sjllc.com", name: "Sarah Johnson", role: "manager", status: "active" },
    ],
    pendingInvitations: [],
  },
  {
    id: "mb-3",
    pmb: "1205",
    name: "Design Studio Co.",
    status: "active",
    complianceStatus: "under_review",
    createdAt: "2025-08-10T00:00:00Z",
    offeringPlan: "Standard",
    managers: [
      { id: "u-3", email: "mike@designstudio.com", name: "Mike Chen", role: "manager", status: "active" },
    ],
    pendingInvitations: [
      { id: "inv-1", email: "jane@designstudio.com", invitedAt: "2026-02-01T10:00:00Z", expiresAt: "2026-02-08T10:00:00Z" },
    ],
  },
  {
    id: "mb-4",
    pmb: "1208",
    name: "Global Ventures",
    status: "active",
    complianceStatus: "pending",
    createdAt: "2025-09-05T00:00:00Z",
    offeringPlan: "Business Premium",
    managers: [
      { id: "u-4", email: "alex@globalventures.com", name: "Alex Rivera", role: "manager", status: "active" },
    ],
    pendingInvitations: [],
  },
  {
    id: "mb-5",
    pmb: "1210",
    name: "Smith Consulting",
    status: "active",
    complianceStatus: "compliant",
    createdAt: "2025-10-12T00:00:00Z",
    offeringPlan: "Professional",
    managers: [
      { id: "u-5", email: "emma@smithconsulting.com", name: "Emma Smith", role: "manager", status: "active" },
    ],
    pendingInvitations: [],
  },
  {
    id: "mb-6",
    pmb: "1212",
    name: "Blue Ocean Partners",
    status: "active",
    complianceStatus: "non_compliant",
    createdAt: "2025-11-01T00:00:00Z",
    offeringPlan: "Standard",
    managers: [
      { id: "u-6", email: "david@blueocean.com", name: "David Park", role: "manager", status: "active" },
    ],
    pendingInvitations: [],
  },
  {
    id: "mb-7",
    pmb: "1215",
    name: "Mountain View LLC",
    status: "cancelled",
    complianceStatus: "compliant",
    createdAt: "2025-04-20T00:00:00Z",
    offeringPlan: "Basic",
    managers: [],
    pendingInvitations: [],
  },
  {
    id: "mb-8",
    pmb: "1218",
    name: "Peak Performance",
    status: "active",
    complianceStatus: "compliant",
    createdAt: "2025-12-01T00:00:00Z",
    offeringPlan: "Professional",
    managers: [
      { id: "u-7", email: "lisa@peakperf.com", name: "Lisa Wang", role: "manager", status: "active" },
    ],
    pendingInvitations: [],
  },
];

export const mockRequests: Request[] = [
  {
    id: "REQ-001",
    type: "open_scan",
    status: "pending",
    mailItemId: "MI-1002",
    mailboxId: "mb-2",
    mailboxName: "Sarah Johnson LLC",
    pmb: "1203",
    requestedBy: "Sarah Johnson",
    requestedAt: "2026-02-08T09:20:00Z",
  },
  {
    id: "REQ-002",
    type: "forward",
    status: "pending",
    mailItemId: "MI-1003",
    mailboxId: "mb-3",
    mailboxName: "Design Studio Co.",
    pmb: "1205",
    requestedBy: "Mike Chen",
    requestedAt: "2026-02-07T17:00:00Z",
    forwardAddress: {
      recipientName: "Mike Chen",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "US",
    },
    carrier: "USPS First Class",
  },
  {
    id: "REQ-003",
    type: "shred",
    status: "in_progress",
    mailItemId: "MI-1005",
    mailboxId: "mb-4",
    mailboxName: "Global Ventures",
    pmb: "1208",
    requestedBy: "Alex Rivera",
    requestedAt: "2026-02-06T10:00:00Z",
  },
  {
    id: "REQ-004",
    type: "pickup",
    status: "pending",
    mailItemId: "MI-1008",
    mailboxId: "mb-6",
    mailboxName: "Blue Ocean Partners",
    pmb: "1212",
    requestedBy: "David Park",
    requestedAt: "2026-02-04T16:30:00Z",
  },
  {
    id: "REQ-005",
    type: "open_scan",
    status: "completed",
    mailItemId: "MI-1004",
    mailboxId: "mb-1",
    mailboxName: "TechCorp Inc.",
    pmb: "1201",
    requestedBy: "John Smith",
    requestedAt: "2026-02-06T12:00:00Z",
    completedAt: "2026-02-07T10:00:00Z",
    attachments: [
      { id: "att-1", filename: "scan_001.pdf", fileType: "application/pdf", uploadedAt: "2026-02-07T10:00:00Z", uploadedBy: "Staff", pageCount: 3 },
    ],
    notes: [
      { id: "note-1", body: "Scanned all 3 pages, clear quality", visibility: "customer_visible", createdAt: "2026-02-07T10:00:00Z", createdBy: "Staff" },
    ],
  },
  {
    id: "REQ-006",
    type: "forward",
    status: "completed",
    mailItemId: "MI-1006",
    mailboxId: "mb-5",
    mailboxName: "Smith Consulting",
    pmb: "1210",
    requestedBy: "Emma Smith",
    requestedAt: "2026-02-05T15:00:00Z",
    completedAt: "2026-02-06T14:00:00Z",
    forwardAddress: {
      recipientName: "Emma Smith",
      addressLine1: "456 Pine Street",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "US",
    },
    carrier: "UPS Ground",
    trackingNumber: "1Z888AA10123456784",
  },
  {
    id: "REQ-007",
    type: "deposit",
    status: "pending",
    mailItemId: "MI-1010",
    mailboxId: "mb-8",
    mailboxName: "Peak Performance",
    pmb: "1218",
    requestedBy: "Lisa Wang",
    requestedAt: "2026-02-02T10:00:00Z",
  },
  {
    id: "REQ-008",
    type: "recycle",
    status: "completed",
    mailItemId: "MI-1009",
    mailboxId: "mb-7",
    mailboxName: "Mountain View LLC",
    pmb: "1215",
    requestedBy: "Previous Manager",
    requestedAt: "2026-02-03T12:00:00Z",
    completedAt: "2026-02-04T09:00:00Z",
  },
];

export const mockRenters: Renter[] = [
  { id: "r-1", fullName: "John Smith", email: "john@techcorp.com", phone: "(206) 555-0101", registrationDate: "2025-06-15", mailboxId: "mb-1", mailboxPmb: "1201", mailboxName: "TechCorp Inc." },
  { id: "r-2", fullName: "Sarah Johnson", email: "sarah@sjllc.com", phone: "(206) 555-0102", registrationDate: "2025-07-20", mailboxId: "mb-2", mailboxPmb: "1203", mailboxName: "Sarah Johnson LLC" },
  { id: "r-3", fullName: "Mike Chen", email: "mike@designstudio.com", phone: "(206) 555-0103", registrationDate: "2025-08-10", mailboxId: "mb-3", mailboxPmb: "1205", mailboxName: "Design Studio Co." },
  { id: "r-4", fullName: "Alex Rivera", email: "alex@globalventures.com", phone: "(206) 555-0104", registrationDate: "2025-09-05", mailboxId: "mb-4", mailboxPmb: "1208", mailboxName: "Global Ventures" },
  { id: "r-5", fullName: "Emma Smith", email: "emma@smithconsulting.com", phone: "(206) 555-0105", registrationDate: "2025-10-12", mailboxId: "mb-5", mailboxPmb: "1210", mailboxName: "Smith Consulting" },
  { id: "r-6", fullName: "David Park", email: "david@blueocean.com", phone: "(206) 555-0106", registrationDate: "2025-11-01", mailboxId: "mb-6", mailboxPmb: "1212", mailboxName: "Blue Ocean Partners" },
  { id: "r-7", fullName: "Lisa Wang", email: "lisa@peakperf.com", phone: "(206) 555-0107", registrationDate: "2025-12-01", mailboxId: "mb-8", mailboxPmb: "1218", mailboxName: "Peak Performance" },
];

export const mockComplianceCases: ComplianceCase[] = [
  { mailboxId: "mb-1", pmb: "1201", mailboxName: "TechCorp Inc.", status: "compliant", graceDeadline: "2026-03-15", rentersCount: 1, businessUse: true, documentsUploaded: true },
  { mailboxId: "mb-2", pmb: "1203", mailboxName: "Sarah Johnson LLC", status: "compliant", graceDeadline: "2026-03-20", rentersCount: 1, businessUse: true, documentsUploaded: true },
  { mailboxId: "mb-3", pmb: "1205", mailboxName: "Design Studio Co.", status: "under_review", graceDeadline: "2026-02-15", rentersCount: 2, businessUse: true, documentsUploaded: true, lastReminderAt: "2026-02-05" },
  { mailboxId: "mb-4", pmb: "1208", mailboxName: "Global Ventures", status: "pending", graceDeadline: "2026-02-10", rentersCount: 1, businessUse: true, documentsUploaded: false, lastReminderAt: "2026-02-06" },
  { mailboxId: "mb-5", pmb: "1210", mailboxName: "Smith Consulting", status: "compliant", graceDeadline: "2026-04-01", rentersCount: 1, businessUse: true, documentsUploaded: true },
  { mailboxId: "mb-6", pmb: "1212", mailboxName: "Blue Ocean Partners", status: "non_compliant", graceDeadline: "2026-01-30", rentersCount: 1, businessUse: false, documentsUploaded: false, lastReminderAt: "2026-01-25" },
  { mailboxId: "mb-7", pmb: "1215", mailboxName: "Mountain View LLC", status: "compliant", graceDeadline: "2026-02-28", rentersCount: 1, businessUse: true, documentsUploaded: true },
  { mailboxId: "mb-8", pmb: "1218", mailboxName: "Peak Performance", status: "compliant", graceDeadline: "2026-05-01", rentersCount: 2, businessUse: true, documentsUploaded: true },
];

export const mockInvoices: Invoice[] = [
  { id: "INV-2026-001", operatorId: "op-1", mailboxId: "mb-1", mailboxName: "TechCorp Inc.", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountCents: 4999, status: "paid", dueDate: "2026-02-05", createdAt: "2026-02-01T00:00:00Z" },
  { id: "INV-2026-002", operatorId: "op-1", mailboxId: "mb-2", mailboxName: "Sarah Johnson LLC", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountCents: 2999, status: "paid", dueDate: "2026-02-05", createdAt: "2026-02-01T00:00:00Z" },
  { id: "INV-2026-003", operatorId: "op-1", mailboxId: "mb-3", mailboxName: "Design Studio Co.", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountCents: 1999, status: "open", dueDate: "2026-02-10", createdAt: "2026-02-01T00:00:00Z" },
  { id: "INV-2026-004", operatorId: "op-1", mailboxId: "mb-4", mailboxName: "Global Ventures", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountCents: 4999, status: "open", dueDate: "2026-02-10", createdAt: "2026-02-01T00:00:00Z" },
  { id: "INV-2026-005", operatorId: "op-1", periodStart: "2026-01-01", periodEnd: "2026-01-31", amountCents: 15000, status: "paid", dueDate: "2026-02-05", createdAt: "2026-02-01T00:00:00Z" },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "pm-1", brand: "Visa", last4: "4242", expMonth: 12, expYear: 2027, isDefault: true },
  { id: "pm-2", brand: "Mastercard", last4: "8888", expMonth: 6, expYear: 2028, isDefault: false },
];

// Helper functions
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getStatusColor(status: string): { bg: string; text: string } {
  const colorMap: Record<string, { bg: string; text: string }> = {
    // Mail statuses
    uploaded: { bg: "bg-[var(--semantic-blue-soft)]", text: "text-[var(--semantic-blue)]" },
    received: { bg: "bg-[var(--semantic-blue-soft)]", text: "text-[var(--semantic-blue)]" },
    open_scan_requested: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    open_scan_completed: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    forward_requested: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    forward_shipped: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    pickup_requested: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    picked_up: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    shred_requested: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    recycle_requested: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    disposed: { bg: "bg-[var(--semantic-gray-soft)]", text: "text-[var(--semantic-gray)]" },
    deposit_requested: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    deposited: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    left_at_office: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    archived: { bg: "bg-[var(--semantic-gray-soft)]", text: "text-[var(--semantic-gray)]" },
    // Request statuses
    pending: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    in_progress: { bg: "bg-[var(--semantic-blue-soft)]", text: "text-[var(--semantic-blue)]" },
    completed: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    cancelled: { bg: "bg-[var(--semantic-gray-soft)]", text: "text-[var(--semantic-gray)]" },
    // Compliance statuses
    compliant: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    under_review: { bg: "bg-[var(--semantic-purple-soft)]", text: "text-[var(--semantic-purple)]" },
    non_compliant: { bg: "bg-[var(--semantic-red-soft)]", text: "text-[var(--semantic-red)]" },
    rejected: { bg: "bg-[var(--semantic-red-soft)]", text: "text-[var(--semantic-red)]" },
    // Mailbox statuses
    active: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    // Invoice statuses
    draft: { bg: "bg-[var(--semantic-gray-soft)]", text: "text-[var(--semantic-gray)]" },
    open: { bg: "bg-[var(--semantic-yellow-soft)]", text: "text-[var(--semantic-yellow)]" },
    paid: { bg: "bg-[var(--semantic-green-soft)]", text: "text-[var(--semantic-green)]" },
    failed: { bg: "bg-[var(--semantic-red-soft)]", text: "text-[var(--semantic-red)]" },
  };
  return colorMap[status] || { bg: "bg-gray-100", text: "text-gray-600" };
}

export function getStatusLabel(status: string): string {
  const labelMap: Record<string, string> = {
    uploaded: "Uploaded",
    open_scan_requested: "Open & Scan Requested",
    open_scan_completed: "Open & Scan Completed",
    forward_requested: "Forward Requested",
    forward_shipped: "Forward Shipped",
    pickup_requested: "Pickup Requested",
    picked_up: "Picked Up",
    shred_requested: "Shred Requested",
    recycle_requested: "Recycle Requested",
    disposed: "Disposed",
    deposit_requested: "Deposit Requested",
    deposited: "Deposited",
    left_at_office: "Left at Office",
    archived: "Archived",
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    compliant: "Compliant",
    under_review: "Under Review",
    non_compliant: "Non-Compliant",
    rejected: "Rejected",
    active: "Active",
    draft: "Draft",
    open: "Open",
    paid: "Paid",
    failed: "Failed",
  };
  return labelMap[status] || status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
