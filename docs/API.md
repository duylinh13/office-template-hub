# API Reference: Office Template Hub

This document specifies the REST API endpoints provided by the Next.js Route Handlers in **Office Template Hub**. All endpoints run on the Node.js runtime and return JSON responses, with the exception of the binary export/download endpoints which stream OpenXML `.docx` and `.pptx` documents.

---

## Table of Contents
- [1. Document Template Endpoints](#1-document-template-endpoints)
  - [GET /api/document-templates](#get-apidocument-templates)
  - [GET /api/document-templates/[id]](#get-apidocument-templatesid)
- [2. Document Draft & Export Endpoints](#2-document-draft--export-endpoints)
  - [POST /api/documents](#post-apidocuments)
  - [GET /api/documents](#get-apidocuments)
  - [GET /api/documents/[id]](#get-apidocumentsid)
  - [PATCH /api/documents/[id]](#patch-apidocumentsid)
  - [DELETE /api/documents/[id]](#delete-apidocumentsid)
  - [GET /api/documents/[id]/export](#get-apidocumentsidexport)
- [3. Presentation Template Endpoints](#3-presentation-template-endpoints)
  - [GET /api/presentation-templates](#get-apipresentation-templates)
  - [GET /api/presentation-templates/[id]](#get-apipresentation-templatesid)
  - [GET /api/presentation-templates/[id]/download](#get-apipresentation-templatesiddownload)
- [4. Presentation Draft & Export Endpoints](#4-presentation-draft--export-endpoints)
  - [POST /api/presentations](#post-apipresentations)
  - [GET /api/presentations](#get-apipresentations)
  - [GET /api/presentations/[id]/export](#get-apipresentationsidexport)
- [5. Standard Error Responses](#5-standard-error-responses)

---

## 1. Document Template Endpoints

### `GET /api/document-templates`
Retrieve a list of immutable master document templates. Supports filtering by category and full-text substring search across template names and descriptions.

- **Query Parameters**:
  - `search` (optional, string): Case-insensitive keyword to match in `name` or `description`.
  - `category` (optional, string): Filter by category name (e.g., `Legal & HR`, `Business & Strategy`). Pass `all` or omit to retrieve all categories.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "doc-tmpl-01",
      "type": "DOCUMENT",
      "name": "Standard Employment Contract",
      "category": "Legal & HR",
      "description": "Comprehensive full-time employment agreement covering duties, compensation, IP assignment, and confidentiality.",
      "thumbnailPath": "/thumbnails/documents/contract.svg",
      "content": "<h1>EMPLOYMENT AGREEMENT</h1>...",
      "createdAt": "2026-10-30T00:00:00.000Z",
      "updatedAt": "2026-10-30T00:00:00.000Z"
    }
  ]
}
```
- **Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Invalid query parameters"
}
```

---

### `GET /api/document-templates/[id]`
Retrieve the details of a specific master document template by its ID.

- **URL Parameters**:
  - `id` (required, string): Master template ID (e.g. `doc-tmpl-01`).
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "doc-tmpl-01",
    "type": "DOCUMENT",
    "name": "Standard Employment Contract",
    "category": "Legal & HR",
    "description": "Comprehensive full-time employment agreement...",
    "thumbnailPath": "/thumbnails/documents/contract.svg",
    "content": "<h1>EMPLOYMENT AGREEMENT</h1>...",
    "createdAt": "2026-10-30T00:00:00.000Z",
    "updatedAt": "2026-10-30T00:00:00.000Z"
  }
}
```
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Document template not found"
}
```

---

## 2. Document Draft & Export Endpoints

### `POST /api/documents`
Create a new independent document draft. When a `templateId` is provided, the draft's content and title are initialized from the template without mutating the master record.

- **Request Body (JSON)**:
  - `templateId` (optional, string): The parent template ID to fork from.
  - `title` (optional, string, 1-200 chars): Custom draft title (defaults to `[Template Name] (Draft)`).
  - `content` (optional, string): Custom initial HTML content.
```json
{
  "templateId": "doc-tmpl-01",
  "title": "My Employment Agreement"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Draft created successfully",
  "data": {
    "id": "cm78abc1234567890",
    "templateId": "doc-tmpl-01",
    "type": "DOCUMENT",
    "title": "My Employment Agreement",
    "content": "<h1>EMPLOYMENT AGREEMENT</h1>...",
    "slides": null,
    "createdAt": "2026-10-30T10:00:00.000Z",
    "updatedAt": "2026-10-30T10:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Payload validation failed or provided template is not of type `DOCUMENT`.
  - `404 Not Found`: Provided `templateId` does not exist.

---

### `GET /api/documents`
List all active user document drafts ordered by `updatedAt` descending.

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "cm78abc1234567890",
      "templateId": "doc-tmpl-01",
      "type": "DOCUMENT",
      "title": "My Employment Agreement",
      "content": "<h1>EMPLOYMENT AGREEMENT</h1>...",
      "createdAt": "2026-10-30T10:00:00.000Z",
      "updatedAt": "2026-10-30T10:05:00.000Z",
      "template": {
        "id": "doc-tmpl-01",
        "name": "Standard Employment Contract",
        "category": "Legal & HR",
        "thumbnailPath": "/thumbnails/documents/contract.svg"
      }
    }
  ]
}
```

---

### `GET /api/documents/[id]`
Retrieve a specific draft for editor hydration.

- **URL Parameters**:
  - `id` (required, string): Draft unique CUID.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "cm78abc1234567890",
    "templateId": "doc-tmpl-01",
    "type": "DOCUMENT",
    "title": "My Employment Agreement",
    "content": "<h1>EMPLOYMENT AGREEMENT</h1>...",
    "createdAt": "2026-10-30T10:00:00.000Z",
    "updatedAt": "2026-10-30T10:05:00.000Z",
    "template": {
      "id": "doc-tmpl-01",
      "name": "Standard Employment Contract",
      "category": "Legal & HR",
      "thumbnailPath": "/thumbnails/documents/contract.svg"
    }
  }
}
```
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Document draft not found"
}
```

---

### `PATCH /api/documents/[id]`
Persist edits to an existing document draft (title or HTML content).

- **Request Body (JSON)**:
  - `title` (optional, string, 1-200 chars): New document title.
  - `content` (optional, string): New HTML editor content.
```json
{
  "title": "Revised Employment Agreement v2",
  "content": "<h1>EMPLOYMENT AGREEMENT</h1><p>Updated terms...</p>"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Draft saved successfully",
  "data": {
    "id": "cm78abc1234567890",
    "templateId": "doc-tmpl-01",
    "type": "DOCUMENT",
    "title": "Revised Employment Agreement v2",
    "content": "<h1>EMPLOYMENT AGREEMENT</h1><p>Updated terms...</p>",
    "updatedAt": "2026-10-30T10:12:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid payload (e.g. empty string title).
  - `404 Not Found`: Draft does not exist.

---

### `DELETE /api/documents/[id]`
Delete an existing document draft. Master template records are never affected.

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Draft deleted successfully"
}
```
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Document draft not found"
}
```

---

### `GET /api/documents/[id]/export`
Convert the current draft content into a genuine Microsoft Word OpenXML (`.docx`) file and stream it as an attachment download.

- **Response Headers**:
  - `Content-Type`: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `Content-Disposition`: `attachment; filename="[Safe_Title].docx"; filename*=UTF-8''...`
  - `Content-Length`: `[Size in bytes]`
- **Success Response (200 OK)**: Binary stream of valid OpenXML document (magic bytes `PK\x03\x04`).
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Document draft not found"
}
```

---

## 3. Presentation Template Endpoints

### `GET /api/presentation-templates`
Retrieve a list of presentation templates, including slide-by-slide metadata.

- **Query Parameters**:
  - `search` (optional, string): Keyword to match in title or description.
  - `category` (optional, string): Category filter (e.g. `Startup & Investment`, `Corporate & Finance`).
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "pres-tmpl-01",
      "type": "PRESENTATION",
      "name": "Venture Capital Pitch Deck",
      "category": "Startup & Investment",
      "description": "High-impact 16:9 investor pitch deck with problem, solution, TAM, traction, and funding ask.",
      "thumbnailPath": "/thumbnails/presentations/pitch-deck.svg",
      "filePath": "templates/presentations/venture-pitch-deck.pptx",
      "slides": [
        {
          "slideNumber": 1,
          "title": "HyperScale Cloud Architecture",
          "summary": "Next-Generation Enterprise Data Fabric & AI Orchestration",
          "bulletPoints": [
            "Series A Investment Opportunity - Confidential",
            "Presented by Founders & Executive Team"
          ]
        }
      ],
      "slideCount": 5,
      "createdAt": "2026-10-30T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/presentation-templates/[id]`
Retrieve a single presentation template and its full slide array.

- **URL Parameters**:
  - `id` (required, string): Master presentation template ID.
- **Success Response (200 OK)**: Returns the template object with parsed `slides` array.
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Presentation template not found"
}
```

---

### `GET /api/presentation-templates/[id]/download`
Stream an independent copy of the master PPTX file directly to the client. Uses safe allowlisted path validation to prevent directory traversal.

- **Response Headers**:
  - `Content-Type`: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - `Content-Disposition`: `attachment; filename="[Safe_Name].pptx"; filename*=UTF-8''...`
  - `Content-Length`: `77920` (or file size in bytes)
- **Success Response (200 OK)**: Binary stream of valid OpenXML presentation deck.
- **Error Responses**:
  - `400 Bad Request`: Invalid template ID parameter.
  - `403 Forbidden`: Unauthorized file path attempt outside `templates/presentations`.
  - `404 Not Found`: Template record or asset file not found on disk.

---

## 4. Presentation Draft & Export Endpoints

### `POST /api/presentations`
Create an independent presentation draft record tracking a user's presentation project.

- **Request Body (JSON)**:
  - `templateId` (required, string): Valid master presentation template ID.
  - `title` (optional, string, 1-200 chars): Custom project title.
```json
{
  "templateId": "pres-tmpl-01",
  "title": "Series A Pitch Deck (Customized)"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Presentation draft created successfully",
  "data": {
    "id": "cm78pres123456",
    "templateId": "pres-tmpl-01",
    "type": "PRESENTATION",
    "title": "Series A Pitch Deck (Customized)",
    "createdAt": "2026-10-30T10:30:00.000Z"
  }
}
```

---

### `GET /api/presentations`
List all presentation drafts and export histories.

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "cm78pres123456",
      "templateId": "pres-tmpl-01",
      "type": "PRESENTATION",
      "title": "Series A Pitch Deck (Customized)",
      "createdAt": "2026-10-30T10:30:00.000Z",
      "template": {
        "id": "pres-tmpl-01",
        "name": "Venture Capital Pitch Deck",
        "category": "Startup & Investment",
        "thumbnailPath": "/thumbnails/presentations/pitch-deck.svg"
      }
    }
  ]
}
```

---

### `GET /api/presentations/[id]/export`
Download the PPTX presentation associated with the saved presentation draft.

- **Response Headers**:
  - `Content-Type`: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - `Content-Disposition`: `attachment; filename="[Draft_Title].pptx"`
- **Success Response (200 OK)**: Binary stream of valid PPTX presentation.
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Presentation draft not found"
}
```

---

## 5. Standard Error Responses

All error payloads follow a unified schema:

```json
{
  "success": false,
  "error": "Human readable error description",
  "details": {} // Optional Zod validation format on 400 Bad Request
}
```

| HTTP Status | Description | Typical Scenario |
| :--- | :--- | :--- |
| **400 Bad Request** | Request body or query parameters failed Zod validation | Missing required fields, empty strings, invalid types |
| **403 Forbidden** | Security violation / directory traversal detected | File path resolved outside allowlisted directory |
| **404 Not Found** | Target resource does not exist | Invalid template or draft CUID |
| **500 Internal Server Error** | Unhandled exception on server | Database connectivity failure, OpenXML packer error |
