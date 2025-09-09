const userToDto = (user) => ({ id: user.id, email: user.email });
const activityToDto = (activity) => ({
  id: activity.id,
  name: activity.name,
  totalCost: activity.totalCost,
  participants: activity.participants.map(participantToDto),
});
const participantToDto = (participant) => ({
  id: participant.id,
  amount: participant.amount,
  email: participant.account.email,
});
module.exports = { userToDto, activityToDto };
