import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import api from '../api';

export default function CustomDrawer(props) {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const role = user?.role || '';

  const menuItems = [
    { name: 'Dashboard', icon: '📊', route: 'Dashboard', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Students', icon: '🎓', route: 'Students', roles: ['admin', 'teacher'] },
    { name: 'Teachers', icon: '👨‍🏫', route: 'Teachers', roles: ['admin'] },
    { name: 'Parents', icon: '👨‍👩‍👧', route: 'Parents', roles: ['admin'] },
    { name: 'Classes', icon: '🏫', route: 'Classes', roles: ['admin', 'teacher'] },
    { name: 'Sections', icon: '📋', route: 'Sections', roles: ['admin'] },
    { name: 'Subjects', icon: '📚', route: 'Subjects', roles: ['admin', 'teacher'] },
    { name: 'Attendance', icon: '✅', route: 'Attendance', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Exams', icon: '📝', route: 'Exams', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Timetable', icon: '📅', route: 'Timetable', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Homework', icon: '📋', route: 'Homework', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Fees', icon: '💰', route: 'Fees', roles: ['admin', 'parent', 'student'] },
    { name: 'Announcements', icon: '📢', route: 'Announcements', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Events', icon: '🎉', route: 'Events', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Reports', icon: '📈', route: 'Reports', roles: ['admin', 'teacher'] },
    { name: 'Messages', icon: '💬', route: 'Messages', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Library', icon: '📖', route: 'Library', roles: ['admin', 'teacher', 'student'] },
    { name: 'Transport', icon: '🚌', route: 'Transport', roles: ['admin', 'parent'] },
    { name: 'Inventory', icon: '📦', route: 'Inventory', roles: ['admin'] },
    { name: 'Hostel', icon: '🏠', route: 'Hostel', roles: ['admin'] },
    { name: 'Payroll', icon: '💵', route: 'Payroll', roles: ['admin'] },
    { name: 'Profile', icon: '👤', route: 'Profile', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Settings', icon: '⚙️', route: 'Settings', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SmartSkul EMS</Text>
        <Text style={styles.subtitle}>{role.charAt(0).toUpperCase() + role.slice(1)} Panel</Text>
        {user && (
          <Text style={styles.userName}>{user.fullName || user.email}</Text>
        )}
      </View>

      <ScrollView style={styles.menuContainer}>
        {filteredItems.map((item) => {
          const isActive = props.state.routes[props.state.index]?.name === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.name)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
    borderBottomWidth: 1,
    borderBottomColor: '#1e40af',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#bfdbfe',
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#dbeafe',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

