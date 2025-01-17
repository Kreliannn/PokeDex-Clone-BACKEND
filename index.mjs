import express from "express";
import cors from "cors"
import axios from "axios"

const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:3000"
}))

//give a a short and simple description like in pokedex, the pokemon is charizard


app.post("/getPokemonData", async (request, response) => {
    let img = request.body.img
    let name = img

    let description = "Charizard, a lroeakdsfjasfjaljskfjkasfkajlks jfaslkj fjkas fasjk fjklas jfaskj fa Fire/Flying-type Pokémon, is known for its dragon-like appearance and fiery breath. It flies high in the sky, breathing intense flames from its mouth. Charizard is fierce, powerful, and a strong protector of its trainer."
    const stats = [
        {stateName: 'hp', stat: 78},
        {stateName: 'attack', stat: 84},
        {stateName: 'defense', stat: 78},
        {stateName: 'special-attack', stat: 109},
        {stateName: 'special-defense', stat: 85},
        {stateName: 'speed', stat: 100}
    ]

    let types = ["water", "fire"]
    
    try {
            /*
        let pokemon = "charizard"
        let res = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemon);
    
        let name = res.data.name
        let picture = res.data.sprites.other['official-artwork'].front_default
        let sprite = res.data.sprites.front_default
        let types = res.data.types.map((obj) => obj.type.name )
        let stats = res.data.stats.map((obj) => ({stateName : obj.stat.name, stat : obj.base_stat}))
        let height = (res.data.height / 10)
        let weight = res.data.weight */
        
     
     
        let pokemonData = {
            name : "charizard",
            picture : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
            sprite : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
            height : (15 / 10),
            weight : 900,
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