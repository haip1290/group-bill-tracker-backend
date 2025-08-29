const userToDto = (user) => ({ id: user.id, email: user.email });

module.exports = { userToDto };
