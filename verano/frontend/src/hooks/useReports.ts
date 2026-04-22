import { useEffect, useState } from "react";
import { getReports } from "../api/reports.api";
import type { Report } from "../types/report";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [page]);

  async function loadReports() {
    if (!hasMore || loading) return;

    setLoading(true);

    const res = await getReports(page);

    setReports((prev) => {
      const existingIds = new Set(prev.map(r => r.id));
      const newReports = res.data.filter(
        (r: any) => !existingIds.has(r.id)
      );
      return [...prev, ...newReports];
    });

    if (page >= res.last_page) {
      setHasMore(false);
    }

    setLoading(false);
  }

  return {
    reports,
    loading,
    hasMore,
    loadMore: () => setPage((prev) => prev + 1),
  };
}
