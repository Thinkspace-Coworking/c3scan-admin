'use server'

import { createClient } from '@/lib/supabase-server'

export async function createSetupIntent() {
  try {
    const supabase = await createClient()
    
    // Get current user
    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (error) {
      // AuthSessionMissingError is expected for unauthenticated users
      throw new Error('Not authenticated')
    }
    
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get operator_id for the user
    const { data: operatorUser, error: operatorError } = await supabase
      .from('operator_users')
      .select('operator_id')
      .eq('user_id', user.id)
      .single()

    if (operatorError || !operatorUser) {
      throw new Error('No operator associated with user')
    }

    // Get Stripe secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error('Stripe not configured')
    }

    // Create SetupIntent via Stripe API
    const response = await fetch('https://api.stripe.com/v1/setup_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'usage': 'off_session',
        'metadata[operator_id]': operatorUser.operator_id,
        'metadata[user_id]': user.id,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to create setup intent')
    }

    const setupIntent = await response.json()

    return {
      clientSecret: setupIntent.client_secret,
    }
  } catch (error) {
    console.error('Error creating setup intent:', error)
    throw error
  }
}

export async function savePaymentMethod(paymentMethodId: string) {
  try {
    const supabase = await createClient()
    
    // Get current user
    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (error) {
      // AuthSessionMissingError is expected for unauthenticated users
      throw new Error('Not authenticated')
    }
    
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get operator_id for the user
    const { data: operatorUser, error: operatorError } = await supabase
      .from('operator_users')
      .select('operator_id')
      .eq('user_id', user.id)
      .single()

    if (operatorError || !operatorUser) {
      throw new Error('No operator associated with user')
    }

    // Get Stripe secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error('Stripe not configured')
    }

    // Retrieve payment method details from Stripe
    const response = await fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethodId}`, {
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to retrieve payment method')
    }

    const paymentMethod = await response.json()

    // Save to database
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert({
        operator_id: operatorUser.operator_id,
        stripe_payment_method_id: paymentMethodId,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        is_default: false,
      })

    if (insertError) {
      throw new Error('Failed to save payment method to database')
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving payment method:', error)
    throw error
  }
}
