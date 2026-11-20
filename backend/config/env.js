function readConfig(env = process.env) {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');
  const port = Number(env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
  return { mongoUri: env.MONGODB_URI, jwtSecret: env.JWT_SECRET, port };
}
function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');
  return secret;
}
module.exports = { readConfig, jwtSecret };
