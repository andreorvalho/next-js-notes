const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

module.exports = (on, config) => {
  const resetDatabase = () => {
    return new Promise((resolve, reject) => {
      exec('npx prisma migrate reset --force', {
        env: process.env,
      }, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error resetting and seeding database: ${stderr}`);
          return reject(err);
        }
        console.log(`Database reset and seeded: ${stdout}`);
        resolve('Database reset successful');
      });
    });
  };

  // Reset database before running tests
  on('before:run', () => resetDatabase());

  // Add custom command for resetting test database
  on('task', {
    resetTestDatabase() {
      return resetDatabase();
    },
  });
};
