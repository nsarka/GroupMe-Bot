
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  }
});

knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('users', function(t) {
      t.bigInteger('gid').primary();
      t.integer('gbp', 5);
    });
  }
});

function getUserGbp(userGid, callback) {
  knex.select('*')
    .from('users')
    .where({gid: userGid})
    .then(function(rows) {
      var gbp = "Big Chungus says... something is fucked";
      try {
        gbp = parseInt(rows[0]["gbp"]);
      }
      catch(err) {
        knex.insert([{gid: userGid, gbp: 5}]).into('users').then(function(insert_rows) {
	  //console.log(insert_rows);
	});

        gbp = 5;
      }
      finally {
	callback(gbp);
      }
    })
    .catch(function(error) { console.error(error); });
}

function setUserGbp(userGid, newGbp) {
  knex('users')
    .where('gid', '=', parseInt(userGid))
    .update({
      gbp: newGbp
    }).then((updatedRows) => {
      //updatedRows === [{id: 42, title: 'The Hitchhiker's Guide to the Galaxy'}]
      //console.log(updatedRows);
      return true;
    });
  return false;
};

exports.getUserGbp = getUserGbp;
exports.setUserGbp = setUserGbp;

