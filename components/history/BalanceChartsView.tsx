'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { useTranslations } from 'next-intl'
import CombinedBalanceChart from './CombinedBalanceChart'

type CompanyData = {
  id: string
  name: string
  data: Array<{ date: string; balance: number; profit: number }>
}

type BalanceData = {
  companies: CompanyData[]
  combined: Array<{ date: string; balance: number }>
}

const BalanceChartsView = () => {
  const t = useTranslations('history.balanceCharts')
  const [data, setData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/balance-history')

        if (!response.ok) {
          throw new Error('Failed to fetch balance data')
        }

        const balanceData = await response.json()
        setData(balanceData)
      } catch (err) {
        console.error('Error fetching balance data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBalanceData()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          backgroundColor: '#fafafa',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
        <Alert severity="error">
          {t('errorLoading') || 'Failed to load balance data'}
        </Alert>
      </Box>
    )
  }

  if (!data || data.companies.length === 0 || data.combined.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: '#fafafa',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: '0.95rem', color: '#666' }}>
          {t('noData')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: '#fafafa',
        minHeight: '100vh',
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 500,
            color: '#1a1a1a',
          }}
        >
          {t('title')}
        </Typography>
      </Box>

      {/* Chart */}
      <CombinedBalanceChart
        companies={data.companies}
        combinedData={data.combined}
        height={500}
      />

      {/* Summary Stats (Optional - could be added later) */}
      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {data.companies.map((company) => {
          const latestBalance =
            company.data.length > 0
              ? company.data[company.data.length - 1].balance
              : 0

          return (
            <Box
              key={company.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                p: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                minWidth: { xs: '100%', sm: '200px' },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#666',
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                {company.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: latestBalance >= 0 ? '#16a34a' : '#dc2626',
                }}
              >
                {latestBalance.toFixed(2).replace('.', ',')} €
              </Typography>
            </Box>
          )
        })}

        {/* Combined Total */}
        {data.combined.length > 0 && (
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              p: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: { xs: '100%', sm: '200px' },
              border: '2px solid #16a34a',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: '#666',
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              {t('combined')}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color:
                  data.combined[data.combined.length - 1].balance >= 0
                    ? '#16a34a'
                    : '#dc2626',
              }}
            >
              {data.combined[data.combined.length - 1].balance
                .toFixed(2)
                .replace('.', ',')}{' '}
              €
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default BalanceChartsView
