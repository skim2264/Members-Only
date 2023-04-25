const User = require("../models/user");
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

exports.make_member_get = asyncHandler(async (req, res, next) => {
  res.render("member-form", {
    title: "Become a Member"
  })
})

exports.make_member_post = [
  body("member_code")
    .trim()
    .notEmpty()
    .withMessage("Please enter a code.")
    .equals("secret")
    .withMessage("Invalid code. Please try again."),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const userId = res.locals.currentUser._id;

    if (!errors.isEmpty()) {
      res.render("member-form", {
        title: "Become a Member",
        errors: errors.array()
      })
    } else {
      await User.findByIdAndUpdate(userId, {isMember: true});
      res.redirect("/");
    }
  })
];

exports.make_admin_get = asyncHandler(async (req, res, next) => {
  res.render("admin-form", {
    title: "Become an Admin"
  })
})

exports.make_admin_post = [
  body("admin_code")
    .trim()
    .notEmpty()
    .withMessage("Please enter a code.")
    .equals("admin")
    .withMessage("Invalid code. Please try again."),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const userId = res.locals.currentUser._id;

    if (!errors.isEmpty()) {
      res.render("admin-form", {
        title: "Become an Admin",
        errors: errors.array()
      })
    } else {
      await User.findByIdAndUpdate(userId, {isAdmin: true});
      res.redirect("/");
    }
  })
]