import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StudentsScreen from '../screens/StudentsScreen';
import TeachersScreen from '../screens/TeachersScreen';
import ParentsScreen from '../screens/ParentsScreen';
import ClassesScreen from '../screens/ClassesScreen';
import SectionsScreen from '../screens/SectionsScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ExamsScreen from '../screens/ExamsScreen';
import FeesScreen from '../screens/FeesScreen';
import TimetableScreen from '../screens/TimetableScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import EventsScreen from '../screens/EventsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import LibraryScreen from '../screens/LibraryScreen';
import TransportScreen from '../screens/TransportScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InventoryScreen from '../screens/InventoryScreen';
import HostelScreen from '../screens/HostelScreen';
import PayrollScreen from '../screens/PayrollScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawer from '../components/CustomDrawer';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  const { user } = useAuth();
  const role = user?.role || '';

  const getMenuItems = () => {
    const allItems = [
      { name: 'Dashboard', component: DashboardScreen, icon: '📊', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Students', component: StudentsScreen, icon: '🎓', roles: ['admin', 'teacher'] },
      { name: 'Teachers', component: TeachersScreen, icon: '👨‍🏫', roles: ['admin'] },
      { name: 'Parents', component: ParentsScreen, icon: '👨‍👩‍👧', roles: ['admin'] },
      { name: 'Classes', component: ClassesScreen, icon: '🏫', roles: ['admin', 'teacher'] },
      { name: 'Sections', component: SectionsScreen, icon: '📋', roles: ['admin'] },
      { name: 'Subjects', component: SubjectsScreen, icon: '📚', roles: ['admin', 'teacher'] },
      { name: 'Attendance', component: AttendanceScreen, icon: '✅', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Exams', component: ExamsScreen, icon: '📝', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Timetable', component: TimetableScreen, icon: '📅', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Homework', component: HomeworkScreen, icon: '📋', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Fees', component: FeesScreen, icon: '💰', roles: ['admin', 'parent', 'student'] },
      { name: 'Announcements', component: AnnouncementsScreen, icon: '📢', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Events', component: EventsScreen, icon: '🎉', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Reports', component: ReportsScreen, icon: '📈', roles: ['admin', 'teacher'] },
      { name: 'Messages', component: MessagesScreen, icon: '💬', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Library', component: LibraryScreen, icon: '📖', roles: ['admin', 'teacher', 'student'] },
      { name: 'Transport', component: TransportScreen, icon: '🚌', roles: ['admin', 'parent'] },
      { name: 'Inventory', component: InventoryScreen, icon: '📦', roles: ['admin'] },
      { name: 'Hostel', component: HostelScreen, icon: '🏠', roles: ['admin'] },
      { name: 'Payroll', component: PayrollScreen, icon: '💵', roles: ['admin'] },
      { name: 'Profile', component: ProfileScreen, icon: '👤', roles: ['admin', 'teacher', 'student', 'parent'] },
      { name: 'Settings', component: SettingsScreen, icon: '⚙️', roles: ['admin'] },
    ];

    return allItems.filter((item) => item.roles.includes(role));
  };

  const menuItems = getMenuItems();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '600' },
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#64748b',
      }}
    >
      {menuItems.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            title: item.name,
            drawerIcon: () => null, // We'll handle icons in CustomDrawer
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

