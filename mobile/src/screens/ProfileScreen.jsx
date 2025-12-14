import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    // Update user profile logic here
    updateUser({ ...user, ...formData });
    setEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName || 'User'}</Text>
        <Text style={styles.role}>{user?.role?.toUpperCase() || 'USER'}</Text>
      </View>

      <View style={styles.content}>
        <FormInput
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          editable={editing}
        />
        <FormInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          editable={false}
        />
        <FormInput
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          editable={editing}
          keyboardType="phone-pad"
        />

        {editing ? (
          <View style={styles.buttonContainer}>
            <Button onPress={handleSave} style={styles.button}>Save</Button>
            <Button
              variant="secondary"
              onPress={() => {
                setEditing(false);
                setFormData({
                  fullName: user?.fullName || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                });
              }}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
        ) : (
          <Button onPress={() => setEditing(true)} style={styles.button}>
            Edit Profile
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', padding: 32, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40, fontWeight: '700', color: '#ffffff' },
  name: { fontSize: 24, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  role: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  content: { padding: 20 },
  buttonContainer: { gap: 12, marginTop: 8 },
  button: { marginTop: 8 },
});

