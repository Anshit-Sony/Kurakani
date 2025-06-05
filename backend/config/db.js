const mongoose=require('mongoose')

const connectMongo=async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb connected: ${conn.connection.port}`)
    }
    catch(error){
        console.log(`Error: ${error}`)
    }
}

module.exports=connectMongo