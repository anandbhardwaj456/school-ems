# Frontend Deployment on Render

## Render Configuration

When deploying the frontend on Render, use these settings:

### Build Settings

**Root Directory:** `frontend` (if your frontend is in a `frontend` folder)

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npx vite preview --host 0.0.0.0 --port $PORT
```

Or if you prefer using a static file server:
```
npx serve -s dist -l $PORT
```

### Environment Variables

Set these in Render Dashboard → Your Frontend Service → Environment:

**Required:**
```
VITE_API_URL=https://school-ems.onrender.com
```

**Optional:**
```
NODE_ENV=production
```

### Alternative: Static Site Hosting

If you're using Render's Static Site hosting:

1. **Build Command:**
   ```
   npm install && npm run build
   ```

2. **Publish Directory:**
   ```
   dist
   ```

3. **Environment Variables:**
   - `VITE_API_URL=https://school-ems.onrender.com`

### Troubleshooting

**If build fails with "vite: Permission denied":**
- Use `npx vite build` in the build script (already updated)
- Or use `npm run build` which should work

**If build succeeds but site doesn't load:**
- Check that `VITE_API_URL` is set correctly
- Verify the `dist` folder is being generated
- Check Render logs for errors

**If API calls fail:**
- Verify `VITE_API_URL` environment variable is set
- Check browser console for CORS errors
- Ensure backend CORS is configured to allow your frontend domain

