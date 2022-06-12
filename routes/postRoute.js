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

  // for (let i = 0; i < arr.length; i++) {
    // let satnice2 = Object.values(arr[i]);
    //  console.log(satnice2)
    // console.log(Number(satnice2[0][0]),Number(satnice2[0][1])+1)
    // console.log(`from: ${satnice2[0]} ,  to: ${Number(satnice2[0][0])}${Number(satnice2[0][1])+1}:00`)
    // if (satnice2[0] == satnica) {
    //    zauzeto=true
    //  availability=scheduler.getAvailability({
    //     from: date,
    //     to: `${date.getFullYear()}-${date.getMonth() + 1}-${ date.getDate() + 1}`,
    //     duration: 60,
    //     interval: 60,
    //     schedule: {
    //       weekdays: {
    //         from: "09:00",
    //         to: "21:00",
    //         unavailability: [
    //           //`${Number(satnice2[0][0])}${Number(satnice2[0][1])+1}:00`
    //           { from: `${satnice2[0]}`, to: check() },
    //         ],
    //       },
    //     },
    //   });
  // function check(){
  //   if(Number(satnice2[0][0]==1)){
  //     return '10:00'
  //   }
  //   else if(Number(satnice2[0][1])+1==10){
  //     return '20:00'
  //   }
  //   else if(Number(satnice2[0][0]==2)){
  //     return '21:00'
  //   }
  // }
  // let final = converted.toLocaleDateString();
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