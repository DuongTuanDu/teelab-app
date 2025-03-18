const chalk = require("chalk");
const { readFile, writeFile, copyFile, mkdir } = require("fs").promises;
const { existsSync } = require("fs");

console.log(chalk.green("here"));

function log(...args) {
  console.log(chalk.yellow("[react-native-maps]"), ...args);
}

async function reactNativeMaps() {
  log(
    "📦 Creating web compatibility of react-native-maps using an empty module loaded on web builds"
  );

  const modulePath = "node_modules/react-native-maps";
  const libPath = `${modulePath}/lib`;

  // Tạo thư mục 'lib' nếu chưa tồn tại
  if (!existsSync(libPath)) {
    await mkdir(libPath, { recursive: true });
    log("📁 Created 'lib' folder");
  }

  // Tạo file index.web.js
  await writeFile(`${libPath}/index.web.js`, "module.exports = {}", "utf-8");
  log("✅ Created index.web.js");

  // Sao chép file index.d.ts sang index.web.d.ts nếu có
  const indexDtsPath = `${libPath}/index.d.ts`;
  if (existsSync(indexDtsPath)) {
    await copyFile(indexDtsPath, `${libPath}/index.web.d.ts`);
    log("✅ Copied index.d.ts to index.web.d.ts");
  }

  // Cập nhật package.json
  const pkgPath = `${modulePath}/package.json`;
  const pkg = JSON.parse(await readFile(pkgPath));
  pkg["react-native"] = "lib/index.js";
  pkg["main"] = "lib/index.web.js";
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
  log("✅ Updated package.json");

  log("🚀 Script ran successfully");
}

reactNativeMaps().catch((error) => console.error(chalk.red(error)));
