import { pool } from '../config/db.js';

export async function createOrder(req, res) {
  const { restaurant_id, items } = req.body;
  const customer_id = req.user.id;

  if (!restaurant_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'restaurant_id and a non-empty items array are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, restaurant_id, status, total_price)
       VALUES ($1, $2, 'pending', 0)
       RETURNING *`,
      [customer_id, restaurant_id]
    );
    const order = orderResult.rows[0];

    let total = 0;
    const insertedItems = [];

    for (const item of items) {
      const { menu_item_id, quantity } = item;

      if (!menu_item_id || !quantity || quantity <= 0) {
        throw new Error(`Invalid item: ${JSON.stringify(item)}`);
      }

      const menuItemResult = await client.query(
        `SELECT price FROM menu_items WHERE id = $1`,
        [menu_item_id]
      );

      if (menuItemResult.rows.length === 0) {
        throw new Error(`Menu item not found: ${menu_item_id}`);
      }

      const unit_price = parseFloat(menuItemResult.rows[0].price);
      const subtotal = unit_price * quantity;
      total += subtotal;

      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [order.id, menu_item_id, quantity, unit_price, subtotal]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    const updatedOrderResult = await client.query(
      `UPDATE orders SET total_price = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [total, order.id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      order: updatedOrderResult.rows[0],
      items: insertedItems,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('createOrder error:', err.message);
    return res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
}
export async function getOrders(req, res) {
  const { id: userId, role } = req.user;
  const { restaurant_id } = req.query;

  try {
    let query = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (role === 'customer') {
      params.push(userId);
      query += ` AND customer_id = $${params.length}`;
    } else if (restaurant_id) {
      params.push(restaurant_id);
      query += ` AND restaurant_id = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error('getOrders error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
export async function getOrderById(req, res) {
  const { id } = req.params;

  try {
    const orderResult = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (req.user.role === 'customer' && order.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.*, mi.name AS item_name
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id = $1`,
      [id]
    );

    return res.json({ order, items: itemsResult.rows });
  } catch (err) {
    console.error('getOrderById error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
}
const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('updateOrderStatus error:', err.message);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
}
export async function getOrdersByUser(req, res) {
  const { id } = req.params;

  if (req.user.role === 'customer' && req.user.id !== id) {
    return res.status(403).json({ error: 'Not authorized to view this history' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('getOrdersByUser error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch order history' });
  }
}
