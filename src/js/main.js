import CodeMirror from 'codemirror';
import { setupConfigPanel, updateHelpPanel } from './configPanel.js';
import { EventEmitter } from './eventBus.js';

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/mode/python/python.js'

import { logsUtils } from './logs.js';
import { functionUtils } from './functionUtils.js';
import { foxdotAutocomplete } from './foxdotAutocomplete.js';

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/dialog/dialog.css'
import '../css/style.css'
import '../css/configPanel.css'
import '../css/panel.css'

document.addEventListener('DOMContentLoaded', async () => {
	// DOM elements
	const chrono = document.getElementById('timer');

	// WebSocket
	const wsServer = new WebSocket(`ws://localhost:1234`);
  	let foxdotWs = null;

	// CodeMirror
	const editor = CodeMirror(document.getElementById('editor'), {
		mode: 'python',
		theme: 'material',
		lineNumbers: true,
		autofocus: true,
		matchBrackets: true,
		autoCloseBrackets: {pairs: "()[]{}<>''\"\"", override: true},
		lineWrapping: true,
		singleCursorHeightPerLine: false,
		styleActiveLine: true,
		keyMap: 'sublime',
	});
    
	setupConfigPanel(editor);

	// Init the logs panel
	logsUtils.initResize(editor);

	EventEmitter.on('send_foxdot', (command) => {
		wsServer.send(JSON.stringify({
			type: 'evaluate_code',
			code: command
		}));
	});
	
	// Log the FoxDot output
	wsServer.onmessage = (event) => {    
		try {
		  const message = JSON.parse(event.data);
		  if (message.type === 'foxdot_log') {
			console.log(message.data);
			logsUtils.appendLog(message.data, message.color);
		  }
		} catch (error) {
		}
	};

	// Reset timer on click
	chrono.addEventListener('click', ()=> functionUtils.resetChrono(wsServer));

	// Evaluate the code and highlight the block with a flash
	function evaluateCode(cm, multi){
		var [blockCode, startLine, endLine] = functionUtils.getCodeAndCheckStop(cm, multi);
	
		// Send code
		wsServer.send(JSON.stringify({
			  type: 'evaluate_code',
			  code: blockCode,
		  }));
		
		// Highlight the code
		for (let i = startLine; i <= endLine; i++) {
			const mark = editor.markText(
				{line: i, ch: 0},
				{line: i, ch: editor.getLine(i).length},
				{className: 'flash-highlight'}
			);
			setTimeout(() => mark.clear(), 200);
		}
	}

	editor.setOption('extraKeys', {
		'Ctrl-;': ()=> functionUtils.stopClock(wsServer),
		'Ctrl-Space': 'autocomplete',
		'Ctrl-S': (cm)=> {functionUtils.saveEditorContent(cm,wsServer)},
		'Alt-X': (cm) => {
		  cm.toggleComment();
		  evaluateCode(cm, false);
		},
		'Ctrl-Alt-X': (cm) => {
		  const {startLine, endLine} = functionUtils.getBlock(cm, cm.getCursor().line);
		  cm.setSelection({line: startLine, ch: 0}, {line: endLine, ch: cm.getLine(endLine).length});
		  cm.toggleComment();
		  evaluateCode(cm, true);
		},
		'Alt-S': (cm) => {functionUtils.soloPlayer(cm, wsServer)},
		'Ctrl-Alt-S': () => {functionUtils.unSoloPlayers(wsServer)},
		'Alt-1': (cm) => markerUtils.setMarker(cm, "Red"),
		'Alt-2': (cm) => markerUtils.setMarker(cm, "Green"),
		'Alt-3': (cm) => markerUtils.setMarker(cm, "Blue"),
		'Alt-4': () => markerUtils.resetMarkers(), 
		'Ctrl-Enter': (cm) => {evaluateCode(cm, false)},
		'Ctrl-Alt-Enter': (cm) => {evaluateCode(cm, true)},
		'Alt-F': "findPersistent",
		'Ctrl-G': "findNext",
		'Ctrl-Alt-Left': "goLineStart",
		'Ctrl-Alt-Right': "goLineEnd",
		'Ctrl-Left': (cm) => {functionUtils.goToPreviousComma(cm)},
		'Ctrl-Right': (cm) => {functionUtils.goToNextComma(cm)},
		'Alt-P': () => {document.getElementById('piano-roll').classList.toggle('hidden')},
		'Alt-=': (cm) => {functionUtils.incrementValue(cm, 1)},
		'Ctrl-Alt-=': (cm) => {functionUtils.incrementValue(cm, -1)},
	  });

	// autocomplete
	editor.setOption('hintOptions', {
		hint: (cm) => foxdotAutocomplete.hint(cm, CodeMirror),
	  });


	function foxDotWs(){
		foxdotWs = new WebSocket(`ws://localhost:20000`);
		foxdotWs.onopen = () => {
			foxdotWs.send(JSON.stringify({ type: 'get_autocomplete' }));
		};
		foxdotWs.onmessage = (event) => {
			try {
			const message = JSON.parse(event.data);
			if (message.type === 'autocomplete') {
				const { loops, fxList, synthList } = functionUtils.formatFoxDotAutocomplete(message);
				foxdotAutocomplete.loopList = loops;
				foxdotAutocomplete.fxList = fxList;
				foxdotAutocomplete.synths= synthList;

				updateHelpPanel(loops, fxList, synthList);

				if (loops.length == 0 || fxList.length == 0 || synthList.length == 0) {
				console.error(`Error on retrieving loops name (${loops.length}), effets (${fxList.length}), synths (${synthList.length})`);
				}
			}
			} catch (error) {
			console.error('Error on FoxDot message ', error);
			}
		};
		foxdotWs.onerror = (err) => {
			console.error('Socket encountered error: ', err.message, 'Closing socket');
			foxdotWs.close();
		};
	}
	
	foxDotWs();

	// piano insert at cursor
	document.querySelectorAll('#piano-roll .piano-key li').forEach(key => {
		key.addEventListener('click', (event) => {
			const index = event.currentTarget.dataset.index;
			if (index !== undefined) {
				insertAtCursor(index);
			}
		});
	  });
	
	  function insertAtCursor(index) {
		  // insert index text at cursor position
		  const cursor = editor.getCursor();
		  const line = cursor.line;
		  const ch = cursor.ch;
		  editor.replaceRange(index+',', {line, ch}, {line, ch});
	  }
})