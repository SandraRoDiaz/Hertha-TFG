import md5 from 'md5';

export function generateSalt(){
    let salt = Math.random().toString(16).substr(2)
    return salt;
}

export function encrypt(data, salt){
    let hashedData = md5(data + salt)
    return hashedData;
}

export function generateID(){
    // date in miliseconds and hexadecimal format
    let date = Date.now().toString(16);
    //Unique id with 32 characters
    let id = md5(date)
    return id;
}