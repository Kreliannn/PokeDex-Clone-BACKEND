import express from "express";
import cors from "cors"


const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:3000"
}))


app.post("/", (request, response) => {
    let img = request.body.img
    setTimeout(() => {
        response.send(img)
    }, 3000)
   
})

app.get("/", (request, response) => {
    
    setTimeout(() => {
        response.send("success")
    }, 3000)
   
})

app.post("/res", (request, response) => {
    let img = request.body.img
    setTimeout(() => {
        response.send(img)
    }, 3000)
   
})






app.listen(4000, () => console.log("server is listening........."))