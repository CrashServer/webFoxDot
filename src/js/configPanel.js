// Config panel setup to change the editor's font, theme, font size, interface font size and open a modal with the shortcuts. Save the user's preferences in the local storage.

export function setupConfigPanel(editor) {
    const configButton = document.getElementById('configButton');
    const configPanel = document.getElementById('configPanel');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontInterfaceSizeSlider = document.getElementById('fontInterfaceSizeSlider');
    const fontInterfaceSizeValue = document.getElementById('fontInterfaceSizeValue');
    const keybindingsSelect = document.getElementById('keybindingsSelect');
    const modal = document.getElementById("shortcutsModal");
    const modalbtn = document.getElementById("openModalShortCutBtn");
    const closeModal = document.getElementById("closeModal");
     
    // Font change
    fontSelect.addEventListener('change', (e) => {
        const font = e.target.value;
        editor.getWrapperElement().style.fontFamily = font;
        document.body.style.fontFamily = font;
        localStorage.setItem('webFoxPreferredFont', font);
    });

    // Font restore
    const savedFont = localStorage.getItem('webFoxPreferredFont');
    if (savedFont) {
        fontSelect.value = savedFont;
        editor.getWrapperElement().style.fontFamily = savedFont;
        }

    // Keybindings restore
    const savedKeybindings = localStorage.getItem('webFoxPreferredKeybindings');
    if (savedKeybindings) {
        keybindingsSelect.value = savedKeybindings;
        editor.setOption('keyMap', savedKeybindings);
    }

    // Open the panel
    configButton.addEventListener('click', () => {
        configPanel.classList.toggle('open');
    });

    // Close the panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!configPanel.contains(e.target) && 
            !configButton.contains(e.target) && 
            configPanel.classList.contains('open')) {
            configPanel.classList.remove('open');
        }
    });

    // Theme change
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        editor.setOption('theme', theme);
        localStorage.setItem('webFoxPreferredTheme', theme);
    });

    // Theme restore
    const savedTheme = localStorage.getItem('webFoxPreferredTheme');
    if (savedTheme) {
        editor.setOption('theme', savedTheme);
        themeSelect.value = savedTheme;
    }

    // Font size restore
    const savedSize = localStorage.getItem('webFoxPreferredFontSize');
    if (savedSize) {
        fontSizeSlider.value = savedSize;
        updateFontSize(savedSize);
    }

    // Interface font size restore
    const savedInterfaceSize = localStorage.getItem('webFoxPreferredInterfaceFontSize');
    if (savedInterfaceSize) {
        fontInterfaceSizeSlider.value = savedInterfaceSize;
        updateInterfaceFontSize(savedInterfaceSize);
    }

    // Font size change
    fontSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        updateFontSize(size);
        });

    // Font size update
    function updateFontSize(size) {
        fontSizeValue.textContent = size;
        editor.getWrapperElement().style.fontSize = size + 'px';
        editor.refresh();
        localStorage.setItem('webFoxPreferredFontSize', size);
    }

    // Interface font size change
    fontInterfaceSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        updateInterfaceFontSize(size);
        });
    
    // Interface font size update
    function updateInterfaceFontSize(size) {
        fontInterfaceSizeValue.textContent = size;
        document.documentElement.style.fontSize = size + 'px';
        localStorage.setItem('webFoxPreferredInterfaceFontSize', size);
    };

    // Keybindings change
    keybindingsSelect.addEventListener('change', (e) => {
        const keybindings = e.target.value;
        editor.setOption('keyMap', keybindings);
        localStorage.setItem('webFoxPreferredKeybindings', keybindings);
    });

    // Open the shortcut modal
    modalbtn.onclick = function() {
        modal.style.display = "block";
    }

    // Close the shortcut modal
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }

    // Theme change
    // themeInterface.addEventListener('change', (event) => {
    //     if (event.target.checked) {
    //         document.documentElement.classList.remove('light-theme');
    //     } else {
    //         document.documentElement.classList.add('light-theme');
    //     }
    //   });
    const themeInterfaceSelector = document.getElementById('themeInterfaceSelector');
    
    // Restore the interface theme
    const savedInterfaceTheme = localStorage.getItem('selectedInterfaceTheme') || 'dark';
    document.documentElement.className = `${savedInterfaceTheme}-theme`;
    themeInterfaceSelector.value = savedInterfaceTheme;
    
    // Gérer le changement de thème
    themeInterfaceSelector.addEventListener('change', (e) => {
        const selectedInterfaceTheme = e.target.value;
        document.documentElement.className = `${selectedInterfaceTheme}-theme`;
        localStorage.setItem('selectedInterfaceTheme', selectedInterfaceTheme);
    });
}

export function updateHelpPanel(loopList, fxList, synthList) {
    document.getElementById('helpLoop').innerHTML = loopList
        .map(loop => `<span>${loop.displayText}</span>`)
        .join('');
    document.getElementById('helpFx').innerHTML = fxList
        .filter(loop => !loop.displayText.endsWith("_"))
        .map(fx => `<span>${fx.displayText}</span>`)
        .join('');
    document.getElementById('helpSynth').innerHTML = synthList
        .filter(synth => !synth.displayText.endsWith("_"))
        .map(synth => `<span>${synth.displayText}</span>`)
        .join('');
} 

