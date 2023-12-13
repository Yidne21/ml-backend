/* eslint-disable import/prefer-default-export */
export function clean() {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.__v;
  // Delete other sensetive fields like this
  return userObj;
}
