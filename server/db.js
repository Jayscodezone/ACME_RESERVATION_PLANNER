const pg = require("pg");
const client = new pg.Client("postgres://janayacooper:1116@localhost:5432/acme_reservations_db");
const UUID = require;


const createCustomer = async(customerName)=>{
const SQL  = `
INSERT INTO customers(id, name) VALES ($1, $2) RETURNING *`;
const result = await client.query(SQL, [UUID(), customerName]);
return result.rows[0];
};

const init = async () => {
  await client.connect();

  const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers; 
    DROP TABLE IF EXISTS restaurants;
   CREATE TABLE restaurants(id UUID) PRIMARY KEY,
   name STRING NOT NULL
 );

 CREATE TABLE reservations(
 id UUID PRIMARY KEY, 
 date  DATE NOT NULL,
 party_count INTEGER NOT NULL, 
 restaurant_id UUID REFERENCES restaurants(id) NOT NULL, 
 customer_id UUID REFERENCES customers(id) NOT NULL
 


 CREATE TABLE customers (
    id  UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
 );

 CREATE TABLE restaurants(
  id  UUID PRIMARY KEY,
   name VARCHAR(255) NOT NULL
 );
 `;

 await client.query(SQL);
 // adding customers names 
 const customerNames= ["Moana","Belle","Tiana"];
 for( const name of customerNames){
    await createCustomer(name);
 }

 console.log("Database initialized and customers added.");
};

module.EXPORTS ={
init,
createCustomer,
};


