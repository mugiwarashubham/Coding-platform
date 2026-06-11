const express = require('express');
const adminMiddleware=require("../middleware/adminmiddleware");
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo}=require("../controllers/videosection")

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:videoId",adminMiddleware,deleteVideo);

module.exports = videoRouter;