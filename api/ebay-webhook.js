export default function handler(req, res) {
  console.log('Webhook called:', req.method);
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Webhook is working!',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'POST received successfully!',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}