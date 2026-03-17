const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Force tất cả import @firebase/app dùng cùng 1 bundle (CJS)
// để tránh 2 registry khác nhau giữa firebase/app (ESM) và @firebase/auth RN (CJS)
const firebaseAppPath = path.resolve(
  __dirname,
  "node_modules/@firebase/app/dist/index.cjs.js"
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@firebase/app") {
    return { filePath: firebaseAppPath, type: "sourceFile" };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
