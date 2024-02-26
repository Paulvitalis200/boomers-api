const express =  require("express");
const app =  express();

const port = process.env.PORT || 5001;

app.use(express.json())

app.get('/api', (req, res) => {
    res.status(200).json({message: "Hello boomers"})
})

app.listen(port, () => {
    console.log("Server running on port: ", port)
})