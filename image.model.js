const mongoose =require ("mongoose");

const ImageSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    image:{
        type: String,
    }
})

module.exports = ImageModel = mongoose.model('imageModel',ImageSchema)
