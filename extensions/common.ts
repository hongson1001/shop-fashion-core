export function randomString(size: number, lowerCase = false): string {
  const chars = lowerCase
    ? 'abcdefghijklmnopqrstuvwxyz'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomPassword(): string {
  const passwordBuilder = [];
  passwordBuilder.push(randomString(4, true));
  passwordBuilder.push(randomNumber(1000, 9999).toString());
  passwordBuilder.push(randomString(2));
  return passwordBuilder.join('');
}
