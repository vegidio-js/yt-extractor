import * as express from 'express';
import * as ytdl from 'ytdl-core';
import * as mem from 'mem';
import logger from './logger';

const app = express();

// Routes
app.get('/video/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    res.json(await cachedParseVideo(videoId));
});

// Parse the video information
const parseVideo = async (videoId: string): Promise<unknown> => {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    
    return {
        streamUrl:format.url,
    };
};

const cachedParseVideo = mem(parseVideo, {
    maxAge: 10_800, // 3 hours
});

app.use('/', (req, res) => res.send('🎥 YT Extractor'));

// Starting server
const port = process.env.PORT ?? 80;
app.listen(port, () => logger.info('🎥 YT Extractor'));
