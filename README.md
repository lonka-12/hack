# Cancer Treatment Cost Clarity App

This project is set up with:

- ⚡️ [Vite](https://vitejs.dev/) - Fast build tool and dev server
- ⚛️ [React](https://react.dev/) - UI library
- 🔷 [TypeScript](https://www.typescriptlang.org/) - Type safety
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the root directory with the following variables:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_CSE_ID=your_google_custom_search_engine_id_here
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## API Setup

### OpenAI API

- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Used for treatment cost estimates and AI chat assistance

### Google Custom Search API

- Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
- Create a Custom Search Engine at [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/)
- Used for finding financial aid resources and websites

#### Setting up Google Custom Search API:

1. **Create a Google Cloud Project:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Custom Search API" from the API Library

2. **Create API Credentials:**

   - Go to "Credentials" in the Google Cloud Console
   - Click "Create Credentials" → "API Key"
   - Copy the API key and add it to your `.env` file as `GOOGLE_API_KEY`

3. **Create a Custom Search Engine:**

   - Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/)
   - Click "Create a search engine"
   - Enter any site for "Sites to search" (you can change this later)
   - Name your search engine
   - Copy the Search Engine ID and add it to your `.env` file as `GOOGLE_CSE_ID`

4. **Configure Search Settings:**
   - In your Custom Search Engine settings, enable "Search the entire web"
   - This allows the search to find financial aid resources from any website

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Main header with title
│   ├── EmergencyResources.tsx # Emergency dropdown section
│   ├── TreatmentForm.tsx # Main form for collecting user information
│   ├── ResultsSection.tsx # Results display section
│   ├── ChatAssistant.tsx # AI chat assistant
│   ├── QuickActions.tsx  # Quick actions sidebar
│   └── Footer.tsx        # Footer section
├── types/               # TypeScript interfaces and types
│   └── index.ts         # Shared interfaces
├── constants/           # Static data and constants
│   └── index.ts         # States, cancer types, stages, etc.
├── utils/              # Utility functions
│   └── api.ts          # API-related functions (OpenAI & Google Search)
└── App.tsx             # Main application component
```

## Features

- ✅ Hot Module Replacement (HMR)
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ ESLint configuration
- ✅ Modern React with hooks
- ✅ Optimized production builds
- ✅ AI-powered treatment cost estimates
- ✅ Google search for financial aid resources
- ✅ State-specific resource finding
- ✅ Real-time chat assistance

## Financial Resources Search

The app uses Google Custom Search API to find current financial aid resources:

- **Federal Resources**: Searches for national cancer financial assistance programs
- **State Resources**: Searches for state-specific financial aid programs
- **Fallback**: Provides default resources when search is unavailable

## Development

The development server will start on `http://localhost:5173` by default.

## Building

When you run `npm run build`, Vite will create a `dist` folder with your production-ready files.
