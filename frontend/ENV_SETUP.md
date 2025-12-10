# Frontend Environment Variables Setup

## Required: Set API URL

Create a `.env` file in the `frontend` directory with the following:

```env
VITE_API_URL=https://school-ems.onrender.com
```

### Steps:

1. **Create `.env` file:**
   - Navigate to the `frontend` folder
   - Create a new file named `.env` (no extension)
   - Add the line: `VITE_API_URL=https://school-ems.onrender.com`

2. **Restart your frontend dev server:**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again
   - Environment variables are only loaded when the server starts

### For Local Development:

If you want to use your local backend:

```env
VITE_API_URL=http://localhost:5000
```

### For Production Build:

When building for production, make sure to set the environment variable:

```bash
# On your deployment platform (Vercel, Netlify, etc.)
VITE_API_URL=https://school-ems.onrender.com
```

## Verify Configuration

After setting up, check the browser console. The API calls should go to:
- `https://school-ems.onrender.com/api/auth/login` (not localhost)

You can also add a console log in `frontend/src/api.js` to verify:

```javascript
console.log("API Base URL:", getApiUrl());
```

