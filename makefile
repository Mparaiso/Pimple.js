test:
	@mocha
	@make commit
install:
	@npm install
commit:
	@git add .
	@git commit -am"auto-commit `date`" || :
push: commit
	@git push github --all
build:
	@uglifyjs pimple.js -o pimple.min.js --source-map pimple.js.map --comments
.PHONY:test