



import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';

const input = 'd:/input.MOV';

const output = 'd:/20250907204258.jpg';

// //ffmpeg -i d:/20250907204258.concat.mp4 -ss 1 -vframes:v 1 -q:v 2 -update  -y true d:/20250907204258.concat.mp4.thumb.jpg
// const { stderr, stdout } = await Bun.$`ffmpeg -ss 1 -i ${input} -vframes 1 -q:v 2 -y  ${output}`;
// const base64_img = (await fs.readFile(output)).toBase64();
// console.log(base64_img);
const result = await ffmpeg.generateThumbnail('d:/20250907204258.concat.mp4');
// console.log(result);

//   const cmd = `ffmpeg -ss ${time} -i "${video_url}" -vframes 1 -q:v 2 "${outputPath}"`;

