import { View, Text, StyleSheet } from 'react-native'

export default function MyCardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Loyalty Cards</Text>
      <Text style={styles.empty}>
        Your loyalty cards will appear here.{'\n'}
        Visit a participating business to get started!
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 60, lineHeight: 22 },
})
