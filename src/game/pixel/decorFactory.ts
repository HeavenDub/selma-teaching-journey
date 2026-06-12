import type Phaser from "phaser";

/**
 * Small procedural decor textures that break up tile repetition and give the
 * world depth: grass tufts, stones, shells, character drop shadows and a
 * soft camera vignette.
 */

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return [canvas, canvas.getContext("2d")!];
}

export function createDecorTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists("fx-tuft")) {
    const [canvas, ctx] = makeCanvas(10, 8);
    ctx.fillStyle = "#4f7d43";
    ctx.fillRect(2, 2, 1, 6);
    ctx.fillRect(4, 0, 1, 8);
    ctx.fillRect(6, 3, 1, 5);
    ctx.fillStyle = "#6fa75c";
    ctx.fillRect(3, 1, 1, 7);
    ctx.fillRect(5, 2, 1, 6);
    ctx.fillRect(7, 4, 1, 4);
    scene.textures.addCanvas("fx-tuft", canvas);
  }

  if (!scene.textures.exists("fx-stone")) {
    const [canvas, ctx] = makeCanvas(8, 6);
    ctx.fillStyle = "#9a8f80";
    ctx.fillRect(1, 1, 6, 4);
    ctx.fillRect(0, 2, 8, 2);
    ctx.fillStyle = "#b5aa99";
    ctx.fillRect(2, 1, 3, 2);
    ctx.fillStyle = "#6e6557";
    ctx.fillRect(1, 4, 6, 1);
    scene.textures.addCanvas("fx-stone", canvas);
  }

  if (!scene.textures.exists("fx-shell")) {
    const [canvas, ctx] = makeCanvas(7, 6);
    ctx.fillStyle = "#f3e0c8";
    ctx.fillRect(1, 1, 5, 4);
    ctx.fillRect(0, 2, 7, 2);
    ctx.fillStyle = "#e0b894";
    ctx.fillRect(3, 0, 1, 6);
    ctx.fillRect(1, 2, 5, 1);
    scene.textures.addCanvas("fx-shell", canvas);
  }

  if (!scene.textures.exists("fx-flower")) {
    const [canvas, ctx] = makeCanvas(7, 7);
    ctx.fillStyle = "#e76f51";
    ctx.fillRect(2, 0, 3, 3);
    ctx.fillRect(0, 1, 7, 1);
    ctx.fillStyle = "#f0d488";
    ctx.fillRect(3, 1, 1, 1);
    ctx.fillStyle = "#4f7d43";
    ctx.fillRect(3, 3, 1, 4);
    scene.textures.addCanvas("fx-flower", canvas);
  }

  if (!scene.textures.exists("fx-shadow")) {
    const [canvas, ctx] = makeCanvas(32, 12);
    const grad = ctx.createRadialGradient(16, 6, 1, 16, 6, 14);
    grad.addColorStop(0, "rgba(42, 31, 22, 0.4)");
    grad.addColorStop(1, "rgba(42, 31, 22, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(16, 6, 15, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    scene.textures.addCanvas("fx-shadow", canvas);
  }

  if (!scene.textures.exists("fx-vignette")) {
    const [canvas, ctx] = makeCanvas(320, 180);
    const grad = ctx.createRadialGradient(160, 90, 60, 160, 90, 200);
    grad.addColorStop(0, "rgba(31, 29, 43, 0)");
    grad.addColorStop(0.72, "rgba(31, 29, 43, 0)");
    grad.addColorStop(1, "rgba(31, 29, 43, 0.42)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 180);
    scene.textures.addCanvas("fx-vignette", canvas);
  }

  if (!scene.textures.exists("fx-glimmer")) {
    const [canvas, ctx] = makeCanvas(10, 3);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(0, 1, 10, 1);
    ctx.fillRect(3, 0, 4, 3);
    scene.textures.addCanvas("fx-glimmer", canvas);
  }
}
