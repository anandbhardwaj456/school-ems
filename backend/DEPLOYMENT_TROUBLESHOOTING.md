# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 404 Errors on All Routes

If you're getting 404 errors on all API routes, the server might not be starting properly.

#### Check Render Logs

1. Go to your Render dashboard
2. Click on your service
3. Check the "Logs" tab
4. Look for:
   - `✅ Server running at...` - Server started successfully
   - `❌ Failed to start server` - Server failed to start
   - `✅ MongoDB connected successfully!` - Database connected
   - `❌ MongoDB connection failed` - Database connection failed

#### Verify Environment Variables

Ensure these are set in Render:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Usually set automatically by Render
- `NODE_ENV` - Set to `production` for production

#### Test Endpoints

After deployment, test these endpoints:

1. **Health Check:**
   ```
   GET https://school-ems.onrender.com/health
   ```
   Should return: `{"status":"ok","message":"Server is running",...}`

2. **Root Endpoint:**
   ```
   GET https://school-ems.onrender.com/
   ```
   Should return server info

3. **Auth Test:**
   ```
   GET https://school-ems.onrender.com/api/auth/test
   ```
   Should return: `{"message":"Auth routes are working",...}`

4. **Login Endpoint:**
   ```
   POST https://school-ems.onrender.com/api/auth/login
   Content-Type: application/json
   Body: {"email":"test@test.com","password":"test123"}
   ```

### Server Not Starting

#### Check Start Command

In Render, ensure the Start Command is:
```
npm start
```
or
```
node server.js
```

#### Check Build Command

If you have a build step, ensure it's correct:
```
npm install
```

#### Verify package.json

Ensure `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### Database Connection Issues

#### MongoDB URI Format

Your `MONGODB_URI` should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### Network Access

- Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
- Or add Render's IP addresses to the whitelist

### CORS Issues

If you see CORS errors, the backend should already handle this with:
```javascript
app.use(cors());
```

### Service Sleeping (Free Tier)

Render's free tier services sleep after 15 minutes of inactivity. The first request after sleeping may take 30-60 seconds to respond.

### Quick Debug Steps

1. **Check if server is running:**
   ```bash
   curl https://school-ems.onrender.com/health
   ```

2. **Check if routes are registered:**
   ```bash
   curl https://school-ems.onrender.com/api/auth/test
   ```

3. **Test login endpoint:**
   ```bash
   curl -X POST https://school-ems.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@smartschool.com","password":"admin123"}'
   ```

4. **Check Render logs:**
   - Look for startup messages
   - Look for error messages
   - Check if database connection succeeded

### Expected Server Startup Logs

When the server starts successfully, you should see:
```
✅ Server running at https://school-ems.onrender.com
📡 Health check: https://school-ems.onrender.com/health
🔐 Auth endpoint: https://school-ems.onrender.com/api/auth/login
🌍 Environment: production
✅ MongoDB connected successfully!
```

If you see warnings instead:
```
⚠️  Database connection failed: ...
⚠️  Server is running but database operations may fail
```

The server is running but database operations won't work. Check your `MONGODB_URI`.

### Frontend Configuration

Ensure your frontend `.env` file has:
```env
VITE_API_URL=https://school-ems.onrender.com
```

Or if your backend URL already includes `/api`:
```env
VITE_API_URL=https://school-ems.onrender.com/api
```

### Still Having Issues?

1. Check Render service status (should be "Live")
2. Check Render logs for errors
3. Verify all environment variables are set
4. Try redeploying the service
5. Check MongoDB Atlas connection status

