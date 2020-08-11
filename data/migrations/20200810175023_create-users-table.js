
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
      tbl.increments()
      tbl.text('username')
          .unique()
          .notNullable()
      tbl.text('password')
          .notNullable()
    })
  };
  
  exports.down = function(knex) {
    knex.schema.dropTableIfExists('users')
  };
  
