// convex/auth.config.js

module.exports = [
  {
    type: "clerk",
    issuer: "https://popular-snail-8.clerk.accounts.dev",
    jwksUri: "https://popular-snail-8.clerk.accounts.dev/.well-known/jwks.json"
  },
  {
    type: "convex",
    domain: "https://cheery-bee-515.convex.cloud",
    applicationID: "convex"
  }
];
