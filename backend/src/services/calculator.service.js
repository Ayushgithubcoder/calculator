import { create, all } from 'mathjs';

const math = create(all, {
  number: 'number',
  precision: 14,
});

const ALLOWED_FUNCTIONS = new Set([
  'abs', 'acos', 'asin', 'atan', 'ceil', 'cos', 'exp', 'floor',
  'log', 'log10', 'max', 'min', 'pow', 'round', 'sin', 'sqrt', 'tan',
]);

const BINARY_OPERATIONS = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  },
  power: (a, b) => Math.pow(a, b),
  modulo: (a, b) => {
    if (b === 0) {
      throw new Error('Modulo by zero is not allowed');
    }
    return a % b;
  },
};

const UNARY_OPERATIONS = {
  sqrt: (a) => {
    if (a < 0) {
      throw new Error('Square root of negative number is not allowed');
    }
    return Math.sqrt(a);
  },
  negate: (a) => -a,
  sin: (a) => Math.sin(a),
  cos: (a) => Math.cos(a),
  tan: (a) => Math.tan(a),
  log: (a) => {
    if (a <= 0) {
      throw new Error('Logarithm requires a positive number');
    }
    return Math.log10(a);
  },
  ln: (a) => {
    if (a <= 0) {
      throw new Error('Natural logarithm requires a positive number');
    }
    return Math.log(a);
  },
};

function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new Error('Result is not a finite number');
  }

  const rounded = math.round(value, 10);
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function evaluateExpression(expression) {
  const trimmed = expression.trim();

  if (!trimmed) {
    throw new Error('Expression cannot be empty');
  }

  if (trimmed.length > 256) {
    throw new Error('Expression is too long');
  }

  try {
    const node = math.parse(trimmed);

    node.traverse((childNode, _path, parent) => {
      if (childNode.isFunctionNode && !ALLOWED_FUNCTIONS.has(childNode.fn.name)) {
        throw new Error(`Function "${childNode.fn.name}" is not allowed`);
      }

      if (childNode.isSymbolNode) {
        const isConstant = childNode.name === 'pi' || childNode.name === 'e';
        const isFunctionName =
          parent?.isFunctionNode && parent.fn?.name === childNode.name;

        if (!isConstant && !isFunctionName) {
          throw new Error(`Variable "${childNode.name}" is not allowed`);
        }
      }
    });

    const result = node.evaluate();
    return formatResult(result);
  } catch (error) {
    if (error.message.includes('is not allowed') || error.message.includes('cannot be empty')) {
      throw error;
    }
    throw new Error('Invalid mathematical expression');
  }
}

export function calculateBinary(operation, a, b) {
  const fn = BINARY_OPERATIONS[operation];
  if (!fn) {
    throw new Error(`Unknown operation: ${operation}`);
  }

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Operands must be finite numbers');
  }

  return formatResult(fn(a, b));
}

export function calculateUnary(operation, value) {
  const fn = UNARY_OPERATIONS[operation];
  if (!fn) {
    throw new Error(`Unknown operation: ${operation}`);
  }

  if (!Number.isFinite(value)) {
    throw new Error('Operand must be a finite number');
  }

  return formatResult(fn(value));
}

export function getSupportedOperations() {
  return {
    binary: Object.keys(BINARY_OPERATIONS),
    unary: Object.keys(UNARY_OPERATIONS),
    expression: {
      allowedFunctions: [...ALLOWED_FUNCTIONS],
      constants: ['pi', 'e'],
      operators: ['+', '-', '*', '/', '^', '(', ')'],
    },
  };
}
