# StudyMate AI

Your personal AI tutor, available 24/7. StudyMate AI is an intelligent study assistant that helps students learn various subjects through interactive conversations with multiple modes.

## Features

- **Explain Mode** - Get detailed explanations of concepts with real-world examples and structured content
- **Quiz Mode** - Practice with automatically generated multiple-choice questions (5 questions per topic)
- **Summary Mode** - Get instant structured summaries with key points, concepts, and conclusions

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS v3
- **Routing**: react-router-dom
- **Markdown Rendering**: react-markdown
- **AI API**: Google Gemini 2.0 Flash (REST API)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root with the following variable:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

To get your API key, visit: https://aistudio.google.com/app/apikey

### Running Locally

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components (LandingPage, ChatPage)
├── hooks/          # Custom React hooks
├── utils/          # Utility functions (aiService.js)
└── App.jsx         # Main app with routing
```

## Deployment

This project is configured for deployment on Vercel with SPA routing support via `vercel.json`.

### Deployment Checklist

Before deploying to Vercel, make sure to add the following environment variable in the Vercel dashboard:

- `VITE_GEMINI_API_KEY` - Your Google Gemini API key

## License

MIT
