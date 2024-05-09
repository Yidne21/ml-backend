// import chai from 'chai';
// /* eslint-disable no-undef */
// import mongoose from 'mongoose';
// import httpStatus from 'http-status';
// import app from '../../../src/index';
// import connectToDb from '../../../src/config/mongoose';
// import Drug from '../../../src/models/drugs';

// chai.use(require('chai-http'));

// const { request, expect } = chai;

// describe('drug Routes Test', () => {
//   before((done) => {
//     connectToDb().then(() => {
//       done();
//     });
//   });

//   describe('# [GET] /api/drug/', () => {
//     // un comment the code below add modify for your test conditions
//     it('Should get all drug', async () => {
//       const response = await request(app).get('/api/drug/').query({
//         page: 1,
//         limit: 10,
//       });

//       expect(response).to.have.status(httpStatus.OK);
//       expect(response.body).to.be.an('object');
//       expect(response.body).to.have.property('tested model field');
//     });
//   });

//   after((done) => {
//     // Clean up test data for next run
//     Users.deleteMany({})
//       .exec()
//       .then(() => {
//         mongoose.connection.close();
//         done();
//       })
//       .catch((err) => {
//         throw err;
//       });
//   });
// });
