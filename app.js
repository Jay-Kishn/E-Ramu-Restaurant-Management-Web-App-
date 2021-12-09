require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({    
    name : String ,
    email: {
        type :String,
        required : true
    },
    occupation: String,
    resName : String, 
    resLoc  : String,
    password :{
        type :String,
        required : true
    }
});

const empSchema = new mongoose.Schema({   
    name : String ,
    EmpID:String,
    Designation: String,
    Date : String, 
    Salary : String
});



userSchema.plugin(encrypt,{secret : process.env.SECRET ,encryptedFields: ['password'] });


const User = new mongoose.model("User",userSchema);
const Emp = new mongoose.model("Emp",empSchema);


app.get("/",function(req,res){
    res.render("index");
 });

 app.get("/index",function(req,res){
    res.render("index");
 });

app.get("/Login",function(req,res){
   res.render("Login");
});


app.get("/Sign_up",function(req,res){
    res.render("Sign_up");
});

app.get("/services",function(req,res){
    res.render("Login");
});

           
app.get("/staff_management",function(req,res){
    res.render("staff_management");
});

app.get("/staff_management_view_employee_details", function (req, res) {
    console.log("staff management view has loaded");
    Emp.find(function (err, foundItems) {
        if(err){
            console.log(err);
        }else{
        res.render("staff_management_view_employee_details", {Entry: foundItems });
        }
    })
  });


app.get("/staff_management_alter",function(req,res){
    res.render("staff_management_alter");
});

app.post("staff_management_view_employee_details",function(req,res){
     console.log(req.body);
 
});



app.post("/staff_management_alter",function(req,res){
    console.log(req.body);
    const newEmp = new Emp({
        name :  req.body.name,
        EmpID: req.body.EmpID,
        Designation : req.body.Desig,
        Date:  req.body.Date,
        Salary: req.body.Salary
       });
   
       newEmp.save(function(err){
           if(err){
               console.log(err);
               res.write("<h1>An error occurred while submitting the form :/</h1>");
               res.write("<h2>Try filling the form once again</h2>")
           }else{
               res.redirect("staff_management_view_employee_details");    //Add option for menu and other facilities instead of staff management
           }
       }); 
});

app.post("/Sign_up",function(req,res){
    const newUser = new User({
     name :  req.body.Name,
     email: req.body.email,
     occupation : req.body.occupation,
     resName : req.body.resName,
     resLoc:  req.body.resLoc,
     password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
            res.write("<h1>An error occurred while submitting the form :/</h1>");
            res.write("<h2>Try filling the form once again</h2>")
        }else{
            res.render("services");    //Add option for menu and other facilities instead of staff management
        }
    }); 
    
});




app.post("/Login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
     
 
    User.findOne({email : email}, function(err, foundUser){
        if(err){
            console.log(err);
            res.write("<h1>Check the login credentials again :/</h1>");
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("services");    
                }
            }
        }
    })

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
  


//Last update : Working on the alter employee name table