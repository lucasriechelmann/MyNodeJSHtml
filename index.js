const express = require("express")
const bodyParser = require("body-parser")
const axios = require('axios')
const app = express()
const path = require("path")
const router = express.Router()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended: true}))

router.get("/", (req, res) => {
  res.render("index")
})
router.get("/about", (req, res) => {
    res.render("about")
})
router.get("/login", (req, res) => {
    
    res.render("login")
})

router.post("/login", (req, res) => {
    const { name, password } = req.body

    if(name === "admin" && password === "admin"){
        res.render("success", {
            username: name,
          })
    }
    else{
        res.render("failure")
    }
    
})

router.get('/repositories', async (req, res) => {
    const username = req.query.username || "lucasriechelmann"

    try{
        const result = await axios.get(`https://api.github.com/users/${username}/repos`)
        const repos = result.data.map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
          }))
        res.render("repositories", {
            repos
        })
    }
    catch (error){
        res.render("error", {message: error})
    }
})



app.use("/", router)
app.listen(3000, () => console.log('Running at Port 3000'))
