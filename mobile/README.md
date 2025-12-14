# SmartSkul EMS Mobile App

A professional, responsive React Native mobile application for the SmartSkul Education Management System.

## Features

- 🔐 Authentication (Login, Register, OTP Verification, Forgot Password)
- 📊 Role-based Dashboard (Admin, Teacher, Student, Parent)
- 👥 User Management (Students, Teachers, Parents)
- 🏫 Class & Section Management
- 📚 Subject Management
- ✅ Attendance Tracking
- 📝 Exams & Marks
- 📅 Timetable
- 📋 Homework Management
- 💰 Fee Management
- 📢 Announcements
- 📖 Library Management
- 🚌 Transport Management
- 💬 Messaging
- 👤 Profile Management
- ⚙️ Settings

## Prerequisites

- Node.js (>=18.0.0)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Configuration

### API Configuration

Update the API URL in `src/api.js`:

- For development with emulator: `http://localhost:5000/api`
- For development with physical device: `http://YOUR_IP_ADDRESS:5000/api`
- For production: `https://school-ems.onrender.com/api`

### Environment Variables

You can create a `.env` file in the mobile directory:

```
API_URL=http://localhost:5000/api
```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## Project Structure

```
mobile/
├── src/
│   ├── api.js                 # API configuration
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── FormInput.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── ToastProvider.jsx
│   │   └── CustomDrawer.jsx
│   ├── navigation/
│   │   └── AppNavigator.jsx   # Navigation setup
│   └── screens/
│       ├── auth/              # Authentication screens
│       ├── DashboardScreen.jsx
│       ├── StudentsScreen.jsx
│       └── ...                # Other screens
├── App.js                      # Main app component
├── app.json                    # Expo configuration
├── package.json
└── README.md
```

## Features

### Responsive Design
- Optimized for both iOS and Android
- Adaptive layouts for different screen sizes
- Touch-friendly interface

### Professional UI
- Modern, clean design
- Consistent color scheme
- Smooth animations and transitions
- Intuitive navigation

### Backend Integration
- Uses the same backend API as the web frontend
- AsyncStorage for token management
- Automatic token refresh
- Error handling and user feedback

## Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the route in `src/navigation/AppNavigator.jsx`
3. Add menu item in `src/components/CustomDrawer.jsx` if needed

### Styling

The app uses StyleSheet from React Native. Colors and spacing follow a consistent design system:

- Primary: `#2563eb` (Blue)
- Success: `#16a34a` (Green)
- Danger: `#dc2626` (Red)
- Background: `#f8fafc` (Light Gray)
- Text: `#1e293b` (Dark Gray)

## Troubleshooting

### API Connection Issues

If you're testing on a physical device:
1. Make sure your device and computer are on the same network
2. Update the API URL in `src/api.js` with your computer's IP address
3. Ensure the backend server is running and accessible

### Build Issues

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

This project is part of the SmartSkul EMS system.

