const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

module.exports = (on, config) => {
  const resetDatabase = () => {
    return new Promise((resolve, reject) => {
      // Reset the database - this will apply migrations and generate the Prisma client
      exec('NODE_ENV=test npx dotenv-cli -e .env.test -- npx prisma migrate reset --force', {
        env: process.env,
        cwd: path.resolve(__dirname, '../..'),
      }, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error resetting database: ${stderr}`);
          return reject(err);
        }

        // Ensure Prisma client is generated (migrate reset should do this, but we ensure it)
        exec('NODE_ENV=test npx dotenv-cli -e .env.test -- npx prisma generate', {
          env: process.env,
          cwd: path.resolve(__dirname, '../..'),
        }, (genErr, genStdout, genStderr) => {
          if (genErr) {
            console.error(`Error generating Prisma client: ${genStderr}`);
            return reject(genErr);
          }

          // Always run seed explicitly to ensure it runs with the correct environment
          // Run the seed script directly from package.json since prisma.config.ts doesn't have seed configured
          exec('NODE_ENV=test npx dotenv-cli -e .env.test -- node -r ts-node/register/transpile-only -r tsconfig-paths/register prisma/seed.ts', {
            env: process.env,
            cwd: path.resolve(__dirname, '../..'),
          }, (seedErr, seedStdout, seedStderr) => {
            if (seedErr) {
              console.error(`Error running seed: ${seedStderr}`);
              return reject(seedErr);
            }
            resolve('Database reset and seeded successfully');
          });
        });
      });
    });
  };

  // Add custom commands for database operations
  on('task', {
    resetTestDatabase() {
      return resetDatabase();
    },
  });
};
