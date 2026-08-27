import pool from "../config/db.js";

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM categories ORDER BY id"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: "Error getting categories"
        });
    }
};

// Create a category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const result = await pool.query(
            "INSERT INTO categories (name) VALUES ($1) RETURNING *",
            [name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Error creating category"
        });
    }
};