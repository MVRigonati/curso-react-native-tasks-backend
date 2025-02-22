const express = require('express')
const consign = require('consign')
const db = require('./config/db')
const app = express()

app.db = db

consign()
	.include('./config/passport.js')
	.then('./config/middlewares.js')
	.then('./api')
	.then('./config/routes.js')
	.into(app)

app.listen(3000, () => {
	console.log('Backend executando...')
})