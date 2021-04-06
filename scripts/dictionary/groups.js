const StyleDictionary = require('style-dictionary');

module.exports = {
    registerTransformGroups: function() {
        StyleDictionary.registerTransformGroup({
            name: 'tokens-js',
            transforms: ["name/cti/constant", "size/px", "color/hex"]
        });

        StyleDictionary.registerTransformGroup({
            name: 'styleguide',
            transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"]
        });

        StyleDictionary.registerTransformGroup({
            name: 'tokens-json',
            transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"]
        });

        StyleDictionary.registerTransformGroup({
            name: 'tokens-scss',
            // to see the pre-defined "scss" transformation use: console.log(StyleDictionaryPackage.transformGroup['scss']);
            transforms: ["name/cti/kebab", "time/seconds", "size/px", "color/css"]
        });
    }

};