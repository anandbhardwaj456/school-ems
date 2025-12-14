# Build Fix for Render - Vite Permission Issue

## The Problem

Even with `npx vite build`, we're getting "vite: Permission denied" error.

## Solution Applied

Changed the build script to use the direct path to vite:
```json
"build": "node node_modules/.bin/vite build"
```

This bypasses permission issues by running vite through Node.js directly.

## Alternative Solutions

If the above doesn't work, try these in your Render build command:

### Option 1: Use npm run build (should work)
```
npm install && npm run build
```

### Option 2: Install vite globally first
```
npm install -g vite && vite build
```

### Option 3: Use full path
```
npm install && node ./node_modules/.bin/vite build
```

### Option 4: Fix permissions in build
```
npm install && chmod +x node_modules/.bin/vite && npm run build
```

## Current Configuration

**Build Command in Render:**
```
npm install && npm run build
```

**package.json build script:**
```json
"build": "node node_modules/.bin/vite build"
```

This should work because:
- We're running vite through Node.js (no permission issues)
- The path is explicit (no PATH issues)
- npm install ensures vite is available

## Verify

After deployment, check logs for:
- ✅ `> ems-frontend@1.0.0 build`
- ✅ `> node node_modules/.bin/vite build`
- ✅ Build success message
- ✅ `dist` folder created


