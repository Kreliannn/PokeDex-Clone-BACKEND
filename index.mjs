import express from "express";
import cors from "cors"
import axios from "axios"

const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:3000"
}))

//give a a short and simple description like in pokedex, the pokemon is charizard


const genAI = new GoogleGenerativeAI("AIzaSyBdrJMVA-cG86Dj3dJIskhB0DsCbo7CwFk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/getPokemonData", async (request, response) => {
    let img = request.body.img
    let name = img

    
    try {
    
        let pokemon = "lucario"
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
        response.status(500).send("error")
    }
   
})


app.post("/res", (request, response) => {
    let img = request.body.img
    setTimeout(() => {
        response.send(img)
    }, 3000)
   
})






app.listen(4000, () => console.log("server is listening........."))