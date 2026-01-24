import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// MongoDB connection
let db;
let isConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
    });
    
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    
    db = client.db();
    isConnected = true;
    
    console.log('✅ Connected to MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Server will continue without database. Form submissions will be logged to console.');
    isConnected = false;
  }
};

// API Routes
app.post('/api/seve-request', async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      product,
      purpose,
      organisation,
      premiumType,
      timestamp
    } = req.body;

    // Validate required fields
    if (!userName || !userEmail || !product || !purpose || !premiumType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userName', 'userEmail', 'product', 'purpose', 'premiumType']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate product options
    const validProducts = ['windows', 'linux', 'macos'];
    if (!validProducts.includes(product)) {
      return res.status(400).json({
        error: 'Invalid product selection',
        validOptions: validProducts
      });
    }

    // Validate premium type
    const validPremiumTypes = ['professional', 'enterprise'];
    if (!validPremiumTypes.includes(premiumType)) {
      return res.status(400).json({
        error: 'Invalid premium type',
        validOptions: validPremiumTypes
      });
    }

    // Create request document
    const requestDoc = {
      userName: userName.trim(),
      userEmail: userEmail.toLowerCase().trim(),
      product,
      purpose: purpose.trim(),
      organisation: organisation ? organisation.trim() : null,
      premiumType,
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending',
      createdAt: new Date()
    };

    // Try to save to database, fallback to console logging
    if (isConnected && db) {
      try {
        const result = await db.collection('requests').insertOne(requestDoc);
        console.log(`✅ New SEVE request saved: ${userEmail} for ${product} (${premiumType})`);
        
        res.status(201).json({
          success: true,
          message: 'Request submitted successfully',
          requestId: result.insertedId,
          savedToDatabase: true
        });
      } catch (dbError) {
        console.error('Database save error:', dbError.message);
        // Fallback to console logging
        console.log('📝 SEVE Request (DB error):', JSON.stringify(requestDoc, null, 2));
        
        res.status(201).json({
          success: true,
          message: 'Request submitted successfully (logged locally)',
          savedToDatabase: false
        });
      }
    } else {
      // Database not connected - log to console
      console.log('📝 SEVE Request (No DB):', JSON.stringify(requestDoc, null, 2));
      
      res.status(201).json({
        success: true,
        message: 'Request submitted successfully (logged locally)',
        savedToDatabase: false
      });
    }

  } catch (error) {
    console.error('Error processing SEVE request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process request'
    });
  }
});

// Get all requests (admin endpoint - you might want to add authentication)
app.get('/api/seve-requests', async (req, res) => {
  try {
    if (!isConnected || !db) {
      return res.status(503).json({
        error: 'Database not available',
        message: 'MongoDB connection is not established'
      });
    }

    const requests = await db.collection('requests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      error: 'Failed to fetch requests'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: isConnected ? 'connected' : 'disconnected',
    server: 'running'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);