import { useQuery } from '@tanstack/react-query'
import { loadCertificationCatalog, loadCertificationGuide } from '../api/certifications'

const GUIDE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1_000

export function useCertificationData(preferencesReady: boolean, selectedCertificationId: string) {
  const catalogQuery = useQuery({
    queryKey: ['certification-catalog'],
    queryFn: () => loadCertificationCatalog(),
    enabled: preferencesReady,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  })
  const catalog = catalogQuery.data ?? []
  const selectedCertification = catalog.find((item) => item.id === selectedCertificationId) ?? catalog[0]
  const guideQuery = useQuery({
    queryKey: ['certification-guide', selectedCertification?.id],
    queryFn: () => loadCertificationGuide(selectedCertification!.id),
    enabled: preferencesReady && Boolean(selectedCertification),
    staleTime: (query) => {
      const refreshedAt = query.state.data?.freshness.aiRefreshedAt
      if (!refreshedAt) return 0
      return Math.max(0, Date.parse(refreshedAt) + GUIDE_MAX_AGE_MS - Date.now())
    },
    refetchOnWindowFocus: false,
    retry: false,
  })
  return { catalogQuery, catalog, selectedCertification, guideQuery }
}
