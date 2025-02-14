const express = require('express');
const { fetchCustomers, fetchRestaurants, createReservation, destroyReservation }= require("./db");
const app = express();
const db = require("./db");
app.use(express.json())

// Initialization database and awaiting the create tables 
const init = async ()=>{
try{
   await db.init();
   await createTables();
  console.log('Database Initialized');
   
  const PORT = 3000;
  app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
} catch (err) {
  console.error('Error initializing the database:', err);
}
};
// Fetching customers 
   app.get('/api/customers', async (req, res, next) => {
    try {
      res.json(await fetchCustomers());
    } catch (err) {
      next(err);
    }
  });
  
  
  //Fetching the restaurants 
  app.get('/api/restaurants', async (req, res, next) => {
    try {
      res.json(await fetchRestaurants());
    } catch (err) {
      next(err);
    }
  });
  
  // Creating the reservation 
  app.post('/api/customers/:id/reservations', async (req, res, next) => {
    try {
      const { id: customer_id } = req.params;
      const { restaurant_id, date, party_count } = req.body;
      const reservation = await createReservation({ customer_id, restaurant_id, date, party_count });
      res.status(201).json(reservation);
    } catch (err) {
      next(err);
    }
  });

  
  // Deleting the reservation 
  app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });
  
  
  init ();

