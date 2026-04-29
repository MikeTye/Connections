# **Portable Identity Platform for Intentional Human Connections — MVP Specification**

## **1\. PRD**

### **1.1 Problem Statement**

People want to make meaningful connections beyond closed social or dating apps, but current platforms often rely on shallow profiles, swipe mechanics, poor privacy controls, and weak safety protections.

Users need a portable, privacy-controlled profile that they can share intentionally with others while retaining control over visibility, access, and engagement.

This MVP enables users to create a rich personal microsite, share it safely, allow controlled discovery, and receive non-swipe interactions.

---

### **1.2 Target Users / Personas**

| Persona | Description | Core Need |
| ----- | ----- | ----- |
| Intentional dater | Wants deeper compatibility signals before meeting people | Rich profile \+ controlled sharing |
| Social/networking user | Wants to meet collaborators, friends, or community members | Multi-purpose identity profile |
| Privacy-conscious user | Wants to share selectively, not publicly | Expiring/private links and visibility control |
| Platform moderator/admin | Needs tools to handle abuse, reports, and unsafe behavior | Reporting, blocking, moderation queue |

---

### **1.3 Core Value Proposition**

A user-owned, shareable identity profile for intentional connections, with strong privacy controls, non-swipe interaction, and safety-first discovery.

---

### **1.4 User Journeys**

#### **Journey 1: Create and Share a Private Profile**

1. User signs up.  
2. User creates profile.  
3. User adds sections: bio, interests, values, connection intent, prompts, media.  
4. User sets profile visibility to private.  
5. User generates an expiring share link.  
6. User sends link through WhatsApp or social media.  
7. Recipient opens link.  
8. Recipient sees only the sections allowed by the owner.  
9. View is logged in privacy-safe form.

---

#### **Journey 2: Controlled Discovery**

1. User sets profile discoverability to limited.  
2. User chooses searchable fields such as city, interests, intent type.  
3. Another authenticated user searches by filters.  
4. Search results show limited profile cards.  
5. Viewer requests to connect or sends a structured intro.  
6. Profile owner can accept, ignore, block, or report.

---

#### **Journey 3: Non-Swipe Interaction**

1. Viewer opens a profile.  
2. Viewer cannot “like/swipe.”  
3. Viewer sends one of:  
   * connection request  
   * short intro message  
   * question response  
4. Profile owner receives the interaction.  
5. Owner can accept, decline, ignore, block, or report.  
6. If accepted, users may reveal additional contact details or continue in-platform.

---

#### **Journey 4: Safety and Reporting**

1. User receives unwanted interaction.  
2. User blocks sender.  
3. Blocked sender can no longer view profile, search profile, or interact.  
4. User submits report.  
5. Admin reviews report.  
6. Admin can dismiss, warn, suspend, or ban.

---

### **1.5 MVP Feature Priorities**

| Priority | Feature | Notes |
| ----- | ----- | ----- |
| Must Have | Authentication | JWT-based login/register |
| Must Have | Profile builder | Modular profile sections |
| Must Have | Profile visibility settings | Private by default |
| Must Have | Share links | Private, expiring, revocable |
| Must Have | Profile view page | Shareable microsite |
| Must Have | Controlled discovery | Authenticated search only |
| Must Have | Non-swipe interactions | Connection request / intro |
| Must Have | Reporting and blocking | Basic safety controls |
| Must Have | Privacy-safe analytics | Aggregated only |
| Nice to Have | Section-level visibility | Public/link-only/private |
| Nice to Have | Profile completion guide | Helps onboarding |
| Nice to Have | Admin moderation dashboard | Can start as API-only |
| Future | Verification | Identity, social, workplace |
| Future | Compatibility matching | Non-swipe recommendation |
| Future | Testimonials | Only private references, not public reviews |

---

### **1.6 Non-Goals**

The MVP will not include:

* Swipe-based matching  
* Public testimonials or ratings  
* Real-time chat  
* Location tracking  
* Exact viewer identity disclosure  
* Public open web indexing by default  
* Behavioral tracking beyond privacy-safe aggregated analytics  
* AI-based ranking or automated compatibility scoring  
* Payments or subscriptions  
* Full identity verification  
* Social graph import

---

### **1.7 Safety and Privacy Risks**

| Risk | Mitigation |
| ----- | ----- |
| Harassment | Blocking, reporting, interaction limits |
| Stalking | No exact location, no exact viewer identity, private-by-default profiles |
| Scraping | Authenticated discovery, rate limits, share token validation, robots noindex |
| Unwanted exposure | Private default, expiring links, revocable links |
| Abuse via testimonials | No public testimonial feature in MVP |
| Sensitive behavioral leakage | Aggregated analytics only |
| Fake profiles | Email verification, report flow, future identity verification |
| Link forwarding | Optional max views, expiry, revocation, link-level access settings |
| Minor safety | MVP should be 18+ only unless a dedicated teen-safety product is designed separately |

---

### **1.8 MVP Success Metrics**

| Metric | Target |
| ----- | ----- |
| Profile creation completion rate | 60%+ |
| Users generating at least one share link | 40%+ |
| Profile views from shared links | Track weekly growth |
| Interaction conversion rate | Views to connection request |
| Report rate | Monitor abuse ratio |
| Block rate | Monitor unwanted interaction |
| Search-to-profile-open rate | Discovery quality signal |
| Returning weekly active users | Retention indicator |

