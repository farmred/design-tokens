const { readdirSync } = require('fs');
const path = require('path');

module.exports = {
    getDirectories: function(source) {
        return readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    },
    getFileAndDirNames: function (source) {
        return readdirSync(source, { withFileTypes: true })
            .map(dirent => path.basename(dirent.name, ".json"));
    },
    getFiles: function(source) {
        return readdirSync(source, { withFileTypes: true })
            .map(dirent => dirent.name);
    }

};