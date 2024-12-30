// manual-test/test-aab.ts
import { analyzePackage } from '../src';
import path from 'path';

async function test() {
    try {
        // Assuming your AAB is in the same directory as this script
        const aabPath = path.join(__dirname, 'test.aab');
        console.log('Testing AAB:', aabPath);
        console.log('Starting analysis...\n');

        const result = await analyzePackage(aabPath);

        console.log('Analysis Result:');
        console.log('----------------');
        console.log('Package Name:', result.packageName);
        console.log('Version:', result.versionName);
        console.log('Version Code:', result.versionCode);
        console.log('Min Android Version:', result.minOsVersion);
        console.log('Platform:', result.platform);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();