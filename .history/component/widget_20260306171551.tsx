import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface TotalResidentsWidgetProps {
  total: number;
  title?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
}

const TotalResidentsWidget: React.FC<TotalResidentsWidgetProps> = ({
  total,
  title = 'Total Residents',
  backgroundColor = '#306060',
  accentColor = '#4DD0E1',
  textColor = '#fff',
}) => {
  return (
    <View style={{ backgroundColor, borderRadius: 16, width: '100%', height: 120, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6, overflow: 'hidden' }} >

      {/* Text content */}
      <Text style={{ color: textColor, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: textColor, fontSize: 32, fontWeight: 'bold' }}>
          {total}
        </Text>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name={'open-outline'} color={'#ffff'} size={20} />
          <Text style={{ color: '#fff' }}>View</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TotalResidentsWidget;