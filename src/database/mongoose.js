const mongoose = require('mongoose');

// Filter out Node 18+ DEP0170 warning triggered by MongoDB driver multi-host URL parsing
process.on('warning', (warning) => {
  if (warning.code === 'DEP0170') return;
});

module.exports = {
  init: () => {
    try {
      mongoose.set('bufferCommands', false);
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        console.log('[Iconic Bot] No MONGODB_URI configured. Database running in memory mode.');
        return;
      }
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 2000
      }).then(() => {
        console.log('The Bot is connected to the Database');
      }).catch((err) => {
        console.warn('[Iconic Bot] MongoDB offline:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('The Bot is disconnected from the Database');
      });
      mongoose.connection.on('error', (err) => {
        console.warn('Database connection notice:', err.message);
      });
    } catch (e) {
      console.warn('[Iconic Bot] Database initialization notice:', e.message);
    }
  }
};
