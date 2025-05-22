// routes/upload-route.js
const express = require('express');
const router = express.Router();
const parser = require('../models/upload');
const fileModel = require('../models/files-models')
const authMiddleware = require('../middlewares/auth')
router.post('/upload', authMiddleware,parser.single('file'), async (req, res) => {

    if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

   console.log("Decoded user from token:", req.user);
   const newFile = await fileModel.create({
    path:req.file.path,
    originalname:req.file.originalname,
    user: req.user.userid
    
   })
   

   res.json(newFile)
});









// router.post('/upload',parser.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   res.json({
//     message: 'File uploaded successfully',
//     url: req.file.path,       // this is Cloudinary URL
//     public_id: req.file.filename
//   });
// });


module.exports = router;

