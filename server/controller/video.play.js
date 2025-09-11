import ffmpeg from '#ffmpeg';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const meta = await ffmpeg.getMetadata(input);
    // '-noborder'
    Bun.spawn(['ffplay', input, '-y', meta.video.height / 2], { stdout: 'ignore', stderr: 'ignore' });
    return ctx.json({});
};
