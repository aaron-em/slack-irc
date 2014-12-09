/*
 * Service credentials, of whatever sort, are stored in files
 * alongside this one, and exported via requirement as you see done
 * here. The gitignore file will try to keep you from adding such
 * files to source control.
 *
 * Yeah, it could (should) be a JSON file and so on, but I don't feel like
 * messing with fs right now.
 */

module.exports = {
  "slack": require('./slack')
};
