'use client'

import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useTranslations } from 'next-intl'
import HistoryMonthView, { type HistoryMonth } from './HistoryMonthView'
import BalanceChartsView from './BalanceChartsView'

type HistoryTabsContainerProps = {
  months: HistoryMonth[]
  userRole?: string
}

const HistoryTabsContainer = ({
  months,
  userRole,
}: HistoryTabsContainerProps) => {
  const t = useTranslations('history.tabs')
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

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
          aria-label="history tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 500,
              minHeight: { xs: 48, md: 56 },
            },
          }}
        >
          <Tab label={t('monthlyHistory')} />
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

export default HistoryTabsContainer
