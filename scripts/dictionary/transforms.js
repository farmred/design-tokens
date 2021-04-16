const StyleDictionary = require('style-dictionary');
const Color = require('tinycolor2');

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

        StyleDictionary.registerTransform( {
            name: 'color/palette',
            type: 'value',
            matcher: function(prop) { 
                return prop.attributes.category === 'color';
            },
            transformer: function (prop) {
                let color = Color(prop.original.value).toRgb();
                return color.r + ' ' + color.g + ' ' + color.b;
            }
        });
    }
}
