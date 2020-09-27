import fs from "fs";
import { CanvasRenderService } from "chartjs-node-canvas";

const chartToPng = async (
  width: number,
  height: number,
  configuration: any,
  pathToImage: string
) => {
  const canvasRenderService = new CanvasRenderService(
    width,
    height,
    (ChartJS: any) => {}
  );

  //  Create PNG
  const image = await canvasRenderService.renderToBuffer(
    configuration,
    "image/png"
  );
  const out = fs.writeFileSync(pathToImage, image);
};

export { chartToPng };
