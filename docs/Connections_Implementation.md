# **3\. Implementation Spec**

## **3.1 Tech Stack Assumptions**

| Layer | Choice |
| ----- | ----- |
| Backend | Node.js \+ Express |
| Database | PostgreSQL |
| Frontend | React |
| Storage | AWS S3 |
| Auth | JWT |
| Media upload | Signed S3 PUT URL |
| Password hashing | bcrypt |
| Validation | Zod or Joi |
| Querying | node-postgres, Knex, Prisma, or Sequelize |
| Rate limiting | express-rate-limit |
| Security | Helmet, CORS allowlist, JWT middleware |

---

# **3.2 Database Schema — PostgreSQL**

CREATE EXTENSION IF NOT EXISTS pgcrypto;

\-- \=========================  
\-- USERS  
\-- \=========================

CREATE TABLE IF NOT EXISTS users (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
   email TEXT NOT NULL UNIQUE,  
   password\_hash TEXT NOT NULL,  
   display\_name TEXT NOT NULL,  
   role TEXT NOT NULL DEFAULT 'user'  
       CHECK (role IN ('user', 'admin', 'moderator')),  
   status TEXT NOT NULL DEFAULT 'active'  
       CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),  
   email\_verified BOOLEAN NOT NULL DEFAULT false,  
   date\_of\_birth DATE,  
   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE INDEX IF NOT EXISTS idx\_users\_email ON users (email);  
CREATE INDEX IF NOT EXISTS idx\_users\_status ON users (status);

\-- \=========================  
\-- PROFILES  
\-- \=========================

CREATE TABLE IF NOT EXISTS profiles (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
   user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

   slug TEXT UNIQUE,  
   headline TEXT,  
   bio TEXT,  
   connection\_intent TEXT NOT NULL DEFAULT 'intentional\_connections'  
       CHECK (connection\_intent IN (  
           'dating',  
           'friendship',  
           'networking',  
           'collaboration',  
           'intentional\_connections'  
       )),

   city TEXT,  
   country\_code CHAR(2),  
   cover\_media\_id UUID,

   status TEXT NOT NULL DEFAULT 'draft'  
       CHECK (status IN ('draft', 'published', 'paused', 'hidden')),

   searchable\_text TSVECTOR,

   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now(),

   CONSTRAINT unique\_profile\_per\_user UNIQUE (user\_id)  
);

CREATE INDEX IF NOT EXISTS idx\_profiles\_user\_id ON profiles (user\_id);  
CREATE INDEX IF NOT EXISTS idx\_profiles\_slug ON profiles (slug);  
CREATE INDEX IF NOT EXISTS idx\_profiles\_status ON profiles (status);  
CREATE INDEX IF NOT EXISTS idx\_profiles\_country ON profiles (country\_code);  
CREATE INDEX IF NOT EXISTS idx\_profiles\_searchable\_text ON profiles USING GIN (searchable\_text);

\-- \=========================  
\-- PROFILE SECTIONS  
\-- \=========================

CREATE TABLE IF NOT EXISTS profile\_sections (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
   profile\_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

   section\_key TEXT NOT NULL,  
   title TEXT NOT NULL,  
   content JSONB NOT NULL DEFAULT '{}'::jsonb,

   visibility TEXT NOT NULL DEFAULT 'profile'  
       CHECK (visibility IN ('private', 'share\_link', 'profile')),

   sort\_order INTEGER NOT NULL DEFAULT 0,  
   is\_enabled BOOLEAN NOT NULL DEFAULT true,

   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now(),

   CONSTRAINT unique\_profile\_section\_key UNIQUE (profile\_id, section\_key)  
);

CREATE INDEX IF NOT EXISTS idx\_profile\_sections\_profile\_id ON profile\_sections (profile\_id);  
CREATE INDEX IF NOT EXISTS idx\_profile\_sections\_visibility ON profile\_sections (visibility);  
CREATE INDEX IF NOT EXISTS idx\_profile\_sections\_sort\_order ON profile\_sections (profile\_id, sort\_order);

\-- \=========================  
\-- PROFILE MEDIA  
\-- \=========================

