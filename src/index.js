const { response } = require('express')
const express = require('express')
const { v4: uuidv4 } = require('uuid')


const app = express()
app.use(express.json())

const customers = []

function getBalance(statement){
    const balance = statement.reduce((prev, curr) => {
        if(curr.type === "credit"){
           return prev + curr.amount
        }
        else{
           return prev - curr.amount
        }
    }, 0)

    return balance
}

// Middleware 

function verifyIfAccountExistsByCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf)

    if(!customer){
        return res.status(400).json("Customer not found")
    }

    req.customer = customer

    return next()
}

app.post("/account",(req,res) => {
    const {cpf, name} = req.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if(customerAlreadyExists){
        return res.status(400).json({error: "Customer already exists!"})
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })

    return res.status(201).send()    
})

// app.use(verifyIfAccountExistsByCPF)

app.get("/statement", verifyIfAccountExistsByCPF, (req,res) => {
    const { customer } = req

    return res.status(200).json(customer.statement)
})

app.post("/deposit", verifyIfAccountExistsByCPF ,(req,res) => {
    const { description, amount } = req.body

    if(amount <= 0 || description.length === 0){
        return res.status(400).json({error: "The amount or description cannot be empty"})
    }

    const { customer } = req

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)


    return res.status(201).send()
})

app.post("/withdraw", verifyIfAccountExistsByCPF , (req,res) => {
    const { amount } = req.body
    const { customer } = req

    const balance = getBalance(customer.statement)

    if(balance < amount){
        return res.status(400).json({error: "Your balance is insufficient"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "withdraw"
    }

    customer.statement.push(statementOperation)

    return res.status(201).json({message: `Successfully withdrawn`})
})

app.get("/statement/date", verifyIfAccountExistsByCPF, (req,res) => {
    const { customer } = req
    const { date } = req.query

    const dateFormat = new Date(date + " 00:00")

    const statement = customer.statement.filter(statement => {
        return statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    })

    if(statement.length === 0){
      return res.status(400).json({error: "No statements this date"})
    }

    return res.json(statement)
})

app.put("/account", verifyIfAccountExistsByCPF,(req,res) => {
    const { customer } = req
    const { name } = req.body

    customer.name = name

    return res.status(201).send()
})

app.get("/account",verifyIfAccountExistsByCPF, (req,res) => {
    const { customer } = req 

    return res.json(customer)
})

app.delete("/account", verifyIfAccountExistsByCPF ,(req,res) => {
    const { cpf } = req.customer

    const customerIndex = customers.findIndex(customer => customer.cpf === cpf)

    customers.splice(customerIndex, 1)

    return res.json(customers)
})

app.get("/balance", verifyIfAccountExistsByCPF,(req, res) => {
    const {customer} = req

    const balance = getBalance(customer.statement)

    return res.json(balance)
})
app.listen(3333)