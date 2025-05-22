const mongoose =  require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique:true,
        trim:true,
        minlength : [3,'username must be atleast length  3 character long'],
        lowercase:true,
        required:true

    },
    email: {

        type:String,
        unique:true,
       
        required:true,
        minlength:[13,'email must be atleast length of 13 characters long'],
        lowercase:true
    },
     password: {

        type:String,
        trim:true,
        required:true,
        minlength:[5,'password must be atleast length of 5 characters long'],
   
    }
}) 


const user = mongoose.model('user',userSchema)

module.exports = user