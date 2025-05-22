const express = require('express')
const { route } = require('./user-router')
const authMiddleware = require('../middlewares/auth')
const fileModel = require('../models/files-models')
const user = require('../models/user-models')
const cloudinary = require('../config/cloudinary-config')
const axios = require('axios');
const router = express.Router()



router.get('/', (req, res) => {
  res.render('index');
});


router.get('/home',authMiddleware,async (req,res)=>{


    const userFiles = await fileModel.find({
        user:req.user.userid
        
    })
    console.log(userFiles);
    res.render('home',{
        files:userFiles
    })
})

router.get('/download/:id', authMiddleware, async (req, res) => {
  const fileId = req.params.id;
  const loggedInUser = req.user.userid;

  const file = await fileModel.findOne({
    _id: fileId,
    user: loggedInUser,
  });

  if (!file) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: file.path,
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
    res.setHeader('Content-Type', response.headers['content-type']);

    response.data.pipe(res);
  } catch (err) {
    console.error('Error streaming file from Cloudinary:', err.message);
    res.status(500).json({ message: 'Failed to download file' });
  }
});


module.exports = router