
# Tethys WordPress Dev Handbook (v1.0)

**Role:** The Backend "Brain"  
**Frontend:** dcbarletta.com (Next.js)  
**CMS:** cms.dcbarletta.com (WordPress)

This guide defines the exact schema required for the API Routes to function without errors.

---

## 1. Core Configuration

### API & Authentication

The Next.js app uses an **Application Password** to talk to WordPress. Do not use your admin password.

1. Go to **Users > Profile**.
2. Scroll to **Application Passwords**.
3. Name it: `Tethys_NextJS_App`.
4. Copy the generated password.

**Action:** Add this to your `.env` file as `WP_APP_PASS` (remove any spaces).

### Permalinks (The "500 Error" Fix)

If the API returns 404 or 500 errors for new post types:

1. Go to **Settings > Permalinks**.
2. Scroll down and click **Save Changes**. (You don't need to change anything, just saving flushes the rewrite rules).

---

## 2. Custom Post Types (CPT UI)

Create these **exactly as written**. Case sensitivity matters.

### A. Archives (The Map Markers)

- **Slug:** `archival_post`
- **Plural:** Archives
- **Singular:** Archive
- **REST API Base Slug:** `archival_post`
- **Show in REST API:** True
- **Supports:** Title, Editor, Custom Fields

### B. World Events (The Rotating Disk & Seasons)

- **Slug:** `tethys_event`
- **Plural:** World Events
- **Singular:** World Event
- **REST API Base Slug:** `tethys_event`
- **Show in REST API:** True
- **Supports:** Title, Custom Fields

### C. Guest Signatures (The Blank Slate)

- **Slug:** `guest_signature`
- **Plural:** Guest Signatures
- **Singular:** Guest Signature
- **REST API Base Slug:** `guest_signature`
- **Show in REST API:** True
- **Supports:** Title (User Name), Editor (Message)

### D. Characters (The Carousel)

- **Slug:** `character`
- **Plural:** Characters
- **Singular:** Character
- **REST API Base Slug:** `character`
- **Show in REST API:** True
- **Supports:** Title (Name), Editor (Bio), Featured Image (Sketch)

---

## 3. Advanced Custom Fields (ACF)

Create these Field Groups and assign them to the correct Post Types.

### Group 1: Archive Logic

**Location:** Post Type is equal to Archive (`archival_post`)

| Field Label | Field Name | Type | Instructions |
|-------------|------------|------|--------------|
| Map Coordinates | `map_coords` | Group | Container for X/Y |
| ↳ Map X | `map_x` | Number | 0-100 (Percentage from Left) |
| ↳ Map Y | `map_y` | Number | 0-100 (Percentage from Top) |
| Genetic Weights | `genetic_weights` | Group | For evolution logic |
| ↳ Primary Weight | `primary_weight` | Select | creature, lore, geology, human |
| ↳ Secondary Weight | `secondary_weight` | Select | creature, lore, geology, human |
| Proxy City | `proxy_city` | Text | For Weather Engine (e.g., "Kathmandu") |

### Group 2: Event Logic

**Location:** Post Type is equal to World Event (`tethys_event`)

| Field Label | Field Name | Type | Instructions |
|-------------|------------|------|--------------|
| Event Timing | `event_timing` | Group | When does this trigger? |
| ↳ Start Time | `start_time` | Date/Time | YYYY-MM-DD HH:mm:ss |
| ↳ End Time | `end_time` | Date/Time | YYYY-MM-DD HH:mm:ss |
| Effect Payload | `effect_payload` | Text Area | JSON string for UI effects |

**Sample JSON for Payload:**

```json
{
    "rotation_speed": "fast",
    "glow_color": "#00ffaa",
    "hud_message": "The Albian Awakening has begun."
}
```

### Group 3: Character Details

**Location:** Post Type is equal to Character (`character`)

| Field Label | Field Name | Type | Instructions |
|-------------|------------|------|--------------|
| Archetype | `archetype` | Text | e.g., "The Witness", "The Engineer" |
| Faction | `faction` | Text | e.g., "Sky City", "Root Healers" |
| Signature Color | `sig_color` | Color | Hex code for their card border |

---

## 4. Initial Data Seeding (Manual Entry)

To verify the frontend works, create these initial posts manually:

### Post 1: The Countdown Event

- **Post Type:** World Event
- **Title:** "The Albian Awakening"
- **ACF - Start Time:** Today
- **ACF - End Time:** Jan 5, 2026
- **ACF - Payload:** `{"rotation_speed": "fast"}`

### Post 2: Sky City (Weather Test)

- **Post Type:** Archive
- **Title:** "Sky City / Kathmandu Proxy"
- **ACF - Map X:** 50
- **ACF - Map Y:** 50
- **ACF - Proxy City:** Kathmandu

### Post 3: Guestbook Test

- **Post Type:** Guest Signature
- **Title:** "Admin Test"
- **Content:** "The slate is clean."
