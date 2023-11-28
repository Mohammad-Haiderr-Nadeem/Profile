const express = require("express");
const { addData, verifyHashForge } = require("../controllers/users");
const { uploadFile }  = require('../middlewares/uploadFile');
const multer  = require('multer')
const upload = multer({ dest: '../uploads' });


const router = express.Router();

router.post("/addDataFromForm", upload.single('image'), uploadFile, addData);
router.post("/validateHashForge", verifyHashForge);

module.exports = router;
