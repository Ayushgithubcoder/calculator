export default function CalculatorDisplay({ expression, display, error, isLoading }) {
  return (
    <div className="display" aria-live="polite">
      <div className="display__expression" title={expression}>
        {expression || '\u00A0'}
      </div>
      <div className={`display__result${error ? ' display__result--error' : ''}`}>
        {isLoading ? (
          <span className="display__loading">Calculating…</span>
        ) : error ? (
          error
        ) : (
          display
        )}
      </div>
    </div>
  );
}
