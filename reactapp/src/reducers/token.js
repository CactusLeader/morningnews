export default function(token = '', action){
    console.log();
    if(action.type == 'addToken'){
        return action.token
    } else {
        return token
    }

}