import yt from './server/utils/yt.dlp.js';

// const result = await yt.resolveUrl('https://youtu.be/8_F5_AXtaxM');
// console.log(result);

const text = 
`ID      EXT   RESOLUTION FPS CH │   FILESIZE   TBR PROTO │ VCODEC         VBR ACODEC      ABR ASR MORE INFO
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
sb3     mhtml 48x27        0    │                  mhtml │ images                                 storyboard
sb2     mhtml 80x45        0    │                  mhtml │ images                                 storyboard
sb1     mhtml 160x90       0    │                  mhtml │ images                                 storyboard
sb0     mhtml 320x180      0    │                  mhtml │ images                                 storyboard
249-drc webm  audio only      2 │   10.95MiB   50k https │ audio only         opus        50k 48k low, DRC, webm_dash
250-drc webm  audio only      2 │   13.93MiB   64k https │ audio only         opus        64k 48k low, DRC, webm_dash
249     webm  audio only      2 │   10.94MiB   50k https │ audio only         opus        50k 48k low, webm_dash
250     webm  audio only      2 │   13.91MiB   63k https │ audio only         opus        63k 48k low, webm_dash
140-drc m4a   audio only      2 │   28.40MiB  129k https │ audio only         mp4a.40.2  129k 44k medium, DRC, m4a_dash
251-drc webm  audio only      2 │   27.58MiB  126k https │ audio only         opus       126k 48k medium, DRC, webm_dash
140     m4a   audio only      2 │   28.40MiB  129k https │ audio only         mp4a.40.2  129k 44k medium, m4a_dash
251     webm  audio only      2 │   27.53MiB  126k https │ audio only         opus       126k 48k medium, webm_dash
91      mp4   256x144     30    │ ~ 25.20MiB  115k m3u8  │ avc1.4D400C        mp4a.40.5
160     mp4   256x144     30    │    7.62MiB   35k https │ avc1.4d400c    35k video only          144p, mp4_dash
278     webm  256x144     30    │   14.90MiB   68k https │ vp9            68k video only          144p, webm_dash
394     mp4   256x144     30    │   11.53MiB   53k https │ av01.0.00M.08  53k video only          144p, mp4_dash
92      mp4   426x240     30    │ ~ 32.10MiB  146k m3u8  │ avc1.4D4015        mp4a.40.5
133     mp4   426x240     30    │   11.14MiB   51k https │ avc1.4d4015    51k video only          240p, mp4_dash
242     webm  426x240     30    │   17.98MiB   82k https │ vp9            82k video only          240p, webm_dash
395     mp4   426x240     30    │   15.27MiB   70k https │ av01.0.00M.08  70k video only          240p, mp4_dash
93      mp4   640x360     30    │ ~ 65.34MiB  298k m3u8  │ avc1.4D401E        mp4a.40.2
134     mp4   640x360     30    │   19.10MiB   87k https │ avc1.4d401e    87k video only          360p, mp4_dash
18      mp4   640x360     30  2 │   78.58MiB  358k https │ avc1.42001E        mp4a.40.2       44k 360p
243     webm  640x360     30    │   36.13MiB  165k https │ vp9           165k video only          360p, webm_dash
396     mp4   640x360     30    │   26.08MiB  119k https │ av01.0.01M.08 119k video only          360p, mp4_dash
94      mp4   854x480     30    │ ~ 81.02MiB  369k m3u8  │ avc1.4D401F        mp4a.40.2
135     mp4   854x480     30    │   27.69MiB  126k https │ avc1.4d401f   126k video only          480p, mp4_dash
244     webm  854x480     30    │   55.48MiB  253k https │ vp9           253k video only          480p, webm_dash
397     mp4   854x480     30    │   42.13MiB  192k https │ av01.0.04M.08 192k video only          480p, mp4_dash
95      mp4   1280x720    30    │ ~120.09MiB  547k m3u8  │ avc1.4D401F        mp4a.40.2
136     mp4   1280x720    30    │   49.24MiB  224k https │ avc1.4d401f   224k video only          720p, mp4_dash
247     webm  1280x720    30    │  100.43MiB  458k https │ vp9           458k video only          720p, webm_dash
398     mp4   1280x720    30    │   69.91MiB  319k https │ av01.0.05M.08 319k video only          720p, mp4_dash
96      mp4   1920x1080   30    │ ~350.15MiB 1596k m3u8  │ avc1.640028        mp4a.40.2
137     mp4   1920x1080   30    │  183.08MiB  835k https │ avc1.640028   835k video only          1080p, mp4_dash
248     webm  1920x1080   30    │  174.16MiB  794k https │ vp9           794k video only          1080p, webm_dash
399     mp4   1920x1080   30    │  114.50MiB  522k https │ av01.0.08M.08 522k video only          1080p, mp4_dash`;

const lines = text.split('\n');

for (const line of lines) {
    const arr = line.split('\t');
    console.log(arr);
}
