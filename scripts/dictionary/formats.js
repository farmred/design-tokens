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

        // TODO look into this https://github.com/amzn/style-dictionary/issues/261
        // https://github.com/amzn/style-dictionary/tree/main/examples/advanced/component-cti
        // https://github.com/dbanksdesign/sd-theme-example
        StyleDictionary.registerFormat({
            name: 'css/components',
            formatter: function (dictionary, config) {
                return Object.keys(dictionary.properties).map(function (key3) {

                    // Outputs component properties
                    if (key3 === 'component') {
                        return Object.keys(dictionary.properties.component).map(function (key) {
                            return `--component-${key}: {\n` +
                                Object.keys(dictionary.properties.component[key]).map(function (key2) {
                                    let prop = dictionary.properties.component[key][key2];
                                    return `\t${key2}: ${prop.value};`;
                                }).join('\n') +
                                '\n}\n'
                        }).join('\n');

                        // Outputs token properties
                    } else {
                        return variablesWithPrefix(' --', dictionary.allProperties) + '\n';
                    }
                }).join('\n');
            }
        });

        StyleDictionary.registerFormat({
            name: 'custom/format/scss',
            formatter: _.template(fs.readFileSync(__dirname + '/../templates/web-scss.template'))
        });

        StyleDictionary.registerFormat({
            name: 'custom/markdown/colors',
            formatter: _.template(fs.readFileSync(__dirname + '/../templates/markdown-color.template'))
        });

        StyleDictionary.registerFormat({
            name: 'json/flat',
            formatter: function (dictionary) {
                return JSON.stringify(dictionary.allProperties, null, 2);
            }
        });
    }

};