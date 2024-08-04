import client from "./dbClient"

setInterval(()=>{
    client.connect();


},10000)