// YouTube URL을 embed 형식으로 변환
export const convertToEmbedUrl = (url, options) => {
  // YouTube ID 추출
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\/v=|\?v=)([^#/&/?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}?${options}`;
  }
  return null;
};

export const youtubeLinks = [
  "https://www.youtube.com/embed/9aQBK9SYJ7E?si=MxovzSU3kVonr4Sb&autoplay=1&controls=1&showinfo=1&rel=0&modestbranding=1",
  "https://www.youtube.com/embed/iT5S9lOhc18?autoplay=1&mute=1&start=8",
];

// TV 정보를 담은 배열
export const tvConfigs = [
  {
    id: "tv01",
    cameraPosition: {
      x: 3.155439858866819,
      y: 0.8,
      z: -15.138322272848661,
    },
    targetPosition: {
      x: 8.378296559752526,
      y: 0.8,
      z: -15.13339335095959,
    },
    videoUrl: convertToEmbedUrl(youtubeLinks[0], "&autoplay=1&controls=1&showinfo=1&rel=0&modestbranding=1"),
    dimensions: {
      width: "655px",
      height: "380px",
    },
    rotateY: -Math.PI / 2,
    offsetX: 0.08,
    offsetY: 0,
    offsetZ: 0,
  },
  {
    id: "tv02",
    cameraPosition: {
      x: 10.073946793683984,
      y: 0.95,
      z: -9,
    },
    targetPosition: {
      x: 9.723099875251082,
      y: 0.95,
      z: -3,
    },
    videoUrl: convertToEmbedUrl(youtubeLinks[1], "autoplay=1&mute=1&start=8"),
    dimensions: {
      width: "655px",
      height: "380px",
    },
    rotateY: Math.PI,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0.08,
  },
];
