const moment = require('moment')

const TABLE_NAME = 'tasks'

module.exports = app => {
	const getTasks = (req, res) => {
		const date = req.query.date

		if (date) {
			app.db(TABLE_NAME)
				.where({ userId: req.user.id })
				.andWhere('estimateAt', '<=', date)
				.orderBy('estimateAt')
				.then(tasks => res.json(tasks))
				.catch(err => res.status(400).json(err))
		} else {
			res.status(500).send('"date" é obrigatório')
		}
	}

	const save = (req, res) => {
		if (!req.body.desc.trim()) {
			res.status(400).send('"desc" é um campo obrigatório')
		} else {
			req.body.userId = req.user.id

			app.db(TABLE_NAME)
				.insert(req.body) // Como os nomes sao identicos o objeto pode ser passado tranquilamente
				.then(_ => res.status(204).send())
				.catch(err => res.status(400).json(err))
		}
	}

	const remove = (req, res) => {
		app.db(TABLE_NAME)
			.where({ id: req.params.id, userId: req.user.id })
			.del()
			.then(numberRowsDeleted => {
				if (numberRowsDeleted > 0) {
					res.status(204).send()
				} else {
					const msg = `Não foi encontrada task com o id ${req.params.id}`
					res.status(400).send(msg)
				}
			})
			.catch(err => res.status(400).json(err))
	}

	const updateTaskDoneAt = (req, res, doneAt) => {
		app.db(TABLE_NAME)
			.where({ id: req.params.id, userId: req.user.id })
			.update({ doneAt })
			.then(_ => res.status(204).send())
			.catch(err => res.status(400).json(err))
	}

	const toggleTask = (req, res) => {
		app.db(TABLE_NAME)
			.where({ id: req.params.id, userId: req.user.id })
			.first()
			.then(task => {
				if (!task) {
					const msg = `Task não encontrada para o id ${req.params.id}`
					res.status(400).send(msg)
				} else {
					const doneAt = task.doneAt ? null : new Date()
					updateTaskDoneAt(req, res, doneAt)
				}
			})
			.catch(err => res.status(400).json(err))
	}

	return { getTasks, save, remove, toggleTask }
}
