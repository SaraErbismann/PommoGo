import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu, PaperProvider, TextInput } from 'react-native-paper';

export default function SettingsScreen() {
    const [cycle, setCycle] = useState({
        amount: 0,
        timerLength: 0,
        shortBreak: 0,
        longBreak: 0
    });
    const options = {
        shortBreakOptions: [5, 10, 15],
        longBreakOptions: [15, 20, 25, 30],
        amountOptions: [1, 2, 3, 4],
        timerOptions: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    };

    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('');

    //onPress={handleSubmit}
    console.log('options', options);

    const handleSelect = (field, value) => {
        console.log(`selected field is ${field} and valu is ${value}`);
        setCycle(prevCycle => ({ ...prevCycle, [field]: value }));
        setMenuVisible(false);
        setSelectedField('');
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Settings Page</Text>
                <Text style={styles.label}>Timer Length</Text>
                <Menu
                    visible={menuVisible && selectedField === 'timerLength'}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={<Button onPress={() => { setMenuVisible(true); setSelectedField('timerLength'); }}>{cycle.timerLength} min</Button>}
                >
                    {options.timerOptions?.map(option => (
                        <Menu.Item key={option} onPress={() => handleSelect('timerLength', option)} title={`${option} min`} />
                    ))}
                </Menu>
                <Text style={styles.label}>Short Break Length</Text>
                <Menu
                    visible={menuVisible && selectedField === 'shortBreak'}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={<Button onPress={() => { setMenuVisible(true); setSelectedField('shortBreak'); }}>{cycle.shortBreak} min</Button>}
                >
                    {options.shortBreakOptions.map(option => (
                        <Menu.Item key={option} onPress={() => handleSelect('shortBreak', option)} title={`${option} min`} />
                    ))}
                </Menu>
                <Text style={styles.label}>Long Break Length</Text>
                <Menu
                    visible={menuVisible && selectedField === 'longBreak'}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={<Button onPress={() => { setMenuVisible(true); setSelectedField('longBreak'); }}>{cycle.longBreak} min</Button>}
                >
                    {options.longBreakOptions.map(option => (
                        <Menu.Item key={option} onPress={() => handleSelect('longBreak', option)} title={`${option} min`} />
                    ))}
                </Menu>
                <Text style={styles.label}>Cycle</Text>
                <Menu
                    visible={menuVisible && selectedField === 'amount'}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={<Button onPress={() => { setMenuVisible(true); setSelectedField('amount'); }}>{cycle.amount}</Button>}
                >
                    {options.amountOptions.map(option => (
                        <Menu.Item key={option} onPress={() => handleSelect('amount', option)} title={`${option} min`} />
                    ))}
                </Menu>
                <Button mode="contained" style={styles.submitButton}>
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
    },
    input: {
        marginBottom: 10,
    },
    label: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 20,
    },
});