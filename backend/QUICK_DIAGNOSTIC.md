# Quick Diagnostic Guide for 404 Errors

## Step 1: Verify Server is Running

Test these endpoints in your browser or using curl:

### 1. Health Check
```
GET https://school-ems.onrender.com/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

### 2. Root Endpoint
```
GET https://school-ems.onrender.com/
```
**Expected Response:**
```json
{
  "message": "🚀 EMS Backend is running...",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### 3. Auth Test Route
```
GET https://school-ems.onrender.com/api/auth/test
```
**Expected Response:**
```json
{
  "message": "Auth routes are working",
  "timestamp": "..."
}
```

### 4. Setup Test Route
```
GET https://school-ems.onrender.com/api/setup/test
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Setup routes are working",
  "timestamp": "..."
}
```

## Step 2: Check Render Logs

1. Go to Render Dashboard
2. Click on your service (`school-ems`)
3. Click "Logs" tab
4. Look for these messages:

**✅ Good Signs:**
```
✅ Server running at https://school-ems.onrender.com
📋 Registering routes...
✅ Setup routes registered at /api/setup
✅ Auth routes registered at /api/auth
✅ Database connected successfully
```

**❌ Bad Signs:**
```
❌ Failed to start server
❌ Failed to register auth routes
❌ MongoDB connection failed
```

## Step 3: Common Issues

### Issue: All endpoints return 404

**Possible Causes:**
1. Server crashed during startup
2. Routes not being registered
3. Deployment didn't complete

**Solution:**
- Check Render logs for errors
- Verify the service status is "Live"
- Try redeploying

### Issue: Health check works but /api/auth/login returns 404

**Possible Causes:**
1. Routes registered after server started listening
2. Route path mismatch

**Solution:**
- Check if `/api/auth/test` works
- Verify route registration in logs

### Issue: Server starts but database connection fails

**Solution:**
- Check `MONGODB_URI` environment variable
- Verify MongoDB Atlas network access settings
- Server will still run, but API calls requiring DB will fail

## Step 4: Test Login Endpoint

Once you confirm routes are working:

```bash
curl -X POST https://school-ems.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smartschool.com",
    "password": "admin123"
  }'
```

**Expected Response (if admin exists):**
```json
{
  "success": true,
  "token": "...",
  "data": {...}
}
```

**Expected Response (if admin doesn't exist):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Step 5: Create Admin if Needed

If login fails because admin doesn't exist:

```bash
curl -X POST https://school-ems.onrender.com/api/setup/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "System Administrator",
    "email": "admin@smartschool.com",
    "password": "admin123"
  }'
```

## Still Having Issues?

1. **Check Render Service Status:**
   - Should be "Live" (green)
   - Not "Sleeping" or "Error"

2. **Verify Environment Variables:**
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `PORT` - Usually auto-set by Render

3. **Check Build/Start Commands:**
   - Build Command: `npm install` (or leave empty)
   - Start Command: `npm start` or `node server.js`

4. **Review Recent Changes:**
   - Make sure all files are committed and pushed
   - Verify the deployment is using the latest code

