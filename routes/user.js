const router = require("express").Router();
const userController = require("./../controllers/user");
const authController = require("./../controllers/auth");

router.get("/", authController.authenticate, userController.listUsers);
router
  .route("/:userId")
  .get(authController.authenticate, userController.userByID)
  .patch(
    authController.authenticate,
    authController.hasAuthorization,
    userController.updateUser
  )
  .delete(
    authController.authenticate,
    authController.hasAuthorization,
    userController.removeUser
  );

router.post("/register", userController.register);

module.exports = router;
