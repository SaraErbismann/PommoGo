import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable, PaperProvider, SegmentedButtons } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';

const StatisticsScreen = () => {
    const database = getDatabase(app);

    const [state, setState] = useState({
        dataRange: 'D',
    });
    const [dbData, setDbData] = useState([]);
    const [dateRangeBtn, setDateRangeBtn] = useState('D');

    useEffect(() => {
        const dataRef = ref(database, 'cycleData/');
        onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDbData(Object.values(data));
            } else {
                setDbData([]);
            }
        })
    }, []);

    console.log('dbdata', dbData);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title} >Statistics Page</Text>
                <SegmentedButtons
                    value={dateRangeBtn}
                    onValueChange={setDateRangeBtn}
                    buttons={[
                        { value: 'D', label: 'D' },
                        { value: 'W', label: 'W' },
                        { value: 'M', label: 'M' },
                        { value: 'Y', label: 'Y' }
                    ]}
                    style={styles.segmentedButtons}
                    density='small'
                />
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.chartText}>Bar Chart Placeholder</Text>
                </View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Category</DataTable.Title>
                        <DataTable.Title numeric>Count</DataTable.Title>
                        <DataTable.Title numeric>Time Spent</DataTable.Title>
                    </DataTable.Header>

                    {/* Placeholder Rows for Data */}
                    <DataTable.Row>
                        <DataTable.Cell>Focus Sessions</DataTable.Cell>
                        <DataTable.Cell numeric>12</DataTable.Cell>
                        <DataTable.Cell numeric>4h 30m</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Breaks Taken</DataTable.Cell>
                        <DataTable.Cell numeric>5</DataTable.Cell>
                        <DataTable.Cell numeric>30m</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    segmentedButtons: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartText: {
        fontSize: 16,
        color: '#666666',
    },
});

export default StatisticsScreen;