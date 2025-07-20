// netlify/functions/ebay-webhook.js
const crypto = require('crypto');

exports.handler = async (event, context) => {
  console.log('=== eBay Webhook Called ===');
  console.log('Method:', event.httpMethod);
  console.log('Query params:', event.queryStringParameters);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Body:', event.body);

  // Your configuration
  const VERIFICATION_TOKEN = 'chaimae_netlify_ebay_webhook_2025_production_secure';
  const ENDPOINT_URL = 'https://boisterous-dasik-eca994.netlify.app/.netlify/functions/ebay-webhook';

  // Handle GET request with challenge code (eBay validation)
  if (event.httpMethod === 'GET') {
    const challengeCode = event.queryStringParameters?.challenge_code;
    
    if (!challengeCode) {
      console.log('❌ No challenge code provided in GET request');
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Missing challenge_code parameter'
        })
      };
    }

    console.log('✅ Challenge code received:', challengeCode);
    
    // Create hash as per eBay docs: challengeCode + verificationToken + endpoint
    const hash = crypto.createHash('sha256');
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(ENDPOINT_URL);
    const challengeResponse = hash.digest('hex');
    
    console.log('Challenge response hash:', challengeResponse);
    
    // Return the required response format
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        challengeResponse: challengeResponse
      })
    };
  }

  // Handle POST request (actual notifications)
  if (event.httpMethod === 'POST') {
    try {
      console.log('📨 Processing POST notification');
      
      // Parse the notification body
      const notification = JSON.parse(event.body || '{}');
      
      console.log('Notification received:', {
        topic: notification.metadata?.topic,
        notificationId: notification.notification?.notificationId,
        eventDate: notification.notification?.eventDate,
        username: notification.notification?.data?.username,
        userId: notification.notification?.data?.userId
      });

      // Validate it's a marketplace account deletion notification
      if (notification.metadata?.topic !== 'MARKETPLACE_ACCOUNT_DELETION') {
        console.log('❌ Invalid notification topic:', notification.metadata?.topic);
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid notification topic'
          })
        };
      }

      // Extract user data
      const userData = notification.notification?.data;
      if (!userData) {
        console.log('❌ No user data in notification');
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Missing user data'
          })
        };
      }

      console.log('✅ Processing account deletion for:', {
        username: userData.username,
        userId: userData.userId,
        eiasToken: userData.eiasToken
      });

      // TODO: Implement your actual user deletion logic here
      // Examples:
      // - Remove user data from your database
      // - Anonymize user information
      // - Update user status to "deleted"
      // - Log the deletion for compliance

      // Return success response (required by eBay)
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'success',
          message: 'Account deletion notification processed',
          notificationId: notification.notification?.notificationId,
          processedAt: new Date().toISOString()
        })
      };

    } catch (error) {
      console.error('❌ Error processing notification:', error);
      
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Internal server error',
          message: error.message
        })
      };
    }
  }

  // Method not allowed for other HTTP methods
  return {
    statusCode: 405,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      error: 'Method not allowed',
      message: 'Only GET and POST methods are supported'
    })
  };
};