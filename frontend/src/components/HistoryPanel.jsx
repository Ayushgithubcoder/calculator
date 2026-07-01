export default function HistoryPanel({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <aside className="history history--empty">
        <h2 className="history__title">History</h2>
        <p className="history__placeholder">Your calculations will appear here</p>
      </aside>
    );
  }

  return (
    <aside className="history">
      <h2 className="history__title">History</h2>
      <ul className="history__list">
        {history.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="history__item"
              onClick={() => onSelect(item)}
              title={`Reuse result: ${item.result}`}
            >
              <span className="history__expression">{item.expression}</span>
              <span className="history__result">= {item.result}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
