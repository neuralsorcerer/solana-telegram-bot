import cronParser from "cron-parser";

export function validateAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0;
}

export function validateCronExpression(expression: string): boolean {
  try {
    cronParser.parseExpression(expression);
    return true;
  } catch {
    return false;
  }
}
