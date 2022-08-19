# Min Node Version

Looks at all package.json files in a `node_modules` folder and uses [`node-semver`](https://github.com/npm/node-semver) to determine the minimum node version required for this set of packages.

# Install

```
npm install
```

# Run

```
node src/index.js ../my-project/node_modules
```