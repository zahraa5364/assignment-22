import { compareHash, generateHash } from '../common/utils/security/hash.security';

describe('hash.security', () => {
  it('should hash a plain string and verify it correctly', async () => {
    const plain = 'MyP@ssw0rd123';
    const hashed = await generateHash(plain);

    expect(hashed).not.toBe(plain);

    const isMatch = await compareHash(plain, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await compareHash('wrong-password', hashed);
    expect(isWrongMatch).toBe(false);
  });
});
