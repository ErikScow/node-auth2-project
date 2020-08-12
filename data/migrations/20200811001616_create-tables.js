
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
      tbl.increments()
      tbl.text('username')
          .unique()
          .notNullable()
      tbl.text('password')
          .notNullable()
      tbl.text('department')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
  };
  
