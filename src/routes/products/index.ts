import {Router} from "express"
import { 
    allProducts, 
    getProducts, 
    createProducts, 
    updateProducts, 
    deleteProducts 
} from "./productsController";
import { createInsertSchema } from "drizzle-zod";
import { ProductsTable } from "../../db/productsSchema";


//import {z} from "zod";
import { validateData } from "../../middlewares/validationsMiddleware";

/*const createProductSchema = z.object({
    name : z.string(),
    price: z.number()
})*/

const createProductSchema = createInsertSchema(ProductsTable)

const router = Router();
// Products endpoints

router.get('/', allProducts);

router.get('/:id', getProducts);

router.post('/', validateData(createProductSchema), createProducts);

router.put('/:id', updateProducts);

router.delete('/:id', deleteProducts);

export default router;