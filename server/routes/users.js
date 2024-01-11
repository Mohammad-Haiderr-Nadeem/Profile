const express = require("express");
const { addData, showData } = require("../controllers/users");
const { uploadFile } = require("../middlewares/uploadFile");
const multer = require("multer");
const upload = multer({ dest: "../src/assets/images/" });

const router = express.Router();

router.post("/addDataFromForm", upload.single("image"), uploadFile, addData);
router.get("/showData/:id", showData);

module.exports = router;
