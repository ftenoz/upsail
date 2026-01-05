const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
};

export const requestJson = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    credentials: "include"
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.error?.message ?? `Request failed with status ${res.status}`
    );
  }

  return (await res.json()) as T;
};
