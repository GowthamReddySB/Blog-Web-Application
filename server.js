import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// In-memory storage for blog posts
let posts = [];

// Routes
app.get('/', (req, res) => {
    res.render('home', { posts: posts });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', (req, res) => {
    const post = {
        id: Date.now().toString(),
        title: req.body.postTitle,
        content: req.body.postBody,
    };
    posts.push(post);
    res.redirect('/');
});

app.get('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render('post', { post: post });
    } else {
        res.sendStatus(404);
    }
});

app.get('/posts/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render('edit', { post: post });
    } else {
        res.sendStatus(404);
    }
});

app.post('/posts/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.title = req.body.postTitle;
        post.content = req.body.postBody;
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
});

app.post('/posts/:postId/delete', (req, res) => {
    const postId = req.params.postId;
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
