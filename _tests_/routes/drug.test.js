/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import chai from 'chai';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import app from '../../src/index';
import connectToDb from '../../src/config/mongoose';

import Drugs from '../../src/models/drugs';

chai.use(require('chai-http'));

const { request, expect } = chai;

test('drug Routes Test', () => {
  describe('drug Routes Test', () => {
    before((done) => {
      connectToDb().then(() => {
        done();
      });
    });

    describe('# [GET] /api/drug/', () => {
      it('Should get a paginated drugs', async () => {
        const response = await request(app).get('/api/drug/').query({
          page: 1,
          limit: 10,
          name: 'example name',
          drugName: 'example drug name',
          maxPrice: 100,
          minPrice: 10,
          category: 'example category',
          pharmacyId: 'example pharmacy id',
          location: '12.3456,78.9012',
          status: 'example status',
        });

        expect(response).to.have.status(httpStatus.OK);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('tested model field');
      });
    });

    after((done) => {
      // Clean up test data for next run
      Users.deleteMany({})
        .exec()
        .then(() => {
          mongoose.connection.close();
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
