import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()")
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
    });