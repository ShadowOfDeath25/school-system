import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.error = null;
            state.isLoading = false;
            state.isAuthenticated = false;
        }
    }

})
export const {setUser, setLoading, setError, logout} = authSlice.actions;
export default authSlice.reducer;
