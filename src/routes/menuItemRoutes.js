import express from "express";

import {
    getRestaurantMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../controllers/menuItemController.js";
const router = express.Router();

router.get("/restaurants/:id/menu", getRestaurantMenu);
router.post("/menu-items", createMenuItem);
router.put("/menu-items/:id", updateMenuItem);
router.delete("/menu-items/:id", deleteMenuItem);

export default router;