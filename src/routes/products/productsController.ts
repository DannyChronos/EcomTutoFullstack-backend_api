import { Request, Response } from "express";
import db from "../../db/index";
import { ProductsTable } from "../../db/productsSchema";
import { eq } from "drizzle-orm";

export async function allProducts(req: Request, res: Response) {
    const getAllProducts = await db.select().from(ProductsTable);
    return res.status(201).json(getAllProducts)
}

export async function getProducts(req: Request, res: Response) {
    try {
        const productId = req.params.id;
        const product = await db.select().from(ProductsTable).where(eq(ProductsTable.id, Number(productId)));

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product[0]);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export async function createProducts(req: Request, res: Response) {

    try {
        const productCreated = await db.insert(ProductsTable).values(req.body).returning();

        return res.status(200).json({
            message: "Product added successfully",
            data: productCreated
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export async function updateProducts(req: Request, res: Response) {

    try {
        const productId = req.params.id;

        const product = await db.select().from(ProductsTable).where(eq(ProductsTable.id, Number(productId)));

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const getProductFromId = await db.update(ProductsTable)
            .set(req.body)
            .where(eq(ProductsTable.id, Number(productId))).returning()

        return res.status(201).json(getProductFromId)
    } catch (error) {
        return res.status(500).json(error)
    }

}

export async function deleteProducts(req: Request, res: Response) {
    try {
        const productId = req.params.id;

        const product = await db.select().from(ProductsTable).where(eq(ProductsTable.id, Number(productId)));

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        await db.delete(ProductsTable).where(eq(ProductsTable.id, Number(productId)))
        return res.json({
            message: "Product delete successfully"
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}