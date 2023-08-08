const UserModel = require('../models/user-model');
const bcrypt = require("bcrypt")


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
      // res.send({ message: "User not exist!" })
      throw new Error("User not exist!");
    }

    if (await bcrypt.compare(password, user.password)) {
      console.log("---------> Login Successful")
      return user
    } else {
      console.log("---------> Password Incorrect")
      res.status(400).json({ message: "Password incorrect!" })
    }
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
    const oldUser = await UserModel.findOne({ email: req.body.email });

    if (oldUser) {
      res.status(400).json({ message: 'User Already Exist' })
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