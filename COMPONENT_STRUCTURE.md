# Component Structure Documentation

This document outlines the refactored component structure for the Cancer Treatment Cost Clarity application.

## Overview

The massive `App.tsx` file has been split into smaller, more manageable components for better maintainability and reusability.

## File Structure

```
src/
├── components/           # React components
│   ├── index.ts         # Component exports
│   ├── Header.tsx       # Main header with title and animated background
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
│   └── api.ts          # API-related functions
└── App.tsx             # Main application component (refactored)
```

## Components

### Header (`src/components/Header.tsx`)

- Displays the main title "Cancer Treatment Cost Clarity"
- Contains animated background elements
- Includes the heart icon and description

### EmergencyResources (`src/components/EmergencyResources.tsx`)

- Collapsible emergency resources dropdown
- Shows emergency contact information
- Color-coded resource cards with icons

### TreatmentForm (`src/components/TreatmentForm.tsx`)

- Main form for collecting user information
- State selection dropdown
- Cancer type selection
- Cancer stage selection
- Insurance type selection
- Search button

### ResultsSection (`src/components/ResultsSection.tsx`)

- Displays treatment cost estimates
- Shows financial aid resources (federal and state)
- Treatment centers information
- Counseling services information

### ChatAssistant (`src/components/ChatAssistant.tsx`)

- AI chat interface
- Message history display
- Typing indicators
- Form input for user messages

### QuickActions (`src/components/QuickActions.tsx`)

- Sidebar with quick action buttons
- Call helpline, find support groups, download resources

### Footer (`src/components/Footer.tsx`)

- Disclaimer and footer information
- Professional medical advice notice

## Types

### `src/types/index.ts`

- `ChatMessage` - Interface for chat messages
- `TreatmentCosts` - Interface for treatment cost data
- `FinancialResource` - Interface for financial resource data
- `FinancialResources` - Interface for collections of financial resources
- `FormData` - Interface for form data

## Constants

### `src/constants/index.ts`

- `STATES` - Array of US states
- `CANCER_TYPES` - Array of cancer types
- `CANCER_STAGES` - Array of cancer stages
- `INSURANCE_TYPES` - Array of insurance types
- `EMERGENCY_RESOURCES` - Array of emergency resource data

## Utils

### `src/utils/api.ts`

- `fetchTreatmentCosts()` - Fetches treatment cost data from OpenAI
- `fetchFinancialResources()` - Fetches financial resource data from OpenAI
- `sendMessageToAI()` - Sends messages to AI assistant

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the application
3. **Testability**: Smaller components are easier to test
4. **Readability**: Code is more organized and easier to understand
5. **Scalability**: New features can be added as separate components
6. **Type Safety**: Proper TypeScript interfaces ensure type safety
7. **Separation of Concerns**: Logic, data, and presentation are separated

## Usage

The main `App.tsx` file now simply orchestrates the components and manages the main application state. All the complex logic has been moved to the appropriate components and utility functions.

## Migration Notes

- All existing functionality has been preserved
- The API key is still stored in the utils file (should be moved to environment variables in production)
- All styling and UI interactions remain the same
- The component structure is now much more modular and maintainable
