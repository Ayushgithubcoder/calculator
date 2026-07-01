import { useEffect } from 'react';
import CalculatorDisplay from './components/CalculatorDisplay';
import CalculatorKeypad from './components/CalculatorKeypad';
import HistoryPanel from './components/HistoryPanel';
import { useApiHealth, useCalculator } from './hooks/useCalculator';

function StatusBadge({ status }) {
  return (
    <span className={`status status--${status}`} role="status">
      <span className="status__dot" />
      API {status}
    </span>
  );
}

export default function App() {
  const apiStatus = useApiHealth();
  const {
    display,
    expression,
    history,
    isLoading,
    error,
    append,
    appendOperator,
    appendFunction,
    backspace,
    clear,
    calculate,
    setExpression,
    setDisplay,
  } = useCalculator();

  useEffect(() => {
    function handleKeyDown(event) {
      const { key } = event;

      if (key >= '0' && key <= '9') {
        event.preventDefault();
        append(key);
        return;
      }

      if (key === '.') {
        event.preventDefault();
        append('.');
        return;
      }

      if (['+', '-', '*', '/'].includes(key)) {
        event.preventDefault();
        appendOperator(key);
        return;
      }

      if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
        return;
      }

      if (key === 'Backspace') {
        event.preventDefault();
        backspace();
        return;
      }

      if (key === 'Escape') {
        event.preventDefault();
        clear();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [append, appendOperator, backspace, calculate, clear]);

  function handleAction(action) {
    if (action === 'clear') clear();
    if (action === 'backspace') backspace();
  }

  function handleHistorySelect(item) {
    setExpression(String(item.result));
    setDisplay(String(item.result));
  }

  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />

      <header className="header">
        <div>
          <h1 className="header__title">Calculator</h1>
          <p className="header__subtitle">Node.js API · React UI</p>
        </div>
        <StatusBadge status={apiStatus} />
      </header>

      <main className="layout">
        <section className="calculator" aria-label="Calculator">
          <CalculatorDisplay
            expression={expression}
            display={display}
            error={error}
            isLoading={isLoading}
          />
          <CalculatorKeypad
            onDigit={append}
            onOperator={appendOperator}
            onFunction={appendFunction}
            onAction={handleAction}
            onEquals={calculate}
            isLoading={isLoading}
          />
        </section>

        <HistoryPanel history={history} onSelect={handleHistorySelect} />
      </main>

      <footer className="footer">
        Press <kbd>Enter</kbd> to calculate · <kbd>Esc</kbd> to clear
      </footer>
    </div>
  );
}
