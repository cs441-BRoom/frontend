'use client';
import React, { useEffect, useState } from 'react';

interface WorkspaceDetailPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function WorkspaceDetailPage({
  params,
}: WorkspaceDetailPageProps) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setWorkspaceId(resolvedParams.workspaceId);
    };

    fetchData();
  }, [params]);

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  return <div className='flex h-screen'></div>;
}
