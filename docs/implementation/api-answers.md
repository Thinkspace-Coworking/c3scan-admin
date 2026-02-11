---

## **First, the non-negotiable security model (Ava should implement this verbatim)**

1. **Operator is determined by the request host (subdomain), not by email domain.**

    Example: c3scan.thinkspace.com maps to Thinkspace operator\_id. No unified inbox across operators.

2. **Any operator\_id passed in query/body must match the operator resolved from host** (or is ignored and server injects the correct one). If mismatch: 403\.

3. **JWT must carry at least:**

   * operator\_id

   * role ∈ {member, operator\_staff, operator\_admin, c3scan\_admin}

   * allowed\_company\_ids (members) OR allowed\_location\_ids (staff/admin).

      Staff can be “all locations” within operator.

4. **Data access rules:**

   * Member can only read mail-items, mailboxes, requests, compliance for their allowed\_company\_ids within operator\_id.

   * Operator staff can read all mail within operator\_id (filterable by location).

   * c3scan\_admin can read across all operators.

This aligns with your requirement: “operator only sees their stuff, member/company only sees their stuff.”

---

## **Your CX/auth answers, clarified (so Ava codes the right flow)**

* You’re choosing **Option 2: operator-specific subdomain routing** (no operator chooser).

* Members using @gmail.com or @outlook.com is totally fine. **Auth (Google OAuth) is not the same as authorization.** They can authenticate with Google, then you authorize them only if they are invited/linked to a mailbox/company in *that operator*.

The existing mobile spec references resolving operator via email domain for employees. That’s fine for scanner staff, but for the web portal you want host-based operator resolution. 

---

# **Ava’s WebAPI questions answered (by endpoint)**

## **API \#1:** 

## **POST /api/admin/mail-items**

##  **(Admin Mail Upload)**

1. **Authentication:** Required. operator\_staff or operator\_admin only. Never public.

2. **Required Fields (minimum):**

   * location\_id, mailbox\_id

   * scanned\_at, scanned\_by\_user\_id or scanned\_by\_email

   * envelope\_image (prefer storage\_path)

      In the mobile contract, upload requires operator\_id, location\_id, mailbox\_id, scanned\_by\_email, envelope\_image, ocr\_raw\_text, scanned\_at. 

3. **Operator scoping:** operator\_id comes from subdomain; reject mismatches.

4. **Image handling:** Use signed upload URLs, then store storage\_path in mail\_items. 

5. **PMB formatting:** Store PMB as **string**. Preserve leading zeros for display, but enforce uniqueness using a normalized version (strip spaces, uppercase, trim leading zeros for compare).

6. **Duplicate handling:** Support idempotency via client\_scan\_id (or header Idempotency-Key). Mail schema already anticipates client\_scan\_id and duplicate flags. 

7. **Response:** 201 with mail\_item id; optionally 202 if you stage async.

8. **OCR fields:** Store ocr\_raw\_text, ocr\_confidence, and “match metadata” when available.

9. **Permissions:** Staff can upload only inside their operator.

10. **Audit:** Always log created\_by, device, timestamp.

## **API \#2:** 

## **GET /api/admin/mail-items**

##  **(List Mail with Filters)**

1. **Default sort:** Newest first (scanned\_at DESC).

2. **Filters supported:** location\_id, mailbox\_id, company\_id, date range, request\_status, request\_type, carrier, tracking\_number, “has\_open\_request”.

3. **Search:** by recipient/alias/company name, PMB, tracking, OCR snippet.

4. **Pagination:** Cursor pagination preferred (stable with filters), else limit/offset.

5. **Fields returned:** enough for table view (thumb image url, mailbox, company, scanned\_at, status, latest\_request).

6. **Security:** auto-scope to operator.

7. **Staff cross-location:** yes, but filterable.

8. **Performance:** index on (operator\_id, scanned\_at), (operator\_id, location\_id), (operator\_id, mailbox\_id).

## **API \#3:** 

## **GET /api/admin/mail-items/{id}**

##  **(Mail Detail)**

1. **Detail view shows:** envelope image, mailbox \+ company, scan metadata, OCR block, status.

2. **Request timeline:** created, in\_progress, completed, canceled events.

3. **Include related:** requests, audit log entries, attachments (open-scan results).

4. **Edits allowed:** operator\_admin can reassign mailbox\_id (with audit).

5. **Security:** operator scoped.

6. **Not found vs forbidden:** 404 if not in operator scope.

## **API \#4:** 

## **GET /api/admin/mailboxes**

##  **(List Mailboxes)**

1. **Default sort:** PMB ascending (numeric sort on normalized PMB), then mailbox name.

2. **Filters:** location\_id, company\_id, status (active/closed), search (PMB/name/company).

3. **Return fields:** mailbox\_id, PMB, mailbox\_name, company\_name, compliance\_status.

4. **Security:** operator scoped.

5. **Pagination:** yes.

6. **Include counts:** optional (mail volume, open requests) but can be separate endpoint if heavy.

