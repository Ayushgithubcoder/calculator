import { useCallback, useEffect, useState } from 'react';
import { checkHealth, evaluateExpression } from '../services/api';

export function useCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const append = useCallback(
    (value) => {
      clearError();
      setExpression((prev) => {
        if (prev === '' && value === '.') return '0.';
        if (prev === '0' && /^\d$/.test(value)) return value;
        return prev + value;
      });
      setDisplay((prev) => {
        if (prev === '0' && /^\d$/.test(value)) return value;
        if (prev === '0' && value !== '.') return value;
        return prev === '0' && value === '.' ? '0.' : prev + value;
      });
    },
    [clearError]
  );

  const appendOperator = useCallback(
    (operator) => {
      clearError();
      setExpression((prev) => {
        if (!prev) return prev;
        const trimmed = prev.trimEnd();
        const lastChar = trimmed.slice(-1);
        if ('+-*/^%'.includes(lastChar)) {
          return trimmed.slice(0, -1) + operator;
        }
        return trimmed + operator;
      });
      setDisplay('0');
    },
    [clearError]
  );

  const appendFunction = useCallback(
    (fn) => {
      clearError();
      setExpression((prev) => prev + fn);
      setDisplay('0');
    },
    [clearError]
  );

  const backspace = useCallback(() => {
    clearError();
    setExpression((prev) => prev.slice(0, -1));
    setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  }, [clearError]);

  const clear = useCallback(() => {
    clearError();
    setExpression('');
    setDisplay('0');
    setLastResult(null);
  }, [clearError]);

  const calculate = useCallback(async () => {
    if (!expression.trim()) return;

    setIsLoading(true);
    clearError();

    try {
      const data = await evaluateExpression(expression);
      setHistory((prev) => [
        { expression: data.expression, result: data.result, id: Date.now() },
        ...prev.slice(0, 9),
      ]);
      setLastResult(data.result);
      setDisplay(String(data.result));
      setExpression(String(data.result));
    } catch (err) {
      setError(err.message || 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  }, [expression, clearError]);

  return {
    display,
    expression,
    history,
    isLoading,
    error,
    lastResult,
    append,
    appendOperator,
    appendFunction,
    backspace,
    clear,
    calculate,
    setExpression,
    setDisplay,
  };
}

export function useApiHealth() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        await checkHealth();
        if (mounted) setStatus('online');
      } catch {
        if (mounted) setStatus('offline');
      }
    }

    check();
    const interval = setInterval(check, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}
