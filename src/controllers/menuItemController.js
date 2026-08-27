import pool from "../config/db.js";

// Get all menu items for a restaurant
export const getRestaurantMenu = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT menu_items.*, categories.name AS category_name
             FROM menu_items
             LEFT JOIN categories
             ON menu_items.category_id = categories.id
             WHERE restaurant_id = $1
             ORDER BY menu_items.id`,
            [id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: "Error getting restaurant menu"
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

        if (!restaurant_id || !name || !price) {
    return res.status(400).json({
        message: "Restaurant, name and price are required"
    });
}

if (price < 0) {
    return res.status(400).json({
        message: "Price cannot be negative"
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
                availability
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Error creating menu item"
        });
    }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            category_id,
            availability
        } = req.body;

        const result = await pool.query(
            `UPDATE menu_items
             SET name = $1,
                 description = $2,
                 price = $3,
                 category_id = $4,
                 availability = $5
             WHERE id = $6
             RETURNING *`,
            [
                name,
                description,
                price,
                category_id,
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
        res.status(500).json({
            message: "Error updating menu item"
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
        res.status(500).json({
            message: "Error deleting menu item"
        });
    }
};