
# Overview 

Design tokens for the various projects that (http://www.farm.red) dabbles in. Most of them are just for fun and experimentation.

This uses [styledictionary](https://github.com/amzn/style-dictionary) to create the css and token files

There are scripts to process the json output as well.

## Getting started

* `nave auto`
* `npm install`
* `npm run build`

## Install 

`npm install design-tokens`

## Developing

CSS is compiled to (farmred-design.css) and minified CSS version (farmred-design.min.css).

Only the components that get imported into src/index.scss will be compiled into dist/farmred-design.css.
 
All components are generated to src/ as scss files and can be used individually.