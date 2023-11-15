import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    darkModeEnabled: boolean
}

// prefer mode in storage, then check user preference
const initialState: SettingsState = {
    darkModeEnabled: localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setDarkMode: (state: SettingsState, action: PayloadAction<boolean>) => {
            state.darkModeEnabled = action.payload;
            localStorage.setItem('darkMode', JSON.stringify(state.darkModeEnabled));      
        }
    }
})

export const { setDarkMode } = settingsSlice.actions;
export default settingsSlice.reducer;