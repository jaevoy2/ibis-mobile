import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TotalResidentsWidgetProps {
  total: number;
  title?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  onPressView?: () => void; // callback when button is pressed
}

const TotalResidentsWidget: React.FC<TotalResidentsWidgetProps> = ({
  total,
  title = 'Total Residents',
  backgroundColor = '#306060',
  accentColor = '#4DD0E1',
  textColor = '#fff',
  onPressView,
}) => {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 16,
        width: '100%',
        height: 150,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'hidden',
        justifyContent: 'space-between',
      }}
    >
      {/* Text content */}
      <View>
        <Text
          style={{
            color: textColor,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: textColor,
            fontSize: 32,
            fontWeight: 'bold',
          }}
        >
          {total}
        </Text>
      </View>

      {/* View Button */}
      {onPressView && (
        <TouchableOpacity
          onPress={onPressView}
          style={{
            marginTop: 12,
            backgroundColor: accentColor,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: textColor, fontWeight: '600' }}>View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TotalResidentsWidget;