ffmpeg -y \
-i "/Users/yujf/Downloads/out.mp4" \
-i "/Users/yujf/Downloads/watermark.png" \
-filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.5,scale=iw*0.2:-1[wm];[0][wm]overlay=x=10:y=10" \
-crf 23 \
-preset ultrafast \
-f mpegts tcp://127.0.0.1:1234?listen
# "/Users/yujf/Downloads/output/input.watermark.mp4"