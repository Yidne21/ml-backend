/* eslint-disable no-undef */
import chai from 'chai';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import app from '../../../src/index';
import connectToDb from '../../../src/config/mongoose';
import Users from '../../../src/models/users';
import {
  validNewUser,
  validNewPharmacist,
  validNewAdmin,
  missingName,
  missingEmail,
  invalidEmail,
  missingPassword,
  invalidPassword,
  invalidRole,
  validUserUpdate,
  invalidPhoneNumber,
  invalidAvatarUrl,
  invalidCoverPhotoUrl,
  validLoginCredentials,
  invalidLoginCredentials,
  validSetPasswordRequest,
  invalidSetPasswordRequest,
  validRefreshTokenRequest,
  invalidRefreshTokenRequest,
  validSendOTPRequest,
  invalidSendOTPRequest,
  validVerifyOTPRequest,
  invalidVerifyOTPRequest,
  validResetPasswordRequest,
  invalidResetPasswordRequest,
  duplicateEmail,
} from './userTestCase';

chai.use(require('chai-http'));

const { request, expect } = chai;

describe('User Routes Test', () => {
  before((done) => {
    connectToDb().then(() => {
      done();
    });
  });

  describe('# [POST] /api/user/signUp', () => {
    it('Should create a new user with role customer send otp to users email', async () => {
      const response = await request(app)
        .post('/api/user/signUp')
        .send(validNewUser);

      const { success } = response.body;

      expect(response).to.have.status(httpStatus.OK);
      expect(response.body).to.be.an('object');
      expect(success).to.equal(true);
    });

    it('Should return a status of 409 [Conflict] when an existing E-mail is used to sign up', async () => {
      const response = await request(app)
        .post('/api/user/signUp')
        .send(duplicateEmail);
      expect(response).to.have.status(httpStatus.CONFLICT);
    });

    it('Should return a status of 400 [BAD REQUEST] when email type is invalid', async () => {
      const response = await request(app)
        .post('/api/user/signUp')
        .send(invalidEmail);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });

    it('Should return a status of 400 [BAD REQUEST] when name is not provided', async () => {
      const response = await request(app)
        .post('/api/user/signUp')
        .send(missingName);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });

    it('Should return a status of 400 [BAD REQUEST] when password is not provided', async () => {
      const response = await request(app)
        .post('/api/user/signUp')
        .send(missingPassword);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });

    it('Should return a status of 400 [BAD REQUEST] when password is length is too short', async () => {
      const response = await request(app)
        .post('/api/user/signUp')
        .send(missingPassword);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });
  });

  describe('# [POST] /api/user/login', () => {
    it('Should login user', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send(validLoginCredentials);
      expect(response).to.have.status(httpStatus.OK);
      expect(response.body).to.be.an('object');
    });

    it('Should return a status of 401 [UNAUTHORIZED] when login credentials are invalid', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send(invalidLoginCredentials);
      expect(response).to.have.status(httpStatus.UNAUTHORIZED);
    });
  });

  describe('# [POST] /api/user/refresh-token', () => {
    it('Should return a status of 401 [UNAUTHORIZED] when refresh token is invalid', async () => {
      const response = await request(app)
        .post('/api/user/refresh-token')
        .send(invalidRefreshTokenRequest);
      expect(response).to.have.status(httpStatus.UNAUTHORIZED);
    });
  });

  describe('# [POST] /api/user/reset-password', () => {
    it('should return 401 [UNAUTHORIZED] when there is not valid otp', async () => {
      const response = await request(app)
        .post('/api/user/reset-password')
        .send(validResetPasswordRequest);
      expect(response).to.have.status(httpStatus.UNAUTHORIZED);
    });

    it('Should return a status of 400 [BAD REQUEST] when password is invalid', async () => {
      const response = await request(app)
        .post('/api/user/reset-password')
        .send(invalidResetPasswordRequest);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });
  });

  describe('# [POST] /api/user/pharmacist', () => {
    it('Should return a status of 400 [BAD REQUEST] when file is not uploaded', async () => {
      const response = await request(app)
        .post('/api/user/pharmacist')
        .send(validNewPharmacist);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });
  });

  describe('# [POST] /api/user/admin', () => {
    it('Should return a status of 400 [BAD REQUEST] when role is invalid', async () => {
      const response = await request(app)
        .post('/api/user/admin')
        .send(invalidRole);
      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });
  });

  describe('# [GET] /api/user', () => {
    it('Should get all users', async () => {
      const response = await request(app).get('/api/user');
      expect(response).to.have.status(httpStatus.OK);
    });
  });

  after((done) => {
    // Clean up test data for next run
    Users.deleteMany({ email: validNewUser.email })
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
