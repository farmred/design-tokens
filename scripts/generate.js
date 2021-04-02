const StyleDictionaryPackage = require('style-dictionary');
const fs = require('fs');
const _ = require('lodash');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

function getStyleDictionaryConfig(brand, platform) {
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
            },
            "styleguide": {
                "transformGroup": "styleguide",
                "buildPath": `dist/design-tokens/`,
                "prefix": "token",
                "files": [
                    {
                        "destination": `${platform}_${brand}.json`,
                        "format": "json/flat"
                    },
                    {
                        "destination": `${platform}_${brand}.scss`,
                        "format": "scss/variables"
                    }
                ]
            },
            "android": {
                "transformGroup": "android",
                "buildPath": `dist/android/${brand}/`,
                "files": [{
                    "destination": "tokens.colors.xml",
                    "format": "android/colors"
                }, {
                    "destination": "tokens.dimens.xml",
                    "format": "android/dimens"
                }, {
                    "destination": "tokens.font_dimens.xml",
                    "format": "android/fontDimens"
                }]
            },
            "ios": {
                "transformGroup": "ios",
                "buildPath": `dist/ios/${brand}/`,
                "files": [{
                    "destination": "tokens.h",
                    "format": "ios/macros"
                }]
            }
        }
    };
}


// if you want to see the available pre-defined formats, transforms and transform groups uncomment this
// console.log(StyleDictionaryPackage);

StyleDictionaryPackage.registerTransform({
    name: 'size/pxToPt',
    type: 'value',
    matcher: function (prop) {
        return prop.value.match(/^[\d\.]+px$/);
    },
    transformer: function (prop) {
        return prop.value.replace(/px$/, 'pt');
    }
});

StyleDictionaryPackage.registerTransform({
    name: 'size/pxToDp',
    type: 'value',
    matcher: function (prop) {
        return prop.value.match(/^[\d.]+px$/);
    },
    transformer: function (prop) {
        return prop.value.replace(/px$/, 'dp');
    }
});

StyleDictionaryPackage.registerTransformGroup({
    name: 'tokens-js',
    transforms: ["name/cti/constant", "size/px", "color/hex"]
});

StyleDictionaryPackage.registerFormat({
    name: 'json/flat',
    formatter: function (dictionary) {
        return JSON.stringify(dictionary.allProperties, null, 2);
    }
});


StyleDictionaryPackage.registerFormat({
    name: 'custom/format/scss',
    formatter: _.template(fs.readFileSync(__dirname + '/templates/web-scss.template'))
});

StyleDictionaryPackage.registerTransformGroup({
    name: 'styleguide',
    transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"]
});


StyleDictionaryPackage.registerTransformGroup({
    name: 'tokens-json',
    transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"]
});

StyleDictionaryPackage.registerTransformGroup({
    name: 'tokens-scss',
    // to see the pre-defined "scss" transformation use: console.log(StyleDictionaryPackage.transformGroup['scss']);
    transforms: ["name/cti/kebab", "time/seconds", "size/px", "color/css"]
});

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

// ['web', 'ios', 'android'].map(function (platform) {

// TODO load brands from a config file
// TODO debug brands
// TODO include file in brands dir
// TODO build loop through brands as well, shared script?

['studio', 'comics', 'blogs'].map(function (brand) {
    ['web'].map(function (platform) {

        console.log('\n==============================================');
        console.log(`\nProcessing: [${platform}] [${brand}]`);

        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand, platform));
        if (platform === 'web') {
            StyleDictionary.buildPlatform('web/js');
            StyleDictionary.buildPlatform('web/scss');
        } else {
            StyleDictionary.buildPlatform(platform);
        }
        StyleDictionary.buildPlatform('styleguide');
        console.log('\nEnd processing');

    })
})

console.log('\n==============================================');
console.log('\nBuild completed!');