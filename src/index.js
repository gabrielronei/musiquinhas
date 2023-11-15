import ytdl from '@distube/ytdl-core';
import fs from "fs";
import ffmpeg from 'fluent-ffmpeg';
import cliProgress from 'cli-progress';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

const fileContent = fs.readFileSync("./musicas/lista.txt", { encoding: 'utf-8' });
const links = fileContent.trim().split(/\n/).filter(text => text !== '');
const multibar = new cliProgress.MultiBar({
    stopOnComplete: true,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    format: ' \u001b[32m{bar} | {filename} | {value}/{total}',
});

links.map(link => ({ 'id': link, 'progress': multibar.create(0, 0)})).forEach(({ id, progress }) => {
    const audio = ytdl(id, { quality: 'highestaudio' });

    ytdl.getInfo(id).then(info => {
        let titulo = info.videoDetails.title.replace(/(\[.*\])|(\(.*\))/, '').trimStart().trimEnd();
        const palavras = titulo.split(" ");
        
        titulo = palavras.filter(palavra => palavra !== '').map((palavra) => {
            return palavra[0].toUpperCase() + palavra.substring(1);
        }).join(" ");

        audio.on('progress', (_, downloaded, total) => {
            progress.setTotal(total);
            progress.update(downloaded, { filename: `${titulo}.mp3` });
        });

        ffmpeg(audio)
            .audioBitrate(320)
            .save(`musicas/${titulo}.mp3`);
    });
});