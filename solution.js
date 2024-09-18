import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import db from './databaseconnection.js';

const app = express();
app.use(cors());
const port = 3000;


app.use(bodyParser.json()); 

app.get('/',(req, res) => {
  res.send("welcome to jokes.api")
});

app.get("/random", (req, res) => {
  db.query('SELECT * FROM JOKES ORDER BY RAND() LIMIT 1',(err,result)=>{
    if(err){
      res.send(err);
      return;
    }
    res.json(result[0]);
  })
  
});

app.get("/getalljokes",(req, res) => {
  db.query('SELECT * FROM JOKES ',(err,result)=>{
    if(err){
      res.send(err);
      return;
    }
    res.json(result);
  })
})

//Get a specific joke
app.get("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if(id>100 || id<0){
    res.send("The id is not in the range");
    return;
  }
  const query = "SELECT * FROM JOKES WHERE idjokes = ?";
  db.query(query,[id],(err,result)=>{
    if(err){
      res.send(err)
    }
    res.json(result);
  })
});

//Filter jokes by type
app.get("/filter/:type", (req, res) => {
  const type = req.params.type;
  const query = "SELECT * FROM JOKES WHERE jokestype = ?";
  db.query(query,[type],(err,result)=>{
    if(err){
      res.send(err)
    }
    res.json(result);
  })
});

// Post a new joke
app.post("/jokes", (req, res) => {
  
  const jokeText = req.body.text;
  const jokeType = req.body.type;

  console.log(jokeText);
  console.log(jokeType);

  const query = "INSERT INTO jokes (jokestype,jokes) VALUES (?,?)";
  db.query(query,[jokeType,jokeText],(err,result)=>{
    if(err){
      return res.status(500).send(err);
    }
    res.json("Joke succesfully added");
  });
});



//Patch a joke
app.patch("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const jokestype = req.body.jokeType;
  const jokestext = req.body.jokeText;

  console.log(id+"->"+jokestype+"->"+jokestext);

  const checkQuery = "SELECT EXISTS(SELECT 1 FROM jokes WHERE idjokes = ?) AS jokeExists";
  db.query(checkQuery, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log(result[0].jokeExists);
    if (result[0].jokeExists==0) {
      return res.status(404).json("The given ID is invalid");
    }

    
    const updateQuery = `
      UPDATE jokes
      SET jokes = ?, jokestype = ?
      WHERE idjokes = ?;
    `;

    db.query(updateQuery, [jokestext, jokestype, id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json("Joke ID not found");
      }
      res.status(200).json(`Joke with ID: ${id} is successfully updated`);
    });
  });
});


app.delete("/deljokes/:id", (req, res) => {
  const id = parseInt(req.params.id,10);
  const checkQuery = "SELECT EXISTS(SELECT 1 FROM jokes WHERE idjokes = ?) AS jokeExists";
  db.query(checkQuery, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log(result[0].jokeExists);
    if (result[0].jokeExists==0) {
      return res.status(404).json("The given ID is invalid");
    }

    const query1 = "delete from jokes where idjokes=?"

    db.query(query1,[id],(err,result)=>{
      if(err){
        return res.sendStatus(500).send(err);
      }
      if (result.affectedRows === 0){
        res.sendStatus(404).json("The id is invalid");
      }
      res.status(200).json(`Joke with ID: ${id} is successfully deleted`);
    })
  });
});



app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

