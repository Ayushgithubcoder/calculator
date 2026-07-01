import { z } from 'zod';

const finiteNumber = z
  .number({ invalid_type_error: 'Must be a number' })
  .finite('Must be a finite number');

export const expressionSchema = z.object({
  expression: z
    .string({ required_error: 'Expression is required' })
    .min(1, 'Expression cannot be empty')
    .max(256, 'Expression is too long'),
});

export const binaryOperationSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide', 'power', 'modulo']),
  a: finiteNumber,
  b: finiteNumber,
});

export const unaryOperationSchema = z.object({
  operation: z.enum(['sqrt', 'negate', 'sin', 'cos', 'tan', 'log', 'ln']),
  value: finiteNumber,
});

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.') || 'body',
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: errors,
        },
      });
    }

    req.validatedBody = result.data;
    return next();
  };
}
