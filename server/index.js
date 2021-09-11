const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FoodModel = require('./models/Food.js');

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://yasinnkhann:password12345@crud.pwg8j.mongodb.net/food?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

app.get('/read', async (req, res) => {

    FoodModel.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

app.post('/insert', async (req, res) => {

    const foodName = req.body.foodName;
    const days = req.body.days;

    const food = new FoodModel({ foodName: foodName, daysSinceIAte: days });  
     
    try {
        await food.save();
        res.send('inserted data!');
    } catch (err) {
        console.log(err);
    }
});

app.put('/update', async (req, res) => {

    const newFoodName = req.body.newFoodName;
    const id = req.body.id;

    try {
       await FoodModel.findById(id, (err, updatedFood) => {
            updatedFood.foodName = newFoodName;
            updatedFood.save();
            res.send('update');
        })
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
});

app.delete('/delete/:id', async (req, res) => {

    const id = req.params.id;

    try {
        await FoodModel.findByIdAndRemove(id).exec();
        res.send('deleted');
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
