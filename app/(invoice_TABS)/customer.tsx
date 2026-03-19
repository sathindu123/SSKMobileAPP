import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';

export default function CustomerTab() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <ScrollView style={styles.content}>
      {/* Customer Search & Banner (කලින් තිබූ UI එක මෙතනට දාන්න) */}
      <View style={styles.infoBanner}>
         <Text style={{fontWeight: 'bold'}}>සැපයුම්කරු: මහේෂ් ප්‍රියංකර</Text>
      </View>

      {/* දෛනික එකතුව Table */}
      <View style={styles.kgGrid}>
         {days.map(day => (
           <View key={day} style={styles.cell}>
             <Text>{day}</Text>
             <TextInput style={styles.input} placeholder="0.0" />
           </View>
         ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 15 },
  infoBanner: { backgroundColor: '#B3E5FC', padding: 15, borderRadius: 10, marginBottom: 15 },
  kgGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  cell: { width: '33.33%', flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, borderColor: '#eee' },
  input: { marginLeft: 10, flex: 1 }
});