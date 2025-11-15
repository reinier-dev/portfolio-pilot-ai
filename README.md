# Portfolio Pilot AI

Generate professional case studies instantly with AI-powered content and design inspiration.

## Overview

Portfolio Pilot AI is a full-stack web application that helps professionals create compelling case studies for their portfolios. Using advanced AI technology, it generates professional content, creates visual inspiration, and provides design guidance that can be used with Builder.io's visual development platform.

## Features

- **AI-Powered Content Generation**: Creates structured case studies with Problem, Solution, and Results sections
- **Visual Design Inspiration**: Generates hero images and design descriptions using DALL-E 3 and GPT-4o
- **Multilingual Support**: Automatically responds in the same language as your input (English, Spanish, and more)
- **Private Gallery**: Save and manage your case studies locally with browser storage
- **Builder.io Integration**: Export AI-generated prompts optimized for Builder.io's visual editor
- **Responsive Design**: Beautiful dark theme that works on all devices

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **TailwindCSS 3** - Styling
- **shadcn/ui** - Component library (48 components)
- **React Router 6** - Client-side routing

### Backend
- **Express 5** - Web server
- **OpenAI API** - AI content and image generation
  - GPT-4o-mini for text generation
  - GPT-4o for image analysis
  - DALL-E 3 for image creation
- **Supabase** - PostgreSQL database

### Infrastructure
- **Supabase CLI** - Database migrations
- **dotenv** - Environment variable management

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key with credits
- Supabase account and project
- Builder.io account (optional, for visual page building)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/reinier-dev/portfolio-pilot-ai.git
   cd portfolio-pilot-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up the database**

   Install Supabase CLI:
   ```bash
   brew install supabase/tap/supabase
   ```

   Link to your Supabase project:
   ```bash
   supabase link
   ```

   Push the database schema:
   ```bash
   supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

## Usage

### Generating a Case Study

1. Navigate to the home page
2. Enter a description of your project in the text area (e.g., "A mobile app for tracking fitness goals")
3. Click "Generate Case Study"
4. Wait while the AI generates:
   - Professional case study text with 3 sections
   - Hero image for visual inspiration
   - Design description for UI/UX guidance
5. View your generated case study with the image and formatted text

### Using the Gallery

- All generated case studies are automatically saved to your browser's local storage
- Click "My Gallery" to view all your saved case studies
- Click on any card to view the full case study
- Delete case studies you no longer need

### Exporting to Builder.io

1. Open any case study from your gallery
2. Click "Get Builder.io Prompt"
3. Copy the generated AI prompt
4. Open Builder.io and paste the prompt into the AI page generator
5. Builder.io will create a custom webpage based on the design inspiration

## Project Structure

```
portfolio-pilot-ai/
├── client/                 # Frontend React application
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Landing page
│   │   ├── CaseStudyResult.tsx  # Results display
│   │   └── Gallery.tsx    # Saved case studies
│   ├── components/        # Reusable UI components
│   └── global.css         # Global styles
├── server/                # Backend Express application
│   ├── routes/           # API routes
│   │   └── generate-case-study.ts  # Main generation endpoint
│   └── index.ts          # Server setup
├── supabase/             # Database migrations
│   └── migrations/       # SQL migration files
├── .env.example          # Environment variables template
├── .env.local           # Your secret keys (gitignored)
└── vite.config.ts       # Vite configuration
```

## API Endpoints

### `POST /api/generate-case-study`

Generates a new case study with AI.

**Request Body:**
```json
{
  "prompt": "A mobile app for tracking fitness goals"
}
```

**Response:**
```json
{
  "newCaseStudy": {
    "id": 1,
    "created_at": "2024-11-14T10:30:00Z",
    "prompt": "A mobile app for tracking fitness goals",
    "generated_text": "### The Problem\n\n...",
    "image_url": "https://...",
    "image_design_description": "Modern mobile-first design..."
  },
  "saved": true
}
```

### `GET /api/generate-case-study`

Retrieves all case studies from the database.

**Response:**
```json
{
  "caseStudies": [...],
  "count": 5
}
```

## Database Schema

### `case_studies` table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| created_at | timestamptz | Creation timestamp |
| prompt | text | User's input prompt |
| generated_text | text | AI-generated case study content |
| image_url | text | DALL-E generated image URL |
| image_design_description | text | GPT-4o design analysis |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT and DALL-E | Yes |
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

**⚠️ Security Warning**: Never commit `.env.local` or any file containing real API keys to version control!

## Development

### Running locally

```bash
npm run dev
```

The development server will start on port 8080 (or the next available port).

### Building for production

```bash
npm run build
```

This creates optimized production builds in the `dist/` directory.

## Deployment

This project is designed to be deployed on platforms like:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- Any platform supporting Node.js and Vite

### Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

## Cost Optimization

The app uses the most cost-effective OpenAI models:

- **GPT-4o-mini**: ~$0.15 per million input tokens (for case study text)
- **GPT-4o**: ~$2.50 per million input tokens (for image analysis)
- **DALL-E 3 Standard**: $0.040 per image (1024x1024)

Average cost per case study: ~$0.05 - $0.10

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- **Builder.io** - For the visual development platform and interface design inspiration
- **OpenAI** - For GPT and DALL-E APIs
- **Supabase** - For the database platform
- **shadcn/ui** - For the beautiful component library

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your contact information]

---

Built with ❤️ for portfolio professionals
