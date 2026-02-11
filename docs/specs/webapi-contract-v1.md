Below is a **tight WebAPI Contract v1** Ava can implement verbatim. It consolidates the operator-by-host tenancy model, cookie refresh strategy, compliance gating, and a simplified request-type set (**forward\_mail, open\_scan**).   

---

# **WebAPI Contract v1 (c3scan)**

## **0\) Non negotiables**

### **0.1 Operator resolution (tenant boundary)**

* **operator\_id is derived from the request Host** (example c3scan.thinkspace.com) and never from email domain. 

* If Host cannot be mapped to an operator: **404**. 

* Every non-platform request must enforce: token.operator\_id \== operator\_id\_from\_host, else **403** (do not leak existence). 

### **0.2 Namespace separation**

* /api/app/\* member portal APIs (member roles only). 

* /api/admin/\* operator staff tooling APIs. 

* /api/platform/\* platform\_admin only, audited (optional for v1). 

### **0.3 Auth token lifecycle (web)**

* Access token TTL: **60 minutes**. 

* Refresh token TTL: **30 days**, stored in **HttpOnly Secure cookie**, rotate on use, do not return refresh token in JSON. 

### **0.4 Authorized member**

* **authorized\_member has no portal access** (exists only as a compliance roster record). This closes the open decision noted in the permissions file. 

---

## **1\) Roles, scopes, claims**

### **1.1 Roles**

* mailbox\_manager

* member\_user

* operator\_staff

* operator\_admin

* platform\_admin (optional v1)

### **1.2 Required JWT claims**

All tokens:

* sub (user\_id)

* operator\_id

* role

* iat, exp, jti 

Staff tokens also include:

* all\_locations (bool)

* location\_ids (array, empty allowed when all\_locations=true) 

Member tokens also include:

* company\_ids (array) 

### **1.3 Object access rules (enforced in every query)**

* Member access requires record.company\_id ∈ token.company\_ids. 

* Staff access requires either all\_locations=true or record.location\_id ∈ token.location\_ids. 

* Any fetch by id must include operator\_id \= token.operator\_id, else treat as not found and return **404**. 

---

## **2\) Compliance model and gating**

### **2.1 Grace period and restriction**

* Grace period is **30 days**. 

* After grace expires and compliance is not approved: customer is **restricted**:

  * can view mailbox and compliance pages

  * **cannot submit new customer requests**

  * can view prior requests/history 

* Operator staff are never blocked by customer compliance status. 

### **2.2 Compliance statuses (canonical)**

compliance\_status:

* not\_submitted

* grace\_period (derived or stored)

* pending\_review

* approved

* rejected

Recommended derived fields in API responses:

* compliance\_required\_at (ISO)

* grace\_expires\_at (ISO)

* days\_remaining (int, 0 when expired)

* is\_restricted (bool)

### **2.3 Required documents (v1)**

* Government-issued photo ID

* Proof of address

   Accepted formats: jpg, jpeg, png, pdf. Max 10 MB per file. 

---

## **3\) Request model (v1)**

### **3.1 Request types (v1)**

request\_type:

* forward\_mail

* open\_scan

### **3.2 Request statuses and transitions**

request\_status:

* pending

* in\_progress

* completed

* canceled

Valid transitions: 

* pending \-\> in\_progress \-\> completed

* pending \-\> canceled

* in\_progress \-\> canceled

### **3.3 One active request per mail item**

* Only one active request per mail\_item\_id where status in {pending, in\_progress}.

* Creating a second active request returns **409**.   

### **3.4 Completion requirements**

* forward\_mail completion requires:

  * carrier (string) and tracking\_number (string)

  * optional label\_file\_id (file reference) 

* open\_scan completion requires:

  * at least one scan\_file\_id uploaded and finalized 

### **3.5 Forward destination rule**

Create forward request must provide **exactly one** destination:

* saved\_address\_id OR ad\_hoc\_address (structured fields), else **400**. 

---

## **4\) Files and signed URLs**

### **4.1 General rule**

* Envelope images, scan PDFs, and compliance docs are accessed via **time-limited signed URLs**. 

* Highest-sensitivity downloads (interior scans, compliance docs) should require step-up auth in the future; v1 may log and allow. 

### **4.2 File object (canonical)**

FileRef:

* file\_id (uuid)

* owner\_type enum: mail\_item\_envelope | request\_scan | request\_label | compliance\_doc

* storage\_key (string, never exposes bucket secrets)

