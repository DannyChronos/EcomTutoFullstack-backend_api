import {Router} from "express"
import { 
    allProducts, 
    getProducts, 
    createProducts, 
    updateProducts, 
    deleteProducts 
} from "./productsController";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { ProductsTable } from "../../db/productsSchema";


//import {z} from "zod";
import { validateData } from "../../middlewares/validationsMiddleware";
import { verifySellerToken, verifyToken } from "../../middlewares/authMiddleware";

/*const createProductSchema = z.object({
    name : z.string(),
    price: z.number()
})*/

const createProductSchema = createInsertSchema(ProductsTable)
const updateProductSchema = createUpdateSchema(ProductsTable)

const router = Router();
// Products endpoints

router.get('/', allProducts);

router.get('/:id', getProducts);

router.post('/', verifyToken, verifySellerToken, validateData(createProductSchema), createProducts);

router.put('/:id', verifyToken, verifySellerToken, validateData(updateProductSchema), updateProducts);

router.delete('/:id', verifyToken, verifySellerToken, deleteProducts);

export default router;