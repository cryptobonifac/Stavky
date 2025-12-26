'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import {
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  MenuItem as SelectMenuItem,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslations, useLocale } from 'next-intl'

import type { TipRecord } from '@/components/bettings/ActiveTipsList'
import DateTimePickerField from '@/components/ui/date-time-picker-field'

dayjs.extend(localizedFormat)

const TIPS_PER_PAGE = 15

export type HistoryMonth = {
  key: string
  label: string
  wins: number
  losses: number
  pending: number
  total: number
  successRate: number
  tips: TipRecord[]
}

type HistoryMonthViewProps = {
  months: HistoryMonth[]
  userRole?: string
}

// Company chip styles
const getCompanyChipStyles = (companyName: string) => {
  const normalized = companyName.toLowerCase()
  if (normalized.includes('bet365')) {
    return {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      color: '#0369a1',
      border: '1px solid #bae6fd',
    }
  } else if (normalized.includes('nike')) {
    return {
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      color: '#92400e',
      border: '1px solid #fcd34d',
    }
  } else if (normalized.includes('tipsport')) {
    return {
      background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
      color: '#6b21a8',
      border: '1px solid #c4b5fd',
    }
  }
  // Default fallback
  return {
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    color: '#374151',
    border: '1px solid #d1d5db',
  }
}

