import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import SectionCard from '@/components/layout/SectionCard'
import HeroAuthButtons from '@/components/home/HeroAuthButtons'
import CallToActionCard from '@/components/home/CallToActionCard'
import DemoPlannerSection from '@/components/home/DemoPlannerSection'
import Grid from '@mui/material/Grid'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

const highlights = [
  {
    title: 'Consistent theming',
    description:
      'Custom palette, typography scale, and rounded surfaces aligned with the minimalist identity.',
  },
  {
    title: 'Responsive building blocks',
    description:
      'Reusable page sections and cards keep layouts adaptive on phones, tablets, and desktops.',
  },
  {
    title: 'Date picker ready to drop in',
    description:
      'MUI X DateTimePicker pre-configured with dayjs, locale formatting, and full-width inputs.',
  },
] as const

const roadmap = [
  {
    title: 'Realtime tip feed',
    description: 'Supabase channels keep customers synced with fresh tips.',
  },
  {
    title: 'Role-based dashboards',
    description: 'Separate views for betting admins and active subscribers.',
  },
  {
    title: 'Mobile-first layouts',
    description: 'Optimized spacing and typography across devices.',
  },
] as const

const stats = [
  { label: 'Markets covered', value: '25+' },
  { label: 'Avg. response time', value: '<200ms' },
  { label: 'Customers per cohort', value: '100' },
] as const

export default function Home() {
  return (
    <MainLayout>
      <PageSection
        title="Sports betting operations need a reliable toolkit"
        subtitle="We now have Material UI, custom theming, date pickers, and responsive layout primitives configured for every upcoming screen."
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={{ xs: 4, lg: 8 }}
          alignItems="center"
        >
          <Stack spacing={3} flex={1}>
            <Chip
              label="Phase 1 • UI framework ready"
              color="secondary"
              sx={{ width: 'fit-content' }}
            />
            <Stack spacing={1}>
              <Typography variant="h1" component="h1">
                Ship confident layouts faster.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The base layer covers typography, color, spacing, and
                date-handling so tip creation, history tracking, and
                subscription dashboards can focus on logic instead of setup.
              </Typography>
            </Stack>
            <HeroAuthButtons />
          </Stack>
          <Box flex={1} width="100%">
            <DemoPlannerSection />
          </Box>
        </Stack>
      </PageSection>

      <PageSection
        title="Project snapshot"
        subtitle="Everything about Stavky revolves around clarity and trusted information."
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h5">
                    Built for tipsters and subscribers
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    The homepage explains the product promise, highlights the
                    Supabase-powered backend, and surfaces registration calls to
                    action. Customers can instantly see why engagement matters,
                    while betting admins know the system supports rapid tip
                    submission, evaluation, and subscription management.
                  </Typography>
                  <Divider />
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={3}
                    justifyContent="space-between"
                  >
                    {stats.map((item) => (
                      <Stack key={item.label} spacing={0.5}>
                        <Typography variant="h4">{item.value}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <CallToActionCard />
          </Grid>
        </Grid>
      </PageSection>

      <PageSection
        title="Framework highlights"
        subtitle="Each section card below is powered by the new responsive layout helpers."
      >
        <Grid container spacing={3}>
          {highlights.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <SectionCard title={item.title} description={item.description} />
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        title="Why customers trust Stavky"
        subtitle="Concise messaging communicates the roadmap and removes friction during onboarding."
      >
        <Grid container spacing={3}>
          {roadmap.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <SectionCard title={item.title} description={item.description} />
            </Grid>
          ))}
        </Grid>
      </PageSection>
    </MainLayout>
  )
}

