const express = require('express');
const db = require('./db');
const app = express();

//middleware 
app.use(express.json());


// get customers from api 
   app.get('/api/customers', async (req, res, next) => {
    try {
      const customers = await db.fetchCustomers();
      res.json(customers);
    } catch (err) {
      next(err);
    }
  });
  
  
  //get restaurants from api 
  app.get('/api/restaurants', async (req, res, next) => {
    try {
      const restaurants = await db.fetchRestaurants();
    res.json(restaurants);
    } catch (err) {
      next(err);
    }
  });
  // get reservations from api .
app.get('/api/reservations', async (req, res, next) => {
  try {
    // You can either create a helper function in db.js or run a query directly.
    const result = await db.client.query('SELECT * FROM reservations;');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

  //  Creating the reservation 
  app.post('/api/customers/:id/reservations', async (req, res, next) => {
    try {
      const { id: customer_id } = req.params;
      const { restaurant_id, date, party_count } = req.body;
      const reservation = await db.createReservation({ customer_id, restaurant_id, date, party_count });
      res.status(201).json(reservation);
    } catch (err) {
      next(err);
    }
  });

  
  // Deleting the reservation 
  app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
      await db. destroyReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });
  // initializing server
  const init = async () => {
    try {
      await db.createTables();
      console.log('Connected to the database');
      
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to initialize server');
    }
  };
  
  
  init ();
