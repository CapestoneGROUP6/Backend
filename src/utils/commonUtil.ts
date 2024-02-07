export function generate4DigitPassword(): number {
  let password = "";

  for (let i = 0; i < 4; i++) {
    const digit = Math.floor(Math.random() * 10);
    password += digit.toString();
  }

  return Number(password);
}
