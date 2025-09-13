// const url = 'https://www.youtube.com/shorts/yi6EG0xNpN0?feature=share';
//
const url = 'https://www.bilibili.com/video/BV1c9HbzxEG1?t=14.6';
const output_dir = '/Users/yujf/Downloads/%(title)s.%(ext)s';
await Bun.$`yt-dlp -o ${output_dir} --cookies-from-browser chrome ${url}`;
