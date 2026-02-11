### **Final Decisions Table**

| Area | Decision | Value / Rule |
| ----- | ----- | ----- |
| Customer portal domain | Operator-scoped domain | Always c3scan.\<operator-domain\> (no custom domains in v1) |
| Operator resolution | How operator is determined | From **Host/subdomain** only (not email domain) |
| Mailbox grace period | Length | **30 days** |
| Compliance during grace | UX \+ access | Warn \+ countdown; normal portal access |
| Compliance after grace | Enforcement | Customer can view mailbox \+ compliance page, **cannot submit new requests**; can view prior history |
| Compliance banner | Global banner | **Yes**, persistent banner on all customer pages for grace\_period \+ non\_compliant |
| Customer request types | Supported in v1 | forward\_mail, shred\_mail |
| Pickup requests | Supported? | **No** in v1 |
| Request duplication rule | Active request per mail item | 1 active request per mail item; otherwise **409** |
| Request fees | Customer-facing fees | **None** in v1 (no pricing/payments UI) |
| Request confirmation | Modal | **Yes**, show summary \+ irreversible warning |
| Forwarding address | Required | Must provide exactly one: saved\_address\_id OR ad\_hoc\_address; else **400** |
| Compliance docs | Required docs | Government photo ID \+ Proof of address |
| Upload formats | Allowed | jpg, jpeg, png, pdf |
| Upload size | Max | **10 MB per file** |
| Virus scanning | Requirement | Optional in v1 (validate mime/size \+ log) |
| Submit-for-review notify staff | Notification | **Yes** |
| Submit-for-review notify customer | Email receipt | **Yes** (“we received your documents…”) |
| Access token TTL | JWT | **60 minutes** |
| Refresh token TTL | Refresh | **30 days** |
| Refresh token storage (web) | Storage method | **HttpOnly Secure cookie**, rotate on use; don’t return in JSON |
| detect-provider | Minimum response | operator\_id/slug, branding, enabled\_auth\_providers\[\] including provider\_type, authorization\_url, client\_id, scopes, pkce\_required=true |
| detect-provider failure | Unknown operator | **404** if operator can’t be determined from Host |

---

## **Final Decisions (Implementation-Complete)**

### **1\) Mailbox grace period**

* **Grace period:** **30 days** from the moment compliance becomes required (or from mailbox activation, depending on your status model).

* During grace period:

  * Customer can access the portal normally.

  * System shows **countdown** and **compliance required** notices.

* After grace period:

  * Customer is **restricted** (see banner rules below).

  * Operator staff can still work the mailbox operationally.

### **2\) Customer request types**

* **Supported in v1:** forward\_mail, shred\_mail

* **Not supported in v1:** pickup

  * If you want “pickup” later, add it as a new request type and workflow then.

### **3\) Fees and confirmation modal**

* **Fees in v1:** **No customer-facing fees** (no pricing UI, no payments, no fee calculation).

  * If there are internal costs, they are handled offline for now.

* **Confirmation modal:** **Yes**

  * When customer submits forward\_mail or shred\_mail, show a confirm modal summarizing:

    * request type

    * selected mail item

    * destination address (for forward)

    * “This action cannot be undone” language where applicable

### **4\) Shipping address handling (forward)**

* Forward requires **exactly one** destination:

  * Either saved\_address\_id, or ad\_hoc\_address (structured fields).

* If saved\_address\_id is provided, ignore ad-hoc fields.

* If neither is provided, return **400**.

### **5\) Compliance documents required**

* **Required docs in v1:**

  * **Government-issued photo ID** (front and back if applicable, but treat as one “ID doc” requirement)

  * **Proof of address** (utility bill, bank statement, lease, or similar)

* **Accepted formats:** jpg, jpeg, png, pdf

* **Max file size:** **10 MB per file**

* **Virus scan:** **Optional for v1**

  * Store files securely, validate mime type and size, and log uploads.

  * Add scanning later if needed.

### **6\) Compliance status UX and banner rules**

* **Top banner rule:** **Yes**

  * Show a persistent banner on **all customer portal pages** when status is either:

    * grace\_period (warning banner)

    * non\_compliant (blocking banner)

* **Behavior when non-compliant (after grace):**

  * Customer can view mailbox and compliance page

  * Customer **cannot submit new customer requests**

  * Customer can still view prior requests and history

* Operator staff is never blocked from operational tooling by customer compliance status.

### **7\) Submit-for-review notifications**

* When customer submits compliance docs for review:

  * **Notify operator staff:** Yes (email or internal notification, whatever exists)

  * **Notify customer:** **Yes**

    * Send email confirmation: “We received your documents and will review them.”

    * Do not promise a review SLA unless you actually have one.

### **8\) Auth refresh strategy and token lifetimes**

* **Access token lifetime:** **60 minutes**

* **Refresh token lifetime:** **30 days**

* **Refresh token storage (web):** **HttpOnly, Secure cookie**

  * Do not return refresh token in JSON for browser clients.

  * Rotate refresh tokens on use.

### **9\) detect-provider response schema**

GET /auth/detect-provider?email=... (email optional, host is primary)

* Always derive operator from **Host** (subdomain).

* Response must include, at minimum:

  * operator\_id

  * operator\_slug

  * branding (name, logo\_url, primary\_color)

  * enabled\_auth\_providers array where each provider includes:

    * provider\_type (google, microsoft, okta, azuread, etc.)

    * authorization\_url

    * client\_id

    * scopes

    * pkce\_required (true)

* If operator cannot be determined from Host, return **404**.

### **10\) Customer portal domain rule**

* **Always:** c3scan.\<operator-domain\>

* No custom domains in v1.

---

