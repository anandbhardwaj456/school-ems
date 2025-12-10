# Quick Fix for Render Frontend Deployment

## The Problem
Render is trying to build your frontend but encountering permission or dependency issues.

## Solution Options

### Option 1: Use Render Static Site (RECOMMENDED - Easiest)

1. **In Render Dashboard:**
   - Create a new **Static Site** (not Web Service)
   - Connect to your GitHub repo
   - Set these settings:

2. **Settings:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variable:**
     - Key: `VITE_API_URL`
     - Value: `https://school-ems.onrender.com`

3. **No Start Command needed** - Static sites don't need one!

### Option 2: Use Web Service (Current Setup)

If you're using a Web Service, ensure these settings:

1. **Root Directory:** `frontend`

2. **Build Command:**
   ```
   npm install && npm run build
   ```

3. **Start Command:**
   ```
   npm start
   ```
   (This will use the start script: `npx serve -s dist -l $PORT`)

4. **Environment Variables:**
   - `VITE_API_URL=https://school-ems.onrender.com`
   - `PORT` (usually auto-set by Render)

### Option 3: Alternative Start Command

If `serve` still doesn't work, try this start command:

```
npx vite preview --host 0.0.0.0 --port $PORT
```

Or install serve globally in build:
```
npm install -g serve && serve -s dist -l $PORT
```

## Verify Your Setup

1. **Check package.json has:**
   - `"serve": "^14.2.1"` in dependencies
   - `"build": "npx vite build"` in scripts
   - `"start": "npx serve -s dist -l $PORT"` in scripts

2. **Test locally:**
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

3. **Check Render Logs:**
   - Look for build success message
   - Look for "dist" folder creation
   - Look for any error messages

## Common Errors

**"vite: Permission denied"**
- ✅ Fixed: Using `npx vite build` instead of `vite build`

**"serve: command not found"**
- ✅ Fixed: Added `serve` to dependencies and using `npx serve`

**"dist folder not found"**
- Check that build command completed successfully
- Verify `dist` folder exists after build

**"Cannot find module"**
- Run `npm install` in build command
- Check all dependencies are in package.json

