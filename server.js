/* server.js - user & resource authentication */
'use strict';
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

// for hashing
const bcrypt = require('bcryptjs')

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.set('useFindAndModify', false); // for some deprecation issues
const { User } = require('./models/users')
const { Score } = require('./models/scores')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// express-session for managing user sessions
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')))
app.use("/js", express.static(path.join(__dirname, '/public/js')))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/index.html'))
})

/*** Session handling **************************************/

// Add new user to the user database
app.post('/signup', (req, res) => {
	const user = new User ({
		username: req.body.username,
		password: req.body.password,
		admin: req.body.admin
	})
	User.findOne({username: req.body.username})
	.then((userExists) => {
		if (userExists) {
			res.status(400).send("User already exists.")
		} else {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, (err, hash) => {
					user.password = hash
					user.save().then((result) => {
						res.send(result)
					}, (error) => {
						res.status(400).send(error)
					})
				})
			})
		}
	}, (error) => {
		res.status(500).send(error)
	})
})

// Add new logged in user
app.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	User.findOne({username: username})
	.then((user) => {
		if (!user) {
			res.status(400).send("Invalid username or password.")
		} else {
			bcrypt.compare(password, user.password).then((result) => {
				if (!result) {
					res.status(400).send("Invalid username or password.")
				} else {
					res.send(user)
				}
			})
		}
	}, (error) => {
		res.status(500).send(error)
	})
})

// Change user password
app.patch('/pass', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	const update = {
		username: username
	}

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			update.password = hash;
			User.findOneAndUpdate({username: username}, {$set: update}, {new: true})
			.then((user) => {
				if (!user) {
					res.status(404).send()
				} else {
					res.send(update)
				}
			}, (error) => {
				res.status(500).send(error)
			})
		})
	})
})

// Add new score to the score database
app.post('/score', (req, res) => {
	const score = new Score({
		username: req.body.username,
		moves: req.body.moves,
		minutes: req.body.minutes,
		seconds: req.body.seconds
	})
	score.save().then((score) => {
		res.send(score)
	}, (error) => {
		res.status(400).send(error)
	})
})

// Get all scores from the score database
app.get('/score', (req, res) => {
	Score.find().then((scores) => {
		res.send({ scores })
	}, (error) => {
		res.status(500).send(error)
	})
})

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
