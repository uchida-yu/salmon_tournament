const isCloseTournament = (eventEndDate: Date) => {
  const now = new Date();
  return now.getTime() > eventEndDate.getTime();
};

export default isCloseTournament;
