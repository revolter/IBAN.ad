import { favicons } from "favicons";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SMALL_ICON_MAX_SIZE = 48;

const smallFaviconSource = path.join(__dirname, "src", "small-logo.svg");
const largeFaviconSource = path.join(__dirname, "src", "large-logo.svg");
const logoSource = path.join(__dirname, "src", "large-logo.svg");
const dest = path.join(__dirname, "docs");

const configuration = {
    path: "/", // URLs in generated HTML
    appName: "IBAN.ad",
    appShortName: "IBAN.ad",
    appDescription: "IBAN Advertiser",
    background: "#ffffff",
    theme_color: "#0f172a",
    icons: {
        android: false,
        appleIcon: true,
        appleStartup: false,
        favicons: true,
        windows: false,
        yandex: false,
    },
};

const FAVICONS_START = "<!-- FAVICONS_START -->";
const FAVICONS_END = "<!-- FAVICONS_END -->";

function getSquareSizeFromSizesAttribute(tag) {
    const match = tag.match(/\bsizes=["'](\d+)x(\d+)["']/i);
    if (!match) return null;
    const w = Number(match[1]);
    const h = Number(match[2]);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w !== h) return null;
    return w;
}

function getHREFBasename(tag) {
    const match = tag.match(/\bhref=["']([^"']+)["']/i);
    if (!match) return null;
    return path.posix.basename(match[1]);
}

function computeNamesToPreferSmallIcons(iconLinkTags) {
    const names = new Set();

    for (const tag of iconLinkTags) {
        const name = getHREFBasename(tag);
        if (!name) continue;

        if (name.toLowerCase() === "favicon.ico") {
            names.add(name);
            continue;
        }

        const size = getSquareSizeFromSizesAttribute(tag);
        if (size !== null && size <= SMALL_ICON_MAX_SIZE) {
            names.add(name);
        }
    }

    return names;
}

async function writeFavicons() {
    const largeResponse = await favicons(largeFaviconSource, configuration);
    const smallResponse = await favicons(smallFaviconSource, configuration);

    await fs.mkdir(dest, { recursive: true });

    const imagesByName = new Map(
        largeResponse.images.map((image) => [image.name, image.contents]),
    );

    const namesToPreferSmallIcons = computeNamesToPreferSmallIcons(largeResponse.html);

    for (const image of smallResponse.images) {
        if (namesToPreferSmallIcons.has(image.name)) {
            imagesByName.set(image.name, image.contents);
        }
    }

    await Promise.all(
        [...imagesByName.entries()].map(([name, contents]) =>
            fs.writeFile(path.join(dest, name), contents),
        ),
    );

    await Promise.all(
        largeResponse.files.map((file) =>
            fs.writeFile(path.join(dest, file.name), file.contents),
        ),
    );

    await fs.copyFile(logoSource, path.join(dest, "logo.svg"));

    const indexPath = path.join(dest, "index.html");
    let html = await fs.readFile(indexPath, "utf8");

    const block = [
        FAVICONS_START,
        ...largeResponse.html,
        FAVICONS_END,
    ].join("\n");

    const startIndex = html.indexOf(FAVICONS_START);
    const endIndex = html.indexOf(FAVICONS_END);

    if (startIndex !== -1 && endIndex !== -1) {
        const lineStart = html.lastIndexOf("\n", startIndex) + 1;
        const indent = html.slice(lineStart, startIndex);
        const indentedBlock =
            indent + block.replace(/\n/g, "\n" + indent);

        const afterEnd = endIndex + FAVICONS_END.length;
        html = html.slice(0, lineStart) + indentedBlock + html.slice(afterEnd);
    } else {
        const descriptionMetaRegex = /<meta\s+name=["']description["'][^>]*>/i;
        const descriptionMatch = html.match(descriptionMetaRegex);

        if (descriptionMatch && descriptionMatch.index !== undefined) {
            const descIndex = descriptionMatch.index;
            const lineEnd = html.indexOf("\n", descIndex);
            const insertPos =
                lineEnd === -1
                    ? descIndex + descriptionMatch[0].length
                    : lineEnd + 1;
            const indent = "    ";
            html =
                html.slice(0, insertPos) +
                indent +
                block.replace(/\n/g, "\n" + indent) +
                "\n" +
                html.slice(insertPos);
        } else {
            const headClose = "</head>";
            const headIndex = html.indexOf(headClose);
            const indent = "    ";

            if (headIndex !== -1) {
                html =
                    html.slice(0, headIndex) +
                    indent +
                    block.replace(/\n/g, "\n" + indent) +
                    "\n" +
                    html.slice(headIndex);
            } else {
                html = block + "\n" + html;
            }
        }
    }

    await fs.writeFile(indexPath, html);
}

try {
    await writeFavicons();
} catch (error) {
    console.error("Error generating favicons:", error);
    process.exitCode = 1;
}
