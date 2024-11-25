import imageCompression from "browser-image-compression";

export const useImageCompression = () => {
  const compressImage = async (file, customOptions = {}) => {
    const defaultOptions = {
      maxSizeMB: 0.1, // 100KB로 더 낮춤
      maxWidthOrHeight: 400, // 최대 크기를 400px로 제한
      useWebWorker: true,
      initialQuality: 0.5, // 품질을 더 낮춤
      alwaysKeepResolution: false,
      preserveExif: false,
    };

    const options = {
      ...defaultOptions,
      ...customOptions,
      fileType: file.type,
    };

    try {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml"];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("지원하지 않는 이미지 형식입니다.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("파일 크기는 10MB 이하여야 합니다.");
      }

      let compressedFile = await imageCompression(file, options);
      
      // 압축된 파일이 여전히 크다면 더 강한 압축 시도
      if (compressedFile.size > 100 * 1024) { // 100KB보다 크면
        const extraOptions = {
          ...options,
          maxSizeMB: 0.05, // 50KB
          maxWidthOrHeight: 300,
          initialQuality: 0.3,
        };
        compressedFile = await imageCompression(compressedFile, extraOptions);
      }

      // base64로 변환
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });

      // base64 문자열이 너무 길면 에러
      if (base64String.length > 137000) { // 약 100KB
        throw new Error("이미지 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.");
      }

      return base64String;
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      throw error;
    }
  };

  return { compressImage };
};