* content\_type

* size\_bytes

* created\_at

* signed\_url (string, optional, only when requested)

---

## **5\) Common API mechanics**

### **5.1 Headers**

* Authorization: Bearer \<access\_token\> required for all /api/app/\* and /api/admin/\* except the auth routes.

* Idempotency-Key: \<uuid\> supported on POST create endpoints (recommended for scanner uploads and request creation).

* Server returns X-Request-Id on every response.

### **5.2 Pagination**

Cursor pagination (preferred):

* Request: ?limit=50\&cursor=\<opaque\>

* Response: next\_cursor (string or null)

### **5.3 Error format (canonical)**

All non-2xx responses return:

```
{
  "error": {
    "code": "string",
    "message": "string",
    "details": { "any": "json" },
    "request_id": "string"
  }
}
```

Canonical error codes:

* unauthorized (401)

* forbidden (403)

* not\_found (404)

* validation\_failed (400)

* conflict\_active\_request (409)

* rate\_limited (429)

* server\_error (500)

---

# **6\) Endpoints**

## **6.1 Auth (operator-scoped by Host)**

### **GET** 

### **/api/auth/detect-provider**

Purpose: return operator branding and enabled auth providers for this Host. 

* 404 if operator not found from Host. 

Response 200:

```
{
  "operator": { "operator_id": "uuid", "slug": "thinkspace", "name": "Thinkspace" },
  "branding": { "logo_url": "string", "primary_color": "string" },
  "enabled_auth_providers": [
    {
      "provider_type": "google",
      "authorization_url": "string",
      "client_id": "string",
      "scopes": ["openid","email","profile"],
      "pkce_required": true
    }
  ]
}
```

### **GET** 

### **/api/auth/oidc/{provider}**

Starts OIDC with state \+ PKCE. (Redirect)

### **GET** 

### **/api/auth/callback**

Exchanges code, validates ID token, mints access token, sets refresh cookie. 

Success: 302 redirect to app route.

### **POST** 

### **/api/auth/refresh**

Requires refresh cookie.

* 200 returns new access token, rotates refresh cookie. 

Response 200:

```
{ "access_token": "jwt", "expires_in": 3600 }
```

### **POST** 

### **/api/auth/logout**

Revokes refresh token server-side, clears cookie.

---

## **6.2 App (member portal)**

Applicable roles: mailbox\_manager, member\_user only. (authorized\_member blocked by policy) 

### **GET** 

### **/api/app/me**

Response 200:

```
{
  "user": { "user_id": "uuid", "email": "string", "full_name": "string" },
  "role": "member_user",
  "operator_id": "uuid",
  "company_ids": ["uuid"]
}
```

### **GET** 

### **/api/app/mail-items**

Query:

* limit, cursor

* archived (bool, default false)

* from, to (ISO dates)

* search (string)

Response 200:

```
{
  "items": [
    {
      "mail_item_id": "uuid",
      "mailbox_id": "uuid",
      "company_id": "uuid",
      "location_id": "uuid",
      "scanned_at": "iso",
      "status": "new",
      "is_archived": false,
      "envelope_image": { "file_id": "uuid", "signed_url": "string" },
      "latest_request": { "request_id": "uuid", "type": "forward_mail", "status": "pending" }
    }
  ],
  "next_cursor": "string"
}
```

### **GET** 

### **/api/app/mail-items/{mail\_item\_id}**

Response includes:

* envelope image signed url

* latest request details

* actions allowed (based on is\_restricted)

### **POST** 

### **/api/app/mail-items/{mail\_item\_id}/archive**

Body:

```
{ "is_archived": true }
```

### **POST** 

### **/api/app/requests**

Guards:

* If is\_restricted=true: **403** forbidden (cannot submit new customer requests after grace). 

* If active request exists for same mail\_item: **409** conflict\_active\_request. 

Body:

```
{
  "mail_item_id": "uuid",
  "type": "forward_mail",
  "forward": {
    "saved_address_id": "uuid",
    "ad_hoc_address": {
      "name": "string",
      "line1": "string",
      "line2": "string",
      "city": "string",
      "region": "string",
      "postal_code": "string",
      "country": "string"
    }
  }
}
```

Validation:

* type must be forward\_mail or open\_scan

* If type=forward\_mail: exactly one of saved\_address\_id or ad\_hoc\_address required, else 400\. 

* If type=open\_scan: forward must be null/absent.

Response 201:

