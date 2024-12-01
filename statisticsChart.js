import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsChart({ data }) {

    const chartConfig = {
        backgroundColor: '#86BBD8',
        backgroundGradientFrom: '#33658A',
        backgroundGradientTo: '#33658A',
        decimalPlaces: 1,
        color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
        },
    };

    return (
        <BarChart
            style={{ marginVertical: 8, borderRadius: 16 }}
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            showBarTops

        />
    );
};