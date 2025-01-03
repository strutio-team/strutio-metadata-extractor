// import { PackageAnalyzer, PackageMetadata } from '../types';
// import { AnalysisError } from '../errors';
//  az
// interface AabManifest {
//     compiledSdkVersion: any;
//     compiledSdkVersionCodename: any;
//     minSdkVersion: any;
//     targetSdkVersion: any;
//     versionCode: any;
//     verionName: string;
//     packageName: any;
//     permissions: any;
// }

// export class AabAnalyzer implements PackageAnalyzer {
//     constructor() {
//         try {
//             require('child_process').execSync('java -version');
//         } catch (error) {
//             throw new Error('Java JDK 8+ is required for AAB analysis');
//         }
//     }

//     async canAnalyze(filePath: string): Promise<boolean> {
//         if (!filePath) {
//             console.log('No file path provided');
//             return false;
//         }

//         try {
//             await readManifest(filePath);
//             return true;
//         } catch (error) {
//             return false;
//         }
//     }

//     async analyze(filePath: string): Promise<PackageMetadata> {
//         console.log(`Analyzing AAB: ${filePath}`);

//         try {
//             const manifest = await readManifest(filePath) as AabManifest;
//             console.log('Successfully parsed AAB manifest');
//             console.log(manifest);

//             if (!manifest.packageName) {
//                 throw new AnalysisError('Invalid AAB: missing package name');
//             }

//             return {
//                 packageName: manifest.packageName,
//                 versionCode: manifest.versionCode?.toString() || 'unknown',
//                 versionName: manifest.verionName || 'unknown',
//                 minOsVersion: manifest.minSdkVersion?.toString() || 'unknown',
//                 platform: 'android',
//                 extractedAt: new Date(),
//             };
//         } catch (error) {
//             if (error instanceof AnalysisError) {
//                 throw error;
//             }
//             throw new AnalysisError(
//                 `Failed to analyze AAB: ${error instanceof Error ? error.message : String(error)}`
//             );
//         }
//     }
// }