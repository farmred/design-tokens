
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const write = require('write');
const rimraf = require('rimraf');
const postcss = require('postcss');
const cssnano = require('cssnano');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const { constant } = require('lodash');
const utils = require('./utils');

function log(...args) {
    return console.log('📦', chalk.green(...args));
}

async function build(name, entryname) {
    
    const entrypoint = path.resolve(__dirname, '../src/' + entryname+'.scss');
    const cssDocsPath = path.resolve(__dirname, '../docs/static/assets/'+name+'.css');

    log('Starting ' +name+ ' CSS build...');
    log('Cleaning "dist/, docs/static/assets/' + name +'.css" folder...');

    rimraf.sync('dist', { disableGlob: true });
    if (fs.existsSync(cssDocsPath)) {
        fs.unlinkSync(cssDocsPath);
    }

    log('Compiling SCSS to CSS, entrypoint:', entrypoint);

    const compiledCSS = sass.renderSync({ file: entrypoint });

    log('Processing CSS: autoprefixer...');

    const autoprefixedCSS = await postcss([autoprefixer]).process(compiledCSS.css, { from: undefined });

    log('Processing CSS: cssnano...');

    const minifiedCSS = await postcss([cssnano]).process(autoprefixedCSS.css, { from: undefined });

    const cssPath = path.resolve(__dirname, '../dist/' + name +'.css');
    const cssminpath = path.resolve(__dirname, '../dist/' + name +'.min.css');

    log('Writing ' + name + '.css and ' + name +'.min.css files to dist/ and docs/ folders...');

    write(cssPath, autoprefixedCSS.css);
    write(cssminpath, minifiedCSS.css);
    write(cssDocsPath, autoprefixedCSS.css);

    log('Build done!');
}


build("farmred-design", "index");
build("farmred-design-docs", "index-docs");

const brandDir = require('path').resolve(__dirname, "../tokens/brands");
const brands = utils.getDirectories(brandDir);

brands.map(function(brand) {
    build(`${brand}-vars`, `variables/_${brand}`);
});

// TODO print out css link header in docs with the gnerated files?
