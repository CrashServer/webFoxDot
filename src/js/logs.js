export const logsUtils = {
  isResizing: false,
  editorContainer: document.getElementById('editor-container'),
  logPanel: document.getElementById('logPanel'),
  logSeparator: document.getElementById('logSeparator'),
  logs: document.getElementById('logs'),

  initResize: function(editor) {
    this.logPanel.addEventListener('mousedown', (e) => {
      this.isResizing = true;
      document.addEventListener('mousemove', this.resize.bind(this, editor));
      document.addEventListener('mouseup', this.stopResize.bind(this));
    });
  },

  // Console resizing
  resize: function(editor, e) {
    if (this.isResizing) {
      const containerHeight = this.editorContainer.clientHeight;
      const newLogsHeight = containerHeight - e.clientY;
      this.logPanel.style.height = `${newLogsHeight}px`;
      editor.getWrapperElement().style.height = `${containerHeight - newLogsHeight}px`;
      editor.refresh();
    }
  },

  // Stop resizing
  stopResize: function() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
  },

  // Show logs in the console
  appendLog(message, color) {
    const entry = document.createElement('pre');
    entry.className = 'log-entry';
    if (color){
      entry.style.color = color;
    }
    if (message.includes('Traceback')) {
      message = this.formatErrorMessage(message);
      entry.classList.add('error-log');
    }
    else if (!message.includes('>>')) {
      entry.classList.add('help');
    }
    entry.textContent = message;
    this.logs.insertBefore(entry, logs.firstChild);
    this.logs.scrollTop = 0;
  },

  formatErrorMessage(errorMessage) {
    const lines = errorMessage.split('\n');
    const caretIndex = lines.findIndex(line => line.includes('File "FoxDot", line 1'));
    if (caretIndex) {
        return lines.slice(caretIndex + 1).join('\n');
    } else {
        return errorMessage;
    }
  }
};