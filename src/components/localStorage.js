export const loadState = () =>{
    try{
        const serializedState = localStorage.getItem('pKey');
        if(serializedState === null){
            return undefined;
        }
        return JSON.parse(serializedState);
    }catch(err){
        return undefined;
    }
};

export const saveState = (pKey) => {
    try{
        const serializedState = JSON.stringify(pKey);
        localStorage.setItem('pKey', serializedState);
    }catch(err){
        //Write to log
    }
};