CREATE TABLE IF NOT EXISTS profile\_media (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
   profile\_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

   media\_type TEXT NOT NULL  
       CHECK (media\_type IN ('image', 'video')),  
   s3\_key TEXT NOT NULL,  
   asset\_url TEXT,  
   content\_type TEXT NOT NULL,  
   file\_size\_bytes INTEGER,  
   sha256 TEXT,

   alt\_text TEXT,  
   is\_cover BOOLEAN NOT NULL DEFAULT false,  
   sort\_order INTEGER NOT NULL DEFAULT 0,

   visibility TEXT NOT NULL DEFAULT 'profile'  
       CHECK (visibility IN ('private', 'share\_link', 'profile')),

   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE INDEX IF NOT EXISTS idx\_profile\_media\_profile\_id ON profile\_media (profile\_id);  
CREATE INDEX IF NOT EXISTS idx\_profile\_media\_s3\_key ON profile\_media (s3\_key);  
CREATE INDEX IF NOT EXISTS idx\_profile\_media\_is\_cover ON profile\_media (profile\_id, is\_cover);

\-- \=========================  
\-- PROFILE VISIBILITY SETTINGS  
\-- \=========================

CREATE TABLE IF NOT EXISTS profile\_visibility\_settings (  
   profile\_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

   default\_visibility TEXT NOT NULL DEFAULT 'private'  
       CHECK (default\_visibility IN ('private', 'share\_link\_only', 'discoverable')),

   allow\_discovery BOOLEAN NOT NULL DEFAULT false,  
   allow\_external\_share BOOLEAN NOT NULL DEFAULT true,  
   allow\_search\_engine\_indexing BOOLEAN NOT NULL DEFAULT false,

   show\_city BOOLEAN NOT NULL DEFAULT true,  
   show\_country BOOLEAN NOT NULL DEFAULT true,  
   show\_media BOOLEAN NOT NULL DEFAULT true,

   require\_authenticated\_viewer BOOLEAN NOT NULL DEFAULT false,

   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE INDEX IF NOT EXISTS idx\_profile\_visibility\_discovery  
ON profile\_visibility\_settings (allow\_discovery);

\-- \=========================  
\-- SHARE LINKS  
\-- \=========================

CREATE TABLE IF NOT EXISTS share\_links (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
   profile\_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

   token\_hash TEXT NOT NULL UNIQUE,  
   label TEXT,

   access\_scope TEXT NOT NULL DEFAULT 'profile'  
       CHECK (access\_scope IN ('profile', 'limited', 'custom')),

   expires\_at TIMESTAMPTZ,  
   max\_views INTEGER,  
   view\_count INTEGER NOT NULL DEFAULT 0,

   is\_revoked BOOLEAN NOT NULL DEFAULT false,

   created\_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   last\_used\_at TIMESTAMPTZ  
);

CREATE INDEX IF NOT EXISTS idx\_share\_links\_profile\_id ON share\_links (profile\_id);  
CREATE INDEX IF NOT EXISTS idx\_share\_links\_token\_hash ON share\_links (token\_hash);  
CREATE INDEX IF NOT EXISTS idx\_share\_links\_expires\_at ON share\_links (expires\_at);  
CREATE INDEX IF NOT EXISTS idx\_share\_links\_revoked ON share\_links (is\_revoked);

\-- \=========================  
\-- PROFILE VIEWS  
\-- \=========================

CREATE TABLE IF NOT EXISTS profile\_views (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

   profile\_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,  
   viewer\_user\_id UUID REFERENCES users(id) ON DELETE SET NULL,  
   share\_link\_id UUID REFERENCES share\_links(id) ON DELETE SET NULL,

   source\_type TEXT NOT NULL DEFAULT 'unknown'  
       CHECK (source\_type IN ('share\_link', 'discovery', 'direct', 'unknown')),

   viewer\_hash TEXT,  
   ip\_hash TEXT,  
   user\_agent\_hash TEXT,

   viewed\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE INDEX IF NOT EXISTS idx\_profile\_views\_profile\_id ON profile\_views (profile\_id);  
CREATE INDEX IF NOT EXISTS idx\_profile\_views\_viewed\_at ON profile\_views (viewed\_at);  
CREATE INDEX IF NOT EXISTS idx\_profile\_views\_share\_link\_id ON profile\_views (share\_link\_id);  
CREATE INDEX IF NOT EXISTS idx\_profile\_views\_analytics  
ON profile\_views (profile\_id, viewed\_at, source\_type);

\-- \=========================  
\-- INTERACTIONS  
\-- \=========================

CREATE TABLE IF NOT EXISTS interactions (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

   profile\_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,  
   sender\_user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
   receiver\_user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

   interaction\_type TEXT NOT NULL  
       CHECK (interaction\_type IN ('connection\_request', 'intro\_message', 'question\_response')),

   message TEXT,  
   payload JSONB NOT NULL DEFAULT '{}'::jsonb,

   status TEXT NOT NULL DEFAULT 'pending'  
       CHECK (status IN ('pending', 'accepted', 'declined', 'ignored', 'blocked', 'reported')),

   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now(),

   CONSTRAINT no\_self\_interaction CHECK (sender\_user\_id \<\> receiver\_user\_id)  
);

CREATE UNIQUE INDEX IF NOT EXISTS unique\_pending\_interaction  
ON interactions (profile\_id, sender\_user\_id)  
WHERE status \= 'pending';

CREATE INDEX IF NOT EXISTS idx\_interactions\_profile\_id ON interactions (profile\_id);  
CREATE INDEX IF NOT EXISTS idx\_interactions\_sender ON interactions (sender\_user\_id);  
CREATE INDEX IF NOT EXISTS idx\_interactions\_receiver ON interactions (receiver\_user\_id);  
CREATE INDEX IF NOT EXISTS idx\_interactions\_status ON interactions (status);

\-- \=========================  
\-- USER BLOCKS  
\-- \=========================

CREATE TABLE IF NOT EXISTS user\_blocks (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

   blocker\_user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
   blocked\_user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

   reason TEXT,  
   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),

   CONSTRAINT no\_self\_block CHECK (blocker\_user\_id \<\> blocked\_user\_id),  
   CONSTRAINT unique\_user\_block UNIQUE (blocker\_user\_id, blocked\_user\_id)  
);

CREATE INDEX IF NOT EXISTS idx\_user\_blocks\_blocker ON user\_blocks (blocker\_user\_id);  
CREATE INDEX IF NOT EXISTS idx\_user\_blocks\_blocked ON user\_blocks (blocked\_user\_id);

\-- \=========================  
\-- REPORTS / MODERATION  
\-- \=========================

CREATE TABLE IF NOT EXISTS reports (  
   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

   reporter\_user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
   reported\_user\_id UUID REFERENCES users(id) ON DELETE SET NULL,  
   profile\_id UUID REFERENCES profiles(id) ON DELETE SET NULL,  
   interaction\_id UUID REFERENCES interactions(id) ON DELETE SET NULL,

   report\_type TEXT NOT NULL  
       CHECK (report\_type IN (  
           'harassment',  
           'fake\_profile',  
           'spam',  
           'inappropriate\_content',  
           'privacy\_violation',  
           'other'  
       )),

   description TEXT,

   status TEXT NOT NULL DEFAULT 'open'  
       CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),

   resolution TEXT,  
   reviewed\_by UUID REFERENCES users(id) ON DELETE SET NULL,  
   reviewed\_at TIMESTAMPTZ,

   created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
   updated\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE INDEX IF NOT EXISTS idx\_reports\_status ON reports (status);  
CREATE INDEX IF NOT EXISTS idx\_reports\_reporter ON reports (reporter\_user\_id);  
CREATE INDEX IF NOT EXISTS idx\_reports\_reported\_user ON reports (reported\_user\_id);  
CREATE INDEX IF NOT EXISTS idx\_reports\_profile\_id ON reports (profile\_id);  
CREATE INDEX IF NOT EXISTS idx\_reports\_interaction\_id ON reports (interaction\_id);  
---

# **3.3 API Design — Express Style**

## **Auth Routes**

### **`POST /api/auth/register`**

{  
 "email": "maya@example.com",  
 "password": "StrongPassword123\!",  
 "displayName": "Maya Tan",  
 "dateOfBirth": "1998-05-12"  
}

Response:

{  
 "user": {  
   "id": "uuid",  
   "email": "maya@example.com",  
   "displayName": "Maya Tan"  
 },  
 "token": "jwt\_token"  
}  
---

### **`POST /api/auth/login`**

{  
 "email": "maya@example.com",  
 "password": "StrongPassword123\!"  
}

Response:

{  
 "user": {  
   "id": "uuid",  
   "email": "maya@example.com",  
   "displayName": "Maya Tan"  
 },  
 "token": "jwt\_token"  
}  
---

### **`GET /api/auth/me`**

Headers:

Authorization: Bearer \<jwt\>

Response:

{  
 "id": "uuid",  
 "email": "maya@example.com",  
 "displayName": "Maya Tan",  
 "role": "user",  
 "status": "active"  
}  
---

## **Profile Routes**

### **`POST /api/profiles`**

{  
 "slug": "maya-tan",  
 "headline": "Designer, runner, thoughtful conversationalist",  
 "bio": "I enjoy good coffee, long walks, and meaningful conversations.",  
 "connectionIntent": "intentional\_connections",  
 "city": "Kuala Lumpur",  
 "countryCode": "MY"  
}

Response:

{  
 "id": "profile\_uuid",  
 "userId": "user\_uuid",  
 "slug": "maya-tan",  
 "status": "draft"  
}  
---

### **`GET /api/profiles/me`**

Returns authenticated user’s own profile, including private sections.

---

### **`PATCH /api/profiles/:profileId`**

{  
 "headline": "Product designer and weekend trail runner",  
 "bio": "Updated bio text",  
 "status": "published"  
}

Response:

{  
 "id": "profile\_uuid",  
 "updated": true  
}  
---

### **`GET /api/profiles/:profileId`**

Authenticated route for owner/admin access.

---

### **`GET /api/p/:slug`**

Public/share-facing profile route.

Rules:

* If profile is private, require valid share token.  
* If discoverable, show only profile-visible sections.  
* Do not return private sections.  
* Do not return sensitive owner data.

Query:

/api/p/maya-tan?token=share\_token

Response:

{  
 "profile": {  
   "id": "profile\_uuid",  
   "slug": "maya-tan",  
   "headline": "Designer, runner, thoughtful conversationalist",  
   "bio": "I enjoy good coffee, long walks, and meaningful conversations.",  
   "connectionIntent": "intentional\_connections",  
   "city": "Kuala Lumpur",  
   "countryCode": "MY",  
   "coverImageUrl": "https://cdn.example.com/profile/profile\_uuid/cover.jpg"  
 },  
 "sections": \[  
   {  
     "id": "section\_uuid",  
     "sectionKey": "values",  
     "title": "Values",  
     "content": {  
       "items": \["Kindness", "Curiosity", "Consistency"\]  
     }  
   }  
 \],  
 "viewerPermissions": {  
   "canInteract": true,  
   "canReport": true  
 }  
}  
---

## **Profile Section Routes**

### **`POST /api/profiles/:profileId/sections`**

{  
 "sectionKey": "values",  
 "title": "Values",  
 "content": {  
   "items": \["Kindness", "Curiosity", "Consistency"\]  
 },  
 "visibility": "profile",  
 "sortOrder": 1  
}

Response:

{  
 "id": "section\_uuid",  
 "created": true  
}  
---

### **`PATCH /api/profiles/:profileId/sections/:sectionId`**

{  
 "title": "What I Value",  
 "content": {  
   "items": \["Kindness", "Emotional maturity", "Curiosity"\]  
 },  
 "visibility": "share\_link",  
 "sortOrder": 2,  
 "isEnabled": true  
}  
---

### **`DELETE /api/profiles/:profileId/sections/:sectionId`**

Response:

{  
 "deleted": true  
}  
---

## **Visibility Routes**

### **`GET /api/profiles/:profileId/visibility`**

Response:

{  
 "profileId": "profile\_uuid",  
 "defaultVisibility": "private",  
 "allowDiscovery": false,  
 "allowExternalShare": true,  
 "allowSearchEngineIndexing": false,  
 "requireAuthenticatedViewer": false  
}  
---

### **`PATCH /api/profiles/:profileId/visibility`**

{  
 "defaultVisibility": "share\_link\_only",  
 "allowDiscovery": false,  
 "allowExternalShare": true,  
 "allowSearchEngineIndexing": false,  
 "requireAuthenticatedViewer": false  
}  
---

## **Media Upload Routes**

### **`POST /api/profiles/:profileId/media/upload-url`**

{  
 "fileName": "cover.jpg",  
 "contentType": "image/jpeg",  
 "fileSizeBytes": 840000,  
 "mediaType": "image"  
}

Response:

{  
 "uploadUrl": "https://s3-presigned-put-url",  
 "s3Key": "profiles/profile\_uuid/media/generated-id.jpg",  
 "expiresInSeconds": 300  
}  
---

### **`POST /api/profiles/:profileId/media`**

{  
 "mediaType": "image",  
 "s3Key": "profiles/profile\_uuid/media/generated-id.jpg",  
 "contentType": "image/jpeg",  
 "fileSizeBytes": 840000,  
 "altText": "Profile cover photo",  
 "isCover": true,  
 "visibility": "profile"  
}

Response:

{  
 "id": "media\_uuid",  
 "assetUrl": "https://cdn.example.com/profiles/profile\_uuid/media/generated-id.jpg",  
 "isCover": true  
}  
---

## **Share Link Routes**

### **`POST /api/profiles/:profileId/share-links`**

{  
 "label": "WhatsApp intro link",  
 "accessScope": "profile",  
 "expiresAt": "2026-05-31T23:59:59Z",  
 "maxViews": 25  
}

Response:

{  
 "id": "share\_link\_uuid",  
 "url": "https://app.example.com/p/maya-tan?token=raw\_share\_token",  
 "expiresAt": "2026-05-31T23:59:59Z",  
 "maxViews": 25  
}

Implementation note:

* Store only `token_hash` in DB.  
* Return raw token only once at creation.

---

### **`GET /api/profiles/:profileId/share-links`**

Response:

{  
 "items": \[  
   {  
     "id": "share\_link\_uuid",  
     "label": "WhatsApp intro link",  
     "accessScope": "profile",  
     "expiresAt": "2026-05-31T23:59:59Z",  
     "maxViews": 25,  
     "viewCount": 4,  
     "isRevoked": false,  
     "createdAt": "2026-04-29T10:00:00Z"  
   }  
 \]  
}  
---

### **`PATCH /api/share-links/:shareLinkId/revoke`**

Response:

{  
 "id": "share\_link\_uuid",  
 "isRevoked": true  
}  
---

## **Discovery Routes**

### **`GET /api/discovery/search`**

Query:

/api/discovery/search?q=coffee\&countryCode=MY\&connectionIntent=friendship\&page=1\&pageSize=12

Response:

{  
 "items": \[  
   {  
     "profileId": "profile\_uuid",  
     "slug": "maya-tan",  
     "headline": "Designer, runner, thoughtful conversationalist",  
     "connectionIntent": "friendship",  
     "city": "Kuala Lumpur",  
     "countryCode": "MY",  
     "coverImageUrl": "https://cdn.example.com/profiles/profile\_uuid/cover.jpg"  
   }  
 \],  
 "pagination": {  
   "page": 1,  
   "pageSize": 12,  
   "total": 1  
 }  
}

Rules:

* Requires authentication.  
* Only returns profiles with `allow_discovery = true`.  
* Excludes blocked users both ways.  
* Excludes suspended/banned/deleted users.  
* Returns limited profile card only.

---

## **View Logging Routes**

### **`POST /api/profiles/:profileId/views`**

{  
 "sourceType": "share\_link",  
 "shareToken": "raw\_share\_token"  
}

Response:

{  
 "logged": true  
}

Rules:

* Hash IP and user agent.  
* Do not expose viewer identity to profile owner.  
* Deduplicate in analytics layer where needed.

---

## **Analytics Routes**

### **`GET /api/profiles/:profileId/analytics?range=30d`**

Response:

{  
 "profileId": "profile\_uuid",  
 "range": "30d",  
 "summary": {  
   "totalViews": 120,  
   "estimatedUniqueViews": 76,  
   "shareLinkViews": 90,  
   "discoveryViews": 25,  
   "directViews": 5  
 },  
 "daily": \[  
   {  
     "date": "2026-04-29",  
     "views": 8  
   }  
 \]  
}

Rules:

* Owner only.  
* No exact viewer list.  
* No individual timestamps exposed unless aggregated.

---

## **Interaction Routes**

### **`POST /api/profiles/:profileId/interactions`**

{  
 "interactionType": "intro\_message",  
 "message": "Hi Maya, I liked your note about slow travel and thoughtful conversations.",  
 "payload": {  
   "promptId": "favorite-weekend",  
   "promptResponse": "My ideal weekend includes a quiet cafe and a long walk."  
 }  
}

Response:

{  
 "id": "interaction\_uuid",  
 "status": "pending"  
}

Rules:

* Requires authentication.  
* Cannot interact with own profile.  
* Cannot interact if blocked.  
* One pending interaction per sender/profile.  
* Rate limited.

---

### **`GET /api/interactions/inbox`**

Response:

{  
 "items": \[  
   {  
     "id": "interaction\_uuid",  
     "profileId": "profile\_uuid",  
     "sender": {  
       "id": "user\_uuid",  
       "displayName": "Daniel"  
     },  
     "interactionType": "intro\_message",  
     "message": "Hi Maya...",  
     "status": "pending",  
     "createdAt": "2026-04-29T10:30:00Z"  
   }  
 \]  
}  
---

### **`PATCH /api/interactions/:interactionId/respond`**

{  
 "status": "accepted"  
}

Allowed statuses:

accepted | declined | ignored | blocked | reported

Response:

{  
 "id": "interaction\_uuid",  
 "status": "accepted"  
}  
---

## **Blocking Routes**

### **`POST /api/blocks`**

{  
 "blockedUserId": "blocked\_user\_uuid",  
 "reason": "Unwanted repeated contact"  
}

Response:

{  
 "id": "block\_uuid",  
 "blocked": true  
}  
---

### **`DELETE /api/blocks/:blockedUserId`**

Response:

{  
 "unblocked": true  
}  
---

## **Report Routes**

### **`POST /api/reports`**

{  
 "reportedUserId": "reported\_user\_uuid",  
 "profileId": "profile\_uuid",  
 "interactionId": "interaction\_uuid",  
 "reportType": "harassment",  
 "description": "User sent repeated unwanted messages."  
}

Response:

{  
 "id": "report\_uuid",  
 "status": "open"  
}  
---

## **Admin Moderation Routes**

### **`GET /api/admin/reports?status=open`**

Admin/moderator only.

---

### **`PATCH /api/admin/reports/:reportId`**

{  
 "status": "resolved",  
 "resolution": "User warned and interaction removed."  
}  
---

# **3.4 Sample Payloads**

## **Create Profile**

{  
 "slug": "maya-tan",  
 "headline": "Designer, runner, thoughtful conversationalist",  
 "bio": "I enjoy good coffee, long walks, and meaningful conversations.",  
 "connectionIntent": "intentional\_connections",  
 "city": "Kuala Lumpur",  
 "countryCode": "MY"  
}  
---

## **Fetch Profile**

{  
 "profile": {  
   "id": "9d6e3943-2d48-43f1-b94e-dcd3d5b23281",  
   "slug": "maya-tan",  
   "headline": "Designer, runner, thoughtful conversationalist",  
   "bio": "I enjoy good coffee, long walks, and meaningful conversations.",  
   "connectionIntent": "intentional\_connections",  
   "city": "Kuala Lumpur",  
   "countryCode": "MY",  
   "coverImageUrl": "https://cdn.example.com/profiles/9d6e3943/cover.jpg"  
 },  
 "sections": \[  
   {  
     "id": "f61f463d-98db-4c3c-840a-7565a2a77f0c",  
     "sectionKey": "values",  
     "title": "Values",  
     "content": {  
       "items": \["Kindness", "Curiosity", "Consistency"\]  
     },  
     "visibility": "profile",  
     "sortOrder": 1  
   },  
   {  
     "id": "c6d9968c-c446-41e3-bdcb-918a3549d875",  
     "sectionKey": "interests",  
     "title": "Interests",  
     "content": {  
       "items": \["Coffee", "Trail running", "Design", "Books"\]  
     },  
     "visibility": "profile",  
     "sortOrder": 2  
   }  
 \]  
}  
---

## **Generate Share Link**

{  
 "label": "Intro link for friends",  
 "accessScope": "profile",  
 "expiresAt": "2026-05-31T23:59:59Z",  
 "maxViews": 25  
}

Response:

{  
 "id": "e0d5dc2e-88fc-477f-89c6-4ac57e9e02cf",  
 "url": "https://app.example.com/p/maya-tan?token=eyJrandomShareToken",  
 "expiresAt": "2026-05-31T23:59:59Z",  
 "maxViews": 25  
}  
---

## **Log View**

{  
 "sourceType": "share\_link",  
 "shareToken": "eyJrandomShareToken"  
}

Response:

{  
 "logged": true  
}  
---

## **Interaction Action**

{  
 "interactionType": "intro\_message",  
 "message": "Hi Maya, your profile mentioned slow travel and thoughtful conversations. I relate to that.",  
 "payload": {  
   "source": "profile\_view"  
 }  
}

Response:

{  
 "id": "7bd87259-5526-4e77-a70c-7d307132d5a4",  
 "status": "pending"  
}  
---

# **3.5 Frontend Structure — React**

src/  
 api/  
   authApi.js  
   profileApi.js  
   mediaApi.js  
   shareLinksApi.js  
   discoveryApi.js  
   interactionsApi.js  
   reportsApi.js

 auth/  
   AuthProvider.jsx  
   ProtectedRoute.jsx  
   useAuth.js

 pages/  
   LoginPage.jsx  
   RegisterPage.jsx  
   ProfileBuilderPage.jsx  
   ProfileViewPage.jsx  
   DiscoveryPage.jsx  
   InteractionInboxPage.jsx  
   SettingsPage.jsx  
   AdminReportsPage.jsx

 components/  
   profile/  
     ProfileBuilder.jsx  
     ProfileSectionEditor.jsx  
     ProfileSectionList.jsx  
     ProfileMediaManager.jsx  
     ProfileView.jsx  
     ProfileHeader.jsx  
     ProfileSectionRenderer.jsx  
     ShareSettingsModal.jsx  
     VisibilitySettingsPanel.jsx

   discovery/  
     DiscoveryFilters.jsx  
     DiscoveryResultCard.jsx  
     DiscoveryResultsGrid.jsx

   interactions/  
     InteractionPanel.jsx  
     InteractionInboxList.jsx  
     InteractionCard.jsx

   safety/  
     ReportModal.jsx  
     BlockUserButton.jsx

   common/  
     Button.jsx  
     Modal.jsx  
     EmptyState.jsx  
     LoadingState.jsx  
     ErrorState.jsx

 hooks/  
   useProfile.js  
   useProfileSections.js  
   useShareLinks.js  
   useDiscoverySearch.js  
   useInteractions.js  
   useProfileAnalytics.js

 utils/  
   apiClient.js  
   validators.js  
   media.js  
---

## **Key Components**

### **`ProfileBuilder`**

Responsibilities:

* Fetch owner profile.  
* Edit base profile fields.  
* Manage sections.  
* Manage media.  
* Open share settings.  
* Save draft or publish.

---

### **`ProfileView`**

Responsibilities:

* Render public/share-facing profile.  
* Respect returned visibility-filtered sections.  
* Trigger privacy-safe view logging.  
* Show interaction panel if allowed.  
* Show report/block controls.

---

### **`ShareSettingsModal`**

Responsibilities:

* Create share links.  
* Set expiry.  
* Set max views.  
* Revoke links.  
* Display existing links without exposing raw token again.

---

### **`DiscoveryPage`**

Responsibilities:

* Authenticated search.  
* Filter by intent, country, keyword.  
* Render limited result cards.  
* Prevent infinite scraping with pagination and rate limits.

---

### **`InteractionPanel`**

Responsibilities:

* Submit connection request or intro message.  
* Disable if blocked, unauthenticated, self-profile, or already pending.  
* Show respectful interaction guidance.

---

# **3.6 State Management**

## **Recommended MVP Approach**

Use:

* React Query for server state  
* Local component state for forms  
* Auth context for current user/session  
* No Redux required for MVP

## **Data Flow**

ProfileBuilderPage  
 \-\> useProfile()  
 \-\> useProfileSections()  
 \-\> local form state  
 \-\> save mutation  
 \-\> invalidate profile query  
 \-\> ProfileView preview refreshes from updated query cache

## **Query Keys**

\['auth', 'me'\]  
\['profile', 'me'\]  
\['profile', profileId\]  
\['profile-sections', profileId\]  
\['share-links', profileId\]  
\['profile-analytics', profileId, range\]  
\['discovery', filters\]  
\['interactions', 'inbox'\]

## **Editor-to-Viewer Refresh**

When saving a section:

queryClient.invalidateQueries(\['profile', profileId\]);  
queryClient.invalidateQueries(\['profile-sections', profileId\]);

For same-page preview:

queryClient.setQueryData(\['profile-sections', profileId\], updatedSections);  
---

# **3.7 Media Handling**

## **Upload Flow**

1. Frontend requests signed upload URL.  
2. Backend validates file type and size.  
3. Backend returns `uploadUrl` and `s3Key`.  
4. Frontend uploads file directly to S3.  
5. Frontend calls backend to create media DB record.  
6. Backend stores `s3_key`, metadata, and generated CDN URL if applicable.

## **S3 Key Pattern**

profiles/{profileId}/media/{mediaId}.{ext}

Example:

profiles/9d6e3943-2d48-43f1-b94e-dcd3d5b23281/media/cover-01.jpg

## **Store `s3_key` vs Public URL**

Store:

s3\_key  
content\_type  
file\_size\_bytes  
sha256  
asset\_url

Recommended:

* `s3_key` is the source of truth.  
* `asset_url` is a convenience field for rendering.  
* For private media, generate signed GET URLs.  
* For profile cover images, use CDN URL only if the image is allowed to be visible.

## **Cover Image Rules**

* Only one cover image per profile should be active.  
* When `is_cover = true`, unset other cover images for same profile.  
* Cover image visibility must respect profile visibility.  
* Discovery cards should only show cover image if `show_media = true`.

---

# **3.8 Privacy and Safety Design**

## **Profile Visibility**

### **Visibility Modes**

| Mode | Behavior |
| ----- | ----- |
| `private` | Not discoverable. Requires owner access or valid share link. |
| `share_link_only` | Accessible only via valid share link. Not searchable. |
| `discoverable` | Appears in authenticated discovery search. |

Default:

private

## **Section Visibility**

| Visibility | Behavior |
| ----- | ----- |
| `private` | Owner only |
| `share_link` | Visible through valid share link |
| `profile` | Visible on allowed profile view |

Rules:

* API must filter sections server-side.  
* Frontend must not be trusted for privacy filtering.

---

## **Share Link Validation**

A share link is valid only if:

token hash matches  
AND is\_revoked \= false  
AND expires\_at is null OR expires\_at \> now()  
AND max\_views is null OR view\_count \< max\_views  
AND profile owner is active  
AND profile status \= published

After successful use:

UPDATE share\_links  
SET view\_count \= view\_count \+ 1,  
   last\_used\_at \= now()  
WHERE id \= $1;

Use a transaction to prevent race conditions on `max_views`.

---

## **Scraping and Abuse Prevention**

MVP controls:

* Discovery requires authentication.  
* Rate limit discovery and profile view endpoints.  
* Paginate search results.  
* Do not expose email, exact birthdate, or sensitive user data.  
* Add `noindex` meta tag unless profile owner explicitly allows indexing.  
* Hash IP/user agent in profile views.  
* Use share token hashing.  
* Blocked users cannot search, view, or interact.  
* Suspended/banned users cannot appear in discovery.  
* Interaction endpoints are rate limited.  
* One pending interaction per profile/sender pair.

Recommended Express middleware:

app.use(helmet());  
app.use(cors({ origin: allowedOrigins, credentials: true }));  
app.use('/api/discovery', discoveryRateLimiter);  
app.use('/api/profiles', profileViewRateLimiter);  
app.use('/api/interactions', interactionRateLimiter);  
---

## **Reporting Flow**

1. User submits report.  
2. Report status starts as `open`.  
3. Moderator reviews.  
4. Moderator sets status to:  
   * `reviewing`  
   * `resolved`  
   * `dismissed`  
5. Moderator may suspend or ban user.  
6. Reported content can be hidden if needed.

---

## **Blocking Flow**

When User A blocks User B:

* User B cannot view User A’s profile.  
* User B cannot discover User A.  
* User B cannot interact with User A.  
* Existing pending interactions from User B should be marked `blocked`.

---

# **3.9 MVP Scoping**

## **Must Have**

* User registration/login  
* JWT auth middleware  
* User profile CRUD  
* Modular profile sections  
* Profile media upload via S3 signed URL  
* Profile visibility settings  
* Share link generation with expiry/revocation/max views  
* Share-facing profile view  
* Controlled authenticated discovery  
* Non-swipe interaction request  
* Interaction inbox  
* Reporting  
* Blocking  
* Privacy-safe analytics  
* Basic admin report API

---

## **Nice to Have**

* Admin moderation UI  
* Profile completion checklist  
* Section templates  
* Link-level custom section visibility  
* Email verification  
* Basic notification emails  
* Profile preview mode  
* Custom profile themes  
* Soft delete for profile sections/media

---

## **Future**

* Identity verification  
* Social/workplace verification  
* Private references instead of public testimonials  
* Compatibility prompts  
* AI-assisted profile improvement  
* AI-assisted safety moderation  
* Recommendation engine without swipe mechanics  
* Calendar/event-based intentional meetups  
* In-platform messaging after accepted connection  
* Paid profile customization  
* Advanced analytics with privacy thresholds  
* Organization/community profiles

---

# **4\. Backend Implementation Notes for AI Coding Agent**

## **Suggested Express Structure**

src/  
 app.js  
 server.js

 config/  
   db.js  
   env.js  
   s3.js

 middleware/  
   authMiddleware.js  
   requireRole.js  
   rateLimiters.js  
   errorHandler.js

 modules/  
   auth/  
     auth.routes.js  
     auth.controller.js  
     auth.service.js  
     auth.validators.js

   profiles/  
     profile.routes.js  
     profile.controller.js  
     profile.service.js  
     profile.repository.js  
     profile.validators.js

   media/  
     media.routes.js  
     media.controller.js  
     media.service.js

   shareLinks/  
     shareLink.routes.js  
     shareLink.controller.js  
     shareLink.service.js

   discovery/  
     discovery.routes.js  
     discovery.controller.js  
     discovery.service.js

   interactions/  
     interaction.routes.js  
     interaction.controller.js  
     interaction.service.js

   reports/  
     report.routes.js  
     report.controller.js  
     report.service.js

   blocks/  
     block.routes.js  
     block.controller.js  
     block.service.js

   analytics/  
     analytics.routes.js  
     analytics.controller.js  
     analytics.service.js

 utils/  
   hashToken.js  
   generateToken.js  
   normalizeProfile.js  
   visibility.js  
---

## **Required Middleware Rules**

// Protected routes  
requireAuth

// Admin routes  
requireAuth  
requireRole(\['admin', 'moderator'\])

// Owner profile routes  
requireAuth  
requireProfileOwner

// Public profile route  
optionalAuth  
validateProfileAccess  
filterProfileVisibility  
---

## **Visibility Helper Contract**

function canViewProfile({  
 profile,  
 visibilitySettings,  
 viewerUserId,  
 shareLink,  
 isOwner,  
 isAdmin,  
 isBlocked  
}) {  
 if (isAdmin || isOwner) return true;  
 if (isBlocked) return false;  
 if (profile.status \!== 'published') return false;

 if (visibilitySettings.defaultVisibility \=== 'discoverable') {  
   return true;  
 }

 if (  
   visibilitySettings.defaultVisibility \=== 'share\_link\_only' ||  
   visibilitySettings.defaultVisibility \=== 'private'  
 ) {  
   return Boolean(shareLink && shareLink.isValid);  
 }

 return false;  
}  
---

## **Section Filtering Contract**

function filterSectionsForViewer({ sections, isOwner, hasValidShareLink }) {  
 if (isOwner) return sections;

 return sections.filter((section) \=\> {  
   if (\!section.is\_enabled) return false;  
   if (section.visibility \=== 'private') return false;  
   if (section.visibility \=== 'share\_link') return hasValidShareLink;  
   if (section.visibility \=== 'profile') return true;  
   return false;  
 });  
}  
---

# **5\. Frontend Route Map**

/auth/login  
/auth/register

/profile/builder  
/profile/settings  
/profile/analytics  
/profile/share

/p/:slug

/discovery  
/interactions/inbox

/admin/reports  
---

# **6\. Environment Variables**

NODE\_ENV=development  
PORT=3001

DATABASE\_URL=postgresql://user:password@localhost:5432/portable\_identity

JWT\_SECRET=replace\_me  
JWT\_EXPIRES\_IN=7d

APP\_BASE\_URL=http://localhost:3000  
API\_BASE\_URL=http://localhost:3001

AWS\_REGION=ap-southeast-1  
AWS\_S3\_BUCKET=portable-identity-media  
AWS\_ACCESS\_KEY\_ID=replace\_me  
AWS\_SECRET\_ACCESS\_KEY=replace\_me  
AWS\_CLOUDFRONT\_BASE\_URL=https://cdn.example.com

BCRYPT\_SALT\_ROUNDS=12

DISCOVERY\_RATE\_LIMIT\_WINDOW\_MS=60000  
DISCOVERY\_RATE\_LIMIT\_MAX=30  
PROFILE\_VIEW\_RATE\_LIMIT\_MAX=120  
INTERACTION\_RATE\_LIMIT\_MAX=10  
---

# **7\. Implementation Order**

## **Phase 1 — Foundation**

1. Create database schema.  
2. Implement auth.  
3. Implement JWT middleware.  
4. Implement profile CRUD.  
5. Implement profile sections.

## **Phase 2 — Sharing and Visibility**

1. Implement visibility settings.  
2. Implement share link generation.  
3. Implement share-facing profile route.  
4. Implement section filtering.  
5. Implement profile view logging.

## **Phase 3 — Media**

1. Implement signed S3 upload URL.  
2. Implement media record creation.  
3. Implement cover image handling.  
4. Render media in profile view.

## **Phase 4 — Discovery and Interaction**

1. Implement authenticated discovery.  
2. Implement block-aware filtering.  
3. Implement interaction creation.  
4. Implement interaction inbox.  
5. Implement interaction response actions.

## **Phase 5 — Safety and Analytics**

1. Implement reports.  
2. Implement blocking.  
3. Implement admin report APIs.  
4. Implement aggregated analytics.  
5. Add rate limits and abuse controls.

---

# **8\. Critical Guardrails for Developers**

* Profiles must be private by default.  
* Never expose exact viewer identity in analytics.  
* Never expose private sections from API responses.  
* Never store raw share tokens.  
* Never allow blocked users to view, discover, or interact.  
* Never allow suspended/banned users to appear in discovery.  
* Never add public testimonials in MVP.  
* Discovery must require authentication.  
* Profile pages should use `noindex` unless explicitly enabled.  
* All privacy enforcement must happen server-side.

