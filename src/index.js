const { readdir, readFile } = require('fs').promises;
const { resolve, basename } = require('path');
const semverMinVersion = require('semver/ranges/min-version')
const semverLte = require('semver/functions/lte')


async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

let [nodeDir, scriptPath, modulesPath] = process.argv;

if (!modulesPath) {
  console.error("Must provide a path to a node_modules folder");
}

getFiles(modulesPath).then( async (ents) => {
  let minVersion = null;
  let packages = ents.filter(ent => basename(ent) === "package.json")

  for (path of packages) {
    let content = await readFile(path, {
      encoding: "utf-8"
    });

    // Could probably make a quicker check before parsing
    let json = JSON.parse(content);

    if (json && json.engines && json.engines.node) {
      let min = semverMinVersion(json.engines.node)
      if (!minVersion) {
        minVersion = min;
      } else if (semverLte(minVersion, min)) {
        minVersion = min;
      }
    }
  }

  if (minVersion) {
    console.log(minVersion.raw)
  } else if (package.length === 0) {
    console.log("No packages define minimum node version");
  } else {
    console.log("Unable to determine minimum version");
  }
})