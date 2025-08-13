// Discord notification service for order updates
// Configure your Discord webhook URL in environment variables

const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

interface OrderData {
  id?: string;
  client?: string;
  phone?: string;
  produit?: string;
  montant?: number;
  wilaya_id?: number;
  commune?: string;
  tracking?: string;
  status?: string;
  created_at?: string;
}

interface DiscordEmbed {
  title: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: string;
  footer?: {
    text: string;
  };
  thumbnail?: {
    url: string;
  };
}

// Color constants for different notification types
const COLORS = {
  NEW_ORDER: 0xE91E63,      // Pink for new orders
  ORDER_SHIPPED: 0x4CAF50,  // Green for shipped orders
  ORDER_CANCELLED: 0xF44336, // Red for cancelled orders
  SYSTEM_ALERT: 0xFF9800    // Orange for system alerts
};

/**
 * Send Discord notification for new orders
 */
export const sendNewOrderNotification = async (orderData: OrderData) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping notification');
    return { success: true, message: 'Discord notifications disabled' };
  }

  try {
    const embed: DiscordEmbed = {
      title: "🛍️ New Order Received!",
      color: COLORS.NEW_ORDER,
      fields: [
        {
          name: "📝 Order ID",
          value: orderData.id || "N/A",
          inline: true
        },
        {
          name: "👤 Customer",
          value: orderData.client || "N/A",
          inline: true
        },
        {
          name: "📞 Phone",
          value: orderData.phone || "N/A",
          inline: true
        },
        {
          name: "🎁 Product",
          value: orderData.produit || "N/A",
          inline: false
        },
        {
          name: "💰 Amount",
          value: orderData.montant ? `${orderData.montant} DA` : "N/A",
          inline: true
        },
        {
          name: "📍 Location",
          value: orderData.commune ? `${orderData.commune} (${orderData.wilaya_id})` : "N/A",
          inline: true
        },
        {
          name: "📅 Order Time",
          value: orderData.created_at ? new Date(orderData.created_at).toLocaleString('en-US', {
            timeZone: 'Africa/Algiers',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : "N/A",
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Boutique Order System"
      }
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed],
        username: "Order Bot",
        avatar_url: "https://cdn.discordapp.com/emojis/🛍️.png"
      })
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    console.log('✅ Discord notification sent successfully');
    return { success: true, message: 'Notification sent' };

  } catch (error) {
    console.error('❌ Discord notification failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Discord notification for shipped orders
 */
export const sendOrderShippedNotification = async (orderData: OrderData) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping notification');
    return { success: true, message: 'Discord notifications disabled' };
  }

  try {
    const embed: DiscordEmbed = {
      title: "🚚 Order Shipped!",
      color: COLORS.ORDER_SHIPPED,
      fields: [
        {
          name: "📝 Order ID",
          value: orderData.id || "N/A",
          inline: true
        },
        {
          name: "👤 Customer",
          value: orderData.client || "N/A",
          inline: true
        },
        {
          name: "📦 Tracking",
          value: orderData.tracking || "N/A",
          inline: true
        },
        {
          name: "🎁 Product",
          value: orderData.produit || "N/A",
          inline: false
        },
        {
          name: "📍 Destination",
          value: orderData.commune ? `${orderData.commune} (${orderData.wilaya_id})` : "N/A",
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Boutique Shipping System"
      }
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed],
        username: "Shipping Bot",
        avatar_url: "https://cdn.discordapp.com/emojis/🚚.png"
      })
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    console.log('✅ Shipping notification sent successfully');
    return { success: true, message: 'Notification sent' };

  } catch (error) {
    console.error('❌ Shipping notification failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Discord notification for system alerts
 */
export const sendSystemAlert = async (title: string, message: string, type: 'info' | 'warning' | 'error' = 'info') => {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping notification');
    return { success: true, message: 'Discord notifications disabled' };
  }

  const emoji = type === 'error' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
  const color = type === 'error' ? 0xF44336 : type === 'warning' ? 0xFF9800 : 0x2196F3;

  try {
    const embed: DiscordEmbed = {
      title: `${emoji} ${title}`,
      color: color,
      fields: [
        {
          name: "Message",
          value: message,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Boutique System Alert"
      }
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed],
        username: "System Bot"
      })
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    console.log('✅ System alert sent successfully');
    return { success: true, message: 'Alert sent' };

  } catch (error) {
    console.error('❌ System alert failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test Discord webhook configuration
 */
export const testDiscordWebhook = async () => {
  return await sendSystemAlert(
    'Test Notification',
    'Discord webhook is working correctly! 🎉',
    'info'
  );
};

/**
 * Check if Discord notifications are enabled
 */
export const isDiscordEnabled = () => {
  return !!DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.includes('discord.com/api/webhooks/');
};

// Export the webhook URL for debugging purposes
export const getWebhookStatus = () => {
  return {
    configured: !!DISCORD_WEBHOOK_URL,
    url: DISCORD_WEBHOOK_URL ? '***configured***' : 'not set'
  };
};
