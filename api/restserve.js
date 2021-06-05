// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MAXIMUM_ENTRIES = 100;

// Server port
var HTTP_PORT = 8000 
app.set('domain', '{rest_api_ip}')
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// get data
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/api/temp", (req, res, next) => {
    var sql = "select * from temp"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "headers": {"Access-Control-Allow-Origin": "*"},
            "message":"success",
            "data":rows,
        })
        console.log("Data Requested");
    });
});

// post temp data

app.post("/api/temp/", (req, res, next) => {
    var errors=[]

    var data = {
        time: req.body.time,
        temp: req.body.temp
    }
    var sql ='INSERT INTO temp (timestamp, temparature) VALUES (?,?)'
    var params =[data.time, data.temp]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })

        countRows()

        const msg=`{
Response: ${res.statusCode},
"data": ${JSON.stringify(data)}
}`
        console.log(msg)
    });
})

function countRows() {
    var countSQL="SELECT count(id) FROM temp"
    var params = []
    db.all(countSQL, params, (err, count) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        count = count[0]['count(id)'];
        if(count > MAXIMUM_ENTRIES){
            const deRows=count - MAXIMUM_ENTRIES
            var deleteSQL = `Delete from temp where rowid IN (Select rowid from temp limit ${deRows});`
            console.log(count);
            console.log(deRows);
            db.all(deleteSQL, params, (err, rows) => {
                if (err) {
                    res.status(400).json({"error":err.message});
                    return;
                }
                console.log(`Deleted Successful: ${deRows} extra rows`);
                return
            });
        }
        return;
    });
}

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});