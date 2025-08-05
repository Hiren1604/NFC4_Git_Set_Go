const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database...\n');

    // Wait for connection to be established
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 All collections in database:');
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });

    console.log('\n📊 Checking each collection for data...\n');

    // Check each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`🔍 Checking collection: ${collectionName}`);
      
      try {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`   📈 Document count: ${count}`);
        
        if (count > 0) {
          // Get a few sample documents
          const samples = await db.collection(collectionName).find({}).limit(3).toArray();
          console.log(`   📄 Sample documents:`);
          samples.forEach((doc, i) => {
            console.log(`     ${i + 1}. ${JSON.stringify(doc, null, 2)}`);
          });
        }
      } catch (error) {
        console.log(`   ❌ Error reading collection ${collectionName}:`, error.message);
      }
      
      console.log('');
    }

    // Specifically check for issues
    console.log('🎯 Specifically checking for issues...');
    try {
      const issues = await db.collection('issues').find({}).toArray();
      console.log(`📊 Found ${issues.length} issues in 'issues' collection`);
      
      if (issues.length > 0) {
        issues.forEach((issue, index) => {
          console.log(`\n🔸 Issue #${index + 1}:`);
          console.log(`   ID: ${issue._id}`);
          console.log(`   Title: ${issue.title || 'No title'}`);
          console.log(`   Description: ${issue.description || 'No description'}`);
          console.log(`   Category: ${issue.category || 'No category'}`);
          console.log(`   Status: ${issue.status || 'No status'}`);
          console.log(`   Created: ${issue.createdAt || 'No date'}`);
          console.log(`   Reported By: ${issue.reportedBy || 'No reporter'}`);
          console.log(`   Assigned To: ${issue.assignedTo || 'Not assigned'}`);
        });
      }
    } catch (error) {
      console.log('❌ Error reading issues collection:', error.message);
    }

  } catch (error) {
    console.error('❌ Error debugging database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugDatabase(); 