import React, { useMemo } from "react";

const VideoPlayer = React.memo(({
  videoUrls,
  className = "w-full h-full object-cover",
  style = {},
  controls = false,
  autoPlay = true,
  muted = true,
  playsInline = true,
  loop = true,
}) => {
  // Validation et mémorisation des sources
  const sources = useMemo(() => {
    if (typeof videoUrls === "string") {
      return [{ src: videoUrls, type: "video/mp4" }];
    }

    if (!videoUrls) return [];

    const sourceList = [];
    if (videoUrls.url_webm) sourceList.push({ src: videoUrls.url_webm, type: "video/webm" });
    if (videoUrls.url_mp4) sourceList.push({ src: videoUrls.url_mp4, type: "video/mp4" });
    return sourceList;
  }, [videoUrls]);

  if (!sources.length) return null;

  return (
    <video
      controls={controls}
      className={className}
      style={style}
      autoPlay={autoPlay}
      muted={muted}
      playsInline={playsInline}
      loop={loop}
    >
      {sources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
    </video>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
