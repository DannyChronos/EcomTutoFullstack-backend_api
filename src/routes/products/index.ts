import {Router} from "express"
import { 
    allProducts, 
    getProducts, 
    createProducts, 
    updateProducts, 
    deleteProducts 
} from "./productsController";

const router = Router();
// Products endpoints

router.get('/', allProducts);

router.get('/:id', getProducts);

router.post('/', createProducts);

router.put('/:id', updateProducts);

router.delete('/:id', deleteProducts);

export default router;