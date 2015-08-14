/**
 * @author nttdocomo
 */
var http = require("http"),
fs = require('fs'),
moment = require('moment'),
path = require('path'),
connection = require("./db"),
mysql = require('mysql'),
_ = require('underscore');
trim = function(text){
	return text.replace(/^\s+(.*?)\s+$/,'$1');
},
difference = function(template, override) {
    var ret = {};
    for (var name in template) {
        if (name in override) {
            if (_.isObject(override[name]) && !_.isArray(override[name])) {
                var diff = difference(template[name], override[name]);
                if (!_.isEmpty(diff)) {
                    ret[name] = diff;
                }
            } else if (!_.isEqual(template[name], override[name])) {
                ret[name] = override[name];
            }
        }
    }
    return ret;
};
module.exports.trim = trim;
module.exports.difference = difference;