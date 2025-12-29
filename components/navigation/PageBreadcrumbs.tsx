'use client';

import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Route segment to translation key mapping
const ROUTE_TRANSLATION_MAP: Record<string, { key: string; namespace: string }> = {
  'bettings': { key: 'title', namespace: 'bettings' },
  'profile': { key: 'profile', namespace: 'common' },
  'settings': { key: 'settings', namespace: 'common' },
  'history': { key: 'title', namespace: 'statistics' },
  'statistics': { key: 'title', namespace: 'statistics' },
  'newbet': { key: 'title', namespace: 'newbet' },
  'checkout': { key: 'title', namespace: 'checkout' },
  'subscription': { key: 'title', namespace: 'subscription' },
  'contacts': { key: 'title', namespace: 'contact' },
  'contact': { key: 'title', namespace: 'contact' },
  'admin': { key: 'admin', namespace: 'common' },
  'webhook-logs': { key: 'webhookLogs', namespace: 'common' },
  'webhook-debug': { key: 'webhookDebug', namespace: 'common' },
  'manage': { key: 'title', namespace: 'manage' },
  'customers': { key: 'title', namespace: 'customers' },
  'privacy': { key: 'title', namespace: 'privacy' },
  'login': { key: 'login', namespace: 'common' },
  'signup': { key: 'signup', namespace: 'common' },
  'cancel': { key: 'cancel', namespace: 'common' },
  'success': { key: 'success', namespace: 'common' },
};

const PageBreadcrumbs = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const tCommon = useTranslations('common');

  // Parse pathname to get segments
  const segments = pathname
    .split('/')
    .filter((segment) => segment && segment !== locale);

  // If we're at home, don't show breadcrumbs
  if (segments.length === 0) {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      label: tCommon('home'),
      href: `/${locale}`,
    },
  ];

  let currentPath = `/${locale}`;
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip locale and auth segments
    if (segment === '(auth)' || segment.startsWith('(')) {
      return;
    }

    const mapping = ROUTE_TRANSLATION_MAP[segment];
    let label = segment;

    if (mapping) {
      try {
        // Use the appropriate translation namespace
        const t = useTranslations(mapping.namespace);
        label = t(mapping.key);
      } catch {
        // If translation fails, use capitalized segment
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    } else {
      // Fallback to capitalized segment name
      label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    breadcrumbItems.push({
      label,
      href: currentPath,
    });
  });

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-ol': {
          flexWrap: 'nowrap',
        },
        '& .MuiBreadcrumbs-li': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        if (isLast) {
          return (
            <Typography
              key={item.href}
              color="text.primary"
              fontWeight="medium"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <MuiLink
            key={item.href}
            underline="hover"
            color="inherit"
            href={item.href}
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '0.875rem', md: '1rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
