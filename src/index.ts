import express from "express";

// Import Router

import productsRoutes from "./routes/products/index";

const app = express();
const port = 3000;


app.get("/", (req, res) => {
    res.send("Hello World !!");
});


app.use('/products', productsRoutes); // product api routes




app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})