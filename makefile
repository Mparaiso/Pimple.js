test:
	@node_modules/.bin/mocha -R list
	@make commit
install:
	@npm install
commit:
	@git add .
	@git commit -am"$(message) `date`" || :
push: build commit
	@git push 
build:
	@node_modules/.bin/uglifyjs pimple.js -o pimple.min.js --source-map pimple.js.map --comments
.PHONY:test build
