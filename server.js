const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connection to mongodb atlas
connectDB();
//Init middleware
app.use(express.json({ extended: false }));

//routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
