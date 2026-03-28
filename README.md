# StyleSim

AI-powered fashion demand simulation tool that predicts clothing performance across diverse customer personas using Claude AI.

## Overview

StyleSim helps fashion brands and retailers make data-driven inventory decisions by simulating how different customer segments would respond to their clothing collection. Upload product images, select target personas, and receive detailed demand forecasts with buy intent scores and pricing insights.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.1 |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| AI | Anthropic Claude SDK |
| UI Components | shadcn/ui, Base UI |
| Charts | Recharts |

## Features

- **Image Upload & Analysis** - Upload up to 20 clothing images; AI automatically identifies category, style, colors, materials, and price range
- **Persona-Based Simulation** - Test against multiple customer archetypes (Gen Z, Millennial, Gen X) with distinct style preferences
- **Demand Forecasting** - Get per-SKU scores, buy intent percentages, and risk assessments
- **Actionable Insights** - Receive recommendations for production optimization and inventory planning

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/     # Image analysis endpoint
│   │   ├── simulate/    # Persona simulation endpoint
│   │   └── upload/      # File upload endpoint
│   ├── simulation/      # Persona selection page
│   ├── results/         # Results dashboard page
│   └── page.tsx         # Upload landing page
├── components/
│   ├── ui/              # shadcn components
│   ├── upload/          # DropZone, ImageGrid
│   ├── simulation/      # PersonaSelector, Progress
│   └── results/         # Charts, Tables, Rankings
├── context/
│   └── SimulationContext.tsx
├── lib/
│   ├── claude.ts        # AI client
│   ├── personas.ts      # Persona definitions
│   ├── prompts.ts       # AI prompt templates
│   └── analysis.ts      # Forecast logic
└── types/
    └── index.ts         # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 20+
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/JerryWu0430/stylesim.git
cd stylesim

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

## Usage Flow

1. **Upload** - Drag & drop clothing images
2. **Analyze** - AI extracts style attributes automatically
3. **Configure** - Select target customer personas
4. **Simulate** - Run demand prediction across personas
5. **Review** - Explore rankings, charts, and recommendations

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload clothing images |
| `/api/analyze` | POST | Analyze single image with Claude Vision |
| `/api/simulate` | POST | Run persona-based demand simulation |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
