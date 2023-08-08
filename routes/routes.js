const express = require('express');
const router = express.Router()
const userService = require('../services/user-service');
const chatService = require('../services/chat-service');

module.exports = router;

//Login new user
router.post('/login', async (req, res) => {
  userService.login(req, res)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(400).json(err)
    });
})

//Create new user
router.post('/createUser', async (req, res) => {
  userService.createUser(req, res)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(400).json(err)
    });
})

//Get all users
router.get('/getAllUsers', (req, res) => {
  userService.getAllUsers(req, res)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(400).json(err)
    });
})

//get chat by sender and receiver id
router.get('/getChatHistory/:senderId/:receiverId', (req, res) => {
  chatService.getChatHistory(req, res)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(400).json(err)
    });
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
  res.send('Delete by ID API')
})