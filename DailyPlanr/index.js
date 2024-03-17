import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";

//attach env variables to system variables
import { config } from "dotenv";
config(); 

const app = express();
const port = 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db=new pg.Client({
  user:process.env.USER,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.PASSWORD,
  port:process.env.DB_PORT
});

db.connect();



//Home Page
app.get("/",(req,res)=>{
  res.render("home.ejs");
});

//When user clicks on login button route to /login 
app.get("/login",(req,res)=>{
  res.render("login.ejs");
});

//When user click on logout button on their dashboard
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//When this /user route hits check authentication then show the user
app.get("/user", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      let items=[];
      const user = req.user; // Accessing the currently authenticated user info from req.user
      //const result = await db.query("SELECT * FROM items JOIN users ON items.user_id=$1 WHERE email=$2", [user.id,user.email]);
      const result = await db.query("SELECT * FROM items WHERE user_id=$1", [user.id]);
      items=result.rows;
      res.render("user.ejs", {
        listTitle: "Today",
        listItems: items,
      });
    } catch (err) {
      console.error("Error retrieving user data:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});



app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


app.get(
  "/auth/google/user",
  passport.authenticate("google", {
    successRedirect: "/user",
    failureRedirect: "/login",
  })
);



passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/user",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email) VALUES ($1)",
            [profile.email]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);



//CRUD OPERATIONS 
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const user = req.user; // Accessing the currently authenticated user info from req.user
  await db.query("INSERT INTO items (title,user_id) VALUES($1,$2)",[item,user.id]);
  res.redirect("/user");
});

app.post("/edit", async (req, res) => {
  try{
  const id=req.body.updatedItemId;
  const newTitle=req.body.updatedItemTitle;
  await db.query("UPDATE items SET title=$1 WHERE id=$2",[newTitle,id]);
  res.redirect("/user");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  try{
  const id=req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id=$1",[id]);
  res.redirect("/user");
  }
  catch(err){
    console.log(err);
  }
});



passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
