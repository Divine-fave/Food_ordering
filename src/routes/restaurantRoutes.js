import express from "express";

import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from "../controllers/restaurantController.js";

const router = express.Router();

// Get all restaurants
router.get("/", getRestaurants);

// Get one restaurant
router.get("/:id", getRestaurantById);

// Create a restaurant
router.post("/", createRestaurant);

// Update a restaurant
router.put("/:id", updateRestaurant);

// Delete a restaurant
router.delete("/:id", deleteRestaurant);

export default router;