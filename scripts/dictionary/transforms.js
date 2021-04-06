const StyleDictionary = require('style-dictionary');

module.exports = {

    registerTransforms: function() {

        StyleDictionary.registerTransform({
            name: 'size/pxToPt',
            type: 'value',
            matcher: function (prop) {
                return prop.value.match(/^[\d\.]+px$/);
            },
            transformer: function (prop) {
                return prop.value.replace(/px$/, 'pt');
            }
        });

        StyleDictionary.registerTransform({
            name: 'size/pxToDp',
            type: 'value',
            matcher: function (prop) {
                return prop.value.match(/^[\d.]+px$/);
            },
            transformer: function (prop) {
                return prop.value.replace(/px$/, 'dp');
            }
        });
    }
}
