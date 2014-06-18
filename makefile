test:
	@node_modules/.bin/mocha -R list
	@make commit
install:
	@npm install
commit:
	@echo "committing !"
	@git add .
	@git commit -am"$(message) `date`" || :
push: build commit
	@echo "pushing !"
	@git push 
build:
	@echo "building !"
	@node_modules/.bin/uglifyjs pimple.js -o pimple.min.js --source-map pimple.js.map --comments
.PHONY:test build
