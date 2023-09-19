const express=require("express");
const dotenv =require("dotenv");
const mongoose=require( "mongoose");
const multer =require("multer");
var path = require('path');

const ImageModel =require ("./image.model")

const app = express();
dotenv.config();

const connect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongoDB");
    }catch(error){
        throw error;
    }
}

const Storage = multer.diskStorage({
    destination:"uploads",
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname }_${Date.now()}${path.extname(file.originalname)}`)
        //callback(null, file.originalname)
        //  rand = Date.now() + path.extname(file.originalname);
        // callback(null, file.fieldname + '-' + rand);
    }
}
);  
const upload = multer({
    storage:Storage
}).single('testImage')


app.get("/",(req,res)=>{
    res.send("hello")
});

app.use('/testImage', express.static('uploads'));

//post api

app.use("/upload",(req,res)=>{
    upload(req,res,(err)=>{
        const url = req.protocol + '://' + req.get("host");
        if(err){
            console.log(err);
        }else{
            const newimage = ImageModel({
                name:req.body.name,
                image:url + '/testImage/' + req.file.filename
            })
            console.log(newimage);
            res.json({
                success:1,
                newimage: `http://localhost:8000/testImage/${req.file.filename}`
            })
            newimage.save()
            .then(()=>res.send('successfully upload'))
            .catch((err)=> console.log(err));
        }
    })
})

//Get request

app.get('/request', async function(req, res){

    try{
        const requests = await ImageModel.find({
            attributes: ['_id', 'name', 'image']
        })
         console.log(requests)
         res.json(requests);

    }catch (error) {
        console.log(error);
    }
})

app.listen(8000, function () {
    connect()
    console.log('Server listening on port 8000.');
});