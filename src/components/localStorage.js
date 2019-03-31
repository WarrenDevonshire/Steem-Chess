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

export const saveState = (account, pKey) => {
    try {
        const serializedState = {
            account: account,
            key: pKey
        }
        localStorage.setItem('pKey', JSON.stringify(serializedState));
    } catch (err) {
        //Write to log
    }
};