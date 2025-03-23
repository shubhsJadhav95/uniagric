import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop');
    const state = searchParams.get('state');
    const soilType = searchParams.get('soilType');

    // Validate required parameters
    if (!crop || !state || !soilType) {
      return NextResponse.json(
        { error: 'Missing required parameters: crop, state, or soilType' },
        { status: 400 }
      );
    }

    // Execute Python script to get companion crop recommendations
    const scriptPath = path.join(process.cwd(), 'backend', 'scripts', 'get_companion_crops.py');
    
    const companionCrops = await new Promise<any>((resolve, reject) => {
      exec(
        `python "${scriptPath}" "${crop}" "${state}" "${soilType}"`,
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

    // Return the companion crops data
    return NextResponse.json(companionCrops, { status: 200 });
  } catch (error: any) {
    console.error('Error getting companion crops:', error);
    return NextResponse.json(
      { error: error.message || 'Error retrieving companion crops' },
      { status: 500 }
    );
  }
} 