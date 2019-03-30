/*
Actions Types
 */
export const LOGIN = 'LOGIN';

/*
Actions
 */
export function login(text){
    return {
        type: LOGIN,
        text
    }
}