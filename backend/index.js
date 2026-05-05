const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const route = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes")

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", route);
app.use("/api/users" , userRoutes);
app.use("/api/posts",   postRoutes);
app.use("/api/comments" , commentRoutes);
app.use("/api/notifications", notificationRoutes);  



app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));