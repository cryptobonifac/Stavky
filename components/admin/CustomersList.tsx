'use client'

import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Pagination,
  Stack,
  Typography,
  Box,
} from '@mui/material'
import { useTranslations } from 'next-intl'

type CustomerData = {
  id: string
  email: string
  created_at: string
  account_active_until: string | null
  valid_to: string | null
  status: 'active' | 'inactive'
}

type CustomersListProps = {
  customers: CustomerData[]
}

const CUSTOMERS_PER_PAGE = 15

const CustomersList = ({ customers }: CustomersListProps) => {
  const t = useTranslations('customers')
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalCustomers = customers.length
  const totalPages = Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CUSTOMERS_PER_PAGE
  const endIndex = startIndex + CUSTOMERS_PER_PAGE
  const paginatedCustomers = customers.slice(startIndex, endIndex)

  // Reset to page 1 when customers change
  useEffect(() => {
    setCurrentPage(1)
  }, [customers.length])

  if (customers.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          color: '#666',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Typography sx={{ fontSize: '0.95rem' }}>
          {t('noCustomers')}
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
      }}
    >
      <Stack spacing={3}>
        {/* Customers List */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Grid Header (hidden on mobile) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: '120px 1fr 100px 120px',
              gap: 2,
              p: 2,
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#666',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {t('dateOfRegistration')}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#666',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {t('email')}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#666',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}
            >
              {t('status')}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#666',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'right',
              }}
            >
              {t('validTo')}
            </Typography>
          </Box>

          {/* Customers Grid */}
          <Stack spacing={0}>
            {paginatedCustomers.map((customer, index) => {
              const statusColor = customer.status === 'active' ? '#16a34a' : '#dc2626'
              const validToDate = customer.valid_to 
                ? dayjs(customer.valid_to) 
                : customer.account_active_until 
                ? dayjs(customer.account_active_until)
                : null

              return (
                <Box
                  key={customer.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '120px 1fr 100px 120px',
                    },
                    gap: { xs: 0.5, md: 2 },
                    p: { xs: '0.75rem', md: '0.56rem' },
                    borderBottom:
                      index < paginatedCustomers.length - 1
                        ? '1px solid #f0f0f0'
                        : 'none',
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                    transition: 'background-color 0.2s',
                    alignItems: 'center',
                  }}
                >
                  {/* Date of Registration */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '0.75rem', md: '0.9rem' },
                        color: '#666',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dayjs(customer.created_at).format('DD.MM.YYYY')}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '0.8rem', md: '0.95rem' },
                        color: '#1a1a1a',
                        fontWeight: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {customer.email}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'flex-start', md: 'center' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '0.75rem', md: '0.85rem' },
                        fontWeight: 600,
                        color: statusColor,
                        textTransform: 'uppercase',
                      }}
                    >
                      {customer.status === 'active' ? t('active') : t('inactive')}
                    </Typography>
                  </Box>

                  {/* Valid To */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '0.75rem', md: '0.9rem' },
                        color: '#666',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {validToDate ? validToDate.format('DD.MM.YYYY') : '-'}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Stack>

          {/* Pagination */}
          {totalCustomers > 0 && (
            <Box
              sx={{
                p: 3,
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              )}
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#666',
                }}
              >
                {t('showing')} {startIndex + 1}–{Math.min(endIndex, totalCustomers)}{' '}
                {t('of')} {totalCustomers}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

export default CustomersList




