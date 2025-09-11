import ffmpeg from '#ffmpeg';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const result = await ffmpeg.generateThumbnail(input);
    return ctx.text(result);
};
