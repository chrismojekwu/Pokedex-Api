require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
    
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')
    
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error:"Unauthorized request"})
    }
    //move to next middlewear
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req,res) {
    res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req,res) {
    let pokemon = POKEDEX.pokemon
    const name = req.query.name

    if(name){
        pokemon = POKEDEX.pokemon.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(name.toLowerCase())
    })}

    const type = req.query.type

    if(type){
        pokemon = POKEDEX.pokemon.filter(pokemon => {
            return pokemon.type.includes(type)
        })
    }

    res.json(pokemon)

    next()
}

app.get('/pokemon', handleGetPokemon)


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})