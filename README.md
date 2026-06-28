# XL-VENTURES

## Backend setup

1. Copy `backend/.env.example` to `backend/.env`
2. Add your Gemini API key to `backend/.env`:
   - `GEMINI_API_KEY=your_gemini_api_key_here`
   - or `GOOGLE_API_KEY=your_gemini_api_key_here`
3. Start the backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`

## Frontend setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Gemini configuration

The backend requires one of the following environment variables to call Gemini:

- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`

If neither is set, the app will use heuristic fallback logic instead of real Gemini responses.

