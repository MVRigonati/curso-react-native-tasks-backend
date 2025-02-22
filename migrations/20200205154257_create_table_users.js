// Knex é parecido com um liquibase
exports.up = function (knex) {
	return knex.schema.createTable('users', table => {
		table.increments('id').primary()
		table.string('name').notNull()
		table.string('email').notNull().unique()
		table.string('password').notNull()
	})
};

// Tudo que é feito em "up" é desfeito em "down"
exports.down = function (knex) {
	return knex.schema.dropTable('users')
};
