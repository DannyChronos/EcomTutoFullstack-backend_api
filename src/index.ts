import express, {json, urlencoded} from "express";

// Import Router

import productsRoutes from "./routes/products/index";
import authRoutes from "./routes/auth/index"

const app = express();
const port = 3000;

app.use(urlencoded({extended: false}));
app.use(json());

app.get("/", (req, res) => {
    res.send("Hello World !!");
});


app.use('/products', productsRoutes); // product api routes
app.use('/auth', authRoutes); // auth api routes



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})