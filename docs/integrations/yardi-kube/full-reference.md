# Yardi Kube Public API (V1) — Endpoint Reference

## Source of truth
- Swagger (JSON): `https://102222cente.yardikube.com/publicapi/V1/swagger`

## Base URL
- `https://102222cente.yardikube.com/publicapi`

## Authentication
### Authorization Token
- Type: `apiKey`
- Location: `header`
- Header name: `Authorization`

JWT Authorization header using the Bearer scheme.

Example: "Authorization: Bearer {token}"

A valid JWT authorization token may be obtained by making a POST request to the AuthenticationToken endpoint and providing your Yardi Kube API key.

## API groups (tags)
- [Activity](#activity) (17 endpoints)
- [Amenity](#amenity) (2 endpoints)
- [AuthenticationToken](#authenticationtoken) (1 endpoints)
- [Booking](#booking) (5 endpoints)
- [BookingDiscountGroup](#bookingdiscountgroup) (2 endpoints)
- [Company](#company) (5 endpoints)
- [CompanyUserType](#companyusertype) (2 endpoints)
- [Contact](#contact) (7 endpoints)
- [Contract](#contract) (4 endpoints)
- [Country](#country) (1 endpoints)
- [Deposit](#deposit) (2 endpoints)
- [Event](#event) (11 endpoints)
- [Industry](#industry) (2 endpoints)
- [InternalUser](#internaluser) (2 endpoints)
- [InvoiceDetail](#invoicedetail) (2 endpoints)
- [Lead](#lead) (7 endpoints)
- [LeadSource](#leadsource) (5 endpoints)
- [LeadStatus](#leadstatus) (5 endpoints)
- [MasterSetup](#mastersetup) (5 endpoints)
- [Member](#member) (8 endpoints)
- [MyAccount](#myaccount) (19 endpoints)
- [Property](#property) (6 endpoints)
- [Refund](#refund) (2 endpoints)
- [Space](#space) (13 endpoints)
- [SpaceType](#spacetype) (2 endpoints)
- [Support](#support) (16 endpoints)
- [Voice](#voice) (7 endpoints)
- [Webhook](#webhook) (4 endpoints)

## Activity

### GET `/api/v1/activity/activities`
**Summary:** Retrieves a list of ActivityActivities records.
- OperationId: `Activity_GetApiV1ActivityActivities`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `ObjectType` | `query` | Y | `string enum[Company, Contact, Member, Lead, Deal]` | ObjectType of retrieved list. |
| `ObjectId` | `query` | Y | `integer(int64)` | Unique ID of ObjectType. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfActivityActivities` | Successfully fetched Activity record list. |
| 204 |  | No matching Activity records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/activity/activities`
**Summary:** Creates a new Activity Activities record.
- OperationId: `Activity_PostActivitiesAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `activityActivities` | `body` | Y | `ActivityActivities` | activityActivities that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `ActivityActivities` | Activity record was created successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/activities/{id}`
**Summary:** Retrieves an ActivityActivities record based on ID.
- OperationId: `Activity_GetActivitiesAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityActivities` | Successfully fetched Activity record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/activity/activities/{id}`
**Summary:** Updates an ActivityActivities record based on ID.
- OperationId: `Activity_PutActivitiesAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `activityActivities` | `body` | Y | `ActivityActivities` | activityActivities that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityEvents` | Activity record updated successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/events`
**Summary:** Retrieves a list of ActivityEvents records.
- OperationId: `Activity_GetApiV1ActivityEvents`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `ObjectType` | `query` | Y | `string enum[Company, Contact, Member, Lead, Deal]` | ObjectType of retrieved list. |
| `ObjectId` | `query` | Y | `integer(int64)` | Unique ID of ObjectType. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfActivityEvents` | Successfully fetched Activity record list. |
| 204 |  | No matching Activity records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/activity/events`
**Summary:** Creates a new ActivityEvents record.
- OperationId: `Activity_PostEventsAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `activityEvents` | `body` | Y | `ActivityEvents` | activityEvents that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `ActivityEvents` | Activity record was created successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/events/{id}`
**Summary:** Retrieves an ActivityEvents record based on ID.
- OperationId: `Activity_GetEventsAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityEvents` | Successfully fetched Activity record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/activity/events/{id}`
**Summary:** Updates an ActivityEvents record based on ID.
- OperationId: `Activity_PutEventsAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `activityEvents` | `body` | Y | `ActivityEvents` | activityEvents that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityEvents` | Activity record updated successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/notes`
**Summary:** Retrieves a list of ActivityNotes records.
- OperationId: `Activity_GetApiV1ActivityNotes`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `ObjectType` | `query` | Y | `string enum[Company, Contact, Member, Lead, Deal]` | ObjectType of retrieved list. |
| `ObjectId` | `query` | Y | `integer(int64)` | Unique ID of ObjectType. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfActivityNotes` | Successfully fetched Activity record list. |
| 204 |  | No matching Activity records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/activity/notes`
**Summary:** Creates a new ActivityNotes record.
- OperationId: `Activity_PostNotesAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `activityNotes` | `body` | Y | `ActivityNotes` | activityNotes that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `ActivityNotes` | Activity record was created successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/notes/{id}`
**Summary:** Retrieves an ActivityNotes record based on ID.
- OperationId: `Activity_GetNotesAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityNotes` | Successfully fetched Activity record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/activity/notes/{id}`
**Summary:** Updates an ActivityNotes record based on ID.
- OperationId: `Activity_PutNotesAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `activityNotes` | `body` | Y | `ActivityNotes` | activityNotes that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityNotes` | Activity record updated successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/tours`
**Summary:** Retrieves a list of ActivityTours records.
- OperationId: `Activity_GetApiV1ActivityTours`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `ObjectType` | `query` | Y | `string enum[Company, Contact, Member, Lead, Deal]` | ObjectType of retrieved list. |
| `ObjectId` | `query` | Y | `integer(int64)` | Unique ID of ObjectType. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfActivityTours` | Successfully fetched Activity record list. |
| 204 |  | No matching Activity records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/activity/tours`
**Summary:** Creates a new ActivityTours record.
- OperationId: `Activity_PostToursAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `activityTours` | `body` | Y | `ActivityTours` | activityTours that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `ActivityTours` | Activity record was created successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/activity/tours/{id}`
**Summary:** Archives an ActivityTours record based on ID.
- OperationId: `Activity_DeleteToursAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Activity record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/activity/tours/{id}`
**Summary:** Retrieves an ActivityTours record based on ID.
- OperationId: `Activity_GetToursAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityTours` | Successfully fetched Activity record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/activity/tours/{id}`
**Summary:** Updates an ActivityTours record based on ID.
- OperationId: `Activity_PutToursAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `activityTours` | `body` | Y | `ActivityTours` | activityTours that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ActivityTours` | Activity record updated successfully. |
| 400 |  | Invalid Activity record. |
| 401 |  | Request authorization failed. |
| 404 |  | Activity record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Amenity

### GET `/api/v1/amenities/getpropertyamenitylist/{propertyid}`
**Summary:** Retrieves a list of Amenity records.
- OperationId: `Amenity_GetPropertyAmenityList`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `propertyid` | `path` | Y | `integer(int64)` |  |
| `pageSize` | `query` | N | `integer(int32) default=100` |  |
| `pageNo` | `query` | N | `integer(int32) default=1` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfAmenity` | Successfully fetched Amenity record list. |
| 204 |  | No matching Amenity records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/amenities/{id}`
**Summary:** Retrieves an Amenity record based on ID.
- OperationId: `Amenity_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Amenity` | Successfully fetched Amenity record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Amenity record not found. |
| 500 |  | An error occured while processing the request. |


## AuthenticationToken

### POST `/api/v1/authenticationtoken`
**Summary:** Generates a JWT authentication token used to authenticate requests.
- OperationId: `AuthenticationToken_PostAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `authenticationToken` | `body` | Y | `AuthenticationToken` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `AuthenticationToken` | AuthenticationToken record was created successfully. |
| 400 |  | Invalid AuthenticationToken record. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Booking

### GET `/api/v1/bookings`
**Summary:** Retrieves a list of Booking records.
- OperationId: `Booking_GetApiV1Bookings`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `FromDate` | `query` | Y | `string(date-time)` | FromDate to filter results on (YYYY-MM-DD hh:mm). Displays entries greater than or equal to date provided but less than "ToDate." |
| `ToDate` | `query` | Y | `string(date-time)` | ToDate to filter results on (YYYY-MM-DD hh:mm). Displays entries less than or equal to date provided but greater than "FromDate." |
| `pageSize` | `query` | N | `integer(int32) default=100` | Booking records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Booking page number. |
| `PropertyId` | `query` | N | `integer(int64)` | Property ID to filter results on. |
| `SpaceId` | `query` | N | `integer(int64)` | Space ID to filter results on. |
| `SpaceTypeId` | `query` | N | `integer(int64)` | Space Type ID to filter results on. |
| `MemberId` | `query` | N | `integer(int64)` | Member ID to filter results on. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfBooking` | Successfully fetched Booking record list. |
| 204 |  | No matching Booking records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/bookings`
**Summary:** Creates a new Booking record.
- OperationId: `Booking_PostAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `booking` | `body` | Y | `Booking` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Booking` | Booking record was created successfully. |
| 400 |  | Invalid Booking record. |
| 401 |  | Request authorization failed. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/bookings/{id}`
**Summary:** Cancels a Booking record based on ID.
- OperationId: `Booking_DeleteAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Booking ID used to cancel the Booking. |
| `ApplyCancellationFee` | `query` | N | `boolean default=True` | Flag to indicate if a cancellation fee should be deducted from the booking refund. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `BookingRefund` | Booking record was cancelled successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Booking record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/bookings/{id}`
**Summary:** Retrieves a Booking record based on ID.
- OperationId: `Booking_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Booking ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Booking` | Successfully fetched Booking record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Booking record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/bookings/{id}`
**Summary:** Updates a Booking record based on ID.
- OperationId: `Booking_PutAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `booking` | `body` | Y | `Booking` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Booking` | Booking record updated successfully. |
| 400 |  | Invalid Booking record. |
| 401 |  | Request authorization failed. |
| 404 |  | Booking record not found. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |


## BookingDiscountGroup

### GET `/api/v1/bookingdiscountgroup`
**Summary:** Retrieves a list of BookingDiscountGroup records.
- OperationId: `BookingDiscountGroup_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfBookingDiscountGroup` | Successfully fetched BookingDiscountGroup record list. |
| 204 |  | No matching BookingDiscountGroup records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/bookingdiscountgroup/{id}`
**Summary:** Retrieves a BookingDiscountGroup record based on ID.
- OperationId: `BookingDiscountGroup_GetApiV1BookingdiscountgroupById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `BookingDiscountGroup` | Successfully fetched BookingDiscountGroup record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | BookingDiscountGroup record not found. |
| 500 |  | An error occured while processing the request. |


## Company

### GET `/api/v1/companies`
**Summary:** Retrieves a list of Company records.
- OperationId: `Company_GetApiV1Companies`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `pageSize` | `query` | N | `integer(int32) default=100` | Company records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Company page number. |
| `showArchived` | `query` | N | `boolean default=False` | Return archived records. |
| `legalEntityId` | `query` | N | `string default=0` | Return records for legal entities. For multiple legal entites separate id's with a comma. |
| `primaryPropertyId` | `query` | N | `string default=0` | Return records for primary properties.For multiple legal entites separate id's with a comma. |
| `creationDateFrom` | `query` | N | `string default=` | Return records created on or after this date. |
| `creationDateTo` | `query` | N | `string default=` | Return records created on or before this date. |
| `lastModifiedDateFrom` | `query` | N | `string default=` | Return records modifed on or after this date. |
| `lastModifiedDateTo` | `query` | N | `string default=` | Return records modified on or before this date. |
| `createdOrModifiedDateFrom` | `query` | N | `string default=` | Return records created or modifed on or after this date. |
| `createdOrModifiedDateTo` | `query` | N | `string default=` | Return records created or modified on or before this date. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfCompany` | Successfully fetched Company record list. |
| 204 |  | No matching Company records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/companies`
**Summary:** Creates a new Company record.
- OperationId: `Company_PostAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `company` | `body` | Y | `Company` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Company` | Company record was created successfully. |
| 400 |  | Invalid Company record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/companies/{id}`
**Summary:** Archives a Company record based on ID.
- OperationId: `Company_DeleteAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Company record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Company record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/companies/{id}`
**Summary:** Retrieves a Company record based on ID.
- OperationId: `Company_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Company` | Successfully fetched Company record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Company record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/companies/{id}`
**Summary:** Updates a Company record based on ID.
- OperationId: `Company_PutAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `company` | `body` | Y | `Company` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Company` | Company record updated successfully. |
| 400 |  | Invalid Company record. |
| 401 |  | Request authorization failed. |
| 404 |  | Company record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## CompanyUserType

### GET `/api/v1/companyusertypes`
**Summary:** Retrieves a list of CompanyUserType records.
- OperationId: `CompanyUserType_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfCompanyUserType` | Successfully fetched CompanyUserType record list. |
| 204 |  | No matching CompanyUserType records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/companyusertypes/{id}`
**Summary:** Retrieves a CompanyUserType record based on ID.
- OperationId: `CompanyUserType_GetApiV1CompanyusertypesById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `CompanyUserType` | Successfully fetched CompanyUserType record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | CompanyUserType record not found. |
| 500 |  | An error occured while processing the request. |


## Contact

### GET `/api/v1/contacts`
**Summary:** Retrieves a list of Contact records.
- OperationId: `Contact_GetApiV1Contacts`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `parentId` | `query` | N | `integer(int64)` | Parent ID to filter results on. |
| `companyId` | `query` | N | `integer(int64)` | Company ID to filter results on. |
| `email` | `query` | N | `string` | Email to filter results on. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Contact records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Contact page number. |
| `showArchived` | `query` | N | `boolean default=False` | Return archived records. |
| `DateCreated` | `query` | N | `string(date-time)` | DateCreated to filter results on (YYYY-MM-DD). Displays entries greater than or equal to date provided. |
| `DateLastModified` | `query` | N | `string(date-time)` | DateLastModified to filter results on (YYYY-MM-DD). Displays entries greater than or equal to date provided. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfContact` | Successfully fetched Contact record list. |
| 204 |  | No matching Contact records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/contacts`
**Summary:** Creates a new Contact record.
- OperationId: `Contact_Post`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `contact` | `body` | Y | `Contact` | Contact that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Contact` | Contact record was created successfully. |
| 400 |  | Invalid Contact record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/contacts/companycontact`
**Summary:** Creates a new Contact record and a new Company record for the Contact.
- OperationId: `Contact_SaveContactCompanyData`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyContact` | `body` | Y | `CompanyContact` | The Contact and Company details that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `CompanyContact` | Contact record was created successfully. |
| 400 |  | Invalid Contact record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/contacts/{id}`
**Summary:** Archives a Contact record based on ID.
- OperationId: `Contact_Delete`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Contact ID used to delete the Contact. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Contact record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Contact record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/contacts/{id}`
**Summary:** Retrieves a Contact record based on ID.
- OperationId: `Contact_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Contact` | Successfully fetched Contact record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Contact record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/contacts/{id}`
**Summary:** Updates a Contact record based on ID.
- OperationId: `Contact_Put`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Contact ID used to update the Contact. |
| `contact` | `body` | Y | `Contact` | Contact data that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Contact` | Contact record updated successfully. |
| 400 |  | Invalid Contact record. |
| 401 |  | Request authorization failed. |
| 404 |  | Contact record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/contacts/{id}/convert`
**Summary:** Converts a Contact to Lead or Member based on ID.
- OperationId: `Contact_PutApiV1ContactsByIdConvert`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Contact ID used to convert the Contact. |
| `convertTo` | `query` | Y | `string enum[Lead, Member]` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Contact record updated successfully. |
| 204 |  | Contact record converted successfully. |
| 400 |  | Invalid Contact record. |
| 401 |  | Request authorization failed. |
| 404 |  | Contact record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Contract

### GET `/api/v1/contracts`
**Summary:** Retrieves a list of Contract records.
- OperationId: `Contract_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `propertyId` | `query` | Y | `integer(int64)` |  |
| `companyId` | `query` | N | `integer(int64)` |  |
| `pageSize` | `query` | N | `integer(int32) default=100` | Contract records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Contract page number. |
| `showArchived` | `query` | N | `boolean default=False` | Return archived records. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfContract` | Successfully fetched Contract record list. |
| 204 |  | No matching Contract records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/contracts`
**Summary:** Creates a new Contract record.
- OperationId: `Contract_Post`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `contract` | `body` | Y | `Contract` | Contract that will be saved as in progress. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Contract` | Contract record was created successfully. |
| 400 |  | Invalid Contract record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/contracts/{id}`
**Summary:** Retrieves a Contract record based on ID.
- OperationId: `Contract_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `proposalStatus` | `query` | N | `string` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Contract` | Successfully fetched Contract record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Contract record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/contracts/{id}`
**Summary:** Updates a Contract record based on ID.
- OperationId: `Contract_PutAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Contract ID used to update the Contract. |
| `contract` | `body` | Y | `Contract` | Contract data that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Contract` | Contract record updated successfully. |
| 400 |  | Invalid Contract record. |
| 401 |  | Request authorization failed. |
| 404 |  | Contract record not found. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |


## Country

### GET `/api/v1/country`
**Summary:** Retrieves a list of Country records.
- OperationId: `Country_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfCountry` | Successfully fetched Country record list. |
| 204 |  | No matching Country records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |


## Deposit

### GET `/api/v1/deposits`
**Summary:** Retrieves a list of Deposit records.
- OperationId: `Deposit_GetApiV1Deposits`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyId` | `query` | N | `integer(int64)` | Company ID to filter results on. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Payment records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Payment page number. |
| `legalEntityId` | `query` | N | `string default=0` | Return records for legal entities. For multiple legal entites separate id's with a comma. |
| `propertyId` | `query` | N | `string default=0` | Return records for primary properties. For multiple properties separate id's with a comma. |
| `creationDateFrom` | `query` | N | `string default=` | Return records created on or after this date. |
| `creationDateTo` | `query` | N | `string default=` | Return records created on or before this date. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfDeposit` | Successfully fetched Deposit record list. |
| 204 |  | No matching Deposit records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/deposits/{id}`
**Summary:** Retrieves a Deposit record based on ID.
- OperationId: `Deposit_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Deposit` | Successfully fetched Deposit record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Deposit record not found. |
| 500 |  | An error occured while processing the request. |


## Event

### GET `/api/v1/events`
**Summary:** Retrieves a list of Event records.
- OperationId: `Event_GetApiV1Events`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `PropertyId` | `query` | Y | `integer(int64)` | Property Id |
| `pageSize` | `query` | N | `integer(int32) default=100` | Event records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Event page number. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfEvent` | Successfully fetched Event record list. |
| 204 |  | No matching Event records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/events/{id}`
**Summary:** Retrieves an Event record based on ID.
- OperationId: `Event_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Event` | Successfully fetched Event record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Event record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/events/{id}/EventPhoto`
**Summary:** Retrieves an Event record based on ID.
- OperationId: `Event_EventPhoto`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Successfully fetched Event record. |
| 400 |  | Unable to process request. |
| 404 |  | Event record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/events/{id}/discussion`
**Summary:** Retrieves a list of Event discussion.
- OperationId: `Event_GetDiscussionAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<EventDiscussion>` | Successfully fetched Event discussion list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Event discussion record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/events/{id}/discussion`
**Summary:** Creates a new Event discussion record.
- OperationId: `Event_PostDiscussionAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `eventDiscussion` | `body` | Y | `EventDiscussion` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `EventDiscussion` | Event discussion record was created successfully. |
| 400 |  | Invalid Event discussion record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/events/{id}/discussion/{discussionid}`
**Summary:** Archives a Event discussion record based on Event ID,Discussion ID.
- OperationId: `Event_DeleteDiscussionAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `discussionid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Event discussion record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Event discussion record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/events/{id}/discussion/{discussionid}/reply`
**Summary:** Retrieves a list of Event discussion reply.
- OperationId: `Event_GetDiscussionReplyAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `discussionid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<EventDiscussion>` | Successfully fetched Event discussion reply list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Event discussion reply record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/events/{id}/discussion/{discussionid}/reply`
**Summary:** Creates a new Event discussion reply record.
- OperationId: `Event_PostDiscussionReplyAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `discussionid` | `path` | Y | `integer(int64)` |  |
| `eventDiscussion` | `body` | Y | `EventDiscussion` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `EventDiscussion` | Event discussion reply record was created successfully. |
| 400 |  | Invalid Event discussion reply record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/events/{id}/guestlist`
**Summary:** Retrieves a list of Event guest.
- OperationId: `Event_GetGuestListAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<EventGuestList>` | Successfully fetched Event guest list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Event guest record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/events/{id}/rsvp`
**Summary:** Creates a new Event rsvp record.
- OperationId: `Event_PostRsvpAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `eventRsvp` | `body` | Y | `EventRsvp` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `integer(int64)` | Event rsvp record was created successfully. |
| 400 |  | Invalid Event rsvp record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/events/{id}/rsvp/{rsvpid}`
**Summary:** Update a Event rsvp record.
- OperationId: `Event_PutRsvpAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `rsvpid` | `path` | Y | `integer(int64)` |  |
| `eventRsvp` | `body` | Y | `EventRsvp` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `integer(int64)` | Event rsvp record was updated successfully. |
| 400 |  | Invalid Event rsvp record. |
| 401 |  | Request authorization failed. |
| 404 |  | Event record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Industry

### GET `/api/v1/industries`
**Summary:** Retrieves a list of Industry records.
- OperationId: `Industry_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfIndustry` | Successfully fetched Industry record list. |
| 204 |  | No matching Industry records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/industries/{id}`
**Summary:** Retrieves an Industry record based on ID.
- OperationId: `Industry_GetApiV1IndustriesById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Industry` | Successfully fetched Industry record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Industry record not found. |
| 500 |  | An error occured while processing the request. |


## InternalUser

### GET `/api/v1/internaluser`
**Summary:** Retrieves a list of InternalUser records.
- OperationId: `InternalUser_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfInternalUser` | Successfully fetched InternalUser record list. |
| 204 |  | No matching InternalUser records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/internaluser/{id}`
**Summary:** Retrieves an InternalUser record based on ID.
- OperationId: `InternalUser_GetApiV1InternaluserById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `InternalUser` | Successfully fetched InternalUser record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | InternalUser record not found. |
| 500 |  | An error occured while processing the request. |


## InvoiceDetail

### GET `/api/v1/invoicedetails`
**Summary:** Retrieves a list of InvoiceDetail records.
- OperationId: `InvoiceDetail_GetApiV1Invoicedetails`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyId` | `query` | N | `integer(int64)` | Company ID to filter results on. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Payment records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Payment page number. |
| `legalEntityId` | `query` | N | `string default=0` | Return records for legal entities. For multiple legal entites separate id's with a comma. |
| `propertyId` | `query` | N | `string default=0` | Return records for primary properties. For multiple properties separate id's with a comma. |
| `creationDateFrom` | `query` | N | `string default=` | Return records created on or after this date. |
| `creationDateTo` | `query` | N | `string default=` | Return records created on or before this date. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfInvoiceDetail` | Successfully fetched InvoiceDetail record list. |
| 204 |  | No matching InvoiceDetail records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/invoicedetails/{id}`
**Summary:** Retrieves an InvoiceDetail record based on ID.
- OperationId: `InvoiceDetail_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `InvoiceDetail` | Successfully fetched InvoiceDetail record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | InvoiceDetail record not found. |
| 500 |  | An error occured while processing the request. |


## Lead

### GET `/api/v1/leads`
**Summary:** Retrieves a list of Lead records.
- OperationId: `Lead_GetApiV1Leads`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `parentId` | `query` | N | `integer(int64)` | Parent ID to filter results on. |
| `companyId` | `query` | N | `integer(int64)` | Company ID to filter results on. |
| `email` | `query` | N | `string` | Email to filter results on. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Lead records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Lead page number. |
| `showArchived` | `query` | N | `boolean default=False` | Return archived records. |
| `DateCreated` | `query` | N | `string(date-time)` | DateCreated to filter results on (YYYY-MM-DD). Displays entries greater than or equal to date provided. |
| `DateLastModified` | `query` | N | `string(date-time)` | DateLastModified to filter results on (YYYY-MM-DD). Displays entries greater than or equal to date provided. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfLead` | Successfully fetched Lead record list. |
| 204 |  | No matching Lead records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/leads`
**Summary:** Creates a new Lead record.
- OperationId: `Lead_Post`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `lead` | `body` | Y | `Lead` | Lead that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Lead` | Lead record was created successfully. |
| 400 |  | Invalid Lead record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/leads/companylead`
**Summary:** Creates a new Lead record and a new Company record for the Lead.
- OperationId: `Lead_SaveLeadCompanyData`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyLead` | `body` | Y | `CompanyLead` | The Lead and Company details that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `CompanyLead` | Lead record was created successfully. |
| 400 |  | Invalid Lead record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/leads/{id}`
**Summary:** Archives a Lead record based on ID.
- OperationId: `Lead_Delete`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Lead ID used to delete the Lead. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Lead record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Lead record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leads/{id}`
**Summary:** Retrieves a Lead record based on ID.
- OperationId: `Lead_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Lead` | Successfully fetched Lead record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Lead record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/leads/{id}`
**Summary:** Updates a Lead record based on ID.
- OperationId: `Lead_Put`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Lead ID used to update the Lead. |
| `lead` | `body` | Y | `Lead` | Lead data that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Lead` | Lead record updated successfully. |
| 400 |  | Invalid Lead record. |
| 401 |  | Request authorization failed. |
| 404 |  | Lead record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/leads/{id}/convert`
**Summary:** Converts a Lead to a Member based on ID.
- OperationId: `Lead_PutApiV1LeadsByIdConvert`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | Lead ID used to convert the Lead. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Lead record updated successfully. |
| 204 |  | Lead record converted successfully. |
| 400 |  | Invalid Lead record. |
| 401 |  | Request authorization failed. |
| 404 |  | Lead record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## LeadSource

### GET `/api/v1/leadsources`
**Summary:** Retrieves a list of LeadSource records.
- OperationId: `LeadSource_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfLeadSource` | Successfully fetched LeadSource record list. |
| 204 |  | No matching LeadSource records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadsources/minor`
**Summary:** Retrieves a list of LeadSource and minor records.
- OperationId: `LeadSource_GetApiV1LeadsourcesMinor`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `name` | `query` | N | `string` | Filters records using LeadSource (major) or minor name. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfLeadSourceMinor` | Successfully fetched LeadSource record list. |
| 204 |  | No matching LeadSource records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadsources/{id}`
**Summary:** Retrieves a LeadSource record based on ID.
- OperationId: `LeadSource_GetApiV1LeadsourcesById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | LeadSource (major) ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `LeadSource` | Successfully fetched LeadSource record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | LeadSource record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadsources/{id}/minor`
**Summary:** Retrieves a list of LeadSource records based on a parent LeadSource ID.
- OperationId: `LeadSource_GetMinor`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | LeadSource (major) ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfLeadSource` | Successfully fetched LeadSource record list. |
| 204 |  | No matching LeadSource records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadsources/{id}/minor/{minorId}`
**Summary:** Retrieves a LeadSource record based on ID.
- OperationId: `LeadSource_GetApiV1LeadsourcesByIdMinorByMinorId`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | LeadSource (major) ID. |
| `minorId` | `path` | Y | `integer(int64)` | Minor ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `LeadSource` | Successfully fetched LeadSource record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | LeadSource record not found. |
| 500 |  | An error occured while processing the request. |


## LeadStatus

### GET `/api/v1/leadstatus`
**Summary:** Retrieves a list of LeadStatus records.
- OperationId: `LeadStatus_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfLeadStatus` | Successfully fetched LeadStatus record list. |
| 204 |  | No matching LeadStatus records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadstatus/leadstatuschangereason`
**Summary:** Retrieves a list of LeadStatus and LeadStatusChangeReason records.
- OperationId: `LeadStatus_GetLeadStatusChangeReasonData`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `name` | `query` | N | `string` | Filters records using LeadStatus or LeadStatusChangeReason name. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfLeadStatusChangeReason` | Successfully fetched LeadStatus record list. |
| 204 |  | No matching LeadStatus records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadstatus/{id}`
**Summary:** Retrieves a LeadStatus record based on ID.
- OperationId: `LeadStatus_GetById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | LeadStatus ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `LeadStatus` | Successfully fetched LeadStatus record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | LeadStatus record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadstatus/{id}/leadstatuschangereason`
**Summary:** Retrieves a list of LeadStatusChangeReason records based on a parent LeadStatus ID.
- OperationId: `LeadStatus_GetLeadStatusChangeReason`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | LeadStatus ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfLeadStatus` | Successfully fetched LeadStatus record list. |
| 204 |  | No matching LeadStatus records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/leadstatus/{id}/leadstatuschangereason/{changeReasonId}`
**Summary:** Retrieves a list of LeadStatusChangeReason records based on a parent LeadStatus ID.
- OperationId: `LeadStatus_GetLeadStatusChangeReasonById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` | LeadStatus ID. |
| `changeReasonId` | `path` | Y | `integer(int64)` | LeadStatusChangeReason ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `LeadStatus` | Successfully fetched LeadStatus record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | LeadStatus record not found. |
| 500 |  | An error occured while processing the request. |


## MasterSetup

### GET `/api/v1/masterSetup`
**Summary:** Retrieves a list of MasterSetup records.
- OperationId: `MasterSetup_GetApiV1MasterSetup`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `Type` | `query` | Y | `string enum[Brand, Territory, Market, Region]` | Master Setup Property Type. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfMasterSetup` | Successfully fetched MasterSetup record list. |
| 204 |  | No matching MasterSetup records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/masterSetup/child`
**Summary:** Retrieves a list of Property MasterSetup and child records.
- OperationId: `MasterSetup_GetApiV1MasterSetupChild`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `Type` | `query` | Y | `string enum[Brand, Territory, Market, Region]` | Master Setup Property Type. |
| `name` | `query` | N | `string` | Filters Property records using MasterSetup (parent) or child name. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfMasterSetupMinor` | Successfully fetched MasterSetup record list. |
| 204 |  | No matching MasterSetup records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/masterSetup/{id}`
**Summary:** Retrieves a MasterSetup record based on ID.
- OperationId: `MasterSetup_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | MasterSetup (parent) ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `MasterSetup` | Successfully fetched MasterSetup record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | MasterSetup record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/masterSetup/{id}/child`
**Summary:** Retrieves a list of MasterSetup records based on a parent MasterSetup ID.
- OperationId: `MasterSetup_GetChild`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | MasterSetup (parent) ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfMasterSetup` | Successfully fetched MasterSetup record list. |
| 204 |  | No matching MasterSetup records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/masterSetup/{id}/child/{childId}`
**Summary:** Retrieves a MasterSetup record based on ID.
- OperationId: `MasterSetup_GetApiV1MasterSetupByIdChildByChildId`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | MasterSetup (parent) ID. |
| `childId` | `path` | Y | `integer(int64)` | Child ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `MasterSetup` | Successfully fetched MasterSetup record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | MasterSetup record not found. |
| 500 |  | An error occured while processing the request. |


## Member

### GET `/api/v1/members`
**Summary:** Retrieves a list of Member records.
- OperationId: `Member_GetApiV1Members`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `parentId` | `query` | N | `integer(int64)` | Parent ID to filter results on. |
| `companyId` | `query` | N | `integer(int64)` | Company ID to filter results on. |
| `email` | `query` | N | `string` | Email to filter results on. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Member records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Member page number. |
| `showArchived` | `query` | N | `boolean default=False` | Return archived records. |
| `DateCreated` | `query` | N | `string(date-time)` | DateCreated to filter results on (YYYY-MM-DD). Displays entries greater than or equal to date provided. |
| `DateLastModified` | `query` | N | `string(date-time)` | DateLastModified to filter results on (YYYY-MM-DD). Displays entries greater than or equal to date provided. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfMember` | Successfully fetched Member record list. |
| 204 |  | No matching Member records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/members`
**Summary:** Creates a new Member record.
- OperationId: `Member_Post`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `member` | `body` | Y | `Member` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Member` | Member record was created successfully. |
| 400 |  | Invalid Member record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/members/companymember`
**Summary:** Creates a new Member record and a new Company record for the Member.
- OperationId: `Member_SaveMemberCompanyData`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyMember` | `body` | Y | `CompanyMember` | The Member and Company details that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `CompanyMember` | Member record was created successfully. |
| 400 |  | Invalid Member record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/members/getmemberinfo/{pmuserexid}`
**Summary:** Retrieves a Member record based on ID.
- OperationId: `Member_GetUserInfoByPmUserId`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `pmuserexid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `MemberInfo` | Successfully fetched Member record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Member record not found. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/members/{id}`
**Summary:** Archives a Member record based on ID.
- OperationId: `Member_Delete`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Member ID used to delete the Member. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Member record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Member record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/members/{id}`
**Summary:** Retrieves a Member record based on ID.
- OperationId: `Member_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Member` | Successfully fetched Member record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Member record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/members/{id}`
**Summary:** Updates a Member record based on ID.
- OperationId: `Member_Put`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Member ID used to update the Member. |
| `member` | `body` | Y | `Member` | Member data that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Member` | Member record updated successfully. |
| 400 |  | Invalid Member record. |
| 401 |  | Request authorization failed. |
| 404 |  | Member record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/members/{id}/convert`
**Summary:** Converts a Member to a Lead based on ID.
- OperationId: `Member_PutApiV1MembersByIdConvert`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Member ID used to convert the Member. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Member record updated successfully. |
| 204 |  | Member record converted successfully. |
| 400 |  | Invalid Member record. |
| 401 |  | Request authorization failed. |
| 404 |  | Member record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## MyAccount

### POST `/api/v1/myaccount/addnewbankaccount`
**Summary:** Add new bank account.
- OperationId: `MyAccount_addNewBankAccount`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `accounttype` | `query` | Y | `string enum[Saving, Checking]` | Account Type |
| `bankAccModel` | `body` | Y | `BankAccountModel` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `object` | Invoice record was created successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/myaccount/addnewcard`
**Summary:** Retrieves a card url for Member.
- OperationId: `MyAccount_addNewCard`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `redirecturl` | `query` | Y | `string` | Redirect URL |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `object` | Invoice record was created successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/myaccount/addnewdirectdebitaccount`
**Summary:** Retrieves a direct debit account url for Member.
- OperationId: `MyAccount_addNewDirectDebitAccount`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `redirecturl` | `query` | Y | `string` | Redirect URL |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `object` | Invoice record was created successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/myaccount/deletebankaccount`
**Summary:** Delete bank account
- OperationId: `MyAccount_deleteBankAccount`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `accountid` | `query` | Y | `integer(int64)` | Account Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Invoice record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/myaccount/deletecreditdebitcard`
**Summary:** Delete credit card.
- OperationId: `MyAccount_deletecreditdebitcard`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `accountid` | `query` | Y | `integer(int64)` | Account Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Invoice record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/myaccount/deletedirectdebitaccount`
**Summary:** Delete direct debit account.
- OperationId: `MyAccount_deleteDirectDebitAccount`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `accountid` | `query` | Y | `integer(int64)` | Account Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Invoice record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/downloadledger`
**Summary:** Donwload Company Ledger PDF.
- OperationId: `MyAccount_DownloadLedger`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `MemberId` | `query` | Y | `integer(int64)` | Member Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 |  | Company Ledger PDF file download |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Company Ledger PDF record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/downloadreceipt`
**Summary:** Download Payment Receipt PDF.
- OperationId: `MyAccount_DownloadReceipt`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `receiptid` | `query` | Y | `integer(int64)` | Receipt Id - Ex: 600001234 |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 |  | Receipt PDF file download |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Receipt PDF record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/myaccount/editbankaccount`
**Summary:** Edit bank account.
- OperationId: `MyAccount_editBankAccount`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberId` | `query` | Y | `integer(int64)` |  |
| `accountid` | `query` | Y | `integer(int64)` | Account Id |
| `accounttype` | `query` | Y | `string enum[Saving, Checking]` | Account Type |
| `bankAccModel` | `body` | Y | `BankAccountModel` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Invoice record updated successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/myaccount/editcard`
**Summary:** Edit debit credit card details.
- OperationId: `MyAccount_editCard`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `redirecturl` | `query` | Y | `string` | Redirect URL |
| `accountid` | `query` | Y | `integer(int64)` | Account Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Invoice record updated successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/getpaymenthistory`
**Summary:** Payment history of paid invoices.
- OperationId: `MyAccount_GetPaymentHistory`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `MemberId` | `query` | N | `integer(int64)` |  |
| `pageSize` | `query` | N | `integer(int32) default=100` |  |
| `pageNo` | `query` | N | `integer(int32) default=1` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfReceiptModel` | Successfully fetched Invoice record list. |
| 204 |  | No matching Invoice records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/getpaymentmethods/{memberid}`
**Summary:** Get all available payment methods of member.
- OperationId: `MyAccount_getAllCards`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `path` | Y | `integer(int64)` | Member Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfCardModel` | Successfully fetched Invoice record list. |
| 204 |  | No matching Invoice records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/getpendingcharges`
**Summary:** Pending charges list.
- OperationId: `MyAccount_GetPendingCharges`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `MemberId` | `query` | N | `integer(int64)` |  |
| `pageSize` | `query` | N | `integer(int32) default=100` |  |
| `pageNo` | `query` | N | `integer(int32) default=1` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfChargeModel` | Successfully fetched Invoice record list. |
| 204 |  | No matching Invoice records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/getsecuritydepositonfile`
**Summary:** Get Company Security Deposit of File
- OperationId: `MyAccount_getsecuritydepositonfile`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyid` | `query` | Y | `integer(int64)` | Company Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Successfully fetched Invoice record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/invoices`
**Summary:** Retrieves all invoices.
- OperationId: `MyAccount_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `pageSize` | `query` | N | `integer(int32) default=100` |  |
| `pageNo` | `query` | N | `integer(int32) default=1` |  |
| `MemberId` | `query` | N | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfInvoice` | Successfully fetched Invoice record list. |
| 204 |  | No matching Invoice records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/myaccount/outstandinginvoices/{memberId}`
**Summary:** Retrieves Outstanding Invoice Amount based on Member Id.
- OperationId: `MyAccount_GetOutStandingInvoice`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberId` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `number(double)` | Successfully fetched Invoice record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Invoice record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/myaccount/payment`
**Summary:** Payment of unpaid invoices based on member id and invoice id.
- OperationId: `MyAccount_invoicePayment`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `invoiceid` | `query` | Y | `string` | Add invoice ids with comma (,) seprated |
| `accountid` | `query` | Y | `integer(int64)` | Add cardid from which payment will be done |
| `paymenttype` | `query` | Y | `string enum[Credit, Debit, ACH, DirectDebit]` |  |
| `propertyid` | `query` | Y | `integer(int64)` | Add Property Id |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `object` | Invoice record was created successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/myaccount/setautopayonoff`
**Summary:** Set Auto Pay On/Off
- OperationId: `MyAccount_setautopayonoff`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `autopaystatus` | `query` | Y | `string enum[Off, On]` | Auto Pay Status |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `object` | Invoice record was created successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/myaccount/setdefaultpaymentmethod`
**Summary:** Set Default Payment Method
- OperationId: `MyAccount_setdefaultpaymentmethod`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `memberid` | `query` | Y | `integer(int64)` | Member Id |
| `accountid` | `query` | Y | `integer(int64)` | Account Id |
| `paymentmethodtype` | `query` | Y | `string enum[Credit, Debit, ACH, DirectDebit]` | Type of payment methods |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `object` | Invoice record was created successfully. |
| 400 |  | Invalid Invoice record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Property

### GET `/api/v1/properties`
**Summary:** Retrieves a list of Property records.
- OperationId: `Property_GetApiV1Properties`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `Radius` | `query` | N | `number(double)` | Radius in miles |
| `Latitude` | `query` | N | `number(double)` | Latitude |
| `Longitude` | `query` | N | `number(double)` | Longitude |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfProperty` | Successfully fetched Property record list. |
| 204 |  | No matching Property records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/properties`
**Summary:** Creates a new Property record.
- OperationId: `Property_PostAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `propertyData` | `body` | Y | `PostProperty` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `PostProperty` | Property record was created successfully. |
| 400 |  | Invalid Property record. |
| 401 |  | Request authorization failed. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/properties/propertyimage`
**Summary:** Creates a new PropertyImages record based on ID
- OperationId: `Property_PostPropertyImage`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `propertyImageData` | `body` | Y | `PostPropertyImage` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `PostPropertyImage` | Property record was created successfully. |
| 400 |  | Invalid Property record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/properties/{id}`
**Summary:** Retrieves a Property record based on ID.
- OperationId: `Property_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Property` | Successfully fetched Property record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Property record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/properties/{id}`
**Summary:** Updates a Property record based on ID.
- OperationId: `Property_PutAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `propertyData` | `body` | Y | `PostProperty` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Property` | Property record updated successfully. |
| 400 |  | Invalid Property record. |
| 401 |  | Request authorization failed. |
| 404 |  | Property record not found. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/properties/{id}/{imageid}`
**Summary:** Delete a PropertyImage record based on ID.
- OperationId: `Property_Delete`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `imageid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Property record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Property record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Refund

### GET `/api/v1/refunds`
**Summary:** Retrieves a list of Refund records.
- OperationId: `Refund_GetApiV1Refunds`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `companyId` | `query` | N | `integer(int64)` | Company ID to filter results on. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Payment records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Payment page number. |
| `legalEntityId` | `query` | N | `string default=0` | Return records for legal entities. For multiple legal entites separate id's with a comma. |
| `propertyId` | `query` | N | `string default=0` | Return records for primary properties. For multiple properties separate id's with a comma. |
| `creationDateFrom` | `query` | N | `string default=` | Return records created on or after this date. |
| `creationDateTo` | `query` | N | `string default=` | Return records created on or before this date. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfRefund` | Successfully fetched Refund record list. |
| 204 |  | No matching Refund records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/refunds/{id}`
**Summary:** Retrieves a Refund record based on ID.
- OperationId: `Refund_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Refund` | Successfully fetched Refund record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Refund record not found. |
| 500 |  | An error occured while processing the request. |


## Space

### GET `/api/v1/spaces`
**Summary:** Retrieves a list of Space records.
- OperationId: `Space_GetApiV1Spaces`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `pageSize` | `query` | N | `integer(int32) default=100` |  |
| `pageNo` | `query` | N | `integer(int32) default=1` |  |
| `PropertyId` | `query` | N | `integer(int64)` |  |
| `SpaceTypeId` | `query` | N | `integer(int64)` |  |
| `SpaceTypeIds` | `query` | N | `string default=` |  |
| `MemberId` | `query` | N | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfSpace` | Successfully fetched Space record list. |
| 204 |  | No matching Space records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/spaces`
**Summary:** Creates a new Space record.
- OperationId: `Space_CreateSpace`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `spaceData` | `body` | Y | `PostSpace` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Space` | Space record was created successfully. |
| 400 |  | Invalid Space record. |
| 401 |  | Request authorization failed. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/amenities`
**Summary:** Retrieves a list of Space records.
- OperationId: `Space_GetApiV1SpacesAmenities`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `pageSize` | `query` | N | `integer(int32) default=100` | Number of per page records are requested. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Page number is requested. |
| `PropertyId` | `query` | N | `integer(int64)` | Property ID. |
| `SpaceTypeId` | `query` | N | `integer(int64)` | Space Type ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfSpaceAmenities` | Successfully fetched Space record list. |
| 204 |  | No matching Space records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/availability`
**Summary:** Retrieves a list of Space records.
- OperationId: `Space_GetApiV1SpacesAvailability`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `StartDatetime` | `query` | Y | `string(date-time)` | Space availability from date(YYYY-MM-DD hh:mm). |
| `EndDatetime` | `query` | Y | `string(date-time)` | Space availability to date(YYYY-MM-DD hh:mm). |
| `BookingType` | `query` | Y | `string enum[Hourly, Daily, Monthly]` | Space availability for booking type. |
| `PropertyId` | `query` | N | `integer(int64)` | Property ID. |
| `SpaceTypeId` | `query` | N | `integer(int64)` | Space Type ID. |
| `pageSize` | `query` | N | `integer(int32) default=100` | Number of per page records are requested. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Page number is requested. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfSpaceAvailability` | Successfully fetched Space record list. |
| 204 |  | No matching Space records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/pricing`
**Summary:** Retrieves a list of Space records.
- OperationId: `Space_GetApiV1SpacesPricing`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `pageSize` | `query` | N | `integer(int32) default=100` | Number of per page records are requested. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Page number is requested. |
| `PropertyId` | `query` | N | `integer(int64)` | Property ID. |
| `SpaceTypeId` | `query` | N | `integer(int64)` | Space Type ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfSpacePricing` | Successfully fetched Space record list. |
| 204 |  | No matching Space records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/spaces/spaceimage`
**Summary:** Creates a new SpaceImages record based on ID.
- OperationId: `Space_PostSpaceImage`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `spaceImageData` | `body` | Y | `PostSpaceImage` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `PostSpaceImage` | Space record was created successfully. |
| 400 |  | Invalid Space record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/{id}`
**Summary:** Retrieves a Space record based on ID.
- OperationId: `Space_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `memberId` | `query` | N | `integer(int64) default=0` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Space` | Successfully fetched Space record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/spaces/{id}`
**Summary:** Updates a Space record based on ID.
- OperationId: `Space_EditSpace`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `spaceData` | `body` | Y | `PostSpace` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Space` | Space record updated successfully. |
| 400 |  | Invalid Space record. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 409 |  | Request failed to pass validation. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/{id}/amenities`
**Summary:** Retrieves a Amenities of Space records based on a Space ID.
- OperationId: `Space_GetAmenitiesAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Space ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `SpaceAmenities` | Successfully fetched Space record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/{id}/availability`
**Summary:** Retrieves a Space availability based on a Space ID.
- OperationId: `Space_GetAvailabilityAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Space ID. |
| `StartDatetime` | `query` | Y | `string(date-time)` | Space availability from date(YYYY-MM-DD hh:mm). |
| `EndDatetime` | `query` | Y | `string(date-time)` | Space availability to date(YYYY-MM-DD hh:mm). |
| `BookingType` | `query` | Y | `string enum[Hourly, Daily, Monthly]` | Space availability for booking type. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `SpaceAvailability` | Successfully fetched Space record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/{id}/isavailable`
**Summary:** Check space availability based on given Space ID.
- OperationId: `Space_GetIsAvailabilityAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Space ID. |
| `StartDatetime` | `query` | Y | `string(date-time)` | Space availability from date(YYYY-MM-DD hh:mm). |
| `EndDatetime` | `query` | Y | `string(date-time)` | Space availability to date(YYYY-MM-DD hh:mm). |
| `BookingType` | `query` | Y | `string enum[Hourly, Daily, Monthly]` | Space availability for booking type. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `boolean` | Successfully fetched Space record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 409 | `string` | The space is not available at the selected time. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spaces/{id}/pricing`
**Summary:** Retrieves a Price of Space records based on a Space ID.
- OperationId: `Space_GetPricingAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Space ID. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `SpacePricing` | Successfully fetched Space record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/spaces/{id}/{imageid}`
**Summary:** Delete a SpaceImage record based on ID.
- OperationId: `Space_Delete`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `imageid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Space record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Space record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## SpaceType

### GET `/api/v1/spacetypes`
**Summary:** Retrieves a list of SpaceType records.
- OperationId: `SpaceType_Get`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfSpaceType` | Successfully fetched SpaceType record list. |
| 204 |  | No matching SpaceType records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/spacetypes/{id}`
**Summary:** Retrieves a SpaceType record based on ID.
- OperationId: `SpaceType_GetApiV1SpacetypesById`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `SpaceType` | Successfully fetched SpaceType record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | SpaceType record not found. |
| 500 |  | An error occured while processing the request. |


## Support

### GET `/api/v1/support`
**Summary:** Retrieves a list of Support records.
- OperationId: `Support_GetApiV1Support`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `PropertyId` | `query` | Y | `integer(int64)` | Property Id |
| `SupportTicketStatus` | `query` | Y | `string enum[Open, Close]` | Support Ticket Status |
| `SearchTickets` | `query` | N | `string default=` | Search Tickets |
| `pageSize` | `query` | N | `integer(int32) default=100` | Support records per page. |
| `pageNo` | `query` | N | `integer(int32) default=1` | Support page number. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListPageOfSupport` | Successfully fetched Support record list. |
| 204 |  | No matching Support records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/support`
**Summary:** Creates a new Support record.
- OperationId: `Support_PostAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `support` | `body` | Y | `Support` | Support that will be saved. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `Support` | Support record was created successfully. |
| 400 |  | Invalid Support record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/attachment`
**Summary:** Download support attachment based on filename.
- OperationId: `Support_DownloadAttachment`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `filename` | `query` | Y | `string` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 |  | Support attachment download |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support attachment record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/categories`
**Summary:** Retrieves a list of Support categories.
- OperationId: `Support_GetCategoriesAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<SupportCategory>` | Successfully fetched Support categories list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support categories record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/priorities`
**Summary:** Retrieves a list of Support priorities.
- OperationId: `Support_GetPrioritiesAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters:** _None_

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<SupportPriority>` | Successfully fetched Support priorities list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support priorities record not found. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/{id}`
**Summary:** Retrieves a Support record based on ID.
- OperationId: `Support_GetAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Support` | Successfully fetched Support record. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support record not found. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/support/{id}`
**Summary:** Updates a Support record based on ID.
- OperationId: `Support_PutAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` | Support ID used to update the support. |
| `support` | `body` | Y | `Support` | Support data that will be updated. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Support` | Support record updated successfully. |
| 400 |  | Invalid Support record. |
| 401 |  | Request authorization failed. |
| 404 |  | Support record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/{id}/attachments`
**Summary:** Retrieves a list of Support attachments.
- OperationId: `Support_GetAttachmentsAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<SupportAttachments>` | Successfully fetched Support attachments list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support attachments record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/support/{id}/attachments`
**Summary:** Creates a new Support attachment record.
- OperationId: `Support_UploadAttachmentsAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 |  | Support attachment record was created successfully. |
| 400 |  | Invalid Support record. |
| 401 |  | Request authorization failed. |
| 404 |  | Invalid Support attachment record. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/support/{id}/attachments/{attachmentid}`
**Summary:** Archives a Support attachment record based on Support ID and Attachment ID.
- OperationId: `Support_DeleteAttachmentsAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `attachmentid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Support attachment record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support attachment record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/support/{id}/closeticket`
**Summary:** Updates a Support record ticket status as close.
- OperationId: `Support_CloseTicketAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `object` | Support record updated successfully. |
| 400 |  | Invalid Support record. |
| 401 |  | Request authorization failed. |
| 404 |  | Support record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/{id}/discussion`
**Summary:** Retrieves a list of Support discussion.
- OperationId: `Support_GetDiscussionAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<SupportDiscussion>` | Successfully fetched Support discussion list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support discussion record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/support/{id}/discussion`
**Summary:** Creates a new Support discussion record.
- OperationId: `Support_PostDiscussionAsync`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `supportDiscussion` | `body` | Y | `SupportDiscussion` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `integer(int64)` | Support discussion record was created successfully. |
| 400 |  | Invalid Support discussion record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/support/{id}/discussion/{discussionid}`
**Summary:** Archives a Support discussion record based on Support ID and Discussion ID.
- OperationId: `Support_DeleteDiscussionAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `discussionid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Support discussion record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support discussion record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/support/{id}/discussion/{discussionid}/attachments`
**Summary:** Retrieves a list of Support discussion attachments.
- OperationId: `Support_GetDiscussionAttachmentsAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `discussionid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `Array<SupportAttachments>` | Successfully fetched Support discussion attachments list. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Support discussion attachments record not found. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/support/{id}/discussion/{discussionid}/attachments`
**Summary:** Creates a new Support discussion attachment record.
- OperationId: `Support_UploadDiscussionAttachmentsAsync`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int64)` |  |
| `discussionid` | `path` | Y | `integer(int64)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 |  | Support discussion attachment record was created successfully. |
| 400 |  | Invalid Support record. |
| 401 |  | Request authorization failed. |
| 404 |  | Invalid Support discussion attachment record. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Voice

### GET `/api/v1/voice/areacodes`
**Summary:** Retrieves a list of Area Codes for the given City within the Region.
- OperationId: `Voice_GetAreaCode`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |
| `region` | `query` | Y | `string` | Region for the Area Codes. |
| `city` | `query` | Y | `string` | City for the Area Codes. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfString` | Request successful. |
| 204 |  | No matching records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/voice/areacodes/cities`
**Summary:** Retrieves a list of Cities.
- OperationId: `Voice_GetCity`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |
| `region` | `query` | Y | `string` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfString` | Request successful. |
| 204 |  | No matching records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/voice/areacodes/regions`
**Summary:** Retrieves a list of Regions.
- OperationId: `Voice_GetRegions`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfString` | Request successful. |
| 204 |  | No matching records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/voice/phonenumbers/national`
**Summary:** Retrieves a list of National Phone Numbers available for purchase.
- OperationId: `Voice_GetLocalNumbers`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |
| `region` | `query` | Y | `string` | Region for the National Numbers. |
| `city` | `query` | Y | `string` | City for the Area Codes. |
| `areacode` | `query` | Y | `string` | AreaCode for the National Numbers. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfPhoneNumber` | Successfully fetched PhoneNumber record list. |
| 204 |  | No matching PhoneNumber records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/voice/phonenumbers/national`
**Summary:** Places an order for a National Phone Number.
- OperationId: `Voice_PostLocalNumber`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |
| `PhoneNumberPurchase` | `body` | Y | `PhoneNumberPurchase` | National number. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `PhoneNumberPurchase` | PhoneNumber record was created successfully. |
| 400 |  | Invalid PhoneNumber record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### GET `/api/v1/voice/phonenumbers/tollfree`
**Summary:** Retrieves a list of Toll Free Phone Numbers available for purchase.
- OperationId: `Voice_GetTollFreeNumbers`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |
| `prefix` | `query` | N | `string` | Prefix for the Toll Free Numbers. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 | `ListDataOfPhoneNumber` | Successfully fetched PhoneNumber record list. |
| 204 |  | No matching PhoneNumber records found. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 500 |  | An error occured while processing the request. |

### POST `/api/v1/voice/phonenumbers/tollfree`
**Summary:** Places an order for a Toll Free Phone Number.
- OperationId: `Voice_PostTollFree`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `country` | `query` | Y | `string enum[US, CANADA]` |  |
| `PhoneNumberPurchase` | `body` | Y | `PhoneNumberPurchase` | Toll free number. |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 | `PhoneNumberPurchase` | PhoneNumber record was created successfully. |
| 400 |  | Invalid PhoneNumber record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Webhook

### POST `/api/v1/webhook/subscribe`
**Summary:** RESTful service for subscribing to a webhook within Yardi Kube
- OperationId: `Webhook_Subscribe`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `obj` | `body` | Y | `Webhook` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 201 |  | Webhook record created successfully. |
| 400 |  | Invalid webhook record. |
| 401 |  | Request authorization failed. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/webhook/subscribe`
**Summary:** RESTful service for adding a subscription to a webhook within Yardi Kube
- OperationId: `Webhook_EditSubscription`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `obj` | `body` | Y | `Webhook` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 |  | Webhook record updated successfully. |
| 400 |  | Invalid webhook record. |
| 401 |  | Request authorization failed. |
| 404 |  | Webhook record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### PUT `/api/v1/webhook/unsubscribe`
**Summary:** RESTful service for removing a subscription from a webhook within Yardi Kube
- OperationId: `Webhook_UnSubscribe`
- Consumes: `application/json, text/json, text/html, application/xml, text/xml, application/x-www-form-urlencoded`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `obj` | `body` | Y | `Webhook` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 200 |  | Webhook record updated successfully. |
| 400 |  | Invalid webhook record. |
| 401 |  | Request authorization failed. |
| 404 |  | Webhook record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |

### DELETE `/api/v1/webhook/{id}`
**Summary:** RESTful service for deleting a webhook within Yardi Kube
- OperationId: `Webhook_DeleteWebhook`
- Produces: `application/json, text/json, text/html, application/xml, text/xml`

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---:|---|---|
| `id` | `path` | Y | `integer(int32)` |  |

**Responses**

| Status | Schema | Description |
|---:|---|---|
| 204 |  | Webhook record was archived successfully. |
| 400 |  | Unable to process request. |
| 401 |  | Request authorization failed. |
| 404 |  | Webhook record not found. |
| 409 |  | A conflict occurred while processing the request. |
| 500 |  | An error occured while processing the request. |


## Models (Schemas)

Total: **121** definitions.

- [ActivityActivities](#model-activityactivities)
- [ActivityEvents](#model-activityevents)
- [ActivityNotes](#model-activitynotes)
- [ActivityTours](#model-activitytours)
- [Amenity](#model-amenity)
- [AmenityData](#model-amenitydata)
- [AmenityPricingDetail](#model-amenitypricingdetail)
- [AmenityTax](#model-amenitytax)
- [AmenityTierPricing](#model-amenitytierpricing)
- [AuthenticationToken](#model-authenticationtoken)
- [BankAccountModel](#model-bankaccountmodel)
- [Booking](#model-booking)
- [BookingAmenities](#model-bookingamenities)
- [BookingAttendees](#model-bookingattendees)
- [BookingCoupons](#model-bookingcoupons)
- [BookingDiscountGroup](#model-bookingdiscountgroup)
- [BookingGuest](#model-bookingguest)
- [BookingObject](#model-bookingobject)
- [BookingRefund](#model-bookingrefund)
- [CancellationWindow](#model-cancellationwindow)
- [CardModel](#model-cardmodel)
- [ChargeModel](#model-chargemodel)
- [Company](#model-company)
- [CompanyContact](#model-companycontact)
- [CompanyLead](#model-companylead)
- [CompanyMember](#model-companymember)
- [CompanyUserType](#model-companyusertype)
- [Contact](#model-contact)
- [Contract](#model-contract)
- [Country](#model-country)
- [CustomTierPricing](#model-customtierpricing)
- [Deposit](#model-deposit)
- [Event](#model-event)
- [EventDiscussion](#model-eventdiscussion)
- [EventGuestList](#model-eventguestlist)
- [EventRsvp](#model-eventrsvp)
- [Industry](#model-industry)
- [InternalUser](#model-internaluser)
- [Invoice](#model-invoice)
- [InvoiceDetail](#model-invoicedetail)
- [InvoiceDetailLine](#model-invoicedetailline)
- [Lead](#model-lead)
- [LeadSource](#model-leadsource)
- [LeadSourceMinor](#model-leadsourceminor)
- [LeadStatus](#model-leadstatus)
- [LeadStatusChangeReason](#model-leadstatuschangereason)
- [ListDataOfActivityActivities](#model-listdataofactivityactivities)
- [ListDataOfActivityEvents](#model-listdataofactivityevents)
- [ListDataOfActivityNotes](#model-listdataofactivitynotes)
- [ListDataOfActivityTours](#model-listdataofactivitytours)
- [ListDataOfBookingDiscountGroup](#model-listdataofbookingdiscountgroup)
- [ListDataOfCompanyUserType](#model-listdataofcompanyusertype)
- [ListDataOfCountry](#model-listdataofcountry)
- [ListDataOfIndustry](#model-listdataofindustry)
- [ListDataOfInternalUser](#model-listdataofinternaluser)
- [ListDataOfLeadSource](#model-listdataofleadsource)
- [ListDataOfLeadSourceMinor](#model-listdataofleadsourceminor)
- [ListDataOfLeadStatus](#model-listdataofleadstatus)
- [ListDataOfLeadStatusChangeReason](#model-listdataofleadstatuschangereason)
- [ListDataOfMasterSetup](#model-listdataofmastersetup)
- [ListDataOfMasterSetupMinor](#model-listdataofmastersetupminor)
- [ListDataOfPhoneNumber](#model-listdataofphonenumber)
- [ListDataOfProperty](#model-listdataofproperty)
- [ListDataOfSpaceType](#model-listdataofspacetype)
- [ListDataOfString](#model-listdataofstring)
- [ListPageOfAmenity](#model-listpageofamenity)
- [ListPageOfBooking](#model-listpageofbooking)
- [ListPageOfCardModel](#model-listpageofcardmodel)
- [ListPageOfChargeModel](#model-listpageofchargemodel)
- [ListPageOfCompany](#model-listpageofcompany)
- [ListPageOfContact](#model-listpageofcontact)
- [ListPageOfContract](#model-listpageofcontract)
- [ListPageOfDeposit](#model-listpageofdeposit)
- [ListPageOfEvent](#model-listpageofevent)
- [ListPageOfInvoice](#model-listpageofinvoice)
- [ListPageOfInvoiceDetail](#model-listpageofinvoicedetail)
- [ListPageOfLead](#model-listpageoflead)
- [ListPageOfMember](#model-listpageofmember)
- [ListPageOfReceiptModel](#model-listpageofreceiptmodel)
- [ListPageOfRefund](#model-listpageofrefund)
- [ListPageOfSpace](#model-listpageofspace)
- [ListPageOfSpaceAmenities](#model-listpageofspaceamenities)
- [ListPageOfSpaceAvailability](#model-listpageofspaceavailability)
- [ListPageOfSpacePricing](#model-listpageofspacepricing)
- [ListPageOfSupport](#model-listpageofsupport)
- [MasterSetup](#model-mastersetup)
- [MasterSetupMinor](#model-mastersetupminor)
- [Member](#model-member)
- [MemberInfo](#model-memberinfo)
- [OrderDetail](#model-orderdetail)
- [PageLinkBuilder](#model-pagelinkbuilder)
- [PhoneNumber](#model-phonenumber)
- [PhoneNumberPurchase](#model-phonenumberpurchase)
- [PostProperty](#model-postproperty)
- [PostPropertyImage](#model-postpropertyimage)
- [PostSpace](#model-postspace)
- [PostSpaceImage](#model-postspaceimage)
- [Price](#model-price)
- [Property](#model-property)
- [PropertyFloors](#model-propertyfloors)
- [PropertyGallery](#model-propertygallery)
- [PropertyLogoImage](#model-propertylogoimage)
- [PropertyOperatingHours](#model-propertyoperatinghours)
- [Proposal](#model-proposal)
- [ReceiptModel](#model-receiptmodel)
- [Refund](#model-refund)
- [Space](#model-space)
- [SpaceAmenities](#model-spaceamenities)
- [SpaceAmenity](#model-spaceamenity)
- [SpaceAvailability](#model-spaceavailability)
- [SpaceCancellationPolicy](#model-spacecancellationpolicy)
- [SpaceGallery](#model-spacegallery)
- [SpacePricing](#model-spacepricing)
- [SpaceType](#model-spacetype)
- [Support](#model-support)
- [SupportAttachments](#model-supportattachments)
- [SupportCategory](#model-supportcategory)
- [SupportDiscussion](#model-supportdiscussion)
- [SupportPriority](#model-supportpriority)
- [TimeSlot](#model-timeslot)
- [Webhook](#model-webhook)

### Model: ActivityActivities
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Type` | `string` | Y | enum: Call, Email, Meeting, ToDo, Inquiry, Pursuit; Activity type. |
| `Title` | `string` | Y | maxLength=100; minLength=1; Activity title. |
| `CompletedDate` | `string(date-time)` | Y | Activity completed date. |
| `Attendees` | `Array<integer(int64)>` | N | Activity attendees. |
| `AttendeesNames` | `Array<string>` | N | readOnly; Activity attendees name. |
| `UserIdsToNotify` | `Array<integer(int64)>` | N | Activity noftify user id. |
| `UserNamesToNotify` | `Array<string>` | N | readOnly; Activity noftify user name. |
| `Comment` | `string` | N | maxLength=1200; Activity comment. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the activity. |
| `ObjectId` | `integer(int64)` | Y | Unique identifier of the Object. |
| `ObjectName` | `string` | N | readOnly; Name of object. |
| `ObjectType` | `string` | Y | enum: Company, Contact, Member, Lead, Deal; Object type of activity. |

### Model: ActivityEvents
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Title` | `string` | Y | maxLength=100; minLength=1; Activity title. |
| `StartDateTime` | `string(date-time)` | Y | Activity start date time. |
| `EndDateTime` | `string(date-time)` | Y | Activity end date time. |
| `AssignTo` | `Array<integer(int64)>` | N | Activity assign to. |
| `AssignToNames` | `Array<string>` | N | readOnly; Activity assign to name. |
| `Attendees` | `Array<integer(int64)>` | N | Activity attendees. |
| `AttendeesNames` | `Array<string>` | N | readOnly; Activity attendees name. |
| `UserIdsToNotify` | `Array<integer(int64)>` | N | Activity noftify user id. |
| `UserNamesToNotify` | `Array<string>` | N | readOnly; Activity noftify user name. |
| `Comment` | `string` | N | maxLength=1200; Activity comment. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the activity. |
| `ObjectId` | `integer(int64)` | Y | Unique identifier of the Object. |
| `ObjectName` | `string` | N | readOnly; Name of object. |
| `ObjectType` | `string` | Y | enum: Company, Contact, Member, Lead, Deal; Object type of activity. |

### Model: ActivityNotes
| Field | Type | Required | Notes |
|---|---|---:|---|
| `UserIdsToNotify` | `Array<integer(int64)>` | N | Activity noftify user id. |
| `UserNamesToNotify` | `Array<string>` | N | readOnly; Activity noftify user name. |
| `Comment` | `string` | Y | maxLength=1200; Activity comment. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the activity. |
| `ObjectId` | `integer(int64)` | Y | Unique identifier of the Object. |
| `ObjectName` | `string` | N | readOnly; Name of object. |
| `ObjectType` | `string` | Y | enum: Company, Contact, Member, Lead, Deal; Object type of activity. |

### Model: ActivityTours
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Property` | `integer(int64)` | Y | Activity property. |
| `PropertyName` | `string` | N | readOnly; Activity property name. |
| `Spaces` | `Array<integer(int64)>` | N | Activity spaces. |
| `SpacesName` | `Array<string>` | N | readOnly; Activity spaces name. |
| `StartDateTime` | `string(date-time)` | Y | Activity start date time. |
| `EndDateTime` | `string(date-time)` | Y | Activity end date time. |
| `AssignTo` | `Array<integer(int64)>` | Y | Activity assign to. |
| `AssignToNames` | `Array<string>` | N | readOnly; Activity assign to name. |
| `Attendees` | `Array<integer(int64)>` | N | Activity attendees. |
| `AttendeesNames` | `Array<string>` | N | readOnly; Activity attendees name. |
| `UserIdsToNotify` | `Array<integer(int64)>` | N | Activity noftify user id. |
| `UserNamesToNotify` | `Array<string>` | N | readOnly; Activity noftify user name. |
| `Comment` | `string` | N | maxLength=1200; Activity comment. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the activity. |
| `ObjectId` | `integer(int64)` | Y | Unique identifier of the Object. |
| `ObjectName` | `string` | N | readOnly; Name of object. |
| `ObjectType` | `string` | Y | enum: Company, Contact, Member, Lead, Deal; Object type of activity. |

### Model: Amenity
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the amenity. |
| `Name` | `string` | Y | maxLength=255; minLength=0; Name of the amenity. |
| `Type` | `string` | Y | enum: StandardService, MemberHours, CompanyHours, MemberCredits, CompanyCredits, CoWorkingDaily, CoWorkingHourly, MemberData, CompanyData, Voice, Package, OneTimePassword…; Type of the amenity. |
| `Description` | `string` | N | maxLength=500; minLength=0; Description of the amenity. |
| `PricingType` | `string` | Y | enum: Quantity, Duration, Free, Tier; Pricing type of the amenity. |
| `PricingDetail` | `Array<AmenityPricingDetail>` | N | Pricing Details. |
| `AmenityTax` | `Array<AmenityTax>` | N | Tax Detail. |
| `DataPlanDetails` | `AmenityData` | N | Data Plan Details. |
| `BookingNumberOfUnits` | `integer(int32)` | N | Booking Units. |
| `CoworkingPassNumberOfDays` | `integer(int32)` | N | Number of days included in the coworking pass. |
| `PropertyCurrencySymbol` | `string` | N |  |
| `ExternalReference` | `string` | N | maxLength=250; minLength=0 |
| `ChargeCode` | `integer(int64)` | N | Membership Type Id |
| `ChargeCodeName` | `string` | N |  |
| `AmenityIconFilename` | `string` | N |  |

### Model: AmenityData
| Field | Type | Required | Notes |
|---|---|---:|---|
| `ServicePlanType` | `string` | N | enum: LoadBalance, SingleCircuit, SingleCircuitWithGuarantee; Service Plan Type. |
| `ServicePlanCircuit` | `integer(int32)` | N | Type of Circuit. |
| `ServicePlanUploadSpeed` | `string` | N | Upload speed of Data. |
| `ServicePlanDownloadSpeed` | `string` | N | Download speed of Data. |
| `ServicePlanGuaranteeUpload` | `string` | N | GuaranteeUpload speed of Data. |
| `ServicePlanGuaranteeDownload` | `string` | N | GuaranteeDownload speed of Data. |
| `MemberWiFiNoOfDevices` | `integer(int64)` | N | Number of Devices for Member Wifi. |
| `GuestWiFiNoOfDevices` | `integer(int64)` | N | Number of Devices for Guest Wifi. |
| `GuestWiFiDuration` | `integer(int64)` | N | Guest Wifi Duration for Data. |
| `GuestWiFiPeriod` | `string` | N | enum: Hours, Days, Weeks, Months; readOnly; Guest Wifi Period for Data. |

### Model: AmenityPricingDetail
| Field | Type | Required | Notes |
|---|---|---:|---|
| `TierQtyFrom` | `integer(int64)` | N | readOnly; Amenity qty for tier price. |
| `TierQtyTo` | `integer(int64)` | N | readOnly; Amenity qty for tier price. |
| `UnitPrice` | `integer(int64)` | N | readOnly; Price for amenity. |
| `SetUpCost` | `integer(int64)` | N | readOnly; Setup Cost for amenity. |
| `SecurityDeposit` | `integer(int64)` | N | readOnly; Security Deposit for amenity. |

### Model: AmenityTax
| Field | Type | Required | Notes |
|---|---|---:|---|
| `TaxId` | `integer(int64)` | N | Unique identifier of the tax. |
| `TaxName` | `string` | N | readOnly; TaxName for amenity. |
| `TaxRate` | `string` | N | readOnly; TaxRate for amenity. |

### Model: AmenityTierPricing
| Field | Type | Required | Notes |
|---|---|---:|---|
| `AmenityPricingId` | `integer(int64)` | N | readOnly; Amenity Tier Pricing Id |
| `OrderDetailId` | `integer(int64)` | N | readOnly; Order Detail Id |
| `AmenityId` | `integer(int64)` | N | readOnly; Amenity Id |
| `TierFrom` | `integer(int64)` | N | readOnly; Tier From |
| `TierTo` | `integer(int64)` | N | Tier To |
| `AmenityUnitPrice` | `number(double)` | N | Amenity Unit Price |
| `AmenitySecurityDeposit` | `number(double)` | N | Amenity Security Deposit |
| `AmenitySetupFee` | `number(double)` | N | Amenity Setup Fee |

### Model: AuthenticationToken
| Field | Type | Required | Notes |
|---|---|---:|---|
| `ApiKey` | `string(uuid)` | Y | API Key used for generating the token. |
| `Token` | `string` | N | readOnly; Token used to authenticate API calls. |

### Model: BankAccountModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `AccountHolder` | `string` | Y |  |
| `RountingNumber` | `string` | Y |  |
| `AccountNumber` | `string` | Y |  |
| `AccountType` | `integer(int64)` | N | readOnly |
| `MemberId` | `integer(int64)` | N | readOnly; Unique identifier of the member. |
| `PayerId` | `integer(int64)` | N | readOnly; Unique identifier of the account. |
| `EncryptRountingNumber` | `string` | N | readOnly |

### Model: Booking
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the booking. |
| `Title` | `string` | Y | maxLength=100; minLength=1; Heading of the booking. |
| `MemberId` | `integer(int64)` | Y | ID of the member associated with this booking. This field must be a valid "member" ID. |
| `FirstName` | `string` | N | readOnly; First name of the member record associated with this booking. |
| `LastName` | `string` | N | readOnly; Last name of the member record associated with this booking. |
| `Email` | `string` | N | readOnly; Email of the member record associated with this booking. |
| `CompanyId` | `integer(int64)` | Y | ID of the company associated with this booking. This field must be a valid "company" ID. |
| `CompanyName` | `string` | N | readOnly; Name of the company record associated with this booking. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with this booking. This field must be a valid "property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the booking. |
| `SpaceId` | `integer(int64)` | Y | ID of the space associated with this booking. This field must be a valid "space" ID. |
| `SpaceName` | `string` | N | readOnly; Name of the space associated with the booking. |
| `SpaceTypeId` | `integer(int64)` | N | readOnly; ID of the space type associated with this space.   This field must be a valid "space type" ID. |
| `SpaceType` | `string` | N | readOnly; Space type name of the space associated with the booking. |
| `StartDateTime` | `string(date-time)` | Y | Datetime the booking begins. |
| `EndDateTime` | `string(date-time)` | Y | Datetime the booking ends. |
| `BookingAmount` | `number(double)` | N | readOnly; Base amount of the space for this booking. |
| `BookingSetup` | `number(double)` | N | readOnly; Setup fee of the space for this booking. |
| `BookingDiscountRate` | `number(double)` | N | Booking discount rate apply for this booking.  This field must be between 0-100. |
| `BookingDiscount` | `number(double)` | N | readOnly; Member discount and coupon discount amount apply for this booking. |
| `BookingTax` | `number(double)` | N | readOnly; Tax amount of the space for this booking. |
| `AmenityAmount` | `number(double)` | N | readOnly; Amount of the purchased amenities for this booking. |
| `AmenitiesDiscount` | `number(double)` | N | readOnly; Coupon discount amount apply for this booking. |
| `AmenitySetup` | `number(double)` | N | readOnly; Setup fee of the amenities for this booking. |
| `AmenityTax` | `number(double)` | N | readOnly; Tax amount of the amenities for this booking. |
| `GrandTotal` | `number(double)` | N | readOnly; Total taxable amount, which need to pay for this booking. |
| `UnitType` | `string` | N | enum: Hours, Credits; readOnly; Get type of unit used for this booking. |
| `TotalUnitsUsed` | `integer(int64)` | N | readOnly; Total units used for this booking. |
| `MemberRecurringUnitsUsed` | `integer(int64)` | N | readOnly; Member recurring units used for this booking. |
| `MemberAdhocUnitsUsed` | `integer(int64)` | N | readOnly; Member one time units used for this booking. |
| `CompanyRecurringUnitsUsed` | `integer(int64)` | N | readOnly; Company recurring units used for this booking. |
| `CompanyAdhocUnitsUsed` | `integer(int64)` | N | readOnly; Company one time units used for this booking. |
| `RecordStatus` | `string` | N | enum: Pending, Active, Cancelled; readOnly; Current status of the booking. This field must be one of the enum values provided below. |
| `Type` | `string` | Y | enum: Hourly, Daily, Monthly; Indicates if this booking is by Hour, Day, or Month. This field must be a valid booking type. |
| `BookedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Contract, MemberPortal, Google, API, CoworkingAPI; readOnly; Location from which the booking was made. This field must be one of the enum values provided below. |
| `NumberOfAttendees` | `integer(int64)` | Y | Number of attendees of the booking. |
| `Attendees` | `BookingAttendees` | N | List of booking Attendees. |
| `Note` | `string` | N | Booking notes. |
| `Amenities` | `Array<BookingAmenities>` | N | Purchased Amenities of the booking. |
| `CouponData` | `BookingCoupons` | N | Booking Coupon data of the booking. |
| `BookedById` | `integer(int64)` | N | readOnly; ID of the contact associated with this booking. This field must be a valid "contact" ID. |
| `BookedByFirstName` | `string` | N | readOnly; First name of the contact record associated with this booking. |
| `BookedByLastName` | `string` | N | readOnly; Last name of the contact record associated with this booking. |
| `BookedByEmail` | `string` | N | readOnly; Email of the contact record associated with this booking. |
| `PropertyCurrencySymbol` | `string` | N | readOnly |

### Model: BookingAmenities
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | Y | Unique identifier of the amenity. |
| `Name` | `string` | N | readOnly; Name of the amenity. |
| `Type` | `string` | N | enum: StandardService, MemberHours, CompanyHours, MemberCredits, CompanyCredits, CoWorkingDaily, CoWorkingHourly, MemberData, CompanyData, Voice, Package, OneTimePassword…; readOnly; Type of the amenity. |
| `PricingType` | `string` | N | enum: Quantity, Duration, Free, Tier; readOnly; Pricing type of the amenity. |
| `UnitPrice` | `number(double)` | N | readOnly; Unit price of the amenity. |
| `TotalQuantity` | `number(double)` | Y | Total quantity of the amenity. |
| `AmenityDiscountRate` | `number(double)` | N | Amenity discount rate apply for this amenity.  This field must be between 0-100. |
| `TotalPrice` | `number(double)` | N | readOnly; Total price of the amenity. |
| `TotalSetupPrice` | `number(double)` | N | readOnly; Total setup price of the amenity. |

### Model: BookingAttendees
| Field | Type | Required | Notes |
|---|---|---:|---|
| `ObjectIds` | `Array<BookingObject>` | N | List of the Member or Lead or Contact. |
| `Guest` | `Array<BookingGuest>` | N | List of the Guest. |

### Model: BookingCoupons
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Code` | `string` | Y | Code of the booking coupons. |
| `Name` | `string` | N | readOnly; Name of the booking coupons. |
| `Type` | `string` | N | enum: Bookings, BookingsAndAmenities; readOnly; Coupon type of the booking coupons. |
| `DiscountType` | `string` | N | enum: PercentageDiscount; readOnly; Discount value type of the booking coupons. |
| `DiscountValue` | `number(double)` | N | readOnly; Discount value of the booking coupons. |

### Model: BookingDiscountGroup
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | Unique identifier of the discount group. |
| `Name` | `string` | N | maxLength=255; minLength=0; readOnly; Name of the discount group. |
| `PricingType` | `string` | N | enum: RetailPricing, MemberPricing; readOnly; The type of pricing the discount group applies to. This field must be one of the enum values provided below. |
| `DiscountRate` | `number(double)` | N | readOnly; Percentage discount applied to the discount group. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the discount group. This field must be one of the enum values provided below. |

### Model: BookingGuest
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the attendee. |
| `FirstName` | `string` | Y | maxLength=100; minLength=1; First name of the member or guest. |
| `LastName` | `string` | Y | maxLength=100; minLength=1; Last name of the member or guest. |
| `Email` | `string` | N | maxLength=50; minLength=0; Email address associated with the member or guest. Email addresses will be validated based on the pattern provided. |

### Model: BookingObject
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the attendee. |
| `ObjectId` | `integer(int64)` | N | Id of the Member or Lead or Contact. |

### Model: BookingRefund
| Field | Type | Required | Notes |
|---|---|---:|---|
| `BookingId` | `integer(int64)` | N | readOnly; Unique identifier of the booking. |
| `CancellationFeeRate` | `number(double)` | N | readOnly; Percentage of booking refund to be deducted as a cancellation fee. |
| `CancellationFeeUnitsCharged` | `number(double)` | N | readOnly; Number of units charged as a cancellation fee for the booking. |
| `CancellationFeeCharged` | `number(double)` | N | readOnly; Amount charged as a cancellation fee for the booking. |
| `UnitsRefunded` | `number(double)` | N | readOnly; Number of units refunded for the booking. |
| `UnitType` | `string` | N | enum: Hours, Credits; readOnly; Type of units used for the booking. |
| `AmountRefunded` | `number(double)` | N | readOnly; Amount refunded for the booking. |
| `PropertyCurrencySymbol` | `string` | N | readOnly; Currency for the booking. |

### Model: CancellationWindow
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CancellationPeriodUnits` | `string` | N | enum: Min, Hour, Day, Week, Month; Hourly cancellation period units for booking of this space. |
| `CancellationPeriodValueFrom` | `integer(int64)` | N | Hourly cancellation period value from for booking of this space. |
| `CancellationPeriodValueTo` | `integer(int64)` | N | Hourly cancellation period value from for booking of this space. |
| `CancellationFeePercentRetail` | `number(double)` | N | Hourly cancellation fee percent for retail booking of this space. |
| `CancellationFeePercentMember` | `number(double)` | N | Hourly cancellation fee percent for member booking of this space. |

### Model: CardModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CardType` | `string` | N |  |
| `Card` | `string` | N |  |
| `LastFourDigits` | `string` | N |  |
| `Default` | `integer(int32)` | N |  |
| `CardId` | `integer(int64)` | N |  |
| `RountingNumber` | `string` | N |  |
| `Institution` | `string` | N |  |
| `AccountNumber` | `string` | N |  |
| `AccountType` | `integer(int64)` | N |  |
| `AccountHolder` | `string` | N |  |

### Model: ChargeModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N |  |
| `CustomChargeCode` | `integer(int64)` | N |  |
| `AmenitySetupFee` | `number(double)` | N |  |
| `AmenitySecurityDeposit` | `number(double)` | N |  |
| `AmenityUnitPrice` | `number(double)` | N |  |
| `DiscountedUnitPrice` | `number(double)` | N |  |
| `BaseUnitPrice` | `number(double)` | N |  |
| `CompanyId` | `integer(int64)` | N |  |
| `ContactId` | `integer(int64)` | N |  |
| `PropertyId` | `integer(int64)` | N |  |
| `GrandTotalAmount` | `number(double)` | N |  |
| `PostMonth` | `string(date-time)` | N |  |
| `TotalAmount` | `number(double)` | N |  |
| `TaxableAmount` | `number(double)` | N |  |
| `BaseTotalAmount` | `number(double)` | N |  |
| `TotalSetupFee` | `number(double)` | N |  |
| `TotalSecurityDeposit` | `number(double)` | N |  |
| `TotalOrderQty` | `number(double)` | N |  |
| `AutoInvoiceDate` | `string(date-time)` | N |  |
| `ChargeType` | `string` | N |  |
| `PropertyCurrencySymbol` | `string` | N |  |
| `PropertyTimezoneId` | `string` | N |  |
| `ChargeDate` | `string(date-time)` | N |  |
| `ChargeAdded` | `string(date-time)` | N |  |
| `CreatedBy` | `string` | N |  |
| `Description` | `string` | N |  |
| `Discount` | `number(double)` | N |  |
| `PropertyName` | `string` | N |  |
| `CompanyName` | `string` | N |  |
| `AmenityName` | `string` | N |  |
| `SpaceName` | `string` | N |  |
| `ContactName` | `string` | N |  |
| `voyagerPropertyId` | `integer(int64)` | N |  |
| `AmenityId` | `integer(int64)` | N |  |
| `OrderDetailId` | `integer(int64)` | N |  |
| `OrderDetailUnitPrice` | `number(double)` | N |  |
| `TotalAmountOrder` | `number(double)` | N |  |
| `SpaceId` | `integer(int64)` | N |  |
| `PricingType` | `integer(int64)` | N |  |
| `PricingTypeValue` | `string` | N |  |
| `TotalTaxAmount` | `number(double)` | N |  |

### Model: Company
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `CompanyName` | `string` | Y | maxLength=120; minLength=0; Name of the company. |
| `CompanyCode` | `string` | N | readOnly; Code of the company. |
| `CompanyTypeID` | `integer(int64)` | Y | ID of the "CompanyUserType" record associated with the company. This field must be a valid "CompanyUserType" ID. |
| `CompanyTypeDescription` | `string` | N | readOnly; Value of the "CompanyUserType" record associated with the company. This field must be a valid "CompanyUserType" description. |
| `PrimaryPropertyExternalReference` | `string` | N | readOnly; external reference of the property. |
| `CompanyExternalReference` | `string` | N | readOnly; external reference of the company. |
| `PrimaryPropertyId` | `integer(int64)` | Y | ID of the default "Property" record associated with the company. This field must be a valid "Property" ID. |
| `PrimaryPropertyName` | `string` | N | readOnly; Value of the default "Property" record associated with the company. This field must be a valid "Property" name. |
| `PrimaryPropertyCode` | `string` | N | readOnly; Code of the default "Property" record associated with the company. This field must be a valid "Property" name. |
| `PrimaryContactId` | `integer(int64)` | N | ID of the default "ContactId" record associated with the contact. This field must be a valid "Contact" ID. |
| `PrimaryContactName` | `string` | N | readOnly; Value of the default "ContactId" record associated with the contact. This field must be a valid "Contact" name. |
| `PrimaryContactPhone` | `string` | N | readOnly; Value of the default "Phone" record associated with the contact. |
| `PrimaryContactEmail` | `string` | N | readOnly; Value of the default "Email" record associated with the contact. |
| `AssignedInternalUserId` | `integer(int64)` | Y |  |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the "InternalUser" record assigned to the company. This field must be an "InternalUser" name. |
| `PrinterCode` | `string` | N | maxLength=50; minLength=0; The printer code associated with the company. |
| `Website` | `string` | N | maxLength=100; minLength=0; URL of the company's website. |
| `Mailbox` | `string` | N | maxLength=50; minLength=0; Mailbox used by the company. |
| `CompanyPaymentOption` | `string` | N | enum: AddChargesToMonthlyInvoice, AlwaysRequestPayment; Configured payment option for the company. |
| `DefaultBookingDiscountGroupId` | `integer(int32)` | N | The booking discount group discounts the booking cost, not the cost of amenities included in the booking. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the company. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the company. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the company.    US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the company. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the company. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the company. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the company. |
| `BillingAddressLine1` | `string` | N | maxLength=255; minLength=0; Billing address line 1 for the company. |
| `BillingCity` | `string` | N | maxLength=80; minLength=0; Billing city for the company. |
| `BillingState` | `string` | N | maxLength=2; minLength=0; Billing state for the company. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `BillingZip` | `string` | N | maxLength=60; minLength=0; Billing zip code for the company. |
| `BillingAddressLine2` | `string` | N | maxLength=255; minLength=0; Billing address line 2 for the company. |
| `BillingCountry` | `string` | N | readOnly; Billing country for the company. |
| `BillingCountryId` | `integer(int64)` | N | Billing country id for the company. |
| `AutoBillEnabled` | `string` | N | enum: True, False; Billing status is auto on or off for the company. |
| `BillingRecipientEmail` | `string` | N | maxLength=2000; minLength=0; Billing recipient emails are separated with a comma and a space after the comma. |
| `RecordStatus` | `string` | N | enum: Active, Archive; The status of the company. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AdminPortal, Booking, WebService, Api, CompanyleadApi; Source the company was created from. This field must be one of the enum values provided below. |
| `CreatedBy` | `string` | N | readOnly; Get name of that user who had created this company. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `LastModifiedBy` | `string` | N | readOnly; Name of the user who last modified the company. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Date and time company was last modified. |
| `IsOperatorCompany` | `integer(int32)` | N | readOnly; Value of the default "Property" record associated with the company. This field must be a valid "Property" name. |
| `PmuserScode` | `integer(int32)` | N | readOnly |
| `IsCompanyCreateMode` | `boolean` | N | readOnly |
| `LegalEntityId` | `integer(int64)` | N | readOnly; Legal Entity Id. |
| `LegalEntityName` | `string` | N | readOnly; Legal Entity Name. |
| `LegalEntityCode` | `string` | N | readOnly; Legal Entity Code. |
| `Custom1` | `string` | N | maxLength=500; minLength=0; Custom 1 value associated with the company. |
| `Custom2` | `string` | N | maxLength=500; minLength=0; Custom 2 value associated with the company. |
| `Custom3` | `string` | N | maxLength=500; minLength=0; Custom 3 value associated with the company. |
| `Custom4` | `string` | N | maxLength=500; minLength=0; Custom 4 value associated with the company. |
| `Custom5` | `string` | N | maxLength=500; minLength=0; Custom 5 value associated with the company. |
| `Custom6` | `string` | N | maxLength=500; minLength=0; Custom 6 value associated with the company. |
| `Custom7` | `string` | N | maxLength=500; minLength=0; Custom 7 value associated with the company. |
| `Custom8` | `string` | N | maxLength=500; minLength=0; Custom 8 value associated with the company. |
| `Custom9` | `string` | N | maxLength=500; minLength=0; Custom 9 value associated with the company. |
| `Custom10` | `string` | N | maxLength=500; minLength=0; Custom 10 value associated with the company. |
| `Custom11` | `string` | N | maxLength=500; minLength=0; Custom 11 value associated with the company. |
| `Custom12` | `string` | N | maxLength=500; minLength=0; Custom 12 value associated with the company. |
| `Custom13` | `string` | N | maxLength=500; minLength=0; Custom 13 value associated with the company. |
| `Custom14` | `string` | N | maxLength=500; minLength=0; Custom 14 value associated with the company. |
| `Custom15` | `string` | N | maxLength=500; minLength=0; Custom 15 value associated with the company. |
| `Custom16` | `string` | N | maxLength=500; minLength=0; Custom 16 value associated with the company. |
| `Custom17` | `string` | N | maxLength=500; minLength=0; Custom 17 value associated with the company. |
| `Custom18` | `string` | N | maxLength=500; minLength=0; Custom 18 value associated with the company. |
| `Custom19` | `string` | N | maxLength=500; minLength=0; Custom 19 value associated with the company. |
| `Custom20` | `string` | N | maxLength=500; minLength=0; Custom 20 value associated with the company. |

### Model: CompanyContact
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CompanyId` | `integer(int64)` | N | readOnly; ID of the company associated with the contact. |
| `CompanyName` | `string` | Y | maxLength=120; minLength=0; Name of the company associated with the contact. |
| `AssignedInternalUserId` | `integer(int64)` | Y | ID of the internal user associated with the contact. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the contact. |
| `ParentId` | `integer(int64)` | N | readOnly; Contact parent id |
| `FirstName` | `string` | Y | maxLength=100; minLength=0; First name of the contact. |
| `LastName` | `string` | Y | maxLength=100; minLength=0; Last name of the contact. |
| `Title` | `string` | N | enum: Mr, Ms, Mrs; Title (prefix) of the contact. This field must be one of the enum values provided below. |
| `UserTypeId` | `integer(int64)` | Y | ID of the user type associated with this contact.   This field must be a valid "CompanyUserType" ID. |
| `UserTypeDescription` | `string` | N | readOnly; Description of the user type associated with this contact. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with the contact.  This field must be a valid "Property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the contact. |
| `EmailType1` | `string` | N | enum: Work, Home, Other; Email type associated with the contact. This field must be one of the enum values provided below. |
| `Email1` | `string` | N | maxLength=50; minLength=0; Email address associated with the contact. Email addresses will be validated based on the pattern provided. |
| `PhoneType1` | `string` | N | enum: Work, Home, Other; Phone type associated with the contact. This field must be one of the enum values provided below. |
| `PhoneNum1` | `string` | N | maxLength=50; Primary phone number associated with the contact. |
| `Occupation` | `string` | N | maxLength=55; minLength=0; Description of the contact's occupation. |
| `Culture` | `string` | N | enum: Brazilian, Chinese, ChineseSingapore, CzechRepublic, DutchNetherlands, DutchBelgium, EnglishAustralia, EnglishBelgium, EnglishCanada, EnglishIndia, EnglishSingapore, EnglishUnitedKingdom…; The culture of the contact. This field must be one of the enum values provided below. |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the internal user associated with the contact. This field must be a valid "InternalUser" ID. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the contact. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the contact. |
| `MailingAddressLine3` | `string` | N | maxLength=255; minLength=0; Mailing address line 3 for the contact. |
| `MailingAddressLine4` | `string` | N | maxLength=255; minLength=0; Mailing address line 4 for the contact. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the contact. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the contact.    US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the contact. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the contact. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the contact. |
| `OtherAddressLine1` | `string` | N | maxLength=255; minLength=0; Other address line 1 for the contact. |
| `OtherAddressLine2` | `string` | N | maxLength=255; minLength=0; Other address line 2 for the contact. |
| `OtherAddressLine3` | `string` | N | maxLength=255; minLength=0; Other address line 3 for the contact. |
| `OtherAddressLine4` | `string` | N | maxLength=255; minLength=0; Other address line 4 for the contact. |
| `OtherCity` | `string` | N | maxLength=80; minLength=0; Other city for the contact. |
| `OtherState` | `string` | N | maxLength=2; minLength=0; Other state for the contact.   US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `OtherZip` | `string` | N | maxLength=60; minLength=0; Other zip code for the contact. |
| `OtherCountry` | `string` | N | readOnly; Other country for the contact. |
| `OtherCountryId` | `integer(int64)` | N | Other country id for the contact. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the contact. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AmenityConfigurationKubeCC, AmenityConfigurationResellerPortal, AmenityConfigurationMemberPortal, AdminPortal, OperatorPortalInternalUser, OperatorPortalMemberInternalUser, Booking, WebService, Api; readOnly; Process that initially created the contact. |
| `CreatedBy` | `string` | N | readOnly; User contact was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime contact was created. |
| `LastModifiedBy` | `string` | N | readOnly; User contact was last modified by. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime contact was last modified. |
| `OptOutMarketing` | `integer(int64)` | N | Default value is 0 0 = Opted in to marketing communication 1 = Opted out of marteting communication |
| `DateOfBirth` | `string(date-time)` | N |  |
| `Custom1` | `string` | N | maxLength=1000; minLength=0; Custom 1 value associated with the contact. |
| `Custom2` | `string` | N | maxLength=1000; minLength=0; Custom 2 value associated with the contact. |
| `Custom3` | `string` | N | maxLength=1000; minLength=0; Custom 3 value associated with the contact. |
| `Custom4` | `string` | N | maxLength=1000; minLength=0; Custom 4 value associated with the contact. |
| `Custom5` | `string` | N | maxLength=1000; minLength=0; Custom 5 value associated with the contact. |
| `Custom6` | `string` | N | maxLength=1000; minLength=0; Custom 6 value associated with the contact. |
| `Custom7` | `string` | N | maxLength=1000; minLength=0; Custom 7 value associated with the contact. |
| `Custom8` | `string` | N | maxLength=1000; minLength=0; Custom 8 value associated with the contact. |
| `Custom9` | `string` | N | maxLength=1000; minLength=0; Custom 9 value associated with the contact. |
| `Custom10` | `string` | N | maxLength=1000; minLength=0; Custom 10 value associated with the contact. |
| `Custom11` | `string` | N | maxLength=1000; minLength=0; Custom 11 value associated with the contact. |
| `Custom12` | `string` | N | maxLength=1000; minLength=0; Custom 12 value associated with the contact. |
| `Custom13` | `string` | N | maxLength=1000; minLength=0; Custom 13 value associated with the contact. |
| `Custom14` | `string` | N | maxLength=1000; minLength=0; Custom 14 value associated with the contact. |
| `Custom15` | `string` | N | maxLength=1000; minLength=0; Custom 15 value associated with the contact. |
| `Custom16` | `string` | N | maxLength=1000; minLength=0; Custom 16 value associated with the contact. |
| `Custom17` | `string` | N | maxLength=1000; minLength=0; Custom 17 value associated with the contact. |
| `Custom18` | `string` | N | maxLength=1000; minLength=0; Custom 18 value associated with the contact. |
| `Custom19` | `string` | N | maxLength=1000; minLength=0; Custom 19 value associated with the contact. |
| `Custom20` | `string` | N | maxLength=1000; minLength=0; Custom 20 value associated with the contact. |

### Model: CompanyLead
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CompanyId` | `integer(int64)` | N | readOnly; ID of the company associated with the lead. |
| `CompanyName` | `string` | Y | maxLength=120; minLength=0; Name of the company associated with the lead. |
| `AssignedInternalUserId` | `integer(int64)` | Y | ID of the internal user associated with the lead. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the lead. |
| `ParentId` | `integer(int64)` | N | readOnly; Lead parent id |
| `FirstName` | `string` | Y | maxLength=100; minLength=0; First name of the lead. |
| `LastName` | `string` | Y | maxLength=100; minLength=0; Last name of the lead. |
| `Title` | `string` | N | enum: Mr, Ms, Mrs; Title (prefix) of the lead. This field must be one of the enum values provided below. |
| `UserTypeId` | `integer(int64)` | Y | ID of the user type associated with this lead.   This field must be a valid "CompanyUserType" ID. |
| `UserTypeDescription` | `string` | N | readOnly; Description of the user type associated with this lead. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with the lead.  This field must be a valid "Property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the lead. |
| `EmailType1` | `string` | N | enum: Work, Home, Other; Email type associated with the lead. This field must be one of the enum values provided below. |
| `Email1` | `string` | N | maxLength=50; minLength=0; Email address associated with the lead. Email addresses will be validated based on the pattern provided. |
| `PhoneType1` | `string` | N | enum: Work, Home, Other; Phone type associated with the lead. This field must be one of the enum values provided below. |
| `PhoneNum1` | `string` | N | maxLength=50; Primary phone number associated with the lead. |
| `NextContactDateTime` | `string(date-time)` | N | Datetime representing the next time the lead should be contacted. |
| `InitialContactDateTime` | `string(date-time)` | N | Datetime representing the first time contact was made with the lead. |
| `Occupation` | `string` | N | maxLength=55; minLength=0; Description of the lead's occupation. |
| `Culture` | `string` | N | enum: Brazilian, Chinese, ChineseSingapore, CzechRepublic, DutchNetherlands, DutchBelgium, EnglishAustralia, EnglishBelgium, EnglishCanada, EnglishIndia, EnglishSingapore, EnglishUnitedKingdom…; The culture of the lead. This field must be one of the enum values provided below. |
| `IndustryId` | `integer(int64)` | N | ID of the industry associated with the lead. |
| `IndustryName` | `string` | N | readOnly; Name of the industry associated with the lead. |
| `ContactType` | `string` | N | enum: Contact, Lead, Member, Guest, Admin, UnreviewedLead; readOnly; Contact Type associated with the lead. |
| `LeadStatusId` | `integer(int64)` | N | ID of the LeadStatus associated with the lead. |
| `IsLeadCreateMode` | `boolean` | N | Lead is create or update mode. |
| `LeadStatusName` | `string` | N | readOnly; Name of the LeadStatus associated with the lead. |
| `LeadStatusChangeReasonId` | `integer(int64)` | N | ID of the LeadStatusChangeReason associated with the LeadStatus. |
| `LeadStatusChangeReasonName` | `string` | N | readOnly; Name of the LeadStatusChangeReason associated with the LeadStatus. |
| `OtherReason` | `string` | N | maxLength=255; minLength=0; Only used when the LeadStatusChangeReason is Other. In other cases, it is ignored. When the LeadStatus type is DeadLead and the LeadStatusChangeReason is Other, this field is required. |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the internal user associated with the lead. This field must be a valid "InternalUser" ID. |
| `SourceMajorId` | `integer(int64)` | N | ID of the source minor associated with the lead. This field must be a valid "LeadSource" ID. |
| `SourceMajorName` | `string` | N | readOnly; Name of the source major associated with the lead. |
| `SourceMinorId` | `integer(int64)` | N | ID of the Source Minor associated with the lead. This field must be a valid "LeadSource" ID. |
| `SourceMinorName` | `string` | N | readOnly; Name of the Source Minor associated with the lead. |
| `SourceOther` | `string` | N | maxLength=50; minLength=0; Description of other source associated with the lead. |
| `ConversionProbability` | `string` | N | enum: Hot, Medium, Cold; Conversion probability of the lead. This field must be one of the enum values provided below. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the lead. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AmenityConfigurationKubeCC, AmenityConfigurationResellerPortal, AmenityConfigurationMemberPortal, AdminPortal, OperatorPortalInternalUser, OperatorPortalMemberInternalUser, Booking, WebService, Api; readOnly; Process that initially created the lead. |
| `CreatedBy` | `string` | N | readOnly; User lead was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime lead was created. |
| `LastModifiedBy` | `string` | N | readOnly; User lead was last modified by. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime lead was last modified. |
| `OptOutMarketing` | `integer(int64)` | N | Default value is 0. 0 = Opted in to marketing communication. 1 = Opted out of marteting communication. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the lead. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the lead. |
| `MailingAddressLine3` | `string` | N | maxLength=255; minLength=0; Mailing address line 3 for the lead. |
| `MailingAddressLine4` | `string` | N | maxLength=255; minLength=0; Mailing address line 4 for the lead. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the lead. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the lead. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the lead. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the lead. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the lead. |
| `OtherAddressLine1` | `string` | N | maxLength=255; minLength=0; Other address line 1 for the lead. |
| `OtherAddressLine2` | `string` | N | maxLength=255; minLength=0; Other address line 2 for the lead. |
| `OtherAddressLine3` | `string` | N | maxLength=255; minLength=0; Other address line 3 for the lead. |
| `OtherAddressLine4` | `string` | N | maxLength=255; minLength=0; Other address line 4 for the lead. |
| `OtherCity` | `string` | N | maxLength=80; minLength=0; Other city for the lead. |
| `OtherState` | `string` | N | maxLength=2; minLength=0; Other state for the lead. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `OtherZip` | `string` | N | maxLength=60; minLength=0; Other zip code for the lead. |
| `OtherCountry` | `string` | N | readOnly; Other country for the lead. |
| `OtherCountryId` | `integer(int64)` | N | Other country id for the lead. |
| `DateOfBirth` | `string(date-time)` | N |  |
| `Custom1` | `string` | N | maxLength=1000; minLength=0; Custom 1 value associated with the contact. |
| `Custom2` | `string` | N | maxLength=1000; minLength=0; Custom 2 value associated with the contact. |
| `Custom3` | `string` | N | maxLength=1000; minLength=0; Custom 3 value associated with the contact. |
| `Custom4` | `string` | N | maxLength=1000; minLength=0; Custom 4 value associated with the contact. |
| `Custom5` | `string` | N | maxLength=1000; minLength=0; Custom 5 value associated with the contact. |
| `Custom6` | `string` | N | maxLength=1000; minLength=0; Custom 6 value associated with the contact. |
| `Custom7` | `string` | N | maxLength=1000; minLength=0; Custom 7 value associated with the contact. |
| `Custom8` | `string` | N | maxLength=1000; minLength=0; Custom 8 value associated with the contact. |
| `Custom9` | `string` | N | maxLength=1000; minLength=0; Custom 9 value associated with the contact. |
| `Custom10` | `string` | N | maxLength=1000; minLength=0; Custom 10 value associated with the contact. |
| `Custom11` | `string` | N | maxLength=1000; minLength=0; Custom 11 value associated with the contact. |
| `Custom12` | `string` | N | maxLength=1000; minLength=0; Custom 12 value associated with the contact. |
| `Custom13` | `string` | N | maxLength=1000; minLength=0; Custom 13 value associated with the contact. |
| `Custom14` | `string` | N | maxLength=1000; minLength=0; Custom 14 value associated with the contact. |
| `Custom15` | `string` | N | maxLength=1000; minLength=0; Custom 15 value associated with the contact. |
| `Custom16` | `string` | N | maxLength=1000; minLength=0; Custom 16 value associated with the contact. |
| `Custom17` | `string` | N | maxLength=1000; minLength=0; Custom 17 value associated with the contact. |
| `Custom18` | `string` | N | maxLength=1000; minLength=0; Custom 18 value associated with the contact. |
| `Custom19` | `string` | N | maxLength=1000; minLength=0; Custom 19 value associated with the contact. |
| `Custom20` | `string` | N | maxLength=1000; minLength=0; Custom 20 value associated with the contact. |

### Model: CompanyMember
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CompanyId` | `integer(int64)` | N | readOnly; ID of the company associated with the member. |
| `CompanyName` | `string` | Y | maxLength=120; minLength=0; Name of the company associated with the member. |
| `AssignedInternalUserId` | `integer(int64)` | Y | ID of the Internal user associated with the member. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the member. |
| `ParentId` | `integer(int64)` | N | readOnly; Member parent id |
| `FirstName` | `string` | Y | maxLength=100; minLength=0; First name of the member. |
| `LastName` | `string` | Y | maxLength=100; minLength=0; Last name of the member. |
| `Title` | `string` | N | enum: Mr, Ms, Mrs; Title (prefix) of the member. This field must be one of the enum values provided below. |
| `UserTypeId` | `integer(int64)` | Y | ID of the user type associated with this member.   This field must be a valid "CompanyUserType" ID. |
| `UserTypeDescription` | `string` | N | readOnly; Description of the user type associated with this member. |
| `PhoneType1` | `string` | N | enum: Work, Home, Other; Phone type associated with the member. This field must be one of the enum values provided below. |
| `PhoneNum1` | `string` | N | maxLength=50; Primary phone number associated with the member. |
| `EmailType1` | `string` | N | enum: Work, Home, Other; Email type associated with the member. This field must be one of the enum values provided below. |
| `Email1` | `string` | Y | maxLength=50; minLength=0; Email address associated with the member. Email addresses will be validated based on the pattern provided. |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the Internal user associated with the member. This field must be a valid "InternalUser" ID. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with the member.  This field must be a valid "Property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the member. |
| `IndustryId` | `integer(int64)` | N | ID of the Industry associated with the member. |
| `IndustryName` | `string` | N | readOnly; Name of the Industry associated with the member. |
| `Occupation` | `string` | N | maxLength=55; minLength=0; Description of the member's occupation. |
| `BookingDiscountGroupId` | `integer(int32)` | N | The Booking Discount Group discounts the booking cost, not the cost of amenities included in the booking. |
| `Culture` | `string` | Y | enum: Brazilian, Chinese, ChineseSingapore, CzechRepublic, DutchNetherlands, DutchBelgium, EnglishAustralia, EnglishBelgium, EnglishCanada, EnglishIndia, EnglishSingapore, EnglishUnitedKingdom…; The culture of the member. This field must be one of the enum values provided below. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the member. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the member. |
| `MailingAddressLine3` | `string` | N | maxLength=255; minLength=0; Mailing address line 3 for the member. |
| `MailingAddressLine4` | `string` | N | maxLength=255; minLength=0; Mailing address line 4 for the member. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the member. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the member.  US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the member. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the member. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the member. |
| `OtherAddressLine1` | `string` | N | maxLength=255; minLength=0; Other address line 1 for the member. |
| `OtherAddressLine2` | `string` | N | maxLength=255; minLength=0; Other address line 2 for the member. |
| `OtherAddressLine3` | `string` | N | maxLength=255; minLength=0; Other address line 3 for the member. |
| `OtherAddressLine4` | `string` | N | maxLength=255; minLength=0; Other address line 4 for the member. |
| `OtherCity` | `string` | N | maxLength=80; minLength=0; Other city for the company |
| `OtherState` | `string` | N | maxLength=2; minLength=0; Other state for the member. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `OtherZip` | `string` | N | maxLength=60; minLength=0; Other zip code for the member. |
| `OtherCountry` | `string` | N | readOnly; Other country for the member. |
| `OtherCountryId` | `integer(int64)` | N | Other country id for the member. |
| `SourceMajorId` | `integer(int64)` | N | ID of the source major associated with the member. This field must be a valid "MemberSource" ID. |
| `SourceMajorName` | `string` | N | readOnly; Name of the Source Major associated with the member. |
| `SourceMinorId` | `integer(int64)` | N | ID of the Source Minor associated with the member. This field must be a valid "MemberSource" ID. |
| `SourceMinorName` | `string` | N | readOnly; Name of the Source Minor associated with the member. |
| `RecordStatus` | `string` | N | enum: Active, Archive; Record status of the member. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AmenityConfigurationKubeCC, AmenityConfigurationResellerPortal, AmenityConfigurationMemberPortal, AdminPortal, OperatorPortalInternalUser, OperatorPortalMemberInternalUser, Booking, WebService, Api; readOnly; Process that initially created the member. |
| `CreatedBy` | `string` | N | readOnly; User member was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime member was created. |
| `LastModifiedBy` | `string` | N | readOnly; User member was last modified by. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime member was last modified. |
| `OptOutMarketing` | `integer(int64)` | N | Default value is 0 0 = Opted in to marketing communication 1 = Opted out of marteting communication |
| `DateOfBirth` | `string(date-time)` | N |  |
| `Custom1` | `string` | N | maxLength=1000; minLength=0; Custom 1 value associated with the contact. |
| `Custom2` | `string` | N | maxLength=1000; minLength=0; Custom 2 value associated with the contact. |
| `Custom3` | `string` | N | maxLength=1000; minLength=0; Custom 3 value associated with the contact. |
| `Custom4` | `string` | N | maxLength=1000; minLength=0; Custom 4 value associated with the contact. |
| `Custom5` | `string` | N | maxLength=1000; minLength=0; Custom 5 value associated with the contact. |
| `Custom6` | `string` | N | maxLength=1000; minLength=0; Custom 6 value associated with the contact. |
| `Custom7` | `string` | N | maxLength=1000; minLength=0; Custom 7 value associated with the contact. |
| `Custom8` | `string` | N | maxLength=1000; minLength=0; Custom 8 value associated with the contact. |
| `Custom9` | `string` | N | maxLength=1000; minLength=0; Custom 9 value associated with the contact. |
| `Custom10` | `string` | N | maxLength=1000; minLength=0; Custom 10 value associated with the contact. |
| `Custom11` | `string` | N | maxLength=1000; minLength=0; Custom 11 value associated with the contact. |
| `Custom12` | `string` | N | maxLength=1000; minLength=0; Custom 12 value associated with the contact. |
| `Custom13` | `string` | N | maxLength=1000; minLength=0; Custom 13 value associated with the contact. |
| `Custom14` | `string` | N | maxLength=1000; minLength=0; Custom 14 value associated with the contact. |
| `Custom15` | `string` | N | maxLength=1000; minLength=0; Custom 15 value associated with the contact. |
| `Custom16` | `string` | N | maxLength=1000; minLength=0; Custom 16 value associated with the contact. |
| `Custom17` | `string` | N | maxLength=1000; minLength=0; Custom 17 value associated with the contact. |
| `Custom18` | `string` | N | maxLength=1000; minLength=0; Custom 18 value associated with the contact. |
| `Custom19` | `string` | N | maxLength=1000; minLength=0; Custom 19 value associated with the contact. |
| `Custom20` | `string` | N | maxLength=1000; minLength=0; Custom 20 value associated with the contact. |

### Model: CompanyUserType
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | Unique identifier of the user type. |
| `Name` | `string` | N | maxLength=255; minLength=0; readOnly; Name of the user type. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the user type. |

### Model: Contact
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CompanyId` | `integer(int64)` | Y | ID of the company associated with the contact. This field must be a valid "Company" ID. NOTE: When using PUT, this field is read-only. |
| `AssignedInternalUserId` | `integer(int64)` | N | ID of the internal user associated with the contact. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the contact. |
| `ParentId` | `integer(int64)` | N | readOnly; Contact parent id |
| `FirstName` | `string` | Y | maxLength=100; minLength=0; First name of the contact. |
| `LastName` | `string` | Y | maxLength=100; minLength=0; Last name of the contact. |
| `Title` | `string` | N | enum: Mr, Ms, Mrs; Title (prefix) of the contact. This field must be one of the enum values provided below. |
| `UserTypeId` | `integer(int64)` | Y | ID of the user type associated with this contact.   This field must be a valid "CompanyUserType" ID. |
| `UserTypeDescription` | `string` | N | readOnly; Description of the user type associated with this contact. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with the contact.  This field must be a valid "Property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the contact. |
| `EmailType1` | `string` | N | enum: Work, Home, Other; Email type associated with the contact. This field must be one of the enum values provided below. |
| `Email1` | `string` | N | maxLength=50; minLength=0; Email address associated with the contact. Email addresses will be validated based on the pattern provided. |
| `PhoneType1` | `string` | N | enum: Work, Home, Other; Phone type associated with the contact. This field must be one of the enum values provided below. |
| `PhoneNum1` | `string` | N | maxLength=50; Primary phone number associated with the contact. |
| `Occupation` | `string` | N | maxLength=55; minLength=0; Description of the contact's occupation. |
| `Culture` | `string` | N | enum: Brazilian, Chinese, ChineseSingapore, CzechRepublic, DutchNetherlands, DutchBelgium, EnglishAustralia, EnglishBelgium, EnglishCanada, EnglishIndia, EnglishSingapore, EnglishUnitedKingdom…; The culture of the contact. This field must be one of the enum values provided below. |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the internal user associated with the contact. This field must be a valid "InternalUser" ID. |
| `CompanyName` | `string` | N | maxLength=120; minLength=0; readOnly; Name of the company associated with the contact. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the contact. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the contact. |
| `MailingAddressLine3` | `string` | N | maxLength=255; minLength=0; Mailing address line 3 for the contact. |
| `MailingAddressLine4` | `string` | N | maxLength=255; minLength=0; Mailing address line 4 for the contact. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the contact. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the contact.    US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the contact. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the contact. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the contact. |
| `OtherAddressLine1` | `string` | N | maxLength=255; minLength=0; Other address line 1 for the contact. |
| `OtherAddressLine2` | `string` | N | maxLength=255; minLength=0; Other address line 2 for the contact. |
| `OtherAddressLine3` | `string` | N | maxLength=255; minLength=0; Other address line 3 for the contact. |
| `OtherAddressLine4` | `string` | N | maxLength=255; minLength=0; Other address line 4 for the contact. |
| `OtherCity` | `string` | N | maxLength=80; minLength=0; Other city for the contact. |
| `OtherState` | `string` | N | maxLength=2; minLength=0; Other state for the contact.   US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `OtherZip` | `string` | N | maxLength=60; minLength=0; Other zip code for the contact. |
| `OtherCountry` | `string` | N | readOnly; Other country for the contact. |
| `OtherCountryId` | `integer(int64)` | N | Other country id for the contact. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the contact. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AmenityConfigurationKubeCC, AmenityConfigurationResellerPortal, AmenityConfigurationMemberPortal, AdminPortal, OperatorPortalInternalUser, OperatorPortalMemberInternalUser, Booking, WebService, Api; readOnly; Process that initially created the contact. |
| `CreatedBy` | `string` | N | readOnly; User contact was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime contact was created. |
| `LastModifiedBy` | `string` | N | readOnly; User contact was last modified by. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime contact was last modified. |
| `OptOutMarketing` | `integer(int64)` | N | Default value is 0 0 = Opted in to marketing communication 1 = Opted out of marteting communication |
| `DateOfBirth` | `string(date-time)` | N |  |
| `Custom1` | `string` | N | maxLength=1000; minLength=0; Custom 1 value associated with the contact. |
| `Custom2` | `string` | N | maxLength=1000; minLength=0; Custom 2 value associated with the contact. |
| `Custom3` | `string` | N | maxLength=1000; minLength=0; Custom 3 value associated with the contact. |
| `Custom4` | `string` | N | maxLength=1000; minLength=0; Custom 4 value associated with the contact. |
| `Custom5` | `string` | N | maxLength=1000; minLength=0; Custom 5 value associated with the contact. |
| `Custom6` | `string` | N | maxLength=1000; minLength=0; Custom 6 value associated with the contact. |
| `Custom7` | `string` | N | maxLength=1000; minLength=0; Custom 7 value associated with the contact. |
| `Custom8` | `string` | N | maxLength=1000; minLength=0; Custom 8 value associated with the contact. |
| `Custom9` | `string` | N | maxLength=1000; minLength=0; Custom 9 value associated with the contact. |
| `Custom10` | `string` | N | maxLength=1000; minLength=0; Custom 10 value associated with the contact. |
| `Custom11` | `string` | N | maxLength=1000; minLength=0; Custom 11 value associated with the contact. |
| `Custom12` | `string` | N | maxLength=1000; minLength=0; Custom 12 value associated with the contact. |
| `Custom13` | `string` | N | maxLength=1000; minLength=0; Custom 13 value associated with the contact. |
| `Custom14` | `string` | N | maxLength=1000; minLength=0; Custom 14 value associated with the contact. |
| `Custom15` | `string` | N | maxLength=1000; minLength=0; Custom 15 value associated with the contact. |
| `Custom16` | `string` | N | maxLength=1000; minLength=0; Custom 16 value associated with the contact. |
| `Custom17` | `string` | N | maxLength=1000; minLength=0; Custom 17 value associated with the contact. |
| `Custom18` | `string` | N | maxLength=1000; minLength=0; Custom 18 value associated with the contact. |
| `Custom19` | `string` | N | maxLength=1000; minLength=0; Custom 19 value associated with the contact. |
| `Custom20` | `string` | N | maxLength=1000; minLength=0; Custom 20 value associated with the contact. |

### Model: Contract
| Field | Type | Required | Notes |
|---|---|---:|---|
| `ContractId` | `integer(int64)` | N | readOnly; Unique identifier of the contract. |
| `ContractName` | `string` | Y | maxLength=100; minLength=0; Contract Name |
| `PropertyId` | `integer(int64)` | Y | Contract property id |
| `PropertyName` | `string` | N | maxLength=120; minLength=0; readOnly; Contract Property name |
| `CompanyId` | `integer(int64)` | Y | Contract company id |
| `CompanyName` | `string` | N | maxLength=120; minLength=0; readOnly; Contract company name |
| `ContactId` | `integer(int64)` | Y | Contract Member id |
| `ContractAssignee` | `string` | N | maxLength=120; minLength=0; readOnly; Contract contact name |
| `ActiveProposalId` | `integer(int64)` | N | readOnly; Active Proposal Id |
| `DefaultProposalId` | `integer(int64)` | N | readOnly; Default Proposal Id |
| `Email` | `string` | N | maxLength=255; minLength=0; readOnly; Email of Contract Assignee |
| `Phone` | `string` | N | maxLength=20; minLength=0; readOnly; Phone of Contract Assignee |
| `BillOnRenew` | `integer(int32)` | N | Bill on Renew |
| `TerminationDate` | `string(date-time)` | N | readOnly; Contract Termination Date |
| `TerminationType` | `integer(int32)` | N | readOnly; Contract Termination Type |
| `Bobjstate` | `string` | N | enum: Active, Archive; readOnly; Contract Bobjstate |
| `YSignStatus` | `integer(int32)` | N | readOnly; Contract Ysign Status |
| `OrderId` | `integer(int64)` | N | readOnly; Contract OrderId |
| `PropertyCurrencySymbol` | `string` | N | maxLength=50; minLength=0; readOnly; Property Currency Symbol |
| `ExternalReferenceID` | `string` | N | maxLength=50; minLength=0; readOnly; External Reference ID |
| `Proposals` | `Array<Proposal>` | Y | List of Proposals |
| `MoveInDate` | `string(date-time)` | N | readOnly; Contract Move in Date. |
| `MoveOutDate` | `string(date-time)` | N | readOnly; Contract Move in Date. |
| `RenewalNumberOfMonths` | `integer(int32)` | N |  |
| `RenewalExpirationNumberOfTimes` | `integer(int32)` | N |  |
| `RenewalCustomPricing` | `number(double)` | N |  |
| `TermType` | `integer(int64)` | Y | Contract Term Type |
| `NTVDays` | `integer(int64)` | Y | Contract Member id |

### Model: Country
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | Y | Unique identifier of the country. |
| `Name` | `string` | Y | maxLength=42; minLength=0; Name of the country. |
| `Code` | `string` | Y | maxLength=50; minLength=0; Code of the country. |

### Model: CustomTierPricing
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CustomTierPricingId` | `integer(int64)` | N | readOnly; Custom Tier Pricing Id |
| `OrderDetailId` | `integer(int64)` | N | readOnly; Order Detail Id |
| `EffectiveMonth` | `string(date-time)` | N | readOnly; Effective Month |
| `EffectiveMonthTo` | `string(date-time)` | N | readOnly; Effective Month To |
| `DiscountType` | `integer(int64)` | N | Discount Type |
| `DiscountValue` | `number(double)` | N | Discount Value |
| `DiscountedUnitPrice` | `number(double)` | N | Discount Unit Price |

### Model: Deposit
| Field | Type | Required | Notes |
|---|---|---:|---|
| `DepositId` | `integer(int64)` | N | readOnly; DepositId . |
| `LegalEntityId` | `integer(int64)` | N | readOnly; LegalEntityId . |
| `LegalEntityName` | `string` | N | readOnly; LegalEntityName. |
| `LegalEntityCode` | `string` | N | readOnly; LegalEntityCode. |
| `PropertyId` | `integer(int64)` | N | readOnly; ID . |
| `PropertyName` | `string` | N | readOnly; PropertyName. |
| `PropertyCode` | `string` | N | readOnly; PropertyCode. |
| `CompanyId` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `CompanyName` | `string` | N | readOnly; Name of the company. |
| `CompanyCode` | `string` | N | readOnly; CompanyCode. |
| `PropertyExternalReference` | `string` | N | readOnly; external reference of the property. |
| `CompanyExternalReference` | `string` | N | readOnly; external reference of the company. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; CreatedDatetime. |
| `Currency` | `string` | N | readOnly; Currency. |
| `DepositDate` | `string(date-time)` | N | readOnly; DepositDate. |
| `PaymentDate` | `string(date-time)` | N | readOnly; Payment Date. |
| `DepositReference` | `string` | N | readOnly; DepositReference. |
| `PaymentReference` | `string` | N | readOnly; PaymentReference. |
| `PaymentStatus` | `string` | N | readOnly; Payment Status. |
| `PaymentMethod` | `string` | N | readOnly; Payment method. |
| `DepositAmount` | `number(double)` | N | readOnly; Deposit Amount. |

### Model: Event
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the event. |
| `Name` | `string` | Y | Name of the event. |
| `PropertyId` | `integer(int64)` | Y | Unique identifier of the event. |
| `PropertyName` | `string` | Y | Property Name of the event. |
| `Description` | `string` | N | readOnly; Description of the event. |
| `Spaces` | `string` | N | readOnly; Spaces of the event. |
| `Image` | `string` | N | readOnly; Image of the event. |
| `StartDate` | `string(date-time)` | Y | Start Date of the event. |
| `EndDate` | `string(date-time)` | Y | End Date of the event. |
| `MaxNumberOfPeople` | `integer(int32)` | N | readOnly; MaxNumberOfPeople of the event. |
| `Category` | `string` | N | readOnly; Category of the event. |

### Model: EventDiscussion
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the event discussion. |
| `MemberId` | `integer(int64)` | Y | Unique identifier of the event discussion creating member. |
| `Comment` | `string` | Y | Comment added in event discussion. |
| `FirstName` | `string` | N | readOnly; First Name of the Member who added comment in event discussion. |
| `LastName` | `string` | N | readOnly; Last Name of the Member who added comment in event discussion. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime when comment was added in event discussion. |

### Model: EventGuestList
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the event guest Member. |
| `FirstName` | `string` | N | readOnly; First Name of the Member of event list guest. |
| `LastName` | `string` | N | readOnly; Last Name of the Member of event list guest. |
| `RsvpStatus` | `string` | N | enum: Going, AddToWaitlist, CannotGo; readOnly; Rsvp Status of event guest. |

### Model: EventRsvp
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the event rsvp. |
| `MemberId` | `integer(int64)` | Y | Unique identifier of the event rsvp creating member. |
| `RsvpStatus` | `string` | Y | enum: Going, AddToWaitlist, CannotGo; Rsvp Status Going, AddToWaitlist, CannotGo. |

### Model: Industry
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the industry associated with the lead. |
| `IndustryName` | `string` | N | readOnly; Name of the industry associated with the lead. |

### Model: InternalUser
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | Unique identifier of the internal user. |
| `FirstName` | `string` | N | maxLength=100; minLength=0; readOnly; First name of internal user. |
| `LastName` | `string` | N | maxLength=100; minLength=0; readOnly; Last name of internal user. |

### Model: Invoice
| Field | Type | Required | Notes |
|---|---|---:|---|
| `InvoiceId` | `integer(int64)` | N | readOnly; Unique identifier of the invoice. |
| `InvoiceNumber` | `integer(int64)` | N | Unique identifier of the invoice. |
| `Amount` | `number(double)` | N | Invoice amount. |
| `CompanyId` | `integer(int64)` | N | Contct company id. |
| `PropertyId` | `integer(int64)` | N |  |
| `MemberId` | `integer(int64)` | N |  |
| `CompanyName` | `string` | N |  |
| `PropertyName` | `string` | N |  |
| `Email` | `string` | N |  |
| `InvoiceDate` | `string(date-time)` | N |  |
| `FileName` | `string` | N |  |
| `OPEN` | `string` | N |  |
| `CompanyVoyagerId` | `integer(int64)` | N |  |
| `PaymentStatus` | `string` | N |  |
| `TotalAmount` | `number(double)` | N |  |
| `AmountPaid` | `number(double)` | N |  |
| `DueDate` | `string(date-time)` | N |  |
| `InvoiceStatus` | `integer(int32)` | N |  |
| `NextPaymentDate` | `string(date-time)` | N |  |
| `ChargeDate` | `string(date-time)` | N |  |
| `PostMonth` | `string(date-time)` | N |  |
| `PropertyCurrencySymbol` | `string` | N |  |
| `PropertyCurrencyId` | `integer(int64)` | N |  |

### Model: InvoiceDetail
| Field | Type | Required | Notes |
|---|---|---:|---|
| `LegalEntityId` | `integer(int64)` | N | readOnly; ID . |
| `LegalEntityName` | `string` | N | readOnly; Name of the company. |
| `LegalEntityCode` | `string` | N | readOnly; Name of the company. |
| `PropertyId` | `integer(int64)` | N | readOnly; ID . |
| `PropertyName` | `string` | N | readOnly; Name of the company. |
| `PropertyCode` | `string` | N | readOnly; Name of the company. |
| `PropertyExternalReference` | `string` | N | readOnly; Name of the company. |
| `CompanyId` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `CompanyName` | `string` | N | readOnly; Name of the company. |
| `CompanyCode` | `string` | N | readOnly; Name of the company. |
| `CompanyExternalReference` | `string` | N | readOnly; external reference of the company. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `InvoiceId` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `InvoiceNumber` | `string` | N | readOnly; external reference of the company. |
| `InvoiceType` | `string` | N | readOnly; external reference of the company. |
| `RelatedInvoiceId` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `InvoiceDate` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `Currency` | `string` | N | readOnly; Name of the company. |
| `InvoiceAmount` | `number(double)` | N | readOnly; Name of the company. |
| `Lines` | `Array<InvoiceDetailLine>` | N | readOnly; Name of the company. |

### Model: InvoiceDetailLine
| Field | Type | Required | Notes |
|---|---|---:|---|
| `ChargeDetailId` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `ChargeDate` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `FromDate` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `ToDate` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `GLExternalReference` | `string` | N | readOnly; Name of the company. |
| `Description` | `string` | N | readOnly; Name of the company. |
| `Quantity` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `UnitPrice` | `number(double)` | N | readOnly; Name of the company. |
| `TaxableAmount` | `number(double)` | N | readOnly; Name of the company. |
| `TotalTaxAmount` | `number(double)` | N | readOnly; Name of the company. |
| `TotalAmount` | `number(double)` | N | readOnly; Name of the company. |
| `ReferenceText` | `string` | N | readOnly; Name of the company. |

### Model: Lead
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CompanyId` | `integer(int64)` | Y | ID of the company associated with the lead. This field must be a valid "Company" ID. NOTE: When using PUT, this field is read-only. |
| `AssignedInternalUserId` | `integer(int64)` | N | ID of the internal user associated with the lead. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the lead. |
| `ParentId` | `integer(int64)` | N | readOnly; Lead parent id |
| `FirstName` | `string` | Y | maxLength=100; minLength=0; First name of the lead. |
| `LastName` | `string` | Y | maxLength=100; minLength=0; Last name of the lead. |
| `Title` | `string` | N | enum: Mr, Ms, Mrs; Title (prefix) of the lead. This field must be one of the enum values provided below. |
| `UserTypeId` | `integer(int64)` | Y | ID of the user type associated with this lead.   This field must be a valid "CompanyUserType" ID. |
| `UserTypeDescription` | `string` | N | readOnly; Description of the user type associated with this lead. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with the lead.  This field must be a valid "Property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the lead. |
| `EmailType1` | `string` | N | enum: Work, Home, Other; Email type associated with the lead. This field must be one of the enum values provided below. |
| `Email1` | `string` | N | maxLength=50; minLength=0; Email address associated with the lead. Email addresses will be validated based on the pattern provided. |
| `PhoneType1` | `string` | N | enum: Work, Home, Other; Phone type associated with the lead. This field must be one of the enum values provided below. |
| `PhoneNum1` | `string` | N | maxLength=50; Primary phone number associated with the lead. |
| `NextContactDateTime` | `string(date-time)` | N | Datetime representing the next time the lead should be contacted. |
| `InitialContactDateTime` | `string(date-time)` | N | Datetime representing the first time contact was made with the lead. |
| `Occupation` | `string` | N | maxLength=55; minLength=0; Description of the lead's occupation. |
| `Culture` | `string` | N | enum: Brazilian, Chinese, ChineseSingapore, CzechRepublic, DutchNetherlands, DutchBelgium, EnglishAustralia, EnglishBelgium, EnglishCanada, EnglishIndia, EnglishSingapore, EnglishUnitedKingdom…; The culture of the lead. This field must be one of the enum values provided below. |
| `IndustryId` | `integer(int64)` | N | ID of the industry associated with the lead. |
| `IndustryName` | `string` | N | readOnly; Name of the industry associated with the lead. |
| `ContactType` | `string` | N | enum: Contact, Lead, Member, Guest, Admin, UnreviewedLead; readOnly; Contact Type associated with the lead. |
| `LeadStatusId` | `integer(int64)` | N | ID of the LeadStatus associated with the lead. |
| `IsLeadCreateMode` | `boolean` | N | Lead is create or update mode. |
| `LeadStatusName` | `string` | N | readOnly; Name of the LeadStatus associated with the lead. |
| `LeadStatusChangeReasonId` | `integer(int64)` | N | ID of the LeadStatusChangeReason associated with the LeadStatus. |
| `LeadStatusChangeReasonName` | `string` | N | readOnly; Name of the LeadStatusChangeReason associated with the LeadStatus. |
| `OtherReason` | `string` | N | maxLength=255; minLength=0; Only used when the LeadStatusChangeReason is Other. In other cases, it is ignored. When the LeadStatus type is DeadLead and the LeadStatusChangeReason is Other, this field is required. |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the internal user associated with the lead. This field must be a valid "InternalUser" ID. |
| `SourceMajorId` | `integer(int64)` | N | ID of the source minor associated with the lead. This field must be a valid "LeadSource" ID. |
| `SourceMajorName` | `string` | N | readOnly; Name of the source major associated with the lead. |
| `SourceMinorId` | `integer(int64)` | N | ID of the Source Minor associated with the lead. This field must be a valid "LeadSource" ID. |
| `SourceMinorName` | `string` | N | readOnly; Name of the Source Minor associated with the lead. |
| `SourceOther` | `string` | N | maxLength=50; minLength=0; Description of other source associated with the lead. |
| `ConversionProbability` | `string` | N | enum: Hot, Medium, Cold; Conversion probability of the lead. This field must be one of the enum values provided below. |
| `CompanyName` | `string` | N | maxLength=120; minLength=0; readOnly; Name of the company associated with the lead. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the lead. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AmenityConfigurationKubeCC, AmenityConfigurationResellerPortal, AmenityConfigurationMemberPortal, AdminPortal, OperatorPortalInternalUser, OperatorPortalMemberInternalUser, Booking, WebService, Api; readOnly; Process that initially created the lead. |
| `CreatedBy` | `string` | N | readOnly; User lead was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime lead was created. |
| `LastModifiedBy` | `string` | N | readOnly; User lead was last modified by. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime lead was last modified. |
| `OptOutMarketing` | `integer(int64)` | N | Default value is 0. 0 = Opted in to marketing communication. 1 = Opted out of marteting communication. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the lead. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the lead. |
| `MailingAddressLine3` | `string` | N | maxLength=255; minLength=0; Mailing address line 3 for the lead. |
| `MailingAddressLine4` | `string` | N | maxLength=255; minLength=0; Mailing address line 4 for the lead. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the lead. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the lead. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the lead. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the lead. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the lead. |
| `OtherAddressLine1` | `string` | N | maxLength=255; minLength=0; Other address line 1 for the lead. |
| `OtherAddressLine2` | `string` | N | maxLength=255; minLength=0; Other address line 2 for the lead. |
| `OtherAddressLine3` | `string` | N | maxLength=255; minLength=0; Other address line 3 for the lead. |
| `OtherAddressLine4` | `string` | N | maxLength=255; minLength=0; Other address line 4 for the lead. |
| `OtherCity` | `string` | N | maxLength=80; minLength=0; Other city for the lead. |
| `OtherState` | `string` | N | maxLength=2; minLength=0; Other state for the lead. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `OtherZip` | `string` | N | maxLength=60; minLength=0; Other zip code for the lead. |
| `OtherCountry` | `string` | N | readOnly; Other country for the lead. |
| `OtherCountryId` | `integer(int64)` | N | Other country id for the lead. |
| `DateOfBirth` | `string(date-time)` | N |  |
| `Custom1` | `string` | N | maxLength=1000; minLength=0; Custom 1 value associated with the contact. |
| `Custom2` | `string` | N | maxLength=1000; minLength=0; Custom 2 value associated with the contact. |
| `Custom3` | `string` | N | maxLength=1000; minLength=0; Custom 3 value associated with the contact. |
| `Custom4` | `string` | N | maxLength=1000; minLength=0; Custom 4 value associated with the contact. |
| `Custom5` | `string` | N | maxLength=1000; minLength=0; Custom 5 value associated with the contact. |
| `Custom6` | `string` | N | maxLength=1000; minLength=0; Custom 6 value associated with the contact. |
| `Custom7` | `string` | N | maxLength=1000; minLength=0; Custom 7 value associated with the contact. |
| `Custom8` | `string` | N | maxLength=1000; minLength=0; Custom 8 value associated with the contact. |
| `Custom9` | `string` | N | maxLength=1000; minLength=0; Custom 9 value associated with the contact. |
| `Custom10` | `string` | N | maxLength=1000; minLength=0; Custom 10 value associated with the contact. |
| `Custom11` | `string` | N | maxLength=1000; minLength=0; Custom 11 value associated with the contact. |
| `Custom12` | `string` | N | maxLength=1000; minLength=0; Custom 12 value associated with the contact. |
| `Custom13` | `string` | N | maxLength=1000; minLength=0; Custom 13 value associated with the contact. |
| `Custom14` | `string` | N | maxLength=1000; minLength=0; Custom 14 value associated with the contact. |
| `Custom15` | `string` | N | maxLength=1000; minLength=0; Custom 15 value associated with the contact. |
| `Custom16` | `string` | N | maxLength=1000; minLength=0; Custom 16 value associated with the contact. |
| `Custom17` | `string` | N | maxLength=1000; minLength=0; Custom 17 value associated with the contact. |
| `Custom18` | `string` | N | maxLength=1000; minLength=0; Custom 18 value associated with the contact. |
| `Custom19` | `string` | N | maxLength=1000; minLength=0; Custom 19 value associated with the contact. |
| `Custom20` | `string` | N | maxLength=1000; minLength=0; Custom 20 value associated with the contact. |

### Model: LeadSource
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the major/minor source. |
| `Name` | `string` | N | readOnly; Name of the major/minor source. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the lead. |

### Model: LeadSourceMinor
| Field | Type | Required | Notes |
|---|---|---:|---|
| `LeadSourceId` | `integer(int64)` | N | readOnly; Unique identifier of the major source. |
| `LeadSourceName` | `string` | N | readOnly; Name of the major source. |
| `MinorId` | `integer(int64)` | N | readOnly; Unique identifier of the minor source. |
| `MinorName` | `string` | N | readOnly; Name of the minor source. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the lead. |

### Model: LeadStatus
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the LeadStatus. |
| `Name` | `string` | N | readOnly; Name of the LeadStatus. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the LeadStatus. |

### Model: LeadStatusChangeReason
| Field | Type | Required | Notes |
|---|---|---:|---|
| `LeadStatusId` | `integer(int64)` | N | readOnly; Unique identifier of the LeadStatus. |
| `LeadStatusName` | `string` | N | readOnly; Name of the LeadStatus. |
| `LeadStatusChangeReasonId` | `integer(int64)` | N | readOnly; Unique identifier of the LeadStatusChangeReasonId. |
| `LeadStatusChangeReasonName` | `string` | N | readOnly; Name of the LeadStatusChangeReasonName. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the LeadStatus. |

### Model: ListDataOfActivityActivities
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<ActivityActivities>` | N |  |

### Model: ListDataOfActivityEvents
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<ActivityEvents>` | N |  |

### Model: ListDataOfActivityNotes
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<ActivityNotes>` | N |  |

### Model: ListDataOfActivityTours
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<ActivityTours>` | N |  |

### Model: ListDataOfBookingDiscountGroup
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<BookingDiscountGroup>` | N |  |

### Model: ListDataOfCompanyUserType
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<CompanyUserType>` | N |  |

### Model: ListDataOfCountry
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Country>` | N |  |

### Model: ListDataOfIndustry
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Industry>` | N |  |

### Model: ListDataOfInternalUser
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<InternalUser>` | N |  |

### Model: ListDataOfLeadSource
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<LeadSource>` | N |  |

### Model: ListDataOfLeadSourceMinor
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<LeadSourceMinor>` | N |  |

### Model: ListDataOfLeadStatus
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<LeadStatus>` | N |  |

### Model: ListDataOfLeadStatusChangeReason
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<LeadStatusChangeReason>` | N |  |

### Model: ListDataOfMasterSetup
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<MasterSetup>` | N |  |

### Model: ListDataOfMasterSetupMinor
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<MasterSetupMinor>` | N |  |

### Model: ListDataOfPhoneNumber
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<PhoneNumber>` | N |  |

### Model: ListDataOfProperty
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Property>` | N |  |

### Model: ListDataOfSpaceType
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<SpaceType>` | N |  |

### Model: ListDataOfString
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<string>` | N |  |

### Model: ListPageOfAmenity
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Amenity>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfBooking
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Booking>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfCardModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<CardModel>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfChargeModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<ChargeModel>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfCompany
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Company>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfContact
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Contact>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfContract
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Contract>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfDeposit
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Deposit>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfEvent
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Event>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfInvoice
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Invoice>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfInvoiceDetail
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<InvoiceDetail>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfLead
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Lead>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfMember
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Member>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfReceiptModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<ReceiptModel>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfRefund
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Refund>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfSpace
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Space>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfSpaceAmenities
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<SpaceAmenities>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfSpaceAvailability
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<SpaceAvailability>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfSpacePricing
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<SpacePricing>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: ListPageOfSupport
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Data` | `Array<Support>` | N |  |
| `PageLinks` | `PageLinkBuilder` | N |  |
| `TotalRows` | `integer(int64)` | N |  |

### Model: MasterSetup
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the major/minor source. |
| `Name` | `string` | N | readOnly; Name of the major/minor source. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the lead. |

### Model: MasterSetupMinor
| Field | Type | Required | Notes |
|---|---|---:|---|
| `MasterSetupId` | `integer(int64)` | N | readOnly; Unique identifier of the major source. |
| `MasterSetupName` | `string` | N | readOnly; Name of the major source. |
| `MinorId` | `integer(int64)` | N | readOnly; Unique identifier of the minor source. |
| `MinorName` | `string` | N | readOnly; Name of the minor source. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the lead. |

### Model: Member
| Field | Type | Required | Notes |
|---|---|---:|---|
| `CompanyId` | `integer(int64)` | Y | ID of the company associated with the member. This field must be a valid "Company" ID. NOTE: When using PUT, this field is read-only. |
| `AssignedInternalUserId` | `integer(int64)` | N | ID of the Internal user associated with the member. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the member. |
| `ParentId` | `integer(int64)` | N | readOnly; Member parent id |
| `FirstName` | `string` | Y | maxLength=100; minLength=0; First name of the member. |
| `LastName` | `string` | Y | maxLength=100; minLength=0; Last name of the member. |
| `Title` | `string` | N | enum: Mr, Ms, Mrs; Title (prefix) of the member. This field must be one of the enum values provided below. |
| `CompanyName` | `string` | N | maxLength=120; minLength=0; readOnly; Name of the company associated with the member. |
| `UserTypeId` | `integer(int64)` | Y | ID of the user type associated with this member.   This field must be a valid "CompanyUserType" ID. |
| `UserTypeDescription` | `string` | N | readOnly; Description of the user type associated with this member. |
| `PhoneType1` | `string` | N | enum: Work, Home, Other; Phone type associated with the member. This field must be one of the enum values provided below. |
| `PhoneNum1` | `string` | N | maxLength=50; Primary phone number associated with the member. |
| `EmailType1` | `string` | N | enum: Work, Home, Other; Email type associated with the member. This field must be one of the enum values provided below. |
| `Email1` | `string` | Y | maxLength=50; minLength=0; Email address associated with the member. Email addresses will be validated based on the pattern provided. |
| `AssignedInternalUserName` | `string` | N | readOnly; Name of the Internal user associated with the member. This field must be a valid "InternalUser" ID. |
| `PropertyId` | `integer(int64)` | Y | ID of the property associated with the member.  This field must be a valid "Property" ID. |
| `PropertyName` | `string` | N | readOnly; Name of the property associated with the member. |
| `IndustryId` | `integer(int64)` | N | ID of the Industry associated with the member. |
| `IndustryName` | `string` | N | readOnly; Name of the Industry associated with the member. |
| `Occupation` | `string` | N | maxLength=55; minLength=0; Description of the member's occupation. |
| `BookingDiscountGroupId` | `integer(int32)` | N | The Booking Discount Group discounts the booking cost, not the cost of amenities included in the booking. |
| `Culture` | `string` | Y | enum: Brazilian, Chinese, ChineseSingapore, CzechRepublic, DutchNetherlands, DutchBelgium, EnglishAustralia, EnglishBelgium, EnglishCanada, EnglishIndia, EnglishSingapore, EnglishUnitedKingdom…; The culture of the member. This field must be one of the enum values provided below. |
| `MailingAddressLine1` | `string` | N | maxLength=255; minLength=0; Mailing address line 1 for the member. |
| `MailingAddressLine2` | `string` | N | maxLength=255; minLength=0; Mailing address line 2 for the member. |
| `MailingAddressLine3` | `string` | N | maxLength=255; minLength=0; Mailing address line 3 for the member. |
| `MailingAddressLine4` | `string` | N | maxLength=255; minLength=0; Mailing address line 4 for the member. |
| `MailingCity` | `string` | N | maxLength=80; minLength=0; Mailing city for the member. |
| `MailingState` | `string` | N | maxLength=2; minLength=0; Mailing state for the member.  US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `MailingZip` | `string` | N | maxLength=60; minLength=0; Mailing zip code for the member. |
| `MailingCountry` | `string` | N | readOnly; Mailing country for the member. |
| `MailingCountryId` | `integer(int64)` | N | Mailing country id for the member. |
| `OtherAddressLine1` | `string` | N | maxLength=255; minLength=0; Other address line 1 for the member. |
| `OtherAddressLine2` | `string` | N | maxLength=255; minLength=0; Other address line 2 for the member. |
| `OtherAddressLine3` | `string` | N | maxLength=255; minLength=0; Other address line 3 for the member. |
| `OtherAddressLine4` | `string` | N | maxLength=255; minLength=0; Other address line 4 for the member. |
| `OtherCity` | `string` | N | maxLength=80; minLength=0; Other city for the company |
| `OtherState` | `string` | N | maxLength=2; minLength=0; Other state for the member. US: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"] Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "ON", "PE", "QC", "SK", "YT"] |
| `OtherZip` | `string` | N | maxLength=60; minLength=0; Other zip code for the member. |
| `OtherCountry` | `string` | N | readOnly; Other country for the member. |
| `OtherCountryId` | `integer(int64)` | N | Other country id for the member. |
| `SourceMajorId` | `integer(int64)` | N | ID of the source major associated with the member. This field must be a valid "MemberSource" ID. |
| `SourceMajorName` | `string` | N | readOnly; Name of the Source Major associated with the member. |
| `SourceMinorId` | `integer(int64)` | N | ID of the Source Minor associated with the member. This field must be a valid "MemberSource" ID. |
| `SourceMinorName` | `string` | N | readOnly; Name of the Source Minor associated with the member. |
| `RecordStatus` | `string` | N | enum: Active, Archive; Record status of the member. This field must be one of the enum values provided below. |
| `CreatedFrom` | `string` | N | enum: OperatorPortal, ProspectPortal, Import, AmenityConfigurationKubeCC, AmenityConfigurationResellerPortal, AmenityConfigurationMemberPortal, AdminPortal, OperatorPortalInternalUser, OperatorPortalMemberInternalUser, Booking, WebService, Api; readOnly; Process that initially created the member. |
| `CreatedBy` | `string` | N | readOnly; User member was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime member was created. |
| `LastModifiedBy` | `string` | N | readOnly; User member was last modified by. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime member was last modified. |
| `OptOutMarketing` | `integer(int64)` | N | Default value is 0 0 = Opted in to marketing communication 1 = Opted out of marteting communication |
| `DateOfBirth` | `string(date-time)` | N |  |
| `Custom1` | `string` | N | maxLength=1000; minLength=0; Custom 1 value associated with the contact. |
| `Custom2` | `string` | N | maxLength=1000; minLength=0; Custom 2 value associated with the contact. |
| `Custom3` | `string` | N | maxLength=1000; minLength=0; Custom 3 value associated with the contact. |
| `Custom4` | `string` | N | maxLength=1000; minLength=0; Custom 4 value associated with the contact. |
| `Custom5` | `string` | N | maxLength=1000; minLength=0; Custom 5 value associated with the contact. |
| `Custom6` | `string` | N | maxLength=1000; minLength=0; Custom 6 value associated with the contact. |
| `Custom7` | `string` | N | maxLength=1000; minLength=0; Custom 7 value associated with the contact. |
| `Custom8` | `string` | N | maxLength=1000; minLength=0; Custom 8 value associated with the contact. |
| `Custom9` | `string` | N | maxLength=1000; minLength=0; Custom 9 value associated with the contact. |
| `Custom10` | `string` | N | maxLength=1000; minLength=0; Custom 10 value associated with the contact. |
| `Custom11` | `string` | N | maxLength=1000; minLength=0; Custom 11 value associated with the contact. |
| `Custom12` | `string` | N | maxLength=1000; minLength=0; Custom 12 value associated with the contact. |
| `Custom13` | `string` | N | maxLength=1000; minLength=0; Custom 13 value associated with the contact. |
| `Custom14` | `string` | N | maxLength=1000; minLength=0; Custom 14 value associated with the contact. |
| `Custom15` | `string` | N | maxLength=1000; minLength=0; Custom 15 value associated with the contact. |
| `Custom16` | `string` | N | maxLength=1000; minLength=0; Custom 16 value associated with the contact. |
| `Custom17` | `string` | N | maxLength=1000; minLength=0; Custom 17 value associated with the contact. |
| `Custom18` | `string` | N | maxLength=1000; minLength=0; Custom 18 value associated with the contact. |
| `Custom19` | `string` | N | maxLength=1000; minLength=0; Custom 19 value associated with the contact. |
| `Custom20` | `string` | N | maxLength=1000; minLength=0; Custom 20 value associated with the contact. |

### Model: MemberInfo
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; ID of the member. |
| `CompanyId` | `integer(int64)` | N | readOnly; ID of the company associated with the member. |
| `CompanyName` | `string` | N | readOnly; Name of the company associated with the member. |
| `PrimaryContactId` | `integer(int64)` | N | readOnly; PrimaryID of the company associated with the member. |
| `OperatorID` | `integer(int64)` | N | readOnly; OperatorID of the company associated with the member. |
| `OperatorName` | `string` | N | readOnly; Operator Name of the company associated with the member. |
| `Role` | `Array<string>` | N | readOnly; Member role base on company. |
| `SystemOfRecord` | `string` | N | enum: Kube, WeWork; Company associated with. |

### Model: OrderDetail
| Field | Type | Required | Notes |
|---|---|---:|---|
| `OrderDetailId` | `integer(int64)` | N | readOnly; Order Detail Id |
| `RetailPrice` | `number(double)` | N | readOnly; Retail Price of Item |
| `ContractPrice` | `number(double)` | Y | Contract Price of Item |
| `TotalOrderQty` | `number(double)` | Y | Total Order Qty of Item |
| `TotalAmount` | `number(double)` | N | readOnly; Total Amount of Item |
| `TotalSetupFee` | `number(double)` | N | readOnly; Total Setup Fee of Item |
| `UnitSecurityDeposit` | `number(double)` | N | Total Security Deposit of Item |
| `UnitSetupFee` | `number(double)` | N | Total Setup Fee of Item |
| `TotalSecurityDeposit` | `number(double)` | N | readOnly; Total Security Deposit of Item |
| `BookingId` | `integer(int64)` | N | readOnly; Booking Id |
| `AmenityId` | `integer(int64)` | N | Amenity Id |
| `SpaceId` | `integer(int64)` | N | Space Id |
| `IsRecurringValue` | `string` | Y | maxLength=100; minLength=0; Monthly or One Time Line Item |
| `AmenityName` | `string` | N | maxLength=100; minLength=0; readOnly; Amenity Name |
| `AmenityType` | `string` | N | enum: StandardService, MemberHours, CompanyHours, MemberCredits, CompanyCredits, CoWorkingDaily, CoWorkingHourly, MemberData, CompanyData, Voice, Package, OneTimePassword…; readOnly; Amenity Type |
| `TotalRecommendedAmenitiesCount` | `integer(int64)` | N | readOnly; Total Recommended Amenities Count |
| `SpaceName` | `string` | N | maxLength=100; minLength=0; readOnly; Space Name |
| `SpaceNumber` | `string` | N | maxLength=100; minLength=0; readOnly; Space Number |
| `SpaceMaxCapacity` | `integer(int64)` | N | readOnly; Space Max Capacity |
| `SpaceSquareFootage` | `number(double)` | N | readOnly; Space Square Footage |
| `SpaceConfiguration` | `integer(int64)` | N | readOnly; Space Configuration |
| `SpaceTypeName` | `string` | N | maxLength=100; minLength=0; readOnly; Space Type Name |
| `DiscountType` | `integer(int64)` | N | Discount Type: Dollar or Percentage |
| `DiscountValue` | `number(double)` | N | Discount Value |
| `CustomChargeCode` | `integer(int64)` | N | Custom Charge Code |
| `CustomChargeCodeName` | `string` | N | maxLength=100; minLength=0; readOnly; Custom Charge Code Name |
| `CustomChargeDescription` | `string` | N | maxLength=200; minLength=0; Custom Charge Code Name |
| `CustomChargeSequence` | `integer(int64)` | N | Custom Charge Code Sequence |
| `ContractPricingType` | `string` | N | enum: Simple, Custom; Contract Pricing TYpe |
| `AmenityIsTiered` | `integer(int32)` | N | readOnly; Is Amenity Tiered |
| `CustomTierPricing` | `Array<CustomTierPricing>` | N | List of Custom Tier Pricing |
| `AmenityTierPricing` | `Array<AmenityTierPricing>` | N | List of Amenity Tier Pricing |

### Model: PageLinkBuilder
| Field | Type | Required | Notes |
|---|---|---:|---|
| `FirstPage` | `string` | N | readOnly |
| `LastPage` | `string` | N | readOnly |
| `NextPage` | `string` | N | readOnly |
| `PreviousPage` | `string` | N | readOnly |

### Model: PhoneNumber
| Field | Type | Required | Notes |
|---|---|---:|---|
| `TelephoneNumber` | `string` | Y | maxLength=10; minLength=0; Phone Number. |
| `OrderCode` | `integer(int64)` | Y | OrderCode of the Phone Number. |

### Model: PhoneNumberPurchase
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique ID of the Phone Number. |
| `TelephoneNumber` | `string` | Y | maxLength=10; minLength=0; Phone Number. |
| `OrderCode` | `integer(int64)` | Y | OrderCode of the Phone Number. |
| `PropertyId` | `integer(int64)` | Y | PropertyId for adding the Phone Number. |
| `EnterpriseId` | `string` | Y | EnterpriseId for adding the Phone Number. |

### Model: PostProperty
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the property. |
| `PropertyName` | `string` | Y | maxLength=40; minLength=0; Property name. |
| `PropertyCode` | `string` | N | maxLength=50; minLength=0; Property Code. Enter an alphanumeric code specific to the property when applicable. |
| `AddressLine1` | `string` | Y | maxLength=255; minLength=0; Address line 1 for the property. |
| `AddressLine2` | `string` | N | maxLength=50; minLength=0; Address line 2 for the property. |
| `City` | `string` | Y | maxLength=80; minLength=0; Address city for the property. |
| `State` | `string` | N | maxLength=5; minLength=0; Address state for the property. |
| `Zip` | `string` | N | maxLength=30; minLength=0; Address zip for the property. |
| `CountryCode` | `string` | Y | Country Id |
| `Website` | `string` | N | maxLength=255; minLength=0; Property website address. |
| `Description` | `string` | N | Property description. |
| `AboutDescription` | `string` | N | Property description. |
| `TimezoneIanaId` | `string` | Y | Time zone Id. |
| `LegalEntityCode` | `string` | N | Legal Entity Id. |
| `Email` | `string` | Y | maxLength=255; minLength=0; Property email address. |
| `Phone` | `string` | N | maxLength=100; minLength=0; Property phone. |
| `ExternalReference` | `string` | N | maxLength=250; minLength=0; External Reference ID of  the property. |
| `Latitude` | `number(double)` | N | Latitude  of the property. |
| `Longitude` | `number(double)` | N | Longitude  of the property. |
| `PrimaryContactInternalUserId` | `integer(int64)` | Y | ID of the default "ContactInternalUserId" record associated with the contact. This field must be a valid "ContactInternalUser" ID. |
| `PropertyOperatingHours` | `Array<PropertyOperatingHours>` | Y |  |
| `PropertyFloors` | `Array<PropertyFloors>` | N |  |
| `PropertyLogo` | `PropertyLogoImage` | N | Property Logo |
| `InvoiceLogo` | `PropertyLogoImage` | N | Invoice Logo |
| `PropertyGallery` | `Array<PropertyGallery>` | N | Property Gallery |
| `SquareFootage` | `number(double)` | N | Square footage . |
| `DtOpening` | `string(date-time)` | N | Opening Date. |
| `Directions` | `string` | N | Property Directions. |
| `EntranceInstructions` | `string` | N | Property Entrance Instructions. |
| `TourInstructions` | `string` | N | Property Tour Instructions. |
| `ParkingInstructions` | `string` | N | Property Parking Instructions. |
| `BrandId` | `integer(int64)` | N | BrandId |
| `MarketId` | `integer(int64)` | N | MarketId |
| `SubMarketId` | `integer(int64)` | N | SubMarketId |
| `TerritoryId` | `integer(int64)` | N | TerritoryId |
| `SubterritoryId` | `integer(int64)` | N | SubterritoryId |
| `RegionId` | `integer(int64)` | N | RegionId |
| `SubregionId` | `integer(int64)` | N | SubregionId |
| `ExternalLink` | `string` | N |  |
| `Message` | `string` | N | readOnly; Error message |

### Model: PostPropertyImage
| Field | Type | Required | Notes |
|---|---|---:|---|
| `PropertyId` | `integer(int64)` | Y | Unique identifier of the property. |
| `PropertyLogo` | `PropertyLogoImage` | N | Property Logo |
| `InvoiceLogo` | `PropertyLogoImage` | N | Invoice Logo |
| `PropertyGallery` | `Array<PropertyGallery>` | N | Property Gallery |

### Model: PostSpace
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the space. |
| `Name` | `string` | Y | maxLength=255; minLength=0; Name of the space. |
| `Number` | `string` | Y | maxLength=200; minLength=0; Number used to identify the space. |
| `Description` | `string` | N | maxLength=1998; minLength=0; Description of the space. |
| `PropertyId` | `integer(int64)` | Y | ID of the property containing this space.   This field must be a valid "Property" ID. |
| `SpaceTypeId` | `integer(int64)` | Y | ID of the space type associated with this space.   This field must be a valid "SpaceType" ID. |
| `FloorId` | `integer(int64)` | N | Id of the floor containing this space. |
| `SquareFootage` | `number(double)` | N | Square footage of the space. |
| `MaxCapacity` | `integer(int64)` | Y | Number of people who can utilize this space for each booking. |
| `MaxBookings` | `integer(int64)` | Y | Maximum number of simultaneous bookings allowed for this space. |
| `CreditRatio` | `number(double)` | N | Credit Value for this space. |
| `ExternalReference` | `string` | N | maxLength=250; minLength=0; External Reference ID of  the space. |
| `SpaceConfigurationId` | `integer(int64)` | Y | ID of the space Configuration associated with this space.   This field must be a valid "SpaceConfiguration" ID. |
| `Pricing` | `Array<Price>` | N | Prices for the space. |
| `CancellationPolicy` | `Array<SpaceCancellationPolicy>` | N | Cancellation Policy Windows for the cancellation policy |
| `Amenities` | `Array<integer(int64)>` | N | Cancellation Policy Windows for the cancellation policy |
| `SpaceGallery` | `Array<SpaceGallery>` | N | Space Gallery |
| `SeatCount` | `integer(int64)` | N | Seat Count of the space. |
| `WorkUnits` | `integer(int64)` | N | Work Units of the space. |

### Model: PostSpaceImage
| Field | Type | Required | Notes |
|---|---|---:|---|
| `SpaceId` | `integer(int64)` | Y | Unique identifier of the property. |
| `SpaceGallery` | `Array<SpaceGallery>` | N | Space Gallery |

### Model: Price
| Field | Type | Required | Notes |
|---|---|---:|---|
| `BookingType` | `string` | N | enum: Hourly, HalfDay, FifteenMintue, ThirtyMintue, Daily, Monthly, MaxPrice; Booking Type for the Space |
| `RetailPeakPricing` | `number(double)` | N | Retail Peak Pricing for the price |
| `RetailOffPeakPricing` | `number(double)` | N | Retail Off Peak Pricing for the price |
| `MemberPeakPricing` | `number(double)` | N | Member Peak Pricing for the price |
| `MemberOffPeakPricing` | `number(double)` | N | Member Off Peak Pricing for the price |
| `IsAdminCanBook` | `boolean` | N | Can Admin Book for this space |
| `IsMemberCanBook` | `boolean` | N | Can Member Book for this space |
| `IsProspectCanBook` | `boolean` | N | Can Member Book for this space |
| `RetailPeakCredit` | `number(double)` | N | readOnly; Retail Peak Credit for the price |
| `RetailOffPeakCredit` | `number(double)` | N | readOnly; Retail Off Peak Credit for the price |
| `MemberPeakCredit` | `number(double)` | N | readOnly; Member Peak Credit for the price |
| `MemberOffPeakCredit` | `number(double)` | N | readOnly; Member Off Peak Credit for the price |
| `DiscountedRetailPeakPricing` | `number(double)` | N | readOnly; Discounted Retail Peak Pricing for the price |
| `DiscountedRetailOffPeakPricing` | `number(double)` | N | readOnly; Discounted Retail Off Pea kPricing for the price |
| `DiscountedMemberPeakPricing` | `number(double)` | N | readOnly; Discounted Member Peak Pricing for the price |
| `DiscountedMemberOffPeakPricing` | `number(double)` | N | readOnly; Discounted Member Off Peak Pricing for the price |

### Model: Property
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Country` | `string` | N | readOnly; Address country name for the property. |
| `TimeZone` | `string` | N | readOnly; Time zone name. |
| `PrimaryContactId` | `integer(int64)` | Y | ID of the default "ContactId" record associated with the contact. This field must be a valid "Contact" ID. |
| `PrimaryContactName` | `string` | N | readOnly; Value of the default "ContactId" record associated with the contact. This field must be a valid "Contact" name. |
| `VoyagerPropertyId` | `integer(int64)` | N | readOnly; Unique Voyager property identifier. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the property. |
| `CreatedBy` | `string` | N | readOnly; Name of user who created the property. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Date and time property was created. |
| `LastModifiedBy` | `string` | N | readOnly; Name of the user who last modified the property. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Date and time property was last modified. |
| `PropertyCurrencySymbol` | `string` | N | readOnly; Property Currency Symbol |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the property. |
| `PropertyName` | `string` | Y | maxLength=40; minLength=0; Property name. |
| `PropertyCode` | `string` | N | maxLength=50; minLength=0; Property Code. Enter an alphanumeric code specific to the property when applicable. |
| `AddressLine1` | `string` | Y | maxLength=255; minLength=0; Address line 1 for the property. |
| `AddressLine2` | `string` | N | maxLength=50; minLength=0; Address line 2 for the property. |
| `City` | `string` | Y | maxLength=80; minLength=0; Address city for the property. |
| `State` | `string` | N | maxLength=5; minLength=0; Address state for the property. |
| `Zip` | `string` | N | maxLength=30; minLength=0; Address zip for the property. |
| `CountryCode` | `string` | Y | Country Id |
| `Website` | `string` | N | maxLength=255; minLength=0; Property website address. |
| `Description` | `string` | N | Property description. |
| `AboutDescription` | `string` | N | Property description. |
| `TimezoneIanaId` | `string` | Y | Time zone Id. |
| `LegalEntityCode` | `string` | N | Legal Entity Id. |
| `Email` | `string` | Y | maxLength=255; minLength=0; Property email address. |
| `Phone` | `string` | N | maxLength=100; minLength=0; Property phone. |
| `ExternalReference` | `string` | N | maxLength=250; minLength=0; External Reference ID of  the property. |
| `Latitude` | `number(double)` | N | Latitude  of the property. |
| `Longitude` | `number(double)` | N | Longitude  of the property. |
| `PrimaryContactInternalUserId` | `integer(int64)` | Y | ID of the default "ContactInternalUserId" record associated with the contact. This field must be a valid "ContactInternalUser" ID. |
| `PropertyOperatingHours` | `Array<PropertyOperatingHours>` | Y |  |
| `PropertyFloors` | `Array<PropertyFloors>` | N |  |
| `PropertyLogo` | `PropertyLogoImage` | N | Property Logo |
| `InvoiceLogo` | `PropertyLogoImage` | N | Invoice Logo |
| `PropertyGallery` | `Array<PropertyGallery>` | N | Property Gallery |
| `SquareFootage` | `number(double)` | N | Square footage . |
| `DtOpening` | `string(date-time)` | N | Opening Date. |
| `Directions` | `string` | N | Property Directions. |
| `EntranceInstructions` | `string` | N | Property Entrance Instructions. |
| `TourInstructions` | `string` | N | Property Tour Instructions. |
| `ParkingInstructions` | `string` | N | Property Parking Instructions. |
| `BrandId` | `integer(int64)` | N | BrandId |
| `MarketId` | `integer(int64)` | N | MarketId |
| `SubMarketId` | `integer(int64)` | N | SubMarketId |
| `TerritoryId` | `integer(int64)` | N | TerritoryId |
| `SubterritoryId` | `integer(int64)` | N | SubterritoryId |
| `RegionId` | `integer(int64)` | N | RegionId |
| `SubregionId` | `integer(int64)` | N | SubregionId |
| `ExternalLink` | `string` | N |  |
| `Message` | `string` | N | readOnly; Error message |

### Model: PropertyFloors
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | Unique identifier of the Floor. |
| `Name` | `string` | Y | maxLength=255; minLength=0; Name of the Floor. |
| `Number` | `string` | Y | Number of the Floor. |
| `Description` | `string` | N | Description of the Floor. |
| `ExternalReference` | `string` | N | maxLength=250; minLength=0; External Reference ID of  the Floor. |

### Model: PropertyGallery
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Image Id |
| `Primary` | `boolean` | N | Primary Image |
| `Url` | `string` | N | URL |

### Model: PropertyLogoImage
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Image Id |
| `Url` | `string` | N | URL |

### Model: PropertyOperatingHours
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Day` | `string` | Y | Day of the week i.e Sunday,Monday,Tuseday,Wednesday,Thursday,Friday,Saturday |
| `PeakStartTime` | `string(date-time)` | N | Peak Start Time |
| `PeakEndTime` | `string(date-time)` | N | Peak End Time |
| `OffPeakStartTime` | `string(date-time)` | N | Off Peak Start Time |
| `OffPeakEndTime` | `string(date-time)` | N | Off Peak End Time |
| `Is247ORClosed` | `integer(int32)` | N | Is 24/7 open, Closed. 24/7 open = 1, Closed = 2 |

### Model: Proposal
| Field | Type | Required | Notes |
|---|---|---:|---|
| `ProposalId` | `integer(int64)` | N | readOnly; Current Proposal Id |
| `ProposalStatus` | `integer(int64)` | N | readOnly; Proposal Status |
| `ProposalStatusValue` | `string` | N | maxLength=50; minLength=0; readOnly; Proposal Status Value |
| `ProposalType` | `integer(int64)` | Y | Proposal Type |
| `ProposalTypeValue` | `string` | N | maxLength=50; minLength=0; readOnly; Proposal Type Value |
| `ProposalCreatedBy` | `string` | N | maxLength=50; minLength=0; readOnly; Proposal Created By |
| `ProposalCreatedDate` | `string(date-time)` | N | readOnly; Proposal Created Date |
| `MoveInDate` | `string(date-time)` | Y | Move in Date. |
| `MoveOutDate` | `string(date-time)` | N | Move in Date. |
| `AutoRenew` | `string` | N | enum: No, Yes; Auto Renew. |
| `ProposalSaved` | `integer(int32)` | N | readOnly; Proposal Saved |
| `Duration` | `integer(int64)` | Y | Number of Term of Contract |
| `TotalDealValue` | `number(double)` | N | readOnly; TotalDealValue |
| `ProposalCreatedFromValue` | `string` | N | maxLength=50; minLength=0; readOnly; Proposal Created From |
| `CurrentMRR` | `number(double)` | N | readOnly; Current MRR |
| `NextMonthMRR` | `number(double)` | N | readOnly; Next Month MRR |
| `NumberOfItems` | `integer(int64)` | N | readOnly; Next Month MRR |
| `ContractItems` | `Array<OrderDetail>` | N | List of Items |

### Model: ReceiptModel
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N |  |
| `ReceiptTotalAmount` | `number(double)` | N |  |
| `Date` | `string(date-time)` | N |  |
| `PostMonth` | `string(date-time)` | N |  |
| `PersonId` | `integer(int64)` | N |  |
| `PropertyId` | `integer(int64)` | N |  |
| `KubePropertyId` | `integer(int64)` | N |  |
| `PropertyCurrencySymbol` | `string` | N |  |
| `CompanyId` | `integer(int64)` | N |  |

### Model: Refund
| Field | Type | Required | Notes |
|---|---|---:|---|
| `RefundId` | `integer(int64)` | N | readOnly; ID . |
| `LegalEntityId` | `integer(int64)` | N | readOnly; ID . |
| `LegalEntityName` | `string` | N | readOnly; Name of the company. |
| `LegalEntityCode` | `string` | N | readOnly; Name of the company. |
| `PropertyId` | `integer(int64)` | N | readOnly; ID . |
| `PropertyName` | `string` | N | readOnly; Name of the company. |
| `PropertyCode` | `string` | N | readOnly; Name of the company. |
| `CompanyId` | `integer(int64)` | N | readOnly; Unique identifier of the company. |
| `CompanyName` | `string` | N | readOnly; Name of the company. |
| `CompanyCode` | `string` | N | readOnly; Name of the company. |
| `PropertyExternalReference` | `string` | N | readOnly; external reference of the property. |
| `CompanyExternalReference` | `string` | N | readOnly; external reference of the company. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `Currency` | `string` | N | readOnly; Name of the company. |
| `RefundDate` | `string(date-time)` | N | readOnly; Date and time company was created. |
| `RefundReference` | `string` | N | readOnly; Name of the company. |
| `RefundAmount` | `number(double)` | N | readOnly; Name of the company. |

### Model: Space
| Field | Type | Required | Notes |
|---|---|---:|---|
| `PropertyName` | `string` | N | readOnly; Name of the property containing this space. |
| `SpaceTypeName` | `string` | N | readOnly; Name of the space type associated with this sapce. |
| `FloorName` | `string` | N | readOnly; Name of the floor containing this space. |
| `FloorNumber` | `integer(int64)` | N | readOnly; Number of the floor containing this space. |
| `HourlyDailyAmenites` | `Array<SpaceAmenity>` | N | readOnly; Hourly/Daily Amenities of the space amenity. |
| `MonthlyAmenites` | `Array<SpaceAmenity>` | N | readOnly; Monthly Amenities of the space amenity. |
| `IsBookableByAdminHourly` | `boolean` | N | readOnly; Flag to indicate administrators can make hourly bookings for this space. |
| `IsBookableByAdminDaily` | `boolean` | N | readOnly; Flag to indicate administrators can make daily bookings for this space. |
| `IsBookableByAdminMonthly` | `boolean` | N | readOnly; Flag to indicate administrators can make monthly bookings for this space. |
| `SpaceConfigurationName` | `string` | N | readOnly; Name of the space Configuration associated with this sapce. |
| `RecordStatus` | `string` | N | enum: Active, Archive; readOnly; Record status of the space. This field must be one of the enum values provided below. |
| `CreatedBy` | `string` | N | readOnly; User the space was created by. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime the space was created on. |
| `LastModifiedBy` | `string` | N | readOnly; User who last modified the space. |
| `LastModifiedDatetime` | `string(date-time)` | N | readOnly; Datetime the space was last modified. |
| `Message` | `string` | N | readOnly; Error message. |
| `SeatCount` | `integer(int64)` | N | readOnly; Seat Count of the space. |
| `WorkUnits` | `integer(int64)` | N | readOnly; Work Units of the space. |
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the space. |
| `Name` | `string` | Y | maxLength=255; minLength=0; Name of the space. |
| `Number` | `string` | Y | maxLength=200; minLength=0; Number used to identify the space. |
| `Description` | `string` | N | maxLength=1998; minLength=0; Description of the space. |
| `PropertyId` | `integer(int64)` | Y | ID of the property containing this space.   This field must be a valid "Property" ID. |
| `SpaceTypeId` | `integer(int64)` | Y | ID of the space type associated with this space.   This field must be a valid "SpaceType" ID. |
| `FloorId` | `integer(int64)` | N | Id of the floor containing this space. |
| `SquareFootage` | `number(double)` | N | Square footage of the space. |
| `MaxCapacity` | `integer(int64)` | Y | Number of people who can utilize this space for each booking. |
| `MaxBookings` | `integer(int64)` | Y | Maximum number of simultaneous bookings allowed for this space. |
| `CreditRatio` | `number(double)` | N | Credit Value for this space. |
| `ExternalReference` | `string` | N | maxLength=250; minLength=0; External Reference ID of  the space. |
| `SpaceConfigurationId` | `integer(int64)` | Y | ID of the space Configuration associated with this space.   This field must be a valid "SpaceConfiguration" ID. |
| `Pricing` | `Array<Price>` | N | Prices for the space. |
| `CancellationPolicy` | `Array<SpaceCancellationPolicy>` | N | Cancellation Policy Windows for the cancellation policy |
| `Amenities` | `Array<integer(int64)>` | N | Cancellation Policy Windows for the cancellation policy |
| `SpaceGallery` | `Array<SpaceGallery>` | N | Space Gallery |

### Model: SpaceAmenities
| Field | Type | Required | Notes |
|---|---|---:|---|
| `SpaceId` | `integer(int64)` | Y | ID of the space associated with this space amenity. This field must be a valid "space" ID. |
| `SpaceName` | `string` | N | readOnly; Name of the space associated with the space amenity. |
| `FloorId` | `integer(int64)` | N | readOnly; Id of the floor containing this space. |
| `FloorName` | `string` | N | readOnly; Name of the floor containing this space. |
| `FloorNumber` | `integer(int64)` | N | readOnly; Number of the floor containing this space. |
| `HourlyDailyAmenites` | `Array<SpaceAmenity>` | N | readOnly; Hourly/Daily Amenities of the space amenity. |
| `MonthlyAmenites` | `Array<SpaceAmenity>` | N | readOnly; Monthly Amenities of the space amenity. |

### Model: SpaceAmenity
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | Y | Unique identifier of the amenity. |
| `Name` | `string` | Y | maxLength=255; minLength=0; Name of the amenity. |

### Model: SpaceAvailability
| Field | Type | Required | Notes |
|---|---|---:|---|
| `SpaceId` | `integer(int64)` | Y | ID of the space associated with this space pricing. This field must be a valid "space" ID. |
| `SpaceName` | `string` | N | readOnly; Name of the space associated with the space pricing. |
| `FloorId` | `integer(int64)` | N | readOnly; Id of the floor containing this space. |
| `FloorName` | `string` | N | readOnly; Name of the floor containing this space. |
| `FloorNumber` | `integer(int64)` | N | readOnly; Number of the floor containing this space. |
| `Type` | `string` | N | enum: Hourly, Daily, Monthly; readOnly; Type of slot for the booking of the space. |
| `StartDatetime` | `string(date-time)` | N | readOnly; Start Datetime slot for the booking of the space. |
| `EndDatetime` | `string(date-time)` | N | readOnly; End Datetime slot for the booking of the space. |
| `BookedSeats` | `integer(int64)` | N | readOnly; Booked Seats for given time |
| `MaximumSeats` | `integer(int64)` | N | readOnly; Booked Seats for given time |
| `Availability` | `Array<TimeSlot>` | N | readOnly; Monthly Amenities of the space amenity. |

### Model: SpaceCancellationPolicy
| Field | Type | Required | Notes |
|---|---|---:|---|
| `BookingTime` | `string` | N | enum: Hourly, Daily, Monthly; readOnly; Booking Time for the cancellation policy |
| `CancellationWindows` | `Array<CancellationWindow>` | N | readOnly; Cancellation Policy Windows for the cancellation policy |

### Model: SpaceGallery
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Image Id |
| `Primary` | `boolean` | N | Primary Image |
| `Url` | `string` | N | URL |

### Model: SpacePricing
| Field | Type | Required | Notes |
|---|---|---:|---|
| `SpaceId` | `integer(int64)` | Y | ID of the space associated with this space pricing. This field must be a valid "space" ID. |
| `SpaceName` | `string` | N | readOnly; Name of the space associated with the space pricing. |
| `FloorId` | `integer(int64)` | N | readOnly; Id of the floor containing this space. |
| `FloorName` | `string` | N | readOnly; Name of the floor containing this space. |
| `FloorNumber` | `integer(int64)` | N | readOnly; Number of the floor containing this space. |
| `Allow15MinBookings` | `boolean` | N | readOnly; Whether 15-minute bookings are allowed. |
| `Allow30MinBookings` | `boolean` | N | readOnly; Whether 30-minute bookings are allowed. |
| `MinBookingLengthHours` | `number(double)` | N | readOnly; Minimum duration in hours allowed to booked this space. |
| `MaxHourlyRetailPrice` | `number(double)` | N | readOnly; Maximum hourly retail price allowed to booked this space. |
| `MaxHourlyMemberPrice` | `number(double)` | N | readOnly; Maximum hourly member price allowed to booked this space. |
| `HourlyRetailPrice` | `number(double)` | N | readOnly; Hourly retail booking price of this space during peak hours. |
| `HourlyMemberPrice` | `number(double)` | N | readOnly; Hourly member booking price of this space during peak hours. |
| `HourlyOffPeakRetailPrice` | `number(double)` | N | readOnly; Hourly retail booking price of this space during off peak hours. |
| `HourlyOffPeakMemberPrice` | `number(double)` | N | readOnly; Hourly member booking price of this space during off peak hours. |
| `DailyRetailPrice` | `number(double)` | N | readOnly; Daily retail booking price of this space. |
| `DailyMemberPrice` | `number(double)` | N | readOnly; Daily member booking price of this space. |
| `MonthlyRetailPrice` | `number(double)` | N | readOnly; Monthly retail booking price of this space. |
| `MonthlyMemberPrice` | `number(double)` | N | readOnly; Monthly member booking price of this space. |
| `HourlyDailySetupFee` | `number(double)` | N | readOnly; Hourly/Daily booking setup price of this space. |
| `MonthlySetupFee` | `number(double)` | N | readOnly; Monthly booking setup price of this space. |
| `MonthlySecurityDeposit` | `number(double)` | N | readOnly; Monthly booking security deposit of this space. |
| `RetailFutureBookingLimitValue` | `number(double)` | N | readOnly; Retail future booking limit value of this space. |
| `RetailFutureBookingLimitUnits` | `string` | N | readOnly; Retail future booking limit units of this space. |
| `MemberFutureBookingLimitValue` | `number(double)` | N | readOnly; Member future booking limit value of this space. |
| `MemberFutureBookingLimitUnits` | `string` | N | readOnly; Member future booking limit units of this space. |
| `CancellationPolicy` | `Array<SpaceCancellationPolicy>` | N | readOnly; Cancellation Policy of this space. |
| `PropertyCurrencySymbol` | `string` | N | readOnly |

### Model: SpaceType
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the space type. |
| `Name` | `string` | N | readOnly; Name of the space type. |

### Model: Support
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the support. |
| `MemberId` | `integer(int64)` | Y | Member Id which create support ticket. |
| `PropertyId` | `integer(int64)` | Y | Property Id of the support. |
| `PropertyName` | `string` | N | readOnly; Property Name of the support. |
| `Subject` | `string` | Y | Subject of the support. |
| `Category` | `string` | Y | Category of the support. |
| `Priority` | `string` | Y | Priority of the support. |
| `Message` | `string` | Y | Message of the support. |
| `DateTime` | `string(date-time)` | N | readOnly; Date Time of the support. |
| `AssignedTo` | `string` | N | readOnly; Assigned to the support person. |
| `ReplyStatus` | `string` | N | readOnly; Reply Status for support. |

### Model: SupportAttachments
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the support attachment. |
| `FileName` | `string` | N | readOnly; File name of the support attachment. |
| `FullFilePath` | `string` | N | readOnly; File full path of the support attachment. |

### Model: SupportCategory
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Name` | `string` | N | readOnly; Name of the Category. |

### Model: SupportDiscussion
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Id` | `integer(int64)` | N | readOnly; Unique identifier of the support discussion. |
| `MemberId` | `integer(int64)` | Y | Unique identifier of the support discussion createing member. |
| `Comment` | `string` | Y | Comment added in support discussion. |
| `FirstName` | `string` | N | readOnly; First Name of the Member who added comment in support discussion. |
| `LastName` | `string` | N | readOnly; Last Name of the Member who added comment in support discussion. |
| `CreatedDatetime` | `string(date-time)` | N | readOnly; Datetime when comment was added in support discussion. |

### Model: SupportPriority
| Field | Type | Required | Notes |
|---|---|---:|---|
| `Name` | `string` | N | readOnly; Name of the Priority. |

### Model: TimeSlot
| Field | Type | Required | Notes |
|---|---|---:|---|
| `StartDatetime` | `string(date-time)` | N | readOnly; Start Datetime slot for the booking of the space. |
| `EndDatetime` | `string(date-time)` | N | readOnly; End Datetime slot for the booking of the space. |
| `IsAvailable` | `boolean` | N | readOnly; Given slot is available for the booking of the space. |
| `Type` | `string` | N | enum: Hourly, Daily, Monthly; readOnly; Type of slot for the booking of the space. |

### Model: Webhook
| Field | Type | Required | Notes |
|---|---|---:|---|
| `WebhookId` | `integer(int64)` | N | The id of the webhook. |
| `CallbackURL` | `string` | Y | The call back URL for the webhook. |
| `SubscriptionObject` | `string` | Y | Type of subscription object Lead, Member, Company, Booking, Notes, Tours, Events or Activities. |
| `SubscriptionType` | `string` | Y | Type of subscription Create, Update or Archive action associated with the SubscriptionObject. |
| `SubscriptionPlatform` | `string` | Y | The platform used, eg Zapier, HubSpot, etc ... |
| `WebhookName` | `string` | Y | maxLength=50; The name of the webhook (50 char max).  No special characters, spaces are replaced with underscores |
| `Subscriptions` | `Array<string>` | N | readOnly; Subscriptions remaining, may be 0 or more. |
| `RecordStatus` | `string` | N | enum: Active, Archived; readOnly; Record status of the webhook. This field must be one of the enum values provided below. |
