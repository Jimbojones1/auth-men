const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()

const session = require('express-session')
const methodOverride = require('method-override');
const morgan = require('morgan');

// Require controller, which is requiring the router object
const authController = require('./controllers/auth')

// require the db file to connect to the database
require('./config/database')

// middleware ========================
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false})); // parses 
// body of http requests coming from form requests from the browser
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))

// setup our routers (controller router)
app.use('/auth', authController)

// =========== Landing Page
app.get('/', function(req, res){
	console.log(req.session, " <--- req.session")
	res.render('index.ejs', {user: req.session.user})
})

app.get('/vip-lounge', function(req, res){
	if(req.session.user){
		res.send(`Welcome to the vip lounge ${req.session.user.username}`)
	} else {
		res.send('Sorry you must login!')
	}
})


// ternary statement
// if there is a PORT environment variable
// then use it (often true in production environment), otherwise use 3000
const port = process.env.PORT ? process.env.PORT : 3000

app.listen(port, function(){
	console.log(`Server listening on port: ${port}`)
})