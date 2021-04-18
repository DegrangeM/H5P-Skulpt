Sk.H5P = {
  builtinRead: function (x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined)
      throw 'File not found: \'' + x + '\'';
    return Sk.builtinFiles['files'][x];
  },
  /**
   * 
   * @param {string} code Python code to execute 
   * @param {Object} options
   * @param {inputCallback} options.input Function that will be used to request input
   * @param {outputCallback} options.output Function that will be used to display output
   */
  run: function (code, options) {

    let output = options.output || (x => alert(x));

    let inputfunTakesPrompt = options.inputfunTakesPrompt !== undefined ? options.inputfunTakesPrompt : true;

    /*
      By using options.input, you can give a custom input function.
      When the python code call the input function, the options.input function will be called.
      This function will receive three argument : p, resolve, reject
      Use the resolve function to tell python the value inputed by the user.
      The p argument can have two possible value :
        If options.inputfunTakesPrompt is set to false,
          the python input argument will be outputed.
          The p argument will be null because you don't need it
        If options.inputfunTakesPrompt is set to true (or ommited),
          the python input argument will not be outputed.
          You will have to output yourself if you want.
          The p argument will be an object {prompt, output} where
          prompt is the python input argument and output is the
          function used to output content.
    */
    let input;
    if (options.input === undefined) {
      input = x => prompt(x);
    } else {
      input = (p => {
        return new Promise((resolve, reject) => {
          options.input(
            inputfunTakesPrompt ? { prompt: p, output: output } : null,
            resolve,
            reject
          );
        });
      });
    }

    /*
      If options.shouldStop function is given, the python script will call this function at each while / for and stop if the function return True.
      It is possible to also set options.killableWhile or options.killableFor to choose when the function is called.
    */
    let suspension, killableWhile, killableFor;
    if (options.shouldStop !== undefined) {
      suspension = {
        '*': () => {
          if (options.shouldStop()) throw 'Execution interrupted';
        }
      };
      killableWhile = options.killableWhile !== undefined ? options.killableWhile : true;
      killableFor = options.killableFor !== undefined ? options.killableFor : true;
    } else {
      suspension = {};
      killableWhile = false;
      killableFor = false;
    }

    Sk.configure({
      output: output,
      read: this.builtinRead,
      inputfun: input,
      inputfunTakesPrompt: inputfunTakesPrompt,
      killableWhile: killableWhile,
      killableFor: killableFor,
    });

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas'; // todo

    var myPromise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody('<stdin>', false, code, true);
    }, suspension);

    let onSuccess = options.onSuccess || (() => { }); // receive an argument that can be used to retrieve generated js and some variable
    let onError = options.onError || (() => { }); // receive an argument that can be used to display error with err.toString()
    let onFinally = options.onFinally || (() => { });
    myPromise.then(onSuccess).catch(onError).finally(onFinally);
  },
  /**
   * Return formatted traceback from an error
   * @param error 
   * @returns {string}
   */
  getTraceBackFromError: error => {
    let errorText = '';
    if (error.traceback) {
      for (let i = 0; i < error.traceback.length; i++) {
        if (error.traceback[i].filename === '<stdin>.py') {
          errorText += '\n  at line ' + error.traceback[i].lineno;
        }
        else {
          errorText += '\n  at ' + error.traceback[i].filename + ' line ' + error.traceback[i].lineno;
        }
        if ('colno' in error.traceback[i]) {
          errorText += ' column ' + error.traceback[i].colno;
        }
      }
    }
    return errorText;
  }
};
/**
 * @callback outputCallback
 * @param {string} output
 */
/**
 * @callback inputCallback
 * @param {Object} p
 * @param {string} p.prompt The argument of the input python function
 * @param {function} p.output The fonction configured to output text
 * @param {resolveCallback} resolve Function to call with the input received
 * @param {rejectCallback}} reject
 */
/**
 * @callback resolveCallback
 * @param {string} input The inputed value
 */