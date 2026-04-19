import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  async function verifyOTP() {
    if (otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      phone: phone!,
      token: otp,
      type: 'sms',
    })

    setLoading(false)

    if (error) {
      Alert.alert('Verification Failed', error.message)
      return
    }

    router.replace('/(tabs)/')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit code to {phone}
      </Text>

      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={verifyOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Change number</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 32 },
  input: {
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 12,
    padding: 16,
    fontSize: 28,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backLink: { marginTop: 20, alignItems: 'center' },
  backLinkText: { color: '#4f46e5', fontSize: 14 },
})
