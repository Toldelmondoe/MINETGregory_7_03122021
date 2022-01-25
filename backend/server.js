const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require('helmet');

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

// Sécurisation des headers
app.use(helmet());

var corsOptions = {
  origin: "http://localhost:8080"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended : false }));

// database
const db = require("./models");
const User = db.users;
const Role = db.roles;

var bcrypt = require("bcrypt");

// db.sequelize.sync();
db.sequelize.sync().then(() => {
  initial();
});

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to groupomania." });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.findOrCreate({
    where: {
      id: 1, 
    },
    defaults: {
      id: 1,
      name: "user",
    },
  });

  Role.findOrCreate({
    where: {
      id: 2,
    },
    defaults: {
      id: 2,
      name: "moderator",
    },
  });

  Role.findOrCreate({
    where: {
      id:3,
    },
    defaults: {
      id: 3,
      name: "admin",
      isAdmin: 1
    },
  });

  User.findOrCreate({
    where: {username: "user" },
    defaults: {
      username: "user",
      email: "user@gmail.com",
      password: bcrypt.hashSync("user", 5),
    }
  })
  .then((users) => {
    users[0].setRoles([1]).then(() => {
      ({ message: "user successfully created !" });
    });
  })
  .catch((err) => {
    ({ message: err.message});
  });


  User.findOrCreate({
    where: {username: "moderator" },
    defaults: {
      username: "moderator",
      email: "moderator@gmail.com",
      password: bcrypt.hashSync("moderator", 5),
    }
  })
  .then((users) => {
    users[0].setRoles([2]).then(() => {
      ({ message: "moderator successfully created !" });
    });
  })
  .catch((err) => {
    ({ message: err.message});
  });

  User.findOrCreate({
    where: {username: "admin" },
    defaults: {
      username: "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin", 5),
    }
  })
  .then((users) => {
    users[0].setRoles([3]).then(() => {
      ({ message: "admin successfully created !" });
    });
  })
  .catch((err) => {
    ({ message: err.message });
  });
};

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;