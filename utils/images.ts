import { cond, pathOr, startsWith } from 'ramda';

export const getFileUrl = pathOr(null, ['fields', 'file', 'url']);

const getResult = (result: string | ArrayBuffer) =>
  typeof result === 'string' ? result : null;

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(getResult(reader.result));
    reader.onerror = (error) => reject(error);
  });

export async function getFilePreview(file: File): Promise<string> {
  return cond<string, Promise<string>>([
    [startsWith('image'), async () => await toBase64(file)],
    [startsWith('video'), async () => await extractFramesFromVideo(file)],
  ])(file.type);
}

// https://stackoverflow.com/questions/43007634/javascript-how-to-extract-frame-from-video
export async function extractFramesFromVideo(
  videoFile: File,
  fps = 25
): Promise<string> {
  // TODO: @gosseti we don't actually want to ignore this error
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    // fully download it first (no buffering):

    const videoObjectUrl = URL.createObjectURL(videoFile);
    const video = document.createElement('video');

    let seekResolve;
    video.addEventListener('seeked', async function () {
      if (seekResolve) {
        seekResolve();
      }
    });

    video.src = videoObjectUrl;

    // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
    while (
      (video.duration === Infinity || isNaN(video.duration)) &&
      video.readyState < 2
    ) {
      await new Promise((r) => setTimeout(r, 1000));
      video.currentTime = 10000000 * Math.random();
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const [w, h] = [video.videoWidth, video.videoHeight];
    canvas.width = w;
    canvas.height = h;

    video.currentTime = 1;
    await new Promise((r) => (seekResolve = r));

    context.drawImage(video, 0, 0, w, h);
    const base64ImageData = canvas.toDataURL();

    resolve(base64ImageData);
  });
}
