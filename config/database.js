const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () =>{
	console.log(`connect to MOngodb ${mongoose.connection.name}`)
})