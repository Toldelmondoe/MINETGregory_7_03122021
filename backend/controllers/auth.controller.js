const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

/* Fonction d'enregistrement */
exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }) 
  .then(user => {
    user.setRoles([1]).then(() => {
      res.send({ message: "User registered successfully !" });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};
/* Fonction de connection */
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (!user) {
      return res.status(404).send({ message: "User not found !" });
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        token: null,
        message: "Invalid Password !"
      });
    }
    var accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        roles: authorities,
        token: accessToken
      });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};