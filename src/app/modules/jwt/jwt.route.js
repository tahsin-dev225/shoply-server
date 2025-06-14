import express from 'express'
import { generateToken } from './generateToken.js';
const router = express.Router()

router.post("/", generateToken);

export const jwtRouter = router;