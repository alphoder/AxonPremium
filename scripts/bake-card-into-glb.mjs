/**
 * Bakes a premium info card as a 3D textured plane into the pizza GLB.
 * The card + connector will be visible in ALL AR viewers (Scene Viewer, Quick Look, WebXR).
 *
 * Usage: node scripts/bake-card-into-glb.mjs
 */

import { createCanvas } from 'canvas';
import { Document, NodeIO, Format } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT_GLB = join(ROOT, 'public/models/pizza.glb');
const OUTPUT_GLB = join(ROOT, 'public/models/pizza-ar.glb');

// ─── Render the info card to a canvas → PNG buffer ───
function renderCardImage(width, height) {
  const c = createCanvas(width, height);
  const ctx = c.getContext('2d');
  const scale = width / 800; // design at 800px then scale

  // Background with rounded corners (drawn as rect since GLB texture)
  ctx.fillStyle = 'rgba(12, 12, 20, 0.92)';
  roundRect(ctx, 0, 0, width, height, 24 * scale);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(201, 169, 110, 0.35)';
  ctx.lineWidth = 2 * scale;
  roundRect(ctx, 1, 1, width - 2, height - 2, 24 * scale);
  ctx.stroke();

  // Inner glow at top
  const glow = ctx.createLinearGradient(0, 0, 0, 80 * scale);
  glow.addColorStop(0, 'rgba(201, 169, 110, 0.08)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 80 * scale);

  let y = 32 * scale;

  // ── VEG Badge ──
  ctx.fillStyle = 'rgba(34, 139, 34, 0.3)';
  roundRect(ctx, 24 * scale, y, 80 * scale, 28 * scale, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, 24 * scale, y, 80 * scale, 28 * scale, 6 * scale);
  ctx.stroke();

  // Green dot
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(40 * scale, y + 14 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  // VEG text
  ctx.fillStyle = '#4ade80';
  ctx.font = `bold ${11 * scale}px Arial, sans-serif`;
  ctx.fillText('VEG', 50 * scale, y + 18 * scale);

  // Size badge
  ctx.fillStyle = 'rgba(201, 169, 110, 0.15)';
  roundRect(ctx, 115 * scale, y, 95 * scale, 28 * scale, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(201, 169, 110, 0.4)';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, 115 * scale, y, 95 * scale, 28 * scale, 6 * scale);
  ctx.stroke();
  ctx.fillStyle = '#C9A96E';
  ctx.font = `bold ${11 * scale}px Arial, sans-serif`;
  ctx.fillText('16" Large', 125 * scale, y + 18 * scale);

  y += 48 * scale;

  // ── Dish Name ──
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${28 * scale}px Georgia, serif`;
  ctx.fillText('Margherita Pizza', 24 * scale, y + 4 * scale);

  // ── Price ──
  ctx.fillStyle = '#C9A96E';
  ctx.font = `bold ${22 * scale}px Arial, sans-serif`;
  const priceW = ctx.measureText('₹495').width;
  ctx.fillText('₹495', width - 24 * scale - priceW, y + 4 * scale);

  y += 22 * scale;

  // ── Subtitle ──
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = `italic ${13 * scale}px Arial, sans-serif`;
  ctx.fillText('Classic Neapolitan Style', 24 * scale, y + 4 * scale);

  y += 28 * scale;

  // ── Divider ──
  const divGrad = ctx.createLinearGradient(24 * scale, 0, width - 24 * scale, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24 * scale, y);
  ctx.lineTo(width - 24 * scale, y);
  ctx.stroke();

  y += 18 * scale;

  // ── Ingredients header ──
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `bold ${9 * scale}px Arial, sans-serif`;
  ctx.letterSpacing = '1.5px';
  ctx.fillText('INGREDIENTS', 24 * scale, y);

  y += 18 * scale;

  // ── Ingredient tags ──
  const ingredients = ['Pizza Dough', 'San Marzano Tomatoes', 'Fresh Mozzarella', 'Olive Oil', 'Fresh Basil', 'Sea Salt', 'Garlic', 'Oregano'];
  let tagX = 24 * scale;
  const tagH = 26 * scale;
  const tagPad = 12 * scale;
  const tagGap = 6 * scale;
  ctx.font = `${11 * scale}px Arial, sans-serif`;

  for (const ing of ingredients) {
    const tw = ctx.measureText(ing).width + tagPad * 2;
    if (tagX + tw > width - 24 * scale) {
      tagX = 24 * scale;
      y += tagH + tagGap;
    }
    // Tag bg
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, tagX, y, tw, tagH, 13 * scale);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    roundRect(ctx, tagX, y, tw, tagH, 13 * scale);
    ctx.stroke();
    // Tag text
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(ing, tagX + tagPad, y + 17 * scale);
    tagX += tw + tagGap;
  }

  y += tagH + 20 * scale;

  // ── Divider 2 ──
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24 * scale, y);
  ctx.lineTo(width - 24 * scale, y);
  ctx.stroke();

  y += 18 * scale;

  // ── Nutrition header ──
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `bold ${9 * scale}px Arial, sans-serif`;
  ctx.fillText('NUTRITION (PER SLICE)', 24 * scale, y);

  y += 22 * scale;

  // ── Nutrition values ──
  const nutrition = [
    { val: '272', label: 'CALORIES' },
    { val: '12g', label: 'PROTEIN' },
    { val: '10g', label: 'FAT' },
    { val: '33g', label: 'CARBS' },
  ];
  const colW = (width - 48 * scale) / 4;
  for (let i = 0; i < nutrition.length; i++) {
    const cx = 24 * scale + colW * i + colW / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${22 * scale}px Arial, sans-serif`;
    const vw = ctx.measureText(nutrition[i].val).width;
    ctx.fillText(nutrition[i].val, cx - vw / 2, y);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `bold ${8 * scale}px Arial, sans-serif`;
    const lw = ctx.measureText(nutrition[i].label).width;
    ctx.fillText(nutrition[i].label, cx - lw / 2, y + 16 * scale);
  }

  // ── Powered by Axon Aura ──
  y += 36 * scale;
  ctx.fillStyle = 'rgba(201,169,110,0.3)';
  ctx.font = `${9 * scale}px Arial, sans-serif`;
  const powText = 'Powered by Axon Aura';
  const powW = ctx.measureText(powText).width;
  ctx.fillText(powText, width / 2 - powW / 2, y);

  return c.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Build geometry data for a plane ───
function createPlaneGeometry(width, height) {
  const hw = width / 2;
  const hh = height / 2;

  // Front face points toward -Z (toward camera). Reversed winding order.
  const positions = new Float32Array([
    hw, hh, 0,   -hw, hh, 0,   -hw, -hh, 0,   hw, -hh, 0,
  ]);
  const normals = new Float32Array([
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
  ]);
  // UVs: text reads left-to-right, top-to-bottom on the -Z face
  const uvs = new Float32Array([
    0, 1,  1, 1,  1, 0,  0, 0,
  ]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  return { positions, normals, uvs, indices };
}

// ─── Build connector (thin vertical pole + sphere) ───
function createConnectorGeometry(height, radius, segments) {
  // Simple cylinder
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;

    // Bottom vertex
    positions.push(x, 0, z);
    normals.push(Math.cos(a), 0, Math.sin(a));
    uvs.push(i / segments, 0);

    // Top vertex
    positions.push(x, height, z);
    normals.push(Math.cos(a), 0, Math.sin(a));
    uvs.push(i / segments, 1);

    if (i < segments) {
      const b = i * 2;
      indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  };
}

// ─── Small sphere for connector dot ───
function createSphereGeometry(radius, wSeg, hSeg) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let y = 0; y <= hSeg; y++) {
    for (let x = 0; x <= wSeg; x++) {
      const u = x / wSeg;
      const v = y / hSeg;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      const px = radius * Math.sin(phi) * Math.cos(theta);
      const py = radius * Math.cos(phi);
      const pz = radius * Math.sin(phi) * Math.sin(theta);

      positions.push(px, py, pz);
      normals.push(px / radius, py / radius, pz / radius);
      uvs.push(u, 1 - v);

      if (x < wSeg && y < hSeg) {
        const a = y * (wSeg + 1) + x;
        const b = a + wSeg + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  };
}

// ─── Main ───
async function main() {
  console.log('🍕 Loading pizza GLB...');
  const io = new NodeIO()
    .registerExtensions([KHRDracoMeshCompression])
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });
  const doc = await io.readBinary(readFileSync(INPUT_GLB));

  console.log('🎨 Rendering info card texture (800×520)...');
  const cardPNG = renderCardImage(800, 520);

  // Save debug image
  writeFileSync(join(ROOT, 'public/models/card-texture.png'), cardPNG);
  console.log('   → Saved card-texture.png for debug');

  // ─── Create card texture + material ───
  const cardTexture = doc.createTexture('CardTexture')
    .setImage(cardPNG)
    .setMimeType('image/png');

  const cardMaterial = doc.createMaterial('CardMaterial')
    .setBaseColorTexture(cardTexture)
    .setAlphaMode('BLEND')
    .setDoubleSided(true)
    .setRoughnessFactor(0.9)
    .setMetallicFactor(0.0);

  // ─── Create card plane mesh ───
  // Card dimensions in meters: ~0.28m wide × 0.18m tall (roughly menu card size)
  const cardW = 0.28;
  const cardH = 0.18;
  const plane = createPlaneGeometry(cardW, cardH);

  const cardPosAccessor = doc.createAccessor('CardPositions')
    .setType('VEC3').setArray(plane.positions);
  const cardNormAccessor = doc.createAccessor('CardNormals')
    .setType('VEC3').setArray(plane.normals);
  const cardUVAccessor = doc.createAccessor('CardUVs')
    .setType('VEC2').setArray(plane.uvs);
  const cardIdxAccessor = doc.createAccessor('CardIndices')
    .setType('SCALAR').setArray(plane.indices);

  const cardPrimitive = doc.createPrimitive()
    .setAttribute('POSITION', cardPosAccessor)
    .setAttribute('NORMAL', cardNormAccessor)
    .setAttribute('TEXCOORD_0', cardUVAccessor)
    .setIndices(cardIdxAccessor)
    .setMaterial(cardMaterial);

  const cardMesh = doc.createMesh('InfoCard').addPrimitive(cardPrimitive);

  // ─── Create connector pole ───
  const connectorMat = doc.createMaterial('ConnectorMaterial')
    .setBaseColorFactor([0.788, 0.663, 0.431, 0.7]) // champagne gold, semi-transparent
    .setAlphaMode('BLEND')
    .setRoughnessFactor(0.5)
    .setMetallicFactor(0.8);

  const poleHeight = 0.12; // 12cm pole
  const pole = createConnectorGeometry(poleHeight, 0.002, 8);

  const polePosAcc = doc.createAccessor('PolePos').setType('VEC3').setArray(pole.positions);
  const poleNormAcc = doc.createAccessor('PoleNorm').setType('VEC3').setArray(pole.normals);
  const poleUVAcc = doc.createAccessor('PoleUV').setType('VEC2').setArray(pole.uvs);
  const poleIdxAcc = doc.createAccessor('PoleIdx').setType('SCALAR').setArray(pole.indices);

  const polePrimitive = doc.createPrimitive()
    .setAttribute('POSITION', polePosAcc)
    .setAttribute('NORMAL', poleNormAcc)
    .setAttribute('TEXCOORD_0', poleUVAcc)
    .setIndices(poleIdxAcc)
    .setMaterial(connectorMat);

  const poleMesh = doc.createMesh('ConnectorPole').addPrimitive(polePrimitive);

  // ─── Create connector dot (small sphere at pizza surface) ───
  const dotMat = doc.createMaterial('DotMaterial')
    .setBaseColorFactor([0.788, 0.663, 0.431, 1.0]) // solid gold
    .setRoughnessFactor(0.3)
    .setMetallicFactor(0.9)
    .setEmissiveFactor([0.4, 0.3, 0.15]); // subtle glow

  const sphere = createSphereGeometry(0.006, 12, 8);

  const sphPosAcc = doc.createAccessor('SphPos').setType('VEC3').setArray(sphere.positions);
  const sphNormAcc = doc.createAccessor('SphNorm').setType('VEC3').setArray(sphere.normals);
  const sphUVAcc = doc.createAccessor('SphUV').setType('VEC2').setArray(sphere.uvs);
  const sphIdxAcc = doc.createAccessor('SphIdx').setType('SCALAR').setArray(sphere.indices);

  const sphPrimitive = doc.createPrimitive()
    .setAttribute('POSITION', sphPosAcc)
    .setAttribute('NORMAL', sphNormAcc)
    .setAttribute('TEXCOORD_0', sphUVAcc)
    .setIndices(sphIdxAcc)
    .setMaterial(dotMat);

  const dotMesh = doc.createMesh('ConnectorDot').addPrimitive(sphPrimitive);

  // ─── Position everything in the scene ───
  const scene = doc.getRoot().listScenes()[0];

  // Connector dot — on pizza surface, slightly to the right
  const dotNode = doc.createNode('ConnectorDot')
    .setMesh(dotMesh)
    .setTranslation([0.08, 0.015, 0.08]);
  scene.addChild(dotNode);

  // Connector pole — from pizza surface up
  const poleNode = doc.createNode('ConnectorPole')
    .setMesh(poleMesh)
    .setTranslation([0.08, 0.015, 0.08]);
  scene.addChild(poleNode);

  // Info card — perfectly vertical above pole, no tilt, no rotation
  const cardNode = doc.createNode('InfoCard')
    .setMesh(cardMesh)
    .setTranslation([0.08, 0.015 + poleHeight + cardH / 2 + 0.005, 0.08]);
  scene.addChild(cardNode);

  // ─── Export combined GLB ───
  console.log('📦 Exporting combined GLB...');
  const glb = await io.writeBinary(doc);
  writeFileSync(OUTPUT_GLB, Buffer.from(glb));

  const sizeMB = (glb.byteLength / 1024 / 1024).toFixed(2);
  console.log(`✅ Done! Saved to public/models/pizza-ar.glb (${sizeMB} MB)`);
  console.log('   → Info card baked as 3D textured plane');
  console.log('   → Gold connector pole + dot');
  console.log('   → Will show in Scene Viewer, Quick Look, and WebXR');
}

// Quaternion from euler angles (degrees)
function quaternionFromEuler(xDeg, yDeg, zDeg) {
  const toRad = Math.PI / 180;
  const x = xDeg * toRad / 2;
  const y = yDeg * toRad / 2;
  const z = zDeg * toRad / 2;

  const cx = Math.cos(x), sx = Math.sin(x);
  const cy = Math.cos(y), sy = Math.sin(y);
  const cz = Math.cos(z), sz = Math.sin(z);

  return [
    sx * cy * cz - cx * sy * sz,
    cx * sy * cz + sx * cy * sz,
    cx * cy * sz - sx * sy * cz,
    cx * cy * cz + sx * sy * sz,
  ];
}

// Multiply two quaternions [x,y,z,w]
function multiplyQuaternions(a, b) {
  return [
    a[3]*b[0] + a[0]*b[3] + a[1]*b[2] - a[2]*b[1],
    a[3]*b[1] - a[0]*b[2] + a[1]*b[3] + a[2]*b[0],
    a[3]*b[2] + a[0]*b[1] - a[1]*b[0] + a[2]*b[3],
    a[3]*b[3] - a[0]*b[0] - a[1]*b[1] - a[2]*b[2],
  ];
}

main().catch(console.error);
