import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { authenticate } from './middleware/auth'
import partnerRoutes from './routes/partnerRoutes'
import leadRoutes from './routes/leadRoutes'
import analyticsRoutes from './routes/analyticsRoutes'
import bulkRoutes from './routes/bulkRoutes'
import walletRoutes from './routes/walletRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/partners', partnerRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/bulk', bulkRoutes)
app.use('/api/wallet', walletRoutes)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'SkillCircle CRM API is running' })
})

// Protected Example Route
app.get('/api/protected-example', authenticate, (req: Request, res: Response) => {
  res.status(200).json({ message: 'This is a protected route', user: (req as any).user })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
