/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config, { isServer }) => {
    // Add specific handling for THREE.js files
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /three[\/\\]examples[\/\\]js/,
          use: 'babel-loader',
        },
      ],
    };
    
    // Exclude three.js from server-side builds
    if (isServer) {
      config.externals = [...(config.externals || []), 'three'];
    }
    
    return config;
  },
}

module.exports = nextConfig 