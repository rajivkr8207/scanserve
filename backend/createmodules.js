import fs from 'fs';

export function makeModule(name) {
  const dir = `./src/modules/${name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const files = [
    `${name}.controller.ts`,
    `${name}.model.ts`,
    `${name}.route.ts`,
    `${name}.service.ts`,
    `${name}.validator.ts`,
  ];
  files.forEach((file) => {
    const path = `${dir}/${file}`;
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '');
    }
  });
}

// makeModule('menu');
