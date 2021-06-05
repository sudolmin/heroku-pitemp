var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
        console.error(err.message)
        throw err
    } else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE temp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp text, 
            temparature text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO temp (timestamp, temparature) VALUES (?,?)'
                db.run(insert, ["01:23","43.5"])
                db.run(insert, ["01:24","43.7"])
            }
        });  
    }
});

module.exports = db