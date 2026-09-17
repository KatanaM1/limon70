const IMGBB_API_KEY = 'ab0ed793552b3f0e18a009bacf8d8301';

export async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImgBB ошибка: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data.success || !data.data?.url) {
    throw new Error('ImgBB: неверный формат ответа');
  }

  return data.data.url;
}