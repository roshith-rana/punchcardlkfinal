import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { formatPhoneNumberSL, isValidSLPhone } from '@punchcard/utils'

export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendOTP() {
    const formatted = formatPhoneNumberSL(phone)

    if (!isValidSLPhone(formatted)) {
      Alert.alert('Invalid Number', 'Please enter a valid Sri Lankan mobile number.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      phone: formatted,
    })

    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    router.push({ pathname: '/(auth)/verify', params: { phone: formatted } })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>PunchCard</Text>
        <Text style={styles.subtitle}>Your loyalty rewards, all in one place</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="071 234 5678"
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={sendOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4f46e5' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#c7d2fe', textAlign: 'center', marginTop: 8, marginBottom: 40 },
  form: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
