0) document.namespaces tests
----------------------------

The role of this tests is to estimate XML namespaces implementation accross
differents doctypes:
- http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
- http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd
- html (ak html5)
with differents content type:
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
with differents file extensions:
- html
- xhtml
- xml
with xml declaration or not,
and in differents browsers:
- blink based
- gecko based
- edge
- old IE (if time not targeted)