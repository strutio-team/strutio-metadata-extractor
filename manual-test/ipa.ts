import path from 'path';
import { analyzePackage } from '../src';

async function test() {
    try {
        // Assuming your IPA is in the same directory as this script
        const ipaPath = path.join(__dirname, 'test.ipa');
        console.log('Testing IPA:', ipaPath);
        console.log('Starting analysis...\n');

        // const result = await analyzePackage(ipaPath);

        // console.log('Analysis Result:');
        // console.log('----------------');
        // console.log('Bundle ID:', result.packageName);
        // console.log('Version:', result.versionName);
        // console.log('Build Number:', result.versionCode);
        // console.log('Min iOS Version:', result.minOsVersion);
        // console.log('Platform:', result.platform);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();