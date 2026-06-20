import * as bcrypt from 'bcryptjs';


export const generateHash = async (plainText: string, saltRounds = 10): Promise<string> => {
  return bcrypt.hash(plainText, saltRounds);
};


export const compareHash = async (plainText: string, hashedText: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedText);
};
