export const generateTokenPair = (userId: string) => {
  const issuedAt = new Date();
  const tokenExpAt = new Date();
  const refreshExpAt = new Date();
  tokenExpAt.setMinutes(tokenExpAt.getMinutes() + 15);
  refreshExpAt.setHours(refreshExpAt.getHours() + 24 * 7);
  const tokenPayload = {
    sub: userId.toString(),
    aud: 'SLMAPI',
    iss: 'SLMAPI',
    iat: Math.floor(issuedAt.getTime() / 1000),
    exp: Math.floor(tokenExpAt.getTime() / 1000),
  };
  const refreshTokenPayload = {
    sub: userId.toString(),
    aud: 'SLMAPI',
    iss: 'SLMAPI',
    iat: Math.floor(issuedAt.getTime() / 1000),
    exp: Math.floor(refreshExpAt.getTime() / 1000),
  };

  return {
    tokenPayload,
    refreshTokenPayload,
  };
};
