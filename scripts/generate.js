const StyleDictionaryPackage = require('style-dictionary');
const fs = require('fs');
const utils = require('./utils');
const { request } = require('http');
const _ = require('lodash');

const formats = require('./dictionary/formats'); 
const transforms = require('./dictionary/transforms');
const groups = require('./dictionary/groups');
const config = require('./config/config');


function getComponentStyleDictionaryConfig(brand, platform) {
    return {
        "source": [
            `tokens/brands/${brand}/*.json`,
            "tokens/globals/**/*.json",
            `tokens/platforms/${platform}/*.json`
        ],
        "platforms": {
            "web/scss": {
                "transformGroup": "tokens-scss",
                "buildPath": `src/brands/${brand}/`,
                "files": [
                    {
                        "destination": "tokens.scss",
                        "format": "custom/format/scss"
                    }
                ]
            },
            "web/js": {
                "transformGroup": "tokens-js",
                "buildPath": `dist/js/${brand}/`,
                "files": [
                    {
                        "destination": "tokens.es6.js",
                        "format": "javascript/es6"
                    }
                ]
            }
        }
    };
}


// if you want to see the available pre-defined formats, transforms and transform groups uncomment this
formats.registerFormats();
transforms.registerTransforms();
groups.registerTransformGroups();

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFERENT BRANDS AND PLATFORMS
const brandDir = require('path').resolve(__dirname, "../tokens/brands");
const brands = utils.getDirectories(brandDir);
const supportedPlatforms = ['web']; // TODO // ['web', 'ios', 'android']


brands.map(function (brand) {
    supportedPlatforms.map(function (platform) {

        console.log('\n==============================================');
        console.log(`\nProcessing: [${platform}] [${brand}]`);

        let params = { brand: brand };
        let configObj = config.platformConfig(platform, params);
        const StyleDictionary = StyleDictionaryPackage.extend(configObj);
        config.platforms(platform).map(function (platformName) {
            StyleDictionary.buildPlatform(platformName);
        });
        console.log('\nEnd processing');

    })
});

// global styles
supportedPlatforms.map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing Globals: [${platform}]`);

    let configObj = config.platformConfig(platform, {});
    const StyleDictionary = StyleDictionaryPackage.extend(configObj);
    config.platforms(platform).map(function (platformName) {
        StyleDictionary.buildPlatform(platformName);
    });
    console.log('\nEnd processing');
});

const componentsDir = require('path').resolve(__dirname, "../tokens/globals/components");
const components = utils.getFileAndDirNames(componentsDir);
console.log(" process these with a group? ");
console.log(components);
// TODO generate filter settings for config
// TODO generate components to src/components without brand? or put brand within component

console.log('\n==============================================');
console.log('\nBuild completed!');