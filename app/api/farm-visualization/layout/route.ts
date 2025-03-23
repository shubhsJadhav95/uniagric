import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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

    // Generate a unique filename
    const filename = `farm_layout_${uuidv4()}.png`;
    const outputPath = path.join(IMAGES_DIR, filename);
    const relativePath = `/generated-images/${filename}`;

    // Prepare the Python script arguments
    const args = [
      params.crop_name,
      params.crop_type,
      params.area_acres.toString(),
      params.soil_type,
      params.state,
      params.land_shape || 'rectangle',
      params.land_ratio?.toString() || '1.5',
      params.slope || 'flat',
      params.irrigation_type || 'drip',
      params.planting_density || 'medium',
      params.road_access || 'north',
      params.equipment_size || 'medium',
      params.include_windbreaks ? 'true' : 'false',
      outputPath
    ];

    // Escape arguments for command line
    const escapedArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`);

    // Execute Python script to generate the farm layout
    const scriptPath = path.join(process.cwd(), 'backend', 'scripts', 'generate_farm_layout.py');
    
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
      throw new Error('Failed to generate farm layout image');
    }

    // Return the URL to the generated image
    return NextResponse.json({ imageUrl: relativePath }, { status: 200 });
  } catch (error: any) {
    console.error('Error in farm layout generation:', error);
    return NextResponse.json(
      { error: error.message || 'Error generating farm layout' },
      { status: 500 }
    );
  }
} 