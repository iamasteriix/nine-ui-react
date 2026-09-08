import type { PlatformFlags } from '@/types';
import { findProjectRoot, resolveTargetPlatform } from '@/utils';
import * as fontkit from 'fontkit';
import fs from 'fs';
import path from 'path';
import { locateInitFonts } from './init';
import type { FontMetadata } from './types';


const FORMAT_MAP: Record<string, string> = {
  '.woff2': 'woff2',
  '.woff': 'woff',
  '.ttf': 'truetype',
  '.otf': 'opentype',
};


/**
 * Uses the file's extension to try and determine the correct format.
 */
const getFontFormat = (filePath: string): string | null => {
  const ext = path.extname(filePath).toLowerCase();
  return FORMAT_MAP[ext] || null;
}


/**
 * This is only here because apparently, iOS reads whatever tf a PostScript name is,
 * Android reads the file name, and I didn't bother looking into web. This scanner
 * hopefully streamlines the discrepancy.
 */
const scanDirForFonts = (dirPath: string): FontMetadata[] => {
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const fonts: FontMetadata[] = [];

  for (const file of files) {
    const absolutePath = path.join(dirPath, file);
    const format = getFontFormat(file);
    if (!format) continue;  // skip non-font files

    try {
      const font = fontkit.openSync(absolutePath);
      // `openSync()` returns a union of `Font | FontCollection`
      // so narrow out `FontCollection` because it is out of scope
      if ('fonts' in font) {
        console.log(`[lucidjs] Skipping unsupported font collection: ${file}`);
        continue;
      }
      const weight = font['OS/2']?.usWeightClass || 400;
      const isItalic = font.subfamilyName?.toLowerCase().includes('italic') || font.postscriptName?.toLowerCase().includes('italic');
      fonts.push({
        family: font.familyName || font.postscriptName,
        weight,
        fileName: file,
        format,
        absolutePath,
        style: isItalic ? 'italic' : 'normal',
      });

    } catch (error) {
      console.warn(`[lucidjs] Warning: Could not parse font ${file}`, error);
    }
  }

  return fonts;
}


/**
 * Overwrites the existing `fonts.css` that I decided to add to the built package's
 * `assets/styles`, and copies the font assets to some neighboring `assets/fonts`.
 * We take a duplication hit because fonts now uNneCesSaRiLly exist in both the
 * consumer's source and inside the installed package, but we benefit from the
 * reliability of not having to reach out from within the installed package to find
 * where their package manager put the files.
 * Apparently, this is also how it works on native? Sure, I guess.
 */
const writeFontCss = (fontMap: Map<string, FontMetadata>): void => {
  const webPackageEntry = require.resolve('@lucidjs/web');
  const webDistDir = path.dirname(webPackageEntry);
  const fontCssPath = path.join(webDistDir, 'assets/styles/fonts.css');
  const generatedFontsDir = path.join(webDistDir, 'assets/fonts');
  fs.mkdirSync(generatedFontsDir, { recursive: true, });

  const rules: string[] = [];
  const fontMapValues = fontMap.values();
  for (const font of fontMapValues) {
    const dest = path.join(generatedFontsDir, font.fileName);
    const tmpDest = `${dest}.tmp`;
    fs.copyFileSync(font.absolutePath, tmpDest);
    fs.renameSync(tmpDest, dest);
    rules.push(`
      @font-face {
        font-family: '${font.family}';
        src: url('../fonts/${font.fileName}') format('${font.format}');
        font-weight: ${font.weight};
        font-style: ${font.style};
        font-display: swap;
      }
    `);
  }
  const tmpFontCssPath = `${fontCssPath}.tmp`;
  fs.writeFileSync(tmpFontCssPath, rules.join('\n\n'));
  fs.renameSync(tmpFontCssPath, fontCssPath);
}


/**
 * @todo Validate postscript names (some ios bullshit) and update Expo app.json, or native asset links
 */
export const updateFonts = (platforms: PlatformFlags) => {
  const { isTargetWeb, isTargetAndroid, isTargetIOS, } = resolveTargetPlatform(platforms);
  const coreFontsDir = locateInitFonts();

  if (isTargetWeb) {
    const localFontsDir = path.resolve(findProjectRoot(process.cwd()), 'assets/fonts');

    // gather fonts from both core package (as fallback) and local consumer workspace
    const coreFonts = scanDirForFonts(coreFontsDir);
    const localFonts = scanDirForFonts(localFontsDir);

    // dedup fonts by family, weight, and style
    // local overrides core
    const fontMap = new Map();
    [...coreFonts, ...localFonts].forEach((font) => {
      const key = `${font.family}-${font.weight}-${font.style}`;
      fontMap.set(key, font);
    });

    // regenerate `styles/font.css` and copy font binaries into abstracted away `dist/assets/` for reliability
    writeFontCss(fontMap);
  }

  // sync native assets
  if (isTargetAndroid || isTargetIOS) {}
}
