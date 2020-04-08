const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
global.appRoot = path.resolve(__dirname);

require('./Employee');

const app = express();

app.use(bodyParser.json());
app.use('/server/uploads', express.static('uploads'));

const Employee = mongoose.model("employee");


const mongoUri = "mongodb://localhost:27017/employeeapp";

mongoose.connect(mongoUri, { useNewUrlParser:true, useUnifiedTopology:true });

mongoose.connection.on("connected", () => {
    console.log("connected to mongo", mongoUri);
});

mongoose.connection.on("error", (err) => {
    console.log("error",err);
});

app.use(fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 } //2mB
}));

app.post('/upload', (req, res) => {
    if (req.files == {})
        return res.send('No file upload');
    const { image } = req.files;
    if (image.mimetype == 'image/jpeg' || image.mimetype == 'image/png'){
        filename = image.name;
        const uploadPath ='/uploads/' + Date.now() + '-' + filename.replace(/ /g, '-');;
        image.mv(appRoot + uploadPath, function(err){
            if(err){
                console.log("Error while upload file.", err);
                return res.send("Error while upload file.");
            }
        });
        console.log(`/server${uploadPath}`);
        res.send({ url: `/server${uploadPath}` });
    } else {
        console.log("File must be in jpeg or png format.");
        return res.send("File must be in jpeg or png format.");
    }
});

app.get('/', (req, res) => {
    Employee.find({})
    .then(data=>{
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    });
});


app.post('/send-data', (req, res) => {
     const employee = new Employee({
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         picture: req.body.picture,
         salary: req.body.salary,
         position: req.body.position,
     });
     employee.save()
     .then(data=>{
         console.log(data);
         res.send(data);
     }).catch(err=>{
         console.log(err);
     });
});

app.post('/delete',(req, res)=>{
    Employee.findByIdAndRemove(req.body.id)
    .then(data=>{
        console.log(data);
        res.send(data);
    })
    .catch(err=>{
        console.log(err);
    });
});

app.post('/update', (req,res) => {
    console.log(req.body)
    Employee.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        picture: req.body.picture,
        salary: req.body.salary,
        position: req.body.position,
    })
    .then(data=>{
        console.log(data);
        res.send(data);
    })
    .catch(err=>{
        console.log(err);
    });
});

app.listen(3000, ( )=> {
    console.log("server running", 3000);
});