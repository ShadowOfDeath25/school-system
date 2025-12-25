import {useEffect, useState} from "react";

/**
 * @param key - The key to access the item in localStorage with
 * @param value - The value to be stored
 */
export const usePersistedState = (key, value) => {
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue !== null ? JSON.parse(storedValue) : value;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}
