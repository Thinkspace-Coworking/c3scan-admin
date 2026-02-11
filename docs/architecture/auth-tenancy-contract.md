Below is the **Operator-scoped Auth \+ Tenancy Isolation Contract** you can hand to Ava (and QA) as a “build exactly this” spec. It’s written to make cross-operator and cross-company leakage structurally difficult.

Small note: some of the files you uploaded earlier have expired on my side, so this contract is based on the decisions you and I already locked in during this chat. If you want me to align wording to a specific spec paragraph, re-upload that file and I’ll reconcile.

---

# **Operator-scoped Auth \+ Tenancy Isolation Contract (c3scan)**

## **0\) Purpose**

Guarantee strict multi-tenancy so that:

* A coworking **operator** can access only their operator’s data.

* A **member / company** can access only their company’s mail and related records.

* Operator staff can view mail across locations within their operator (with filters), as permitted.

* c3scan platform admins can view across operators, but only through a separate, auditable surface.

This contract is the source of truth for:

* Auth flows

* Token claims

* API authorization rules

* Database row security intent

* Storage access controls

* Must-pass negative tests

---

## **1\) Core decisions (non-negotiable)**

### **1.1 Operator context is derived from hostname**

Operator context is determined solely by the **request Host** header.

Examples:

* c3scan.thinkspace.com maps to Thinkspace operator\_id

* c3scan.25ncoworking.com maps to 25N operator\_id

* c3scan.blankspaces.com maps to Blankspaces operator\_id

If an operator does not have a domain, the fallback is an operator-scoped host under c3scan.io, for example:

* \<operator\_slug\>.c3scan.io (still operator-scoped, no operator picker)

**Hard rule:** the web portal never determines operator context from the user’s email domain.

### **1.2 No unified inbox across operators**

A user can belong to multiple operators, but:

* a session is scoped to one operator at a time

* there is no cross-operator combined inbox

* switching operator requires using that operator’s hostname and obtaining a token for that operator

### **1.3 Mailbox ownership is immutable**

A mailbox belongs to exactly one company and does not change ownership.

If a mailbox number is reassigned later in real life, it is modeled as a **new mailbox record** (new mailbox\_id), preserving history.

### **1.4 Staff are cross-location within operator**

Operator staff are not location-locked at login. They can view across locations within the operator using a filter/toggle, but their authorization remains operator-scoped, and may be location-scoped if the role requires it.

### **1.5 No passwords stored by c3scan**

Authentication uses:

* OIDC with Google (initial)

* optionally OIDC with Microsoft (later)

* optional magic link fallback (email link) for operators without a usable IdP

Magic link is not required every login. It may be used for first login, recovery, or step-up actions.

---

## **2\) Terminology and identity model**

### **2.1 Tenancy spine**

All tenant data traces back to:

* operator\_id (top tenant boundary)

* location\_id (sub-tenant boundary)

* company\_id (member boundary)

* mailbox\_id (immutable mailbox boundary)

### **2.2 Roles**

Minimum roles:

* platform\_admin (c3scan internal, cross-operator)

* operator\_admin (operator-scoped, can see all operator locations)

* operator\_staff (operator-scoped, can see allowed locations, default is all)

* member\_user (operator-scoped, limited to allowed companies)

* mailbox\_manager (member\_user plus management rights)

* authorized\_member (optional; either no portal access, or read-only within company)

---

## **3\) Authentication and session model**

### **3.1 Operator resolution**

On every request, server resolves operator\_id from hostname.

If hostname is unknown or unconfigured: return 404 (or a generic “not found”).

### **3.2 Membership requirement**

Authentication proves identity. Authorization requires membership:

* A user may authenticate successfully, but still be denied if they are not linked to an allowed company or staff role for the operator resolved from hostname.

### **3.3 Token scope**

Every access token is scoped to exactly one operator:

* token.operator\_id must equal the operator\_id derived from hostname

* tokens must never contain multiple operator\_ids

### **3.4 Session persistence**

Web:

* use refresh tokens in httpOnly cookies (recommended)

* access token short TTL (for example 60 minutes)

* refresh token longer TTL (for example 30 days), with rotation

Mobile scanner flows can follow similar refresh patterns, but web portal must remain operator-by-hostname.

---

## **4\) JWT claims contract**

### **4.1 Required claims**

All tokens:

* sub (user\_id)

* operator\_id

* role

* iat, exp, jti

Staff tokens:

* all\_locations boolean

* location\_ids array

  * If all\_locations=true, location\_ids may be empty

  * If all\_locations=false, location\_ids must be non-empty

Member tokens:

* company\_ids array for that operator

### **4.2 Claim issuance rules**

* Claims are minted server-side after auth callback.

* Claims are derived from server membership tables, not from user input.

* Claims must be re-computed on refresh to reflect role changes.

---

## **5\) API authorization rules**

### **5.1 Namespace separation**

