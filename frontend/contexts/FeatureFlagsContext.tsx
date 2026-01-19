import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface FeatureFlags {
  mini_test: boolean;
}

const defaultFlags: FeatureFlags = {
  mini_test: false,
};

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  loading: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  flags: defaultFlags,
  loading: true,
});

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlags() {
      try {
        const res = await fetch('/api/flags', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json() as { data: FeatureFlags | null; error: { message: string } | null };
          if (data.data) {
            setFlags(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch feature flags:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFlags();
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ flags, loading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
