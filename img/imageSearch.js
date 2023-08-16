const sharp = require('sharp');

async function findImageWithinImage(outer, inner, max = 1) // max is the maximum occurences to find
{
    let file_o = sharp(outer);
    let file_i = sharp(inner);
    let buff_o = await file_o.raw().toBuffer();
    let buff_i = await file_i.raw().toBuffer();
    let meta_o = await file_o.metadata();
    let meta_i = await file_i.metadata();
    let size_o = meta_o.width * meta_o.channels;
    let size_i = meta_i.width * meta_i.channels;

    let upper = buff_i.slice(0, size_i); // upper row of inner
    let found = -1;
    let finds = [];

    if (meta_i.width <= meta_o.width && meta_i.height <= meta_o.height) { // must be containable within

        do {
            found = buff_o.indexOf(upper, found + 1); // upper row is present, so its another candidate

            if (found != -1) {
                let matches = true;

                let oy = Math.floor(found / size_o);
                let ox = Math.floor((found - size_o * oy) / meta_o.channels);

                for (let y = 1; matches && y < meta_i.height; y++) { // start from one as upper row is already matched

                    let pos_i = y * size_i;
                    let pos_o = y * size_o + found;

                    let slice_i = buff_i.slice(pos_i, pos_i + size_i);
                    let slice_o = buff_o.slice(pos_o, pos_o + size_i);

                    matches &= slice_o.equals(slice_i); // does next row also match?
                }

                if (matches) {

                    finds.push({ x: ox, y: oy, w: meta_i.width, h: meta_i.height });

                    /* await sharp(outer)  // uncomment this to see the extracted images - which are the same as inner
                      .extract({ left: finds[finds.length - 1].x,
                                  top: finds[finds.length - 1].y,
                                width: finds[finds.length - 1].w,
                               height: finds[finds.length - 1].h })
                      .toBuffer()
                      .then(buffer => sharp(buffer).toFile(`found_${finds.length}.png`)); */
                }
            }
        }
        while (found != -1 && finds.length < max);
    }

    return finds;
}