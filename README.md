# Aileco Showcase - Smartcard Digital Identity

A cinematic, premium web experience for Smartchain products featuring animated 3D card flips, QR code scanning effects, and responsive design.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd /Users/cemozyaniz/aileappson/aileco-showcase
```

2. Install dependencies (already installed):
```bash
npm install
```

### Development Server

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo URLs

The application automatically redirects to `/smartchain/demo`. Here are different product states you can test:

- **Active Product:** `/smartchain/demo` or `/smartchain/product123`
- **Lost Product:** `/smartchain/lost-item` or `/smartchain/my-lost-card`
- **Stolen Product:** `/smartchain/stolen-device` or `/smartchain/report-stolen`

## Animation Timeline

The showcase automatically plays through 4 phases on page load:

1. **Phase 1 (0-1s): Entrance**
   - Front of card displayed
   - Card floats with smooth animation
   - Light background

2. **Phase 2 (1-2s): The Flip**
   - Card performs 3D rotation (180°)
   - Reveals QR code side

3. **Phase 3 (2-3.5s): The Scan**
   - Dark overlay covers screen
   - Red scan line moves across QR code area
   - QR code stays illuminated

4. **Phase 4 (3.5s+): The Reveal**
   - Overlay fades out
   - Card moves to top and shrinks
   - Product information panel slides up

## Tech Stack

- **Next.js 14+** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)

## Project Structure

```
aileco-showcase/
├── app/
│   ├── page.tsx              # Main page (redirects to demo)
│   ├── layout.tsx            # Root layout
│   └── smartchain/
│       └── [id]/
│           └── page.tsx     # Dynamic smartcard page
├── public/
│   └── images/
│       ├── front.svg         # Front card placeholder
│       └── back.svg          # Back card with QR placeholder
├── package.json
└── tsconfig.json
```

## Features

- **3D Card Animation:** CSS `transform-style: preserve-3d` and `backface-visibility`
- **Status-Based Styling:** Colors change based on product status (Active=Green, Lost=Red, Stolen=Dark Red)
- **Responsive Design:** Optimized for both mobile and desktop
- **Dynamic Mock Data:** Generates different product info based on URL parameter
- **Cinematic Experience:** Smooth transitions and professional timing

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy

This project can be deployed to any platform that supports Next.js, such as:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Railway

## Customization

### Adding Real Images

Replace the placeholder SVG files in `public/images/`:
- `front.svg` → Replace with your card front image
- `back.svg` → Replace with your card back/QR code image

### Modifying Animation Timing

Adjust the timing in `app/smartchain/[id]/page.tsx`:
```javascript
const phase2 = setTimeout(() => setPhase(2), 1000);   // Change 1000ms
const phase3 = setTimeout(() => setPhase(3), 2000);   // Change 2000ms
const phase4 = setTimeout(() => setPhase(4), 3500);  // Change 3500ms
```

### Status Colors

Modify the `statusColors` object to change color schemes:
```javascript
const statusColors = {
  Active: {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500"
  },
  // Add more statuses here
};
```

## License

This project is part of the Aileco ecosystem.