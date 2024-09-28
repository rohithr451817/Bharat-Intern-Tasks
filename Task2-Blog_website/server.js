const express = require('express')
const articleRouter = require("./routes/articles")
const Article = require('./models/article')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const path = require('path') // Add this to use path.join
const app = express()

// Connect to the database
mongoose.connect('mongodb://localhost/Blog_websiteDatabase')
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Set the view engine and views directory
app.set("views", "./view")
app.set('view engine', 'ejs')

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }))

// Middleware to handle HTTP methods override
app.use(methodOverride('_method'))

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Route for the homepage
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

// Use the article routes
app.use('/articles', articleRouter)

// Start the server
app.listen(3000, () => {
    console.log("Listening on port 3000");
})
