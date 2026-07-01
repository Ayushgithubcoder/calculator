import { Router } from 'express';
import {
  binary,
  evaluate,
  health,
  operations,
  unary,
} from '../controllers/calculator.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  binaryOperationSchema,
  expressionSchema,
  unaryOperationSchema,
  validateBody,
} from '../middleware/validate.js';

const router = Router();

router.get('/health', asyncHandler(health));
router.get('/operations', asyncHandler(operations));
router.post('/evaluate', validateBody(expressionSchema), asyncHandler(evaluate));
router.post('/binary', validateBody(binaryOperationSchema), asyncHandler(binary));
router.post('/unary', validateBody(unaryOperationSchema), asyncHandler(unary));

export default router;
