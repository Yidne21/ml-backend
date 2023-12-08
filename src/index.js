/* eslint-disable import/first */
import path from 'path';
// Initiate app root
global.appRoot = path.resolve(path.resolve());
import passport from 'passport';
import * as environments from './config/environments';
import connectToDb from './config/mongoose';
import app from './config/express';
import passportInit from './config/passport';
// import insertDummyData from './utils/seedDummyData';

// Init passport
passportInit(passport);

const start = async () => {
  if (!module.parent) {
    await connectToDb();

    // for (let i=0; i < 30; i++){
    //   insertDummyData()
    // }
    app.listen(environments.port, () => {
      // eslint-disable-next-line no-console
      console.log(
        `[${environments.nodeEnv}] Server running on localhost:${environments.port}`
      );
    });
  }
};
start();

// seed();
export default app;
