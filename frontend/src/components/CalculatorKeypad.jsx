const BUTTONS = [
  { label: 'C', type: 'action', action: 'clear', span: 1 },
  { label: '⌫', type: 'action', action: 'backspace', span: 1 },
  { label: '(', type: 'function', value: '(', span: 1 },
  { label: ')', type: 'function', value: ')', span: 1 },
  { label: 'sin', type: 'function', value: 'sin(', span: 1 },
  { label: 'cos', type: 'function', value: 'cos(', span: 1 },
  { label: 'tan', type: 'function', value: 'tan(', span: 1 },
  { label: '√', type: 'function', value: 'sqrt(', span: 1 },
  { label: '7', type: 'digit', value: '7', span: 1 },
  { label: '8', type: 'digit', value: '8', span: 1 },
  { label: '9', type: 'digit', value: '9', span: 1 },
  { label: '÷', type: 'operator', value: '/', span: 1 },
  { label: '4', type: 'digit', value: '4', span: 1 },
  { label: '5', type: 'digit', value: '5', span: 1 },
  { label: '6', type: 'digit', value: '6', span: 1 },
  { label: '×', type: 'operator', value: '*', span: 1 },
  { label: '1', type: 'digit', value: '1', span: 1 },
  { label: '2', type: 'digit', value: '2', span: 1 },
  { label: '3', type: 'digit', value: '3', span: 1 },
  { label: '−', type: 'operator', value: '-', span: 1 },
  { label: '0', type: 'digit', value: '0', span: 1 },
  { label: '.', type: 'digit', value: '.', span: 1 },
  { label: 'π', type: 'function', value: 'pi', span: 1 },
  { label: '+', type: 'operator', value: '+', span: 1 },
  { label: 'log', type: 'function', value: 'log10(', span: 2 },
  { label: '^', type: 'operator', value: '^', span: 1 },
  { label: '=', type: 'equals', span: 1 },
];

export default function CalculatorKeypad({
  onDigit,
  onOperator,
  onFunction,
  onAction,
  onEquals,
  isLoading,
}) {
  function handleClick(button) {
    if (isLoading) return;

    switch (button.type) {
      case 'digit':
        onDigit(button.value);
        break;
      case 'operator':
        onOperator(button.value);
        break;
      case 'function':
        onFunction(button.value);
        break;
      case 'action':
        onAction(button.action);
        break;
      case 'equals':
        onEquals();
        break;
      default:
        break;
    }
  }

  return (
    <div className="keypad" role="group" aria-label="Calculator keypad">
      {BUTTONS.map((button) => (
        <button
          key={button.label}
          type="button"
          className={`key key--${button.type}${button.span > 1 ? ' key--wide' : ''}`}
          onClick={() => handleClick(button)}
          disabled={isLoading && button.type === 'equals'}
          aria-label={button.label}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
