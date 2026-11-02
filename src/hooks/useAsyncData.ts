import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: T };

export function useAsyncData<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  const reload = useCallback(async () => {
    setState((current) => (current.status === 'ready' ? current : { status: 'loading' }));
    try {
      const data = await loader();
      setState({ status: 'ready', data });
    } catch (error) {
      console.error(error);
      setState({ status: 'error' });
    }
  }, [loader]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { state, reload };
}
