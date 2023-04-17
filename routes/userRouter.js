const userRouter = require("express").Router();
const { getUsers } = require("../controllers/users");

userRouter.get("/", getUsers);

module.exports = userRouter;
