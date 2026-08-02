// 1. IMPORTACIONES
import { Router } from "express";
import { success, z } from "zod";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = Router()

// 2. RUTAS
authRouter.post("/register", (req, res) => {
    res.status(200).json({ message: "Registro exitoso" });
});

authRouter.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout exitoso" });
});

// 3. VALIDACIÓN (ZOD)
const loginSchema = z.object({
    email: z.string().email("El email no es valido"),
    password: z.string().min(8, "La contraseña debe tener minimo 8 caracteres").max(16, "La contraseña debe tener maximo 16 caracteres")
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Error en la validacion", errors: result.error.issues });
    }
    req.validate = result.data;
    next();
};

// 4. POST LOGIN
authRouter.post("/login", validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await prisma.student.findUnique({
            where: { email }
        });

        if (!student) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas" });
        }

        const isPasswordValid = bcrypt.compareSync(password, student.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas" });
        }

        const payload = {
            id: student.id,
            email: student.email,
            SudentCode: student.SudentCode,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

        return res.status(200).json({ success: true, accesstoken: token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

export default authRouter;