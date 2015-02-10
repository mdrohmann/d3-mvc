module.exports = {
  afterEnd: function(runner) {
    var fs = require('fs');
    var coverage = runner.page.evaluate(function() {
      return window.__coverage__;
    });

    if (coverage) {
      fs.write('coverage/coverage.json', JSON.stringify(coverage), 'w');
    } else {
      console.log('No coverage data generated');
    }
  }
};
