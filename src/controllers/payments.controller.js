import { pool } from '../config/db.js';

const VALID_METHODS = ['card', 'cash', 'mobile_money'];

export async function createPayment(req, res) {
  const { order_id, method, transaction_reference } = req.body;

  if (!order_id || !VALID_METHODS.includes(method)) {
    return res.status(400).json({ error: `order_id is required and method must be one of: ${VALID_METHODS.join(', ')}` });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(`SELECT * FROM orders WHERE id = $1 FOR UPDATE`, [order_id]);

    if (orderResult.rows.length === 0) {
      throw { status: 404, message: 'Order not found' };
    }

    const order = orderResult.rows[0];

    if (req.user.role === 'customer' && order.customer_id !== req.user.id) {
      throw { status: 403, message: 'Not authorized to pay for this order' };
    }

    const paymentResult = await client.query(
      `INSERT INTO payments (order_id, amount, method, status, transaction_reference)
       VALUES ($1, $2, $3, 'completed', $4)
       RETURNING *`,
      [order_id, order.total_price, method, transaction_reference || null]
    );

    await client.query(
      `UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE id = $1 AND status = 'pending'`,
      [order_id]
    );

    await client.query('COMMIT');

    return res.status(201).json(paymentResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    const status = err.status || 500;
    console.error('createPayment error:', err.message || err);
    return res.status(status).json({ error: err.message || 'Failed to create payment' });
  } finally {
    client.release();
  }
}
export async function getPaymentsForOrder(req, res) {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC`,
      [orderId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('getPaymentsForOrder error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
}