.PHONY: all test test-xml test-coverage docs

BUNDLE_SOURCES = src/*.js src/*/*.js

all: bundle.js

docs:
	make -C docs/ html

bundle.js: src/d3mvc.js $(BUNDLE_SOURCES)
	browserify $< --standalone d3mvc -o $@

test/browser.bundle.js: test/browsertest.js test/*/*.test.js
	browserify $< -o $@

browsertest: test/browser.bundle.js
	firefox test/test.index.html

test:
	mocha --ui exports --reporter spec 'test/**/*.test.js'

test-xml:
	mocha --ui exports --reporter xunit 'test/**/*.test.js' > tests.xml

test-coverage:
	istanbul cover --report cobertura _mocha -- --reporter spec 'test/**/*.test.js'
