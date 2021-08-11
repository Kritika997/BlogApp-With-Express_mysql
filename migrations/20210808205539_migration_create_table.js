
exports.up = function(knex) {
    return knex.schema
    .createTable("userDetails",(table)=>{
        table.increments('id').primary();
        table.string('user_name',255).notNullable()
        table.string('user_email',255).notNullable()
        table.string('user_password',255).notNullable()
        table.unique('user_email')
    })
    .createTable('post',(table)=>{
        table.increments('id').primary();
        table.string('imange',255).notNullable();
        table.integer('like').notNullable();
        table.integer('Dislike').notNullable();
    })
    .createTable('postDetails',(table)=>{
        table.string('user_email',255).notNullable();
        table.string('imange',255).notNullable();
        table.string('like_or_dislike',255).notNullable();
    });
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('userDetails').dropTable('post').dropTable('postDetails')
  
};
