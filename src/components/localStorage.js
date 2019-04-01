export const loadState = () => {
    try {
        const serializedState = {
            account: localStorage.getItem('account'),
            key: localStorage.getItem('pKey')
        };
        return serializedState;
    } catch (err) {
        return null;
    }
};

export const saveState = (account, pKey) => {
    try {
        localStorage.setItem('account', account);
        localStorage.setItem('pKey', pKey);
    } catch (err) {
        //Write to log
    }
};