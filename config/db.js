const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("mongoDB connected !!")
}
// mongoose.connection.on('connected',()=>{
//     console.log("mongodb is connected")
// })
mongoose.connection.on('error', (err) => {
    console.log(err.message)
})
mongoose.connection.on('disconnected', () => {
    console.log("mongoose is disconeected")
})

module.exports = connectDB;