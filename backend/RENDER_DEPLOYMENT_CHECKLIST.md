# Render Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Verify Code is Committed and Pushed

```bash
git status
git add .
git commit -m "Fix route registration and add error handling"
git push
```

### 2. Verify All Files Are in Repository

Make sure these files exist in your repo:
- `backend/server.js`
- `backend/routes/authRoutes.js`
- `backend/routes/setupRoutes.js`
- `backend/controllers/loginController.js`
- `backend/package.json`

## 🔧 Render Configuration

### 1. Service Settings

Go to your Render service settings and verify:

**Build Command:**
```
npm install
```
(Or leave empty if using auto-detect)

**Start Command:**
```
npm start
```
or
```
node server.js
```

**Root Directory:**
```
backend
```
(If your backend code is in a `backend` folder)

### 2. Environment Variables

In Render Dashboard → Your Service → Environment, verify these are set:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secret string for JWT tokens
- `NODE_ENV` - Set to `production`

**Optional (but recommended):**
- `ADMIN_EMAIL` - Default: `admin@smartschool.com`
- `ADMIN_PASSWORD` - Default: `admin123`
- `SESSION_SECRET` - For session management

### 3. Service Status

Check that your service status is:
- ✅ **Live** (green) - Service is running
- ❌ **Sleeping** - Service is sleeping (free tier)
- ❌ **Error** - Service failed to start

## 🧪 Testing After Deployment

### Step 1: Test Basic Endpoints

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://school-ems.onrender.com/health
   ```
   Should return: `{"status":"ok","message":"Server is running",...}`

2. **Root Endpoint:**
   ```
   https://school-ems.onrender.com/
   ```
   Should return server info with available endpoints

3. **API Test:**
   ```
   https://school-ems.onrender.com/api/test
   ```
   Should return: `{"success":true,"message":"API is working",...}`

### Step 2: Test Auth Routes

1. **Auth Test:**
   ```
   https://school-ems.onrender.com/api/auth/test
   ```
   Should return: `{"message":"Auth routes are working",...}`

2. **Setup Test:**
   ```
   https://school-ems.onrender.com/api/setup/test
   ```
   Should return: `{"success":true,"message":"Setup routes are working",...}`

### Step 3: Check Logs

In Render Dashboard → Your Service → Logs, you should see:

```
✅ Passport configured
📋 Registering routes...
✅ Setup routes registered at /api/setup
✅ Auth routes registered at /api/auth
✅ Server running at https://school-ems.onrender.com
```

## 🐛 Troubleshooting 404 Errors

### If all endpoints return 404:

1. **Check Service Status:**
   - Service must be "Live"
   - If "Error", check logs for startup errors

2. **Check Logs:**
   - Look for "Server running at..." message
   - Look for route registration messages
   - Look for any error messages

3. **Verify Start Command:**
   - Should be `npm start` or `node server.js`
   - Not `npm run dev` (that's for development)

4. **Check Root Directory:**
   - If backend is in `backend/` folder, set Root Directory to `backend`
   - If backend is in root, leave Root Directory empty

### If only some endpoints return 404:

1. **Check Route Registration Logs:**
   - Look for "✅ Auth routes registered" message
   - If missing, there's an error loading routes

2. **Check for Import Errors:**
   - Look for "Cannot find module" errors in logs
   - Verify all dependencies are in `package.json`

3. **Check Database Connection:**
   - Server will start even if DB fails
   - But routes requiring DB will fail
   - Check for "MongoDB connection failed" in logs

## 🔄 Redeploy Steps

If you need to redeploy:

1. **Manual Redeploy:**
   - Render Dashboard → Your Service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete

2. **Check Deployment Logs:**
   - Watch the build logs
   - Look for any errors during `npm install`
   - Verify build completes successfully

3. **Verify Service Starts:**
   - Check runtime logs after deployment
   - Should see "Server running at..." message
   - Should see route registration messages

## 📝 Quick Test Commands

Test endpoints using curl:

```bash
# Health check
curl https://school-ems.onrender.com/health

# API test
curl https://school-ems.onrender.com/api/test

# Auth test
curl https://school-ems.onrender.com/api/auth/test

# Login (if admin exists)
curl -X POST https://school-ems.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartschool.com","password":"admin123"}'
```

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Health check returns `{"status":"ok"}`
2. ✅ Root endpoint returns server info
3. ✅ `/api/test` returns API info
4. ✅ `/api/auth/test` returns auth routes working
5. ✅ Logs show all routes registered successfully
6. ✅ Login endpoint returns token (not 404)

## 🆘 Still Having Issues?

1. **Share Render Logs:**
   - Copy the full log output
   - Look for any error messages

2. **Verify Environment Variables:**
   - All required vars are set
   - No typos in variable names

3. **Check Service Limits:**
   - Free tier services sleep after 15 min
   - First request after sleep takes 30-60 seconds

4. **Verify MongoDB Access:**
   - MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Or Render's IP is whitelisted

