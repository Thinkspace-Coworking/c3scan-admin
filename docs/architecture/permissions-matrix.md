Below is a **Permissions Matrix** you can hand to Ava \+ QA. It’s designed to be unambiguous and maps directly to your tenant rules: **operator-scoped by hostname**, members scoped to **their company**, staff scoped to **their operator** (cross-location view with filters), and platform\_admin is cross-operator but **separate surface \+ audited**.

### **Legend**

* **R** \= Read / View (includes list \+ detail)

* **C** \= Create

* **U** \= Update (includes status changes)

* **D** \= Delete (generally avoided; prefer soft-delete)

* **M** \= Manage (invite/remove users, settings, etc.)

* **A** \= Approve/Reject (compliance decision)

* **$** \= Billing-sensitive

* **S** \= Step-up auth recommended (re-auth/MFA/OTP) for this action

* **Scope** notes tell you the required tenant filter

---

## **Global scope rules (apply everywhere)**

* **platform\_admin:** cross-operator, only via /api/platform/\*, **fully audited**

* **operator\_admin:** operator-scoped, **all locations** (unless you later restrict)

* **operator\_staff:** operator-scoped, **cross-location allowed** (filter/toggle); optional future restriction via location\_ids

* **mailbox\_manager / member\_user / authorized\_member:** operator-scoped **and** company-scoped (only their company’s mail & records)

---

## **Permissions Matrix**

### **1\) Mail Items (envelopes, metadata, images)**

Scope: operator\_id always. Member scope also requires company\_id ∈ token.company\_ids.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Mail items: list \+ view metadata | R | R | R | R | R | R (optional) |
| Mail items: view envelope image | R | R | R | R | R | R (optional) |
| Mail items: upload/create (intake) | C | C | C | – | – | – |
| Mail items: reassign mailbox/company | U | U (S) | – | – | – | – |
| Mail items: archive/hide (member-facing) | – | – | – | U | U | – |
| Mail items: delete | – | – | – | – | – | – |

**Notes**

* Envelope image access should be via **signed URLs**; issuing a signed URL counts as “read”.

* “authorized\_member” portal access is a policy choice. If you don’t want them in the portal, set to **–**.

---

### **2\) Requests (forward, open & scan, shred/recycle, pickup)**

Scope: operator\_id always. Members only for their company’s mail items.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Requests: list \+ view | R | R | R | R | R | R (optional) |
| Requests: create | – | – | – | C | C | – |
| Requests: update status (fulfillment workflow) | U | U | U | – | – | – |
| Requests: cancel | – | U | U | U | U | – |
| Requests: add internal notes | U | U | U | – | – | – |
| Requests: add customer-visible notes | U | U | U | U | U | – |

**Notes**

* You previously leaned toward “one active request per mail item” → enforce 409 on duplicates unless canceled.

---

### **3\) Mailboxes (PMB, mailbox profile)**

Scope: operator\_id always. Staff can see within operator; members only for their mailbox/company.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Mailboxes: list \+ view | R | R | R | R | R | R (optional) |
| Mailboxes: create | C | C | – (optional) | – | – | – |
| Mailboxes: update name/status | U | U | – (optional) | – | – | – |
| Mailboxes: manage members (invite/remove) | M | M (S for removals) | – | M (S for removals) | – | – |
| Mailboxes: change forwarding address | U | U (S) | U (S) | U (S) | – | – |

**Notes**

* Forwarding address is PII. Require **step-up** for changes.

---

### **4\) Company Profile (company record, contacts)**

Scope: operator\_id always.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Company: view | R | R | R | R | R | R (optional) |
| Company: create | C | C | – (optional) | – | – | – |
| Company: update profile fields | U | U | – (optional) | U (limited) | – | – |

**Notes**

* “limited” means safe fields only (display name, contacts). Not billing or compliance flags.

---

### **5\) Aliases (recipient / company alias mapping used for matching)**

Scope: operator\_id always.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Aliases: view/search | R | R | R | R (company-only) | R (company-only) | – |
| Aliases: create | C | C | C | – | – | – |
| Aliases: update/delete | U/D | U/D | U/D (optional) | – | – | – |

**Notes**

* If you don’t want members to see all aliases (privacy), restrict to **company-only** aliases.

---

### **6\) Compliance (documents \+ review)**

Scope: operator\_id always. Members only for their mailbox/company.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Compliance status: view | R | R | R | R | R | R (optional) |
| Upload compliance docs | – | – | – | C | C | – |
| Submit for review | – | – | – | U | U | – |
| Review (view docs) | R | R | R | R (own only) | R (own only) | – |
| Approve / Reject | A | A | – (optional) | – | – | – |

**Notes**

* Approval/rejection should be **operator\_admin only** by default.

---

### **7\) Attachments & Files (open-scan PDFs, labels, compliance docs)**

Scope: Always tied to a parent object (mail\_item, request, or compliance\_record).

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Generate signed URL for envelope images | R | R | R | R | R | R (optional) |
| Generate signed URL for interior scans | R | R | R | R (S) | R (S) | – |
| Generate signed URL for compliance docs | R | R | R | R (S) | R (S) | – |
| Upload open-scan results | C | C | C | – | – | – |

**Notes**

* “S” here is strong: interior scan downloads are the highest sensitivity.

---

### **8\) Billing (if/when enabled)**

Scope: operator\_id always.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| View invoices ($) | R | R | – (optional) | R (own only) | R (own only) | – |
| Create/adjust invoices ($) | C/U | C/U | – | – | – | – |
| Update payment methods ($) | – | – | – | U (S) | U (S) | – |

---

### **9\) Settings & Integrations (operator configuration)**

Scope: operator\_id always.

| Resource / Action | platform\_admin | operator\_admin | operator\_staff | mailbox\_manager | member\_user | authorized\_member |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| View operator settings | R | R | R (limited) | – | – | – |
| Update operator settings | U | U | – | – | – | – |
| Manage integrations (secrets) | U | U (S) | – | – | – | – |

---

## **Recommended “Step-up auth” triggers (low friction, high safety)**

Require re-auth/MFA/OTP for:

* changing forwarding address

* downloading interior scans / compliance docs

* removing mailbox manager / members

* integration settings changes

* billing payment method changes

---

## **Open decision (you can pick now or later)**

**authorized\_member portal access**

* If you want to avoid extra complexity in v1: **no portal access** (treat authorized members as compliance roster only).

* If you want portal access: make it **read-only**, scoped to company mail items, no requests, no doc uploads.

If you tell me which you prefer, I can produce a “finalized” matrix with no “optional” entries.

