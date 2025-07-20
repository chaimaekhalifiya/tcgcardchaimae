// netlify/functions/ebay-webhook.js
exports.handler = async (event, context) => {
  // Log for debugging
  console.log('=== Netlify eBay Webhook ===');
  console.log('Method:', event.httpMethod);
  console.log('Body:', event.body);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Method not allowed',
        message: 'This endpoint only accepts POST requests'
      })
    };
  }

  try {
    // Your verification token
    const VERIFICATION_TOKEN = 'chaimae_netlify_ebay_webhook_2025_production_secure';
    
    // Parse the request body
    const requestBody = JSON.parse(event.body || '{}');
    const { verificationToken, username, userId, timestamp } = requestBody;
    
    console.log('Token verification:');
    console.log('Expected:', VERIFICATION_TOKEN);
    console.log('Received:', verificationToken);
    
    // Verify the token
    if (verificationToken !== VERIFICATION_TOKEN) {
      console.log('❌ Token verification failed');
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid verification token'
        })
      };
    }

    console.log('✅ Token verification successful');
    
    // Log the account deletion request
    console.log('Processing eBay account deletion:', {
      username,
      userId,
      timestamp,
      processedAt: new Date().toISOString()
    });

    // TODO: Add your actual user deletion logic here
    // Examples:
    // - Remove user data from database
    // - Anonymize user information
    // - Update user status to "deleted"
    // - Send confirmation email

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'success',
        message: 'eBay account deletion request processed successfully',
        userId: userId,
        service: 'tcgcardchaimae-netlify',
        processedAt: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};