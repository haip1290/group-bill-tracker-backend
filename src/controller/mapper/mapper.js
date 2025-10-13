const userToDto = (user) => ({ id: user.id, email: user.email });
const activityToDto = (activity) => ({
  id: activity.id,
  date: activity.date,
  name: activity.name,
  totalCost: activity.totalCost,
  isFullyPaid: activity.isFullyPaid,
  participants: activity.participants.map(participantToDto),
});
const participantToDto = (participant) => ({
  id: participant.id,
  amount: participant.amount,
  email: participant.account?.email,
  accountId: participant.accountId,
  activityId: participant.activityId,
});
module.exports = { userToDto, activityToDto, participantToDto };
