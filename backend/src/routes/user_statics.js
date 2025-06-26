const express = require('express');
const statsRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {getstats,getUserSubmissions}=require('../controllers/statics');

statsRouter.get('/stats',userMiddleware,getstats);

statsRouter.get('/allsubmissions',userMiddleware,getUserSubmissions);

module.exports=statsRouter;