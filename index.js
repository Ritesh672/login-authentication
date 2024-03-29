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
  try {
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if the username already exists in the database
    const userExists = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    
    if (userExists.rows.length > 0) {
      // Username already exists, send an error response
      res.render("register.ejs", { msg : "Username already exists. Please choose a different username"});
    } else {
      // Username doesn't exist, proceed with registration
      const insertdata = await db.query("INSERT INTO users (username, password) VALUES ($1, $2);", [username, password]);
      res.render("home.ejs", { msg: "Login with id and password to see the secrets" });
    }
  } catch (err) {
    // Handle any errors
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT password FROM users WHERE username = $1;", [username]);

    // Check if any rows were returned by the query
    if (result.rows.length > 0) {
      const storedPassword = result.rows[0].password;

      // Compare the stored password with the provided password
      if (password === storedPassword) {
        // Passwords match, render secrets page
        res.render("secrets.ejs");
      } else {
        // Passwords do not match, render login page with error message
        res.render("login.ejs", { msg: "Wrong username or password" });
      }
    } else {
      // Username not found in the database, render login page with error message
      res.render("login.ejs", { msg: "Wrong username or password" });
    }
  } catch (err) {
    // Handle any errors
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
