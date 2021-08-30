require('dotenv').config();
const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");



const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html");

});

app.post("/",function(req,res){
    
    
    const city=req.body.cityname;

    const apiKey=process.env.API_KEY;

    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+apiKey;
    https.get(url,function(response){
        if(response.statusCode!==200)
        {
            res.render("failure");
        }
        else{
            response.on("data",function(data){

                const weatherData=JSON.parse(data);
        
                const description= weatherData.weather[0].description;
                const temp= weatherData.main.temp;
                const icon= weatherData.weather[0].icon;
                const iconImg=" http://openweathermap.org/img/wn/"+icon+"@2x.png";
                const cityName=weatherData.name;
                const country=weatherData.sys.country;
                const feelsLike=weatherData.main.feels_like;
                
                res.render("result",
                {description: description,
                    cityName: cityName,
                    temp: temp,
                    feelsLike: feelsLike,
                    country: country,
                    iconImg: iconImg,
                });
            });
        }
        
    });

});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.post("/more",function(req,res){
    res.redirect("/");
});



const PORT=process.env.PORT || "3000"
app.listen(PORT,function(){
    console.log("server running");
});