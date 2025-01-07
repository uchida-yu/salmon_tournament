const getRecruitmentStatus = (start: Date, end: Date) => {
  const now = new Date();
  if (now.getTime() < start.getTime()) {
    return 'これから';
  }
  if (now.getTime() > end.getTime()) {
    return 'しめきり';
  }
  return 'うけつけ';
};
export default getRecruitmentStatus;
