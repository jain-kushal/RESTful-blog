var methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    

// ==========App config==========
app.set("view engine", "ejs");                      //setup .ejs extension as default extension of all the files
app.use(express.static("public"));                  //setup public directory as default for css and js files
app.use(bodyParser.urlencoded({extended: true}));   //Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(expressSanitizer());                        //must come after body parser
app.use(methodOverride("_method"));

// ===========Setting up our mongodb database==========

mongoose.connect("mongodb+srv://admin:0dRxcPd1O5OIVAyv@restful-tpfi1.mongodb.net/test?retryWrites=true&w=majority");

// Schema definition
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title: String,
    image: String,
    body: String,
    created:
            {
                type: Date,
                default: Date.now
                
            }
});

// Create model
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://www.outbrain.com/techblog/wp-content/uploads/2017/05/road-sign-361513_960_720.jpg",
//     body: "Testing stuff................................."
// });

// ==========RESTful ROUTES==========

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

// INDEX route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err){
            console.log("ERROR: " + err);
        } else {
            res.render("index", {blogs});
        }
    })
});

// NEW route
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// CREATE route
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err){
            res.render("new");
        } else {
            // console.log(newBlog);
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) =>{
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/");
        } else {
            res.render("show", {foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/");
        } else {
            res.render("edit", {foundBlog});
        };
    });
    
});

// UPDATE Route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE Route
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("RESTful blog server started successfully!!!");
});
