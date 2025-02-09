export const functionUtils = {
    playersList: [],

    stopClock(wsServer) {
        wsServer.send(JSON.stringify({
            type: 'evaluate_code',
            code: 'Clock.clear()\n'
        }));
    },

    unSoloPlayers(wsServer) {
        wsServer.send(JSON.stringify({
            type: 'evaluate_code',
            code: 'unsolo()\n'
        }));
    },

    soloPlayer(cm, wsServer) {
        const cursor = cm.getCursor();
        let startLine = cursor.line;
        let endLine = cursor.line;

        const blockCode = cm.getRange(
            {line: startLine, ch: 0},
            {line: endLine, ch: cm.getLine(endLine).length}
        );

        const playerName = this.getPlayer(blockCode);
    
        if (playerName) {
            wsServer.send(JSON.stringify({
                type: 'evaluate_code',
                code: `${playerName}.solo()\n`
            }));
        }
    },

    // reset the chrono
    resetChrono(wsServer) {
        wsServer.send(JSON.stringify({
          type: 'evaluate_code',
          code: 'panel.timeInit = time()\n'
        }));
    },

    // Check if the code to evaluate is a player and if it is, stop it
    ifPlayerStop(codeToEvaluate) {
        const playerPattern = /^[#_]\s*([a-zA-Z]\d+|[a-zA-Z]{2})\s*>>|^#\s*[a-zA-Z]\d+\s*\.\w+\s*=\s*\d+/;
        const match = codeToEvaluate.trim().match(playerPattern);

        if (match) {
          const player = match[1].replace(/^[_#]\s?/, '')
          return `${player}.stop()`;
        }
        return codeToEvaluate;
    },

    getPlayer(code) {
        const playerPattern = /^[a-zA-Z][a-zA-Z0-9]/;
        const match = code.trim().match(playerPattern);
        if (match) {
            return match[0];
        }
        return null;
    },

    getCodeAndCheckStop(cm, multi=false) {
        const cursor = cm.getCursor();
        let startLine = cursor.line;
        let endLine = cursor.line;

        // if multiline selection
        if (multi) {
            ({startLine, endLine} = this.getBlock(cm, cursor.line));
        }

        // Block code
        const blockCode = cm.getRange(
            {line: startLine, ch: 0},
            {line: endLine, ch: cm.getLine(endLine).length}
        );

        if (blockCode.trim()) {
            // Check if the code is a player and if it is, stop it
            let blockCodeArray = blockCode.split('\n');
            blockCodeArray.forEach((code, index) => {
            blockCodeArray[index] = functionUtils.ifPlayerStop(code);
            });
            const blockCodeJoin = blockCodeArray.join('\n');
            return [blockCodeJoin, startLine, endLine];
        }
        return [blockCode, startLine, endLine];
    },


    // Save the content of the editor into a .py file
    saveEditorContent(cm, wsServer) {
        let content = cm.getValue();
        
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filename = `code_${timestamp}.py`;
        
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    },

    // Get the content and the position of a block
    getBlock(cm, line) {
        let startLine = line;
        let endLine = line;

        // search start of the block (upwards)
        while (startLine > 0 && cm.getLine(startLine - 1).trim() !== '') {
            startLine--;
        }

        // search end of the block (downwards)
        while (endLine < cm.lineCount() - 1 && cm.getLine(endLine + 1).trim() !== '') {
            endLine++;
        }

        return { startLine, endLine };
    },

    // Increment/decrement the value of the number under the cursor
    incrementValue(cm, value){
        const cursor = cm.getCursor();
        let text = cm.getRange({line: cursor.line, ch: cursor.ch}, {line: cursor.line, ch: cursor.ch +1});
        if (parseInt(text) || parseInt(text) === 0) {
            cm.replaceRange((parseInt(text) + value).toString(), {line: cursor.line, ch: cursor.ch}, {line: cursor.line, ch: cursor.ch +1});
            cm.setCursor({line: cursor.line, ch: cursor.ch});
        }
    },

    // Go to the next occurrence of a comma
    goToNextComma(cm) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const nextCommaIndex = line.indexOf(',', cursor.ch + 1);
        if (nextCommaIndex !== -1) {
        cm.setCursor({ line: cursor.line, ch: nextCommaIndex + 1 });
        }
        else {
            cm.execCommand("goWordRight");
        }
    },
  
    // Go to the previous occurrence of a comma
    goToPreviousComma(cm) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const previousCommaIndex = line.lastIndexOf(',', cursor.ch - 1);
        if (previousCommaIndex !== -1) {
        cm.setCursor({ line: cursor.line, ch: previousCommaIndex });
        } else {
            cm.execCommand("goWordLeft");
        }
    },

    formatFoxDotAutocomplete(message) {
        // Get loop List
        const loopList = message.autocomplete.loopList
        const formattedLoops = loopList.map(loop => {
            const match = loop.match(/\d+/);
            const dur = match ? `dur=${parseInt(match[0], 10)}` : ""; // Extract the duration of the loop
            return { text: `"${loop}", ${dur}`, displayText: loop };
        });
       
        const fxList = message.autocomplete.fxList;
        const updatedFxList = fxList.map(fx => {
        const fxName = fx.displayText.replace(/_$/, ''); // Remove the  '_'
        return { text: `${fxName}=`, displayText: fxName };
        });
        const allFx = [...fxList, ...updatedFxList];

        // Get SynthDefs
        const synthDefs = message.autocomplete.synthList;
        const formattedSynthDefs = synthDefs.map(synth => {
          return { text: synth.displayText + "()", displayText: synth.displayText };
        });
        const argsSynth = synthDefs.map(synth => {
          return { text: synth.displayText + "(" + synth.text + ")", displayText: synth.displayText + "_" };
        });
        const allSynthDefs = [...formattedSynthDefs, ...argsSynth];

        return { loops: formattedLoops, fxList: allFx, synthList: allSynthDefs};
    }
};

export let playersList = [];

export function updatePlayersList(newPlayersList) {
    playersList = newPlayersList;
}