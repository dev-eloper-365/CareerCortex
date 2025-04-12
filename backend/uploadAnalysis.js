const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function uploadAnalyses() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Hide credentials in logs
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const database = client.db('MainDB');
    console.log('Using database: MainDB');
    
    const collection = database.collection('analyses');
    console.log('Using collection: analyses');

    // Sample analyses data matching the existing format
    const analyses = [
      {
        userId: '67fad0cfb0c1290dec7d8fb1', // Using the same userId as existing records
        chatId: '67faf6709ffa3140153c0b29',
        timestamp: new Date(),
        analysis: {
          skills: {
            career_guidance: 8,
            resume_analysis: 9,
            interview_preparation: 7,
            industry_insights: 8,
            communication: 9
          },
          career1: {
            title: "Career Development Specialist",
            description: "The user demonstrates strong skills in career guidance and resume analysis, making them well-suited for helping others develop their professional paths."
          },
          career2: {
            title: "Talent Acquisition Specialist",
            description: "With expertise in interview preparation and industry insights, the user can excel in recruiting and talent acquisition roles."
          },
          career3: {
            title: "Professional Development Coach",
            description: "The user's balanced skill set in communication and career guidance positions them well for coaching and mentoring roles."
          }
        },
        createdAt: new Date()
      },
      {
        userId: '67fad0cfb0c1290dec7d8fb1', // Using the same userId as existing records
        chatId: '67faf6709ffa3140153c0b2a',
        timestamp: new Date(),
        analysis: {
          skills: {
            career_guidance: 9,
            resume_analysis: 8,
            interview_preparation: 8,
            industry_insights: 9,
            communication: 7
          },
          career1: {
            title: "Career Strategy Consultant",
            description: "The user shows strong potential in strategic career planning and industry analysis, making them ideal for consulting roles."
          },
          career2: {
            title: "Learning & Development Manager",
            description: "With strong skills in career guidance and communication, the user can effectively manage professional development programs."
          },
          career3: {
            title: "Career Services Director",
            description: "The user's comprehensive skill set in career development and industry insights makes them suitable for leadership roles in career services."
          }
        },
        createdAt: new Date()
      }
    ];

    // First, let's clean up the collection by removing the test data
    console.log('Cleaning up previous test data...');
    await collection.deleteMany({
      userId: { $in: ['user1', 'user2'] }
    });

    console.log('Attempting to insert analyses...');
    const result = await collection.insertMany(analyses);
    console.log(`Successfully inserted ${result.insertedCount} analyses`);
    console.log('Inserted IDs:', result.insertedIds);

    // Verify the insertion by reading back the data
    console.log('\nVerifying inserted data...');
    const count = await collection.countDocuments();
    console.log(`Total documents in collection: ${count}`);
    
    const insertedDocs = await collection.find({}).toArray();
    console.log('Inserted documents:', JSON.stringify(insertedDocs, null, 2));

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
    if (error.code === 13) {
      console.error('Authentication failed. Please check your MongoDB credentials.');
    } else if (error.code === 18) {
      console.error('Authentication failed. Please check your MongoDB credentials.');
    }
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the upload
console.log('Starting upload process...');
uploadAnalyses().catch(console.error); 