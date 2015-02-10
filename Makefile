.PHONY: all test test-xml test-coverage test-nocolor docs publish

BUNDLE_SOURCES = src/*.js src/*/*.js
TEST_SOURCES = test/*/*.js

all: bundle.js dist/d3mvc.js dist/d3mvc.min.js

docs:
	make -C docs/ html

bundle.js: src/d3mvc.js $(BUNDLE_SOURCES)
	browserify $< --standalone d3mvc -o $@

dist/d3mvc.js: bundle.js
	mkdir -p ./dist; cp $< $@

dist/d3mvc.min.js: bundle.js
	mkdir -p ./dist; ./bin/uglify $< -c -m > $@

test/browser.bundle.js: test/browsertest.js $(TEST_SOURCES) $(BUNDLE_SOURCES)
	browserify $< -o $@ --verbose -d
#	browserify -r handlebars:hbsfy/runtime $< -o $@ --verbose -d

browsertest: test/browser.bundle.js
	firefox test/test.index.html

html/static/build/js/test.js: test/browsertest.js $(BUNDLE_SOURCES)
	mkdir -p html/static/build/js/ && browserify -t [ browserify-istanbul --ignore **/*.hbs **/bower_components/** ] $< -o html/static/build/js/test.js -d

test: html/static/build/js/phantomjs.test.html html/static/build/js/test.js
	bin/mocha-phantomjs $< --hooks test/phantom_hooks.js

test-nocolor: html/static/build/js/phantomjs-nocolor.test.html html/static/build/js/test.js
	bin/mocha-phantomjs --reporter spec -C $< --hooks test/phantom_hooks.js

test-xml: html/static/build/js/phantomjs-xml.test.html html/static/build/js/test.js
	bin/mocha-phantomjs --reporter xunit -C $< --hooks test/phantom_hooks.js > tests.xml

test-coverage:
	istanbul report cobertura --root coverage

publish: bundle.js dist/d3mvc.min.js
	npm publish
