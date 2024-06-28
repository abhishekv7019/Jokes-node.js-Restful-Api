import express from "express";
import bodyParser from "body-parser";
import db from './databaseconnection.js';

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));

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
  const newJoke = {
    id: jokes.length + 1,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };
  jokes.push(newJoke);
  console.log(jokes.slice(-1));
  res.json(newJoke);
});

//Put a joke
app.put("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const replacementJoke = {
    id: id,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };

  const searchIndex = jokes.findIndex((joke) => joke.id === id);

  jokes[searchIndex] = replacementJoke;
  // console.log(jokes);
  res.json(replacementJoke);
});

//Patch a joke
app.patch("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingJoke = jokes.find((joke) => joke.id === id);
  const replacementJoke = {
    id: id,
    jokeText: req.body.text || existingJoke.jokeText,
    jokeType: req.body.type || existingJoke.jokeType,
  };
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  jokes[searchIndex] = replacementJoke;
  console.log(jokes[searchIndex]);
  res.json(replacementJoke);
});

//DELETE Specific joke
//Optional Edge Case Mangement: Can you think of a situation where we might have an issue deleting
//a specific joke out of the array? Can you think of a solution?
app.delete("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  if (searchIndex > -1) {
    jokes.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res
      .status(404)
      .json({ error: `Joke with id: ${id} not found. No jokes were deleted.` });
  }
});

//DELETE All jokes
app.delete("/all", (req, res) => {
  const userKey = req.query.key;
  if (userKey === masterKey) {
    jokes = [];
    res.sendStatus(200);
  } else {
    res
      .status(404)
      .json({ error: `You are not authorised to perform this action.` });
  }
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

