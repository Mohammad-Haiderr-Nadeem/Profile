const express = require("express");
const { addData, showData, updateData } = require("../controllers/users");
const { uploadFile, updateFile } = require("../middlewares/uploadFile");
const multer = require("multer");
const upload = multer({ dest: "../src/assets/images/" });

const router = express.Router();

router.post("/addDataFromForm", upload.single("image"), uploadFile, addData);
router.get("/showData/:id", showData);
router.patch("/updateData/:id", upload.single("image"), updateFile, updateData);

module.exports = router;
