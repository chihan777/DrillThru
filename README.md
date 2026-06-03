# DrillThru

A modern agency website built with Next.js, featuring a beautiful design with authentication, blog management, and admin dashboard.

## Features

- ✨ Modern UI with Radix UI components
- 🔐 Authentication with Better Auth
- 📝 Blog system with dynamic routing
- 🎨 Tailwind CSS styling
- 📊 Admin dashboard
- 🔄 Database management with Drizzle ORM
- 📱 Responsive design
- 🚀 Optimized for Vercel deployment

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Better Auth
- **Database**: Drizzle ORM
- **Package Manager**: pnpm

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push database schema
- `pnpm vercel:env:push` - Push environment variables to Vercel

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
├── public/          # Static assets
├── scripts/         # Build and setup scripts
└── styles/          # Global styles
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Add your environment variables here
# Authentication
BETTER_AUTH_SECRET=your_secret_here

# Database
DATABASE_URL=your_database_url

# Other services
# Add as needed
```

## Deployment

### Vercel

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

```bash
pnpm vercel:env:push
```

## License

MIT
