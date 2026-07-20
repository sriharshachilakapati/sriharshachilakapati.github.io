#!/usr/bin/env node

import sharp from "sharp";

import { optimize as svgoOptimize } from "svgo";

import fs from "fs/promises";
import path from "path";

/** @type {Set<string>} Supported image file extensions (without dot). */
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "tiff", "svg"]);

/**
 * Recursively finds all image files in the given directory.
 * @param {string} dir - The directory to search.
 * @returns {Promise<Array<{fullPath: string, ext: string}>>} Matching image files.
 */
async function findAllImages(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findAllImages(fullPath)));
    } else {
      const ext = path.extname(entry.name).slice(1).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        results.push({ fullPath, ext });
      }
    }
  }

  return results;
}

/**
 * Optimizes a single image file in-place using sharp or svgo (for SVGs).
 * A temporary file is written alongside the original and then renamed over it.
 * @param {string} filePath - Absolute path to the image.
 * @param {string} ext - Lowercase file extension (without dot).
 * @returns {Promise<void>}
 */
async function optimizeImage(filePath, ext) {
  switch (ext) {
    case "png":
      await sharp(filePath)
        .png({ compressionLevel: 9, effort: 7 })
        .toFile(filePath + ".tmp");
      break;
    case "jpg":
    case "jpeg":
      await sharp(filePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(filePath + ".tmp");
      break;
    case "gif":
      await sharp(filePath)
        .gif({ effort: 7 })
        .toFile(filePath + ".tmp");
      break;
    case "tiff":
      await sharp(filePath)
        .tiff({ compression: "lzw" })
        .toFile(filePath + ".tmp");
      break;
    case "svg": {
      const input = await fs.readFile(filePath, "utf8");
      const result = svgoOptimize(input);
      await fs.writeFile(filePath + ".tmp", result.data);
      break;
    }
  }

  await fs.rename(filePath + ".tmp", filePath);
}

/**
 * Entry point — reads a target directory from CLI args, optimizes every image
 * found, and prints a size-comparison table.
 * @returns {Promise<void>}
 */
async function main() {
  const targetDir = process.argv[2];

  if (!targetDir) {
    console.error("Usage: node minify-images.js <directory>");
    process.exit(1);
  }

  const images = await findAllImages(targetDir);

  if (images.length === 0) {
    console.log("No images found to optimize.");
    process.exit(0);
  }

  /** @type {Record<string, number>} File path → original size in bytes. */
  const preSizes = {};

  for (const { fullPath } of images) {
    const stat = await fs.stat(fullPath);
    preSizes[fullPath] = stat.size;
  }

  for (const { fullPath, ext } of images) {
    console.log(`Optimizing ${fullPath}`);
    await optimizeImage(fullPath, ext);
  }

  const results = [];

  for (const { fullPath } of images) {
    const sizeBefore = preSizes[fullPath];
    const stat = await fs.stat(fullPath);
    const sizeAfter = stat.size;
    const difference = ((sizeAfter - sizeBefore) / sizeBefore) * 100;

    results.push({
      file: path.relative(targetDir, fullPath),
      before: sizeBefore,
      after: sizeAfter,
      saved: `${difference.toFixed(2)}%`,
    });
  }

  console.table(results);
}

await main();
