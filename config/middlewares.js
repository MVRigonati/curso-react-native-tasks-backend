const bodeParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
	app.use(bodeParser.json())
	app.use(cors({
		origin: '*'
	}))
}