import { ref, onValue, set } from 'firebase/database';
import { realTimeDb } from '../services/firebaseConfig'; // Necesitaremos configurar esto

class NotificationService {
  constructor() {
    this.notificationsRef = ref(realTimeDb, 'notifications');
  }

  // Método para enviar una nueva notificación cuando se crea un pedido
  async sendOrderNotification(order) {
    try {
      const notification = {
        id: `order_${order.id}`,
        type: 'new_order',
        title: 'Nuevo Pedido',
        message: `Nuevo pedido de ${order.customerName}`,
        order: {
          id: order.id,
          total: order.total,
          items: order.items.length,
          status: order.status
        },
        timestamp: Date.now(),
        read: false
      };

      await set(ref(realTimeDb, `notifications/${notification.id}`), notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Método para marcar una notificación como leída
  async markAsRead(notificationId) {
    try {
      await set(ref(realTimeDb, `notifications/${notificationId}/read`), true);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}

export const notificationService = new NotificationService();