import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "capstone",
  password: "Ritesh222@",
  port: 5432,
  
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {


  try{

    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);

    const insertdata = db.query("INSERT INTO users (username, password) VALUES ($1, $2);", [username, password]);

    res.render("home.ejs", {msg: "login with id and password to see the secrets"});
    
  }

  catch (err)
  {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;


  try{

    const result = await db.query("SELECT password FROM users WHERE username = $1;", [username]);
    console.log(result.rows[0].password);


    if (password == result.rows[0].password)
    {
      res.render("secrets.ejs");
    }
    else
    {
      res.render("login.ejs", {msg: "Wrong username or password"});

    }



  }
  catch (err){
    console.log(err);
  }

  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
