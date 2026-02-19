'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

/**
 * Client component that refreshes the user profile when mounted.
 * Useful after payment completion to ensure UI reflects updated account status.
 */
export default function ProfileRefresher() {
  const { refreshProfile } = useAuth();

  useEffect(() => {
    // Refresh profile when component mounts
    refreshProfile();
  }, [refreshProfile]);

  return null; // This component doesn't render anything
}







