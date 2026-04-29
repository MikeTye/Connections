# **2\. Feature / Function Sheet**

## **2.1 Authentication**

| Field | Details |
| ----- | ----- |
| Feature | Authentication |
| Description | Users can register, log in, and access protected routes using JWT. |
| User Story | As a user, I want to create an account and securely access my profile. |
| Acceptance Criteria | User can register, login, logout, and access `/me`. Passwords are hashed. JWT is required for protected endpoints. |
| API Implication | `/auth/register`, `/auth/login`, `/auth/me` |
| Dependencies | PostgreSQL users table, JWT middleware, password hashing |

---

## **2.2 Profile Builder**

| Field | Details |
| ----- | ----- |
| Feature | Rich profile builder |
| Description | Users create a modular profile with multiple editable sections. |
| User Story | As a user, I want to build a detailed profile that represents my personality and intentions. |
| Acceptance Criteria | User can create/update profile. User can add/edit/delete/reorder sections. Profile has draft/published status. |
| API Implication | `/profiles`, `/profiles/:id/sections` |
| Dependencies | users, profiles, profile\_sections |

---

## **2.3 Profile Sharing**

| Field | Details |
| ----- | ----- |
| Feature | Private/public/expiring share links |
| Description | Users generate shareable links with expiry, max views, and access scope. |
| User Story | As a user, I want to share my profile safely with selected people. |
| Acceptance Criteria | User can generate, revoke, and list share links. Expired/revoked links cannot access profile. |
| API Implication | `/profiles/:id/share-links` |
| Dependencies | profiles, share\_links, visibility settings |

---

## **2.4 Controlled Discovery**

| Field | Details |
| ----- | ----- |
| Feature | Controlled discovery/search |
| Description | Authenticated users can search discoverable profiles using limited filters. |
| User Story | As a user, I want to be discovered only under conditions I control. |
| Acceptance Criteria | Private profiles do not appear. Blocked users cannot discover each other. Search returns limited cards only. |
| API Implication | `/discovery/search` |
| Dependencies | profile\_visibility\_settings, profiles, interactions/reports for blocking |

---

## **2.5 Privacy-Safe Viewer Analytics**

| Field | Details |
| ----- | ----- |
| Feature | Aggregated viewer analytics |
| Description | Profile owners can see aggregate views, not exact identities. |
| User Story | As a user, I want basic insight into profile activity without exposing viewers. |
| Acceptance Criteria | Owner sees daily view count, source type, and unique estimate. No exact viewer list. |
| API Implication | `/profiles/:id/analytics` |
| Dependencies | profile\_views |

---

## **2.6 Non-Swipe Interaction**

| Field | Details |
| ----- | ----- |
| Feature | Intentional interactions |
| Description | Viewers can send structured connection requests or intro messages. |
| User Story | As a viewer, I want to express interest respectfully without swipe mechanics. |
| Acceptance Criteria | One pending interaction per viewer/profile pair. Owner can accept, decline, ignore, block, or report. |
| API Implication | `/profiles/:id/interactions`, `/interactions/:id/respond` |
| Dependencies | interactions, reports |

---

## **2.7 Reporting and Moderation**

| Field | Details |
| ----- | ----- |
| Feature | Basic moderation/reporting |
| Description | Users can report profiles, interactions, or share misuse. |
| User Story | As a user, I want to report unsafe or abusive behavior. |
| Acceptance Criteria | Reports are stored with status. Admin can update moderation status. |
| API Implication | `/reports`, `/admin/reports` |
| Dependencies | reports table, admin role |

---

## **2.8 Blocking**

| Field | Details |
| ----- | ----- |
| Feature | Blocking |
| Description | Users can block other users from viewing, searching, or interacting. |
| User Story | As a user, I want to prevent someone from contacting or viewing me. |
| Acceptance Criteria | Blocked users cannot view profile, send interactions, or discover profile. |
| API Implication | `/blocks` |
| Dependencies | user\_blocks table or interactions/reporting extension |

