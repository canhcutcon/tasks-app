const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();
const tasks = require('../models/task');




// create new tasks
router.post('/tasks', auth, async(req, res) => {
    //const task = new tasks(req.body);
    const task = new tasks({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// fillter data with populate
// /tasks?completed = 
// gioi han luot hien thi thong tin: /task
//GET: /tasks?sortBy=createAt:desc // sap xep giam dan
router.get('/tasks', auth, async(req, res) => {
        const match = {};
        const sort = {};

        if (req.query.completed)
            match.completed = req.query.completed === 'true';

        ///tasks?sortBy=description:sc
        if (req.query.sortBy) { //description:sc
            const parts = req.query.sortBy.split(':'); //parts = ['description', 'sc']
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        try {
            await req.user.populate({
                path: 'task',
                match,
                options: {
                    // gioi han luot hien thi thong tin
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate();
            res.status(201).send(req.user.task);
        } catch (e) {
            res.status(401).send(e);
        }
    })
    //fetching all tasks
    // router.get('/tasks', auth, async(req, res) => {
    //     try {
    //         const readAllTasks = await tasks.find({ owner: req.user._id });
    //         res.status(201).send(readAllTasks);
    //     } catch (e) {
    //         res.status(401).send(e);
    //     }
    // })

// fetching one tasks by id
router.get('/tasks/:id', auth, async(req, res) => {
    try {
        // cach 1: const task = await Task.findById({ _id, owner: req.user._id });
        await req.user.populate('task').execPopulate();
        // if (!task) {
        //     res.status(404).send();
        // }
        res.status(201).send(req.user.task);
    } catch (e) {
        res.status(404).send(e);
    }
})

// delete task 
router.delete('/tasks/:id', auth, async(req, res) => {
        try {
            //const task = await tasks.findByIdAndDelete(req.params.id);
            const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
            // if (!task)
            //     return res.status(404).send('No tasks!');
            res.status(201).send();
        } catch (e) {
            res.status(404).send(e);
        }
    })
    // upload task by body
router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdate = ['description', 'completed']; // key allow
    const updateValidator = updates.every((upload) => allowUpdate.includes(upload)); // duyet mang kt tinh hop le cuar key
    if (!updateValidator)
        return res.status(404).send('Invalid Update!!');

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        //const task = await Task.findById({ _id, owner: req.user._id });
        if (!task)
            return res.status(404).send('No task!');

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.status(201).send(task);
    } catch (e) {
        return res.status(404).send(e);
    }
})

module.exports = router;