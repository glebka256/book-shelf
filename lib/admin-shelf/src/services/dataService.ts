export const getData = async <T>(filename: string): Promise<T> => {
  try {
    const baseUrl = process.env.BASE_URL;
    const response = await fetch(`${baseUrl}/data/${filename}`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    throw new Error(
      `Unable to load json data from filename: ${filename}. ` + error
    );
  }
};