const convertToKana = (str: string) =>
  str.replace(/[\u30A1-\u30F6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60),
  );

export default convertToKana;
