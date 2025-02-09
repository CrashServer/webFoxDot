import { playersList } from "./functionUtils";

export const foxdotAutocomplete = {
    synths: [
    ],
    foxKeyword: [
        { text: 'linvar([],[])', displayText: 'linvar' },
        { text: 'var([],[])', displayText: 'var' },
        { text: 'expvar([],[])', displayText: 'expvar' },
        { text: 'sinvar([],[])', displayText: 'sinvar' },
        { text: 'Pvar([],[])', displayText: 'Pvar' },
        { text: 'PSine()', displayText: 'PSine' },
        { text: 'PRand()', displayText: 'PRand' },
        { text: 'PWhite(0,1)', displayText: 'PWhite' },
        { text: 'PWhite(-1,1)', displayText: 'PWhite(-1,1)' },
        { text: 'PxRand()', displayText: 'PxRand' },
        { text: 'PwRand()', displayText: 'PwRand' },
        { text: 'PChain()', displayText: 'PChain' },
        { text: 'PZ12()', displayText: 'PZ12' },
        { text: 'PTree()', displayText: 'PTree' },
        { text: 'PWalk()', displayText: 'PWalk' },
        { text: 'PDelta()', displayText: 'PDelta' },
        { text: 'PSquare()', displayText: 'PSquare' },
        { text: 'PIndex()', displayText: 'PIndex' },
        { text: 'PFibMod()', displayText: 'PFibMod' },
        { text: 'PShuf()', displayText: 'PShuf' },
        { text: 'PAlt()', displayText: 'PAlt' },
        { text: 'PStretch()', displayText: 'PStretch' },
        { text: 'PPairs()', displayText: 'PPairs' },
        { text: 'PZip()', displayText: 'PZip' },
        { text: 'PZip2()', displayText: 'PZip2' },
        { text: 'PStutter()', displayText: 'PStutter' },
        { text: 'PSq()', displayText: 'PSq' },
        { text: 'P10()', displayText: 'P10' },
        { text: 'PStep()', displayText: 'PStep' },
        { text: 'PSum()', displayText: 'PSum' },
        { text: 'PRange()', displayText: 'PRange' },
        { text: 'PTri()', displayText: 'PTri' },
        { text: 'PSine()', displayText: 'PSine' },
        { text: 'PEuclid()', displayText: 'PEuclid' },
        { text: 'PEuclid2()', displayText: 'PEuclid2' },
        { text: 'PBern()', displayText: 'PBern' },
        { text: 'PBeat()', displayText: 'PBeat' },
        { text: 'PDur()', displayText: 'PDur' },
        { text: 'PDur(3,8)', displayText: 'PDur(3,8)' },
        { text: 'PDur(5,8)', displayText: 'PDur(5,8)' },
        { text: 'PDelay()', displayText: 'PDelay' },
        { text: 'PStrum()', displayText: 'PStrum' },
        { text: 'PQuicken()', displayText: 'PQuicken' },
        { text: 'PRhythm()', displayText: 'PRhythm' },
        { text: 'PJoin()', displayText: 'PJoin' },
    ],
    coolFunction: [
        { text: 'Clock', displayText: 'Clock' },
        { text: 'Scale.default=', displayText: 'Scale' },
        { text: 'Root.default=', displayText: 'Root' },
    ],
    playerFunction: [
        { text: 'unison()', displayText: 'unison' }, 
        { text: 'sometimes("stutter")', displayText: 'sometimes'},
        { text: 'often()', displayText: 'often'},
        { text: 'rarely()', displayText: 'rarely'},
        { text: 'never()', displayText: 'never'},
        { text: 'solo()', displayText: 'solo'},
        { text: 'stop()', displayText: 'stop'},
        { text: 'only()', displayText: 'only'},
    ],
    patternFunction: [
        { text: 'offadd()', displayText: 'offadd' },
        { text: 'offmul()', displayText: 'offmul' },
        { text: 'amen()', displayText: 'amen' },
        { text: 'bubble()', displayText: 'bubble' }, 
    ],
    scales: [
        { text: '"aeolian"', displayText: 'aeolian' },
        { text: '"altered"', displayText: 'altered' },
        { text: '"bebopDom"', displayText: 'bebopDom' },
        { text: '"bebopDorian"', displayText: 'bebopDorian' },
        { text: '"bebopMaj"', displayText: 'bebopMaj' },
        { text: '"bebopMelMin"', displayText: 'bebopMelMin' },
        { text: '"blues"', displayText: 'blues' },
        { text: '"chinese"', displayText: 'chinese' },
        { text: '"chromatic"', displayText: 'chromatic' },
        { text: '"custom"', displayText: 'custom' },
        { text: '"default"', displayText: 'default' },
        { text: '"diminished"', displayText: 'diminished' },
        { text: '"dorian"', displayText: 'dorian' },
        { text: '"dorian2"', displayText: 'dorian2' },
        { text: '"egyptian"', displayText: 'egyptian' },
        { text: '"freq"', displayText: 'freq' },
        { text: '"halfDim"', displayText: 'halfDim' },
        { text: '"halfWhole"', displayText: 'halfWhole' },
        { text: '"harmonicMajor"', displayText: 'harmonicMajor' },
        { text: '"harmonicMinor"', displayText: 'harmonicMinor' },
        { text: '"hungarianMinor"', displayText: 'hungarianMinor' },
        { text: '"indian"', displayText: 'indian' },
        { text: '"justMajor"', displayText: 'justMajor' },
        { text: '"justMinor"', displayText: 'justMinor' },
        { text: '"locrian"', displayText: 'locrian' },
        { text: '"locrianMajor"', displayText: 'locrianMajor' },
        { text: '"lydian"', displayText: 'lydian' },
        { text: '"lydianAug"', displayText: 'lydianAug' },
        { text: '"lydianDom"', displayText: 'lydianDom' },
        { text: '"lydianMinor"', displayText: 'lydianMinor' },
        { text: '"major"', displayText: 'major' },
        { text: '"majorPentatonic"', displayText: 'majorPentatonic' },
        { text: '"melMin5th"', displayText: 'melMin5th' },
        { text: '"melodicMajor"', displayText: 'melodicMajor' },
        { text: '"melodicMinor"', displayText: 'melodicMinor' },
        { text: '"minMaj"', displayText: 'minMaj' },
        { text: '"minor"', displayText: 'minor' },
        { text: '"minorPentatonic"', displayText: 'minorPentatonic' },
        { text: '"mixolydian"', displayText: 'mixolydian' },
        { text: '"phrygian"', displayText: 'phrygian' },
        { text: '"prometheus"', displayText: 'prometheus' },
        { text: '"romanianMinor"', displayText: 'romanianMinor' },
        { text: '"susb9"', displayText: 'susb9' },
        { text: '"wholeHalf"', displayText: 'wholeHalf' },
        { text: '"wholeTone"', displayText: 'wholeTone' },
        { text: '"yu"', displayText: 'yu' },
        { text: '"zhi"', displayText: 'zhi' }
    ],
    loopList: [
        { text: '"foxdot", dur=4,', displayText: 'break4' },
    ],
    fxList: [
        { text: 'vib=', displayText: 'vib' },
        { text: 'slide=', displayText: 'slide' },
        { text: 'slidefrom=', displayText: 'slidefrom' },
        { text: 'bend=', displayText: 'bend' },
        { text: 'coarse=', displayText: 'coarse' },
        { text: 'striate=', displayText: 'striate' },
        { text: 'pshift=', displayText: 'pshift' },
        { text: 'hpf=', displayText: 'hpf' },
        { text: 'lpf=', displayText: 'lpf' },
        { text: 'swell=', displayText: 'swell' },
        { text: 'bpf=', displayText: 'bpf' },
        { text: 'crush=', displayText: 'crush' },
        { text: 'dist=', displayText: 'dist' },
        { text: 'spin=', displayText: 'spin' },
        { text: 'cut=', displayText: 'cut' },
        { text: 'room=', displayText: 'room' },
        { text: 'chop=', displayText: 'chop' },
        { text: 'tremolo=', displayText: 'tremolo' },
        { text: 'echo=', displayText: 'echo' },
        { text: 'formant=', displayText: 'formant' },
        { text: 'shape=', displayText: 'shape' },
        { text: 'drive=', displayText: 'drive' },
    ],

    hint: function(cm, CodeMirror) {
        const cursor = cm.getCursor();
        const token = cm.getTokenAt(cursor);
        const line = cm.getLine(cursor.line);
        const cursorPosition = cursor.ch;
        const beforeCursor = line.slice(0, cursorPosition);
        const afterCursor = line.slice(cursorPosition);

        // Regex to detect player follow by '>>'
        const playerPattern = /([a-zA-Z0-9]+\d*)\s*>>\s*/;
        const matchPlayer = beforeCursor.match(playerPattern);
        const isInsideParentheses = (beforeCursor.match(/\(/g) || []).length > (beforeCursor.match(/\)/g) || []).length;        
        const afterLastClosingParenthesis = /.*\)\s*\./;
        const loopPattern = /loop\(([^,)]*)$/;

        if (beforeCursor.trim() === '' && afterCursor.trim() === '') {
            let randomPlayer;
            do {
                randomPlayer = String.fromCharCode(97 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 10) + ' >> ';
            } while (playersList.includes(randomPlayer));
            return {
                list: [{ text: randomPlayer, displayText: randomPlayer }],
                from: CodeMirror.Pos(cursor.line, cursor.ch),
                to: CodeMirror.Pos(cursor.line, cursor.ch),
            };
        }

        else if (loopPattern.test(beforeCursor) && /^[^,)]*/.test(afterCursor)) {
            const prefix = token.string.slice(0, cursorPosition - token.start).replace(/[^a-zA-Z]/g, "");
            const filteredLoops = this.loopList.filter(loop => loop.displayText.includes(prefix));
            const loopMatch = line.match(/loop\("([^"]*)"/);
            const durMatch = line.match(/dur=(\d+)/);
            const loopStart = loopMatch ? token.start : token.start;
            const loopEnd = durMatch ? durMatch.index + durMatch[0].length : cursorPosition;
            return {
              list: filteredLoops.length > 0 ? filteredLoops.sort((a, b) => a.displayText.localeCompare(b.displayText)) : this.loopList.sort((a, b) => a.displayText.localeCompare(b.displayText)),
              from: CodeMirror.Pos(cursor.line, loopStart + (prefix.length === 0 ? 1 : 0)),
              to: CodeMirror.Pos(cursor.line, loopEnd),
            }
        }
        else if (beforeCursor.includes('Scale.default=')) {
            const prefix = token.string.slice(0, cursorPosition).replace(/[^a-zA-Z]/g, "");
            const filteredScales = this.scales.filter(scale => scale.displayText.startsWith(prefix));
            return {
            list: filteredScales.length > 0 ? filteredScales.sort((a, b) => a.displayText.localeCompare(b.displayText)) : this.scales.sort((a, b) => a.displayText.localeCompare(b.displayText)),
            from: CodeMirror.Pos(cursor.line, token.start +1),
            to: CodeMirror.Pos(cursor.line, cursorPosition),
            };
        }

        else if (isInsideParentheses) {
            const prefix = token.string.slice(0, cursorPosition - token.start).replace(/[^a-zA-Z:]/g, "");
            let foxdotKeyword = [];
            if (prefix.startsWith('x')) {
                foxdotKeyword = this.fxList.filter(f => f.displayText.toLowerCase().startsWith(prefix.slice(1,).toLowerCase()));;
            }
            else {
                const combinedKeyword = [...this.foxKeyword, ...this.patternFunction];
                foxdotKeyword = combinedKeyword.filter(f => f.displayText.toLowerCase().startsWith(prefix.toLowerCase()));;
            }
            return {
                list: foxdotKeyword.length > 0 ? foxdotKeyword.sort((a, b) => a.displayText.localeCompare(b.displayText)) : foxdotKeyword.sort((a, b) => a.displayText.localeCompare(b.displayText)),
                from: CodeMirror.Pos(cursor.line, token.start),
                to: CodeMirror.Pos(cursor.line, cursorPosition),
                };
        }
        else if (afterLastClosingParenthesis.test(beforeCursor)) {
            const prefix = token.string;
            const filteredPlayerFunction = this.playerFunction.filter(f => f.displayText.startsWith(prefix));
            return {
                list: filteredPlayerFunction.length > 0 ? filteredPlayerFunction.sort((a, b) => a.displayText.localeCompare(b.displayText)) : this.playerFunction.sort((a, b) => a.displayText.localeCompare(b.displayText)),
                from: CodeMirror.Pos(cursor.line, token.start),
                to: CodeMirror.Pos(cursor.line, cursorPosition),
            };
        }
        else if (matchPlayer) {
            const prefix = line.slice(matchPlayer.index + matchPlayer[0].length).trim();
            const filteredSynths = this.synths.filter(synth => synth.displayText.includes(prefix));
            return {
                list: filteredSynths.length > 0 ? filteredSynths.sort((a, b) => a.displayText.localeCompare(b.displayText)) : this.synths.sort((a, b) => a.displayText.localeCompare(b.displayText)),
                from: CodeMirror.Pos(cursor.line, matchPlayer.index + matchPlayer[0].length),
                to: cursor,             
            };
        }
        else {
            const prefix = token.string.slice(0, cursorPosition).replace(/[^a-zA-Z]/g, "");
            const filteredCoolFunctions = this.coolFunction.filter(f => f.displayText.startsWith(prefix));
            return {
                list: filteredCoolFunctions.length > 0 ? filteredCoolFunctions.sort((a, b) => a.displayText.localeCompare(b.displayText)) : this.coolFunction.sort((a, b) => a.displayText.localeCompare(b.displayText)),
                from: CodeMirror.Pos(cursor.line, token.start),
                to: CodeMirror.Pos(cursor.line, cursorPosition),
            };

        }
    }
}