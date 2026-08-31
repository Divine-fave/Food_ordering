import pool from "../config/db.js";

// GET all restaurants
export const getRestaurants = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM restaurants ORDER BY id"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get restaurants"
        });
    }
};

// GET one restaurant by ID
export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM restaurants WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get restaurant"
        });
    }
};

// CREATE a restaurant
export const createRestaurant = async (req, res) => {
    try {
        const { name, description, address, phone } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Restaurant name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO restaurants
            (name, description, address, phone)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [name, description, address, phone]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create restaurant"
        });
    }
};

// UPDATE a restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, address, phone } = req.body;

        const result = await pool.query(
            `UPDATE restaurants
            SET name = $1,
                description = $2,
                address = $3,
                phone = $4
            WHERE id = $5
            RETURNING *`,
            [name, description, address, phone, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update restaurant"
        });
    }
};

// DELETE a restaurant
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM restaurants WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            message: "Restaurant deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete restaurant"
        });
    }
};