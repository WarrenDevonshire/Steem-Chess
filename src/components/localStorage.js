export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('pKey');
        if (serializedState === null) {
            return null;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return null;
    }
};

export const saveState = (pKey) => {
    try {
        const serializedState = JSON.stringify(pKey);
        localStorage.setItem('pKey', serializedState);
    } catch (err) {
        //Write to log
    }
};