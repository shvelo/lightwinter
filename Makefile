VERSION:=$(shell cat src/VERSION)
EMAIL:=shveloo@gmail.com
BUILDDIR:=build/lightwinter-$(VERSION)/

packages : clean
	tar -czf pkg/lightwinter-$(VERSION).tar.gz src/*
	zip pkg/lightwinter-$(VERSION).zip src/*
	
	cp pkg/lightwinter-$(VERSION).tar.gz build/lightwinter_$(VERSION).orig.tar.gz
	cp -rf src $(BUILDDIR)
install :
	bash src/INSTALL
clean : 
	rm -rf build/*
.PHONY clean : 
