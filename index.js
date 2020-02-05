const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.status(200).send('<h1>Meu Backend!</h1>')
})

app.listen(3000, () => {
	console.log('Backend executando...')
})