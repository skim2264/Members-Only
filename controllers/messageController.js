const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async(req, res, next) => {
  const messages = await Message.find({}).populate("author").exec();
  res.render("index", {
    title: "Welcome to the Clubhouse",
    messages: messages
  })
});

exports.make_message_get = asyncHandler(async(req, res, next) => {
  res.render("message-form", {
    title: "Create a new Message"
  })
});

exports.make_message_post = [
  body("msg_title")
    .trim()
    .notEmpty()
    .withMessage("Please enter a title."),
  body("msg_text")
    .trim()
    .notEmpty()
    .withMessage("Please enter a message."),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.msg_title,
      text_message: req.body.msg_text,
      timestamp: new Date(),
      author: res.locals.currentUser
    })

    if(!errors.isEmpty()) {
      res.render("message-form", {
        title: "Create a new Message",
        message: message,
        errors: errors.array()
      })
    } else {
      await message.save();
      res.redirect("/");
    }
  })  
]