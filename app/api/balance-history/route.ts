import { NextResponse } from 'next/server'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

type CompanyBalance = {
  id: string
  name: string
  data: Array<{ date: string; balance: number; profit: number }>
}

type BalanceDataPoint = {
  date: string
  balance: number
}

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Allow all logged-in users to access balance history

    // Fetch all betting tips with stake data (including pending)
    // Pending bets are included because the stake is immediately deducted from balance
    const { data: tips, error } = await supabase
      .from('betting_tip')
      .select(
        `
        id,
        betting_company_id,
        stake,
        total_win,
        status,
        match_date,
        betting_companies:betting_company_id (
          id,
          name
        )
      `
      )
      .not('stake', 'is', null)
      .order('match_date', { ascending: true })

    if (error) {
      console.error('Error fetching betting tips:', error)
      return NextResponse.json(
        { error: 'Failed to fetch betting tips' },
        { status: 500 }
      )
    }

    if (!tips || tips.length === 0) {
      return NextResponse.json({
        companies: [],
        combined: [],
      })
    }

    // Group tips by company and calculate cumulative balances
    const companyMap = new Map<
      string,
      {
        id: string
        name: string
        tips: Array<{
          date: string
          profit: number
        }>
      }
    >()

    const allTipsForCombined: Array<{
      date: string
      profit: number
    }> = []

    tips.forEach((tip: any) => {
      const companyData = tip.betting_companies
      if (!companyData) return

      const companyId = companyData.id
      const companyName = companyData.name
      const stake = tip.stake ?? 0
      const totalWin = tip.total_win ?? 0

      // Calculate profit/loss for this tip based on status:
      // - PENDING: Stake is deducted (money tied up in bet)
      // - WIN: Net profit = total_win - stake (get winnings, stake already gone)
      // - LOSS: Lose the stake (nothing returned)
      let profit: number
      if (tip.status === 'win') {
        profit = totalWin - stake  // You get total_win back, but paid stake
      } else {
        // For LOSS or PENDING: deduct the stake
        profit = -stake
      }

      const tipData = {
        date: tip.match_date,
        profit,
      }

      // Add to company-specific data
      if (!companyMap.has(companyId)) {
        companyMap.set(companyId, {
          id: companyId,
          name: companyName,
          tips: [],
        })
      }
      companyMap.get(companyId)!.tips.push(tipData)

      // Add to combined data
      allTipsForCombined.push(tipData)
    })

    // Calculate cumulative balances for each company
    // Starting balance for each company is 1000 EUR
    const STARTING_BALANCE = 1000

    const companies: CompanyBalance[] = Array.from(companyMap.values()).map(
      (company) => {
        let cumulativeBalance = STARTING_BALANCE
        const data = company.tips.map((tip) => {
          cumulativeBalance += tip.profit
          return {
            date: tip.date,
            balance: cumulativeBalance,
            profit: tip.profit,
          }
        })

        return {
          id: company.id,
          name: company.name,
          data,
        }
      }
    )

    // Calculate combined cumulative balance
    // Combined starting balance = number of companies × 1000 EUR
    allTipsForCombined.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const numberOfCompanies = companyMap.size
    let combinedCumulativeBalance = STARTING_BALANCE * numberOfCompanies
    const combined: BalanceDataPoint[] = allTipsForCombined.map((tip) => {
      combinedCumulativeBalance += tip.profit
      return {
        date: tip.date,
        balance: combinedCumulativeBalance,
      }
    })

    return NextResponse.json({
      companies,
      combined,
    })
  } catch (error) {
    console.error('Error in balance-history API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
