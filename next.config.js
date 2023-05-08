module.exports = {
  async redirects() {
    return [
      {
        source: '/.well-known/did.json',
        destination: '/api/.well-known/did.json',
        permanent: true,
      }
    ];
  },
};