# Shopping-Cart-Express

This is an shopping cart built on Express framework

# Feature
 
With Shopping-Cart-Express, you can do the followings

- Sign in and sign up
- Add product to cart
- Remove product from cart
- Change quantity of product
- Submit payment
- Check out details of a product

## Getting Started (adopting mySQL database)

1. Clone the repository
   ```
   git clone -b master https://github.com/cschang07/shopping-cart-express.git
   ```
2. Go to the file on your terminal
   ```
   cd shopping-cart-express
   ```
3. Install the kits
   ```
   npm install
   ```
4. Make an .env file according to the content of the .env.example file you will find in the repo
5. Go to config/config.json and change username and password under 'development' to match your mySQL data
6. Go to mySQL workbench
   ```
   create database shopping_cart_express;
   ```
7. Set up the data
   ```
   npx sequelize db:migrate
   ```
8. Set up seed data
   ```
   npx sequelize db:seed:all
   ```

10. Then you are good to run the server
   ```
   npm run dev
   ```
## User login

both user and administrator seed accounts are provided, shown in the table below:

| Role | User account | Password |
| ----------- | ----------- | ----------- |
| User | user1 | 1 |
| User | user2 | 2 |
| User | user3 | 3 |
| User | user4 | 4 |
| User | user5 | 5 |
| Admin | root | 12345678 |
