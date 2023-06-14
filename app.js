const express = require("express");
const bodyParser = require("body-parser");
const date = require (__dirname  + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash")
require('dotenv').config()



const uri = "mongodb+srv://"+ process.env.USERNAME + ":" + process.env.PASSWORD + "@cluster0.hmpelov.mongodb.net/todolistDB";




//console.log(date.getDate());

app= express();

app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(uri);

const itemsSchema = new mongoose.Schema ({
    name: String
})

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to your todolist!"
});

const item2 = new Item ({
    name: "Hit the + button to add a new item."
});

const item3 = new Item ({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

//create another schema for storing different lists
const listsSchema = new mongoose.Schema ({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listsSchema);

app.get("/", function(req,res){
    
    let day = date.getDate(); 
    
    Item.find({}).then(function (items) {
        if (items.length == 0) 
        {
         Item.insertMany(defaultItems).then(function (items) {
            console.log("Successfully saved default items to DB.");
             }).catch(function (err) {
            console.log(err);
            }); 
          res. redirect("/");
        } else 
        {
            res.render("list", {listTitle: day, newListItem: items});

        }

    }).catch(function (err) {
        console.log(err);
    });
    
   
});

app.post("/", function(req, res) {
    //console.log(req.body);
    var itemName = req.body.newItem;
    var listName = req.body.list;

    const newItem = new Item ({ 
        name: itemName
    });
    
    // use button name to check value, because title is "Work List", it will catch the first word: Work (must be capital)
    if ( listName != date.getDate() )
     {
        List.findOne({ name: listName}).then((foundList)=> {
            foundList.items.push(newItem);
            foundList.save().then( ()=> res.redirect('/' + listName));
            
        });
        
     } else {
       
        newItem.save().then( ()=> res.redirect("/"));
     }
    
})

app.post("/delete", function(req,res) {
    // console.log(req.body.checkbox);
    const deleteId = req.body.checkbox;
    const listName = req.body.listName;

    if ( listName == date.getDate() ) {
        Item.findByIdAndRemove(deleteId).then(function (items) {
            console.log("Successfully delete one item from DB.");
            res.redirect("/");
             }).catch(function (err) {
            console.log(err);
            }); 

    } else {
       List.findOneAndUpdate({name: listName}, { $pull: { items: {_id: deleteId}}}).then( function (foundList) {
        res.redirect('/' + listName);
       }).catch(function (err) {
        console.log(err);
        }); 
    }
   
   
    
})

app.get("/:customListName", function(req,res){
    
    const customListName = _.upperFirst(req.params.customListName);

     List.findOne({ name: customListName}).then((foundList)=>{
        if (!foundList)
       {
           const list = new List({
               name: customListName,
               items: defaultItems
            });

            list.save().then( ()=> res.redirect('/' + customListName));
       } else 
       {
        res.render("list", {listTitle: foundList.name, newListItem: foundList.items});
       }
    }).catch((err)=>{
        console.log(err);
    });

    
    
})


app.listen(processs.env.PORT, function(){
    console.log("Server started on 3000");
})