import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable, PaperProvider, SegmentedButtons } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';
import getComparisonDate from './helpers';
import { compareAsc, parseISO } from 'date-fns';

const StatisticsScreen = () => {
    const database = getDatabase(app);
    const [dbData, setDbData] = useState([]);
    const [dateRangeBtn, setDateRangeBtn] = useState('D');

    const handleDateRange = () => {
        const range = dateRangeBtn;
        return getComparisonDate(range);
    };

    const handleDateFiltering = () => {
        const comparisonDate = handleDateRange();
        const filteredData = dbData?.filter(entry => {
            const entryDate = new Date(entry.endTime);
            return compareAsc(entryDate, new Date(comparisonDate)) >= 0;
        });
        console.log('filtered data', filteredData);

        if (filteredData.length > 0) {
            filteredData.reduce(
                (acc, entry) => {

                    const { completedTimers, completedShortBreaks, completedLongBreaks, longBreakLength, shortBreakLength, timerLength } = entry;


                    acc.completedTimers += completedTimers || 0;
                    acc.completedShortBreaks += completedShortBreaks || 0;
                    acc.completedLongBreaks += completedLongBreaks || 0;

                    acc.timeSpentTimer += (completedTimers || 0) * timerLength;
                    acc.timeSpentShortBreak += (completedShortBreaks || 0) * shortBreakLength;
                    acc.timeSpentLongBreak += (completedLongBreaks || 0) * longBreakLength;

                    return acc;
                },
                {
                    completedTimers: 0,
                    completedShortBreaks: 0,
                    completedLongBreaks: 0,
                    timeSpentTimer: 0,
                    timeSpentShortBreak: 0,
                    timeSpentLongBreak: 0,
                }
            );
        }

        console.log('filter data after reduce', filteredData);
        return filteredData;
    };

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

    useEffect(() => {
        handleDateFiltering();
    }, [dateRangeBtn])

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
                        <DataTable.Cell>Short breaks</DataTable.Cell>
                        <DataTable.Cell numeric>5</DataTable.Cell>
                        <DataTable.Cell numeric>30m</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Long breaks</DataTable.Cell>
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