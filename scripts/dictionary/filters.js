const StyleDictionary = require('style-dictionary');

module.exports = {

    registerFilters: function () {
        StyleDictionary.registerFilter({
            name: 'color-filter',
            matcher: function (prop) {
                return prop.attributes.type == 'color' || prop.attributes.group == 'color' || prop.attributes.category == 'color';
            }
        });
    }
}