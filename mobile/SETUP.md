# Mobile App Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure API URL**
   - Open `src/api.js`
   - Update the `getApiUrl()` function with your backend URL
   - For physical device testing, use your computer's IP address instead of localhost

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## API Configuration

### For Emulator/Simulator
```javascript
return 'http://localhost:5000/api';
```

### For Physical Device
```javascript
// Replace with your computer's IP address
return 'http://192.168.1.100:5000/api';
```

### For Production
```javascript
return 'https://school-ems.onrender.com/api';
```

## Assets Required

Create the following assets in the `mobile/assets/` directory:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

## Features Implemented

✅ Authentication (Login, Register, OTP, Forgot Password)
✅ Role-based navigation
✅ Dashboard with statistics
✅ All main screens (Students, Teachers, Classes, etc.)
✅ Drawer navigation
✅ Toast notifications
✅ Pull-to-refresh
✅ Loading states
✅ Error handling

## Testing

1. Start the backend server
2. Update API URL in `src/api.js`
3. Run `npm start`
4. Test authentication flow
5. Test navigation between screens
6. Test API calls and data display

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection
- Ensure backend is running
- Check firewall settings
- Verify IP address for physical devices
- Test API endpoint in browser/Postman

