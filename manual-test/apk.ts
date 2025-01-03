import path from 'path';
import { analyzePackage } from '../src';
// npx ts-node manual-test/apk.ts
async function test() {
    try {
        const apkPath = path.join(__dirname, 'test.apk');  // make sure to put an APK file here
        console.log('Testing APK:', apkPath);
        console.log('Starting analysis...\n');

        // const result = await analyzePackage(apkPath);

        // console.log('Analysis Result:');
        // console.log('----------------');
        // console.log('Package Name:', result.packageName);
        // console.log('Version Name:', result.versionName);
        // console.log('Version Code:', result.versionCode);
        // console.log('Min OS:', result.minOsVersion);
    } catch (error) {
        console.error('Error:', error);
    }
}


test();