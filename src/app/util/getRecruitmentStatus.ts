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

export const isBeforeRecruitmentStatus = (start: Date, end: Date) =>
  getRecruitmentStatus(start, end) === 'これから';

export const isRecruitingRecruitmentStatus = (start: Date, end: Date) =>
  getRecruitmentStatus(start, end) === 'うけつけ';

export const isClosingRecruitmentStatus = (start: Date, end: Date) =>
  getRecruitmentStatus(start, end) === 'しめきり';

export default getRecruitmentStatus;
