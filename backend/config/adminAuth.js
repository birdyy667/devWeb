const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USER || 'admin',
  password: process.env.ADMIN_PASS || 'securepassword123'
};

module.exports = ADMIN_CREDENTIALS;
