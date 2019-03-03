# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.2.0] - 2019-03-03

### Changed

-   Separate sourcemaps into their own files
-   Much stricter command parsing
-   Minor changes to help text and `yargs` usage

### Chores

-   Add tests for CLI
-   Migrate from Jest to nyc/Mocha/Chai/Sinon for code coverage on child processes

## [1.1.3] - 2018-12-07

### Added

-   Add missing `types` property in the package.json

### Chores

-   This file
-   Apply Prettier to .md files
-   Use `files` property in package.json instead of .npmignore
-   Add more tests and test coverage
-   Codecov support

## [1.1.2] - 2018-12-04

### Fixed

-   Update tsconfig.json to output LF line endings
    -   `yarn` retains CRLF in the `#!/usr/bin/env node` shebang, resulting in a "node\r not found" error when calling `schedule-shutdown` on Linux

### Chores

-   Remove .gitattributes

## [1.1.1] - 2018-12-04

### Chores

-   Add .gitattributes to checkout LF line endings to try and fix the scenario described above

## [1.1.0] - 2018-12-04

### Added

-   Support for scheduling and cancelling restarts

### Chores

-   Update README.md
    -   Mention supported platforms
    -   Add restart description and examples
    -   Removed Future Improvements section

## [1.0.1] - 2018-12-02

### Added

-   Extra help examples

### Chores

-   Update API section in README.md for the `verbose` option
-   Revise package.json scripts

## [1.0.0] - 2018-12-02

### Added

-   Linux support
-   `verbose` option for extra logging

### Changed

-   Improved validation on duration inputs

### Removed

-   Removed support for seconds to have Windows consistent with Linux
    -   Duration strings are now defined by the `(\d+h)?(\d+m)?` pattern

### Chores

-   Added LICENSE.md
-   Extra README.md badges

## 0.1.0 - 2018-12-01

### Added

-   API to schedule and cancel shutdowns on Windows
-   CLI tool to schedule and cancel shutdowns using the API
-   Supports duration strings defined by the `(\d+h)?(\d+m)?(\d+s)?` pattern

### Chores

-   Added README.md
-   Travis CI support

[unreleased]: https://github.com/Shingyx/schedule-shutdown/compare/v1.2.0...master
[1.2.0]: https://github.com/Shingyx/schedule-shutdown/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/Shingyx/schedule-shutdown/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Shingyx/schedule-shutdown/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Shingyx/schedule-shutdown/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Shingyx/schedule-shutdown/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/Shingyx/schedule-shutdown/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Shingyx/schedule-shutdown/compare/v0.1.0...v1.0.0
