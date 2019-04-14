export const loadState = () => {
    try {
        const serializedState = {
            account: localStorage.getItem('account'),
            key: localStorage.getItem('pKey'),
            login: localStorage.getItem('login')
        };
        return serializedState;
    } catch (err) {
        return null;
    }
};

export const saveState = (account, pKey, login) => {
    try {
        localStorage.setItem('account', account);
        localStorage.setItem('pKey', pKey);
        localStorage.setItem('login', login);
    } catch (err) {
        //Write to log
    }
};