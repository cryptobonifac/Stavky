'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'

type CompanyData = {
  id: string
  name: string
  data: Array<{ date: string; balance: number; profit: number }>
}

type CombinedBalanceChartProps = {
  companies: CompanyData[]
  combinedData: Array<{ date: string; balance: number }>
  height?: number
}

// Company colors matching existing design
const COMPANY_COLORS: Record<string, string> = {
  bet365: '#0369a1',
  combined: '#16a34a',
  default: '#374151',
}

const getCompanyColor = (companyName: string): string => {
  const normalized = companyName.toLowerCase()
  if (normalized.includes('bet365')) return COMPANY_COLORS.bet365
  return COMPANY_COLORS.default
}

const CombinedBalanceChart = ({
  companies,
  combinedData,
  height = 400,
}: CombinedBalanceChartProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Merge all data points into a single timeline
  const allDates = new Set<string>()
  companies.forEach((company) => {
    company.data.forEach((point) => allDates.add(point.date))
  })
  combinedData.forEach((point) => allDates.add(point.date))

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  // Create chart data with all companies + combined
  const chartData = sortedDates.map((date) => {
    const dataPoint: any = {
      date,
      dateFormatted: dayjs(date).format('DD.MM.YYYY'),
    }

    // Add each company's balance at this date
    companies.forEach((company) => {
      const companyPoint = company.data.find((p) => p.date === date)
      if (companyPoint) {
        dataPoint[company.name] = companyPoint.balance
      }
    })

    // Add combined balance
    const combinedPoint = combinedData.find((p) => p.date === date)
    if (combinedPoint) {
      dataPoint['Combined'] = combinedPoint.balance
    }

    return dataPoint
  })

  // Format balance for tooltip
  const formatBalance = (value: number) => {
    return value.toFixed(2).replace('.', ',') + ' €'
  }

  return (
    <Box
      sx={{
        width: '100%',
        height,
        backgroundColor: 'white',
        borderRadius: '8px',
        p: { xs: 1, md: 2 },
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="dateFormatted"
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
            tickMargin={10}
            interval={isMobile ? 'preserveStartEnd' : 'preserveStart'}
          />
          <YAxis
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
            tickFormatter={(value) => value.toFixed(0)}
            label={
              isMobile
                ? undefined
                : {
                    value: 'Balance (€)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 12, fill: '#666' },
                  }
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
            formatter={(value: any) => formatBalance(Number(value))}
            labelStyle={{ fontWeight: 600, marginBottom: '8px' }}
          />
          <Legend
            wrapperStyle={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              paddingTop: '10px',
            }}
          />

          {/* Zero line for break-even */}
          <ReferenceLine
            y={0}
            stroke="#9ca3af"
            strokeDasharray="3 3"
            strokeWidth={1}
          />

          {/* Line for each company */}
          {companies.map((company) => (
            <Line
              key={company.id}
              type="monotone"
              dataKey={company.name}
              stroke={getCompanyColor(company.name)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: isMobile ? 4 : 6 }}
              connectNulls
            />
          ))}

          {/* Combined line (bold/highlighted) */}
          <Line
            type="monotone"
            dataKey="Combined"
            stroke={COMPANY_COLORS.combined}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: isMobile ? 5 : 7 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default CombinedBalanceChart
