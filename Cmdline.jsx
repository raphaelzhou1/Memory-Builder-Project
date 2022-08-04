import Commands from 'commands';
import React from 'react';
import KeyEventToString from 'key-event-to-string';

import './reset.css';
import Browse from './Browse.jsx';
import Query from './Query.jsx';
import SearchInfo from './SearchInfo.jsx';

const keyEventToString = KeyEventToString();

class Cmdline extends React.Component { /* eslint react/prefer-stateless-function: 0 */

  constructor() {
    super();
    this.handleBrowseKeyDown = this.handleBrowseKeyDown.bind(this);
    this.handleQueryKeyDown = this.handleQueryKeyDown.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  handleBrowseKeyDown(e) {
    let command = null;

    switch (keyEventToString(e)) {
      case 'Enter': {
        command = Commands.SELECT;
        break;
      }
      case 'Cmd + Enter': {
        command = Commands.OPEN;
        break;
      }
      case 'Shift + Enter': {
        command = Commands.SOFT_SELECT;
        break;
      }
      case 'Y': {
        command = Commands.YANK;
        break;
      }
      case 'N': {
        command = Commands.BROWSE_NEXT;
        break;
      }
      case 'Shift + N': {
        command = Commands.BROWSE_PREVIOUS;
        break;
      }
      case 'H': {
        command = Commands.FOCUS_PREVIOUS_SIBLING;
        break;
      }
      case 'L': {
        command = Commands.FOCUS_NEXT_SIBLING;
        break;
      }
      case 'J': {
        command = Commands.FOCUS_PARENT;
        break;
      }
      case 'K': {
        command = Commands.FOCUS_CHILD;
        break;
      }
      case 'Cmd + Y': {
        command = Commands.YANK_META;
        break;
      }
      default: {
        // do nothing
      }
    }

    if (command) {
      e.stopPropagation();
      e.preventDefault();
      this.props.onCommand(command);
    }
  }

  handleQueryKeyDown(e) {
    let command = null;
    let options = {};

    // If the input is a number and we are waiting for input, issue a command
    // to move the tab to the entered number
    if (this.awaitingInput) {
      this.awaitingInput = false;

      e.stopPropagation();
      e.preventDefault();

      const input = keyEventToString(e);

      if (!isNaN(parseInt(input, 10))) {
        command = Commands.MOVE_TAB;
        options = { target: parseInt(keyEventToString(e), 10) };
      }
    }

    switch (keyEventToString(e)) {
      case 'Enter': {
        command = Commands.BROWSE_FIRST;
        break;
      }
      case 'Shift + Enter': {
        command = Commands.BROWSE_LAST;
        break;
      }
      case 'Ctrl + K': {
        command = Commands.CLOSE_UNPINNED;
        break;
      }
      case 'Ctrl + P': {
        command = Commands.BACK;
        break;
      }
      case 'Ctrl + M': {
        this.awaitingInput = true;
        break;
      }
      case 'Ctrl + N': {
        command = Commands.FORWARD;
        break;
      }
      default: {
        // do nothing
      }
    }

    if (command) { this.props.onCommand(command, options); }
  }

  handleQueryChange(e) {
    this.props.onQuery(e.target.value);
  }

  render() {
    const store = this.props.store;
    const { currentMatch, mode, searchResults, settings } = store.getState();

    return (
      <main
        style={{
          backgroundColor: settings.backgroundColor || '#eee',
          borderTop: `2px solid ${settings.borderColor || '#444'}`,
          bottom: 0,
          boxShadow: `0 0 3px 0 ${settings.borderColor || '#444'}`,
          boxSizing: 'border-box',
          color: settings.textColor,
          display: (mode === 'INACTIVE' ? 'none' : 'block'),
          fontFamily: settings.fontFamily || 'monospace',
          fontSize: 16,
          height: 70,
          left: 0,
          padding: 10,
          position: 'fixed',
          right: 0,
          width: '100%',
        }}
      >
        <Query
          onKeyDown={this.handleQueryKeyDown}
          onChange={this.handleQueryChange}
        />
        <SearchInfo
          currentMatch={currentMatch}
          infoColor={settings.infoColor}
          numberOfMatches={searchResults.numberOfMatches}
          overMaxNumber={searchResults.overMaxNumber}
          warningColor={settings.warningColor}
        />
        <Browse
          onKeyDown={this.handleBrowseKeyDown}
        />
      </main>
    );
  }

}

Cmdline.propTypes = {
  onCommand: React.PropTypes.func,
  onQuery: React.PropTypes.func,
  store: React.PropTypes.object,
};

export default Cmdline;
