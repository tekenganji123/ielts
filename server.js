const express = require('express')
const cookieparser = require('cookie-parser')
const { config } = require('dotenv')
const session = require('express-session')
config()

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false,
    cookie:{
        secure: false
    }
}))


app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));







app.listen(process.env.PORT, () =>{
    console.log(process.env.PORT);
    
})
