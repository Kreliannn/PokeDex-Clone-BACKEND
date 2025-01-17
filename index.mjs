import express from "express";
import cors from "cors"
import axios from "axios"
import { GoogleGenerativeAI }from "@google/generative-ai"
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import multer from "multer";

const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:3000"
}))
app.use(bodyParser.json({ limit: '20mb' }));  // for large Base64 data
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");  // Folder to save the uploaded files
    },
    filename: (req, file, cb) => {
      // Get the file extension (e.g., .jpg, .png)
      const ext = path.extname(file.originalname).toLowerCase();
      
      // Generate a unique filename with timestamp and the file extension
      const filename = Date.now() + ext;
  
      cb(null, filename);  // Save with new filename
    }
  });

const upload = multer({ storage : storage})


app.post("/upload", upload.single('file'), (request, response) => {
    response.send(request.file.filename)
})

let pokemonSprites = [
   
];



const genAI = new GoogleGenerativeAI(process.env.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/getPokemonData", upload.single('file') ,async (request, response) => {
    

    let fileName = request.file.filename
    const imagePath = path.resolve("uploads/" + fileName);
    const imageData = fs.readFileSync(imagePath).toString("base64");
    
    console.log(fileName)

    try {
        
        const imgChecker = await model.generateContent([
            {
                inlineData: {
                    data: imageData,
                    mimeType: "image/png", // Ensure the correct MIME type (e.g., "image/png" for PNG images)
                },
            },
            "is this a pokemon? if yes return the name of the pokemon name in lowercase, if not pokemon return 'not pokemon' do not return any other string.",
        ]);

      
        let isPokemon = imgChecker.response.text()

        console.log("name: " + isPokemon)

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






app.listen(process.env.port, () => console.log("server is listening........." + process.env.REACT_APP_API_KEY))