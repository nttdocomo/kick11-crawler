String.prototype._formatRegExp = /\{(\d+)\}/gm;
String.prototype.format = function() {
  var replacements = arguments;
  return this.replace(this._formatRegExp, function(string, match) {
    return replacements[parseInt(match)];
  });
};
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.trim = function() {
  return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
};
String.prototype.toShortName = function() {
  var name = jQuery.trim(this);
  var names = name.split(" ");
  if (names.length == 1) {
    return name;
  }
  var result = [];
  for (var i = 0; i < names.length - 1; i++) {
    result.push(names[i].charAt(0) + ". ");
  }
  result.push(names[names.length - 1]);
  return result.join("");
};
String.prototype.bool = function() {
  return (/^true$/i).test(this);
};
String.prototype.capitaliseFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.lowercaseFirstLetter = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
};
String.prototype.removeLowercaseLetters = function() {
  return this.replace(/[^A-Z%]/g, "");
};
String.prototype.insertSpacesBetweenWords = function() {
  return this.replace(/([a-z])([A-Z])/g, "$1 $2");
};
String.prototype.containsLowercaseLetters = function() {
  return /[a-z]/.exec(this) !== null;
};
String.prototype.removeWhiteSpace = function() {
  return this.replace(/ /g, "");
};

function areStringsTooSimilar(str1, str2) {
  return str1.toLowerCase().removeWhiteSpace() === str2.toLowerCase().removeWhiteSpace();
}
if (!Array.prototype.map) {
  Array.prototype.map = function(fun) {
    var len = this.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }
    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        res[i] = fun.call(thisp, this[i], i, this);
      }
    }
    return res;
  };
}
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun) {
    var len = this.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        var val = this[i];
        if (fun.call(thisp, val, i, this)) {
          res.push(val);
        }
      }
    }
    return res;
  };
}
if (!Array.prototype.every) {
  Array.prototype.every = function(fun) {
    var len = this.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this && !fun.call(thisp, this[i], i, this)) {
        return false;
      }
    }
    return true;
  };
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun) {
    var len = this.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        fun.call(thisp, this[i], i, this);
      }
    }
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement) {
    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n !== n) {
        n = 0;
      } else {
        if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}
Array.prototype.subtract = function(a, fun, scope) {
  return this.filter(function(e) {
    return a.every(function(ae) {
      return fun ? fun.call(scope, e, ae) : e != ae;
    });
  });
};
Array.prototype.hashtable = function() {
  var l = this.length >>> 0,
      result = {};
  if (0 == l) {
    return result;
  }
  var mapFn = arguments[0];
  if (typeof mapFn == "function") {
    for (var i = 0; i < l; i++) {
      result[mapFn(this[i])] = this[i];
    }
  } else {
    for (var i = 0; i < l; i++) {
      result[this[i]] = this[i];
    }
  }
  return result;
};
Array.prototype.indextable = function() {
  var l = this.length >>> 0,
      result = {};
  if (0 == l) {
    return result;
  }
  var mapFn = arguments[0];
  if (typeof mapFn == "function") {
    for (var i = 0; i < l; i++) {
      result[mapFn(this[i])] = i;
    }
  } else {
    for (var i = 0; i < l; i++) {
      result[this[i]] = i;
    }
  }
  return result;
};
Array.prototype.max = function() {
  var max = this[0];
  var len = this.length;
  for (var i = 1; i < len; i++) {
    if (this[i] > max) {
      max = this[i];
    }
  }
  return max;
};
Array.prototype.min = function() {
  var min = this[0];
  var len = this.length;
  for (var i = 1; i < len; i++) {
    if (this[i] < min) {
      min = this[i];
    }
  }
  return min;
};
Array.prototype.sum = function() {
  for (var i = 0, len = this.length, sum = 0; i < len; sum += this[i++]) {}
  return sum;
};
Array.prototype.take = function(count) {
  var result = [];
  if (!count) {
    return result;
  }
  if (this.length < count) {
    return result;
  }
  for (var i = 0; i < count; i++) {
    result.push(this[i]);
  }
  return result;
};
Array.prototype.where = function(criteria) {
  var result = [];
  if (!criteria) {
    return this;
  }
  for (var i = 0; i < this.length; i++) {
    if (criteria(this[i])) {
      result.push(this[i]);
    }
  }
  return result;
};
Array.prototype.addArray = function(array) {
  if (!array) {
    return this;
  }
  if (0 == array.length) {
    return this;
  }
  for (var i = 0; i < array.length; i++) {
    this.push(array[i]);
  }
  return this;
};
Array.prototype.contains = function(item) {
  return this.indexOf(item) >= 0;
};
Date.prototype.toTimeStr = function() {
  return this.toTimeString().substr(0, 5);
};
Date.prototype.toDateStr = function() {
  var s = this.toDateString();
  return s.substr(0, s.length - 5);
};
Date.prototype.toLocal = function(timezoneOffset) {
  return new Date((this.valueOf() + (timezoneOffset || 0) * 60000));
};
Date.prototype.getWeek = function() {
  var target = new Date(this.valueOf());
  var dayNr = (this.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  var jan4 = new Date(target.getFullYear(), 0, 4).getStartOfWeek();
  var dayDiff = (target - jan4) / 86400000;
  var weekNr = 1 + Math.floor(dayDiff / 7);
  return weekNr;
};
Date.prototype.getWeekYear = function() {
  var target = new Date(this.valueOf());
  target.setDate(target.getDate() - ((this.getDay() + 6) % 7) + 3);
  return target.getFullYear();
};
Date.prototype.getStartOfWeek = function() {
  var target = new Date(this.valueOf());
  target.setDate(target.getDate() - (6 + target.getDay()) % 7);
  return target;
};
Date.prototype.getEndOfWeek = function() {
  var target = new Date(this.valueOf());
  target.setDate(target.getDate() + (6 - (6 + target.getDay()) % 7));
  return target;
};
Date.prototype.getEndOfMonth = function() {
  return new Date(this.getFullYear(), this.getMonth(), Date.daysInMonth[this.getMonth()]);
};
Date.prototype.getStartOfMonth = function() {
  return new Date(this.getFullYear(), this.getMonth(), 1);
};
Date.parseWeek = function(s) {
  var y = s.substr(0, 4) >>> 0,
      w = s.substr(5, 2) >>> 0,
      date = new Date(y, 0, 4);
  date.setDate(date.getDate() - ((6 + date.getDay()) % 7) + ((w - 1) * 6));
  return date;
};
Date.prototype.addDays = function(days) {
  this.setDate(this.getDate() + days);
};
/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 */
Date.parseFunctions = {
  count: 0
};
Date.parseRegexes = [];
Date.formatFunctions = {
  count: 0
};
Date.prototype.dateFormat = function(format, ignore_offset) {
  if (Date.formatFunctions[format] == null) {
    Date.createNewFormat(format);
  }
  var func = Date.formatFunctions[format];
  if (ignore_offset || !this.offset) {
    return this[func]();
  } else {
    return (new Date(this.valueOf() - this.offset))[func]();
  }
};
Date.createNewFormat = function(format) {
  var funcName = "format" + Date.formatFunctions.count++;
  Date.formatFunctions[format] = funcName;
  var code = "Date.prototype." + funcName + " = function(){return ";
  var special = false;
  var ch = "";
  for (var i = 0; i < format.length; ++i) {
    ch = format.charAt(i);
    if (!special && ch == "\\") {
      special = true;
    } else {
      if (special) {
        special = false;
        code += "'" + String.escape(ch) + "' + ";
      } else {
        code += Date.getFormatCode(ch);
      }
    }
  }
  eval(code.substring(0, code.length - 3) + ";}");
};
Date.getFormatCode = function(character) {
  switch (character) {
  case "d":
    return "String.leftPad(this.getDate(), 2, '0') + ";
  case "D":
    return "Date.dayNames[this.getDay()].substring(0, 3) + ";
  case "j":
    return "this.getDate() + ";
  case "l":
    return "Date.dayNames[this.getDay()] + ";
  case "S":
    return "this.getSuffix() + ";
  case "w":
    return "this.getDay() + ";
  case "z":
    return "this.getDayOfYear() + ";
  case "W":
    return "this.getWeekOfYear() + ";
  case "F":
    return "Date.monthNames[this.getMonth()] + ";
  case "m":
    return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
  case "M":
    return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
  case "n":
    return "(this.getMonth() + 1) + ";
  case "t":
    return "this.getDaysInMonth() + ";
  case "L":
    return "(this.isLeapYear() ? 1 : 0) + ";
  case "Y":
    return "this.getFullYear() + ";
  case "y":
    return "('' + this.getFullYear()).substring(2, 4) + ";
  case "a":
    return "(this.getHours() < 12 ? 'am' : 'pm') + ";
  case "A":
    return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
  case "g":
    return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
  case "G":
    return "this.getHours() + ";
  case "h":
    return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
  case "H":
    return "String.leftPad(this.getHours(), 2, '0') + ";
  case "i":
    return "String.leftPad(this.getMinutes(), 2, '0') + ";
  case "s":
    return "String.leftPad(this.getSeconds(), 2, '0') + ";
  case "O":
    return "this.getGMTOffset() + ";
  case "T":
    return "this.getTimezone() + ";
  case "Z":
    return "(this.getTimezoneOffset() * -60) + ";
  default:
    return "'" + String.escape(character) + "' + ";
  }
};
Date.parseDate = function(input, format) {
  if (Date.parseFunctions[format] == null) {
    Date.createParser(format);
  }
  var func = Date.parseFunctions[format];
  return Date[func](input);
};
Date.createParser = function(format) {
  var funcName = "parse" + Date.parseFunctions.count++;
  var regexNum = Date.parseRegexes.length;
  var currentGroup = 1;
  Date.parseFunctions[format] = funcName;
  var code = "Date." + funcName + " = function(input){\n" + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = 0;\n" + "var d = new Date();\n" + "y = d.getFullYear();\n" + "m = d.getMonth();\n" + "d = d.getDate();\n" + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n" + "if (results && results.length > 0) {";
  var regex = "";
  var special = false;
  var ch = "";
  for (var i = 0; i < format.length; ++i) {
    ch = format.charAt(i);
    if (!special && ch == "\\") {
      special = true;
    } else {
      if (special) {
        special = false;
        regex += String.escape(ch);
      } else {
        obj = Date.formatCodeToRegex(ch, currentGroup);
        currentGroup += obj.g;
        regex += obj.s;
        if (obj.g && obj.c) {
          code += obj.c;
        }
      }
    }
  }
  code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n" + "{return new Date(y, m, d, h, i, s).applyOffset(z);}\n" + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n" + "{return new Date(y, m, d, h, i).applyOffset(z);}\n" + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n" + "{return new Date(y, m, d, h).applyOffset(z);}\n" + "else if (y > 0 && m >= 0 && d > 0)\n" + "{return new Date(y, m, d).applyOffset(z);}\n" + "else if (y > 0 && m >= 0)\n" + "{return new Date(y, m).applyOffset(z);}\n" + "else if (y > 0)\n" + "{return new Date(y).applyOffset(z);}\n" + "}return null;}";
  Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
  eval(code);
};
Date.formatCodeToRegex = function(character, currentGroup) {
  switch (character) {
  case "D":
    return {
      g: 0,
      c: null,
      s: "(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"
    };
  case "j":
  case "d":
    return {
      g: 1,
      c: "d = parseInt(results[" + currentGroup + "], 10);\n",
      s: "(\\d{1,2})"
    };
  case "l":
    return {
      g: 0,
      c: null,
      s: "(?:" + Date.dayNames.join("|") + ")"
    };
  case "S":
    return {
      g: 0,
      c: null,
      s: "(?:st|nd|rd|th)"
    };
  case "w":
    return {
      g: 0,
      c: null,
      s: "\\d"
    };
  case "z":
    return {
      g: 0,
      c: null,
      s: "(?:\\d{1,3})"
    };
  case "W":
    return {
      g: 0,
      c: null,
      s: "(?:\\d{2})"
    };
  case "F":
    return {
      g: 1,
      c: "m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
      s: "(" + Date.monthNames.join("|") + ")"
    };
  case "M":
    return {
      g: 1,
      c: "m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
      s: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
    };
  case "n":
  case "m":
    return {
      g: 1,
      c: "m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
      s: "(\\d{1,2})"
    };
  case "t":
    return {
      g: 0,
      c: null,
      s: "\\d{1,2}"
    };
  case "L":
    return {
      g: 0,
      c: null,
      s: "(?:1|0)"
    };
  case "Y":
    return {
      g: 1,
      c: "y = parseInt(results[" + currentGroup + "], 10);\n",
      s: "(\\d{4})"
    };
  case "y":
    return {
      g: 1,
      c: "var ty = parseInt(results[" + currentGroup + "], 10);\n" + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
      s: "(\\d{1,2})"
    };
  case "a":
    return {
      g: 1,
      c: "if (results[" + currentGroup + "] == 'am') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}",
      s: "(am|pm)"
    };
  case "A":
    return {
      g: 1,
      c: "if (results[" + currentGroup + "] == 'AM') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}",
      s: "(AM|PM)"
    };
  case "g":
  case "G":
  case "h":
  case "H":
    return {
      g: 1,
      c: "h = parseInt(results[" + currentGroup + "], 10);\n",
      s: "(\\d{1,2})"
    };
  case "i":
    return {
      g: 1,
      c: "i = parseInt(results[" + currentGroup + "], 10);\n",
      s: "(\\d{2})"
    };
  case "s":
    return {
      g: 1,
      c: "s = parseInt(results[" + currentGroup + "], 10);\n",
      s: "(\\d{2})"
    };
  case "O":
  case "P":
    return {
      g: 1,
      c: "z = Date.parseOffset(results[" + currentGroup + "], 10);\n",
      s: "(Z|[+-]\\d{2}:?\\d{2})"
    };
  case "T":
    return {
      g: 0,
      c: null,
      s: "[A-Z]{3}"
    };
  case "Z":
    return {
      g: 1,
      c: "s = parseInt(results[" + currentGroup + "], 10);\n",
      s: "([+-]\\d{1,5})"
    };
  default:
    return {
      g: 0,
      c: null,
      s: String.escape(character)
    };
  }
};
Date.parseOffset = function(str) {
  if (str == "Z") {
    return 0;
  }
  var seconds;
  seconds = parseInt(str[0] + str[1] + str[2]) * 3600;
  if (str[3] == ":") {
    seconds += parseInt(str[4] + str[5]) * 60;
  } else {
    seconds += parseInt(str[3] + str[4]) * 60;
  }
  return seconds;
};
Date.prototype.applyOffset = function(offset_seconds) {
  this.offset = offset_seconds * 1000;
  this.setTime(this.valueOf() + this.offset);
  return this;
};
Date.prototype.getTimezone = function() {
  return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3").replace(/^.*?[0-9]{4} \(([A-Z]{3})\)/, "$1");
};
Date.prototype.getGMTOffset = function() {
  return (this.getTimezoneOffset() > 0 ? "-" : "+") + String.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0") + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
};
Date.prototype.getDayOfYear = function() {
  var num = 0;
  Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
  for (var i = 0; i < this.getMonth(); ++i) {
    num += Date.daysInMonth[i];
  }
  return num + this.getDate() - 1;
};
Date.prototype.getWeekOfYear = function() {
  var now = this.getDayOfYear() + (4 - this.getDay());
  var jan1 = new Date(this.getFullYear(), 0, 1);
  var then = (7 - jan1.getDay() + 4);
  return String.leftPad(((now - then) / 7) + 1, 2, "0");
};
Date.prototype.isLeapYear = function() {
  var year = this.getFullYear();
  return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
};
Date.prototype.getFirstDayOfMonth = function() {
  var day = (this.getDay() - (this.getDate() - 1)) % 7;
  return (day < 0) ? (day + 7) : day;
};
Date.prototype.getLastDayOfMonth = function() {
  var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
  return (day < 0) ? (day + 7) : day;
};
Date.prototype.getDaysInMonth = function() {
  Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
  return Date.daysInMonth[this.getMonth()];
};
Date.prototype.getSuffix = function() {
  switch (this.getDate()) {
  case 1:
  case 21:
  case 31:
    return "st";
  case 2:
  case 22:
    return "nd";
  case 3:
  case 23:
    return "rd";
  default:
    return "th";
  }
};
String.escape = function(string) {
  return string.replace(/('|\\)/g, "\\$1");
};
String.leftPad = function(val, size, ch) {
  var result = new String(val);
  if (ch == null) {
    ch = " ";
  }
  while (result.length < size) {
    result = ch + result;
  }
  return result;
};
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Date.y2kYear = 50;
Date.monthNumbers = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};
Date.patterns = {
  ISO8601LongPattern: "Y\\-m\\-d\\TH\\:i\\:sO",
  ISO8601ShortPattern: "Y\\-m\\-d",
  ShortDatePattern: "n/j/Y",
  LongDatePattern: "l, F d, Y",
  FullDateTimePattern: "l, F d, Y g:i:s A",
  MonthDayPattern: "F d",
  ShortTimePattern: "g:i A",
  LongTimePattern: "g:i:s A",
  SortableDateTimePattern: "Y-m-d\\TH:i:s",
  UniversalSortableDateTimePattern: "Y-m-d H:i:sO",
  YearMonthPattern: "F, Y"
};
/* jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
*/
(function(e, t) {
  var n, r, i = typeof t,
      o = e.location,
      a = e.document,
      s = a.documentElement,
      l = e.jQuery,
      u = e.$,
      c = {},
      p = [],
      f = "1.10.2",
      d = p.concat,
      h = p.push,
      g = p.slice,
      m = p.indexOf,
      y = c.toString,
      v = c.hasOwnProperty,
      b = f.trim,
      x = function(e, t) {
      return new x.fn.init(e, t, r);
      },
      w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      T = /\S+/g,
      C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      E = /^[\],:{}\s]*$/,
      S = /(?:^|:|,)(?:\s*\[)+/g,
      A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
      j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
      D = /^-ms-/,
      L = /-([\da-z])/gi,
      H = function(e, t) {
      return t.toUpperCase();
      },
      q = function(e) {
      (a.addEventListener || "load" === e.type || "complete" === a.readyState) && (_(), x.ready());
      },
      _ = function() {
      a.addEventListener ? (a.removeEventListener("DOMContentLoaded", q, !1), e.removeEventListener("load", q, !1)) : (a.detachEvent("onreadystatechange", q), e.detachEvent("onload", q));
      };
  x.fn = x.prototype = {
    jquery: f,
    constructor: x,
    init: function(e, n, r) {
      var i, o;
      if (!e) {
        return this;
      }
      if ("string" == typeof e) {
        if (i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : N.exec(e), !i || !i[1] && n) {
          return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e);
        }
        if (i[1]) {
          if (n = n instanceof x ? n[0] : n, x.merge(this, x.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : a, !0)), k.test(i[1]) && x.isPlainObject(n)) {
            for (i in n) {
              x.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
            }
          }
          return this;
        }
        if (o = a.getElementById(i[2]), o && o.parentNode) {
          if (o.id !== i[2]) {
            return r.find(e);
          }
          this.length = 1, this[0] = o;
        }
        return this.context = a, this.selector = e, this;
      }
      return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : x.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), x.makeArray(e, this));
    },
    selector: "",
    length: 0,
    toArray: function() {
      return g.call(this);
    },
    get: function(e) {
      return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e];
    },
    pushStack: function(e) {
      var t = x.merge(this.constructor(), e);
      return t.prevObject = this, t.context = this.context, t;
    },
    each: function(e, t) {
      return x.each(this, e, t);
    },
    ready: function(e) {
      return x.ready.promise().done(e), this;
    },
    slice: function() {
      return this.pushStack(g.apply(this, arguments));
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(e) {
      var t = this.length,
          n = +e + (0 > e ? t : 0);
      return this.pushStack(n >= 0 && t > n ? [this[n]] : []);
    },
    map: function(e) {
      return this.pushStack(x.map(this, function(t, n) {
        return e.call(t, n, t);
      }));
    },
    end: function() {
      return this.prevObject || this.constructor(null);
    },
    push: h,
    sort: [].sort,
    splice: [].splice
  }, x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function() {
    var e, n, r, i, o, a, s = arguments[0] || {},
        l = 1,
        u = arguments.length,
        c = !1;
    for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" == typeof s || x.isFunction(s) || (s = {}), u === l && (s = this, --l); u > l; l++) {
      if (null != (o = arguments[l])) {
        for (i in o) {
          e = s[i], r = o[i], s !== r && (c && r && (x.isPlainObject(r) || (n = x.isArray(r))) ? (n ? (n = !1, a = e && x.isArray(e) ? e : []) : a = e && x.isPlainObject(e) ? e : {}, s[i] = x.extend(c, a, r)) : r !== t && (s[i] = r));
        }
      }
    }
    return s;
  }, x.extend({
    expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
    noConflict: function(t) {
      return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery = l), x;
    },
    isReady: !1,
    readyWait: 1,
    holdReady: function(e) {
      e ? x.readyWait++ : x.ready(!0);
    },
    ready: function(e) {
      if (e === !0 ? !--x.readyWait : !x.isReady) {
        if (!a.body) {
          return setTimeout(x.ready);
        }
        x.isReady = !0, e !== !0 && --x.readyWait > 0 || (n.resolveWith(a, [x]), x.fn.trigger && x(a).trigger("ready").off("ready"));
      }
    },
    isFunction: function(e) {
      return "function" === x.type(e);
    },
    isArray: Array.isArray ||
    function(e) {
      return "array" === x.type(e);
    },
    isWindow: function(e) {
      return null != e && e == e.window;
    },
    isNumeric: function(e) {
      return !isNaN(parseFloat(e)) && isFinite(e);
    },
    type: function(e) {
      return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e;
    },
    isPlainObject: function(e) {
      var n;
      if (!e || "object" !== x.type(e) || e.nodeType || x.isWindow(e)) {
        return !1;
      }
      try {
        if (e.constructor && !v.call(e, "constructor") && !v.call(e.constructor.prototype, "isPrototypeOf")) {
          return !1;
        }
      } catch (r) {
        return !1;
      }
      if (x.support.ownLast) {
        for (n in e) {
          return v.call(e, n);
        }
      }
      for (n in e) {}
      return n === t || v.call(e, n);
    },
    isEmptyObject: function(e) {
      var t;
      for (t in e) {
        return !1;
      }
      return !0;
    },
    error: function(e) {
      throw Error(e);
    },
    parseHTML: function(e, t, n) {
      if (!e || "string" != typeof e) {
        return null;
      }
      "boolean" == typeof t && (n = t, t = !1), t = t || a;
      var r = k.exec(e),
          i = !n && [];
      return r ? [t.createElement(r[1])] : (r = x.buildFragment([e], t, i), i && x(i).remove(), x.merge([], r.childNodes));
    },
    parseJSON: function(n) {
      return e.JSON && e.JSON.parse ? e.JSON.parse(n) : null === n ? n : "string" == typeof n && (n = x.trim(n), n && E.test(n.replace(A, "@").replace(j, "]").replace(S, ""))) ? Function("return " + n)() : (x.error("Invalid JSON: " + n), t);
    },
    parseXML: function(n) {
      var r, i;
      if (!n || "string" != typeof n) {
        return null;
      }
      try {
        e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n));
      } catch (o) {
        r = t;
      }
      return r && r.documentElement && !r.getElementsByTagName("parsererror").length || x.error("Invalid XML: " + n), r;
    },
    noop: function() {},
    globalEval: function(t) {
      t && x.trim(t) && (e.execScript ||
      function(t) {
        e.eval.call(e, t);
      })(t);
    },
    camelCase: function(e) {
      return e.replace(D, "ms-").replace(L, H);
    },
    nodeName: function(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    },
    each: function(e, t, n) {
      var r, i = 0,
          o = e.length,
          a = M(e);
      if (n) {
        if (a) {
          for (; o > i; i++) {
            if (r = t.apply(e[i], n), r === !1) {
              break;
            }
          }
        } else {
          for (i in e) {
            if (r = t.apply(e[i], n), r === !1) {
              break;
            }
          }
        }
      } else {
        if (a) {
          for (; o > i; i++) {
            if (r = t.call(e[i], i, e[i]), r === !1) {
              break;
            }
          }
        } else {
          for (i in e) {
            if (r = t.call(e[i], i, e[i]), r === !1) {
              break;
            }
          }
        }
      }
      return e;
    },
    trim: b && !b.call("\ufeff\u00a0") ?
    function(e) {
      return null == e ? "" : b.call(e);
    } : function(e) {
      return null == e ? "" : (e + "").replace(C, "");
    },
    makeArray: function(e, t) {
      var n = t || [];
      return null != e && (M(Object(e)) ? x.merge(n, "string" == typeof e ? [e] : e) : h.call(n, e)), n;
    },
    inArray: function(e, t, n) {
      var r;
      if (t) {
        if (m) {
          return m.call(t, e, n);
        }
        for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++) {
          if (n in t && t[n] === e) {
            return n;
          }
        }
      }
      return -1;
    },
    merge: function(e, n) {
      var r = n.length,
          i = e.length,
          o = 0;
      if ("number" == typeof r) {
        for (; r > o; o++) {
          e[i++] = n[o];
        }
      } else {
        while (n[o] !== t) {
          e[i++] = n[o++];
        }
      }
      return e.length = i, e;
    },
    grep: function(e, t, n) {
      var r, i = [],
          o = 0,
          a = e.length;
      for (n = !! n; a > o; o++) {
        r = !! t(e[o], o), n !== r && i.push(e[o]);
      }
      return i;
    },
    map: function(e, t, n) {
      var r, i = 0,
          o = e.length,
          a = M(e),
          s = [];
      if (a) {
        for (; o > i; i++) {
          r = t(e[i], i, n), null != r && (s[s.length] = r);
        }
      } else {
        for (i in e) {
          r = t(e[i], i, n), null != r && (s[s.length] = r);
        }
      }
      return d.apply([], s);
    },
    guid: 1,
    proxy: function(e, n) {
      var r, i, o;
      return "string" == typeof n && (o = e[n], n = e, e = o), x.isFunction(e) ? (r = g.call(arguments, 2), i = function() {
        return e.apply(n || this, r.concat(g.call(arguments)));
      }, i.guid = e.guid = e.guid || x.guid++, i) : t;
    },
    access: function(e, n, r, i, o, a, s) {
      var l = 0,
          u = e.length,
          c = null == r;
      if ("object" === x.type(r)) {
        o = !0;
        for (l in r) {
          x.access(e, n, l, r[l], !0, a, s);
        }
      } else {
        if (i !== t && (o = !0, x.isFunction(i) || (s = !0), c && (s ? (n.call(e, i), n = null) : (c = n, n = function(e, t, n) {
          return c.call(x(e), n);
        })), n)) {
          for (; u > l; l++) {
            n(e[l], r, s ? i : i.call(e[l], l, n(e[l], r)));
          }
        }
      }
      return o ? e : c ? n.call(e) : u ? n(e[0], r) : a;
    },
    now: function() {
      return (new Date).getTime();
    },
    swap: function(e, t, n, r) {
      var i, o, a = {};
      for (o in t) {
        a[o] = e.style[o], e.style[o] = t[o];
      }
      i = n.apply(e, r || []);
      for (o in t) {
        e.style[o] = a[o];
      }
      return i;
    }
  }), x.ready.promise = function(t) {
    if (!n) {
      if (n = x.Deferred(), "complete" === a.readyState) {
        setTimeout(x.ready);
      } else {
        if (a.addEventListener) {
          a.addEventListener("DOMContentLoaded", q, !1), e.addEventListener("load", q, !1);
        } else {
          a.attachEvent("onreadystatechange", q), e.attachEvent("onload", q);
          var r = !1;
          try {
            r = null == e.frameElement && a.documentElement;
          } catch (i) {}
          r && r.doScroll &&
          function o() {
            if (!x.isReady) {
              try {
                r.doScroll("left");
              } catch (e) {
                return setTimeout(o, 50);
              }
              _(), x.ready();
            }
          }();
        }
      }
    }
    return n.promise(t);
  }, x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
    c["[object " + t + "]"] = t.toLowerCase();
  });

  function M(e) {
    var t = e.length,
        n = x.type(e);
    return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e);
  }
  r = x(a), function(e, t) {
    var n, r, i, o, a, s, l, u, c, p, f, d, h, g, m, y, v, b = "sizzle" + -new Date,
        w = e.document,
        T = 0,
        C = 0,
        N = st(),
        k = st(),
        E = st(),
        S = !1,
        A = function(e, t) {
        return e === t ? (S = !0, 0) : 0;
        },
        j = typeof t,
        D = 1 << 31,
        L = {}.hasOwnProperty,
        H = [],
        q = H.pop,
        _ = H.push,
        M = H.push,
        O = H.slice,
        F = H.indexOf ||
        function(e) {
        var t = 0,
            n = this.length;
        for (; n > t; t++) {
          if (this[t] === e) {
            return t;
          }
        }
        return -1;
        },
        B = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        P = "[\\x20\\t\\r\\n\\f]",
        R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        W = R.replace("w", "w#"),
        $ = "\\[" + P + "*(" + R + ")" + P + "*(?:([*^$|!~]?=)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + W + ")|)|)" + P + "*\\]",
        I = ":(" + R + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + $.replace(3, 8) + ")*)|.*)\\)|)",
        z = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$", "g"),
        X = RegExp("^" + P + "*," + P + "*"),
        U = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"),
        V = RegExp(P + "*[+~]"),
        Y = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g"),
        J = RegExp(I),
        G = RegExp("^" + W + "$"),
        Q = {
        ID: RegExp("^#(" + R + ")"),
        CLASS: RegExp("^\\.(" + R + ")"),
        TAG: RegExp("^(" + R.replace("w", "w*") + ")"),
        ATTR: RegExp("^" + $),
        PSEUDO: RegExp("^" + I),
        CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"),
        bool: RegExp("^(?:" + B + ")$", "i"),
        needsContext: RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)", "i")
        },
        K = /^[^{]+\{\s*\[native \w/,
        Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        et = /^(?:input|select|textarea|button)$/i,
        tt = /^h\d$/i,
        nt = /'|\\/g,
        rt = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig"),
        it = function(e, t, n) {
        var r = "0x" + t - 65536;
        return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r);
        };
    try {
      M.apply(H = O.call(w.childNodes), w.childNodes), H[w.childNodes.length].nodeType;
    } catch (ot) {
      M = {
        apply: H.length ?
        function(e, t) {
          _.apply(e, O.call(t));
        } : function(e, t) {
          var n = e.length,
              r = 0;
          while (e[n++] = t[r++]) {}
          e.length = n - 1;
        }
      };
    }
    function at(e, t, n, i) {
      var o, a, s, l, u, c, d, m, y, x;
      if ((t ? t.ownerDocument || t : w) !== f && p(t), t = t || f, n = n || [], !e || "string" != typeof e) {
        return n;
      }
      if (1 !== (l = t.nodeType) && 9 !== l) {
        return [];
      }
      if (h && !i) {
        if (o = Z.exec(e)) {
          if (s = o[1]) {
            if (9 === l) {
              if (a = t.getElementById(s), !a || !a.parentNode) {
                return n;
              }
              if (a.id === s) {
                return n.push(a), n;
              }
            } else {
              if (t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && v(t, a) && a.id === s) {
                return n.push(a), n;
              }
            }
          } else {
            if (o[2]) {
              return M.apply(n, t.getElementsByTagName(e)), n;
            }
            if ((s = o[3]) && r.getElementsByClassName && t.getElementsByClassName) {
              return M.apply(n, t.getElementsByClassName(s)), n;
            }
          }
        }
        if (r.qsa && (!g || !g.test(e))) {
          if (m = d = b, y = t, x = 9 === l && e, 1 === l && "object" !== t.nodeName.toLowerCase()) {
            c = mt(e), (d = t.getAttribute("id")) ? m = d.replace(nt, "\\$&") : t.setAttribute("id", m), m = "[id='" + m + "'] ", u = c.length;
            while (u--) {
              c[u] = m + yt(c[u]);
            }
            y = V.test(e) && t.parentNode || t, x = c.join(",");
          }
          if (x) {
            try {
              return M.apply(n, y.querySelectorAll(x)), n;
            } catch (T) {} finally {
              d || t.removeAttribute("id");
            }
          }
        }
      }
      return kt(e.replace(z, "$1"), t, n, i);
    }
    function st() {
      var e = [];

      function t(n, r) {
        return e.push(n += " ") > o.cacheLength && delete t[e.shift()], t[n] = r;
      }
      return t;
    }
    function lt(e) {
      return e[b] = !0, e;
    }
    function ut(e) {
      var t = f.createElement("div");
      try {
        return !!e(t);
      } catch (n) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), t = null;
      }
    }
    function ct(e, t) {
      var n = e.split("|"),
          r = e.length;
      while (r--) {
        o.attrHandle[n[r]] = t;
      }
    }
    function pt(e, t) {
      var n = t && e,
          r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D);
      if (r) {
        return r;
      }
      if (n) {
        while (n = n.nextSibling) {
          if (n === t) {
            return -1;
          }
        }
      }
      return e ? 1 : -1;
    }
    function ft(e) {
      return function(t) {
        var n = t.nodeName.toLowerCase();
        return "input" === n && t.type === e;
      };
    }
    function dt(e) {
      return function(t) {
        var n = t.nodeName.toLowerCase();
        return ("input" === n || "button" === n) && t.type === e;
      };
    }
    function ht(e) {
      return lt(function(t) {
        return t = +t, lt(function(n, r) {
          var i, o = e([], n.length, t),
              a = o.length;
          while (a--) {
            n[i = o[a]] && (n[i] = !(r[i] = n[i]));
          }
        });
      });
    }
    s = at.isXML = function(e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? "HTML" !== t.nodeName : !1;
    }, r = at.support = {}, p = at.setDocument = function(e) {
      var n = e ? e.ownerDocument || e : w,
          i = n.defaultView;
      return n !== f && 9 === n.nodeType && n.documentElement ? (f = n, d = n.documentElement, h = !s(n), i && i.attachEvent && i !== i.top && i.attachEvent("onbeforeunload", function() {
        p();
      }), r.attributes = ut(function(e) {
        return e.className = "i", !e.getAttribute("className");
      }), r.getElementsByTagName = ut(function(e) {
        return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length;
      }), r.getElementsByClassName = ut(function(e) {
        return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length;
      }), r.getById = ut(function(e) {
        return d.appendChild(e).id = b, !n.getElementsByName || !n.getElementsByName(b).length;
      }), r.getById ? (o.find.ID = function(e, t) {
        if (typeof t.getElementById !== j && h) {
          var n = t.getElementById(e);
          return n && n.parentNode ? [n] : [];
        }
      }, o.filter.ID = function(e) {
        var t = e.replace(rt, it);
        return function(e) {
          return e.getAttribute("id") === t;
        };
      }) : (delete o.find.ID, o.filter.ID = function(e) {
        var t = e.replace(rt, it);
        return function(e) {
          var n = typeof e.getAttributeNode !== j && e.getAttributeNode("id");
          return n && n.value === t;
        };
      }), o.find.TAG = r.getElementsByTagName ?
      function(e, n) {
        return typeof n.getElementsByTagName !== j ? n.getElementsByTagName(e) : t;
      } : function(e, t) {
        var n, r = [],
            i = 0,
            o = t.getElementsByTagName(e);
        if ("*" === e) {
          while (n = o[i++]) {
            1 === n.nodeType && r.push(n);
          }
          return r;
        }
        return o;
      }, o.find.CLASS = r.getElementsByClassName &&
      function(e, n) {
        return typeof n.getElementsByClassName !== j && h ? n.getElementsByClassName(e) : t;
      }, m = [], g = [], (r.qsa = K.test(n.querySelectorAll)) && (ut(function(e) {
        e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || g.push("\\[" + P + "*(?:value|" + B + ")"), e.querySelectorAll(":checked").length || g.push(":checked");
      }), ut(function(e) {
        var t = n.createElement("input");
        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && g.push("[*^$]=" + P + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || g.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), g.push(",.*:");
      })), (r.matchesSelector = K.test(y = d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && ut(function(e) {
        r.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), m.push("!=", I);
      }), g = g.length && RegExp(g.join("|")), m = m.length && RegExp(m.join("|")), v = K.test(d.contains) || d.compareDocumentPosition ?
      function(e, t) {
        var n = 9 === e.nodeType ? e.documentElement : e,
            r = t && t.parentNode;
        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
      } : function(e, t) {
        if (t) {
          while (t = t.parentNode) {
            if (t === e) {
              return !0;
            }
          }
        }
        return !1;
      }, A = d.compareDocumentPosition ?
      function(e, t) {
        if (e === t) {
          return S = !0, 0;
        }
        var i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t);
        return i ? 1 & i || !r.sortDetached && t.compareDocumentPosition(e) === i ? e === n || v(w, e) ? -1 : t === n || v(w, t) ? 1 : c ? F.call(c, e) - F.call(c, t) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1;
      } : function(e, t) {
        var r, i = 0,
            o = e.parentNode,
            a = t.parentNode,
            s = [e],
            l = [t];
        if (e === t) {
          return S = !0, 0;
        }
        if (!o || !a) {
          return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : c ? F.call(c, e) - F.call(c, t) : 0;
        }
        if (o === a) {
          return pt(e, t);
        }
        r = e;
        while (r = r.parentNode) {
          s.unshift(r);
        }
        r = t;
        while (r = r.parentNode) {
          l.unshift(r);
        }
        while (s[i] === l[i]) {
          i++;
        }
        return i ? pt(s[i], l[i]) : s[i] === w ? -1 : l[i] === w ? 1 : 0;
      }, n) : f;
    }, at.matches = function(e, t) {
      return at(e, null, null, t);
    }, at.matchesSelector = function(e, t) {
      if ((e.ownerDocument || e) !== f && p(e), t = t.replace(Y, "='$1']"), !(!r.matchesSelector || !h || m && m.test(t) || g && g.test(t))) {
        try {
          var n = y.call(e, t);
          if (n || r.disconnectedMatch || e.document && 11 !== e.document.nodeType) {
            return n;
          }
        } catch (i) {}
      }
      return at(t, f, null, [e]).length > 0;
    }, at.contains = function(e, t) {
      return (e.ownerDocument || e) !== f && p(e), v(e, t);
    }, at.attr = function(e, n) {
      (e.ownerDocument || e) !== f && p(e);
      var i = o.attrHandle[n.toLowerCase()],
          a = i && L.call(o.attrHandle, n.toLowerCase()) ? i(e, n, !h) : t;
      return a === t ? r.attributes || !h ? e.getAttribute(n) : (a = e.getAttributeNode(n)) && a.specified ? a.value : null : a;
    }, at.error = function(e) {
      throw Error("Syntax error, unrecognized expression: " + e);
    }, at.uniqueSort = function(e) {
      var t, n = [],
          i = 0,
          o = 0;
      if (S = !r.detectDuplicates, c = !r.sortStable && e.slice(0), e.sort(A), S) {
        while (t = e[o++]) {
          t === e[o] && (i = n.push(o));
        }
        while (i--) {
          e.splice(n[i], 1);
        }
      }
      return e;
    }, a = at.getText = function(e) {
      var t, n = "",
          r = 0,
          i = e.nodeType;
      if (i) {
        if (1 === i || 9 === i || 11 === i) {
          if ("string" == typeof e.textContent) {
            return e.textContent;
          }
          for (e = e.firstChild; e; e = e.nextSibling) {
            n += a(e);
          }
        } else {
          if (3 === i || 4 === i) {
            return e.nodeValue;
          }
        }
      } else {
        for (; t = e[r]; r++) {
          n += a(t);
        }
      }
      return n;
    }, o = at.selectors = {
      cacheLength: 50,
      createPseudo: lt,
      match: Q,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function(e) {
          return e[1] = e[1].replace(rt, it), e[3] = (e[4] || e[5] || "").replace(rt, it), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
        },
        CHILD: function(e) {
          return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || at.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && at.error(e[0]), e;
        },
        PSEUDO: function(e) {
          var n, r = !e[5] && e[2];
          return Q.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && J.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3));
        }
      },
      filter: {
        TAG: function(e) {
          var t = e.replace(rt, it).toLowerCase();
          return "*" === e ?
          function() {
            return !0;
          } : function(e) {
            return e.nodeName && e.nodeName.toLowerCase() === t;
          };
        },
        CLASS: function(e) {
          var t = N[e + " "];
          return t || (t = RegExp("(^|" + P + ")" + e + "(" + P + "|$)")) && N(e, function(e) {
            return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== j && e.getAttribute("class") || "");
          });
        },
        ATTR: function(e, t, n) {
          return function(r) {
            var i = at.attr(r, e);
            return null == i ? "!=" === t : t ? (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i + " ").indexOf(n) > -1 : "|=" === t ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0;
          };
        },
        CHILD: function(e, t, n, r, i) {
          var o = "nth" !== e.slice(0, 3),
              a = "last" !== e.slice(-4),
              s = "of-type" === t;
          return 1 === r && 0 === i ?
          function(e) {
            return !!e.parentNode;
          } : function(t, n, l) {
            var u, c, p, f, d, h, g = o !== a ? "nextSibling" : "previousSibling",
                m = t.parentNode,
                y = s && t.nodeName.toLowerCase(),
                v = !l && !s;
            if (m) {
              if (o) {
                while (g) {
                  p = t;
                  while (p = p[g]) {
                    if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) {
                      return !1;
                    }
                  }
                  h = g = "only" === e && !h && "nextSibling";
                }
                return !0;
              }
              if (h = [a ? m.firstChild : m.lastChild], a && v) {
                c = m[b] || (m[b] = {}), u = c[e] || [], d = u[0] === T && u[1], f = u[0] === T && u[2], p = d && m.childNodes[d];
                while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) {
                  if (1 === p.nodeType && ++f && p === t) {
                    c[e] = [T, d, f];
                    break;
                  }
                }
              } else {
                if (v && (u = (t[b] || (t[b] = {}))[e]) && u[0] === T) {
                  f = u[1];
                } else {
                  while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) {
                    if ((s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) && ++f && (v && ((p[b] || (p[b] = {}))[e] = [T, f]), p === t)) {
                      break;
                    }
                  }
                }
              }
              return f -= i, f === r || 0 === f % r && f / r >= 0;
            }
          };
        },
        PSEUDO: function(e, t) {
          var n, r = o.pseudos[e] || o.setFilters[e.toLowerCase()] || at.error("unsupported pseudo: " + e);
          return r[b] ? r(t) : r.length > 1 ? (n = [e, e, "", t], o.setFilters.hasOwnProperty(e.toLowerCase()) ? lt(function(e, n) {
            var i, o = r(e, t),
                a = o.length;
            while (a--) {
              i = F.call(e, o[a]), e[i] = !(n[i] = o[a]);
            }
          }) : function(e) {
            return r(e, 0, n);
          }) : r;
        }
      },
      pseudos: {
        not: lt(function(e) {
          var t = [],
              n = [],
              r = l(e.replace(z, "$1"));
          return r[b] ? lt(function(e, t, n, i) {
            var o, a = r(e, null, i, []),
                s = e.length;
            while (s--) {
              (o = a[s]) && (e[s] = !(t[s] = o));
            }
          }) : function(e, i, o) {
            return t[0] = e, r(t, null, o, n), !n.pop();
          };
        }),
        has: lt(function(e) {
          return function(t) {
            return at(e, t).length > 0;
          };
        }),
        contains: lt(function(e) {
          return function(t) {
            return (t.textContent || t.innerText || a(t)).indexOf(e) > -1;
          };
        }),
        lang: lt(function(e) {
          return G.test(e || "") || at.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(), function(t) {
            var n;
            do {
              if (n = h ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) {
                return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
              }
            } while ((t = t.parentNode) && 1 === t.nodeType);
            return !1;
          };
        }),
        target: function(t) {
          var n = e.location && e.location.hash;
          return n && n.slice(1) === t.id;
        },
        root: function(e) {
          return e === d;
        },
        focus: function(e) {
          return e === f.activeElement && (!f.hasFocus || f.hasFocus()) && !! (e.type || e.href || ~e.tabIndex);
        },
        enabled: function(e) {
          return e.disabled === !1;
        },
        disabled: function(e) {
          return e.disabled === !0;
        },
        checked: function(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && !! e.checked || "option" === t && !! e.selected;
        },
        selected: function(e) {
          return e.parentNode && e.parentNode.selectedIndex, e.selected === !0;
        },
        empty: function(e) {
          for (e = e.firstChild; e; e = e.nextSibling) {
            if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) {
              return !1;
            }
          }
          return !0;
        },
        parent: function(e) {
          return !o.pseudos.empty(e);
        },
        header: function(e) {
          return tt.test(e.nodeName);
        },
        input: function(e) {
          return et.test(e.nodeName);
        },
        button: function(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && "button" === e.type || "button" === t;
        },
        text: function(e) {
          var t;
          return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type);
        },
        first: ht(function() {
          return [0];
        }),
        last: ht(function(e, t) {
          return [t - 1];
        }),
        eq: ht(function(e, t, n) {
          return [0 > n ? n + t : n];
        }),
        even: ht(function(e, t) {
          var n = 0;
          for (; t > n; n += 2) {
            e.push(n);
          }
          return e;
        }),
        odd: ht(function(e, t) {
          var n = 1;
          for (; t > n; n += 2) {
            e.push(n);
          }
          return e;
        }),
        lt: ht(function(e, t, n) {
          var r = 0 > n ? n + t : n;
          for (; --r >= 0;) {
            e.push(r);
          }
          return e;
        }),
        gt: ht(function(e, t, n) {
          var r = 0 > n ? n + t : n;
          for (; t > ++r;) {
            e.push(r);
          }
          return e;
        })
      }
    }, o.pseudos.nth = o.pseudos.eq;
    for (n in {
      radio: !0,
      checkbox: !0,
      file: !0,
      password: !0,
      image: !0
    }) {
      o.pseudos[n] = ft(n);
    }
    for (n in {
      submit: !0,
      reset: !0
    }) {
      o.pseudos[n] = dt(n);
    }
    function gt() {}
    gt.prototype = o.filters = o.pseudos, o.setFilters = new gt;

    function mt(e, t) {
      var n, r, i, a, s, l, u, c = k[e + " "];
      if (c) {
        return t ? 0 : c.slice(0);
      }
      s = e, l = [], u = o.preFilter;
      while (s) {
        (!n || (r = X.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(i = [])), n = !1, (r = U.exec(s)) && (n = r.shift(), i.push({
          value: n,
          type: r[0].replace(z, " ")
        }), s = s.slice(n.length));
        for (a in o.filter) {
          !(r = Q[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), i.push({
            value: n,
            type: a,
            matches: r
          }), s = s.slice(n.length));
        }
        if (!n) {
          break;
        }
      }
      return t ? s.length : s ? at.error(e) : k(e, l).slice(0);
    }
    function yt(e) {
      var t = 0,
          n = e.length,
          r = "";
      for (; n > t; t++) {
        r += e[t].value;
      }
      return r;
    }
    function vt(e, t, n) {
      var r = t.dir,
          o = n && "parentNode" === r,
          a = C++;
      return t.first ?
      function(t, n, i) {
        while (t = t[r]) {
          if (1 === t.nodeType || o) {
            return e(t, n, i);
          }
        }
      } : function(t, n, s) {
        var l, u, c, p = T + " " + a;
        if (s) {
          while (t = t[r]) {
            if ((1 === t.nodeType || o) && e(t, n, s)) {
              return !0;
            }
          }
        } else {
          while (t = t[r]) {
            if (1 === t.nodeType || o) {
              if (c = t[b] || (t[b] = {}), (u = c[r]) && u[0] === p) {
                if ((l = u[1]) === !0 || l === i) {
                  return l === !0;
                }
              } else {
                if (u = c[r] = [p], u[1] = e(t, n, s) || i, u[1] === !0) {
                  return !0;
                }
              }
            }
          }
        }
      };
    }
    function bt(e) {
      return e.length > 1 ?
      function(t, n, r) {
        var i = e.length;
        while (i--) {
          if (!e[i](t, n, r)) {
            return !1;
          }
        }
        return !0;
      } : e[0];
    }
    function xt(e, t, n, r, i) {
      var o, a = [],
          s = 0,
          l = e.length,
          u = null != t;
      for (; l > s; s++) {
        (o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s));
      }
      return a;
    }
    function wt(e, t, n, r, i, o) {
      return r && !r[b] && (r = wt(r)), i && !i[b] && (i = wt(i, o)), lt(function(o, a, s, l) {
        var u, c, p, f = [],
            d = [],
            h = a.length,
            g = o || Nt(t || "*", s.nodeType ? [s] : s, []),
            m = !e || !o && t ? g : xt(g, f, e, s, l),
            y = n ? i || (o ? e : h || r) ? [] : a : m;
        if (n && n(m, y, s, l), r) {
          u = xt(y, d), r(u, [], s, l), c = u.length;
          while (c--) {
            (p = u[c]) && (y[d[c]] = !(m[d[c]] = p));
          }
        }
        if (o) {
          if (i || e) {
            if (i) {
              u = [], c = y.length;
              while (c--) {
                (p = y[c]) && u.push(m[c] = p);
              }
              i(null, y = [], u, l);
            }
            c = y.length;
            while (c--) {
              (p = y[c]) && (u = i ? F.call(o, p) : f[c]) > -1 && (o[u] = !(a[u] = p));
            }
          }
        } else {
          y = xt(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, l) : M.apply(a, y);
        }
      });
    }
    function Tt(e) {
      var t, n, r, i = e.length,
          a = o.relative[e[0].type],
          s = a || o.relative[" "],
          l = a ? 1 : 0,
          c = vt(function(e) {
          return e === t;
        }, s, !0),
          p = vt(function(e) {
          return F.call(t, e) > -1;
        }, s, !0),
          f = [function(e, n, r) {
          return !a && (r || n !== u) || ((t = n).nodeType ? c(e, n, r) : p(e, n, r));
        }];
      for (; i > l; l++) {
        if (n = o.relative[e[l].type]) {
          f = [vt(bt(f), n)];
        } else {
          if (n = o.filter[e[l].type].apply(null, e[l].matches), n[b]) {
            for (r = ++l; i > r; r++) {
              if (o.relative[e[r].type]) {
                break;
              }
            }
            return wt(l > 1 && bt(f), l > 1 && yt(e.slice(0, l - 1).concat({
              value: " " === e[l - 2].type ? "*" : ""
            })).replace(z, "$1"), n, r > l && Tt(e.slice(l, r)), i > r && Tt(e = e.slice(r)), i > r && yt(e));
          }
          f.push(n);
        }
      }
      return bt(f);
    }
    function Ct(e, t) {
      var n = 0,
          r = t.length > 0,
          a = e.length > 0,
          s = function(s, l, c, p, d) {
          var h, g, m, y = [],
              v = 0,
              b = "0",
              x = s && [],
              w = null != d,
              C = u,
              N = s || a && o.find.TAG("*", d && l.parentNode || l),
              k = T += null == C ? 1 : Math.random() || 0.1;
          for (w && (u = l !== f && l, i = n); null != (h = N[b]); b++) {
            if (a && h) {
              g = 0;
              while (m = e[g++]) {
                if (m(h, l, c)) {
                  p.push(h);
                  break;
                }
              }
              w && (T = k, i = ++n);
            }
            r && ((h = !m && h) && v--, s && x.push(h));
          }
          if (v += b, r && b !== v) {
            g = 0;
            while (m = t[g++]) {
              m(x, y, l, c);
            }
            if (s) {
              if (v > 0) {
                while (b--) {
                  x[b] || y[b] || (y[b] = q.call(p));
                }
              }
              y = xt(y);
            }
            M.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && at.uniqueSort(p);
          }
          return w && (T = k, u = C), x;
          };
      return r ? lt(s) : s;
    }
    l = at.compile = function(e, t) {
      var n, r = [],
          i = [],
          o = E[e + " "];
      if (!o) {
        t || (t = mt(e)), n = t.length;
        while (n--) {
          o = Tt(t[n]), o[b] ? r.push(o) : i.push(o);
        }
        o = E(e, Ct(i, r));
      }
      return o;
    };

    function Nt(e, t, n) {
      var r = 0,
          i = t.length;
      for (; i > r; r++) {
        at(e, t[r], n);
      }
      return n;
    }
    function kt(e, t, n, i) {
      var a, s, u, c, p, f = mt(e);
      if (!i && 1 === f.length) {
        if (s = f[0] = f[0].slice(0), s.length > 2 && "ID" === (u = s[0]).type && r.getById && 9 === t.nodeType && h && o.relative[s[1].type]) {
          if (t = (o.find.ID(u.matches[0].replace(rt, it), t) || [])[0], !t) {
            return n;
          }
          e = e.slice(s.shift().value.length);
        }
        a = Q.needsContext.test(e) ? 0 : s.length;
        while (a--) {
          if (u = s[a], o.relative[c = u.type]) {
            break;
          }
          if ((p = o.find[c]) && (i = p(u.matches[0].replace(rt, it), V.test(s[0].type) && t.parentNode || t))) {
            if (s.splice(a, 1), e = i.length && yt(s), !e) {
              return M.apply(n, i), n;
            }
            break;
          }
        }
      }
      return l(e, f)(i, t, !h, n, V.test(e)), n;
    }
    r.sortStable = b.split("").sort(A).join("") === b, r.detectDuplicates = S, p(), r.sortDetached = ut(function(e) {
      return 1 & e.compareDocumentPosition(f.createElement("div"));
    }), ut(function(e) {
      return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href");
    }) || ct("type|href|height|width", function(e, n, r) {
      return r ? t : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2);
    }), r.attributes && ut(function(e) {
      return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
    }) || ct("value", function(e, n, r) {
      return r || "input" !== e.nodeName.toLowerCase() ? t : e.defaultValue;
    }), ut(function(e) {
      return null == e.getAttribute("disabled");
    }) || ct(B, function(e, n, r) {
      var i;
      return r ? t : (i = e.getAttributeNode(n)) && i.specified ? i.value : e[n] === !0 ? n.toLowerCase() : null;
    }), x.find = at, x.expr = at.selectors, x.expr[":"] = x.expr.pseudos, x.unique = at.uniqueSort, x.text = at.getText, x.isXMLDoc = at.isXML, x.contains = at.contains;
  }(e);
  var O = {};

  function F(e) {
    var t = O[e] = {};
    return x.each(e.match(T) || [], function(e, n) {
      t[n] = !0;
    }), t;
  }
  x.Callbacks = function(e) {
    e = "string" == typeof e ? O[e] || F(e) : x.extend({}, e);
    var n, r, i, o, a, s, l = [],
        u = !e.once && [],
        c = function(t) {
        for (r = e.memory && t, i = !0, a = s || 0, s = 0, o = l.length, n = !0; l && o > a; a++) {
          if (l[a].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
            r = !1;
            break;
          }
        }
        n = !1, l && (u ? u.length && c(u.shift()) : r ? l = [] : p.disable());
        },
        p = {
        add: function() {
          if (l) {
            var t = l.length;
            (function i(t) {
              x.each(t, function(t, n) {
                var r = x.type(n);
                "function" === r ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && i(n);
              });
            })(arguments), n ? o = l.length : r && (s = t, c(r));
          }
          return this;
        },
        remove: function() {
          return l && x.each(arguments, function(e, t) {
            var r;
            while ((r = x.inArray(t, l, r)) > -1) {
              l.splice(r, 1), n && (o >= r && o--, a >= r && a--);
            }
          }), this;
        },
        has: function(e) {
          return e ? x.inArray(e, l) > -1 : !(!l || !l.length);
        },
        empty: function() {
          return l = [], o = 0, this;
        },
        disable: function() {
          return l = u = r = t, this;
        },
        disabled: function() {
          return !l;
        },
        lock: function() {
          return u = t, r || p.disable(), this;
        },
        locked: function() {
          return !u;
        },
        fireWith: function(e, t) {
          return !l || i && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? u.push(t) : c(t)), this;
        },
        fire: function() {
          return p.fireWith(this, arguments), this;
        },
        fired: function() {
          return !!i;
        }
        };
    return p;
  }, x.extend({
    Deferred: function(e) {
      var t = [
        ["resolve", "done", x.Callbacks("once memory"), "resolved"],
        ["reject", "fail", x.Callbacks("once memory"), "rejected"],
        ["notify", "progress", x.Callbacks("memory")]
      ],
          n = "pending",
          r = {
          state: function() {
            return n;
          },
          always: function() {
            return i.done(arguments).fail(arguments), this;
          },
          then: function() {
            var e = arguments;
            return x.Deferred(function(n) {
              x.each(t, function(t, o) {
                var a = o[0],
                    s = x.isFunction(e[t]) && e[t];
                i[o[1]](function() {
                  var e = s && s.apply(this, arguments);
                  e && x.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [e] : arguments);
                });
              }), e = null;
            }).promise();
          },
          promise: function(e) {
            return null != e ? x.extend(e, r) : r;
          }
          },
          i = {};
      return r.pipe = r.then, x.each(t, function(e, o) {
        var a = o[2],
            s = o[3];
        r[o[1]] = a.add, s && a.add(function() {
          n = s;
        }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
          return i[o[0] + "With"](this === i ? r : this, arguments), this;
        }, i[o[0] + "With"] = a.fireWith;
      }), r.promise(i), e && e.call(i, i), i;
    },
    when: function(e) {
      var t = 0,
          n = g.call(arguments),
          r = n.length,
          i = 1 !== r || e && x.isFunction(e.promise) ? r : 0,
          o = 1 === i ? e : x.Deferred(),
          a = function(e, t, n) {
          return function(r) {
            t[e] = this, n[e] = arguments.length > 1 ? g.call(arguments) : r, n === s ? o.notifyWith(t, n) : --i || o.resolveWith(t, n);
          };
          },
          s, l, u;
      if (r > 1) {
        for (s = Array(r), l = Array(r), u = Array(r); r > t; t++) {
          n[t] && x.isFunction(n[t].promise) ? n[t].promise().done(a(t, u, n)).fail(o.reject).progress(a(t, l, s)) : --i;
        }
      }
      return i || o.resolveWith(u, n), o.promise();
    }
  }), x.support = function(t) {
    var n, r, o, s, l, u, c, p, f, d = a.createElement("div");
    if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = d.getElementsByTagName("*") || [], r = d.getElementsByTagName("a")[0], !r || !r.style || !n.length) {
      return t;
    }
    s = a.createElement("select"), u = s.appendChild(a.createElement("option")), o = d.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, t.htmlSerialize = !! d.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), t.hrefNormalized = "/a" === r.getAttribute("href"), t.opacity = /^0.5/.test(r.style.opacity), t.cssFloat = !! r.style.cssFloat, t.checkOn = !! o.value, t.optSelected = u.selected, t.enctype = !! a.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== a.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !u.disabled;
    try {
      delete d.test;
    } catch (h) {
      t.deleteExpando = !1;
    }
    o = a.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, o.setAttribute("checked", "t"), o.setAttribute("name", "t"), l = a.createDocumentFragment(), l.appendChild(o), t.appendChecked = o.checked, t.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function() {
      t.noCloneEvent = !1;
    }), d.cloneNode(!0).click());
    for (f in {
      submit: !0,
      change: !0,
      focusin: !0
    }) {
      d.setAttribute(c = "on" + f, "t"), t[f + "Bubbles"] = c in e || d.attributes[c].expando === !1;
    }
    d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip;
    for (f in x(t)) {
      break;
    }
    return t.ownLast = "0" !== f, x(function() {
      var n, r, o, s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
          l = a.getElementsByTagName("body")[0];
      l && (n = a.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", l.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", p = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = p && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", x.swap(l, null != l.style.zoom ? {
        zoom: 1
      } : {}, function() {
        t.boxSizing = 4 === d.offsetWidth;
      }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || {
        width: "4px"
      }).width, r = d.appendChild(a.createElement("div")), r.style.cssText = d.style.cssText = s, r.style.marginRight = r.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof d.style.zoom !== i && (d.innerHTML = "", d.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (l.style.zoom = 1)), l.removeChild(n), n = d = o = r = null);
    }), n = s = l = u = r = o = null, t;
  }({});
  var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
      P = /([A-Z])/g;

  function R(e, n, r, i) {
    if (x.acceptData(e)) {
      var o, a, s = x.expando,
          l = e.nodeType,
          u = l ? x.cache : e,
          c = l ? e[s] : e[s] && s;
      if (c && u[c] && (i || u[c].data) || r !== t || "string" != typeof n) {
        return c || (c = l ? e[s] = p.pop() || x.guid++ : s), u[c] || (u[c] = l ? {} : {
          toJSON: x.noop
        }), ("object" == typeof n || "function" == typeof n) && (i ? u[c] = x.extend(u[c], n) : u[c].data = x.extend(u[c].data, n)), a = u[c], i || (a.data || (a.data = {}), a = a.data), r !== t && (a[x.camelCase(n)] = r), "string" == typeof n ? (o = a[n], null == o && (o = a[x.camelCase(n)])) : o = a, o;
      }
    }
  }
  function W(e, t, n) {
    if (x.acceptData(e)) {
      var r, i, o = e.nodeType,
          a = o ? x.cache : e,
          s = o ? e[x.expando] : x.expando;
      if (a[s]) {
        if (t && (r = n ? a[s] : a[s].data)) {
          x.isArray(t) ? t = t.concat(x.map(t, x.camelCase)) : t in r ? t = [t] : (t = x.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length;
          while (i--) {
            delete r[t[i]];
          }
          if (n ? !I(r) : !x.isEmptyObject(r)) {
            return;
          }
        }(n || (delete a[s].data, I(a[s]))) && (o ? x.cleanData([e], !0) : x.support.deleteExpando || a != a.window ? delete a[s] : a[s] = null);
      }
    }
  }
  x.extend({
    cache: {},
    noData: {
      applet: !0,
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    hasData: function(e) {
      return e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando], !! e && !I(e);
    },
    data: function(e, t, n) {
      return R(e, t, n);
    },
    removeData: function(e, t) {
      return W(e, t);
    },
    _data: function(e, t, n) {
      return R(e, t, n, !0);
    },
    _removeData: function(e, t) {
      return W(e, t, !0);
    },
    acceptData: function(e) {
      if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) {
        return !1;
      }
      var t = e.nodeName && x.noData[e.nodeName.toLowerCase()];
      return !t || t !== !0 && e.getAttribute("classid") === t;
    }
  }), x.fn.extend({
    data: function(e, n) {
      var r, i, o = null,
          a = 0,
          s = this[0];
      if (e === t) {
        if (this.length && (o = x.data(s), 1 === s.nodeType && !x._data(s, "parsedAttrs"))) {
          for (r = s.attributes; r.length > a; a++) {
            i = r[a].name, 0 === i.indexOf("data-") && (i = x.camelCase(i.slice(5)), $(s, i, o[i]));
          }
          x._data(s, "parsedAttrs", !0);
        }
        return o;
      }
      return "object" == typeof e ? this.each(function() {
        x.data(this, e);
      }) : arguments.length > 1 ? this.each(function() {
        x.data(this, e, n);
      }) : s ? $(s, e, x.data(s, e)) : null;
    },
    removeData: function(e) {
      return this.each(function() {
        x.removeData(this, e);
      });
    }
  });

  function $(e, n, r) {
    if (r === t && 1 === e.nodeType) {
      var i = "data-" + n.replace(P, "-$1").toLowerCase();
      if (r = e.getAttribute(i), "string" == typeof r) {
        try {
          r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : B.test(r) ? x.parseJSON(r) : r;
        } catch (o) {}
        x.data(e, n, r);
      } else {
        r = t;
      }
    }
    return r;
  }
  function I(e) {
    var t;
    for (t in e) {
      if (("data" !== t || !x.isEmptyObject(e[t])) && "toJSON" !== t) {
        return !1;
      }
    }
    return !0;
  }
  x.extend({
    queue: function(e, n, r) {
      var i;
      return e ? (n = (n || "fx") + "queue", i = x._data(e, n), r && (!i || x.isArray(r) ? i = x._data(e, n, x.makeArray(r)) : i.push(r)), i || []) : t;
    },
    dequeue: function(e, t) {
      t = t || "fx";
      var n = x.queue(e, t),
          r = n.length,
          i = n.shift(),
          o = x._queueHooks(e, t),
          a = function() {
          x.dequeue(e, t);
          };
      "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire();
    },
    _queueHooks: function(e, t) {
      var n = t + "queueHooks";
      return x._data(e, n) || x._data(e, n, {
        empty: x.Callbacks("once memory").add(function() {
          x._removeData(e, t + "queue"), x._removeData(e, n);
        })
      });
    }
  }), x.fn.extend({
    queue: function(e, n) {
      var r = 2;
      return "string" != typeof e && (n = e, e = "fx", r--), r > arguments.length ? x.queue(this[0], e) : n === t ? this : this.each(function() {
        var t = x.queue(this, e, n);
        x._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && x.dequeue(this, e);
      });
    },
    dequeue: function(e) {
      return this.each(function() {
        x.dequeue(this, e);
      });
    },
    delay: function(e, t) {
      return e = x.fx ? x.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
        var r = setTimeout(t, e);
        n.stop = function() {
          clearTimeout(r);
        };
      });
    },
    clearQueue: function(e) {
      return this.queue(e || "fx", []);
    },
    promise: function(e, n) {
      var r, i = 1,
          o = x.Deferred(),
          a = this,
          s = this.length,
          l = function() {
          --i || o.resolveWith(a, [a]);
          };
      "string" != typeof e && (n = e, e = t), e = e || "fx";
      while (s--) {
        r = x._data(a[s], e + "queueHooks"), r && r.empty && (i++, r.empty.add(l));
      }
      return l(), o.promise(n);
    }
  });
  var z, X, U = /[\t\r\n\f]/g,
      V = /\r/g,
      Y = /^(?:input|select|textarea|button|object)$/i,
      J = /^(?:a|area)$/i,
      G = /^(?:checked|selected)$/i,
      Q = x.support.getSetAttribute,
      K = x.support.input;
  x.fn.extend({
    attr: function(e, t) {
      return x.access(this, x.attr, e, t, arguments.length > 1);
    },
    removeAttr: function(e) {
      return this.each(function() {
        x.removeAttr(this, e);
      });
    },
    prop: function(e, t) {
      return x.access(this, x.prop, e, t, arguments.length > 1);
    },
    removeProp: function(e) {
      return e = x.propFix[e] || e, this.each(function() {
        try {
          this[e] = t, delete this[e];
        } catch (n) {}
      });
    },
    addClass: function(e) {
      var t, n, r, i, o, a = 0,
          s = this.length,
          l = "string" == typeof e && e;
      if (x.isFunction(e)) {
        return this.each(function(t) {
          x(this).addClass(e.call(this, t, this.className));
        });
      }
      if (l) {
        for (t = (e || "").match(T) || []; s > a; a++) {
          if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : " ")) {
            o = 0;
            while (i = t[o++]) {
              0 > r.indexOf(" " + i + " ") && (r += i + " ");
            }
            n.className = x.trim(r);
          }
        }
      }
      return this;
    },
    removeClass: function(e) {
      var t, n, r, i, o, a = 0,
          s = this.length,
          l = 0 === arguments.length || "string" == typeof e && e;
      if (x.isFunction(e)) {
        return this.each(function(t) {
          x(this).removeClass(e.call(this, t, this.className));
        });
      }
      if (l) {
        for (t = (e || "").match(T) || []; s > a; a++) {
          if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : "")) {
            o = 0;
            while (i = t[o++]) {
              while (r.indexOf(" " + i + " ") >= 0) {
                r = r.replace(" " + i + " ", " ");
              }
            }
            n.className = e ? x.trim(r) : "";
          }
        }
      }
      return this;
    },
    toggleClass: function(e, t) {
      var n = typeof e;
      return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : x.isFunction(e) ? this.each(function(n) {
        x(this).toggleClass(e.call(this, n, this.className, t), t);
      }) : this.each(function() {
        if ("string" === n) {
          var t, r = 0,
              o = x(this),
              a = e.match(T) || [];
          while (t = a[r++]) {
            o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
          }
        } else {
          (n === i || "boolean" === n) && (this.className && x._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : x._data(this, "__className__") || "");
        }
      });
    },
    hasClass: function(e) {
      var t = " " + e + " ",
          n = 0,
          r = this.length;
      for (; r > n; n++) {
        if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(U, " ").indexOf(t) >= 0) {
          return !0;
        }
      }
      return !1;
    },
    val: function(e) {
      var n, r, i, o = this[0];
      if (arguments.length) {
        return i = x.isFunction(e), this.each(function(n) {
          var o;
          1 === this.nodeType && (o = i ? e.call(this, n, x(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : x.isArray(o) && (o = x.map(o, function(e) {
            return null == e ? "" : e + "";
          })), r = x.valHooks[this.type] || x.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== t || (this.value = o));
        });
      }
      if (o) {
        return r = x.valHooks[o.type] || x.valHooks[o.nodeName.toLowerCase()], r && "get" in r && (n = r.get(o, "value")) !== t ? n : (n = o.value, "string" == typeof n ? n.replace(V, "") : null == n ? "" : n);
      }
    }
  }), x.extend({
    valHooks: {
      option: {
        get: function(e) {
          var t = x.find.attr(e, "value");
          return null != t ? t : e.text;
        }
      },
      select: {
        get: function(e) {
          var t, n, r = e.options,
              i = e.selectedIndex,
              o = "select-one" === e.type || 0 > i,
              a = o ? null : [],
              s = o ? i + 1 : r.length,
              l = 0 > i ? s : o ? i : 0;
          for (; s > l; l++) {
            if (n = r[l], !(!n.selected && l !== i || (x.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && x.nodeName(n.parentNode, "optgroup"))) {
              if (t = x(n).val(), o) {
                return t;
              }
              a.push(t);
            }
          }
          return a;
        },
        set: function(e, t) {
          var n, r, i = e.options,
              o = x.makeArray(t),
              a = i.length;
          while (a--) {
            r = i[a], (r.selected = x.inArray(x(r).val(), o) >= 0) && (n = !0);
          }
          return n || (e.selectedIndex = -1), o;
        }
      }
    },
    attr: function(e, n, r) {
      var o, a, s = e.nodeType;
      if (e && 3 !== s && 8 !== s && 2 !== s) {
        return typeof e.getAttribute === i ? x.prop(e, n, r) : (1 === s && x.isXMLDoc(e) || (n = n.toLowerCase(), o = x.attrHooks[n] || (x.expr.match.bool.test(n) ? X : z)), r === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = x.find.attr(e, n), null == a ? t : a) : null !== r ? o && "set" in o && (a = o.set(e, r, n)) !== t ? a : (e.setAttribute(n, r + ""), r) : (x.removeAttr(e, n), t));
      }
    },
    removeAttr: function(e, t) {
      var n, r, i = 0,
          o = t && t.match(T);
      if (o && 1 === e.nodeType) {
        while (n = o[i++]) {
          r = x.propFix[n] || n, x.expr.match.bool.test(n) ? K && Q || !G.test(n) ? e[r] = !1 : e[x.camelCase("default-" + n)] = e[r] = !1 : x.attr(e, n, ""), e.removeAttribute(Q ? n : r);
        }
      }
    },
    attrHooks: {
      type: {
        set: function(e, t) {
          if (!x.support.radioValue && "radio" === t && x.nodeName(e, "input")) {
            var n = e.value;
            return e.setAttribute("type", t), n && (e.value = n), t;
          }
        }
      }
    },
    propFix: {
      "for": "htmlFor",
      "class": "className"
    },
    prop: function(e, n, r) {
      var i, o, a, s = e.nodeType;
      if (e && 3 !== s && 8 !== s && 2 !== s) {
        return a = 1 !== s || !x.isXMLDoc(e), a && (n = x.propFix[n] || n, o = x.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n];
      }
    },
    propHooks: {
      tabIndex: {
        get: function(e) {
          var t = x.find.attr(e, "tabindex");
          return t ? parseInt(t, 10) : Y.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : -1;
        }
      }
    }
  }), X = {
    set: function(e, t, n) {
      return t === !1 ? x.removeAttr(e, n) : K && Q || !G.test(n) ? e.setAttribute(!Q && x.propFix[n] || n, n) : e[x.camelCase("default-" + n)] = e[n] = !0, n;
    }
  }, x.each(x.expr.match.bool.source.match(/\w+/g), function(e, n) {
    var r = x.expr.attrHandle[n] || x.find.attr;
    x.expr.attrHandle[n] = K && Q || !G.test(n) ?
    function(e, n, i) {
      var o = x.expr.attrHandle[n],
          a = i ? t : (x.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null;
      return x.expr.attrHandle[n] = o, a;
    } : function(e, n, r) {
      return r ? t : e[x.camelCase("default-" + n)] ? n.toLowerCase() : null;
    };
  }), K && Q || (x.attrHooks.value = {
    set: function(e, n, r) {
      return x.nodeName(e, "input") ? (e.defaultValue = n, t) : z && z.set(e, n, r);
    }
  }), Q || (z = {
    set: function(e, n, r) {
      var i = e.getAttributeNode(r);
      return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", "value" === r || n === e.getAttribute(r) ? n : t;
    }
  }, x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function(e, n, r) {
    var i;
    return r ? t : (i = e.getAttributeNode(n)) && "" !== i.value ? i.value : null;
  }, x.valHooks.button = {
    get: function(e, n) {
      var r = e.getAttributeNode(n);
      return r && r.specified ? r.value : t;
    },
    set: z.set
  }, x.attrHooks.contenteditable = {
    set: function(e, t, n) {
      z.set(e, "" === t ? !1 : t, n);
    }
  }, x.each(["width", "height"], function(e, n) {
    x.attrHooks[n] = {
      set: function(e, r) {
        return "" === r ? (e.setAttribute(n, "auto"), r) : t;
      }
    };
  })), x.support.hrefNormalized || x.each(["href", "src"], function(e, t) {
    x.propHooks[t] = {
      get: function(e) {
        return e.getAttribute(t, 4);
      }
    };
  }), x.support.style || (x.attrHooks.style = {
    get: function(e) {
      return e.style.cssText || t;
    },
    set: function(e, t) {
      return e.style.cssText = t + "";
    }
  }), x.support.optSelected || (x.propHooks.selected = {
    get: function(e) {
      var t = e.parentNode;
      return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null;
    }
  }), x.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    x.propFix[this.toLowerCase()] = this;
  }), x.support.enctype || (x.propFix.enctype = "encoding"), x.each(["radio", "checkbox"], function() {
    x.valHooks[this] = {
      set: function(e, n) {
        return x.isArray(n) ? e.checked = x.inArray(x(e).val(), n) >= 0 : t;
      }
    }, x.support.checkOn || (x.valHooks[this].get = function(e) {
      return null === e.getAttribute("value") ? "on" : e.value;
    });
  });
  var Z = /^(?:input|select|textarea)$/i,
      et = /^key/,
      tt = /^(?:mouse|contextmenu)|click/,
      nt = /^(?:focusinfocus|focusoutblur)$/,
      rt = /^([^.]*)(?:\.(.+)|)$/;

  function it() {
    return !0;
  }
  function ot() {
    return !1;
  }
  function at() {
    try {
      return a.activeElement;
    } catch (e) {}
  }
  x.event = {
    global: {},
    add: function(e, n, r, o, a) {
      var s, l, u, c, p, f, d, h, g, m, y, v = x._data(e);
      if (v) {
        r.handler && (c = r, r = c.handler, a = c.selector), r.guid || (r.guid = x.guid++), (l = v.events) || (l = v.events = {}), (f = v.handle) || (f = v.handle = function(e) {
          return typeof x === i || e && x.event.triggered === e.type ? t : x.event.dispatch.apply(f.elem, arguments);
        }, f.elem = e), n = (n || "").match(T) || [""], u = n.length;
        while (u--) {
          s = rt.exec(n[u]) || [], g = y = s[1], m = (s[2] || "").split(".").sort(), g && (p = x.event.special[g] || {}, g = (a ? p.delegateType : p.bindType) || g, p = x.event.special[g] || {}, d = x.extend({
            type: g,
            origType: y,
            data: o,
            handler: r,
            guid: r.guid,
            selector: a,
            needsContext: a && x.expr.match.needsContext.test(a),
            namespace: m.join(".")
          }, c), (h = l[g]) || (h = l[g] = [], h.delegateCount = 0, p.setup && p.setup.call(e, o, m, f) !== !1 || (e.addEventListener ? e.addEventListener(g, f, !1) : e.attachEvent && e.attachEvent("on" + g, f))), p.add && (p.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), a ? h.splice(h.delegateCount++, 0, d) : h.push(d), x.event.global[g] = !0);
        }
        e = null;
      }
    },
    remove: function(e, t, n, r, i) {
      var o, a, s, l, u, c, p, f, d, h, g, m = x.hasData(e) && x._data(e);
      if (m && (c = m.events)) {
        t = (t || "").match(T) || [""], u = t.length;
        while (u--) {
          if (s = rt.exec(t[u]) || [], d = g = s[1], h = (s[2] || "").split(".").sort(), d) {
            p = x.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, f = c[d] || [], s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length;
            while (o--) {
              a = f[o], !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, p.remove && p.remove.call(e, a));
            }
            l && !f.length && (p.teardown && p.teardown.call(e, h, m.handle) !== !1 || x.removeEvent(e, d, m.handle), delete c[d]);
          } else {
            for (d in c) {
              x.event.remove(e, d + t[u], n, r, !0);
            }
          }
        }
        x.isEmptyObject(c) && (delete m.handle, x._removeData(e, "events"));
      }
    },
    trigger: function(n, r, i, o) {
      var s, l, u, c, p, f, d, h = [i || a],
          g = v.call(n, "type") ? n.type : n,
          m = v.call(n, "namespace") ? n.namespace.split(".") : [];
      if (u = f = i = i || a, 3 !== i.nodeType && 8 !== i.nodeType && !nt.test(g + x.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), g = m.shift(), m.sort()), l = 0 > g.indexOf(":") && "on" + g, n = n[x.expando] ? n : new x.Event(g, "object" == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r = null == r ? [n] : x.makeArray(r, [n]), p = x.event.special[g] || {}, o || !p.trigger || p.trigger.apply(i, r) !== !1)) {
        if (!o && !p.noBubble && !x.isWindow(i)) {
          for (c = p.delegateType || g, nt.test(c + g) || (u = u.parentNode); u; u = u.parentNode) {
            h.push(u), f = u;
          }
          f === (i.ownerDocument || a) && h.push(f.defaultView || f.parentWindow || e);
        }
        d = 0;
        while ((u = h[d++]) && !n.isPropagationStopped()) {
          n.type = d > 1 ? c : p.bindType || g, s = (x._data(u, "events") || {})[n.type] && x._data(u, "handle"), s && s.apply(u, r), s = l && u[l], s && x.acceptData(u) && s.apply && s.apply(u, r) === !1 && n.preventDefault();
        }
        if (n.type = g, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(h.pop(), r) === !1) && x.acceptData(i) && l && i[g] && !x.isWindow(i)) {
          f = i[l], f && (i[l] = null), x.event.triggered = g;
          try {
            i[g]();
          } catch (y) {}
          x.event.triggered = t, f && (i[l] = f);
        }
        return n.result;
      }
    },
    dispatch: function(e) {
      e = x.event.fix(e);
      var n, r, i, o, a, s = [],
          l = g.call(arguments),
          u = (x._data(this, "events") || {})[e.type] || [],
          c = x.event.special[e.type] || {};
      if (l[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
        s = x.event.handlers.call(this, e, u), n = 0;
        while ((o = s[n++]) && !e.isPropagationStopped()) {
          e.currentTarget = o.elem, a = 0;
          while ((i = o.handlers[a++]) && !e.isImmediatePropagationStopped()) {
            (!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, r = ((x.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, l), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
          }
        }
        return c.postDispatch && c.postDispatch.call(this, e), e.result;
      }
    },
    handlers: function(e, n) {
      var r, i, o, a, s = [],
          l = n.delegateCount,
          u = e.target;
      if (l && u.nodeType && (!e.button || "click" !== e.type)) {
        for (; u != this; u = u.parentNode || this) {
          if (1 === u.nodeType && (u.disabled !== !0 || "click" !== e.type)) {
            for (o = [], a = 0; l > a; a++) {
              i = n[a], r = i.selector + " ", o[r] === t && (o[r] = i.needsContext ? x(r, this).index(u) >= 0 : x.find(r, this, null, [u]).length), o[r] && o.push(i);
            }
            o.length && s.push({
              elem: u,
              handlers: o
            });
          }
        }
      }
      return n.length > l && s.push({
        elem: this,
        handlers: n.slice(l)
      }), s;
    },
    fix: function(e) {
      if (e[x.expando]) {
        return e;
      }
      var t, n, r, i = e.type,
          o = e,
          s = this.fixHooks[i];
      s || (this.fixHooks[i] = s = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = s.props ? this.props.concat(s.props) : this.props, e = new x.Event(o), t = r.length;
      while (t--) {
        n = r[t], e[n] = o[n];
      }
      return e.target || (e.target = o.srcElement || a), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !! e.metaKey, s.filter ? s.filter(e, o) : e;
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function(e, t) {
        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e;
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function(e, n) {
        var r, i, o, s = n.button,
            l = n.fromElement;
        return null == e.pageX && null != n.clientX && (i = e.target.ownerDocument || a, o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e;
      }
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        trigger: function() {
          if (this !== at() && this.focus) {
            try {
              return this.focus(), !1;
            } catch (e) {}
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          return this === at() && this.blur ? (this.blur(), !1) : t;
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function() {
          return x.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : t;
        },
        _default: function(e) {
          return x.nodeName(e.target, "a");
        }
      },
      beforeunload: {
        postDispatch: function(e) {
          e.result !== t && (e.originalEvent.returnValue = e.result);
        }
      }
    },
    simulate: function(e, t, n, r) {
      var i = x.extend(new x.Event, n, {
        type: e,
        isSimulated: !0,
        originalEvent: {}
      });
      r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault();
    }
  }, x.removeEvent = a.removeEventListener ?
  function(e, t, n) {
    e.removeEventListener && e.removeEventListener(t, n, !1);
  } : function(e, t, n) {
    var r = "on" + t;
    e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n));
  }, x.Event = function(e, n) {
    return this instanceof x.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : ot) : this.type = e, n && x.extend(this, n), this.timeStamp = e && e.timeStamp || x.now(), this[x.expando] = !0, t) : new x.Event(e, n);
  }, x.Event.prototype = {
    isDefaultPrevented: ot,
    isPropagationStopped: ot,
    isImmediatePropagationStopped: ot,
    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = it, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
    },
    stopPropagation: function() {
      var e = this.originalEvent;
      this.isPropagationStopped = it, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0);
    },
    stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = it, this.stopPropagation();
    }
  }, x.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function(e, t) {
    x.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function(e) {
        var n, r = this,
            i = e.relatedTarget,
            o = e.handleObj;
        return (!i || i !== r && !x.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n;
      }
    };
  }), x.support.submitBubbles || (x.event.special.submit = {
    setup: function() {
      return x.nodeName(this, "form") ? !1 : (x.event.add(this, "click._submit keypress._submit", function(e) {
        var n = e.target,
            r = x.nodeName(n, "input") || x.nodeName(n, "button") ? n.form : t;
        r && !x._data(r, "submitBubbles") && (x.event.add(r, "submit._submit", function(e) {
          e._submit_bubble = !0;
        }), x._data(r, "submitBubbles", !0));
      }), t);
    },
    postDispatch: function(e) {
      e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && x.event.simulate("submit", this.parentNode, e, !0));
    },
    teardown: function() {
      return x.nodeName(this, "form") ? !1 : (x.event.remove(this, "._submit"), t);
    }
  }), x.support.changeBubbles || (x.event.special.change = {
    setup: function() {
      return Z.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (x.event.add(this, "propertychange._change", function(e) {
        "checked" === e.originalEvent.propertyName && (this._just_changed = !0);
      }), x.event.add(this, "click._change", function(e) {
        this._just_changed && !e.isTrigger && (this._just_changed = !1), x.event.simulate("change", this, e, !0);
      })), !1) : (x.event.add(this, "beforeactivate._change", function(e) {
        var t = e.target;
        Z.test(t.nodeName) && !x._data(t, "changeBubbles") && (x.event.add(t, "change._change", function(e) {
          !this.parentNode || e.isSimulated || e.isTrigger || x.event.simulate("change", this.parentNode, e, !0);
        }), x._data(t, "changeBubbles", !0));
      }), t);
    },
    handle: function(e) {
      var n = e.target;
      return this !== n || e.isSimulated || e.isTrigger || "radio" !== n.type && "checkbox" !== n.type ? e.handleObj.handler.apply(this, arguments) : t;
    },
    teardown: function() {
      return x.event.remove(this, "._change"), !Z.test(this.nodeName);
    }
  }), x.support.focusinBubbles || x.each({
    focus: "focusin",
    blur: "focusout"
  }, function(e, t) {
    var n = 0,
        r = function(e) {
        x.event.simulate(t, e.target, x.event.fix(e), !0);
        };
    x.event.special[t] = {
      setup: function() {
        0 === n++ && a.addEventListener(e, r, !0);
      },
      teardown: function() {
        0 === --n && a.removeEventListener(e, r, !0);
      }
    };
  }), x.fn.extend({
    on: function(e, n, r, i, o) {
      var a, s;
      if ("object" == typeof e) {
        "string" != typeof n && (r = r || n, n = t);
        for (a in e) {
          this.on(a, n, r, e[a], o);
        }
        return this;
      }
      if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1) {
        i = ot;
      } else {
        if (!i) {
          return this;
        }
      }
      return 1 === o && (s = i, i = function(e) {
        return x().off(e), s.apply(this, arguments);
      }, i.guid = s.guid || (s.guid = x.guid++)), this.each(function() {
        x.event.add(this, e, i, r, n);
      });
    },
    one: function(e, t, n, r) {
      return this.on(e, t, n, r, 1);
    },
    off: function(e, n, r) {
      var i, o;
      if (e && e.preventDefault && e.handleObj) {
        return i = e.handleObj, x(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
      }
      if ("object" == typeof e) {
        for (o in e) {
          this.off(o, n, e[o]);
        }
        return this;
      }
      return (n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = ot), this.each(function() {
        x.event.remove(this, e, r, n);
      });
    },
    trigger: function(e, t) {
      return this.each(function() {
        x.event.trigger(e, t, this);
      });
    },
    triggerHandler: function(e, n) {
      var r = this[0];
      return r ? x.event.trigger(e, n, r, !0) : t;
    }
  });
  var st = /^.[^:#\[\.,]*$/,
      lt = /^(?:parents|prev(?:Until|All))/,
      ut = x.expr.match.needsContext,
      ct = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
      };
  x.fn.extend({
    find: function(e) {
      var t, n = [],
          r = this,
          i = r.length;
      if ("string" != typeof e) {
        return this.pushStack(x(e).filter(function() {
          for (t = 0; i > t; t++) {
            if (x.contains(r[t], this)) {
              return !0;
            }
          }
        }));
      }
      for (t = 0; i > t; t++) {
        x.find(e, r[t], n);
      }
      return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n;
    },
    has: function(e) {
      var t, n = x(e, this),
          r = n.length;
      return this.filter(function() {
        for (t = 0; r > t; t++) {
          if (x.contains(this, n[t])) {
            return !0;
          }
        }
      });
    },
    not: function(e) {
      return this.pushStack(ft(this, e || [], !0));
    },
    filter: function(e) {
      return this.pushStack(ft(this, e || [], !1));
    },
    is: function(e) {
      return !!ft(this, "string" == typeof e && ut.test(e) ? x(e) : e || [], !1).length;
    },
    closest: function(e, t) {
      var n, r = 0,
          i = this.length,
          o = [],
          a = ut.test(e) || "string" != typeof e ? x(e, t || this.context) : 0;
      for (; i > r; r++) {
        for (n = this[r]; n && n !== t; n = n.parentNode) {
          if (11 > n.nodeType && (a ? a.index(n) > -1 : 1 === n.nodeType && x.find.matchesSelector(n, e))) {
            n = o.push(n);
            break;
          }
        }
      }
      return this.pushStack(o.length > 1 ? x.unique(o) : o);
    },
    index: function(e) {
      return e ? "string" == typeof e ? x.inArray(this[0], x(e)) : x.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    add: function(e, t) {
      var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e.nodeType ? [e] : e),
          r = x.merge(this.get(), n);
      return this.pushStack(x.unique(r));
    },
    addBack: function(e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }
  });

  function pt(e, t) {
    do {
      e = e[t];
    } while (e && 1 !== e.nodeType);
    return e;
  }
  x.each({
    parent: function(e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    },
    parents: function(e) {
      return x.dir(e, "parentNode");
    },
    parentsUntil: function(e, t, n) {
      return x.dir(e, "parentNode", n);
    },
    next: function(e) {
      return pt(e, "nextSibling");
    },
    prev: function(e) {
      return pt(e, "previousSibling");
    },
    nextAll: function(e) {
      return x.dir(e, "nextSibling");
    },
    prevAll: function(e) {
      return x.dir(e, "previousSibling");
    },
    nextUntil: function(e, t, n) {
      return x.dir(e, "nextSibling", n);
    },
    prevUntil: function(e, t, n) {
      return x.dir(e, "previousSibling", n);
    },
    siblings: function(e) {
      return x.sibling((e.parentNode || {}).firstChild, e);
    },
    children: function(e) {
      return x.sibling(e.firstChild);
    },
    contents: function(e) {
      return x.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : x.merge([], e.childNodes);
    }
  }, function(e, t) {
    x.fn[e] = function(n, r) {
      var i = x.map(this, t, n);
      return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = x.filter(r, i)), this.length > 1 && (ct[e] || (i = x.unique(i)), lt.test(e) && (i = i.reverse())), this.pushStack(i);
    };
  }), x.extend({
    filter: function(e, t, n) {
      var r = t[0];
      return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? x.find.matchesSelector(r, e) ? [r] : [] : x.find.matches(e, x.grep(t, function(e) {
        return 1 === e.nodeType;
      }));
    },
    dir: function(e, n, r) {
      var i = [],
          o = e[n];
      while (o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !x(o).is(r))) {
        1 === o.nodeType && i.push(o), o = o[n];
      }
      return i;
    },
    sibling: function(e, t) {
      var n = [];
      for (; e; e = e.nextSibling) {
        1 === e.nodeType && e !== t && n.push(e);
      }
      return n;
    }
  });

  function ft(e, t, n) {
    if (x.isFunction(t)) {
      return x.grep(e, function(e, r) {
        return !!t.call(e, r, e) !== n;
      });
    }
    if (t.nodeType) {
      return x.grep(e, function(e) {
        return e === t !== n;
      });
    }
    if ("string" == typeof t) {
      if (st.test(t)) {
        return x.filter(t, e, n);
      }
      t = x.filter(t, e);
    }
    return x.grep(e, function(e) {
      return x.inArray(e, t) >= 0 !== n;
    });
  }
  function dt(e) {
    var t = ht.split("|"),
        n = e.createDocumentFragment();
    if (n.createElement) {
      while (t.length) {
        n.createElement(t.pop());
      }
    }
    return n;
  }
  var ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
      gt = / jQuery\d+="(?:null|\d+)"/g,
      mt = RegExp("<(?:" + ht + ")[\\s/>]", "i"),
      yt = /^\s+/,
      vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      bt = /<([\w:]+)/,
      xt = /<tbody/i,
      wt = /<|&#?\w+;/,
      Tt = /<(?:script|style|link)/i,
      Ct = /^(?:checkbox|radio)$/i,
      Nt = /checked\s*(?:[^=]|=\s*.checked.)/i,
      kt = /^$|\/(?:java|ecma)script/i,
      Et = /^true\/(.*)/,
      St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
      At = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: x.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
      },
      jt = dt(a),
      Dt = jt.appendChild(a.createElement("div"));
  At.optgroup = At.option, At.tbody = At.tfoot = At.colgroup = At.caption = At.thead, At.th = At.td, x.fn.extend({
    text: function(e) {
      return x.access(this, function(e) {
        return e === t ? x.text(this) : this.empty().append((this[0] && this[0].ownerDocument || a).createTextNode(e));
      }, null, e, arguments.length);
    },
    append: function() {
      return this.domManip(arguments, function(e) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var t = Lt(this, e);
          t.appendChild(e);
        }
      });
    },
    prepend: function() {
      return this.domManip(arguments, function(e) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var t = Lt(this, e);
          t.insertBefore(e, t.firstChild);
        }
      });
    },
    before: function() {
      return this.domManip(arguments, function(e) {
        this.parentNode && this.parentNode.insertBefore(e, this);
      });
    },
    after: function() {
      return this.domManip(arguments, function(e) {
        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
      });
    },
    remove: function(e, t) {
      var n, r = e ? x.filter(e, this) : this,
          i = 0;
      for (; null != (n = r[i]); i++) {
        t || 1 !== n.nodeType || x.cleanData(Ft(n)), n.parentNode && (t && x.contains(n.ownerDocument, n) && _t(Ft(n, "script")), n.parentNode.removeChild(n));
      }
      return this;
    },
    empty: function() {
      var e, t = 0;
      for (; null != (e = this[t]); t++) {
        1 === e.nodeType && x.cleanData(Ft(e, !1));
        while (e.firstChild) {
          e.removeChild(e.firstChild);
        }
        e.options && x.nodeName(e, "select") && (e.options.length = 0);
      }
      return this;
    },
    clone: function(e, t) {
      return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
        return x.clone(this, e, t);
      });
    },
    html: function(e) {
      return x.access(this, function(e) {
        var n = this[0] || {},
            r = 0,
            i = this.length;
        if (e === t) {
          return 1 === n.nodeType ? n.innerHTML.replace(gt, "") : t;
        }
        if (!("string" != typeof e || Tt.test(e) || !x.support.htmlSerialize && mt.test(e) || !x.support.leadingWhitespace && yt.test(e) || At[(bt.exec(e) || ["", ""])[1].toLowerCase()])) {
          e = e.replace(vt, "<$1></$2>");
          try {
            for (; i > r; r++) {
              n = this[r] || {}, 1 === n.nodeType && (x.cleanData(Ft(n, !1)), n.innerHTML = e);
            }
            n = 0;
          } catch (o) {}
        }
        n && this.empty().append(e);
      }, null, e, arguments.length);
    },
    replaceWith: function() {
      var e = x.map(this, function(e) {
        return [e.nextSibling, e.parentNode];
      }),
          t = 0;
      return this.domManip(arguments, function(n) {
        var r = e[t++],
            i = e[t++];
        i && (r && r.parentNode !== i && (r = this.nextSibling), x(this).remove(), i.insertBefore(n, r));
      }, !0), t ? this : this.remove();
    },
    detach: function(e) {
      return this.remove(e, !0);
    },
    domManip: function(e, t, n) {
      e = d.apply([], e);
      var r, i, o, a, s, l, u = 0,
          c = this.length,
          p = this,
          f = c - 1,
          h = e[0],
          g = x.isFunction(h);
      if (g || !(1 >= c || "string" != typeof h || x.support.checkClone) && Nt.test(h)) {
        return this.each(function(r) {
          var i = p.eq(r);
          g && (e[0] = h.call(this, r, i.html())), i.domManip(e, t, n);
        });
      }
      if (c && (l = x.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = l.firstChild, 1 === l.childNodes.length && (l = r), r)) {
        for (a = x.map(Ft(l, "script"), Ht), o = a.length; c > u; u++) {
          i = l, u !== f && (i = x.clone(i, !0, !0), o && x.merge(a, Ft(i, "script"))), t.call(this[u], i, u);
        }
        if (o) {
          for (s = a[a.length - 1].ownerDocument, x.map(a, qt), u = 0; o > u; u++) {
            i = a[u], kt.test(i.type || "") && !x._data(i, "globalEval") && x.contains(s, i) && (i.src ? x._evalUrl(i.src) : x.globalEval((i.text || i.textContent || i.innerHTML || "").replace(St, "")));
          }
        }
        l = r = null;
      }
      return this;
    }
  });

  function Lt(e, t) {
    return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e;
  }
  function Ht(e) {
    return e.type = (null !== x.find.attr(e, "type")) + "/" + e.type, e;
  }
  function qt(e) {
    var t = Et.exec(e.type);
    return t ? e.type = t[1] : e.removeAttribute("type"), e;
  }
  function _t(e, t) {
    var n, r = 0;
    for (; null != (n = e[r]); r++) {
      x._data(n, "globalEval", !t || x._data(t[r], "globalEval"));
    }
  }
  function Mt(e, t) {
    if (1 === t.nodeType && x.hasData(e)) {
      var n, r, i, o = x._data(e),
          a = x._data(t, o),
          s = o.events;
      if (s) {
        delete a.handle, a.events = {};
        for (n in s) {
          for (r = 0, i = s[n].length; i > r; r++) {
            x.event.add(t, n, s[n][r]);
          }
        }
      }
      a.data && (a.data = x.extend({}, a.data));
    }
  }
  function Ot(e, t) {
    var n, r, i;
    if (1 === t.nodeType) {
      if (n = t.nodeName.toLowerCase(), !x.support.noCloneEvent && t[x.expando]) {
        i = x._data(t);
        for (r in i.events) {
          x.removeEvent(t, r, i.handle);
        }
        t.removeAttribute(x.expando);
      }
      "script" === n && t.text !== e.text ? (Ht(t).text = e.text, qt(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), x.support.html5Clone && e.innerHTML && !x.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ct.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue);
    }
  }
  x.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(e, t) {
    x.fn[e] = function(e) {
      var n, r = 0,
          i = [],
          o = x(e),
          a = o.length - 1;
      for (; a >= r; r++) {
        n = r === a ? this : this.clone(!0), x(o[r])[t](n), h.apply(i, n.get());
      }
      return this.pushStack(i);
    };
  });

  function Ft(e, n) {
    var r, o, a = 0,
        s = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
    if (!s) {
      for (s = [], r = e.childNodes || e; null != (o = r[a]); a++) {
        !n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n));
      }
    }
    return n === t || n && x.nodeName(e, n) ? x.merge([e], s) : s;
  }
  function Bt(e) {
    Ct.test(e.type) && (e.defaultChecked = e.checked);
  }
  x.extend({
    clone: function(e, t, n) {
      var r, i, o, a, s, l = x.contains(e.ownerDocument, e);
      if (x.support.html5Clone || x.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Dt.innerHTML = e.outerHTML, Dt.removeChild(o = Dt.firstChild)), !(x.support.noCloneEvent && x.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || x.isXMLDoc(e))) {
        for (r = Ft(o), s = Ft(e), a = 0; null != (i = s[a]); ++a) {
          r[a] && Ot(i, r[a]);
        }
      }
      if (t) {
        if (n) {
          for (s = s || Ft(e), r = r || Ft(o), a = 0; null != (i = s[a]); a++) {
            Mt(i, r[a]);
          }
        } else {
          Mt(e, o);
        }
      }
      return r = Ft(o, "script"), r.length > 0 && _t(r, !l && Ft(e, "script")), r = s = i = null, o;
    },
    buildFragment: function(e, t, n, r) {
      var i, o, a, s, l, u, c, p = e.length,
          f = dt(t),
          d = [],
          h = 0;
      for (; p > h; h++) {
        if (o = e[h], o || 0 === o) {
          if ("object" === x.type(o)) {
            x.merge(d, o.nodeType ? [o] : o);
          } else {
            if (wt.test(o)) {
              s = s || f.appendChild(t.createElement("div")), l = (bt.exec(o) || ["", ""])[1].toLowerCase(), c = At[l] || At._default, s.innerHTML = c[1] + o.replace(vt, "<$1></$2>") + c[2], i = c[0];
              while (i--) {
                s = s.lastChild;
              }
              if (!x.support.leadingWhitespace && yt.test(o) && d.push(t.createTextNode(yt.exec(o)[0])), !x.support.tbody) {
                o = "table" !== l || xt.test(o) ? "<table>" !== c[1] || xt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length;
                while (i--) {
                  x.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u);
                }
              }
              x.merge(d, s.childNodes), s.textContent = "";
              while (s.firstChild) {
                s.removeChild(s.firstChild);
              }
              s = f.lastChild;
            } else {
              d.push(t.createTextNode(o));
            }
          }
        }
      }
      s && f.removeChild(s), x.support.appendChecked || x.grep(Ft(d, "input"), Bt), h = 0;
      while (o = d[h++]) {
        if ((!r || -1 === x.inArray(o, r)) && (a = x.contains(o.ownerDocument, o), s = Ft(f.appendChild(o), "script"), a && _t(s), n)) {
          i = 0;
          while (o = s[i++]) {
            kt.test(o.type || "") && n.push(o);
          }
        }
      }
      return s = null, f;
    },
    cleanData: function(e, t) {
      var n, r, o, a, s = 0,
          l = x.expando,
          u = x.cache,
          c = x.support.deleteExpando,
          f = x.event.special;
      for (; null != (n = e[s]); s++) {
        if ((t || x.acceptData(n)) && (o = n[l], a = o && u[o])) {
          if (a.events) {
            for (r in a.events) {
              f[r] ? x.event.remove(n, r) : x.removeEvent(n, r, a.handle);
            }
          }
          u[o] && (delete u[o], c ? delete n[l] : typeof n.removeAttribute !== i ? n.removeAttribute(l) : n[l] = null, p.push(o));
        }
      }
    },
    _evalUrl: function(e) {
      return x.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        "throws": !0
      });
    }
  }), x.fn.extend({
    wrapAll: function(e) {
      if (x.isFunction(e)) {
        return this.each(function(t) {
          x(this).wrapAll(e.call(this, t));
        });
      }
      if (this[0]) {
        var t = x(e, this[0].ownerDocument).eq(0).clone(!0);
        this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
          var e = this;
          while (e.firstChild && 1 === e.firstChild.nodeType) {
            e = e.firstChild;
          }
          return e;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(e) {
      return x.isFunction(e) ? this.each(function(t) {
        x(this).wrapInner(e.call(this, t));
      }) : this.each(function() {
        var t = x(this),
            n = t.contents();
        n.length ? n.wrapAll(e) : t.append(e);
      });
    },
    wrap: function(e) {
      var t = x.isFunction(e);
      return this.each(function(n) {
        x(this).wrapAll(t ? e.call(this, n) : e);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        x.nodeName(this, "body") || x(this).replaceWith(this.childNodes);
      }).end();
    }
  });
  var Pt, Rt, Wt, $t = /alpha\([^)]*\)/i,
      It = /opacity\s*=\s*([^)]*)/,
      zt = /^(top|right|bottom|left)$/,
      Xt = /^(none|table(?!-c[ea]).+)/,
      Ut = /^margin/,
      Vt = RegExp("^(" + w + ")(.*)$", "i"),
      Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"),
      Jt = RegExp("^([+-])=(" + w + ")", "i"),
      Gt = {
      BODY: "block"
      },
      Qt = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
      },
      Kt = {
      letterSpacing: 0,
      fontWeight: 400
      },
      Zt = ["Top", "Right", "Bottom", "Left"],
      en = ["Webkit", "O", "Moz", "ms"];

  function tn(e, t) {
    if (t in e) {
      return t;
    }
    var n = t.charAt(0).toUpperCase() + t.slice(1),
        r = t,
        i = en.length;
    while (i--) {
      if (t = en[i] + n, t in e) {
        return t;
      }
    }
    return r;
  }
  function nn(e, t) {
    return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument, e);
  }
  function rn(e, t) {
    var n, r, i, o = [],
        a = 0,
        s = e.length;
    for (; s > a; a++) {
      r = e[a], r.style && (o[a] = x._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && nn(r) && (o[a] = x._data(r, "olddisplay", ln(r.nodeName)))) : o[a] || (i = nn(r), (n && "none" !== n || !i) && x._data(r, "olddisplay", i ? n : x.css(r, "display"))));
    }
    for (a = 0; s > a; a++) {
      r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
    }
    return e;
  }
  x.fn.extend({
    css: function(e, n) {
      return x.access(this, function(e, n, r) {
        var i, o, a = {},
            s = 0;
        if (x.isArray(n)) {
          for (o = Rt(e), i = n.length; i > s; s++) {
            a[n[s]] = x.css(e, n[s], !1, o);
          }
          return a;
        }
        return r !== t ? x.style(e, n, r) : x.css(e, n);
      }, e, n, arguments.length > 1);
    },
    show: function() {
      return rn(this, !0);
    },
    hide: function() {
      return rn(this);
    },
    toggle: function(e) {
      return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
        nn(this) ? x(this).show() : x(this).hide();
      });
    }
  }), x.extend({
    cssHooks: {
      opacity: {
        get: function(e, t) {
          if (t) {
            var n = Wt(e, "opacity");
            return "" === n ? "1" : n;
          }
        }
      }
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {
      "float": x.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function(e, n, r, i) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var o, a, s, l = x.camelCase(n),
            u = e.style;
        if (n = x.cssProps[l] || (x.cssProps[l] = tn(u, l)), s = x.cssHooks[n] || x.cssHooks[l], r === t) {
          return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n];
        }
        if (a = typeof r, "string" === a && (o = Jt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(x.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || x.cssNumber[l] || (r += "px"), x.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (u[n] = "inherit"), s && "set" in s && (r = s.set(e, r, i)) === t))) {
          try {
            u[n] = r;
          } catch (c) {}
        }
      }
    },
    css: function(e, n, r, i) {
      var o, a, s, l = x.camelCase(n);
      return n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l)), s = x.cssHooks[n] || x.cssHooks[l], s && "get" in s && (a = s.get(e, !0, r)), a === t && (a = Wt(e, n, i)), "normal" === a && n in Kt && (a = Kt[n]), "" === r || r ? (o = parseFloat(a), r === !0 || x.isNumeric(o) ? o || 0 : a) : a;
    }
  }), e.getComputedStyle ? (Rt = function(t) {
    return e.getComputedStyle(t, null);
  }, Wt = function(e, n, r) {
    var i, o, a, s = r || Rt(e),
        l = s ? s.getPropertyValue(n) || s[n] : t,
        u = e.style;
    return s && ("" !== l || x.contains(e.ownerDocument, e) || (l = x.style(e, n)), Yt.test(l) && Ut.test(n) && (i = u.width, o = u.minWidth, a = u.maxWidth, u.minWidth = u.maxWidth = u.width = l, l = s.width, u.width = i, u.minWidth = o, u.maxWidth = a)), l;
  }) : a.documentElement.currentStyle && (Rt = function(e) {
    return e.currentStyle;
  }, Wt = function(e, n, r) {
    var i, o, a, s = r || Rt(e),
        l = s ? s[n] : t,
        u = e.style;
    return null == l && u && u[n] && (l = u[n]), Yt.test(l) && !zt.test(n) && (i = u.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), u.left = "fontSize" === n ? "1em" : l, l = u.pixelLeft + "px", u.left = i, a && (o.left = a)), "" === l ? "auto" : l;
  });

  function on(e, t, n) {
    var r = Vt.exec(t);
    return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t;
  }
  function an(e, t, n, r, i) {
    var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0,
        a = 0;
    for (; 4 > o; o += 2) {
      "margin" === n && (a += x.css(e, n + Zt[o], !0, i)), r ? ("content" === n && (a -= x.css(e, "padding" + Zt[o], !0, i)), "margin" !== n && (a -= x.css(e, "border" + Zt[o] + "Width", !0, i))) : (a += x.css(e, "padding" + Zt[o], !0, i), "padding" !== n && (a += x.css(e, "border" + Zt[o] + "Width", !0, i)));
    }
    return a;
  }
  function sn(e, t, n) {
    var r = !0,
        i = "width" === t ? e.offsetWidth : e.offsetHeight,
        o = Rt(e),
        a = x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, o);
    if (0 >= i || null == i) {
      if (i = Wt(e, t, o), (0 > i || null == i) && (i = e.style[t]), Yt.test(i)) {
        return i;
      }
      r = a && (x.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0;
    }
    return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px";
  }
  function ln(e) {
    var t = a,
        n = Gt[e];
    return n || (n = un(e, t), "none" !== n && n || (Pt = (Pt || x("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (Pt[0].contentWindow || Pt[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = un(e, t), Pt.detach()), Gt[e] = n), n;
  }
  function un(e, t) {
    var n = x(t.createElement(e)).appendTo(t.body),
        r = x.css(n[0], "display");
    return n.remove(), r;
  }
  x.each(["height", "width"], function(e, n) {
    x.cssHooks[n] = {
      get: function(e, r, i) {
        return r ? 0 === e.offsetWidth && Xt.test(x.css(e, "display")) ? x.swap(e, Qt, function() {
          return sn(e, n, i);
        }) : sn(e, n, i) : t;
      },
      set: function(e, t, r) {
        var i = r && Rt(e);
        return on(e, t, r ? an(e, n, r, x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, i), i) : 0);
      }
    };
  }), x.support.opacity || (x.cssHooks.opacity = {
    get: function(e, t) {
      return It.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : t ? "1" : "";
    },
    set: function(e, t) {
      var n = e.style,
          r = e.currentStyle,
          i = x.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
          o = r && r.filter || n.filter || "";
      n.zoom = 1, (t >= 1 || "" === t) && "" === x.trim(o.replace($t, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = $t.test(o) ? o.replace($t, i) : o + " " + i);
    }
  }), x(function() {
    x.support.reliableMarginRight || (x.cssHooks.marginRight = {
      get: function(e, n) {
        return n ? x.swap(e, {
          display: "inline-block"
        }, Wt, [e, "marginRight"]) : t;
      }
    }), !x.support.pixelPosition && x.fn.position && x.each(["top", "left"], function(e, n) {
      x.cssHooks[n] = {
        get: function(e, r) {
          return r ? (r = Wt(e, n), Yt.test(r) ? x(e).position()[n] + "px" : r) : t;
        }
      };
    });
  }), x.expr && x.expr.filters && (x.expr.filters.hidden = function(e) {
    return 0 >= e.offsetWidth && 0 >= e.offsetHeight || !x.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || x.css(e, "display"));
  }, x.expr.filters.visible = function(e) {
    return !x.expr.filters.hidden(e);
  }), x.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(e, t) {
    x.cssHooks[e + t] = {
      expand: function(n) {
        var r = 0,
            i = {},
            o = "string" == typeof n ? n.split(" ") : [n];
        for (; 4 > r; r++) {
          i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0];
        }
        return i;
      }
    }, Ut.test(e) || (x.cssHooks[e + t].set = on);
  });
  var cn = /%20/g,
      pn = /\[\]$/,
      fn = /\r?\n/g,
      dn = /^(?:submit|button|image|reset|file)$/i,
      hn = /^(?:input|select|textarea|keygen)/i;
  x.fn.extend({
    serialize: function() {
      return x.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        var e = x.prop(this, "elements");
        return e ? x.makeArray(e) : this;
      }).filter(function() {
        var e = this.type;
        return this.name && !x(this).is(":disabled") && hn.test(this.nodeName) && !dn.test(e) && (this.checked || !Ct.test(e));
      }).map(function(e, t) {
        var n = x(this).val();
        return null == n ? null : x.isArray(n) ? x.map(n, function(e) {
          return {
            name: t.name,
            value: e.replace(fn, "\r\n")
          };
        }) : {
          name: t.name,
          value: n.replace(fn, "\r\n")
        };
      }).get();
    }
  }), x.param = function(e, n) {
    var r, i = [],
        o = function(e, t) {
        t = x.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
        };
    if (n === t && (n = x.ajaxSettings && x.ajaxSettings.traditional), x.isArray(e) || e.jquery && !x.isPlainObject(e)) {
      x.each(e, function() {
        o(this.name, this.value);
      });
    } else {
      for (r in e) {
        gn(r, e[r], n, o);
      }
    }
    return i.join("&").replace(cn, "+");
  };

  function gn(e, t, n, r) {
    var i;
    if (x.isArray(t)) {
      x.each(t, function(t, i) {
        n || pn.test(e) ? r(e, i) : gn(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r);
      });
    } else {
      if (n || "object" !== x.type(t)) {
        r(e, t);
      } else {
        for (i in t) {
          gn(e + "[" + i + "]", t[i], n, r);
        }
      }
    }
  }
  x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
    x.fn[t] = function(e, n) {
      return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
    };
  }), x.fn.extend({
    hover: function(e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    },
    bind: function(e, t, n) {
      return this.on(e, null, t, n);
    },
    unbind: function(e, t) {
      return this.off(e, null, t);
    },
    delegate: function(e, t, n, r) {
      return this.on(t, e, n, r);
    },
    undelegate: function(e, t, n) {
      return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n);
    }
  });
  var mn, yn, vn = x.now(),
      bn = /\?/,
      xn = /#.*$/,
      wn = /([?&])_=[^&]*/,
      Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
      Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      Nn = /^(?:GET|HEAD)$/,
      kn = /^\/\//,
      En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      Sn = x.fn.load,
      An = {},
      jn = {},
      Dn = "*/".concat("*");
  try {
    yn = o.href;
  } catch (Ln) {
    yn = a.createElement("a"), yn.href = "", yn = yn.href;
  }
  mn = En.exec(yn.toLowerCase()) || [];

  function Hn(e) {
    return function(t, n) {
      "string" != typeof t && (n = t, t = "*");
      var r, i = 0,
          o = t.toLowerCase().match(T) || [];
      if (x.isFunction(n)) {
        while (r = o[i++]) {
          "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n);
        }
      }
    };
  }
  function qn(e, n, r, i) {
    var o = {},
        a = e === jn;

    function s(l) {
      var u;
      return o[l] = !0, x.each(e[l] || [], function(e, l) {
        var c = l(n, r, i);
        return "string" != typeof c || a || o[c] ? a ? !(u = c) : t : (n.dataTypes.unshift(c), s(c), !1);
      }), u;
    }
    return s(n.dataTypes[0]) || !o["*"] && s("*");
  }
  function _n(e, n) {
    var r, i, o = x.ajaxSettings.flatOptions || {};
    for (i in n) {
      n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]);
    }
    return r && x.extend(!0, e, r), e;
  }
  x.fn.load = function(e, n, r) {
    if ("string" != typeof e && Sn) {
      return Sn.apply(this, arguments);
    }
    var i, o, a, s = this,
        l = e.indexOf(" ");
    return l >= 0 && (i = e.slice(l, e.length), e = e.slice(0, l)), x.isFunction(n) ? (r = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && x.ajax({
      url: e,
      type: a,
      dataType: "html",
      data: n
    }).done(function(e) {
      o = arguments, s.html(i ? x("<div>").append(x.parseHTML(e)).find(i) : e);
    }).complete(r &&
    function(e, t) {
      s.each(r, o || [e.responseText, t, e]);
    }), this;
  }, x.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
    x.fn[t] = function(e) {
      return this.on(t, e);
    };
  }), x.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: yn,
      type: "GET",
      isLocal: Cn.test(mn[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": Dn,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": x.parseJSON,
        "text xml": x.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function(e, t) {
      return t ? _n(_n(e, x.ajaxSettings), t) : _n(x.ajaxSettings, e);
    },
    ajaxPrefilter: Hn(An),
    ajaxTransport: Hn(jn),
    ajax: function(e, n) {
      "object" == typeof e && (n = e, e = t), n = n || {};
      var r, i, o, a, s, l, u, c, p = x.ajaxSetup({}, n),
          f = p.context || p,
          d = p.context && (f.nodeType || f.jquery) ? x(f) : x.event,
          h = x.Deferred(),
          g = x.Callbacks("once memory"),
          m = p.statusCode || {},
          y = {},
          v = {},
          b = 0,
          w = "canceled",
          C = {
          readyState: 0,
          getResponseHeader: function(e) {
            var t;
            if (2 === b) {
              if (!c) {
                c = {};
                while (t = Tn.exec(a)) {
                  c[t[1].toLowerCase()] = t[2];
                }
              }
              t = c[e.toLowerCase()];
            }
            return null == t ? null : t;
          },
          getAllResponseHeaders: function() {
            return 2 === b ? a : null;
          },
          setRequestHeader: function(e, t) {
            var n = e.toLowerCase();
            return b || (e = v[n] = v[n] || e, y[e] = t), this;
          },
          overrideMimeType: function(e) {
            return b || (p.mimeType = e), this;
          },
          statusCode: function(e) {
            var t;
            if (e) {
              if (2 > b) {
                for (t in e) {
                  m[t] = [m[t], e[t]];
                }
              } else {
                C.always(e[C.status]);
              }
            }
            return this;
          },
          abort: function(e) {
            var t = e || w;
            return u && u.abort(t), k(0, t), this;
          }
          };
      if (h.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, p.url = ((e || p.url || yn) + "").replace(xn, "").replace(kn, mn[1] + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = x.trim(p.dataType || "*").toLowerCase().match(T) || [""], null == p.crossDomain && (r = En.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (mn[3] || ("http:" === mn[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = x.param(p.data, p.traditional)), qn(An, p, n, C), 2 === b) {
        return C;
      }
      l = p.global, l && 0 === x.active++ && x.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Nn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (bn.test(o) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = wn.test(o) ? o.replace(wn, "$1_=" + vn++) : o + (bn.test(o) ? "&" : "?") + "_=" + vn++)), p.ifModified && (x.lastModified[o] && C.setRequestHeader("If-Modified-Since", x.lastModified[o]), x.etag[o] && C.setRequestHeader("If-None-Match", x.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Dn + "; q=0.01" : "") : p.accepts["*"]);
      for (i in p.headers) {
        C.setRequestHeader(i, p.headers[i]);
      }
      if (p.beforeSend && (p.beforeSend.call(f, C, p) === !1 || 2 === b)) {
        return C.abort();
      }
      w = "abort";
      for (i in {
        success: 1,
        error: 1,
        complete: 1
      }) {
        C[i](p[i]);
      }
      if (u = qn(jn, p, n, C)) {
        C.readyState = 1, l && d.trigger("ajaxSend", [C, p]), p.async && p.timeout > 0 && (s = setTimeout(function() {
          C.abort("timeout");
        }, p.timeout));
        try {
          b = 1, u.send(y, k);
        } catch (N) {
          if (!(2 > b)) {
            throw N;
          }
          k(-1, N);
        }
      } else {
        k(-1, "No Transport");
      }
      function k(e, n, r, i) {
        var c, y, v, w, T, N = n;
        2 !== b && (b = 2, s && clearTimeout(s), u = t, a = i || "", C.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, r && (w = Mn(p, C, r)), w = On(p, w, C, c), c ? (p.ifModified && (T = C.getResponseHeader("Last-Modified"), T && (x.lastModified[o] = T), T = C.getResponseHeader("etag"), T && (x.etag[o] = T)), 204 === e || "HEAD" === p.type ? N = "nocontent" : 304 === e ? N = "notmodified" : (N = w.state, y = w.data, v = w.error, c = !v)) : (v = N, (e || !N) && (N = "error", 0 > e && (e = 0))), C.status = e, C.statusText = (n || N) + "", c ? h.resolveWith(f, [y, N, C]) : h.rejectWith(f, [C, N, v]), C.statusCode(m), m = t, l && d.trigger(c ? "ajaxSuccess" : "ajaxError", [C, p, c ? y : v]), g.fireWith(f, [C, N]), l && (d.trigger("ajaxComplete", [C, p]), --x.active || x.event.trigger("ajaxStop")));
      }
      return C;
    },
    getJSON: function(e, t, n) {
      return x.get(e, t, n, "json");
    },
    getScript: function(e, n) {
      return x.get(e, t, n, "script");
    }
  }), x.each(["get", "post"], function(e, n) {
    x[n] = function(e, r, i, o) {
      return x.isFunction(r) && (o = o || i, i = r, r = t), x.ajax({
        url: e,
        type: n,
        dataType: o,
        data: r,
        success: i
      });
    };
  });

  function Mn(e, n, r) {
    var i, o, a, s, l = e.contents,
        u = e.dataTypes;
    while ("*" === u[0]) {
      u.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type"));
    }
    if (o) {
      for (s in l) {
        if (l[s] && l[s].test(o)) {
          u.unshift(s);
          break;
        }
      }
    }
    if (u[0] in r) {
      a = u[0];
    } else {
      for (s in r) {
        if (!u[0] || e.converters[s + " " + u[0]]) {
          a = s;
          break;
        }
        i || (i = s);
      }
      a = a || i;
    }
    return a ? (a !== u[0] && u.unshift(a), r[a]) : t;
  }
  function On(e, t, n, r) {
    var i, o, a, s, l, u = {},
        c = e.dataTypes.slice();
    if (c[1]) {
      for (a in e.converters) {
        u[a.toLowerCase()] = e.converters[a];
      }
    }
    o = c.shift();
    while (o) {
      if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift()) {
        if ("*" === o) {
          o = l;
        } else {
          if ("*" !== l && l !== o) {
            if (a = u[l + " " + o] || u["* " + o], !a) {
              for (i in u) {
                if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                  a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1]));
                  break;
                }
              }
            }
            if (a !== !0) {
              if (a && e["throws"]) {
                t = a(t);
              } else {
                try {
                  t = a(t);
                } catch (p) {
                  return {
                    state: "parsererror",
                    error: a ? p : "No conversion from " + l + " to " + o
                  };
                }
              }
            }
          }
        }
      }
    }
    return {
      state: "success",
      data: t
    };
  }
  x.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function(e) {
        return x.globalEval(e), e;
      }
    }
  }), x.ajaxPrefilter("script", function(e) {
    e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1);
  }), x.ajaxTransport("script", function(e) {
    if (e.crossDomain) {
      var n, r = a.head || x("head")[0] || a.documentElement;
      return {
        send: function(t, i) {
          n = a.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, t) {
            (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success"));
          }, r.insertBefore(n, r.firstChild);
        },
        abort: function() {
          n && n.onload(t, !0);
        }
      };
    }
  });
  var Fn = [],
      Bn = /(=)\?(?=&|$)|\?\?/;
  x.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var e = Fn.pop() || x.expando + "_" + vn++;
      return this[e] = !0, e;
    }
  }), x.ajaxPrefilter("json jsonp", function(n, r, i) {
    var o, a, s, l = n.jsonp !== !1 && (Bn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(n.data) && "data");
    return l || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = x.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Bn, "$1" + o) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function() {
      return s || x.error(o + " was not called"), s[0];
    }, n.dataTypes[0] = "json", a = e[o], e[o] = function() {
      s = arguments;
    }, i.always(function() {
      e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && x.isFunction(a) && a(s[0]), s = a = t;
    }), "script") : t;
  });
  var Pn, Rn, Wn = 0,
      $n = e.ActiveXObject &&
      function() {
      var e;
      for (e in Pn) {
        Pn[e](t, !0);
      }
      };

  function In() {
    try {
      return new e.XMLHttpRequest;
    } catch (t) {}
  }
  function zn() {
    try {
      return new e.ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {}
  }
  x.ajaxSettings.xhr = e.ActiveXObject ?
  function() {
    return !this.isLocal && In() || zn();
  } : In, Rn = x.ajaxSettings.xhr(), x.support.cors = !! Rn && "withCredentials" in Rn, Rn = x.support.ajax = !! Rn, Rn && x.ajaxTransport(function(n) {
    if (!n.crossDomain || x.support.cors) {
      var r;
      return {
        send: function(i, o) {
          var a, s, l = n.xhr();
          if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields) {
            for (s in n.xhrFields) {
              l[s] = n.xhrFields[s];
            }
          }
          n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
          try {
            for (s in i) {
              l.setRequestHeader(s, i[s]);
            }
          } catch (u) {}
          l.send(n.hasContent && n.data || null), r = function(e, i) {
            var s, u, c, p;
            try {
              if (r && (i || 4 === l.readyState)) {
                if (r = t, a && (l.onreadystatechange = x.noop, $n && delete Pn[a]), i) {
                  4 !== l.readyState && l.abort();
                } else {
                  p = {}, s = l.status, u = l.getAllResponseHeaders(), "string" == typeof l.responseText && (p.text = l.responseText);
                  try {
                    c = l.statusText;
                  } catch (f) {
                    c = "";
                  }
                  s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404;
                }
              }
            } catch (d) {
              i || o(-1, d);
            }
            p && o(s, c, p, u);
          }, n.async ? 4 === l.readyState ? setTimeout(r) : (a = ++Wn, $n && (Pn || (Pn = {}, x(e).unload($n)), Pn[a] = r), l.onreadystatechange = r) : r();
        },
        abort: function() {
          r && r(t, !0);
        }
      };
    }
  });
  var Xn, Un, Vn = /^(?:toggle|show|hide)$/,
      Yn = RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"),
      Jn = /queueHooks$/,
      Gn = [nr],
      Qn = {
      "*": [function(e, t) {
        var n = this.createTween(e, t),
            r = n.cur(),
            i = Yn.exec(t),
            o = i && i[3] || (x.cssNumber[e] ? "" : "px"),
            a = (x.cssNumber[e] || "px" !== o && +r) && Yn.exec(x.css(n.elem, e)),
            s = 1,
            l = 20;
        if (a && a[3] !== o) {
          o = o || a[3], i = i || [], a = +r || 1;
          do {
            s = s || ".5", a /= s, x.style(n.elem, e, a + o);
          } while (s !== (s = n.cur() / r) && 1 !== s && --l);
        }
        return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n;
      }]
      };

  function Kn() {
    return setTimeout(function() {
      Xn = t;
    }), Xn = x.now();
  }
  function Zn(e, t, n) {
    var r, i = (Qn[t] || []).concat(Qn["*"]),
        o = 0,
        a = i.length;
    for (; a > o; o++) {
      if (r = i[o].call(n, t, e)) {
        return r;
      }
    }
  }
  function er(e, t, n) {
    var r, i, o = 0,
        a = Gn.length,
        s = x.Deferred().always(function() {
        delete l.elem;
      }),
        l = function() {
        if (i) {
          return !1;
        }
        var t = Xn || Kn(),
            n = Math.max(0, u.startTime + u.duration - t),
            r = n / u.duration || 0,
            o = 1 - r,
            a = 0,
            l = u.tweens.length;
        for (; l > a; a++) {
          u.tweens[a].run(o);
        }
        return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1);
        },
        u = s.promise({
        elem: e,
        props: x.extend({}, t),
        opts: x.extend(!0, {
          specialEasing: {}
        }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: Xn || Kn(),
        duration: n.duration,
        tweens: [],
        createTween: function(t, n) {
          var r = x.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
          return u.tweens.push(r), r;
        },
        stop: function(t) {
          var n = 0,
              r = t ? u.tweens.length : 0;
          if (i) {
            return this;
          }
          for (i = !0; r > n; n++) {
            u.tweens[n].run(1);
          }
          return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this;
        }
      }),
        c = u.props;
    for (tr(c, u.opts.specialEasing); a > o; o++) {
      if (r = Gn[o].call(u, e, c, u.opts)) {
        return r;
      }
    }
    return x.map(c, Zn, u), x.isFunction(u.opts.start) && u.opts.start.call(e, u), x.fx.timer(x.extend(l, {
      elem: e,
      anim: u,
      queue: u.opts.queue
    })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always);
  }
  function tr(e, t) {
    var n, r, i, o, a;
    for (n in e) {
      if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = x.cssHooks[r], a && "expand" in a) {
        o = a.expand(o), delete e[r];
        for (n in o) {
          n in e || (e[n] = o[n], t[n] = i);
        }
      } else {
        t[r] = i;
      }
    }
  }
  x.Animation = x.extend(er, {
    tweener: function(e, t) {
      x.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
      var n, r = 0,
          i = e.length;
      for (; i > r; r++) {
        n = e[r], Qn[n] = Qn[n] || [], Qn[n].unshift(t);
      }
    },
    prefilter: function(e, t) {
      t ? Gn.unshift(e) : Gn.push(e);
    }
  });

  function nr(e, t, n) {
    var r, i, o, a, s, l, u = this,
        c = {},
        p = e.style,
        f = e.nodeType && nn(e),
        d = x._data(e, "fxshow");
    n.queue || (s = x._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
      s.unqueued || l();
    }), s.unqueued++, u.always(function() {
      u.always(function() {
        s.unqueued--, x.queue(e, "fx").length || s.empty.fire();
      });
    })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === x.css(e, "display") && "none" === x.css(e, "float") && (x.support.inlineBlockNeedsLayout && "inline" !== ln(e.nodeName) ? p.zoom = 1 : p.display = "inline-block")), n.overflow && (p.overflow = "hidden", x.support.shrinkWrapBlocks || u.always(function() {
      p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2];
    }));
    for (r in t) {
      if (i = t[r], Vn.exec(i)) {
        if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) {
          continue;
        }
        c[r] = d && d[r] || x.style(e, r);
      }
    }
    if (!x.isEmptyObject(c)) {
      d ? "hidden" in d && (f = d.hidden) : d = x._data(e, "fxshow", {}), o && (d.hidden = !f), f ? x(e).show() : u.done(function() {
        x(e).hide();
      }), u.done(function() {
        var t;
        x._removeData(e, "fxshow");
        for (t in c) {
          x.style(e, t, c[t]);
        }
      });
      for (r in c) {
        a = Zn(f ? d[r] : 0, r, u), r in d || (d[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0));
      }
    }
  }
  function rr(e, t, n, r, i) {
    return new rr.prototype.init(e, t, n, r, i);
  }
  x.Tween = rr, rr.prototype = {
    constructor: rr,
    init: function(e, t, n, r, i, o) {
      this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (x.cssNumber[n] ? "" : "px");
    },
    cur: function() {
      var e = rr.propHooks[this.prop];
      return e && e.get ? e.get(this) : rr.propHooks._default.get(this);
    },
    run: function(e) {
      var t, n = rr.propHooks[this.prop];
      return this.pos = t = this.options.duration ? x.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this;
    }
  }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = {
    _default: {
      get: function(e) {
        var t;
        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = x.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop];
      },
      set: function(e) {
        x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[e.prop]) ? x.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now;
      }
    }
  }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
    set: function(e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }
  }, x.each(["toggle", "show", "hide"], function(e, t) {
    var n = x.fn[t];
    x.fn[t] = function(e, r, i) {
      return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i);
    };
  }), x.fn.extend({
    fadeTo: function(e, t, n, r) {
      return this.filter(nn).css("opacity", 0).show().end().animate({
        opacity: t
      }, e, n, r);
    },
    animate: function(e, t, n, r) {
      var i = x.isEmptyObject(e),
          o = x.speed(t, n, r),
          a = function() {
          var t = er(this, x.extend({}, e), o);
          (i || x._data(this, "finish")) && t.stop(!0);
          };
      return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a);
    },
    stop: function(e, n, r) {
      var i = function(e) {
        var t = e.stop;
        delete e.stop, t(r);
      };
      return "string" != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
        var t = !0,
            n = null != e && e + "queueHooks",
            o = x.timers,
            a = x._data(this);
        if (n) {
          a[n] && a[n].stop && i(a[n]);
        } else {
          for (n in a) {
            a[n] && a[n].stop && Jn.test(n) && i(a[n]);
          }
        }
        for (n = o.length; n--;) {
          o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(r), t = !1, o.splice(n, 1));
        }(t || !r) && x.dequeue(this, e);
      });
    },
    finish: function(e) {
      return e !== !1 && (e = e || "fx"), this.each(function() {
        var t, n = x._data(this),
            r = n[e + "queue"],
            i = n[e + "queueHooks"],
            o = x.timers,
            a = r ? r.length : 0;
        for (n.finish = !0, x.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) {
          o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
        }
        for (t = 0; a > t; t++) {
          r[t] && r[t].finish && r[t].finish.call(this);
        }
        delete n.finish;
      });
    }
  });

  function ir(e, t) {
    var n, r = {
      height: e
    },
        i = 0;
    for (t = t ? 1 : 0; 4 > i; i += 2 - t) {
      n = Zt[i], r["margin" + n] = r["padding" + n] = e;
    }
    return t && (r.opacity = r.width = e), r;
  }
  x.each({
    slideDown: ir("show"),
    slideUp: ir("hide"),
    slideToggle: ir("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function(e, t) {
    x.fn[e] = function(e, n, r) {
      return this.animate(t, e, n, r);
    };
  }), x.speed = function(e, t, n) {
    var r = e && "object" == typeof e ? x.extend({}, e) : {
      complete: n || !n && t || x.isFunction(e) && e,
      duration: e,
      easing: n && t || t && !x.isFunction(t) && t
    };
    return r.duration = x.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] : x.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
      x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue);
    }, r;
  }, x.easing = {
    linear: function(e) {
      return e;
    },
    swing: function(e) {
      return 0.5 - Math.cos(e * Math.PI) / 2;
    }
  }, x.timers = [], x.fx = rr.prototype.init, x.fx.tick = function() {
    var e, n = x.timers,
        r = 0;
    for (Xn = x.now(); n.length > r; r++) {
      e = n[r], e() || n[r] !== e || n.splice(r--, 1);
    }
    n.length || x.fx.stop(), Xn = t;
  }, x.fx.timer = function(e) {
    e() && x.timers.push(e) && x.fx.start();
  }, x.fx.interval = 13, x.fx.start = function() {
    Un || (Un = setInterval(x.fx.tick, x.fx.interval));
  }, x.fx.stop = function() {
    clearInterval(Un), Un = null;
  }, x.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated = function(e) {
    return x.grep(x.timers, function(t) {
      return e === t.elem;
    }).length;
  }), x.fn.offset = function(e) {
    if (arguments.length) {
      return e === t ? this : this.each(function(t) {
        x.offset.setOffset(this, e, t);
      });
    }
    var n, r, o = {
      top: 0,
      left: 0
    },
        a = this[0],
        s = a && a.ownerDocument;
    if (s) {
      return n = s.documentElement, x.contains(n, a) ? (typeof a.getBoundingClientRect !== i && (o = a.getBoundingClientRect()), r = or(s), {
        top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
        left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
      }) : o;
    }
  }, x.offset = {
    setOffset: function(e, t, n) {
      var r = x.css(e, "position");
      "static" === r && (e.style.position = "relative");
      var i = x(e),
          o = i.offset(),
          a = x.css(e, "top"),
          s = x.css(e, "left"),
          l = ("absolute" === r || "fixed" === r) && x.inArray("auto", [a, s]) > -1,
          u = {},
          c = {},
          p, f;
      l ? (c = i.position(), p = c.top, f = c.left) : (p = parseFloat(a) || 0, f = parseFloat(s) || 0), x.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (u.top = t.top - o.top + p), null != t.left && (u.left = t.left - o.left + f), "using" in t ? t.using.call(e, u) : i.css(u);
    }
  }, x.fn.extend({
    position: function() {
      if (this[0]) {
        var e, t, n = {
          top: 0,
          left: 0
        },
            r = this[0];
        return "fixed" === x.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), x.nodeName(e[0], "html") || (n = e.offset()), n.top += x.css(e[0], "borderTopWidth", !0), n.left += x.css(e[0], "borderLeftWidth", !0)), {
          top: t.top - n.top - x.css(r, "marginTop", !0),
          left: t.left - n.left - x.css(r, "marginLeft", !0)
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        var e = this.offsetParent || s;
        while (e && !x.nodeName(e, "html") && "static" === x.css(e, "position")) {
          e = e.offsetParent;
        }
        return e || s;
      });
    }
  }), x.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(e, n) {
    var r = /Y/.test(n);
    x.fn[e] = function(i) {
      return x.access(this, function(e, i, o) {
        var a = or(e);
        return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : (a ? a.scrollTo(r ? x(a).scrollLeft() : o, r ? o : x(a).scrollTop()) : e[i] = o, t);
      }, e, i, arguments.length, null);
    };
  });

  function or(e) {
    return x.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1;
  }
  x.each({
    Height: "height",
    Width: "width"
  }, function(e, n) {
    x.each({
      padding: "inner" + e,
      content: n,
      "": "outer" + e
    }, function(r, i) {
      x.fn[i] = function(i, o) {
        var a = arguments.length && (r || "boolean" != typeof i),
            s = r || (i === !0 || o === !0 ? "margin" : "border");
        return x.access(this, function(n, r, i) {
          var o;
          return x.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? x.css(n, r, s) : x.style(n, r, i, s);
        }, n, a ? i : t, a, null);
      };
    });
  }), x.fn.size = function() {
    return this.length;
  }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = x : (e.jQuery = e.$ = x, "function" == typeof define && define.amd && define("jquery", [], function() {
    return x;
  }));
})(window);
/* jQuery UI - v1.10.4 - 2015-03-10
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.datepicker.js, jquery.ui.slider.js, jquery.ui.effect.js, jquery.ui.effect-fade.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */
(function($, undefined) {
  var uuid = 0,
      runiqueId = /^ui-id-\d+$/;
  $.ui = $.ui || {};
  $.extend($.ui, {
    version: "1.10.4",
    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  });
  $.fn.extend({
    focus: (function(orig) {
      return function(delay, fn) {
        return typeof delay === "number" ? this.each(function() {
          var elem = this;
          setTimeout(function() {
            $(elem).focus();
            if (fn) {
              fn.call(elem);
            }
          }, delay);
        }) : orig.apply(this, arguments);
      };
    })($.fn.focus),
    scrollParent: function() {
      var scrollParent;
      if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
        scrollParent = this.parents().filter(function() {
          return (/(relative|absolute|fixed)/).test($.css(this, "position")) && (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      } else {
        scrollParent = this.parents().filter(function() {
          return (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      }
      return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
    },
    zIndex: function(zIndex) {
      if (zIndex !== undefined) {
        return this.css("zIndex", zIndex);
      }
      if (this.length) {
        var elem = $(this[0]),
            position, value;
        while (elem.length && elem[0] !== document) {
          position = elem.css("position");
          if (position === "absolute" || position === "relative" || position === "fixed") {
            value = parseInt(elem.css("zIndex"), 10);
            if (!isNaN(value) && value !== 0) {
              return value;
            }
          }
          elem = elem.parent();
        }
      }
      return 0;
    },
    uniqueId: function() {
      return this.each(function() {
        if (!this.id) {
          this.id = "ui-id-" + (++uuid);
        }
      });
    },
    removeUniqueId: function() {
      return this.each(function() {
        if (runiqueId.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    }
  });

  function focusable(element, isTabIndexNotNaN) {
    var map, mapName, img, nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }
      img = $("img[usemap=#" + mapName + "]")[0];
      return !!img && visible(img);
    }
    return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
  }
  function visible(element) {
    return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
      return $.css(this, "visibility") === "hidden";
    }).length;
  }
  $.extend($.expr[":"], {
    data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
      return function(elem) {
        return !!$.data(elem, dataName);
      };
    }) : function(elem, i, match) {
      return !!$.data(elem, match[3]);
    },
    focusable: function(element) {
      return focusable(element, !isNaN($.attr(element, "tabindex")));
    },
    tabbable: function(element) {
      var tabIndex = $.attr(element, "tabindex"),
          isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }
  });
  if (!$("<a>").outerWidth(1).jquery) {
    $.each(["Width", "Height"], function(i, name) {
      var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
          type = name.toLowerCase(),
          orig = {
          innerWidth: $.fn.innerWidth,
          innerHeight: $.fn.innerHeight,
          outerWidth: $.fn.outerWidth,
          outerHeight: $.fn.outerHeight
          };

      function reduce(elem, size, border, margin) {
        $.each(side, function() {
          size -= parseFloat($.css(elem, "padding" + this)) || 0;
          if (border) {
            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
          }
          if (margin) {
            size -= parseFloat($.css(elem, "margin" + this)) || 0;
          }
        });
        return size;
      }
      $.fn["inner" + name] = function(size) {
        if (size === undefined) {
          return orig["inner" + name].call(this);
        }
        return this.each(function() {
          $(this).css(type, reduce(this, size) + "px");
        });
      };
      $.fn["outer" + name] = function(size, margin) {
        if (typeof size !== "number") {
          return orig["outer" + name].call(this, size);
        }
        return this.each(function() {
          $(this).css(type, reduce(this, size, true, margin) + "px");
        });
      };
    });
  }
  if (!$.fn.addBack) {
    $.fn.addBack = function(selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    };
  }
  if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
    $.fn.removeData = (function(removeData) {
      return function(key) {
        if (arguments.length) {
          return removeData.call(this, $.camelCase(key));
        } else {
          return removeData.call(this);
        }
      };
    })($.fn.removeData);
  }
  $.ui.ie = !! /msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  $.support.selectstart = "onselectstart" in document.createElement("div");
  $.fn.extend({
    disableSelection: function() {
      return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
        event.preventDefault();
      });
    },
    enableSelection: function() {
      return this.unbind(".ui-disableSelection");
    }
  });
  $.extend($.ui, {
    plugin: {
      add: function(module, option, set) {
        var i, proto = $.ui[module].prototype;
        for (i in set) {
          proto.plugins[i] = proto.plugins[i] || [];
          proto.plugins[i].push([option, set[i]]);
        }
      },
      call: function(instance, name, args) {
        var i, set = instance.plugins[name];
        if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
          return;
        }
        for (i = 0; i < set.length; i++) {
          if (instance.options[set[i][0]]) {
            set[i][1].apply(instance.element, args);
          }
        }
      }
    },
    hasScroll: function(el, a) {
      if ($(el).css("overflow") === "hidden") {
        return false;
      }
      var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
          has = false;
      if (el[scroll] > 0) {
        return true;
      }
      el[scroll] = 1;
      has = (el[scroll] > 0);
      el[scroll] = 0;
      return has;
    }
  });
})(jQuery);
(function($, undefined) {
  var uuid = 0,
      slice = Array.prototype.slice,
      _cleanData = $.cleanData;
  $.cleanData = function(elems) {
    for (var i = 0, elem;
    (elem = elems[i]) != null; i++) {
      try {
        $(elem).triggerHandler("remove");
      } catch (e) {}
    }
    _cleanData(elems);
  };
  $.widget = function(name, base, prototype) {
    var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {},
        namespace = name.split(".")[0];
    name = name.split(".")[1];
    fullName = namespace + "-" + name;
    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }
    $.expr[":"][fullName.toLowerCase()] = function(elem) {
      return !!$.data(elem, fullName);
    };
    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];
    constructor = $[namespace][name] = function(options, element) {
      if (!this._createWidget) {
        return new constructor(options, element);
      }
      if (arguments.length) {
        this._createWidget(options, element);
      }
    };
    $.extend(constructor, existingConstructor, {
      version: prototype.version,
      _proto: $.extend({}, prototype),
      _childConstructors: []
    });
    basePrototype = new base();
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function(prop, value) {
      if (!$.isFunction(value)) {
        proxiedPrototype[prop] = value;
        return;
      }
      proxiedPrototype[prop] = (function() {
        var _super = function() {
          return base.prototype[prop].apply(this, arguments);
        },
            _superApply = function(args) {
            return base.prototype[prop].apply(this, args);
            };
        return function() {
          var __super = this._super,
              __superApply = this._superApply,
              returnValue;
          this._super = _super;
          this._superApply = _superApply;
          returnValue = value.apply(this, arguments);
          this._super = __super;
          this._superApply = __superApply;
          return returnValue;
        };
      })();
    });
    constructor.prototype = $.widget.extend(basePrototype, {
      widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
    }, proxiedPrototype, {
      constructor: constructor,
      namespace: namespace,
      widgetName: name,
      widgetFullName: fullName
    });
    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function(i, child) {
        var childPrototype = child.prototype;
        $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
      });
      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(constructor);
    }
    $.widget.bridge(name, constructor);
  };
  $.widget.extend = function(target) {
    var input = slice.call(arguments, 1),
        inputIndex = 0,
        inputLength = input.length,
        key, value;
    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];
        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          if ($.isPlainObject(value)) {
            target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value);
          } else {
            target[key] = value;
          }
        }
      }
    }
    return target;
  };
  $.widget.bridge = function(name, object) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[name] = function(options) {
      var isMethodCall = typeof options === "string",
          args = slice.call(arguments, 1),
          returnValue = this;
      options = !isMethodCall && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options;
      if (isMethodCall) {
        this.each(function() {
          var methodValue, instance = $.data(this, fullName);
          if (!instance) {
            return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return $.error("no such method '" + options + "' for " + name + " widget instance");
          }
          methodValue = instance[options].apply(instance, args);
          if (methodValue !== instance && methodValue !== undefined) {
            returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
            return false;
          }
        });
      } else {
        this.each(function() {
          var instance = $.data(this, fullName);
          if (instance) {
            instance.option(options || {})._init();
          } else {
            $.data(this, fullName, new object(options, this));
          }
        });
      }
      return returnValue;
    };
  };
  $.Widget = function() {};
  $.Widget._childConstructors = [];
  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      disabled: false,
      create: null
    },
    _createWidget: function(options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.uuid = uuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();
      if (element !== this) {
        $.data(element, this.widgetFullName, this);
        this._on(true, this.element, {
          remove: function(event) {
            if (event.target === element) {
              this.destroy();
            }
          }
        });
        this.document = $(element.style ? element.ownerDocument : element.document || element);
        this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
      }
      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,
    destroy: function() {
      this._destroy();
      this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
      this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: $.noop,
    widget: function() {
      return this.element;
    },
    option: function(key, value) {
      var options = key,
          parts, curOption, i;
      if (arguments.length === 0) {
        return $.widget.extend({}, this.options);
      }
      if (typeof key === "string") {
        options = {};
        parts = key.split(".");
        key = parts.shift();
        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);
          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }
          key = parts.pop();
          if (arguments.length === 1) {
            return curOption[key] === undefined ? null : curOption[key];
          }
          curOption[key] = value;
        } else {
          if (arguments.length === 1) {
            return this.options[key] === undefined ? null : this.options[key];
          }
          options[key] = value;
        }
      }
      this._setOptions(options);
      return this;
    },
    _setOptions: function(options) {
      var key;
      for (key in options) {
        this._setOption(key, options[key]);
      }
      return this;
    },
    _setOption: function(key, value) {
      this.options[key] = value;
      if (key === "disabled") {
        this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !! value).attr("aria-disabled", value);
        this.hoverable.removeClass("ui-state-hover");
        this.focusable.removeClass("ui-state-focus");
      }
      return this;
    },
    enable: function() {
      return this._setOption("disabled", false);
    },
    disable: function() {
      return this._setOption("disabled", true);
    },
    _on: function(suppressDisabledCheck, element, handlers) {
      var delegateElement, instance = this;
      if (typeof suppressDisabledCheck !== "boolean") {
        handlers = element;
        element = suppressDisabledCheck;
        suppressDisabledCheck = false;
      }
      if (!handlers) {
        handlers = element;
        element = this.element;
        delegateElement = this.widget();
      } else {
        element = delegateElement = $(element);
        this.bindings = this.bindings.add(element);
      }
      $.each(handlers, function(event, handler) {
        function handlerProxy() {
          if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
            return;
          }
          return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
        }
        if (typeof handler !== "string") {
          handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
        }
        var match = event.match(/^(\w+)\s*(.*)$/),
            eventName = match[1] + instance.eventNamespace,
            selector = match[2];
        if (selector) {
          delegateElement.delegate(selector, eventName, handlerProxy);
        } else {
          element.bind(eventName, handlerProxy);
        }
      });
    },
    _off: function(element, eventName) {
      eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
      element.unbind(eventName).undelegate(eventName);
    },
    _delay: function(handler, delay) {
      function handlerProxy() {
        return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
      }
      var instance = this;
      return setTimeout(handlerProxy, delay || 0);
    },
    _hoverable: function(element) {
      this.hoverable = this.hoverable.add(element);
      this._on(element, {
        mouseenter: function(event) {
          $(event.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function(event) {
          $(event.currentTarget).removeClass("ui-state-hover");
        }
      });
    },
    _focusable: function(element) {
      this.focusable = this.focusable.add(element);
      this._on(element, {
        focusin: function(event) {
          $(event.currentTarget).addClass("ui-state-focus");
        },
        focusout: function(event) {
          $(event.currentTarget).removeClass("ui-state-focus");
        }
      });
    },
    _trigger: function(type, event, data) {
      var prop, orig, callback = this.options[type];
      data = data || {};
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
      event.target = this.element[0];
      orig = event.originalEvent;
      if (orig) {
        for (prop in orig) {
          if (!(prop in event)) {
            event[prop] = orig[prop];
          }
        }
      }
      this.element.trigger(event, data);
      return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
    }
  };
  $.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function(method, defaultEffect) {
    $.Widget.prototype["_" + method] = function(element, options, callback) {
      if (typeof options === "string") {
        options = {
          effect: options
        };
      }
      var hasOptions, effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
      options = options || {};
      if (typeof options === "number") {
        options = {
          duration: options
        };
      }
      hasOptions = !$.isEmptyObject(options);
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else {
        if (effectName !== method && element[effectName]) {
          element[effectName](options.duration, options.easing, callback);
        } else {
          element.queue(function(next) {
            $(this)[method]();
            if (callback) {
              callback.call(element[0]);
            }
            next();
          });
        }
      }
    };
  });
})(jQuery);
(function($, undefined) {
  var mouseHandled = false;
  $(document).mouseup(function() {
    mouseHandled = false;
  });
  $.widget("ui.mouse", {
    version: "1.10.4",
    options: {
      cancel: "input,textarea,button,select,option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function() {
      var that = this;
      this.element.bind("mousedown." + this.widgetName, function(event) {
        return that._mouseDown(event);
      }).bind("click." + this.widgetName, function(event) {
        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
          $.removeData(event.target, that.widgetName + ".preventClickEvent");
          event.stopImmediatePropagation();
          return false;
        }
      });
      this.started = false;
    },
    _mouseDestroy: function() {
      this.element.unbind("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },
    _mouseDown: function(event) {
      if (mouseHandled) {
        return;
      }(this._mouseStarted && this._mouseUp(event));
      this._mouseDownEvent = event;
      var that = this,
          btnIsLeft = (event.which === 1),
          elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }
      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function() {
          that.mouseDelayMet = true;
        }, this.options.delay);
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = (this._mouseStart(event) !== false);
        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      }
      if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
        $.removeData(event.target, this.widgetName + ".preventClickEvent");
      }
      this._mouseMoveDelegate = function(event) {
        return that._mouseMove(event);
      };
      this._mouseUpDelegate = function(event) {
        return that._mouseUp(event);
      };
      $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
      event.preventDefault();
      mouseHandled = true;
      return true;
    },
    _mouseMove: function(event) {
      if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
        return this._mouseUp(event);
      }
      if (this._mouseStarted) {
        this._mouseDrag(event);
        return event.preventDefault();
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false);
        (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
      }
      return !this._mouseStarted;
    },
    _mouseUp: function(event) {
      $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      if (this._mouseStarted) {
        this._mouseStarted = false;
        if (event.target === this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + ".preventClickEvent", true);
        }
        this._mouseStop(event);
      }
      return false;
    },
    _mouseDistanceMet: function(event) {
      return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
    },
    _mouseDelayMet: function() {
      return this.mouseDelayMet;
    },
    _mouseStart: function() {},
    _mouseDrag: function() {},
    _mouseStop: function() {},
    _mouseCapture: function() {
      return true;
    }
  });
})(jQuery);
(function($, undefined) {
  $.extend($.ui, {
    datepicker: {
      version: "1.10.4"
    }
  });
  var PROP_NAME = "datepicker",
      instActive;

  function Datepicker() {
    this._curInst = null;
    this._keyEvent = false;
    this._disabledInputs = [];
    this._datepickerShowing = false;
    this._inDialog = false;
    this._mainDivId = "ui-datepicker-div";
    this._inlineClass = "ui-datepicker-inline";
    this._appendClass = "ui-datepicker-append";
    this._triggerClass = "ui-datepicker-trigger";
    this._dialogClass = "ui-datepicker-dialog";
    this._disableClass = "ui-datepicker-disabled";
    this._unselectableClass = "ui-datepicker-unselectable";
    this._currentClass = "ui-datepicker-current-day";
    this._dayOverClass = "ui-datepicker-days-cell-over";
    this.regional = [];
    this.regional[""] = {
      closeText: "Done",
      prevText: "Prev",
      nextText: "Next",
      currentText: "Today",
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      weekHeader: "Wk",
      dateFormat: "mm/dd/yy",
      firstDay: 0,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ""
    };
    this._defaults = {
      showOn: "focus",
      showAnim: "fadeIn",
      showOptions: {},
      defaultDate: null,
      appendText: "",
      buttonText: "...",
      buttonImage: "",
      buttonImageOnly: false,
      hideIfNoPrevNext: false,
      navigationAsDateFormat: false,
      gotoCurrent: false,
      changeMonth: false,
      changeYear: false,
      yearRange: "c-10:c+10",
      showOtherMonths: false,
      selectOtherMonths: false,
      showWeek: false,
      calculateWeek: this.iso8601Week,
      shortYearCutoff: "+10",
      minDate: null,
      maxDate: null,
      duration: "fast",
      beforeShowDay: null,
      beforeShow: null,
      onSelect: null,
      onChangeMonthYear: null,
      onClose: null,
      numberOfMonths: 1,
      showCurrentAtPos: 0,
      stepMonths: 1,
      stepBigMonths: 12,
      altField: "",
      altFormat: "",
      constrainInput: true,
      showButtonPanel: false,
      autoSize: false,
      disabled: false
    };
    $.extend(this._defaults, this.regional[""]);
    this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
  }
  $.extend(Datepicker.prototype, {
    markerClassName: "hasDatepicker",
    maxRows: 4,
    _widgetDatepicker: function() {
      return this.dpDiv;
    },
    setDefaults: function(settings) {
      extendRemove(this._defaults, settings || {});
      return this;
    },
    _attachDatepicker: function(target, settings) {
      var nodeName, inline, inst;
      nodeName = target.nodeName.toLowerCase();
      inline = (nodeName === "div" || nodeName === "span");
      if (!target.id) {
        this.uuid += 1;
        target.id = "dp" + this.uuid;
      }
      inst = this._newInst($(target), inline);
      inst.settings = $.extend({}, settings || {});
      if (nodeName === "input") {
        this._connectDatepicker(target, inst);
      } else {
        if (inline) {
          this._inlineDatepicker(target, inst);
        }
      }
    },
    _newInst: function(target, inline) {
      var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
      return {
        id: id,
        input: target,
        selectedDay: 0,
        selectedMonth: 0,
        selectedYear: 0,
        drawMonth: 0,
        drawYear: 0,
        inline: inline,
        dpDiv: (!inline ? this.dpDiv : bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))
      };
    },
    _connectDatepicker: function(target, inst) {
      var input = $(target);
      inst.append = $([]);
      inst.trigger = $([]);
      if (input.hasClass(this.markerClassName)) {
        return;
      }
      this._attachments(input, inst);
      input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp);
      this._autoSize(inst);
      $.data(target, PROP_NAME, inst);
      if (inst.settings.disabled) {
        this._disableDatepicker(target);
      }
    },
    _attachments: function(input, inst) {
      var showOn, buttonText, buttonImage, appendText = this._get(inst, "appendText"),
          isRTL = this._get(inst, "isRTL");
      if (inst.append) {
        inst.append.remove();
      }
      if (appendText) {
        inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
        input[isRTL ? "before" : "after"](inst.append);
      }
      input.unbind("focus", this._showDatepicker);
      if (inst.trigger) {
        inst.trigger.remove();
      }
      showOn = this._get(inst, "showOn");
      if (showOn === "focus" || showOn === "both") {
        input.focus(this._showDatepicker);
      }
      if (showOn === "button" || showOn === "both") {
        buttonText = this._get(inst, "buttonText");
        buttonImage = this._get(inst, "buttonImage");
        inst.trigger = $(this._get(inst, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({
          src: buttonImage,
          alt: buttonText,
          title: buttonText
        }) : $("<button type='button'></button>").addClass(this._triggerClass).html(!buttonImage ? buttonText : $("<img/>").attr({
          src: buttonImage,
          alt: buttonText,
          title: buttonText
        })));
        input[isRTL ? "before" : "after"](inst.trigger);
        inst.trigger.click(function() {
          if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
            $.datepicker._hideDatepicker();
          } else {
            if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
              $.datepicker._hideDatepicker();
              $.datepicker._showDatepicker(input[0]);
            } else {
              $.datepicker._showDatepicker(input[0]);
            }
          }
          return false;
        });
      }
    },
    _autoSize: function(inst) {
      if (this._get(inst, "autoSize") && !inst.inline) {
        var findMax, max, maxI, i, date = new Date(2009, 12 - 1, 20),
            dateFormat = this._get(inst, "dateFormat");
        if (dateFormat.match(/[DM]/)) {
          findMax = function(names) {
            max = 0;
            maxI = 0;
            for (i = 0; i < names.length; i++) {
              if (names[i].length > max) {
                max = names[i].length;
                maxI = i;
              }
            }
            return maxI;
          };
          date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ? "monthNames" : "monthNamesShort"))));
          date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ? "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
        }
        inst.input.attr("size", this._formatDate(inst, date).length);
      }
    },
    _inlineDatepicker: function(target, inst) {
      var divSpan = $(target);
      if (divSpan.hasClass(this.markerClassName)) {
        return;
      }
      divSpan.addClass(this.markerClassName).append(inst.dpDiv);
      $.data(target, PROP_NAME, inst);
      this._setDate(inst, this._getDefaultDate(inst), true);
      this._updateDatepicker(inst);
      this._updateAlternate(inst);
      if (inst.settings.disabled) {
        this._disableDatepicker(target);
      }
      inst.dpDiv.css("display", "block");
    },
    _dialogDatepicker: function(input, date, onSelect, settings, pos) {
      var id, browserWidth, browserHeight, scrollX, scrollY, inst = this._dialogInst;
      if (!inst) {
        this.uuid += 1;
        id = "dp" + this.uuid;
        this._dialogInput = $("<input type='text' id='" + id + "' style='position: absolute; top: -100px; width: 0px;'/>");
        this._dialogInput.keydown(this._doKeyDown);
        $("body").append(this._dialogInput);
        inst = this._dialogInst = this._newInst(this._dialogInput, false);
        inst.settings = {};
        $.data(this._dialogInput[0], PROP_NAME, inst);
      }
      extendRemove(inst.settings, settings || {});
      date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
      this._dialogInput.val(date);
      this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
      if (!this._pos) {
        browserWidth = document.documentElement.clientWidth;
        browserHeight = document.documentElement.clientHeight;
        scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        this._pos = [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
      }
      this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
      inst.settings.onSelect = onSelect;
      this._inDialog = true;
      this.dpDiv.addClass(this._dialogClass);
      this._showDatepicker(this._dialogInput[0]);
      if ($.blockUI) {
        $.blockUI(this.dpDiv);
      }
      $.data(this._dialogInput[0], PROP_NAME, inst);
      return this;
    },
    _destroyDatepicker: function(target) {
      var nodeName, $target = $(target),
          inst = $.data(target, PROP_NAME);
      if (!$target.hasClass(this.markerClassName)) {
        return;
      }
      nodeName = target.nodeName.toLowerCase();
      $.removeData(target, PROP_NAME);
      if (nodeName === "input") {
        inst.append.remove();
        inst.trigger.remove();
        $target.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp);
      } else {
        if (nodeName === "div" || nodeName === "span") {
          $target.removeClass(this.markerClassName).empty();
        }
      }
    },
    _enableDatepicker: function(target) {
      var nodeName, inline, $target = $(target),
          inst = $.data(target, PROP_NAME);
      if (!$target.hasClass(this.markerClassName)) {
        return;
      }
      nodeName = target.nodeName.toLowerCase();
      if (nodeName === "input") {
        target.disabled = false;
        inst.trigger.filter("button").each(function() {
          this.disabled = false;
        }).end().filter("img").css({
          opacity: "1.0",
          cursor: ""
        });
      } else {
        if (nodeName === "div" || nodeName === "span") {
          inline = $target.children("." + this._inlineClass);
          inline.children().removeClass("ui-state-disabled");
          inline.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", false);
        }
      }
      this._disabledInputs = $.map(this._disabledInputs, function(value) {
        return (value === target ? null : value);
      });
    },
    _disableDatepicker: function(target) {
      var nodeName, inline, $target = $(target),
          inst = $.data(target, PROP_NAME);
      if (!$target.hasClass(this.markerClassName)) {
        return;
      }
      nodeName = target.nodeName.toLowerCase();
      if (nodeName === "input") {
        target.disabled = true;
        inst.trigger.filter("button").each(function() {
          this.disabled = true;
        }).end().filter("img").css({
          opacity: "0.5",
          cursor: "default"
        });
      } else {
        if (nodeName === "div" || nodeName === "span") {
          inline = $target.children("." + this._inlineClass);
          inline.children().addClass("ui-state-disabled");
          inline.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", true);
        }
      }
      this._disabledInputs = $.map(this._disabledInputs, function(value) {
        return (value === target ? null : value);
      });
      this._disabledInputs[this._disabledInputs.length] = target;
    },
    _isDisabledDatepicker: function(target) {
      if (!target) {
        return false;
      }
      for (var i = 0; i < this._disabledInputs.length; i++) {
        if (this._disabledInputs[i] === target) {
          return true;
        }
      }
      return false;
    },
    _getInst: function(target) {
      try {
        return $.data(target, PROP_NAME);
      } catch (err) {
        throw "Missing instance data for this datepicker";
      }
    },
    _optionDatepicker: function(target, name, value) {
      var settings, date, minDate, maxDate, inst = this._getInst(target);
      if (arguments.length === 2 && typeof name === "string") {
        return (name === "defaults" ? $.extend({}, $.datepicker._defaults) : (inst ? (name === "all" ? $.extend({}, inst.settings) : this._get(inst, name)) : null));
      }
      settings = name || {};
      if (typeof name === "string") {
        settings = {};
        settings[name] = value;
      }
      if (inst) {
        if (this._curInst === inst) {
          this._hideDatepicker();
        }
        date = this._getDateDatepicker(target, true);
        minDate = this._getMinMaxDate(inst, "min");
        maxDate = this._getMinMaxDate(inst, "max");
        extendRemove(inst.settings, settings);
        if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
          inst.settings.minDate = this._formatDate(inst, minDate);
        }
        if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
          inst.settings.maxDate = this._formatDate(inst, maxDate);
        }
        if ("disabled" in settings) {
          if (settings.disabled) {
            this._disableDatepicker(target);
          } else {
            this._enableDatepicker(target);
          }
        }
        this._attachments($(target), inst);
        this._autoSize(inst);
        this._setDate(inst, date);
        this._updateAlternate(inst);
        this._updateDatepicker(inst);
      }
    },
    _changeDatepicker: function(target, name, value) {
      this._optionDatepicker(target, name, value);
    },
    _refreshDatepicker: function(target) {
      var inst = this._getInst(target);
      if (inst) {
        this._updateDatepicker(inst);
      }
    },
    _setDateDatepicker: function(target, date) {
      var inst = this._getInst(target);
      if (inst) {
        this._setDate(inst, date);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
      }
    },
    _getDateDatepicker: function(target, noDefault) {
      var inst = this._getInst(target);
      if (inst && !inst.inline) {
        this._setDateFromField(inst, noDefault);
      }
      return (inst ? this._getDate(inst) : null);
    },
    _doKeyDown: function(event) {
      var onSelect, dateStr, sel, inst = $.datepicker._getInst(event.target),
          handled = true,
          isRTL = inst.dpDiv.is(".ui-datepicker-rtl");
      inst._keyEvent = true;
      if ($.datepicker._datepickerShowing) {
        switch (event.keyCode) {
        case 9:
          $.datepicker._hideDatepicker();
          handled = false;
          break;
        case 13:
          sel = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", inst.dpDiv);
          if (sel[0]) {
            $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
          }
          onSelect = $.datepicker._get(inst, "onSelect");
          if (onSelect) {
            dateStr = $.datepicker._formatDate(inst);
            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
          } else {
            $.datepicker._hideDatepicker();
          }
          return false;
        case 27:
          $.datepicker._hideDatepicker();
          break;
        case 33:
          $.datepicker._adjustDate(event.target, (event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths")), "M");
          break;
        case 34:
          $.datepicker._adjustDate(event.target, (event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths")), "M");
          break;
        case 35:
          if (event.ctrlKey || event.metaKey) {
            $.datepicker._clearDate(event.target);
          }
          handled = event.ctrlKey || event.metaKey;
          break;
        case 36:
          if (event.ctrlKey || event.metaKey) {
            $.datepicker._gotoToday(event.target);
          }
          handled = event.ctrlKey || event.metaKey;
          break;
        case 37:
          if (event.ctrlKey || event.metaKey) {
            $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
          }
          handled = event.ctrlKey || event.metaKey;
          if (event.originalEvent.altKey) {
            $.datepicker._adjustDate(event.target, (event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths")), "M");
          }
          break;
        case 38:
          if (event.ctrlKey || event.metaKey) {
            $.datepicker._adjustDate(event.target, -7, "D");
          }
          handled = event.ctrlKey || event.metaKey;
          break;
        case 39:
          if (event.ctrlKey || event.metaKey) {
            $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
          }
          handled = event.ctrlKey || event.metaKey;
          if (event.originalEvent.altKey) {
            $.datepicker._adjustDate(event.target, (event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths")), "M");
          }
          break;
        case 40:
          if (event.ctrlKey || event.metaKey) {
            $.datepicker._adjustDate(event.target, +7, "D");
          }
          handled = event.ctrlKey || event.metaKey;
          break;
        default:
          handled = false;
        }
      } else {
        if (event.keyCode === 36 && event.ctrlKey) {
          $.datepicker._showDatepicker(this);
        } else {
          handled = false;
        }
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    _doKeyPress: function(event) {
      var chars, chr, inst = $.datepicker._getInst(event.target);
      if ($.datepicker._get(inst, "constrainInput")) {
        chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
        chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
        return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
      }
    },
    _doKeyUp: function(event) {
      var date, inst = $.datepicker._getInst(event.target);
      if (inst.input.val() !== inst.lastVal) {
        try {
          date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), (inst.input ? inst.input.val() : null), $.datepicker._getFormatConfig(inst));
          if (date) {
            $.datepicker._setDateFromField(inst);
            $.datepicker._updateAlternate(inst);
            $.datepicker._updateDatepicker(inst);
          }
        } catch (err) {}
      }
      return true;
    },
    _showDatepicker: function(input) {
      input = input.target || input;
      if (input.nodeName.toLowerCase() !== "input") {
        input = $("input", input.parentNode)[0];
      }
      if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) {
        return;
      }
      var inst, beforeShow, beforeShowSettings, isFixed, offset, showAnim, duration;
      inst = $.datepicker._getInst(input);
      if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
        $.datepicker._curInst.dpDiv.stop(true, true);
        if (inst && $.datepicker._datepickerShowing) {
          $.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
        }
      }
      beforeShow = $.datepicker._get(inst, "beforeShow");
      beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
      if (beforeShowSettings === false) {
        return;
      }
      extendRemove(inst.settings, beforeShowSettings);
      inst.lastVal = null;
      $.datepicker._lastInput = input;
      $.datepicker._setDateFromField(inst);
      if ($.datepicker._inDialog) {
        input.value = "";
      }
      if (!$.datepicker._pos) {
        $.datepicker._pos = $.datepicker._findPos(input);
        $.datepicker._pos[1] += input.offsetHeight;
      }
      isFixed = false;
      $(input).parents().each(function() {
        isFixed |= $(this).css("position") === "fixed";
        return !isFixed;
      });
      offset = {
        left: $.datepicker._pos[0],
        top: $.datepicker._pos[1]
      };
      $.datepicker._pos = null;
      inst.dpDiv.empty();
      inst.dpDiv.css({
        position: "absolute",
        display: "block",
        top: "-1000px"
      });
      $.datepicker._updateDatepicker(inst);
      offset = $.datepicker._checkOffset(inst, offset, isFixed);
      inst.dpDiv.css({
        position: ($.datepicker._inDialog && $.blockUI ? "static" : (isFixed ? "fixed" : "absolute")),
        display: "none",
        left: offset.left + "px",
        top: offset.top + "px"
      });
      if (!inst.inline) {
        showAnim = $.datepicker._get(inst, "showAnim");
        duration = $.datepicker._get(inst, "duration");
        inst.dpDiv.zIndex($(input).zIndex() + 1);
        $.datepicker._datepickerShowing = true;
        if ($.effects && $.effects.effect[showAnim]) {
          inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
        } else {
          inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
        }
        if ($.datepicker._shouldFocusInput(inst)) {
          inst.input.focus();
        }
        $.datepicker._curInst = inst;
      }
    },
    _updateDatepicker: function(inst) {
      this.maxRows = 4;
      instActive = inst;
      inst.dpDiv.empty().append(this._generateHTML(inst));
      this._attachHandlers(inst);
      inst.dpDiv.find("." + this._dayOverClass + " a").mouseover();
      var origyearshtml, numMonths = this._getNumberOfMonths(inst),
          cols = numMonths[1],
          width = 17;
      inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
      if (cols > 1) {
        inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
      }
      inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi");
      inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
      if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput(inst)) {
        inst.input.focus();
      }
      if (inst.yearshtml) {
        origyearshtml = inst.yearshtml;
        setTimeout(function() {
          if (origyearshtml === inst.yearshtml && inst.yearshtml) {
            inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
          }
          origyearshtml = inst.yearshtml = null;
        }, 0);
      }
    },
    _shouldFocusInput: function(inst) {
      return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
    },
    _checkOffset: function(inst, offset, isFixed) {
      var dpWidth = inst.dpDiv.outerWidth(),
          dpHeight = inst.dpDiv.outerHeight(),
          inputWidth = inst.input ? inst.input.outerWidth() : 0,
          inputHeight = inst.input ? inst.input.outerHeight() : 0,
          viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
          viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());
      offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
      offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
      offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;
      offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ? Math.abs(offset.left + dpWidth - viewWidth) : 0);
      offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ? Math.abs(dpHeight + inputHeight) : 0);
      return offset;
    },
    _findPos: function(obj) {
      var position, inst = this._getInst(obj),
          isRTL = this._get(inst, "isRTL");
      while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
        obj = obj[isRTL ? "previousSibling" : "nextSibling"];
      }
      position = $(obj).offset();
      return [position.left, position.top];
    },
    _hideDatepicker: function(input) {
      var showAnim, duration, postProcess, onClose, inst = this._curInst;
      if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
        return;
      }
      if (this._datepickerShowing) {
        showAnim = this._get(inst, "showAnim");
        duration = this._get(inst, "duration");
        postProcess = function() {
          $.datepicker._tidyDialog(inst);
        };
        if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
          inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
        } else {
          inst.dpDiv[(showAnim === "slideDown" ? "slideUp" : (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
        }
        if (!showAnim) {
          postProcess();
        }
        this._datepickerShowing = false;
        onClose = this._get(inst, "onClose");
        if (onClose) {
          onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
        }
        this._lastInput = null;
        if (this._inDialog) {
          this._dialogInput.css({
            position: "absolute",
            left: "0",
            top: "-100px"
          });
          if ($.blockUI) {
            $.unblockUI();
            $("body").append(this.dpDiv);
          }
        }
        this._inDialog = false;
      }
    },
    _tidyDialog: function(inst) {
      inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },
    _checkExternalClick: function(event) {
      if (!$.datepicker._curInst) {
        return;
      }
      var $target = $(event.target),
          inst = $.datepicker._getInst($target[0]);
      if ((($target[0].id !== $.datepicker._mainDivId && $target.parents("#" + $.datepicker._mainDivId).length === 0 && !$target.hasClass($.datepicker.markerClassName) && !$target.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))) || ($target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst)) {
        $.datepicker._hideDatepicker();
      }
    },
    _adjustDate: function(id, offset, period) {
      var target = $(id),
          inst = this._getInst(target[0]);
      if (this._isDisabledDatepicker(target[0])) {
        return;
      }
      this._adjustInstDate(inst, offset + (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), period);
      this._updateDatepicker(inst);
    },
    _gotoToday: function(id) {
      var date, target = $(id),
          inst = this._getInst(target[0]);
      if (this._get(inst, "gotoCurrent") && inst.currentDay) {
        inst.selectedDay = inst.currentDay;
        inst.drawMonth = inst.selectedMonth = inst.currentMonth;
        inst.drawYear = inst.selectedYear = inst.currentYear;
      } else {
        date = new Date();
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
      }
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectMonthYear: function(id, select, period) {
      var target = $(id),
          inst = this._getInst(target[0]);
      inst["selected" + (period === "M" ? "Month" : "Year")] = inst["draw" + (period === "M" ? "Month" : "Year")] = parseInt(select.options[select.selectedIndex].value, 10);
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectDay: function(id, month, year, td) {
      var inst, target = $(id);
      if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
        return;
      }
      inst = this._getInst(target[0]);
      inst.selectedDay = inst.currentDay = $("a", td).html();
      inst.selectedMonth = inst.currentMonth = month;
      inst.selectedYear = inst.currentYear = year;
      this._selectDate(id, this._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear));
    },
    _clearDate: function(id) {
      var target = $(id);
      this._selectDate(target, "");
    },
    _selectDate: function(id, dateStr) {
      var onSelect, target = $(id),
          inst = this._getInst(target[0]);
      dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
      if (inst.input) {
        inst.input.val(dateStr);
      }
      this._updateAlternate(inst);
      onSelect = this._get(inst, "onSelect");
      if (onSelect) {
        onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
      } else {
        if (inst.input) {
          inst.input.trigger("change");
        }
      }
      if (inst.inline) {
        this._updateDatepicker(inst);
      } else {
        this._hideDatepicker();
        this._lastInput = inst.input[0];
        if (typeof(inst.input[0]) !== "object") {
          inst.input.focus();
        }
        this._lastInput = null;
      }
    },
    _updateAlternate: function(inst) {
      var altFormat, date, dateStr, altField = this._get(inst, "altField");
      if (altField) {
        altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
        date = this._getDate(inst);
        dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
        $(altField).each(function() {
          $(this).val(dateStr);
        });
      }
    },
    noWeekends: function(date) {
      var day = date.getDay();
      return [(day > 0 && day < 6), ""];
    },
    iso8601Week: function(date) {
      var time, checkDate = new Date(date.getTime());
      checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
      time = checkDate.getTime();
      checkDate.setMonth(0);
      checkDate.setDate(1);
      return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },
    parseDate: function(format, value, settings) {
      if (format == null || value == null) {
        throw "Invalid arguments";
      }
      value = (typeof value === "object" ? value.toString() : value + "");
      if (value === "") {
        return null;
      }
      var iFormat, dim, extra, iValue = 0,
          shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
          shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp : new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
          dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
          dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
          monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
          monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
          year = -1,
          month = -1,
          day = -1,
          doy = -1,
          literal = false,
          date, lookAhead = function(match) {
          var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
          if (matches) {
            iFormat++;
          }
          return matches;
          },
          getNumber = function(match) {
          var isDoubled = lookAhead(match),
              size = (match === "@" ? 14 : (match === "!" ? 20 : (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
              digits = new RegExp("^\\d{1," + size + "}"),
              num = value.substring(iValue).match(digits);
          if (!num) {
            throw "Missing number at position " + iValue;
          }
          iValue += num[0].length;
          return parseInt(num[0], 10);
          },
          getName = function(match, shortNames, longNames) {
          var index = -1,
              names = $.map(lookAhead(match) ? longNames : shortNames, function(v, k) {
              return [[k, v]];
            }).sort(function(a, b) {
              return -(a[1].length - b[1].length);
            });
          $.each(names, function(i, pair) {
            var name = pair[1];
            if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
              index = pair[0];
              iValue += name.length;
              return false;
            }
          });
          if (index !== -1) {
            return index + 1;
          } else {
            throw "Unknown name at position " + iValue;
          }
          },
          checkLiteral = function() {
          if (value.charAt(iValue) !== format.charAt(iFormat)) {
            throw "Unexpected literal at position " + iValue;
          }
          iValue++;
          };
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            checkLiteral();
          }
        } else {
          switch (format.charAt(iFormat)) {
          case "d":
            day = getNumber("d");
            break;
          case "D":
            getName("D", dayNamesShort, dayNames);
            break;
          case "o":
            doy = getNumber("o");
            break;
          case "m":
            month = getNumber("m");
            break;
          case "M":
            month = getName("M", monthNamesShort, monthNames);
            break;
          case "y":
            year = getNumber("y");
            break;
          case "@":
            date = new Date(getNumber("@"));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "!":
            date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'")) {
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
          }
        }
      }
      if (iValue < value.length) {
        extra = value.substr(iValue);
        if (!/^\s+/.test(extra)) {
          throw "Extra/unparsed characters found in date: " + extra;
        }
      }
      if (year === -1) {
        year = new Date().getFullYear();
      } else {
        if (year < 100) {
          year += new Date().getFullYear() - new Date().getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100);
        }
      }
      if (doy > -1) {
        month = 1;
        day = doy;
        do {
          dim = this._getDaysInMonth(year, month - 1);
          if (day <= dim) {
            break;
          }
          month++;
          day -= dim;
        } while (true);
      }
      date = this._daylightSavingAdjust(new Date(year, month - 1, day));
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        throw "Invalid date";
      }
      return date;
    },
    ATOM: "yy-mm-dd",
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y",
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd",
    _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),
    formatDate: function(format, date, settings) {
      if (!date) {
        return "";
      }
      var iFormat, dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
          dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
          monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
          monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
          lookAhead = function(match) {
          var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
          if (matches) {
            iFormat++;
          }
          return matches;
          },
          formatNumber = function(match, value, len) {
          var num = "" + value;
          if (lookAhead(match)) {
            while (num.length < len) {
              num = "0" + num;
            }
          }
          return num;
          },
          formatName = function(match, value, shortNames, longNames) {
          return (lookAhead(match) ? longNames[value] : shortNames[value]);
          },
          output = "",
          literal = false;
      if (date) {
        for (iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
              literal = false;
            } else {
              output += format.charAt(iFormat);
            }
          } else {
            switch (format.charAt(iFormat)) {
            case "d":
              output += formatNumber("d", date.getDate(), 2);
              break;
            case "D":
              output += formatName("D", date.getDay(), dayNamesShort, dayNames);
              break;
            case "o":
              output += formatNumber("o", Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
              break;
            case "m":
              output += formatNumber("m", date.getMonth() + 1, 2);
              break;
            case "M":
              output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
              break;
            case "y":
              output += (lookAhead("y") ? date.getFullYear() : (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
              break;
            case "@":
              output += date.getTime();
              break;
            case "!":
              output += date.getTime() * 10000 + this._ticksTo1970;
              break;
            case "'":
              if (lookAhead("'")) {
                output += "'";
              } else {
                literal = true;
              }
              break;
            default:
              output += format.charAt(iFormat);
            }
          }
        }
      }
      return output;
    },
    _possibleChars: function(format) {
      var iFormat, chars = "",
          literal = false,
          lookAhead = function(match) {
          var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
          if (matches) {
            iFormat++;
          }
          return matches;
          };
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            chars += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
          case "d":
          case "m":
          case "y":
          case "@":
            chars += "0123456789";
            break;
          case "D":
          case "M":
            return null;
          case "'":
            if (lookAhead("'")) {
              chars += "'";
            } else {
              literal = true;
            }
            break;
          default:
            chars += format.charAt(iFormat);
          }
        }
      }
      return chars;
    },
    _get: function(inst, name) {
      return inst.settings[name] !== undefined ? inst.settings[name] : this._defaults[name];
    },
    _setDateFromField: function(inst, noDefault) {
      if (inst.input.val() === inst.lastVal) {
        return;
      }
      var dateFormat = this._get(inst, "dateFormat"),
          dates = inst.lastVal = inst.input ? inst.input.val() : null,
          defaultDate = this._getDefaultDate(inst),
          date = defaultDate,
          settings = this._getFormatConfig(inst);
      try {
        date = this.parseDate(dateFormat, dates, settings) || defaultDate;
      } catch (event) {
        dates = (noDefault ? "" : dates);
      }
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      inst.currentDay = (dates ? date.getDate() : 0);
      inst.currentMonth = (dates ? date.getMonth() : 0);
      inst.currentYear = (dates ? date.getFullYear() : 0);
      this._adjustInstDate(inst);
    },
    _getDefaultDate: function(inst) {
      return this._restrictMinMax(inst, this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
    },
    _determineDate: function(inst, date, defaultDate) {
      var offsetNumeric = function(offset) {
        var date = new Date();
        date.setDate(date.getDate() + offset);
        return date;
      },
          offsetString = function(offset) {
          try {
            return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), offset, $.datepicker._getFormatConfig(inst));
          } catch (e) {}
          var date = (offset.toLowerCase().match(/^c/) ? $.datepicker._getDate(inst) : null) || new Date(),
              year = date.getFullYear(),
              month = date.getMonth(),
              day = date.getDate(),
              pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
              matches = pattern.exec(offset);
          while (matches) {
            switch (matches[2] || "d") {
            case "d":
            case "D":
              day += parseInt(matches[1], 10);
              break;
            case "w":
            case "W":
              day += parseInt(matches[1], 10) * 7;
              break;
            case "m":
            case "M":
              month += parseInt(matches[1], 10);
              day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
              break;
            case "y":
            case "Y":
              year += parseInt(matches[1], 10);
              day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
              break;
            }
            matches = pattern.exec(offset);
          }
          return new Date(year, month, day);
          },
          newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) : (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
      newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
      if (newDate) {
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
      }
      return this._daylightSavingAdjust(newDate);
    },
    _daylightSavingAdjust: function(date) {
      if (!date) {
        return null;
      }
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    },
    _setDate: function(inst, date, noChange) {
      var clear = !date,
          origMonth = inst.selectedMonth,
          origYear = inst.selectedYear,
          newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
      inst.selectedDay = inst.currentDay = newDate.getDate();
      inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
      inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
      if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
        this._notifyChange(inst);
      }
      this._adjustInstDate(inst);
      if (inst.input) {
        inst.input.val(clear ? "" : this._formatDate(inst));
      }
    },
    _getDate: function(inst) {
      var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
      return startDate;
    },
    _attachHandlers: function(inst) {
      var stepMonths = this._get(inst, "stepMonths"),
          id = "#" + inst.id.replace(/\\\\/g, "\\");
      inst.dpDiv.find("[data-handler]").map(function() {
        var handler = {
          prev: function() {
            $.datepicker._adjustDate(id, -stepMonths, "M");
          },
          next: function() {
            $.datepicker._adjustDate(id, +stepMonths, "M");
          },
          hide: function() {
            $.datepicker._hideDatepicker();
          },
          today: function() {
            $.datepicker._gotoToday(id);
          },
          selectDay: function() {
            $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
            return false;
          },
          selectMonth: function() {
            $.datepicker._selectMonthYear(id, this, "M");
            return false;
          },
          selectYear: function() {
            $.datepicker._selectMonthYear(id, this, "Y");
            return false;
          }
        };
        $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
      });
    },
    _generateHTML: function(inst) {
      var maxDraw, prevText, prev, nextText, next, currentText, gotoDate, controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin, monthNames, monthNamesShort, beforeShowDay, showOtherMonths, selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate, cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows, printDate, dRow, tbody, daySettings, otherMonth, unselectable, tempDate = new Date(),
          today = this._daylightSavingAdjust(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())),
          isRTL = this._get(inst, "isRTL"),
          showButtonPanel = this._get(inst, "showButtonPanel"),
          hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
          navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
          numMonths = this._getNumberOfMonths(inst),
          showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
          stepMonths = this._get(inst, "stepMonths"),
          isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
          currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) : new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
          minDate = this._getMinMaxDate(inst, "min"),
          maxDate = this._getMinMaxDate(inst, "max"),
          drawMonth = inst.drawMonth - showCurrentAtPos,
          drawYear = inst.drawYear;
      if (drawMonth < 0) {
        drawMonth += 12;
        drawYear--;
      }
      if (maxDate) {
        maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
        maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
        while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
          drawMonth--;
          if (drawMonth < 0) {
            drawMonth = 11;
            drawYear--;
          }
        }
      }
      inst.drawMonth = drawMonth;
      inst.drawYear = drawYear;
      prevText = this._get(inst, "prevText");
      prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText, this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)), this._getFormatConfig(inst)));
      prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" + " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" : (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));
      nextText = this._get(inst, "nextText");
      nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText, this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)), this._getFormatConfig(inst)));
      next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" + " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" : (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));
      currentText = this._get(inst, "currentText");
      gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
      currentText = (!navigationAsDateFormat ? currentText : this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
      controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(inst, "closeText") + "</button>" : "");
      buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") + (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" + ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";
      firstDay = parseInt(this._get(inst, "firstDay"), 10);
      firstDay = (isNaN(firstDay) ? 0 : firstDay);
      showWeek = this._get(inst, "showWeek");
      dayNames = this._get(inst, "dayNames");
      dayNamesMin = this._get(inst, "dayNamesMin");
      monthNames = this._get(inst, "monthNames");
      monthNamesShort = this._get(inst, "monthNamesShort");
      beforeShowDay = this._get(inst, "beforeShowDay");
      showOtherMonths = this._get(inst, "showOtherMonths");
      selectOtherMonths = this._get(inst, "selectOtherMonths");
      defaultDate = this._getDefaultDate(inst);
      html = "";
      dow;
      for (row = 0; row < numMonths[0]; row++) {
        group = "";
        this.maxRows = 4;
        for (col = 0; col < numMonths[1]; col++) {
          selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
          cornerClass = " ui-corner-all";
          calender = "";
          if (isMultiMonth) {
            calender += "<div class='ui-datepicker-group";
            if (numMonths[1] > 1) {
              switch (col) {
              case 0:
                calender += " ui-datepicker-group-first";
                cornerClass = " ui-corner-" + (isRTL ? "right" : "left");
                break;
              case numMonths[1] - 1:
                calender += " ui-datepicker-group-last";
                cornerClass = " ui-corner-" + (isRTL ? "left" : "right");
                break;
              default:
                calender += " ui-datepicker-group-middle";
                cornerClass = "";
                break;
              }
            }
            calender += "'>";
          }
          calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" + (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") + (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, row > 0 || col > 0, monthNames, monthNamesShort) + "</div><table class='ui-datepicker-calendar'><thead>" + "<tr>";
          thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
          for (dow = 0; dow < 7; dow++) {
            day = (dow + firstDay) % 7;
            thead += "<th" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" + "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
          }
          calender += thead + "</tr></thead><tbody>";
          daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
          if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
            inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
          }
          leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
          curRows = Math.ceil((leadDays + daysInMonth) / 7);
          numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows);
          this.maxRows = numRows;
          printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
          for (dRow = 0; dRow < numRows; dRow++) {
            calender += "<tr>";
            tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" + this._get(inst, "calculateWeek")(printDate) + "</td>");
            for (dow = 0; dow < 7; dow++) {
              daySettings = (beforeShowDay ? beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
              otherMonth = (printDate.getMonth() !== drawMonth);
              unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
              tbody += "<td class='" + ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (otherMonth ? " ui-datepicker-other-month" : "") + ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ? " " + this._dayOverClass : "") + (unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") + (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + (otherMonth && !showOtherMonths ? "&#xa0;" : (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" + (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") + (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + (otherMonth ? " ui-priority-secondary" : "") + "' href='#'>" + printDate.getDate() + "</a>")) + "</td>";
              printDate.setDate(printDate.getDate() + 1);
              printDate = this._daylightSavingAdjust(printDate);
            }
            calender += tbody + "</tr>";
          }
          drawMonth++;
          if (drawMonth > 11) {
            drawMonth = 0;
            drawYear++;
          }
          calender += "</tbody></table>" + (isMultiMonth ? "</div>" + ((numMonths[0] > 0 && col === numMonths[1] - 1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
          group += calender;
        }
        html += group;
      }
      html += buttonPanel;
      inst._keyEvent = false;
      return html;
    },
    _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort) {
      var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear, changeMonth = this._get(inst, "changeMonth"),
          changeYear = this._get(inst, "changeYear"),
          showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
          html = "<div class='ui-datepicker-title'>",
          monthHtml = "";
      if (secondary || !changeMonth) {
        monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
      } else {
        inMinYear = (minDate && minDate.getFullYear() === drawYear);
        inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
        monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
        for (month = 0; month < 12; month++) {
          if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
            monthHtml += "<option value='" + month + "'" + (month === drawMonth ? " selected='selected'" : "") + ">" + monthNamesShort[month] + "</option>";
          }
        }
        monthHtml += "</select>";
      }
      if (!showMonthAfterYear) {
        html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
      }
      if (!inst.yearshtml) {
        inst.yearshtml = "";
        if (secondary || !changeYear) {
          html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
        } else {
          years = this._get(inst, "yearRange").split(":");
          thisYear = new Date().getFullYear();
          determineYear = function(value) {
            var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) : (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) : parseInt(value, 10)));
            return (isNaN(year) ? thisYear : year);
          };
          year = determineYear(years[0]);
          endYear = Math.max(year, determineYear(years[1] || ""));
          year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
          endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
          inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
          for (; year <= endYear; year++) {
            inst.yearshtml += "<option value='" + year + "'" + (year === drawYear ? " selected='selected'" : "") + ">" + year + "</option>";
          }
          inst.yearshtml += "</select>";
          html += inst.yearshtml;
          inst.yearshtml = null;
        }
      }
      html += this._get(inst, "yearSuffix");
      if (showMonthAfterYear) {
        html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
      }
      html += "</div>";
      return html;
    },
    _adjustInstDate: function(inst, offset, period) {
      var year = inst.drawYear + (period === "Y" ? offset : 0),
          month = inst.drawMonth + (period === "M" ? offset : 0),
          day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
          date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      if (period === "M" || period === "Y") {
        this._notifyChange(inst);
      }
    },
    _restrictMinMax: function(inst, date) {
      var minDate = this._getMinMaxDate(inst, "min"),
          maxDate = this._getMinMaxDate(inst, "max"),
          newDate = (minDate && date < minDate ? minDate : date);
      return (maxDate && newDate > maxDate ? maxDate : newDate);
    },
    _notifyChange: function(inst) {
      var onChange = this._get(inst, "onChangeMonthYear");
      if (onChange) {
        onChange.apply((inst.input ? inst.input[0] : null), [inst.selectedYear, inst.selectedMonth + 1, inst]);
      }
    },
    _getNumberOfMonths: function(inst) {
      var numMonths = this._get(inst, "numberOfMonths");
      return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
    },
    _getMinMaxDate: function(inst, minMax) {
      return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },
    _getDaysInMonth: function(year, month) {
      return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },
    _getFirstDayOfMonth: function(year, month) {
      return new Date(year, month, 1).getDay();
    },
    _canAdjustMonth: function(inst, offset, curYear, curMonth) {
      var numMonths = this._getNumberOfMonths(inst),
          date = this._daylightSavingAdjust(new Date(curYear, curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
      if (offset < 0) {
        date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
      }
      return this._isInRange(inst, date);
    },
    _isInRange: function(inst, date) {
      var yearSplit, currentYear, minDate = this._getMinMaxDate(inst, "min"),
          maxDate = this._getMinMaxDate(inst, "max"),
          minYear = null,
          maxYear = null,
          years = this._get(inst, "yearRange");
      if (years) {
        yearSplit = years.split(":");
        currentYear = new Date().getFullYear();
        minYear = parseInt(yearSplit[0], 10);
        maxYear = parseInt(yearSplit[1], 10);
        if (yearSplit[0].match(/[+\-].*/)) {
          minYear += currentYear;
        }
        if (yearSplit[1].match(/[+\-].*/)) {
          maxYear += currentYear;
        }
      }
      return ((!minDate || date.getTime() >= minDate.getTime()) && (!maxDate || date.getTime() <= maxDate.getTime()) && (!minYear || date.getFullYear() >= minYear) && (!maxYear || date.getFullYear() <= maxYear));
    },
    _getFormatConfig: function(inst) {
      var shortYearCutoff = this._get(inst, "shortYearCutoff");
      shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff : new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
      return {
        shortYearCutoff: shortYearCutoff,
        dayNamesShort: this._get(inst, "dayNamesShort"),
        dayNames: this._get(inst, "dayNames"),
        monthNamesShort: this._get(inst, "monthNamesShort"),
        monthNames: this._get(inst, "monthNames")
      };
    },
    _formatDate: function(inst, day, month, year) {
      if (!day) {
        inst.currentDay = inst.selectedDay;
        inst.currentMonth = inst.selectedMonth;
        inst.currentYear = inst.selectedYear;
      }
      var date = (day ? (typeof day === "object" ? day : this._daylightSavingAdjust(new Date(year, month, day))) : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
      return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
    }
  });

  function bindHover(dpDiv) {
    var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return dpDiv.delegate(selector, "mouseout", function() {
      $(this).removeClass("ui-state-hover");
      if (this.className.indexOf("ui-datepicker-prev") !== -1) {
        $(this).removeClass("ui-datepicker-prev-hover");
      }
      if (this.className.indexOf("ui-datepicker-next") !== -1) {
        $(this).removeClass("ui-datepicker-next-hover");
      }
    }).delegate(selector, "mouseover", function() {
      if (!$.datepicker._isDisabledDatepicker(instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
        $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
        $(this).addClass("ui-state-hover");
        if (this.className.indexOf("ui-datepicker-prev") !== -1) {
          $(this).addClass("ui-datepicker-prev-hover");
        }
        if (this.className.indexOf("ui-datepicker-next") !== -1) {
          $(this).addClass("ui-datepicker-next-hover");
        }
      }
    });
  }
  function extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
      if (props[name] == null) {
        target[name] = props[name];
      }
    }
    return target;
  }
  $.fn.datepicker = function(options) {
    if (!this.length) {
      return this;
    }
    if (!$.datepicker.initialized) {
      $(document).mousedown($.datepicker._checkExternalClick);
      $.datepicker.initialized = true;
    }
    if ($("#" + $.datepicker._mainDivId).length === 0) {
      $("body").append($.datepicker.dpDiv);
    }
    var otherArgs = Array.prototype.slice.call(arguments, 1);
    if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
      return $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(otherArgs));
    }
    if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
      return $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(otherArgs));
    }
    return this.each(function() {
      typeof options === "string" ? $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this].concat(otherArgs)) : $.datepicker._attachDatepicker(this, options);
    });
  };
  $.datepicker = new Datepicker();
  $.datepicker.initialized = false;
  $.datepicker.uuid = new Date().getTime();
  $.datepicker.version = "1.10.4";
})(jQuery);
(function($, undefined) {
  var numPages = 5;
  $.widget("ui.slider", $.ui.mouse, {
    version: "1.10.4",
    widgetEventPrefix: "slide",
    options: {
      animate: false,
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: false,
      step: 1,
      value: 0,
      values: null,
      change: null,
      slide: null,
      start: null,
      stop: null
    },
    _create: function() {
      this._keySliding = false;
      this._mouseSliding = false;
      this._animateOff = true;
      this._handleIndex = null;
      this._detectOrientation();
      this._mouseInit();
      this.element.addClass("ui-slider" + " ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all");
      this._refresh();
      this._setOption("disabled", this.options.disabled);
      this._animateOff = false;
    },
    _refresh: function() {
      this._createRange();
      this._createHandles();
      this._setupEvents();
      this._refreshValue();
    },
    _createHandles: function() {
      var i, handleCount, options = this.options,
          existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
          handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
          handles = [];
      handleCount = (options.values && options.values.length) || 1;
      if (existingHandles.length > handleCount) {
        existingHandles.slice(handleCount).remove();
        existingHandles = existingHandles.slice(0, handleCount);
      }
      for (i = existingHandles.length; i < handleCount; i++) {
        handles.push(handle);
      }
      this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));
      this.handle = this.handles.eq(0);
      this.handles.each(function(i) {
        $(this).data("ui-slider-handle-index", i);
      });
    },
    _createRange: function() {
      var options = this.options,
          classes = "";
      if (options.range) {
        if (options.range === true) {
          if (!options.values) {
            options.values = [this._valueMin(), this._valueMin()];
          } else {
            if (options.values.length && options.values.length !== 2) {
              options.values = [options.values[0], options.values[0]];
            } else {
              if ($.isArray(options.values)) {
                options.values = options.values.slice(0);
              }
            }
          }
        }
        if (!this.range || !this.range.length) {
          this.range = $("<div></div>").appendTo(this.element);
          classes = "ui-slider-range" + " ui-widget-header ui-corner-all";
        } else {
          this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
            "left": "",
            "bottom": ""
          });
        }
        this.range.addClass(classes + ((options.range === "min" || options.range === "max") ? " ui-slider-range-" + options.range : ""));
      } else {
        if (this.range) {
          this.range.remove();
        }
        this.range = null;
      }
    },
    _setupEvents: function() {
      var elements = this.handles.add(this.range).filter("a");
      this._off(elements);
      this._on(elements, this._handleEvents);
      this._hoverable(elements);
      this._focusable(elements);
    },
    _destroy: function() {
      this.handles.remove();
      if (this.range) {
        this.range.remove();
      }
      this.element.removeClass("ui-slider" + " ui-slider-horizontal" + " ui-slider-vertical" + " ui-widget" + " ui-widget-content" + " ui-corner-all");
      this._mouseDestroy();
    },
    _mouseCapture: function(event) {
      var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle, that = this,
          o = this.options;
      if (o.disabled) {
        return false;
      }
      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      };
      this.elementOffset = this.element.offset();
      position = {
        x: event.pageX,
        y: event.pageY
      };
      normValue = this._normValueFromMouse(position);
      distance = this._valueMax() - this._valueMin() + 1;
      this.handles.each(function(i) {
        var thisDistance = Math.abs(normValue - that.values(i));
        if ((distance > thisDistance) || (distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min))) {
          distance = thisDistance;
          closestHandle = $(this);
          index = i;
        }
      });
      allowed = this._start(event, index);
      if (allowed === false) {
        return false;
      }
      this._mouseSliding = true;
      this._handleIndex = index;
      closestHandle.addClass("ui-state-active").focus();
      offset = closestHandle.offset();
      mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
      this._clickOffset = mouseOverHandle ? {
        left: 0,
        top: 0
      } : {
        left: event.pageX - offset.left - (closestHandle.width() / 2),
        top: event.pageY - offset.top - (closestHandle.height() / 2) - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
      };
      if (!this.handles.hasClass("ui-state-hover")) {
        this._slide(event, index, normValue);
      }
      this._animateOff = true;
      return true;
    },
    _mouseStart: function() {
      return true;
    },
    _mouseDrag: function(event) {
      var position = {
        x: event.pageX,
        y: event.pageY
      },
          normValue = this._normValueFromMouse(position);
      this._slide(event, this._handleIndex, normValue);
      return false;
    },
    _mouseStop: function(event) {
      this.handles.removeClass("ui-state-active");
      this._mouseSliding = false;
      this._stop(event, this._handleIndex);
      this._change(event, this._handleIndex);
      this._handleIndex = null;
      this._clickOffset = null;
      this._animateOff = false;
      return false;
    },
    _detectOrientation: function() {
      this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
    },
    _normValueFromMouse: function(position) {
      var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;
      if (this.orientation === "horizontal") {
        pixelTotal = this.elementSize.width;
        pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
      } else {
        pixelTotal = this.elementSize.height;
        pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
      }
      percentMouse = (pixelMouse / pixelTotal);
      if (percentMouse > 1) {
        percentMouse = 1;
      }
      if (percentMouse < 0) {
        percentMouse = 0;
      }
      if (this.orientation === "vertical") {
        percentMouse = 1 - percentMouse;
      }
      valueTotal = this._valueMax() - this._valueMin();
      valueMouse = this._valueMin() + percentMouse * valueTotal;
      return this._trimAlignValue(valueMouse);
    },
    _start: function(event, index) {
      var uiHash = {
        handle: this.handles[index],
        value: this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      return this._trigger("start", event, uiHash);
    },
    _slide: function(event, index, newVal) {
      var otherVal, newValues, allowed;
      if (this.options.values && this.options.values.length) {
        otherVal = this.values(index ? 0 : 1);
        if ((this.options.values.length === 2 && this.options.range === true) && ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))) {
          newVal = otherVal;
        }
        if (newVal !== this.values(index)) {
          newValues = this.values();
          newValues[index] = newVal;
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal,
            values: newValues
          });
          otherVal = this.values(index ? 0 : 1);
          if (allowed !== false) {
            this.values(index, newVal);
          }
        }
      } else {
        if (newVal !== this.value()) {
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal
          });
          if (allowed !== false) {
            this.value(newVal);
          }
        }
      }
    },
    _stop: function(event, index) {
      var uiHash = {
        handle: this.handles[index],
        value: this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      this._trigger("stop", event, uiHash);
    },
    _change: function(event, index) {
      if (!this._keySliding && !this._mouseSliding) {
        var uiHash = {
          handle: this.handles[index],
          value: this.value()
        };
        if (this.options.values && this.options.values.length) {
          uiHash.value = this.values(index);
          uiHash.values = this.values();
        }
        this._lastChangedValue = index;
        this._trigger("change", event, uiHash);
      }
    },
    value: function(newValue) {
      if (arguments.length) {
        this.options.value = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, 0);
        return;
      }
      return this._value();
    },
    values: function(index, newValue) {
      var vals, newValues, i;
      if (arguments.length > 1) {
        this.options.values[index] = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, index);
        return;
      }
      if (arguments.length) {
        if ($.isArray(arguments[0])) {
          vals = this.options.values;
          newValues = arguments[0];
          for (i = 0; i < vals.length; i += 1) {
            vals[i] = this._trimAlignValue(newValues[i]);
            this._change(null, i);
          }
          this._refreshValue();
        } else {
          if (this.options.values && this.options.values.length) {
            return this._values(index);
          } else {
            return this.value();
          }
        }
      } else {
        return this._values();
      }
    },
    _setOption: function(key, value) {
      var i, valsLength = 0;
      if (key === "range" && this.options.range === true) {
        if (value === "min") {
          this.options.value = this._values(0);
          this.options.values = null;
        } else {
          if (value === "max") {
            this.options.value = this._values(this.options.values.length - 1);
            this.options.values = null;
          }
        }
      }
      if ($.isArray(this.options.values)) {
        valsLength = this.options.values.length;
      }
      $.Widget.prototype._setOption.apply(this, arguments);
      switch (key) {
      case "orientation":
        this._detectOrientation();
        this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
        this._refreshValue();
        break;
      case "value":
        this._animateOff = true;
        this._refreshValue();
        this._change(null, 0);
        this._animateOff = false;
        break;
      case "values":
        this._animateOff = true;
        this._refreshValue();
        for (i = 0; i < valsLength; i += 1) {
          this._change(null, i);
        }
        this._animateOff = false;
        break;
      case "min":
      case "max":
        this._animateOff = true;
        this._refreshValue();
        this._animateOff = false;
        break;
      case "range":
        this._animateOff = true;
        this._refresh();
        this._animateOff = false;
        break;
      }
    },
    _value: function() {
      var val = this.options.value;
      val = this._trimAlignValue(val);
      return val;
    },
    _values: function(index) {
      var val, vals, i;
      if (arguments.length) {
        val = this.options.values[index];
        val = this._trimAlignValue(val);
        return val;
      } else {
        if (this.options.values && this.options.values.length) {
          vals = this.options.values.slice();
          for (i = 0; i < vals.length; i += 1) {
            vals[i] = this._trimAlignValue(vals[i]);
          }
          return vals;
        } else {
          return [];
        }
      }
    },
    _trimAlignValue: function(val) {
      if (val <= this._valueMin()) {
        return this._valueMin();
      }
      if (val >= this._valueMax()) {
        return this._valueMax();
      }
      var step = (this.options.step > 0) ? this.options.step : 1,
          valModStep = (val - this._valueMin()) % step,
          alignValue = val - valModStep;
      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += (valModStep > 0) ? step : (-step);
      }
      return parseFloat(alignValue.toFixed(5));
    },
    _valueMin: function() {
      return this.options.min;
    },
    _valueMax: function() {
      return this.options.max;
    },
    _refreshValue: function() {
      var lastValPercent, valPercent, value, valueMin, valueMax, oRange = this.options.range,
          o = this.options,
          that = this,
          animate = (!this._animateOff) ? o.animate : false,
          _set = {};
      if (this.options.values && this.options.values.length) {
        this.handles.each(function(i) {
          valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
          _set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
          $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
          if (that.options.range === true) {
            if (that.orientation === "horizontal") {
              if (i === 0) {
                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                  left: valPercent + "%"
                }, o.animate);
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"]({
                  width: (valPercent - lastValPercent) + "%"
                }, {
                  queue: false,
                  duration: o.animate
                });
              }
            } else {
              if (i === 0) {
                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                  bottom: (valPercent) + "%"
                }, o.animate);
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"]({
                  height: (valPercent - lastValPercent) + "%"
                }, {
                  queue: false,
                  duration: o.animate
                });
              }
            }
          }
          lastValPercent = valPercent;
        });
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        valPercent = (valueMax !== valueMin) ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
        _set[this.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
        this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
        if (oRange === "min" && this.orientation === "horizontal") {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            width: valPercent + "%"
          }, o.animate);
        }
        if (oRange === "max" && this.orientation === "horizontal") {
          this.range[animate ? "animate" : "css"]({
            width: (100 - valPercent) + "%"
          }, {
            queue: false,
            duration: o.animate
          });
        }
        if (oRange === "min" && this.orientation === "vertical") {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            height: valPercent + "%"
          }, o.animate);
        }
        if (oRange === "max" && this.orientation === "vertical") {
          this.range[animate ? "animate" : "css"]({
            height: (100 - valPercent) + "%"
          }, {
            queue: false,
            duration: o.animate
          });
        }
      }
    },
    _handleEvents: {
      keydown: function(event) {
        var allowed, curVal, newVal, step, index = $(event.target).data("ui-slider-handle-index");
        switch (event.keyCode) {
        case $.ui.keyCode.HOME:
        case $.ui.keyCode.END:
        case $.ui.keyCode.PAGE_UP:
        case $.ui.keyCode.PAGE_DOWN:
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          event.preventDefault();
          if (!this._keySliding) {
            this._keySliding = true;
            $(event.target).addClass("ui-state-active");
            allowed = this._start(event, index);
            if (allowed === false) {
              return;
            }
          }
          break;
        }
        step = this.options.step;
        if (this.options.values && this.options.values.length) {
          curVal = newVal = this.values(index);
        } else {
          curVal = newVal = this.value();
        }
        switch (event.keyCode) {
        case $.ui.keyCode.HOME:
          newVal = this._valueMin();
          break;
        case $.ui.keyCode.END:
          newVal = this._valueMax();
          break;
        case $.ui.keyCode.PAGE_UP:
          newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
          break;
        case $.ui.keyCode.PAGE_DOWN:
          newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
          break;
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
          if (curVal === this._valueMax()) {
            return;
          }
          newVal = this._trimAlignValue(curVal + step);
          break;
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          if (curVal === this._valueMin()) {
            return;
          }
          newVal = this._trimAlignValue(curVal - step);
          break;
        }
        this._slide(event, index, newVal);
      },
      click: function(event) {
        event.preventDefault();
      },
      keyup: function(event) {
        var index = $(event.target).data("ui-slider-handle-index");
        if (this._keySliding) {
          this._keySliding = false;
          this._stop(event, index);
          this._change(event, index);
          $(event.target).removeClass("ui-state-active");
        }
      }
    }
  });
}(jQuery));
(function($, undefined) {
  var dataSpace = "ui-effects-";
  $.effects = {
    effect: {}
  };
/*
 * jQuery Color Animations v2.1.2
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Wed Jan 16 08:47:09 2013 -0600
 */
  (function(jQuery, undefined) {
    var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
        rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
        stringParsers = [{
        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
        parse: function(execResult) {
          return [execResult[1], execResult[2], execResult[3], execResult[4]];
        }
      }, {
        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
        parse: function(execResult) {
          return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
        }
      }, {
        re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
        parse: function(execResult) {
          return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
        }
      }, {
        re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
        parse: function(execResult) {
          return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
        }
      }, {
        re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
        space: "hsla",
        parse: function(execResult) {
          return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
        }
      }],
        color = jQuery.Color = function(color, green, blue, alpha) {
        return new jQuery.Color.fn.parse(color, green, blue, alpha);
        },
        spaces = {
        rgba: {
          props: {
            red: {
              idx: 0,
              type: "byte"
            },
            green: {
              idx: 1,
              type: "byte"
            },
            blue: {
              idx: 2,
              type: "byte"
            }
          }
        },
        hsla: {
          props: {
            hue: {
              idx: 0,
              type: "degrees"
            },
            saturation: {
              idx: 1,
              type: "percent"
            },
            lightness: {
              idx: 2,
              type: "percent"
            }
          }
        }
        },
        propTypes = {
        "byte": {
          floor: true,
          max: 255
        },
        "percent": {
          max: 1
        },
        "degrees": {
          mod: 360,
          floor: true
        }
        },
        support = color.support = {},
        supportElem = jQuery("<p>")[0],
        colors, each = jQuery.each;
    supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
    support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;
    each(spaces, function(spaceName, space) {
      space.cache = "_" + spaceName;
      space.props.alpha = {
        idx: 3,
        type: "percent",
        def: 1
      };
    });

    function clamp(value, prop, allowEmpty) {
      var type = propTypes[prop.type] || {};
      if (value == null) {
        return (allowEmpty || !prop.def) ? null : prop.def;
      }
      value = type.floor ? ~~value : parseFloat(value);
      if (isNaN(value)) {
        return prop.def;
      }
      if (type.mod) {
        return (value + type.mod) % type.mod;
      }
      return 0 > value ? 0 : type.max < value ? type.max : value;
    }
    function stringParse(string) {
      var inst = color(),
          rgba = inst._rgba = [];
      string = string.toLowerCase();
      each(stringParsers, function(i, parser) {
        var parsed, match = parser.re.exec(string),
            values = match && parser.parse(match),
            spaceName = parser.space || "rgba";
        if (values) {
          parsed = inst[spaceName](values);
          inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
          rgba = inst._rgba = parsed._rgba;
          return false;
        }
      });
      if (rgba.length) {
        if (rgba.join() === "0,0,0,0") {
          jQuery.extend(rgba, colors.transparent);
        }
        return inst;
      }
      return colors[string];
    }
    color.fn = jQuery.extend(color.prototype, {
      parse: function(red, green, blue, alpha) {
        if (red === undefined) {
          this._rgba = [null, null, null, null];
          return this;
        }
        if (red.jquery || red.nodeType) {
          red = jQuery(red).css(green);
          green = undefined;
        }
        var inst = this,
            type = jQuery.type(red),
            rgba = this._rgba = [];
        if (green !== undefined) {
          red = [red, green, blue, alpha];
          type = "array";
        }
        if (type === "string") {
          return this.parse(stringParse(red) || colors._default);
        }
        if (type === "array") {
          each(spaces.rgba.props, function(key, prop) {
            rgba[prop.idx] = clamp(red[prop.idx], prop);
          });
          return this;
        }
        if (type === "object") {
          if (red instanceof color) {
            each(spaces, function(spaceName, space) {
              if (red[space.cache]) {
                inst[space.cache] = red[space.cache].slice();
              }
            });
          } else {
            each(spaces, function(spaceName, space) {
              var cache = space.cache;
              each(space.props, function(key, prop) {
                if (!inst[cache] && space.to) {
                  if (key === "alpha" || red[key] == null) {
                    return;
                  }
                  inst[cache] = space.to(inst._rgba);
                }
                inst[cache][prop.idx] = clamp(red[key], prop, true);
              });
              if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
                inst[cache][3] = 1;
                if (space.from) {
                  inst._rgba = space.from(inst[cache]);
                }
              }
            });
          }
          return this;
        }
      },
      is: function(compare) {
        var is = color(compare),
            same = true,
            inst = this;
        each(spaces, function(_, space) {
          var localCache, isCache = is[space.cache];
          if (isCache) {
            localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
            each(space.props, function(_, prop) {
              if (isCache[prop.idx] != null) {
                same = (isCache[prop.idx] === localCache[prop.idx]);
                return same;
              }
            });
          }
          return same;
        });
        return same;
      },
      _space: function() {
        var used = [],
            inst = this;
        each(spaces, function(spaceName, space) {
          if (inst[space.cache]) {
            used.push(spaceName);
          }
        });
        return used.pop();
      },
      transition: function(other, distance) {
        var end = color(other),
            spaceName = end._space(),
            space = spaces[spaceName],
            startColor = this.alpha() === 0 ? color("transparent") : this,
            start = startColor[space.cache] || space.to(startColor._rgba),
            result = start.slice();
        end = end[space.cache];
        each(space.props, function(key, prop) {
          var index = prop.idx,
              startValue = start[index],
              endValue = end[index],
              type = propTypes[prop.type] || {};
          if (endValue === null) {
            return;
          }
          if (startValue === null) {
            result[index] = endValue;
          } else {
            if (type.mod) {
              if (endValue - startValue > type.mod / 2) {
                startValue += type.mod;
              } else {
                if (startValue - endValue > type.mod / 2) {
                  startValue -= type.mod;
                }
              }
            }
            result[index] = clamp((endValue - startValue) * distance + startValue, prop);
          }
        });
        return this[spaceName](result);
      },
      blend: function(opaque) {
        if (this._rgba[3] === 1) {
          return this;
        }
        var rgb = this._rgba.slice(),
            a = rgb.pop(),
            blend = color(opaque)._rgba;
        return color(jQuery.map(rgb, function(v, i) {
          return (1 - a) * blend[i] + a * v;
        }));
      },
      toRgbaString: function() {
        var prefix = "rgba(",
            rgba = jQuery.map(this._rgba, function(v, i) {
            return v == null ? (i > 2 ? 1 : 0) : v;
          });
        if (rgba[3] === 1) {
          rgba.pop();
          prefix = "rgb(";
        }
        return prefix + rgba.join() + ")";
      },
      toHslaString: function() {
        var prefix = "hsla(",
            hsla = jQuery.map(this.hsla(), function(v, i) {
            if (v == null) {
              v = i > 2 ? 1 : 0;
            }
            if (i && i < 3) {
              v = Math.round(v * 100) + "%";
            }
            return v;
          });
        if (hsla[3] === 1) {
          hsla.pop();
          prefix = "hsl(";
        }
        return prefix + hsla.join() + ")";
      },
      toHexString: function(includeAlpha) {
        var rgba = this._rgba.slice(),
            alpha = rgba.pop();
        if (includeAlpha) {
          rgba.push(~~ (alpha * 255));
        }
        return "#" + jQuery.map(rgba, function(v) {
          v = (v || 0).toString(16);
          return v.length === 1 ? "0" + v : v;
        }).join("");
      },
      toString: function() {
        return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
      }
    });
    color.fn.parse.prototype = color.fn;

    function hue2rgb(p, q, h) {
      h = (h + 1) % 1;
      if (h * 6 < 1) {
        return p + (q - p) * h * 6;
      }
      if (h * 2 < 1) {
        return q;
      }
      if (h * 3 < 2) {
        return p + (q - p) * ((2 / 3) - h) * 6;
      }
      return p;
    }
    spaces.hsla.to = function(rgba) {
      if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
        return [null, null, null, rgba[3]];
      }
      var r = rgba[0] / 255,
          g = rgba[1] / 255,
          b = rgba[2] / 255,
          a = rgba[3],
          max = Math.max(r, g, b),
          min = Math.min(r, g, b),
          diff = max - min,
          add = max + min,
          l = add * 0.5,
          h, s;
      if (min === max) {
        h = 0;
      } else {
        if (r === max) {
          h = (60 * (g - b) / diff) + 360;
        } else {
          if (g === max) {
            h = (60 * (b - r) / diff) + 120;
          } else {
            h = (60 * (r - g) / diff) + 240;
          }
        }
      }
      if (diff === 0) {
        s = 0;
      } else {
        if (l <= 0.5) {
          s = diff / add;
        } else {
          s = diff / (2 - add);
        }
      }
      return [Math.round(h) % 360, s, l, a == null ? 1 : a];
    };
    spaces.hsla.from = function(hsla) {
      if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
        return [null, null, null, hsla[3]];
      }
      var h = hsla[0] / 360,
          s = hsla[1],
          l = hsla[2],
          a = hsla[3],
          q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q;
      return [Math.round(hue2rgb(p, q, h + (1 / 3)) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - (1 / 3)) * 255), a];
    };
    each(spaces, function(spaceName, space) {
      var props = space.props,
          cache = space.cache,
          to = space.to,
          from = space.from;
      color.fn[spaceName] = function(value) {
        if (to && !this[cache]) {
          this[cache] = to(this._rgba);
        }
        if (value === undefined) {
          return this[cache].slice();
        }
        var ret, type = jQuery.type(value),
            arr = (type === "array" || type === "object") ? value : arguments,
            local = this[cache].slice();
        each(props, function(key, prop) {
          var val = arr[type === "object" ? key : prop.idx];
          if (val == null) {
            val = local[prop.idx];
          }
          local[prop.idx] = clamp(val, prop);
        });
        if (from) {
          ret = color(from(local));
          ret[cache] = local;
          return ret;
        } else {
          return color(local);
        }
      };
      each(props, function(key, prop) {
        if (color.fn[key]) {
          return;
        }
        color.fn[key] = function(value) {
          var vtype = jQuery.type(value),
              fn = (key === "alpha" ? (this._hsla ? "hsla" : "rgba") : spaceName),
              local = this[fn](),
              cur = local[prop.idx],
              match;
          if (vtype === "undefined") {
            return cur;
          }
          if (vtype === "function") {
            value = value.call(this, cur);
            vtype = jQuery.type(value);
          }
          if (value == null && prop.empty) {
            return this;
          }
          if (vtype === "string") {
            match = rplusequals.exec(value);
            if (match) {
              value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
            }
          }
          local[prop.idx] = value;
          return this[fn](local);
        };
      });
    });
    color.hook = function(hook) {
      var hooks = hook.split(" ");
      each(hooks, function(i, hook) {
        jQuery.cssHooks[hook] = {
          set: function(elem, value) {
            var parsed, curElem, backgroundColor = "";
            if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
              value = color(parsed || value);
              if (!support.rgba && value._rgba[3] !== 1) {
                curElem = hook === "backgroundColor" ? elem.parentNode : elem;
                while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
                  try {
                    backgroundColor = jQuery.css(curElem, "backgroundColor");
                    curElem = curElem.parentNode;
                  } catch (e) {}
                }
                value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
              }
              value = value.toRgbaString();
            }
            try {
              elem.style[hook] = value;
            } catch (e) {}
          }
        };
        jQuery.fx.step[hook] = function(fx) {
          if (!fx.colorInit) {
            fx.start = color(fx.elem, hook);
            fx.end = color(fx.end);
            fx.colorInit = true;
          }
          jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
        };
      });
    };
    color.hook(stepHooks);
    jQuery.cssHooks.borderColor = {
      expand: function(value) {
        var expanded = {};
        each(["Top", "Right", "Bottom", "Left"], function(i, part) {
          expanded["border" + part + "Color"] = value;
        });
        return expanded;
      }
    };
    colors = jQuery.Color.names = {
      aqua: "#00ffff",
      black: "#000000",
      blue: "#0000ff",
      fuchsia: "#ff00ff",
      gray: "#808080",
      green: "#008000",
      lime: "#00ff00",
      maroon: "#800000",
      navy: "#000080",
      olive: "#808000",
      purple: "#800080",
      red: "#ff0000",
      silver: "#c0c0c0",
      teal: "#008080",
      white: "#ffffff",
      yellow: "#ffff00",
      transparent: [null, null, null, 0],
      _default: "#ffffff"
    };
  })(jQuery);
  (function() {
    var classAnimationActions = ["add", "remove", "toggle"],
        shorthandStyles = {
        border: 1,
        borderBottom: 1,
        borderColor: 1,
        borderLeft: 1,
        borderRight: 1,
        borderTop: 1,
        borderWidth: 1,
        margin: 1,
        padding: 1
        };
    $.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(_, prop) {
      $.fx.step[prop] = function(fx) {
        if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
          jQuery.style(fx.elem, prop, fx.end);
          fx.setAttr = true;
        }
      };
    });

    function getElementStyles(elem) {
      var key, len, style = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle,
          styles = {};
      if (style && style.length && style[0] && style[style[0]]) {
        len = style.length;
        while (len--) {
          key = style[len];
          if (typeof style[key] === "string") {
            styles[$.camelCase(key)] = style[key];
          }
        }
      } else {
        for (key in style) {
          if (typeof style[key] === "string") {
            styles[key] = style[key];
          }
        }
      }
      return styles;
    }
    function styleDifference(oldStyle, newStyle) {
      var diff = {},
          name, value;
      for (name in newStyle) {
        value = newStyle[name];
        if (oldStyle[name] !== value) {
          if (!shorthandStyles[name]) {
            if ($.fx.step[name] || !isNaN(parseFloat(value))) {
              diff[name] = value;
            }
          }
        }
      }
      return diff;
    }
    if (!$.fn.addBack) {
      $.fn.addBack = function(selector) {
        return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
      };
    }
    $.effects.animateClass = function(value, duration, easing, callback) {
      var o = $.speed(duration, easing, callback);
      return this.queue(function() {
        var animated = $(this),
            baseClass = animated.attr("class") || "",
            applyClassChange, allAnimations = o.children ? animated.find("*").addBack() : animated;
        allAnimations = allAnimations.map(function() {
          var el = $(this);
          return {
            el: el,
            start: getElementStyles(this)
          };
        });
        applyClassChange = function() {
          $.each(classAnimationActions, function(i, action) {
            if (value[action]) {
              animated[action + "Class"](value[action]);
            }
          });
        };
        applyClassChange();
        allAnimations = allAnimations.map(function() {
          this.end = getElementStyles(this.el[0]);
          this.diff = styleDifference(this.start, this.end);
          return this;
        });
        animated.attr("class", baseClass);
        allAnimations = allAnimations.map(function() {
          var styleInfo = this,
              dfd = $.Deferred(),
              opts = $.extend({}, o, {
              queue: false,
              complete: function() {
                dfd.resolve(styleInfo);
              }
            });
          this.el.animate(this.diff, opts);
          return dfd.promise();
        });
        $.when.apply($, allAnimations.get()).done(function() {
          applyClassChange();
          $.each(arguments, function() {
            var el = this.el;
            $.each(this.diff, function(key) {
              el.css(key, "");
            });
          });
          o.complete.call(animated[0]);
        });
      });
    };
    $.fn.extend({
      addClass: (function(orig) {
        return function(classNames, speed, easing, callback) {
          return speed ? $.effects.animateClass.call(this, {
            add: classNames
          }, speed, easing, callback) : orig.apply(this, arguments);
        };
      })($.fn.addClass),
      removeClass: (function(orig) {
        return function(classNames, speed, easing, callback) {
          return arguments.length > 1 ? $.effects.animateClass.call(this, {
            remove: classNames
          }, speed, easing, callback) : orig.apply(this, arguments);
        };
      })($.fn.removeClass),
      toggleClass: (function(orig) {
        return function(classNames, force, speed, easing, callback) {
          if (typeof force === "boolean" || force === undefined) {
            if (!speed) {
              return orig.apply(this, arguments);
            } else {
              return $.effects.animateClass.call(this, (force ? {
                add: classNames
              } : {
                remove: classNames
              }), speed, easing, callback);
            }
          } else {
            return $.effects.animateClass.call(this, {
              toggle: classNames
            }, force, speed, easing);
          }
        };
      })($.fn.toggleClass),
      switchClass: function(remove, add, speed, easing, callback) {
        return $.effects.animateClass.call(this, {
          add: add,
          remove: remove
        }, speed, easing, callback);
      }
    });
  })();
  (function() {
    $.extend($.effects, {
      version: "1.10.4",
      save: function(element, set) {
        for (var i = 0; i < set.length; i++) {
          if (set[i] !== null) {
            element.data(dataSpace + set[i], element[0].style[set[i]]);
          }
        }
      },
      restore: function(element, set) {
        var val, i;
        for (i = 0; i < set.length; i++) {
          if (set[i] !== null) {
            val = element.data(dataSpace + set[i]);
            if (val === undefined) {
              val = "";
            }
            element.css(set[i], val);
          }
        }
      },
      setMode: function(el, mode) {
        if (mode === "toggle") {
          mode = el.is(":hidden") ? "show" : "hide";
        }
        return mode;
      },
      getBaseline: function(origin, original) {
        var y, x;
        switch (origin[0]) {
        case "top":
          y = 0;
          break;
        case "middle":
          y = 0.5;
          break;
        case "bottom":
          y = 1;
          break;
        default:
          y = origin[0] / original.height;
        }
        switch (origin[1]) {
        case "left":
          x = 0;
          break;
        case "center":
          x = 0.5;
          break;
        case "right":
          x = 1;
          break;
        default:
          x = origin[1] / original.width;
        }
        return {
          x: x,
          y: y
        };
      },
      createWrapper: function(element) {
        if (element.parent().is(".ui-effects-wrapper")) {
          return element.parent();
        }
        var props = {
          width: element.outerWidth(true),
          height: element.outerHeight(true),
          "float": element.css("float")
        },
            wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
            fontSize: "100%",
            background: "transparent",
            border: "none",
            margin: 0,
            padding: 0
          }),
            size = {
            width: element.width(),
            height: element.height()
            },
            active = document.activeElement;
        try {
          active.id;
        } catch (e) {
          active = document.body;
        }
        element.wrap(wrapper);
        if (element[0] === active || $.contains(element[0], active)) {
          $(active).focus();
        }
        wrapper = element.parent();
        if (element.css("position") === "static") {
          wrapper.css({
            position: "relative"
          });
          element.css({
            position: "relative"
          });
        } else {
          $.extend(props, {
            position: element.css("position"),
            zIndex: element.css("z-index")
          });
          $.each(["top", "left", "bottom", "right"], function(i, pos) {
            props[pos] = element.css(pos);
            if (isNaN(parseInt(props[pos], 10))) {
              props[pos] = "auto";
            }
          });
          element.css({
            position: "relative",
            top: 0,
            left: 0,
            right: "auto",
            bottom: "auto"
          });
        }
        element.css(size);
        return wrapper.css(props).show();
      },
      removeWrapper: function(element) {
        var active = document.activeElement;
        if (element.parent().is(".ui-effects-wrapper")) {
          element.parent().replaceWith(element);
          if (element[0] === active || $.contains(element[0], active)) {
            $(active).focus();
          }
        }
        return element;
      },
      setTransition: function(element, list, factor, value) {
        value = value || {};
        $.each(list, function(i, x) {
          var unit = element.cssUnit(x);
          if (unit[0] > 0) {
            value[x] = unit[0] * factor + unit[1];
          }
        });
        return value;
      }
    });

    function _normalizeArguments(effect, options, speed, callback) {
      if ($.isPlainObject(effect)) {
        options = effect;
        effect = effect.effect;
      }
      effect = {
        effect: effect
      };
      if (options == null) {
        options = {};
      }
      if ($.isFunction(options)) {
        callback = options;
        speed = null;
        options = {};
      }
      if (typeof options === "number" || $.fx.speeds[options]) {
        callback = speed;
        speed = options;
        options = {};
      }
      if ($.isFunction(speed)) {
        callback = speed;
        speed = null;
      }
      if (options) {
        $.extend(effect, options);
      }
      speed = speed || options.duration;
      effect.duration = $.fx.off ? 0 : typeof speed === "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;
      effect.complete = callback || options.complete;
      return effect;
    }
    function standardAnimationOption(option) {
      if (!option || typeof option === "number" || $.fx.speeds[option]) {
        return true;
      }
      if (typeof option === "string" && !$.effects.effect[option]) {
        return true;
      }
      if ($.isFunction(option)) {
        return true;
      }
      if (typeof option === "object" && !option.effect) {
        return true;
      }
      return false;
    }
    $.fn.extend({
      effect: function() {
        var args = _normalizeArguments.apply(this, arguments),
            mode = args.mode,
            queue = args.queue,
            effectMethod = $.effects.effect[args.effect];
        if ($.fx.off || !effectMethod) {
          if (mode) {
            return this[mode](args.duration, args.complete);
          } else {
            return this.each(function() {
              if (args.complete) {
                args.complete.call(this);
              }
            });
          }
        }
        function run(next) {
          var elem = $(this),
              complete = args.complete,
              mode = args.mode;

          function done() {
            if ($.isFunction(complete)) {
              complete.call(elem[0]);
            }
            if ($.isFunction(next)) {
              next();
            }
          }
          if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
            elem[mode]();
            done();
          } else {
            effectMethod.call(elem[0], args, done);
          }
        }
        return queue === false ? this.each(run) : this.queue(queue || "fx", run);
      },
      show: (function(orig) {
        return function(option) {
          if (standardAnimationOption(option)) {
            return orig.apply(this, arguments);
          } else {
            var args = _normalizeArguments.apply(this, arguments);
            args.mode = "show";
            return this.effect.call(this, args);
          }
        };
      })($.fn.show),
      hide: (function(orig) {
        return function(option) {
          if (standardAnimationOption(option)) {
            return orig.apply(this, arguments);
          } else {
            var args = _normalizeArguments.apply(this, arguments);
            args.mode = "hide";
            return this.effect.call(this, args);
          }
        };
      })($.fn.hide),
      toggle: (function(orig) {
        return function(option) {
          if (standardAnimationOption(option) || typeof option === "boolean") {
            return orig.apply(this, arguments);
          } else {
            var args = _normalizeArguments.apply(this, arguments);
            args.mode = "toggle";
            return this.effect.call(this, args);
          }
        };
      })($.fn.toggle),
      cssUnit: function(key) {
        var style = this.css(key),
            val = [];
        $.each(["em", "px", "%", "pt"], function(i, unit) {
          if (style.indexOf(unit) > 0) {
            val = [parseFloat(style), unit];
          }
        });
        return val;
      }
    });
  })();
  (function() {
    var baseEasings = {};
    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(i, name) {
      baseEasings[name] = function(p) {
        return Math.pow(p, i + 2);
      };
    });
    $.extend(baseEasings, {
      Sine: function(p) {
        return 1 - Math.cos(p * Math.PI / 2);
      },
      Circ: function(p) {
        return 1 - Math.sqrt(1 - p * p);
      },
      Elastic: function(p) {
        return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
      },
      Back: function(p) {
        return p * p * (3 * p - 2);
      },
      Bounce: function(p) {
        var pow2, bounce = 4;
        while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
      }
    });
    $.each(baseEasings, function(name, easeIn) {
      $.easing["easeIn" + name] = easeIn;
      $.easing["easeOut" + name] = function(p) {
        return 1 - easeIn(1 - p);
      };
      $.easing["easeInOut" + name] = function(p) {
        return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
      };
    });
  })();
})(jQuery);
(function($, undefined) {
  $.effects.effect.fade = function(o, done) {
    var el = $(this),
        mode = $.effects.setMode(el, o.mode || "toggle");
    el.animate({
      opacity: mode
    }, {
      queue: false,
      duration: o.duration,
      easing: o.easing,
      complete: done
    });
  };
})(jQuery);
(function($, undefined) {
  $.ui = $.ui || {};
  var horizontalPositions = /left|center|right/,
      verticalPositions = /top|center|bottom/,
      center = "center",
      _position = $.fn.position,
      _offset = $.fn.offset;
  $.fn.position = function(options) {
    if (!options || !options.of) {
      return _position.apply(this, arguments);
    }
    options = $.extend({}, options);
    var target = $(options.of),
        targetElem = target[0],
        collision = (options.collision || "flip").split(" "),
        offset = options.offset ? options.offset.split(" ") : [0, 0],
        targetWidth, targetHeight, basePosition;
    if (targetElem.nodeType === 9) {
      targetWidth = target.width();
      targetHeight = target.height();
      basePosition = {
        top: 0,
        left: 0
      };
    } else {
      if (targetElem.setTimeout) {
        targetWidth = target.width();
        targetHeight = target.height();
        basePosition = {
          top: target.scrollTop(),
          left: target.scrollLeft()
        };
      } else {
        if (targetElem.preventDefault) {
          options.at = "left top";
          targetWidth = targetHeight = 0;
          basePosition = {
            top: options.of.pageY,
            left: options.of.pageX
          };
        } else {
          targetWidth = target.outerWidth();
          targetHeight = target.outerHeight();
          basePosition = target.offset();
        }
      }
    }
    $.each(["my", "at"], function() {
      var pos = (options[this] || "").split(" ");
      if (pos.length === 1) {
        pos = horizontalPositions.test(pos[0]) ? pos.concat([center]) : verticalPositions.test(pos[0]) ? [center].concat(pos) : [center, center];
      }
      pos[0] = horizontalPositions.test(pos[0]) ? pos[0] : center;
      pos[1] = verticalPositions.test(pos[1]) ? pos[1] : center;
      options[this] = pos;
    });
    if (collision.length === 1) {
      collision[1] = collision[0];
    }
    offset[0] = parseInt(offset[0], 10) || 0;
    if (offset.length === 1) {
      offset[1] = offset[0];
    }
    offset[1] = parseInt(offset[1], 10) || 0;
    if (options.at[0] === "right") {
      basePosition.left += targetWidth;
    } else {
      if (options.at[0] === center) {
        basePosition.left += targetWidth / 2;
      }
    }
    if (options.at[1] === "bottom") {
      basePosition.top += targetHeight;
    } else {
      if (options.at[1] === center) {
        basePosition.top += targetHeight / 2;
      }
    }
    basePosition.left += offset[0];
    basePosition.top += offset[1];
    return this.each(function() {
      var elem = $(this),
          elemWidth = elem.outerWidth(),
          elemHeight = elem.outerHeight(),
          marginLeft = parseInt($.curCSS(this, "marginLeft", true)) || 0,
          marginTop = parseInt($.curCSS(this, "marginTop", true)) || 0,
          collisionWidth = elemWidth + marginLeft + parseInt($.curCSS(this, "marginRight", true)) || 0,
          collisionHeight = elemHeight + marginTop + parseInt($.curCSS(this, "marginBottom", true)) || 0,
          position = $.extend({}, basePosition),
          collisionPosition;
      if (options.my[0] === "right") {
        position.left -= elemWidth;
      } else {
        if (options.my[0] === center) {
          position.left -= elemWidth / 2;
        }
      }
      if (options.my[1] === "bottom") {
        position.top -= elemHeight;
      } else {
        if (options.my[1] === center) {
          position.top -= elemHeight / 2;
        }
      }
      position.left = parseInt(position.left);
      position.top = parseInt(position.top);
      collisionPosition = {
        left: position.left - marginLeft,
        top: position.top - marginTop
      };
      $.each(["left", "top"], function(i, dir) {
        if ($.ui.position[collision[i]]) {
          $.ui.position[collision[i]][dir](position, {
            targetWidth: targetWidth,
            targetHeight: targetHeight,
            elemWidth: elemWidth,
            elemHeight: elemHeight,
            collisionPosition: collisionPosition,
            collisionWidth: collisionWidth,
            collisionHeight: collisionHeight,
            offset: offset,
            my: options.my,
            at: options.at
          });
        }
      });
      if ($.fn.bgiframe) {
        elem.bgiframe();
      }
      elem.offset($.extend(position, {
        using: options.using
      }));
    });
  };
  $.ui.position = {
    fit: {
      left: function(position, data) {
        var win = $(window),
            over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
        position.left = over > 0 ? position.left - over : Math.max(position.left - data.collisionPosition.left, position.left);
      },
      top: function(position, data) {
        var win = $(window),
            over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
        position.top = over > 0 ? position.top - over : Math.max(position.top - data.collisionPosition.top, position.top);
      }
    },
    flip: {
      left: function(position, data) {
        if (data.at[0] === center) {
          return;
        }
        var win = $(window),
            over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
            myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
            atOffset = data.at[0] === "left" ? data.targetWidth : -data.targetWidth,
            offset = -2 * data.offset[0];
        position.left += data.collisionPosition.left < 0 ? myOffset + atOffset + offset : over > 0 ? myOffset + atOffset + offset : 0;
      },
      top: function(position, data) {
        if (data.at[1] === center) {
          return;
        }
        var win = $(window),
            over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
            myOffset = data.my[1] === "top" ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
            atOffset = data.at[1] === "top" ? data.targetHeight : -data.targetHeight,
            offset = -2 * data.offset[1];
        position.top += data.collisionPosition.top < 0 ? myOffset + atOffset + offset : over > 0 ? myOffset + atOffset + offset : 0;
      }
    }
  };
  if (!$.offset.setOffset) {
    $.offset.setOffset = function(elem, options) {
      if (/static/.test($.curCSS(elem, "position"))) {
        elem.style.position = "relative";
      }
      var curElem = $(elem),
          curOffset = curElem.offset(),
          curTop = parseInt($.curCSS(elem, "top", true), 10) || 0,
          curLeft = parseInt($.curCSS(elem, "left", true), 10) || 0,
          props = {
          top: (options.top - curOffset.top) + curTop,
          left: (options.left - curOffset.left) + curLeft
          };
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    };
    $.fn.offset = function(options) {
      var elem = this[0];
      if (!elem || !elem.ownerDocument) {
        return null;
      }
      if (options) {
        return this.each(function() {
          $.offset.setOffset(this, options);
        });
      }
      return _offset.call(this);
    };
  }
}(jQuery));
/* jQuery UI - v1.10.4 - 2014-03-03
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */
(function($, undefined) {
  var uuid = 0,
      runiqueId = /^ui-id-\d+$/;
  $.ui = $.ui || {};
  $.extend($.ui, {
    version: "1.10.4",
    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  });
  $.fn.extend({
    focus: (function(orig) {
      return function(delay, fn) {
        return typeof delay === "number" ? this.each(function() {
          var elem = this;
          setTimeout(function() {
            $(elem).focus();
            if (fn) {
              fn.call(elem);
            }
          }, delay);
        }) : orig.apply(this, arguments);
      };
    })($.fn.focus),
    scrollParent: function() {
      var scrollParent;
      if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
        scrollParent = this.parents().filter(function() {
          return (/(relative|absolute|fixed)/).test($.css(this, "position")) && (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      } else {
        scrollParent = this.parents().filter(function() {
          return (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      }
      return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
    },
    zIndex: function(zIndex) {
      if (zIndex !== undefined) {
        return this.css("zIndex", zIndex);
      }
      if (this.length) {
        var elem = $(this[0]),
            position, value;
        while (elem.length && elem[0] !== document) {
          position = elem.css("position");
          if (position === "absolute" || position === "relative" || position === "fixed") {
            value = parseInt(elem.css("zIndex"), 10);
            if (!isNaN(value) && value !== 0) {
              return value;
            }
          }
          elem = elem.parent();
        }
      }
      return 0;
    },
    uniqueId: function() {
      return this.each(function() {
        if (!this.id) {
          this.id = "ui-id-" + (++uuid);
        }
      });
    },
    removeUniqueId: function() {
      return this.each(function() {
        if (runiqueId.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    }
  });

  function focusable(element, isTabIndexNotNaN) {
    var map, mapName, img, nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }
      img = $("img[usemap=#" + mapName + "]")[0];
      return !!img && visible(img);
    }
    return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
  }
  function visible(element) {
    return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
      return $.css(this, "visibility") === "hidden";
    }).length;
  }
  $.extend($.expr[":"], {
    data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
      return function(elem) {
        return !!$.data(elem, dataName);
      };
    }) : function(elem, i, match) {
      return !!$.data(elem, match[3]);
    },
    focusable: function(element) {
      return focusable(element, !isNaN($.attr(element, "tabindex")));
    },
    tabbable: function(element) {
      var tabIndex = $.attr(element, "tabindex"),
          isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }
  });
  if (!$("<a>").outerWidth(1).jquery) {
    $.each(["Width", "Height"], function(i, name) {
      var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
          type = name.toLowerCase(),
          orig = {
          innerWidth: $.fn.innerWidth,
          innerHeight: $.fn.innerHeight,
          outerWidth: $.fn.outerWidth,
          outerHeight: $.fn.outerHeight
          };

      function reduce(elem, size, border, margin) {
        $.each(side, function() {
          size -= parseFloat($.css(elem, "padding" + this)) || 0;
          if (border) {
            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
          }
          if (margin) {
            size -= parseFloat($.css(elem, "margin" + this)) || 0;
          }
        });
        return size;
      }
      $.fn["inner" + name] = function(size) {
        if (size === undefined) {
          return orig["inner" + name].call(this);
        }
        return this.each(function() {
          $(this).css(type, reduce(this, size) + "px");
        });
      };
      $.fn["outer" + name] = function(size, margin) {
        if (typeof size !== "number") {
          return orig["outer" + name].call(this, size);
        }
        return this.each(function() {
          $(this).css(type, reduce(this, size, true, margin) + "px");
        });
      };
    });
  }
  if (!$.fn.addBack) {
    $.fn.addBack = function(selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    };
  }
  if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
    $.fn.removeData = (function(removeData) {
      return function(key) {
        if (arguments.length) {
          return removeData.call(this, $.camelCase(key));
        } else {
          return removeData.call(this);
        }
      };
    })($.fn.removeData);
  }
  $.ui.ie = !! /msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  $.support.selectstart = "onselectstart" in document.createElement("div");
  $.fn.extend({
    disableSelection: function() {
      return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
        event.preventDefault();
      });
    },
    enableSelection: function() {
      return this.unbind(".ui-disableSelection");
    }
  });
  $.extend($.ui, {
    plugin: {
      add: function(module, option, set) {
        var i, proto = $.ui[module].prototype;
        for (i in set) {
          proto.plugins[i] = proto.plugins[i] || [];
          proto.plugins[i].push([option, set[i]]);
        }
      },
      call: function(instance, name, args) {
        var i, set = instance.plugins[name];
        if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
          return;
        }
        for (i = 0; i < set.length; i++) {
          if (instance.options[set[i][0]]) {
            set[i][1].apply(instance.element, args);
          }
        }
      }
    },
    hasScroll: function(el, a) {
      if ($(el).css("overflow") === "hidden") {
        return false;
      }
      var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
          has = false;
      if (el[scroll] > 0) {
        return true;
      }
      el[scroll] = 1;
      has = (el[scroll] > 0);
      el[scroll] = 0;
      return has;
    }
  });
})(jQuery);
(function($, undefined) {
  var uuid = 0,
      slice = Array.prototype.slice,
      _cleanData = $.cleanData;
  $.cleanData = function(elems) {
    for (var i = 0, elem;
    (elem = elems[i]) != null; i++) {
      try {
        $(elem).triggerHandler("remove");
      } catch (e) {}
    }
    _cleanData(elems);
  };
  $.widget = function(name, base, prototype) {
    var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {},
        namespace = name.split(".")[0];
    name = name.split(".")[1];
    fullName = namespace + "-" + name;
    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }
    $.expr[":"][fullName.toLowerCase()] = function(elem) {
      return !!$.data(elem, fullName);
    };
    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];
    constructor = $[namespace][name] = function(options, element) {
      if (!this._createWidget) {
        return new constructor(options, element);
      }
      if (arguments.length) {
        this._createWidget(options, element);
      }
    };
    $.extend(constructor, existingConstructor, {
      version: prototype.version,
      _proto: $.extend({}, prototype),
      _childConstructors: []
    });
    basePrototype = new base();
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function(prop, value) {
      if (!$.isFunction(value)) {
        proxiedPrototype[prop] = value;
        return;
      }
      proxiedPrototype[prop] = (function() {
        var _super = function() {
          return base.prototype[prop].apply(this, arguments);
        },
            _superApply = function(args) {
            return base.prototype[prop].apply(this, args);
            };
        return function() {
          var __super = this._super,
              __superApply = this._superApply,
              returnValue;
          this._super = _super;
          this._superApply = _superApply;
          returnValue = value.apply(this, arguments);
          this._super = __super;
          this._superApply = __superApply;
          return returnValue;
        };
      })();
    });
    constructor.prototype = $.widget.extend(basePrototype, {
      widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
    }, proxiedPrototype, {
      constructor: constructor,
      namespace: namespace,
      widgetName: name,
      widgetFullName: fullName
    });
    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function(i, child) {
        var childPrototype = child.prototype;
        $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
      });
      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(constructor);
    }
    $.widget.bridge(name, constructor);
  };
  $.widget.extend = function(target) {
    var input = slice.call(arguments, 1),
        inputIndex = 0,
        inputLength = input.length,
        key, value;
    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];
        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          if ($.isPlainObject(value)) {
            target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value);
          } else {
            target[key] = value;
          }
        }
      }
    }
    return target;
  };
  $.widget.bridge = function(name, object) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[name] = function(options) {
      var isMethodCall = typeof options === "string",
          args = slice.call(arguments, 1),
          returnValue = this;
      options = !isMethodCall && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options;
      if (isMethodCall) {
        this.each(function() {
          var methodValue, instance = $.data(this, fullName);
          if (!instance) {
            return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return $.error("no such method '" + options + "' for " + name + " widget instance");
          }
          methodValue = instance[options].apply(instance, args);
          if (methodValue !== instance && methodValue !== undefined) {
            returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
            return false;
          }
        });
      } else {
        this.each(function() {
          var instance = $.data(this, fullName);
          if (instance) {
            instance.option(options || {})._init();
          } else {
            $.data(this, fullName, new object(options, this));
          }
        });
      }
      return returnValue;
    };
  };
  $.Widget = function() {};
  $.Widget._childConstructors = [];
  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      disabled: false,
      create: null
    },
    _createWidget: function(options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.uuid = uuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();
      if (element !== this) {
        $.data(element, this.widgetFullName, this);
        this._on(true, this.element, {
          remove: function(event) {
            if (event.target === element) {
              this.destroy();
            }
          }
        });
        this.document = $(element.style ? element.ownerDocument : element.document || element);
        this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
      }
      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,
    destroy: function() {
      this._destroy();
      this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
      this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: $.noop,
    widget: function() {
      return this.element;
    },
    option: function(key, value) {
      var options = key,
          parts, curOption, i;
      if (arguments.length === 0) {
        return $.widget.extend({}, this.options);
      }
      if (typeof key === "string") {
        options = {};
        parts = key.split(".");
        key = parts.shift();
        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);
          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }
          key = parts.pop();
          if (arguments.length === 1) {
            return curOption[key] === undefined ? null : curOption[key];
          }
          curOption[key] = value;
        } else {
          if (arguments.length === 1) {
            return this.options[key] === undefined ? null : this.options[key];
          }
          options[key] = value;
        }
      }
      this._setOptions(options);
      return this;
    },
    _setOptions: function(options) {
      var key;
      for (key in options) {
        this._setOption(key, options[key]);
      }
      return this;
    },
    _setOption: function(key, value) {
      this.options[key] = value;
      if (key === "disabled") {
        this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !! value).attr("aria-disabled", value);
        this.hoverable.removeClass("ui-state-hover");
        this.focusable.removeClass("ui-state-focus");
      }
      return this;
    },
    enable: function() {
      return this._setOption("disabled", false);
    },
    disable: function() {
      return this._setOption("disabled", true);
    },
    _on: function(suppressDisabledCheck, element, handlers) {
      var delegateElement, instance = this;
      if (typeof suppressDisabledCheck !== "boolean") {
        handlers = element;
        element = suppressDisabledCheck;
        suppressDisabledCheck = false;
      }
      if (!handlers) {
        handlers = element;
        element = this.element;
        delegateElement = this.widget();
      } else {
        element = delegateElement = $(element);
        this.bindings = this.bindings.add(element);
      }
      $.each(handlers, function(event, handler) {
        function handlerProxy() {
          if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
            return;
          }
          return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
        }
        if (typeof handler !== "string") {
          handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
        }
        var match = event.match(/^(\w+)\s*(.*)$/),
            eventName = match[1] + instance.eventNamespace,
            selector = match[2];
        if (selector) {
          delegateElement.delegate(selector, eventName, handlerProxy);
        } else {
          element.bind(eventName, handlerProxy);
        }
      });
    },
    _off: function(element, eventName) {
      eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
      element.unbind(eventName).undelegate(eventName);
    },
    _delay: function(handler, delay) {
      function handlerProxy() {
        return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
      }
      var instance = this;
      return setTimeout(handlerProxy, delay || 0);
    },
    _hoverable: function(element) {
      this.hoverable = this.hoverable.add(element);
      this._on(element, {
        mouseenter: function(event) {
          $(event.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function(event) {
          $(event.currentTarget).removeClass("ui-state-hover");
        }
      });
    },
    _focusable: function(element) {
      this.focusable = this.focusable.add(element);
      this._on(element, {
        focusin: function(event) {
          $(event.currentTarget).addClass("ui-state-focus");
        },
        focusout: function(event) {
          $(event.currentTarget).removeClass("ui-state-focus");
        }
      });
    },
    _trigger: function(type, event, data) {
      var prop, orig, callback = this.options[type];
      data = data || {};
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
      event.target = this.element[0];
      orig = event.originalEvent;
      if (orig) {
        for (prop in orig) {
          if (!(prop in event)) {
            event[prop] = orig[prop];
          }
        }
      }
      this.element.trigger(event, data);
      return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
    }
  };
  $.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function(method, defaultEffect) {
    $.Widget.prototype["_" + method] = function(element, options, callback) {
      if (typeof options === "string") {
        options = {
          effect: options
        };
      }
      var hasOptions, effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
      options = options || {};
      if (typeof options === "number") {
        options = {
          duration: options
        };
      }
      hasOptions = !$.isEmptyObject(options);
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else {
        if (effectName !== method && element[effectName]) {
          element[effectName](options.duration, options.easing, callback);
        } else {
          element.queue(function(next) {
            $(this)[method]();
            if (callback) {
              callback.call(element[0]);
            }
            next();
          });
        }
      }
    };
  });
})(jQuery);
(function($, undefined) {
  var mouseHandled = false;
  $(document).mouseup(function() {
    mouseHandled = false;
  });
  $.widget("ui.mouse", {
    version: "1.10.4",
    options: {
      cancel: "input,textarea,button,select,option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function() {
      var that = this;
      this.element.bind("mousedown." + this.widgetName, function(event) {
        return that._mouseDown(event);
      }).bind("click." + this.widgetName, function(event) {
        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
          $.removeData(event.target, that.widgetName + ".preventClickEvent");
          event.stopImmediatePropagation();
          return false;
        }
      });
      this.started = false;
    },
    _mouseDestroy: function() {
      this.element.unbind("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },
    _mouseDown: function(event) {
      if (mouseHandled) {
        return;
      }(this._mouseStarted && this._mouseUp(event));
      this._mouseDownEvent = event;
      var that = this,
          btnIsLeft = (event.which === 1),
          elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }
      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function() {
          that.mouseDelayMet = true;
        }, this.options.delay);
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = (this._mouseStart(event) !== false);
        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      }
      if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
        $.removeData(event.target, this.widgetName + ".preventClickEvent");
      }
      this._mouseMoveDelegate = function(event) {
        return that._mouseMove(event);
      };
      this._mouseUpDelegate = function(event) {
        return that._mouseUp(event);
      };
      $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
      event.preventDefault();
      mouseHandled = true;
      return true;
    },
    _mouseMove: function(event) {
      if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
        return this._mouseUp(event);
      }
      if (this._mouseStarted) {
        this._mouseDrag(event);
        return event.preventDefault();
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false);
        (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
      }
      return !this._mouseStarted;
    },
    _mouseUp: function(event) {
      $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      if (this._mouseStarted) {
        this._mouseStarted = false;
        if (event.target === this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + ".preventClickEvent", true);
        }
        this._mouseStop(event);
      }
      return false;
    },
    _mouseDistanceMet: function(event) {
      return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
    },
    _mouseDelayMet: function() {
      return this.mouseDelayMet;
    },
    _mouseStart: function() {},
    _mouseDrag: function() {},
    _mouseStop: function() {},
    _mouseCapture: function() {
      return true;
    }
  });
})(jQuery);
(function($, undefined) {
  $.widget("ui.draggable", $.ui.mouse, {
    version: "1.10.4",
    widgetEventPrefix: "drag",
    options: {
      addClasses: true,
      appendTo: "parent",
      axis: false,
      connectToSortable: false,
      containment: false,
      cursor: "auto",
      cursorAt: false,
      grid: false,
      handle: false,
      helper: "original",
      iframeFix: false,
      opacity: false,
      refreshPositions: false,
      revert: false,
      revertDuration: 500,
      scope: "default",
      scroll: true,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      snap: false,
      snapMode: "both",
      snapTolerance: 20,
      stack: false,
      zIndex: false,
      drag: null,
      start: null,
      stop: null
    },
    _create: function() {
      if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
        this.element[0].style.position = "relative";
      }
      if (this.options.addClasses) {
        this.element.addClass("ui-draggable");
      }
      if (this.options.disabled) {
        this.element.addClass("ui-draggable-disabled");
      }
      this._mouseInit();
    },
    _destroy: function() {
      this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
      this._mouseDestroy();
    },
    _mouseCapture: function(event) {
      var o = this.options;
      if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
        return false;
      }
      this.handle = this._getHandle(event);
      if (!this.handle) {
        return false;
      }
      $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
        $("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({
          width: this.offsetWidth + "px",
          height: this.offsetHeight + "px",
          position: "absolute",
          opacity: "0.001",
          zIndex: 1000
        }).css($(this).offset()).appendTo("body");
      });
      return true;
    },
    _mouseStart: function(event) {
      var o = this.options;
      this.helper = this._createHelper(event);
      this.helper.addClass("ui-draggable-dragging");
      this._cacheHelperProportions();
      if ($.ui.ddmanager) {
        $.ui.ddmanager.current = this;
      }
      this._cacheMargins();
      this.cssPosition = this.helper.css("position");
      this.scrollParent = this.helper.scrollParent();
      this.offsetParent = this.helper.offsetParent();
      this.offsetParentCssPosition = this.offsetParent.css("position");
      this.offset = this.positionAbs = this.element.offset();
      this.offset = {
        top: this.offset.top - this.margins.top,
        left: this.offset.left - this.margins.left
      };
      this.offset.scroll = false;
      $.extend(this.offset, {
        click: {
          left: event.pageX - this.offset.left,
          top: event.pageY - this.offset.top
        },
        parent: this._getParentOffset(),
        relative: this._getRelativeOffset()
      });
      this.originalPosition = this.position = this._generatePosition(event);
      this.originalPageX = event.pageX;
      this.originalPageY = event.pageY;
      (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));
      this._setContainment();
      if (this._trigger("start", event) === false) {
        this._clear();
        return false;
      }
      this._cacheHelperProportions();
      if ($.ui.ddmanager && !o.dropBehaviour) {
        $.ui.ddmanager.prepareOffsets(this, event);
      }
      this._mouseDrag(event, true);
      if ($.ui.ddmanager) {
        $.ui.ddmanager.dragStart(this, event);
      }
      return true;
    },
    _mouseDrag: function(event, noPropagation) {
      if (this.offsetParentCssPosition === "fixed") {
        this.offset.parent = this._getParentOffset();
      }
      this.position = this._generatePosition(event);
      this.positionAbs = this._convertPositionTo("absolute");
      if (!noPropagation) {
        var ui = this._uiHash();
        if (this._trigger("drag", event, ui) === false) {
          this._mouseUp({});
          return false;
        }
        this.position = ui.position;
      }
      if (!this.options.axis || this.options.axis !== "y") {
        this.helper[0].style.left = this.position.left + "px";
      }
      if (!this.options.axis || this.options.axis !== "x") {
        this.helper[0].style.top = this.position.top + "px";
      }
      if ($.ui.ddmanager) {
        $.ui.ddmanager.drag(this, event);
      }
      return false;
    },
    _mouseStop: function(event) {
      var that = this,
          dropped = false;
      if ($.ui.ddmanager && !this.options.dropBehaviour) {
        dropped = $.ui.ddmanager.drop(this, event);
      }
      if (this.dropped) {
        dropped = this.dropped;
        this.dropped = false;
      }
      if (this.options.helper === "original" && !$.contains(this.element[0].ownerDocument, this.element[0])) {
        return false;
      }
      if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
        $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
          if (that._trigger("stop", event) !== false) {
            that._clear();
          }
        });
      } else {
        if (this._trigger("stop", event) !== false) {
          this._clear();
        }
      }
      return false;
    },
    _mouseUp: function(event) {
      $("div.ui-draggable-iframeFix").each(function() {
        this.parentNode.removeChild(this);
      });
      if ($.ui.ddmanager) {
        $.ui.ddmanager.dragStop(this, event);
      }
      return $.ui.mouse.prototype._mouseUp.call(this, event);
    },
    cancel: function() {
      if (this.helper.is(".ui-draggable-dragging")) {
        this._mouseUp({});
      } else {
        this._clear();
      }
      return this;
    },
    _getHandle: function(event) {
      return this.options.handle ? !! $(event.target).closest(this.element.find(this.options.handle)).length : true;
    },
    _createHelper: function(event) {
      var o = this.options,
          helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);
      if (!helper.parents("body").length) {
        helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
      }
      if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
        helper.css("position", "absolute");
      }
      return helper;
    },
    _adjustOffsetFromHelper: function(obj) {
      if (typeof obj === "string") {
        obj = obj.split(" ");
      }
      if ($.isArray(obj)) {
        obj = {
          left: +obj[0],
          top: +obj[1] || 0
        };
      }
      if ("left" in obj) {
        this.offset.click.left = obj.left + this.margins.left;
      }
      if ("right" in obj) {
        this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      }
      if ("top" in obj) {
        this.offset.click.top = obj.top + this.margins.top;
      }
      if ("bottom" in obj) {
        this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      }
    },
    _getParentOffset: function() {
      var po = this.offsetParent.offset();
      if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
        po.left += this.scrollParent.scrollLeft();
        po.top += this.scrollParent.scrollTop();
      }
      if ((this.offsetParent[0] === document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
        po = {
          top: 0,
          left: 0
        };
      }
      return {
        top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      };
    },
    _getRelativeOffset: function() {
      if (this.cssPosition === "relative") {
        var p = this.element.position();
        return {
          top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        };
      } else {
        return {
          top: 0,
          left: 0
        };
      }
    },
    _cacheMargins: function() {
      this.margins = {
        left: (parseInt(this.element.css("marginLeft"), 10) || 0),
        top: (parseInt(this.element.css("marginTop"), 10) || 0),
        right: (parseInt(this.element.css("marginRight"), 10) || 0),
        bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
      };
    },
    _cacheHelperProportions: function() {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      };
    },
    _setContainment: function() {
      var over, c, ce, o = this.options;
      if (!o.containment) {
        this.containment = null;
        return;
      }
      if (o.containment === "window") {
        this.containment = [$(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, $(window).scrollLeft() + $(window).width() - this.helperProportions.width - this.margins.left, $(window).scrollTop() + ($(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
        return;
      }
      if (o.containment === "document") {
        this.containment = [0, 0, $(document).width() - this.helperProportions.width - this.margins.left, ($(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
        return;
      }
      if (o.containment.constructor === Array) {
        this.containment = o.containment;
        return;
      }
      if (o.containment === "parent") {
        o.containment = this.helper[0].parentNode;
      }
      c = $(o.containment);
      ce = c[0];
      if (!ce) {
        return;
      }
      over = c.css("overflow") !== "hidden";
      this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
      this.relative_container = c;
    },
    _convertPositionTo: function(d, pos) {
      if (!pos) {
        pos = this.position;
      }
      var mod = d === "absolute" ? 1 : -1,
          scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent;
      if (!this.offset.scroll) {
        this.offset.scroll = {
          top: scroll.scrollTop(),
          left: scroll.scrollLeft()
        };
      }
      return {
        top: (pos.top + this.offset.relative.top * mod + this.offset.parent.top * mod - ((this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top) * mod)),
        left: (pos.left + this.offset.relative.left * mod + this.offset.parent.left * mod - ((this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left) * mod))
      };
    },
    _generatePosition: function(event) {
      var containment, co, top, left, o = this.options,
          scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
          pageX = event.pageX,
          pageY = event.pageY;
      if (!this.offset.scroll) {
        this.offset.scroll = {
          top: scroll.scrollTop(),
          left: scroll.scrollLeft()
        };
      }
      if (this.originalPosition) {
        if (this.containment) {
          if (this.relative_container) {
            co = this.relative_container.offset();
            containment = [this.containment[0] + co.left, this.containment[1] + co.top, this.containment[2] + co.left, this.containment[3] + co.top];
          } else {
            containment = this.containment;
          }
          if (event.pageX - this.offset.click.left < containment[0]) {
            pageX = containment[0] + this.offset.click.left;
          }
          if (event.pageY - this.offset.click.top < containment[1]) {
            pageY = containment[1] + this.offset.click.top;
          }
          if (event.pageX - this.offset.click.left > containment[2]) {
            pageX = containment[2] + this.offset.click.left;
          }
          if (event.pageY - this.offset.click.top > containment[3]) {
            pageY = containment[3] + this.offset.click.top;
          }
        }
        if (o.grid) {
          top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
          pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;
          left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
          pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
        }
      }
      return {
        top: (pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top)),
        left: (pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left))
      };
    },
    _clear: function() {
      this.helper.removeClass("ui-draggable-dragging");
      if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
        this.helper.remove();
      }
      this.helper = null;
      this.cancelHelperRemoval = false;
    },
    _trigger: function(type, event, ui) {
      ui = ui || this._uiHash();
      $.ui.plugin.call(this, type, [event, ui]);
      if (type === "drag") {
        this.positionAbs = this._convertPositionTo("absolute");
      }
      return $.Widget.prototype._trigger.call(this, type, event, ui);
    },
    plugins: {},
    _uiHash: function() {
      return {
        helper: this.helper,
        position: this.position,
        originalPosition: this.originalPosition,
        offset: this.positionAbs
      };
    }
  });
  $.ui.plugin.add("draggable", "connectToSortable", {
    start: function(event, ui) {
      var inst = $(this).data("ui-draggable"),
          o = inst.options,
          uiSortable = $.extend({}, ui, {
          item: inst.element
        });
      inst.sortables = [];
      $(o.connectToSortable).each(function() {
        var sortable = $.data(this, "ui-sortable");
        if (sortable && !sortable.options.disabled) {
          inst.sortables.push({
            instance: sortable,
            shouldRevert: sortable.options.revert
          });
          sortable.refreshPositions();
          sortable._trigger("activate", event, uiSortable);
        }
      });
    },
    stop: function(event, ui) {
      var inst = $(this).data("ui-draggable"),
          uiSortable = $.extend({}, ui, {
          item: inst.element
        });
      $.each(inst.sortables, function() {
        if (this.instance.isOver) {
          this.instance.isOver = 0;
          inst.cancelHelperRemoval = true;
          this.instance.cancelHelperRemoval = false;
          if (this.shouldRevert) {
            this.instance.options.revert = this.shouldRevert;
          }
          this.instance._mouseStop(event);
          this.instance.options.helper = this.instance.options._helper;
          if (inst.options.helper === "original") {
            this.instance.currentItem.css({
              top: "auto",
              left: "auto"
            });
          }
        } else {
          this.instance.cancelHelperRemoval = false;
          this.instance._trigger("deactivate", event, uiSortable);
        }
      });
    },
    drag: function(event, ui) {
      var inst = $(this).data("ui-draggable"),
          that = this;
      $.each(inst.sortables, function() {
        var innermostIntersecting = false,
            thisSortable = this;
        this.instance.positionAbs = inst.positionAbs;
        this.instance.helperProportions = inst.helperProportions;
        this.instance.offset.click = inst.offset.click;
        if (this.instance._intersectsWith(this.instance.containerCache)) {
          innermostIntersecting = true;
          $.each(inst.sortables, function() {
            this.instance.positionAbs = inst.positionAbs;
            this.instance.helperProportions = inst.helperProportions;
            this.instance.offset.click = inst.offset.click;
            if (this !== thisSortable && this.instance._intersectsWith(this.instance.containerCache) && $.contains(thisSortable.instance.element[0], this.instance.element[0])) {
              innermostIntersecting = false;
            }
            return innermostIntersecting;
          });
        }
        if (innermostIntersecting) {
          if (!this.instance.isOver) {
            this.instance.isOver = 1;
            this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
            this.instance.options._helper = this.instance.options.helper;
            this.instance.options.helper = function() {
              return ui.helper[0];
            };
            event.target = this.instance.currentItem[0];
            this.instance._mouseCapture(event, true);
            this.instance._mouseStart(event, true, true);
            this.instance.offset.click.top = inst.offset.click.top;
            this.instance.offset.click.left = inst.offset.click.left;
            this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
            this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;
            inst._trigger("toSortable", event);
            inst.dropped = this.instance.element;
            inst.currentItem = inst.element;
            this.instance.fromOutside = inst;
          }
          if (this.instance.currentItem) {
            this.instance._mouseDrag(event);
          }
        } else {
          if (this.instance.isOver) {
            this.instance.isOver = 0;
            this.instance.cancelHelperRemoval = true;
            this.instance.options.revert = false;
            this.instance._trigger("out", event, this.instance._uiHash(this.instance));
            this.instance._mouseStop(event, true);
            this.instance.options.helper = this.instance.options._helper;
            this.instance.currentItem.remove();
            if (this.instance.placeholder) {
              this.instance.placeholder.remove();
            }
            inst._trigger("fromSortable", event);
            inst.dropped = false;
          }
        }
      });
    }
  });
  $.ui.plugin.add("draggable", "cursor", {
    start: function() {
      var t = $("body"),
          o = $(this).data("ui-draggable").options;
      if (t.css("cursor")) {
        o._cursor = t.css("cursor");
      }
      t.css("cursor", o.cursor);
    },
    stop: function() {
      var o = $(this).data("ui-draggable").options;
      if (o._cursor) {
        $("body").css("cursor", o._cursor);
      }
    }
  });
  $.ui.plugin.add("draggable", "opacity", {
    start: function(event, ui) {
      var t = $(ui.helper),
          o = $(this).data("ui-draggable").options;
      if (t.css("opacity")) {
        o._opacity = t.css("opacity");
      }
      t.css("opacity", o.opacity);
    },
    stop: function(event, ui) {
      var o = $(this).data("ui-draggable").options;
      if (o._opacity) {
        $(ui.helper).css("opacity", o._opacity);
      }
    }
  });
  $.ui.plugin.add("draggable", "scroll", {
    start: function() {
      var i = $(this).data("ui-draggable");
      if (i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
        i.overflowOffset = i.scrollParent.offset();
      }
    },
    drag: function(event) {
      var i = $(this).data("ui-draggable"),
          o = i.options,
          scrolled = false;
      if (i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
        if (!o.axis || o.axis !== "x") {
          if ((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
            i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
          } else {
            if (event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
              i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
            }
          }
        }
        if (!o.axis || o.axis !== "y") {
          if ((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
            i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
          } else {
            if (event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
              i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
            }
          }
        }
      } else {
        if (!o.axis || o.axis !== "x") {
          if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
            scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
          } else {
            if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
              scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
            }
          }
        }
        if (!o.axis || o.axis !== "y") {
          if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
            scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
          } else {
            if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
              scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
            }
          }
        }
      }
      if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
        $.ui.ddmanager.prepareOffsets(i, event);
      }
    }
  });
  $.ui.plugin.add("draggable", "snap", {
    start: function() {
      var i = $(this).data("ui-draggable"),
          o = i.options;
      i.snapElements = [];
      $(o.snap.constructor !== String ? (o.snap.items || ":data(ui-draggable)") : o.snap).each(function() {
        var $t = $(this),
            $o = $t.offset();
        if (this !== i.element[0]) {
          i.snapElements.push({
            item: this,
            width: $t.outerWidth(),
            height: $t.outerHeight(),
            top: $o.top,
            left: $o.left
          });
        }
      });
    },
    drag: function(event, ui) {
      var ts, bs, ls, rs, l, r, t, b, i, first, inst = $(this).data("ui-draggable"),
          o = inst.options,
          d = o.snapTolerance,
          x1 = ui.offset.left,
          x2 = x1 + inst.helperProportions.width,
          y1 = ui.offset.top,
          y2 = y1 + inst.helperProportions.height;
      for (i = inst.snapElements.length - 1; i >= 0; i--) {
        l = inst.snapElements[i].left;
        r = l + inst.snapElements[i].width;
        t = inst.snapElements[i].top;
        b = t + inst.snapElements[i].height;
        if (x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains(inst.snapElements[i].item.ownerDocument, inst.snapElements[i].item)) {
          if (inst.snapElements[i].snapping) {
            (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), {
              snapItem: inst.snapElements[i].item
            })));
          }
          inst.snapElements[i].snapping = false;
          continue;
        }
        if (o.snapMode !== "inner") {
          ts = Math.abs(t - y2) <= d;
          bs = Math.abs(b - y1) <= d;
          ls = Math.abs(l - x2) <= d;
          rs = Math.abs(r - x1) <= d;
          if (ts) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: t - inst.helperProportions.height,
              left: 0
            }).top - inst.margins.top;
          }
          if (bs) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: b,
              left: 0
            }).top - inst.margins.top;
          }
          if (ls) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: l - inst.helperProportions.width
            }).left - inst.margins.left;
          }
          if (rs) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: r
            }).left - inst.margins.left;
          }
        }
        first = (ts || bs || ls || rs);
        if (o.snapMode !== "outer") {
          ts = Math.abs(t - y1) <= d;
          bs = Math.abs(b - y2) <= d;
          ls = Math.abs(l - x1) <= d;
          rs = Math.abs(r - x2) <= d;
          if (ts) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: t,
              left: 0
            }).top - inst.margins.top;
          }
          if (bs) {
            ui.position.top = inst._convertPositionTo("relative", {
              top: b - inst.helperProportions.height,
              left: 0
            }).top - inst.margins.top;
          }
          if (ls) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: l
            }).left - inst.margins.left;
          }
          if (rs) {
            ui.position.left = inst._convertPositionTo("relative", {
              top: 0,
              left: r - inst.helperProportions.width
            }).left - inst.margins.left;
          }
        }
        if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
          (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
            snapItem: inst.snapElements[i].item
          })));
        }
        inst.snapElements[i].snapping = (ts || bs || ls || rs || first);
      }
    }
  });
  $.ui.plugin.add("draggable", "stack", {
    start: function() {
      var min, o = this.data("ui-draggable").options,
          group = $.makeArray($(o.stack)).sort(function(a, b) {
          return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
        });
      if (!group.length) {
        return;
      }
      min = parseInt($(group[0]).css("zIndex"), 10) || 0;
      $(group).each(function(i) {
        $(this).css("zIndex", min + i);
      });
      this.css("zIndex", (min + group.length));
    }
  });
  $.ui.plugin.add("draggable", "zIndex", {
    start: function(event, ui) {
      var t = $(ui.helper),
          o = $(this).data("ui-draggable").options;
      if (t.css("zIndex")) {
        o._zIndex = t.css("zIndex");
      }
      t.css("zIndex", o.zIndex);
    },
    stop: function(event, ui) {
      var o = $(this).data("ui-draggable").options;
      if (o._zIndex) {
        $(ui.helper).css("zIndex", o._zIndex);
      }
    }
  });
})(jQuery);
(function($, undefined) {
  $.widget("ui.sortable", $.ui.mouse, {
    widgetEventPrefix: "sort",
    options: {
      appendTo: "parent",
      axis: false,
      connectWith: false,
      containment: false,
      cursor: "auto",
      cursorAt: false,
      dropOnEmpty: true,
      forcePlaceholderSize: false,
      forceHelperSize: false,
      grid: false,
      handle: false,
      helper: "original",
      items: "> *",
      opacity: false,
      placeholder: false,
      revert: false,
      scroll: true,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      scope: "default",
      tolerance: "intersect",
      zIndex: 1000
    },
    _create: function() {
      var o = this.options;
      this.containerCache = {};
      this.element.addClass("ui-sortable");
      this.refresh();
      this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css("float")) : false;
      this.offset = this.element.offset();
      this._mouseInit();
    },
    destroy: function() {
      this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
      this._mouseDestroy();
      for (var i = this.items.length - 1; i >= 0; i--) {
        this.items[i].item.removeData("sortable-item");
      }
      return this;
    },
    _setOption: function(key, value) {
      if (key === "disabled") {
        this.options[key] = value;
        this.widget()[value ? "addClass" : "removeClass"]("ui-sortable-disabled");
      } else {
        $.Widget.prototype._setOption.apply(this, arguments);
      }
    },
    _mouseCapture: function(event, overrideHandle) {
      if (this.reverting) {
        return false;
      }
      if (this.options.disabled || this.options.type == "static") {
        return false;
      }
      this._refreshItems(event);
      var currentItem = null,
          self = this,
          nodes = $(event.target).parents().each(function() {
          if ($.data(this, "sortable-item") == self) {
            currentItem = $(this);
            return false;
          }
        });
      if ($.data(event.target, "sortable-item") == self) {
        currentItem = $(event.target);
      }
      if (!currentItem) {
        return false;
      }
      if (this.options.handle && !overrideHandle) {
        var validHandle = false;
        $(this.options.handle, currentItem).find("*").andSelf().each(function() {
          if (this == event.target) {
            validHandle = true;
          }
        });
        if (!validHandle) {
          return false;
        }
      }
      this.currentItem = currentItem;
      this._removeCurrentsFromItems();
      return true;
    },
    _mouseStart: function(event, overrideHandle, noActivation) {
      var o = this.options,
          self = this;
      this.currentContainer = this;
      this.refreshPositions();
      this.helper = this._createHelper(event);
      this._cacheHelperProportions();
      this._cacheMargins();
      this.scrollParent = this.helper.scrollParent();
      this.offset = this.currentItem.offset();
      this.offset = {
        top: this.offset.top - this.margins.top,
        left: this.offset.left - this.margins.left
      };
      this.helper.css("position", "absolute");
      this.cssPosition = this.helper.css("position");
      $.extend(this.offset, {
        click: {
          left: event.pageX - this.offset.left,
          top: event.pageY - this.offset.top
        },
        parent: this._getParentOffset(),
        relative: this._getRelativeOffset()
      });
      this.originalPosition = this._generatePosition(event);
      this.originalPageX = event.pageX;
      this.originalPageY = event.pageY;
      (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));
      this.domPosition = {
        prev: this.currentItem.prev()[0],
        parent: this.currentItem.parent()[0]
      };
      if (this.helper[0] != this.currentItem[0]) {
        this.currentItem.hide();
      }
      this._createPlaceholder();
      if (o.containment) {
        this._setContainment();
      }
      if (o.cursor) {
        if ($("body").css("cursor")) {
          this._storedCursor = $("body").css("cursor");
        }
        $("body").css("cursor", o.cursor);
      }
      if (o.opacity) {
        if (this.helper.css("opacity")) {
          this._storedOpacity = this.helper.css("opacity");
        }
        this.helper.css("opacity", o.opacity);
      }
      if (o.zIndex) {
        if (this.helper.css("zIndex")) {
          this._storedZIndex = this.helper.css("zIndex");
        }
        this.helper.css("zIndex", o.zIndex);
      }
      if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
        this.overflowOffset = this.scrollParent.offset();
      }
      this._trigger("start", event, this._uiHash());
      if (!this._preserveHelperProportions) {
        this._cacheHelperProportions();
      }
      if (!noActivation) {
        for (var i = this.containers.length - 1; i >= 0; i--) {
          this.containers[i]._trigger("activate", event, self._uiHash(this));
        }
      }
      if ($.ui.ddmanager) {
        $.ui.ddmanager.current = this;
      }
      if ($.ui.ddmanager && !o.dropBehaviour) {
        $.ui.ddmanager.prepareOffsets(this, event);
      }
      this.dragging = true;
      this.helper.addClass("ui-sortable-helper");
      this._mouseDrag(event);
      return true;
    },
    _mouseDrag: function(event) {
      this.position = this._generatePosition(event);
      this.positionAbs = this._convertPositionTo("absolute");
      if (!this.lastPositionAbs) {
        this.lastPositionAbs = this.positionAbs;
      }
      if (this.options.scroll) {
        var o = this.options,
            scrolled = false;
        if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
          if ((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
          } else {
            if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
              this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
            }
          }
          if ((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
          } else {
            if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
              this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
            }
          }
        } else {
          if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
            scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
          } else {
            if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
              scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
            }
          }
          if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
            scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
          } else {
            if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
              scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
            }
          }
        }
        if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
          $.ui.ddmanager.prepareOffsets(this, event);
        }
      }
      this.positionAbs = this._convertPositionTo("absolute");
      if (!this.options.axis || this.options.axis != "y") {
        this.helper[0].style.left = this.position.left + "px";
      }
      if (!this.options.axis || this.options.axis != "x") {
        this.helper[0].style.top = this.position.top + "px";
      }
      for (var i = this.items.length - 1; i >= 0; i--) {
        var item = this.items[i],
            itemElement = item.item[0],
            intersection = this._intersectsWithPointer(item);
        if (!intersection) {
          continue;
        }
        if (itemElement != this.currentItem[0] && this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement && !$.ui.contains(this.placeholder[0], itemElement) && (this.options.type == "semi-dynamic" ? !$.ui.contains(this.element[0], itemElement) : true)) {
          this.direction = intersection == 1 ? "down" : "up";
          if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
            this._rearrange(event, item);
          } else {
            break;
          }
          this._trigger("change", event, this._uiHash());
          break;
        }
      }
      this._contactContainers(event);
      if ($.ui.ddmanager) {
        $.ui.ddmanager.drag(this, event);
      }
      this._trigger("sort", event, this._uiHash());
      this.lastPositionAbs = this.positionAbs;
      return false;
    },
    _mouseStop: function(event, noPropagation) {
      if (!event) {
        return;
      }
      if ($.ui.ddmanager && !this.options.dropBehaviour) {
        $.ui.ddmanager.drop(this, event);
      }
      if (this.options.revert) {
        var self = this;
        var cur = self.placeholder.offset();
        self.reverting = true;
        $(this.helper).animate({
          left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
          top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
        }, parseInt(this.options.revert, 10) || 500, function() {
          self._clear(event);
        });
      } else {
        this._clear(event, noPropagation);
      }
      return false;
    },
    cancel: function() {
      var self = this;
      if (this.dragging) {
        this._mouseUp();
        if (this.options.helper == "original") {
          this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
        } else {
          this.currentItem.show();
        }
        for (var i = this.containers.length - 1; i >= 0; i--) {
          this.containers[i]._trigger("deactivate", null, self._uiHash(this));
          if (this.containers[i].containerCache.over) {
            this.containers[i]._trigger("out", null, self._uiHash(this));
            this.containers[i].containerCache.over = 0;
          }
        }
      }
      if (this.placeholder[0].parentNode) {
        this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
      }
      if (this.options.helper != "original" && this.helper && this.helper[0].parentNode) {
        this.helper.remove();
      }
      $.extend(this, {
        helper: null,
        dragging: false,
        reverting: false,
        _noFinalSort: null
      });
      if (this.domPosition.prev) {
        $(this.domPosition.prev).after(this.currentItem);
      } else {
        $(this.domPosition.parent).prepend(this.currentItem);
      }
      return this;
    },
    serialize: function(o) {
      var items = this._getItemsAsjQuery(o && o.connected);
      var str = [];
      o = o || {};
      $(items).each(function() {
        var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[-=_](.+)/));
        if (res) {
          str.push((o.key || res[1] + "[]") + "=" + (o.key && o.expression ? res[1] : res[2]));
        }
      });
      if (!str.length && o.key) {
        str.push(o.key + "=");
      }
      return str.join("&");
    },
    toArray: function(o) {
      var items = this._getItemsAsjQuery(o && o.connected);
      var ret = [];
      o = o || {};
      items.each(function() {
        ret.push($(o.item || this).attr(o.attribute || "id") || "");
      });
      return ret;
    },
    _intersectsWith: function(item) {
      var x1 = this.positionAbs.left,
          x2 = x1 + this.helperProportions.width,
          y1 = this.positionAbs.top,
          y2 = y1 + this.helperProportions.height;
      var l = item.left,
          r = l + item.width,
          t = item.top,
          b = t + item.height;
      var dyClick = this.offset.click.top,
          dxClick = this.offset.click.left;
      var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;
      if (this.options.tolerance == "pointer" || this.options.forcePointerForContainers || (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])) {
        return isOverElement;
      } else {
        return (l < x1 + (this.helperProportions.width / 2) && x2 - (this.helperProportions.width / 2) < r && t < y1 + (this.helperProportions.height / 2) && y2 - (this.helperProportions.height / 2) < b);
      }
    },
    _intersectsWithPointer: function(item) {
      var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
          isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
          isOverElement = isOverElementHeight && isOverElementWidth,
          verticalDirection = this._getDragVerticalDirection(),
          horizontalDirection = this._getDragHorizontalDirection();
      if (!isOverElement) {
        return false;
      }
      return this.floating ? (((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1) : (verticalDirection && (verticalDirection == "down" ? 2 : 1));
    },
    _intersectsWithSides: function(item) {
      var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height / 2), item.height),
          isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width / 2), item.width),
          verticalDirection = this._getDragVerticalDirection(),
          horizontalDirection = this._getDragHorizontalDirection();
      if (this.floating && horizontalDirection) {
        return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
      } else {
        return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
      }
    },
    _getDragVerticalDirection: function() {
      var delta = this.positionAbs.top - this.lastPositionAbs.top;
      return delta != 0 && (delta > 0 ? "down" : "up");
    },
    _getDragHorizontalDirection: function() {
      var delta = this.positionAbs.left - this.lastPositionAbs.left;
      return delta != 0 && (delta > 0 ? "right" : "left");
    },
    refresh: function(event) {
      this._refreshItems(event);
      this.refreshPositions();
      return this;
    },
    _connectWith: function() {
      var options = this.options;
      return options.connectWith.constructor == String ? [options.connectWith] : options.connectWith;
    },
    _getItemsAsjQuery: function(connected) {
      var self = this;
      var items = [];
      var queries = [];
      var connectWith = this._connectWith();
      if (connectWith && connected) {
        for (var i = connectWith.length - 1; i >= 0; i--) {
          var cur = $(connectWith[i]);
          for (var j = cur.length - 1; j >= 0; j--) {
            var inst = $.data(cur[j], "sortable");
            if (inst && inst != this && !inst.options.disabled) {
              queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
            }
          }
        }
      }
      queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
        options: this.options,
        item: this.currentItem
      }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
      for (var i = queries.length - 1; i >= 0; i--) {
        queries[i][0].each(function() {
          items.push(this);
        });
      }
      return $(items);
    },
    _removeCurrentsFromItems: function() {
      var list = this.currentItem.find(":data(sortable-item)");
      for (var i = 0; i < this.items.length; i++) {
        for (var j = 0; j < list.length; j++) {
          if (list[j] == this.items[i].item[0]) {
            this.items.splice(i, 1);
          }
        }
      }
    },
    _refreshItems: function(event) {
      this.items = [];
      this.containers = [this];
      var items = this.items;
      var self = this;
      var queries = [
        [$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, {
          item: this.currentItem
        }) : $(this.options.items, this.element), this]
      ];
      var connectWith = this._connectWith();
      if (connectWith) {
        for (var i = connectWith.length - 1; i >= 0; i--) {
          var cur = $(connectWith[i]);
          for (var j = cur.length - 1; j >= 0; j--) {
            var inst = $.data(cur[j], "sortable");
            if (inst && inst != this && !inst.options.disabled) {
              queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, {
                item: this.currentItem
              }) : $(inst.options.items, inst.element), inst]);
              this.containers.push(inst);
            }
          }
        }
      }
      for (var i = queries.length - 1; i >= 0; i--) {
        var targetData = queries[i][1];
        var _queries = queries[i][0];
        for (var j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
          var item = $(_queries[j]);
          item.data("sortable-item", targetData);
          items.push({
            item: item,
            instance: targetData,
            width: 0,
            height: 0,
            left: 0,
            top: 0
          });
        }
      }
    },
    refreshPositions: function(fast) {
      if (this.offsetParent && this.helper) {
        this.offset.parent = this._getParentOffset();
      }
      for (var i = this.items.length - 1; i >= 0; i--) {
        var item = this.items[i];
        var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;
        if (!fast) {
          item.width = t.outerWidth();
          item.height = t.outerHeight();
        }
        var p = t.offset();
        item.left = p.left;
        item.top = p.top;
      }
      if (this.options.custom && this.options.custom.refreshContainers) {
        this.options.custom.refreshContainers.call(this);
      } else {
        for (var i = this.containers.length - 1; i >= 0; i--) {
          var p = this.containers[i].element.offset();
          this.containers[i].containerCache.left = p.left;
          this.containers[i].containerCache.top = p.top;
          this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
          this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
        }
      }
      return this;
    },
    _createPlaceholder: function(that) {
      var self = that || this,
          o = self.options;
      if (!o.placeholder || o.placeholder.constructor == String) {
        var className = o.placeholder;
        o.placeholder = {
          element: function() {
            var el = $(document.createElement(self.currentItem[0].nodeName)).addClass(className || self.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
            if (!className) {
              el.style.visibility = "hidden";
            }
            return el;
          },
          update: function(container, p) {
            if (className && !o.forcePlaceholderSize) {
              return;
            }
            if (!p.height()) {
              p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css("paddingTop") || 0, 10) - parseInt(self.currentItem.css("paddingBottom") || 0, 10));
            }
            if (!p.width()) {
              p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css("paddingLeft") || 0, 10) - parseInt(self.currentItem.css("paddingRight") || 0, 10));
            }
          }
        };
      }
      self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));
      self.currentItem.after(self.placeholder);
      o.placeholder.update(self, self.placeholder);
    },
    _contactContainers: function(event) {
      var innermostContainer = null,
          innermostIndex = null;
      for (var i = this.containers.length - 1; i >= 0; i--) {
        if ($.ui.contains(this.currentItem[0], this.containers[i].element[0])) {
          continue;
        }
        if (this._intersectsWith(this.containers[i].containerCache)) {
          if (innermostContainer && $.ui.contains(this.containers[i].element[0], innermostContainer.element[0])) {
            continue;
          }
          innermostContainer = this.containers[i];
          innermostIndex = i;
        } else {
          if (this.containers[i].containerCache.over) {
            this.containers[i]._trigger("out", event, this._uiHash(this));
            this.containers[i].containerCache.over = 0;
          }
        }
      }
      if (!innermostContainer) {
        return;
      }
      if (this.containers.length === 1) {
        this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
        this.containers[innermostIndex].containerCache.over = 1;
      } else {
        if (this.currentContainer != this.containers[innermostIndex]) {
          var dist = 10000;
          var itemWithLeastDistance = null;
          var base = this.positionAbs[this.containers[innermostIndex].floating ? "left" : "top"];
          for (var j = this.items.length - 1; j >= 0; j--) {
            if (!$.ui.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
              continue;
            }
            var cur = this.items[j][this.containers[innermostIndex].floating ? "left" : "top"];
            if (Math.abs(cur - base) < dist) {
              dist = Math.abs(cur - base);
              itemWithLeastDistance = this.items[j];
            }
          }
          if (!itemWithLeastDistance && !this.options.dropOnEmpty) {
            return;
          }
          this.currentContainer = this.containers[innermostIndex];
          itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
          this._trigger("change", event, this._uiHash());
          this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
          this.options.placeholder.update(this.currentContainer, this.placeholder);
          this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
          this.containers[innermostIndex].containerCache.over = 1;
        }
      }
    },
    _createHelper: function(event) {
      var o = this.options;
      var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == "clone" ? this.currentItem.clone() : this.currentItem);
      if (!helper.parents("body").length) {
        $(o.appendTo != "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
      }
      if (helper[0] == this.currentItem[0]) {
        this._storedCSS = {
          width: this.currentItem[0].style.width,
          height: this.currentItem[0].style.height,
          position: this.currentItem.css("position"),
          top: this.currentItem.css("top"),
          left: this.currentItem.css("left")
        };
      }
      if (helper[0].style.width == "" || o.forceHelperSize) {
        helper.width(this.currentItem.width());
      }
      if (helper[0].style.height == "" || o.forceHelperSize) {
        helper.height(this.currentItem.height());
      }
      return helper;
    },
    _adjustOffsetFromHelper: function(obj) {
      if (typeof obj == "string") {
        obj = obj.split(" ");
      }
      if ($.isArray(obj)) {
        obj = {
          left: +obj[0],
          top: +obj[1] || 0
        };
      }
      if ("left" in obj) {
        this.offset.click.left = obj.left + this.margins.left;
      }
      if ("right" in obj) {
        this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      }
      if ("top" in obj) {
        this.offset.click.top = obj.top + this.margins.top;
      }
      if ("bottom" in obj) {
        this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      }
    },
    _getParentOffset: function() {
      this.offsetParent = this.helper.offsetParent();
      var po = this.offsetParent.offset();
      if (this.cssPosition == "absolute" && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
        po.left += this.scrollParent.scrollLeft();
        po.top += this.scrollParent.scrollTop();
      }
      if ((this.offsetParent[0] == document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && $.browser.msie)) {
        po = {
          top: 0,
          left: 0
        };
      }
      return {
        top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      };
    },
    _getRelativeOffset: function() {
      if (this.cssPosition == "relative") {
        var p = this.currentItem.position();
        return {
          top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        };
      } else {
        return {
          top: 0,
          left: 0
        };
      }
    },
    _cacheMargins: function() {
      this.margins = {
        left: (parseInt(this.currentItem.css("marginLeft"), 10) || 0),
        top: (parseInt(this.currentItem.css("marginTop"), 10) || 0)
      };
    },
    _cacheHelperProportions: function() {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      };
    },
    _setContainment: function() {
      var o = this.options;
      if (o.containment == "parent") {
        o.containment = this.helper[0].parentNode;
      }
      if (o.containment == "document" || o.containment == "window") {
        this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, $(o.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, ($(o.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
      }
      if (!(/^(document|window|parent)$/).test(o.containment)) {
        var ce = $(o.containment)[0];
        var co = $(o.containment).offset();
        var over = ($(ce).css("overflow") != "hidden");
        this.containment = [co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
      }
    },
    _convertPositionTo: function(d, pos) {
      if (!pos) {
        pos = this.position;
      }
      var mod = d == "absolute" ? 1 : -1;
      var o = this.options,
          scroll = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
          scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
      return {
        top: (pos.top + this.offset.relative.top * mod + this.offset.parent.top * mod - ($.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)),
        left: (pos.left + this.offset.relative.left * mod + this.offset.parent.left * mod - ($.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod))
      };
    },
    _generatePosition: function(event) {
      var o = this.options,
          scroll = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
          scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
      if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
        this.offset.relative = this._getRelativeOffset();
      }
      var pageX = event.pageX;
      var pageY = event.pageY;
      if (this.originalPosition) {
        if (this.containment) {
          if (event.pageX - this.offset.click.left < this.containment[0]) {
            pageX = this.containment[0] + this.offset.click.left;
          }
          if (event.pageY - this.offset.click.top < this.containment[1]) {
            pageY = this.containment[1] + this.offset.click.top;
          }
          if (event.pageX - this.offset.click.left > this.containment[2]) {
            pageX = this.containment[2] + this.offset.click.left;
          }
          if (event.pageY - this.offset.click.top > this.containment[3]) {
            pageY = this.containment[3] + this.offset.click.top;
          }
        }
        if (o.grid) {
          var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
          pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;
          var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
          pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
        }
      }
      return {
        top: (pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ($.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))),
        left: (pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ($.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())))
      };
    },
    _rearrange: function(event, i, a, hardRefresh) {
      a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == "down" ? i.item[0] : i.item[0].nextSibling));
      this.counter = this.counter ? ++this.counter : 1;
      var self = this,
          counter = this.counter;
      window.setTimeout(function() {
        if (counter == self.counter) {
          self.refreshPositions(!hardRefresh);
        }
      }, 0);
    },
    _clear: function(event, noPropagation) {
      this.reverting = false;
      var delayedTriggers = [],
          self = this;
      if (!this._noFinalSort && this.currentItem[0].parentNode) {
        this.placeholder.before(this.currentItem);
      }
      this._noFinalSort = null;
      if (this.helper[0] == this.currentItem[0]) {
        for (var i in this._storedCSS) {
          if (this._storedCSS[i] == "auto" || this._storedCSS[i] == "static") {
            this._storedCSS[i] = "";
          }
        }
        this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
      } else {
        this.currentItem.show();
      }
      if (this.fromOutside && !noPropagation) {
        delayedTriggers.push(function(event) {
          this._trigger("receive", event, this._uiHash(this.fromOutside));
        });
      }
      if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) {
        delayedTriggers.push(function(event) {
          this._trigger("update", event, this._uiHash());
        });
      }
      if (!$.ui.contains(this.element[0], this.currentItem[0])) {
        if (!noPropagation) {
          delayedTriggers.push(function(event) {
            this._trigger("remove", event, this._uiHash());
          });
        }
        for (var i = this.containers.length - 1; i >= 0; i--) {
          if ($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
            delayedTriggers.push((function(c) {
              return function(event) {
                c._trigger("receive", event, this._uiHash(this));
              };
            }).call(this, this.containers[i]));
            delayedTriggers.push((function(c) {
              return function(event) {
                c._trigger("update", event, this._uiHash(this));
              };
            }).call(this, this.containers[i]));
          }
        }
      }
      for (var i = this.containers.length - 1; i >= 0; i--) {
        if (!noPropagation) {
          delayedTriggers.push((function(c) {
            return function(event) {
              c._trigger("deactivate", event, this._uiHash(this));
            };
          }).call(this, this.containers[i]));
        }
        if (this.containers[i].containerCache.over) {
          delayedTriggers.push((function(c) {
            return function(event) {
              c._trigger("out", event, this._uiHash(this));
            };
          }).call(this, this.containers[i]));
          this.containers[i].containerCache.over = 0;
        }
      }
      if (this._storedCursor) {
        $("body").css("cursor", this._storedCursor);
      }
      if (this._storedOpacity) {
        this.helper.css("opacity", this._storedOpacity);
      }
      if (this._storedZIndex) {
        this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex);
      }
      this.dragging = false;
      if (this.cancelHelperRemoval) {
        if (!noPropagation) {
          this._trigger("beforeStop", event, this._uiHash());
          for (var i = 0; i < delayedTriggers.length; i++) {
            delayedTriggers[i].call(this, event);
          }
          this._trigger("stop", event, this._uiHash());
        }
        return false;
      }
      if (!noPropagation) {
        this._trigger("beforeStop", event, this._uiHash());
      }
      this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
      if (this.helper[0] != this.currentItem[0]) {
        this.helper.remove();
      }
      this.helper = null;
      if (!noPropagation) {
        for (var i = 0; i < delayedTriggers.length; i++) {
          delayedTriggers[i].call(this, event);
        }
        this._trigger("stop", event, this._uiHash());
      }
      this.fromOutside = false;
      return true;
    },
    _trigger: function() {
      if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
        this.cancel();
      }
    },
    _uiHash: function(inst) {
      var self = inst || this;
      return {
        helper: self.helper,
        placeholder: self.placeholder || $([]),
        position: self.position,
        originalPosition: self.originalPosition,
        offset: self.positionAbs,
        item: self.currentItem,
        sender: inst ? inst.element : null
      };
    }
  });
  $.extend($.ui.sortable, {
    version: "1.8.6"
  });
})(jQuery);
jQuery.effects || (function($, undefined) {
  $.effects = {};
  $.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function(i, attr) {
    $.fx.step[attr] = function(fx) {
      if (!fx.colorInit) {
        fx.start = getColor(fx.elem, attr);
        fx.end = getRGB(fx.end);
        fx.colorInit = true;
      }
      fx.elem.style[attr] = "rgb(" + Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ")";
    };
  });

  function getRGB(color) {
    var result;
    if (color && color.constructor == Array && color.length == 3) {
      return color;
    }
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
      return [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10)];
    }
    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) {
      return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
    }
    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) {
      return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) {
      return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
    }
    if (result = /rgba\(0, 0, 0, 0\)/.exec(color)) {
      return colors["transparent"];
    }
    return colors[$.trim(color).toLowerCase()];
  }
  function getColor(elem, attr) {
    var color;
    do {
      color = $.curCSS(elem, attr);
      if (color != "" && color != "transparent" || $.nodeName(elem, "body")) {
        break;
      }
      attr = "backgroundColor";
    } while (elem = elem.parentNode);
    return getRGB(color);
  }
  var colors = {
    aqua: [0, 255, 255],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    black: [0, 0, 0],
    blue: [0, 0, 255],
    brown: [165, 42, 42],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgrey: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkviolet: [148, 0, 211],
    fuchsia: [255, 0, 255],
    gold: [255, 215, 0],
    green: [0, 128, 0],
    indigo: [75, 0, 130],
    khaki: [240, 230, 140],
    lightblue: [173, 216, 230],
    lightcyan: [224, 255, 255],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    navy: [0, 0, 128],
    olive: [128, 128, 0],
    orange: [255, 165, 0],
    pink: [255, 192, 203],
    purple: [128, 0, 128],
    violet: [128, 0, 128],
    red: [255, 0, 0],
    silver: [192, 192, 192],
    white: [255, 255, 255],
    yellow: [255, 255, 0],
    transparent: [255, 255, 255]
  };
  var classAnimationActions = ["add", "remove", "toggle"],
      shorthandStyles = {
      border: 1,
      borderBottom: 1,
      borderColor: 1,
      borderLeft: 1,
      borderRight: 1,
      borderTop: 1,
      borderWidth: 1,
      margin: 1,
      padding: 1
      };

  function getElementStyles() {
    var style = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
        newStyle = {},
        key, camelCase;
    if (style && style.length && style[0] && style[style[0]]) {
      var len = style.length;
      while (len--) {
        key = style[len];
        if (typeof style[key] == "string") {
          camelCase = key.replace(/\-(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
          newStyle[camelCase] = style[key];
        }
      }
    } else {
      for (key in style) {
        if (typeof style[key] === "string") {
          newStyle[key] = style[key];
        }
      }
    }
    return newStyle;
  }
  function filterStyles(styles) {
    var name, value;
    for (name in styles) {
      value = styles[name];
      if (value == null || $.isFunction(value) || name in shorthandStyles || (/scrollbar/).test(name) || (!(/color/i).test(name) && isNaN(parseFloat(value)))) {
        delete styles[name];
      }
    }
    return styles;
  }
  function styleDifference(oldStyle, newStyle) {
    var diff = {
      _: 0
    },
        name;
    for (name in newStyle) {
      if (oldStyle[name] != newStyle[name]) {
        diff[name] = newStyle[name];
      }
    }
    return diff;
  }
  $.effects.animateClass = function(value, duration, easing, callback) {
    if ($.isFunction(easing)) {
      callback = easing;
      easing = null;
    }
    return this.each(function() {
      $.queue(this, "fx", function() {
        var that = $(this),
            originalStyleAttr = that.attr("style") || " ",
            originalStyle = filterStyles(getElementStyles.call(this)),
            newStyle, className = that.attr("className");
        $.each(classAnimationActions, function(i, action) {
          if (value[action]) {
            that[action + "Class"](value[action]);
          }
        });
        newStyle = filterStyles(getElementStyles.call(this));
        that.attr("className", className);
        that.animate(styleDifference(originalStyle, newStyle), duration, easing, function() {
          $.each(classAnimationActions, function(i, action) {
            if (value[action]) {
              that[action + "Class"](value[action]);
            }
          });
          if (typeof that.attr("style") == "object") {
            that.attr("style").cssText = "";
            that.attr("style").cssText = originalStyleAttr;
          } else {
            that.attr("style", originalStyleAttr);
          }
          if (callback) {
            callback.apply(this, arguments);
          }
        });
        var queue = $.queue(this),
            anim = queue.splice(queue.length - 1, 1)[0];
        queue.splice(1, 0, anim);
        $.dequeue(this);
      });
    });
  };
  $.fn.extend({
    _addClass: $.fn.addClass,
    addClass: function(classNames, speed, easing, callback) {
      return speed ? $.effects.animateClass.apply(this, [{
        add: classNames
      },
      speed, easing, callback]) : this._addClass(classNames);
    },
    _removeClass: $.fn.removeClass,
    removeClass: function(classNames, speed, easing, callback) {
      return speed ? $.effects.animateClass.apply(this, [{
        remove: classNames
      },
      speed, easing, callback]) : this._removeClass(classNames);
    },
    _toggleClass: $.fn.toggleClass,
    toggleClass: function(classNames, force, speed, easing, callback) {
      if (typeof force == "boolean" || force === undefined) {
        if (!speed) {
          return this._toggleClass(classNames, force);
        } else {
          return $.effects.animateClass.apply(this, [(force ? {
            add: classNames
          } : {
            remove: classNames
          }), speed, easing, callback]);
        }
      } else {
        return $.effects.animateClass.apply(this, [{
          toggle: classNames
        },
        force, speed, easing]);
      }
    },
    switchClass: function(remove, add, speed, easing, callback) {
      return $.effects.animateClass.apply(this, [{
        add: add,
        remove: remove
      },
      speed, easing, callback]);
    }
  });
  $.extend($.effects, {
    version: "1.8.7",
    save: function(element, set) {
      for (var i = 0; i < set.length; i++) {
        if (set[i] !== null) {
          element.data("ec.storage." + set[i], element[0].style[set[i]]);
        }
      }
    },
    restore: function(element, set) {
      for (var i = 0; i < set.length; i++) {
        if (set[i] !== null) {
          element.css(set[i], element.data("ec.storage." + set[i]));
        }
      }
    },
    setMode: function(el, mode) {
      if (mode == "toggle") {
        mode = el.is(":hidden") ? "show" : "hide";
      }
      return mode;
    },
    getBaseline: function(origin, original) {
      var y, x;
      switch (origin[0]) {
      case "top":
        y = 0;
        break;
      case "middle":
        y = 0.5;
        break;
      case "bottom":
        y = 1;
        break;
      default:
        y = origin[0] / original.height;
      }
      switch (origin[1]) {
      case "left":
        x = 0;
        break;
      case "center":
        x = 0.5;
        break;
      case "right":
        x = 1;
        break;
      default:
        x = origin[1] / original.width;
      }
      return {
        x: x,
        y: y
      };
    },
    createWrapper: function(element) {
      if (element.parent().is(".ui-effects-wrapper")) {
        return element.parent();
      }
      var props = {
        width: element.outerWidth(true),
        height: element.outerHeight(true),
        "float": element.css("float")
      },
          wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
          fontSize: "100%",
          background: "transparent",
          border: "none",
          margin: 0,
          padding: 0
        });
      element.wrap(wrapper);
      wrapper = element.parent();
      if (element.css("position") == "static") {
        wrapper.css({
          position: "relative"
        });
        element.css({
          position: "relative"
        });
      } else {
        $.extend(props, {
          position: element.css("position"),
          zIndex: element.css("z-index")
        });
        $.each(["top", "left", "bottom", "right"], function(i, pos) {
          props[pos] = element.css(pos);
          if (isNaN(parseInt(props[pos], 10))) {
            props[pos] = "auto";
          }
        });
        element.css({
          position: "relative",
          top: 0,
          left: 0
        });
      }
      return wrapper.css(props).show();
    },
    removeWrapper: function(element) {
      if (element.parent().is(".ui-effects-wrapper")) {
        return element.parent().replaceWith(element);
      }
      return element;
    },
    setTransition: function(element, list, factor, value) {
      value = value || {};
      $.each(list, function(i, x) {
        unit = element.cssUnit(x);
        if (unit[0] > 0) {
          value[x] = unit[0] * factor + unit[1];
        }
      });
      return value;
    }
  });

  function _normalizeArguments(effect, options, speed, callback) {
    if (typeof effect == "object") {
      callback = options;
      speed = null;
      options = effect;
      effect = options.effect;
    }
    if ($.isFunction(options)) {
      callback = options;
      speed = null;
      options = {};
    }
    if (typeof options == "number" || $.fx.speeds[options]) {
      callback = speed;
      speed = options;
      options = {};
    }
    if ($.isFunction(speed)) {
      callback = speed;
      speed = null;
    }
    options = options || {};
    speed = speed || options.duration;
    speed = $.fx.off ? 0 : typeof speed == "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;
    callback = callback || options.complete;
    return [effect, options, speed, callback];
  }
  function standardSpeed(speed) {
    if (!speed || typeof speed === "number" || $.fx.speeds[speed]) {
      return true;
    }
    if (typeof speed === "string" && !$.effects[speed]) {
      return true;
    }
    return false;
  }
  $.fn.extend({
    effect: function(effect, options, speed, callback) {
      var args = _normalizeArguments.apply(this, arguments),
          args2 = {
          options: args[1],
          duration: args[2],
          callback: args[3]
          },
          mode = args2.options.mode,
          effectMethod = $.effects[effect];
      if ($.fx.off || !effectMethod) {
        if (mode) {
          return this[mode](args2.duration, args2.callback);
        } else {
          return this.each(function() {
            if (args2.callback) {
              args2.callback.call(this);
            }
          });
        }
      }
      return effectMethod.call(this, args2);
    },
    _show: $.fn.show,
    show: function(speed) {
      if (standardSpeed(speed)) {
        return this._show.apply(this, arguments);
      } else {
        var args = _normalizeArguments.apply(this, arguments);
        args[1].mode = "show";
        return this.effect.apply(this, args);
      }
    },
    _hide: $.fn.hide,
    hide: function(speed) {
      if (standardSpeed(speed)) {
        return this._hide.apply(this, arguments);
      } else {
        var args = _normalizeArguments.apply(this, arguments);
        args[1].mode = "hide";
        return this.effect.apply(this, args);
      }
    },
    __toggle: $.fn.toggle,
    toggle: function(speed) {
      if (standardSpeed(speed) || typeof speed === "boolean" || $.isFunction(speed)) {
        return this.__toggle.apply(this, arguments);
      } else {
        var args = _normalizeArguments.apply(this, arguments);
        args[1].mode = "toggle";
        return this.effect.apply(this, args);
      }
    },
    cssUnit: function(key) {
      var style = this.css(key),
          val = [];
      $.each(["em", "px", "%", "pt"], function(i, unit) {
        if (style.indexOf(unit) > 0) {
          val = [parseFloat(style), unit];
        }
      });
      return val;
    }
  });
  $.easing.jswing = $.easing.swing;
  $.extend($.easing, {
    def: "easeOutQuad",
    swing: function(x, t, b, c, d) {
      return $.easing[$.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      }
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
      if (t == 0) {
        return b;
      }
      if (t == d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) {
        return b;
      }
      if ((t /= d) == 1) {
        return b + c;
      }
      if (!p) {
        p = d * 0.3;
      }
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else {
        var s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) {
        return b;
      }
      if ((t /= d) == 1) {
        return b + c;
      }
      if (!p) {
        p = d * 0.3;
      }
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else {
        var s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) {
        return b;
      }
      if ((t /= d / 2) == 2) {
        return b + c;
      }
      if (!p) {
        p = d * (0.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else {
        var s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      }
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
      if (s == undefined) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
      if (s == undefined) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
      if (s == undefined) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
      }
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
      return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else {
        if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else {
          if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
          } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
          }
        }
      }
    },
    easeInOutBounce: function(x, t, b, c, d) {
      if (t < d / 2) {
        return $.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
      }
      return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  });
})(jQuery);
(function($, undefined) {
  $.effects.highlight = function(o) {
    return this.queue(function() {
      var elem = $(this),
          props = ["backgroundImage", "backgroundColor", "opacity"],
          mode = $.effects.setMode(elem, o.options.mode || "show"),
          animation = {
          backgroundColor: elem.css("backgroundColor")
          };
      if (mode == "hide") {
        animation.opacity = 0;
      }
      $.effects.save(elem, props);
      elem.show().css({
        backgroundImage: "none",
        backgroundColor: o.options.color || "#ffff99"
      }).animate(animation, {
        queue: false,
        duration: o.duration,
        easing: o.options.easing,
        complete: function() {
          (mode == "hide" && elem.hide());
          $.effects.restore(elem, props);
          (mode == "show" && !$.support.opacity && this.style.removeAttribute("filter"));
          (o.callback && o.callback.apply(this, arguments));
          elem.dequeue();
        }
      });
    });
  };
})(jQuery);
(function($) {
  var $scrollTo = $.scrollTo = function(target, duration, settings) {
    $(window).scrollTo(target, duration, settings);
  };
  $scrollTo.defaults = {
    axis: "xy",
    duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1
  };
  $scrollTo.window = function(scope) {
    return $(window)._scrollable();
  };
  $.fn._scrollable = function() {
    return this.map(function() {
      var elem = this,
          isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1;
      if (!isWin) {
        return elem;
      }
      var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
      return $.browser.safari || doc.compatMode == "BackCompat" ? doc.body : doc.documentElement;
    });
  };
  $.fn.scrollTo = function(target, duration, settings) {
    if (typeof duration == "object") {
      settings = duration;
      duration = 0;
    }
    if (typeof settings == "function") {
      settings = {
        onAfter: settings
      };
    }
    if (target == "max") {
      target = 9000000000;
    }
    settings = $.extend({}, $scrollTo.defaults, settings);
    duration = duration || settings.speed || settings.duration;
    settings.queue = settings.queue && settings.axis.length > 1;
    if (settings.queue) {
      duration /= 2;
    }
    settings.offset = both(settings.offset);
    settings.over = both(settings.over);
    return this._scrollable().each(function() {
      var elem = this,
          $elem = $(elem),
          targ = target,
          toff, attr = {},
          win = $elem.is("html,body");
      switch (typeof targ) {
      case "number":
      case "string":
        if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
          targ = both(targ);
          break;
        }
        targ = $(targ, this);
      case "object":
        if (targ.is || targ.style) {
          toff = (targ = $(targ)).offset();
        }
      }
      $.each(settings.axis.split(""), function(i, axis) {
        var Pos = axis == "x" ? "Left" : "Top",
            pos = Pos.toLowerCase(),
            key = "scroll" + Pos,
            old = elem[key],
            max = $scrollTo.max(elem, axis);
        if (toff) {
          attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
          if (settings.margin) {
            attr[key] -= parseInt(targ.css("margin" + Pos)) || 0;
            attr[key] -= parseInt(targ.css("border" + Pos + "Width")) || 0;
          }
          attr[key] += settings.offset[pos] || 0;
          if (settings.over[pos]) {
            attr[key] += targ[axis == "x" ? "width" : "height"]() * settings.over[pos];
          }
        } else {
          var val = targ[pos];
          attr[key] = val.slice && val.slice(-1) == "%" ? parseFloat(val) / 100 * max : val;
        }
        if (/^\d+$/.test(attr[key])) {
          attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
        }
        if (!i && settings.queue) {
          if (old != attr[key]) {
            animate(settings.onAfterFirst);
          }
          delete attr[key];
        }
      });
      animate(settings.onAfter);

      function animate(callback) {
        $elem.animate(attr, duration, settings.easing, callback &&
        function() {
          callback.call(this, target, settings);
        });
      }
    }).end();
  };
  $scrollTo.max = function(elem, axis) {
    var Dim = axis == "x" ? "Width" : "Height",
        scroll = "scroll" + Dim;
    if (!$(elem).is("html,body")) {
      return elem[scroll] - $(elem)[Dim.toLowerCase()]();
    }
    var size = "client" + Dim,
        html = elem.ownerDocument.documentElement,
        body = elem.ownerDocument.body;
    return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
  };

  function both(val) {
    return typeof val == "object" ? val : {
      top: val,
      left: val
    };
  }
})(jQuery);
jQuery.cookie = function(name, value, options) {
  if (typeof value != "undefined") {
    options = options || {};
    if (value === null) {
      value = "";
      options = $.extend({}, options);
      options.expires = -1;
    }
    var expires = "";
    if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == "number") {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = "; expires=" + date.toUTCString();
    }
    var path = options.path ? "; path=" + (options.path) : "";
    var domain = options.domain ? "; domain=" + (options.domain) : "";
    var secure = options.secure ? "; secure" : "";
    document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("");
  } else {
    var cookieValue = null;
    if (document.cookie && document.cookie != "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) == (name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};
(function($) {
  $.fn.media = function(options, f1, f2) {
    return this.each(function() {
      if (typeof options == "function") {
        f2 = f1;
        f1 = options;
        options = {};
      }
      var o = getSettings(this, options);
      if (typeof f1 == "function") {
        f1(this, o);
      }
      var r = getTypesRegExp();
      var m = r.exec(o.src.toLowerCase()) || [""];
      o.type ? m[0] = o.type : m.shift();
      for (var i = 0; i < m.length; i++) {
        fn = m[i].toLowerCase();
        if (isDigit(fn[0])) {
          fn = "fn" + fn;
        }
        if (!$.fn.media[fn]) {
          continue;
        }
        var player = $.fn.media[fn + "_player"];
        if (!o.params) {
          o.params = {};
        }
        if (player) {
          var num = player.autoplayAttr == "autostart";
          o.params[player.autoplayAttr || "autoplay"] = num ? (o.autoplay ? 1 : 0) : o.autoplay ? true : false;
        }
        var $div = $.fn.media[fn](this, o);
        $div.css("backgroundColor", o.bgColor).width(o.width);
        if (typeof f2 == "function") {
          f2(this, $div[0], o, player.name);
        }
        break;
      }
    });
  };
  $.fn.media.mapFormat = function(format, player) {
    if (!format || !player || !$.fn.media.defaults.players[player]) {
      return;
    }
    format = format.toLowerCase();
    if (isDigit(format[0])) {
      format = "fn" + format;
    }
    $.fn.media[format] = $.fn.media[player];
    $.fn.media[format + "_player"] = $.fn.media.defaults.players[player];
  };
  $.fn.media.defaults = {
    width: 400,
    height: 400,
    autoplay: 0,
    bgColor: "#ffffff",
    params: {
      wmode: "transparent"
    },
    attrs: {},
    flvKeyName: "file",
    flashvars: {},
    flashVersion: "7",
    expressInstaller: null,
    flvPlayer: "mediaplayer.swf",
    mp3Player: "mediaplayer.swf",
    silverlight: {
      inplaceInstallPrompt: "true",
      isWindowless: "true",
      framerate: "24",
      version: "0.9",
      onError: null,
      onLoad: null,
      initParams: null,
      userContext: null
    }
  };
  $.fn.media.defaults.players = {
    flash: {
      name: "flash",
      types: "flv,mp3,swf",
      oAttrs: {
        classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
        type: "application/x-oleobject",
        codebase: "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=" + $.fn.media.defaults.flashVersion
      },
      eAttrs: {
        type: "application/x-shockwave-flash",
        pluginspage: "http://www.adobe.com/go/getflashplayer"
      }
    },
    iframe: {
      name: "iframe",
      types: "html,pdf"
    },
    silverlight: {
      name: "silverlight",
      types: "xaml"
    }
  };

  function isFirefoxWMPPluginInstalled() {
    var plugs = navigator.plugins;
    for (i = 0; i < plugs.length; i++) {
      var plugin = plugs[i];
      if (plugin["filename"] == "np-mswmp.dll") {
        return true;
      }
    }
    return false;
  }
  var counter = 1;
  for (var player in $.fn.media.defaults.players) {
    var types = $.fn.media.defaults.players[player].types;
    $.each(types.split(","), function(i, o) {
      if (isDigit(o[0])) {
        o = "fn" + o;
      }
      $.fn.media[o] = $.fn.media[player] = getGenerator(player);
      $.fn.media[o + "_player"] = $.fn.media.defaults.players[player];
    });
  }
  function getTypesRegExp() {
    var types = "";
    for (var player in $.fn.media.defaults.players) {
      if (types.length) {
        types += ",";
      }
      types += $.fn.media.defaults.players[player].types;
    }
    return new RegExp("\\.(" + types.replace(/,/ig, "|") + ")\\b");
  }
  function getGenerator(player) {
    return function(el, options) {
      return generate(el, options, player);
    };
  }
  function isDigit(c) {
    return "0123456789".indexOf(c) > -1;
  }
  function getSettings(el, options) {
    options = options || {};
    var $el = $(el);
    var cls = el.className || "";
    var meta = $.metadata ? $el.metadata() : $.meta ? $el.data() : {};
    meta = meta || {};
    var w = meta.width || parseInt(((cls.match(/w:(\d+)/) || [])[1] || 0));
    var h = meta.height || parseInt(((cls.match(/h:(\d+)/) || [])[1] || 0));
    if (w) {
      meta.width = w;
    }
    if (h) {
      meta.height = h;
    }
    if (cls) {
      meta.cls = cls;
    }
    var a = $.fn.media.defaults;
    var b = options;
    var c = meta;
    var p = {
      params: {
        bgColor: options.bgColor || $.fn.media.defaults.bgColor
      }
    };
    var opts = $.extend({}, a, b, c);
    $.each(["attrs", "params", "flashvars", "silverlight"], function(i, o) {
      opts[o] = $.extend({}, p[o] || {}, a[o] || {}, b[o] || {}, c[o] || {});
    });
    if (typeof opts.caption == "undefined") {
      opts.caption = $el.text();
    }
    opts.src = opts.src || $el.attr("href") || $el.attr("src") || "unknown";
    return opts;
  }
  $.fn.media.swf = function(el, opts) {
    if (!window.SWFObject && !window.swfobject) {
      if (opts.flashvars) {
        var a = [];
        for (var f in opts.flashvars) {
          a.push(f + "=" + opts.flashvars[f]);
        }
        if (!opts.params) {
          opts.params = {};
        }
        opts.params.flashvars = a.join("&");
      }
      return generate(el, opts, "flash");
    }
    var id = el.id ? (' id="' + el.id + '"') : "";
    var cls = opts.cls ? (' class="' + opts.cls + '"') : "";
    var $div = $("<div" + id + cls + ">");
    if (window.swfobject) {
      $(el).after($div).appendTo($div);
      if (!el.id) {
        el.id = "movie_player_" + counter++;
      }
      swfobject.embedSWF(opts.src, el.id, opts.width, opts.height, opts.flashVersion, opts.expressInstaller, opts.flashvars, opts.params, opts.attrs);
    } else {
      $(el).after($div).remove();
      var so = new SWFObject(opts.src, "movie_player_" + counter++, opts.width, opts.height, opts.flashVersion, opts.bgColor);
      if (opts.expressInstaller) {
        so.useExpressInstall(opts.expressInstaller);
      }
      for (var p in opts.params) {
        if (p != "bgColor") {
          so.addParam(p, opts.params[p]);
        }
      }
      for (var f in opts.flashvars) {
        so.addVariable(f, opts.flashvars[f]);
      }
      so.write($div[0]);
    }
    if (opts.caption) {
      $("<div>").appendTo($div).html(opts.caption);
    }
    return $div;
  };
  var BrowserDetect = {
    init: function() {
      this.browser = this.searchString(this.dataBrowser) || "Other";
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
    },
    searchString: function(data) {
      for (var i = 0; i < data.length; i++) {
        var dataString = data[i].string;
        this.versionSearchString = data[i].subString;
        if (dataString.indexOf(data[i].subString) != -1) {
          return data[i].identity;
        }
      }
    },
    searchVersion: function(dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index == -1) {
        return;
      }
      return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    }, {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer"
    }, {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    }, {
      string: navigator.userAgent,
      subString: "Safari",
      identity: "Safari"
    }, {
      string: navigator.userAgent,
      subString: "Opera",
      identity: "Opera"
    }]
  };
  BrowserDetect.init();

  function generate(el, opts, player) {
    var $el = $(el);
    var o = $.fn.media.defaults.players[player];
    if (player == "iframe") {
      var o = $("<iframe" + ' width="' + opts.width + '" height="' + opts.height + '" >');
      o.attr("src", opts.src);
      o.css("backgroundColor", o.bgColor);
    } else {
      if (BrowserDetect.browser == "Explorer") {
        var a = ['<object id="' + opts.id + '" name="' + opts.id + '" width="' + opts.width + '" height="' + opts.height + '" '];
        for (var key in opts.attrs) {
          a.push(key + '="' + opts.attrs[key] + '" ');
        }
        for (var key in o.oAttrs || {}) {
          var v = o.oAttrs[key];
          if (key == "codebase" && window.location.protocol == "https:") {
            v = v.replace("http", "https");
          }
          a.push(key + '="' + v + '" ');
        }
        a.push("></ob" + "ject" + ">");
        var p = ['<param name="' + (o.oUrl || "src") + '" value="' + opts.src + '">'];
        for (var key in opts.params) {
          p.push('<param name="' + key + '" value="' + opts.params[key] + '">');
        }
        var o = document.createElement(a.join(""));
        for (var i = 0; i < p.length; i++) {
          o.appendChild(document.createElement(p[i]));
        }
      } else {
        var a = ['<embed id="' + opts.id + '" name="' + opts.id + '" width="' + opts.width + '" height="' + opts.height + '" style="display:block"'];
        if (opts.src) {
          a.push(' src="' + opts.src + '" ');
        }
        for (var key in opts.attrs) {
          a.push(key + '="' + opts.attrs[key] + '" ');
        }
        for (var key in o.eAttrs || {}) {
          a.push(key + '="' + o.eAttrs[key] + '" ');
        }
        for (var key in opts.params) {
          if (key == "wmode" && player != "flash") {
            continue;
          }
          a.push(key + '="' + opts.params[key] + '" ');
        }
        a.push("></em" + "bed" + ">");
      }
    }
    var id = el.id ? (' id="' + el.id + '"') : "";
    var cls = opts.cls ? (' class="' + opts.cls + '"') : "";
    var $div = $("<div" + id + cls + ">");
    $el.after($div).remove();
    (BrowserDetect.browser == "Explorer" || player == "iframe") ? $div.append(o) : $div.html(a.join(""));
    if (opts.caption) {
      $("<div>").appendTo($div).html(opts.caption);
    }
    return $div;
  }
})(jQuery);
/*
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.94 (20-DEC-2010)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.2.6 or later
 */
(function($) {
  var ver = "2.94";
  if ($.support == undefined) {
    $.support = {
      opacity: !($.browser.msie)
    };
  }
  function debug(s) {
    if ($.fn.cycle.debug) {
      log(s);
    }
  }
  function log() {
    if (window.console && window.console.log) {
      window.console.log("[cycle] " + Array.prototype.join.call(arguments, " "));
    }
  }
  $.fn.cycle = function(options, arg2) {
    var o = {
      s: this.selector,
      c: this.context
    };
    if (this.length === 0 && options != "stop") {
      if (!$.isReady && o.s) {
        log("DOM not ready, queuing slideshow");
        $(function() {
          $(o.s, o.c).cycle(options, arg2);
        });
        return this;
      }
      log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
      return this;
    }
    return this.each(function() {
      var opts = handleArguments(this, options, arg2);
      if (opts === false) {
        return;
      }
      opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;
      if (this.cycleTimeout) {
        clearTimeout(this.cycleTimeout);
      }
      this.cycleTimeout = this.cyclePause = 0;
      var $cont = $(this);
      var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
      var els = $slides.get();
      if (els.length < 2) {
        log("terminating; too few slides: " + els.length);
        return;
      }
      var opts2 = buildOptions($cont, $slides, els, opts, o);
      if (opts2 === false) {
        return;
      }
      var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);
      if (startTime) {
        startTime += (opts2.delay || 0);
        if (startTime < 10) {
          startTime = 10;
        }
        debug("first timeout: " + startTime);
        this.cycleTimeout = setTimeout(function() {
          go(els, opts2, 0, !opts.backwards);
        }, startTime);
      }
    });
  };

  function handleArguments(cont, options, arg2) {
    if (cont.cycleStop == undefined) {
      cont.cycleStop = 0;
    }
    if (options === undefined || options === null) {
      options = {};
    }
    if (options.constructor == String) {
      switch (options) {
      case "destroy":
      case "stop":
        var opts = $(cont).data("cycle.opts");
        if (!opts) {
          return false;
        }
        cont.cycleStop++;
        if (cont.cycleTimeout) {
          clearTimeout(cont.cycleTimeout);
        }
        cont.cycleTimeout = 0;
        $(cont).removeData("cycle.opts");
        if (options == "destroy") {
          destroy(opts);
        }
        return false;
      case "toggle":
        cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
        checkInstantResume(cont.cyclePause, arg2, cont);
        return false;
      case "pause":
        cont.cyclePause = 1;
        return false;
      case "resume":
        cont.cyclePause = 0;
        checkInstantResume(false, arg2, cont);
        return false;
      case "prev":
      case "next":
        var opts = $(cont).data("cycle.opts");
        if (!opts) {
          log('options not found, "prev/next" ignored');
          return false;
        }
        $.fn.cycle[options](opts);
        return false;
      default:
        options = {
          fx: options
        };
      }
      return options;
    } else {
      if (options.constructor == Number) {
        var num = options;
        options = $(cont).data("cycle.opts");
        if (!options) {
          log("options not found, can not advance slide");
          return false;
        }
        if (num < 0 || num >= options.elements.length) {
          log("invalid slide index: " + num);
          return false;
        }
        options.nextSlide = num;
        if (cont.cycleTimeout) {
          clearTimeout(cont.cycleTimeout);
          cont.cycleTimeout = 0;
        }
        if (typeof arg2 == "string") {
          options.oneTimeFx = arg2;
        }
        go(options.elements, options, 1, num >= options.currSlide);
        return false;
      }
    }
    return options;

    function checkInstantResume(isPaused, arg2, cont) {
      if (!isPaused && arg2 === true) {
        var options = $(cont).data("cycle.opts");
        if (!options) {
          log("options not found, can not resume");
          return false;
        }
        if (cont.cycleTimeout) {
          clearTimeout(cont.cycleTimeout);
          cont.cycleTimeout = 0;
        }
        go(options.elements, options, 1, !options.backwards);
      }
    }
  }
  function removeFilter(el, opts) {
    if (!$.support.opacity && opts.cleartype && el.style.filter) {
      try {
        el.style.removeAttribute("filter");
      } catch (smother) {}
    }
  }
  function destroy(opts) {
    if (opts.next) {
      $(opts.next).unbind(opts.prevNextEvent);
    }
    if (opts.prev) {
      $(opts.prev).unbind(opts.prevNextEvent);
    }
    if (opts.pager || opts.pagerAnchorBuilder) {
      $.each(opts.pagerAnchors || [], function() {
        this.unbind().remove();
      });
    }
    opts.pagerAnchors = null;
    if (opts.destroy) {
      opts.destroy(opts);
    }
  }
  function buildOptions($cont, $slides, els, options, o) {
    var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
    if (opts.autostop) {
      opts.countdown = opts.autostopCount || els.length;
    }
    var cont = $cont[0];
    $cont.data("cycle.opts", opts);
    opts.$cont = $cont;
    opts.stopCount = cont.cycleStop;
    opts.elements = els;
    opts.before = opts.before ? [opts.before] : [];
    opts.after = opts.after ? [opts.after] : [];
    opts.after.unshift(function() {
      opts.busy = 0;
    });
    if (!$.support.opacity && opts.cleartype) {
      opts.after.push(function() {
        removeFilter(this, opts);
      });
    }
    if (opts.continuous) {
      opts.after.push(function() {
        go(els, opts, 0, !opts.backwards);
      });
    }
    saveOriginalOpts(opts);
    if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg) {
      clearTypeFix($slides);
    }
    if ($cont.css("position") == "static") {
      $cont.css("position", "relative");
    }
    if (opts.width) {
      $cont.width(opts.width);
    }
    if (opts.height && opts.height != "auto") {
      $cont.height(opts.height);
    }
    if (opts.startingSlide) {
      opts.startingSlide = parseInt(opts.startingSlide);
    } else {
      if (opts.backwards) {
        opts.startingSlide = els.length - 1;
      }
    }
    if (opts.random) {
      opts.randomMap = [];
      for (var i = 0; i < els.length; i++) {
        opts.randomMap.push(i);
      }
      opts.randomMap.sort(function(a, b) {
        return Math.random() - 0.5;
      });
      opts.randomIndex = 1;
      opts.startingSlide = opts.randomMap[1];
    } else {
      if (opts.startingSlide >= els.length) {
        opts.startingSlide = 0;
      }
    }
    opts.currSlide = opts.startingSlide || 0;
    var first = opts.startingSlide;
    $slides.css({
      position: "absolute",
      top: 0,
      left: 0
    }).hide().each(function(i) {
      var z;
      if (opts.backwards) {
        z = first ? i <= first ? els.length + (i - first) : first - i : els.length - i;
      } else {
        z = first ? i >= first ? els.length - (i - first) : first - i : els.length - i;
      }
      $(this).css("z-index", z);
    });
    $(els[first]).css("opacity", 1).show();
    removeFilter(els[first], opts);
    if (opts.fit && opts.width) {
      $slides.width(opts.width);
    }
    if (opts.fit && opts.height && opts.height != "auto") {
      $slides.height(opts.height);
    }
    var reshape = opts.containerResize && !$cont.innerHeight();
    if (reshape) {
      var maxw = 0,
          maxh = 0;
      for (var j = 0; j < els.length; j++) {
        var $e = $(els[j]),
            e = $e[0],
            w = $e.outerWidth(),
            h = $e.outerHeight();
        if (!w) {
          w = e.offsetWidth || e.width || $e.attr("width");
        }
        if (!h) {
          h = e.offsetHeight || e.height || $e.attr("height");
        }
        maxw = w > maxw ? w : maxw;
        maxh = h > maxh ? h : maxh;
      }
      if (maxw > 0 && maxh > 0) {
        $cont.css({
          width: maxw + "px",
          height: maxh + "px"
        });
      }
    }
    if (opts.pause) {
      $cont.hover(function() {
        this.cyclePause++;
      }, function() {
        this.cyclePause--;
      });
    }
    if (supportMultiTransitions(opts) === false) {
      return false;
    }
    var requeue = false;
    options.requeueAttempts = options.requeueAttempts || 0;
    $slides.each(function() {
      var $el = $(this);
      this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr("height") || 0);
      this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr("width") || 0);
      if ($el.is("img")) {
        var loadingIE = ($.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
        var loadingFF = ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
        var loadingOp = ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
        var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
        if (loadingIE || loadingFF || loadingOp || loadingOther) {
          if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) {
            log(options.requeueAttempts, " - img slide not loaded, requeuing slideshow: ", this.src, this.cycleW, this.cycleH);
            setTimeout(function() {
              $(o.s, o.c).cycle(options);
            }, opts.requeueTimeout);
            requeue = true;
            return false;
          } else {
            log("could not determine size of image: " + this.src, this.cycleW, this.cycleH);
          }
        }
      }
      return true;
    });
    if (requeue) {
      return false;
    }
    opts.cssBefore = opts.cssBefore || {};
    opts.animIn = opts.animIn || {};
    opts.animOut = opts.animOut || {};
    $slides.not(":eq(" + first + ")").css(opts.cssBefore);
    if (opts.cssFirst) {
      $($slides[first]).css(opts.cssFirst);
    }
    if (opts.timeout) {
      opts.timeout = parseInt(opts.timeout);
      if (opts.speed.constructor == String) {
        opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
      }
      if (!opts.sync) {
        opts.speed = opts.speed / 2;
      }
      var buffer = opts.fx == "shuffle" ? 500 : 250;
      while ((opts.timeout - opts.speed) < buffer) {
        opts.timeout += opts.speed;
      }
    }
    if (opts.easing) {
      opts.easeIn = opts.easeOut = opts.easing;
    }
    if (!opts.speedIn) {
      opts.speedIn = opts.speed;
    }
    if (!opts.speedOut) {
      opts.speedOut = opts.speed;
    }
    opts.slideCount = els.length;
    opts.currSlide = opts.lastSlide = first;
    if (opts.random) {
      if (++opts.randomIndex == els.length) {
        opts.randomIndex = 0;
      }
      opts.nextSlide = opts.randomMap[opts.randomIndex];
    } else {
      if (opts.backwards) {
        opts.nextSlide = opts.startingSlide == 0 ? (els.length - 1) : opts.startingSlide - 1;
      } else {
        opts.nextSlide = opts.startingSlide >= (els.length - 1) ? 0 : opts.startingSlide + 1;
      }
    }
    if (!opts.multiFx) {
      var init = $.fn.cycle.transitions[opts.fx];
      if ($.isFunction(init)) {
        init($cont, $slides, opts);
      } else {
        if (opts.fx != "custom" && !opts.multiFx) {
          log("unknown transition: " + opts.fx, "; slideshow terminating");
          return false;
        }
      }
    }
    var e0 = $slides[first];
    if (opts.before.length) {
      opts.before[0].apply(e0, [e0, e0, opts, true]);
    }
    if (opts.after.length > 1) {
      opts.after[1].apply(e0, [e0, e0, opts, true]);
    }
    if (opts.next) {
      $(opts.next).bind(opts.prevNextEvent, function() {
        return advance(opts, 1);
      });
    }
    if (opts.prev) {
      $(opts.prev).bind(opts.prevNextEvent, function() {
        return advance(opts, 0);
      });
    }
    if (opts.pager || opts.pagerAnchorBuilder) {
      buildPager(els, opts);
    }
    exposeAddSlide(opts, els);
    return opts;
  }
  function saveOriginalOpts(opts) {
    opts.original = {
      before: [],
      after: []
    };
    opts.original.cssBefore = $.extend({}, opts.cssBefore);
    opts.original.cssAfter = $.extend({}, opts.cssAfter);
    opts.original.animIn = $.extend({}, opts.animIn);
    opts.original.animOut = $.extend({}, opts.animOut);
    $.each(opts.before, function() {
      opts.original.before.push(this);
    });
    $.each(opts.after, function() {
      opts.original.after.push(this);
    });
  }
  function supportMultiTransitions(opts) {
    var i, tx, txs = $.fn.cycle.transitions;
    if (opts.fx.indexOf(",") > 0) {
      opts.multiFx = true;
      opts.fxs = opts.fx.replace(/\s*/g, "").split(",");
      for (i = 0; i < opts.fxs.length; i++) {
        var fx = opts.fxs[i];
        tx = txs[fx];
        if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
          log("discarding unknown transition: ", fx);
          opts.fxs.splice(i, 1);
          i--;
        }
      }
      if (!opts.fxs.length) {
        log("No valid transitions named; slideshow terminating.");
        return false;
      }
    } else {
      if (opts.fx == "all") {
        opts.multiFx = true;
        opts.fxs = [];
        for (p in txs) {
          tx = txs[p];
          if (txs.hasOwnProperty(p) && $.isFunction(tx)) {
            opts.fxs.push(p);
          }
        }
      }
    }
    if (opts.multiFx && opts.randomizeEffects) {
      var r1 = Math.floor(Math.random() * 20) + 30;
      for (i = 0; i < r1; i++) {
        var r2 = Math.floor(Math.random() * opts.fxs.length);
        opts.fxs.push(opts.fxs.splice(r2, 1)[0]);
      }
      debug("randomized fx sequence: ", opts.fxs);
    }
    return true;
  }
  function exposeAddSlide(opts, els) {
    opts.addSlide = function(newSlide, prepend) {
      var $s = $(newSlide),
          s = $s[0];
      if (!opts.autostopCount) {
        opts.countdown++;
      }
      els[prepend ? "unshift" : "push"](s);
      if (opts.els) {
        opts.els[prepend ? "unshift" : "push"](s);
      }
      opts.slideCount = els.length;
      $s.css("position", "absolute");
      $s[prepend ? "prependTo" : "appendTo"](opts.$cont);
      if (prepend) {
        opts.currSlide++;
        opts.nextSlide++;
      }
      if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg) {
        clearTypeFix($s);
      }
      if (opts.fit && opts.width) {
        $s.width(opts.width);
      }
      if (opts.fit && opts.height && opts.height != "auto") {
        $s.height(opts.height);
      }
      s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
      s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();
      $s.css(opts.cssBefore);
      if (opts.pager || opts.pagerAnchorBuilder) {
        $.fn.cycle.createPagerAnchor(els.length - 1, s, $(opts.pager), els, opts);
      }
      if ($.isFunction(opts.onAddSlide)) {
        opts.onAddSlide($s);
      } else {
        $s.hide();
      }
    };
  }
  $.fn.cycle.resetState = function(opts, fx) {
    fx = fx || opts.fx;
    opts.before = [];
    opts.after = [];
    opts.cssBefore = $.extend({}, opts.original.cssBefore);
    opts.cssAfter = $.extend({}, opts.original.cssAfter);
    opts.animIn = $.extend({}, opts.original.animIn);
    opts.animOut = $.extend({}, opts.original.animOut);
    opts.fxFn = null;
    $.each(opts.original.before, function() {
      opts.before.push(this);
    });
    $.each(opts.original.after, function() {
      opts.after.push(this);
    });
    var init = $.fn.cycle.transitions[fx];
    if ($.isFunction(init)) {
      init(opts.$cont, $(opts.elements), opts);
    }
  };

  function go(els, opts, manual, fwd) {
    if (manual && opts.busy && opts.manualTrump) {
      debug("manualTrump in go(), stopping active transition");
      $(els).stop(true, true);
      opts.busy = false;
    }
    if (opts.busy) {
      debug("transition active, ignoring new tx request");
      return;
    }
    var p = opts.$cont[0],
        curr = els[opts.currSlide],
        next = els[opts.nextSlide];
    if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual) {
      return;
    }
    if (!manual && !p.cyclePause && !opts.bounce && ((opts.autostop && (--opts.countdown <= 0)) || (opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
      if (opts.end) {
        opts.end(opts);
      }
      return;
    }
    var changed = false;
    if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
      changed = true;
      var fx = opts.fx;
      curr.cycleH = curr.cycleH || $(curr).height();
      curr.cycleW = curr.cycleW || $(curr).width();
      next.cycleH = next.cycleH || $(next).height();
      next.cycleW = next.cycleW || $(next).width();
      if (opts.multiFx) {
        if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length) {
          opts.lastFx = 0;
        }
        fx = opts.fxs[opts.lastFx];
        opts.currFx = fx;
      }
      if (opts.oneTimeFx) {
        fx = opts.oneTimeFx;
        opts.oneTimeFx = null;
      }
      $.fn.cycle.resetState(opts, fx);
      if (opts.before.length) {
        $.each(opts.before, function(i, o) {
          if (p.cycleStop != opts.stopCount) {
            return;
          }
          o.apply(next, [curr, next, opts, fwd]);
        });
      }
      var after = function() {
        $.each(opts.after, function(i, o) {
          if (p.cycleStop != opts.stopCount) {
            return;
          }
          o.apply(next, [curr, next, opts, fwd]);
        });
      };
      debug("tx firing; currSlide: " + opts.currSlide + "; nextSlide: " + opts.nextSlide);
      opts.busy = 1;
      if (opts.fxFn) {
        opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
      } else {
        if ($.isFunction($.fn.cycle[opts.fx])) {
          $.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
        } else {
          $.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
        }
      }
    }
    if (changed || opts.nextSlide == opts.currSlide) {
      opts.lastSlide = opts.currSlide;
      if (opts.random) {
        opts.currSlide = opts.nextSlide;
        if (++opts.randomIndex == els.length) {
          opts.randomIndex = 0;
        }
        opts.nextSlide = opts.randomMap[opts.randomIndex];
        if (opts.nextSlide == opts.currSlide) {
          opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
        }
      } else {
        if (opts.backwards) {
          var roll = (opts.nextSlide - 1) < 0;
          if (roll && opts.bounce) {
            opts.backwards = !opts.backwards;
            opts.nextSlide = 1;
            opts.currSlide = 0;
          } else {
            opts.nextSlide = roll ? (els.length - 1) : opts.nextSlide - 1;
            opts.currSlide = roll ? 0 : opts.nextSlide + 1;
          }
        } else {
          var roll = (opts.nextSlide + 1) == els.length;
          if (roll && opts.bounce) {
            opts.backwards = !opts.backwards;
            opts.nextSlide = els.length - 2;
            opts.currSlide = els.length - 1;
          } else {
            opts.nextSlide = roll ? 0 : opts.nextSlide + 1;
            opts.currSlide = roll ? els.length - 1 : opts.nextSlide - 1;
          }
        }
      }
    }
    if (changed && opts.pager) {
      opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);
    }
    var ms = 0;
    if (opts.timeout && !opts.continuous) {
      ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
    } else {
      if (opts.continuous && p.cyclePause) {
        ms = 10;
      }
    }
    if (ms > 0) {
      p.cycleTimeout = setTimeout(function() {
        go(els, opts, 0, !opts.backwards);
      }, ms);
    }
  }
  $.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
    $(pager).each(function() {
      $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
    });
  };

  function getTimeout(curr, next, opts, fwd) {
    if (opts.timeoutFn) {
      var t = opts.timeoutFn.call(curr, curr, next, opts, fwd);
      while ((t - opts.speed) < 250) {
        t += opts.speed;
      }
      debug("calculated timeout: " + t + "; speed: " + opts.speed);
      if (t !== false) {
        return t;
      }
    }
    return opts.timeout;
  }
  $.fn.cycle.next = function(opts) {
    advance(opts, 1);
  };
  $.fn.cycle.prev = function(opts) {
    advance(opts, 0);
  };

  function advance(opts, moveForward) {
    var val = moveForward ? 1 : -1;
    var els = opts.elements;
    var p = opts.$cont[0],
        timeout = p.cycleTimeout;
    if (timeout) {
      clearTimeout(timeout);
      p.cycleTimeout = 0;
    }
    if (opts.random && val < 0) {
      opts.randomIndex--;
      if (--opts.randomIndex == -2) {
        opts.randomIndex = els.length - 2;
      } else {
        if (opts.randomIndex == -1) {
          opts.randomIndex = els.length - 1;
        }
      }
      opts.nextSlide = opts.randomMap[opts.randomIndex];
    } else {
      if (opts.random) {
        opts.nextSlide = opts.randomMap[opts.randomIndex];
      } else {
        opts.nextSlide = opts.currSlide + val;
        if (opts.nextSlide < 0) {
          if (opts.nowrap) {
            return false;
          }
          opts.nextSlide = els.length - 1;
        } else {
          if (opts.nextSlide >= els.length) {
            if (opts.nowrap) {
              return false;
            }
            opts.nextSlide = 0;
          }
        }
      }
    }
    var cb = opts.onPrevNextEvent || opts.prevNextClick;
    if ($.isFunction(cb)) {
      cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
    }
    go(els, opts, 1, moveForward);
    return false;
  }
  function buildPager(els, opts) {
    var $p = $(opts.pager);
    $.each(els, function(i, o) {
      $.fn.cycle.createPagerAnchor(i, o, $p, els, opts);
    });
    opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
  }
  $.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
    var a;
    if ($.isFunction(opts.pagerAnchorBuilder)) {
      a = opts.pagerAnchorBuilder(i, el);
      debug("pagerAnchorBuilder(" + i + ", el) returned: " + a);
    } else {
      a = '<a href="#">' + (i + 1) + "</a>";
    }
    if (!a) {
      return;
    }
    var $a = $(a);
    if ($a.parents("body").length === 0) {
      var arr = [];
      if ($p.length > 1) {
        $p.each(function() {
          var $clone = $a.clone(true);
          $(this).append($clone);
          arr.push($clone[0]);
        });
        $a = $(arr);
      } else {
        $a.appendTo($p);
      }
    }
    opts.pagerAnchors = opts.pagerAnchors || [];
    opts.pagerAnchors.push($a);
    $a.bind(opts.pagerEvent, function(e) {
      e.preventDefault();
      opts.nextSlide = i;
      var p = opts.$cont[0],
          timeout = p.cycleTimeout;
      if (timeout) {
        clearTimeout(timeout);
        p.cycleTimeout = 0;
      }
      var cb = opts.onPagerEvent || opts.pagerClick;
      if ($.isFunction(cb)) {
        cb(opts.nextSlide, els[opts.nextSlide]);
      }
      go(els, opts, 1, opts.currSlide < i);
    });
    if (!/^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble) {
      if (opts.pauseOnPagerHover) {
        $a.hover(function() {
          opts.$cont[0].cyclePause++;
        }, function() {
          opts.$cont[0].cyclePause--;
        });
      }
    }
  };
  $.fn.cycle.hopsFromLast = function(opts, fwd) {
    var hops, l = opts.lastSlide,
        c = opts.currSlide;
    if (fwd) {
      hops = c > l ? c - l : opts.slideCount - l;
    } else {
      hops = c < l ? l - c : l + opts.slideCount - c;
    }
    return hops;
  };

  function clearTypeFix($slides) {
    debug("applying clearType background-color hack");

    function hex(s) {
      s = parseInt(s).toString(16);
      return s.length < 2 ? "0" + s : s;
    }
    function getBg(e) {
      for (; e && e.nodeName.toLowerCase() != "html"; e = e.parentNode) {
        var v = $.css(e, "background-color");
        if (v.indexOf("rgb") >= 0) {
          var rgb = v.match(/\d+/g);
          return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }
        if (v && v != "transparent") {
          return v;
        }
      }
      return "#ffffff";
    }
    $slides.each(function() {
      $(this).css("background-color", getBg(this));
    });
  }
  $.fn.cycle.commonReset = function(curr, next, opts, w, h, rev) {
    $(opts.elements).not(curr).hide();
    opts.cssBefore.opacity = 1;
    opts.cssBefore.display = "block";
    if (opts.slideResize && w !== false && next.cycleW > 0) {
      opts.cssBefore.width = next.cycleW;
    }
    if (opts.slideResize && h !== false && next.cycleH > 0) {
      opts.cssBefore.height = next.cycleH;
    }
    opts.cssAfter = opts.cssAfter || {};
    opts.cssAfter.display = "none";
    $(curr).css("zIndex", opts.slideCount + (rev === true ? 1 : 0));
    $(next).css("zIndex", opts.slideCount + (rev === true ? 0 : 1));
  };
  $.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
    var $l = $(curr),
        $n = $(next);
    var speedIn = opts.speedIn,
        speedOut = opts.speedOut,
        easeIn = opts.easeIn,
        easeOut = opts.easeOut;
    $n.css(opts.cssBefore);
    if (speedOverride) {
      if (typeof speedOverride == "number") {
        speedIn = speedOut = speedOverride;
      } else {
        speedIn = speedOut = 1;
      }
      easeIn = easeOut = null;
    }
    var fn = function() {
      $n.animate(opts.animIn, speedIn, easeIn, cb);
    };
    $l.animate(opts.animOut, speedOut, easeOut, function() {
      if (opts.cssAfter) {
        $l.css(opts.cssAfter);
      }
      if (!opts.sync) {
        fn();
      }
    });
    if (opts.sync) {
      fn();
    }
  };
  $.fn.cycle.transitions = {
    fade: function($cont, $slides, opts) {
      $slides.not(":eq(" + opts.currSlide + ")").css("opacity", 0);
      opts.before.push(function(curr, next, opts) {
        $.fn.cycle.commonReset(curr, next, opts);
        opts.cssBefore.opacity = 0;
      });
      opts.animIn = {
        opacity: 1
      };
      opts.animOut = {
        opacity: 0
      };
      opts.cssBefore = {
        top: 0,
        left: 0
      };
    }
  };
  $.fn.cycle.ver = function() {
    return ver;
  };
  $.fn.cycle.defaults = {
    fx: "fade",
    timeout: 4000,
    timeoutFn: null,
    continuous: 0,
    speed: 1000,
    speedIn: null,
    speedOut: null,
    next: null,
    prev: null,
    onPrevNextEvent: null,
    prevNextEvent: "click.cycle",
    pager: null,
    onPagerEvent: null,
    pagerEvent: "click.cycle",
    allowPagerClickBubble: false,
    pagerAnchorBuilder: null,
    before: null,
    after: null,
    end: null,
    easing: null,
    easeIn: null,
    easeOut: null,
    shuffle: null,
    animIn: null,
    animOut: null,
    cssBefore: null,
    cssAfter: null,
    fxFn: null,
    height: "auto",
    startingSlide: 0,
    sync: 1,
    random: 0,
    fit: 0,
    containerResize: 1,
    slideResize: 1,
    pause: 0,
    pauseOnPagerHover: 0,
    autostop: 0,
    autostopCount: 0,
    delay: 0,
    slideExpr: null,
    cleartype: !$.support.opacity,
    cleartypeNoBg: false,
    nowrap: 0,
    fastOnEvent: 0,
    randomizeEffects: 1,
    rev: 0,
    manualTrump: true,
    requeueOnImageNotLoaded: true,
    requeueTimeout: 250,
    activePagerClass: "activeSlide",
    updateActivePagerLink: null,
    backwards: false
  };
})(jQuery);
/*
 * jQuery Form Plugin
 * version: 2.67 (12-MAR-2011)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {
  $.fn.ajaxSubmit = function(options) {
    if (!this.length) {
      log("ajaxSubmit: skipping submit process - no element selected");
      return this;
    }
    if (typeof options == "function") {
      options = {
        success: options
      };
    }
    var action = this.attr("action");
    var url = (typeof action === "string") ? $.trim(action) : "";
    if (url) {
      url = (url.match(/^([^#]+)/) || [])[1];
    }
    url = url || window.location.href || "";
    options = $.extend(true, {
      url: url,
      type: this[0].getAttribute("method") || "GET",
      iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
    }, options);
    var veto = {};
    this.trigger("form-pre-serialize", [this, options, veto]);
    if (veto.veto) {
      log("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
      return this;
    }
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
      log("ajaxSubmit: submit aborted via beforeSerialize callback");
      return this;
    }
    var n, v, a = this.formToArray(options.semantic);
    if (options.data) {
      options.extraData = options.data;
      for (n in options.data) {
        if (options.data[n] instanceof Array) {
          for (var k in options.data[n]) {
            a.push({
              name: n,
              value: options.data[n][k]
            });
          }
        } else {
          v = options.data[n];
          v = $.isFunction(v) ? v() : v;
          a.push({
            name: n,
            value: v
          });
        }
      }
    }
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
      log("ajaxSubmit: submit aborted via beforeSubmit callback");
      return this;
    }
    this.trigger("form-submit-validate", [a, this, options, veto]);
    if (veto.veto) {
      log("ajaxSubmit: submit vetoed via form-submit-validate trigger");
      return this;
    }
    var q = $.param(a);
    if (options.type.toUpperCase() == "GET") {
      options.url += (options.url.indexOf("?") >= 0 ? "&" : "?") + q;
      options.data = null;
    } else {
      options.data = q;
    }
    var $form = this,
        callbacks = [];
    if (options.resetForm) {
      callbacks.push(function() {
        $form.resetForm();
      });
    }
    if (options.clearForm) {
      callbacks.push(function() {
        $form.clearForm();
      });
    }
    if (!options.dataType && options.target) {
      var oldSuccess = options.success ||
      function() {};
      callbacks.push(function(data) {
        var fn = options.replaceTarget ? "replaceWith" : "html";
        $(options.target)[fn](data).each(oldSuccess, arguments);
      });
    } else {
      if (options.success) {
        callbacks.push(options.success);
      }
    }
    options.success = function(data, status, xhr) {
      var context = options.context || options;
      for (var i = 0, max = callbacks.length; i < max; i++) {
        callbacks[i].apply(context, [data, status, xhr || $form, $form]);
      }
    };
    var fileInputs = $("input:file", this).length > 0;
    var mp = "multipart/form-data";
    var multipart = ($form.attr("enctype") == mp || $form.attr("encoding") == mp);
    if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
      if (options.closeKeepAlive) {
        $.get(options.closeKeepAlive, fileUpload);
      } else {
        fileUpload();
      }
    } else {
      $.ajax(options);
    }
    this.trigger("form-submit-notify", [this, options]);
    return this;

    function fileUpload() {
      var form = $form[0];
      if ($(":input[name=submit],:input[id=submit]", form).length) {
        alert('Error: Form elements must not have name or id of "submit".');
        return;
      }
      var s = $.extend(true, {}, $.ajaxSettings, options);
      s.context = s.context || s;
      var id = "jqFormIO" + (new Date().getTime()),
          fn = "_" + id;
      var $io = $('<iframe id="' + id + '" name="' + id + '" src="' + s.iframeSrc + '" />');
      var io = $io[0];
      $io.css({
        position: "absolute",
        top: "-1000px",
        left: "-1000px"
      });
      var xhr = {
        aborted: 0,
        responseText: null,
        responseXML: null,
        status: 0,
        statusText: "n/a",
        getAllResponseHeaders: function() {},
        getResponseHeader: function() {},
        setRequestHeader: function() {},
        abort: function() {
          log("aborting upload...");
          var e = "aborted";
          this.aborted = 1;
          $io.attr("src", s.iframeSrc);
          xhr.error = e;
          s.error && s.error.call(s.context, xhr, "error", e);
          g && $.event.trigger("ajaxError", [xhr, s, e]);
          s.complete && s.complete.call(s.context, xhr, "error");
        }
      };
      var g = s.global;
      if (g && !$.active++) {
        $.event.trigger("ajaxStart");
      }
      if (g) {
        $.event.trigger("ajaxSend", [xhr, s]);
      }
      if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
        if (s.global) {
          $.active--;
        }
        return;
      }
      if (xhr.aborted) {
        return;
      }
      var timedOut = 0;
      var sub = form.clk;
      if (sub) {
        var n = sub.name;
        if (n && !sub.disabled) {
          s.extraData = s.extraData || {};
          s.extraData[n] = sub.value;
          if (sub.type == "image") {
            s.extraData[n + ".x"] = form.clk_x;
            s.extraData[n + ".y"] = form.clk_y;
          }
        }
      }
      function doSubmit() {
        var t = $form.attr("target"),
            a = $form.attr("action");
        form.setAttribute("target", id);
        if (form.getAttribute("method") != "POST") {
          form.setAttribute("method", "POST");
        }
        if (form.getAttribute("action") != s.url) {
          form.setAttribute("action", s.url);
        }
        if (!s.skipEncodingOverride) {
          $form.attr({
            encoding: "multipart/form-data",
            enctype: "multipart/form-data"
          });
        }
        if (s.timeout) {
          setTimeout(function() {
            timedOut = true;
            cb();
          }, s.timeout);
        }
        var extraInputs = [];
        try {
          if (s.extraData) {
            for (var n in s.extraData) {
              extraInputs.push($('<input type="hidden" name="' + n + '" value="' + s.extraData[n] + '" />').appendTo(form)[0]);
            }
          }
          $io.appendTo("body");
          io.attachEvent ? io.attachEvent("onload", cb) : io.addEventListener("load", cb, false);
          form.submit();
        } finally {
          form.setAttribute("action", a);
          if (t) {
            form.setAttribute("target", t);
          } else {
            $form.removeAttr("target");
          }
          $(extraInputs).remove();
        }
      }
      if (s.forceSync) {
        doSubmit();
      } else {
        setTimeout(doSubmit, 10);
      }
      var data, doc, domCheckCount = 50;

      function cb() {
        if (xhr.aborted) {
          return;
        }
        var doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
        if (!doc || doc.location.href == s.iframeSrc) {
          return;
        }
        io.detachEvent ? io.detachEvent("onload", cb) : io.removeEventListener("load", cb, false);
        var ok = true;
        try {
          if (timedOut) {
            throw "timeout";
          }
          var isXml = s.dataType == "xml" || doc.XMLDocument || $.isXMLDoc(doc);
          log("isXml=" + isXml);
          if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == "")) {
            if (--domCheckCount) {
              log("requeing onLoad callback, DOM not available");
              setTimeout(cb, 250);
              return;
            }
          }
          xhr.responseText = doc.body ? doc.body.innerHTML : doc.documentElement ? doc.documentElement.innerHTML : null;
          xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
          xhr.getResponseHeader = function(header) {
            var headers = {
              "content-type": s.dataType
            };
            return headers[header];
          };
          var scr = /(json|script)/.test(s.dataType);
          if (scr || s.textarea) {
            var ta = doc.getElementsByTagName("textarea")[0];
            if (ta) {
              xhr.responseText = ta.value;
            } else {
              if (scr) {
                var pre = doc.getElementsByTagName("pre")[0];
                var b = doc.getElementsByTagName("body")[0];
                if (pre) {
                  xhr.responseText = pre.textContent;
                } else {
                  if (b) {
                    xhr.responseText = b.innerHTML;
                  }
                }
              }
            }
          } else {
            if (s.dataType == "xml" && !xhr.responseXML && xhr.responseText != null) {
              xhr.responseXML = toXml(xhr.responseText);
            }
          }
          data = httpData(xhr, s.dataType, s);
        } catch (e) {
          log("error caught:", e);
          ok = false;
          xhr.error = e;
          s.error && s.error.call(s.context, xhr, "error", e);
          g && $.event.trigger("ajaxError", [xhr, s, e]);
        }
        if (xhr.aborted) {
          log("upload aborted");
          ok = false;
        }
        if (ok) {
          s.success && s.success.call(s.context, data, "success", xhr);
          g && $.event.trigger("ajaxSuccess", [xhr, s]);
        }
        g && $.event.trigger("ajaxComplete", [xhr, s]);
        if (g && !--$.active) {
          $.event.trigger("ajaxStop");
        }
        s.complete && s.complete.call(s.context, xhr, ok ? "success" : "error");
        setTimeout(function() {
          $io.removeData("form-plugin-onload");
          $io.remove();
          xhr.responseXML = null;
        }, 100);
      }
      var toXml = $.parseXML ||
      function(s, doc) {
        if (window.ActiveXObject) {
          doc = new ActiveXObject("Microsoft.XMLDOM");
          doc.async = "false";
          doc.loadXML(s);
        } else {
          doc = (new DOMParser()).parseFromString(s, "text/xml");
        }
        return (doc && doc.documentElement && doc.documentElement.nodeName != "parsererror") ? doc : null;
      };
      var parseJSON = $.parseJSON ||
      function(s) {
        return window["eval"]("(" + s + ")");
      };
      var httpData = function(xhr, type, s) {
        var ct = xhr.getResponseHeader("content-type") || "",
            xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
            data = xml ? xhr.responseXML : xhr.responseText;
        if (xml && data.documentElement.nodeName === "parsererror") {
          $.error && $.error("parsererror");
        }
        if (s && s.dataFilter) {
          data = s.dataFilter(data, type);
        }
        if (typeof data === "string") {
          if (type === "json" || !type && ct.indexOf("json") >= 0) {
            data = parseJSON(data);
          } else {
            if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
              $.globalEval(data);
            }
          }
        }
        return data;
      };
    }
  };
  $.fn.ajaxForm = function(options) {
    if (this.length === 0) {
      var o = {
        s: this.selector,
        c: this.context
      };
      if (!$.isReady && o.s) {
        log("DOM not ready, queuing ajaxForm");
        $(function() {
          $(o.s, o.c).ajaxForm(options);
        });
        return this;
      }
      log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
      return this;
    }
    return this.ajaxFormUnbind().bind("submit.form-plugin", function(e) {
      if (!e.isDefaultPrevented()) {
        e.preventDefault();
        $(this).ajaxSubmit(options);
      }
    }).bind("click.form-plugin", function(e) {
      var target = e.target;
      var $el = $(target);
      if (!($el.is(":submit,input:image"))) {
        var t = $el.closest(":submit");
        if (t.length == 0) {
          return;
        }
        target = t[0];
      }
      var form = this;
      form.clk = target;
      if (target.type == "image") {
        if (e.offsetX != undefined) {
          form.clk_x = e.offsetX;
          form.clk_y = e.offsetY;
        } else {
          if (typeof $.fn.offset == "function") {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
          } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
          }
        }
      }
      setTimeout(function() {
        form.clk = form.clk_x = form.clk_y = null;
      }, 100);
    });
  };
  $.fn.ajaxFormUnbind = function() {
    return this.unbind("submit.form-plugin click.form-plugin");
  };
  $.fn.formToArray = function(semantic) {
    var a = [];
    if (this.length === 0) {
      return a;
    }
    var form = this[0];
    var els = semantic ? form.getElementsByTagName("*") : form.elements;
    if (!els) {
      return a;
    }
    var i, j, n, v, el, max, jmax;
    for (i = 0, max = els.length; i < max; i++) {
      el = els[i];
      n = el.name;
      if (!n) {
        continue;
      }
      if (semantic && form.clk && el.type == "image") {
        if (!el.disabled && form.clk == el) {
          a.push({
            name: n,
            value: $(el).val()
          });
          a.push({
            name: n + ".x",
            value: form.clk_x
          }, {
            name: n + ".y",
            value: form.clk_y
          });
        }
        continue;
      }
      v = $.fieldValue(el, true);
      if (v && v.constructor == Array) {
        for (j = 0, jmax = v.length; j < jmax; j++) {
          a.push({
            name: n,
            value: v[j]
          });
        }
      } else {
        if (v !== null && typeof v != "undefined") {
          a.push({
            name: n,
            value: v
          });
        }
      }
    }
    if (!semantic && form.clk) {
      var $input = $(form.clk),
          input = $input[0];
      n = input.name;
      if (n && !input.disabled && input.type == "image") {
        a.push({
          name: n,
          value: $input.val()
        });
        a.push({
          name: n + ".x",
          value: form.clk_x
        }, {
          name: n + ".y",
          value: form.clk_y
        });
      }
    }
    return a;
  };
  $.fn.formSerialize = function(semantic) {
    return $.param(this.formToArray(semantic));
  };
  $.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
      var n = this.name;
      if (!n) {
        return;
      }
      var v = $.fieldValue(this, successful);
      if (v && v.constructor == Array) {
        for (var i = 0, max = v.length; i < max; i++) {
          a.push({
            name: n,
            value: v[i]
          });
        }
      } else {
        if (v !== null && typeof v != "undefined") {
          a.push({
            name: this.name,
            value: v
          });
        }
      }
    });
    return $.param(a);
  };
  $.fn.fieldValue = function(successful) {
    for (var val = [], i = 0, max = this.length; i < max; i++) {
      var el = this[i];
      var v = $.fieldValue(el, successful);
      if (v === null || typeof v == "undefined" || (v.constructor == Array && !v.length)) {
        continue;
      }
      v.constructor == Array ? $.merge(val, v) : val.push(v);
    }
    return val;
  };
  $.fieldValue = function(el, successful) {
    var n = el.name,
        t = el.type,
        tag = el.tagName.toLowerCase();
    if (successful === undefined) {
      successful = true;
    }
    if (successful && (!n || el.disabled || t == "reset" || t == "button" || (t == "checkbox" || t == "radio") && !el.checked || (t == "submit" || t == "image") && el.form && el.form.clk != el || tag == "select" && el.selectedIndex == -1)) {
      return null;
    }
    if (tag == "select") {
      var index = el.selectedIndex;
      if (index < 0) {
        return null;
      }
      var a = [],
          ops = el.options;
      var one = (t == "select-one");
      var max = (one ? index + 1 : ops.length);
      for (var i = (one ? index : 0); i < max; i++) {
        var op = ops[i];
        if (op.selected) {
          var v = op.value;
          if (!v) {
            v = (op.attributes && op.attributes["value"] && !(op.attributes["value"].specified)) ? op.text : op.value;
          }
          if (one) {
            return v;
          }
          a.push(v);
        }
      }
      return a;
    }
    return $(el).val();
  };
  $.fn.clearForm = function() {
    return this.each(function() {
      $("input,select,textarea", this).clearFields();
    });
  };
  $.fn.clearFields = $.fn.clearInputs = function() {
    return this.each(function() {
      var t = this.type,
          tag = this.tagName.toLowerCase();
      if (t == "text" || t == "password" || tag == "textarea") {
        this.value = "";
      } else {
        if (t == "checkbox" || t == "radio") {
          this.checked = false;
        } else {
          if (tag == "select") {
            this.selectedIndex = -1;
          }
        }
      }
    });
  };
  $.fn.resetForm = function() {
    return this.each(function() {
      if (typeof this.reset == "function" || (typeof this.reset == "object" && !this.reset.nodeType)) {
        this.reset();
      }
    });
  };
  $.fn.enable = function(b) {
    if (b === undefined) {
      b = true;
    }
    return this.each(function() {
      this.disabled = !b;
    });
  };
  $.fn.selected = function(select) {
    if (select === undefined) {
      select = true;
    }
    return this.each(function() {
      var t = this.type;
      if (t == "checkbox" || t == "radio") {
        this.checked = select;
      } else {
        if (this.tagName.toLowerCase() == "option") {
          var $sel = $(this).parent("select");
          if (select && $sel[0] && $sel[0].type == "select-one") {
            $sel.find("option").selected(false);
          }
          this.selected = select;
        }
      }
    });
  };

  function log() {
    if ($.fn.ajaxSubmit.debug) {
      var msg = "[jquery.form] " + Array.prototype.join.call(arguments, "");
      if (window.console && window.console.log) {
        window.console.log(msg);
      } else {
        if (window.opera && window.opera.postError) {
          window.opera.postError(msg);
        }
      }
    }
  }
})(jQuery);
if (!$.curCSS) {
  $.curCSS = $.css;
}
jQuery.fn.setupExtras = function(setup, options) {
  for (var extra in setup) {
    var self = this;
    if (setup[extra] instanceof Array) {
      for (var i = 0; i < setup[extra].length; i++) {
        setup[extra][i].call(self, options);
      }
    } else {
      setup[extra].call(self, options);
    }
  }
};
jQuery.fn.exists = function() {
  return this.length > 0;
};
var $$ = function(param) {
  return $.data($(param)[0]);
};
(function($) {
  $.fn.isVisible = function() {
    return $.expr.filters.visible(this[0]);
  };
})(jQuery);
(function($) {
  $.fn.tabs = function(options) {
    options = options || {};
    this.setupExtras(options.setup || $.fn.tabs.base, options);
    if (1 < this.length) {
      throw "Id corresponds to multiple tabs!";
    }
    var tabList = $(this);
    $$(tabList).panels = $([]);
    $("li a", tabList).click(function(e) {
      e.preventDefault();
      tabList.trigger("activated", this);
      return false;
    }).each(function() {
      var panel = $($(this).attr("href"));
      $$(tabList).panels = $$(tabList).panels.add(panel);
      tabList.trigger("setupPanel", [panel]);
    });
    tabList.trigger("initialize");
    return this;
  };
  var getPanel = function(selected) {
    return $($(selected).attr("href"));
  };
  $.fn.tabs.base = {
    setupPanel: [function(options) {
      this.bind("setupPanel", function(e, selector) {
        $(selector).hide();
      });
    }],
    initialize: [function(options) {
      this.bind("initialize", function() {
        var defaultTab = options.defaultTab ? $("li a[href='" + options.defaultTab + "']")[0] : $(this).find("li a:first")[0];
        $(this).trigger("activated", defaultTab);
      });
    }],
    activate: [function(options) {
      this.bind("activated", function(e, selected) {
        var panel = getPanel(selected);
        $$(this).panels.hide();
        $(panel).show();
        $(this).find("li a").removeClass("selected");
        $(selected).addClass("selected").blur();
        $(this).trigger("activation-finished", selected);
      });
    }]
  };
})(jQuery);
(function($) {
  $.widget("ui.listbox", {
    _init: function() {
      var self = this;
      $("dd", this.element).on("click", "a", function() {
        self.element.trigger("selected", $(this).attr("data-value"));
        return false;
      });
      self.element.bind("selected", function(e, value) {
        self.element.find("dd a").removeClass("selected");
        self.element.find('dd a[data-value="' + value + '"]').addClass("selected").blur();
      });
      var defaultOption = $("dd a.selected:first", self.element);
      if (0 == defaultOption.length) {
        defaultOption = $("dd a:first", self.element);
      }
      if (defaultOption) {
        defaultOption.click();
      }
    },
    value: function(value) {
      if (undefined !== value) {
        var option = this.element.find('dd a[data-value="' + value + '"]');
        if (0 < option.length) {
          option.click();
        } else {
          this.element.find("dd a.selected").removeClass("selected");
        }
      } else {
        return this.element.find("dd a.selected").attr("data-value");
      }
    }
  });
  $.extend($.ui.listbox, {
    getter: "value"
  });
})(jQuery);
(function($) {
  $.fn.grid = function(options) {
    options = options || {};
    return this.each(function() {
      var $this = $(this);
      if ($this.data("grid")) {
        return;
      }
      var grid = new Grid($this, options);
      grid.init();
      $this.data("grid", grid);
    });
  };
})(jQuery);

function Filter(options) {
  options = options || {};
  var maskFn = options.maskFn;
  var maskState = (options.mask) ? options.mask.hashtable() : undefined;
  var msgCache = (options.mask) ? {
    filter: {
      mask: options.mask
    }
  } : {};
  this.filter = function(msg) {
    if (msg.filter && msg.filter.mask) {
      maskState = msg.filter.mask.hashtable();
    }
    $.extend(msgCache, msg);
    var records = msgCache.model.records;
    if (!records) {
      return records;
    }
    var result = [];
    for (var i = 0, l = records.length; i < l; i++) {
      if (maskState[maskFn(records[i])]) {
        result.push(records[i]);
      }
    }
    msgCache.model.records = result;
    msg = $.extend(msg, msgCache);
  };
}
function Sorter(options) {
  options = options || {};
  var recordsCache = null;
  var msgCache = (options.sortInfo) ? {
    sorter: {
      sortInfo: options.sortInfo
    }
  } : {};
  this.sort = function(msg) {
    $.extend(msgCache, msg);
    if (!msgCache.model) {
      return false;
    }
    recordsCache = msgCache.model.records;
    if (!recordsCache) {
      return recordsCache;
    }
    if (recordsCache.length == 0) {
      return [];
    }
    var compare = ("string" == typeof recordsCache[0][msgCache.sorter.sortInfo.property]) ? sortCaseInsensitive : NG.sortNumeric;
    var self = this;
    if (!msgCache.sorter.sortInfo.isGlobal) {
      recordsCache.sort(function(a, b) {
        return compare(a[msgCache.sorter.sortInfo.property], b[msgCache.sorter.sortInfo.property]) * (("desc" == msgCache.sorter.sortInfo.direction) ? -1 : 1);
      });
    }
    msgCache.model.records = recordsCache;
    msg = $.extend(msg, msgCache);
  };
  var sortCaseInsensitive = function(a, b) {
    aa = a.toLowerCase();
    bb = b.toLowerCase();
    if (aa == bb) {
      return 0;
    }
    if (aa < bb) {
      return -1;
    }
    return 1;
  };
  this.sortInfo = function() {
    if (!msgCache) {
      return;
    }
    if (!msgCache.sorter) {
      return;
    }
    return msgCache.sorter.sortInfo;
  };
}
function Highlighter(options) {
  options = options || {};
  var maskFn = options.maskFn;
  var maskState = (options.mask) ? options.mask.hashtable() : undefined;
  var msgCache = (options.mask) ? {
    filter: {
      mask: options.mask
    }
  } : {};
  this.highlight = function(msg) {
    if (msg.highlighter && msg.highlighter.mask) {
      maskState = msg.highlighter.mask.hashtable();
    }
    $.extend(msgCache, msg);
    var records = msgCache.model.records;
    if (!records) {
      return records;
    }
    var result = [];
    if (!maskState) {
      return result;
    }
    for (var i = 0, l = records.length; i < l; i++) {
      if (maskState[maskFn(records[i])]) {
        result.push(i);
      }
    }
    return result;
  };
}
function Grid(element, options) {
  var self = this;
  var element = element;
  var model, records;
  var view;
  var extraOptions = options.extraOptions || {};
  var filter, isFilterOn;
  var sorter;
  var highlighter, isHighlighterOn;
  this.init = function() {
    if (options.model && options.view) {
      model = new options.model.type(options.model);
      view = options.view;
      bind("loadcomplete", render);
    }
    if (options.filter) {
      filter = new Filter(options.filter);
      if (options.filter.mask) {
        filterOn();
      }
    }
    if (options.sorter) {
      sorter = new Sorter(options.sorter);
      sorterOn();
    }
    if (options.highlighter) {
      highlighter = new Highlighter(options.highlighter);
      if (options.highlighter.mask) {
        highlighterOn();
      }
    }
  };
  this.id = function() {
    return element.attr("id");
  };
  this.reSort = function() {
    if (!sorter) {
      return;
    }
    var lastSortInfo = sorter.sortInfo();
    if (!lastSortInfo) {
      return;
    }
    this.sort(lastSortInfo.property, lastSortInfo.direction);
  };
  this.load = function(parameters) {
    renderLoading();
    var msg;
    if (parameters.model) {
      if (parameters.filter) {
        filterOn();
      }
      extraOptions.field = parameters.model.parameters.field;
      records = model.load(parameters.model ? parameters.model.parameters : parameters);
      var modelMsg = $.extend(parameters.model, {
        records: records
      });
      msg = $.extend(parameters, {
        model: modelMsg,
        extraOptions: extraOptions
      });
    } else {
      extraOptions.field = parameters.field;
      records = model.load(parameters);
      msg = {
        model: {
          parameters: parameters,
          records: records
        },
        extraOptions: extraOptions
      };
    }
    if (records == -1) {
      return false;
    }
    if (0 == records.length) {
      render(null, msg);
    }
    trigger("loadcomplete", [msg]);
  };

  function render(e, msg) {
    var html = view(msg);
    html = viewIsEmpty(html) ? emptyViewMessage() : html;
    $("tbody", element).html(html);
    fitText(msg);
    fixZeros(msg);
    trigger("rendercomplete", [msg]);
  }
  function fitText(msg) {
    if (msg.model.parameters && msg.model.parameters.params && msg.model.parameters.params.fitText) {
      setTimeout(function() {
        var fitText = msg.model.parameters.params.fitText;
        $(fitText.container).fitText(fitText.options);
      }, 0);
    }
  }
  function fixZeros(msg) {
    if (msg.model.parameters && msg.model.parameters.params && msg.model.parameters.params.fixZeros) {
      $(document).triggerHandler("fix-zeros", [$("td", element)]);
    }
  }
  function renderLoading() {
    var $tbody = $("tbody ", element);
    var height = $tbody.height();
    $tbody.html('<tr style="height: ' + height + 'px;"><td colspan="99"><div style="position: relative;"><div class="stats-loading"><div class="loading-text">Loading..</div></div></div></td></tr>');
  }
  function viewIsEmpty(html) {
    return html == "";
  }
  function emptyViewMessage() {
    return '<tr><td class="note empty" colspan="99">No current records available..</td></tr>';
  }
  this.filtrate = function(mask) {
    if (!isFilterOn) {
      filterOn();
    }
    var msg = {
      model: {
        records: records
      },
      filter: {
        mask: mask
      }
    };
    filtrate(null, msg);
    return this;
  };

  function filtrate(e, msg) {
    filter.filter(msg);
    trigger("filtercomplete", [msg]);
  }
  function filterOn() {
    if (sorter) {
      unbind("loadcomplete", sort);
      bind("loadcomplete", filtrate);
      bind("filtercomplete", sort);
    } else {
      unbind("loadcomplete", render);
      bind("loadcomplete", filtrate);
      bind("filtercomplete", render);
    }
    isFilterOn = true;
  }
  this.filterOff = function() {
    if (sorter) {
      unbind("loadcomplete", filtrate);
      unbind("filtercomplete", sort);
      bind("loadcomplete", sort);
    } else {
      unbind("loadcomplete", filtrate);
      unbind("filtercomplete", render);
      bind("loadcomplete", render);
    }
    isFilterOn = false;
    trigger("loadcomplete", [{
      model: {
        records: records
      }
    }]);
    return this;
  };
  this.sort = function(property, direction, isGlobal) {
    var msg = {
      sorter: {
        sortInfo: {
          property: property,
          direction: direction,
          isGlobal: isGlobal
        }
      }
    };
    sort(null, msg);
    return this;
  };

  function sort(e, msg) {
    sorter.sort(msg);
    trigger("sortcomplete", [msg]);
  }
  function sorterOn() {
    if (isFilterOn) {
      unbind("filtercomplete", render);
      bind("filtercomplete", sort);
      bind("sortcomplete", render);
    } else {
      unbind("loadcomplete", render);
      bind("loadcomplete", sort);
      bind("sortcomplete", render);
    }
    bind("rendercomplete", markSortColumn);
    $("th.sortable", element).click(function() {
      var $this = $(this);
      property = $this.attr("data-property");
      direction = !($this.hasClass("asc") || $this.hasClass("desc")) ? ($this.attr("data-default-sort-dir") || "desc") : ($this.hasClass("desc") ? "asc" : "desc");
      self.sort(property, direction, $this.hasClass("global"));
      return false;
    });
  }
  function markSortColumn(e, msg) {
    if (msg.sorter) {
      $("th.sortable", element).removeClass("asc desc");
      $("th[data-property=" + msg.sorter.sortInfo.property + "]", element).addClass(msg.sorter.sortInfo.direction);
      $("tbody td.sorted", element).removeClass("sorted");
      var index = $("thead tr:last th", element).index($('th[data-property="' + msg.sorter.sortInfo.property + '"]', element));
      $("tbody tr td:nth-child(" + (index + 1) + ")", element).addClass("sorted");
    }
  }
  this.highlight = function(mask) {
    if (!isHighlighterOn) {
      highlighterOn();
    }
    var msg = {
      model: {
        records: records
      },
      highlighter: {
        mask: mask
      }
    };
    highlight(null, msg);
    return this;
  };

  function highlight(e, msg) {
    removeHighlight();
    var indexes = highlighter.highlight(msg);
    var highlighted = false;
    for (var i = 0, l = indexes.length; i < l; i++) {
      var $row = $("tbody tr:nth-child(" + (indexes[i] + 1) + ")", element);
      $row.addClass("highlight");
      highlighted = true;
    }
    if (highlighted) {
      scrollToHighlightedIfNotVisible();
    }
  }
  function scrollToHighlightedIfNotVisible() {
    if (!NG.isScrolledIntoView(element)) {
      element[0].scrollIntoView();
    }
  }
  function highlighterOn() {
    bind("rendercomplete", highlight);
    isHighlighterOn = true;
  }
  this.highlighterOff = function() {
    unbind("rendercomplete", highlight);
    isHighlighterOn = false;
    removeHighlight();
    return this;
  };

  function removeHighlight() {
    $("tbody tr", element).removeClass("highlight");
  }
  function bind(name, fn) {
    element.bind(name, fn);
  }
  function unbind(name, fn) {
    element.unbind(name, fn);
  }
  function trigger(name, data) {
    element.triggerHandler(name, data);
  }
}(function($) {
  $.fn.messageBox = function(options) {
    options = options || {};
    return this.each(function() {
      var $item = $(this);
      var $box;
      var timeToLive = options.timeToLive || 1000;
      var align = options.align || "right";
      var removeAfter = false;
      var messageText = options.messageText || "(Empty)";
      var classes = options.classes || "";
      var icon = options.icon || "";
      if (icon != "") {
        icon = '<span class="with-solo-icon is-default-transparent rc"><span class="ui-icon ' + options.icon + '"/></span></span>';
      }
      if (options.id) {
        removeAfter = true;
        $box = $("#" + options.id).hide();
        $box.append(icon);
      } else {
        var html = [];
        html.push("<div ");
        html.push('class="messageBox" >');
        html.push('<span class="rc text ' + classes + '">' + messageText + "</span>");
        html.push("</div>");
        $box = $(html.join(" "));
      }
      var elementOffset = $item.offset();
      var left = elementOffset.left + (options.leftMargin || 0);
      var top = elementOffset.top + (options.topMargin || 0);
      if (align == "right") {
        left += $item.width();
      }
      if (align == "left") {
        left -= (messageText.length);
      }
      if (align == "top") {
        top -= $item.height();
      }
      if (align == "bottom") {
        top += $item.height();
      }
      $box.css("left", left).css("top", top).appendTo("body").fadeIn();
      if (timeToLive != -1) {
        setTimeout(function() {
          if (!removeAfter) {
            $box.remove();
            return false;
          }
          $box.fadeOut();
        }, timeToLive);
      }
    });
  };
})(jQuery);
(function($) {
  $.fn.configPanel = function(options) {
    var activePanel = null;

    function show(id) {
      if (null != activePanel) {
        $(activePanel + "-toggle-button").click();
      }
      var panel = $(id);
      panel.show();
      if (options && options.offsetParent) {
        panel.position({
          my: "right top",
          at: "right bottom",
          of: $(options.offsetParent),
          offset: "0 3"
        });
      }
      $(id + "-toggle-button").addClass("ui-state-active").blur();
      activePanel = id;
    }
    function hide(id) {
      console.log(id);
      $(id).hide();
      $(id + "-toggle-button").removeClass("ui-state-active").blur();
      activePanel = null;
    }
    return this.each(function() {
      var id = this.id;
      var that = this;
      var $toggleButton = $("#" + id + "-toggle-button");
      $toggleButton.on("click", function() {
        if (!$toggleButton.hasClass("ui-state-active")) {
          show("#" + id);
        } else {
          hide("#" + id);
        }
        return false;
      });
      $("#" + id + "-close-button").on("click", function() {
        $("#" + id + "-toggle-button").click();
        return false;
      });
      $("#" + id + "-toggle-button").on("hide", function() {
        console.log("div hidden");
      });
    });
  };
})(jQuery);
(function($) {
  $.fn.accumulate = function(options) {
    options = options || {};

    function view(row) {
      var t = [];
      t.push("<tr>");
      for (var i = 0; i < row.meta.columnCount; i++) {
        t.push('<td style="' + (options["col" + i] && options["col" + i].style ? options["col" + i].style : "") + '">');
        t.push("<strong>");
        if (columnHasFixedDisplay(i)) {
          t.push(options["col" + i].display);
        } else {
          if (row.data[i]) {
            var value = columnHasAverageValue(i) ? (row.data[i].total / (row.data[i].count)) : row.data[i].total;
            t.push(columnHasFixedDisplayFunction(i) ? options["col" + i].displayFunction(value) : value);
          }
        }
        t.push("</strong>");
        t.push("</td>");
      }
      t.push("</tr>");
      return t.join("");
    }
    function columnHasAverageValue(i) {
      return options["col" + i] && "average" == options["col" + i].type;
    }
    function columnHasFixedDisplay(i) {
      return options["col" + i] && options["col" + i].display;
    }
    function columnHasFixedDisplayFunction(i) {
      return options["col" + i] && options["col" + i].displayFunction;
    }
    function columnHasAccumulatorFunction(i) {
      return options["col" + i] && options["col" + i].accumulatorFunction;
    }
    return this.each(function() {
      var $this = $(this);
      var rows = $("tbody tr", $this);
      var accumulatedRow = {
        meta: {
          rowCount: rows.length,
          columnCount: 0
        },
        data: {}
      };
      rows.each(function() {
        var $columns = $("td", $(this));
        accumulatedRow.meta.columnCount = $columns.length;
        for (var i = 0; i < $columns.length; i++) {
          var value = $columns[i].innerHTML;
          if (columnHasAccumulatorFunction(i)) {
            accumulatedRow.data[i] = options["col" + i].accumulatorFunction(accumulatedRow.data[i], value, $columns, i);
          } else {
            if (NG.isNumeric(value)) {
              if (!accumulatedRow.data[i]) {
                accumulatedRow.data[i] = {
                  count: 0,
                  total: (NG.isFloat(value) ? 0 : 0)
                };
              }
              accumulatedRow.data[i].count++;
              accumulatedRow.data[i].total += NG.isFloat(value) ? parseFloat(value) : parseInt(value);
            }
          }
        }
      });
      $("tbody", $this).append(view(accumulatedRow));
    });
  };
})(jQuery);
(function($) {
  $.fn.fitText = function(options) {
    options = options || {};
    return this.each(function() {
      var $text = $(this);
      var originalText = $text.text();
      var temp = originalText;
      if (options.width < $text.outerWidth()) {
        while (options.width < $text.outerWidth()) {
          $text.text(temp = temp.substr(0, temp.length - 1));
        }
        $text.text(temp = temp.substr(0, temp.length - 3));
        $text.append("...");
        $text.attr("title", originalText);
      }
    });
  };
})(jQuery);
jQuery.fn.pulse = function(properties, duration, numTimes, interval, fireEvent) {
  if (duration === undefined || duration < 0) {
    duration = 500;
  }
  if (duration < 0) {
    duration = 500;
  }
  if (numTimes === undefined) {
    numTimes = 1;
  }
  if (numTimes < 0) {
    numTimes = 0;
  }
  if (interval === undefined || interval < 0) {
    interval = 0;
  }
  return this.each(function() {
    var $this = jQuery(this);
    var origProperties = {};
    for (property in properties) {
      origProperties[property] = $this.css(property);
    }
    for (var i = 0; i < numTimes; i++) {
      var id = window.setTimeout(function() {
        $this.animate(properties, {
          duration: duration / 2,
          complete: function() {
            $this.animate(origProperties, duration / 2);
          }
        });
      }, (duration + interval) * i);
    }
  });
};
jQuery.curCSS = jQuery.css;
$.fn.mondoGoal = function(onFormPlayers, wrapperClass) {
  var plugin = this;
  plugin.init = function() {
    var layoutOffset = $("#layout-wrapper").offset();
    for (var i = 0; i < onFormPlayers.length; i++) {
      var onFormPlayer = onFormPlayers[i];
      var $playerRating = $(this).find(wrapperClass + "[data-playerId=" + onFormPlayer.playerId + "] .player-rating");
      $playerRating.addClass("mondogoal-marker");
      $playerRating.append(this.getTooltip(onFormPlayer));
      $playerRating.mouseover(function() {
        var $self = $(this);
        var offset = $self.offset();
        var $tooltip = $self.find(".mondogoal-tooltip");
        if (offset.left - layoutOffset.left < $tooltip.width()) {
          $tooltip.css("right", -$tooltip.width());
        }
        if ($("#layout-wrapper").height() < (offset.top + $self.height())) {
          $tooltip.css("top", -$tooltip.height());
        }
      });
      $playerRating.find(".mondogoal-tooltip").click(function() {
        ga("send", "event", "MondoGoal", window.location.href);
        window.setTimeout(function() {
          window.open("http://tracking.mondogoal.com/aff_c?offer_id=28&aff_id=1020&aff_sub=tooltips");
        }, 100);
      });
    }
  };
  plugin.getTooltip = function(onFormPlayer) {
    var html = "";
    html += "<div class='mondogoal-tooltip'>";
    html += "<span class='iconize iconize-icon-left' >" + "Premier League" + "<span class='ui-icon country flg-" + onFormPlayer.countryCode + "'></span></span>";
    html += "<span class='mondogoal-tooltip-header'>Top " + this.getPositionNumber(onFormPlayer.position) + " In Form " + onFormPlayer.position + "</span>";
    html += "<span class='mondogoal-tooltip-info'>Pick him on your <span class='mondogoal-name'>MondoGoal</span> fantasy team now</br>";
    html += "<i>Play the 'You vs WhoScored'</i> mini-league every matchday</br>Win cash & prizes!</span>";
    html += "<div><dl class='mondogoal-tooltip-stats'><dt>" + onFormPlayer.playerName + " Rating:</dt>";
    html += "<dd>vs " + onFormPlayer.matches[0].against + ": <span>" + onFormPlayer.matches[0].rating + "</span></dd>";
    html += "<dd>vs " + onFormPlayer.matches[1].against + ": <span>" + onFormPlayer.matches[1].rating + "</span></dd>";
    html += "<dd>vs " + onFormPlayer.matches[2].against + ": <span>" + onFormPlayer.matches[2].rating + "</span></dd></dl>" + "<div class='mondogoal-logo'></div></div></div>";
    return html;
  };
  plugin.getPositionNumber = function(position) {
    switch (position) {
    case "Goalkeeper":
      return "8";
    default:
      return "20";
    }
  };
  plugin.init();
};
/* iFrame Resizer (iframeSizer.min.js ) - v2.8.10 - 2015-06-21
 *  Desc: Force cross domain iframes to size to content.
 *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
 *  Copyright: (c) 2015 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */
!
function() {
  function a(a, b, c) {
    "addEventListener" in window ? a.addEventListener(b, c, !1) : "attachEvent" in window && a.attachEvent("on" + b, c);
  }
  function b() {
    var a, b = ["moz", "webkit", "o", "ms"];
    for (a = 0; a < b.length && !z; a += 1) {
      z = window[b[a] + "RequestAnimationFrame"];
    }
    z || e(" RequestAnimationFrame not supported");
  }
  function c() {
    var a = "Host page";
    return window.top !== window.self && (a = window.parentIFrame ? window.parentIFrame.getId() : "Nested host page"), a;
  }
  function d(a) {
    return w + "[" + c() + "]" + a;
  }
  function e(a) {
    t && "object" == typeof window.console && console.log(d(a));
  }
  function f(a) {
    "object" == typeof window.console && console.warn(d(a));
  }
  function g(a) {
    function b() {
      function a() {
        k(F), i(), B[G].resizedCallback(F);
      }
      g("Height"), g("Width"), l(a, F, "resetPage");
    }
    function c(a) {
      var b = a.id;
      e(" Removing iFrame: " + b), a.parentNode.removeChild(a), B[b].closedCallback(b), delete B[b], e(" --");
    }
    function d() {
      var a = E.substr(x).split(":");
      return {
        iframe: document.getElementById(a[0]),
        id: a[0],
        height: a[1],
        width: a[2],
        type: a[3]
      };
    }
    function g(a) {
      var b = Number(B[G]["max" + a]),
          c = Number(B[G]["min" + a]),
          d = a.toLowerCase(),
          f = Number(F[d]);
      if (c > b) {
        throw new Error("Value for min" + a + " can not be greater than max" + a);
      }
      e(" Checking " + d + " is in range " + c + "-" + b), c > f && (f = c, e(" Set " + d + " to min value")), f > b && (f = b, e(" Set " + d + " to max value")), F[d] = "" + f;
    }
    function m() {
      function b() {
        function a() {
          e(" Checking connection is from allowed list of origins: " + d);
          var a;
          for (a = 0; a < d.length; a++) {
            if (d[a] === c) {
              return !0;
            }
          }
          return !1;
        }
        function b() {
          return e(" Checking connection is from: " + f), c === f;
        }
        return d.constructor === Array ? a() : b();
      }
      var c = a.origin,
          d = B[G].checkOrigin,
          f = F.iframe.src.split("/").slice(0, 3).join("/");
      if (d && "" + c != "null" && !b()) {
        throw new Error("Unexpected message received from: " + c + " for " + F.iframe.id + ". Message was: " + a.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");
      }
      return !0;
    }
    function n() {
      return w === ("" + E).substr(0, x);
    }
    function o() {
      var a = F.type in {
        "true": 1,
        "false": 1,
        undefined: 1
      };
      return a && e(" Ignoring init message from meta parent page"), a;
    }
    function p(a) {
      return E.substr(E.indexOf(":") + v + a);
    }
    function q(a) {
      e(" MessageCallback passed: {iframe: " + F.iframe.id + ", message: " + a + "}"), B[G].messageCallback({
        iframe: F.iframe,
        message: JSON.parse(a)
      }), e(" --");
    }
    function r() {
      return null === F.iframe ? (f(" IFrame (" + F.id + ") not found"), !1) : !0;
    }
    function s(a) {
      var b = a.getBoundingClientRect();
      return h(), {
        x: parseInt(b.left, 10) + parseInt(y.x, 10),
        y: parseInt(b.top, 10) + parseInt(y.y, 10)
      };
    }
    function u(a) {
      function b() {
        y = g, z(), e(" --");
      }
      function c() {
        return {
          x: Number(F.width) + d.x,
          y: Number(F.height) + d.y
        };
      }
      var d = a ? s(F.iframe) : {
        x: 0,
        y: 0
      },
          g = c();
      e(" Reposition requested from iFrame (offset x:" + d.x + " y:" + d.y + ")"), window.top !== window.self ? window.parentIFrame ? a ? window.parentIFrame.scrollToOffset(g.x, g.y) : window.parentIFrame.scrollTo(F.width, F.height) : f(" Unable to scroll to requested position, window.parentIFrame not found") : b();
    }
    function z() {
      !1 !== B[G].scrollCallback(y) && i();
    }
    function A(a) {
      function b(a) {
        var b = s(a);
        e(" Moving to in page link (#" + c + ") at x: " + b.x + " y: " + b.y), y = {
          x: b.x,
          y: b.y
        }, z(), e(" --");
      }
      var c = a.split("#")[1] || "",
          d = decodeURIComponent(c),
          f = document.getElementById(d) || document.getElementsByName(d)[0];
      window.top !== window.self ? window.parentIFrame ? window.parentIFrame.moveToAnchor(c) : e(" In page link #" + c + " not found and window.parentIFrame not found") : f ? b(f) : e(" In page link #" + c + " not found");
    }
    function C() {
      switch (F.type) {
      case "close":
        c(F.iframe);
        break;
      case "message":
        q(p(6));
        break;
      case "scrollTo":
        u(!1);
        break;
      case "scrollToOffset":
        u(!0);
        break;
      case "inPageLink":
        A(p(9));
        break;
      case "reset":
        j(F);
        break;
      case "init":
        b(), B[G].initCallback(F.iframe);
        break;
      default:
        b();
      }
    }
    function D(a) {
      var b = !0;
      return B[a] || (b = !1, f(F.type + " No settings for " + a + ". Message was: " + E)), b;
    }
    var E = a.data,
        F = {},
        G = null;
    n() && (F = d(), G = F.id, !o() && D(G) && (t = B[G].log, e(" Received: " + E), r() && m() && (B[G].firstRun = !1, C())));
  }
  function h() {
    null === y && (y = {
      x: void 0 !== window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft,
      y: void 0 !== window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop
    }, e(" Get page position: " + y.x + "," + y.y));
  }
  function i() {
    null !== y && (window.scrollTo(y.x, y.y), e(" Set page position: " + y.x + "," + y.y), y = null);
  }
  function j(a) {
    function b() {
      k(a), m("reset", "reset", a.iframe, a.id);
    }
    e(" Size reset requested by " + ("init" === a.type ? "host page" : "iFrame")), h(), l(b, a, "init");
  }
  function k(a) {
    function b(b) {
      a.iframe.style[b] = a[b] + "px", e(" IFrame (" + c + ") " + b + " set to " + a[b] + "px");
    }
    var c = a.iframe.id;
    B[c].sizeHeight && b("height"), B[c].sizeWidth && b("width");
  }
  function l(a, b, c) {
    c !== b.type && z ? (e(" Requesting animation frame"), z(a)) : a();
  }
  function m(a, b, c, d) {
    c && c.contentWindow ? (e("[" + a + "] Sending msg to iframe (" + b + ")"), c.contentWindow.postMessage(w + b, "*")) : (f("[" + a + "] IFrame not found"), B[d] && delete B[d]);
  }
  function n(b) {
    function c() {
      function a(a) {
        1 / 0 !== B[o][a] && 0 !== B[o][a] && (n.style[a] = B[o][a] + "px", e(" Set " + a + " = " + B[o][a] + "px"));
      }
      a("maxHeight"), a("minHeight"), a("maxWidth"), a("minWidth");
    }
    function d(a) {
      return "" === a && (n.id = a = "iFrameResizer" + s++, t = (b || {}).log, e(" Added missing iframe ID: " + a + " (" + n.src + ")")), a;
    }
    function f() {
      e(" IFrame scrolling " + (B[o].scrolling ? "enabled" : "disabled") + " for " + o), n.style.overflow = !1 === B[o].scrolling ? "hidden" : "auto", n.scrolling = !1 === B[o].scrolling ? "no" : "yes";
    }
    function g() {
      ("number" == typeof B[o].bodyMargin || "0" === B[o].bodyMargin) && (B[o].bodyMarginV1 = B[o].bodyMargin, B[o].bodyMargin = "" + B[o].bodyMargin + "px");
    }
    function h() {
      return o + ":" + B[o].bodyMarginV1 + ":" + B[o].sizeWidth + ":" + B[o].log + ":" + B[o].interval + ":" + B[o].enablePublicMethods + ":" + B[o].autoResize + ":" + B[o].bodyMargin + ":" + B[o].heightCalculationMethod + ":" + B[o].bodyBackground + ":" + B[o].bodyPadding + ":" + B[o].tolerance + ":" + B[o].enableInPageLinks + ":" + B[o].resizeFrom;
    }
    function i(b) {
      a(n, "load", function() {
        var a = B[o].firstRun;
        m("iFrame.onload", b, n), !a && B[o].heightCalculationMethod in A && j({
          iframe: n,
          height: 0,
          width: 0,
          type: "init"
        });
      }), m("init", b, n);
    }
    function k(a) {
      if ("object" != typeof a) {
        throw new TypeError("Options is not an object.");
      }
    }
    function l(a) {
      a = a || {}, B[o] = {
        firstRun: !0
      }, k(a);
      for (var b in D) {
        D.hasOwnProperty(b) && (B[o][b] = a.hasOwnProperty(b) ? a[b] : D[b]);
      }
      t = B[o].log;
    }
    var n = this,
        o = d(n.id);
    l(b), f(), c(), g(), i(h());
  }
  function o(a, b) {
    null === C && (C = setTimeout(function() {
      C = null, a();
    }, b));
  }
  function p() {
    function a(a) {
      return "parent" === B[a].resizeFrom && B[a].autoResize && !B[a].firstRun;
    }
    o(function() {
      for (var b in B) {
        a(b) && m("Window resize", "resize", document.getElementById(b), b);
      }
    }, 66);
  }
  function q() {
    function c(a, b) {
      if (!a.tagName) {
        throw new TypeError("Object is not a valid DOM element");
      }
      if ("IFRAME" !== a.tagName.toUpperCase()) {
        throw new TypeError("Expected <IFRAME> tag, found <" + a.tagName + ">.");
      }
      n.call(a, b);
    }
    return b(), a(window, "message", g), a(window, "resize", p), function(a, b) {
      switch (typeof b) {
      case "undefined":
      case "string":
        Array.prototype.forEach.call(document.querySelectorAll(b || "iframe"), function(b) {
          c(b, a);
        });
        break;
      case "object":
        c(b, a);
        break;
      default:
        throw new TypeError("Unexpected data type (" + typeof b + ").");
      }
    };
  }
  function r(a) {
    a.fn.iFrameResize = function(a) {
      return this.filter("iframe").each(function(b, c) {
        n.call(c, a);
      }).end();
    };
  }
  var s = 0,
      t = !1,
      u = "message",
      v = u.length,
      w = "[iFrameSizer]",
      x = w.length,
      y = null,
      z = window.requestAnimationFrame,
      A = {
      max: 1,
      scroll: 1,
      bodyScroll: 1,
      documentElementScroll: 1
      },
      B = {},
      C = null,
      D = {
      autoResize: !0,
      bodyBackground: null,
      bodyMargin: null,
      bodyMarginV1: 8,
      bodyPadding: null,
      checkOrigin: !0,
      enableInPageLinks: !1,
      enablePublicMethods: !1,
      heightCalculationMethod: "offset",
      interval: 32,
      log: !1,
      maxHeight: 1 / 0,
      maxWidth: 1 / 0,
      minHeight: 0,
      minWidth: 0,
      resizeFrom: "parent",
      scrolling: !1,
      sizeHeight: !0,
      sizeWidth: !1,
      tolerance: 0,
      closedCallback: function() {},
      initCallback: function() {},
      messageCallback: function() {},
      resizedCallback: function() {},
      scrollCallback: function() {
        return !0;
      }
      };
  window.jQuery && r(jQuery), "function" == typeof define && define.amd ? define([], q) : "object" == typeof module && "object" == typeof module.exports ? module.exports = q() : window.iFrameResize = window.iFrameResize || q();
}();
/*
  * Copyright (c) 2009 Next-Game Ltd.
  */

function isBlank(value) {
  return 0 == value.replace(/\s+/g, "").length;
}
var NG = {
  renderDustTemplate: function(templateName, data, callback) {
    NG.loadDustTemplate(templateName, function() {
      dust.render(templateName, data, function(err, out) {
        if (err) {
          console.log("Dust render error: {0}".format(err));
          return;
        }
        if (callback) {
          callback(out);
        }
      });
    });
  },
  loadDustTemplate: function(templateName, callback) {
    if (dust.cache[templateName]) {
      if (callback) {
        callback();
      }
      return;
    } else {
      if (!dust.lockLoad) {
        dust.lockLoad = {};
      }
      if (!dust.lockLoad[templateName]) {
        dust.lockLoad[templateName] = true;
        $.get("/js/templates/" + templateName + ".tl", function(templateData) {
          if (!dust) {
            dust.lockLoad[templateName] = false;
            console.log("Dust is not loaded.. dust please..");
            return;
          }
          if (!dust.cache[templateName]) {
            var compiled = dust.compile(templateData, templateName);
            dust.loadSource(compiled);
          }
          if (callback) {
            callback();
          }
          dust.lockLoad[templateName] = false;
        });
      } else {
        setTimeout(function() {
          NG.loadDustTemplate(templateName, callback, 0);
        }, 100);
      }
    }
  },
  querystring: function(o) {
    if (!o) {
      return "";
    }
    o = NG.sortByFieldName(o);
    var a = [];
    for (p in o) {
      if (null != o[p] && undefined !== o[p]) {
        a.push(p + "=" + o[p]);
      }
    }
    return a.join("&");
  },
  sortByFieldName: function(o, isDescending) {
    var sortable = [];
    sorted = {};
    for (var field in o) {
      sortable.push(field);
    }
    sortable.sort();
    for (var i = 0; i < sortable.length; i++) {
      sorted[sortable[i]] = o[sortable[i]];
    }
    return !isDescending ? sorted : sorted.reverse();
  },
  sortByFieldValue: function(o, isDescending) {
    var invertedObject = NG.invert(o);
    var sortedInvertedObjectByValue = NG.sortByFieldName(invertedObject, isDescending);
    return NG.invert(sortedInvertedObjectByValue);
  },
  remove: function(o, p) {
    var result = o[p];
    delete o[p];
    return result;
  },
  isFunction: function(o) {
    return Object.prototype.toString.call(o) === "[object Function]";
  },
  isArray: function(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
  },
  toArray: (function(slice) {
    return function toArray(object) {
      return slice.call(object, 0);
    };
  })(Array.prototype.slice),
  binarySearch: function(o, v, i, f) {
    var h = o.length,
        l = -1,
        m;
    if (NG.isFunction(f)) {
      while (h - l > 1) {
        m = (h + l) >> 1;
        if (f(o[m]) < v) {
          l = m;
        } else {
          h = m;
        }
      }
      return (undefined !== o[h]) ? (f(o[h]) != v ? i ? h : -1 : h) : (i ? h : -1);
    } else {
      while (h - l > 1) {
        m = (h + l) >> 1;
        if (o[m] < v) {
          l = m;
        } else {
          h = m;
        }
      }
      return o[h] != v ? i ? h : -1 : h;
    }
  },
  indexOf: function(array, value, from, callback) {
    var len = array.length >>> 0;
    var from = Number(from) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0) {
      from += len;
    }
    if (callback) {
      for (; from < len; from++) {
        if (from in array && callback(array[from]) === value) {
          return from;
        }
      }
    } else {
      for (; from < len; from++) {
        if (from in array && array[from] === value) {
          return from;
        }
      }
    }
    return -1;
  },
  trim: function(str) {
    var str = str.replace(/^\s\s*/, ""),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i))) {}
    return str.slice(0, i + 1);
  },
  async: function(fun, scope) {
    setTimeout(function() {
      fun.call(scope);
    }, 1);
  },
  setTimeout: function(fun, timeout, scope) {
    return setTimeout(function() {
      fun.call(scope);
    }, timeout);
  },
  clearTimeout: function(timeoutId) {
    clearTimeout(timeoutId);
    delete timeoutId;
  },
  clearTimeoutByRef: function(object, property) {
    clearTimeout(object[property]);
    delete object[property];
  },
  replaceHtml: function(el, html) {
    var oldEl = el;
/*@cc_on // Pure innerHTML is slightly faster in IE
        oldEl.innerHTML = html;
        return oldEl;
        @*/
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    return newEl;
  },
  isNumeric: function(input) {
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
  },
  numberIsGreaterThan: function(value, opponentValue) {
    if (!(IsNumeric(value) && IsNumeric(opponentValue))) {
      return false;
    }
    return parseFloat(opponentValue) < parseFloat(value);
  },
  isFloat: function(input) {
    return /\./.test(input.toString());
  },
  roundNumber: function(number, precision, keepDotsAndZeros) {
    precision = precision || 0;
    var result = String(Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision));
    if (result.indexOf(".") < 0) {
      result += ".";
    }
    while (result.length - result.indexOf(".") <= precision) {
      result += "0";
    }
    if (precision != 0) {
      if (keepDotsAndZeros) {
        return result;
      } else {
        return parseFloat(result).toFixed(precision) / 1;
      }
    } else {
      return parseInt(result);
    }
  },
  roundNumberAsString: function(number, precision) {
    precision = precision || 0;
    var result = String(Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision));
    if (result.indexOf(".") < 0) {
      result += ".";
    }
    while (result.length - result.indexOf(".") <= precision) {
      result += "0";
    }
    return 0 != precision ? parseFloat(Math.round(result * 100) / 100).toFixed(precision) : parseInt(result);
  },
  flattenJson: function(json) {
    var nj = {},
        walk = function(j) {
        var jp;
        for (var prop in j) {
          jp = j[prop];
          if (jp.toString() === "[object Object]") {
            walk(jp);
          } else {
            nj[prop] = jp;
          }
        }
        };
    walk(json);
    return nj;
  },
  getAverage: function(value, total, precision) {
    if (0 == total) {
      return 0;
    }
    return NG.roundNumber(value / total, precision);
  },
  percentage: function(number, whole, inverse, rounder) {
    whole = parseFloat(whole);
    if (!whole) {
      whole = 100;
    }
    number = parseFloat(number);
    if (!number) {
      number = 0;
    }
    if (!whole || !number) {
      return 0;
    }
    rounder = parseFloat(rounder);
    rounder = (rounder && (!(rounder % 10) || rounder == 1)) ? rounder : 100;
    return (!inverse) ? NG.roundNumber(((number * 100) / whole) * rounder, rounder) / rounder : NG.roundNumber(((whole * number) / 100) * rounder) / rounder;
  },
  getPercentage: function(value, total) {
    if (!value || !total) {
      return 0;
    }
    if (0 == total) {
      return 0;
    }
    return NG.roundNumber(100 * value / total);
  },
  JsonLength: function(obj) {
    if (!obj) {
      return 0;
    }
    var i = 0;
    for (var attr in obj) {
      i++;
    }
    return i;
  },
  sortNumeric: function(a, b) {
    if (!NG.isNumeric(a)) {
      a = -1;
    }
    if (!NG.isNumeric(b)) {
      b = -1;
    }
    return a - b;
  },
  sortTextAsc: function(a, b) {
    return a > b;
  },
  getDisplayNameByValue: function(o, value) {
    if (!o) {
      return null;
    }
    for (var f in o) {
      if (o[f] == value) {
        return f;
      }
    }
  },
  isScrolledIntoView: function($selector) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $selector.offset().top;
    var elemBottom = elemTop + $selector.height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  },
  invert: function(obj) {
    var new_obj = {};
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        new_obj[obj[prop]] = prop;
      }
    }
    return new_obj;
  },
  reverse: function(oObject) {
    var oResult, sKey, bErrorFound = false;
    if (Object.prototype.toString.call(oObject) === "[object Object]") {
      oResult = {};
      for (sKey in oObject) {
        if (oObject.hasOwnProperty(sKey) && !bErrorFound) {
          bErrorFound = oObject[sKey] instanceof Object;
          if (!bErrorFound) {
            if (oResult[oObject[sKey]] === undefined) {
              oResult[oObject[sKey]] = sKey;
            } else {
              if (!Object.prototype.toString.call(oResult[oObject[sKey]]) === "[object Array]") {
                oResult[oObject[sKey]] = [oResult[oObject[sKey]]];
              }
              oResult[oObject[sKey]].push(sKey);
            }
          } else {
            oResult = undefined;
          }
        }
      }
    } else {
      oResult = oObject;
    }
    return oResult;
  }
};
NG.Events = (function() {
  var $NGEVENTS = "$NGEVENTS";
  var prepare = function(fn) {
    return function(obj, type, arg, scope) {
      if (typeof type == "object") {
        for (var k in type) {
          arguments.callee(obj, k, type[k]);
        }
      } else {
        var events = obj[$NGEVENTS] = obj[$NGEVENTS] || {},
            storage = events[type] = events[type] || {
            listeners: []
            };
        fn(obj, type, arg, storage, scope);
      }
    };
  };
  var add = prepare(function(obj, type, fn, storage, scope) {
    var listeners = storage.listeners;
    for (var i = listeners.length; i--;) {
      if (listeners[i] == fn) {
        return;
      }
    }
    listeners.push({
      fn: fn,
      scope: scope || obj
    });
    return;
  });
  var remove = prepare(function(obj, type, fn, storage) {
    var listeners = storage.listeners;
    for (var i = listeners.length; i--;) {
      if (listeners[i].fn === fn) {
        listeners.splice(i, 1);
        break;
      }
    }
  });
  var fire = prepare(function(obj, type, args, storage) {
    if (!args || Object.prototype.toString.call(args) !== "[object Array]") {
      args = [args];
    }
    for (var i = 0, l = storage.listeners.length; i < l; i++) {
      storage.listeners[i].fn.apply(storage.listeners[i].scope, args);
    }
  });
  var addGlobal = function(type, fn, scope) {
    add(window, type, fn, scope);
  };
  var removeGlobal = function(type, fn) {
    remove(window, type, fn);
  };
  var fireGlobal = function(type, args) {
    fire(window, type, args);
  };
  var addOnce = prepare(function(obj, type, fn, storage) {
    add(obj, type, function() {
      remove(obj, type, arguments.callee);
      fn.apply(obj, arguments);
    });
  });
  var toggle = prepare(function(obj, type, fn, storage, toggle) {
    (toggle ? add : remove)(obj, type, fn);
  });
  return {
    add: add,
    remove: remove,
    fire: fire,
    addGlobal: addGlobal,
    removeGlobal: removeGlobal,
    fireGlobal: fireGlobal,
    addOnce: addOnce,
    toggle: toggle
  };
})();
NG.Timer = function() {
  var self, to, cb, scp, intervalId = -1;
  this.set = function(timeout, callback, scope) {
    to = (parseInt(timeout, 10) || -1);
    cb = callback;
    scp = scope;
    if (to < 0) {
      return;
    }
    cb.call(scp, to);
    if (0 == to) {
      return;
    }
    self = this;
    intervalId = setInterval(function() {
      if (0 == --to) {
        self.reset();
      }
      cb.call(scp, to);
    }, 1000);
  };
  this.reset = function() {
    clearInterval(intervalId);
    intervalId = -1;
  };
  this.active = function() {
    return (-1 < intervalId);
  };
  this.pause = function() {
    clearInterval(intervalId);
  };
  this.resume = function() {
    this.set(to, cb, scp);
  };
};
NG.Clock = {
  _date: null,
  _timezoneOffset: null,
  init: function(utc, offset) {
    var self = this;
    this._date = new Date(utc.valueOf() + offset * 60000);
    this._timezoneOffset = offset;
    setInterval(function() {
      self._date = new Date(self._date.valueOf() + 1000);
      if (0 == self._date.getSeconds()) {
        NG.Events.fire(self, "minutetick", [new Date(self._date.valueOf())]);
      }
    }, 1000);
  },
  now: function() {
    return new Date(this._date.valueOf());
  },
  utcNow: function() {
    return new Date(this._date.valueOf() - this._timezoneOffset * 60000);
  }
};
NG.Calendar = function(now) {
  var self = this,
      mode = arguments[1] || "Day",
      mask = arguments[2],
      date = now,
      isDaily = ("Day" == mode),
      isWeekly = ("Week" == mode),
      isMonthly = ("Month" == mode),
      dayList = [],
      min = arguments[3] || new Date(2000, 0, 1),
      max = arguments[4] || new Date(2012, 11, 31);
  if (hasMask()) {
    for (var year in mask) {
      if (String(year >>> 0) == year && year >>> 0 != 4294967295) {
        for (var month in mask[year]) {
          if (String(month >>> 0) == month && month >>> 0 != 4294967295) {
            for (var day in mask[year][month]) {
              if (String(day >>> 0) == day && day >>> 0 != 4294967295) {
                dayList.push(new Date(year >>> 0, month >>> 0, day >>> 0).valueOf());
              }
            }
          }
        }
      }
    }
    setMaskedDate(date);
  }
  date.setMilliseconds = date.setSeconds = date.setMinutes = date.setHours = 0;
  if (isWeekly) {} else {
    if (isMonthly) {}
  }
  function setMaskedDate(datep) {
    var search = new Date(datep.getFullYear(), datep.getMonth(), datep.getDate()).valueOf();
    if ("undefined" == typeof(dayList[search])) {
      date = new Date(dayList[getDayIndex(dayList, search)]);
    }
  }
  function addDays(num) {
    date.setDate(date.getDate() + num);
  }
  function addWeeks(num) {
    addDays(num * 7);
  }
  function addMonths(num) {
    var tmpdtm = date.getDate();
    date.setMonth(date.getMonth() + num);
    if (tmpdtm > date.getDate()) {
      addDays(-date.getDate());
    }
  }
  function fire() {
    NG.Events.fire(self, "datechanged", []);
  }
  function getDayIndex(list, value) {
    var i = -1,
        search = new Date(value),
        found = false;
    if (isMonthly) {
      search = search.getStartOfMonth();
    }
    if (isWeekly) {
      search = search.getStartOfWeek();
    }
    search = search.valueOf();
    for (var k = 0; k < list.length; k++) {
      if (search <= list[k]) {
        i = k;
        found = true;
        break;
      }
    }
    if (!found) {
      i = list.length - 1;
    }
    return i;
  }
  function hasMask() {
    var hasValue = false;
    for (var value in mask) {
      hasValue = true;
      break;
    }
    return mask && "undefined" != typeof(mask) && hasValue;
  }
  this.hasMask = function() {
    return hasMask();
  };
  this.mask = function() {
    return mask;
  };
  this.min = function() {
    return min;
  };
  this.max = function() {
    return max;
  };
  this.mode = function() {
    return mode;
  };
  this.isDaily = function() {
    return isDaily;
  };
  this.isWeekly = function() {
    return isWeekly;
  };
  this.isMonthly = function() {
    return isMonthly;
  };
  this.getDate = function() {
    return date;
  };
  this.setDate = function(datep) {
    if (hasMask()) {
      setMaskedDate(datep);
    } else {
      date = datep;
    }
    fire();
  };
  this.previousEnabled = function() {
    return min < (isWeekly ? date.getStartOfWeek() : (isMonthly ? date.getStartOfMonth() : date));
  };
  this.nextEnabled = function() {
    return (isWeekly ? date.getEndOfWeek() : (isMonthly ? date.getEndOfMonth() : date)) < max;
  };
  this.previous = function() {
    this["previous" + mode]();
    fire();
  };
  this.next = function() {
    this["next" + mode]();
    fire();
  };
  this.previousDay = function() {
    if (this.hasMask()) {
      var i = getDayIndex(dayList, date.valueOf());
      if (0 < i) {
        date = new Date(dayList[i - 1]);
      }
    } else {
      addDays(-1);
    }
    return date;
  };
  this.nextDay = function() {
    if (this.hasMask()) {
      var i = getDayIndex(dayList, date.valueOf());
      if (i < dayList.length - 1) {
        date = new Date(dayList[i + 1]);
      }
    } else {
      addDays(1);
    }
    return date;
  };
  this.previousWeek = function() {
    if (this.hasMask()) {
      var i = getDayIndex(dayList, date.valueOf()),
          week = date.getWeek(),
          newWeek = week;
      if (0 == i) {
        return;
      }
      var temp = new Date(dayList[i - 1]);
      while (week == newWeek) {
        if (0 < i) {
          temp = new Date(dayList[--i]);
          newWeek = temp.getWeek();
        } else {
          break;
        }
      }
      if (week != newWeek) {
        date = temp;
      }
    } else {
      addWeeks(-1);
    }
    return date;
  };
  this.nextWeek = function() {
    if (this.hasMask()) {
      var i = getDayIndex(dayList, date.valueOf()),
          week = date.getWeek(),
          newWeek = week;
      if (dayList.length - 1 == i) {
        return;
      }
      var temp = new Date(dayList[i + 1]);
      while (week == newWeek) {
        if (i < dayList.length - 1) {
          temp = new Date(dayList[++i]);
          newWeek = temp.getWeek();
        } else {
          break;
        }
      }
      if (week != newWeek) {
        date = temp;
      }
    } else {
      addWeeks(1);
    }
    return date;
  };
  this.previousMonth = function() {
    if (this.hasMask()) {
      var i = getDayIndex(dayList, date.valueOf()),
          month = date.getMonth(),
          newMonth = month;
      if (0 == i) {
        return;
      }
      var temp = new Date(dayList[i - 1]);
      while (month == newMonth) {
        if (0 < i) {
          temp = new Date(dayList[--i]);
          newMonth = temp.getMonth();
        } else {
          break;
        }
      }
      if (month != newMonth) {
        date = temp;
      }
    } else {
      addMonths(-1);
    }
    return date;
  };
  this.nextMonth = function() {
    if (this.hasMask()) {
      var i = getDayIndex(dayList, date.valueOf()),
          month = date.getMonth(),
          newMonth = month;
      if (dayList.length - 1 == i) {
        return;
      }
      var temp = new Date(dayList[i + 1]);
      while (month == newMonth) {
        if (i < dayList.length - 1) {
          temp = new Date(dayList[++i]);
          newMonth = temp.getMonth();
        } else {
          break;
        }
      }
      if (month != newMonth) {
        date = temp;
      }
    } else {
      addMonths(1);
    }
    return date;
  };
  this.parameter = function() {
    if (isDaily) {
      return {
        d: date.dateFormat("Ymd")
      };
    }
    if (isWeekly) {
      return {
        d: date.getWeekYear() + "W" + date.getWeek()
      };
    }
    if (isMonthly) {
      return {
        d: date.dateFormat("Ym")
      };
    }
  };
  this.formatDate = function() {
    if (isDaily) {
      return date.dateFormat("D, M j Y");
    }
    if (isWeekly) {
      return formatWeek(date);
    }
    if (isMonthly) {
      return date.dateFormat("M Y");
    }
  };

  function formatWeek(date) {
    var start = new Date(date.valueOf()).getStartOfWeek(),
        end = new Date(start.valueOf() + 6 * 24 * 60 * 60 * 1000);
    if (start.getMonth() == end.getMonth()) {
      return start.dateFormat("j") + " - " + end.dateFormat("j M Y");
    } else {
      return start.dateFormat("j M") + " - " + end.dateFormat("j M Y");
    }
  }
};
NG.GA = {
  _tracker: null,
  init: function(code, domainName) {
    try {
      this._tracker = _gat._getTracker(code);
      if ("undefined" != domainName) {
        this._tracker._setDomainName(domainName);
      }
    } catch (err) {}
  },
  trackPageView: function(view) {
    if (null != this._tracker) {
      if ("undefined" != typeof view) {
        this._tracker._trackPageview(view);
      } else {
        this._tracker._trackPageview();
      }
    }
  },
  trackEvent: function(category, action, opt_label, opt_value) {
    if ("BreadcrumbNav" == category) {
      return;
    }
    if (null != this._tracker) {
      if ("undefined" != typeof opt_label && "undefined" != typeof opt_value) {
        this._tracker._trackEvent(category, action, opt_label, opt_value);
      } else {
        if ("undefined" != typeof opt_label && "undefined" == typeof opt_value) {
          this._tracker._trackEvent(category, action, opt_label);
        } else {
          this._tracker._trackEvent(category, action);
        }
      }
    }
  }
};
var DataStore = function() {
  var cache = {};
  var prime = {};

  function put(key, value, expire) {
    cache[key] = value;
    if (expire) {
      setTimeout(function() {
        delete cache[key];
      }, expire);
    }
  }
  return {
    prime: function(key, parameters, data) {
      var url = Urls.get(key, parameters);
      prime[url] = data;
    },
    load: function(key, options, scope) {
      var options = options || {},
          url = Urls.get(key, options.parameters),
          result = prime[url];
      if (result) {
        if (options.cache) {
          put(url, result, options.expire);
        }
        delete prime[url];
        if (options.success) {
          options.success.call(scope || this, options, result);
          return;
        }
        return result;
      }
      if (options.cache) {
        result = cache[url];
        if (result) {
          if (options.success) {
            options.success.call(scope || this, options, result);
            return;
          }
          return result;
        } else {
          this.ajax(url, options, scope);
        }
      } else {
        delete cache[url];
        this.ajax(url, options, scope);
      }
    },
    ajax: function(url, options, scope) {
      var self = this,
          request = $.ajax({
          type: "get",
          url: url,
          data: null,
          dataType: "text",
          cache: true,
          global: false,
          success: function() {
            self.successCallback.apply(scope, [url, options].concat(NG.toArray(arguments)));
          },
          error: function() {
            self.errorCallback.apply(scope, [url, options].concat(NG.toArray(arguments)));
          },
          options: options
        });
      $(window).bind("beforeunload", function() {
        request.abort();
      });
    },
    successCallback: function(url, options, data, textStatus) {
      if (options.dataType && "array" == options.dataType) {
        var processedData;
        try {
          processedData = (new Function("return " + data))();
        } catch (err) {}
        if (NG.isArray(processedData)) {
          if (options.cache) {
            put(url, processedData, options.expire);
          }
          if (options.success) {
            options.success.call(this, options, processedData);
          } else {
            return processedData;
          }
        } else {
          options.error.call(this, options);
        }
        return;
      }
      if (options.success) {
        options.success.call(this, options, data);
      } else {
        return data;
      }
    },
    errorCallback: function(url, options, XMLHttpRequest, textStatus, errorThrown) {
      if (options.error) {
        options.error.call(this, options);
      }
    }
  };
}();
WS = {};
WS.Clock = {
  init: function(clock) {
    this.updateDateTime(clock.now());
    NG.Events.add(clock, "minutetick", this.updateDateTime);
  },
  updateDateTime: function(date) {
    $clock = $("#clock");
    $("#time", $clock).html(date.toTimeStr());
    $("#date", $clock).html(date.toDateString());
  }
};

function IsNumeric(input) {
  var RE = /^-{0,1}\d*\.{0,1}\d+$/;
  return (RE.test(input));
}
WS.FavoriteTournaments = function() {
  var favoritesCount = 0,
      favoritesLimit = 10,
      favoriteTournamentIds;
  var ftAddedMessageOptions = {
    icon: "icon-circle-check",
    messageText: "Added to your favourites.",
    classes: "favorite-tournaments-added-message",
    leftMargin: 5
  };
  var ftLimitMessageOptions = {
    icon: "icon-alert",
    messageText: "At most " + favoritesLimit + " tournaments can be added to your favourites.",
    timeToLive: 1500,
    classes: "favorite-tournaments-limit-message",
    leftMargin: 5
  };
  var ftSignInMessageOptions = {
    icon: "icon-alert",
    messageText: '<a target="_parent" href="/Accounts/Login?originalUrl=' + window.location.pathname + '" id="login">Sign in</a> or <a target="_parent" href="/Accounts/Register?originalUrl=' + window.location.pathname + '" id="register">Join us</a> to add this tournament to your favourites.',
    timeToLive: 5000,
    classes: "favorite-tournaments-signin-message",
    leftMargin: 5
  };
  var ftDuplicateMessageOptions = {
    icon: "icon-alert",
    messageText: "Tournament is already your favorite.",
    timeToLive: 1500,
    classes: "favorite-tournaments-duplicate-message",
    leftMargin: 5
  };
  var ftInfoMessageOptions = {
    id: "favorite-tournaments-info-message",
    timeToLive: -1
  };

  function getTournamentById(id) {
    for (var i = 0, l = allRegions.length; i < l; i++) {
      for (var j = 0, m = allRegions[i].tournaments.length; j < m; j++) {
        if (id == allRegions[i].tournaments[j].id) {
          tournament = allRegions[i].tournaments[j];
          tournament.flg = allRegions[i].flg;
          tournament.regionName = allRegions[i].name;
          return tournament;
        }
      }
    }
  }
  function createTournament(tournament) {
    if (null != tournament) {
      var clone = $('<li class="hover-target"><a class="pt iconize iconize-icon-left" href="' + tournament.url + '" title="' + tournament.regionName + '">' + tournament.name + '<span class="ui-icon country ' + tournament.flg + '"></span></a><div class="toolbar"></div></li>');
      addButton(clone, "remove", "trash", "Remove from favourites", function() {
        removeFavoriteTournament(clone);
      });
      favoritesCount++;
      return clone;
    }
  }
  function addFavoriteTournament(tournament, $trigger) {
    if (gIdentified) {
      if (favoritesCount == 0) {
        $("#my-favorites-note").hide();
      }
      if (favoritesCount < favoritesLimit) {
        var favoriteTournamentIdsTable = favoriteTournamentIds.hashtable();
        if (!favoriteTournamentIdsTable[tournament.id]) {
          createTournament(tournament).appendTo($("#favorite-tournaments-list"));
          $trigger.messageBox(ftAddedMessageOptions);
          NG.Events.fireGlobal("favoritetournamentsupdate", tournament.id);
          NG.Events.fireGlobal("favouritetournamentadded-" + tournament.id);
          NG.GA.trackEvent("MyFavourites", "Add", tournament.url);
        } else {
          $trigger.messageBox(ftDuplicateMessageOptions);
        }
      } else {
        $trigger.messageBox(ftLimitMessageOptions);
      }
    } else {
      if (0 == $(".favorite-tournaments-signin-message").length) {
        $trigger.messageBox(ftSignInMessageOptions);
      }
    }
  }
  function removeFavoriteTournament($item) {
    $item.remove();
    favoritesCount--;
    if (0 == favoritesCount) {
      $("#my-favorites-note").show();
    }
    NG.Events.fireGlobal("favoritetournamentsupdate", getTournamentId($item));
    NG.Events.fireGlobal("favouritetournamentremoved-" + getTournamentId($item));
    NG.GA.trackEvent("MyFavourites", "Remove", $item.find("a").attr("href"));
  }
  function addPlusButton($li) {
    addButton($li, "add", "star", "Add to favourites", function() {
      addFavoriteTournament(getTournamentById(getTournamentId($li)), $li);
    });
  }
  function addButton($li, css, iconType, title, onClick) {
    var $toolBar = $(".toolbar", $li);
    $button = $toolBar.append('<a class="' + css + ' button-small ui-state-transparent-default" href="#" title="' + title + '"><span class="ui-icon ui-icon-' + iconType + '"></span></a>');
    $("." + css, $toolBar).click(function(e) {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    });
  }
  function getTournamentId($li) {
    return stripTournamentIdFromHref($li.find("a.pt, a.t").attr("href"));
  }
  function stripTournamentIdFromHref(href) {
    var re = /Tournaments\/(\d*)/;
    var id = href.match(re)[1];
    return id;
  }
  function addTournamentById(tournamentId, $trigger) {
    addFavoriteTournament(getTournamentById(tournamentId), $trigger);
  }
  this.stripTournamentIdFromHref = function(href) {
    return stripTournamentIdFromHref(href);
  };
  this.initX = function(panel) {
    $(panel).on("click", "ul.regions li a.r", function() {
      $a = $(this);
      var tournaments = $a.addClass("e").blur().parent().find("ul.tournaments");
      if (tournaments.is(":visible")) {
        $a.removeClass("e").blur().parent().find("ul.tournaments").hide();
      } else {
        tournaments.show();
        if (!$a.data("decorated")) {
          $a.parent().find("ul.tournaments li").each(function() {
            addPlusButton($(this));
          });
          $a.data("decorated", true);
        }
      }
      return false;
    });
  };
  this.init = function() {
    NG.Events.addGlobal("favoritetournamentsupdate", function() {
      var id, ids = [];
      $("#favorite-tournaments-list a.pt").each(function() {
        var href = $(this).attr("href");
        id = stripTournamentIdFromHref(href);
        ids.push(id);
      });
      WS.User.favoriteTournaments(ids);
      favoriteTournamentIds = ids;
    });
    favoriteTournamentIds = WS.User.favoriteTournaments();
    if (0 < favoriteTournamentIds.length) {
      $("#my-favorites-note").hide();
      var idIndexes = favoriteTournamentIds.indextable();
      var $favLis = [];
      favoriteTournamentIds.forEach(function(id) {
        if (!IsNumeric(id)) {
          return;
        }
        var tournament = getTournamentById(id);
        $favLis[idIndexes[id]] = createTournament(tournament);
      });
      var favouriteTournamentslist = $("#favorite-tournaments-list");
      $favLis.forEach(function(t) {
        t.appendTo(favouriteTournamentslist);
      });
    } else {
      $("#my-favorites-note").show();
    }
    $("#favorite-tournaments-list li a span.country").click(function() {
      return false;
    });

    function closeTournamentNavigationHandler(e) {
      console.log(e.keyCode);
    }
    $("#tournament-nav-popup").show();
    var tablesTabsSetup = $.extend({}, $.fn.tabs.base);
    tablesTabsSetup.activate.unshift(function(options) {
      var init = options.init;
      var activate = options.activate;
      this.bind("activated", function(e, selected) {
        var fn = init && init[$(selected).attr("href")];
        if (fn) {
          if (!$(selected).data("initialized")) {
            fn();
            $(selected).data("initialized", true);
          }
        }
        if (activate && activate[$(selected).attr("href")]) {
          activate[$(selected).attr("href")]();
        }
      });
    });
    $("#tournament-groups").tabs({
      setup: tablesTabsSetup,
      defaultTab: (0 < WS.User.favoriteTournaments().length) ? "#favourites" : "#popular",
      activate: {
        "#domestic": function() {},
        "#international": function() {}
      },
      init: {
        "#favorites": function() {},
        "#popular": function() {
          $("#popular").find("#popular-tournaments-list li").each(function() {
            addPlusButton($(this));
          });
        },
        "#domestic": function() {
          var model = allRegions.filter(function(e) {
            return 0 == e.type;
          });

          function createIndex(model) {
            function getMask() {
              var mask = [],
                  index = 0;
              for (var i = 0; i < model.length; i++) {
                if (-1 == mask.indexOf(model[i].name.charAt(0))) {
                  mask[index++] = model[i].name.charAt(0);
                }
              }
              mask[index++] = "All";
              return mask;
            }
            function render(mask) {
              var t = [];
              mask.forEach(function(o) {
                t.push('<dd><a data-value="' + o + '" href="#" class="option">' + o + "</a></dd>");
              });
              return t.join("");
            }
            function init() {
              var mask = getMask();
              $index = $("#domestic-index");
              $index.html(render(mask));
              $(".option", $index).on("click", function(e) {
                e.preventDefault();
                $(".option.selected", $index).removeClass("selected");
                $(this).addClass("selected").blur();
                NG.Events.fireGlobal("domesticindexselected", [$(this).attr("data-value")]);
              });
              $(".option:first", $index).click();
            }
            init();
          }
          function updateRegions(index) {
            var regions = ("All" == index) ? model : model.filter(function(o) {
              return index == o.name.charAt(0);
            });
            var colCount = 5;
            var itemsPerColCount = Math.ceil(regions.length / colCount);
            var currentRegionIdx = 0;
            var currentRegion = null;
            var idxHtml = "";
            var html = "";
            for (var i = 0; i < colCount; i++) {
              html += '<div class="region-column"><ul class="regions">';
              for (var j = 0; j < itemsPerColCount; j++) {
                if (currentRegionIdx == regions.length) {
                  break;
                }
                currentRegion = regions[currentRegionIdx];
                html += "<li >" + idxHtml + '<a class="r iconize iconize-icon-left" href="#"><span class="ui-icon country ' + currentRegion.flg + '"></span>' + currentRegion.name + "</a>" + '<ul class="tournaments" style="display: none">';
                for (var l = 0; l < currentRegion.tournaments.length; l++) {
                  html += '<li class="hover-target"><a class="t" href="' + currentRegion.tournaments[l].url + '">' + currentRegion.tournaments[l].name + '</a><div class="toolbar"></div></li>';
                }
                html += "</ul>" + "</li>";
                currentRegionIdx++;
              }
              html += "</ul></div>";
            }
            $("#domestic-regions").html(html);
          }
          NG.Events.addGlobal("domesticindexselected", function(index) {
            updateRegions(index);
          });
          createIndex(model);
          favoriteTournaments.initX("#domestic");
        },
        "#international": function() {
          var regions = allRegions.filter(function(e) {
            return 1 == e.type;
          });
          var colCount = 5;
          var itemsPerColCount = Math.ceil(regions.length / colCount);
          var currentRegionIdx = 0;
          var currentRegion = null;
          var idxHtml = null;
          var html = "";
          for (var i = 0; i < colCount; i++) {
            html += '<div class="region-column"><ul class="regions">';
            for (var j = 0; j < itemsPerColCount; j++) {
              if (currentRegionIdx == regions.length) {
                break;
              }
              currentRegion = regions[currentRegionIdx];
              html += "<li>" + '<a class="r iconize iconize-icon-left" href="#"><span class="ui-icon country ' + currentRegion.flg + '"></span>' + currentRegion.name + "</a>" + '<ul class="tournaments" style="display: none">';
              for (var l = 0; l < currentRegion.tournaments.length; l++) {
                html += '<li class="hover-target"><a class="t" href="' + currentRegion.tournaments[l].url + '">' + currentRegion.tournaments[l].name + '</a><div class="toolbar"></div></li>';
              }
              html += "</ul>" + "</li>";
              currentRegionIdx++;
            }
            html += "</ul></div>";
          }
          $("#international").html(html);
          favoriteTournaments.initX("#international");
        }
      }
    });
    NG.Events.addGlobal("addFavouriteTournament", function(tournamentId, $trigger) {
      addTournamentById(tournamentId, $trigger);
    });
  };
};
WS.User = {
  persistentOptions: {
    expires: 365,
    path: "/",
    domain: gDomain
  },
  favTeamMaxNumberAlertDialogueValues: {
    icon: "icon-alert",
    messageText: "Maximum 3 teams can be added to your favourites.",
    timeToLive: 3000,
    classes: "favorite-tournaments-limit-message",
    leftMargin: 25
  },
  signInAlertDialogueValues: {
    icon: "icon-alert",
    messageText: '<a target="_parent" href="/Accounts/Login?originalUrl=' + window.location.pathname + '" id="login">Sign in</a> or <a target="_parent" href="/Accounts/Register?originalUrl=' + window.location.pathname + '" id="register">Join us</a> to add this team to your favourites.',
    timeToLive: 5000,
    classes: "favorite-tournaments-signin-message",
    leftMargin: 25
  },
  timezoneOffset: function() {
    if (undefined == arguments[0]) {
      var tzo = $.cookie("tzo");
      if (null == tzo) {
        tzo = gUtcOffset;
        $.cookie("tzo", tzo, this.persistentOptions);
      }
      return tzo;
    } else {
      $.cookie("tzo", arguments[0], this.persistentOptions);
    }
  },
  addTeamAsAFavourite: function(id) {
    var self = this;
    $("#toggle-team-link").text("Adding..");
    $.ajax({
      type: "POST",
      url: "/Accounts/AddFavouriteTeam",
      cache: false,
      data: "teamId=" + id,
      dataType: "json",
      success: function(json) {
        if (0 == json.ReturnCode) {
          $("#toggle-team-favourites").toggleClass("add-team");
          $("#toggle-team-favourites").toggleClass("remove-team");
          $("#toggle-team-link").text("Added!");
          window.setTimeout(function() {
            $("#toggle-team-link").html('<span class="ui-icon ui-icon-star"></span>Remove from Favourites');
          }, 1000);
          WS.TeamHeader.bindEvents();
        } else {
          console.error(json.Message);
          var userAlert = gIdentified ? self.favTeamMaxNumberAlertDialogueValues : self.signInAlertDialogueValues;
          $("#toggle-team-link").messageBox(userAlert);
          $("#toggle-team-link").text("Add to Favourites");
        }
      },
      error: function(e) {
        console.error(e);
        $("#toggle-team-link").text("Add to Favourites");
      }
    });
  },
  removeTeamFromFavourites: function(id) {
    $("#toggle-team-link").text("Removing..");
    $.ajax({
      type: "PUT",
      url: "/Accounts/RemoveFavouriteTeam",
      cache: false,
      data: "teamId=" + id,
      dataType: "json",
      success: function(json) {
        if (0 == json.ReturnCode) {
          $("#toggle-team-favourites").toggleClass("add-team");
          $("#toggle-team-favourites").toggleClass("remove-team");
          $("#toggle-team-link").text("Removed!");
          window.setTimeout(function() {
            $("#toggle-team-link").html('<span class="ui-icon ui-icon-star"></span>Add to Favourites');
          }, 1000);
          WS.TeamHeader.bindEvents();
        } else {
          console.error(json.Message);
          $("#toggle-team-link").text("Remove from Favourites");
        }
      },
      error: function(e) {
        console.error(e);
        $("#toggle-team-link").text("Remove from Favourites");
      }
    });
  },
  favoriteTournaments: function() {
    if (undefined == arguments[0]) {
      var ft = $.cookie("ft") || "";
      var ids = ((0 < ft.length) ? ft.split(",") : []);
      var numericIds = [];
      for (var i = 0; i < ids.length; i++) {
        if (IsNumeric(ids[i])) {
          numericIds.push(ids[i]);
        }
      }
      if (ids.length != numericIds.length) {
        $.cookie("ft", numericIds.join(","), this.persistentOptions);
      }
      return numericIds;
    } else {
      var ids = arguments[0].join(",");
      $.ajax({
        type: "POST",
        url: "/Accounts/FavouriteTournaments",
        cache: false,
        data: "ids=" + ids,
        dataType: "json",
        success: function(json) {
          if (0 == json.ReturnCode) {
            $.cookie("ft", json.Data, WS.User.persistentOptions);
          } else {
            alert(json.Message);
          }
        },
        error: function() {
          alert("Error. Please try again.");
        }
      });
    }
  }
};
var Urls = function() {
  var templates = {
    "livescores": "/matchesfeed/",
    "livescoreincidents": "/matchesfeed/{id}/IncidentsSummary/",
    "stagefixtures": "/tournamentsfeed/{stageId}/Fixtures/",
    "teamfixtures": "/teamsfeed/{teamId}/Fixtures/",
    "standings": "/stagesfeed/{stageId}/standings/",
    "forms": "/stagesfeed/{stageId}/forms/",
    "history": "/stagesfeed/{stageId}/history/",
    "streaks": "/stagesfeed/{stageId}/streaks/",
    "goals": "/tournamentsfeed/{stageId}/PlayerStatistics/",
    "cards": "/tournamentsfeed/{stageId}/PlayerStatistics/",
    "team-goals": "/teamsfeed/{teamId}/PlayerStatistics/",
    "team-cards": "/teamsfeed/{teamId}/PlayerStatistics/",
    "previousmeetings": "/teamsfeed/{homeTeamId}/PreviousMeetings/",
    "statistics": "/statisticsfeed/",
    "side-box-statistics": "/statisticsfeed/{statsType}/SideBoxStatistics/",
    "regionteams": "/teamsfeed/{id}/region",
    "ws-stage-stat": "/stagestatfeed/",
    "ws-teams-stage-stat": "/stagestatfeed/{stageId}/stageteams/",
    "ws-stage-filtered-team-stat": "/stagestatfeed/{stageId}/teamsstagefiltered/",
    "ws-teams-filtered-stage-stat": "/stagestatfeed/{stageId}/stageteamsfiltered/",
    "stage-top-player-stats": "/stagestatfeed/{stageId}/stagetopplayers",
    "live-team-stat": "/optamatchstatfeed/",
    "team-fixtures": "/teamsfeed/{teamId}/H2HFixtures/",
    "match-header": "/matchesfeed/{id}/MatchHeader",
    "match-live-update": "/matchesfeed/{id}/LiveMatch",
    "match-commentary": "/matchesfeed/{id}/MatchCommentary",
    "live-player-stats": "/matchesfeed/{id}/LivePlayerStats",
    "betting-stats": "/bettingstatfeed/",
    "overall-player-stat": "/stageplayerstatfeed/{playerId}/Overall",
    "stage-player-stat": "/stageplayerstatfeed/",
    "overall-team-stat": "/stageteamstatfeed/{teamId}/Overall",
    "stage-team-stat": "/stageteamstatfeed/",
    "stage-h2h-player-stat": "/stageplayerstatfeed/{stageId}/H2HTeamPlayers",
    "player-tournament-stat": "/stageplayerstatfeed/{playerId}/PlayerTournamentStats",
    "facts-filter": "/Facts/Data",
    "player-heatmap": "/Players/{id}/Heatmap",
    "match-centre": "/matchesfeed/{id}/MatchCentre",
    "match-centre2": "/matchesfeed/{id}/MatchCentre2",
    "player-tournament-history-stat": "/stageplayerstatfeed/{playerId}/PlayerHistoryTournamentStats"
  };
  return {
    get: function(key, parameters) {
      var re = /\{(\w*)\}/g,
          url = templates[key] + "",
          matches, parametersCopy = $.extend(true, {}, parameters);
      while (matches = re.exec(url)) {
        url = url.replace(matches[0], parametersCopy[matches[1]]);
        delete parametersCopy[matches[1]];
      }
      var queryString = NG.querystring(parametersCopy);
      url = url + ((0 < queryString.length) ? "?" + queryString : "");
      return url;
    }
  };
}();

function DateController(id, calendarp) {
  var $el = $("#" + id),
      calendar = calendarp,
      self = this,
      disabled = false,
      $dateView = $("#" + id + " .date .text");
  setDate();
  NG.Events.add(calendar, "datechanged", function() {
    setDate();
  });

  function previousClickHandler() {
    var $this = $(this).blur();
    if (disabled) {
      return false;
    }
    disabled = true;
    $this.addClass("ui-state-active");
    calendar.previous();
    return false;
  }
  function nextClickHandler() {
    var $this = $(this).blur();
    if (disabled) {
      return false;
    }
    disabled = true;
    $this.addClass("ui-state-active");
    calendar.next();
    return false;
  }
  function nullClickHandler() {
    return false;
  }
  function setDate() {
    if ($dateView) {
      $dateView.text(calendar.formatDate());
      setButtonMode("previous");
      setButtonMode("next");
    }
  }
  function setButtonMode(type) {
    var $button = $("#" + id + " ." + type);
    if (calendar[type + "Enabled"]()) {
      $button.removeClass("is-disabled").addClass("is-default").unbind("click").click("previous" == type ? previousClickHandler : nextClickHandler);
      $button.attr("title", "View " + type + " " + calendar.mode().toLowerCase());
    } else {
      $button.removeClass("is-default is-active").addClass("is-disabled").unbind("click").click(nullClickHandler);
      $button.attr("title", "No data for " + type + " " + calendar.mode().toLowerCase());
    }
  }
  this.enable = function() {
    disabled = false;
    $el.find(".previous.ui-state-active, .next.ui-state-active").removeClass("ui-state-active");
  };
  this.disable = function() {
    disabled = true;
  };
}
function DatePicker(id, calendarp) {
  var $el = $("#" + id),
      calendar = calendarp,
      isWeekly = calendar.isWeekly(),
      isMonthly = calendar.isMonthly(),
      monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      enabled = true,
      self = this;
  this.enable = function() {
    this.enabled = true;
  };
  this.disable = function() {
    this.enabled = false;
  };

  function getMonthName(monthId) {
    return (monthNames[monthId]) ? monthNames[monthId] : "";
  }
  function getDate(year, month, day) {
    var date = new Date(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10) + 1);
    if (date < calendar.min()) {
      return calendar.min();
    }
    if (calendar.max() < date) {
      return calendar.max();
    }
    return date;
  }
  update(calendar.getDate());
  addPresentTimeButton();
  NG.Events.add(calendar, "datechanged", function() {
    update(calendar.getDate());
  });
  this.update = function(date) {
    calendar.setDate(date);
  };

  function update(date) {
    var selectedDate = date,
        years = [],
        months = [],
        days = [],
        $datepicker = $("table.datepicker tr:first", $el);
    if (calendar.hasMask()) {
      if (calendar.mask()[selectedDate.getFullYear()]) {
        for (var year in calendar.mask()) {
          if (String(year >>> 0) == year && year >>> 0 != 4294967295) {
            years.push({
              value: year,
              text: year,
              selected: (year == selectedDate.getFullYear()),
              selectable: true
            });
          }
        }
        var selectableMonths = calendar.mask()[selectedDate.getFullYear()];
        var selectableDays = selectableMonths[selectedDate.getMonth()];
        if ("undefined" == typeof(selectableDays)) {
          var i = 0;
          while (i < 12 && "undefined" == typeof(selectableMonths[i])) {
            i++;
          }
          selectableDays = selectableMonths[i];
          selectedDate = new Date(selectedDate.getFullYear(), i, 1);
        }
        for (var i = 0; i < 12; i++) {
          months.push({
            value: i,
            text: i + 1,
            selected: (i == selectedDate.getMonth()),
            selectable: "undefined" != typeof(selectableMonths[i])
          });
        }
        var selectableDaysPrev = selectableMonths[selectedDate.getMonth() - 1],
            selectableDaysNext = selectableMonths[selectedDate.getMonth() + 1];
        var startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
            start = -((startDate.getDay() + 6) % 7),
            end = 42 + start;
        var checkPrev = "undefined" != typeof(selectableDaysPrev) && (start < 0),
            checkNext = "undefined" != typeof(selectableDaysNext),
            daysInMonth = startDate.getDaysInMonth();
        for (var i = start; i < end; i++) {
          var day = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i).getDate();
          days.push({
            value: i,
            text: day,
            selected: (i == selectedDate.getDate() - 1),
            selectable: "undefined" != typeof(selectableDays[i + 1]) || (checkPrev && i < 0 && "undefined" != typeof(selectableDaysPrev[day])) || (checkNext && (i >= daysInMonth) && "undefined" != typeof(selectableDaysNext[day]))
          });
        }
      }
    } else {
      for (var i = calendar.min().getFullYear(); i <= calendar.max().getFullYear(); i++) {
        years.push({
          value: i,
          text: i,
          selected: (i == selectedDate.getFullYear()),
          selectable: true
        });
      }
      for (var i = 0; i < 12; i++) {
        months.push({
          value: i,
          text: i + 1,
          selected: (i == selectedDate.getMonth()),
          selectable: true
        });
      }
      var startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
          start = -((startDate.getDay() + 6) % 7),
          end = 42 + start;
      for (var i = start; i < end; i++) {
        days.push({
          value: i,
          text: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i).getDate(),
          selected: (i == selectedDate.getDate() - 1),
          selectable: true
        });
      }
    }
    var s = [];
    s.push(renderPart(selectedDate, "years", (12 == years.length) ? 4 : 1, years, true));
    s.push(renderPart(selectedDate, "months", 4, months, true));
    if (!isMonthly) {
      s.push(renderPart(selectedDate, "days", 7, days, equals(date, calendar.getDate()), date.getDaysInMonth()));
    }
    $datepicker.text("");
    $datepicker.append(s.join(""));
    if (isWeekly) {
      $(".days tr:has(td.selectable)", $el).addClass("selectable");
      $(".days tr:has(td.selected)", $el).addClass("selected");
    }
  }
  function addPresentTimeButton() {
    var text = isWeekly ? "View current week" : isMonthly ? "View current month" : "View today";
    $("#date-config").append('<div class="present-time iconize iconize-icon-right"><span class="ui-icon ui-icon-arrowreturnthick-1-w"></span>' + text + "</div>");
    $("#date-config .present-time").click(function() {
      setTimeout(function() {
        calendar.setDate(NG.Clock.now());
        return false;
      }, 0);
    });
  }
  function renderPart(selectedDate, className, colCount, a, select, daysInMonth) {
    var s = [];
    var title = ("years" == className) ? (a[0].text + ((a[a.length - 1].text != a[0].text) ? (" - " + a[a.length - 1].text) : "")) : ("months" == className) ? selectedDate.getFullYear() : (getMonthName(selectedDate.getMonth()) + " " + selectedDate.getFullYear());
    s.push('<td class="part">');
    s.push('<div class="part-padding-ie">');
    s.push("<p>" + title + "</p> ");
    s.push(renderTable(className, colCount, a, select, daysInMonth));
    s.push("</div>");
    s.push("</td>");
    return s.join("");
  }
  function renderTable(className, colCount, a, select, daysInMonth) {
    var t = [];
    t.push('<table class="' + className + '">');
    if (daysInMonth) {
      t.push("<thead>");
      t.push('<tr><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th class="">S</th><th class="">S</th></tr>');
      t.push("</thead>");
    }
    t.push("<tbody>");
    for (var i = 0; i < a.length; i++) {
      if (0 == i % colCount) {
        t.push("<tr>");
      }
      t.push('<td class="' + (select && a[i].selected ? " selected" : "") + (a[i].selectable ? " selectable" : "") + (daysInMonth && (a[i].value < 0 || daysInMonth - 1 < a[i].value) ? " om" : "") + '" data-value="' + a[i].value + '">');
      t.push((className == "months") ? getMonthName(a[i].text - 1) : a[i].text);
      t.push("</td>");
      if (colCount - 1 == i % colCount) {
        t.push("</tr>");
      }
    }
    t.push("</tbody></table>");
    return t.join("");
  }
  function equals(a, b) {
    return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
  }
  $el.on("click", ".years td.selectable", function() {
    if (!self.enabled) {
      return;
    }
    var $this = $(this),
        year = $this.attr("data-value"),
        month = $el.find(".months td.selected").attr("data-value"),
        day = 0,
        date = getDate(year, month, day);
    update(date);
  });
  $el.on("click", ".months td.selectable", function() {
    if (!self.enabled) {
      return;
    }
    var $this = $(this),
        year = $el.find(".years td.selected").attr("data-value"),
        month = $this.attr("data-value"),
        day = 1,
        date = getDate(year, month, day);
    if (isMonthly) {
      calendar.setDate(date);
    } else {
      update(date);
    }
  });
  var selectable = (isWeekly) ? ".days tr:has(td.selectable)" : ".days td.selectable";
  $el.on("click", selectable, function() {
    if (!self.enabled) {
      return;
    }
    var $this = $(this),
        year = $el.find(".years td.selected").attr("data-value"),
        month = $el.find(".months td.selected").attr("data-value"),
        day = (isWeekly) ? $("td:first", $this).attr("data-value") : $this.attr("data-value"),
        date = getDate(year, month, day);
    calendar.setDate(date);
  });
}
function teamIdMaskFn(obj) {
  return obj["TeamId"];
}
var ViewUtil = {
  zeroFilter: function(value) {
    return (0 == value) ? "." : value;
  },
  zeroClass: function(value) {
    if (0 == value) {
      return " nil";
    }
    return "";
  }
};
var gridDefaults = {
  filter: {
    maskFn: teamIdMaskFn
  },
  sorter: {
    sortInfo: {
      property: "O",
      direction: "asc"
    }
  },
  highlighter: {
    maskFn: teamIdMaskFn
  }
};

function GoalStatsModel(config) {
  var config = config || {};
  var dataLoaded = {
    "Overall": false,
    "Home": false,
    "Away": false
  };
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var records;
    DataStore.load("goals", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        if (!dataLoaded[parametersCopy.field]) {
          dataLoaded[parametersCopy.field] = true;
          NG.Events.fireGlobal("goals-grid-model-updated", [parametersCopy.field]);
        }
        records = data;
      },
      dataType: "array"
    });
    return this.prepareData(records);
  };
  this.prepareData = function(rawData) {
    var result = -1;
    if (rawData) {
      result = [];
      for (var i = 0, l = rawData.length; i < l; i++) {
        var o = {};
        jQuery.extend(o, {
          PlayerName: rawData[i][0],
          TeamName: rawData[i][1],
          GoalsScored: rawData[i][2],
          FirstGoals: rawData[i][3],
          PenaltyGoals: rawData[i][4],
          TeamId: rawData[i][5]
        });
        result.push(o);
      }
    }
    return result;
  };
}
function TeamGoalStatsModel(config) {
  var config = config || {};
  var dataLoaded = {};
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var records;
    DataStore.load("team-goals", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        if (!dataLoaded[parametersCopy.field + parametersCopy.tournamentId]) {
          dataLoaded[parametersCopy.field + parametersCopy.tournamentId] = true;
          setTimeout(function() {
            NG.Events.fireGlobal("team-goals-grid-model-updated", [parametersCopy.field]);
          }, 0);
        }
        records = data;
      },
      dataType: "array"
    });
    return this.prepareData(records);
  };
  this.prepareData = function(rawData) {
    var result = -1;
    if (rawData) {
      result = [];
      for (var i = 0, l = rawData.length; i < l; i++) {
        var o = {};
        jQuery.extend(o, {
          PlayerName: rawData[i][0],
          GoalsScored: rawData[i][2],
          FirstGoals: rawData[i][3],
          PenaltyGoals: rawData[i][4]
        });
        result.push(o);
      }
    }
    return result;
  };
}
var GoalStatsView = function(eventData) {
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="rank">' + (i + 1) + "</td>");
      t.push('<td class="player">' + o.PlayerName + "</td>");
      if (o.TeamId && o.TeamName) {
        t.push('<td class="team">');
        t.push(WS.TeamLink(o.TeamId, o.TeamName));
        t.push("</td>");
      }
      t.push('<td class="fg">' + o.FirstGoals + "</td>");
      t.push('<td class="pg">' + o.PenaltyGoals + "</td>");
      t.push('<td class="gs">' + o.GoalsScored + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};

function CardStatsModel(config) {
  var config = config || {};
  var dataLoaded = {
    "Overall": false,
    "Home": false,
    "Away": false
  };
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var records;
    DataStore.load("cards", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        if (!dataLoaded[parametersCopy.field]) {
          dataLoaded[parametersCopy.field] = true;
          NG.Events.fireGlobal("cards-grid-model-updated", [parametersCopy.field]);
        }
        records = data;
      },
      dataType: "array"
    });
    return this.prepareData(records);
  };
  this.prepareData = function(rawData) {
    var result = -1;
    if (rawData) {
      result = [];
      for (var i = 0, l = rawData.length; i < l; i++) {
        var o = {};
        jQuery.extend(o, {
          PlayerName: rawData[i][0],
          TeamName: rawData[i][1],
          Yellow: rawData[i][2],
          SecondYellow: rawData[i][3],
          Red: rawData[i][4],
          Points: rawData[i][5],
          TeamId: rawData[i][6]
        });
        result.push(o);
      }
    }
    return result;
  };
}
function TeamCardStatsModel(config) {
  var config = config || {};
  var dataLoaded = {
    "Overall": false,
    "Home": false,
    "Away": false
  };
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var records;
    DataStore.load("team-cards", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        if (!dataLoaded[parametersCopy.field + parametersCopy.tournamentId]) {
          dataLoaded[parametersCopy.field + parametersCopy.tournamentId] = true;
          NG.Events.fireGlobal("team-cards-grid-model-updated", [parametersCopy.field]);
        }
        records = data;
      },
      dataType: "array"
    });
    return this.prepareData(records);
  };
  this.prepareData = function(rawData) {
    var result = -1;
    if (rawData) {
      result = [];
      for (var i = 0, l = rawData.length; i < l; i++) {
        var o = {};
        jQuery.extend(o, {
          PlayerName: rawData[i][0],
          Yellow: rawData[i][2],
          SecondYellow: rawData[i][3],
          Red: rawData[i][4],
          Points: rawData[i][5]
        });
        result.push(o);
      }
    }
    return result;
  };
}
var CardStatsView = function(eventData) {
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="rank">' + (i + 1) + "</td>");
      t.push('<td class="player">' + o.PlayerName + "</td>");
      if (o.TeamId && o.TeamName) {
        t.push('<td class="team">');
        t.push(WS.TeamLink(o.TeamId, o.TeamName));
        t.push("</td");
      }
      t.push('<td class="y">' + o.Yellow + "</td>");
      t.push('<td class="sy">' + o.SecondYellow + "</td>");
      t.push('<td class="r">' + o.Red + "</td>");
      t.push('<td class="pts">' + o.Points + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};

function StandingsModel(config) {
  var config = config || {},
      _stageId = config.defaultParameters.stageId;
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, {
      stageId: _stageId
    }, parameters);
    var field = NG.remove(parametersCopy, "field");
    var data = DataStore.load("standings", {
      parameters: parametersCopy,
      cache: config.cache,
      dataType: "array"
    });
    var result = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var o = {
        TeamId: data[i][1],
        TeamName: data[i][2],
        Matches: data[i][30]
      };
      var offset = 3;
      switch (field) {
      case "home":
        offset += 9;
        o.Matches = data[i][31];
        break;
      case "away":
        offset += 18;
        o.Matches = data[i][32];
        break;
      }
      jQuery.extend(o, {
        O: data[i][offset],
        P: data[i][++offset],
        W: data[i][++offset],
        D: data[i][++offset],
        L: data[i][++offset],
        GF: data[i][++offset],
        GA: data[i][++offset],
        GD: data[i][++offset],
        Pts: data[i][++offset]
      });
      if ("wide" == field) {
        jQuery.extend(o, {
          HO: data[i][12],
          HP: data[i][13],
          HW: data[i][14],
          HD: data[i][15],
          HL: data[i][16],
          HGF: data[i][17],
          HGA: data[i][18],
          HGD: data[i][19],
          HPts: data[i][20],
          AO: data[i][21],
          AP: data[i][22],
          AW: data[i][23],
          AD: data[i][24],
          AL: data[i][25],
          AGF: data[i][26],
          AGA: data[i][27],
          AGD: data[i][28],
          APts: data[i][29]
        });
      }
      result.push(o);
    }
    return result;
  };
}
var StandingsView = function(eventData) {
  var rankColorings = eventData.extraOptions.rankColorings;
  var showRankcolorings = showRankColorings(eventData.extraOptions.field);
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    var find = /<a class="(\w) (\w)" id="(\d+)" title="(.+?)"\/>/g;
    var replace = '<a class="box $1 $2" href="/Matches/$3/Live" title="$4">$1</a>';
    var lastMatch = /title="(?!.*title=")/;
    var replaceLastMatch = 'title="Last Match: ';
    for (var i = 0, l = records.length; i < l; i++) {
      var matches = "";
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="o"><span class="box ' + (showRankcolorings ? getRankCssForIndex(rankColorings, (o.O)) : "") + '">' + o.O + "</span></td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="p">' + o.P + "</td>");
      t.push('<td class="w">' + o.W + "</td>");
      t.push('<td class="d">' + o.D + "</td>");
      t.push('<td class="l">' + o.L + "</td>");
      t.push('<td class="gf">' + o.GF + "</td>");
      t.push('<td class="ga">' + o.GA + "</td>");
      t.push('<td class="gd">' + (0 < o.GD ? "+" + o.GD : o.GD) + "</td>");
      t.push('<td class="pts">' + o.Pts + "</td>");
      if (o.Matches) {
        matches = o.Matches.replace(find, replace);
        matches = matches.replace(lastMatch, replaceLastMatch);
      }
      t.push('<td class="form">' + matches + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};

function showRankColorings(field) {
  return (field) ? ("overall" == field || "wide" == field) : false;
}
function getRankCssForIndex(rankCssList, index) {
  if (rankCssList) {
    for (var i = 0; i < rankCssList.length; i++) {
      for (var k = 0; k < rankCssList[i][1].length; k++) {
        if (rankCssList[i][1][k] == index) {
          return rankCssList[i][0];
        }
      }
    }
  }
  return "";
}
var StandingsWideView = function(eventData) {
  var records = eventData.model.records;
  var rankColorings = eventData.extraOptions.rankColorings;
  var showRankcolorings = showRankColorings(eventData.extraOptions.field);
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="o"><span class="box ' + (showRankcolorings ? getRankCssForIndex(rankColorings, (o.O)) : "") + '">' + o.O + "</span></td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="p shade">' + o.P + "</td>");
      t.push('<td class="w shade">' + o.W + "</td>");
      t.push('<td class="d shade">' + o.D + "</td>");
      t.push('<td class="l shade">' + o.L + "</td>");
      t.push('<td class="gf shade">' + o.GF + "</td>");
      t.push('<td class="ga shade">' + o.GA + "</td>");
      t.push('<td class="pts shade">' + o.Pts + "</td>");
      t.push('<td class="p">' + o.HP + "</td>");
      t.push('<td class="w">' + o.HW + "</td>");
      t.push('<td class="d">' + o.HD + "</td>");
      t.push('<td class="l">' + o.HL + "</td>");
      t.push('<td class="gf">' + o.HGF + "</td>");
      t.push('<td class="ga">' + o.HGA + "</td>");
      t.push('<td class="pts">' + o.HPts + "</td>");
      t.push('<td class="p shade">' + o.AP + "</td>");
      t.push('<td class="w shade">' + o.AW + "</td>");
      t.push('<td class="d shade">' + o.AD + "</td>");
      t.push('<td class="l shade">' + o.AL + "</td>");
      t.push('<td class="gf shade">' + o.AGF + "</td>");
      t.push('<td class="ga shade">' + o.AGA + "</td>");
      t.push('<td class="pts shade">' + o.APts + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var StandingsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: StandingsModel,
    cache: true
  },
  view: StandingsView,
  sorter: {
    sortInfo: {
      property: "O",
      direction: "asc"
    }
  }
});
var GoalsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: GoalStatsModel,
    cache: true
  },
  view: GoalStatsView,
  sorter: {
    sortInfo: {
      property: "GoalsScored",
      direction: "desc"
    }
  },
  gridId: "goals-grid"
});
var TeamGoalsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: TeamGoalStatsModel,
    cache: true
  },
  view: GoalStatsView,
  sorter: {
    sortInfo: {
      property: "GoalsScored",
      direction: "desc"
    }
  },
  gridId: "goals-grid"
});
var CardsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: CardStatsModel,
    cache: true
  },
  view: CardStatsView,
  sorter: {
    sortInfo: {
      property: "Points",
      direction: "desc"
    }
  }
});
var TeamCardsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: TeamCardStatsModel,
    cache: true
  },
  view: CardStatsView,
  sorter: {
    sortInfo: {
      property: "Points",
      direction: "desc"
    }
  }
});

function HistoryModel(config) {
  var config = config || {};
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var field = NG.remove(parametersCopy, "field");
    var data = DataStore.load("history", {
      parameters: parametersCopy,
      cache: config.cache,
      dataType: "array"
    });
    var result = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var o = {
        TeamId: data[i][1],
        TeamName: data[i][2]
      };
      switch (field) {
      case "overall":
        o.O = data[i][3];
        o.H = data[i][4];
        break;
      case "home":
        o.O = data[i][5];
        o.H = data[i][6];
        break;
      case "away":
        o.O = data[i][7];
        o.H = data[i][8];
        break;
      }
      result.push(o);
    }
    return result;
  };
}
var HistoryView = function(eventData) {
  function format(data) {
    return (null != data && 0 < (c = (data.match(/\d/g) || []).length)) ? "<ul>" + '<li class="c">' + (0 < c ? "1" : "0") + "</li>" + data.replace(/(\d)/g, '<li class="r$1"></li>') + '<li class="c">' + (1 < c ? c : "") + "</li>" + "</ul>" : '<ul><li class="c">0</li></ul>';
  }
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="o">' + o.O + "</td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="progression">' + format(o.H) + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var HistoryGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: HistoryModel,
    cache: true
  },
  view: HistoryView,
  sorter: {
    sortInfo: {
      property: "O",
      direction: "asc"
    }
  }
});

function getPercentage(stat, played) {
  if (!played || 0 == played) {
    return 0;
  }
  return Math.round(stat * 100 / played);
}
function getAverage(stat, played) {
  return Math.ceil(stat * 10 / played) / 10;
}
function StatisticsPerformancesModel(config) {
  var config = config || {};
  var dataLoaded = {};
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var field = parametersCopy.field;
    var page = NG.remove(parametersCopy, "page");
    parametersCopy.field = "wide" == field ? "Overall" : field;
    var records;
    var data = DataStore.load("statistics", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        var key = field + parametersCopy.order + parametersCopy.filterType;
        if (!dataLoaded[key]) {
          dataLoaded[key] = true;
          setTimeout(function() {
            NG.Events.fireGlobal("statistics-performances-model-updated", []);
          }, 0);
        }
        records = data;
        var numberOfPages = Math.ceil(records.length / 15);
        NG.Events.fireGlobal("statistics-performances-data-loaded", [numberOfPages, page]);
      },
      dataType: "array",
      extraOptions: {
        page: page
      }
    });
    return this.prepareData(records, field, page);
  };
  this.prepareData = function(data, field, page) {
    var result = -1;
    if (data) {
      page = page || 1;
      var start = page == 1 ? 0 : (15 * (page - 1));
      var end = data.length < (15 * page) ? data.length : (15 * page);
      result = [];
      for (var i = start, l = end; i < l; i++) {
        var o = {
          TeamId: data[i][0],
          TeamName: data[i][1],
          StageId: data[i][2],
          TournamentName: data[i][3],
          SeasonId: data[i][4],
          TournamentId: data[i][5],
          RegionId: data[i][6],
          RegionCode: data[i][7]
        };
        var offset = 7;
        switch (field) {
        case "Home":
          offset += 8;
          break;
        case "Away":
          offset += 16;
          break;
        }
        o.P = data[i][++offset];
        jQuery.extend(o, {
          W: getPercentage(data[i][++offset], o.P),
          D: getPercentage(data[i][++offset], o.P),
          L: getPercentage(data[i][++offset], o.P),
          GF: getAverage(data[i][++offset], o.P),
          GA: getAverage(data[i][++offset], o.P),
          GD: getAverage(data[i][++offset], o.P),
          Pts: getAverage(data[i][++offset], o.P)
        });
        result.push(o);
      }
    }
    return result;
  };
}
function StatisticsFormsModel(config) {
  var config = config || {};
  var dataLoaded = {};
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var field = parametersCopy.field;
    var page = NG.remove(parametersCopy, "page");
    parametersCopy.field = "wide" == field ? "Overall" : field;
    var records;
    var data = DataStore.load("statistics", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        var key = field + parametersCopy.period + parametersCopy.order + parametersCopy.filterType;
        if (!dataLoaded[key]) {
          dataLoaded[key] = true;
          setTimeout(function() {
            NG.Events.fireGlobal("statistics-forms-model-updated", []);
          }, 0);
        }
        records = data;
        var numberOfPages = Math.ceil(records.length / 15);
        NG.Events.fireGlobal("statistics-forms-data-loaded", [numberOfPages, page]);
      },
      dataType: "array",
      extraOptions: {
        page: page
      }
    });
    return this.prepareData(records, field, page);
  };
  this.prepareData = function(data, field, page) {
    var result = -1;
    if (data) {
      page = page || 1;
      var start = page == 1 ? 0 : (15 * (page - 1));
      var end = data.length < (15 * page) ? data.length : (15 * page);
      result = [];
      for (var i = start, l = end; i < l; i++) {
        var o = {
          StageId: data[i][0],
          TournamentName: data[i][1],
          SeasonId: data[i][2],
          TournamentId: data[i][3],
          RegionId: data[i][4],
          RegionCode: data[i][34],
          TeamId: data[i][5],
          TeamName: data[i][6],
          Matches: data[i][31]
        };
        var offset = 6;
        switch (field) {
        case "Home":
          offset += 8;
          o.Matches = data[i][32];
          break;
        case "Away":
          offset += 16;
          o.Matches = data[i][33];
          break;
        }
        jQuery.extend(o, {
          P: data[i][++offset],
          W: data[i][++offset],
          D: data[i][++offset],
          L: data[i][++offset],
          GF: data[i][++offset],
          GA: data[i][++offset],
          GD: data[i][++offset],
          Pts: data[i][++offset]
        });
        result.push(o);
      }
    }
    return result;
  };
}
function FormsModel(config) {
  var config = config || {};
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var field = NG.remove(parametersCopy, "field");
    var data = DataStore.load("forms", {
      parameters: parametersCopy,
      cache: config.cache,
      dataType: "array"
    });
    var result = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var o = {
        TeamId: data[i][1],
        TeamName: data[i][2],
        Matches: data[i][30]
      };
      var offset = 3;
      switch (field) {
      case "home":
        offset += 9;
        o.Matches = data[i][31];
        break;
      case "away":
        offset += 18;
        o.Matches = data[i][32];
        break;
      }
      jQuery.extend(o, {
        O: data[i][offset],
        P: data[i][++offset],
        W: data[i][++offset],
        D: data[i][++offset],
        L: data[i][++offset],
        GF: data[i][++offset],
        GA: data[i][++offset],
        GD: data[i][++offset],
        Pts: data[i][++offset]
      });
      if ("wide" == field) {
        jQuery.extend(o, {
          HO: data[i][12],
          HP: data[i][13],
          HW: data[i][14],
          HD: data[i][15],
          HL: data[i][16],
          HGF: data[i][17],
          HGA: data[i][18],
          HGD: data[i][19],
          HPts: data[i][20],
          AO: data[i][21],
          AP: data[i][22],
          AW: data[i][23],
          AD: data[i][24],
          AL: data[i][25],
          AGF: data[i][26],
          AGA: data[i][27],
          AGD: data[i][28],
          APts: data[i][29]
        });
      }
      result.push(o);
    }
    return result;
  };
}
var FormsView = function(eventData) {
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    var find = /<a class="(\w) (\w)" id="(\d+)" title="(.+?)"\/>/g;
    var replace = '<a class="box $1 $2" href="/Matches/$3/Live" title="$4">$1</a>';
    var lastMatch = /"(\/.+?)" title="(.+?)" /;
    var replaceLastMatch = '$1 title="Last Match: $2"';
    for (var i = 0, l = records.length; i < l; i++) {
      var matches = "";
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="o">' + o.O + "</td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="p">' + o.P + "</td>");
      t.push('<td class="w">' + o.W + "</td>");
      t.push('<td class="d">' + o.D + "</td>");
      t.push('<td class="l">' + o.L + "</td>");
      t.push('<td class="gf">' + o.GF + "</td>");
      t.push('<td class="ga">' + o.GA + "</td>");
      t.push('<td class="gd">' + (0 < o.GD ? "+" + o.GD : o.GD) + "</td>");
      t.push('<td class="pts">' + o.Pts + "</td>");
      if (o.Matches) {
        matches = o.Matches.replace(find, replace);
        matches = matches.replace(lastMatch, replaceLastMatch);
      }
      t.push('<td class="form">' + matches + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var StatisticsFormsView = function(eventData) {
  var records = eventData.model.records;
  var page = eventData.model.parameters.page ? eventData.model.parameters.page : 1;
  var index = ((page - 1) * 15) + 1;
  if (records) {
    var o, t = [];
    var find = /<a class="(\w) (\w)" id="(\d+)" title="(.+?)"\/>/g;
    var replace = '<a class="box $1 $2" href="/Matches/$3/Live" title="$4">$1</a>';
    var lastMatch = /"(\/.+?)" title="(.+?)" /;
    var replaceLastMatch = '$1 title="Last Match: $2"';
    for (var i = 0, l = records.length; i < l; i++) {
      var matches = "";
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="rank">' + (index++) + "</td>");
      t.push('<td class="tn">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="tournament"><a class="tournament-link iconize iconize-icon-left" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '"><span class="ui-icon country flg-' + o.RegionCode + '"></span>' + o.TournamentName + "</a></td>");
      t.push('<td class="p">' + o.P + "</td>");
      t.push('<td class="w">' + o.W + "</td>");
      t.push('<td class="d">' + o.D + "</td>");
      t.push('<td class="l">' + o.L + "</td>");
      t.push('<td class="gf">' + o.GF + "</td>");
      t.push('<td class="ga">' + o.GA + "</td>");
      t.push('<td class="gd">' + (0 < o.GD ? "+" + o.GD : o.GD) + "</td>");
      t.push('<td class="pts">' + o.Pts + "</td>");
      if (o.Matches) {
        matches = o.Matches.replace(find, replace);
        matches = matches.replace(lastMatch, replaceLastMatch);
      }
      t.push('<td class="form">' + matches + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var StatisticsPerformancesView = function(eventData) {
  var records = eventData.model.records;
  var page = eventData.model.parameters.page ? eventData.model.parameters.page : 1;
  var index = ((page - 1) * 15) + 1;
  if (records) {
    var o, t = [];
    var matches = "";
    var find = /<a class="(\w) (\w)" id="(\d+)" title="(.+?)"\/>/g;
    var replace = '<a class="box $1 $2" href="/Matches/$3/Live" title="$4">$1</a>';
    var lastMatch = /"(\/.+?)" title="(.+?)" /;
    var replaceLastMatch = '$1 title="Last Match: $2"';
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="rank">' + (index++) + "</td>");
      t.push('<td class="tn">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="tournament"><a class="tournament-link iconize iconize-icon-left" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '"><span class="ui-icon country flg-' + o.RegionCode + '"></span>' + o.TournamentName + "</a></td>");
      t.push('<td class="p">' + o.P + "</td>");
      t.push('<td class="w">' + o.W + "</td>");
      t.push('<td class="d">' + o.D + "</td>");
      t.push('<td class="l">' + o.L + "</td>");
      t.push('<td class="gf">' + o.GF + "</td>");
      t.push('<td class="ga">' + o.GA + "</td>");
      t.push('<td class="pts">' + o.Pts + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var FormsWideView = function(eventData) {
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
      t.push('<td class="o">' + o.O + "</td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="p shade">' + o.P + "</td>");
      t.push('<td class="w shade">' + o.W + "</td>");
      t.push('<td class="d shade">' + o.D + "</td>");
      t.push('<td class="l shade">' + o.L + "</td>");
      t.push('<td class="gf shade">' + o.GF + "</td>");
      t.push('<td class="ga shade">' + o.GA + "</td>");
      t.push('<td class="pts shade">' + o.Pts + "</td>");
      t.push('<td class="p">' + o.HP + "</td>");
      t.push('<td class="w">' + o.HW + "</td>");
      t.push('<td class="d">' + o.HD + "</td>");
      t.push('<td class="l">' + o.HL + "</td>");
      t.push('<td class="gf">' + o.HGF + "</td>");
      t.push('<td class="ga">' + o.HGA + "</td>");
      t.push('<td class="pts">' + o.HPts + "</td>");
      t.push('<td class="p shade">' + o.AP + "</td>");
      t.push('<td class="w shade">' + o.AW + "</td>");
      t.push('<td class="d shade">' + o.AD + "</td>");
      t.push('<td class="l shade">' + o.AL + "</td>");
      t.push('<td class="gf shade">' + o.AGF + "</td>");
      t.push('<td class="ga shade">' + o.AGA + "</td>");
      t.push('<td class="pts shade">' + o.APts + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var FormsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: FormsModel,
    cache: true
  },
  view: FormsView,
  sorter: {
    sortInfo: {
      property: "O",
      direction: "asc"
    }
  }
});
var FormsWideGridDefaults = $.extend({}, FormsGridDefaults, {
  view: FormsWideView
});
var StatisticsFormsGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: StatisticsFormsModel,
    cache: true
  },
  view: StatisticsFormsView,
  sorter: null
});
var StandingsWideGridDefaults = $.extend({}, StandingsGridDefaults, {
  view: StandingsWideView
});
var StatisticsPerformancesGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: StatisticsPerformancesModel,
    cache: true
  },
  view: StatisticsPerformancesView,
  sorter: null
});

function StreaksModel(config) {
  var config = config || {};
  var baseOffset = config.offset || 0;
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var field = NG.remove(parametersCopy, "field");
    var data = DataStore.load("streaks", {
      parameters: parametersCopy,
      cache: config.cache,
      dataType: "array"
    });
    var result = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var o = {
        TeamId: data[i][1],
        TeamName: data[i][2]
      };
      var offset = baseOffset + 2;
      switch (field) {
      case "home":
        offset += 8;
        break;
      case "away":
        offset += 16;
        break;
      }
      jQuery.extend(o, {
        O: data[i][++offset],
        W: data[i][++offset],
        WD: data[i][++offset],
        D: data[i][++offset],
        L: data[i][++offset],
        DL: data[i][++offset],
        CS: data[i][++offset],
        FS: data[i][++offset]
      });
      if ("wide" == field) {
        jQuery.extend(o, {
          HO: data[i][++offset],
          HW: data[i][++offset],
          HWD: data[i][++offset],
          HD: data[i][++offset],
          HL: data[i][++offset],
          HDL: data[i][++offset],
          HCS: data[i][++offset],
          HFS: data[i][++offset],
          AO: data[i][++offset],
          AW: data[i][++offset],
          AWD: data[i][++offset],
          AD: data[i][++offset],
          AL: data[i][++offset],
          ADL: data[i][++offset],
          ACS: data[i][++offset],
          AFS: data[i][++offset]
        });
      }
      result.push(o);
    }
    return result;
  };
}
function StatisticsStreaksModel(config) {
  var config = config || {};
  var baseOffset = config.offset || 0;
  var dataLoaded = {};
  this.load = function(parameters) {
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var field = parametersCopy.field;
    var page = NG.remove(parametersCopy, "page");
    parametersCopy.field = "wide" == field ? "Overall" : field;
    var records;
    DataStore.load("statistics", {
      parameters: parametersCopy,
      cache: config.cache,
      success: function(options, data) {
        var key = field + parametersCopy.statsSubType + parametersCopy.period + parametersCopy.streaksType + parametersCopy.filterType;
        if (!dataLoaded[key]) {
          dataLoaded[key] = true;
          setTimeout(function() {
            NG.Events.fireGlobal("statistics-streaks-model-updated", []);
          }, 0);
        }
        records = data;
        var numberOfPages = Math.ceil(records.length / 15);
        NG.Events.fireGlobal("statistics-streaks-data-loaded", [numberOfPages, page]);
      },
      dataType: "array",
      extraOptions: {
        page: page
      }
    });
    return this.prepareData(records, field, page);
  };
  this.prepareData = function(data, field, page) {
    var result = -1;
    if (data) {
      page = page || 1;
      var start = page == 1 ? 0 : (15 * (page - 1));
      var end = data.length < (15 * page) ? data.length : (15 * page);
      result = [];
      for (var i = start, l = end; i < l; i++) {
        var o = {
          TeamId: data[i][0],
          TeamName: data[i][1],
          StageId: data[i][2],
          TournamentName: data[i][3],
          SeasonId: data[i][4],
          TournamentId: data[i][5],
          RegionId: data[i][6],
          RegionCode: data[i][7],
          Streak: data[i][8],
          Type: data[i][11],
          P: data[i][12]
        };
        switch (field) {
        case "Home":
          o.Streak = data[i][9], o.P = data[i][13];
          break;
        case "Away":
          o.Streak = data[i][10], o.P = data[i][14];
          break;
        }
        result.push(o);
      }
    }
    return result;
  };
}
var StreaksView = function(eventData) {
  function getRowClass(o, sortProperty) {
    if ("O" != sortProperty && "TeamName" != sortProperty && o[sortProperty] < 1) {
      return "dim";
    }
    return "";
  }
  function filter(value) {
    return (0 == value) ? "." : value;
  }
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + " " + getRowClass(o, eventData.sorter.sortInfo.property) + '">');
      t.push('<td class="o">' + o.O + "</td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="w">' + filter(o.W) + "</td>");
      t.push('<td class="wd">' + filter(o.WD) + "</td>");
      t.push('<td class="d">' + filter(o.D) + "</td>");
      t.push('<td class="dl">' + filter(o.DL) + "</td>");
      t.push('<td class="l">' + filter(o.L) + "</td>");
      t.push('<td class="cs">' + filter(o.CS) + "</td>");
      t.push('<td class="fs">' + filter(o.FS) + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var StatisticsStreaksView = function(eventData) {
  function filter(value) {
    return (0 == value) ? "." : value;
  }
  var records = eventData.model.records;
  var page = eventData.model.parameters.page ? eventData.model.parameters.page : 1;
  var index = ((page - 1) * 15) + 1;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + ' ">');
      t.push('<td class="rank">' + (index++) + "</td>");
      t.push('<td class="tn">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="tournament"><a class="tournament-link iconize iconize-icon-left" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '"><span class="ui-icon country flg-' + o.RegionCode + '"></span>' + o.TournamentName + "</a></td>");
      t.push('<td class="' + o.Type + '">' + filter(o.Streak) + ' <span style="color: #999; ">(' + o.P + ")</span></td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var StreaksWideView = function(eventData) {
  function getRowClass(o, sortProperty) {
    if ("O" != sortProperty && "TeamName" != sortProperty && o[sortProperty] < 1) {
      return "dim";
    }
    return "";
  }
  function filter(value) {
    return (0 == value) ? "." : value;
  }
  var records = eventData.model.records;
  if (records) {
    var o, t = [];
    for (var i = 0, l = records.length; i < l; i++) {
      o = records[i];
      t.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + " " + getRowClass(o, eventData.sorter.sortInfo.property) + '">');
      t.push('<td class="o">' + o.O + "</td>");
      t.push('<td class="team">' + WS.TeamLink(o.TeamId, o.TeamName) + "</td>");
      t.push('<td class="w shade">' + filter(o.W) + "</td>");
      t.push('<td class="wd shade">' + filter(o.WD) + "</td>");
      t.push('<td class="d shade">' + filter(o.D) + "</td>");
      t.push('<td class="dl shade">' + filter(o.DL) + "</td>");
      t.push('<td class="l shade">' + filter(o.L) + "</td>");
      t.push('<td class="cs shade">' + filter(o.CS) + "</td>");
      t.push('<td class="fs shade">' + filter(o.FS) + "</td>");
      t.push('<td class="w">' + filter(o.HW) + "</td>");
      t.push('<td class="wd">' + filter(o.HWD) + "</td>");
      t.push('<td class="d">' + filter(o.HD) + "</td>");
      t.push('<td class="dl">' + filter(o.HDL) + "</td>");
      t.push('<td class="l">' + filter(o.HL) + "</td>");
      t.push('<td class="cs">' + filter(o.HCS) + "</td>");
      t.push('<td class="fs">' + filter(o.HFS) + "</td>");
      t.push('<td class="w shade">' + filter(o.AW) + "</td>");
      t.push('<td class="wd shade">' + filter(o.AWD) + "</td>");
      t.push('<td class="d shade">' + filter(o.AD) + "</td>");
      t.push('<td class="dl shade">' + filter(o.ADL) + "</td>");
      t.push('<td class="l shade">' + filter(o.AL) + "</td>");
      t.push('<td class="cs shade">' + filter(o.ACS) + "</td>");
      t.push('<td class="fs shade">' + filter(o.AFS) + "</td>");
      t.push("</tr>");
    }
    return t.join("");
  }
  return "";
};
var StreaksGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: StreaksModel,
    cache: true
  },
  view: StreaksView,
  sorter: {
    sortInfo: {
      property: "O",
      direction: "asc"
    }
  }
});
var StatisticsStreaksGridDefaults = $.extend({}, gridDefaults, {
  model: {
    type: StatisticsStreaksModel,
    cache: true
  },
  view: StatisticsStreaksView,
  sorter: null
});
var StreaksWideGridDefaults = $.extend({}, StreaksGridDefaults, {
  view: StreaksWideView
});
var SeasonStreaksGridDefaults = $.extend({}, StreaksGridDefaults, {
  model: $.extend({}, StreaksGridDefaults.model, {})
});
var SeasonStreaksWideGridDefaults = $.extend({}, SeasonStreaksGridDefaults, {
  view: StreaksWideView
});

function StageFixturesPresenter(config) {
  var config = config || {},
      self = this,
      selectedMatch = null,
      visibleIncidents = {},
      incidentManager = new IncidentManager({
      rootElement: "#tournament-fixture-wrapper",
      view: StageIncidentsView
    });
  this.highlightMask = null;
  this.load = function(parameters) {
    parameters = parameters || {};
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    DataStore.load("stagefixtures", {
      parameters: parametersCopy,
      success: success,
      error: error,
      dataType: "array",
      cache: true
    }, this);
  };

  function success(options, data) {
    var model = new StageFixturesModel(data);
    $(config.wrapper).html(StageFixturesView(model, config.showPins));
    incidentManager.clearIncidents();
    selectedMatch = null;
    self.highlightMask = null;
    NG.Events.fire(this, "highlightoff");
    NG.Events.fire(this, "loaded");
  }
  function error() {}
  function switchOn($el) {
    selectedMatch = $el;
    $el.data("selected", true);
    var ids = [];
    $el.addClass("ui-state-active").parents("tr:first").addClass("highlight").find("td.team").each(function() {
      ids.push($(this).attr("data-id"));
    });
    self.highlightMask = ids;
    NG.Events.fire(self, "highlighton", [self.highlightMask]);
  }
  function switchOff($el) {
    selectedMatch = null;
    $el.data("selected", false);
    $el.removeClass("ui-state-active").parents("tr:first").removeClass("highlight");
    self.highlightMask = null;
    NG.Events.fire(self, "highlightoff");
  }
  $("#tournament-fixture-wrapper").on("click", ".button-small.hilight", function() {
    var $el = $(this);
    if (null == selectedMatch) {
      switchOn($el);
    } else {
      if (selectedMatch && $el.data("selected")) {
        switchOff(selectedMatch);
      } else {
        switchOff(selectedMatch);
        switchOn($el);
      }
    }
    return false;
  });
}
function StageFixturesModel(data) {
  var result = [],
      record;
  if (undefined == data || (undefined == data.length && 0 == data.length)) {
    return result;
  }
  for (var i = 0, l = data.length; i < l; i++) {
    record = data[i];
    var o = {};
    o.Id = record[0];
    o.Status = record[1];
    o.StartDate = record[2];
    o.StartTime = record[3];
    o.HomeTeamId = record[4];
    o.HomeTeamName = record[5];
    o.HomeRCards = record[6];
    o.AwayTeamId = record[7];
    o.AwayTeamName = record[8];
    o.AwayRCards = record[9];
    o.Score = record[10];
    o.HTScore = record[11];
    o.HasIncidents = record[12];
    o.HasPreview = record[13];
    o.Elapsed = record[14];
    o.Result = record[15];
    o.IsInternational = record[16];
    o.IsOpta = record[19] || record[17];
    o.CommentCount = record[18];
    result.push(o);
  }
  return result;
}
var StageFixturesView = function(records, showPins) {
  var o, t = [],
      lastDate = null,
      z, alt = true;
  showPins = (null != showPins) ? showPins : true;
  t.push('<table id="tournament-fixture" class="grid hover fixture"><tbody>');
  for (var i = 0, l = records.length; i < l; i++) {
    o = records[i];
    var matchHasTerminatedUnexpectedly = matchTerminatedUnexpectedly(o.Elapsed);
    if (lastDate != o.StartDate) {
      lastDate = o.StartDate;
      t.push('<tr class="rowgroupheader"><th colspan="7">' + lastDate + "</th></tr>");
      z = 0;
      alt = true;
    }
    t.push('<tr class="item ' + ((alt) ? "alt" : ""));
    t.push('" data-id="');
    t.push(o.Id);
    t.push('">');
    t.push('<td class="toolbar left">');
    if (true == showPins) {
      t.push('<a href="#" class="hilight button-small ui-state-transparent-default rc" title="Highlight teams in tables below"><span class="ui-icon ui-icon-pin-w"></span></a>');
    }
    if (o.HasIncidents) {
      t.push('<a href="#" class="show-incidents button-small ui-state-transparent-default rc" title="Details"><span class="ui-icon ui-icon-triangle-1-e"></span></a>');
    }
    t.push("</td>");
    t.push('<td class="time">' + o.StartTime + "</td>");
    t.push('<td class="status"><span class="status-' + o.Status + ' rc">' + (o.Elapsed ? o.Elapsed : "") + "</span></td>");
    t.push('<td class="team home' + (1 == o.Result ? " winner" : "") + '" data-id="' + o.HomeTeamId + '">');
    if (0 < o.HomeRCards) {
      t.push('<span class="rcard ls-e">' + o.HomeRCards + "</span>");
    }
    t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
    t.push("</td>");
    t.push('<td class="result">');
    if (matchHasTerminatedUnexpectedly) {
      t.push('<a title="' + matchTerminatedUnexpectedlyToolTip(o.Elapsed) + '" href="/Matches/' + o.Id + '">' + o.Score + "</a>");
    } else {
      if (("2" == o.Status || "1" == o.Status)) {
        t.push('<a class="result-' + o.Status + ' rc" href="/Matches/' + o.Id + '/Live">' + o.Score + "</a>");
      } else {
        t.push('<a class="result-' + o.Status + ' rc"  href="/Matches/' + o.Id + '">' + o.Score + "</a>");
      }
    }
    t.push("</td>");
    t.push('<td class="team away' + (2 == o.Result ? " winner" : "") + '" data-id="' + o.AwayTeamId + '">');
    t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
    if (0 < o.AwayRCards) {
      t.push('<span class="rcard ls-e">' + o.AwayRCards + "</span>");
    }
    t.push("</td>");
    t.push('<td class="toolbar right">');
    if ("1" == o.Status && o.IsOpta && !matchHasTerminatedUnexpectedly) {
      t.push('<a href="/Matches/' + o.Id + '/MatchReport" class="match-link match-report rc">Match Report</a>');
    }
    if ("2" == o.Status) {
      t.push('<a href="/Matches/' + o.Id + '/Live" class="match-link live rc" title="Live">Match Centre</a>');
    }
    if ("4" == o.Status && o.HasPreview) {
      t.push('<a href="/Matches/' + o.Id + '/Preview" class="match-link preview rc" title="Preview">Preview</a>');
    }
    if (0 < o.CommentCount) {
      t.push('<a title="Comments" class="iconize iconize-icon-right fixture-comments" href="/Matches/' + o.Id + '"><span class="incidents-icon ui-icon comments"></span>' + o.CommentCount + "</a>");
    }
    t.push("</td>");
    t.push("</tr>");
    alt = !alt;
  }
  t.push("</tbody>");
  t.push("</table>");
  return t.join("");
};
var HomeIncidentsView = function(id, data, className) {
  function getIncidentClass(type) {
    return (1 == type) ? "i-goal" : "i-rcard";
  }
  var t = [];
  for (var i = 0, l = data.length; i < l; i++) {
    var incident = data[i];
    var period = incident[7];
    var minute = incident[1];
    if (period) {
      if (1 == period && 45 < minute) {
        minute = 45;
      } else {
        minute = Math.min(period * 45, minute);
      }
    }
    var playerName = incident[3] ? incident[3] : "";
    t.push('<tr class="' + (className || "") + " incident " + (i == data.length - 1 ? "last" : "") + '" data-match-id="m');
    t.push(id);
    t.push('">');
    if ("0" == incident[2]) {
      t.push('<td class="team home" colspan="5">');
      t.push('<span class="iconize iconize-icon-right"><span class="incidents-icon ui-icon ' + getIncidentClass(incident[0]) + '"></span>');
      if (incident[4] != undefined) {
        t.push('<span class="goal-info">(' + incident[4] + ")</span>");
      }
      t.push(0 != incident[6] ? ('<a class="player-link" href="/Players/' + incident[6] + '">' + playerName + "</a>") : playerName);
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away" colspan="3"></td>');
    } else {
      t.push('<td class="team home" colspan="5"></td>');
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away" colspan="3">');
      t.push('<span class="iconize iconize-icon-left"><span class="ui-icon incidents-icon ' + getIncidentClass(incident[0]) + '"></span>');
      t.push(0 != incident[6] ? ('<a class="player-link" href="/Players/' + incident[6] + '">' + playerName + "</a>") : playerName);
      if (incident[4] != undefined) {
        t.push('<span class="goal-info">(' + incident[4] + ")</span>");
      }
      t.push("</span>");
      t.push("</td>");
    }
    t.push('<td class="toolbar"></td>');
    t.push("</tr>");
  }
  return t.join("");
};
var StageIncidentsView = function(id, data, className) {
  function getIncidentClass(type, subType) {
    return (1 == type) ? "i-goal" : (subType && 2 == subType) ? "i-y2card" : "i-rcard";
  }
  var t = [],
      detail;
  for (var i = 0, l = data.length; i < l; i++) {
    detail = data[i];
    var period = detail[7];
    var minute = detail[1];
    if (period) {
      if (1 == period && 45 < minute) {
        minute = 45;
      } else {
        minute = Math.min(period * 45, minute);
      }
    }
    t.push('<tr class="' + (className || "") + " incident " + (i == data.length - 1 ? "last" : "") + '" data-match-id="m');
    t.push(id);
    t.push('">');
    t.push('<td class="toolbar"></td>');
    t.push('<td class="time"></td>');
    t.push('<td class="status"></td>');
    if ("0" == detail[2]) {
      t.push('<td class="team home">');
      t.push('<span class="iconize iconize-icon-right"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0], detail[5]) + '"></span>');
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push(0 != detail[6] ? (WS.PlayerLink(detail[6], detail[3])) : detail[3]);
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away"></td>');
    } else {
      t.push('<td class="team home"></td>');
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away">');
      t.push('<span class="iconize iconize-icon-left"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0], detail[5]) + '"></span>');
      t.push(WS.PlayerLink(detail[6], detail[3]));
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push("</span>");
      t.push("</td>");
    }
    t.push('<td class="toolbar"></td>');
    t.push("</tr>");
  }
  return t.join("");
};

function PreviewFormPresenter(config) {
  var config = config || {};
  this.load = function(parameters) {
    $(config.wrapper).html('<table class="grid highlight"><tbody><td class="loading"> Loading.. </td></tbody></table>');
    parameters = parameters || {};
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    var overallForm = new PreviewFormModel(parametersCopy.overallForm);
    var fieldForm = new PreviewFormModel(parametersCopy.fieldForm);
    if (overallForm.length == 0 && fieldForm.length == 0) {
      $(config.wrapper).html(PreviewFormEmptyView());
    } else {
      $(config.wrapper).html(PreviewFormView(parametersCopy.teamId, parametersCopy.field, overallForm, fieldForm));
    }
  };
}
function PreviewFormModel(data) {
  var result = [],
      record;
  if (undefined == data || (undefined == data.length && 0 == data.length)) {
    return result;
  }
  for (var i = data.length - 1; 0 <= i; i--) {
    record = data[i];
    var o = {};
    o.Id = record[0];
    o.HomeTeamId = record[4];
    o.HomeTeamName = record[5];
    o.AwayTeamId = record[7];
    o.AwayTeamName = record[8];
    o.Score = record[10];
    o.Result = record[17];
    result.push(o);
  }
  return result;
}
function getResult(o, teamId) {
  if (matchTerminatedUnexpectedly(o.Elapsed)) {
    return;
  }
  var result = o.Result;
  var field = (teamId == o.HomeTeamId) ? 1 : 2;
  if (result == -1) {
    return null;
  }
  if (0 == result) {
    return "d";
  }
  if (result == field) {
    return "w";
  }
  return "l";
}
function PreviewFormEmptyView() {
  return '<div class="empty note"> No recent form..</div>';
}
function PreviewFormView(teamId, field, overallForm, fieldForm) {
  var t = [];

  function getForm(formData, field) {
    var f = [];
    var matches = [];
    var statsField = field || "Overall";
    f.push("<tr>");
    f.push('<td class="title">' + statsField + "</td>");
    f.push('<td class="form">');
    for (var i = 0, l = formData.length; i < l; i++) {
      var o = formData[i];
      var result = getResult(o, teamId);
      if (result) {
        matches.push('<a class="box ' + result + '" href="/Matches/' + o.Id + '/Live" title="' + o.HomeTeamName + " " + o.Score + " " + o.AwayTeamName + '">' + result + "</a>");
      }
    }
    matches = matches.join("");
    f.push(matches);
    f.push("</td>");
    f.push("</tr>");
    return f.join("");
  }
  t.push('<table class="grid gray"><tbody>');
  t.push(getForm(overallForm));
  t.push(getForm(fieldForm, field));
  t.push("</tbody></table>");
  return t.join("");
}
function H2HTeamFixturesPresenter(config) {
  var id, config = config || {},
      view;
  init(config);
  this.load = function(data) {
    renderLoading();
    render(data);
  };
  this.id = function() {
    return id;
  };

  function render(data) {
    var records = new H2HTeamFixturesModel(data.value);
    $("#" + view.renderTo + "-matches").html(H2HTeamFixturesView(records, data.teamId, data.field));
  }
  function init(config) {
    view = config.view;
    id = view.renderTo;
  }
  function renderLoading() {
    var height = $("table", "#" + view.renderTo).height();
    $("#" + view.renderTo).html('<table class="grid hover" style="height:' + height + 'px;"><tbody><tr><td class="note"> <div style="text-align: center; font-weight: bold;">Loading..</div> </td></tr></tbody></table>');
  }
}
function TeamFixturesPresenter(config) {
  var config = config || {},
      incidentManager = new IncidentManager({
      rootElement: "#" + config.gridId,
      view: TeamIncidentsView
    });
  this.load = function(parameters) {
    renderLoading(config.wrapper);
    parameters = parameters || {};
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    DataStore.load("teamfixtures", {
      parameters: parametersCopy,
      success: success,
      error: error,
      dataType: "array",
      cache: true
    }, this);
  };

  function renderLoading(element) {
    var height = $("table", config.wrapper).height();
    $(config.wrapper).html('<table class="grid hover" style="height:' + height + 'px;"><tbody><tr><td class="stats-loading"><div class="loading-text">Loading..</div></td></tr></tbody></table>');
  }
  function success(options, data) {
    incidentManager.clearIncidents();
    var model = new TeamFixturesModel(data);
    $(config.wrapper).html(TeamFixturesView(config.gridId, model, config.defaultParameters.teamId));
    NG.Events.fire(this, "loaded");
  }
  function error() {
    $(config.wrapper).html('<table class="grid hover"><tbody><td class="note empty"> No matches found.. </td></tbody></table>');
  }
}
function TeamFixturesSummaryPresenter(config) {
  var id, config = config || {},
      $view, $content, incidentManager;
  init(config);
  this.load = function(data) {
    renderLoading();
    var records = prepareData(data);
    clearLoading();
    render(records);
  };
  this.id = function() {
    return id;
  };

  function render(records) {
    $content.html(TeamFixturesSummaryView(records.teamId, records));
  }
  function prepareData(data) {
    var previousMatches = new TeamFixturesSummaryModel(data[1], true);
    var nextMatches = new TeamFixturesSummaryModel(data[2]);
    return {
      teamId: data[0],
      previous: previousMatches,
      next: nextMatches
    };
  }
  function init(config) {
    id = config.view.renderTo;
    $view = $("#" + id);
    $content = $("#" + id + "-matches");
    incidentManager = new IncidentManager({
      rootElement: "#" + id,
      view: TeamIncidentsView
    });
  }
  function renderLoading() {
    var height = $("table", $view).height();
    $view.append('<table id="' + (id + "-loading") + '"class="grid hover" style="height:' + height + 'px;"><tbody><tr><td class="note"> <div style="text-align: center; font-weight: bold;">Loading..</div> </td></tr></tbody></table>');
  }
  function clearLoading() {
    $("#" + id + "-loading").remove();
  }
  function error() {
    $view.html('<table class="grid hover"><tbody><td class="note empty"> No matches found.. </td></tbody></table>');
  }
}
function PreviousMeetingsPresenter(config) {
  var config = config || {},
      incidentManager = new IncidentManager({
      rootElement: "#" + config.gridId + "-wrapper",
      view: PreviousMeetingsIncidentsView
    });
  this.load = function(parameters) {
    renderLoading(config.wrapper);
    parameters = parameters || {};
    var parametersCopy = $.extend({}, config.defaultParameters, parameters);
    DataStore.load("previousmeetings", {
      parameters: parametersCopy,
      success: success,
      error: error,
      dataType: "array",
      cache: true
    }, this);
  };

  function renderLoading(element) {
    var height = $("table", config.wrapper).height();
    $(element).html('<table class="grid hover" style="height:' + height + 'px;"><tbody><tr><td class="note"> <span class="stats-loading"><span class="loading-text">Loading..</span></span> </td></tr></tbody></table>');
  }
  function success(options, data) {
    incidentManager.clearIncidents();
    var model = new PreviousMeetingsModel(data);
    if (0 == model.length) {
      $("#previous-meetings-container").hide();
      return;
    }
    $("#previous-meetings-count").html(" (Last " + model.length + " matches)");
    var stats = calculateStats(model, config.homeTeamId, config.awayTeamId);
    $(config.statsWrapper).html(PreviousMeetingsStatsView(stats, {
      name: config.homeTeamName,
      id: config.homeTeamId
    }, {
      name: config.awayTeamName,
      id: config.awayTeamId
    }));
    $(document).triggerHandler("fix-zeros", [$(".previous-stat", $(config.statsWrapper))]);
    $(config.wrapper).html(PreviousMeetingsView(config.gridId, model, config.defaultParameters.teamId));
    NG.Events.fire(this, "loaded");
  }
  function getTeamStatsInMatch(match, teamId) {
    if (match.HomeTeamId == teamId) {
      return {
        Red: match.HomeRCards,
        Yellow: match.HomeYellowCards,
        Goal: getTeamScore(match.Score, 0)
      };
    } else {
      return {
        Red: match.AwayRCards,
        Yellow: match.AwayYellowCards,
        Goal: getTeamScore(match.Score, 1)
      };
    }
  }
  function addNewStats(stats, newStats) {
    for (var stat in newStats) {
      stats[stat] += newStats[stat];
    }
  }
  function calculateStats(records, homeTeamId, awayTeamId) {
    if (null != records && undefined != records) {
      var stats = {
        home: 0,
        draw: 0,
        away: 0,
        homeStats: {
          Red: 0,
          Yellow: 0,
          Goal: 0
        },
        awayStats: {
          Red: 0,
          Yellow: 0,
          Goal: 0
        },
        percentages: {}
      };
      var length = records.length;
      for (var i = 0; i < length; i++) {
        var o = records[i];
        var result = getResult(o, homeTeamId);
        if (result == "w") {
          stats.home++;
        } else {
          if (result == "l") {
            stats.away++;
          } else {
            stats.draw++;
          }
        }
        addNewStats(stats.homeStats, getTeamStatsInMatch(o, homeTeamId));
        addNewStats(stats.awayStats, getTeamStatsInMatch(o, awayTeamId));
      }
      stats.percentages.homeWinPercentage = (0 == length) ? 0 : Math.round((stats.home / length) * 100);
      stats.percentages.awayWinPercentage = (0 == length) ? 0 : Math.round((stats.away / length) * 100);
      stats.percentages.drawPercentage = (0 == length) ? 0 : Math.round((stats.draw / length) * 100);
      stats.totalMatches = length;
      return stats;
    }
  }
  function getTeamScore(score, field) {
    score = stripAlphaChars(score);
    var scores = score.split(":");
    if (null == scores || scores.length != 2) {
      return 0;
    }
    return parseInt(scores[field]);
  }
  function error() {
    $(config.wrapper).html('<table class="grid hover"><tbody><td class="note empty"> No matches found.. </td></tbody></table>');
  }
}
function stripAlphaChars(source) {
  if (!source) {
    return;
  }
  var m_strOut = new String(source);
  m_strOut = m_strOut.replace(/[^0-9:]/g, "");
  return m_strOut;
}
function PreviousMeetingsStatsView(stats, homeInfo, awayInfo) {
  var t = [];
  t.push('<table class="grid summary">');
  t.push("<thead>");
  t.push('<th><span class="incidents-icon ui-icon i-goal"></span></span></th>');
  t.push('<th><span class="incidents-icon ui-icon yellow"></span></th>');
  t.push('<th><span class="incidents-icon ui-icon red"></span></th>');
  t.push("<th></th>");
  t.push('<th><span class="title">Won (' + getPercentage(stats.home, stats.totalMatches) + "%)</span></th>");
  t.push('<th><span class="title">Drew (' + getPercentage(stats.draw, stats.totalMatches) + "%)</span></th>");
  t.push('<th><span class="title">Won (' + getPercentage(stats.away, stats.totalMatches) + "%)</span></th>");
  t.push("<th></th>");
  t.push('<th><span class="incidents-icon ui-icon i-goal"></span></th>');
  t.push('<th><span class="incidents-icon ui-icon yellow"></span></th>');
  t.push('<th><span class="incidents-icon ui-icon red"></span></th>');
  t.push("</thead>");
  t.push("<tbody>");
  t.push("<tr>");
  t.push('<td class="previous-stat">' + stats.homeStats.Goal + "</td>");
  t.push('<td class="previous-stat">' + stats.homeStats.Yellow + "</td>");
  t.push('<td class="previous-stat">' + stats.homeStats.Red + "</td>");
  t.push('<td title="' + homeInfo.name + '">' + WS.TeamEmblemUrl(homeInfo.id) + "</td>");
  t.push("<td>");
  t.push('<span class="stat-bars-with-field-colors" title="' + homeInfo.name + ' win percentage in previous matches">');
  t.push('<span class="stat-bar-wrapper home right" style="width: 60px">');
  t.push('<span class="stat-bar rc-r" style="width: ' + getPreviousMeetingsBarWidth(stats, "homeWinPercentage") + '%;">');
  t.push('<span class="stat-value">' + (stats.home + "/" + stats.totalMatches) + "</span>");
  t.push("</span>");
  t.push("</td>");
  t.push("<td>");
  t.push('<span class="stat-bars-with-field-colors" title="Draw percentage in previous matches">');
  t.push('<span class="stat-bar-wrapper draw" style="width: 60px">');
  t.push('<span class="stat-bar rc-r" style="width: ' + getPreviousMeetingsBarWidth(stats, "drawPercentage") + '%;">');
  t.push('<span class="stat-value">' + (stats.draw + "/" + stats.totalMatches) + "</span>");
  t.push("</span>");
  t.push("</span>");
  t.push("</td>");
  t.push("<td>");
  t.push('<span class="stat-bars-with-field-colors" title="' + awayInfo.name + ' win percentage in previous matches">');
  t.push('<span class="stat-bar-wrapper away" style="width: 60px">');
  t.push('<span class="stat-bar rc-r" style="width: ' + getPreviousMeetingsBarWidth(stats, "awayWinPercentage") + '%;">');
  t.push('<span class="stat-value">' + stats.away + "/" + stats.totalMatches + "</span>");
  t.push("</span>");
  t.push("</span>");
  t.push("</td>");
  t.push('<td title="' + awayInfo.name + '">' + WS.TeamEmblemUrl(awayInfo.id) + "</td>");
  t.push('<td class="previous-stat">' + stats.awayStats.Goal + "</td>");
  t.push('<td class="previous-stat">' + stats.awayStats.Yellow + "</td>");
  t.push('<td class="previous-stat">' + stats.awayStats.Red + "</td>");
  t.push("</tr>");
  t.push("</tbody>");
  t.push("</table>");
  return t.join("");
}
function getPreviousMeetingsBarWidth(stats, percentage) {
  if (stats.percentages[percentage] == 0) {
    return 0;
  }
  var sum = 0,
      count = 0;
  for (var p in stats.percentages) {
    sum += stats.percentages[p];
    count++;
  }
  return parseInt(stats.percentages[percentage] - ((sum - 100) / count));
}
function PreviousMeetingsModel(data) {
  var result = [],
      record;
  if (undefined == data || (undefined == data.length && 0 == data.length)) {
    return result;
  }
  for (var i = 0, l = data.length; i < l; i++) {
    record = data[i];
    var o = {};
    o.Id = record[0];
    o.Status = record[1];
    o.StartDate = record[2];
    o.StartTime = record[3];
    o.HomeTeamId = record[4];
    o.HomeTeamName = record[5];
    o.HomeRCards = record[6];
    o.AwayTeamId = record[7];
    o.AwayTeamName = record[8];
    o.AwayRCards = record[9];
    o.Score = record[10];
    o.HTScore = record[11];
    o.HasIncidents = record[12];
    o.HasPreview = record[13];
    o.Elapsed = record[14];
    o.SeasonName = record[15];
    o.TournamentName = record[16];
    o.Result = record[17];
    o.TournamentId = record[18];
    o.RegionId = record[19];
    o.SeasonId = record[20];
    o.StageId = record[21];
    o.HomeYellowCards = record[22];
    o.AwayYellowCards = record[23];
    o.HomeTeamCountryCode = record[24];
    o.AwayTeamCountryCode = record[25];
    o.TournamentShortName = record[26];
    o.IsInternational = record[27];
    o.IsOpta = record[28] || record[29];
    result.push(o);
  }
  return result;
}
function TeamFixturesSummaryModel(data, asc) {
  var result = [],
      record;
  if (undefined == data || (undefined == data.length && 0 == data.length)) {
    return result;
  }
  for (var i = 0, l = data.length; i < l; i++) {
    record = data[i];
    var o = {};
    o.Id = record[0];
    o.Status = record[1];
    o.StartDate = record[2];
    o.StartTime = record[3];
    o.HomeTeamId = record[4];
    o.HomeTeamName = record[5];
    o.HomeRCards = record[6];
    o.AwayTeamId = record[7];
    o.AwayTeamName = record[8];
    o.AwayRCards = record[9];
    o.Score = record[10];
    o.HTScore = record[11];
    o.HasIncidents = record[12];
    o.HasPreview = record[13];
    o.Elapsed = record[14];
    o.SeasonName = record[15];
    o.TournamentName = record[16];
    o.Result = record[17];
    o.TournamentId = record[18];
    o.RegionId = record[19];
    o.SeasonId = record[20];
    o.StageId = record[21];
    o.TournamentShortName = record[22];
    o.HomeTeamCountryCode = record[23];
    o.AwayTeamCountryCode = record[24];
    o.IsInternational = record[25];
    o.IsOpta = record[26] || record[27];
    result.push(o);
  }
  if (asc) {
    var reverted = [];
    for (var i = result.length - 1, l = 0; l <= i; i--) {
      reverted.push(result[i]);
    }
    return reverted;
  }
  return result;
}
function TeamFixturesModel(data) {
  var result = [],
      record;
  if (undefined == data || (undefined == data.length && 0 == data.length)) {
    return result;
  }
  for (var i = 0, l = data.length; i < l; i++) {
    record = data[i];
    var o = {};
    o.Id = record[0];
    o.Status = record[1];
    o.StartDate = record[2];
    o.StartTime = record[3];
    o.HomeTeamId = record[4];
    o.HomeTeamName = record[5];
    o.HomeRCards = record[6];
    o.AwayTeamId = record[7];
    o.AwayTeamName = record[8];
    o.AwayRCards = record[9];
    o.Score = record[10];
    o.HTScore = record[11];
    o.HasIncidents = record[12];
    o.HasPreview = record[13];
    o.Elapsed = record[14];
    o.SeasonName = record[15];
    o.TournamentName = record[16];
    o.Result = record[17];
    o.TournamentId = record[18];
    o.RegionId = record[19];
    o.SeasonId = record[20];
    o.StageId = record[21];
    o.TournamentShortName = record[22];
    o.HomeTeamCountryCode = record[23];
    o.AwayTeamCountryCode = record[24];
    o.IsInternational = record[25];
    o.IsOpta = record[26] || record[27];
    result.push(o);
  }
  return result;
}
function H2HTeamFixturesModel(data) {
  var result = {
    lastMatches: [],
    nextMatch: []
  },
      record;
  var lastMatches = data[0];
  var nextMatch = data[1];
  if (undefined == data || (undefined == data.length && 0 == data.length)) {
    return result;
  }
  function getModel(record) {
    var o = {};
    o.Id = record[0];
    o.Status = record[1];
    o.StartDate = record[2];
    o.StartTime = record[3];
    o.HomeTeamId = record[4];
    o.HomeTeamName = record[5];
    o.HomeRCards = record[6];
    o.AwayTeamId = record[7];
    o.AwayTeamName = record[8];
    o.AwayRCards = record[9];
    o.Score = record[10];
    o.HTScore = record[11];
    o.HasIncidents = record[12];
    o.HasPreview = record[13];
    o.Elapsed = record[14];
    o.SeasonName = record[15];
    o.TournamentName = record[16];
    o.Result = record[17];
    o.TournamentId = record[18];
    o.RegionId = record[19];
    o.SeasonId = record[20];
    o.StageId = record[21];
    o.TournamentShortName = record[22];
    o.HomeTeamCountryCode = record[23];
    o.AwayTeamCountryCode = record[24];
    o.IsInternational = record[25];
    o.IsOpta = record[26] || record[27];
    return o;
  }
  for (var i = 0, l = lastMatches.length; i < l; i++) {
    result.lastMatches.push(getModel(lastMatches[i]));
  }
  for (var i = 0, l = nextMatch.length; i < l; i++) {
    result.nextMatch.push(getModel(nextMatch[i]));
  }
  return result;
}
var unexpectedTerminationStatuses = [{
  v: "Abd",
  t: "Abandoned"
}, {
  v: "Post",
  t: "Postponed"
}, {
  v: "Can",
  t: "Canceled"
}, {
  v: "Susp",
  t: "Suspended"
}];

function matchTerminatedUnexpectedly(elapsed) {
  for (var i = 0; i < unexpectedTerminationStatuses.length; i++) {
    if (elapsed == unexpectedTerminationStatuses[i].v) {
      return true;
    }
  }
  return false;
}
function matchTerminatedUnexpectedlyToolTip(elapsed) {
  for (var i = 0; i < unexpectedTerminationStatuses.length; i++) {
    if (elapsed == unexpectedTerminationStatuses[i].v) {
      return unexpectedTerminationStatuses[i].t;
    }
  }
  return "";
}
function PreviousMeetingsView(gridId, data, teamId) {
  var o, t = [],
      lastDate = null;
  t.push('<table id="' + gridId + '" class="grid fixture"><tbody>');
  var length = data.length;
  if (0 == length) {
    t.push('<td class="note empty"> No matches found.. </td>');
  } else {
    for (var i = 0, l = data.length; i < l; i++) {
      o = data[i];
      var matchHasTerminatedUnexpectedly = matchTerminatedUnexpectedly(o.Elapsed);
      t.push('<tr class="item ' + ((0 == i % 2) ? "alt" : "") + '"');
      t.push(' data-id="');
      t.push(o.Id);
      t.push('">');
      t.push('<td class="toolbar">');
      if (o.HasIncidents) {
        t.push('<a href="#" class="show-incidents button-small ui-state-transparent-default rc" title="Details"><span class="ui-icon ui-icon-triangle-1-e"></span></a>');
      }
      t.push("</td>");
      t.push('<td class="tournament"><a title="' + o.TournamentName + '" class="tournament-link" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '">' + (o.TournamentShortName ? o.TournamentShortName : o.TournamentName) + "</a></td>");
      t.push('<td class="date">' + o.StartDate + "</td>");
      t.push('<td class="status">');
      if (matchTerminatedUnexpectedly) {
        t.push('<span class="status-' + o.Status + ' rc">' + o.Elapsed + "</span>");
      }
      t.push("</td>");
      t.push('<td class="team home' + (1 == o.Result ? " winner" : "") + '">');
      if (0 < o.HomeRCards) {
        t.push('<span class="rcard ls-e">' + o.HomeRCards + "</span>");
      }
      if (o.IsInternational && o.HomeTeamCountryCode) {
        t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
      } else {
        t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
      }
      t.push("</td>");
      t.push('<td class="result">');
      if (o.HasPreview && "4" == o.Status) {
        t.push('<a href="/Matches/' + o.Id + '/Preview" class="iconize" title="Preview"><span class="incidents-icon ui-icon preview"></span></a>');
      } else {
        if (matchHasTerminatedUnexpectedly) {
          t.push('<a title="' + matchTerminatedUnexpectedlyToolTip(o.Elapsed) + '" href="/Matches/' + o.Id + '">' + o.Score + "</a>");
        } else {
          if (("2" == o.Status || "1" == o.Status)) {
            t.push('<a class="result-' + o.Status + ' rc" href="/Matches/' + o.Id + '/Live">' + o.Score + "</a>");
          } else {
            t.push('<a class="result-' + o.Status + ' rc"  href="/Matches/' + o.Id + '">' + o.Score + "</a>");
          }
        }
      }
      t.push("</td>");
      t.push('<td class="team away' + (2 == o.Result ? " winner" : "") + '">');
      if (o.IsInternational && o.AwayTeamCountryCode) {
        t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
      } else {
        t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
      }
      if (0 < o.AwayRCards) {
        t.push('<span class="rcard ls-e">' + o.AwayRCards + "</span>");
      }
      t.push("</td>");
      t.push('<td class="toolbar right">');
      t.push('<a href="/Matches/' + o.Id + '" class="iconize" title="Head to head"><span class="incidents-icon ui-icon h2h"></span></a>');
      if (o.HasPreview && "4" != o.Status) {
        t.push('<a href="/Matches/' + o.Id + '/Preview" class="iconize" title="Preview"><span class="incidents-icon ui-icon preview"></span></a>');
      }
      t.push("</td>");
      t.push("</tr>");
    }
  }
  t.push("</tbody></table>");
  return t.join("");
}
function H2HTeamFixturesView(matches, teamId, field) {
  function getRow(o, i, field, clazz) {
    var matchHasTerminatedUnexpectedly = matchTerminatedUnexpectedly(o.Elapsed);
    var row = [];
    row.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + " " + (clazz ? clazz : "") + '">');
    if ("away" == field) {
      row.push('<td class="form">');
      var result = getResult(o, teamId);
      if (result) {
        row.push('<a class=" box ' + result + '" href="/Matches/' + o.Id + '">' + result + "</a>");
      }
      row.push("</td>");
    }
    row.push("<td>");
    row.push('<ul style="text-align: ' + ("home" == field ? "left" : "right") + '">');
    if ("home" == field) {
      row.push('<li class="tournament"><a title="' + o.TournamentName + '" class="tournament-link" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '">' + (o.TournamentShortName ? o.TournamentShortName : o.TournamentName) + "</a></li>");
      row.push('<li class="team home' + (1 == o.Result ? " winner" : "") + '">');
      row.push(WS.TeamLink(o.HomeTeamId, getShortDisplayName(o.HomeTeamName), null, o.HomeTeamName));
      if (0 < o.HomeRCards) {
        row.push('<span class="rcard ls-e">' + o.HomeRCards + "</span>");
      }
      row.push("</li>");
    } else {
      row.push('<li class="date ta-left">' + o.StartDate + "</li>");
      row.push('<li class="team home' + (1 == o.Result ? " winner" : "") + '">');
      row.push(WS.TeamLink(o.HomeTeamId, getShortDisplayName(o.HomeTeamName), null, o.HomeTeamName));
      if (0 < o.HomeRCards) {
        row.push('<span class="rcard ls-e">' + o.HomeRCards + "</span>");
      }
      row.push("</li>");
    }
    row.push("</ul>");
    row.push("</td>");
    row.push('<td class="result">');
    if (o.HasPreview && "4" == o.Status) {
      row.push('<a href="/Matches/' + o.Id + '/Preview" class="iconize" title="Preview"><span class="incidents-icon ui-icon preview"></span></a>');
    } else {
      if (matchHasTerminatedUnexpectedly) {
        row.push('<a title="' + matchTerminatedUnexpectedlyToolTip(o.Elapsed) + '" href="/Matches/' + o.Id + '/Live">' + o.Elapsed + "</a>");
      } else {
        row.push('<a href="/Matches/' + o.Id + '">' + o.Score + "</a>");
      }
    }
    row.push("</td>");
    row.push("<td>");
    row.push("<ul>");
    if ("home" == field) {
      row.push('<li class="date ta-right">' + o.StartDate + "</li>");
      row.push('<li class="team away' + (2 == o.Result ? " winner" : "") + '">');
      if (0 < o.AwayRCards) {
        row.push('<span class="rcard ls-e">' + o.AwayRCards + "</span>");
      }
      row.push(WS.TeamLink(o.AwayTeamId, getShortDisplayName(o.AwayTeamName), null, o.AwayTeamName));
      row.push("</li>");
    } else {
      row.push('<li class="tournament ta-right"><a title="' + o.TournamentName + '" class="tournament-link" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '">' + (o.TournamentShortName ? o.TournamentShortName : o.TournamentName) + "</a></li>");
      row.push('<li class="team away' + (2 == o.Result ? " winner" : "") + '">');
      if (0 < o.AwayRCards) {
        row.push('<span class="rcard ls-e">' + o.AwayRCards + "</span>");
      }
      row.push(WS.TeamLink(o.AwayTeamId, getShortDisplayName(o.AwayTeamName), null, o.AwayTeamName));
      row.push("</li>");
    }
    row.push("</ul>");
    row.push("</td>");
    if ("home" == field) {
      row.push('<td class="form">');
      var result = getResult(o, teamId);
      if (result) {
        row.push('<a class=" box ' + result + '" href="/Matches/' + o.Id + '">' + result + "</a>");
      }
      row.push("</td>");
    }
    row.push("</tr>");
    return row.join("");
  }
  var o, t = [];
  t.push('<table class="grid"><tbody>');
  if (0 != matches.lastMatches.length) {
    for (var i = matches.lastMatches.length - 1; 0 <= i; i--) {
      o = matches.lastMatches[i];
      t.push(getRow(o, i, field));
    }
  }
  if (0 != matches.nextMatch.length) {
    for (var i = matches.nextMatch.length - 1; 0 <= i; i--) {
      o = matches.nextMatch[i];
      t.push(getRow(o, i, field, "next-match"));
    }
  }
  t.push("</tbody></table>");
  return t.join("");
}
function TeamFixturesView(gridId, data, teamId) {
  var o, t = [];
  t.push('<table id="' + gridId + '" class="grid fixture"><tbody>');
  var length = data.length;
  if (0 == length) {
    t.push('<tr><td class="note empty"> No matches found.. </td></tr>');
  } else {
    for (var i = 0, l = data.length; i < l; i++) {
      o = data[i];
      var matchHasTerminatedUnexpectedly = matchTerminatedUnexpectedly(o.Elapsed);
      t.push('<tr class="item ' + ((0 == i % 2) ? "alt" : "") + '"');
      t.push('" data-id="');
      t.push(o.Id);
      t.push('">');
      t.push('<td class="toolbar left">');
      if (o.HasIncidents) {
        t.push('<a href="#" class="show-incidents button-small ui-state-transparent-default rc" title="Details"><span class="ui-icon ui-icon-triangle-1-e"></span></a>');
      }
      t.push("</td>");
      t.push('<td class="form">');
      var result = getResult(o, teamId);
      if (result) {
        t.push('<a class=" box ' + getResult(o, teamId) + '" href="/Matches/' + o.Id + '">' + getResult(o, teamId) + "</a>");
      }
      t.push("</td>");
      t.push('<td class="tournament"><a title="' + o.TournamentName + '"class="tournament-link" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '">' + (o.TournamentShortName ? o.TournamentShortName : o.TournamentName) + "</a></td>");
      t.push('<td class="date">' + o.StartDate + "</td>");
      t.push('<td class="status">');
      if (matchHasTerminatedUnexpectedly) {
        t.push('<span class="status-' + o.Status + ' rc">' + o.Elapsed + "</span>");
      }
      t.push("</td>");
      t.push('<td class="team home' + (1 == o.Result ? " winner" : "") + '">');
      if (0 < o.HomeRCards) {
        t.push('<span class="rcard ls-e">' + o.HomeRCards + "</span>");
      }
      if (o.IsInternational && o.HomeTeamCountryCode) {
        t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
      } else {
        t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
      }
      t.push("");
      t.push("</td>");
      t.push('<td class="result">');
      if (matchHasTerminatedUnexpectedly) {
        t.push('<a title="' + matchTerminatedUnexpectedlyToolTip(o.Elapsed) + ' " href="/Matches/' + o.Id + '">' + o.Score + "</a>");
      } else {
        if (("2" == o.Status || "1" == o.Status)) {
          t.push('<a class="result-' + o.Status + ' rc" href="/Matches/' + o.Id + '/Live">' + o.Score + "</a>");
        } else {
          t.push('<a class="result-' + o.Status + ' rc"  href="/Matches/' + o.Id + '">' + o.Score + "</a>");
        }
      }
      t.push("</td>");
      t.push('<td class="team away' + (2 == o.Result ? " winner" : "") + '">');
      if (o.IsInternational && o.AwayTeamCountryCode) {
        t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
      } else {
        t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
      }
      if (0 < o.AwayRCards) {
        t.push('<span class="rcard ls-e">' + o.AwayRCards + "</span>");
      }
      t.push("</td>");
      t.push('<td class="toolbar right">');
      if ("1" == o.Status && o.IsOpta && !matchHasTerminatedUnexpectedly) {
        t.push('<a href="/Matches/' + o.Id + '/MatchReport" class="match-link match-report rc">Match Report</a>');
      }
      if ("2" == o.Status) {
        t.push('<a href="/Matches/' + o.Id + '/Live" class="match-link live rc" title="Live">Match Centre</a>');
      }
      if ("4" == o.Status && o.HasPreview) {
        t.push('<a href="/Matches/' + o.Id + '/Preview" class="match-link preview rc" title="Preview">Preview</a>');
      }
      t.push("</td>");
      t.push("</tr>");
    }
  }
  t.push("</tbody></table>");
  return t.join("");
}
function TeamFixturesSummaryView(teamId, records, nextMatches) {
  function getHtmlForRecord(record, i) {
    var t = [];
    var matchHasTerminatedUnexpectedly = matchTerminatedUnexpectedly(o.Elapsed);
    t.push('<tr class="item ' + (0 == i % 2 ? "alt" : "") + '"');
    t.push('" data-id="');
    t.push(o.Id);
    t.push('">');
    t.push('<td class="toolbar left">');
    if (o.HasIncidents) {
      t.push('<a href="#" class="show-incidents button-small ui-state-transparent-default rc" title="Details"><span class="ui-icon ui-icon-triangle-1-e"></span></a>');
    }
    t.push("</td>");
    t.push('<td class="form">');
    var result = getResult(o, teamId);
    if (result) {
      t.push('<a class=" box ' + getResult(o, teamId) + '" href="/Matches/' + o.Id + '">' + getResult(o, teamId) + "</a>");
    }
    t.push("</td>");
    t.push('<td class="tournament">');
    t.push('<a title="' + o.TournamentName + '"class="tournament-link" href="/Regions/' + o.RegionId + "/Tournaments/" + o.TournamentId + "/Seasons/" + o.SeasonId + "/Stages/" + o.StageId + '">');
    t.push((o.TournamentShortName ? o.TournamentShortName : o.TournamentName));
    t.push("</a></td>");
    t.push('<td class="date">' + o.StartDate + "</td>");
    t.push('<td class="status">');
    if (matchHasTerminatedUnexpectedly) {
      t.push('<span class="status-' + o.Status + ' rc">' + o.Elapsed + "</span>");
    }
    t.push("</td>");
    t.push('<td class="team home' + (1 == o.Result ? " winner" : "") + '">');
    if (0 < o.HomeRCards) {
      t.push('<span class="rcard ls-e">' + o.HomeRCards + "</span>");
    }
    if (o.IsInternational && o.HomeTeamCountryCode) {
      t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
    } else {
      t.push(WS.TeamLink(o.HomeTeamId, o.HomeTeamName));
    }
    t.push("");
    t.push("</td>");
    t.push('<td class="result">');
    if (matchHasTerminatedUnexpectedly) {
      t.push('<a   title="' + matchTerminatedUnexpectedlyToolTip(o.Elapsed) + '" href="/Matches/' + o.Id + '">' + o.Score + "</a>");
    } else {
      if (("2" == o.Status || "1" == o.Status)) {
        t.push('<a class="result-' + o.Status + ' rc" href="/Matches/' + o.Id + '/Live">' + o.Score + "</a>");
      } else {
        t.push('<a class="result-' + o.Status + ' rc"  href="/Matches/' + o.Id + '">' + o.Score + "</a>");
      }
    }
    t.push("</td>");
    t.push('<td class="team away' + (2 == o.Result ? " winner" : "") + '">');
    if (o.IsInternational && o.AwayTeamCountryCode) {
      t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
    } else {
      t.push(WS.TeamLink(o.AwayTeamId, o.AwayTeamName));
    }
    if (0 < o.AwayRCards) {
      t.push('<span class="rcard ls-e">' + o.AwayRCards + "</span>");
    }
    t.push("</td>");
    t.push('<td class="toolbar right">');
    if ("1" == o.Status && o.IsOpta && !matchHasTerminatedUnexpectedly) {
      t.push('<a href="/Matches/' + o.Id + '/MatchReport" class="match-link match-report rc">Match Report</a>');
    }
    if ("2" == o.Status) {
      t.push('<a href="/Matches/' + o.Id + '/Live" class="match-link live rc" title="Live">Match Centre</a>');
    }
    if ("4" == o.Status && o.HasPreview) {
      t.push('<a href="/Matches/' + o.Id + '/Preview" class="match-link preview rc" title="Preview">Preview</a>');
    }
    t.push("</td>");
    t.push("</tr>");
    return t.join("");
  }
  var o, t = [],
      lastDate = null;
  t.push('<table id="team-fixtures-summary" class="grid fixture"><tbody>');
  if (0 == records.previous.length) {
    t.push("");
  } else {
    for (var i = 0, l = records.previous.length; i < l; i++) {
      o = records.previous[i];
      t.push(getHtmlForRecord(o, i));
    }
  }
  if (0 == records.next.length) {
    t.push('<tr><td colspan="99" class="info"> No upcoming matches found.. </td></tr>');
  } else {
    for (var i = 0, l = records.next.length; i < l; i++) {
      o = records.next[i];
      t.push(getHtmlForRecord(o, i));
    }
  }
  t.push("</tbody>");
  t.push("</table>");
  return t.join("");
}
var PreviousMeetingsIncidentsView = function(id, data, className) {
  function getIncidentClass(type, subType) {
    return (1 == type) ? "i-goal" : (subType && 2 == subType) ? "i-y2card" : "i-rcard";
  }
  var t = [],
      detail;
  for (var i = 0, l = data.length; i < l; i++) {
    detail = data[i];
    var period = detail[7];
    var minute = detail[1];
    if (period) {
      if (1 == period && 45 < minute) {
        minute = 45;
      } else {
        minute = Math.min(period * 45, minute);
      }
    }
    t.push('<tr class="' + (className || "") + " incident " + (i == data.length - 1 ? "last" : "") + '" data-match-id="m');
    t.push(id);
    t.push('">');
    t.push('<td class="toolbar"></td>');
    t.push('<td class="tournament"></td>');
    t.push('<td class="date"></td>');
    t.push('<td class="status"></td>');
    if ("0" == detail[2]) {
      t.push('<td class="team home">');
      t.push('<span class="iconize iconize-icon-right"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0], detail[5]) + '"></span>');
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push(WS.PlayerLink(detail[6], detail[3]));
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away"></td>');
      t.push('<td class="toolbar"></td>');
    } else {
      t.push('<td class="team home"></td>');
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away">');
      t.push('<span class="iconize iconize-icon-left"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0], detail[5]) + '"></span>');
      t.push(WS.PlayerLink(detail[6], detail[3]));
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="toolbar"></td>');
    }
    t.push("</tr>");
  }
  return t.join("");
};
var TeamIncidentsView = function(id, data, className) {
  function getIncidentClass(type, subType) {
    return (1 == type) ? "i-goal" : (subType && 2 == subType) ? "i-y2card" : "i-rcard";
  }
  var t = [],
      detail;
  for (var i = 0, l = data.length; i < l; i++) {
    detail = data[i];
    var period = detail[7];
    var minute = detail[1];
    if (period) {
      if (1 == period && 45 < minute) {
        minute = 45;
      } else {
        minute = Math.min(period * 45, minute);
      }
    }
    t.push('<tr class="' + (className || "") + " incident " + (i == data.length - 1 ? "last" : "") + '" data-match-id="m');
    t.push(id);
    t.push('">');
    t.push('<td class="toolbar"></td>');
    t.push('<td class="form"></td>');
    t.push('<td class="tournament"></td>');
    t.push('<td class="date"></td>');
    t.push('<td class="status"></td>');
    if ("0" == detail[2]) {
      t.push('<td class="team home">');
      t.push('<span class="iconize iconize-icon-right"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0], detail[5]) + '"></span>');
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push(WS.PlayerLink(detail[6], detail[3]));
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away"></td>');
      t.push('<td class="toolbar"></td>');
    } else {
      t.push('<td class="team home"></td>');
      t.push('<td class="minute">');
      t.push(minute);
      t.push("'</td>");
      t.push('<td class="team away">');
      t.push('<span class="iconize iconize-icon-left"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0], detail[5]) + '"></span>');
      t.push(WS.PlayerLink(detail[6], detail[3]));
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="toolbar"></td>');
    }
    t.push("</tr>");
  }
  return t.join("");
};

function IncidentManager(config) {
  var config = config || {},
      visibleIncidents = {};
  this.clearIncidents = function() {
    visibleIncidents = {};
  };
  setTimeout(function() {
    $(config.rootElement).on("click", ".button-small.show-incidents", function(e) {
      toggleIncidents($(e.currentTarget));
      return false;
    });
  }, 0);

  function toggleIncidents($el) {
    var id = $el.parents("tr:first").attr("data-id");
    (undefined !== visibleIncidents[id]) ? hideIncidents(id) : showIncidents(id);
  }
  function showIncidents(id) {
    var $tr = getTr(id).addClass("hasDetails");
    var $button = $tr.find(".button-small.show-incidents").addClass("ui-state-active").blur().find(".ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
    DataStore.load("livescoreincidents", {
      parameters: {
        id: id
      },
      cache: true,
      tr: $tr,
      success: incidentsSuccess,
      error: null,
      dataType: "array"
    }, this);
  }
  function incidentsSuccess(options, data) {
    var id = options.parameters.id,
        $tr = getTr(id),
        className = (-1 < $tr.attr("class").indexOf("alt")) ? "alt" : undefined;
    visibleIncidents[id] = true;
    $('tr[data-match-id="m' + id + '"]', config.rootElement).remove();
    $tr.after(config.view.call(null, id, data, className));
  }
  function hideIncidents(id) {
    delete visibleIncidents[id];
    var $tr = getTr(id).removeClass("hasDetails");
    var $button = $tr.find(".button-small.show-incidents").removeClass("ui-state-active").blur().find(".ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
    $('tr[data-match-id="m' + id + '"]', config.rootElement).remove();
  }
  function getTr(id) {
    return $('tr[data-id="' + id + '"]', config.rootElement);
  }
}
function Regions(config) {
  var id = "#" + config.id;
  var $this = $(id);
  var regions = new RegionsModel(config.regions);
  var $teamsView = $("table.grid.team tbody", $this);
  init();

  function init() {
    NG.Events.addGlobal("regionsfilterchanged", function(filter) {
      renderInitialInfo();
      updateRegions(filter);
    });
    var filter = new RegionsFilter(id, regions);
    filter.load();
  }
  function updateRegions(filter) {
    var regions = loadRegions(filter);
    $("table.grid.region tbody", $this).html(RegionsView(regions));
    $("table.grid.region a", $this).click(function(e) {
      e.preventDefault();
      $("table.grid.region a.selected span.with-solo-icon span").hide();
      $("table.grid.region a.selected", $this).removeClass("selected");
      $(this).addClass("selected");
      $("span.with-solo-icon span", $(this)).addClass("ui-icon-carat-1-e");
      $("span.with-solo-icon span", $(this)).fadeIn();
      updateTeams($(this).attr("data-value"));
    });
  }
  function loadRegions(filter) {
    var filteredRecords = [];
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].Name.charAt(0) == filter) {
        filteredRecords.push(regions[i]);
      }
    }
    return filteredRecords;
  }
  function updateTeams(regionId) {
    var teams = loadTeams(regionId);
  }
  function loadTeams(regionId) {
    renderLoading();
    DataStore.load("regionteams", {
      parameters: {
        id: regionId
      },
      cache: true,
      success: function(options, data) {
        var teams = new RegionsTeamsModel(data);
        if (teams && 0 < teams.length) {
          renderTeams(teams);
        } else {
          renderEmptyResult();
        }
      },
      error: function(options, data) {
        renderEmptyResult();
      },
      dataType: "array"
    });
  }
  function renderTeams(teams) {
    $teamsView.html(RegionsTeamsView(teams));
  }
  function renderEmptyResult() {
    $teamsView.html('<div class="info">No teams found..</div>');
  }
  function renderLoading() {
    $teamsView.html('<div class="info iconize iconize-icon-left"><span class="ui-icon ui-icon-refresh"/> Loading..</div>');
  }
  function renderInitialInfo() {
    $teamsView.html('<div class="info iconize iconize-icon-left"><span class="ui-icon ui-icon-carat-1-w"></span> Please select a region to view the teams</div>');
  }
}
function RegionsModel(regions) {
  var records = [];
  for (var i = 0; i < regions.length; i++) {
    var o = {
      Id: regions[i][0],
      Code: regions[i][1],
      Name: regions[i][2]
    };
    records.push(o);
  }
  return records;
}
function RegionsView(records) {
  var t = [];
  for (var i = 0; i < records.length; i = i + 2) {
    t.push("<tr>");
    t.push("<td>");
    t.push('<a class="iconize iconize-icon-left" href="#" data-value="' + records[i].Id + '"><span class="ui-icon country flg-' + records[i].Code + '"></span>' + records[i].Name + '<span class="with-solo-icon"><span class="ui-icon"></span></span></a>');
    t.push("</td>");
    if (i != records.length - 1) {
      t.push("<td>");
      t.push('<a class="iconize iconize-icon-left" href="#" data-value="' + records[i + 1].Id + '"><span class="ui-icon country flg-' + records[i + 1].Code + '"></span>' + records[i + 1].Name + '<span class="with-solo-icon"><span class="ui-icon"></span></span></a>');
      t.push("</td>");
      t.push("</tr>");
    }
  }
  return t.join("");
}
function RegionsFilter(id, regions) {
  var $this = $(id + "-filter-view");

  function getMask() {
    var mask = [];
    var index = 0;
    for (var i = 0; i < regions.length; i++) {
      if (!maskContains(mask, regions[i].Name.charAt(0))) {
        mask[index++] = regions[i].Name.charAt(0);
      }
    }
    return mask;
  }
  function maskContains(mask, key) {
    for (var i = 0; i < mask.length; i++) {
      if (mask[i] == key) {
        return true;
      }
    }
    return false;
  }
  this.load = function() {
    var mask = getMask();
    $this.html(RegionsFilterView(mask));
    $("dd", $this).on("click", "a", function(e) {
      e.preventDefault();
      $("dd a.selected", $this).removeClass("selected");
      $(this).addClass("selected");
      NG.Events.fireGlobal("regionsfilterchanged", [$(this).attr("data-value")]);
    });
    $("dd:first a", $this).click();
  };
}
function RegionsFilterView(mask) {
  var t = [];
  if (mask) {
    t.push("<dt>Countries:</dt>");
    for (var i = 0; i < mask.length; i++) {
      t.push('<dd><a data-value="' + mask[i] + '" href="#" class="option">' + mask[i] + "</a></dd>");
    }
  }
  return t.join("");
}
function RegionsTeamsModel(teams) {
  var records = [];
  for (var i = 0; i < teams.length; i++) {
    var o = {
      Id: teams[i][0],
      Name: teams[i][1]
    };
    records.push(o);
  }
  return records;
}
function RegionsTeamsView(records) {
  var t = [];
  for (var i = 0; i < records.length; i = i + 2) {
    t.push("<tr>");
    t.push("<td>");
    t.push('<a class="iconize iconize-icon-left" href="/Teams/' + records[i].Id + '"><span class="ui-icon ui-icon-carat-1-e"></span>' + records[i].Name + "</a>");
    t.push("</td>");
    if (i != records.length - 1) {
      t.push("<td>");
      t.push('<a class="iconize iconize-icon-left" href="/Teams/' + records[i + 1].Id + '"><span class="ui-icon ui-icon-carat-1-e"></span>' + records[i + 1].Name + "</a>");
      t.push("</td>");
    }
    t.push("</tr>");
  }
  return t.join("");
}
function MatchCommentary(config) {
  var id, summary, timeline, commentaryText, commentaryTextFilter, model, uiState, canMarkComment;
  init(config);
  this.load = function(data) {
    model = new MatchCommentaryModel(data);
    timeline.render(model.timeline);
    text.render(model.text, uiState.teamSelection);
    markSelectedComment();
    if (!uiState.selectedCommentId) {
      timeline.selectLast();
    }
  };

  function markSelectedComment() {
    if (!canMarkComment) {
      return;
    }
    commentaryTextFilter.select({
      field: "all",
      type: "all"
    });
    text.selectComment(uiState.selectedCommentId);
  }
  function init(config) {
    id = config.id;
    summary = new MatchCommentarySummary({
      id: "#" + id + "-summary"
    });
    timeline = new MatchCommentaryTimeLine({
      id: "#" + id + "-time-line"
    });
    var commentaryTextFilterConfig = {
      instanceType: WS.Filter,
      id: id + "-text-filter",
      categories: {
        data: [{
          value: "field"
        }]
      },
      singular: true
    };
    commentaryTextFilter = new WS.Filter(commentaryTextFilterConfig);
    text = new MatchCommentaryText({
      id: "#" + id + "-text-content"
    });
    bindEvents();
    uiState = {
      teamSelection: null,
      selectedCommentId: null
    };
  }
  function clearSelectedComment() {
    uiState.selectedCommentId = false;
    canMarkComment = false;
  }
  function bindEvents() {
    $("#" + commentaryTextFilter.id()).bind(("selected"), function() {
      uiState.teamSelection = commentaryTextFilter.getSelection();
      text.render(model.text, uiState.teamSelection);
      if ("all" != uiState.teamSelection.data.field) {
        clearSelectedComment();
      }
    });
    $("#" + id + "-time-line").bind("selected", function(options, commentId) {
      uiState.selectedCommentId = commentId;
      canMarkComment = true;
      markSelectedComment();
    });
  }
}
function MatchCommentaryModel(data) {
  var timeLineStatTypes = ["goal", "red", "yellow", "subst-in", "shot", "penalty-missed", "owngoal"];
  var summaryStatTypes = ["goal", "red", "yellow", "subst-in", "shot", "penalty-missed", "corner", "offside", "foul", "owngoal"];
  var statTypes = [{
    v: "red card",
    d: "red"
  }, {
    v: "yellow card",
    d: "yellow"
  }, {
    v: "secondyellow card",
    d: "red"
  }, {
    v: "substitution",
    d: "subst-in"
  }, {
    v: "free kick lost",
    d: "foul"
  }, {
    v: "attempt blocked",
    d: "shot"
  }, {
    v: "attempt saved",
    d: "shot"
  }, {
    v: "post",
    d: "shot"
  }, {
    v: "miss",
    d: "shot"
  }, {
    v: "miss penalty",
    d: "penalty-missed"
  }, {
    v: "penalty saved",
    d: "penalty-missed"
  }, {
    v: "penalty miss",
    d: "penalty-missed"
  }, {
    v: "own goal free kick",
    d: "owngoal"
  }, {
    v: "own goal",
    d: "owngoal"
  }];

  function getRecord(commentData) {
    var record = {};
    var statType = getStatType(commentData[1]);
    var field = commentData[3];
    record.time = commentData[0] ? commentData[0] : "";
    record.type = statType;
    record.text = commentData[2];
    record.field = "owngoal" == statType ? ("home" == field ? "away" : "home") : commentData[3];
    return record;
  }
  function getStatType(type) {
    for (var i = 0; i < statTypes.length; i++) {
      if (statTypes[i].v == type) {
        return statTypes[i].d;
      }
    }
    return type;
  }
  function isSummaryStat(type) {
    for (var i = 0; i < summaryStatTypes.length; i++) {
      if (summaryStatTypes[i] == type) {
        return true;
      }
    }
    return false;
  }
  function isTimeLineStat(type) {
    for (var i = 0; i < timeLineStatTypes.length; i++) {
      if (timeLineStatTypes[i] == type) {
        return true;
      }
    }
    return false;
  }
  function addSummaryComment(records, comment) {
    if (!records[comment.field]) {
      return;
    }
    if (isSummaryStat(comment.type)) {
      if (records[comment.field].value[comment.type]) {
        records[comment.field].value[comment.type]++;
      } else {
        records[comment.field].value[comment.type] = 1;
      }
      if ("goal" == type || "penalty-missed" == comment.type) {
        addSummaryComment(records, {
          field: comment.field,
          type: "shot"
        });
      }
    }
  }
  function addTimeLineComment(records, comment) {
    if (!records[comment.field]) {
      return;
    }
    if (isTimeLineStat(comment.type)) {
      records[comment.field].value.push(comment);
    }
  }
  function getMaxCommentMin(comments) {
    for (var i = 0; i < comments.length; i++) {
      var comment = getRecord(comments[i]);
      if (comment.time && "" != jQuery.trim(comment.time)) {
        return getCommentMinute(comment.time);
      }
    }
  }
  function addTextComment(records, comment) {
    if (!isTimeLineStat(comment.type)) {
      comment.type = "";
    }
    records.value.push(comment);
  }
  if (!data[2]) {
    return;
  }
  var comments = data[4];
  var maxCommentMin = getMaxCommentMin(comments);
  var records = {
    summary: {
      home: {
        name: data[0],
        teamId: data[2],
        value: {}
      },
      away: {
        name: data[1],
        teamId: data[3],
        value: {}
      }
    },
    timeline: {
      currentMinute: maxCommentMin,
      home: {
        name: data[0],
        teamId: data[2],
        value: []
      },
      away: {
        name: data[1],
        teamId: data[3],
        value: []
      }
    },
    text: {
      home: {
        name: data[0],
        teamId: data[2]
      },
      away: {
        name: data[1],
        teamId: data[3]
      },
      value: []
    }
  };
  for (var i = 0; i < comments.length; i++) {
    var comment = getRecord(comments[i]);
    comment.index = i;
    addTimeLineComment(records.timeline, comment);
    addTextComment(records.text, comment);
  }
  return records;
}
function getCommentMinute(time) {
  var endOfNormalDuration = time.indexOf("'");
  var startOfExtraTime = time.indexOf("+");
  var normalDuration = parseInt(time.substring(0, endOfNormalDuration));
  if (-1 != startOfExtraTime) {
    var extraTime = parseInt(time.substring(startOfExtraTime + 1, time.length - 1));
    return normalDuration + extraTime;
  }
  return normalDuration;
}
function MatchCommentarySummary(config) {
  var $view, statsOrder = ["goal", "shot", "red", "yellow", "foul", "corner", "offside", "subst-in", "penalty-missed", "owngoal"];
  init(config);
  this.render = function(data) {
    var view = [];
    view.push(getView(prepareData(data)));
    $view.html(view.join(""));
  };

  function prepareData(data) {
    var records = {
      info: {
        homeName: data.home.name,
        awayName: data.away.name
      },
      stats: {}
    };
    var stats = {
      home: sortStats(data.home.value),
      away: sortStats(data.away.value)
    };
    loadStatsSummaryForTeam(records.stats, stats, "home");
    loadStatsSummaryForTeam(records.stats, stats, "away");
    return records;
  }
  function loadStatsSummaryForTeam(records, stats, field) {
    for (var stat in stats[field]) {
      if (!records[stat]) {
        records[stat] = {
          home: {},
          away: {}
        };
      }
      records[stat][field] = stats[field][stat];
    }
  }
  function isGreater(stat, otherStat) {
    if ("-" == stat) {
      return false;
    }
    if ("-" == otherStat) {
      return true;
    }
    return otherStat < stat;
  }
  function getView(records) {
    var html = [];
    html.push('<table class="grid">');
    html.push("<thead>");
    html.push("<th></th>");
    for (var stat in records.stats) {
      html.push('<th title="' + getIncidentToolTip(stat) + '"><span class="incidents-icon ui-icon ' + stat + '"></span></th>');
    }
    html.push("</thead>");
    html.push("<tbody>");
    html.push("<tr>");
    html.push('<td class="tn">' + records.info.homeName + "</td>");
    for (var stat in records.stats) {
      html.push('<td class="' + (isGreater(records.stats[stat].home, records.stats[stat].away) ? "greater" : "") + '">' + records.stats[stat].home + "</td>");
    }
    html.push("</tr>");
    html.push("<tr>");
    html.push('<td class="tn">' + records.info.awayName + "</td>");
    for (var stat in records.stats) {
      html.push('<td class="' + (isGreater(records.stats[stat].away, records.stats[stat].home) ? "greater" : "") + '">' + records.stats[stat].away + "</td>");
    }
    html.push("</tr>");
    html.push("</tbody>");
    html.push("</table>");
    return html.join("");
  }
  function sortStats(stats) {
    if (!stats) {
      return;
    }
    var result = {};
    for (var i = 0; i < statsOrder.length; i++) {
      if (stats[statsOrder[i]]) {
        result[statsOrder[i]] = stats[statsOrder[i]];
      } else {
        result[statsOrder[i]] = "-";
      }
    }
    return result;
  }
  function init(config) {
    $view = $(config.id);
  }
}
function getLeftMarginInPixels(widthInPixels, point, maxPoint) {
  if (!point) {
    return 0;
  }
  return parseInt(widthInPixels * point / maxPoint);
}
function TimeLineBarView(widthInPixels, currentMinute, lastMinute) {
  var view = [];
  view.push('<div id="time-line-bar">');
  view.push('<span class="current-minute" style="left: 0; width: ' + getLeftMarginInPixels(widthInPixels, currentMinute, lastMinute) + 'px;"></span>');
  var fontSize = 12;
  for (var i = 0; i <= 90; i = i + 15) {
    var left = getLeftMarginInPixels(widthInPixels, i, lastMinute);
    if (0 == i) {
      left = +2;
    }
    view.push('<span class="time-period" style="left: ' + left + 'px;">');
    view.push("<span " + ((0 != i) ? 'style="margin-left: -100%;"' : "") + ">" + i + "'</span>");
    view.push("</span>");
  }
  view.push("</div>");
  return view.join("");
}
function MatchCommentaryTimeLine(config) {
  var id, $view, widthInPixels = 644,
      lastMinute = 90;
  init(config);
  this.selectLast = function() {
    var $lastHome = $(".home .time-line-event", $view).last();
    var $lastAway = $(".away .time-line-event", $view).last();
    var homeEventId = NG.roundNumber($lastHome.attr("data-value"));
    var awayEventId = NG.roundNumber($lastAway.attr("data-value"));
    if (homeEventId < awayEventId) {
      $lastHome.click();
    } else {
      $lastAway.click();
    }
  };
  this.render = function(data) {
    var currentMinute = data.currentMinute;
    if (currentMinute) {
      lastMinute = Math.max(currentMinute, 90);
    }
    var view = [];
    view.push(partView(data.home, "home"));
    view.push(TimeLineBarView(widthInPixels, currentMinute, lastMinute));
    view.push(partView(data.away, "away"));
    $view.html(view.join(""));
  };

  function partView(data, field) {
    var view = [],
        lastEventLeftMargin = 0;
    view.push('<div class="' + field + '">');
    view.push(WS.TeamEmblemUrl(data.teamId));
    for (var i = data.value.length - 1; 0 <= i; i--) {
      var minute = getCommentMinute(data.value[i].time);
      var leftMarginInPixels = getLeftMarginInPixels(widthInPixels, minute, lastMinute);
      view.push('<span title="' + getIncidentToolTip(data.value[i].type) + '" data-value="' + data.value[i].index + '" style="left: ' + (leftMarginInPixels - 16) + 'px;" class="time-line-event rc">');
      view.push("<span " + ((0 != minute) ? "" : "") + ' class="incidents-icon ui-icon ' + data.value[i].type + '"></span>');
      view.push("</span>");
    }
    view.push("</div>");
    return view.join("");
  }
  function init(config) {
    id = config.id;
    $view = $(id);
    bindActions();
  }
  function bindActions() {
    $view.on("click", ".time-line-event", function() {
      var $this = $(this);
      var selectedEvent = $this.attr("data-value");
      $(id).triggerHandler("selected", [selectedEvent]);
      $(".time-line-event", $view).removeClass("selected");
      $this.addClass("selected");
    });
  }
}
function MatchCommentaryText(config) {
  var $view;
  init(config);
  this.selectComment = function(commentId) {
    var $comment = $('tr[data-value="' + commentId + '"]', $view);
    $view.scrollTo($comment, 500, {
      offset: -110
    });
    $(".match-comment", $view).removeClass("selected");
    $comment.addClass("selected");
  };
  this.render = function(data, filters) {
    var view = [];
    view.push("<table>");
    view.push("<tbody>");
    for (var i = 0; i < data.value.length; i++) {
      var comment = data.value[i];
      if (isValid(comment, filters)) {
        view.push('<tr class="match-comment ' + comment.field + " " + comment.type + '" data-value="' + comment.index + '">');
        view.push('<td class="minute">' + comment.time + "</td>");
        view.push("<td>" + getTeamEmblem(data, comment.field) + "</td>");
        view.push('<td class="type">');
        if (comment.type) {
          view.push('<span title="' + getIncidentToolTip(comment.type) + '" class="incidents-icon ui-icon ' + comment.type + '"></span>');
        }
        view.push("</td>");
        view.push('<td class="text">' + prepareText(data, comment.text) + "</td>");
        view.push("</tr>");
      }
    }
    view.push("</tbody>");
    view.push("</table>");
    $view.html(view.join(""));
  };

  function getTeamEmblem(data, field) {
    if (!data[field]) {
      return "";
    }
    return WS.TeamEmblemUrl(data[field].teamId);
  }
  function isValid(comment, filters) {
    if (!filters) {
      return true;
    }
    var valid = true;
    for (var filter in filters.data) {
      if (filter) {
        valid = valid && ("all" == filters.data[filter] || comment[filter] == filters.data[filter]);
      }
    }
    return valid;
  }
  function prepareText(data, text) {
    var result = text.replace("(" + data.home.name + ")", "<b>(" + data.home.name + ")</b>");
    result = result.replace("(" + data.away.name + ")", "<b>(" + data.away.name + ")</b>");
    return result;
  }
  function init(config) {
    $view = $(config.id);
  }
}
var incidentToolTips = {
  "goal": "Goal",
  "assist": "Assist",
  "yellow": "Yellow Card",
  "secondyellow": "Red Card from a Second Yellow Card",
  "red": "Red Card",
  "post": "Shot on Post",
  "clearance-off-line": "Clearance Off the Line",
  "penalty-missed": "Penalty Missed",
  "last-man-tackle": "Last Man Tackle",
  "interception-in-box": "Interception in Box",
  "error-lead-to-goal": "Error Lead to Goal",
  "last-man-dribble": "Last Man Dribble",
  "penalty-conceded": "Caused a Penalty",
  "owngoal": "Own Goal",
  "shot": "Shot",
  "subst-in": "Substitution",
  "mom": "Man of the Match",
  "foul": "Foul",
  "corner": "Corner",
  "offside": "Offside",
  "penalty-save": "Saved a Penalty",
  "penalty-goal": "Goal from a penalty",
  "shotonpost": "Hit Woodwork"
};

function getIncidentToolTip(type) {
  return incidentToolTips[type] ? incidentToolTips[type] : "";
}
var incidentTypeClasses = {
  "1": "i-goal",
  "2": {
    "1": "i-yellow",
    "2": "i-y2card",
    "3": "i-rcard"
  }
};

function getIncidentTypeClass(type, subType) {
  var clazz = incidentTypeClasses[type];
  if (clazz && subType) {
    clazz = clazz[subType];
  }
  return clazz;
}
WS.TeamEmblemUrl = function(teamid, title, style) {
  if (gImageUrl && teamid) {
    return "<img " + (title ? 'title="' + title + '"' : "") + (style ? ' style="' + style + '"' : "") + ' src="' + gImageUrl + "teams/" + teamid + '.png" class="team-emblem">';
  }
  return "";
};
WS.PlayerPictureUrl = function(playerId, title, style) {
  if (gImageUrl && playerId) {
    return "<img " + (title ? 'title="' + title + '"' : "") + (style ? ' style="' + style + '"' : "") + ' src="' + gImageUrl + "players/" + playerId + '.jpg" class="player-picture">';
  }
  return "";
};

function MatchHeader(config) {
  var $view;
  init(config);
  this.load = function(data) {
    var header = MatchHeaderModel(data);
    $view.html(MatchHeaderView(header));
  };

  function init(config) {
    $view = $("#" + config.view.renderTo);
  }
}
function MatchHeaderView(header) {
  var html = [];
  html.push("<table>");
  html.push("<tr>");
  html.push('<td class="team">' + WS.TeamLink(header.HomeTeamId, header.HomeTeamName) + "</td>");
  html.push('<td class="result">' + header.Score + "</td>");
  html.push('<td class="team">' + WS.TeamLink(header.AwayTeamId, header.AwayTeamName) + "</td>");
  html.push("</tr>");
  html.push("<tr>");
  html.push('<td class="crest">' + WS.TeamEmblemUrl(header.HomeTeamId) + "</td>");
  html.push("<td>");
  html.push('<div class="info-block cleared">');
  html.push("<dl>");
  var matchHasTerminatedUnExpectedly = matchTerminatedUnexpectedly(header.Elapsed);
  if (header.Elapsed) {
    html.push('<dt>Elapsed:</dt><dd class="status">');
    if (!matchHasTerminatedUnExpectedly) {
      html.push('<span class="' + (header.Finished ? "finished" : "inplay") + '" rc">' + header.Elapsed + "</span>");
    } else {
      html.push("<span>" + header.Elapsed + "</span>");
    }
    html.push("</dd>");
  }
  html.push("</dl>");
  html.push("</div>");
  html.push('<div class="info-block cleared">');
  html.push("<dl>");
  if (header.HalftimeScore) {
    html.push("<dt>Half time:</dt><dd>" + header.HalftimeScore + "</dd>");
  }
  if (header.FulltimeScore) {
    html.push("<dt>Full time:</dt><dd>" + header.FulltimeScore + "</dd>");
  }
  if (header.ExtratimeScore) {
    html.push("<dt>Extra time:</dt><dd>" + header.ExtratimeScore + "</dd>");
  }
  if (header.PenaltyShootout) {
    html.push("<dt>Penalty shootout:</dt><dd>" + header.PenaltyShootout + "</dd>");
  }
  html.push("</dl>");
  html.push("</div>");
  html.push('<div class="info-block cleared">');
  html.push("<dl>");
  html.push("<dt>Kick off:</dt>");
  html.push("<dd>" + header.StartTime + "</dd>");
  html.push("<dt>Date:</dt>");
  html.push("<dd>" + header.StartDate + "</dd>");
  html.push("</dl>");
  html.push("</div>");
  html.push("</td>");
  html.push('<td class="crest">' + WS.TeamEmblemUrl(header.AwayTeamId) + "</td>");
  html.push("</tr>");
  html.push("</table>");
  return html.join("");
}
function MatchHeaderModel(data) {
  var o = {};
  o.HomeTeamId = data[0];
  o.AwayTeamId = data[1];
  o.HomeTeamName = data[2];
  o.AwayTeamName = data[3];
  o.StartTime = new Date(data[4]).dateFormat("H:i");
  o.StartDate = new Date(data[5]).dateFormat("D, d-M-y");
  o.Status = data[6];
  o.Finished = 6 == o.Status;
  o.Elapsed = data[7];
  o.HalftimeScore = data[8];
  o.FulltimeScore = data[9];
  o.ExtratimeScore = data[10];
  o.PenaltyShootout = data[11];
  o.Score = data[12];
  return o;
}
function LiveTimeLine(config) {
  var $view, $bar;
  init(config);
  this.load = function(data) {
    var incidentRows = LiveTimeLineModel(data[0]);
    $view.html(LiveTimeLineView(incidentRows));
    $(".player-link", $view).fitText({
      width: 150
    });
  };

  function init(config) {
    $view = $("#" + config.view.renderTo);
    $bar = $("#" + config.view.renderTo + "-bar");
  }
}
function LiveTimeLineView(rows) {
  function getIncidentsHtml(incidents, field) {
    var is = [];
    var iconSide = "home" == field ? "right" : "left";
    for (var j = 0; j < incidents.length; j++) {
      var i = incidents[j];
      if ("subst" == i.IncidentType) {
        is.push("<div>");
        if ("home" == field) {
          is.push('<span class="iconize iconize-icon-' + iconSide + ' weak">');
          is.push('<span class="incidents-icon ui-icon subst-out"></span>');
          is.push(WS.PlayerLink(i.PlayerId, i.PlayerName));
          is.push("</span>");
        }
        is.push('<span class="iconize iconize-icon-' + iconSide + '">');
        is.push('<span class="incidents-icon ui-icon subst-in"></span>');
        is.push(WS.PlayerLink(i.ParticipatingPlayerId, i.ParticipatingPlayerName));
        is.push("</span>");
        if ("away" == field) {
          is.push('<span class="iconize iconize-icon-' + iconSide + ' weak">');
          is.push('<span class="incidents-icon ui-icon subst-out"></span>');
          is.push(WS.PlayerLink(i.PlayerId, i.PlayerName));
          is.push("</span>");
        }
        is.push("</div>");
      } else {
        if ("goal" == i.IncidentType || "owngoal" == i.IncidentType || "penalty-goal" == i.IncidentType) {
          is.push("<div>");
          is.push('<span class="iconize iconize-icon-' + iconSide + ' strong">');
          is.push('<span class="incidents-icon ui-icon ' + i.IncidentType + '"></span>');
          if ("home" == field) {
            is.push('<span class="weak">' + (i.Info ? "(" + i.Info + ") " : "") + "</span>");
          }
          is.push("home" == field ? (WS.PlayerLink(i.PlayerId, i.PlayerName) + " " + i.RunningScore) : (i.RunningScore + " " + WS.PlayerLink(i.PlayerId, i.PlayerName)));
          if ("away" == field) {
            is.push('<span class="weak">' + (i.Info ? " (" + i.Info + ")" : "") + "</span>");
          }
          is.push("</span>");
          is.push("</div>");
        } else {
          if ("penaltyshootout-scored" == i.IncidentType) {
            is.push('<div><span class="iconize iconize-icon-' + iconSide + ' strong"><span class="incidents-icon ui-icon goal"></span><span class="weak">(Pen)</span> ' + i.RunningScore + " " + WS.PlayerLink(i.PlayerId, i.PlayerName) + "</span></div>");
          } else {
            if ("penaltyshootout-missed" == i.IncidentType || "penaltyshootout-saved" == i.IncidentType || "penalty-missed" == i.IncidentType) {
              is.push('<div><span class="iconize iconize-icon-' + iconSide + ' strong"><span class="incidents-icon ui-icon penalty-missed"></span><span class="weak">(Pen)</span> ' + i.RunningScore + " " + WS.PlayerLink(i.PlayerId, i.PlayerName) + "</span></div>");
            } else {
              is.push('<div><span class="iconize iconize-icon-' + iconSide + '"><span class="incidents-icon ui-icon ' + i.IncidentType + '"></span>' + WS.PlayerLink(i.PlayerId, i.PlayerName) + "</span></div>");
            }
          }
        }
      }
    }
    return is.join("");
  }
  if (!rows) {
    return;
  }
  var html = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    html.push('<tr class="' + (0 == i % 2 ? "alt" : "") + '">');
    html.push('<td class="home-incident">');
    if (row.HasHomeIncidents) {
      html.push(getIncidentsHtml(row.HomeIncidents, "home"));
    }
    html.push("</td>");
    html.push("<td>");
    html.push('<span class="minute rc box">');
    html.push(row.Minute + "'");
    html.push("</span>");
    html.push("</td>");
    html.push('<td class="away-incident">');
    if (row.HasAwayIncidents) {
      html.push(getIncidentsHtml(row.AwayIncidents, "away"));
    }
    html.push("</td>");
    html.push("</tr>");
  }
  return html.join("");
}
function LiveIncidentModel(data) {
  return {
    PlayerName: data[0] ? data[0] : "",
    ParticipatingPlayerName: data[1],
    IncidentType: data[2],
    RunningScore: data[3] ? data[3] : "",
    Info: data[4],
    Minute: data[5],
    PlayerId: data[6],
    ParticipatingPlayerId: data[7]
  };
}
function LiveTimeLineModel(data) {
  function getIncidents(teamIncidents) {
    var incidents = [];
    for (var j = 0; j < teamIncidents.length; j++) {
      incidents.push(LiveIncidentModel(teamIncidents[j]));
    }
    return incidents;
  }
  if (!data) {
    return;
  }
  var rows = [];
  for (var i = 0; i < data.length; i++) {
    var row = {};
    row.Minute = data[i][0];
    row.HasHomeIncidents = data[i][3] == 1;
    row.HasAwayIncidents = data[i][4] == 1;
    if (row.HasHomeIncidents) {
      row.HomeIncidents = getIncidents(data[i][1]);
    }
    if (row.HasAwayIncidents) {
      row.AwayIncidents = getIncidents(data[i][2]);
    }
    rows.push(row);
  }
  return rows;
}
function LiveLineup(config) {
  var $view;
  init(config);

  function init(config) {
    $view = $("#" + config.view.renderTo);
  }
  this.load = function(data) {
    var records = new LiveLineupModel(data);
    $view.html(LiveLineupView(records));
    $(".player-link", $view).fitText({
      width: 200
    });
  };
}
function LiveLineupPlayerModel(data) {
  function getLiveIncidents(data) {
    var incidents = [];
    for (var i = 0; i < data.length; i++) {
      incidents.push(LiveIncidentModel(data[i]));
    }
    return incidents;
  }
  return {
    Name: data[0],
    RegionCode: data[1],
    Incidents: getLiveIncidents(data[2]),
    PlayerId: data[3]
  };
}
function LiveLineupModel(data) {
  function getLiveLineupPlayers(data) {
    var players = [];
    for (var i = 0; i < data.length; i++) {
      players.push(LiveLineupPlayerModel(data[i]));
    }
    return players;
  }
  return {
    HasAnyLineup: data[0],
    HasAnyFirstEleven: data[1],
    HasAnySubstitutes: data[2],
    HasHomeLineup: data[3],
    HasHomeFirstEleven: data[4],
    HasHomeSubstitutes: data[5],
    HasAwayLineup: data[6],
    HasAwayFirstEleven: data[7],
    HasAwaySubstitutes: data[8],
    HomeLineup: getLiveLineupPlayers(data[9]),
    AwayLineup: getLiveLineupPlayers(data[10]),
    HomeSubs: getLiveLineupPlayers(data[11]),
    AwaySubs: getLiveLineupPlayers(data[12])
  };
}
function LiveLineupPartView(players, field) {
  var pv = [];
  pv.push('<div class="' + field + '">');
  pv.push('<table class="grid gray">');
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    pv.push('<tr class="' + ((1 == i % 2) ? "alt" : "") + '">');
    pv.push("<td>");
    pv.push('<div class="incident-player">');
    pv.push('<span class="country flg-' + player.RegionCode + ' iconize iconize-icon-left">');
    pv.push(WS.PlayerLink(player.PlayerId, player.Name));
    pv.push("</span></div>");
    pv.push('<div class="incident-minute">');
    for (var j = 0; j < player.Incidents.length; j++) {
      pv.push('<span class="iconize iconize-icon-left"><span class="incidents-icon ui-icon ' + player.Incidents[j].IncidentType + '"></span>' + player.Incidents[j].Minute + "'</span>");
    }
    pv.push("</div>");
    pv.push("</td>");
    pv.push("</tr>");
  }
  pv.push("</table>");
  pv.push("</div>");
  return pv.join("");
}
function LiveLineupView(lineups) {
  if (!lineups || !lineups.HasAnyLineup) {
    return;
  }
  var html = [];
  if (lineups.HasAnyFirstEleven) {
    html.push("<h2>Lineups</h2>");
    html.push('<div class="live-line-up two-cols">');
    if (lineups.HasHomeFirstEleven) {
      html.push(LiveLineupPartView(lineups.HomeLineup, "home"));
    }
    if (lineups.HasAwayFirstEleven) {
      html.push(LiveLineupPartView(lineups.AwayLineup, "away"));
    }
    html.push("</div>");
  }
  if (lineups.HasAnySubstitutes) {
    html.push("<h2>Substitutes</h2>");
    html.push('<div class="live-line-up two-cols">');
    if (lineups.HasHomeSubstitutes) {
      html.push(LiveLineupPartView(lineups.HomeSubs, "home"));
    }
    if (lineups.HasAwaySubstitutes) {
      html.push(LiveLineupPartView(lineups.AwaySubs, "away"));
    }
    html.push("</div>");
  }
  return html.join("");
}
WS.LiveDataUpdater = function(config) {
  var dataId, dataUrl, parameters, timer, countDownMonitor, self = this;
  init(config);

  function init(config) {
    dataUrl = config.dataUrl;
    parameters = config.parameters;
    dataId = config.dataId;
    countDownMonitor = config.countDownMonitor;
    timer = new NG.Timer();
  }
  function updateTimer(timeInterval) {
    if (timer.active()) {
      timer.reset();
    }
    timer.set(timeInterval, function(tl) {
      if (tl == 0) {
        self.load();
      }
    }, window);
  }
  this.load = function(data) {
    if (data) {
      update(data);
    } else {
      DataStore.load(dataUrl, {
        parameters: parameters,
        cache: false,
        success: recievedData,
        dataType: "array"
      });
    }
  };
  this.stop = function() {
    timer.pause();
  };

  function recievedData(options, data) {
    update(data);
  }
  function update(data) {
    var newData = data[0];
    timeInterval = data[1] || 0;
    publishNewData(newData);
    updateTimer(timeInterval);
    updateCountDownMonitor(timeInterval);
  }
  function updateCountDownMonitor(timeInterval) {
    if (!countDownMonitor) {
      return;
    }
    if (countDownMonitor.keepCountingDown) {
      if (countDownMonitor.intervalId) {
        window.clearInterval(countDownMonitor.intervalId);
      }
      var i = timeInterval;
      countDownMonitor.intervalId = setInterval(function() {
        if (0 < i) {
          renderCountDownMonitor(i--);
        }
      }, 1000);
    } else {
      renderCountDownMonitor(timeInterval);
    }
  }
  function renderCountDownMonitor(timeInterval) {
    $("#" + countDownMonitor.view.renderTo).html(countDownMonitor.view.displayFunction(timeInterval));
  }
  function publishNewData(data) {
    $(document).triggerHandler(dataId + "-updated", [data]);
  }
};
WS.TabbedPanels = function(config) {
  var $view, $tabs;
  init(config);

  function init(config) {
    id = config.id;
    initTabs(config.tabs);
  }
  function initTabs(tabsConfig) {
    $tabs = $("#" + tabsConfig.view.id);
    var tabsSetup = $.extend({}, $.fn.tabs.base);
    tabsSetup.activate.unshift(function(options) {
      var init = options.init;
      var activate = options.activate;
      this.bind("activated", function(e, selected) {
        var fn = init && init[$(selected).attr("href")];
        if (fn) {
          if (!$(selected).data("initialized")) {
            fn();
            $(selected).data("initialized", true);
          }
        }
        if (activate && activate[$(selected).attr("href")]) {
          activate[$(selected).attr("href")]();
        }
      });
    });
    $tabs.tabs({
      setup: tabsSetup,
      defaultTab: tabsConfig.model.defaultTab,
      activate: tabsConfig.model.activate,
      init: tabsConfig.model.init
    });
  }
};

function SideBoxFormsPresenter(config) {
  var id, $view;
  init(config);

  function init(config) {
    id = config.view.renderTo;
    $view = $("#" + id);
  }
  this.id = function() {
    return id;
  };
  this.load = function(data) {
    var model = new SideBoxFormsModel(data);
    var view = SideBoxFormsView(model);
    $view.html(view);
    $(".team-name", $view).fitText({
      width: 130
    });
  };
}
function SideBoxFormsModel(data) {
  if (!data.value || 0 == data.value.length) {
    return;
  }
  var forms = [];
  var formDatas = data.value;
  for (var i = 0; i < formDatas.length; i++) {
    forms.push({
      TeamId: formDatas[i][5],
      TeamName: formDatas[i][6],
      History: formDatas[i][31],
      RegionCode: TeamId = formDatas[i][34]
    });
  }
  return forms;
}
function SideBoxFormsView(forms) {
  var t = [];
  var find = /<a class="(\w) (\w)" id="(\d+)" title="(.+?)"\/>/g;
  var replace = '<a class="box $1 $2" href="/Matches/$3/Live" title="$4">$1</a>';
  t.push('<table class="grid">');
  t.push("<thead>");
  t.push("<tr>");
  t.push('<th colspan="2">');
  t.push("Best Form (Last 6 Matches)");
  t.push("</th>");
  t.push("</tr>");
  t.push("</thead>");
  t.push("<tbody>");
  for (var i = 0; i < forms.length; i++) {
    t.push("<tr>");
    t.push("<td>");
    t.push(WS.TeamLink(forms[i].TeamId, ('<span class="team-name">' + forms[i].TeamName + '</span><span class="ui-icon country flg-' + forms[i].RegionCode + '"></span>'), "iconize iconize-icon-left"));
    t.push("</td>");
    t.push('<td class="form">');
    t.push(forms[i].History.replace(find, replace));
    t.push("</td>");
    t.push("</tr>");
  }
  t.push("</tbody>");
  t.push("</table>");
  return t.join("");
}
function SideBoxStreaksPresenter(config) {
  var id, $view;
  init(config);

  function init(config) {
    id = config.view.renderTo;
    $view = $("#" + id);
  }
  this.id = function() {
    return id;
  };
  this.load = function(data) {
    var model = new SideBoxStreaksModel(data);
    var view = SideBoxStreaksView(model);
    $view.html(view);
    $(".team-name", $view).fitText({
      width: 130
    });
  };
}
function SideBoxStreaksModel(data) {
  if (!data.value || 0 == data.value.length) {
    return;
  }
  var streaks = [];
  var streakDatas = data.value;
  for (var i = 0; i < streakDatas.length; i++) {
    streaks.push({
      TeamId: streakDatas[i][0],
      TeamName: streakDatas[i][1],
      Streak: streakDatas[i][8],
      RegionCode: TeamId = streakDatas[i][7]
    });
  }
  return streaks;
}
function SideBoxStreaksView(streaks) {
  var t = [];
  var maxStreak = 0;
  for (var i = 0; i < streaks.length; i++) {
    if (maxStreak < streaks[i].Streak) {
      maxStreak = streaks[i].Streak;
    }
  }
  t.push('<table class="ws-list">');
  t.push("<thead>");
  t.push("<tr>");
  t.push('<th colspan="2">');
  t.push("Winning Streak (Longest Winning Pattern)");
  t.push("</th>");
  t.push("</tr>");
  t.push("</thead>");
  t.push("<tbody>");
  for (var i = 0; i < streaks.length; i++) {
    t.push("<tr>");
    t.push('<td class="list-key">');
    t.push(WS.TeamLink(streaks[i].TeamId, ('<span class="team-name">' + streaks[i].TeamName + '</span><span class="ui-icon country flg-' + streaks[i].RegionCode + '"></span>'), "iconize iconize-icon-left", null));
    t.push("</td>");
    t.push('<td class="stat-value">');
    t.push('<span class="stat-bar-wrapper value" style="width: ' + (125 * streaks[i].Streak) / maxStreak + 'px;">');
    t.push('<span class="stat-bar rc-r" style="width: 100%;">');
    t.push('<span class="stat-value">' + streaks[i].Streak + "</span>");
    t.push("</span>");
    t.push("</span>");
    t.push("</td>");
    t.push("</tr>");
  }
  t.push("</tbody>");
  t.push("</table>");
  return t.join("");
}
WS.Filter = function(config) {
  var id, filters = {},
      singular, hasDisplay, displayFormat;

  function init(config) {
    id = config.id;
    hasDisplay = config.hasDisplay;
    displayFormat = config.displayFormat;
    filters = config.categories;
    singular = config.singular;
    bindActions("data");
    bindActions("content");
    bindEvents();
  }
  init(config);
  this.id = function() {
    return id;
  };
  this.getSelection = function(loadDisplays) {
    var selection = singular ? {} : {
      home: {},
      away: {}
    };
    loadSelectedFilters(selection, "data", loadDisplays);
    loadSelectedFilters(selection, "content", loadDisplays);
    loadBoth(selection);
    return selection;
  };
  this.hasDisplay = function() {
    return hasDisplay;
  };
  this.select = function(filters) {
    for (var filter in filters) {
      if (filters.hasOwnProperty(filter)) {
        $("#" + id + "-" + filter + ' a[data-source="' + filters[filter] + '"]').click();
      }
    }
  };
  this.getDisplayFormat = function() {
    if (this.hasDisplay()) {
      return displayFormat;
    }
  };

  function loadBoth(selection) {
    if (!singular) {
      return;
    }
    for (var i = 0; i < filters.data.length; i++) {
      if (filters["data"][i].both) {
        ensureCategoryExists(selection, "both");
        var contentValue = getContentValue(filters.data[i].value);
        if (contentValue) {
          selection.both[filters.data[i].value] = contentValue;
        }
      }
    }
  }
  function loadSelectedFilters(selection, category, loadDisplays) {
    if (!filters[category]) {
      return;
    }
    ensureCategoryExists(selection, category);
    for (var i = 0; i < filters[category].length; i++) {
      if (singular) {
        selection[category][filters[category][i].value] = getFilterValue(category, i);
      } else {
        if (filters[category][i].shared) {
          selection.home[category][filters[category][i].value] = getFilterValue(category, i, "shared-filter", loadDisplays);
          selection.away[category][filters[category][i].value] = getFilterValue(category, i, "shared-filter", loadDisplays);
        } else {
          if (filters[category][i].combined) {
            selection.home[category][filters[category][i].value] = getFilterValue(category, i, "combined-filter", loadDisplays, "home");
            selection.away[category][filters[category][i].value] = getFilterValue(category, i, "combined-filter", loadDisplays, "away");
          } else {
            selection.home[category][filters[category][i].value] = getFilterValue(category, i, "home-team-filter", loadDisplays);
            selection.away[category][filters[category][i].value] = getFilterValue(category, i, "away-team-filter", loadDisplays);
          }
        }
      }
    }
  }
  function getContentValue(filterType) {
    return $("#" + id + "-" + filterType + " .selected").attr("data-content");
  }
  function getFilterValue(category, i, field, loadDisplays, combinedField) {
    var fieldClass = field ? "." + field : "";
    combinedField = combinedField ? "-" + combinedField : "";
    var value = loadDisplays ? (combinedField ? $("#" + id + "-" + filters[category][i].value + " " + fieldClass + " .selected").attr("data-display" + combinedField) : $("#" + id + "-" + filters[category][i].value + " " + fieldClass + " .selected").html()) : $("#" + id + "-" + filters[category][i].value + " " + fieldClass + " .selected").attr("data-source" + combinedField);
    if (null != filters[category][i].index) {
      return {
        index: filters[category][i].index,
        value: value
      };
    }
    return value;
  }
  function ensureCategoryExists(selection, category) {
    if (singular) {
      if (!selection[category]) {
        selection[category] = {};
      }
    } else {
      if (!selection.home[category]) {
        selection.home[category] = {};
      }
      if (!selection.away[category]) {
        selection.away[category] = {};
      }
    }
  }
  function rebindActions(action, filterType) {
    filterType = filterType || id;
    bindActionsForFilter(filterType);
  }
  function bindActions(filterType) {
    if (filters[filterType]) {
      for (var i = 0; i < filters[filterType].length; i++) {
        bindActionsForFilter(id + "-" + filters[filterType][i].value);
      }
    }
  }
  function bindActionsForFilter(filterType) {
    $("#" + filterType + " dl").listbox().bind("selected", function(e, value) {
      e.preventDefault();
      var $filter = $(this);
      if (filterIsGlobal($filter)) {
        var selectedId = $filter.attr("data-value");
        var selectedValue = $("a.selected", $filter).attr("data-value");
        $('dl.global-filter[data-value$="' + selectedId + '"] a').removeClass("selected");
        $('dl.global-filter[data-value$="' + selectedId + '"] a[data-value$="' + selectedValue + '"]').addClass("selected");
        $(document).triggerHandler(filterType + "-filter-selected");
      }
      $("#" + id).triggerHandler("filter-selected");
    });
  }
  function bindEvents() {
    $("#" + id).bind("refresh-filters", rebindActions);
  }
  function filterIsGlobal($element) {
    return $element.hasClass("global-filter");
  }
};
WS.Panel = function(config) {
  var id, self = this,
      filter, content, info, params, currentFilterSelection, currentData = {},
      dataRecieved = {},
      splitContent = false,
      singular = false,
      emptyDataMessage, globalSortParams = {},
      paginationParams = {},
      paginator;
  init(config);
  this.load = function(data) {
    if (data) {
      content.load(data);
      return;
    }
    clearData();
    getFilterSelection();
    if (singular) {
      loadData(params.teamId, currentFilterSelection.data);
    } else {
      loadData(params.home.teamId, currentFilterSelection.home.data);
      loadData(params.away.teamId, currentFilterSelection.away.data);
    }
  };

  function loadData(teamId, filter) {
    renderLoading(getFieldByTeamId(teamId));
    DataStore.load(params.data.url, {
      parameters: prepareParameters(teamId, filter),
      cache: true,
      success: recievedData,
      dataType: config.dataType || "array"
    });
  }
  function renderLoading(field) {
    if (splitContent) {
      if (content[field].showLoading) {
        content[field].showLoading();
      } else {
        $("#" + content[field].id()).append('<div class="stats-loading half"><div class="loading-text">Loading..</div></div>');
      }
    } else {
      if (content.showLoading) {
        content.showLoading();
      } else {
        $("#" + content.id()).append('<div class="stats-loading"><div class="loading-text">Loading..</div></div>');
      }
    }
  }
  function renderEmpty(field) {
    if (splitContent) {
      $("#" + content[field].id()).html('<div class="stats-empty"><div class="loading-text">' + emptyDataMessage[field] + "</div></div>");
    } else {
      if (0 != $("tbody", $("#" + content.id())).length) {
        $("tbody", $("#" + content.id())).html('<tr><td colspan="99">' + emptyDataMessage + "</td></tr>");
      } else {
        $("#" + content.id()).html('<div class="stats-empty"><div class="loading-text">' + emptyDataMessage + "</div></div>");
      }
    }
  }
  function getFilterSelection() {
    if (filter) {
      currentFilterSelection = filter.getSelection();
      if (filter.hasDisplay()) {
        renderFilterDisplay();
      }
    } else {
      currentFilterSelection = {
        home: {},
        away: {}
      };
    }
  }
  function renderFilterDisplay() {
    var currentSelectedFilterTexts = filter.getSelection(true);
    var format = filter.getDisplayFormat();
    var homeDisplay = format,
        awayDisplay = format;
    var filters = {
      home: {},
      away: {}
    };
    filters.home = NG.flattenJson(currentSelectedFilterTexts.home);
    filters.away = NG.flattenJson(currentSelectedFilterTexts.away);
    for (var o in filters.home) {
      homeDisplay = homeDisplay.replace("{" + o + "}", filters.home[o].toLowerCase());
    }
    for (var o in filters.away) {
      awayDisplay = awayDisplay.replace("{" + o + "}", filters.away[o].toLowerCase());
    }
    var display = homeDisplay.capitaliseFirstLetter() + ' <span style="color: #808080; font-size: 0.9em;"> vs </span> ' + awayDisplay.capitaliseFirstLetter();
    display = WS.TeamEmblemUrl(params.home.teamId) + display + WS.TeamEmblemUrl(params.away.teamId);
    $("#" + filter.id() + "-display").html(display);
  }
  function clearData() {
    if (singular) {
      currentData = null;
      dataRecieved = 0;
    } else {
      currentData.home = null;
      currentData.away = null;
      dataRecieved.home = 0;
      dataRecieved.away = 0;
    }
  }
  function getFieldByTeamId(teamId) {
    if (!singular) {
      return params.home.teamId == teamId ? "home" : "away";
    }
    return null;
  }
  function recievedData(options, data) {
    var field = getFieldByTeamId(options.parameters.teamId);
    if (!data || 0 == data.length) {
      clearLoading(field);
      renderEmpty(field);
      $(document).triggerHandler("#" + id + "-recieved-empty-data");
      return;
    }
    if (paginator) {
      paginator.update(data);
      paginator.bindFilterActions(filter.id());
      data = data[1];
    }
    if (singular) {
      currentData = data;
      dataRecieved = 1;
      content.load({
        teamId: params.teamId,
        value: data,
        params: params,
        filter: currentFilterSelection
      });
      clearLoading();
    } else {
      currentData[field] = data;
      dataRecieved[field] = 1;
      if (splitContent) {
        content[field].load({
          teamId: params[field].teamId,
          value: data,
          field: field,
          against: options.parameters.against
        });
        clearLoading(field);
      }
    }
    if (!splitContent) {
      $("#" + id).triggerHandler("data-recieved");
    }
  }
  function clearLoading(field) {
    if (splitContent) {
      if (content[field].hideLoading) {
        content[field].hideLoading();
      } else {
        $("#" + content[field].id() + " .stats-loading").remove();
      }
    } else {
      if (content.hideLoading) {
        content.hideLoading();
      } else {
        $("#" + content.id() + " .stats-loading").remove();
      }
    }
    paginationParams = {};
  }
  function update() {
    if (dataRecieved.home && dataRecieved.away) {
      content.load({
        home: {
          teamId: params.home.teamId,
          value: currentData.home,
          contentFilter: currentFilterSelection.home.content
        },
        away: {
          teamId: params.away.teamId,
          value: currentData.away,
          contentFilter: currentFilterSelection.away.content
        }
      });
    }
    $(document).triggerHandler(id + "-updated");
  }
  function prepareParameters(teamId, filter) {
    var parameters = $.extend({
      teamId: teamId
    }, params.defaultParams, params.extra, globalSortParams, filter, paginationParams);
    return parameters;
  }
  function updateInfo(name, contentFilter) {
    if (dataRecieved.home && dataRecieved.away) {
      info.load({
        home: {
          contentFilter: prepareFilters([contentFilter, currentFilterSelection.home.content]),
          played: getPlayed("home"),
          value: currentData.home,
          teamId: params.home.teamId
        },
        away: {
          contentFilter: prepareFilters([contentFilter, currentFilterSelection.away.content]),
          played: getPlayed("away"),
          value: currentData.away,
          teamId: params.away.teamId
        }
      });
      if (splitContent) {
        clearLoading("home");
        clearLoading("away");
      } else {
        clearLoading();
      }
    }
  }
  function prepareFilters(contentFilters) {
    var result = {};
    for (var i = 0; i < contentFilters.length; i++) {
      if (null != contentFilters[i]) {
        $.extend(result, contentFilters[i]);
      }
    }
    if ({} == result) {
      return null;
    }
    return result;
  }
  function getPlayed(field) {
    if (!params[field].played) {
      return;
    }
    if (currentFilterSelection[field].data) {
      return params[field].played[currentFilterSelection[field].data.field];
    }
    return params[field].played[2];
  }
  function init(config) {
    id = config.id;
    params = config.params || {};
    splitContent = config.splitContent || false;
    singular = config.singular || false;
    filter = createInstanceOf(config.filter);
    if (splitContent) {
      content = {};
      content.home = createInstanceOf(config.content, "home");
      content.away = createInstanceOf(config.content, "away");
    } else {
      content = createInstanceOf(config.content);
    }
    info = createInstanceOf(config.info);
    paginator = createInstanceOf(config.paginator);
    setEmptyDataMessage(config.content);
    bindEvents(config);
  }
  function setEmptyDataMessage(config) {
    emptyDataMessage = {};
    if (splitContent) {
      emptyDataMessage.home = config.view.home.emptyDataMessage ? config.view.home.emptyDataMessage : "N/A";
      emptyDataMessage.away = config.view.away.emptyDataMessage ? config.view.away.emptyDataMessage : "N/A";
    } else {
      emptyDataMessage = config.view.emptyDataMessage ? config.view.emptyDataMessage : "N/A";
    }
  }
  function createInstanceOf(config, field) {
    if (null == config) {
      return null;
    }
    if (config.instance) {
      if (field) {
        return config.instance[field];
      }
      return config.instance;
    }
    if (field) {
      return new config.instanceType({
        view: $.extend({}, config.view.shared, config.view[field]),
        model: config.model
      });
    }
    return new config.instanceType(config);
  }
  function updateInfoTitle(options, title) {
    info.updateTitle(title);
  }
  function bindEvents(config) {
    $("#" + id).bind("data-recieved", update);
    if (splitContent) {
      $("#" + content.home.id()).bind("empty-data", function() {
        renderEmpty("home");
      });
      $("#" + content.away.id()).bind("empty-data", function() {
        renderEmpty("away");
      });
    } else {
      $("#" + content.id()).bind("empty-data", function() {
        renderEmpty();
      });
    }
    if (info) {
      if (splitContent) {
        $("#" + content.home.id()).bind("clicked", updateInfo);
        $("#" + content.home.id()).bind("model-updated", updateInfo);
        $("#" + content.away.id()).bind("clicked", updateInfo);
        $("#" + content.away.id()).bind("model-updated", updateInfo);
      } else {
        $("#" + content.id()).bind("info-title-updated", updateInfoTitle);
        $("#" + content.id()).bind("clicked", updateInfo);
        $("#" + content.id()).bind("model-updated", updateInfo);
      }
    }
    if (filter) {
      $("#" + filter.id()).bind("filter-selected", function(event) {
        self.load();
      });
      $("dl.global-filter", $("#" + config.filter.id)).each(function() {
        var filterId = $(this).attr("data-value");
        $(document).bind(filterId + "-filter-selected", function(event) {
          self.load();
        });
      });
    }
    if (config.hasGlobalSort) {
      $("th.global", $("#" + content.id())).click(function() {
        var $this = $(this);
        globalSortParams = {
          orderBy: $this.attr("data-property"),
          isAscending: $(this).hasClass("asc")
        };
        if (paginator) {
          paginationParams.page = 1;
        }
        self.load();
      });
    }
  }
};
WS.PlayerLink = function(playerId, playerName, clazz, title) {
  if (!playerName) {
    return "";
  }
  if (!playerId || 0 == playerId) {
    return playerName;
  }
  return '<a class="player-link {2}" title="{3}" href="/Players/{0}">{1}</a>'.format(playerId, playerName, clazz ? clazz : "", title ? title : "");
};
WS.TeamLink = function(teamId, teamName, clazz, title) {
  if (!teamName) {
    return;
  }
  if (!teamId || 0 == teamId) {
    return teamName;
  }
  return '<a class="team-link {2}" title="{3}" href="/Teams/{0}">{1}</a>'.format(teamId, teamName, clazz ? clazz : "", title ? title : "");
};
WS.TournamentLink = function(regionId, regionCode, tournamentId, tournamentName, clazz, title) {
  if (!regionId || !tournamentId || !tournamentName) {
    return;
  }
  var icon = regionCode ? '<span class="ui-icon country flg-' + regionCode + '"></span>' : "";
  clazz = clazz || "";
  clazz = regionCode ? "{0} {1}".format(clazz, "iconize iconize-icon-left") : clazz;
  return '<a class="tournament-link {3}" title="{4}" href="/Regions/{0}/Tournaments/{1}">{2}{5}</a>'.format(regionId, tournamentId, tournamentName, clazz, title ? title : "", icon);
};
WS.TournamentHistoryLink = function(regionId, regionCode, tournamentId, tournamentName, seasonId, clazz, title) {
  if (!regionId || !tournamentId || !tournamentName) {
    return;
  }
  var icon = regionCode ? '<span class="ui-icon country flg-' + regionCode + '"></span>' : "";
  clazz = clazz || "";
  clazz = regionCode ? "{0} {1}".format(clazz, "iconize iconize-icon-left") : clazz;
  return '<a class="tournament-link {3}" title="{4}" href="/Regions/{0}/Tournaments/{1}/Seasons/{6}">{2}{5}</a>'.format(regionId, tournamentId, tournamentName, clazz, title ? title : "", icon, seasonId);
};
WS.GridPaginator = function(config) {
  var id, totalPages, totalRecords, currentPage, recordsPerPage, $self;

  function init(config) {
    id = config.id;
    $self = $("#" + id);
  }
  init(config);
  this.id = function() {
    return id;
  };
  this.bindFilterActions = function(filterId) {
    $("#" + filterId).triggerHandler("refresh-filters", [filterId + "-page"]);
  };
  this.update = function(data) {
    if (!data) {
      return;
    }
    if (!data[0]) {
      return;
    }
    var meta = data[0];
    currentPage = meta[0];
    totalPages = meta[1];
    totalRecords = meta[2];
    recordsPerPage = meta[3];
    $self.html(getView());
  };

  function getView() {
    var t = [];
    t.push('<dl class="listbox right">');
    t.push("<dt><b> Page {3}/{4} | Showing {0} - {1} of {2}</b></dt>".format((((currentPage - 1) * recordsPerPage) + 1), Math.min(currentPage * recordsPerPage, totalRecords), totalRecords, currentPage, totalPages));
    var isFirstPage = (1 == currentPage);
    var isLastPage = (totalPages == currentPage);
    if (!isFirstPage && !isLastPage) {
      t.push('<dd style="display: none"><a data-source="10" data-value="10" href="#" class="option selected">dummy</a></dd>');
    }
    t.push('<dd><a data-source="{0}" data-value="11" href="#" class="option {1}">first</a></dd>'.format(1, isFirstPage ? "selected" : ""));
    if (!isFirstPage) {
      t.push('<dd title="Go to page {0}">| <a data-source="{0}" data-value="12" href="#" class="option">prev</a></dd>'.format(currentPage - 1));
    } else {
      t.push('<dd>| <span class="option disabled" href="#">prev</span></dd>');
    }
    if (!isLastPage) {
      t.push('<dd title="Go to page {0}">| <a data-source="{0}" data-value="13" href="#" class="option">next</a></dd>'.format(currentPage + 1));
    } else {
      t.push('<dd>| <span class="option disabled" href="#">next</span></dd>');
    }
    t.push('<dd>| <a data-source="{0}" data-value="14" href="#" class="option {1}">last</a></dd>'.format(totalPages, isLastPage ? "selected" : ""));
    t.push("</dl>");
    return t.join("");
  }
};
WS.TeamHeader = {
  init: function() {
    var self = this;
    self.bindEvents();
  },
  bindEvents: function() {
    var self = this;
    $("#toggle-team-favourites.add-team").unbind("click");
    $("#toggle-team-favourites.remove-team").unbind("click");
    $("#toggle-team-favourites.add-team").on("click", function(e) {
      e.preventDefault();
      self.addTeamAsAFavourite();
    });
    $("#toggle-team-favourites.remove-team").on("click", function(e) {
      e.preventDefault();
      self.removeTeamFromFavourites();
    });
  },
  addTeamAsAFavourite: function() {
    var teamId = gridConfig.model.defaultParameters.teamId;
    WS.User.addTeamAsAFavourite(teamId);
  },
  removeTeamFromFavourites: function() {
    var teamId = gridConfig.model.defaultParameters.teamId;
    WS.User.removeTeamFromFavourites(teamId);
  }
};
WS.FavouriteTournamentsStatusController = {
  init: function() {
    var self = this;
    var favouriteTournamentIds = self.getFavouriteTournamentIds();
    $(".tournament-favourite-status").each(function() {
      self.initTournamentFavouriteStatus($(this), favouriteTournamentIds);
      self.setTournamentFavouriteView($(this));
      self.bindFavouriteTournamentRemoved($(this));
      self.bindFavouriteTournamentAdded($(this));
    });
    $(".tournament-favourite-status").bind("click", function(e) {
      e.preventDefault();
      self.addTournamentAsFavourite($(this));
      return false;
    });
  },
  bindFavouriteTournamentRemoved: function($elem) {
    var tournamentId = $elem.attr("data-tournament-id");
    var self = this;
    NG.Events.addGlobal("favouritetournamentremoved-" + tournamentId, function() {
      $elem.attr("data-is-favourite-tournament", "0");
      self.setTournamentFavouriteView($elem);
    });
  },
  addTournamentAsFavourite: function($elem) {
    var tournamentId = $elem.attr("data-tournament-id");
    if ("0" == $elem.attr("data-is-favourite-tournament")) {
      NG.Events.fireGlobal("addFavouriteTournament", [tournamentId, $elem]);
    }
  },
  bindFavouriteTournamentAdded: function($elem) {
    var tournamentId = $elem.attr("data-tournament-id");
    var self = this;
    NG.Events.addGlobal("favouritetournamentadded-" + tournamentId, function() {
      $elem.attr("data-is-favourite-tournament", "1");
      self.setTournamentFavouriteView($elem);
    });
  },
  initTournamentFavouriteStatus: function($elem, favouriteTournamentIds) {
    var tournamentId = $elem.attr("data-tournament-id");
    $elem.attr("data-is-favourite-tournament", -1 != $.inArray(tournamentId, favouriteTournamentIds) ? "1" : "0");
  },
  setTournamentFavouriteView: function($elem) {
    if ($elem.attr("data-tournament-id")) {
      if ("1" == $elem.attr("data-is-favourite-tournament")) {
        $elem.html("In favourites");
      } else {
        $elem.html('<a class="iconize iconize-icon-right ui-state-transparent-default" href="#popular"><span class="ui-icon ui-icon-star"></span>Add to Favourites</a>');
      }
    }
  },
  getFavouriteTournamentIds: function() {
    var ft = $.cookie("ft") || "";
    return ((0 < ft.length) ? ft.split(",") : []);
  },
  tournamentIsFavourite: function(tournamentId) {
    return tournamentId ? -1 != $.inArray(tournamentId, this.getFavouriteTournamentIds()) : false;
  }
};

function GetTimeRemainingText(startTime) {
  var nTotalDiff = new Date() - new Date(startTime);
  var tD = new Object();
  tD.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
  nTotalDiff -= tD.days * 1000 * 60 * 60 * 24;
  tD.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
  nTotalDiff -= tD.hours * 1000 * 60 * 60;
  tD.minutes = Math.floor(nTotalDiff / 1000 / 60);
  if (tD.days > 1) {
    return "in " + tD.days + "days";
  } else {
    if (tD.days > 0) {
      return "in " + tD.days + "days " + tD.hours + "hrs";
    } else {
      if (tD.hours > 1) {
        return "in " + tD.hours + "hrs " + tD.hours + "'";
      } else {
        if (tD.hours > 0) {
          return "in " + tD.hours + "hr " + tD.minutes + "'";
        } else {
          if (tD.minutes > 0) {
            return "in " + tD.minutes + "mins";
          } else {
            return "upcoming";
          }
        }
      }
    }
  }
}
function MatchFacts(config) {
  var id, $view;
  init(config);

  function init(config) {
    id = config.view.renderTo;
    $view = $("#" + id);
  }
  this.id = function() {
    return id;
  };
  this.load = function(data) {
    var model = MatchFactsModel(data.value);
    $view.html(MatchFactsView(model));
  };
}
function MatchFactsModel(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result.push({
      MatchLink: data[i][0],
      RegionCode: data[i][1],
      HomeTeamName: data[i][2],
      AwayTeamName: data[i][3],
      StartTime: data[i][4],
      FactPoints: data[i][5],
      Sentence: data[i][6],
      MarketType: data[i][7],
      Odd: {
        Value: data[i][8][0],
        CouponUrl: data[i][8][1],
        ProviderId: data[i][8][2],
        ProviderUrl: data[i][8][3],
        ProviderName: data[i][8][4],
        OddText: data[i][8][5],
        HasOdds: data[i][8][6]
      }
    });
  }
  return result;
}
function MatchFactsView(model) {
  var t = [];
  var f;
  t.push('<ul id="factsBox">');
  for (var i = 0, l = model.length; i < l; i++) {
    f = model[i];
    t.push('<li class="fact">');
    t.push('<div class="factText">' + f.Sentence + "</div>");
    t.push('<a target="_blank" class="matchLink" href="' + f.MatchLink + '">');
    t.push('<span class="iconize iconize-icon-left">');
    t.push('<span class="ui-icon country flg-' + f.RegionCode + '"></span>');
    t.push(f.HomeTeamName + " - " + f.AwayTeamName + " (" + GetTimeRemainingText(f.StartTime) + ")");
    t.push("</span></a>");
    if (f.Odd.HasOdds) {
      t.push('<a class="slip-button factBetWrapper" target="_blank" href="' + f.Odd.CouponUrl + '">' + f.Odd.OddText + '<span class="odds odds-numeric">' + f.Odd.Value + "</span></a>");
    }
    t.push('<a href="http://twitter.com/share" class="twitter-share-button" data-count="none" data-text="' + f.Sentence + ' via @WhoScored"></a>');
    t.push("</li>");
  }
  t.push("</ul>");
  t.push('<div class="info">* Odds from bet365.</div>');
  return t.join("");
}
WS.trackMatchFacts = function($a) {
  NG.GA.trackEvent("MatchFacts", $a.attr("data-market-type"), window.location.href);
  window.setTimeout(function() {
    window.open($a.attr("href"));
  }, 100);
  return false;
};
WS.trackOddSummary = function($a) {
  NG.GA.trackEvent("OddSummary", window.location.href);
  window.setTimeout(function() {
    window.open($a.attr("href"));
  }, 100);
  return false;
};
WS.trackHomeSlides = function($a) {
  NG.GA.trackEvent("Slides", $a.attr("data-slide-type").toLowerCase(), $a.attr("href"));
  window.setTimeout(function() {
    window.open($a.attr("href"), "_self");
  }, 100);
  return false;
};
var ConvertDecimalToFractional = (function() {
  var memoOdds = {};

  function convertDecimalToFractional(numToConvert) {
    if (numToConvert < 1.15) {
      numToConvert = Math.round(numToConvert * 100) / 100;
      numToConvert = (numToConvert % 0.02) + numToConvert;
    } else {
      numToConvert = Math.round(numToConvert * 20) / 20;
    }
    var value;
    if (numToConvert in memoOdds) {
      value = memoOdds[numToConvert];
    } else {
      var wholeNumber = parseInt(numToConvert);
      var decimalPart = Math.round((numToConvert - wholeNumber) * 20) / 20;
      var multiple = parseInt(Math.pow(10, decimalPart.toString().substring(2).length));
      var num = parseInt(multiple * decimalPart);
      var denom = multiple;
      if (num > 0) {
        while (((num % 2) + (denom % 2)) == 0) {
          num = num / 2;
          denom = denom / 2;
        }
        while (((num % 5) + (denom % 5)) == 0) {
          num = num / 5;
          denom = denom / 5;
        }
        value = (wholeNumber * denom - denom + num) + "/" + denom;
      } else {
        value = wholeNumber - 1 + "/1";
      }
      memoOdds[numToConvert] = value;
    }
    return value;
  }
  return convertDecimalToFractional;
})();
var ChangeAllOddsToFractional = function() {
  var odt = $.cookie("odt");
  if (1 == odt) {
    $(".odds-numeric").each(function() {
      $(this).html(ConvertDecimalToFractional($(this).html()));
    });
  }
};
WS.isOptaTournament = function(tournamentId) {
  var defaultTournamentIds = [2, 5, 4, 3, 22, 13, 77, 95, 85, 7, 12, 30];
  return isInArray(tournamentId, defaultTournamentIds);

  function isInArray(value, array) {
    return array.indexOf(value) > -1 || array.indexOf(Number(value)) > -1;
  }
};
WS = WS || {};
WS.Accounts = function($) {
  function validateEmail(value) {
    var at = value.lastIndexOf("@");
    if (at < 1 || (at + 1) === value.length) {
      return false;
    }
    var local = value.substring(0, at),
        domain = value.substring(at + 1);
    if (254 < value.length || 64 < local.length || 255 < domain.length) {
      return false;
    }
    if (/(^\.|\.$)/.test(local) || /(^\.|\.$)/.test(domain)) {
      return false;
    }
    if (/(^-|-$)/.test(domain)) {
      return false;
    }
    if (/(\.{2,})/.test(domain)) {
      return false;
    }
    if (!/^[-a-zA-Z0-9\.]*$/.test(domain)) {
      return false;
    }
    if (!/^"(.+)"$/.test(local)) {
      if (!/^[a-zA-Z0-9!#$%&'*+-\/=?^_`{|}~\.]*$/.test(local)) {
        return false;
      }
    }
    return true;
  }
  return {
    initializeForm: function($form) {
      $form.submit(function() {
        $(this).find("input[type=submit]").attr("disabled", true);
        return true;
      });
    },
    registrationForm: function($form) {
      var passwordBlacklist = (window.gPasswordBlacklist && 0 < gPasswordBlacklist.length) ? gPasswordBlacklist.split(",") : null;
      var emailAddressTypoChecker = (window.gEmailAddressTypoChecker && 0 < gEmailAddressTypoChecker.length) ? new RegExp(gEmailAddressTypoChecker) : null;

      function setField(type) {
        fields[type] = $("#" + type);
        hints[type] = $("#" + type + "-status");
        if (hasHintType(hints[type], error) || hasHintType(hints[type], ok)) {
          hints[type].show();
        } else {
          setHint(hints[type], prompt, messages[type + "Prompt"]);
          hints[type].hide();
        }
      }
      function hasHintType($el, type) {
        return $el.find("." + type).length;
      }
      function setHint($el, type, message) {
        return $el.html('<div class="' + type + '">' + message + "</div>");
      }
      function focusHandler() {
        var $hint = hints[this.id];
        $hint.show();
      }
      function blurHandler() {
        var $field = fields[this.id],
            $hint = hints[this.id];
        if (isBlank($field.val())) {
          $hint.hide();
        }
      }
      function isValidChar(e, validInput) {
        var charCode = e.which;
        var re = validInput;
        var keyChar = String.fromCharCode(charCode);
        var validChar = re.test(keyChar);
        var specialChar = [0, 8, 9, 13].indexOf(charCode) !== -1;
        if (!(validChar || specialChar)) {
          return false;
        }
        return true;
      }
      function usernameField() {
        setField("username");
        var ajaxHandle = null;
        fields.username.bind("focus", focusHandler);
        fields.username.bind("blur", function(e) {
          var $field = fields[this.id],
              $hint = hints[this.id],
              value = $field.val();
          if (isBlank(value)) {
            $hint.hide();
            return;
          }
          if (value.length < 3) {
            setHint($hint, error, messages.usernameError);
          }
        });
        fields.username.bind("keypress", function(e) {
          if (!isValidChar(e, /[a-zA-Z0-9_.]/)) {
            e.preventDefault();
          }
        });
        fields.username.bind("keyup", function(e) {
          var $field = fields[this.id],
              $hint = hints[this.id],
              value = $field.val();
          var charCode = e.which;
          var isSpecialChar = [16, 17, 18, 20, 27, 33, 34, 35, 37, 38, 39, 40, 144].indexOf(charCode) !== -1;
          if (isSpecialChar) {
            return;
          }
          if (usernameOldValue == value) {
            return;
          }
          usernameOldValue = value;
          if (ajaxHandle) {
            ajaxHandle.abort();
          }
          if (value == "") {
            setHint($hint, prompt, messages.usernamePrompt);
            return;
          }
          if (value.match(/^[a-zA-Z0-9_.]{3,50}$/)) {
            setHint($hint, prompt, messages.usernameHelper);
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              ajaxHandle = $.ajax({
                type: "GET",
                url: "/Accounts/UsernameAvailable",
                cache: false,
                data: {
                  username: value
                },
                dataType: "json",
                success: function(json) {
                  if (json) {
                    setHint($hint, ok, messages.usernameOK);
                  } else {
                    setHint($hint, error, messages.usernameExistsError);
                  }
                }
              });
            }, 1650);
          } else {
            if (3 <= value.length) {
              setHint($hint, error, messages.usernameError);
            }
          }
        });
      }
      function passwordField() {
        setField("password");
        fields.password.bind("focus", focusHandler);
        fields.password.bind("blur", function() {
          var $field = fields[this.id],
              $hint = hints[this.id],
              value = $field.val();
          if (isBlank(value)) {
            $hint.hide();
            setHint($hint, prompt, messages.passwordPrompt);
            return;
          }
          if (value.length < 6) {
            setHint($hint, error, messages.passwordError);
            return;
          }
          if (fields.username.val() == value || "sAf3$pW8" == value || (passwordBlacklist && -1 != $.inArray(value.toLowerCase(), passwordBlacklist))) {
            setHint($hint, error, messages.passwordTooObviousError);
            return false;
          }
          setHint($hint, ok, messages.passwordOK);
        });
        fields.password.bind("keypress", function(e) {
          if (!isValidChar(e, /[^\s]/)) {
            e.preventDefault();
          }
        });
      }
      function passwordConfirmationField() {
        setField("passwordConfirmation");
        fields.passwordConfirmation.bind("focus", focusHandler);
        fields.passwordConfirmation.bind("blur", function() {
          var $field = fields[this.id],
              $hint = hints[this.id],
              value = $field.val();
          if (isBlank(value)) {
            $hint.hide();
            setHint($hint, prompt, messages.passwordConfirmationPrompt);
            return;
          }
          if (value != fields.password.val()) {
            setHint($hint, error, messages.passwordConfirmationError);
            return;
          }
          setHint($hint, ok, messages.passwordConfirmationOK);
        });
      }
      function emailAddressField() {
        setField("emailAddress");
        fields.emailAddress.bind("focus", focusHandler);
        fields.emailAddress.bind("blur", function() {
          var $field = fields[this.id],
              $hint = hints[this.id],
              value = $field.val().trim();
          $field.val(value);
          if (isBlank(value)) {
            $hint.hide();
            setHint($hint, prompt, messages.emailAddressPrompt);
            return;
          }
          if (emailAddressOldValue == value) {
            return;
          }
          emailAddressOldValue = value;
          if (!validateEmail(value)) {
            setHint($hint, error, messages.emailAddressError);
            return;
          }
          if (emailAddressTypoChecker && emailAddressTypoChecker.test(value)) {
            setHint($hint, error, messages.emailAddressError);
            return;
          }
          setHint($hint, prompt, messages.emailAddressHelper);
          $.ajax({
            type: "GET",
            url: "/Accounts/EmailAddressAvailable",
            cache: false,
            data: {
              emailAddress: value
            },
            dataType: "json",
            success: function(json) {
              if (0 == json.ReturnCode) {
                setHint($hint, ok, messages.emailAddressOK);
              } else {
                setHint($hint, error, json.Message);
              }
            }
          });
        });
        fields.emailAddress.bind("keypress", function(e) {
          var $field = fields[this.id],
              value = $field.val().trim();
          $field.val(value);
          if (13 == e.which && !isBlank(value) && emailAddressOldValue != value) {
            $field.blur();
            e.preventDefault();
          }
        });
      }
      var error = "error",
          prompt = "prompt",
          ok = "ok",
          messages = gMessages,
          fields = {},
          hints = {},
          usernameOldValue = null,
          emailAddressOldValue = null,
          timeout = null;
      usernameField();
      passwordField();
      passwordConfirmationField();
      emailAddressField();
      $form.submit(function() {
        return true;
      });
    }
  };
}(jQuery);
WS = WS || {};
WS.LS = {};
WS.LS.ItemStatus = {
  all: 0,
  live: 2,
  next: 4
};
WS.LS.IncidentManager = function(options) {
  var itemIdPrefix = "i",
      itemIdRegEx = new RegExp("{0}(\\d*)".format(itemIdPrefix)),
      visibleIncidents = {};
  this.toggle = function(button) {
    var itemId = $(button).parents("tr:first").attr("id").match(itemIdRegEx)[1];
    visibleIncidents[itemId] ? hide(itemId) : show(itemId);
  };
  this.showAll = function() {
    for (var itemId in visibleIncidents) {
      show(itemId);
    }
  };

  function show(id) {
    var $tr = $("#" + itemIdPrefix + id).addClass("hasDetails");
    var $button = $tr.find(".show-incidents").addClass("ui-state-active").blur().find(".ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
    visibleIncidents[id] = true;
    $tr.after(options.parent.getIncidentHtml(id));
  }
  function hide(id) {
    delete visibleIncidents[id];
    var $tr = $("#" + itemIdPrefix + id).removeClass("hasDetails");
    var $button = $tr.find(".show-incidents").removeClass("ui-state-active").blur().find(".ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
    $('tr[data-match-id="' + itemIdPrefix + id + '"]').remove();
  }
};
WS.LS.TournamentToggleManager = function(options) {
  var groupIdPrefix = "g",
      groupIdRegEx = new RegExp("{0}(\\d*)".format(groupIdPrefix)),
      expandedTournaments = {};
  this.initialize = function(expandedGroups) {
    for (var i = 0, l = expandedGroups.length; i < l; i++) {
      expandedTournaments[expandedGroups[i]] = true;
    }
  };
  this.toggle = function(row) {
    var groupId = $(row).parents("tr:first").attr("id").match(groupIdRegEx)[1];
    expandedTournaments[groupId] ? collapse(groupId) : expand(groupId);
  };
  this.expand = function() {
    for (var groupId in expandedTournaments) {
      expand(groupId);
    }
  };
  this.isExpanded = function(id) {
    return expandedTournaments[id];
  };

  function expand(id) {
    $('tr[id="g' + id + '"]').removeClass("collapsed");
    $('tr[data-group-id="' + id + '"]').removeClass("ls-th");
    expandedTournaments[id] = true;
  }
  function collapse(id) {
    delete expandedTournaments[id];
    $('tr[id="g' + id + '"]').addClass("collapsed");
    $('tr[data-group-id="' + id + '"]').addClass("ls-th");
  }
};
WS.LS.Selection = function() {
  this.items_ = {};
  this.groups_ = {};
  this.totalItemCount_ = 0;
  this.any = function() {
    return (0 < this.totalItemCount_);
  };
  this.selectItem = function(item) {
    if (this.isSelectedItem(item.Id)) {
      return;
    }
    var clone = {
      Id: item.Id,
      GroupId: item.Group.Id
    };
    this.items_[clone.Id] = clone;
    this.totalItemCount_++;
    this.groups_[clone.GroupId] = this.groups_[clone.GroupId] || {
      selectedItemCount: 0
    };
    this.groups_[clone.GroupId].selectedItemCount++;
  };
  this.deselectItem = function(item) {
    if (!this.isSelectedItem(item.Id)) {
      return;
    }
    this.totalItemCount_--;
    delete this.items_[item.Id];
    this.groups_[item.Group.Id].selectedItemCount--;
    if (0 == this.groups_[item.Group.Id].selectedItemCount) {
      delete this.groups_[item.Group.Id];
    }
  };
  this.hasSelectedItems = function(id) {
    return "undefined" != typeof(this.groups_[id]);
  };
  this.isSelectedItem = function(id) {
    return "undefined" != typeof(this.items_[id]);
  };
};
WS.LS.CssToggler = function() {
  var cache = {
    init: false
  };

  function applyCssRules() {
    if (!cache.init) {
      var selectors = [".ls-1", ".ls-2", ".ls-4", ".ls-3", ".ls-5", ".ls-6", ".ls-7", ".ls-e", ".ls-o", ".ls-t", ".ls-s", ".ls-th", ".ls-thb"],
          count = selectors.length,
          selectorsMap = selectors.hashtable(),
          styleSheet, cssRules, cssRule;
      styleSheet = getStyleSheet();
      cssRules = styleSheet.cssRules || styleSheet.rules;
      for (var j = 0, m = cssRules.length; j < m; j++) {
        cssRule = cssRules[j];
        if (undefined != selectorsMap[cssRule.selectorText]) {
          cache[cssRule.selectorText] = cssRule;
        }
      }
      cache.init = true;
    }
    for (var i = 0, l = arguments[1].length; i < l; i++) {
      cache[arguments[1][i]].style.display = ("show" == arguments[0]) ? "" : "none";
    }
  }
  function getStyleSheet() {
    for (var i = 0, l = document.styleSheets.length; i < l; i++) {
      if ("ls" == document.styleSheets[i].title) {
        return document.styleSheets[i];
      }
    }
    return null;
  }
  this.show = function(selectors) {
    applyCssRules("show", selectors);
  };
  this.hide = function(selectors) {
    applyCssRules("hide", selectors);
  };
};
WS.LS.MapLike = function() {
  this.keys = {};
  this.values = [];
  this.add = function(id, o, position) {
    ("undefined" !== typeof(position)) ? this.values[position] = o : this.values.push(o);
    this.keys[id] = o;
  };
};
WS.LS.Model = function() {
  this.array_ = null;
  this.favoriteGroups_ = null;
  this.create = function(array) {
    this.process_(array);
    NG.Events.fire(this, "modelchanged", this);
  };
  this.update = function(array) {
    this.merge_(array);
    this.process_(this.array_);
    NG.Events.fire(this, "modelchanged", this);
  };
  this.sort = function() {
    NG.async(function() {
      this.process_(this.array_);
      NG.Events.fire(this, "modelsorted", this);
    }, this);
  };
  this.process_ = function(array) {
    this.groups = new WS.LS.MapLike();
    this.items = new WS.LS.MapLike();
    this.itemCounts = {
      "0": 0,
      "1": 0,
      "2": 0,
      "4": 0
    };
    this.scoreUpdates = {
      all: [],
      live: [],
      next: [],
      add: function(item) {
        this.all.push(item);
        if (2 == item.Status) {
          this.live.push(item);
        } else {
          if (4 == item.Status) {
            this.next.push(item);
          }
        }
      }
    };
    this.array_ = array;
    this.favoriteGroups_ = this.getFavoriteGroups_();
    for (var i = 0, l = this.favoriteGroups_.ids.length; i < l; i++) {
      this.groups.values.push(null);
    }
    var expandAll = this.array_[2].length <= 60;
    for (var i = 0, l = this.array_[1].length; i < l; i++) {
      this.mapGroups_(this.array_[1][i], expandAll);
    }
    for (var i = 0, l = this.array_[2].length; i < l; i++) {
      this.mapItems_(this.array_[2][i]);
    }
    for (var i = 0, l = this.favoriteGroups_.ids.length; i < l; i++) {
      if (null == this.groups.values[i]) {
        this.groups.values.splice(i, 1);
        i--;
        l--;
      }
    }
  };
  this.mapGroups_ = function(props, expandAll) {
    var o = {
      Status: 0,
      Items: [],
      add: function(item) {
        item.Group = this;
        this.Items.push(item);
        this.Status = this.Status | item.Status;
      }
    };
    o.Id = props[0];
    o.CountryId = props[1];
    o.CountryCode = props[2];
    o.CountryName = props[3];
    o.TournamentId = props[4];
    o.TournamentShortName = props[5] || "";
    o.SeasonId = props[6];
    o.Name = props[7];
    o.Expand = (1 == props[8] || 1 == props[11]);
    o.DetailedCoverage = props[9];
    o.IsInternational = props[10];
    o.ItemCount = 0;
    if (o.Id in this.favoriteGroups_.index) {
      o.isFavorite = true;
      o.Expand = true;
      this.groups.add(o.Id, o, this.favoriteGroups_.index[o.Id]);
    } else {
      this.groups.add(o.Id, o);
    }
    if (expandAll) {
      o.Expand = true;
    }
  };
  this.mapItems_ = function(props) {
    var o = {};
    o.Id = props[1];
    o.Status = props[2];
    o.StartTime = props[3];
    o.HomeTeamId = props[4];
    o.HomeTeamName = props[5];
    o.HomeYCards = props[6];
    o.HomeRCards = props[7];
    o.AwayTeamId = props[8];
    o.AwayTeamName = props[9];
    o.AwayYCards = props[10];
    o.AwayRCards = props[11];
    o.Score = props[12];
    o.HTScore = props[13];
    o.HasIncidents = (1 == props[14]);
    o.HasPreview = (1 == props[15]);
    o.ScoreChangedAt = props[16];
    o.Elapsed = props[17] || "";
    o.LastScorer = props[18] || "";
    o.IsTopGame = props[19];
    o.HomeCountryCode = props[20];
    o.AwayCountryCode = props[21];
    o.Incidents = props[22];
    o.CommentCount = props[23];
    o.IsLineupsConfirmed = props[24];
    o.IsStreamAvailable = props[25];
    o.MatchIsDetailedCoverage = props[26];
    o.HasLineup = props[27];
    this.items.add(o.Id, o);
    var group = this.groups.keys[parseInt(props[0])];
    o.DetailedCoverage = group.DetailedCoverage || o.MatchIsDetailedCoverage;
    group.add(o);
    o.Group = group;
    if (2 == o.Status) {
      group.Expand = true;
    }
    group.ItemCount++;
    if (o.ScoreChangedAt && o.Status != "4") {
      this.scoreUpdates.add(o);
    }
    this.itemCounts[0]++;
    this.itemCounts[o.Status]++;
  };
  this.getFavoriteGroups_ = function() {
    var result = {
      ids: [],
      index: {}
    },
        favoriteTournaments = WS.User.favoriteTournaments(),
        items = this.array_[1];
    if (0 < favoriteTournaments.length) {
      var groupIdx = items.indextable(function(item) {
        return item[4];
      });
      for (var i = 0, l = favoriteTournaments.length; i < l; i++) {
        if (undefined != groupIdx[favoriteTournaments[i]]) {
          for (var j = 0, k = items.length; j < k; j++) {
            if (favoriteTournaments[i] == items[j][4]) {
              result.ids.push(items[j][0]);
            }
          }
        }
      }
      result.index = result.ids.indextable();
    }
    return result;
  };
  this.merge_ = function(delta) {
    var i, l, id, idx, rawGroups = this.array_[1],
        rawItems = this.array_[2],
        deltaGroups = delta[1],
        deltaItems = delta[2];
    for (i = 0, l = deltaGroups.length; i < l; i++) {
      id = deltaGroups[i][0];
      if (id in this.groups.keys) {
        idx = NG.indexOf(rawGroups, id, 0, function(o) {
          return o[0];
        });
        rawGroups[idx] = deltaGroups[i];
      } else {
        rawGroups.push(deltaGroups[i]);
      }
    }
    for (i = 0, l = deltaItems.length; i < l; i++) {
      id = deltaItems[i][1];
      if (id in this.items.keys) {
        idx = NG.indexOf(rawItems, id, 0, function(o) {
          return o[1];
        });
        rawItems[idx] = deltaItems[i];
      } else {
        idx = NG.binarySearch(rawItems, deltaItems[i][3], true, function(o) {
          return o[3];
        });
        rawItems.splice(idx, 0, deltaItems[i]);
      }
    }
  };
};
WS.LS.LiveScores = function(state, selectionItems) {
  var self = this,
      groups, items, itemCounts, currentState = $.extend(true, {}, state),
      el = document.getElementById("livescores"),
      selections = new WS.LS.Selection(),
      selection = selectionItems,
      initializeSelections = selection && 0 < selection.length,
      incidentManager = new WS.LS.IncidentManager({
      parent: self
    }),
      tournamentToggleManager = new WS.LS.TournamentToggleManager({
      parent: self
    }),
      initializeTournamentsToggle = true;
  this.selections = selections;
  var matchSelectedMsgOptions = {
    icon: "icon-circle-check",
    messageText: "Added to your selections",
    classes: "favorite-tournaments-added-message",
    timeToLive: 750,
    leftMargin: 5
  };
  this.dataChanged = function(model) {
    groups = model.groups;
    items = model.items;
    itemCounts = model.itemCounts;
    if (initializeSelections) {
      for (var i = 0, l = selection.length; i < l; i++) {
        selections.selectItem(model.items.keys[selection[i]]);
      }
      initializeSelections = false;
    }
    this.render_();
    incidentManager.showAll();
    if (initializeTournamentsToggle) {
      var expandedGroups = [];
      for (var i = 0, l = groups.values.length; i < l; i++) {
        var group = groups.values[i];
        if (group.Expand) {
          expandedGroups.push(group.Id);
        }
      }
      tournamentToggleManager.initialize(expandedGroups);
      initializeTournamentsToggle = false;
    }
    tournamentToggleManager.expand();
  };
  this.stateChanged = function(state) {
    var layoutChanged = currentState.layout != state.layout,
        selectionChanged = (currentState.items != state.items) && ("selected" == currentState.items || "selected" == state.items);
    currentState = $.extend(true, {}, state);
    if (layoutChanged || selectionChanged) {
      this.render_();
      incidentManager.showAll();
      tournamentToggleManager.expand();
    }
  };
  this.dispose = function() {
    el = NG.replaceHtml(el, "");
  };
  this.anySelection = function() {
    return selections.any();
  };
  this.clearSelection = function() {
    selections = new WS.LS.Selection();
    NG.Events.fire(self, "selectionchanged", [selections]);
  };
  this.checkboxClicked_ = function(source) {
    var isItemClicked = (-1 < source.id.indexOf("i")) ? true : false;
    if (isItemClicked) {
      var id = source.id.substr(2),
          item = items.keys[id];
      if (source.checked) {
        selections.selectItem(item);
        $(source).messageBox(matchSelectedMsgOptions);
      } else {
        selections.deselectItem(item);
      }
    } else {
      var id = source.id.substr(1),
          group = groups.keys[id],
          itemStatus = WS.LS.ItemStatus[currentState.items],
          checkbox;
      if (source.checked) {
        group.Items.forEach(function(item) {
          if (("all" == currentState.items) || ("all" != currentState.items && itemStatus == item.Status) || ("selected" == currentState.items)) {
            var checkbox = document.getElementById("is" + item.Id);
            if (checkbox && !checkbox.checked) {
              selections.selectItem(item);
              checkbox.checked = true;
            }
          }
        });
        $(source).messageBox(matchSelectedMsgOptions);
      } else {
        group.Items.forEach(function(item) {
          var checkbox = document.getElementById("is" + item.Id);
          if (checkbox && checkbox.checked) {
            selections.deselectItem(item);
            document.getElementById("is" + item.Id).checked = false;
          }
        });
      }
    }
    NG.Events.fire(self, "selectionchanged", [selections]);
  };
  this.getIncidentHtml = function(itemId) {
    var item = items.keys[itemId],
        t = [],
        isExpanded = item.Group.Expand || tournamentToggleManager.isExpanded(item.Group.Id);
    item.Incidents.forEach(function(incident) {
      t.push(applyDetailTmpl(item, incident, "i", isExpanded));
    });
    return t.join("");
  };
  this.showIncidentsClicked_ = function(source) {
    incidentManager.toggle(source);
    return false;
  };
  this.toggleMatchesClicked_ = function(source) {
    tournamentToggleManager.toggle(source);
    return false;
  };
  this.render_ = function() {
    var html;
    var isSelectedStatus = ("selected" == currentState.items),
        isSelectedItem, isExpanded;
    if ("grouped" == currentState.layout) {
      var t = [];
      t.push('<table class="grid highlight livescores"><tbody>');
      groups.values.forEach(function(group, groupIndex, groups) {
        if (!isSelectedStatus || (isSelectedStatus && selections.hasSelectedItems(group.Id))) {
          t.push(applyGroupTmpl(group, false));
          group.Items.forEach(function(item, itemIndex, items) {
            isSelectedItem = selections.isSelectedItem(item.Id);
            if (!isSelectedStatus || (isSelectedStatus && isSelectedItem)) {
              t.push(applyItemTmpl(item, itemIndex, isSelectedItem, ""));
            }
          });
        }
      });
      t.push("</tbody></table>");
      html = t.join("");
    } else {
      var t = [];
      t.push('<table class="grid highlight livescores"><tbody>');
      items.values.forEach(function(item, itemIndex, items) {
        isSelectedItem = selections.isSelectedItem(item.Id);
        if (!isSelectedStatus || (isSelectedStatus && isSelectedItem)) {
          t.push(applyItemTmpl(item, itemIndex, isSelectedItem, ""));
        }
      });
      t.push("</tbody></table>");
      html = t.join("");
    }
    el = NG.replaceHtml(el, html);
  };
  var groupHyperlinkTemplate = "/Regions/{0}/Tournaments/{1}/Seasons/{2}/Stages/{3}";

  function applyGroupTmpl(group, checked) {
    var t = [];
    t.push('<tr class="group ls-');
    t.push(group.Status);
    t.push(" collapsed");
    t.push('" id="g');
    t.push(group.Id);
    t.push('">');
    t.push('<td class="ls-s selection"><input type="checkbox" id="g' + group.Id + '"');
    t.push(checked ? 'checked="true"' : "");
    t.push("/></td>");
    t.push('<td colspan="8">');
    t.push('<div class="group-name-container">');
    t.push('<span class="group-name iconize iconize-icon-left"><span class="ui-icon country flg-' + group.CountryCode + '"></span>' + group.CountryName + " - " + group.Name + "</span>");
    if (group.DetailedCoverage) {
      t.push('<span class="detcover rc">Detailed coverage</span>');
    }
    t.push("</div>");
    t.push('<a class="follow-link button-small ui-state-transparent-default rc" href="' + groupHyperlinkTemplate.format(group.CountryId, group.TournamentId, group.SeasonId, group.Id) + '" title="Go to tournament page"><span class="ui-icon ui-icon-circle-arrow-e"></span></a>');
    t.push("</td>");
    t.push("</tr>");
    return t.join("");
  }
  function applyItemTmpl(item, k, checked, prefix) {
    var intl = item.Group.IsInternational;
    var t = [];
    t.push('<tr class="item ls-');
    t.push(item.Status);
    t.push(" ls-th");
    t.push('" id="' + prefix + "i" + item.Id + '"');
    t.push(' data-group-id="' + item.Group.Id + '"');
    t.push(">");
    t.push('<td class="ls-s selection"><input type="checkbox" id="is' + prefix + item.Id + '"');
    t.push(checked ? 'checked="true"' : "");
    t.push("/></td>");
    t.push('<td class="toolbar left">');
    if (item.HasIncidents) {
      t.push('<a href="#" class="show-incidents button-small ui-state-transparent-default rc" title="Expand details"><span class="ui-icon ui-icon-triangle-1-e"></span></a>');
    }
    t.push("</td>");
    t.push('<td class="time">');
    t.push(item.StartTime);
    t.push("</td>");
    t.push('<td class="status">');
    t.push('<span class="status-' + item.Status + ' rc">' + item.Elapsed + "</span>");
    t.push("</td>");
    t.push('<td class="topmatch-column">');
    if (item.IsTopGame) {
      t.push('<span class="incidents-icon ui-icon topmatch" title="Top matches of the day"></span>');
    }
    t.push("</td>");
    t.push('<td class="team home">');
    if (0 < item.HomeRCards) {
      t.push('<span class="rcard ls-e">' + item.HomeRCards + "</span>");
    }
    if (intl) {
      t.push('<a class="team-link iconize iconize-icon-right" href="/Teams/' + item.HomeTeamId + '"><span class="ui-icon country flg-' + item.HomeCountryCode + '"></span><span class="team-name">' + item.HomeTeamName + "</span></a>");
    } else {
      t.push('<a class="team-link" href="/Teams/' + item.HomeTeamId + '"><span class="team-name">' + item.HomeTeamName + "</span></a>");
    }
    t.push("</td>");
    t.push('<td class="result">');
    var matchHasTerminatedUnexpectedly = matchTerminatedUnexpectedly(item.Elapsed);
    if (matchHasTerminatedUnexpectedly) {
      t.push('<a title="' + matchTerminatedUnexpectedlyToolTip(item.Elapsed) + ' " href="/Matches/' + item.Id + '">' + item.Score + "</a>");
    } else {
      if ("2" == item.Status || "1" == item.Status) {
        t.push('<a class="result-' + item.Status + ' rc" href="/Matches/' + item.Id + '/Live">' + item.Score + "</a>");
      } else {
        t.push('<a class="result-' + item.Status + ' rc" href="/Matches/' + item.Id + '">' + item.Score + "</a>");
      }
    }
    t.push("</td>");
    t.push('<td class="team away">');
    if (intl) {
      t.push('<a class="team-link iconize iconize-icon-left" href="/Teams/' + item.AwayTeamId + '"><span class="ui-icon country flg-' + item.AwayCountryCode + '"></span><span class="team-name">' + item.AwayTeamName + "</span></a>");
    } else {
      t.push('<a class="team-link" href="/Teams/' + item.AwayTeamId + '"><span class="team-name">' + item.AwayTeamName + "</span></a>");
    }
    if (0 < item.AwayRCards) {
      t.push('<span class="rcard ls-e">' + item.AwayRCards + "</span>");
    }
    t.push("</td>");
    t.push('<td class="stage ls-t' + prefix + '">');
    t.push('<a href="' + groupHyperlinkTemplate.format(item.Group.CountryId, item.Group.TournamentId, item.Group.SeasonId, item.Group.Id) + '" class="iconize iconize-icon-left"><span class="ui-icon country flg-' + item.Group.CountryCode + '"></span>' + item.Group.TournamentShortName + "</a>");
    t.push("</td>");
    t.push('<td class="toolbar right"><div style="width:12.75em;">');
    if (!item.Group.DetailedCoverage && item.DetailedCoverage && "4" == item.Status) {
      t.push('<span style="margin-right: 4px; vertical-align: middle; float: left; font-size: 10px;" class="detcover rc">Detailed coverage</span>');
    }
    if ("1" == item.Status && item.DetailedCoverage && !matchHasTerminatedUnexpectedly) {
      t.push('<a class="match-link rc match-report" href="/Matches/' + item.Id + '/MatchReport" title="Check Match Report!">Match Report</a>');
    } else {
      if ("2" == item.Status && item.DetailedCoverage) {
        t.push('<a class="match-link rc live" href="/Matches/' + item.Id + '/Live" title="Follow Live!">Match Centre</a>');
      } else {
        if (item.HasPreview && "4" == item.Status) {
          t.push('<a class="match-link rc preview" href="/Matches/' + item.Id + '/Preview" title="Check Preview!">Preview</a>');
        }
      }
    }
    if ((item.IsLineupsConfirmed) && "4" == item.Status) {
      t.push('<a href="/Matches/' + item.Id + '/Live" class="match-link lineups-confirmed rc" title="Check Lineups!">Lineups</a>');
    }
    if (item.IsStreamAvailable) {
      t.push('<a href="/Matches/' + item.Id + '/LiveStream" class="iconize " title="Stream"><span class="incidents-icon ui-icon stream">Stream</span></a>');
    }
    if (item.CommentCount) {
      t.push('<a href="/Matches/' + item.Id + '" class="iconize iconize-icon-right fixture-comments" title="Comments"><span class="incidents-icon ui-icon comments"></span>' + item.CommentCount + "</a>");
    }
    t.push("</div></td>");
    t.push("</tr>");
    return t.join("");
  }
  function applyDetailTmpl(item, detail, prefix, expanded) {
    function getIncidentClass(type) {
      return (1 == type) ? "i-goal" : "i-rcard";
    }
    var t = [];
    t.push('<tr class="incident ls-' + item.Status);
    if (!expanded) {
      t.push(" ls-th");
    }
    t.push('"');
    t.push(' data-match-id="' + prefix + item.Id + '"');
    t.push(' data-group-id="' + item.Group.Id + '"');
    t.push(">");
    if ("0" == detail[2]) {
      t.push('<td class="team home" colspan="6">');
      t.push('<span class="iconize iconize-icon-right"><span class="incidents-icon ui-icon ' + getIncidentClass(detail[0]) + '"></span>');
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push(0 != detail[7] ? ('<a class="player-link" href="/Players/' + detail[7] + '">' + detail[3] + "</a>") : detail[3]);
      t.push("</span>");
      t.push("</td>");
      t.push('<td class="minute">');
      t.push(detail[1]);
      t.push("'</td>");
      t.push('<td class="team away" colspan="3"></td>');
    } else {
      t.push('<td class="team home" colspan="6"></td>');
      t.push('<td class="minute">');
      t.push(detail[1]);
      t.push("'</td>");
      t.push('<td class="team away" colspan="3">');
      t.push('<span class="iconize iconize-icon-left"><span class="ui-icon incidents-icon ' + getIncidentClass(detail[0]) + '"></span>');
      t.push(0 != detail[7] ? ('<a class="player-link" href="/Players/' + detail[7] + '">' + detail[3] + "</a>") : detail[3]);
      if (detail[4] != undefined) {
        t.push('<span class="goal-info">(' + detail[4] + ")</span>");
      }
      t.push("</span>");
      t.push("</td>");
    }
    t.push("</tr>");
    return t.join("");
  }
};
WS.LS.ScoreUpdates = function(state, selectionItems) {
  var model, top10Updates, updateSelections = [],
      allSelections = [],
      currentState = $.extend(true, {}, state),
      $el = $("#ws-content"),
      selection = selectionItems,
      initializeSelections = selection && 0 < selection.length;
  this.dataChanged = function(newModel) {
    model = newModel;
    if (initializeSelections) {
      for (var i = 0, l = selection.length; i < l; i++) {
        allSelections.push(newModel.items.keys[selection[i]]);
      }
      initializeSelections = false;
    }
    var tempTop10Updates = {
      all: getFirst10(newModel.scoreUpdates.all),
      live: getFirst10(newModel.scoreUpdates.live),
      next: getFirst10(newModel.scoreUpdates.next),
      selected: getFirst10(getSelectedItems(newModel, allSelections))
    },
        dataExists = 0 < tempTop10Updates[currentState.items].length,
        dataUpdated = hasUpdates(top10Updates, tempTop10Updates, currentState.items);
    top10Updates = tempTop10Updates;
    if (dataExists) {
      this.render_();
      if (dataUpdated) {
        NG.Events.fireGlobal("scoresupdated");
      }
    } else {
      this.reset_();
    }
  };

  function getSelectedItems(model, selectedItems) {
    var newItems = [];
    for (var i = 0, l = selectedItems.length; i < l; i++) {
      var item = model.items.keys[selectedItems[i].Id];
      if (item && item.ScoreChangedAt) {
        newItems.push(item);
      }
    }
    return newItems;
  }
  this.stateChanged = function(state) {
    var itemCountChanged = currentState.items != state.items;
    currentState = $.extend(true, {}, state);
    if (itemCountChanged) {
      if (0 < top10Updates[state.items].length) {
        this.render_();
      } else {
        this.reset_();
      }
    }
  };
  this.handleSelectionChanged = function(selection) {
    selectedItems = [];
    for (var itemId in selection.items_) {
      if (selection.items_.hasOwnProperty(itemId)) {
        selectedItems.push({
          Id: itemId
        });
      }
    }
    allSelections = selectedItems;
    updateSelections = getSelectedItems(model, selectedItems);
    top10Updates.selected = getFirst10(updateSelections);
  };
  this.dispose = function() {
    delete data_;
    this.reset_();
  };

  function getIndex(collection, item) {
    for (var i = 0, l = collection.length; i < l; i++) {
      if (item.Id == collection[i].Id) {
        return i;
      }
    }
    return -1;
  }
  function getFirst10(items) {
    if (0 == items.length) {
      return [];
    }
    items.sort(function(a, b) {
      if (a.ScoreChangedAt < b.ScoreChangedAt) {
        return -1 * -1;
      }
      if (b.ScoreChangedAt < a.ScoreChangedAt) {
        return 1 * -1;
      }
      return 0;
    });
    var result = [];
    for (var i = 0; i < Math.min(10, items.length); i++) {
      result.push(items[i]);
    }
    return result;
  }
  function hasUpdates(current, update, field) {
    if (!current) {
      return false;
    }
    var diff = update[field].subtract(current[field], function(a, b) {
      return !(a.Id == b.Id && a.ScoreChangedAt == b.ScoreChangedAt);
    });
    return (0 < diff.length);
  }
  this.render_ = function() {
    var data = top10Updates[currentState.items],
        html, t = [];
    t.push('<table class="grid"><tbody>');
    data.forEach(function(item, itemIndex, items) {
      t.push(applyScoreUpdateTmpl(item));
    });
    t.push("</tbody></table>");
    html = t.join("");
    $el.html(html);
  };
  this.reset_ = function() {
    $el.html('<span class="empty">No goals yet</span>');
  };

  function applyScoreUpdateTmpl(item) {
    var t = [];
    t.push("<tr>");
    t.push('<td class="time">');
    t.push(item.ScoreChangedAt);
    t.push("</td>");
    t.push('<td class="team home">');
    t.push(("0" == item.LastScorer) ? "<strong>" + item.HomeTeamName + "</strong>" : item.HomeTeamName);
    t.push("</td>");
    t.push('<td class="result">');
    t.push(item.Score);
    t.push("</td>");
    t.push('<td class="team away">');
    t.push(("1" == item.LastScorer) ? "<strong>" + item.AwayTeamName + "</strong>" : item.AwayTeamName);
    t.push("</td>");
    t.push('<td class="stage">');
    t.push('<span class="group-name iconize iconize-icon-left" title="' + item.Group.CountryName + "-" + item.Group.Name + '"><span class="ui-icon country flg-' + item.Group.CountryCode + '"></span>' + item.Group.TournamentShortName + "</span>");
    t.push("</td>");
    t.push("</tr>");
    return t.join("");
  }
};
WS.LS.App = {
  isEverLoaded_: false,
  isLoading_: false,
  timer_: new NG.Timer(),
  defaultTimeout_: 15,
  freshLoadTimeout_: 60,
  lastCompleteRefreshAt_: null,
  date_: null,
  version_: null,
  model_: null,
  liveScores_: null,
  scoreUpdates_: null,
  state_: null,
  liveScoresToggleMatchesClicked_: function(source) {
    this.liveScores_.toggleMatchesClicked_(source);
  },
  liveScoresShowIncidentsClicked_: function(source) {
    this.liveScores_.showIncidentsClicked_(source);
  },
  liveScoresCheckboxClicked_: function(source) {
    this.liveScores_.checkboxClicked_(source);
  },
  modelChanged_: function(model) {
    var text = {
      all: "All",
      live: "In Play",
      next: "Upcoming",
      selected: "Selected"
    };
    $("#view-options a").each(function() {
      var key = this.href.substr(this.href.indexOf("#") + 1);
      var count = model.itemCounts[WS.LS.ItemStatus[key]];
      $(this).find("b").html(("undefined" != typeof(count) ? count : 0));
    });
    $('#view-options a[href="#selected"]').find("b").html(this.liveScores_.selections.totalItemCount_);
  },
  selectionChanged_: function(selection) {
    var value = null;
    if (0 < selection.totalItemCount_) {
      value = "*{0}*".format(this.date_.d);
      var items = [];
      for (var item in selection.items_) {
        items.push(item);
      }
      value += items.join("_");
    }
    $.cookie("selection", value, {
      domain: gDomain
    });
    $('#view-options a[href="#selected"]').find("b").html(selection.totalItemCount_);
  },
  init: function(dateController, datePicker, calendar) {
    var self = this;
    this.state_ = this.getState_("default");
    this.cssToggler_ = new WS.LS.CssToggler();
    $('#view-options a[href="#all"]').click(function() {
      ls.handleViewEvent("all");
      NG.GA.trackEvent("LiveScores", "View", "all");
      return false;
    });
    $('#view-options a[href="#live"]').click(function() {
      ls.handleViewEvent("live");
      NG.GA.trackEvent("LiveScores", "View", "live");
      return false;
    });
    $('#view-options a[href="#next"]').click(function() {
      ls.handleViewEvent("next");
      NG.GA.trackEvent("LiveScores", "View", "next");
      return false;
    });
    $('#view-options a[href="#selected"]').click(function() {
      ls.handleViewEvent("selected");
      NG.GA.trackEvent("LiveScores", "View", "selected");
      return false;
    });
    $("#view-sorted dl").listbox().bind("selected", function(e, value) {
      e.preventDefault();
      ls.handleViewEvent(value);
      NG.GA.trackEvent("LiveScores", "View", value);
    });
    $("#clear-selection-button").on("click", function() {
      ls.liveScores_.clearSelection();
      ls.handleViewEvent("all");
      return false;
    });
    NG.Events.add(this, "loadstart", function() {
      dateController.disable();
      datePicker.disable();
    });
    NG.Events.add(this, "loadend", function() {
      dateController.enable();
      datePicker.enable();
    });
    NG.Events.add(calendar, "datechanged", function() {
      self.load(calendar.parameter());
    });
    NG.Events.add(this, "loadstart", function() {
      $("#countdown").html("Loading...").css({
        backgroundColor: "#FFFFCC"
      });
    });
    NG.Events.add(this, "loadend", function() {
      $("#countdown").html("&nbsp;").css({
        backgroundColor: "transparent"
      });
    });
    $("#livescores-wrapper").on("click", ".show-incidents", function(event) {
      self.liveScoresShowIncidentsClicked_(this);
      NG.GA.trackEvent("LiveScores", "Incidents", "Show");
      return false;
    });
    $("#livescores-wrapper").on("click", 'input[type="checkbox"]', function(event) {
      self.liveScoresCheckboxClicked_(this);
    });
    $("#livescores-wrapper").on("click", ".group-name-container", function(event) {
      $(this).blur();
      if ("all" == self.state_.items) {
        self.liveScoresToggleMatchesClicked_(this);
      }
      return false;
    });
    $(".expand-goal-alerts").toggle(function() {
      $(this).addClass("ui-state-active");
      $("#ws-content").removeClass("collapsed");
    }, function() {
      $(this).removeClass("ui-state-active");
      $("#ws-content").addClass("collapsed");
    });
  },
  load: function(date) {
    if (this.isLoading_) {
      return;
    }
    this.isLoading_ = true;
    this.timer_.reset();
    NG.Events.fire(this, "loadstart");
    this.date_ = date;
    this.resetRefreshHistory_();
    var selectionItems;
    var persistentSelection = $.cookie("selection") || "";
    if (0 == persistentSelection.indexOf("*{0}*".format(this.date_.d))) {
      persistentSelection = persistentSelection.substring("*{0}*".format(this.date_.d).length);
      selectionItems = persistentSelection.split("_");
    } else {
      $.cookie("selection", null, {
        domain: gDomain
      });
    }
    if (this.isEverLoaded_) {
      NG.Events.removeGlobal("favoritetournamentsupdate", this.model_.sort, this.model_);
      NG.Events.remove(this.model_, "modelchanged", this.liveScores_.dataChanged);
      NG.Events.remove(this.model_, "modelsorted", this.liveScores_.dataChanged);
      NG.Events.remove(this, "statechanged", this.liveScores_.stateChanged);
      NG.Events.remove(this.model_, "modelchanged", this.scoreUpdates_.dataChanged);
      NG.Events.remove(this, "statechanged", this.scoreUpdates_.stateChanged);
      NG.Events.remove(this.liveScores_, "selectionchanged", this.scoreUpdates_.handleSelectionChanged);
      NG.Events.remove(this.liveScores_, "selectionchanged", this.selectionChanged_);
      NG.Events.remove(this.model_, "modelchanged", this.modelChanged_);
      this.liveScores_.dispose();
      this.scoreUpdates_.dispose();
    }
    this.handleViewEvent(this.state_ ? "all" : "default");
    this.model_ = new WS.LS.Model();
    NG.Events.addGlobal("favoritetournamentsupdate", this.model_.sort, this.model_);
    this.liveScores_ = new WS.LS.LiveScores(this.state_, selectionItems);
    NG.Events.add(this.model_, "modelchanged", this.liveScores_.dataChanged, this.liveScores_);
    NG.Events.add(this.model_, "modelsorted", this.liveScores_.dataChanged, this.liveScores_);
    NG.Events.add(this, "statechanged", this.liveScores_.stateChanged, this.liveScores_);
    this.scoreUpdates_ = new WS.LS.ScoreUpdates(this.state_, selectionItems);
    NG.Events.add(this.model_, "modelchanged", this.scoreUpdates_.dataChanged, this.scoreUpdates_);
    NG.Events.add(this, "statechanged", this.scoreUpdates_.stateChanged, this.scoreUpdates_);
    NG.Events.add(this.liveScores_, "selectionchanged", this.scoreUpdates_.handleSelectionChanged, this.scoreUpdates_);
    NG.Events.add(this.model_, "modelchanged", this.modelChanged_, this);
    NG.Events.add(this.liveScores_, "selectionchanged", this.selectionChanged_, this);
    this.isEverLoaded_ = true;
    DataStore.load("livescores", {
      parameters: this.date_,
      success: this.loadCallback_,
      error: this.errorCallback_,
      dataType: "array"
    }, this);
  },
  resetRefreshHistory_: function() {
    this.version_ = null;
    this.lastCompleteRefreshAt_ = new Date();
  },
  handleViewEvent: function(viewEvent) {
    var state = this.getState_(viewEvent);
    if (state) {
      if (this.applyState1_(state)) {
        NG.async(function() {
          this.applyState2_(state);
          NG.Events.fire(this, "statechanged", this.state_);
        }, this);
      }
    }
  },
  getState_: function(state) {
    var result;
    if ("all" == state) {
      result = {
        items: state,
        cssShow: [".ls-1", ".ls-2", ".ls-4", ".ls-3", ".ls-5", ".ls-6", ".ls-7", ".ls-s"],
        cssHide: []
      };
    } else {
      if ("live" == state) {
        result = {
          items: state,
          cssShow: [".ls-2", ".ls-3", ".ls-6", ".ls-7", ".ls-s"],
          cssHide: [".ls-1", ".ls-4", ".ls-5"]
        };
      } else {
        if ("next" == state) {
          result = {
            items: state,
            cssShow: [".ls-4", ".ls-5", ".ls-6", ".ls-7", ".ls-s"],
            cssHide: [".ls-1", ".ls-2", ".ls-3"]
          };
        } else {
          if ("selected" == state) {
            result = {
              items: state,
              cssShow: [".ls-1", ".ls-2", ".ls-4", ".ls-3", ".ls-5", ".ls-6", ".ls-7"],
              cssHide: []
            };
          } else {
            if ("grouped" == state) {
              result = {
                layout: state,
                cssShow: [],
                cssHide: [".ls-t"]
              };
            } else {
              if ("sorted" == state) {
                result = {
                  layout: state,
                  cssShow: [".ls-t"],
                  cssHide: []
                };
              } else {
                if ("default" == state) {
                  result = {
                    items: "all",
                    layout: "grouped",
                    cssShow: [".ls-1", ".ls-2", ".ls-4", ".ls-3", ".ls-5", ".ls-6", ".ls-7", ".ls-s"],
                    cssHide: []
                  };
                }
              }
            }
          }
        }
      }
    }
    if ("undefined" == typeof result) {
      throw "undefined state";
    }
    result = $.extend({}, this.state_ || {}, result);
    if ("grouped" == result.layout && "all" == result.items) {
      result.cssHide.push(".ls-th");
    } else {
      result.cssShow.push(".ls-th");
    }
    return result;
  },
  applyState1_: function(state) {
    if (!this.state_) {
      this.state_ = state;
      return true;
    }
    var itemStatusChanging = this.state_.items != state.items;
    if (itemStatusChanging) {
      var toSelectedItemState = ("selected" != this.state_.items) && ("selected" == state.items),
          fromSelectedItemState = ("selected" == this.state_.items) && ("selected" != state.items);
      if (toSelectedItemState) {
        $("#clear-selection-button").show();
      } else {
        if (fromSelectedItemState) {
          $("#clear-selection-button").hide();
        }
      }
      $("#view-options a").removeClass("is-selected");
      $('#view-options a[href="#' + state.items + '"]').addClass("is-selected");
    }
    $("#livescores").removeClass(this.state_.items).addClass(state.items);
    this.state_ = $.extend(this.state_ || {}, state);
    return true;
  },
  applyState2_: function(state) {
    if (state.cssHide) {
      this.cssToggler_.hide(this.state_.cssHide);
    }
    if (state.cssShow) {
      this.cssToggler_.show(this.state_.cssShow);
    }
  },
  errorCallback_: function() {
    $("#results-message").show();
    this.setTimer_(this.defaultTimeout_);
    NG.Events.fire(this, "loadend");
    this.isLoading_ = false;
  },
  loadCallback_: function(options, data) {
    var returnCode = (NG.isArray(data[0])) ? data[0][0] : -1;
    if (0 != returnCode) {
      this.errorCallback_();
      return;
    }
    $("#results-message").hide();
    var responseVersion = data[0][1];
    if (null == this.version_) {
      this.version_ = responseVersion;
      this.model_.create(data);
    } else {
      if (this.version_ < responseVersion) {
        this.version_ = responseVersion;
        this.model_.update(data);
      }
    }
    $("#livescores .team-name").fitText({
      width: 150
    });
    NG.Events.fire(this, "loadend");
    this.isLoading_ = false;
    this.setTimer_(data[0][2]);
  },
  refresh_: function() {
    NG.Events.fire(this, "loadstart");
    var freshRefreshRequired = (this.freshLoadTimeout_ * 1000 < (new Date().valueOf() - (this.lastCompleteRefreshAt_ || 0)));
    if (freshRefreshRequired) {
      this.resetRefreshHistory_();
    }
    var options = (this.version_) ? $.extend({}, this.date_, {
      v: this.version_
    }) : this.date_;
    DataStore.load("livescores", {
      parameters: options,
      success: this.loadCallback_,
      error: this.errorCallback_,
      dataType: "array"
    }, this);
  },
  setTimer_: function(timeout) {
    if (timeout <= 0) {
      return;
    }
    this.timer_.set(timeout, function(seconds) {
      if (0 < seconds) {
        $("#countdown").html(this.getFriendlyRemainingTime_(seconds));
      } else {
        this.refresh_();
      }
    }, this);
  },
  getFriendlyRemainingTime_: function(seconds) {
    var result = "";
    if (seconds < 60) {
      result = "Refreshing in {0} seconds...".format(seconds);
    } else {
      if (seconds < 60 * 60) {
        result = "Matches start in {0} minutes".format((seconds / 60) >> 0);
      } else {
        if (seconds < 60 * 60 * 48) {
          result = "Matches start in {0} hours {1} minutes".format((seconds / (60 * 60)) >> 0, ((seconds / 60) % 60) >> 0);
        }
      }
    }
    return result;
  },
  configureSoundAlert: function(playerUrl) {
    NG.Events.addGlobal("soundalertloaded", function() {
      var player = document.getElementById("player-obj-core"),
          levelMap = {
          "5": 25,
          "20": 50,
          "50": 75,
          "100": 100
          };
      NG.Events.addGlobal("scoresupdated", function() {
        player.alert();
      });
      var $volumeToggleButton = $("#volume-toggle-button");

      function volumeOn() {
        $volumeToggleButton.blur();
        $volumeToggleButton.addClass("ui-state-active").find("span").removeClass("ui-icon-volume-off").addClass("ui-icon-volume-on");
        $("#current-level").css("width", levelMap[player.getLevel()] + "%");
        player.toggleMute(false);
        $volumeToggleButton.data("is-on", true);
        return false;
      }
      function volumeOff() {
        $volumeToggleButton.blur();
        $volumeToggleButton.removeClass("ui-state-active").find("span").removeClass("ui-icon-volume-on").addClass("ui-icon-volume-off");
        $("#current-level").css("width", "0");
        player.toggleMute(true);
        $volumeToggleButton.data("is-on", false);
        return false;
      }
      function setVolume(level) {
        $("#current-level").css("width", levelMap[level] + "%");
        player.setLevel(level);
      }
      $volumeToggleButton.on("click", function() {
        if ($volumeToggleButton.data("is-on")) {
          volumeOff();
        } else {
          volumeOn();
        }
      });
      $("#volume-level").on("click", "a", function() {
        $this = $(this).blur();
        if (player.isMuted()) {
          volumeOn();
        }
        setVolume(parseInt($this.text(), 10));
        return false;
      });
      $("#sound-config").on("click", ".themes dd a:nth-child(2)", function(e) {
        $this = $(this);
        player.playClip($this.attr("data-value"));
        return false;
      });
      $("#sound-config").on("click", ".themes dd a:nth-child(3)", function(e) {
        $this = $(this);
        player.setDefaultClip($this.attr("data-value"));
        $this.closest("dl").find("dd").removeClass("selected");
        $this.closest("dd").addClass("selected");
        return false;
      });
      setVolume(player.getLevel());
      if (!player.isMuted()) {
        $("#volume-toggle-button").trigger("click");
      }
      $("#sound-config dd:has(a[data-value=" + player.getActiveClipId() + "])").addClass("selected");
    });
    $("#player-obj").media({
      id: "player-obj-core",
      name: "player-obj-core",
      params: {
        allowScriptAccess: "always"
      },
      width: 1,
      height: 1,
      autoplay: false,
      src: playerUrl,
      caption: false
    });
  }
};
(function(WhoScored) {
  var news = {};
  WhoScored.news = news;
  news.bindNewsListEvents = function() {
    $(".target-language").change(function() {
      var url = $.trim($(this).val());
      if (url != "") {
        window.open(url);
      }
      return false;
    });
    $("#FilterTagId, #FilterLanguage").change(function() {
      $("#filterNews").submit();
    });
    $(".remove-tag").click(function() {
      var linkUrl = $(this).attr("href");
      $(this).parents(".removable-filter-criteria").animate({
        width: 0,
        opacity: 0
      }, function() {
        window.location = linkUrl;
      });
      return false;
    });
    $(".view-more").click(function() {
      toggleNewsAppearance($(this));
      return false;
    });
  };

  function toggleNewsAppearance($el) {
    $el.toggleClass("is-active");
    var $span = $el.find("span");
    $span.toggleClass("ui-icon-triangle-1-e");
    $span.toggleClass("ui-icon-triangle-1-s");
    $el.parents("li").find(".additional-info").slideToggle();
  }
})(WS);
WS = WS || {};
WS.Home = {};
WS.Home.IncidentManager = function() {
  var itemIdPrefix = "i",
      itemIdRegEx = new RegExp("{0}(\\d*)".format(itemIdPrefix)),
      visibleIncidents = {};
  this.toggle = function(button) {
    var itemId = $(button).parents("tr:first").attr("id").match(itemIdRegEx)[1];
    visibleIncidents[itemId] ? hide(itemId) : show(itemId);
  };

  function show(id) {
    var $tr = $("#" + itemIdPrefix + id).addClass("hasDetails");
    var $button = $tr.find(".show-incidents").addClass("ui-state-active").blur().find(".ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
    $('tr[data-match-id="' + itemIdPrefix + id + '"]').show();
    visibleIncidents[id] = true;
  }
  function hide(id) {
    delete visibleIncidents[id];
    var $tr = $("#" + itemIdPrefix + id).removeClass("hasDetails");
    var $button = $tr.find(".show-incidents").removeClass("ui-state-active").blur().find(".ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
    $('tr[data-match-id="' + itemIdPrefix + id + '"]').hide();
  }
};
WS = WS || {};
WS.Comments = function($) {
  return {
    init: function() {
      $(".comments-textarea").each(function() {
        var $this = $(this),
            limit = parseInt($this.attr("maxlength"), 10);
        $(".comments-post-count").html(limit + " characters remaining");
        $this.bind("keyup", function() {
          var value = $this.val();
          if (limit <= $this.val().length) {
            $this.val(value.substr(0, limit));
          }
          $(".comments-post-count").html((limit - $this.val().length) + " characters remaining");
        });
      });
      $("#comments-post-form").removeAttr("onsubmit").submit(function() {
        if (0 == $(".comments-textarea").val().length) {
          $(".comments-post-result").html("Please enter a comment to post.");
          return false;
        }
        var $form = $(this);
        $(".comments-post-result").html("");
        $form.find(".post-comment").attr("disabled", true);
        $form.find(".post-comment").val("Posting..");
        $.ajax({
          type: "POST",
          url: "/Comments/",
          cache: false,
          data: $form.serialize(),
          dataType: "json",
          success: function(json) {
            if (0 == json.ReturnCode) {
              var $newComment = getNewCommentElementFromServerResponseData(json.Data);
              $(".comments-list").prepend($newComment);
              $form.find(".comments-textarea").val("").trigger("keyup");
            } else {
              if (-1 == json.ReturnCode) {
                $(".comments-post-result").html("Please sign in to post comments.");
              } else {
                $(".comments-post-result").html(jsn.oMessage);
              }
            }
          },
          error: function() {
            $(".comments-post-result").html("Error in posting your comment, please try again later.");
          },
          complete: function() {
            $form.find(".post-comment").attr("disabled", false);
            $form.find(".post-comment").val("Post");
          }
        });
        return false;
      });

      function rateComment($comment, ratingCount, rating, callback) {
        var $ratingCount = $comment.find(ratingCount);
        $.ajax({
          type: "POST",
          url: "/Comments/" + $comment.attr("data-comment-id") + "/Rate",
          cache: false,
          data: {
            rating: rating
          },
          dataType: "json",
          success: function(json) {
            if (0 == json.ReturnCode) {
              callback($comment, $ratingCount);
            } else {
              if (-1 == json.ReturnCode) {
                $comment.find(".authentication-message").show();
              }
            }
          },
          error: function(json) {
            $ratingCount.replaceWith('<span class="error">Error in rating this comment, please try again later.</span>');
          }
        });
      }
      $(".comment .rate-positive").click(function(e) {
        e.preventDefault();
        var $this = $(this);
        rateComment($("#comment-" + $(this).attr("data-comment-id")), ".rating-positive", 1, function($comment, $ratingCount) {
          $this.addClass("done");
          $ratingCount.addClass("rated").html("+" + ((parseInt($ratingCount.html(), 10) || 0) + 1));
        });
      });
      $(".comment .rate-negative").click(function(e) {
        e.preventDefault();
        var $this = $(this);
        rateComment($("#comment-" + $(this).attr("data-comment-id")), ".rating-negative", -1, function($comment, $ratingCount) {
          $this.addClass("done");
          $ratingCount.addClass("rated").html((parseInt($ratingCount.html(), 10) || 0) - 1);
        });
      });
      $(".comment .report").click(function(e) {
        e.preventDefault();
        var $this = $(this),
            $comment = $("#comment-" + $(this).attr("data-comment-id"));
        $.ajax({
          type: "POST",
          url: "/Comments/" + $comment.attr("data-comment-id") + "/Report",
          cache: false,
          dataType: "json",
          success: function(json) {
            if (0 == json.ReturnCode) {
              $this.addClass("done").html("Reported");
            } else {
              if (-1 == json.ReturnCode) {
                $comment.find(".authentication-message").show();
              }
            }
          },
          error: function(json) {
            $this.after('<span class="error">Error in reporting this comment, please try again later.</span>');
          }
        });
      });
      $(".expand,.collapse").click(function(e) {
        e.preventDefault();
        var commentToToggleId = $(this).attr("data-comment-id");
        var willShow = $(this).attr("class").indexOf("collapse") < 0;
        var commentToToggleIds = [];
        commentToToggleIds[0] = commentToToggleId;
        var numberOfChildrensToHide = $('li[data-reply-to-id="' + commentToToggleId + '"]').length;
        toggleExpandCollapseButtonHTML(commentToToggleId, willShow, numberOfChildrensToHide);
        toggleCommentContent(commentToToggleId, willShow);
        toggleCommentAndItsChildren(commentToToggleIds, willShow);
      });

      function toggleCommentContent(commentId, willShow) {
        $("#comment-" + commentId + "-content").toggle(willShow);
        $("#comment-" + commentId + "-controls").toggle(willShow);
      }
      function toggleExpandCollapseButtonHTML(commentId, willShow, numberOfChildrensToHide) {
        var $button = $("#comment-" + commentId + "-toggleButton");
        var numberOfCommentsToHide = numberOfChildrensToHide + 1;
        if (!willShow) {
          $button.html(numberOfChildrensToHide ? "[ +" + numberOfCommentsToHide + " ]" : "[ + ]");
          $button.addClass("expand");
          $button.removeClass("collapse");
        } else {
          $button.html("[ - ]");
          $button.removeClass("expand");
          $button.addClass("collapse");
        }
      }
      function toggleCommentAndItsChildren(toggledCommentIds, willShow) {
        for (var i = 0; i < toggledCommentIds.length; i++) {
          $("li[data-reply-to-id=" + toggledCommentIds[i] + "]").each(function() {
            $(this).toggle(willShow);
            var toggledCommentId = $(this).attr("data-comment-id");
            toggledCommentIds[i] = null;
            toggleExpandCollapseButtonHTML(toggledCommentId, willShow);
            toggleCommentContent(toggledCommentId, willShow);
            if (toggledCommentIds.indexOf(toggledCommentId) < 0) {
              toggledCommentIds.push(toggledCommentId);
              toggleCommentAndItsChildren(toggledCommentIds, willShow);
            }
          });
        }
      }
      function getNewCommentElementFromServerResponseData(jsonData) {
        var newCommentHTML = jsonData;
        var $newComment = $(newCommentHTML);
        $newComment.removeClass("striped");
        $newComment.css("background-color", "#FFFDD6");
        $newComment.find("[data-display-for-only-existing]").hide();
        return $newComment;
      }
      $(".reply").click(function(e) {
        e.preventDefault();
        var replyToId = $(this).attr("data-comment-id");
        var parentCommentLiElement = $("#comment-" + replyToId);
        var entityId = $("input[name=entityId]").val();
        var replyElementUniqueId = Date.now();
        var parentCommentDepth = $("#comment-" + replyToId + "-depth").val();
        var maxDepth = 1;
        var marginLeft = parentCommentDepth >= maxDepth ? (maxDepth * 2) : parentCommentDepth + 2;
        var $div = $('<div id="comment-div-reply-to-' + replyElementUniqueId + '" style="margin-left: ' + marginLeft + 'em; position: relative"></div>');
        var $form = $('<form id="comment-form-reply-to-' + replyElementUniqueId + '"></form>');
        $form.append('<input type="hidden" name="replyToId" value="' + replyToId + '">');
        $form.append('<textarea id="comment-' + replyElementUniqueId + '-text" name="commentText" class="comments-textarea" style="width:99%" maxlength="1000"></textarea>');
        $form.append('<input type="hidden" name="entityId" value="' + entityId + '">');
        $form.append('<button id="replyToButton' + replyElementUniqueId + '" type="button" class="post-comment">Post</button>');
        $form.append('<span class="comments-post-result-' + replyElementUniqueId + '"></span>');
        $div.append($form);
        var $closeButton = $('<div id="comment-' + replyElementUniqueId + '-close-button" class="comment-close-button" style="position: absolute; top: 0.5em; right: 0.5em;" > x </div>');
        $div.append($closeButton);
        parentCommentLiElement.append($div);
        $("#comment-" + replyElementUniqueId + "-text").val("@" + $("#comment-" + replyToId + "-author").text() + " ");
        var commentText = $("#comment-" + replyElementUniqueId + "-text").val();
        $("#comment-" + replyElementUniqueId + "-text").focus().val("").val(commentText);
        $("#replyToButton" + replyElementUniqueId).on("click", function(e) {
          $form.find(".post-comment").attr("disabled", true);
          $(this).html("Posting..");
          var postButton = $(this);
          $.ajax({
            type: "POST",
            url: "/Comments/" + replyToId + "/Reply",
            cache: false,
            data: $form.serialize(),
            dataType: "json",
            success: function(json) {
              if (0 == json.ReturnCode) {
                var $newComment = getNewCommentElementFromServerResponseData(json.Data);
                $(".comments-post-result-" + replyElementUniqueId).html("Success");
                $div.prepend($newComment);
                $form.hide();
                $closeButton.hide();
              } else {
                if (-1 == json.ReturnCode) {
                  postButton.html("Post");
                  $(".comments-post-result-" + replyElementUniqueId).html(" Please " + '<a href="/Accounts/Login" target="_blank" style="border-radius: 3px;padding: 3px;font-weight: bold;color: #fff;background-color: #73AC25;">Sign In</a> or ' + '<a href="/Accounts/Register" target="_blank" style="border-radius: 3px;padding: 3px;font-weight: bold;color: #fff;background-color: #ee4500;">Join Us</a> to comment!');
                } else {
                  $(".comments-post-result-" + replyElementUniqueId).html(json.Message);
                }
              }
            },
            error: function() {
              $(".comments-post-result-" + replyElementUniqueId).html("Error in posting your comment, please try again later.");
            },
            complete: function() {
              postButton.attr("disabled", false);
            }
          });
        });
        $("#comment-" + replyElementUniqueId + "-close-button").on("click", function(e) {
          $("#comment-div-reply-to-" + replyElementUniqueId).hide();
        });
      });
    }
  };
}(jQuery);
var origHtmlMargin = parseFloat($("html").css("margin-top"));
$(function() {
  var iPad = navigator.userAgent.match(/iPad/i) != null;
  var iPhone = navigator.userAgent.match(/iPhone/i) != null;
  var safari = navigator.userAgent.match(/Safari/i) != null;
  var appBannerID = $("meta[name=apple-itunes-app]").attr("content");
  if (navigator.userAgent.match("CriOS") && safari) {
    safari = false;
  }
  if (appBannerID != null) {
    appBannerID = /app-id=([0-9]+)/.exec(appBannerID)[1];
    if ((iPad || iPhone) && (!safari)) {
      $.getJSON("http://itunes.apple.com/lookup?id=" + appBannerID + "&callback=?", function(json) {
        if (json != null) {
          var artistName, artistViewUrl, artworkUrl60, averageUserRating, formattedPrice, trackCensoredName, averageUserRatingForCurrentVersion;
          artistName = json.results[0].artistName;
          artistViewUrl = json.results[0].artistViewUrl;
          artworkUrl60 = json.results[0].artworkUrl60;
          averageUserRating = json.results[0].averageUserRating;
          formattedPrice = json.results[0].formattedPrice;
          averageUserRatingForCurrentVersion = json.results[0].averageUserRatingForCurrentVersion;
          trackCensoredName = json.results[0].trackCensoredName;
          if (averageUserRating == null) {
            averageUserRating = 0;
          }
          if (averageUserRatingForCurrentVersion == null) {
            averageUserRatingForCurrentVersion = 0;
          }
          var banner = '<div class="smart-banner">';
          banner += '<a href="#" id="swb-close">X</a>';
          banner += '<img src="' + artworkUrl60 + '" alt="" class="smart-glossy-icon" />';
          banner += '<div id="swb-info"><strong>' + trackCensoredName + "</strong>";
          banner += "<span>" + artistName + "</span>";
          banner += '<span class="rating-static rating-' + averageUserRating.toString().replace(".", "") + '"></span>';
          banner += "<span>" + formattedPrice + "</span></div>";
          banner += '<a href="' + artistViewUrl + '" id="swb-save">VIEW</a></div>';
          $("body").append(banner);
          $("#swb-close").click(function(e) {
            e.preventDefault();
            $(".smart-banner").stop().animate({
              top: "-82px"
            }, 300);
            $("html").animate({
              marginTop: origHtmlMargin
            }, 300);
          });
          $(".smart-banner").stop().animate({
            top: 0
          }, 300);
          $("html").animate({
            marginTop: origHtmlMargin + 78
          }, 300);
        }
      });
    }
  }
});
/*
* jVectorMap version 0.1
*
* Copyright 2011, Kirill Lebedev
* Licensed under the MIT license.
*
*/
(function($) {
  var apiParams = {
    colors: 1,
    values: 1,
    backgroundColor: 1,
    scaleColors: 1,
    normalizeFunction: 1
  };
  var apiEvents = {
    onLabelShow: "labelShow",
    onRegionOver: "regionMouseOver",
    onRegionOut: "regionMouseOut",
    onRegionClick: "regionClick"
  };
  $.fn.vectorMap = function(options) {
    var defaultParams = {
      map: "world_en",
      backgroundColor: "#FFF",
      color: "#AAA",
      hoverColor: "black",
      scaleColors: ["#b6d6ff", "#005ace"],
      normalizeFunction: "linear"
    },
        map;
    if (options === "addMap") {
      WorldMap.maps[arguments[1]] = arguments[2];
    } else {
      if (options === "set" && apiParams[arguments[1]]) {
        this.data("mapObject")["set" + arguments[1].charAt(0).toUpperCase() + arguments[1].substr(1)].apply(this.data("mapObject"), Array.prototype.slice.call(arguments, 2));
      } else {
        $.extend(defaultParams, options);
        defaultParams.container = this;
        this.css({
          position: "relative",
          overflow: "hidden"
        });
        map = new WorldMap(defaultParams);
        this.data("mapObject", map);
        for (var e in apiEvents) {
          if (defaultParams[e]) {
            this.bind(apiEvents[e] + ".jvectormap", defaultParams[e]);
          }
        }
      }
    }
  };
  var VectorCanvas = function(width, height) {
    this.mode = window.SVGAngle ? "svg" : "vml";
    if (this.mode == "svg") {
      this.createSvgNode = function(nodeName) {
        return document.createElementNS(this.svgns, nodeName);
      };
    } else {
      try {
        if (!document.namespaces.rvml) {
          document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
        }
        this.createVmlNode = function(tagName) {
          return document.createElement("<rvml:" + tagName + ' class="rvml">');
        };
      } catch (e) {
        this.createVmlNode = function(tagName) {
          return document.createElement("<" + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
        };
      }
      document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
    }
    if (this.mode == "svg") {
      this.canvas = this.createSvgNode("svg");
    } else {
      this.canvas = this.createVmlNode("group");
      this.canvas.style.position = "absolute";
    }
    this.setSize(width, height);
  };
  VectorCanvas.prototype = {
    svgns: "http://www.w3.org/2000/svg",
    mode: "svg",
    width: 0,
    height: 0,
    canvas: null,
    setSize: function(width, height) {
      if (this.mode == "svg") {
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
      } else {
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.canvas.coordsize = width + " " + height;
        this.canvas.coordorigin = "0 0";
        if (this.rootGroup) {
          var pathes = this.rootGroup.getElementsByTagName("shape");
          for (var i = 0, l = pathes.length; i < l; i++) {
            pathes[i].coordsize = width + " " + height;
            pathes[i].style.width = width + "px";
            pathes[i].style.height = height + "px";
          }
          this.rootGroup.coordsize = width + " " + height;
          this.rootGroup.style.width = width + "px";
          this.rootGroup.style.height = height + "px";
        }
      }
      this.width = width;
      this.height = height;
    },
    createPath: function(config) {
      var node;
      if (this.mode == "svg") {
        node = this.createSvgNode("path");
        node.setAttribute("d", config.path);
        node.setFill = function(color) {
          this.setAttribute("fill", color);
        };
        node.getFill = function(color) {
          return this.getAttribute("fill");
        };
        node.setOpacity = function(opacity) {
          this.setAttribute("fill-opacity", opacity);
        };
      } else {
        node = this.createVmlNode("shape");
        node.coordorigin = "0 0";
        node.coordsize = this.width + " " + this.height;
        node.style.width = this.width + "px";
        node.style.height = this.height + "px";
        node.fillcolor = WorldMap.defaultFillColor;
        node.stroked = false;
        node.path = VectorCanvas.pathSvgToVml(config.path);
        var scale = this.createVmlNode("skew");
        scale.on = true;
        scale.matrix = "0.01,0,0,0.01,0,0";
        scale.offset = "0,0";
        node.appendChild(scale);
        var fill = this.createVmlNode("fill");
        node.appendChild(fill);
        node.setFill = function(color) {
          this.getElementsByTagName("fill")[0].color = color;
        };
        node.getFill = function(color) {
          return this.getElementsByTagName("fill")[0].color;
        };
        node.setOpacity = function(opacity) {
          this.getElementsByTagName("fill")[0].opacity = parseInt(opacity * 100) + "%";
        };
      }
      return node;
    },
    createGroup: function(isRoot) {
      var node;
      if (this.mode == "svg") {
        node = this.createSvgNode("g");
      } else {
        node = this.createVmlNode("group");
        node.style.width = this.width + "px";
        node.style.height = this.height + "px";
        node.style.left = "0px";
        node.style.top = "0px";
        node.coordorigin = "0 0";
        node.coordsize = this.width + " " + this.height;
      }
      if (isRoot) {
        this.rootGroup = node;
      }
      return node;
    },
    applyTransformParams: function(scale, transX, transY) {
      if (this.mode == "svg") {
        this.rootGroup.setAttribute("transform", "scale(" + scale + ") translate(" + transX + ", " + transY + ")");
      } else {
        this.rootGroup.coordorigin = (this.width - transX) + "," + (this.height - transY);
        this.rootGroup.coordsize = this.width / scale + "," + this.height / scale;
      }
    }
  };
  VectorCanvas.pathSvgToVml = function(path) {
    var result = "";
    var cx = 0,
        cy = 0,
        ctrlx, ctrly;
    return path.replace(/([MmLlHhVvCcSs])((?:-?(?:\d+)?(?:\.\d+)?,?\s?)+)/g, function(segment, letter, coords, index) {
      coords = coords.replace(/(\d)-/g, "$1,-").replace(/\s+/g, ",").split(",");
      if (!coords[0]) {
        coords.shift();
      }
      for (var i = 0, l = coords.length; i < l; i++) {
        coords[i] = Math.round(100 * coords[i]);
      }
      switch (letter) {
      case "m":
        cx += coords[0];
        cy += coords[1];
        return "t" + coords.join(",");
        break;
      case "M":
        cx = coords[0];
        cy = coords[1];
        return "m" + coords.join(",");
        break;
      case "l":
        cx += coords[0];
        cy += coords[1];
        return "r" + coords.join(",");
        break;
      case "L":
        cx = coords[0];
        cy = coords[1];
        return "l" + coords.join(",");
        break;
      case "h":
        cx += coords[0];
        return "r" + coords[0] + ",0";
        break;
      case "H":
        cx = coords[0];
        return "l" + cx + "," + cy;
        break;
      case "v":
        cy += coords[0];
        return "r0," + coords[0];
        break;
      case "V":
        cy = coords[0];
        return "l" + cx + "," + cy;
        break;
      case "c":
        ctrlx = cx + coords[coords.length - 4];
        ctrly = cy + coords[coords.length - 3];
        cx += coords[coords.length - 2];
        cy += coords[coords.length - 1];
        return "v" + coords.join(",");
        break;
      case "C":
        ctrlx = coords[coords.length - 4];
        ctrly = coords[coords.length - 3];
        cx = coords[coords.length - 2];
        cy = coords[coords.length - 1];
        return "c" + coords.join(",");
        break;
      case "s":
        coords.unshift(cy - ctrly);
        coords.unshift(cx - ctrlx);
        ctrlx = cx + coords[coords.length - 4];
        ctrly = cy + coords[coords.length - 3];
        cx += coords[coords.length - 2];
        cy += coords[coords.length - 1];
        return "v" + coords.join(",");
        break;
      case "S":
        coords.unshift(cy + cy - ctrly);
        coords.unshift(cx + cx - ctrlx);
        ctrlx = coords[coords.length - 4];
        ctrly = coords[coords.length - 3];
        cx = coords[coords.length - 2];
        cy = coords[coords.length - 1];
        return "c" + coords.join(",");
        break;
      }
      return "";
    }).replace(/z/g, "");
  };
  var WorldMap = function(params) {
    params = params || {};
    var map = this;
    var mapData = WorldMap.maps[params.map];
    this.container = params.container;
    this.pathes = mapData.pathes;
    this.defaultWidth = mapData.width;
    this.defaultHeight = mapData.height;
    this.color = params.color;
    this.hoverColor = params.hoverColor;
    this.setBackgroundColor(params.backgroundColor);
    this.width = params.container.width();
    this.height = params.container.height();
    this.resize();
    $(window).resize(function() {
      map.width = params.container.width();
      map.height = params.container.height();
      map.resize();
      map.canvas.setSize(map.width, map.height);
      map.applyTransform();
    });
    this.canvas = new VectorCanvas(this.width, this.height);
    params.container.append(this.canvas.canvas);
    this.makeDraggable();
    this.rootGroup = this.canvas.createGroup(true);
    this.index = WorldMap.mapIndex;
    this.label = $("<div/>").addClass("jvectormap-label").appendTo($("body"));
    $("<div/>").addClass("jvectormap-zoomin").text("+").appendTo(params.container);
    $("<div/>").addClass("jvectormap-zoomout").html("&#x2212;").appendTo(params.container);
    for (var key in mapData.pathes) {
      var path = this.canvas.createPath({
        path: mapData.pathes[key].path
      });
      path.setFill(this.color);
      path.id = "jvectormap" + map.index + "_" + key;
      map.countries[key] = path;
      $(this.rootGroup).append(path);
    }
    $(params.container).delegate(this.canvas.mode == "svg" ? "path" : "shape", "mouseover mouseout", function(e) {
      var path = e.target,
          code = e.target.id.split("_").pop(),
          labelShowEvent = $.Event("labelShow.jvectormap"),
          regionMouseOverEvent = $.Event("regionMouseOver.jvectormap");
      if (e.type == "mouseover") {
        $(params.container).trigger(regionMouseOverEvent, [code]);
        if (!regionMouseOverEvent.isDefaultPrevented()) {
          if (params.hoverOpacity) {
            path.setOpacity(params.hoverOpacity);
          }
          if (params.hoverColor) {
            path.currentFillColor = path.getFill() + "";
            path.setFill(params.hoverColor);
          }
        }
        if (map.values) {
          var region = map.values[code];
          if (!region) {
            region = {
              RegionCode: code,
              RegionName: map.pathes[code].name
            };
          }
          var regionHtml = WS.LS.Map.View.Region(region, false, true);
          if (regionHtml) {
            map.label.html(regionHtml);
            $(document).triggerHandler("ls-map-tournament-info-updated", map.values[code]);
            $(params.container).trigger(labelShowEvent, [map.label, code]);
            if (!labelShowEvent.isDefaultPrevented()) {
              map.label.show();
              map.labelWidth = map.label.width();
              map.labelHeight = map.label.height();
            }
          }
        }
      } else {
        if (map.values) {
          $(document).trigger("ls-map-tournament-info-updated", map.values["all"]);
          path.setOpacity(1);
          if (path.currentFillColor) {
            path.setFill(path.currentFillColor);
          }
          map.label.html("");
          map.label.hide();
          $(params.container).trigger("regionMouseOut.jvectormap", [code]);
        }
      }
    });
    $(params.container).delegate(this.canvas.mode == "svg" ? "path" : "shape", "click", function(e) {
      var path = e.target;
      var code = e.target.id.split("_").pop();
      $(params.container).trigger("regionClick.jvectormap", [code]);
    });
    params.container.mousemove(function(e) {
      if (map.label.is(":visible")) {
        map.label.css({
          left: e.pageX - 15 - map.labelWidth,
          top: e.pageY - 15 - map.labelHeight
        });
      }
    });
    this.setColors(params.colors);
    this.canvas.canvas.appendChild(this.rootGroup);
    this.applyTransform();
    this.colorScale = new ColorScale(params.scaleColors, params.normalizeFunction, params.valueMin, params.valueMax);
    if (params.values) {
      this.values = params.values;
      this.setValues(params.values);
    }
    this.bindZoomButtons();
    WorldMap.mapIndex++;
  };
  WorldMap.prototype = {
    transX: 0,
    transY: 0,
    scale: 1,
    baseTransX: 0,
    baseTransY: 0,
    baseScale: 1,
    width: 0,
    height: 0,
    countries: {},
    countriesColors: {},
    countriesData: {},
    zoomStep: 1.4,
    zoomMaxStep: 4,
    zoomCurStep: 1,
    setColors: function(key, color) {
      if (typeof key == "string") {
        this.countries[key].setFill(color);
      } else {
        var colors = key;
        for (var code in colors) {
          if (this.countries[code]) {
            this.countries[code].setFill(colors[code]);
          }
        }
      }
    },
    setValues: function(values) {},
    setBackgroundColor: function(backgroundColor) {
      this.container.css("background-color", backgroundColor);
    },
    setScaleColors: function(colors) {
      this.colorScale.setColors(colors);
      if (this.values) {
        this.setValues(this.values);
      }
    },
    setNormalizeFunction: function(f) {
      this.colorScale.setNormalizeFunction(f);
      if (this.values) {
        this.setValues(this.values);
      }
    },
    resize: function() {
      var curBaseScale = this.baseScale;
      if (this.width / this.height > this.defaultWidth / this.defaultHeight) {
        this.baseScale = this.height / this.defaultHeight;
        this.baseTransX = Math.abs(this.width - this.defaultWidth * this.baseScale) / (2 * this.baseScale);
      } else {
        this.baseScale = this.width / this.defaultWidth;
        this.baseTransY = Math.abs(this.height - this.defaultHeight * this.baseScale) / (2 * this.baseScale);
      }
      this.scale *= this.baseScale / curBaseScale;
      this.transX *= this.baseScale / curBaseScale;
      this.transY *= this.baseScale / curBaseScale;
    },
    reset: function() {
      this.countryTitle.reset();
      for (var key in this.countries) {
        this.countries[key].setFill(WorldMap.defaultColor);
      }
      this.scale = this.baseScale;
      this.transX = this.baseTransX;
      this.transY = this.baseTransY;
      this.applyTransform();
    },
    applyTransform: function() {
      var maxTransX, maxTransY, minTransX, maxTransY;
      if (this.defaultWidth * this.scale <= this.width) {
        maxTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
        minTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
      } else {
        maxTransX = 0;
        minTransX = (this.width - this.defaultWidth * this.scale) / this.scale;
      }
      if (this.defaultHeight * this.scale <= this.height) {
        maxTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
        minTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
      } else {
        maxTransY = 0;
        minTransY = (this.height - this.defaultHeight * this.scale) / this.scale;
      }
      if (this.transY > maxTransY) {
        this.transY = maxTransY;
      } else {
        if (this.transY < minTransY) {
          this.transY = minTransY;
        }
      }
      if (this.transX > maxTransX) {
        this.transX = maxTransX;
      } else {
        if (this.transX < minTransX) {
          this.transX = minTransX;
        }
      }
      this.canvas.applyTransformParams(this.scale, this.transX, this.transY);
    },
    makeDraggable: function() {
      var mouseDown = false;
      var oldPageX, oldPageY;
      var self = this;
      this.container.mousemove(function(e) {
        if (mouseDown) {
          var curTransX = self.transX;
          var curTransY = self.transY;
          self.transX -= (oldPageX - e.pageX) / self.scale;
          self.transY -= (oldPageY - e.pageY) / self.scale;
          self.applyTransform();
          oldPageX = e.pageX;
          oldPageY = e.pageY;
        }
        return false;
      }).mousedown(function(e) {
        mouseDown = true;
        oldPageX = e.pageX;
        oldPageY = e.pageY;
        return false;
      }).mouseup(function() {
        mouseDown = false;
        return false;
      });
    },
    bindZoomButtons: function() {
      var map = this;
      var sliderDelta = ($("#zoom").innerHeight() - 6 * 2 - 15 * 2 - 3 * 2 - 7 - 6) / (this.zoomMaxStep - this.zoomCurStep);
      this.container.find(".jvectormap-zoomin").click(function() {
        if (map.zoomCurStep < map.zoomMaxStep) {
          var curTransX = map.transX;
          var curTransY = map.transY;
          var curScale = map.scale;
          map.transX -= (map.width / map.scale - map.width / (map.scale * map.zoomStep)) / 2;
          map.transY -= (map.height / map.scale - map.height / (map.scale * map.zoomStep)) / 2;
          map.setScale(map.scale * map.zoomStep);
          map.zoomCurStep++;
          $("#zoomSlider").css("top", parseInt($("#zoomSlider").css("top")) - sliderDelta);
        }
      });
      this.container.find(".jvectormap-zoomout").click(function() {
        if (map.zoomCurStep > 1) {
          var curTransX = map.transX;
          var curTransY = map.transY;
          var curScale = map.scale;
          map.transX += (map.width / (map.scale / map.zoomStep) - map.width / map.scale) / 2;
          map.transY += (map.height / (map.scale / map.zoomStep) - map.height / map.scale) / 2;
          map.setScale(map.scale / map.zoomStep);
          map.zoomCurStep--;
          $("#zoomSlider").css("top", parseInt($("#zoomSlider").css("top")) + sliderDelta);
        }
      });
    },
    setScale: function(scale) {
      this.scale = scale;
      this.applyTransform();
    },
    getCountryPath: function(cc) {
      return $("#" + cc)[0];
    }
  };
  WorldMap.xlink = "http://www.w3.org/1999/xlink";
  WorldMap.mapIndex = 1;
  WorldMap.maps = {};
  var ColorScale = function(colors, normalizeFunction, minValue, maxValue) {
    if (colors) {
      this.setColors(colors);
    }
    if (normalizeFunction) {
      this.setNormalizeFunction(normalizeFunction);
    }
    if (minValue) {
      this.setMin(minValue);
    }
    if (minValue) {
      this.setMax(maxValue);
    }
  };
  ColorScale.prototype = {
    colors: [],
    setMin: function(min) {
      this.clearMinValue = min;
      if (typeof this.normalize === "function") {
        this.minValue = this.normalize(min);
      } else {
        this.minValue = min;
      }
    },
    setMax: function(max) {
      this.clearMaxValue = max;
      if (typeof this.normalize === "function") {
        this.maxValue = this.normalize(max);
      } else {
        this.maxValue = max;
      }
    },
    setColors: function(colors) {
      for (var i = 0; i < colors.length; i++) {
        colors[i] = ColorScale.rgbToArray(colors[i]);
      }
      this.colors = colors;
    },
    setNormalizeFunction: function(f) {
      if (f === "polynomial") {
        this.normalize = function(value) {
          return Math.pow(value, 0.2);
        };
      } else {
        if (f === "linear") {
          delete this.normalize;
        } else {
          this.normalize = f;
        }
      }
      this.setMin(this.clearMinValue);
      this.setMax(this.clearMaxValue);
    },
    getColor: function(value) {
      if (typeof this.normalize === "function") {
        value = this.normalize(value);
      }
      var lengthes = [];
      var fullLength = 0;
      var l;
      for (var i = 0; i < this.colors.length - 1; i++) {
        l = this.vectorLength(this.vectorSubtract(this.colors[i + 1], this.colors[i]));
        lengthes.push(l);
        fullLength += l;
      }
      var c = (this.maxValue - this.minValue) / fullLength;
      for (i = 0; i < lengthes.length; i++) {
        lengthes[i] *= c;
      }
      i = 0;
      value -= this.minValue;
      while (value - lengthes[i] >= 0) {
        value -= lengthes[i];
        i++;
      }
      var color;
      if (i == this.colors.length - 1) {
        color = this.vectorToNum(this.colors[i]).toString(16);
      } else {
        color = (this.vectorToNum(this.vectorAdd(this.colors[i], this.vectorMult(this.vectorSubtract(this.colors[i + 1], this.colors[i]), (value) / (lengthes[i]))))).toString(16);
      }
      while (color.length < 6) {
        color = "0" + color;
      }
      return "#" + color;
    },
    vectorToNum: function(vector) {
      var num = 0;
      for (var i = 0; i < vector.length; i++) {
        num += Math.round(vector[i]) * Math.pow(256, vector.length - i - 1);
      }
      return num;
    },
    vectorSubtract: function(vector1, vector2) {
      var vector = [];
      for (var i = 0; i < vector1.length; i++) {
        vector[i] = vector1[i] - vector2[i];
      }
      return vector;
    },
    vectorAdd: function(vector1, vector2) {
      var vector = [];
      for (var i = 0; i < vector1.length; i++) {
        vector[i] = vector1[i] + vector2[i];
      }
      return vector;
    },
    vectorMult: function(vector, num) {
      var result = [];
      for (var i = 0; i < vector.length; i++) {
        result[i] = vector[i] * num;
      }
      return result;
    },
    vectorLength: function(vector) {
      var result = 0;
      for (var i = 0; i < vector.length; i++) {
        result += vector[i] * vector[i];
      }
      return Math.sqrt(result);
    }
  };
  ColorScale.arrayToRgb = function(ar) {
    var rgb = "#";
    var d;
    for (var i = 0; i < ar.length; i++) {
      d = ar[i].toString(16);
      rgb += d.length == 1 ? "0" + d : d;
    }
    return rgb;
  };
  ColorScale.rgbToArray = function(rgb) {
    rgb = rgb.substr(1);
    return [parseInt(rgb.substr(0, 2), 16), parseInt(rgb.substr(2, 2), 16), parseInt(rgb.substr(4, 2), 16)];
  };
})(jQuery);
$.fn.vectorMap("addMap", "world_en", {
  "width": 950,
  "height": 550,
  "pathes": {
    "id": {
      "path": "M781.68,324.4l-2.31,8.68l-12.53,4.23l-3.75-4.4l-1.82,0.5l3.4,13.12l5.09,0.57l6.79,2.57v2.57l3.11-0.57l4.53-6.27v-5.13l2.55-5.13l2.83,0.57l-3.4-7.13l-0.52-4.59L781.68,324.4L781.68,324.4M722.48,317.57l-0.28,2.28l6.79,11.41h1.98l14.15,23.67l5.66,0.57l2.83-8.27l-4.53-2.85l-0.85-4.56L722.48,317.57L722.48,317.57M789.53,349.11l2.26,2.77l-1.47,4.16v0.79h3.34l1.18-10.4l1.08,0.3l1.96,9.5l1.87,0.5l1.77-4.06l-1.77-6.14l-1.47-2.67l4.62-3.37l-1.08-1.49l-4.42,2.87h-1.18l-2.16-3.17l0.69-1.39l3.64-1.78l5.5,1.68l1.67-0.1l4.13-3.86l-1.67-1.68l-3.83,2.97h-2.46l-3.73-1.78l-2.65,0.1l-2.95,4.75l-1.87,8.22L789.53,349.11L789.53,349.11M814.19,330.5l-1.87,4.55l2.95,3.86h0.98l1.28-2.57l0.69-0.89l-1.28-1.39l-1.87-0.69L814.19,330.5L814.19,330.5M819.99,345.45l-4.03,0.89l-1.18,1.29l0.98,1.68l2.65-0.99l1.67-0.99l2.46,1.98l1.08-0.89l-1.96-2.38L819.99,345.45L819.99,345.45M753.17,358.32l-2.75,1.88l0.59,1.58l8.75,1.98l4.42,0.79l1.87,1.98l5.01,0.4l2.36,1.98l2.16-0.5l1.97-1.78l-3.64-1.68l-3.14-2.67l-8.16-1.98L753.17,358.32L753.17,358.32M781.77,366.93l-2.16,1.19l1.28,1.39l3.14-1.19L781.77,366.93L781.77,366.93M785.5,366.04l0.39,1.88l2.26,0.59l0.88-1.09l-0.98-1.49L785.5,366.04L785.5,366.04M790.91,370.99l-2.75,0.4l2.46,2.08h1.96L790.91,370.99L790.91,370.99M791.69,367.72l-0.59,1.19l4.42,0.69l3.44-1.98l-1.96-0.59l-3.14,0.89l-1.18-0.99L791.69,367.72L791.69,367.72M831.93,339.34l-4.17,0.47l-2.68,1.96l1.11,2.24l4.54,0.84v0.84l-2.87,2.33l1.39,4.85l1.39,0.09l1.2-4.76h2.22l0.93,4.66l10.83,8.96l0.28,7l3.7,4.01l1.67-0.09l0.37-24.72l-6.29-4.38l-5.93,4.01l-2.13,1.31l-3.52-2.24l-0.09-7.09L831.93,339.34L831.93,339.34z",
      "name": "Indonesia"
    },
    "pg": {
      "path": "M852.76,348.29l-0.37,24.44l3.52-0.19l4.63-5.41l3.89,0.19l2.5,2.24l0.83,6.9l7.96,4.2l2.04-0.75v-2.52l-6.39-5.32l-3.15-7.28l2.5-1.21l-1.85-4.01l-3.7-0.09l-0.93-4.29l-9.81-6.62L852.76,348.29L852.76,348.29M880.48,349l-0.88,1.25l4.81,4.26l0.66,2.5l1.31-0.15l0.15-2.57l-1.46-1.32L880.48,349L880.48,349M882.89,355.03l-0.95,0.22l-0.58,2.57l-1.82,1.18l-5.47,0.96l0.22,2.06l5.76-0.29l3.65-2.28l-0.22-3.97L882.89,355.03L882.89,355.03M889.38,359.51l1.24,3.45l2.19,2.13l0.66-0.59l-0.22-2.28l-2.48-3.01L889.38,359.51L889.38,359.51z",
      "name": "Papua New Guinea"
    },
    "mx": {
      "path": "M137.49,225.43l4.83,15.21l-2.25,1.26l0.25,3.02l4.25,3.27v6.05l5.25,5.04l-2.25-14.86l-3-9.83l0.75-6.8l2.5,0.25l1,2.27l-1,5.79l13,25.44v9.07l10.5,12.34l11.5,5.29l4.75-2.77l6.75,5.54l4-4.03l-1.75-4.54l5.75-1.76l1.75,1.01l1.75-1.76h2.75l5-8.82l-2.5-2.27l-9.75,2.27l-2.25,6.55l-5.75,1.01l-6.75-2.77l-3-9.57l2.27-12.07l-4.64-2.89l-2.21-11.59l-1.85-0.79l-3.38,3.43l-3.88-2.07l-1.52-7.73l-15.37-1.61l-7.94-5.97L137.49,225.43L137.49,225.43z",
      "name": "Mexico"
    },
    "ee": {
      "path": "M517.77,143.66l-5.6-0.2l-3.55,2.17l-0.05,1.61l2.3,2.17l7.15,1.21L517.77,143.66L517.77,143.66M506.76,147.64l-1.55-0.05l-0.9,0.91l0.65,0.96l1.55,0.1l0.8-1.16L506.76,147.64L506.76,147.64z",
      "name": "Estonia"
    },
    "dz": {
      "path": "M473.88,227.49l-4.08-1.37l-16.98,3.19l-3.7,2.81l2.26,11.67l-6.75,0.27l-4.06,6.53l-9.67,2.32l0.03,4.75l31.85,24.35l5.43,0.46l18.11-14.15l-1.81-2.28l-3.4-0.46l-2.04-3.42v-14.15l-1.36-1.37l0.23-3.65l-3.62-3.65l-0.45-3.88l1.58-1.14l-0.68-4.11L473.88,227.49L473.88,227.49z",
      "name": "Algeria"
    },
    "ma": {
      "path": "M448.29,232.28h-11.55l-2.26,5.02l-5.21,2.51l-4.3,11.64l-8.38,5.02l-11.77,19.39l11.55-0.23l0.45-5.7h2.94v-7.76h10.19l0.23-10.04l9.74-2.28l4.08-6.62l6.34-0.23L448.29,232.28L448.29,232.28z",
      "name": "Morocco"
    },
    "mr": {
      "path": "M404.9,276.66l2.18,2.85l-0.45,12.32l3.17-2.28l2.26-0.46l3.17,1.14l3.62,5.02l3.4-2.28l16.53-0.23l-4.08-27.61l4.38-0.02l-8.16-6.25l0.01,4.06l-10.33,0.01l-0.05,7.75l-2.97-0.01l-0.38,5.72L404.9,276.66L404.9,276.66z",
      "name": "Mauritania"
    },
    "sn": {
      "path": "M412.03,289.84L410.12,290.31L406.18,293.18L405.28,294.78L405,296.37L406.43,297.40L411.28,297.34L414.40,296.5L414.75,298.03L414.46,300.06L414.53,300.09L406.78,300.21L408.03,303.21L408.71,301.37L418,302.15L418.06,302.21L419.03,302.25L422,302.37L422.12,300.62L418.53,296.31L414.53,290.87L412.03,289.84z",
      "name": "Senegal"
    },
    "gm": {
      "path": "M406.89,298.34l-0.13,1.11l6.92-0.1l0.35-1.03l-0.15-1.04l-1.99,0.81L406.89,298.34L406.89,298.34z",
      "name": "Gambia"
    },
    "gw": {
      "path": "M408.6,304.53l1.4,2.77l3.93-3.38l0.04-1.04l-4.63-0.67L408.6,304.53L408.6,304.53z",
      "name": "Guinea-Bissau"
    },
    "gn": {
      "path": "M410.42,307.94l3.04,4.68l3.96-3.44l4.06-0.18l3.38,4.49l2.87,1.89l1.08-2.1l0.96-0.54l-0.07-4.62l-1.91-5.48l-5.86,0.65l-7.25-0.58l-0.04,1.86L410.42,307.94L410.42,307.94z",
      "name": "Guinea"
    },
    "sl": {
      "path": "M413.93,313.13l5.65,5.46l4.03-4.89l-2.52-3.95l-3.47,0.35L413.93,313.13L413.93,313.13z",
      "name": "Sierra Leone"
    },
    "lr": {
      "path": "M420.17,319.19l10.98,7.34l-0.26-5.56l-3.32-3.91l-3.24-2.87L420.17,319.19L420.17,319.19z",
      "name": "Liberia"
    },
    "ci": {
      "path": "M432.07,326.75l4.28-3.03l5.32-0.93l5.43,1.17l-2.77-4.19l-0.81-2.56l0.81-7.57l-4.85,0.23l-2.2-2.1l-4.62,0.12l-2.2,0.35l0.23,5.12l-1.16,0.47l-1.39,2.56l3.58,4.19L432.07,326.75L432.07,326.75z",
      "name": "Cote d'Ivoire"
    },
    "ml": {
      "path": "M419.46,295.84l3.08-2.11l17.12-0.1l-3.96-27.54l4.52-0.13l21.87,16.69l2.94,0.42l-1.11,9.28l-13.75,1.25l-10.61,7.92l-1.93,5.42l-7.37,0.31l-1.88-5.41l-5.65,0.4l0.22-1.77L419.46,295.84L419.46,295.84z",
      "name": "Mali"
    },
    "bf": {
      "path": "M450.59,294.28l3.64-0.29l5.97,8.44l-5.54,4.18l-4.01-1.03l-5.39,0.07l-0.87,3.16l-4.52,0.22l-1.24-1.69l1.6-5.14L450.59,294.28L450.59,294.28z",
      "name": "Burkina Faso"
    },
    "ne": {
      "path": "M460.89,302l2.55-0.06l2.3-3.45l3.86-0.69l4.11,2.51l8.77,0.25l6.78-2.76l2.55-2.19l0.19-2.88l4.73-4.77l1.25-10.53l-3.11-6.52l-7.96-1.94l-18.42,14.36l-2.61-0.25l-1.12,9.97l-9.4,0.94L460.89,302L460.89,302z",
      "name": "Niger"
    },
    "gh": {
      "path": "M444.34,317.05l1.12,2.63l2.92,4.58l1.62-0.06l4.42-2.51l-0.31-14.29l-3.42-1l-4.79,0.13L444.34,317.05L444.34,317.05z",
      "name": "Ghana"
    },
    "tg": {
      "path": "M455.22,321.25l2.68-1.57l-0.06-10.35l-1.74-2.82l-1.12,0.94L455.22,321.25L455.22,321.25z",
      "name": "Togo"
    },
    "bj": {
      "path": "M458.71,319.49h2.12l0.12-6.02l2.68-3.89l-0.12-6.77l-2.43-0.06l-4.17,3.26l1.74,3.32L458.71,319.49L458.71,319.49z",
      "name": "Benin"
    },
    "ng": {
      "path": "M461.57,319.37l3.92,0.19l4.73,5.27l2.3,0.63l1.8-0.88l2.74-0.38l0.93-3.82l3.73-2.45l4.04-0.19l7.4-13.61l-0.12-3.07l-3.42-2.63l-6.84,3.01l-9.15-0.13l-4.36-2.76l-3.11,0.69l-1.62,2.82l-0.12,7.96l-2.61,3.7L461.57,319.37L461.57,319.37z",
      "name": "Nigeria"
    },
    "tn": {
      "path": "M474.91,227.33l5.53-2.23l1.82,1.18l0.07,1.44l-0.85,1.11l0.13,1.97l0.85,0.46v3.54l-0.98,1.64l0.13,1.05l3.71,1.31l-2.99,4.65l-1.17-0.07l-0.2,3.74l-1.3,0.2l-1.11-0.98l0.26-3.8l-3.64-3.54l-0.46-3.08l1.76-1.38L474.91,227.33L474.91,227.33z",
      "name": "Tunisia"
    },
    "ly": {
      "path": "M480.05,248.03l1.56-0.26l0.46-3.6h0.78l3.19-5.24l7.87,2.29l2.15,3.34l7.74,3.54l4.03-1.7l-0.39-1.7l-1.76-1.7l0.2-1.18l2.86-2.42h5.66l2.15,2.88l4.55,0.66l0.59,36.89l-3.38-0.13l-20.42-10.62l-2.21,1.25l-8.39-2.1l-2.28-3.01l-3.32-0.46l-1.69-3.01L480.05,248.03L480.05,248.03z",
      "name": "Libya"
    },
    "eg": {
      "path": "M521.93,243.06l2.67,0.07l5.2,1.44l2.47,0.07l3.06-2.56h1.43l2.6,1.44h3.29l0.59-0.04l2.08,5.98l0.59,1.93l0.55,2.89l-0.98,0.72l-1.69-0.85l-1.95-6.36l-1.76-0.13l-0.13,2.16l1.17,3.74l9.37,11.6l0.2,4.98l-2.73,3.15L522.32,273L521.93,243.06L521.93,243.06z",
      "name": "Egypt"
    },
    "td": {
      "path": "M492.79,296l0.13-2.95l4.74-4.61l1.27-11.32l-3.16-6.04l2.21-1.13l21.4,11.15l-0.13,10.94l-3.77,3.21v5.64l2.47,4.78h-4.36l-7.22,7.14l-0.19,2.16l-5.33-0.07l-0.07,0.98l-3.04-0.4l-2.08-3.93l-1.56-0.77l0.2-1.2l1.96-1.5v-7.02l-2.71-0.42l-3.27-2.43L492.79,296L492.79,296L492.79,296z",
      "name": "Chad"
    },
    "sd": {
      "path": "M520.15,292.43l0.18-11.83l2.46,0.07l-0.28-6.57l25.8,0.23l3.69-3.72l7.96,12.73l-4.36,5.14v7.85l-6.86,14.75l-2.36,1.04l0.75,4.11h2.94l3.99,5.79l-3.2,0.41l-0.82,1.49l-0.08,2.15l-9.6-0.17l-0.98-1.49l-6.71-0.38l-12.32-12.68l1.23-0.74l0.33-2.98l-2.95-1.74l-2.69-5.31l0.15-4.94L520.15,292.43L520.15,292.43z",
      "name": "Sudan"
    },
    "cm": {
      "path": "M477.82,324.28l3.22,2.96l-0.23,4.58l17.66-0.41l1.44-1.62l-5.06-5.45l-0.75-1.97l3.22-6.03l-2.19-4l-1.84-0.99v-2.03l2.13-1.39l0.12-6.32l-1.69-0.19l-0.03,3.32l-7.42,13.85l-4.54,0.23l-3.11,2.14L477.82,324.28L477.82,324.28z",
      "name": "Cameroon"
    },
    "er": {
      "path": "M556.71,294.7l-0.25-5.89l3.96-4.62l1.07,0.82l1.95,6.52l9.36,6.97l-1.7,2.09l-6.85-5.89H556.71L556.71,294.7z",
      "name": "Eritrea"
    },
    "dj": {
      "path": "M571.48,301.54l-0.57,3.36l3.96-0.06l0.06-4.94l-1.45-0.89L571.48,301.54L571.48,301.54z",
      "name": "Djibouti"
    },
    "et": {
      "path": "M549.49,311.76l7.28-16.2l7.23,0.04l6.41,5.57l-0.45,4.59h4.97l0.51,2.76l8.04,4.81l4.96,0.25l-9.43,10.13l-12.95,3.99h-3.21l-5.72-4.88l-2.26-0.95l-4.38-6.45l-2.89,0.04l-0.34-2.96L549.49,311.76L549.49,311.76z",
      "name": "Ethiopia"
    },
    "so": {
      "path": "M575.74,305.04l4.08,2.78l1.21-0.06l10.13-3.48l1.15,3.71l-0.81,3.13l-2.19,1.74l-5.47-0.35l-7.83-4.81L575.74,305.04L575.74,305.04M591.97,304.05l4.37-1.68l1.55,0.93l-0.17,3.88l-4.03,11.48l-21.81,23.36l-2.53-1.74l-0.17-9.86l3.28-3.77l6.96-2.15l10.21-10.78l2.67-2.38l0.75-3.48L591.97,304.05L591.97,304.05z",
      "name": "Somalia"
    },
    "ye": {
      "path": "M599.62,299.65l2.13,2.38l2.88-1.74l1.04-0.35l-1.32-1.28l-2.53,0.75L599.62,299.65L599.62,299.65M571.99,289.23l1.44,4.28v4.18l3.46,3.14l24.38-9.93l0.23-2.73l-3.91-7.02l-9.81,3.13l-5.63,5.54l-6.53-3.86L571.99,289.23L571.99,289.23z",
      "name": "Yemen"
    },
    "cf": {
      "path": "M495.66,324.05l4.66,5.04l1.84-2.38l2.93,0.12l0.63-2.32l2.88-1.8l5.98,4.12l3.45-3.42l13.39,0.59L519,311.18l1.67-1.04l0.23-2.26l-2.82-1.33h-4.14l-6.67,6.61l-0.23,2.72l-5.29-0.17l-0.17,1.16l-3.45-0.35l-3.11,5.91L495.66,324.05L495.66,324.05z",
      "name": "Central African Republic"
    },
    "st": {
      "path": "M470.74,337.15l1.15-0.58l0.86,0.7l-0.86,1.33l-1.04-0.41L470.74,337.15L470.74,337.15M473.05,333.5l1.73-0.29l0.58,1.1l-0.86,0.93l-0.86-0.12L473.05,333.5L473.05,333.5z",
      "name": "Sao Tome and Principe"
    },
    "gq": {
      "path": "M476.84,327.41l-0.46,1.97l1.38,0.75l1.32-0.99l-0.46-2.03L476.84,327.41L476.84,327.41M480.99,332.69l-0.06,1.39l4.54,0.23l-0.06-1.57L480.99,332.69L480.99,332.69z",
      "name": "Equatorial Guinea"
    },
    "ga": {
      "path": "M486.39,332.63l-0.12,2.49l-5.64-0.12l-3.45,6.67l8.11,8.87l2.01-1.68l-0.06-1.74l-1.38-0.64v-1.22l3.11-1.97l2.76,2.09l3.05,0.06l-0.06-10.49l-4.83-0.23l-0.06-2.2L486.39,332.63L486.39,332.63z",
      "name": "Gabon"
    },
    "cg": {
      "path": "M491,332.52l-0.06,1.45l4.78,0.12l0.17,12.41l-4.37-0.12l-2.53-1.97l-1.96,1.1l-0.09,0.55l1.01,0.49l0.29,2.55l-2.7,2.32l0.58,1.22l2.99-2.32h1.44l0.46,1.39l1.9,0.81l6.1-5.16l-0.12-3.77l1.27-3.07l3.91-2.9l1.05-9.81l-2.78,0.01l-3.22,4.41L491,332.52L491,332.52z",
      "name": "Congo"
    },
    "ao": {
      "path": "M486.55,353.23l1.74,2.26l2.25-2.13l-0.66-2.21l-0.56-0.04L486.55,353.23L486.55,353.23M488.62,356.71l3.41,12.73l-0.08,4.02l-4.99,5.36l-0.75,8.71l19.2,0.17l6.24,2.26l5.15-0.67l-3-3.76l0.01-10.74l5.9-0.25v-4.19l-4.79-0.2l-0.96-9.92l-2.02,0.03l-1.09-0.98l-1.19,0.06l-1.58,3.06H502l-1.41-1.42l0.42-2.01l-1.66-2.43L488.62,356.71L488.62,356.71z",
      "name": "Angola"
    },
    "cd": {
      "path": "M489.38,355.71l10.31-0.18l2.09,2.97l-0.08,2.19l0.77,0.7h5.12l1.47-2.89h2.09l0.85,0.86l2.87-0.08l0.85,10.08l4.96,0.16v0.78l13.33,6.01l0.62,1.17h2.79l-0.31-4.22l-5.04-2.42l0.31-3.2l2.17-5.08l4.96-0.16l-4.26-14.14l0.08-6.01l6.74-10.54l0.08-1.48l-1.01-0.55l0.04-2.86l-1.23-0.11l-1.24-1.58l-20.35-0.92l-3.73,3.63l-6.11-4.02l-2.15,1.32l-1.56,13.13l-3.86,2.98l-1.16,2.64l0.21,3.91l-6.96,5.69l-1.85-0.84l0.25,1.09L489.38,355.71L489.38,355.71z",
      "name": "Congo"
    },
    "rw": {
      "path": "M537.82,339.9l2.81,2.59l-0.12,2.77l-4.36,0.09v-3.06L537.82,339.9L537.82,339.9z",
      "name": "Rwanda"
    },
    "bi": {
      "path": "M536.21,346.21l4.27-0.09l-1.11,3.74l-1.08,0.94h-1.32l-0.94-2.53L536.21,346.21L536.21,346.21z",
      "name": "Burundi"
    },
    "ug": {
      "path": "M538.3,339.09l3.03,2.84l1.9-1.21l5.14-0.84l0.88,0.09l0.33-1.95l2.9-6.1l-2.44-5.08l-7.91,0.05l-0.05,2.09l1.06,1.02l-0.16,2.09L538.3,339.09L538.3,339.09z",
      "name": "Uganda"
    },
    "ke": {
      "path": "M550.83,326.52l2.66,5.19l-3.19,6.69l-0.42,2.03l15.93,9.85l4.94-7.76l-2.5-2.03l-0.05-10.22l3.13-3.42l-4.99,1.66l-3.77,0.05l-5.9-4.98l-1.86-0.8l-3.45,0.32l-0.61,1.02L550.83,326.52L550.83,326.52z",
      "name": "Kenya"
    },
    "tz": {
      "path": "M550.57,371.42l17.47-2.14l-3.93-7.6l-0.21-7.28l1.27-3.48l-16.62-10.44l-5.21,0.86l-1.81,1.34l-0.16,3.05l-1.17,4.23l-1.22,1.45l-1.75,0.16l3.35,11.61l5.47,2.57l3.77,0.11L550.57,371.42L550.57,371.42z",
      "name": "Tanzania"
    },
    "zm": {
      "path": "M514.55,384.7l3.17,4.4l4.91,0.3l1.74,0.96l5.14,0.06l4.43-6.21l12.38-5.54l1.08-4.88l-1.44-6.99l-6.46-3.68l-4.31,0.3l-2.15,4.76l0.06,2.17l5.08,2.47l0.3,5.37l-4.37,0.24l-1.08-1.81l-12.14-5.18l-0.36,3.98l-5.74,0.18L514.55,384.7L514.55,384.7z",
      "name": "Zambia"
    },
    "mw": {
      "path": "M547.16,379.4l3.11,3.25l-0.06,4.16l0.6,1.75l4.13-4.46l-0.48-5.67l-2.21-1.69l-1.97-9.95l-3.41-0.12l1.55,7.17L547.16,379.4L547.16,379.4z",
      "name": "Malawi"
    },
    "mz": {
      "path": "M541.17,413.28l2.69,2.23l6.34-3.86l1.02-5.73v-9.46l10.17-8.32l1.74,0.06l6.16-5.91l-0.96-12.18L552,372.17l0.48,3.68l2.81,2.17l0.66,6.63l-5.5,5.37l-1.32-3.01l0.24-3.98l-3.17-3.44l-7.78,3.62l7.24,3.68l0.24,10.73l-4.79,7.11L541.17,413.28L541.17,413.28z",
      "name": "Mozambique"
    },
    "zw": {
      "path": "M524.66,392.3l8.97,10.13l6.88,1.75l4.61-7.23l-0.36-9.58l-7.48-3.86l-2.81,1.27l-4.19,6.39l-5.8-0.06L524.66,392.3L524.66,392.3z",
      "name": "Zimbabwe"
    },
    "na": {
      "path": "M496.55,421.96l3.35,0.24l1.97,1.99l4.67,0.06l1.14-13.26v-8.68l2.99-0.6l1.14-9.1l7.6-0.24l2.69-2.23l-4.55-0.18l-6.16,0.84l-6.64-2.41h-18.66l0.48,5.3l6.22,9.16l-1.08,4.7l0.06,2.47L496.55,421.96L496.55,421.96z",
      "name": "Namibia"
    },
    "bw": {
      "path": "M508.51,411.23l2.15,0.66l-0.3,6.15l2.21,0.3l5.08-4.58l6.1,0.66l1.62-4.1l7.72-7.05l-9.27-10.67l-0.12-1.75l-1.02-0.3l-2.81,2.59l-7.3,0.18l-1.02,9.1l-2.87,0.66L508.51,411.23L508.51,411.23z",
      "name": "Botswana"
    },
    "sz": {
      "path": "M540.87,414l-2.51,0.42l-1.08,2.95l1.92,1.75h2.33l1.97-2.83L540.87,414L540.87,414z",
      "name": "Swaziland"
    },
    "ls": {
      "path": "M527.41,425.39l3.05-2.35l1.44,0.06l1.74,2.17l-0.18,2.17l-2.93,1.08v0.84l-3.23-0.18l-0.78-2.35L527.41,425.39L527.41,425.39z",
      "name": "Lesotho"
    },
    "za": {
      "path": "M534.16,403.63l-7.9,7.3l-1.88,4.51l-6.26-0.78l-5.21,4.63l-3.46-0.34l0.28-6.4l-1.23-0.43l-0.86,13.09l-6.14-0.06l-1.85-2.18l-2.71-0.03l2.47,7.09l4.41,4.17l-3.15,3.67l2.04,4.6l4.72,1.8l3.76-3.2l10.77,0.06l0.77-0.96l4.78-0.84l16.17-16.1l-0.06-5.07l-1.73,2.24h-2.59l-3.15-2.64l1.6-3.98l2.75-0.56l-0.25-8.18L534.16,403.63L534.16,403.63z M530.37,422.13l1.51-0.06l2.45,2.66l-0.07,3.08l-2.87,1.45l-0.18,1.02l-4.38,0.05l-1.37-3.3l1.25-2.42L530.37,422.13L530.37,422.13z",
      "name": "South Africa"
    },
    "gl": {
      "path": "M321.13,50.07l-1.36,2.17l2.45,2.45l-1.09,2.45l3.54,4.62l4.35-1.36l5.71-0.54l6.53,7.07l4.35,11.69l-3.53,7.34l4.89-0.82l2.72,1.63l0.27,3.54l-5.98,0.27l3.26,3.26l4.08,0.82l-8.97,11.96l-1.09,7.34l1.9,5.98l-1.36,3.54l2.45,7.61l4.62,5.17l1.36-0.27l2.99-0.82l0.27,4.35l1.9,2.72l3.53-0.27l2.72-10.06l8.16-10.06l12.24-4.89l7.61-9.52l3.53,1.63h7.34l5.98-5.98l7.34-2.99l0.82-4.62l-4.62-4.08l-4.08-1.36l-2.18-5.71l5.17-2.99l8.16,4.35l2.72-2.99l-4.35-2.45l9.25-12.51l-1.63-5.44l-4.35-0.27l1.63-4.89l5.44-2.45l11.15-9.79l-3.26-3.53l-12.51,1.09l-6.53,6.53l3.81-8.43l-4.35-1.09l-2.45,4.35l-3.53-2.99l-9.79,1.09l2.72-4.35l16.04-0.54l-4.08-5.44l-17.4-3.26l-7.07,1.09l0.27,3.54l-7.34-2.45l0.27-2.45l-5.17,1.09l-1.09,2.72l5.44,1.9l-5.71,4.08l-4.08-4.62l-5.71-1.63l-0.82,4.35h-5.71l-2.18-4.62l-8.97-1.36l-4.89,2.45l-0.27,3.26l-6.25-0.82l-3.81,1.63l0.27,3.81v1.9l-7.07,1.36l-3.26-2.17l-2.18,3.53l3.26,3.54l6.8-0.82l0.54,2.18l-5.17,2.45L321.13,50.07L321.13,50.07M342.89,92.49l1.63,2.45l-0.82,2.99h-1.63l-2.18-2.45l0.54-1.9L342.89,92.49L342.89,92.49M410.87,85.69l4.62,1.36l-0.27,3.81l-4.89-2.45l-1.09-1.36L410.87,85.69L410.87,85.69z",
      "name": "Greenland"
    },
    "au": {
      "path": "M761.17,427.98l-0.35,25.38l-3.9,2.86l-0.35,2.5l5.32,3.57l13.13-2.5h6.74l2.48-3.58l14.9-2.86l10.64,3.22l-0.71,4.29l1.42,4.29l8.16-1.43l0.35,2.14l-5.32,3.93l1.77,1.43l3.9-1.43l-1.06,11.8l7.45,5.72l4.26-1.43l2.13,2.14l12.42-1.79l11.71-18.95l4.26-1.07l8.51-15.73l2.13-13.58l-5.32-6.79l2.13-1.43l-4.26-13.23l-4.61-3.22l0.71-17.87l-4.26-3.22l-1.06-10.01h-2.13l-7.1,23.59l-3.9,0.36l-8.87-8.94l4.97-13.23l-9.22-1.79l-10.29,2.86l-2.84,8.22l-4.61,1.07l-0.35-5.72l-18.8,11.44l0.35,4.29l-2.84,3.93h-7.1l-15.26,6.43L761.17,427.98L761.17,427.98M825.74,496.26l-1.77,7.15l0.35,5l5.32-0.36l6.03-9.29L825.74,496.26L825.74,496.26z",
      "name": "Australia"
    },
    "nz": {
      "path": "M913.02,481.96l1.06,11.8l-1.42,5.36l-5.32,3.93l0.35,4.65v5l1.42,1.79l14.55-12.51v-2.86h-3.55l-4.97-16.8L913.02,481.96L913.02,481.96M902.38,507.7l2.84,5.36l-7.81,7.51l-0.71,3.93l-5.32,0.71l-8.87,8.22l-8.16-3.93l-0.71-2.86l14.9-6.43L902.38,507.7L902.38,507.7z",
      "name": "New Zealand"
    },
    "nc": {
      "path": "M906.64,420.47l-0.35,1.79l4.61,6.43l2.48,1.07l0.35-2.5L906.64,420.47L906.64,420.47z",
      "name": "New Caledonia"
    },
    "my": {
      "path": "M764.14,332.92l3.02,3.49l11.58-4.01l2.29-8.84l5.16-0.37l4.72-3.42l-6.12-4.46l-1.4-2.45l-3.02,5.57l1.11,3.2l-1.84,2.67l-3.47-0.89l-8.41,6.17l0.22,3.57L764.14,332.92L764.14,332.92M732.71,315.45l2.01,4.51l0.45,5.86l2.69,4.17l6.49,3.94l2.46,0.23l-0.45-4.06l-2.13-5.18l-3.12-6.63l-0.26,1.16l-3.76-0.17l-2.7-3.88L732.71,315.45L732.71,315.45z",
      "name": "Malaysia"
    },
    "bn": {
      "path": "M779.77,319.25l-2.88,3.49l2.36,0.74l1.33-1.86L779.77,319.25L779.77,319.25z",
      "name": "Brunei Darussalam"
    },
    "tl": {
      "path": "M806.14,368.42l-5.11,4.26l0.49,1.09l2.16-0.4l2.55-2.38l5.01-0.69l-0.98-1.68L806.14,368.42L806.14,368.42z",
      "name": "Timor-Leste"
    },
    "sb": {
      "path": "M895.43,364.65l0.15,2.28l1.39,1.32l1.31-0.81l-1.17-2.43L895.43,364.65L895.43,364.65M897.18,370.31l-1.17,1.25l1.24,2.28l1.46,0.44l-0.07-1.54L897.18,370.31L897.18,370.31M900.03,368.99l1.02,2.5l1.97,2.35l1.09-1.76l-1.46-2.5L900.03,368.99L900.03,368.99M905.14,372.74l0.58,3.09l1.39,1.91l1.17-2.42L905.14,372.74L905.14,372.74M906.74,379.65l-0.51,0.88l1.68,2.21l1.17,0.07l-0.73-2.87L906.74,379.65L906.74,379.65M903.02,384.05l-1.75,0.81l1.53,2.13l1.31-0.74L903.02,384.05L903.02,384.05z",
      "name": "Solomon Islands"
    },
    "vu": {
      "path": "M920.87,397.22l-1.24,1.66l0.52,1.87l0.62,0.42l1.13-1.46L920.87,397.22L920.87,397.22M921.49,402.31l0.1,1.35l1.34,0.42l0.93-0.52l-0.93-1.46L921.49,402.31L921.49,402.31M923.45,414.37l-0.62,0.94l0.93,1.04l1.55-0.52L923.45,414.37L923.45,414.37z",
      "name": "Vanuatu"
    },
    "fj": {
      "path": "M948.62,412.29l-1.24,1.66l-0.1,1.87l1.44,1.46L948.62,412.29L948.62,412.29z",
      "name": "Fiji"
    },
    "ph": {
      "path": "M789.37,297.53l-0.86,1.64l-0.48,2.02l-4.78,6.07l0.29,1.25l2.01-0.29l6.21-6.94L789.37,297.53L789.37,297.53M797.11,295.22l-0.1,5.01l1.82,1.83l0.67,3.56l1.82,0.39l0.86-2.22l-1.43-1.06l-0.38-6.26L797.11,295.22L797.11,295.22M802.28,297.15l-0.1,4.43l1.05,1.73l1.82-2.12l-0.48-3.85L802.28,297.15L802.28,297.15M803.42,293.29l1.82,2.41l0.86,2.31h1.63l-0.29-3.95l-1.82-1.25L803.42,293.29L803.42,293.29M806.96,302.35l0.38,2.89l-3.35,2.7l-2.77,0.29l-2.96,3.18l0.1,1.45l2.77-0.87l1.91-1.25l1.63,4.14l2.87,2.02l1.15-0.39l1.05-1.25l-2.29-2.31l1.34-1.06l1.53,1.25l1.05-1.73l-1.05-2.12l-0.19-4.72L806.96,302.35L806.96,302.35M791.38,272.97l-2.58,1.83l-0.29,5.78l4.02,7.8l1.34,1.06l1.72-1.16l2.96,0.48l0.57,2.6l2.2,0.19l1.05-1.44l-1.34-1.83l-1.63-1.54l-3.44-0.38l-1.82-2.99l2.1-3.18l0.19-2.79l-1.43-3.56L791.38,272.97L791.38,272.97M792.72,290.21l0.76,2.7l1.34,0.87l0.96-1.25l-1.53-2.12L792.72,290.21L792.72,290.21z",
      "name": "Philippines"
    },
    "cn": {
      "path": "M759.83,270.17l-2.39,0.67l-1.72,2.12l1.43,2.79l2.1,0.19l2.39-2.12l0.57-2.79L759.83,270.17L759.83,270.17M670.4,170.07l-3.46,8.7l-4.77-0.25l-5.03,11.01l4.27,5.44l-8.8,12.15l-4.52-0.76l-3.02,3.8l0.75,2.28l3.52,0.25l1.76,4.05l3.52,0.76l10.81,13.93v7.09l5.28,3.29l5.78-1.01l7.29,4.3l8.8,2.53l4.27-0.51l4.78-0.51l10.05-6.58l3.27,0.51l1.25,2.97l2.77,0.83l3.77,5.57l-2.51,5.57l1.51,3.8l4.27,1.52l0.75,4.56l5.03,0.51l0.75-2.28l7.29-3.8l4.52,0.25l5.28,5.82l3.52-1.52l2.26,0.25l1.01,2.79l1.76,0.25l2.51-3.54l10.05-3.8l9.05-10.89l3.02-10.38l-0.25-6.84l-3.77-0.76l2.26-2.53l-0.5-4.05l-9.55-9.62v-4.81l2.76-3.54l2.76-1.27l0.25-2.79h-7.04l-1.26,3.8l-3.27-0.76l-4.02-4.3l2.51-6.58l3.52-3.8l3.27,0.25l-0.5,5.82l1.76,1.52l4.27-4.3l1.51-0.25l-0.5-3.29l4.02-4.81l3.02,0.25l1.76-5.57l2.06-1.09l0.21-3.47l-2-2.1l-0.17-5.48l3.85-0.25l-0.25-14.13l-2.7,1.62l-1.01,3.62l-4.51-0.01l-13.07-7.35l-9.44-11.38l-9.58-0.1l-2.44,2.12l3.1,7.1l-1.08,6.66l-3.86,1.6l-2.17-0.17l-0.16,6.59l2.26,0.51l4.02-1.77l5.28,2.53v2.53l-3.77,0.25l-3.02,6.58l-2.76,0.25l-9.8,12.91l-10.3,4.56l-7.04,0.51l-4.77-3.29l-6.79,3.55l-7.29-2.28l-1.76-4.81l-12.31-0.76l-6.53-10.63h-2.76l-2.22-4.93L670.4,170.07z",
      "name": "China"
    },
    "tw": {
      "path": "M787.46,248.31l-3.54,2.7l-0.19,5.2l3.06,3.56l0.76-0.67L787.46,248.31L787.46,248.31z",
      "name": "Taiwan"
    },
    "jp": {
      "path": "M803.23,216.42l-1.63,1.64l0.67,2.31l1.43,0.1l0.96,5.01l1.15,1.25l2.01-1.83l0.86-3.28l-2.49-3.56L803.23,216.42L803.23,216.42M812.03,213.15l-2.77,2.6l-0.1,2.99l0.67,0.87l3.73-3.18l-0.29-3.18L812.03,213.15L812.03,213.15M808.2,206.98l-4.88,5.59l0.86,1.35l2.39,0.29l4.49-3.47l3.16-0.58l2.87,3.37l2.2-0.77l0.86-3.28l4.11-0.1l4.02-4.82l-2.1-8l-0.96-4.24l2.1-1.73l-4.78-7.22l-1.24,0.1l-2.58,2.89v2.41l1.15,1.35l0.38,6.36l-2.96,3.66l-1.72-1.06l-1.34,2.99l-0.29,2.79l1.05,1.64l-0.67,1.25l-2.2-1.83h-1.53l-1.34,0.77L808.2,206.98L808.2,206.98M816.43,163.44l-1.53,1.35l0.77,2.89l1.34,1.35l-0.1,4.43l-1.72,0.67l-1.34,2.99l3.92,5.39l2.58-0.87l0.48-1.35l-2.77-2.5l1.72-2.22l1.82,0.29l1.43,1.54l0.1-3.18l3.92-3.18l2.2-0.58l-1.82-3.08l-0.86-1.35l-1.43,0.96l-1.24,1.54l-2.68-0.58l-2.77-1.83L816.43,163.44L816.43,163.44z",
      "name": "Japan"
    },
    "ru": {
      "path": "M506.61,151.72l-1.5-0.15l-2.7,3.23v1.51l0.9,0.35l1.75,0.05l2.9-2.37l0.4-0.81L506.61,151.72L506.61,151.72M830.86,160.45l-2.68,3.76l0.19,1.83l1.34-0.58l3.15-3.95L830.86,160.45L830.86,160.45M834.4,154.96l-0.96,2.6l0.1,1.73l1.63-1.06l1.53-3.08V154L834.4,154.96L834.4,154.96M840.04,132.03l-1.24,1.54l0.1,2.41l1.15-0.1l1.91-3.37L840.04,132.03L840.04,132.03M837.75,137.91v4.24l1.34,0.48l0.96-1.54v-3.27L837.75,137.91L837.75,137.91M798.64,122.59l-0.09,6.17l7.74,11.95l2.77,10.4l4.88,9.25l1.91,0.67l1.63-1.35l0.76-2.22l-6.98-7.61l0.19-3.95l1.53-0.67l0.38-2.31l-13.67-19.36L798.64,122.59L798.64,122.59M852.57,103.42l-1.91,0.19l1.15,1.64l2.39,1.64l0.67-0.77L852.57,103.42L852.57,103.42M856.29,104.58l0.29,1.64l2.96,0.87l0.29-1.16L856.29,104.58L856.29,104.58M547.82,38.79l1.72,0.69l-1.21,2.08v2.95l-2.58,1.56H543l-1.55-1.91l0.17-2.08l1.21-1.56h2.41L547.82,38.79L547.82,38.79M554.36,36.88v2.08l1.72,1.39l2.41-0.17l2.07-1.91v-1.39h-1.89l-1.55,0.52l-1.21-1.39L554.36,36.88L554.36,36.88M564.18,37.06l1.21,2.6l2.41,0.17l1.72-0.69l-0.86-2.43l-2.24-0.52L564.18,37.06L564.18,37.06M573.99,33.59l-1.89-0.35l-1.72,1.74l0.86,1.56l0.52,2.43l2.24-1.73l0.52-1.91L573.99,33.59L573.99,33.59M584.49,51.98l-0.52,2.43l-3.96,3.47l-8.44,1.91l-6.89,11.45l-1.21,3.3l6.89,1.74l1.03-4.16l2.07-6.42l5.34-2.78l4.48-3.47l3.27-1.39h1.72v-4.68L584.49,51.98L584.49,51.98M562.28,77.31l4.65,0.52l1.55,5.38l3.96,4.16l-1.38,2.78h-2.41l-2.24-2.6l-4.99-0.17l-2.07-2.78v-1.91l3.1-0.87L562.28,77.31L562.28,77.31M634.95,18.15l-2.24-1.39h-2.58l-0.52,1.56l-2.75,1.56l-2.07,0.69l-0.34,2.08l4.82,0.35L634.95,18.15L634.95,18.15M640.28,18.67l-1.21,2.6l-2.41-0.17l-3.79,2.78l-1.03,3.47h2.41l1.38-2.26l3.27,2.43l3.1-1.39l2.24-1.91l-0.86-2.95l-1.21-2.08L640.28,18.67L640.28,18.67M645.28,20.58l1.21,4.86l1.89,4.51l2.07-3.64l3.96-0.87v-2.6l-2.58-1.91L645.28,20.58L645.28,20.58M739.76,12.8l2.69,2.26l1.91-0.79l0.56-3.17L741,8.39l-2.58,1.7l-6.28,0.57v2.83l-6.62,0.11v4.63l7.74,5.76l2.02-1.47l-0.45-4.07l4.94-1.24l-1.01-1.92l-1.79-1.81L739.76,12.8L739.76,12.8M746.94,10.09l1.79,3.39l6.96-0.79l1.91-2.49l-0.45-2.15l-1.91-0.79l-1.79,1.36l-5.16,1.13L746.94,10.09L746.94,10.09M746.49,23.31l-3.48-0.9L741,24.56l-0.9,2.94l4.71-0.45l3.59-1.81L746.49,23.31L746.49,23.31M836.68,3.76l-2.92-0.9L830.4,4.1l-1.68,2.49l2.13,2.83l5.61-2.49l1.12-1.24L836.68,3.76L836.68,3.76M817.97,72.93l1.76,6.08l3.52,1.01l3.52-5.57l-2.01-3.8l0.75-3.29h5.28l-1.26,2.53l0.5,9.12l-7.54,18.74l0.75,4.05l-0.25,6.84l14.07,20.51l2.76,0.76l0.25-16.71l2.76-2.53l-3.02-6.58l2.51-2.79l-5.53-7.34l-3.02,0.25l-1-12.15l7.79-2.03l0.5-3.55l4.02-1.01l2.26,2.03l2.76-11.14l4.77-8.1l3.77-2.03l3.27,0.25v-3.8l-5.28-1.01l-7.29-6.08l3.52-4.05l-3.02-6.84l2.51-2.53l3.02,4.05l7.54,2.79l8.29,0.76l1.01-3.54l-4.27-4.3l4.77-6.58l-10.81-3.8l-2.76,5.57l-3.52-4.56l-19.85-6.84l-18.85,3.29l-2.76,1.52v1.52l4.02,2.03l-0.5,4.81l-7.29-3.04l-16.08,6.33l-2.76-5.82h-11.06l-5.03,5.32l-17.84-4.05l-16.33,3.29l-2.01,5.06l2.51,0.76l-0.25,3.8l-15.83,1.77l1.01,5.06l-14.58-2.53l3.52-6.58l-14.83-0.76l1.26,6.84l-4.77,2.28l-4.02-3.8l-16.33,2.79l-6.28,5.82l-0.25,3.54l-4.02,0.25l-0.5-4.05l12.82-11.14v-7.6l-8.29-2.28l-10.81,3.54l-4.52-4.56h-2.01l-2.51,5.06l2.01,2.28l-14.33,7.85l-12.31,9.37l-7.54,10.38v4.3l8.04,3.29l-4.02,3.04l-8.54-3.04l-3.52,3.04l-5.28-6.08l-1.01,2.28l5.78,18.23l1.51,0.51l4.02-2.03l2.01,1.52v3.29l-3.77-1.52l-2.26,1.77l1.51,3.29l-1.26,8.61l-7.79,0.76l-0.5-2.79l4.52-2.79l1.01-7.6l-5.03-6.58l-1.76-11.39l-8.04-1.27l-0.75,4.05l1.51,2.03l-3.27,2.79l1.26,7.6l4.77,2.03l1.01,5.57l-4.78-3.04l-12.31-2.28l-1.51,4.05l-9.8,3.54l-1.51-2.53l-12.82,7.09l-0.25,4.81l-5.03,0.76l1.51-3.54v-3.54l-5.03-1.77l-3.27,1.27l2.76,5.32l2.01,3.54v2.79l-3.77-0.76l-0.75-0.76l-3.77,4.05l2.01,3.54l-8.54-0.25l2.76,3.55l-0.75,1.52h-4.52l-3.27-2.28l-0.75-6.33l-5.28-2.03v-2.53l11.06,2.28l6.03,0.51l2.51-3.8l-2.26-4.05l-16.08-6.33l-5.55,1.38l-1.9,1.63l0.59,3.75l2.36,0.41l-0.55,5.9l7.28,17.1l-5.26,8.34l-0.36,1.88l2.67,1.88l-2.41,1.59l-1.6,0.03l0.3,7.35l2.21,3.13l0.03,3.04l2.83,0.26l4.33,1.65l4.58,6.3l0.05,1.66l-1.49,2.55l3.42-0.19l3.33,0.96l4.5,6.37l11.08,1.01l-0.48,7.58l-3.82,3.27l0.79,1.28l-3.77,4.05l-1,3.8l2.26,3.29l7.29,2.53l3.02-1.77l19.35,7.34l0.75-2.03l-4.02-3.8v-4.81l-2.51-0.76l0.5-4.05l4.02-4.81l-7.21-5.4l0.5-7.51l7.71-5.07l9.05,0.51l1.51,2.79l9.3,0.51l6.79-3.8l-3.52-3.8l0.75-7.09l17.59-8.61l13.53,6.1l4.52-4.05l13.32,12.66l10.05-1.01l3.52,3.54l9.55,1.01l6.28-8.61l8.04,3.55l4.27,0.76l4.27-3.8l-3.77-2.53l3.27-5.06l9.3,3.04l2.01,4.05l4.02,0.25l2.51-1.77l6.79-0.25l0.75,1.77l7.79,0.51l5.28-5.57l10.81,1.27l3.27-1.27l1-6.08l-3.27-7.34l3.27-2.79h10.3l9.8,11.65l12.56,7.09h3.77l0.5-3.04l4.52-2.79l0.5,16.46l-4.02,0.25v4.05l2.26,2.79l-0.42,3.62l1.67,0.69l1.01-2.53l1.51,0.51l1,1.01l4.52-1.01l4.52-13.17l0.5-16.46l-5.78-13.17l-7.29-8.86l-3.52,0.51v2.79l-8.54-3.29l3.27-7.09l2.76-18.74l11.56-3.54l5.53-3.54h6.03L805.86,96l1.51,2.53l5.28-5.57l3.02,0.25l-0.5-3.29l-4.78-1.01l3.27-11.9L817.97,72.93L817.97,72.93z",
      "name": "Russian Federation"
    },
    "us": {
      "path": "M69.17,53.35l3.46,6.47l2.22-0.5v-2.24L69.17,53.35L69.17,53.35M49.66,110.26l-0.17,3.01l2.16-0.5v-1.34L49.66,110.26L49.66,110.26M46.34,111.6l-4.32,2.18l0.67,2.34l1.66-1.34l3.32-1.51L46.34,111.6L46.34,111.6M28.39,114.44l-2.99-0.67l-0.5,1.34l0.33,2.51L28.39,114.44L28.39,114.44M22.07,114.28l-2.83-1.17l-1,1.84l1.83,1.84L22.07,114.28L22.07,114.28M12.27,111.6l-1.33-1.84l-1.33,0.5v2.51l1.5,1L12.27,111.6L12.27,111.6M1.47,99.71l1.66,1.17l-0.5,1.34H1.47V99.71L1.47,99.71M10,248.7l-0.14,2.33l2.04,1.37l1.22-1.09L10,248.7L10,248.7M15.29,252.13l-1.9,1.37l1.63,2.05l1.9-1.64L15.29,252.13L15.29,252.13M19.1,255.41l-1.63,2.19l0.54,1.37l2.31-1.09L19.1,255.41L19.1,255.41M21.81,259.65l-0.95,5.47l0.95,2.05l3.12-0.96l1.63-2.74l-3.4-3.15L21.81,259.65L21.81,259.65M271.05,281.06l-2.64-0.89l-2.12,1.33l1.06,1.24l3.61,0.53L271.05,281.06L271.05,281.06M93.11,44.89l-8.39,1.99l1.73,9.45l9.13,2.49l0.49,1.99L82.5,65.04l-7.65,12.68l2.71,13.43L82,94.13l3.46-3.23l0.99,1.99l-4.2,4.97l-16.29,7.46l-10.37,2.49l-0.25,3.73l23.94-6.96l9.87-2.74l9.13-11.19l10.12-6.71l-5.18,8.7l5.68,0.75l9.63-4.23l1.73,6.96l6.66,1.49l6.91,6.71l0.49,4.97l-0.99,1.24l1.23,4.72h1.73l0.25-7.96h1.97l0.49,19.64l4.94-4.23l-3.46-20.39h-5.18l-5.68-7.21l27.89-47.25l-27.64-21.63l-30.85,5.97l-1.23,9.45l6.66,3.98l-2.47,6.47L93.11,44.89L93.11,44.89M148.76,158.34l-1,4.02l-3.49-2.26h-1.74l-1,4.27l-12.21,27.36l3.24,23.84l3.99,2.01l0.75,6.53h8.22l7.97,6.02l15.69,1.51l1.74,8.03l2.49,1.76l3.49-3.51l2.74,1.25l2.49,11.54l4.23,2.76l3.49-6.53l10.71-7.78l6.97,3.26l5.98,0.5l0.25-3.76l12.45,0.25l2.49,2.76l0.5,6.27l-1.49,3.51l1.74,6.02h3.74l3.74-5.77l-1.49-2.76l-1.49-6.02l2.24-6.78l10.21-8.78l7.72-2.26l-1-7.28l10.71-11.55l10.71-1.76L272.8,199l10.46-6.02v-8.03l-1-0.5l-3.74,1.25l-0.5,4.92l-12.43,0.15l-9.74,6.47l-15.29,5l-2.44-2.99l6.94-10.5l-3.43-3.27l-2.33-4.44l-4.83-3.88l-5.25-0.44l-9.92-6.77L148.76,158.34L148.76,158.34z",
      "name": "United States of America"
    },
    "mu": {
      "path": "M613.01,398.99l-1.52,1.99l0.3,2.15l3.2-2.61L613.01,398.99L613.01,398.99z",
      "name": "Mauritius"
    },
    "re": {
      "path": "M607.38,402.37l-2.28,0.15l-0.15,1.99l1.52,0.31l2.28-1.07L607.38,402.37L607.38,402.37z",
      "name": "Reunion"
    },
    "mg": {
      "path": "M592.3,372.92l-2.13,5.06l-3.65,6.44l-6.39,0.46l-2.74,3.22l0.46,9.82l-3.96,4.6l0.46,7.82l3.35,3.83l3.96-0.46l3.96-2.92l-0.91-4.6l9.13-15.8l-1.83-1.99l1.83-3.83l1.98,0.61l0.61-1.53l-1.83-7.82l-1.07-3.22L592.3,372.92L592.3,372.92z",
      "name": "Madagascar"
    },
    "km": {
      "path": "M577.69,371.23l0.46,1.53l1.98,0.31l0.76-1.99L577.69,371.23L577.69,371.23M580.58,374.3l0.76,1.69h1.22l0.61-2.15L580.58,374.3L580.58,374.3z",
      "name": "Comoros"
    },
    "sc": {
      "path": "M602.35,358.34l-0.61,1.23l1.67,1.38l1.22-1.38L602.35,358.34L602.35,358.34M610.88,349.14l-1.83,1.23l1.37,2.15h1.83L610.88,349.14L610.88,349.14M611.64,354.51l-1.22,1.38l0.91,1.38l1.67,0.31l0.15-2.92L611.64,354.51L611.64,354.51z",
      "name": "Seychelles"
    },
    "mv": {
      "path": "M656.4,320.76l0.3,2.61l1.67,0.61l0.3-2.3L656.4,320.76L656.4,320.76M658.53,326.28l-0.15,3.22l1.22,0.61l1.07-2.15L658.53,326.28L658.53,326.28M658.84,332.57l-1.07,1.07l1.22,1.07l1.52-1.07L658.84,332.57L658.84,332.57z",
      "name": "Maldives"
    },
    "pt": {
      "path": "M372.64,217.02l-1.36,1.37l2.44,1.37l0.27-1.91L372.64,217.02L372.64,217.02M379.97,216.2l-1.63,1.09l1.36,1.09l2.17-0.55L379.97,216.2L379.97,216.2M381.05,220.03l-0.81,2.19l1.08,1.37l1.36-1.09L381.05,220.03L381.05,220.03M387.56,224.4l-0.54,1.37l0.81,0.82l2.17-1.37L387.56,224.4L387.56,224.4M408.18,236.42l-1.08,1.37l1.08,1.37l1.63-0.82L408.18,236.42L408.18,236.42M430.93,211.24l-0.62,8.65l-1.77,1.6l0.18,0.98l1.24,2.05l-0.8,2.5l1.33,0.45l3.1-0.36l-0.18-2.5l2.03-11.59l-0.44-1.6L430.93,211.24L430.93,211.24z",
      "name": "Portugal"
    },
    "es": {
      "path": "M415.62,253.73l-1.75,1.01l0.81,0.82L415.62,253.73L415.62,253.73M409.54,253.92l-2.17,0.55l1.08,1.64h1.63L409.54,253.92L409.54,253.92M404.38,252.28l-1.36,1.37l1.9,1.64l1.08-2.46L404.38,252.28L404.38,252.28M448.36,205h-12.74l-2.57-1.16l-1.24,0.09l-1.5,3.12l0.53,3.21l4.87,0.45l0.62,2.05l-2.12,11.95l0.09,2.14l3.45,1.87l3.98,0.27l7.96-1.96l3.89-4.9l0.09-4.99l6.9-6.24l0.35-2.76l-6.28-0.09L448.36,205L448.36,205M461.1,217.21l-1.59,0.54l0.35,1.43h2.3l0.97-1.07L461.1,217.21L461.1,217.21z",
      "name": "Spain"
    },
    "cv": {
      "path": "M387.56,290.54l-1.9,1.09l1.36,1.09l1.63-0.82L387.56,290.54L387.56,290.54M392.23,292.74l-1.24,1.1l0.88,1.63l2.12-0.95L392.23,292.74L392.23,292.74M389.52,295.83l-1.59,0.95l1.71,2.29l1.35-0.71L389.52,295.83L389.52,295.83z",
      "name": "Cape Verde"
    },
    "pf": {
      "path": "M27.25,402.68l-1.9-0.14l-0.14,1.78l1.49,0.96l1.77-1.09L27.25,402.68L27.25,402.68M33.77,404.6l-2.72,1.78l2.04,2.46l1.77-0.41l0.95-1.23L33.77,404.6L33.77,404.6z",
      "name": "French Polynesia"
    },
    "kn": {
      "path": "M276.6,283.37l-1.5,0.62l0.53,1.33l1.76-1.15l-0.35-0.36L276.6,283.37L276.6,283.37z",
      "name": "Saint Kitts and Nevis"
    },
    "ag": {
      "path": "M279.07,284.88l-0.88,1.87l1.06,1.42l1.32-1.15L279.07,284.88L279.07,284.88z",
      "name": "Antigua and Barbuda"
    },
    "dm": {
      "path": "M282.07,290.03l-1.06,0.98l0.79,1.6l1.5-0.44L282.07,290.03L282.07,290.03z",
      "name": "Dominica"
    },
    "lc": {
      "path": "M281.98,294.03l-0.71,1.51l1.15,1.24l1.5-0.8L281.98,294.03L281.98,294.03z",
      "name": "Saint Lucia"
    },
    "bb": {
      "path": "M282.07,297.85l-1.23,0.89l0.97,1.78l1.59-0.89L282.07,297.85L282.07,297.85z",
      "name": "Barbados"
    },
    "gd": {
      "path": "M280.57,301.31l-1.15,1.15l0.44,0.71h1.41l0.44-1.16L280.57,301.31L280.57,301.31z",
      "name": "Grenada"
    },
    "tt": {
      "path": "M282.24,304.78l-1.06,0.98l-1.15,0.18v1.42l2.12,1.95l0.88-1.42l0.53-1.6l-0.18-1.33L282.24,304.78L282.24,304.78z",
      "name": "Trinidad and Tobago"
    },
    "do": {
      "path": "M263.11,280.44l-5.29-3.46l-2.5-0.85l-0.84,6l0.88,1.69l1.15-1.33l3.35-0.89l2.91,0.62L263.11,280.44L263.11,280.44z",
      "name": "Dominican Republic"
    },
    "ht": {
      "path": "M250.86,275.38l3.44,0.36l-0.41,4.22l-0.34,2.22l-4.01-0.22l-0.71,1.07l-1.23-0.09l-0.44-2.31l4.23-0.35l-0.26-2.4l-1.94-0.8L250.86,275.38L250.86,275.38z",
      "name": "Haiti"
    },
    "fk": {
      "path": "M307.95,508.18l-2.63-0.29l-2.62,1.76l1.9,2.06L307.95,508.18L307.95,508.18M310.57,506.86l-0.87,2.79l-2.48,2.2l0.15,0.73l4.23-1.62l1.75-2.2L310.57,506.86L310.57,506.86z",
      "name": "Falkland Islands"
    },
    "is": {
      "path": "M406.36,117.31l-1.96-1.11l-2.64,1.67l-2.27,2.1l0.06,1.17l2.94,0.37l-0.18,2.1l-1.04,1.05l0.25,0.68l2.94,0.19v3.4l4.23,0.74l2.51,1.42l2.82,0.12l4.84-2.41l3.74-4.94l0.06-3.34l-2.27-1.92l-1.9-1.61l-0.86,0.62l-1.29,1.67l-1.47-0.19l-1.47-1.61l-1.9,0.18l-2.76,2.29l-1.66,1.79l-0.92-0.8l-0.06-1.98l0.92-0.62L406.36,117.31L406.36,117.31z",
      "name": "Iceland"
    },
    "no": {
      "path": "M488.26,53.96l-1.65-1.66l-3.66,1.78h-6.72L475.17,58l3.77,3.33l1.65-0.24l2.36-4.04l2,1.43l-1.42,2.85l-0.71,4.16l1.65,2.61l3.54-5.94l4.6-5.59l-1.77-1.54L488.26,53.96L488.26,53.96M490.26,46.83l-2.95,2.73l1.77,2.73h3.18l1.3,1.78l3.89,2.02l4.48-2.61l3.07-2.61l-1.06-2.14l-3.07-1.78l-2.24,2.02l-1.53-1.9l-1.18,0.12l-1.53,3.33l-2.24-2.26l-0.24-1.54L490.26,46.83L490.26,46.83M496.98,59.07l-2.36,2.14l-2,1.54l0.94,1.66l1.89,0.59l3.07-1.43l1.42-1.78l-1.3-2.14L496.98,59.07L496.98,59.07M515.46,102.14l2.02-1.48L517.3,99l-1.28-0.74l0.18-2.03h1.1v-1.11l-4.77-1.29l-7.15,0.74l-0.73,3.14L503,97.16l-1.1-1.85l-3.49,0.18L498.04,99l-1.65,0.74l-0.92-1.85l-7.34,5.91l1.47,1.66l-2.75,1.29l-6.24,12.38l-2.2,1.48l0.18,1.11l2.2,1.11l-0.55,2.4l-3.67-0.19l-1.1-1.29l-2.38,2.77l-1.47,1.11l-0.37,2.59l-1.28,0.74l-3.3,0.74l-1.65,5.18l1.1,8.5l1.28,3.88l1.47,1.48l3.3-0.18l4.77-4.62l1.83-3.14l0.55,4.62l3.12-5.54l0.18-15.53l2.54-1.6l0.76-8.57l7.7-11.09l3.67-1.29l1.65-2.03l5.5,1.29l2.75,1.66l0.92-4.62l4.59-2.77L515.46,102.14L515.46,102.14z",
      "name": "Norway"
    },
    "lk": {
      "path": "M680.54,308.05l0.25,2.72l0.25,1.98l-1.47,0.25l0.74,4.45l2.21,1.24l3.43-1.98l-0.98-4.69l0.25-1.73l-3.19-2.96L680.54,308.05L680.54,308.05z",
      "name": "Sri Lanka"
    },
    "cu": {
      "path": "M220.85,266.92v1.27l5.32,0.1l2.51-1.46l0.39,1.07l5.22,1.27l4.64,4.19l-1.06,1.46l0.19,1.66l3.87,0.97l3.87-1.75l1.74-1.75l-2.51-1.27l-12.95-7.6l-4.54-0.49L220.85,266.92L220.85,266.92z",
      "name": "Cuba"
    },
    "bs": {
      "path": "M239.61,259.13l-1.26-0.39l-0.1,2.43l1.55,1.56l1.06-1.56L239.61,259.13L239.61,259.13M242.12,262.93l-1.74,0.97l1.64,2.34l0.87-1.17L242.12,262.93L242.12,262.93M247.73,264.68l-1.84-0.1l0.19,1.17l1.35,1.95l1.16-1.27L247.73,264.68L247.73,264.68M246.86,262.35l-3-1.27l-0.58-3.02l1.16-0.49l1.16,2.34l1.16,0.88L246.86,262.35L246.86,262.35M243.96,256.21l-1.55-0.39l-0.29-1.95l-1.64-0.58l1.06-1.07l1.93,0.68l1.45,0.88L243.96,256.21L243.96,256.21z",
      "name": "Bahamas"
    },
    "jm": {
      "path": "M238.93,279.59l-3.48,0.88v0.97l2.03,1.17h2.13l1.35-1.56L238.93,279.59L238.93,279.59z",
      "name": "Jamaica"
    },
    "ec": {
      "path": "M230.2,335.85l-4.73,2.94l-0.34,4.36l-0.95,1.43l2.98,2.86l-1.29,1.41l0.3,3.6l5.33,1.27l8.07-9.55l-0.02-3.33l-3.87-0.25L230.2,335.85L230.2,335.85z",
      "name": "Ecuador"
    },
    "ca": {
      "path": "M203.73,35.89l0.22,4.02l-7.98,8.27l2,6.7l5.76-1.56l3.33-4.92l8.42-3.13l6.87-0.45l-5.32-5.81l-2.66,2.01l-2-0.67l-1.11-2.46l-2.44-2.46L203.73,35.89L203.73,35.89M214.15,24.05l-1.77,3.13l8.65,3.13l3.1-4.69l1.33,3.13h2.22l4.21-4.69l-5.1-1.34l-2-1.56l-2.66,2.68L214.15,24.05L214.15,24.05M229.23,30.31l-6.87,2.9v2.23l8.87,3.35l-2,2.23l1.33,2.9l5.54-2.46h4.66l2.22,3.57l3.77-3.8l-0.89-3.58l-3.1,1.12l-0.44-4.47l1.55-2.68h-1.55l-2.44,1.56l-1.11,0.89l0.67,3.13l-1.77,1.34l-2.66-0.22l-0.67-4.02L229.23,30.31L229.23,30.31M238.32,23.38l-0.67,2.23l4.21,2.01l3.1-1.79l-0.22-1.34L238.32,23.38L238.32,23.38M241.64,19.58l-3.1,1.12l0.22,1.56l6.87-0.45l-0.22-1.56L241.64,19.58L241.64,19.58M256.5,23.38l-0.44,1.56l-1.11,1.56v2.23l4.21-0.67l4.43,3.8h1.55v-3.8l-4.43-4.92L256.5,23.38L256.5,23.38M267.81,27.85l1.77,2.01l-1.55,2.68l1.11,2.9l4.88-2.68v-2.01l-2.88-3.35L267.81,27.85L267.81,27.85M274.24,22.71l0.22,3.57h5.99l1.55,1.34l-0.22,1.56l-5.32,0.67l3.77,5.14l5.1,0.89l7.09-3.13l-10.2-15.42l-3.1,2.01l0.22,2.68l-3.55-1.34L274.24,22.71L274.24,22.71M222.58,47.96l-8.42,2.23l-4.88,4.25l0.44,4.69l8.87,2.68l-2,4.47l-6.43-4.02l-1.77,3.35l4.21,2.9l-0.22,4.69l6.43,1.79l7.76-0.45l1.33-2.46l5.76,6.48l3.99-1.34l0.67-4.47l2.88,2.01l0.44-4.47l-3.55-2.23l0.22-14.07l-3.1-2.46L231.89,56L222.58,47.96L222.58,47.96M249.63,57.79l-2.88-1.34l-1.55,2.01l3.1,4.92l0.22,4.69l6.65-4.02v-5.81l2.44-2.46l-2.44-1.79h-3.99L249.63,57.79L249.63,57.79M263.82,55.78l-4.66,3.8l1.11,4.69h2.88l1.33-2.46l2,2.01l2-0.22l5.32-4.47L263.82,55.78L263.82,55.78M263.37,48.4l-1.11,2.23l4.88,1.79l1.33-2.01L263.37,48.4L263.37,48.4M260.49,39.91l-4.88,0.67l-2.88,2.68l5.32,0.22l-1.55,4.02l1.11,1.79l1.55-0.22l3.77-6.03L260.49,39.91L260.49,39.91M268.92,38.35l-2.66,0.89l0.44,3.57l4.43,2.9l0.22,2.23l-1.33,1.34l0.67,4.47l17.07,5.58l4.66,1.56l4.66-4.02l-5.54-4.47l-5.1,1.34l-7.09-0.67l-2.66-2.68l-0.67-7.37l-4.43-2.23L268.92,38.35L268.92,38.35M282.88,61.59L278,61.14l-5.76,2.23l-3.1,4.24l0.89,11.62l9.53,0.45l9.09,4.47l6.43,7.37l4.88-0.22l-1.33,6.92l-4.43,7.37l-4.88,2.23l-3.55-0.67l-1.77-1.56l-2.66,3.57l1.11,3.57l3.77,0.22l4.66-2.23l3.99,10.28l9.98,6.48l6.87-8.71l-5.76-9.38l3.33-3.8l4.66,7.82l8.42-7.37l-1.55-3.35l-5.76,1.79l-3.99-10.95l3.77-6.25l-7.54-8.04l-4.21,2.9l-3.99-8.71l-8.42,1.12l-2.22-10.5l-6.87,4.69l-0.67,5.81h-3.77l0.44-5.14L282.88,61.59L282.88,61.59M292.86,65.61l-1.77,1.79l1.55,2.46l7.32,0.89l-4.66-4.92L292.86,65.61L292.86,65.61M285.77,40.36v2.01l-4.88,1.12l1.33,2.23l5.54,2.23l6.21,0.67l4.43,3.13l4.43-2.46l-3.1-3.13h3.99l2.44-2.68l5.99-0.89v-1.34l-3.33-2.23l0.44-2.46l9.31,1.56l13.75-5.36l-5.1-1.56l1.33-1.79h10.64l1.77-1.79l-21.51-7.6l-5.1-1.79l-5.54,4.02l-6.21-5.14l-3.33-0.22l-0.67,4.25l-4.21-3.8l-4.88,1.56l0.89,2.46l7.32,1.56l-0.44,3.57l3.99,2.46l9.76-2.46l0.22,3.35l-7.98,3.8l-4.88-3.8l-4.43,0.45l4.43,6.26l-2.22,1.12l-3.33-2.9l-2.44,1.56l2.22,4.24h3.77l-0.89,4.02l-3.1-0.45l-3.99-4.25L285.77,40.36L285.77,40.36M266.01,101.85l-4.23,5.32l-0.26,5.86l3.7-2.13h4.49l3.17,2.93l2.91-2.4L266.01,101.85L266.01,101.85M317.52,171.05l-10.57,10.12l1.06,2.4l12.94,4.79l1.85-3.19l-1.06-5.32l-4.23,0.53l-2.38-2.66l3.96-3.99L317.52,171.05L317.52,171.05M158.22,48.66l1.99,3.01l1,4.02l4.98,1.25l3.49-3.76l2.99,1.51l8.47,0.75l5.98-2.51l1,8.28h3.49V57.7l3.49,0.25l8.72,10.29l5.73,3.51l-2.99,4.77l1.25,1.25L219,80.03l0.25,5.02l2.99,0.5l0.75-7.53l4.73-1.25l3.49,5.27l7.47,3.51l3.74,0.75l2.49-3.01l0.25-4.77l4.48-2.76l1.49,4.02l-3.99,7.03l0.5,3.51l2.24-3.51l4.48-4.02l0.25-5.27l-2.49-4.02l0.75-3.26l5.98-3.01l2.74,2.01l0.5,17.57l4.23-3.76l2.49,1.51l-3.49,6.02l4.48,1l6.48-10.04l5.48,5.77l-2.24,10.29l-5.48,3.01l-5.23-2.51l-9.46,2.01l1,3.26l-2.49,4.02l-7.72,1.76l-8.72,6.78l-7.72,10.29l-1,3.26l5.23,2.01l1.99,5.02l7.22,7.28l11.46,5.02l-2.49,11.54l-0.25,3.26l2.99,2.01l3.99-5.27l0.5-10.04l6.23-0.25l2.99-5.77l0.5-8.78l7.97-15.56l9.96,3.51l5.23,7.28l-2.24,7.28l3.99,2.26l9.71-6.53l2.74,17.82l8.97,10.79l0.25,5.52l-9.96,2.51l-4.73,5.02l-9.96-2.26l-4.98-0.25l-8.72,6.78l5.23-1.25l6.48-1.25l1.25,1.51l-1.74,5.52l0.25,5.02l2.99,2.01l2.99-0.75l1.5-2.26h1.99l-3.24,6.02l-6.23,0.25l-2.74,4.02h-3.49l-1-3.01l4.98-5.02l-5.98,2.01l-0.27-8.53l-1.72-1l-5.23,2.26l-0.5,4.27h-11.96l-10.21,7.03l-13.7,4.52l-1.49-2.01l6.9-10.3l-3.92-3.77l-2.49-4.78l-5.07-3.87l-5.44-0.45l-9.75-6.83l-70.71-11.62l-1.17-4.79l-6.48-6.02v-5.02l1-4.52l-0.5-2.51l-2.49-2.51l-0.5-4.02l6.48-4.52l-3.99-21.58l-5.48-0.25l-4.98-6.53L158.22,48.66L158.22,48.66M133.83,128.41l-1.7,3.26l0.59,2.31l1.11,0.69l-0.26,0.94l-1.19,0.34l0.34,3.43l1.28,1.29l1.02-1.11l-1.28-3.34l0.76-2.66l1.87-2.49l-1.36-2.31L133.83,128.41L133.83,128.41M139.45,147.95l-1.53,0.6l2.81,3.26l0.68,3.86l2.81,3l2.38-0.43v-3.94l-2.89-1.8L139.45,147.95L139.45,147.95z",
      "name": "Canada"
    },
    "gt": {
      "path": "M194.88,291.52l5.93,4.34l5.98-7.43l-1.02-1.54l-2.04-0.07v-4.35l-1.53-0.93l-4.63,1.38l1.77,4.08L194.88,291.52L194.88,291.52z",
      "name": "Guatemala"
    },
    "hn": {
      "path": "M207.55,288.78l9.24-0.35l2.74,3.26l-1.71-0.39l-3.29,0.14l-4.3,4.04l-1.84,4.09l-1.21-0.64l-0.01-4.48l-2.66-1.78L207.55,288.78L207.55,288.78z",
      "name": "Honduras"
    },
    "sv": {
      "path": "M201.65,296.27l4.7,2.34l-0.07-3.71l-2.41-1.47L201.65,296.27L201.65,296.27z",
      "name": "El Salvador"
    },
    "ni": {
      "path": "M217.74,292.11l2.19,0.44l0.07,4.49l-2.55,7.28l-6.87-0.68l-1.53-3.51l2.04-4.26l3.87-3.6L217.74,292.11L217.74,292.11z",
      "name": "Nicaragua"
    },
    "cr": {
      "path": "M217.38,304.98l1.39,2.72l1.13,1.5l-1.52,4.51l-2.9-2.04l-4.74-4.34v-2.87L217.38,304.98L217.38,304.98z",
      "name": "Costa Rica"
    },
    "pa": {
      "path": "M220.59,309.61l-1.46,4.56l4.82,1.25l2.99,0.59l0.51-3.53l3.21-1.62l2.85,1.47l1.12,1.79l1.36-0.16l1.07-3.25l-3.56-1.47l-2.7-1.47l-2.7,1.84l-3.21,1.62l-3.28-1.32L220.59,309.61L220.59,309.61z",
      "name": "Panama"
    },
    "co": {
      "path": "M253.73,299.78l-2.06-0.21l-13.62,11.23l-1.44,3.95l-1.86,0.21l0.83,8.73l-4.75,11.65l5.16,4.37l6.61,0.42l4.54,6.66l6.6,0.21l-0.21,4.99H256l2.68-9.15l-2.48-3.12l0.62-5.82l5.16-0.42l-0.62-13.52l-11.56-3.74l-2.68-7.28L253.73,299.78L253.73,299.78z",
      "name": "Colombia"
    },
    "ve": {
      "path": "M250.46,305.92l0.44,2.59l3.25,1.03l0.74-4.77l3.43-3.55l3.43,4.02l7.89,2.15l6.68-1.4l4.55,5.61l3.43,2.15l-3.76,5.73l1.26,4.34l-2.15,2.66l-2.23,1.87l-4.83-2.43l-1.11,1.12v3.46l3.53,1.68l-2.6,2.81l-2.6,2.81l-3.43-0.28l-3.45-3.79l-0.73-14.26l-11.78-4.02l-2.14-6.27L250.46,305.92L250.46,305.92z",
      "name": "Venezuela"
    },
    "gy": {
      "path": "M285.05,314.13l7.22,6.54l-2.87,3.32l-0.23,1.97l3.77,3.89l-0.09,3.74l-6.56,2.5l-3.93-5.31l0.84-6.38l-1.68-4.75L285.05,314.13L285.05,314.13z",
      "name": "Guyana"
    },
    "sr": {
      "path": "M293.13,321.14l2.04,1.87l3.16-1.96l2.88,0.09l-0.37,1.12l-1.21,2.52l-0.19,6.27l-5.75,2.34l0.28-4.02l-3.71-3.46l0.19-1.78L293.13,321.14L293.13,321.14z",
      "name": "Suriname"
    },
    "gf": {
      "path": "M302.13,321.8l5.85,3.65l-3.06,6.08l-1.11,1.4l-3.25-1.87l0.09-6.55L302.13,321.8L302.13,321.8z",
      "name": "French Guiana"
    },
    "pe": {
      "path": "M225.03,349.52l-1.94,1.96l0.13,3.13l16.94,30.88l17.59,11.34l2.72-4.56l0.65-10.03l-1.42-6.25l-4.79-8.08l-2.85,0.91l-1.29,1.43l-5.69-6.52l1.42-7.69l6.6-4.3l-0.52-4.04l-6.72-0.26l-3.49-5.86l-1.94-0.65l0.13,3.52l-8.66,10.29l-6.47-1.56L225.03,349.52L225.03,349.52z",
      "name": "Peru"
    },
    "bo": {
      "path": "M258.71,372.79l8.23-3.59l2.72,0.26l1.81,7.56l12.54,4.17l2.07,6.39l5.17,0.65l2.2,5.47l-1.55,4.95l-8.41,0.65l-3.1,7.95l-6.6-0.13l-2.07-0.39l-3.81,3.7l-1.88-0.18l-6.47-14.99l1.79-2.68l0.63-10.6l-1.6-6.31L258.71,372.79L258.71,372.79z",
      "name": "Bolivia"
    },
    "py": {
      "path": "M291.76,399.51l2.2,2.4l-0.26,5.08l6.34-0.39l4.79,6.13l-0.39,5.47l-3.1,4.69l-6.34,0.26l-0.26-2.61l1.81-4.3l-6.21-3.91h-5.17l-3.88-4.17l2.82-8.06L291.76,399.51L291.76,399.51z",
      "name": "Paraguay"
    },
    "uy": {
      "path": "M300.36,431.93l-2.05,2.19l0.85,11.78l6.44,1.87l8.19-8.21L300.36,431.93L300.36,431.93z",
      "name": "Uruguay"
    },
    "ar": {
      "path": "M305.47,418.2l1.94,1.82l-7.37,10.95l-2.59,2.87l0.9,12.51l5.69,6.91l-4.78,8.34l-3.62,1.56h-4.14l1.16,6.51l-6.47,2.22l1.55,5.47l-3.88,12.38l4.79,3.91l-2.59,6.38l-4.4,6.91l2.33,4.82l-5.69,0.91l-4.66-5.73l-0.78-17.85l-7.24-30.32l2.19-10.6l-4.66-13.55l3.1-17.59l2.85-3.39l-0.7-2.57l3.66-3.34l8.16,0.56l4.56,4.87l5.27,0.09l5.4,3.3l-1.59,3.72l0.38,3.76l7.65-0.36L305.47,418.2L305.47,418.2M288.92,518.79l0.26,5.73l4.4-0.39l3.75-2.48l-6.34-1.3L288.92,518.79L288.92,518.79z",
      "name": "Argentina"
    },
    "cl": {
      "path": "M285.04,514.1l-4.27,9.38l7.37,0.78l0.13-6.25L285.04,514.1L285.04,514.1M283.59,512.63l-3.21,3.55l-0.39,4.17l-6.21-3.52l-6.6-9.51l-1.94-3.39l2.72-3.52l-0.26-4.43l-3.1-1.3l-2.46-1.82l0.52-2.48l3.23-0.91l0.65-14.33l-5.04-2.87l-3.29-74.59l0.85-1.48l6.44,14.85l2.06,0.04l0.67,2.37l-2.74,3.32l-3.15,17.87l4.48,13.76l-2.07,10.42l7.3,30.64l0.77,17.92l5.23,6.05L283.59,512.63L283.59,512.63M262.28,475.14l-1.29,1.95l0.65,3.39l1.29,0.13l0.65-4.3L262.28,475.14L262.28,475.14z",
      "name": "Chile"
    },
    "br": {
      "path": "M314.24,438.85l6.25-12.02l0.23-10.1l11.66-7.52h6.53l5.13-8.69l0.93-16.68l-2.1-4.46l12.36-11.28l0.47-12.45l-16.79-8.22l-20.28-6.34l-9.56-0.94l2.57-5.4l-0.7-8.22l-2.09-0.69l-3.09,6.14l-1.62,2.03l-4.16-1.84l-13.99,4.93l-4.66-5.87l0.75-6.13l-4.4,4.48l-4.86-2.62l-0.49,0.69l0.01,2.13l4.19,2.25l-6.29,6.63l-3.97-0.04l-4.02-4.09l-4.55,0.14l-0.56,4.86l2.61,3.17l-3.08,9.87l-3.6,0.28l-5.73,3.62l-1.4,7.11l4.97,5.32l0.91-1.03l3.49-0.94l2.98,5.02l8.53-3.66l3.31,0.19l2.28,8.07l12.17,3.86l2.1,6.44l5.18,0.62l2.47,6.15l-1.67,5.47l2.18,2.86l-0.32,4.26l5.84-0.55l5.35,6.76l-0.42,4.75l3.17,2.68l-7.6,11.51L314.24,438.85L314.24,438.85z",
      "name": "Brazil"
    },
    "bz": {
      "path": "M204.56,282.4l-0.05,3.65h0.84l2.86-5.34h-1.94L204.56,282.4L204.56,282.4z",
      "name": "Belize"
    },
    "mn": {
      "path": "M673.8,170.17l5.82-7.72l6.99,3.23l4.75,1.27l5.82-5.34l-3.95-2.91l2.6-3.67l7.76,2.74l2.69,4.41l4.86,0.13l2.54-1.89l5.23-0.21l1.14,1.94l8.69,0.44l5.5-5.61l7.61,0.8l-0.44,7.64l3.33,0.76l4.09-1.86l4.33,2.14l-0.1,1.08l-3.14,0.09l-3.27,6.86l-2.54,0.25l-9.88,12.91l-10.09,4.45l-6.31,0.49l-5.24-3.38l-6.7,3.58l-6.6-2.05l-1.87-4.79l-12.5-0.88l-6.4-10.85l-3.11-0.2L673.8,170.17L673.8,170.17z",
      "name": "Mongolia"
    },
    "kp": {
      "path": "M778.28,194.27l1.84,0.77l0.56,6.44l3.65,0.21l3.44-4.03l-1.19-1.06l0.14-4.32l3.16-3.82l-1.61-2.9l1.05-1.2l0.58-3l-1.83-0.83l-1.56,0.79l-1.93,5.86l-3.12-0.27l-3.61,4.26L778.28,194.27L778.28,194.27z",
      "name": "North Korea"
    },
    "kr": {
      "path": "M788.34,198.2l6.18,5.04l1.05,4.88l-0.21,2.62l-3.02,3.4l-2.6,0.14l-2.95-6.37l-1.12-3.04l1.19-0.92l-0.28-1.27l-1.47-0.66L788.34,198.2L788.34,198.2z",
      "name": "South Korea"
    },
    "kz": {
      "path": "M576.69,188.62l4.1-1.75l4.58-0.16l0.32,7h-2.68l-2.05,3.34l2.68,4.45l3.95,2.23l0.36,2.55l1.45-0.48l1.34-1.59l2.21,0.48l1.11,2.23h2.84v-2.86l-1.74-5.09l-0.79-4.13l5.05-2.23l6.79,1.11l4.26,4.29l9.63-0.95l5.37,7.63l6.31,0.32l1.74-2.86l2.21-0.48l0.32-3.18l3.31-0.16l1.74,2.07l1.74-4.13l14.99,2.07l2.52-3.34l-4.26-5.25l5.68-12.4l4.58,0.32l3.16-7.63l-6.31-0.64l-3.63-3.5l-10,1.16l-12.88-12.45l-4.54,4.03l-13.77-6.25l-16.89,8.27l-0.47,5.88l3.95,4.61l-7.7,4.35l-9.99-0.22l-2.09-3.07l-7.83-0.43l-7.42,4.77l-0.16,6.52L576.69,188.62L576.69,188.62z",
      "name": "Kazakhstan"
    },
    "tm": {
      "path": "M593.85,207.59l-0.62,2.63h-4.15v3.56l4.46,2.94l-1.38,4.03v1.86l1.85,0.31l2.46-3.25l5.54-1.24l11.84,4.49l0.15,3.25l6.61,0.62l7.38-7.75l-0.92-2.48l-4.92-1.08l-13.84-8.99l-0.62-3.25h-5.23l-2.31,4.34h-2.31L593.85,207.59L593.85,207.59z",
      "name": "Turkmenistan"
    },
    "uz": {
      "path": "M628.92,219.06l3.08,0.16v-5.27l-2.92-1.7l4.92-6.2h2l2,2.33l5.23-2.01l-7.23-2.48l-0.28-1.5l-1.72,0.42l-1.69,2.94l-7.29-0.24l-5.35-7.57l-9.4,0.93l-4.48-4.44l-6.2-1.05l-4.5,1.83l2.61,8.68l0.03,2.92l1.9,0.04l2.33-4.44l6.2,0.08l0.92,3.41l13.29,8.82l5.14,1.18L628.92,219.06L628.92,219.06z",
      "name": "Uzbekistan"
    },
    "tj": {
      "path": "M630.19,211.84l4.11-5.1h1.55l0.54,1.14l-1.9,1.38v1.14l1.25,0.9l6.01,0.36l1.96-0.84l0.89,0.18l0.6,1.92l3.57,0.36l1.79,3.78l-0.54,1.14l-0.71,0.06l-0.71-1.44l-1.55-0.12l-2.68,0.36l-0.18,2.52l-2.68-0.18l0.12-3.18l-1.96-1.92l-2.98,2.46l0.06,1.62l-2.62,0.9h-1.55l0.12-5.58L630.19,211.84L630.19,211.84z",
      "name": "Tajikistan"
    },
    "kg": {
      "path": "M636.81,199.21l-0.31,2.53l0.25,1.56l8.7,2.92l-7.64,3.08l-0.87-0.72l-1.65,1.06l0.08,0.58l0.88,0.4l5.36,0.14l2.72-0.82l3.49-4.4l4.37,0.76l5.27-7.3l-14.1-1.92l-1.95,4.73l-2.46-2.64L636.81,199.21L636.81,199.21z",
      "name": "Kyrgyz Republic"
    },
    "af": {
      "path": "M614.12,227.05l1.59,12.46l3.96,0.87l0.37,2.24l-2.84,2.37l5.29,4.27l10.28-3.7l0.82-4.38l6.47-4.04l2.48-9.36l1.85-1.99l-1.92-3.34l6.26-3.87l-0.8-1.12l-2.89,0.18l-0.26,2.66l-3.88-0.04l-0.07-3.55l-1.25-1.49l-2.1,1.91l0.06,1.75l-3.17,1.2l-5.85-0.37l-7.6,7.96L614.12,227.05L614.12,227.05z",
      "name": "Afghanistan"
    },
    "pk": {
      "path": "M623.13,249.84l2.6,3.86l-0.25,1.99l-3.46,1.37l-0.25,3.24h3.96l1.36-1.12h7.54l6.8,5.98l0.87-2.87h5.07l0.12-3.61l-5.19-4.98l1.11-2.74l5.32-0.37l7.17-14.95l-3.96-3.11l-1.48-5.23l9.64-0.87l-5.69-8.1l-3.03-0.82l-1.24,1.5l-0.93,0.07l-5.69,3.61l1.86,3.12l-2.1,2.24l-2.6,9.59l-6.43,4.11l-0.87,4.49L623.13,249.84L623.13,249.84z",
      "name": "Pakistan"
    },
    "in": {
      "path": "M670.98,313.01l4.58-2.24l2.72-9.84l-0.12-12.08l15.58-16.82v-3.99l3.21-1.25l-0.12-4.61l-3.46-6.73l1.98-3.61l4.33,3.99l5.56,0.25v2.24l-1.73,1.87l0.37,1l2.97,0.12l0.62,3.36h0.87l2.23-3.99l1.11-10.46l3.71-2.62l0.12-3.61l-1.48-2.87l-2.35-0.12l-9.2,6.08l0.58,3.91l-6.46-0.02l-2.28-2.79l-1.24,0.16l0.42,3.88l-13.97-1l-8.66-3.86l-0.46-4.75l-5.77-3.58l-0.07-7.37l-3.96-4.53l-9.1,0.87l0.99,3.96l4.46,3.61l-7.71,15.78l-5.16,0.39l-0.85,1.9l5.08,4.7l-0.25,4.75l-5.19-0.08l-0.56,2.36l4.31-0.19l0.12,1.87l-3.09,1.62l1.98,3.74l3.83,1.25l2.35-1.74l1.11-3.11l1.36-0.62l1.61,1.62l-0.49,3.99l-1.11,1.87l0.25,3.24L670.98,313.01L670.98,313.01z",
      "name": "India"
    },
    "np": {
      "path": "M671.19,242.56l0.46,4.27l8.08,3.66l12.95,0.96l-0.49-3.13l-8.65-2.38l-7.34-4.37L671.19,242.56L671.19,242.56z",
      "name": "Nepal"
    },
    "bt": {
      "path": "M695.4,248.08l1.55,2.12l5.24,0.04l-0.53-2.9L695.4,248.08L695.4,248.08z",
      "name": "Bhutan"
    },
    "bd": {
      "path": "M695.57,253.11l-1.31,2.37l3.4,6.46l0.1,5.04l0.62,1.35l3.99,0.07l2.26-2.17l1.64,0.99l0.33,3.07l1.31-0.82l0.08-3.92l-1.1-0.13l-0.69-3.33l-2.78-0.1l-0.69-1.85l1.7-2.27l0.03-1.12h-4.94L695.57,253.11L695.57,253.11z",
      "name": "Bangladesh"
    },
    "mm": {
      "path": "M729.44,303.65l-2.77-4.44l2.01-2.82l-1.9-3.49l-1.79-0.34l-0.34-5.86l-2.68-5.19l-0.78,1.24l-1.79,3.04l-2.24,0.34l-1.12-1.47l-0.56-3.95l-1.68-3.16l-6.84-6.45l1.68-1.11l0.31-4.67l2.5-4.2l1.08-10.45l3.62-2.47l0.12-3.81l2.17,0.72l3.42,4.95l-2.54,5.44l1.71,4.27l4.23,1.66l0.77,4.65l5.68,0.88l-1.57,2.71l-7.16,2.82l-0.78,4.62l5.26,6.76l0.22,3.61l-1.23,1.24l0.11,1.13l3.92,5.75l0.11,5.97L729.44,303.65L729.44,303.65z",
      "name": "Myanmar"
    },
    "th": {
      "path": "M730.03,270.47l3.24,4.17v5.07l1.12,0.56l5.15-2.48l1.01,0.34l6.15,7.1l-0.22,4.85l-2.01-0.34l-1.79-1.13l-1.34,0.11l-2.35,3.94l0.45,2.14l1.9,1.01l-0.11,2.37l-1.34,0.68l-4.59-3.16v-2.82l-1.9-0.11l-0.78,1.24l-0.4,12.62l2.97,5.42l5.26,5.07l-0.22,1.47l-2.8-0.11l-2.57-3.83h-2.69l-3.36-2.71l-1.01-2.82l1.45-2.37l0.5-2.14l1.58-2.8l-0.07-6.44l-3.86-5.58l-0.16-0.68l1.25-1.26l-0.29-4.43l-5.14-6.51l0.6-3.75L730.03,270.47L730.03,270.47z",
      "name": "Thailand"
    },
    "kh": {
      "path": "M740.48,299.47l4.09,4.37l7.61-5.64l0.67-8.9l-3.93,2.71l-2.04-1.14l-2.77-0.37l-1.55-1.09l-0.75,0.04l-2.03,3.33l0.33,1.54l2.06,1.15l-0.25,3.13L740.48,299.47L740.48,299.47z",
      "name": "Cambodia"
    },
    "la": {
      "path": "M735.47,262.93l-2.42,1.23l-2.01,5.86l3.36,4.28l-0.56,4.73l0.56,0.23l5.59-2.71l7.5,8.38l-0.18,5.28l1.63,0.88l4.03-3.27l-0.33-2.59l-11.63-11.05l0.11-1.69l1.45-1.01l-1.01-2.82l-4.81-0.79L735.47,262.93L735.47,262.93z",
      "name": "Lao People's Democratic Republic"
    },
    "vn": {
      "path": "M745.06,304.45l1.19,1.87l0.22,2.14l3.13,0.34l3.8-5.07l3.58-1.01l1.9-5.18l-0.89-8.34l-3.69-5.07l-3.89-3.11l-4.95-8.5l3.55-5.94l-5.08-5.83l-4.07-0.18l-3.66,1.97l1.09,4.71l4.88,0.86l1.31,3.63l-1.72,1.12l0.11,0.9l11.45,11.2l0.45,3.29l-0.69,10.4L745.06,304.45L745.06,304.45z",
      "name": "Vietnam"
    },
    "ge": {
      "path": "M555.46,204.16l3.27,4.27l4.08,1.88l2.51-0.01l4.31-1.17l1.08-1.69l-12.75-4.77L555.46,204.16L555.46,204.16z",
      "name": "Georgia"
    },
    "am": {
      "path": "M569.72,209.89l4.8,6.26l-1.41,1.65l-3.4-0.59l-4.22-3.78l0.23-2.48L569.72,209.89L569.72,209.89z",
      "name": "Armenia"
    },
    "az": {
      "path": "M571.41,207.72l-1.01,1.72l4.71,6.18l1.64-0.53l2.7,2.83l1.17-4.96l2.93,0.47l-0.12-1.42l-4.82-4.22l-0.92,2.48L571.41,207.72L571.41,207.72z",
      "name": "Azerbaijan"
    },
    "ir": {
      "path": "M569.65,217.95l-1.22,1.27l0.12,2.01l1.52,2.13l5.39,5.9l-0.82,2.36h-0.94l-0.47,2.36l3.05,3.9l2.81,0.24l5.63,7.79l3.16,0.24l2.46,1.77l0.12,3.54l9.73,5.67h3.63l2.23-1.89l2.81-0.12l1.64,3.78l10.51,1.46l0.31-3.86l3.48-1.26l0.16-1.38l-2.77-3.78l-6.17-4.96l3.24-2.95l-0.23-1.3l-4.06-0.63l-1.72-13.7l-0.2-3.15l-11.01-4.21l-4.88,1.1l-2.73,3.35l-2.42-0.16l-0.7,0.59l-5.39-0.35l-6.8-4.96l-2.53-2.77l-1.16,0.28l-2.09,2.39L569.65,217.95L569.65,217.95z",
      "name": "Iran"
    },
    "tr": {
      "path": "M558.7,209.19l-2.23,2.36l-8.2-0.24l-4.92-2.95l-4.8-0.12l-5.51,3.9l-5.16,0.24l-0.47,2.95h-5.86l-2.34,2.13v1.18l1.41,1.18v1.3l-0.59,1.54l0.59,1.3l1.88-0.94l1.88,2.01l-0.47,1.42l-0.7,0.95l1.05,1.18l5.16,1.06l3.63-1.54v-2.24l1.76,0.35l4.22,2.48l4.57-0.71l1.99-1.89l1.29,0.47v2.13h1.76l1.52-2.95l13.36-1.42l5.83-0.71l-1.54-2.02l-0.03-2.73l1.17-1.4l-4.26-3.42l0.23-2.95h-2.34L558.7,209.19L558.7,209.19M523.02,209.7l-0.16,3.55l3.1-0.95l1.42-0.95l-0.42-1.54l-1.47-1.17L523.02,209.7L523.02,209.7z",
      "name": "Turkey"
    },
    "om": {
      "path": "M598.38,280.84l7.39-4.26l1.31-6.25l-1.62-0.93l0.67-6.7l1.41-0.82l1.51,2.37l8.99,4.7v2.61l-10.89,16.03l-5.01,0.17L598.38,280.84L598.38,280.84z",
      "name": "Oman"
    },
    "ae": {
      "path": "M594.01,264.94l0.87,3.48l9.86,0.87l0.69-7.14l1.9-1.04l0.52-2.61l-3.11,0.87l-3.46,5.23L594.01,264.94L594.01,264.94z",
      "name": "United Arab Emirates"
    },
    "qa": {
      "path": "M592.63,259.02l-0.52,4.01l1.54,1.17l1.4-0.13l0.52-5.05l-1.21-0.87L592.63,259.02L592.63,259.02z",
      "name": "Qatar"
    },
    "kw": {
      "path": "M583.29,247.17l-2.25-1.22l-1.56,1.57l0.17,3.14l3.63,1.39L583.29,247.17L583.29,247.17z",
      "name": "Kuwait"
    },
    "sa": {
      "path": "M584,253.24l7.01,9.77l2.26,1.8l1.01,4.38l10.79,0.85l1.22,0.64l-1.21,5.4l-7.09,4.18l-10.37,3.14l-5.53,5.4l-6.57-3.83l-3.98,3.48L566,279.4l-3.8-1.74l-1.38-2.09v-4.53l-13.83-16.72l-0.52-2.96h3.98l4.84-4.18l0.17-2.09l-1.38-1.39l2.77-2.26l5.88,0.35l10.03,8.36l5.92-0.27l0.38,1.46L584,253.24L584,253.24z",
      "name": "Saudi Arabia"
    },
    "sy": {
      "path": "M546.67,229.13l-0.35,2.54l2.82,1.18l-0.12,7.04l2.82-0.06l2.82-2.13l1.06-0.18l6.4-5.09l1.29-7.39l-12.79,1.3l-1.35,2.96L546.67,229.13L546.67,229.13z",
      "name": "Syrian Arab Republic"
    },
    "iq": {
      "path": "M564.31,225.03l-1.56,7.71l-6.46,5.38l0.41,2.54l6.31,0.43l10.05,8.18l5.62-0.16l0.15-1.89l2.06-2.21l2.88,1.63l0.38-0.36l-5.57-7.41l-2.64-0.16l-3.51-4.51l0.7-3.32l1.07-0.14l0.37-1.47l-4.78-5.03L564.31,225.03L564.31,225.03z",
      "name": "Iraq"
    },
    "jo": {
      "path": "M548.9,240.78l-2.46,8.58l-0.11,1.31h3.87l4.33-3.82l0.11-1.45l-1.77-1.81l3.17-2.63l-0.46-2.44l-0.87,0.2l-2.64,1.89L548.9,240.78L548.9,240.78z",
      "name": "Jordan"
    },
    "lb": {
      "path": "M546.2,232.44l0.06,1.95l-0.82,2.96l2.82,0.24l0.18-4.2L546.2,232.44L546.2,232.44z",
      "name": "Lebanon"
    },
    "il": {
      "path": "M545.32,238.06l-1.58,5.03l2.05,6.03l2.35-8.81v-1.89L545.32,238.06L545.32,238.06z",
      "name": "Israel"
    },
    "cy": {
      "path": "M543.21,229.84l1.23,0.89l-3.81,3.61l-1.82-0.06l-1.35-0.95l0.18-1.77l2.76-0.18L543.21,229.84L543.21,229.84z",
      "name": "Cyprus"
    },
    "gb": {
      "path": "M446.12,149.08l-1.83,2.77l0.73,1.11h4.22v1.85l-1.1,1.48l0.73,3.88l2.38,4.62l1.83,4.25l2.93,1.11l1.28,2.22l-0.18,2.03l-1.83,1.11l-0.18,0.92l1.28,0.74l-1.1,1.48l-2.57,1.11l-4.95-0.55l-7.71,3.51l-2.57-1.29l7.34-4.25l-0.92-0.55l-3.85-0.37l2.38-3.51l0.37-2.96l3.12-0.37l-0.55-5.73l-3.67-0.18l-1.1-1.29l0.18-4.25l-2.2,0.18l2.2-7.39l4.04-2.96L446.12,149.08L446.12,149.08M438.42,161.47l-3.3,0.37l-0.18,2.96l2.2,1.48l2.38-0.55l0.92-1.66L438.42,161.47L438.42,161.47z",
      "name": "United Kingdom"
    },
    "ie": {
      "path": "M439.51,166.55l-0.91,6l-8.07,2.96h-2.57l-1.83-1.29v-1.11l4.04-2.59l-1.1-2.22l0.18-3.14l3.49,0.18l1.6-3.76l-0.21,3.34l2.71,2.15L439.51,166.55L439.51,166.55z",
      "name": "Ireland"
    },
    "se": {
      "path": "M497.72,104.58l1.96,1.81h3.67l2.02,3.88l0.55,6.65l-4.95,3.51v3.51l-3.49,4.81l-2.02,0.18l-2.75,4.62l0.18,4.44l4.77,3.51l-0.37,2.03l-1.83,2.77l-2.75,2.4l0.18,7.95l-4.22,1.48l-1.47,3.14h-2.02l-1.1-5.54l-4.59-7.04l3.77-6.31l0.26-15.59l2.6-1.43l0.63-8.92l7.41-10.61L497.72,104.58L497.72,104.58M498.49,150.17l-2.11,1.67l1.06,2.45l1.87-1.82L498.49,150.17L498.49,150.17z",
      "name": "Sweden"
    },
    "fi": {
      "path": "M506.79,116.94l2.07,0.91l1.28,2.4l-1.28,1.66l-6.42,7.02l-1.1,3.7l1.47,5.36l4.95,3.7l6.6-3.14l5.32-0.74l4.95-7.95l-3.67-8.69l-3.49-8.32l0.55-5.36l-2.2-0.37l-0.57-3.91l-2.96-4.83l-3.28,2.27l-1.29,5.27l-3.48-2.09l-4.84-1.18l-1.08,1.26l1.86,1.68l3.39-0.06l2.73,4.41L506.79,116.94L506.79,116.94z",
      "name": "Finland"
    },
    "lv": {
      "path": "M518.07,151.37l-6.85-1.11l0.15,3.83l6.35,3.88l2.6-0.76l-0.15-2.92L518.07,151.37L518.07,151.37z",
      "name": "Latvia"
    },
    "lt": {
      "path": "M510.81,154.7l-2.15-0.05l-2.95,2.82h-2.5l0.15,3.53l-1.5,2.77l5.4,0.05l1.55-0.2l1.55,1.87l3.55-0.15l3.4-4.33l-0.2-2.57L510.81,154.7L510.81,154.7z",
      "name": "Lithuania"
    },
    "by": {
      "path": "M510.66,166.29l1.5,2.47l-0.6,1.97l0.1,1.56l0.55,1.87l3.1-1.76l3.85,0.1l2.7,1.11h6.85l2-4.79l1.2-1.81v-1.21l-4.3-6.05l-3.8-1.51l-3.1-0.35l-2.7,0.86l0.1,2.72l-3.75,4.74L510.66,166.29L510.66,166.29z",
      "name": "Belarus"
    },
    "pl": {
      "path": "M511.46,174.76l0.85,1.56l0.2,1.66l-0.7,1.61l-1.6,3.08l-1.35,0.61l-1.75-0.76l-1.05,0.05l-2.55,0.96l-2.9-0.86l-4.7-3.33l-4.6-2.47l-1.85-2.82l-0.35-6.65l3.6-3.13l4.7-1.56l1.75-0.2l-0.7,1.41l0.45,0.55l7.91,0.15l1.7-0.05l2.8,4.29l-0.7,1.76l0.3,2.07L511.46,174.76L511.46,174.76z",
      "name": "Poland"
    },
    "it": {
      "path": "M477.56,213.38l-2.65,1.34l0.35,5.17l2.12,0.36l1.59-1.52v-4.9L477.56,213.38L477.56,213.38M472.27,196.98l-0.62,1.57l0.17,1.71l2.39,2.79l3.76-0.13l8.3,9.64l5.18,1.5l3.06,2.89l0.73,6.59l1.64-0.96l1.42-3.59l-0.35-2.58l2.43-0.22l0.35-1.46l-6.85-3.28l-6.5-6.39l-2.59-3.82l-0.63-3.63l3.31-0.79l-0.85-2.39l-2.03-1.71l-1.75-0.08l-2.44,0.67l-2.3,3.22l-1.39,0.92l-2.15-1.32L472.27,196.98L472.27,196.98M492.44,223.02l-1.45-0.78l-4.95,0.78l0.17,1.34l4.45,2.24l0.67,0.73l1.17,0.17L492.44,223.02L492.44,223.02z",
      "name": "Italy"
    },
    "fr": {
      "path": "M477.83,206.96l-1.95,1.96l-0.18,1.78l1.59,0.98l0.62-0.09l0.35-2.59L477.83,206.96L477.83,206.96M460.4,178.7l-2.21,0.54l-4.42,4.81l-1.33,0.09l-1.77-1.25l-1.15,0.27l-0.88,2.76l-6.46,0.18l0.18,1.43l4.42,2.94l5.13,4.1l-0.09,4.9l-2.74,4.81l5.93,2.85l6.02,0.18l1.86-2.14l3.8,0.09l1.06,0.98l3.8-0.27l1.95-2.5l-2.48-2.94l-0.18-1.87l0.53-2.05l-1.24-1.78l-2.12,0.62l-0.27-1.6l4.69-5.17v-3.12l-3.1-1.78l-1.59-0.27L460.4,178.7L460.4,178.7z",
      "name": "France"
    },
    "nl": {
      "path": "M470.09,168.27l-4.53,2.23l0.96,0.87l0.1,2.23l-0.96-0.19l-1.06-1.65l-2.53,4.01l3.89,0.81l1.45,1.53l0.77,0.02l0.51-3.46l2.45-1.03L470.09,168.27L470.09,168.27z",
      "name": "Netherlands"
    },
    "be": {
      "path": "M461.61,176.52l-0.64,1.6l6.88,4.54l1.98,0.47l0.07-2.15l-1.73-1.94h-1.06l-1.45-1.65L461.61,176.52L461.61,176.52z",
      "name": "Belgium"
    },
    "de": {
      "path": "M471.14,167.88l3.57-0.58v-2.52l2.99-0.49l1.64,1.65l1.73,0.19l2.7-1.17l2.41,0.68l2.12,1.84l0.29,6.89l2.12,2.82l-2.79,0.39l-4.63,2.91l0.39,0.97l4.14,3.88l-0.29,1.94l-3.85,1.94l-3.57,0.1l-0.87,1.84h-1.83l-0.87-1.94l-3.18-0.78l-0.1-3.2l-2.7-1.84l0.29-2.33l-1.83-2.52l0.48-3.3l2.5-1.17L471.14,167.88L471.14,167.88z",
      "name": "Germany"
    },
    "dk": {
      "path": "M476.77,151.5l-4.15,4.59l-0.15,2.99l1.89,4.93l2.96-0.56l-0.37-4.03l2.04-2.28l-0.04-1.79l-1.44-3.73L476.77,151.5L476.77,151.5M481.44,159.64l-0.93-0.04l-1.22,1.12l0.15,1.75l2.89,0.08l0.15-1.98L481.44,159.64L481.44,159.64z",
      "name": "Denmark"
    },
    "ch": {
      "path": "M472.91,189.38l-4.36,4.64l0.09,0.47l1.79-0.56l1.61,2.24l2.72-0.96l1.88,1.46l0.77-0.44l2.32-3.64l-0.59-0.56l-2.29-0.06l-1.11-2.27L472.91,189.38L472.91,189.38z",
      "name": "Switzerland"
    },
    "cz": {
      "path": "M488.43,184.87h2.97h1.46l2.37,1.69l4.39-3.65l-4.26-3.04l-4.22-2.04l-2.89,0.52l-3.92,2.52L488.43,184.87L488.43,184.87z",
      "name": "Czech Republic"
    },
    "sk": {
      "path": "M495.84,187.13l0.69,0.61l0.09,1.04l7.63-0.17l5.64-2.43l-0.09-2.47l-1.08,0.48l-1.55-0.83l-0.95-0.04l-2.5,1l-3.4-0.82L495.84,187.13L495.84,187.13z",
      "name": "Slovakia"
    },
    "at": {
      "path": "M480.63,190.12l-0.65,1.35l0.56,0.96l2.33-0.48h1.98l2.15,1.82l4.57-0.83l3.36-2l0.86-1.35l-0.13-1.74l-3.02-2.26l-4.05,0.04l-0.34,2.3l-4.26,2.08L480.63,190.12L480.63,190.12z",
      "name": "Austria"
    },
    "hu": {
      "path": "M496.74,189.6l-1.16,1.82l0.09,2.78l1.85,0.95l5.69,0.17l7.93-6.68l0.04-1.48l-0.86-0.43l-5.73,2.6L496.74,189.6L496.74,189.6z",
      "name": "Hungary"
    },
    "si": {
      "path": "M494.8,191.99l-2.54,1.52l-4.74,1.04l0.95,2.74l3.32,0.04l3.06-2.56L494.8,191.99L494.8,191.99z",
      "name": "Slovenia"
    },
    "hr": {
      "path": "M495.62,195.16l-3.53,2.91h-3.58l-0.43,2.52l1.64,0.43l0.82-1.22l1.29,1.13l1.03,3.6l7.07,3.3l0.7-0.8l-7.17-7.4l0.73-1.35l6.81-0.26l0.69-2.17l-4.44,0.13L495.62,195.16L495.62,195.16z",
      "name": "Croatia"
    },
    "ba": {
      "path": "M494.8,198.94l-0.37,0.61l6.71,6.92l2.46-3.62l-0.09-1.43l-2.15-2.61L494.8,198.94L494.8,198.94z",
      "name": "Bosnia and Herzegovina"
    },
    "mt": {
      "path": "M492.61,230.47l-1.67,0.34l0.06,1.85l1.5,0.5l0.67-0.56L492.61,230.47L492.61,230.47z",
      "name": "Malta"
    },
    "ua": {
      "path": "M515.57,173.15l-2.9,1.63l0.72,3.08l-2.68,5.65l0.02,2.49l1.26,0.8l8.08,0.4l2.26-1.87l2.42,0.81l3.47,4.63l-2.54,4.56l3.02,0.88l3.95-4.55l2.26,0.41l2.1,1.46l-1.85,2.44l2.5,3.9h2.66l1.37-2.6l2.82-0.57l0.08-2.11l-5.24-0.81l0.16-2.27h5.08l5.48-4.39l2.42-2.11l0.4-6.66l-10.8-0.97l-4.43-6.25l-3.06-1.05l-3.71,0.16l-1.67,4.13l-7.6,0.1l-2.47-1.14L515.57,173.15L515.57,173.15z",
      "name": "Ukraine"
    },
    "md": {
      "path": "M520.75,187.71l3.1,4.77l-0.26,2.7l1.11,0.05l2.63-4.45l-3.16-3.92l-1.79-0.74L520.75,187.71L520.75,187.71z",
      "name": "Moldova"
    },
    "ro": {
      "path": "M512.18,187.6l-0.26,1.48l-5.79,4.82l4.84,7.1l3.1,2.17h5.58l1.84-1.54l2.47-0.32l1.84,1.11l3.26-3.71l-0.63-1.86l-3.31-0.85l-2.26-0.11l0.11-3.18l-3-4.72L512.18,187.6L512.18,187.6z",
      "name": "Romania"
    },
    "rs": {
      "path": "M505.55,194.54l-2.05,1.54h-1l-0.68,2.12l2.42,2.81l0.16,2.23l-3,4.24l0.42,1.27l1.74,0.32l1.37-1.86l0.74-0.05l1.26,1.22l3.84-1.17l-0.32-5.46L505.55,194.54L505.55,194.54z",
      "name": "Serbia"
    },
    "bg": {
      "path": "M511.44,202.39l0.16,4.98l1.68,3.5l6.31,0.11l2.84-2.01l2.79-1.11l-0.68-3.18l0.63-1.7l-1.42-0.74l-1.95,0.16l-1.53,1.54l-6.42,0.05L511.44,202.39L511.44,202.39z",
      "name": "Bulgaria"
    },
    "al": {
      "path": "M504.02,209.76v4.61l1.32,2.49l0.95-0.11l1.63-2.97l-0.95-1.33l-0.37-3.29l-1.26-1.17L504.02,209.76L504.02,209.76z",
      "name": "Albania"
    },
    "mk": {
      "path": "M510.92,208.01l-3.37,1.11l0.16,2.86l0.79,1.01l4-1.86L510.92,208.01L510.92,208.01z",
      "name": "Macedonia"
    },
    "gr": {
      "path": "M506.71,217.6l-0.11,1.33l4.63,2.33l2.21,0.85l-1.16,1.22l-2.58,0.26l-0.37,1.17l0.89,2.01l2.89,1.54l1.26,0.11l0.16-3.45l1.89-2.28l-5.16-6.1l0.68-2.07l1.21-0.05l1.84,1.48l1.16-0.58l0.37-2.07l5.42,0.05l0.21-3.18l-2.26,1.59l-6.63-0.16l-4.31,2.23L506.71,217.6L506.71,217.6M516.76,230.59l1.63,0.05l0.68,1.01h2.37l1.58-0.58l0.53,0.64l-1.05,1.38l-4.63,0.16l-0.84-1.11l-0.89-0.53L516.76,230.59L516.76,230.59z",
      "name": "Greece"
    }
  }
});
WS = WS || {};
WS.LS = WS.LS || {};
WS.LS.Map = function() {
  return {
    map: null,
    summary: null,
    colorsCodes: {
      Upcoming: "#F9B820",
      Live: "#8DC63F",
      Finished: "#666666"
    },
    init: function(config) {
      this.map = $(config.view.renderTo);
      this.summary = $(config.view.renderTo + "-summary");
      this.bindEvents();
    },
    load: function(data) {
      if (!this.map || !data) {
        return;
      }
      var regions = WS.LS.Map.Model(data);
      this.map.vectorMap({
        values: regions,
        colors: this.getColorsForRegions(regions),
        hoverOpacity: 0.7,
        hoverColor: false,
        zoom: true
      });
      var summaryModel = WS.LS.Map.Model.Summary(regions);
      this.summary.html(WS.LS.Map.View.Summary(summaryModel));
    },
    bindEvents: function() {},
    getColorsForRegions: function(regions) {
      var colors = {};
      for (var region in regions) {
        colors[regions[region].RegionCode] = 0 < regions[region].Live ? this.colorsCodes.Live : regions[region].Finished == regions[region].All ? this.colorsCodes.Finished : this.colorsCodes.Upcoming;
      }
      return colors;
    }
  };
};
WS.LS.Map.Model = function(data) {
  if (!data) {
    return;
  }
  var customRegionCodeMapping = {
    "gb-sct": "gb",
    "gb-eng": "gb",
    "gb-wls": "gb",
    "gb-nir": "gb"
  };
  var customRegionNameMapping = {
    "gb": "United Kingdom"
  };
  var model = {};
  var stages = data[0];
  var matches = data[1];
  if (!matches) {
    return;
  }
  for (var i = 0; i < matches.length; i++) {
    var stage = getStage(matches[i][0]);
    if (!stage) {
      continue;
    }
    var regionCode = customRegionCodeMapping[stage.RegionCode] ? customRegionCodeMapping[stage.RegionCode] : stage.RegionCode;
    if (!model[regionCode]) {
      model[regionCode] = {
        RegionName: customRegionNameMapping[regionCode] ? customRegionNameMapping[regionCode] : stage.RegionName,
        RegionCode: regionCode,
        HasSubRegions: (null != customRegionCodeMapping[stage.RegionCode]),
        Tournaments: {},
        All: 0,
        Upcoming: 0,
        Live: 0,
        Finished: 0
      };
    }
    if (!model[regionCode].Tournaments[stage.TournamentId]) {
      model[regionCode].Tournaments[stage.TournamentId] = stage;
      stage.Matches = {
        All: 0,
        Upcoming: 0,
        Live: 0,
        Finished: 0
      };
    }
    model[regionCode].Tournaments[stage.TournamentId].Matches.All++;
    model[regionCode].All++;
    if (matches[i][2] == "1") {
      model[regionCode].Tournaments[stage.TournamentId].Matches.Finished++;
      model[regionCode].Finished++;
    }
    if (matches[i][2] == "2") {
      model[regionCode].Tournaments[stage.TournamentId].Matches.Live++;
      model[regionCode].Live++;
    }
    if (matches[i][2] == "4") {
      model[regionCode].Tournaments[stage.TournamentId].Matches.Upcoming++;
      model[regionCode].Upcoming++;
    }
  }
  function getStage(stageId) {
    var ft = $.cookie("ft") || "";
    var tournamentIds = ((0 < ft.length) ? ft.split(",") : []);
    for (var j = 0; j < stages.length; j++) {
      if (stages[j][0] == stageId) {
        return {
          TournamentId: stages[j][4],
          RegionId: stages[j][1],
          RegionCode: stages[j][2],
          RegionName: stages[j][3],
          Name: 12 == stages[j][4] ? "UEFA Champions League" : stages[j][7],
          IsInternational: 0 != stages[j][10],
          IsDetailedCoverage: 0 != stages[j][9],
          IsFavourite: -1 != $.inArray(stages[j][4].toString(), tournamentIds)
        };
      }
    }
  }
  return model;
};
WS.LS.Map.Model.Summary = function(regions) {
  function addTournamentToGroup(group, tournament) {
    group.Matches.All += tournament.Matches.All;
    group.Matches.Live += tournament.Matches.Live;
    group.Matches.Upcoming += tournament.Matches.Upcoming;
    group.Matches.Finished += tournament.Matches.Finished;
    if (group.Tournaments) {
      group.Tournaments.push(tournament);
    }
  }
  var result = {
    All: {
      Matches: {
        All: 0,
        Live: 0,
        Upcoming: 0,
        Finished: 0
      }
    },
    Detailed: {
      Matches: {
        All: 0,
        Live: 0,
        Upcoming: 0,
        Finished: 0
      },
      Tournaments: []
    },
    International: {
      Matches: {
        All: 0,
        Live: 0,
        Upcoming: 0,
        Finished: 0
      }
    },
    Favourites: {
      Matches: {
        All: 0,
        Live: 0,
        Upcoming: 0,
        Finished: 0
      },
      Tournaments: []
    }
  };
  for (var r in regions) {
    var region = regions[r];
    for (var t in region.Tournaments) {
      var tournament = region.Tournaments[t];
      addTournamentToGroup(result.All, tournament);
      if (tournament.IsDetailedCoverage) {
        addTournamentToGroup(result.Detailed, tournament);
      }
      if (tournament.IsInternational) {
        addTournamentToGroup(result.International, tournament);
      }
      if (tournament.IsFavourite && !tournament.IsDetailedCoverage) {
        addTournamentToGroup(result.Favourites, tournament);
      }
    }
  }
  return result;
};
WS.LS.Map.View = {};
WS.LS.Map.View.Summary = function(model) {
  if (!model) {
    return;
  }
  var t = [];
  t.push(WS.LS.Map.View.Summary.Region(model.All, "All Matches"));
  t.push(WS.LS.Map.View.Summary.Region(model.Detailed, "Detailed"));
  t.push(WS.LS.Map.View.Summary.Region(model.International, "International"));
  t.push(WS.LS.Map.View.Summary.Region(model.Favourites, "Favourites"));
  return t.join("");
};
WS.LS.Map.View.Summary.Region = function(region, title) {
  if (!region) {
    return;
  }
  var t = [];
  t.push('<div class="livescore-map-summary-group {0}">'.format(0 == region.Matches.All ? "has-no-matches" : ""));
  t.push('<label><a href="Matches">{0}</a></label> {1}'.format(title, WS.LS.Map.View.MatchesInfo(region)));
  t.push('<div class="clear"></div>');
  if (region.Tournaments) {
    for (var i = 0; i < region.Tournaments.length; i++) {
      t.push(WS.LS.Map.View.Tournament(region.Tournaments[i], true));
    }
  }
  t.push("</div>");
  return t.join("");
};
WS.LS.Map.View.Region = function(region, isSummary, showFlag) {
  if (!region) {
    return;
  }
  var t = [];
  t.push('<div class="livescore-map-region">');
  if (region.RegionCode && showFlag) {
    t.push('<span class="iconize iconize-icon-left">');
    t.push('<span class="ui-icon country flg-' + region.RegionCode + '"></span>');
    t.push("<label>" + region.RegionName + "</label>");
    t.push("</span>");
  } else {
    t.push("<label>" + region.RegionName + "</label>");
  }
  t.push("</div>");
  if (region.Tournaments) {
    for (var tournament in region.Tournaments) {
      t.push(WS.LS.Map.View.Tournament(region.Tournaments[tournament], region.HasSubRegions));
    }
  }
  return t.join("");
};
WS.LS.Map.View.Tournament = function(tournament, showFlag) {
  if (!tournament) {
    return;
  }
  var t = [];
  t.push('<div class="livescore-map-tournament">');
  if (showFlag) {
    t.push('<label class="iconize">');
    t.push('<a title="{0}" href="/Regions/{1}/Tournaments/{2}" class="pt iconize iconize-icon-left">{3}<span class="ui-icon country flg-{4}"></span></a>'.format(tournament.RegionName, tournament.RegionId, tournament.TournamentId, tournament.Name, tournament.RegionCode));
    t.push("</label>");
    t.push(WS.LS.Map.View.MatchesInfo(tournament));
    t.push('<div class="clear"></div>');
  } else {
    t.push("<label>");
    t.push('<a title="{0}" href="/Regions/{1}/Tournaments/{2}">{3}</a>'.format(tournament.RegionName, tournament.RegionId, tournament.TournamentId, tournament.Name, tournament.RegionCode));
    t.push("</label>");
    t.push(WS.LS.Map.View.MatchesInfo(tournament));
    t.push('<div class="clear"></div>');
  }
  t.push("</div>");
  return t.join("");
};
WS.LS.Map.View.MatchesInfo = function(group) {
  if (!group.Matches) {
    return;
  }
  var t = [];
  t.push('<span class="livescore-map-matches-info">');
  if (0 != group.Matches.Finished) {
    t.push('<span title="Finished matches" class="match-count rc finished">' + group.Matches.Finished + "</span>");
  }
  if (0 != group.Matches.Live) {
    t.push('<span title="Live matches" class="match-count rc live">' + group.Matches.Live + " live</span>");
  }
  if (0 != group.Matches.Upcoming) {
    t.push('<span title="Upcoming matches" class="match-count rc upcoming">' + group.Matches.Upcoming + "</span>");
  }
  if (0 == group.Matches.All) {
    t.push('<span title="No matches" class="match-count rc zero">0</span>');
  }
  t.push("</span>");
  return t.join("");
};
/*
 * Add to Homescreen v2.0.7 ~ Copyright (c) 2013 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var addToHome = (function(w) {
  var nav = w.navigator,
      isIDevice = "platform" in nav && (/iphone|ipod|ipad/gi).test(nav.platform),
      isIPad, isRetina, isSafari, isStandalone, OSVersion, startX = 0,
      startY = 0,
      lastVisit = 0,
      isExpired, isSessionActive, isReturningVisitor, balloon, overrideChecks, positionInterval, closeTimeout, options = {
      autostart: true,
      returningVisitor: false,
      animationIn: "drop",
      animationOut: "fade",
      startDelay: 2000,
      lifespan: 15000,
      bottomOffset: 14,
      expire: 0,
      message: "",
      touchIcon: false,
      arrow: true,
      hookOnLoad: true,
      closeButton: true,
      iterations: 100
      },
      intl = {
      ar: '<span dir="rtl">Ù‚Ù… Ø¨ØªØ«Ø¨ÙŠØª Ù‡Ø°Ø§ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø¹Ù„Ù‰ <span dir="ltr">%device:</span>Ø§Ù†Ù‚Ø±<span dir="ltr">%icon</span> ØŒ<strong>Ø«Ù… Ø§Ø¶ÙÙ‡ Ø§Ù„Ù‰ Ø§Ù„Ø´Ø§Ø´Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©.</strong></span>',
      ca_es: "Per instalÂ·lar aquesta aplicaciÃ³ al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d'inici</strong>.",
      cs_cz: "Pro instalaci aplikace na VÃ¡Å¡ %device, stisknÄ›te %icon a v nabÃ­dce <strong>PÅ™idat na plochu</strong>.",
      da_dk: "TilfÃ¸j denne side til din %device: tryk pÃ¥ %icon og derefter <strong>FÃ¸j til hjemmeskÃ¦rm</strong>.",
      de_de: "Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.",
      el_gr: "Î•Î³ÎºÎ±Ï„Î±ÏƒÏ„Î®ÏƒÎµÏ„Îµ Î±Ï…Ï„Î®Î½ Ï„Î·Î½ Î•Ï†Î±ÏÎ¼Î¿Î³Î® ÏƒÏ„Î®Î½ ÏƒÏ…ÏƒÎºÎµÏ…Î® ÏƒÎ±Ï‚ %device: %icon Î¼ÎµÏ„Î¬ Ï€Î±Ï„Î¬Ï„Îµ <strong>Î ÏÎ¿ÏƒÎ¸Î®ÎºÎ· ÏƒÎµ Î‘Ï†ÎµÏ„Î·ÏÎ¯Î±</strong>.",
      en_us: "Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.",
      es_es: "Para instalar esta app en su %device, pulse %icon y seleccione <strong>AÃ±adir a pantalla de inicio</strong>.",
      fi_fi: "Asenna tÃ¤mÃ¤ web-sovellus laitteeseesi %device: paina %icon ja sen jÃ¤lkeen valitse <strong>LisÃ¤Ã¤ Koti-valikkoon</strong>.",
      fr_fr: "Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter Ã  l'Ã©cran d'accueil</strong>.",
      he_il: '<span dir="rtl">×”×ª×§×Ÿ ××¤×œ×™×§×¦×™×” ×–×• ×¢×œ ×”-%device ×©×œ×š: ×”×§×© %icon ×•××– <strong>×”×•×¡×£ ×œ×ž×¡×š ×”×‘×™×ª</strong>.</span>',
      hr_hr: "Instaliraj ovu aplikaciju na svoj %device: klikni na %icon i odaberi <strong>Dodaj u poÄetni zaslon</strong>.",
      hu_hu: "TelepÃ­tse ezt a web-alkalmazÃ¡st az Ã–n %device-jÃ¡ra: nyomjon a %icon-ra majd a <strong>FÅ‘kÃ©pernyÅ‘hÃ¶z adÃ¡s</strong> gombra.",
      it_it: "Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.",
      ja_jp: "ã“ã®ã‚¦ã‚§ãƒ–ã‚¢ãƒ—ãƒªã‚’ã‚ãªãŸã®%deviceã«ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«ã™ã‚‹ã«ã¯%iconã‚’ã‚¿ãƒƒãƒ—ã—ã¦<strong>ãƒ›ãƒ¼ãƒ ç”»é¢ã«è¿½åŠ </strong>ã‚’é¸ã‚“ã§ãã ã•ã„ã€‚",
      ko_kr: '%deviceì— ì›¹ì•±ì„ ì„¤ì¹˜í•˜ë ¤ë©´ %iconì„ í„°ì¹˜ í›„ "í™ˆí™”ë©´ì— ì¶”ê°€"ë¥¼ ì„ íƒí•˜ì„¸ìš”',
      nb_no: "Installer denne appen pÃ¥ din %device: trykk pÃ¥ %icon og deretter <strong>Legg til pÃ¥ Hjem-skjerm</strong>",
      nl_nl: "Installeer deze webapp op uw %device: tik %icon en dan <strong>Voeg toe aan beginscherm</strong>.",
      pl_pl: "Aby zainstalowaÄ‡ tÄ™ aplikacje na %device: naciÅ›nij %icon a nastÄ™pnie <strong>Dodaj jako ikonÄ™</strong>.",
      pt_br: "Instale este aplicativo em seu %device: aperte %icon e selecione <strong>Adicionar Ã  Tela Inicio</strong>.",
      pt_pt: "Para instalar esta aplicaÃ§Ã£o no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrÃ£ principal</strong>.",
      ru_ru: "Ð£ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚Ðµ ÑÑ‚Ð¾ Ð²ÐµÐ±-Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð½Ð° Ð²Ð°Ñˆ %device: Ð½Ð°Ð¶Ð¼Ð¸Ñ‚Ðµ %icon, Ð·Ð°Ñ‚ÐµÐ¼ <strong>Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ Ð² Â«Ð”Ð¾Ð¼Ð¾Ð¹Â»</strong>.",
      sv_se: "LÃ¤gg till denna webbapplikation pÃ¥ din %device: tryck pÃ¥ %icon och dÃ¤refter <strong>LÃ¤gg till pÃ¥ hemskÃ¤rmen</strong>.",
      th_th: "à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹€à¸§à¹‡à¸šà¹à¸­à¸žà¸¯ à¸™à¸µà¹‰à¸šà¸™ %device à¸‚à¸­à¸‡à¸„à¸¸à¸“: à¹à¸•à¸° %icon à¹à¸¥à¸° <strong>à¹€à¸žà¸´à¹ˆà¸¡à¸—à¸µà¹ˆà¸«à¸™à¹‰à¸²à¸ˆà¸­à¹‚à¸®à¸¡</strong>",
      tr_tr: "Bu uygulamayÄ± %device'a eklemek iÃ§in %icon simgesine sonrasÄ±nda <strong>Ana Ekrana Ekle</strong> dÃ¼ÄŸmesine basÄ±n.",
      uk_ua: "Ð’ÑÑ‚Ð°Ð½Ð¾Ð²Ñ–Ñ‚ÑŒ Ñ†ÐµÐ¹ Ð²ÐµÐ± ÑÐ°Ð¹Ñ‚ Ð½Ð° Ð’Ð°Ñˆ %device: Ð½Ð°Ñ‚Ð¸ÑÐ½Ñ–Ñ‚ÑŒ %icon, Ð° Ð¿Ð¾Ñ‚Ñ–Ð¼ <strong>ÐÐ° Ð¿Ð¾Ñ‡Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ð¹ ÐµÐºÑ€Ð°Ð½</strong>.",
      zh_cn: "æ‚¨å¯ä»¥å°†æ­¤åº”ç”¨ç¨‹å¼å®‰è£…åˆ°æ‚¨çš„ %device ä¸Šã€‚è¯·æŒ‰ %icon ç„¶åŽç‚¹é€‰<strong>æ·»åŠ è‡³ä¸»å±å¹•</strong>ã€‚",
      zh_tw: "æ‚¨å¯ä»¥å°‡æ­¤æ‡‰ç”¨ç¨‹å¼å®‰è£åˆ°æ‚¨çš„ %device ä¸Šã€‚è«‹æŒ‰ %icon ç„¶å¾Œé»žé¸<strong>åŠ å…¥ä¸»ç•«é¢èž¢å¹•</strong>ã€‚"
      };

  function init() {
    if (!isIDevice) {
      return;
    }
    var now = Date.now(),
        i;
    if (w.addToHomeConfig) {
      for (i in w.addToHomeConfig) {
        options[i] = w.addToHomeConfig[i];
      }
    }
    if (!options.autostart) {
      options.hookOnLoad = false;
    }
    isIPad = (/ipad/gi).test(nav.platform);
    isRetina = w.devicePixelRatio && w.devicePixelRatio > 1;
    isSafari = (/Safari/i).test(nav.appVersion) && !(/CriOS/i).test(nav.appVersion);
    isStandalone = nav.standalone;
    OSVersion = nav.appVersion.match(/OS (\d+_\d+)/i);
    OSVersion = OSVersion && OSVersion[1] ? +OSVersion[1].replace("_", ".") : 0;
    lastVisit = +w.localStorage.getItem("addToHome");
    isSessionActive = w.sessionStorage.getItem("addToHomeSession");
    isReturningVisitor = options.returningVisitor ? lastVisit && lastVisit + 28 * 24 * 60 * 60 * 1000 > now : true;
    if (!lastVisit) {
      lastVisit = now;
    }
    isExpired = isReturningVisitor && lastVisit <= now;
    if (options.hookOnLoad) {
      w.addEventListener("load", loaded, false);
    } else {
      if (!options.hookOnLoad && options.autostart) {
        loaded();
      }
    }
  }
  function loaded() {
    w.removeEventListener("load", loaded, false);
    if (!isReturningVisitor) {
      w.localStorage.setItem("addToHome", Date.now());
    } else {
      if (options.expire && isExpired) {
        w.localStorage.setItem("addToHome", Date.now() + options.expire * 60000);
      }
    }
    if (!overrideChecks && (!isSafari || !isExpired || isSessionActive || isStandalone || !isReturningVisitor)) {
      return;
    }
    var touchIcon = "",
        platform = nav.platform.split(" ")[0],
        language = nav.language.replace("-", "_");
    balloon = document.createElement("div");
    balloon.id = "addToHomeScreen";
    balloon.style.cssText += "left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:" + (OSVersion < 5 ? "absolute" : "fixed");
    if (options.message in intl) {
      language = options.message;
      options.message = "";
    }
    if (options.message === "") {
      options.message = language in intl ? intl[language] : intl["en_us"];
    }
    if (options.touchIcon) {
      touchIcon = isRetina ? document.querySelector('head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon]') : document.querySelector('head link[rel^=apple-touch-icon][sizes="57x57"],head link[rel^=apple-touch-icon]');
      if (touchIcon) {
        touchIcon = '<span style="background-image:url(' + touchIcon.href + ')" class="addToHomeTouchIcon"></span>';
      }
    }
    balloon.className = (isIPad ? "addToHomeIpad" : "addToHomeIphone") + (touchIcon ? " addToHomeWide" : "");
    balloon.innerHTML = touchIcon + options.message.replace("%device", platform).replace("%icon", OSVersion >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') + (options.arrow ? '<span class="addToHomeArrow"></span>' : "") + (options.closeButton ? '<span class="addToHomeClose">\u00D7</span>' : "");
    document.body.appendChild(balloon);
    if (options.closeButton) {
      balloon.addEventListener("click", clicked, false);
    }
    if (!isIPad && OSVersion >= 6) {
      window.addEventListener("orientationchange", orientationCheck, false);
    }
    setTimeout(show, options.startDelay);
  }
  function show() {
    var duration, iPadXShift = 208;
    if (isIPad) {
      if (OSVersion < 5) {
        startY = w.scrollY;
        startX = w.scrollX;
      } else {
        if (OSVersion < 6) {
          iPadXShift = 160;
        }
      }
      balloon.style.top = startY + options.bottomOffset + "px";
      balloon.style.left = startX + iPadXShift - Math.round(balloon.offsetWidth / 2) + "px";
      switch (options.animationIn) {
      case "drop":
        duration = "0.6s";
        balloon.style.webkitTransform = "translate3d(0," + -(w.scrollY + options.bottomOffset + balloon.offsetHeight) + "px,0)";
        break;
      case "bubble":
        duration = "0.6s";
        balloon.style.opacity = "0";
        balloon.style.webkitTransform = "translate3d(0," + (startY + 50) + "px,0)";
        break;
      default:
        duration = "1s";
        balloon.style.opacity = "0";
      }
    } else {
      startY = w.innerHeight + w.scrollY;
      if (OSVersion < 5) {
        startX = Math.round((w.innerWidth - balloon.offsetWidth) / 2) + w.scrollX;
        balloon.style.left = startX + "px";
        balloon.style.top = startY - balloon.offsetHeight - options.bottomOffset + "px";
      } else {
        balloon.style.left = "50%";
        balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - (w.orientation % 180 && OSVersion >= 6 ? 40 : 0) + "px";
        balloon.style.bottom = options.bottomOffset + "px";
      }
      switch (options.animationIn) {
      case "drop":
        duration = "1s";
        balloon.style.webkitTransform = "translate3d(0," + -(startY + options.bottomOffset) + "px,0)";
        break;
      case "bubble":
        duration = "0.6s";
        balloon.style.webkitTransform = "translate3d(0," + (balloon.offsetHeight + options.bottomOffset + 50) + "px,0)";
        break;
      default:
        duration = "1s";
        balloon.style.opacity = "0";
      }
    }
    balloon.offsetHeight;
    balloon.style.webkitTransitionDuration = duration;
    balloon.style.opacity = "1";
    balloon.style.webkitTransform = "translate3d(0,0,0)";
    balloon.addEventListener("webkitTransitionEnd", transitionEnd, false);
    closeTimeout = setTimeout(close, options.lifespan);
  }
  function manualShow(override) {
    if (!isIDevice || balloon) {
      return;
    }
    overrideChecks = override;
    loaded();
  }
  function close() {
    clearInterval(positionInterval);
    clearTimeout(closeTimeout);
    closeTimeout = null;
    if (!balloon) {
      return;
    }
    var posY = 0,
        posX = 0,
        opacity = "1",
        duration = "0";
    if (options.closeButton) {
      balloon.removeEventListener("click", clicked, false);
    }
    if (!isIPad && OSVersion >= 6) {
      window.removeEventListener("orientationchange", orientationCheck, false);
    }
    if (OSVersion < 5) {
      posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY;
      posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;
    }
    balloon.style.webkitTransitionProperty = "-webkit-transform,opacity";
    switch (options.animationOut) {
    case "drop":
      if (isIPad) {
        duration = "0.4s";
        opacity = "0";
        posY += 50;
      } else {
        duration = "0.6s";
        posY += balloon.offsetHeight + options.bottomOffset + 50;
      }
      break;
    case "bubble":
      if (isIPad) {
        duration = "0.8s";
        posY -= balloon.offsetHeight + options.bottomOffset + 50;
      } else {
        duration = "0.4s";
        opacity = "0";
        posY -= 50;
      }
      break;
    default:
      duration = "0.8s";
      opacity = "0";
    }
    balloon.addEventListener("webkitTransitionEnd", transitionEnd, false);
    balloon.style.opacity = opacity;
    balloon.style.webkitTransitionDuration = duration;
    balloon.style.webkitTransform = "translate3d(" + posX + "px," + posY + "px,0)";
  }
  function clicked() {
    w.sessionStorage.setItem("addToHomeSession", "1");
    isSessionActive = true;
    close();
  }
  function transitionEnd() {
    balloon.removeEventListener("webkitTransitionEnd", transitionEnd, false);
    balloon.style.webkitTransitionProperty = "-webkit-transform";
    balloon.style.webkitTransitionDuration = "0.2s";
    if (!closeTimeout) {
      balloon.parentNode.removeChild(balloon);
      balloon = null;
      return;
    }
    if (OSVersion < 5 && closeTimeout) {
      positionInterval = setInterval(setPosition, options.iterations);
    }
  }
  function setPosition() {
    var matrix = new WebKitCSSMatrix(w.getComputedStyle(balloon, null).webkitTransform),
        posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY,
        posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;
    if (posY == matrix.m42 && posX == matrix.m41) {
      return;
    }
    balloon.style.webkitTransform = "translate3d(" + posX + "px," + posY + "px,0)";
  }
  function reset() {
    w.localStorage.removeItem("addToHome");
    w.sessionStorage.removeItem("addToHomeSession");
  }
  function orientationCheck() {
    balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - (w.orientation % 180 && OSVersion >= 6 ? 40 : 0) + "px";
  }
  init();
  return {
    show: manualShow,
    close: close,
    reset: reset
  };
})(window);