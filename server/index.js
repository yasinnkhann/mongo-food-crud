const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FoodModel = require('./models/Food.js');

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foodDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
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
    const daysSinceIAte = req.body.daysSinceIAte;

    const food = new FoodModel({ foodName: foodName, daysSinceIAte: daysSinceIAte });  
     
    try {
        await food.save();
        res.send(food);
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
            res.send(updatedFood);
        })
    } catch (err) {
        console.log(err);
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedFood = await FoodModel.findByIdAndRemove(id).exec();
        res.send(deletedFood);
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
