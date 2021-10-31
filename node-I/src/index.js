const express = require('express')
const app = express()
app.use(express.json())

// Route params = http:localhost:port/item/:id
//Query params =  http:localhost:port/item?page=1&order=asc
//Body params = objetos e insert
app.get("/item", (request, response)=>{
    const query = request.query
    console.log(query)
    return response.json(["Aula 01", "aula 02", "aula 03", "aula 04"])
})

app.post("/item", (request, response)=>{
    return response.json(["Aula 01", "aula 02", "aula 03", "aula 04","aula 05"])
})

app.put("/item/:id", (request, response)=>{
    const { id }= request.params
    console.log(id)
    return response.json(["Aula 01", "aula 02", "aula 03", "aula 04","aula 05"])
})


app.patch("/item/:id", (request, response)=>{

    return response.json(["Aula 01", "aula 02", "aula 03", "aula 04","aula 05"])
})

app.delete("/item/:id", (request, response)=>{
    const { id } = request.body
    return response.json(id)
})


app.listen(3000,()=> console.log("online"))