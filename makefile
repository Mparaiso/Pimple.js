test:
	@mocha
	@make commit
install:
	@npm install
commit:
	@git add .
	@git commit -am"auto-commit `date`" || :
push: commit
	@git push origin --all
build:
	@jsmin pimple.js > pimple.min.js
.PHONY:test