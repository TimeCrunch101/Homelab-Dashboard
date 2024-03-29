if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.urlencoded({
    extended:false,
    limit: '500mb'
}))
app.use(express.json())

var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15*60*1000, // 1 minute
  max: 400
});

app.use(limiter);

const initGetRouter = require("./routers/getRouter")
const initPostRouter = require("./routers/postRouter")
initGetRouter(app)
initPostRouter(app)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public'))
    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
    })
}

app.listen(8080, console.log(`MODE: ${process.env.NODE_ENV}`))