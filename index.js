const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const ejs = require("ejs");
const mysql = require("mysql");
const postRoutes = require("./routes/postRoute");
let { Scheduler } = require("@ssense/sscheduler");
const scheduler = new Scheduler();
const app = express();
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.set("view engine", "ejs");
app.get("/", (req, res) => res.redirect("index"));

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  passsword: "root",
  database: "mydb",
});

let date = new Date();
let dateToday = date.toLocaleDateString();
// console.log(
//   `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`
// );
 let availability = scheduler.getAvailability({
        from: date,
        to: `${date.getFullYear()}-${date.getMonth() + 1}-${
          date.getDate() + 1
        }`,
        duration: 60,
        interval: 60,
        schedule: {
          weekdays: {
            from: "09:00",
            to: "21:00",
          }
        },
      });
app.get("/cenovnik", (req, res) => {
  res.render("cenovnik");
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/casovi", (req, res) => {
  let sql = "SELECT * FROM ucenici";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("casovi", { result: result });
  });
});
app.get('/onama',(req,res)=>{res.render('onama')})
app.get('/kontakt',(req,res)=>{res.render('kontakt')})

app.get("/casovi/:id", (req, res) => {
  let sql = `DELETE FROM ucenici WHERE id=${req.params.id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/casovi");
  });
});
app.use(postRoutes);
app.listen(3000, () => {
  console.log("server listening at port 3000");
});