## **API \#5:** 

## **POST /api/admin/mailboxes**

##  **(Create Mailbox)**

1. **Required fields:** location\_id, company\_id, PMB, mailbox\_name, mailbox\_manager (or create pending manager).

2. **PMB uniqueness:** unique within (operator\_id, location\_id).

3. **Compliance:** default status not\_submitted and start grace countdown (Decision: 30 days is common).

4. **Ownership:** mailbox belongs to exactly one company and never changes (you confirmed this).

5. **Auth:** operator\_admin only.

6. **Audit:** created\_by, created\_at.

## **API \#6:** 

## **GET /api/admin/mailboxes/{id}**

##  **(Mailbox Detail)**

1. **Detail shows:** company info, PMB, status, compliance status, managers/authorized members.

2. **Manager management:** add/remove authorized members. Removal should not delete historical mail linkage.

3. **Mail history preview:** last N mail items, open requests.

4. **Security:** operator scoped.

5. **Edits allowed:** name, status, forwarding defaults (admin only).

6. **Compliance section:** documents list \+ status.

## **API \#7:** 

## **POST /api/admin/mailboxes/{id}/invite**

##  **(Invite Manager)**

1. **Input:** email \+ full legal name (recommended). Phone optional.

2. **Invitation flow:** creates a pending user-company relationship scoped to operator+company+mailbox.

3. **Delivery:** email invite link on that operator’s subdomain.

4. **Expiration:** 7 days default.

5. **If user exists:** attach membership if same email; do not merge across operators.

6. **Auth:** operator\_admin.

## **API \#8:** 

## **GET /api/admin/requests**

##  **(List Requests)**

1. **Dashboard cards:** yes, counts by request type and status.

2. **Tabs:** Pending, In Progress, Completed, Canceled.

3. **Filters:** location\_id, request\_type, status, date range, mailbox/company search.

4. **Sorting:** oldest pending first (priority queue), otherwise newest.

5. **Return fields:** request\_id, mail\_item\_id, type, status, submitted\_at, SLA age, company/mailbox.

6. **Security:** operator scoped.

7. **Assignment:** optional fields assigned\_to\_user\_id.

## **API \#9:** 

## **GET /api/admin/requests/{id}**

##  **(Request Detail)**

1. **Different views by type:** yes, but share common header.

2. **Common elements:** mail item preview, requester, instructions, status timeline.

3. **Forwarding:** show destination address \+ shipping method.

4. **Open & Scan:** show uploaded scan files/thumbnails.

5. **Shred/Recycle:** show confirmation and who completed.

6. **Security:** operator scoped.

7. **Audit:** include all status changes.

## **API \#10:** 

## **POST /api/admin/requests/{id}/status**

##  **(Update Request Status)**

1. **Valid transitions:**

   * pending → in\_progress → completed

   * pending → canceled

   * in\_progress → canceled

2. **Completion requirements by type:**

   * Forward: carrier \+ tracking\_number (and optional label image)

   * Open & Scan: uploaded scan file(s)

   * Shred/Recycle: completion confirmation

3. **Idempotency:** if same status update repeated, return 200\.

4. **Auth:** operator\_staff+.

5. **Audit:** status\_changed\_by, timestamp, notes.

## **API \#11:** 

## **GET /api/admin/compliance**

##  **(List Compliance Cases)**

1. **Tabs:** Not Submitted, Pending Review, Approved, Rejected, Expired.

2. **Columns:** mailbox/company, status, submitted\_at, last\_updated, deadline.

3. **Filters:** location\_id, status, search.

4. **Sort:** pending review first.

5. **Security:** operator scoped.

## **API \#12:** 

## **GET /api/admin/compliance/{mailbox\_id}**

##  **(Compliance Detail)**

1. **Header:** company \+ mailbox \+ PMB \+ status.

2. **Summary metrics:** required docs count, missing docs, deadline.

3. **Documents list:** type, uploaded\_at, filename, preview link.

4. **Actions:** approve/reject with notes.

5. **Security:** operator scoped.

## **API \#13:** 

## **POST /api/admin/compliance/{mailbox\_id}/approve**

##  **(Approve Compliance)**

1. **Requirements:** all required docs present, legible, not expired.

2. **On approval:** set compliance\_status=approved, record approved\_by/at.

3. **Auth:** operator\_admin (staff can review but approval should be admin).

## **API \#14:** 

## **POST /api/admin/compliance/{mailbox\_id}/reject**

##  **(Reject Compliance)**

1. **Rejection reason:** required (enum \+ free text).

2. **On rejection:** status=rejected, notify member, keep docs for history.

3. **Auth:** operator\_admin.

## **API \#15:** 

## **GET /api/admin/billing/invoices**

##  **(List Invoices)**

1. **Columns:** invoice\_id, company, amount, status, period, due\_date, paid\_at.

2. **Filters:** company\_id, status, date range.

3. **Security:** operator scoped (unless c3scan\_admin).

## **API \#16:** 

