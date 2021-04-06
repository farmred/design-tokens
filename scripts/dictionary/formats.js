const fs = require('fs');
const StyleDictionary = require('style-dictionary');
const _ = require('lodash');

module.exports = {

    registerFormats: function () {

        // StyleDictionaryPackage.registerFormat({
        //     name: 'css/variables',
        //     formatter: function (dictionary, config) {
        //         return `${this.selector} {
        //     ${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
        //     }`
        //     }
        // });

        // with fallback values, see issue https://github.com/amzn/style-dictionary/issues/448
        StyleDictionary.registerFormat({
            name: 'custom/css/variables',
            formatter: function (dictionary, config) {
                return `${this.selector} {
                    ${dictionary.allProperties
                        .map((prop) => {
                            // let value = JSON.stringify(prop.value);
                            let value = prop.value;

                            if (config.outputReferences) {
                                if (dictionary.usesReference(prop.original.value)) {
                                    const reference = dictionary.getReference(prop.original.value);
                                    value = `var(--${reference.name}, ${prop.value})`;
                                }
                            }
                            return `  --${prop.name}: ${value};`;
                        })
                        .join('\n')}
                }`;
            },
        });

        StyleDictionary.registerFormat({
            name: 'custom/format/scss',
            formatter: _.template(fs.readFileSync(__dirname + '/../templates/web-scss.template'))
        });

        StyleDictionary.registerFormat({
            name: 'json/flat',
            formatter: function (dictionary) {
                return JSON.stringify(dictionary.allProperties, null, 2);
            }
        });
    }

};