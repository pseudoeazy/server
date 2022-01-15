const router = require("express").Router();
const authController = require("./../controllers/auth");

router.post("/login", authController.login);
router.post("/signout/", authController.signout);

module.exports = router;
