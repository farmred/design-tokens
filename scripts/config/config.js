
const _ = require('lodash');
const fs = require('fs');
const utils = require('../utils');

module.exports = {

    platformConfig: function(platform, params) {
        let basedir = __dirname + "/" + platform;
        let subfiles = utils.getFiles(basedir);
       
        let sourcefiles = [
            "tokens/globals/**/*.json",
            `tokens/platforms/${platform}/*.json`
        ];

        let values = {};
        if(params.brand) {
            sourcefiles.push(`tokens/brands/${params.brand}/*.json`)
        } 
        values["source"] = sourcefiles;

        params["platform"] = platform;
        params["hasbrand"] = (params.brand) ? true : false;

        subfiles.map(function (subfile) {
            console.log("running template " + subfile);
            let template = _.template(fs.readFileSync(basedir + "/" + subfile));
            let jsonobj = JSON.parse(template(params));
            values = _.merge(values, jsonobj);
        })
        return values;
    },

    platforms: function(platform) {
        let basedir = __dirname + "/" + platform;
        let names = utils.getFileAndDirNames(basedir);
        return names.map(function(name) {
            if(name == 'index') {
                return platform;
            }
            return platform + "/" + name;
        });
    }

}