const UserModel = require('../models/user-model');
const bcrypt = require("bcrypt")
const validator = require('validator');

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @return {Promise<any>}
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("User not exist!");
    }

    if (!await bcrypt.compare(password, user.password)) {
      console.log("---------> Login Successful")
      res.status(400).json({ message: "Password incorrect!" })
    }
    return user
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @return {Promise<any>}
 */
async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({});
    return users;
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}


/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @return {Promise<any>}
 */
async function createUser(req, res) {
  try {
    const oldUser = await UserModel.findOne({
      $or: [
        { email: req.body.email },
        { name: req.body.name }
      ]
    });

    if (oldUser && oldUser.email == req.body.email) {
      throw new Error('User With This Email Already Exist')
    } else if (oldUser && oldUser.name == req.body.name) {
      throw new Error("User With This Name Already Exist!");
    } else if (!validator.isEmail(req.body.email)) {
      throw new Error("Please Enter Valid Email!");
    }

    const user = new UserModel({
      name: req.body.name,
      email: req.body.email
    });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    return await user.save();
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  login,
  getAllUsers,
  createUser
};