## **GET /api/admin/settings**

##  **(Get Operator Settings)**

1. **Categories:** branding, retention policy, image upload limits, notification rules, integrations.

2. **Tenant isolation:** yes. Always scoped to operator from subdomain.

## **API \#17:** 

## **POST /api/admin/settings**

##  **(Update Settings)**

1. **Partial updates:** yes (PATCH semantics even if POST).

2. **Validation:** strict schema, reject unknown keys.

3. **Auth:** operator\_admin only.

## **API \#18:** 

## **POST /api/admin/integrations/{type}**

##  **(Update Integration Config)**

1. **Supported types:** start with yardi, stripe (Decision: confirm list).

2. **Sensitive data:** encrypt at rest, never return full secrets (mask).

3. **Test connection:** recommended endpoint or inline test=true.

4. **Auth:** operator\_admin.

---

## **API \#19:** 

## **POST /api/app/requests**

##  **(Customer Create Request)**

1. **Request types:** forward, open\_scan, shred, recycle, pickup (Decision: confirm pickup).

2. **One active request per mail item:** Yes. If already pending/in\_progress, return 409\.

3. **Forwarding address:** reference saved address\_id; allow ad-hoc entry if needed.

4. **Auth:** member only, scoped to their company/mail item.

5. **Audit:** requester identity, timestamp.

## **API \#20:** 

## **GET /api/app/mail-items**

##  **(Customer Inbox)**

1. **Default filter:** show active (not archived) and newest first.

2. **Archive toggle:** yes, include archived when requested.

3. **Filters:** date range, status, search, “has requests”.

4. **Pagination:** yes.

5. **Security:** member scoped to allowed\_company\_ids.

## **API \#21:** 

## **GET /api/app/mail-items/{id}**

##  **(Customer Mail Detail)**

1. **Images:** envelope image always; label image optional.

2. **Actions:** create request buttons allowed depending on compliance status.

3. **Show request status:** timeline and current state.

4. **Security:** member scope.

5. **Not found:** 404 on cross-tenant.

## **API \#22:** 

## **GET /api/app/compliance**

##  **(Customer Compliance Status)**

1. **Status display:** not\_submitted, pending\_review, approved, rejected, expired.

2. **Grace period countdown:** yes, show “days remaining”.

3. **Security:** member scope.

## **API \#23:** 

## **POST /api/app/compliance/documents**

##  **(Upload Compliance Doc)**

1. **Document types:** ID front/back, proof of address, USPS form (Decision: exact list).

2. **Validation:** file type (pdf/jpg/png), max size, virus scan optional.

3. **Upload mechanism:** use signed URL pattern (same concept as images). 

## **API \#24:** 

## **POST /api/app/compliance/submit**

##  **(Submit for Review)**

1. **Requirements before submit:** all required docs uploaded.

2. **On submit:** status → pending\_review; notify operator staff.

---

## **API \#25:** 

## **GET /api/auth/detect-provider**

##  **(Email → Operator → OIDC Config)**

Given your subdomain decision, I would change this slightly:

1. **Input:** optional email (for UI convenience). Operator comes from host.

2. **Output:** operator branding \+ enabled auth providers (google now), and any policies.

3. **No email → operator lookup** for web portal. Prevents leakage and avoids the “gmail domain” problem.

(For employee scanner app, operator-by-email-domain can still exist if you want. The mobile spec currently does that for employees.  )

## **API \#26:** 

## **GET /api/auth/oidc/{provider}**

##  **(Initiate OIDC Flow)**

1. **State parameter:** yes, required.

2. **PKCE:** yes, recommended (especially if any mobile browser-based flow).

3. **Provider:** google first; add microsoft later.

## **API \#27:** 

## **GET /api/auth/callback**

##  **(Handle OIDC Callback)**

1. **Exchange code:** yes.

2. **ID token validation:** yes (issuer, aud, exp, nonce/state).

3. **User provisioning:** create user if new, then attach to operator membership if invited.

4. **Mint JWT:** include operator\_id \+ role \+ allowed scopes.

5. **Session:** set refresh token cookie or return refresh token (Decision: cookie is safer for web).

6. **Redirect:** back to operator subdomain app route.

## **API \#28:** 

## **POST /api/auth/refresh**

##  **(Refresh JWT Token)**

1. **Refresh lifetime:** 30 days default (Decision), access token 60 minutes.

2. **Rotation:** yes, rotate refresh token each use.

3. **Revocation:** support logout to revoke refresh tokens.

(There is also a refresh flow in the mobile spec.  )

---

# **Quick verdict: will Ava be able to code accurately from this?**

**Yes, if you give her:**

1. the “non-negotiable security model” at the top, and

2. the “operator is derived from subdomain” rule, and

3. the explicit member-vs-staff scope rules.

If you want, I can turn the above into a tight **“Operator-scoped Auth \+ Tenancy Isolation Contract”** that’s only 1–2 pages long and written like a checklist for SWE \+ QA (claims, endpoint guards, and must-pass tests).

