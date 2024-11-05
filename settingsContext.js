import React, { createContext, useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [timerSettings, setTimerSettings] = useState({
        amount: 4,
        timerLength: 1800,      // Default 30 minutes in seconds
        shortBreak: 600,        // Default 10 minutes in seconds
        longBreak: 1800,        // Default 30 minutes in seconds
    });

    useEffect(() => {
        const db = getDatabase(app);
        const dbRef = ref(db, 'cycleSettings');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTimerSettings({
                    amount: data.amount || timerSettings.amount,
                    timerLength: data.timerLength || timerSettings.timerLength,
                    shortBreak: data.shortBreak || timerSettings.shortBreak,
                    longBreak: data.longBreak || timerSettings.longBreak,
                });
            } else {
                console.log('No db data');
            }
        })
    }, []);

    return (
        <SettingsContext.Provider value={{ timerSettings, setTimerSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;