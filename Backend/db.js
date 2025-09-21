const mongoose = require('mongoose')
const mongouri ="mongodb://localhost:27017/new_app"
const connectToMongo =async ()=>{
    mongoose.connect(mongouri,()=>{
     
         console.log('connected to mongose succesfullly')
    })
}
module.exports= connectToMongo;