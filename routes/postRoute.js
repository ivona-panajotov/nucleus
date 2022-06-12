const express=require('express')
const mysql = require("mysql");
const router=express.Router()

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  passsword: "root",
  database: "nucleus",
});
let date = new Date();
let dateToday = date.toLocaleDateString();
// console.log(
//   `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`
// );
let raspored=['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']

// const getIndex=require('../controllers/postController')
router.get("/zakazi", (req, res) => {
let sql = "SELECT satnica,datum,zauzeto FROM ucenici";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render('zakazi',{calendar:raspored})
  // res.render("zakazi", { calendar: availability,result:JSON.parse(JSON.stringify(result)) });
  // console.log(availability, ' coming from /zakazi  GET')
  });
});
router.get('/zakazi/cas/:date',(req,res)=>{
  
  let datum=req.params.date
  let regexDatum  = datum.replace(/\//g,'-');
  // console.log(result)

  let sql = `SELECT datum,satnica FROM ucenici WHERE datum='${regexDatum}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result+' from sql');
  res.render("selekcija", {regexDatum:regexDatum,result:result,calendar: raspored});
  });

})

router.post("/zakazi/cas", (req, res) => {
  const ime = req.body.ime;
  const telefon = req.body.telefon;
  const skola = req.body.toggle_option;
  const profesor = req.body.profesor;
  const predmet = req.body.predmet;
  // const datum = req.body.datum;
  const satnica = req.body.satnica;
  const datum2=req.body.datum
  console.log(req.body, ' coming from /zakazi/cas POST')
  // let converted = new Date(datum);

  // let arr = Object.values(availability)[0];
  let zauzeto=false
  console.log(satnica)
  raspored.forEach(e=>{
    if(e==satnica){
      zauzeto=true
  let sql = `INSERT INTO ucenici(ime,telefon,skola,predmet,profesor,datum,satnica,zauzeto) VALUES ('${ime}','${telefon}','${skola}','${predmet}','${profesor}','${datum2}','${satnica}','${zauzeto}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  // console.log(zauzeto)
    // }
  // }
  res.redirect('/')
    }
  })

});

router.delete('/zakazi/:id',(req,res)=>{
    const id=req.params.id
    Post.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/posts'})
    })
    .catch(err=>console.log(err))
})

module.exports=router