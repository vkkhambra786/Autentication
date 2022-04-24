const app = require('./index');
const connect = require('./configs/db');
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT;



app.listen(port,async ()=>{
    try{
        await connect();
        console.log("Backend is running on port -",port);
    }catch(e){
        console.log(e);
    }
})