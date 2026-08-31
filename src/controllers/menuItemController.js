import pool from "../config/db.js";

// Get menu items for a restaurant
export const getRestaurantMenu = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY id",
            [id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get restaurant menu"
        });
    }
};

// Create a menu item
export const createMenuItem = async (req, res) => {
    try {
        const {
            restaurant_id,
            category_id,
            name,
            description,
            price,
            availability
        } = req.body;

        if (!restaurant_id || !category_id || !name || price === undefined) {
            return res.status(400).json({
                message: "restaurant_id, category_id, name and price are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO menu_items
            (restaurant_id, category_id, name, description, price, availability)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                restaurant_id,
                category_id,
                name,
                description,
                price,
                availability ?? true
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create menu item"
        });
    }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            restaurant_id,
            category_id,
            name,
            description,
            price,
            availability
        } = req.body;

        const result = await pool.query(
            `UPDATE menu_items
             SET restaurant_id = $1,
                 category_id = $2,
                 name = $3,
                 description = $4,
                 price = $5,
                 availability = $6
             WHERE id = $7
             RETURNING *`,
            [
                restaurant_id,
                category_id,
                name,
                description,
                price,
                availability,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update menu item"
        });
    }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM menu_items WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete menu item"
        });
    }
};