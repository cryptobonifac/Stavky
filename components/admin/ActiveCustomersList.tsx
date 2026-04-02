'use client'

import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Pagination,
  Stack,
  Typography,
  Box,
  IconButton,
  Collapse,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useTranslations } from 'next-intl'

import type { ActivationRecord, ActiveCustomerData } from '@/app/[locale]/admin/active-customers/page'

type ActiveCustomersListProps = {
  customers: ActiveCustomerData[]
}

const CUSTOMERS_PER_PAGE = 15

const headerSx = {
  fontSize: '0.8rem',
  color: '#666',
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const ActiveCustomersList = ({ customers }: ActiveCustomersListProps) => {
  const t = useTranslations('activeCustomers')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const totalCustomers = customers.length
  const totalPages = Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CUSTOMERS_PER_PAGE
  const endIndex = startIndex + CUSTOMERS_PER_PAGE
  const paginatedCustomers = customers.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [customers.length])

  const toggleExpanded = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

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
          {t('noActiveCustomers')}
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
              gridTemplateColumns: '1fr 120px 100px 120px 100px 48px',
              gap: 2,
              p: 2,
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
              alignItems: 'center',
            }}
          >
            <Typography sx={headerSx}>{t('email')}</Typography>
            <Typography sx={{ ...headerSx, textAlign: 'center' }}>{t('referenceNumber')}</Typography>
            <Typography sx={{ ...headerSx, textAlign: 'center' }}>{t('status')}</Typography>
            <Typography sx={{ ...headerSx, textAlign: 'center' }}>{t('activeUntil')}</Typography>
            <Typography sx={{ ...headerSx, textAlign: 'center' }}>{t('totalActiveMonths')}</Typography>
            <Box />
          </Box>

          {/* Customer Rows */}
          <Stack spacing={0}>
            {paginatedCustomers.map((customer, index) => {
              const statusColor = customer.status === 'active' ? '#16a34a' : '#dc2626'
              const activeUntilDate = customer.account_active_until
                ? dayjs(customer.account_active_until)
                : null
              const isExpanded = expandedRows.has(customer.id)

              return (
                <Box key={customer.id}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 120px 100px 120px 100px 48px',
                      },
                      gap: { xs: 0.5, md: 2 },
                      p: { xs: '0.75rem', md: '0.56rem' },
                      borderBottom:
                        index < paginatedCustomers.length - 1 && !isExpanded
                          ? '1px solid #f0f0f0'
                          : 'none',
                      '&:hover': { backgroundColor: '#fafafa' },
                      transition: 'background-color 0.2s',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleExpanded(customer.id)}
                  >
                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
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

                    {/* Reference Number */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '0.75rem', md: '0.85rem' },
                          color: '#666',
                          fontWeight: 500,
                        }}
                      >
                        {customer.reference_number || '-'}
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' } }}>
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

                    {/* Active Until */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '0.75rem', md: '0.9rem' },
                          color: '#666',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {activeUntilDate ? activeUntilDate.format('DD.MM.YYYY') : '-'}
                      </Typography>
                    </Box>

                    {/* Total Active Months */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '0.75rem', md: '0.9rem' },
                          color: '#1a1a1a',
                          fontWeight: 600,
                        }}
                      >
                        {customer.totalActiveMonths}
                      </Typography>
                    </Box>

                    {/* Expand/Collapse Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleExpanded(customer.id) }}>
                        {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Expanded History */}
                  <Collapse in={isExpanded}>
                    <Box
                      sx={{
                        px: { xs: 2, md: 4 },
                        py: 2,
                        backgroundColor: '#f8f9fa',
                        borderBottom: index < paginatedCustomers.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#444',
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('activationHistory')}
                      </Typography>
                      {customer.history.length === 0 ? (
                        <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>
                          {t('noHistory')}
                        </Typography>
                      ) : (
                        <Stack spacing={0.5}>
                          {customer.history.map((record) => (
                            <Box
                              key={record.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                py: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: '#4caf50',
                                  flexShrink: 0,
                                }}
                              />
                              <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>
                                {dayjs(record.active_from).format('DD.MM.YYYY')}
                                {' — '}
                                {dayjs(record.active_to).format('DD.MM.YYYY')}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Collapse>
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

export default ActiveCustomersList
