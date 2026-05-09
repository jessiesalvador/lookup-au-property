# Lookup AU Property

Australian property search app built with Angular 19 + Angular Material.

---

## Quick Start

### 1. Prerequisites
Make sure you have Node.js 18+ and npm installed:
```bash
node -v   # should be 18+
npm -v
```

### 2. Install Angular CLI globally (if not already installed)
```bash
npm install -g @angular/cli
```

### 3. Install project dependencies
```bash
cd lookup-au-property
npm install
```

### 4. Run the local dev server
```bash
ng serve
```
Then open your browser at → **http://localhost:4200**

The app hot-reloads on any file change.

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Top navigation bar
│   │   ├── search-bar/       # Address/suburb search input
│   │   ├── property-card/    # Result card in the grid
│   │   └── property-detail/  # Full detail modal overlay
│   ├── models/
│   │   └── property.model.ts # Property TypeScript interfaces
│   ├── services/
│   │   └── property.service.ts  # Search logic (mock + API stub)
│   ├── app.component.*       # Root shell
│   └── app.config.ts         # Angular providers
├── environments/
│   ├── environment.ts         # Dev config (API key goes here)
│   └── environment.prod.ts
└── styles.scss               # Global styles + Material theme
```

---

## Mock Data

The app ships with 5 sample properties across NSW, QLD, VIC and WA so you can test everything immediately:
- 42 Wattle Street, Ultimo NSW
- Crown Street, Surry Hills NSW
- Acacia Drive, Sunnybank QLD
- Eucalyptus Court, South Yarra VIC
- Banksia Road, Cottesloe WA

**Search tips:** try `Surry Hills`, `Cottesloe`, `4109`, `Wattle`, or `Acacia`

---

## Connecting PropTrack API (when ready)

1. Get your API key from PropTrack / REA Group
2. Open `src/environments/environment.ts` and replace `YOUR_PROPTRACK_API_KEY_HERE`
3. Open `src/app/services/property.service.ts`
4. Set `private useRealApi = true;`
5. Complete the `searchPropTrack()` method with PropTrack's actual endpoint responses

---

## Build for production
```bash
ng build
```
Output goes to `dist/lookup-au-property/`
