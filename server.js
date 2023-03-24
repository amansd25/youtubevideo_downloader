const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/downloadYoutubeVideo', (req, res) => {
  const videoURL = 'https://www.youtube.com/watch?v=FfM3VPj7a9o';
  const videoPath = 'video.mp4';

  ytdl(videoURL, { filter: 'audioandvideo' })
    .pipe(fs.createWriteStream(videoPath))
    .on('finish', () => {
      res.send('Video downloaded successfully.');
    })
    .on('error', (err) => {
      console.log(err);
      res.status(500).send('Error downloading video.');
    });
});

app.get('/CompressVideo', (req, res) => {
  const inputPath = 'video.mp4';
  const outputPath = 'compressed-video.mp4';

  ffmpeg(inputPath)
    .outputOptions('-c:v', 'libx264')
    .outputOptions('-preset', 'medium')
    .outputOptions('-s', '1280x720')
    .outputOptions('-c:a', 'copy')
    .save(outputPath)
    .on('end', () => {
      res.download(outputPath, () => {
        fs.unlink(inputPath, () => {
          fs.unlink(outputPath, () => {
            console.log('Files deleted.');
          });
        });
      });
    })
    .on('error', (err) => {
      console.log(err);
      res.status(500).send('Error compressing video.');
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
