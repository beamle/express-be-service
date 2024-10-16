import express from 'express'
import cors from 'cors'

export const app = express()
app.use(express.json()) // The request body will be available as a raw stream of data in req.body, but req.body will be undefined unless you manually parse it.
app.use(cors()) // Allow request from all origins

app.get('/', (req, res) => {
  res.status(200).json({message: 'Hello World'})
}