'use client'

import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useTranslations } from 'next-intl'
import HistoryMonthView, { type HistoryMonth } from '@/components/history/HistoryMonthView'
import BalanceChartsView from '@/components/history/BalanceChartsView'

type StatisticsTabsContainerProps = {
  months: HistoryMonth[]
  userRole?: string
  isLoggedIn?: boolean
}

const StatisticsTabsContainer = ({
  months,
  userRole,
  isLoggedIn = false,
}: StatisticsTabsContainerProps) => {
  const t = useTranslations('statistics.tabs')
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  // If user is not logged in, show only the monthly stats without tabs
  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <HistoryMonthView months={months} userRole={userRole} />
      </Box>
    )
  }

  // For logged-in users, show tabs with both monthly stats and balance charts
  return (
    <Box
      sx={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="statistics tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 500,
              minHeight: { xs: 48, md: 56 },
            },
          }}
        >
          <Tab label={t('monthlyStats')} />
          <Tab label={t('balanceCharts')} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && <HistoryMonthView months={months} userRole={userRole} />}
        {activeTab === 1 && <BalanceChartsView />}
      </Box>
    </Box>
  )
}

export default StatisticsTabsContainer
