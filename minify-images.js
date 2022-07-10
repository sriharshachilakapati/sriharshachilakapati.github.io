import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

import fs from 'fs/promises';

async function minifyImages(directory) {
    await imagemin([ `${directory}/*.{jpg,jpeg,gif,png}` ], {
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

        if (stat.isDirectory()) {
            continue;
        }

        sizes[path] = stat.size;
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

    const results = [];

    for (const fileName in preSizes) {
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

    console.table(results);
}

await main();