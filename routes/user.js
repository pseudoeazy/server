const router = require("express").Router();
const userController = require("./../controllers/user");
const auth = require("./../middlewares/auth");

router.get("/", auth.isLoggedIn, userController.listUsers);
router
  .route("/:userId")
  .get(auth.isLoggedIn, userController.userByID)
  .patch(auth.isLoggedIn, userController.updateUser)
  .delete(auth.isLoggedIn, userController.removeUser);

router.post("/register", userController.registerUser);

module.exports = router;
