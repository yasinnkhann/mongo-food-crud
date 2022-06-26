import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [foodName, setFoodName] = useState('');
  const [daysSinceIAte, setDaysSinceIAte] = useState(0);
  const [foodList, setFoodList] = useState([]);
  const [newFoodName, setNewFoodName] = useState('');

  const foodInputRef = useRef(null);
  const daysSinceIAteInputRef = useRef(null);
  const newFoodInputRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/read`)
    .then(res => {
      console.log(res.data);
      setFoodList(res.data);
    })
    .catch(err => {
      console.error(err); 
    })
  }, [])

  const addToList = () => {
    axios.post(`http://localhost:3001/insert`, {
      foodName,
      daysSinceIAte,
    })
    .then(() => {
      return axios.get(`http://localhost:3001/read`);    
    })
    .then(res => {
      foodInputRef.current.value = '';
      daysSinceIAteInputRef.current.value = '';
      console.log(res.data)
      setFoodList(res.data);
    })
    .catch(err => {
      console.error(err); 
    })
  };

  const updateFood = id => {
    axios.put(`http://localhost:3001/update`, {
      id,
      newFoodName,
    })
    .then(() => {
      return axios.get(`http://localhost:3001/read`);     
    })
    .then(res => {
      newFoodInputRef.current.value = '';
      console.log(res.data);
      setFoodList(res.data);
    })
    .catch(err => {
      console.error(err); 
    })
  };

  const deleteFood = id => {
    axios.delete(`http://localhost:3001/delete/${id}`)
    .then(() => {
      return axios.get(`http://localhost:3001/read`);    
    })
    .then(res => {
      console.log(res.data);
      setFoodList(res.data);
    })
    .catch(err => {
      console.error(err); 
    })
  };

  return (
    <div className="App">
      <h1>CRUD App with MERN</h1>

      <label>Food Name:</label>
      <input
       type="text"
       onChange={(e) => setFoodName(e.target.value)} 
       ref={foodInputRef}
       />
      <label>Days Since You Ate:</label>
      <input 
      type="number" 
      onChange={(e) => setDaysSinceIAte(e.target.value)} 
      ref={daysSinceIAteInputRef}
      />
      <button onClick={() => addToList()}>Add To List</button>

      <h1>Food List</h1>

      {foodList.map((val, key) => (
        <div 
        className="food"
        key={key}
        >
          <h1>
            {val.foodName}
          </h1>
          <h1>
            {val.daysSinceIAte}
          </h1>
          <input
          type="text" 
          placeholder="New Food Name.." 
          onChange={(e) => setNewFoodName(e.target.value)}
          ref={newFoodInputRef}
          />

          <button onClick={() => updateFood(val._id)}>
            Update
          </button>

          <button onClick={() => deleteFood(val._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
