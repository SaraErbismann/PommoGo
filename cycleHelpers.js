import { getDatabase, ref, push, update } from 'firebase/database';

export default function CycleHelpers() {

    const initializeCycle = async (timerSettings) => {
        const db = getDatabase();
        const cyclesRef = ref(db, 'cycles');

        const newCycle = {
            startDateTime: new Date().toISOString(),
            timerDuration: timerSettings.timerLength,
            shortBreakDuration: timerSettings.shortBreak,
            longBreakDuration: timerSettings.longBreak,
            amount: timerSettings.amount,
            completedTimers: 0,
            completedShortBreaks: 0,
        };

        const newCycleRef = push(cyclesRef);
        await update(newCycleRef, newCycle);

        return newCycleRef.key;
    };

    const updateCompletedTimers = async (cycleId, newCompletedTimers) => {
        const db = getDatabase();
        const cycleRef = ref(db, `cycles/${cycleId}`);
        await update(cycleRef, { completedTimers: newCompletedTimers });
    };

    const updateCompletedShortBreaks = async (cycleId, newCompletedShortBreaks) => {
        const db = getDatabase();
        const cycleRef = ref(db, `cycles/${cycleId}`);
        await update(cycleRef, { completedShortBreaks: newCompletedShortBreaks });
    };

    const finalizeCycle = async (cycleId) => {
        const db = getDatabase();
        const cycleRef = ref(db, `cycles/${cycleId}`);
        await update(cycleRef, { endDateTime: new Date().toISOString() });
    };

}