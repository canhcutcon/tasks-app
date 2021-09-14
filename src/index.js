const express = require('express');
require('./db/mongoose');
const userRouters = require('./router/users');
const taskRouters = require('./router/task');


const app = express();
const port = process.env.PORT || 3000;


// middleware funtion
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.status(404).send("none");
//     } else {
//         next();
//     }
// })

app.use(express.json());
app.use(userRouters);
app.use(taskRouters);

const multer = require('multer');
const upload = multer({
    dest: 'images',
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
});


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task');
const User = require('./models/user');