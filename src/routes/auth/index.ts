import { Router } from "express";
import { validateData } from "../../middlewares/validationsMiddleware";
import { createUserSchema, usersTable, loginSchema } from "../../db/usersSchema";
import brcypt from "bcryptjs"
import db from "../../db/index";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";


const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', validateData(createUserSchema), async (req, res) => {

    try {
        const data = req.body;
        console.log(data);
        const salt = await brcypt.genSalt(10);

        const hashedPassword = await brcypt.hash(data.password, salt)

        // Explicitly construct the insert object with role set to 'user'
        const user = await db.insert(usersTable).values({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            adresse: data.adresse
        }).returning();

        return res.status(201).json({
            message: 'User registered successfully',
            data: user[0]
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Registration failed',
            error: String(error)
        })
    }
});

 
router.post('/login', validateData(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (user.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const foundUser = user[0];

        // Compare passwords
        const isPasswordValid = await brcypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role
            },
            JWT_SECRET,
            {
                expiresIn: '24h'
            }
        );

        // Return user data (without password) and token
        const { password: _, ...userWithoutPassword } = foundUser;
        
        return res.status(200).json({
            message: 'Login successful',
            token,
            data: userWithoutPassword
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Login failed',
            error: String(error)
        });
    }
});

export default router;