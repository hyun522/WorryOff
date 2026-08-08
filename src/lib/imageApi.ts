const API_BASE_URL = "http://localhost:3000";

/**
 * base64 문자열(접두사 없는 순수 payload)을 Blob으로 변환
 */
function base64ToBlob(base64: string, mimeType = "image/jpeg"): Blob {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}

/**
 * File 또는 Blob을 FormData에 담아 서버에 업로드하고 fileName을 반환
 */
async function uploadImage(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, "photo.jpg");

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했어요.");
  }

  const data: { fileName: string } = await response.json();
  return data.fileName;
}

/**
 * 서버에 저장된 fileName으로 <img src>용 URL을 생성
 */
function getImageUrl(fileName: string): string {
  return `${API_BASE_URL}/images/${fileName}`;
}

export { API_BASE_URL, base64ToBlob, uploadImage, getImageUrl };
