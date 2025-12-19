---
name: nextjs-stripe-integration
description: Complete Stripe payment integration for Next.js 16.0.7 using App Router, Server Actions, TypeScript, and webhook handling. Use when implementing payments, subscriptions, checkout flows, or webhooks in Next.js projects.
dependencies:
  - stripe
  - "@stripe/stripe-js"
version: "1.0.0"
---

# Next.js 16.0.7 + Stripe Integration Skill

## Overview
Complete guide for integrating Stripe payments into Next.js 15 applications using modern patterns:
- Server Actions (no API routes needed for checkout)
- App Router
- TypeScript
- Secure webhook handling
- Production-ready code

## When to Use This Skill
Trigger this skill when you need to:
- Set up Stripe checkout flows
- Implement subscription management
- Process one-time payments
- Handle webhooks securely
- Manage customer portals
- Set up Stripe in Next.js

## Core Architecture Principles

### 1. Server Actions for Business Logic
- Use Server Actions for checkout creation
- No API routes needed for most operations
- Built-in CSRF protection
- Better type safety

### 2. Single API Route for Webhooks
- Only one API route needed: `/api/webhooks/stripe`
- Handles all Stripe events
- Verifies webhook signatures
- Updates database atomically

### 3. Security First
- Never expose secret keys on client
- Always verify webhook signatures
- Use environment variables
- Implement idempotency

## Required File Structure
```
app/
├── actions/
│   └── stripe-checkout.ts       # Server Actions for checkout
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts         # Webhook handler (POST)
├── checkout/
│   └── page.tsx                 # Checkout page
├── success/
│   └── page.tsx                 # Success redirect
└── cancel/
    └── page.tsx                 # Cancel redirect

lib/
└── stripe/
    ├── client.ts               # Client-side Stripe
    ├── server.ts               # Server-side Stripe
    └── config.ts               # Configuration
```

## Implementation Steps

### Step 1: Initialize Stripe (Server-Side)

**File: `lib/stripe/server.ts`**
```typescript
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})
```

### Step 2: Initialize Stripe (Client-Side)

**File: `lib/stripe/client.ts`**
```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return stripePromise
}
```

### Step 3: Create Checkout Server Action

**File: `app/actions/stripe-checkout.ts`**
```typescript
'use server'

import { stripe } from '@/lib/stripe/server'
import { headers } from 'next/headers'

export async function createCheckoutSession(
  amount: number,
  productName: string,
  metadata?: Record<string, string>
) {
  const headersList = headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: metadata || {},
    })

    return { sessionId: session.id, error: null }
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return { 
      sessionId: null, 
      error: 'Failed to create checkout session' 
    }
  }
}
```

### Step 4: Create Webhook Handler

**File: `app/api/webhooks/stripe/route.ts`**
```typescript
import { stripe } from '@/lib/stripe/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('❌ No stripe-signature header')
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  console.log('✅ Webhook received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('💰 Processing checkout:', session.id)
  
  // TODO: Implement your business logic
  // Example: Update database, send confirmation email
  
  const metadata = session.metadata
  console.log('Metadata:', metadata)
  console.log('Amount:', session.amount_total)
  console.log('Customer:', session.customer)
  
  // Example database update (pseudo-code):
  // await db.order.create({
  //   userId: metadata?.userId,
  //   stripeSessionId: session.id,
  //   amount: session.amount_total,
  //   status: 'completed'
  // })
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('💳 Payment succeeded:', paymentIntent.id)
  // Implement your logic
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id)
  // Implement your logic
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription created:', subscription.id)
  // Implement your logic
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)
  // Implement your logic
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription cancelled:', subscription.id)
  // Implement your logic
}
```

### Step 5: Create Checkout Page

**File: `app/checkout/page.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/stripe-checkout'
import { getStripe } from '@/lib/stripe/client'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    try {
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { sessionId, error: sessionError } = await createCheckoutSession(
        2000, // $20.00 in cents
        'Test Product',
        { userId: '123' } // Optional metadata
      )

      if (sessionError || !sessionId) {
        throw new Error(sessionError || 'Failed to create session')
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (redirectError) {
        throw new Error(redirectError.message)
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Test Product</h1>
        <p className="text-gray-600 mb-6">Price: $20.00</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  )
}
```

### Step 6: Create Success Page

**File: `app/success/page.tsx`**
```typescript
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-4 text-green-600">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase.
        </p>
        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Session ID: {sessionId}
          </p>
        )}
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
```

### Step 7: Create Cancel Page

**File: `app/cancel/page.tsx`**
```typescript
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-4 text-red-600">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <Link
          href="/checkout"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
```

## Testing Guidelines

### Development Testing Checklist
- [ ] Test successful payment with card 4242 4242 4242 4242
- [ ] Test declined payment with card 4000 0000 0000 0002
- [ ] Verify webhook signature validation
- [ ] Test webhook event processing
- [ ] Verify success/cancel redirects work
- [ ] Check console logs for webhook events

### Test Cards
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184

Use any future expiry date, any 3-digit CVC, any ZIP code.

## Security Checklist
- [ ] Environment variables configured
- [ ] Webhook signature verification implemented
- [ ] Secret keys never exposed to client
- [ ] HTTPS in production
- [ ] Input validation on all user data
- [ ] Error messages don't leak sensitive data

## Common Issues

### "Invalid signature" error
- Verify STRIPE_WEBHOOK_SECRET is correct
- Ensure using `req.text()` not `req.json()`
- Check webhook endpoint URL is correct

### Webhook not receiving events
- Verify Stripe CLI is running
- Check endpoint URL matches CLI forward path
- Ensure Next.js dev server is running

### TypeScript errors
- Install @types/stripe
- Verify Stripe SDK version compatibility
- Check environment variables are typed

## Production Deployment Notes
1. Switch to live Stripe API keys
2. Configure webhook URL in Stripe Dashboard
3. Update NEXT_PUBLIC_APP_URL to production domain
4. Test webhook delivery in production
5. Set up monitoring and logging
6. Configure proper error handling