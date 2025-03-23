import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const cropType = searchParams.get('cropType');
    const soilType = searchParams.get('soilType');
    const areaAcres = searchParams.get('areaAcres');
    const primaryCrop = searchParams.get('primaryCrop');

    // Validate required parameters
    if (!cropType || !soilType || !areaAcres || !primaryCrop) {
      return NextResponse.json(
        { error: 'Missing required parameters: cropType, soilType, areaAcres, or primaryCrop' },
        { status: 400 }
      );
    }

    // Validate area is a number
    const area = parseFloat(areaAcres);
    if (isNaN(area)) {
      return NextResponse.json(
        { error: 'areaAcres must be a valid number' },
        { status: 400 }
      );
    }

    // Execute Python script to get planting method recommendations
    const scriptPath = path.join(process.cwd(), 'backend', 'scripts', 'suggest_planting_method.py');
    
    const plantingMethod = await new Promise<any>((resolve, reject) => {
      exec(
        `python "${scriptPath}" "${cropType}" "${soilType}" "${area}" "${primaryCrop}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            console.error(`Stderr: ${stderr}`);
            reject(error);
            return;
          }
          
          try {
            // Parse the JSON output from the Python script
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (parseError) {
            console.error(`Error parsing Python script output: ${parseError}`);
            console.error(`Output: ${stdout}`);
            reject(new Error('Invalid script output format'));
          }
        }
      );
    });

    // Return the planting method data
    return NextResponse.json(plantingMethod, { status: 200 });
  } catch (error: any) {
    console.error('Error getting planting method:', error);
    return NextResponse.json(
      { error: error.message || 'Error retrieving planting method' },
      { status: 500 }
    );
  }
} 