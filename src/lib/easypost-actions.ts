'use server'

import { createClient } from '@/lib/supabase-server'

// EasyPost API base URL
const EASYPOST_API_URL = 'https://api.easypost.com/v2'

async function getEasyPostApiKey(): Promise<string | null> {
  const supabase = await createClient()
  
  // Get current user
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    // AuthSessionMissingError is expected for unauthenticated users
    return null
  }
  
  if (!user) {
    return null
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

  // Get EasyPost API key from integration_config
  const { data: config, error: configError } = await supabase
    .from('integration_config')
    .select('config_json')
    .eq('operator_id', operatorUser.operator_id)
    .eq('integration_type', 'easypost')
    .eq('is_enabled', true)
    .single()

  if (configError || !config) {
    return null
  }

  return config.config_json?.api_key || null
}

export async function validateEasyPostApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${EASYPOST_API_URL}/api_keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error validating EasyPost API key:', error)
    return false
  }
}

export async function createShipment({
  toAddress,
  fromAddress,
  parcel,
  carrier,
  service,
}: {
  toAddress: {
    name: string
    street1: string
    street2?: string
    city: string
    state: string
    zip: string
    country?: string
    phone?: string
  }
  fromAddress: {
    name: string
    street1: string
    street2?: string
    city: string
    state: string
    zip: string
    country?: string
    phone?: string
  }
  parcel: {
    length: number
    width: number
    height: number
    weight: number // in ounces
  }
  carrier?: string
  service?: string
}) {
  const apiKey = await getEasyPostApiKey()
  if (!apiKey) {
    throw new Error('EasyPost not configured')
  }

  try {
    const response = await fetch(`${EASYPOST_API_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shipment: {
          to_address: {
            ...toAddress,
            country: toAddress.country || 'US',
          },
          from_address: {
            ...fromAddress,
            country: fromAddress.country || 'US',
          },
          parcel: {
            length: parcel.length,
            width: parcel.width,
            height: parcel.height,
            weight: parcel.weight,
          },
          carrier_accounts: carrier ? [{ carrier }] : undefined,
          service: service || undefined,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to create shipment')
    }

    const shipment = await response.json()
    return shipment
  } catch (error) {
    console.error('Error creating EasyPost shipment:', error)
    throw error
  }
}

export async function buyShipmentLabel(shipmentId: string, rateId: string) {
  const apiKey = await getEasyPostApiKey()
  if (!apiKey) {
    throw new Error('EasyPost not configured')
  }

  try {
    const response = await fetch(`${EASYPOST_API_URL}/shipments/${shipmentId}/buy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate: { id: rateId },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to buy label')
    }

    const shipment = await response.json()
    return {
      trackingNumber: shipment.tracking_code,
      labelUrl: shipment.postage_label?.label_url,
      labelPdfUrl: shipment.postage_label?.label_pdf_url,
      rate: shipment.selected_rate,
    }
  } catch (error) {
    console.error('Error buying EasyPost label:', error)
    throw error
  }
}

export async function getShipmentRates({
  toAddress,
  fromAddress,
  parcel,
}: {
  toAddress: {
    name: string
    street1: string
    street2?: string
    city: string
    state: string
    zip: string
    country?: string
    phone?: string
  }
  fromAddress: {
    name: string
    street1: string
    street2?: string
    city: string
    state: string
    zip: string
    country?: string
    phone?: string
  }
  parcel: {
    length: number
    width: number
    height: number
    weight: number
  }
}) {
  const apiKey = await getEasyPostApiKey()
  if (!apiKey) {
    throw new Error('EasyPost not configured')
  }

  try {
    // First create a shipment to get rates
    const shipmentResponse = await fetch(`${EASYPOST_API_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shipment: {
          to_address: {
            ...toAddress,
            country: toAddress.country || 'US',
          },
          from_address: {
            ...fromAddress,
            country: fromAddress.country || 'US',
          },
          parcel: {
            length: parcel.length,
            width: parcel.width,
            height: parcel.height,
            weight: parcel.weight,
          },
        },
      }),
    })

    if (!shipmentResponse.ok) {
      const errorData = await shipmentResponse.json()
      throw new Error(errorData.error?.message || 'Failed to get rates')
    }

    const shipment = await shipmentResponse.json()
    return {
      shipmentId: shipment.id,
      rates: shipment.rates || [],
    }
  } catch (error) {
    console.error('Error getting EasyPost rates:', error)
    throw error
  }
}

export async function trackPackage(trackingCode: string, carrier?: string) {
  const apiKey = await getEasyPostApiKey()
  if (!apiKey) {
    throw new Error('EasyPost not configured')
  }

  try {
    const response = await fetch(`${EASYPOST_API_URL}/trackers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracker: {
          tracking_code: trackingCode,
          carrier: carrier || undefined,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to track package')
    }

    const tracker = await response.json()
    return tracker
  } catch (error) {
    console.error('Error tracking package:', error)
    throw error
  }
}

export async function getTracker(trackerId: string) {
  const apiKey = await getEasyPostApiKey()
  if (!apiKey) {
    throw new Error('EasyPost not configured')
  }

  try {
    const response = await fetch(`${EASYPOST_API_URL}/trackers/${trackerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to get tracker')
    }

    const tracker = await response.json()
    return tracker
  } catch (error) {
    console.error('Error getting tracker:', error)
    throw error
  }
}
