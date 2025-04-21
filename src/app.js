const express=require("express")
const port= process.env.PORT || 3000
const app=express()
const hbs=require("hbs")
const path=require('path')
const views_path=path.join(__dirname,"../templates/views")
const body_parser=require("body-parser")
app.use(body_parser.json())
app.use(body_parser.urlencoded(extended=false))
const mongoose=require("mongoose")
require("./db/conn")
const register=require("./models/register")
app.set("view engine","hbs")
app.set("views",views_path)




app.listen(port,()=>{
    console.log(`Running in Port: ${port}`)
})

app.get("/index",(req,res)=>{
    res.render("index")
})

// app.post("/send",(req,res)=>{
//
// })

app.get("/data",(req,res)=>{
    res.send("I AM COMING FROM BACKEND !")
})

app.get("/geo",(req,res)=>{
    res.send("THIS IS A MINOR CLASS")
})


app.get("/bca",(req,res)=>{
    res.send("this is a full stack class")
})

app.post("/send",(req,res)=>{
    const { name, roll, event} = req.body;
    console.log(name)
    console.log(roll)

    const save_data=new register({name,roll,event})
    save_data.save().then(
        ()=>{
            console.log("Data Saved to DB !")
        }
    ).catch(
        (e)=>{
            console.log(`Error: ${e}`)
        }
    )
    res.send("Data send to backend !")
})


app.get("/display", async (req, res) => {
    try {
        const data = await register.find();
        const status = req.query.status; // Catch status from query
        res.render("display", { data, status });
    } catch (error) {
        console.error("❌ Failed to load data:", error);
        res.status(500).send("Error loading data.");
    }
});
app.post("/update",async(req,res)=>{
    const { name, roll,event,  id, btn, } = req.body;

    let status

    if(btn==="UPDATE"){
        const update=await register.updateOne({"_id":new mongoose.Types.ObjectId(id)},{$set:{name,roll,event}})
        status=1;
    }
    if(btn==="DELETE"){
        const del=await register.deleteOne({"_id":new mongoose.Types.ObjectId(id)})
        status=2
        console.log(status)
    }
    const data= await register.find()
    res.render("display",{data,status})
})