'use client'

import dynamic from 'next/dynamic'

const DemoDatePlanner = dynamic(
  () => import('@/components/ui/demo-date-planner'),
  { ssr: false }
)

const DemoPlannerSection = () => <DemoDatePlanner />

export default DemoPlannerSection


