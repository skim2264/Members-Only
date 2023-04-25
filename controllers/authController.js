const User = require("../models/user");
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up Form"
  })
})

exports.sign_up_post = [
  body("first_name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("First name must be specified.")
    .isAlpha()
    .withMessage("First name has non-alpha characters."),
  body("last_name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Last name must be specified.")
    .isAlpha()
    .withMessage("Last name has non-alpha characters."),
  body("username")
    .trim()
    .isLength({min:6})
    .escape()
    .withMessage("Username must be at least 6 characters.")
    .custom(async (value, {req}) => {
      const userInDB = await User.find({"username": req.body.username})
      if (userInDB.length > 0) {
        throw new Error("Username already exists.");
      }
    }),
  body("password")
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0
      })
    .withMessage("Password must be at least 6 characters, and have at least 1 number."),
  body("conf_password").custom(async (value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords does not match!");
    }
  }),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, async(err, hashedPassword)=> {
      if(err) {return next(err)};
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword
      });
      if (!errors.isEmpty()) {
        res.render("sign-up-form", {
          title: "Sign Up Form",
          user: user,
          errors: errors.array()
        })
      } else {
        await user.save();
        res.redirect("/");
      }
    })
  })
];

exports.login_get = (req, res) => {
  res.render("login-form", {
    title: "Login"
  })
};

exports.login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
});

exports.logout_get = asyncHandler(async(req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
})