import p5 from "p5";
import { p, setP5Instance } from "./shared";
import * as DropZone from "./dom/drop-zone";
import * as Button from "./dom/button";
import * as ImgElement from "./dom/img-element";
import * as TextArea from "./dom/text-area";
import * as Settings from "./settings";
import * as ThumbnailArea from "./thumbnail-area";
import * as ImageGrid from "./image-grid";
import { setPosition } from "./dom/utility";

const imageFiles: p5.File[] = [];

let gridImage: p5.Graphics | undefined = undefined;

const completeGenerate = (rows: number, columns: number) => (
  imgList: readonly p5.Element[]
) => {
  const grid = ImageGrid.create({
    images: imgList,
    rows,
    columns,
    wholeSize: Settings.canvasSize
  });

  const scaleFactor = Math.max(
    1,
    Math.min(p.width / grid.width, p.height / grid.height)
  );

  p.image(
    grid,
    p.width / 2,
    p.height / 2,
    scaleFactor * grid.width,
    scaleFactor * grid.height
  );

  gridImage = grid;
};

const startGenerate = () => {
  p.background(255);

  const rows = 3;
  const columns = 3;

  const files: p5.File[] = p.shuffle(imageFiles).slice(0, rows * columns);

  ImgElement.createList({
    files,
    hide: true,
    warnOnFail: true,
    onComplete: completeGenerate(rows, columns)
  });
};

const saveResult = () => {
  if (!gridImage) return;

  p.save(gridImage, `grid-image.png`);
};

const setupDropZone = () => {
  const thumbnails = ThumbnailArea.create({
    position: Settings.dropZonePosition,
    size: Settings.dropZoneSize,
    initialColumns: 8
  });

  const onAddThumbnail = (_: p5.Element, file: p5.File) =>
    imageFiles.push(file);
  const onDrop = (file: p5.File) =>
    ThumbnailArea.add(thumbnails, file, onAddThumbnail);

  DropZone.create({
    position: Settings.dropZonePosition,
    size: Settings.dropZoneSize,
    onDrop
  });
};

const setup = () => {
  const { width, height } = Settings.canvasSize;
  const canvas = p.createCanvas(width, height);
  setPosition(canvas, Settings.canvasPosition);

  p.imageMode(p.CENTER);

  setupDropZone();

  Button.create({
    label: "generate",
    onClick: startGenerate,
    position: Settings.generateButtonPosition,
    size: Settings.generateButtonSize
  });

  Button.create({
    label: "save",
    onClick: saveResult,
    position: Settings.saveButtonPosition,
    size: Settings.saveButtonSize
  });

  TextArea.create({
    position: Settings.textAreaPosition,
    size: Settings.textAreaSize,
    initialValue: "aaaaaaa"
  });
};

new p5(p5Instance => {
  setP5Instance(p5Instance);
  p.setup = setup;
}, document.getElementById("ImageGridResult") || document.body);
