# 🗺️ Interactive Map Preview - GrowShare Explore Page

## Visual Overview

The interactive map interface transforms plot discovery into an engaging, game-like experience. Here's what you'll see when you visit `/explore`:

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER (Sticky)                                                     │
│ [🌱 GrowShare]  Explore | Marketplace | Knowledge | Community       │
│                                                      [Dashboard] [@] │
├─────────────────────────────────────────────────────────────────────┤
│ SEARCH BAR                                                          │
│ [🔍 Search by location, city, or plot name...]     [🗺️ Map][▦ Grid]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┬─────────────────────────────────────┬──────────────┐ │
│  │ FILTERS  │        INTERACTIVE MAP             │  PLOT LIST   │ │
│  │          │                                     │              │ │
│  │ 🔍 Filter│   ┌──────────────────────────────┐  │  8 Plots     │ │
│  │ [2]      │   │                              │  │  Available   │ │
│  │          │   │    📍 Markers scattered      │  │ ┌──────────┐ │ │
│  │ 8 plots  │   │    across Asheville area     │  │ │ PLOT 1   │ │ │
│  │ found    │   │                              │  │ │ Image    │ │ │
│  │          │   │    🟢 Green = Available      │  │ │ $400/mo  │ │ │
│  │ [Clear]  │   │    🔵 Blue = Rented          │  │ └──────────┘ │ │
│  │          │   │    ⚫ Gray = Inactive         │  │              │ │
│  │ ▼ Price  │   │                              │  │ ┌──────────┐ │ │
│  │ Min: $   │   │    ┌─────────────┐           │  │ │ PLOT 2   │ │ │
│  │ Max: $   │   │    │ 5ac Plot    │← Marker   │  │ │ Image    │ │ │
│  │          │   │    │ $400/mo     │           │  │ │ $250/mo  │ │ │
│  │ ▼ Acreage│   │    └─────────────┘           │  │ └──────────┘ │ │
│  │ Min:     │   │                              │  │              │ │
│  │ Max:     │   │  Legend:                     │  │ ┌──────────┐ │ │
│  │          │   │  🟢 Available                │  │ │ PLOT 3   │ │ │
│  │ ▼ Feature│   │  🔵 Rented                   │  │ │ Selected │ │ │
│  │ ☑ Irrigtn│   │  ⚫ Inactive                 │  │ │ Highlight│ │ │
│  │ ☑ Fencing│   │                              │  │ │ $850/mo  │ │ │
│  │ ☐ Greenhs│   │      [Nav Controls] ➕➖🧭   │  │ └──────────┘ │ │
│  │          │   │                              │  │    ⋮         │ │
│  │ ▼ Soil   │   └──────────────────────────────┘  │  [Scroll]    │ │
│  │ ☐ Clay   │                                     │              │ │
│  │ ☑ Loam   │                                     │              │ │
│  │ ☐ Sandy  │                                     │              │ │
│  │          │                                     │              │ │
│  │ ▼ Water  │                                     │              │ │
│  │ ☑ Well   │                                     │              │ │
│  │ ☑ Stream │                                     │              │ │
│  └──────────┴─────────────────────────────────────┴──────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. **Top Search Bar**
- **Full-width search input** with 🔍 icon
- Placeholder: "Search by location, city, or plot name..."
- **View Toggle** on the right:
  - 🗺️ Map View (default, highlighted)
  - ▦ Grid View (shows cards in responsive grid)

### 2. **Left Sidebar - Filters** (320px wide)

**Header:**
```
🔍 Filters [2]        [X]
─────────────────────────
✅ 8 plots found
─────────────────────────
Clear all filters
```

**Collapsible Sections:**

**▼ Price Range**
- Min Price/Month: [ $     ]
- Max Price/Month: [ $     ]

**▼ Acreage**
- Min Acres: [ 0.5 ]
- Max Acres: [ Any ]

