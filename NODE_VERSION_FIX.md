# Node.js Version Fix for Render

## The Problem

Render is using Node.js v22 by default, which is very new and may have compatibility issues with some packages.

## Solution: Specify Node.js Version

I've added files to specify Node.js version 20 (LTS - Long Term Support):

### Files Created:
- `.nvmrc` - Root directory (for general use)
- `frontend/.nvmrc` - Frontend directory
- `backend/.nvmrc` - Backend directory

### package.json Updates:
- Added `engines` field to both `frontend/package.json` and `backend/package.json`
- Specifies Node.js 18-20 (LTS versions)

## Render Configuration

### Option 1: Automatic (Recommended)

Render should automatically detect the `.nvmrc` file and use Node.js 20.

### Option 2: Manual Configuration

If automatic detection doesn't work:

1. **In Render Dashboard:**
   - Go to your service settings
   - Find "Node Version" or "Environment" section
   - Set: `20` or `20.x.x`

2. **For Frontend Service:**
   - Node Version: `20`

3. **For Backend Service:**
   - Node Version: `20`

## Verify Node Version

After deployment, check Render logs. You should see:
```
==> Using Node.js version 20.x.x
```

Instead of:
```
==> Using Node.js version 22.16.0
```

## Why Node.js 20?

- **LTS (Long Term Support)** - Stable and well-tested
- **Better compatibility** - Works with all current packages
- **Recommended by Vite** - Vite works best with Node 18-20
- **Fewer breaking changes** - More stable than Node 22

## Testing Locally

To test with Node.js 20 locally:

```bash
# Install nvm (Node Version Manager) if you don't have it
# Then:
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

## If Issues Persist

If you still have build issues after specifying Node 20:

1. **Check Render logs** for the actual Node version being used
2. **Verify `.nvmrc` files** are committed to your repository
3. **Manually set Node version** in Render dashboard if needed
4. **Check package compatibility** - Some packages may need updates

