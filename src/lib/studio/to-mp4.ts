export function looksLikeMp4(blob: Blob) {
  return /mp4|m4v|quicktime/i.test(blob.type);
}

export async function transcodeToMp4(
  blob: Blob,
  onProgress?: (p: number) => void,
): Promise<Blob> {
  const {
    ALL_FORMATS,
    BlobSource,
    BufferTarget,
    Conversion,
    Input,
    Mp4OutputFormat,
    Output,
    Quality,
    canEncodeAudio,
    canEncodeVideo,
  } = await import("mediabunny");

  const avc = await canEncodeVideo("avc");
  if (!avc) throw new Error("이 브라우저에서는 MP4를 만들 수 없습니다");
  const aac = await canEncodeAudio("aac");
  if (!aac) throw new Error("이 브라우저에서는 MP4 소리를 만들 수 없습니다");

  const input = new Input({
    source: new BlobSource(blob),
    formats: ALL_FORMATS,
  });
  const target = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "in-memory" }),
    target,
  });

  const conversion = await Conversion.init({
    input,
    output,
    video: { codec: "avc", quality: new Quality("high") },
    audio: { codec: "aac", quality: new Quality("high") },
    showWarnings: false,
  });
  if (!conversion.isValid) {
    throw new Error("MP4로 바꿀 수 없습니다");
  }
  conversion.onProgress = (p) => onProgress?.(p);
  await conversion.execute();
  const buf = target.buffer;
  if (!buf) throw new Error("MP4 결과가 비었습니다");
  return new Blob([buf], { type: "video/mp4" });
}
