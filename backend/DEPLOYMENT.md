# Deployment Guide for Render

## Backend Deployment on Render

### Environment Variables

Set these in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret
```

### Build & Start Commands

**Build Command:** (leave empty or use `npm install`)

**Start Command:**
```bash
npm start
```

Or if using nodemon:
```bash
npm run dev
```

### Health Check

The server includes a health check endpoint:
- `GET /health` - Returns server status

### Testing Deployment

After deployment, test these endpoints:

1. **Health Check:**
   ```bash
   curl https://school-ems.onrender.com/health
   ```

2. **Root Endpoint:**
   ```bash
   curl https://school-ems.onrender.com/
   ```

3. **Auth Test:**
   ```bash
   curl https://school-ems.onrender.com/api/auth/test
   ```

4. **Login:**
   ```bash
   curl -X POST https://school-ems.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@smartschool.com","password":"admin123"}'
   ```

### Common Issues

**404 Errors:**
- Verify the server is running: Check `/health` endpoint
- Check Render logs for startup errors
- Ensure all routes are properly registered
- Verify the start command is correct

**Database Connection:**
- Check `MONGODB_URI` is set correctly
- Ensure MongoDB allows connections from Render's IP
- Verify database credentials

**CORS Issues:**
- CORS is enabled for all origins in the code
- If issues persist, check frontend URL matches

### Creating Admin on Production

After deployment, create the first admin:

```bash
curl -X POST https://school-ems.onrender.com/api/setup/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "System Administrator",
    "email": "admin@smartschool.com",
    "password": "admin123"
  }'
```

