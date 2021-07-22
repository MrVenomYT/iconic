const mongoose = require('mongoose');
const MongoClient = require('mongoose');
const config = require('../../slappey.json');
// const PASS = require('../config');
const PASS = require("../../slappey.json")

module.exports={
    init:() =>{

const dbOptions = {

    useNewUrlParser : true ,
    useUnifiedTopology : true ,
    autoIndex : true ,
    poolSize : 5,
    connectTimeoutMS:1000,
    family : 4 

};

mongoose.connect(`mongodb+srv://iconic:${config.PASS}@iconic.2vmrj.mongodb.net/discordbot?retryWrites=true&w=majority` + `${dbOptions}` ,{useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect(`mongodb+srv://venombot:${config.PASS}@cluster0.2vmrj.mongodb.net/Iconic?retryWrites=true&w=majority ${dbOptions}`)
    //   const uri = `mongodb+srv://iconic:${config.PASS}@iconic.2vmrj.mongodb.net/iconic?retryWrites=true&w=majority` + `${dbOptions}`
// MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })
 mongoose.set('useFindAndModify' , false);
mongoose.Promise = global.Promise;
mongoose.connection.on('connected' , () =>{

console.log('The Bot is connect To The Database');

});
mongoose.connection.on('disconnected' , () =>{

    console.log('The Bot is disconnect from The Database');
    
    });
    mongoose.connection.on('err' , (err) =>{

        console.log('There is an error in connection to the database' + err);
        
        });
         


        
    }

}
