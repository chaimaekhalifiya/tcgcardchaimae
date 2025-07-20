export default function handler(req, res) {
  // Log for debugging
  console.log('=== eBay Webhook Received ===');
  console.log('Method:', req.method);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Your verification token - use whatever you have in eBay form
    const VERIFICATION_TOKEN = 'chaimae_ebay_webhook_2025_production_token_secure';
    
    // Get the verification token from request body
    const requestToken = req.body?.verificationToken || req.body?.verification_token;
    
    console.log('Token comparison:');
    console.log('Expected:', VERIFICATION_TOKEN);
    console.log('Received:', requestToken);
    
    // Verify the token
    if (requestToken !== VERIFICATION_TOKEN) {
      console.log('❌ Token verification FAILED');
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid verification token'
      });
    }

    console.log('✅ Token verification SUCCESS');
    
    // Process the account deletion request
    const { username, userId, timestamp } = req.body;
    
    console.log('Processing account deletion:', {
      username,
      userId,
      timestamp
    });

    // TODO: Add your actual user deletion logic here
    
    // Return success
    return res.status(200).json({ 
      status: 'success', 
      message: 'Account deletion request processed successfully',
      userId: userId,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}