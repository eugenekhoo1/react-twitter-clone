const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/server");
const corsOptions = require("./config/corsOption");
const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const refreshTokenRoutes = require("./routes/refreshRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const homeRoutes = require("./routes/homeRoutes");
const tweetRoutes = require("./routes/api/tweetRoutes");
const interactionRoutes = require("./routes/api/interactionRoutes");
const viewRoutes = require("./routes/api/viewRoutes");
const profileRoutes = require("./routes/api/profileRoutes");
const credentials = require("./middleware/credentials");

const { logger } = require("./middleware/logEvents");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const app = express();

////////////////
// Middleware //
////////////////
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions)); // ports 3000, 5000, dev server
app.use(express.json()); // 'Content-type': 'application/json'
app.use(cookieParser());

////////////
// Routes //
////////////

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/refresh", refreshTokenRoutes);
app.use("/view", viewRoutes);

//////////////////////
// Protected Routes //
//////////////////////

app.use(verifyJWT);
app.use("/home", homeRoutes);
app.use("/post", tweetRoutes);
app.use("/profile", profileRoutes);
app.use("/", interactionRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
