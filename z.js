import yt from './server/utils/yt.dlp.js';

// const result = await yt.resolveUrl('https://youtu.be/8_F5_AXtaxM');
// console.log(result);

const text = '[download] Destination: C:\\Users\\Administrator\\Downloads\\20250915225849863.f30280.m4a';

const match = text.match(/\[download\]\sDestination:*/);
if (match && match[0]) console.log(match[0]);

// https://d3ce81303778c3a4ad3915b66203e482.free-lbv26.idouyinvod.com/v26-web.douyinvod.com/f730ad41cd8bf394bde57035c5dbc1ba/68c864b3/video/tos/cn/tos-cn-ve-15/ogFcQEIouA8RAb3hEg5Ad9PBN9yfIeuvAHugQD/?a=6383&ch=224&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=597&bt=597&cs=0&ds=4&ft=AJkeU_TERR0sT1C4-Dv2Nc0iPMgzbL3g.UdU_4jCVI2JNv7TGW&mime_type=video_mp4&qs=0&rc=N2Y4Njg3ZWg8Zjk5NzRoPEBpamd2eWo5cmczNTMzNGkzM0AwNTU1NS5fNWExY2JiYjU0YSNvZTMuMmRzYnBhLS1kLWFzcw%3D%3D&btag=c0000e00030000&cquery=101s_100B_100H_100K_100o&dy_q=1757952173&feature_id=0ea98fd3bdc3c6c14a3d0804cc272721&l=20250916000251DD39155EE65ED4556E54&__vid=7545839290119359771&hon_cdn_source=MCAwDQYJKoZIhvcNAQEB,1495503275,1757952246,kGcxwaN0zqxwJYFAHMu4gQofzhOTVTh_Csgpqbv6UR0&hon_cdn_info=39.134.69.182_111.23.4.54_15eab4347f687b3a5eea94f6466cd63d_15d789540d09ce125f3431fc34b20d10