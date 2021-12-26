const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const helmet = require('helmet');
const path = require("path");
const auth = require("./middleware/auth");
const app = express();

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const messageRoutes = require("./routes/message")
const commentRoutes = require("./routes/comment")

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());

const { user } = require("./models/user");
const dataBase = require("./models");
const Role = db.roles;
const User = db.users;
var bcrypt = require("bcrypt");

dataBase.sequelize.sync().then(() => {
  begin();
});

function begin() {
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
      name: "admin",
    },
  });

  User.findOrCreate({
    where: {userName:"admin", },
    defaults: {
      userName: "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin", 4),
    }
  }).then((users) => {
      users[0].setRoles([2]).then(() => {
          ({
            message: "L'administrateur a été enregistré avec succès !",
          });
        });
    })
    .catch((err) => {
      ({ message: err.message });
    });
};

require("./routes/auth")(app);
require("./routes/comment")(app);
require("./routes/message")(app);
require("./routes/user")(app);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);
app.use("/api/users", auth, userRoutes);
app.use("/api/messages", auth, messageRoutes);
app.use("/api/comments", auth, commentRoutes);

module.exports = app;



