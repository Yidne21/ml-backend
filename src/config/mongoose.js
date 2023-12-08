import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import * as environments from './environments';

const modelsPath = path.join(process.cwd(), 'src/models');

// Initialize all models in src/models directory

fs.readdirSync(modelsPath)
  .filter((dir) => dir.indexOf(''))
  // eslint-disable-next-line
  .forEach((dir) => require(path.join(modelsPath, dir)));

const connectToDb = async () => {
  try {
    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(environments.mongoUrl, connectOptions);

    if (environments.nodeEnv !== 'test') {
      // eslint-disable-next-line no-console
      console.info(`Mongo Connection Successfull`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Mongo Connection Failed`, error);
    throw error;
  }
};

export default connectToDb;
