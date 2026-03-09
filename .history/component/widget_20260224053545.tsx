import React from 'react';
import { Text, View } from 'react-native';

interface TotalResidentsWidgetProps {
  total: number;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
}

const TotalResidentsWidget: React.FC<TotalResidentsWidgetProps> = ({
  total,
  title = 'Total Residents',
  backgroundColor = '#306060',
  textColor = '#fff',
}) => {
  return (
    <View
      style={{
        backgroundColor,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ color: textColor, fontSize: 14, marginBottom: 4 }}>{title}</Text>
      <Text style={{ color: textColor, fontSize: 28, fontWeight: 'bold' }}>{total}</Text>
    </View>
  );
};

export default TotalResidentsWidget;