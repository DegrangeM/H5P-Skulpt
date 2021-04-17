# H5P-Skulpt

This H5P library is based on [Skulpt](https://github.com/skulpt/skulpt/) and can be reused by other H5P library like the [H5P.Python](https://github.com/DegrangeM/H5P.Python) content-type. It can't be used as itself.

The folder `lib` is from the Skulpt repository. Check the associated [license](https://github.com/skulpt/skulpt/blob/master/LICENSE).

//TODO

The `codemirror.css` and `codemirror.js` at the root are custom files.

### codemirror.js

The `codemirror.js` add some usefull function :

- `CodeMirror.H5P.encode` and `CodeMirror.H5P.decode` are utility function that can be usefull to avoid issues with xss protection of h5p

- `CodeMirror.H5P.highlightLines` allow to highlight some of the lines of the code
