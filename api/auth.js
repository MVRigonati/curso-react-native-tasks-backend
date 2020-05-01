const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
	const signin = async (req, res) => {
		if (req.body.email.trim() && req.body.password.trim()) {
			// Consulta usuario na base
			const user = await app.db('users').where({ email: req.body.email.toLowerCase() }).first()

			if (user) {
				bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
					if (err || !isMatch) {
						// Caso a senha enviada seja diferente da senha salva na base
						res.status(401).send('Email ou senha incorretos.')
					} else {
						// Utiliza-se o id do usuario para gerar a criptografia do codigo auth
						const payload = { id: user.id }
						res.json({
							name: user.name,
							email: user.email,
							token: jwt.encode(payload, authSecret)
						})
					}
				})
			} else {
				// Caso user esteja nulo
				res.status(400).send('Email ou senha incorretos.')
			}
		} else {
			// Caso email ou senha sejam vazios ou nulos
			res.status(400).send('Dados incompletos.')
		}
	}

	return { signin }
}
