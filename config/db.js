const mongoose = require('mongoose');

const uri = 'mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.moh8yzd.mongodb.net/';

mongoose.connect(uri, {
  retryWrites: true,
  w: 'majority',
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });



