/**
 * @author nttdocomo
 */
var http = require("http"),
fs = require('fs'),
moment = require('moment'),
path = require('path'),
connection = require("./db"),
mysql = require('mysql'),
_ = require('underscore'),
maxInterval = 20000,
minInterval = 2000;
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
module.exports.randomIntrvl = function(min, max) {
    var minInterval = min ? min : 2000,
    maxInterval = max ? max : 20000,
    interval = Math.floor(Math.random()*maxInterval);
    if(interval < minInterval){
        interval = minInterval;
    }
    return interval;
};