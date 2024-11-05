import { app } from './firebaseConfig';
import { getDatabase, ref, push, update } from "firebase/database";

const db = getDatabase(app);

// Save/update cycle settings from the settings page
export async function handleSaveSettings(data) {
    if (Object.keys(data).length > 0) {
        try {
            const settingsRef = ref(db, 'cycleSettings');

            await update(settingsRef, data);
            console.log("Settings saved/updated successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    }
}

export async function getCycleData() {

}

