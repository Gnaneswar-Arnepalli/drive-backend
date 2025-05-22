const cloudinary = require('../config/cloudinary-config'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require('multer');
const path = require('path');

 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'some-folder-name',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => path.parse(file.originalname).name + '-' + Date.now(),
  },
});
 
const parser = multer({ storage: storage });
 
module.exports= parser