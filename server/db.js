const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://janayacooper:1116@localhost:5432/acme_reservation_db"
);
const uuid = require("uuid");

//Create the tables starting with the parent Table and then the child
const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS customers; 
  DROP TABLE IF EXISTS restaurants;
  
  CREATE TABLE restaurants( 
  id UUID PRIMARY KEY,
  name VARCHAR (50) NOT NULL
);

  CREATE TABLE customers (
    id  UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL
 );

 CREATE TABLE reservations(
 id UUID PRIMARY KEY, 
 date  DATE NOT NULL,
 party_count INTEGER NOT NULL, 
 restaurant_id UUID REFERENCES restaurants(id) NOT NULL, 
 customer_id UUID REFERENCES customers(id) NOT NULL
);
`;

  await client.query(SQL);
  console.log("Tables were created successfully");
};

// Create a new customer
const createCustomer = async (customerName) => {
  const SQL = `
    INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *`;
  const result = await client.query(SQL, [uuid.v4(), customerName]);
  return result.rows[0];
};

// Create a new restaurant
const createRestaurant = async (restaurantName) => {
  const SQL = `
    INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
  const result = await client.query(SQL, [uuid.v4(), restaurantName]);
  return result.rows[0];
};

// fetching all customers
const fetchCustomers = async () => {
  const SQL = `
SELECT * FROM customers`;
  const result = await client.query(SQL);
  return result.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
SELECT * FROM restaurants `;
  const result = await client.query(SQL);
  return result.rows;
};
// Create the reservaation and returns it
const createReservation = async ({
  customer_id,
  restaurant_id,
  date,
  party_count,
}) => {
  const SQL = `
    INSERT INTO reservations (id, customer_id, restaurant_id, date, party_count)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *;
     `;
  const result = await client.query(SQL, [
    uuid.v4(),
    customer_id,
    restaurant_id,
    date,
    party_count,
  ]);
  return result.rows[0];
};
// Delete the reservation
const destroyReservation = async (id) => {
  await client.query(`DELETE FROM reservations WHERE id = $1;`, [id]);
};
// Initializing Databased and seeding 
const init = async () => {
  await client.connect();
  await createTables();

  const customerNames = ["Moana", "Belle", "Tiana", "Jasmine"];
  const restaurantNames = ["Charthouse", "Aki", "Bonefish", "Atera"];

  for (const name of customerNames) {
    await createCustomer(name);
    console.log(`Customer created: ${name}`);
  }

 for (const name of restaurantNames) {
    await createRestaurant(name);
    console.log(`Restaurant created: ${name}`);
   }
 };
// start the database 
init();
module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
};
