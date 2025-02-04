import CodeMirror from 'codemirror'
import { setupConfigPanel } from './configPanel.js'
import 'codemirror/lib/codemirror.css'
import '../css/style.css'
import '../css/configPanel.css'
import '../css/panel.css'

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded')
    // DOM elements
    const chrono = document.getElementById('timer');

    // CodeMirror
    const editor = CodeMirror(document.getElementById('editor'), {
        mode: 'python',
        theme: 'material',
        lineNumbers: true,
        autofocus: true,
        // matchBrackets: true,
        // autoCloseBrackets: {pairs: "()[]{}<>''\"\"", override: true},
        lineWrapping: true,
        // cursorScrollMargin: 50,
        singleCursorHeightPerLine: false,
        styleActiveLine: true,
        // foldGutter: true,
        // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        // keyMap: 'sublime',
      });
    
    setupConfigPanel(editor);
})