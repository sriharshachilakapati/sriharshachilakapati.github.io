import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

import fs from 'fs/promises';
import util from 'util';
import { exec as raw_exec } from 'child_process';

const exec = util.promisify(raw_exec);

const allowedExtensions = [
    "jpg",
    "jpeg",
    "gif",
    "png",
    "svg"
]

async function minifyImages(directory) {
    await imagemin([ `${directory}/*.{${ allowedExtensions.join(",") }}` ], {
        destination: directory,
        strip: true,
        verbose: true,
        plugins: [
            imageminJpegtran(),
            imageminGifsicle(),
            imageminPngquant({
                strip: true,
                quality: [ 0.8, 1.0 ]
            }),
            imageminSvgo({
                plugins: [{
                    name: 'removeViewBox',
                    active: false
                }]
            })
        ]
    });
}

async function findAssetDirectories(currentPath) {
    const paths = [];
    const files = await fs.readdir(currentPath);

    for (const file of files) {
        const path = `${currentPath}/${file}`;
        const stat = await fs.stat(path);

        if (!stat.isDirectory()) {
            continue;
        }

        paths.push(path);
        paths.push(... await findAssetDirectories(path));
    }

    return paths;
}

async function getFileSizes(sizes, directory) {
    const files = await fs.readdir(directory);

    for (const file of files) {
        const path = `${directory}/${file}`;
        const stat = await fs.stat(path);

        if (stat.isDirectory() || allowedExtensions.filter(it => path.endsWith(`.${it}`)).length == 0) {
            continue;
        }

        sizes[path] = stat.size;
    }
}

async function getChangedFiles(preSizes, postSizes) {
    const results = [];
    const { stdout } = await exec("git diff --name-only");
    const allChangedFiles = stdout.split('\n').map(it => it.trim());

    for (const fileName in preSizes) {
        if (allChangedFiles.indexOf(fileName) < 0) {
            continue;
        }

        const sizeBefore = preSizes[fileName];
        const sizeAfter = postSizes[fileName];
        const difference = ((sizeAfter - sizeBefore) / (sizeBefore)) * 100;

        results.push({
            fileName,
            sizeBefore,
            sizeAfter,
            difference: difference.toFixed(2)
        });
    }

    return results;
}

async function addChangedFilesToGit(changedFiles) {
    for (const file of changedFiles) {
        await exec(`git add "${file.fileName}"`);
    }
}

async function main() {
    const directories = [];
    
    directories.push(
        ... await findAssetDirectories('assets/images'),
        ... await findAssetDirectories('assets/social-icons'),
        ... await findAssetDirectories('ppt')
    );

    const preSizes = {};
    const postSizes = {};

    for (const directory of directories) {
        console.log(`Minifying files in directory ${directory}`);

        await getFileSizes(preSizes, directory);
        await minifyImages(directory);
        await getFileSizes(postSizes, directory);
    }

    const results = await getChangedFiles(preSizes, postSizes);

    if (results.length > 0) {
        await addChangedFilesToGit(results);
        console.table(results);
    } else {
        console.log('All images are already optimized :)');
    }
}

await main();