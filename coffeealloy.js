var coffee, fs, glob, path, util, _compile_coffee;

fs = require("fs");

path = require("path");

glob = require("glob");

util = require("util");

coffee = require('coffee-script');

_compile_coffee = function(coffee_file, js_file) {
  var compiled, data;
  data = fs.readFileSync(coffee_file, 'utf8');
  compiled = coffee.compile(data);
  return fs.writeFileSync(js_file, compiled, 'utf8');
};

exports.pre_compile = function(event, logger) {
  var coffee_file, coffee_files, coffee_timestamp, js_file, js_timestamp, preprocessed, _i, _len, _results;
  logger.info("----- COFFEEALLOY PREPROCESSER -----");
  logger.info("Preprocessing CoffeeScript files in [project]/app/");
  coffee_files = glob.sync("/**/*.coffee", {
    cwd: event.dir.home,
    root: event.dir.home,
    nosort: true,
    nonull: false
  });
  if (coffee_files.length > 0) {
    logger.info("No '*.coffee' scripts need to preprocess");
  }
  _results = [];
  for (_i = 0, _len = coffee_files.length; _i < _len; _i++) {
    coffee_file = coffee_files[_i];
    preprocessed = false;
    coffee_timestamp = util.inspect(fs.lstat(coffee_file)).ctime;
    js_file = coffee_file.substring(0, coffee_file.length - 6).toString() + "js";
    if (fs.existsSync(js_file)) {
      js_timestamp = util.inspect(fs.lstat(js_file)).ctime;
      preprocessed = (coffee_timestamp > js_timestamp ? false : true);
    }
    if (!preprocessed) {
      logger.info("- Preprocessing: " + path.relative(event.dir.project, coffee_file));
      _results.push(_compile_coffee(coffee_file, js_file));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};