```
{
  "request": {
    "request_id": "uuid",
    "mail_item_id": "uuid",
    "type": "forward_mail",
    "status": "pending",
    "submitted_at": "iso"
  }
}
```

### **GET** 

### **/api/app/requests**

Lists member requests (scoped to their companies).

### **GET** 

### **/api/app/requests/{request\_id}**

Returns detail including:

* status timeline

* for open\_scan: scan files (signed\_url may be omitted until completed)

### **GET** 

### **/api/app/compliance**

Returns compliance status and grace countdown. 

Response 200:

```
{
  "compliance": {
    "compliance_status": "pending_review",
    "compliance_required_at": "iso",
    "grace_expires_at": "iso",
    "days_remaining": 12,
    "is_restricted": false,
    "required_docs": ["photo_id", "proof_of_address"],
    "documents": [
      { "document_id": "uuid", "type": "photo_id", "status": "uploaded", "uploaded_at": "iso" }
    ]
  }
}
```

### **POST** 

### **/api/app/compliance/documents/init**

Creates a doc placeholder and returns a signed upload URL.

Body:

```
{ "type": "photo_id", "content_type": "application/pdf", "size_bytes": 12345 }
```

Validation: formats and 10 MB max. 

Response 200:

```
{
  "document_id": "uuid",
  "upload_url": "string",
  "upload_headers": { "Content-Type": "application/pdf" }
}
```

### **POST** 

### **/api/app/compliance/documents/{document\_id}/complete**

Marks upload complete and available for review.

### **POST** 

### **/api/app/compliance/submit**

Guards:

* must have all required docs uploaded. 

   Effects:

* set status to pending\_review

* notify operator staff and email receipt to customer. 

Response 200:

```
{ "compliance_status": "pending_review" }
```

---

## **6.3 Admin (operator tooling)**

Applicable roles: operator\_staff, operator\_admin

### **POST** 

### **/api/admin/mail-items**

Creates a mail item intake record (scanner workflow). 

Body:

```
{
  "location_id": "uuid",
  "mailbox_id": "uuid",
  "scanned_at": "iso",
  "scanned_by": { "user_id": "uuid", "email": "string" },
  "client_scan_id": "string",
  "envelope_image": { "file_id": "uuid", "storage_key": "string" },
  "ocr_raw_text": "string"
}
```

Response 201:

```
{ "mail_item_id": "uuid" }
```

### **GET** 

### **/api/admin/mail-items**

Filters per the earlier list (location, mailbox, date range, has\_open\_request, etc.). 

### **GET** 

### **/api/admin/mail-items/{mail\_item\_id}**

Includes related requests and attachments. 

### **GET** 

### **/api/admin/mailboxes**

Lists mailboxes with compliance status. 

### **POST** 

### **/api/admin/mailboxes**

Creates mailbox and sets compliance clock start. (Now: 30 days). 

### **GET** 

### **/api/admin/mailboxes/{mailbox\_id}**

### **POST** 

### **/api/admin/mailboxes/{mailbox\_id}/invite**

Invites mailbox\_manager. 

### **GET** 

### **/api/admin/requests**

Queues and filters. 

### **GET** 

### **/api/admin/requests/{request\_id}**

### **POST** 

### **/api/admin/requests/{request\_id}/status**

Body:

```
{
  "new_status": "in_progress",
  "note_internal": "string",
  "completion": {
    "carrier": "usps",
    "tracking_number": "string",
    "label_file_id": "uuid",
    "scan_file_ids": ["uuid"]
  }
}
```

Validation uses the completion requirements in section 3.4. 

### **GET** 

### **/api/admin/compliance**

Lists compliance cases. 

### **GET** 

### **/api/admin/compliance/{mailbox\_id}**

### **POST** 

### **/api/admin/compliance/{mailbox\_id}/approve**

Auth: operator\_admin by default. 

### **POST** 

### **/api/admin/compliance/{mailbox\_id}/reject**

Body:

```
{ "reason_code": "illegible", "reason_text": "string" }
```

Auth: operator\_admin. 

---

## **7\) Must-pass invariants (QA checklist)**

1. Host maps operator, unknown Host \=\> 404\. 

2. Token operator mismatch \=\> 403 on every non-platform endpoint. 

3. Member cannot access records outside token.company\_ids. 

4. One active request per mail item \=\> 409\. 

5. After grace expiry and not approved: member cannot POST /api/app/requests but can access /api/app/compliance and submit docs. 

---