**▼ Features**
- ☑ Irrigation System
- ☑ Fencing
- ☐ Greenhouse
- ☐ Electricity

**▼ Soil Type**
- ☐ Clay
- ☑ Loam
- ☐ Sandy
- ☐ Silt
- ☐ Peat
- ☐ Chalk

**▼ Water Access**
- ☑ Well
- ☐ Municipal Water
- ☐ Pond
- ☑ Stream/River
- ☐ Irrigation System

### 3. **Center - Interactive Map** (Flex-grow)

**Map Features:**
- **Outdoor terrain style** from Mapbox (shows topography)
- **45° pitch** for 3D feel
- **Custom markers** shaped like location pins:
  - Circular top with pointy bottom
  - Rotated 45° for classic map pin look
  - White border for visibility
  - Number inside = acreage
  - Color = status

**Marker Colors:**
- 🟢 **Green** (#16a34a) = Available plots
- 🔵 **Blue** (#2563eb) = Rented plots
- ⚫ **Gray** (#6b7280) = Inactive plots

**Marker Interaction:**
- **Hover**: Shows popup with plot title and price
- **Click**: Selects plot, highlights in list, flies map to location
- **Selected**: Marker scales up 20%

**Bottom-left Legend:**
```
┌─────────────┐
│ Plot Status │
├─────────────┤
│ 🟢 Available│
│ 🔵 Rented   │
│ ⚫ Inactive  │
└─────────────┘
```

**Top-right Controls:**
- ➕➖ Zoom buttons
- 🧭 Compass/rotation
- ⛶ Fullscreen toggle

### 4. **Right Panel - Plot List** (384px wide)

**Header:**
```
8 Plots Available
```

**Plot Cards** (scrollable):

```
┌────────────────────────────────┐
│ [Image: Sunny farmland]        │ ← Hero image
│  Available                     │ ← Status badge (top-right)
├────────────────────────────────┤
│ Sunny 5-Acre Organic Farm Plot │ ← Title
│ 📍 Asheville, NC               │ ← Location
│                                │
│ [🧭 5 acres] [💧 Irrigation]  │ ← Feature chips
│ [✓ Fenced]                     │
│                                │
│ $400                           │ ← Price (large, bold)
│ /month          ⭐ 4.8        │ ← Rating
├────────────────────────────────┤
│ Hosted by Harold Thompson      │ ← Owner
└────────────────────────────────┘
```

**Card States:**
- **Normal**: Gray border
- **Hover**: Green border, shadow
- **Selected**: Green border, ring, shadow (matches map selection)

**Empty State** (when filters return nothing):
```
        🔍
   No plots found
Try adjusting your filters
    or search query
```

---

## Sample Plots Displayed

**1. Sunny 5-Acre Organic Farm**
- Location: Asheville, NC
- Acreage: 5 acres
- Price: $400/month
- Features: Irrigation, Fencing
- Status: 🟢 Available
- Rating: ⭐ 4.8

**2. Creek-Side 2-Acre Garden**
- Location: Asheville, NC
- Acreage: 2 acres
- Price: $250/month
- Features: Fencing, Stream access
- Status: 🟢 Available
- Rating: ⭐ 4.9

**3. Premium 10-Acre Farmstead**
- Location: Leicester, NC
- Acreage: 10 acres
- Price: $850/month
- Features: Irrigation, Fencing, Greenhouse
- Status: 🟢 Available
- Rating: ⭐ 5.0

**4. Urban Garden Plot**
- Location: Asheville, NC
- Acreage: 0.5 acres
- Price: $150/month
- Features: Municipal water, Irrigation, Fencing
- Status: 🟢 Available
- Rating: ⭐ 4.5

**5. Mountain View 3-Acre**
- Location: Weaverville, NC
- Acreage: 3 acres
- Price: $350/month
- Features: Well
- Status: 🔵 Rented
- Rating: ⭐ 4.7

...and 3 more plots

---

## Interaction Flow Examples

### **Scenario 1: Browsing**
1. User lands on `/explore`
2. Map shows 8 plots around Asheville
3. Green markers indicate available plots
4. Right panel lists all plots
5. User can scroll through cards or explore map

### **Scenario 2: Filtering**
1. User clicks "Irrigation System" checkbox
2. Plots without irrigation fade from map
3. List updates to show only matching plots
4. Filter count badge shows "[1]"
5. Results count updates: "3 plots found"

### **Scenario 3: Selecting a Plot**
1. User clicks marker on map
2. Marker scales up and pulses
3. Map flies to center on that plot
4. Corresponding card in list highlights with green ring
5. Card scrolls into view
6. Popup shows quick info

### **Scenario 4: Searching**
1. User types "Leicester" in search
2. Map and list filter to Leicester plots
3. Only 1 plot remains: "Premium 10-Acre Farmstead"
4. Map zooms to show that plot
5. Search is combinable with filters

### **Scenario 5: Grid View**
1. User clicks Grid icon in top-right
2. Map disappears
3. Cards display in responsive grid (3 columns on desktop)
4. Filters remain on left
5. More cards visible at once
6. Click card to view details (future)

---

## Mobile Responsive Behavior

**On Mobile (<1024px):**
- Filters become overlay with toggle button
- Map goes full-width
- Plot list becomes bottom sheet (swipe up)
- View toggle more prominent
- Grid view shows 1 column

**Mobile Filter Button:**
```
┌──────────────┐
│ 🔍 Filters 2 │ ← Tap to open overlay
└──────────────┘
```

---

## Color Palette Used

**Primary:**
- Green-600: `#16a34a` (Available, buttons)
- Green-100: `#d1fae5` (Success backgrounds)

**Status Colors:**
- Blue-600: `#2563eb` (Rented plots)
- Gray-500: `#6b7280` (Inactive plots)
- Yellow-400: `#fbbf24` (Star ratings)

**Neutral:**
- Gray-900: `#111827` (Headings)
- Gray-700: `#374151` (Body text)
- Gray-300: `#d1d5db` (Borders)
- White: `#ffffff` (Cards, background)

---

## Performance Features

✅ **Memoized filtering** - Only recalculates when filters/search changes
✅ **Marker reuse** - Efficiently updates markers instead of recreating
✅ **Smooth animations** - Fly-to transitions, scale effects
✅ **Lazy loading** - Images load progressively
✅ **Type-safe** - Full TypeScript coverage

---

## What Happens When You Visit?

**Without Mapbox Token:**
- Shows placeholder with instructions
- Still displays plot cards in list
- Filters work normally
- Graceful degradation

**With Mapbox Token:**
- Full interactive map
- Satellite/terrain hybrid view
- Smooth 3D perspective
- All features enabled

---

## Next Steps Preview

This map interface sets up perfectly for:

1. **Click plot card** → Navigate to `/explore/[plotId]` detail page
2. **"Book Now" button** → Opens booking modal
3. **Owner profile link** → View landowner info
4. **Save/favorite plots** → Add to user's wishlist
5. **Share plot** → Generate shareable link
6. **Compare plots** → Side-by-side comparison

---

## File Structure

```
app/explore/page.tsx              # Main explore page with map/grid toggle
components/map/
  ├── map.tsx                     # Mapbox GL integration
  ├── plot-card.tsx               # Plot preview cards
  └── filter-sidebar.tsx          # Filter controls
lib/
  ├── types.ts                    # PlotMarker, MapFilters types
  ├── sample-data.ts              # 8 demo plots
  └── constants.ts                # Soil types, water access options
```

---

## To See It In Action

1. Get free Mapbox token: https://mapbox.com
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Navigate to: http://localhost:3000/explore

**Or** just visit without token to see the fallback UI with plot cards!

---

🎉 **The map is production-ready and waiting for your Mapbox token!**
