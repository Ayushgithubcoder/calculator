import {
  calculateBinary,
  calculateUnary,
  evaluateExpression,
  getSupportedOperations,
} from '../services/calculator.service.js';
import { AppError } from '../middleware/errorHandler.js';

function handleCalculationError(error) {
  throw new AppError(error.message, 400, 'CALCULATION_ERROR');
}

export function evaluate(req, res) {
  const { expression } = req.validatedBody;

  try {
    const result = evaluateExpression(expression);
    res.json({
      success: true,
      data: {
        expression,
        result,
      },
    });
  } catch (error) {
    handleCalculationError(error);
  }
}

export function binary(req, res) {
  const { operation, a, b } = req.validatedBody;

  try {
    const result = calculateBinary(operation, a, b);
    res.json({
      success: true,
      data: {
        operation,
        operands: { a, b },
        result,
      },
    });
  } catch (error) {
    handleCalculationError(error);
  }
}

export function unary(req, res) {
  const { operation, value } = req.validatedBody;

  try {
    const result = calculateUnary(operation, value);
    res.json({
      success: true,
      data: {
        operation,
        operand: value,
        result,
      },
    });
  } catch (error) {
    handleCalculationError(error);
  }
}

export function operations(req, res) {
  res.json({
    success: true,
    data: getSupportedOperations(),
  });
}

export function health(req, res) {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
}