const HistoryMonthView = ({ months, userRole }: HistoryMonthViewProps) => {
  const t = useTranslations('statistics')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedKey, setSelectedKey] = useState(months[0]?.key ?? '')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tipToDelete, setTipToDelete] = useState<TipRecord | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [tipToEdit, setTipToEdit] = useState<any>(null)
  const [editFormData, setEditFormData] = useState<any>(null)
  const [results, setResults] = useState<Array<{ id: string; name: string }>>([])
  
  const isBettingRole = userRole === 'betting'
  
  const handleDeleteClick = (tip: TipRecord) => {
    setTipToDelete(tip)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setTipToDelete(null)
  }

  const handleDeleteConfirm = () => {
    if (!tipToDelete) return

    startTransition(async () => {
      const response = await fetch(`/api/betting-tips/${tipToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        console.error('Failed to delete tip:', payload.error)
        // Could add error notification here
        return
      }

      setDeleteDialogOpen(false)
      setTipToDelete(null)
      router.refresh()
    })
  }

  const handleEditClick = async (tip: TipRecord) => {
    try {
      // Fetch tip data and results in parallel
      const [tipResponse, resultsResponse] = await Promise.all([
        fetch(`/api/betting-tips/${tip.id}`),
        fetch('/api/settings/results')
      ])
      
      if (!tipResponse.ok) {
        console.error('Failed to fetch tip data')
        return
      }
      
      const tipData = await tipResponse.json()
      if (tipData.success && tipData.tip) {
        // Fetch results for dropdown
        let resultsData: Array<{ id: string; name: string }> = []
        if (resultsResponse.ok) {
          resultsData = await resultsResponse.json()
        }
        setResults(resultsData)
        
        setTipToEdit(tipData.tip)
        setEditFormData({
          sport: tipData.tip.sport || '',
          league: tipData.tip.league || '',
          match: tipData.tip.match || '',
          odds: tipData.tip.odds?.toString() || '1.01',
          match_date: dayjs(tipData.tip.match_date),
          stake: tipData.tip.stake?.toString() || '',
          total_win: tipData.tip.total_win?.toString() || '',
          result_id: tipData.tip.result_id || '',
          status: tipData.tip.status || 'pending',
        })
        setEditDialogOpen(true)
      }
    } catch (error) {
      console.error('Error fetching tip data:', error)
    }
  }

  const handleEditCancel = () => {
    setEditDialogOpen(false)
    setTipToEdit(null)
    setEditFormData(null)
  }

  const handleEditSave = () => {
    if (!tipToEdit || !editFormData) return

    startTransition(async () => {
      const updateData: any = {
        sport: editFormData.sport.trim(),
        league: editFormData.league.trim(),
        match: editFormData.match.trim(),
        odds: parseFloat(editFormData.odds),
        match_date: editFormData.match_date.toISOString(),
        status: editFormData.status,
      }

      // Handle result_id
      if (editFormData.result_id) {
        updateData.result_id = editFormData.result_id
      } else {
        updateData.result_id = null
      }

      // Handle stake
      if (editFormData.stake) {
        const stakeValue = parseFloat(editFormData.stake)
        if (!isNaN(stakeValue) && stakeValue > 0) {
          updateData.stake = stakeValue
          // Calculate total_win if not explicitly provided
          if (editFormData.total_win) {
            const totalWinValue = parseFloat(editFormData.total_win)
            if (!isNaN(totalWinValue) && totalWinValue > 0) {
              updateData.total_win = totalWinValue
            } else {
              updateData.total_win = stakeValue * parseFloat(editFormData.odds)
            }
          } else {
            updateData.total_win = stakeValue * parseFloat(editFormData.odds)
          }
        }
      } else {
        updateData.stake = null
        // If total_win is explicitly provided, use it; otherwise set to null
        if (editFormData.total_win) {
          const totalWinValue = parseFloat(editFormData.total_win)
          if (!isNaN(totalWinValue) && totalWinValue > 0) {
            updateData.total_win = totalWinValue
          } else {
            updateData.total_win = null
          }
        } else {
          updateData.total_win = null
        }
      }

      const response = await fetch(`/api/betting-tips/${tipToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        console.error('Failed to update tip:', payload.error)
        return
      }

      setEditDialogOpen(false)
      setTipToEdit(null)
      setEditFormData(null)
      router.refresh()
    })
  }
  
  const selectedMonth = useMemo(
    () => months.find((month) => month.key === selectedKey) ?? months[0],
    [months, selectedKey]
  )

  // Reset to page 1 when month changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedKey])

  // Calculate pagination
  const totalTips = selectedMonth?.tips.length ?? 0
  const totalPages = Math.ceil(totalTips / TIPS_PER_PAGE)
  const startIndex = (currentPage - 1) * TIPS_PER_PAGE
  const endIndex = startIndex + TIPS_PER_PAGE
  const paginatedTips = selectedMonth?.tips.slice(startIndex, endIndex) ?? []

  if (!selectedMonth) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          color: '#666',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Typography sx={{ fontSize: '0.95rem' }}>{t('noHistoryYet')}</Typography>
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
        {/* Month Selector */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#1a1a1a',
            }}
          >
            {t('monthlyPerformance')}
          </Typography>
          <Select
            value={selectedMonth.key}
            onChange={(event) => setSelectedKey(event.target.value)}
            size="small"
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
            }}
          >
            {months.map((month) => (
              <MenuItem value={month.key} key={month.key}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Statistics Section */}
        <Box
          sx={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            p: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#666',
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                {t('successRate')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#16a34a',
                }}
              >
                {selectedMonth.successRate.toFixed(1)}%
              </Typography>
            </Box>
            <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#666',
                    mb: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {t('wins')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#16a34a',
                  }}
                >
                  {selectedMonth.wins}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#666',
                    mb: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {t('losses')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#dc2626',
                  }}
                >
                  {selectedMonth.losses}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#666',
                    mb: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {t('pending')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#666',
                  }}
                >
                  {selectedMonth.pending}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Tips List */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {paginatedTips.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: '#666' }}>
              <Typography sx={{ fontSize: '0.95rem' }}>
                {t('noHistoryYet')}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Grid Header (hidden on mobile) */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns: isBettingRole 
                    ? '70px 1fr 90px 100px 100px 24px 60px' 
                    : '70px 1fr 90px 100px 100px 24px',
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
                  {t('date')}
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
                  {t('match')}
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
                  {t('odds')}
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
                  {t('stake')}
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
                  {t('totalWin') || 'Total Win'}
                </Typography>
                <Box />
                {isBettingRole && <Box />}
              </Box>

              {/* Tips Grid */}
              <Stack spacing={0}>
                {paginatedTips.map((tip, index) => {
                  const tipWithExtras = tip as TipRecord & {
                    companyName?: string
                    resultName?: string
                  }
                  const companyName = tipWithExtras.companyName || ''
                  const resultName = tipWithExtras.resultName || ''
                  const odds = tip.odds || 0
                  const formattedOdds = odds.toFixed(2).replace('.', ',')
                  
                  // Get status color
                  const statusColor =
                    tip.status === 'win'
                      ? '#16a34a'
                      : tip.status === 'loss'
                      ? '#dc2626'
                      : '#9ca3af'

                  const companyStyles = getCompanyChipStyles(companyName)

                  return (
                    <Box
                      key={tip.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: isBettingRole 
                            ? '50px minmax(0, 1fr) 70px 60px 60px 20px 50px'
                            : '50px minmax(0, 1fr) 70px 60px 60px 20px',
                          md: isBettingRole
                            ? '70px 1fr 90px 100px 100px 24px 60px'
                            : '70px 1fr 90px 100px 100px 24px',
                        },
                        gap: { xs: 0.4, md: 1.13 },
                        p: { xs: '0.42rem', md: '0.56rem' },
                        borderBottom:
                          index < paginatedTips.length - 1
                            ? '1px solid #f0f0f0'
                            : 'none',
                        '&:hover': {
                          backgroundColor: '#fafafa',
                        },
                        transition: 'background-color 0.2s',
                        alignItems: 'center',
                      }}
                    >
                      {/* Date */}
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
                          {dayjs(tip.match_date).format('DD.MM')}
                        </Typography>
                      </Box>

                      {/* Match Info */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 0.75, md: 1.5 },
                          minWidth: 0, // Allow text truncation
                          overflow: 'hidden',
                        }}
                      >
                        {/* Company Chip - Only show to authenticated users */}
                        {userRole && companyName && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: { xs: 0.75, md: 1.5 },
                              py: { xs: 0.25, md: 0.5 },
                              borderRadius: '16px',
                              fontSize: { xs: '0.65rem', md: '0.8rem' },
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: { xs: '0.1px', md: '0.3px' },
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              ...companyStyles,
                            }}
                          >
                            {companyName}
                          </Box>
                        )}

                        {/* Match Description */}
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
                          {tip.match}
                        </Typography>
                      </Box>

                      {/* Odds + Team Indicator */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'flex-end', md: 'flex-end' },
                          gap: { xs: 0.5, md: 0.75 },
                          flexShrink: 0,
                        }}
                      >
                        {/* Team Indicator Box */}
                        {resultName && (resultName === '1' || resultName === '2') && (
                          <Box
                            sx={{
                              width: { xs: '18px', md: '22px' },
                              height: { xs: '18px', md: '22px' },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f0f0f0',
                              color: '#666',
                              borderRadius: '4px',
                              fontSize: { xs: '0.65rem', md: '0.75rem' },
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {resultName}
                          </Box>
                        )}
                        
                        {/* Odds */}
                        <Typography
                          sx={{
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            fontWeight: 600,
                            color: '#1a1a1a',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formattedOdds}
                        </Typography>
                      </Box>

                      {/* Stake */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'flex-end', md: 'flex-end' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            fontWeight: 500,
                            color: '#1a1a1a',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tip.stake !== null && tip.stake !== undefined
                            ? tip.stake.toFixed(2).replace('.', ',')
                            : '-'}
                        </Typography>
                      </Box>

                      {/* Total Win */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'flex-end', md: 'flex-end' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            fontWeight: 500,
                            color: '#1a1a1a',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tip.total_win !== null && tip.total_win !== undefined
                            ? tip.total_win.toFixed(2).replace('.', ',')
                            : '-'}
                        </Typography>
                      </Box>

                      {/* Status Indicator Circle */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'flex-end', md: 'flex-end' },
                        }}
                      >
                        {tip.status !== 'pending' && (
                          <Box
                            sx={{
                              width: { xs: '10px', md: '12px' },
                              height: { xs: '10px', md: '12px' },
                              borderRadius: '50%',
                              backgroundColor: statusColor,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>

                      {/* Action Buttons (Edit/Delete) - Only for betting role */}
                      {isBettingRole && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: { xs: 'flex-end', md: 'flex-end' },
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(tip)}
                            sx={{
                              padding: { xs: '4px', md: '6px' },
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                            aria-label={t('edit')}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(tip)}
                            sx={{
                              padding: { xs: '4px', md: '6px' },
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.dark',
                              },
                            }}
                            aria-label={t('delete')}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Stack>

              {/* Delete Confirmation Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-tip-dialog-title"
                aria-describedby="delete-tip-dialog-description"
              >
                <DialogTitle id="delete-tip-dialog-title">
                  {t('deleteTip') || t('delete')}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="delete-tip-dialog-description">
                    {t('deleteConfirmation') || 'Are you sure you want to delete this tip?'}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleDeleteCancel}
                    disabled={isPending}
                  >
                    {tCommon('cancel')}
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    color="error"
                    variant="contained"
                    disabled={isPending}
                    autoFocus
                  >
                    {tCommon('delete')}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Edit Dialog */}
              <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
                aria-labelledby="edit-tip-dialog-title"
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle id="edit-tip-dialog-title">
                  {t('editTip')}
                </DialogTitle>
                <DialogContent>
                  {editFormData && (
                    <Stack spacing={3} sx={{ mt: 1 }}>
                      <TextField
                        label={t('sport') || 'Sport'}
                        value={editFormData.sport}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, sport: e.target.value })
                        }
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label={t('league') || 'League'}
                        value={editFormData.league}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, league: e.target.value })
                        }
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label={t('match') || 'Match'}
                        value={editFormData.match}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, match: e.target.value })
                        }
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label={t('odds') || 'Odds'}
                        type="number"
                        value={editFormData.odds}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value)
                          if (!isNaN(value) && value >= 1.001 && value <= 2.0) {
                            const newOdds = e.target.value
                            setEditFormData({ 
                              ...editFormData, 
                              odds: newOdds,
                              // Auto-calculate total_win if stake and odds are available
                              total_win: editFormData.stake && newOdds
                                ? (parseFloat(editFormData.stake) * parseFloat(newOdds)).toFixed(2)
                                : editFormData.total_win
                            })
                          }
                        }}
                        fullWidth
                        size="small"
                        inputProps={{
                          step: 0.001,
                          min: 1.001,
                          max: 2.0,
                        }}
                      />
                      <DateTimePickerField
                        label={t('matchDate') || 'Match Date'}
                        value={editFormData.match_date}
                        onChange={(value) =>
                          setEditFormData({ ...editFormData, match_date: value ?? dayjs() })
                        }
                        slotProps={{
                          textField: {
                            size: 'small' as const,
                            fullWidth: true,
                          },
                        }}
                      />
                      <TextField
                        label={t('stake') || 'Stake'}
                        type="number"
                        value={editFormData.stake}
                        onChange={(e) => {
                          const stakeValue = e.target.value
                          setEditFormData({ 
                            ...editFormData, 
                            stake: stakeValue,
                            // Auto-calculate total_win if stake and odds are available
                            total_win: stakeValue && editFormData.odds
                              ? (parseFloat(stakeValue) * parseFloat(editFormData.odds)).toFixed(2)
                              : editFormData.total_win
                          })
                        }}
                        fullWidth
                        size="small"
                        inputProps={{
                          step: 0.01,
                          min: 0,
                        }}
                      />
                      <TextField
                        label={t('totalWin') || 'Total Win'}
                        type="number"
                        value={editFormData.total_win}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, total_win: e.target.value })
                        }
                        fullWidth
                        size="small"
                        inputProps={{
                          step: 0.01,
                          min: 0,
                        }}
                        helperText={t('totalWinHelper') || 'Calculated: stake × odds (can be edited manually)'}
                      />
                      <TextField
                        select
                        label={t('result') || 'Result'}
                        value={editFormData.result_id || ''}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, result_id: e.target.value })
                        }
                        fullWidth
                        size="small"
                      >
                        <SelectMenuItem value="">
                          <em>{t('none') || 'None'}</em>
                        </SelectMenuItem>
                        {results.map((result) => (
                          <SelectMenuItem key={result.id} value={result.id}>
                            {result.name}
                          </SelectMenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        label={t('status') || 'Status'}
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, status: e.target.value })
                        }
                        fullWidth
                        size="small"
                      >
                        <SelectMenuItem value="pending">{t('pending')}</SelectMenuItem>
                        <SelectMenuItem value="win">{t('win')}</SelectMenuItem>
                        <SelectMenuItem value="loss">{t('loss')}</SelectMenuItem>
                      </TextField>
                    </Stack>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleEditCancel}
                    disabled={isPending}
                  >
                    {tCommon('cancel')}
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    variant="contained"
                    disabled={isPending}
                    autoFocus
                  >
                    {tCommon('save')}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Pagination */}
              {totalTips > 0 && (
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
                    {t('showing')} {startIndex + 1}–{Math.min(endIndex, totalTips)}{' '}
                    {t('of')} {totalTips} {t('tips')}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

export default HistoryMonthView
