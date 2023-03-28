const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topics")
app.use((err, req, res, next) => {
    console.error(err)
    if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Could not connect to the database' })
    } else if (err.message === 'Topics not found') {
        res.status(404).send({ error: 'Topics not found' })
    } else {
        res.status(500).send({ error: 'Internal server error' })
    }
})
app.get("/api/topics", getTopics)

module.exports = app