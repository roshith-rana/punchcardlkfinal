import { View, Text, StyleSheet } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function QRCodeScreen() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your QR Code</Text>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>QR</Text>
      </View>
      <Text style={styles.subtitle}>
        Show this to staff to collect stamps or redeem rewards.
      </Text>
      {userId && (
        <Text style={styles.userId} numberOfLines={1}>
          ID: {userId}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 32 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 32 },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  qrText: { fontSize: 48, color: '#9ca3af' },
  subtitle: { color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  userId: { marginTop: 16, color: '#d1d5db', fontSize: 12, maxWidth: 280 },
})
