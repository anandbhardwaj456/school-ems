import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function DashboardScreen() {
  const { user, isAdmin, isTeacher } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    feesCollected: 0,
    feesPending: 0,
    attendanceToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isAdmin) {
        const [studentsRes, teachersRes, classesRes, announcementsRes] = await Promise.allSettled([
          api.get('/students').catch(() => ({ data: { data: [] } })),
          api.get('/teachers').catch(() => ({ data: { data: [] } })),
          api.get('/classes').catch(() => ({ data: { data: [] } })),
          api.get('/announcements').catch(() => ({ data: { data: [] } })),
        ]);

        const students = studentsRes.status === 'fulfilled' ? studentsRes.value.data?.data || [] : [];
        const teachers = teachersRes.status === 'fulfilled' ? teachersRes.value.data?.data || [] : [];
        const classes = classesRes.status === 'fulfilled' ? classesRes.value.data?.data || [] : [];
        const anns = announcementsRes.status === 'fulfilled' ? announcementsRes.value.data?.data || [] : [];

        setStats({
          students: students.length,
          teachers: teachers.length,
          classes: classes.length,
          feesCollected: 0,
          feesPending: 0,
          attendanceToday: 0,
        });
        setAnnouncements(anns.slice(0, 5));
      } else if (isTeacher) {
        const [classesRes, announcementsRes] = await Promise.allSettled([
          api.get('/classes').catch(() => ({ data: { data: [] } })),
          api.get('/announcements').catch(() => ({ data: { data: [] } })),
        ]);

        const classes = classesRes.status === 'fulfilled' ? classesRes.value.data?.data || [] : [];
        const anns = announcementsRes.status === 'fulfilled' ? announcementsRes.value.data?.data || [] : [];

        setStats({
          students: 0,
          teachers: 0,
          classes: classes.length,
          feesCollected: 0,
          feesPending: 0,
          attendanceToday: 0,
        });
        setAnnouncements(anns.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {isAdmin ? 'Admin' : isTeacher ? 'Teacher' : 'Student'} Dashboard
        </Text>
        <Text style={styles.subtitle}>Welcome back, {user?.fullName}</Text>
      </View>

      {isAdmin && (
        <View style={styles.statsGrid}>
          <StatCard
            title="Students"
            value={stats.students}
            icon="🎓"
            color="#3b82f6"
            onPress={() => navigation.navigate('Students')}
          />
          <StatCard
            title="Teachers"
            value={stats.teachers}
            icon="👨‍🏫"
            color="#16a34a"
            onPress={() => navigation.navigate('Teachers')}
          />
          <StatCard
            title="Classes"
            value={stats.classes}
            icon="🏫"
            color="#a855f7"
            onPress={() => navigation.navigate('Classes')}
          />
          <StatCard
            title="Fees Collected"
            value={`₹${stats.feesCollected.toLocaleString()}`}
            icon="💰"
            color="#10b981"
            onPress={() => navigation.navigate('Fees')}
          />
          <StatCard
            title="Fees Pending"
            value={`₹${stats.feesPending.toLocaleString()}`}
            icon="⏳"
            color="#f59e0b"
            onPress={() => navigation.navigate('Fees')}
          />
          <StatCard
            title="Attendance"
            value={`${stats.attendanceToday}%`}
            icon="✅"
            color="#6366f1"
            onPress={() => navigation.navigate('Attendance')}
          />
        </View>
      )}

      {isTeacher && (
        <View style={styles.statsGrid}>
          <StatCard
            title="My Classes"
            value={stats.classes}
            icon="🏫"
            color="#3b82f6"
            onPress={() => navigation.navigate('Classes')}
          />
          <StatCard
            title="Timetable"
            value="View"
            icon="📅"
            color="#16a34a"
            onPress={() => navigation.navigate('Timetable')}
          />
          <StatCard
            title="Homework"
            value="Check"
            icon="📋"
            color="#a855f7"
            onPress={() => navigation.navigate('Homework')}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Announcements</Text>
        {announcements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No announcements</Text>
          </View>
        ) : (
          announcements.map((ann) => (
            <TouchableOpacity
              key={ann.announcementId || ann.id}
              style={styles.announcementCard}
              onPress={() => navigation.navigate('Announcements')}
            >
              <Text style={styles.announcementTitle}>{ann.title}</Text>
              <Text style={styles.announcementMessage} numberOfLines={2}>
                {ann.message}
              </Text>
              <Text style={styles.announcementDate}>
                {new Date(ann.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, icon, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
  announcementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  announcementMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

