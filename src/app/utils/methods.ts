export function getRandomString() {
  const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
  const alphabetUpper = alphabetLower.toUpperCase();
  const numbers = "0123456789";
  const specials = "._-?~";

  const allChars = alphabetLower + alphabetUpper + numbers + specials;
  const maxLength = 12;
  let result = '';
  for (let i = 0; i < maxLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    result += allChars[randomIndex];
  }
  return result;
}