
// @see http://karma-runner.github.io/0.10/plus/requirejs.html

(function() {
    var karma = window.__karma__;

    var tests = [];
    for(var file in karma.files)
        if(/\-spec\.js$/.test(file)) tests.push(file);

    requirejs.config({
        // Karma serves files from '/base'
        baseUrl: '/base/dist/amd/'
    });

    // Ask Require.js to load all test files and start test run
    require(tests, karma.start);
} ());