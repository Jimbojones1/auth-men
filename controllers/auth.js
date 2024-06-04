const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')

// localhost:3000/auth/sign-up
router.get('/sign-up', function(req, res){
	res.render('auth/sign-up.ejs')
})

//  localhost:3000/auth/logout
router.get('/logout', function(req, res){
	req.session.destroy(); // deletes the cookie for that specific client who just made a request
	res.redirect('/')
})

router.post('/login',async function(req, res){
	
	
	// then initialize the user's session
	try {
		// confirm the user exists
		const userDoc = await UserModel.findOne({username: req.body.username})
		// userDoc will be undefined if the UserModel doesn't find anything
		if(!userDoc) {
			return res.send("Login Failed, please try again")
		}

		// check the password 
		const isValidPassword = bcrypt.compareSync(req.body.password, userDoc.password)
		if(!isValidPassword){
			return res.send('Login Failed, please try again')
		}

		// then initialize the user's session
		// NEVER STORE THE PASSWORD IN THE SESSION!
		req.session.user = {
			username: userDoc.username,
			_id: userDoc._id
		}

		// redirect to whatever page you want after they login
		res.redirect('/')

	} catch(err){
		console.log(err)
		res.send('check the terminal for an error')
	}
})

// POST /auth/sign-up
router.post('/sign-up', async function(req, res){

	// we want to make sure the username is unique!
	try {
		// search the database by the username
		const userDoc = await UserModel.findOne({username: req.body.username})
		// if no user is found, userDoc is undefined!
		if(userDoc){
			return res.send('Username already taken.')
		}

		// we want to make sure the password and confirmPassword match
		if(req.body.password !== req.body.confirmPassword){
			return res.send("Password and Confirm Password must match!")
		}

	// we want to make sure the password and confirmPassword match
	// then we want to hash our password (we never store plain text)
	// then store the new user in the database
	const hashedPassword = bcrypt.hashSync(req.body.password, 10);
	// over writing the password from the form (plain text)
	// with the hash password before we put it in the db!
	req.body.password = hashedPassword;
	const user = await UserModel.create(req.body)
    console.log(user, " <-  created User")
	// redirect to the page you want to after login
	// then initialize the user's session
	// NEVER STORE THE PASSWORD IN THE SESSION!
	req.session.user = {
		username: userDoc.username,
		_id: userDoc._id
	}
	res.redirect('/')

	} catch(err){
		console.log(err)
		return res.send("There was an error check the terminal")
	}
})

// localhost:3000/auth/login
router.get('/login', function(req, res){
	res.render('auth/login.ejs')
})

module.exports = router;