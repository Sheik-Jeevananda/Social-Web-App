const router = require("express").Router();

const {register , Login, getMe } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register" , register);
router.post("/login" , Login);
router.get("/me", authMiddleware, getMe);


module.exports = router;
