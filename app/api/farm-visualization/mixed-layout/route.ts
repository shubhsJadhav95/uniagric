import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define base directory for storing generated images
const IMAGES_DIR = path.join(process.cwd(), 'public', 'generated-images');

// Ensure the directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const params = await request.json();

    // Generate a unique filename using hash
    const hash = crypto.createHash('md5').update(JSON.stringify(params) + Date.now()).digest('hex');
    const filename = `mixed_farm_layout_${hash}.png`;
    const outputPath = path.join(IMAGES_DIR, filename);
    const relativePath = `/generated-images/${filename}`;

    // Prepare the Python script arguments
    const args = [
      params.crop_name,
      params.crop_type,
      params.area_acres.toString(),
      params.soil_type,
      params.state,
      JSON.stringify(params.companion_crops),
      JSON.stringify(params.planting_method),
      params.irrigation_type || 'drip',
      outputPath
    ];

    // Escape arguments for command line
    const escapedArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`);

    // Execute Python script to generate the mixed farm layout
    const scriptPath = path.join(process.cwd(), 'backend', 'scripts', 'generate_mixed_farming_layout.py');
    
    await new Promise<void>((resolve, reject) => {
      exec(
        `python "${scriptPath}" ${escapedArgs.join(' ')}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            console.error(`Stderr: ${stderr}`);
            reject(error);
            return;
          }
          console.log(`Python script output: ${stdout}`);
          resolve();
        }
      );
    });

    // Check if the file was generated
    if (!fs.existsSync(outputPath)) {
      throw new Error('Failed to generate mixed farm layout image');
    }

    // Return the URL to the generated image
    return NextResponse.json({ imageUrl: relativePath }, { status: 200 });
  } catch (error: any) {
    console.error('Error in mixed farm layout generation:', error);
    return NextResponse.json(
      { error: error.message || 'Error generating mixed farm layout' },
      { status: 500 }
    );
  }
} 