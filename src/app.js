import express from "express";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuItemRoutes from "./routes/menuItemRoutes.js";


const app = express();

app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api", menuItemRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Food Ordering API is running"
    });
});

export default app;