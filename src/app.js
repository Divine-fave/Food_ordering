
// import restaurantRoutes from "./routes/restaurantRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import menuItemRoutes from "./routes/menuItemRoutes.js";

// const app = express();

// app.use(express.json());

// app.get("/", (req, res) => {
//     res.json({
//         message: "Food Ordering API is running"
//     });
// });

// app.use("/api/restaurants", restaurantRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/menu-items", menuItemRoutes);

// export default app;
import express from 'express';
import ordersRoutes from './routes/orders.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import userOrdersRoutes from './routes/userOrders.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'orders-payments' }));

app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/users', userOrdersRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;