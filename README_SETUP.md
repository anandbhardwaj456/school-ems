# SmartSkul EMS - Admin Setup Guide

## Creating the First Admin User

There are **two ways** to create the first admin user:

### Method 1: Using the Setup Script (Recommended)

Run the setup script from the backend directory:

```bash
cd backend
npm run create-admin
```

**Default Admin Credentials:**
- **Email:** `admin@smartschool.com`
- **Password:** `admin123`

You can customize these by setting environment variables in `backend/.env`:
```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Admin Name
```

### Method 2: Using the Setup API Endpoint

If no admin exists, you can create one via API:

```bash
curl -X POST http://localhost:5000/api/setup/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "System Administrator",
    "email": "admin@smartschool.com",
    "password": "admin123"
  }'
```

Or use Postman/Thunder Client:
- **URL:** `POST http://localhost:5000/api/setup/create-first-admin`
- **Body:**
```json
{
  "fullName": "System Administrator",
  "email": "admin@smartschool.com",
  "password": "admin123"
}
```

## Default Admin Credentials

After running the setup script, use these credentials to login:

```
Email:    admin@smartschool.com
Password: admin123
```

⚠️ **IMPORTANT:** Change the default password immediately after first login!

## Login Steps

1. Start the backend server:
   ```bash
   cd backend
   npm start
   # or for development
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login` (or your frontend URL)

4. Enter the admin credentials

5. You'll be redirected to the admin dashboard

## Creating Additional Users

Once logged in as admin:
- Go to **Users** page or **Register** page
- Create Teachers, Students, and Parents
- All users created by admin are automatically verified and active

## Troubleshooting

**If admin creation fails:**
- Make sure MongoDB is running
- Check your `MONGO_URI` in `backend/.env`
- Ensure the database connection is successful
- Check if an admin already exists (script will tell you)

**If login fails:**
- Verify the admin was created successfully
- Check that `isVerified: true` and `isActive: true` in database
- Ensure backend server is running
- Check browser console for errors

