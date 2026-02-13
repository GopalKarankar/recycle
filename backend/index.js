const express = require("express");
const cors = require("cors");
const connectDB = require("./models/db");

// const { verify } = require("./controllers/auth");
// const { getApi } = require("./routes/getapi");
const app = express();

// middleware
app.use(express.json());
app.use(cors());


// view evaluation data
app.get("/api/evaluation", async (req, res) => {

    const conn = await connectDB();

    const data = await conn.execute("SELECT * FROM recycle.evaluations");

    res.json(data);

});

// Upload evaluation data
app.post("/api/uploadEvaluation", async (req, res) => {
  try {
    const data = await req.body;

    const conn = await connectDB();

    await conn.execute("TRUNCATE recycle.evaluations");

    await data.map(async (val) => {

      const cs = Math.floor(Math.random()*10)+1;
      const ss = Math.floor(Math.random()*10)+1;
      const tms = Math.floor(Math.random()*10)+1;
      const total = Math.floor((cs+ss+tms)/3);


      const sql = `INSERT INTO recycle.evaluations (candidate_id, crisis_score, sustainability_score, team_motivation_score, total_score)
      VALUES (?, ?, ?, ?, ?)`;

      const [result] = await conn.execute(sql, [val.id, cs, ss, tms, total]);

    });

    res.send({ data });

  } catch (error) {
    console.log(error);
  }
});


app.get("/api/uploadRanking",async (req, res)=>{

  try {

    // console.log("Ranking");
    // console.log(req.body);

    const conn = await connectDB();

    const sql = "SELECT candidate_id,  total_score, DENSE_RANK() OVER (ORDER BY total_score DESC) AS rank_position FROM evaluations";

    const [data] = await conn.execute(sql);

    res.json(data);

  } catch (error) {
    console.log(error);
  }

});



// view evaluation data
app.get("/api/loadLeaderboard", async (req, res) => {

    const conn = await connectDB();

    const data = await conn.execute("SELECT candidate_id,  total_score, DENSE_RANK() OVER (ORDER BY total_score DESC) AS rank_position FROM evaluations ORDER BY rank_position ASC LIMIT 10");

    res.json(data);

});


// server listen
app.listen(3078, () => {
  console.log("Server running on port 3078");
});
