export const post = async <T>(url: string, data: unknown) => {
  const response = await fetch(url, {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return (await response.json()) as T;
};
