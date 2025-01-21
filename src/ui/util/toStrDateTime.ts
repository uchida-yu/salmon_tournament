const toStrDateTime = (date: Date) =>
  `${date.toLocaleDateString()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

export default toStrDateTime;
