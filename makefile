test:
	@mocha
	@make commit
install:
	@npm install
commit:
	@git add .
	@git commit -am"auto-commit `date`" || :
.PHONY:test