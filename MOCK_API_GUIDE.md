# Mock API Testing Guide

## Overview

The Fish Retail Management System includes a comprehensive mock API system for testing and development. This allows you to test all features without a real database connection.

## Configuration

### Enable Mock API Mode

Set the environment variable in your `.env.local` or `.env`:

```
PRODUCTION_MODE=false
```

When `PRODUCTION_MODE` is `false` (default), the application uses mock data and in-memory storage instead of connecting to the database.

To use the real database:
```
PRODUCTION_MODE=true
```

## Mock Data Included

### Suppliers (3 preloaded)
- Fresh Fish Co
- Ocean Harvest Ltd
- Aquatic Traders

### Deliveries (4 preloaded)
- Multiple deliveries from each supplier with varying stock quantities and costs

### Daily Sales (2 preloaded)
- Sales records for Feb 16 and Feb 17, 2024
- Multiple sale entries per day with different suppliers

### Payments (2 preloaded)
- Sample payments recorded for suppliers

## Features Available in Mock Mode

All features work identically in mock mode:
- ✅ View all suppliers
- ✅ Add new suppliers (persists in memory)
- ✅ View supplier details with transaction history
- ✅ Track deliveries
- ✅ Add new deliveries
- ✅ Record sales with automatic stock deduction (FIFO)
- ✅ Record payments
- ✅ Dashboard with real-time metrics
- ✅ Form validation (same as production)

## Important Notes

### Data Persistence
- Mock data persists **during the current session only**
- Data resets when the development server restarts
- New suppliers, deliveries, sales, and payments are stored in-memory

### Limitations
- Stock deduction follows FIFO logic but simplified for testing
- Payments don't prevent over-completion scenarios in mock mode
- No actual database queries or transactions
- Dashboard metrics are calculated in-memory

### Testing Without a Database

Perfect for:
- Development and testing features
- Demoing the application
- Testing UI components
- Validating form inputs
- Understanding data flow

## API Endpoints with Mock Support

All endpoints check `useMockApi()` and return mock data when enabled:

### Suppliers
- `GET /api/suppliers` - Returns mock supplier list
- `POST /api/suppliers` - Creates new mock supplier
- `GET /api/suppliers/[id]` - Returns mock supplier with transactions

### Deliveries
- `GET /api/deliveries` - Returns mock deliveries
- `POST /api/deliveries` - Creates new mock delivery

### Daily Sales
- `POST /api/daily-sales` - Records mock sale with stock deduction

### Payments
- `POST /api/payments` - Records mock payment

## Switching to Production

When ready to use a real database:

1. Set up PostgreSQL database
2. Configure `DATABASE_URL` in your environment
3. Set `PRODUCTION_MODE=true`
4. Run Prisma migrations: `npx prisma migrate dev`

The application will automatically use the database instead of mock data.

## Resetting Mock Data

To reset mock data to initial state, restart your development server:

```bash
npm run dev
# or
pnpm dev
```

For manual reset in code, use the `resetMockData()` function from `lib/mock-api.ts`:

```typescript
import { resetMockData } from '@/lib/mock-api';
resetMockData();
```

## Development Tips

1. **Check Current Mode**: Look at the environment variable to confirm mock mode is active
2. **Test Data Flow**: Use mock mode to understand how data flows through the app
3. **Form Testing**: Mock mode is ideal for testing all form validations
4. **UI Development**: Develop UI components without database setup
5. **Transition to Production**: When switching to production, no code changes needed—just update environment variables

## File Structure

Mock API files are organized as:
- `lib/mock-data.ts` - Mock data definitions
- `lib/mock-api.ts` - Mock API functions and in-memory storage
- `app/api/*/route.ts` - API endpoints with mock checks

All API routes check `useMockApi()` first and fall back to Prisma for production.
