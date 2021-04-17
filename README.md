# H5P-CodeMirror

This H5P library is based on the [CodeMirror](https://github.com/codemirror/CodeMirror) and can be reused by other H5P library like the [H5P.CodeHighlighter](https://github.com/DegrangeM/H5P.CodeHighlighter) content-type. It can't be used as itself.

The folder `addon`, `keymap`, `lib`, and `mode` are from the CodeMirror repository and have been stripped of unused files.

The `codemirror.css` and `codemirror.js` at the root are custom files.

### codemirror.js

The `codemirror.js` add some usefull function :

- `CodeMirror.H5P.encode` and `CodeMirror.H5P.decode` are utility function that can be usefull to avoid issues with xss protection of h5p

- `CodeMirror.H5P.highlightLines` allow to highlight some of the lines of the code
