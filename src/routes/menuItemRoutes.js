import express from "express";

import {
    getRestaurantMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from "../controllers/menuItemController.js";

const router = express.Router();

router.post("/", createMenuItem );
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;