import { Router } from "express";
import prisma from '../lib/prisma.js';
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middleware/auth.midelwer.js";
//definir el schema de validacion de estudiante 
const studentSchema = z.object({
    SudentCode: z.string().min(5, "elcodigo debe tener minimo 5 carate  res"),
    name: z.string().min(5, "el nombre debe tener minimo 5 carateres").max(50, "el nombre es muy largo"),
    lastname: z.string().min(5, "el apellido debe tener minimo 5 carateres").max(50, "el apellido es muy largo"),
    email: z.string().email("El email no es valido").trim(),
    password: z.string().min(8, "la contraseña debe tener minimo 8 carateres").max(16, "la contraseña debe tener maximo 16 carateres"),
    phone: z.string().min(10, "el telefono debe tener minimo 10 carateres").max(10, "el telefono debe tener maximo 10 carateres")
});
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Error en la validacion", errors: result.error.issues });
    }
    req.validate = result.data
    next();
}


const userRouter = Router();

userRouter.get("/", async (req, res) => {
    // Buscar en la base de Datos
    const students = await prisma.student.findMany();
    res.status(200).json({ sucess: true, data: students });
});

// SOLO UN POST /create
userRouter.post("/create", authMiddleware, validate(studentSchema), async (req, res) => {
    const { SudentCode, name, lastname, email, password, phone } = req.body;




    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newStudent = await prisma.student.create({
            data: {
                SudentCode: SudentCode,
                firstName: name,
                lastName: lastname,
                email: email,
                password: hashedPassword,
                phone: phone
            }


        });

        return res.status(201).json({
            message: "Nuevo Estudiante creado exitosamente",
            data: newStudent
        });

    } catch (error) {
        console.error("Error en Prisma:", error);
        return res.status(500).json({ message: "Error interno del servidor al crear estudiante" });
    }
});

userRouter.put("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { SudentCode, name, lastname, email, password, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const updatedStudent = await prisma.student.update({
            where: {
                id: id
            },
            data: {
                SudentCode: SudentCode,
                firstName: name,
                lastName: lastname,
                email: email,
                password: hashedPassword,
                phone: phone
            }
        });
        return res.status(200).json({
            message: "Estudiante actualizado exitosamente",
            data: updatedStuden
        });

    } catch (error) {
        console.error("Error en Prisma:", error);
        return res.status(500).json({ message: "Error interno del servidor al actualizar estudiante" });
    }
});

userRouter.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedStudent = await prisma.student.delete({
            where: {
                id: id
            }
        });
        return res.status(200).json({
            message: "Estudiante eliminado exitosamente",
            data: deletedStudent
        });
    } catch (error) {
        console.error("Error en Prisma:", error);
        return res.status(500).json({ message: "Error interno del servidor al eliminar estudiante" });
    }
});

export default userRouter;