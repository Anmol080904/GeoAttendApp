import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Picker } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, layout } from '../styles';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { registerUser, loginUser } from '../services/auth';

export default function RegisterScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // 👈 default role
  const [companyId, setCompanyId] = useState(''); // only for admins
  const [isLoading, setIsLoading] = useState(false);
  const { onAuthStateChange } = route.params || {};

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      if (role === 'user') {
        // 👤 Normal user registration
        await registerUser(name, email, password);
        await loginUser(email, password);
      } else {
        // 👨‍💼 Admin registration via backend API
        const response = await fetch("https://minor-project-606r.onrender.com/api/admin/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: name,
            email,
            password,
            cmp_id: companyId,
            privileges: "manage_users,view_reports"
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Admin registration failed");
        }

        // Auto login admin
        await loginUser(email, password);
      }

      if (onAuthStateChange) {
        onAuthStateChange(true);
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join GeoAttend today</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />

          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />

          {/* Role selector */}
          <Text style={styles.roleLabel}>Register as:</Text>
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            style={styles.picker}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>

          {/* Company ID only for admins */}
          {role === 'admin' && (
            <InputField
              label="Company ID"
              value={companyId}
              onChangeText={setCompanyId}
              placeholder="Enter company ID"
            />
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.padding.large,
    paddingVertical: layout.padding.extraLarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: layout.spacing.extraLarge,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: layout.spacing.large,
  },
  backButtonText: {
    ...typography.body2,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: layout.spacing.small,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    gap: layout.spacing.large,
  },
  roleLabel: {
    ...typography.body2,
    marginTop: layout.spacing.medium,
    marginBottom: layout.spacing.small,
    color: colors.textSecondary,
  },
  picker: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: layout.spacing.medium,
  },
  registerButton: {
    marginTop: layout.spacing.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: layout.spacing.large,
  },
  footerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  linkText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
});