* /api/platform/\* reserved for platform\_admin only

* /api/admin/\* reserved for operator\_admin and operator\_staff

* /api/app/\* reserved for member roles (member\_user, mailbox\_manager, authorized\_member)

### **5.2 Operator scoping rule**

For all non-platform endpoints:

* server resolves operator\_id from hostname

* server requires token.operator\_id to match hostname operator\_id

* any operator\_id in request params is ignored or validated strictly

If mismatch:

* return 403 (do not leak other operator existence)

### **5.3 Object access rule**

When fetching by object id (/mail-items/{id} etc.):

* query must always include operator\_id \= token.operator\_id

* if not found under operator scope, return 404

### **5.4 Member access rule**

Members can access records only when:

* record.operator\_id equals token.operator\_id

* record.company\_id is in token.company\_ids

  * For mail items, this means mail\_item.company\_id must be populated and immutable for access decisions.

### **5.5 Staff access rule**

Operator staff can access records only when:

* record.operator\_id equals token.operator\_id

* and either:

  * token.all\_locations is true, or

  * record.location\_id is in token.location\_ids

Operator admin typically has all\_locations true.

### **5.6 Platform admin access rule**

Platform admins can access cross-operator data only via /api/platform/\*.

All access must be audited (see audit section).

---

## **6\) Database row security intent**

This is written as intent so it can be implemented via Postgres RLS in Supabase or equivalent.

### **6.1 Tables requiring tenant scoping**

Any table containing tenant data must include:

* operator\_id (required)

Tables that are location-specific must include:

* location\_id

Tables that are member-scoped must include:

* company\_id

This includes: mail\_items, mailboxes, companies, requests, request\_events, compliance records, alias records, and all attachment metadata.

### **6.2 Deny by default**

Enable RLS and start from deny-all, then add minimal policies.

### **6.3 RLS policy intent**

Member select:

* allow select where operator\_id equals token.operator\_id

* and company\_id is in token.company\_ids

Staff select:

* allow select where operator\_id equals token.operator\_id

* and (all\_locations true or location\_id in token.location\_ids)

Writes:

* inserts and updates must enforce operator\_id equals token.operator\_id

* members cannot insert or update staff-owned tables (mail intake, admin notes, fulfillment logs)

### **6.4 Service role usage**

If any privileged key is used:

* it must never be available to client apps

* it must be restricted to server-only use

* platform admin functions must be separate endpoints

---

## **7\) Storage and signed URL policy**

### **7.1 Private objects only**

All envelope images, interior scans, compliance docs are stored as private objects.

### **7.2 Path convention**

Object keys must embed operator and location boundaries, for example:

* operator/\<operator\_id\>/location/\<location\_id\>/mail\_item/\<mail\_item\_id\>/...

### **7.3 Signed URL issuance**

Signed URLs:

* must be short TTL

* must only be issued after the server confirms the user can read the underlying row

* must be logged as an audit event (who requested, what object, when)

---

## **8\) Audit and monitoring**

### **8.1 Minimum audit events**

Log at least:

* mail item created

* request created

* request status changed

* compliance submitted

* compliance approved or rejected

* signed URL issued for interior scans and compliance docs

* platform admin cross-operator access

### **8.2 Platform admin audit**

Every platform admin read of tenant data must log:

* platform\_admin user\_id

* operator\_id accessed

* object type and object id

* timestamp

* reason code (free text optional)

---

## **9\) Must-pass negative tests (QA gate)**

These tests must pass before launch:

### **9.1 Cross-operator isolation**

* Operator A staff cannot list or fetch mail items belonging to Operator B

* Member under Operator A cannot access anything under Operator B

* Signed URL issuance fails for objects outside operator scope

### **9.2 Cross-company isolation**

* Member of Company A cannot list or fetch mail items for Company B within the same operator

* Member cannot create a request for a mail item not owned by their company

### **9.3 Location scoping behavior**

* Staff with limited location\_ids cannot access other locations

* Staff with all\_locations true can access all locations within operator

* Location filter toggles do not change permissions, only presentation

### **9.4 Object fetch safety**

* Fetch by id returns 404 for out-of-scope objects

* No endpoint returns data when operator\_id mismatches hostname

---

## **10\) Implementation notes for Ava**

1. Treat hostname operator resolution as middleware that runs before routing.

2. Ensure every DB query includes operator scope, even on joins.

3. Ensure endpoints that generate signed URLs validate row authorization first.

4. Keep platform admin endpoints separate and noisy in logs.

---

## **11\) Open items and safe defaults**

These are not blockers but should be documented:

1. Document types required for compliance (enum list).

2. Session TTL defaults (access token and refresh token durations).

3. Whether authorized members have portal access or are compliance-only roster entries.

---

If you want, I can also produce a one-page “Permissions Matrix” table (role by action, per resource) that QA can use as a checklist.

