import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBinary,
  calculateUnary,
  evaluateExpression,
} from '../services/calculator.service.js';

describe('calculator.service', () => {
  describe('evaluateExpression', () => {
    it('evaluates basic arithmetic', () => {
      assert.equal(evaluateExpression('2 + 3 * 4'), 14);
      assert.equal(evaluateExpression('(2 + 3) * 4'), 20);
    });

    it('supports scientific functions', () => {
      assert.equal(evaluateExpression('sqrt(16)'), 4);
      assert.equal(evaluateExpression('sin(0)'), 0);
    });

    it('rejects empty expressions', () => {
      assert.throws(() => evaluateExpression(''), /cannot be empty/);
    });

    it('rejects division by zero in expressions', () => {
      assert.throws(() => evaluateExpression('1/0'), /Invalid mathematical expression/);
    });
  });

  describe('calculateBinary', () => {
    it('adds two numbers', () => {
      assert.equal(calculateBinary('add', 2, 3), 5);
    });

    it('throws on division by zero', () => {
      assert.throws(() => calculateBinary('divide', 10, 0), /Division by zero/);
    });
  });

  describe('calculateUnary', () => {
    it('computes square root', () => {
      assert.equal(calculateUnary('sqrt', 25), 5);
    });

    it('throws on negative sqrt', () => {
      assert.throws(() => calculateUnary('sqrt', -1), /negative number/);
    });
  });
});
