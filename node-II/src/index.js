const express  = require("express")
const { v4: uuid, version } = require("uuid")
const app = express()
app.use(express.json())

const customers  = [];

function VerifyCustomer(request, response, next){
    const { cpf } = request.headers

    const customer = customers.find((cpf) => cpf === cpf)

    if(!customer){
        return response.status(401).json({Error:"Acesso negado! Usuário não possui conta!"})
    }

 request.customer = customer

    next()
}

function processSaque(statement){
    const operacaco = statement.reduce((acc, operation) =>{
        if(operation.type === "Deposito"){
            return acc + operation.amount 
        }else{
            return acc - operation.amount
        }

    }, 0)

    return operacaco
}

app.post("/createAccount", (request, response)=>{
const { cpf, name } = request.body
const customersAlreadExists = customers.some((item) => item.cpf === cpf)

if(customersAlreadExists){
    return response.status(400).json({Error:"usuário já existe"})
}
   customers.push({
        id: uuid(), 
        cpf,
        name,
        statement:[]
    })




    return response.json(customers)
})  


app.get("/statement/:cpf", VerifyCustomer, (request, response)=>{
    const { customer } = request
    return response.json(customer.statement)
})


app.post("/deposit", VerifyCustomer, (request, response)=>{
       const{ description, amount } = request.body
       const { customer } = request

       const operations = {
           description,
           amount,
           created_at: new Date(),
           type: "Deposito"
       }
       
       customer.statement.push(operations)
        return response.json(operations)

})

app.post("/withdrow", VerifyCustomer, (request, response)=>{
    const { amount } = request.body
    const {customer}= request

    const saldoAccount = processSaque(customer.statement)
    if(saldoAccount < amount){
        return response.status(401).json({Error:"Saldo insuficiente"})
    }

    const operations = {
        amount,
        created_at: new Date(),
        type: "Saque"
    }

    customer.statement.push(operations)
    return response.json(saldoAccount)
})

app.get("/buscandoMov/date", VerifyCustomer, (request, response)=>{
    const { date } = request.query
    const { customer } = request
  
    const dateFormat = new Date(date+ " 00:00")
     const statement = customer.statement.filter((statement) => 
    statement.created_at.toDateString() === dateFormat.toDateString())

    return response.json(statement)
})


app.put("/update", VerifyCustomer, (request, response)=>{
    const { customer }= request
    const { name } = request.body
    
    customer.name = name;

    return response.status(201).json(customer)

})

app.get("/user", VerifyCustomer, (request, response)=>{
    const { customer } = request
    return response.json(customer)
})

app.delete("/del", VerifyCustomer, (request, response)=>{
    const { customer } = request
        customers.splice(customer, 1)
    return response.status(200).json(customers)
})

app.get("/saldo", VerifyCustomer, (request, response)=>{
    const { customer } = request

    const saldo = processSaque(customer.statement)

    return response.status(200).json({Message: `Seu saldo atual é de R$ ${saldo}`})

})
app.listen(3000, ()=>console.log("online"))