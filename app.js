
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv')
const createError = require('http-errors')
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const medicineRoutes = require("./routes/medicineRoutes")
const batchRoutes = require('./routes/batchRoutes')

const app = express()

dotenv.config();
connectDB();

app.use(express.json())
app.use(morgan("dev"))

app.get('/helo', (req, res, next) => {
    res.send("welcome to PharmaTrack")
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api/medicine', medicineRoutes)
app.use('/api/batches', batchRoutes)


//handling errors which is not handled by above routes
app.use((req, res, next) => {
    next(new createError.NotFound("this route does not exist"))

})

app.use((err, req, res, next) => {
    // res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
