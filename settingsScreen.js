import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu, PaperProvider, TextInput } from 'react-native-paper';
import { handleSaveSettings } from './apiCalls';
import SettingsContext from './settingsContext';


export default function SettingsScreen() {

    const { timerSettings } = useContext(SettingsContext);
    const [cycle, setCycle] = useState({
        amount: timerSettings.amount || 4, //default value
        timerLength: timerSettings.timerLength || 30, //default value
        shortBreak: timerSettings.shortBreak || 10, //default value
        longBreak: timerSettings.longBreak || 30 //default value
    });
    const options = {
        shortBreakOptions: [5, 10, 15],
        longBreakOptions: [15, 20, 25, 30],
        amountOptions: [1, 2, 3, 4],
        timerOptions: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    };
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('');

    const handleSelect = (field, value) => {
        setCycle(prevCycle => ({
            ...prevCycle,
            [field]: value
        }));
        setMenuVisible(false);
        setSelectedField('');
    };

    const handleSubmit = () => {
        handleSaveSettings(cycle);
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Settings Page</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Timer Length</Text>
                    <Menu
                        visible={menuVisible && selectedField === 'timerLength'}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<Button textColor='#33658A' onPress={() => { setMenuVisible(true); setSelectedField('timerLength'); }}>{cycle.timerLength} min</Button>}
                    >
                        {options.timerOptions?.map(option => (
                            <Menu.Item key={option} onPress={() => handleSelect('timerLength', option)} title={`${option} min`} titleStyle={{ color: '#33658A' }} contentStyle={{ color: 'FFFFFF' }} />
                        ))}
                    </Menu>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Short Break Length</Text>
                    <Menu
                        visible={menuVisible && selectedField === 'shortBreak'}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<Button textColor='#33658A' onPress={() => { setMenuVisible(true); setSelectedField('shortBreak'); }}>{cycle.shortBreak} min</Button>}
                    >
                        {options.shortBreakOptions.map(option => (
                            <Menu.Item key={option} onPress={() => handleSelect('shortBreak', option)} title={`${option} min`} />
                        ))}
                    </Menu>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Long Break Length</Text>
                    <Menu
                        visible={menuVisible && selectedField === 'longBreak'}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<Button textColor='#33658A' onPress={() => { setMenuVisible(true); setSelectedField('longBreak'); }}>{cycle.longBreak} min</Button>}
                    >
                        {options.longBreakOptions.map(option => (
                            <Menu.Item key={option} onPress={() => handleSelect('longBreak', option)} title={`${option} min`} />
                        ))}
                    </Menu>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Cycle</Text>
                    <Menu
                        visible={menuVisible && selectedField === 'amount'}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<Button textColor='#33658A' onPress={() => { setMenuVisible(true); setSelectedField('amount'); }}>{cycle.amount}</Button>}
                    >
                        {options.amountOptions.map(option => (
                            <Menu.Item key={option} onPress={() => handleSelect('amount', option)} title={`${option} min`} />
                        ))}
                    </Menu>
                </View>
                <Button
                    mode="elevated"
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                    textColor='#33658A'
                >
                    Save Settings
                </Button>
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
        marginTop: 50,
        flexShrink: 1,
    },
    input: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
});