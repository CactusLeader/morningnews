var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

<<<<<<< HEAD
mongoose.connect('mongodb+srv://pokopano:DeveloperCoolJazzFest33!@cluster0.zdnv4.mongodb.net/morningnews?retryWrites=true&w=majority',
=======
mongoose.connect('mongodb+srv://mangotest:cecodemeprendlatete@cluster0.gj1m0.mongodb.net/morningnews?retryWrites=true&w=majority',
>>>>>>> d7cf80be415e3b0bf9cc15f2bafd5dbac01428b3
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose