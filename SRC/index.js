import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.routes.js";
import { apiKeyMiddleware } from "./middleware/apikey.middleware.js";
import authRouter from "./routes/auth.rautes.js";

//Crear instancia de express
const app = express();
const PORT = process.env.PORT

//especificar que todo sera json
app.use(express.json());

//aplicar el middleware a todas las peticiones
app.use(apiKeyMiddleware);


app.use("/", userRouter)
app.use("/auth", authRouter);




//Crear el servidor 
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

