import express from "express";
import cors from "cors"
import axios from "axios"
import { GoogleGenerativeAI }from "@google/generative-ai"
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:3000"
}))
app.use(bodyParser.json({ limit: '20mb' }));  // for large Base64 data
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

let pokemonSprites = [
    { name: "Pidgeot", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png" },
    { name: "Rattata", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png" },
    { name: "Ekans", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png" },
    { name: "Arbok", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png" },
    { name: "Jigglypuff", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png" },
    { name: "Zubat", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png" },
    { name: "Venonat", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png" },
    { name: "Diglett", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png" },
    { name: "Dugtrio", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/51.png" },
    { name: "Poliwhirl", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/53.png" },
];



const genAI = new GoogleGenerativeAI("AIzaSyBdrJMVA-cG86Dj3dJIskhB0DsCbo7CwFk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/getPokemonData", async (request, response) => {
    
    let img = request.body
    let validImg = Object.keys(img)[0]
    let base64 =  validImg.split(',')[1];
    //const base64Image = img.split(',')[1]; // Get only the Base64 part

    console.log(base64)
    response.send(base64)
    
    /*
    const imagePath = path.resolve("./charixzarfd.png");

    // Read the image as a base64-encoded string
    const imageData = fs.readFileSync(imagePath).toString("base64");

    console.log(imageData) 

  
    
    
    try {
        
        const imgChecker = await model.generateContent([
            {
                inlineData: {
                    data: base64,
                    mimeType: "image/png", // Ensure the correct MIME type (e.g., "image/png" for PNG images)
                },
            },
            "is this a pokemon? if yes return the name of the pokemon name in lowercase, if not pokemon return 'not pokemon'",
        ]);

        let isPokemon = imgChecker.response.text()

        console.log(isPokemon)

        if(isPokemon == "not pokemon") throw new Error("error")
    
        let pokemon = isPokemon
        let res = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemon);

        const result = await model.generateContent("give a a short and simple description like in pokedex, the pokemon is " + pokemon);

    
        let name = res.data.name
        let picture = res.data.sprites.other['official-artwork'].front_default
        let sprite = res.data.sprites.front_default
        let types = res.data.types.map((obj) => obj.type.name )
        let stats = res.data.stats.map((obj) => ({stateName : obj.stat.name, stat : obj.base_stat}))
        let height = (res.data.height / 10)
        let weight = res.data.weight 
        let description = result.response.text()
        
        pokemonSprites.push({
            name : name,
            sprite : sprite
        })
     
        let pokemonData = {
            name : name,
            picture : picture,
            sprite : sprite,
            height : height,
            weight : weight,
            types : types,
            stats : stats,
            description : description
        }
        
  
        response.send(pokemonData)

    } catch (err) {
        console.log(err)
        response.status(500).send("error")
    }   
    */
})

app.post("/chatBot", async (request, response) => {
    let prompt = request.body.prompt
    const result = await model.generateContent(prompt);
    console.log(prompt)

    response.send(result.response.text())
})



app.get("/getSprite", (request, response) => {
    
    response.send(pokemonSprites.reverse())
   
})






app.listen(4000, () => console.log("server is listening........."))