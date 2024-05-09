const validNewUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'Password@123',
  phoneNumber: '251912345678',
  role: 'customer',
};

const validNewPharmacist = {
  name: 'Alice Smith',
  email: 'alice.smith@example.com',
  password: 'Pass1234',
};

const validNewAdmin = {
  name: 'Admin User',
  email: 'admin@gmail.com',
  role: 'admin',
};

const missingName = {
  email: 'john.doe@example.com',
  password: 'Password@123',
};

const missingEmail = {
  name: 'John Doe',
  password: 'Password@123',
};

const invalidEmail = {
  name: 'John Doe',
  email: 'john.doe.example.com',
  password: 'Password@123',
};

const duplicateEmail = {
  name: 'John abebe',
  email: 'john.doe@example.com',
  password: 'abebeJo@123',
  phoneNumber: '251911345678',
  role: 'customer',
};

const missingPassword = {
  name: 'John Doe',
  email: 'john.doe1@example.com',
};

const invalidPassword = {
  name: 'John Doe',
  email: 'john.doe2@example.com',
  password: 'pass', // less than 4 characters
};

const invalidRole = {
  name: 'John Doe',
  email: 'john.doe3@example.com',
  password: 'Password@123',
  role: 'guest', // invalid role
};

const validUserUpdate = {
  name: 'Updated Name',
  phoneNumber: '251912345678',
  avatar: 'https://example.com/avatar.jpg',
  coverPhoto: 'https://example.com/cover.jpg',
  status: 'active',
};

const invalidPhoneNumber = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'Password@123',
  role: 'customer',
  phoneNumber: '123456789', // invalid phone number
};

const invalidAvatarUrl = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'Password@123',
  role: 'customer',
  avatar: 'not_a_url', // invalid URL
};

const invalidCoverPhotoUrl = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'Password@123',
  role: 'customer',
  coverPhoto: 'not_a_url', // invalid URL
};

const validLoginCredentials = {
  email: 'john.doe@example.com',
  password: 'Password@123',
};

const invalidLoginCredentials = {
  email: 'john.doe@example.com',
  password: 'pass', // invalid password
};

const validSetPasswordRequest = {
  email: 'john.doe@example.com',
  password: 'NewPass123',
  token: 'valid_reset_token',
};

const invalidSetPasswordRequest = {
  email: 'john.doe@example.com',
  password: 'pas', // invalid password
  token: 'invalid_reset_token',
};

const validRefreshTokenRequest = {
  refreshToken: 'valid_refresh_token',
};

const invalidRefreshTokenRequest = {
  refreshToken: 'invalid_refresh_token',
};

const validSendOTPRequest = {
  email: 'john.doe@example.com',
  type: 'forgot',
};

const invalidSendOTPRequest = {
  email: 'john.doe@example.com',
  type: 'invalid_type',
};

const validVerifyOTPRequest = {
  email: 'john.doe@example.com',
  code: '123456',
};

const invalidVerifyOTPRequest = {
  email: 'john.doe@example.com',
  code: 123456, // code should be string
};

const validResetPasswordRequest = {
  email: 'john.doe@example.com',
  newPassword: 'NewPass123',
};

const invalidResetPasswordRequest = {
  email: 'john.doe@example.com',
  newPassword: 'pas', // invalid password
};

export {
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
};
