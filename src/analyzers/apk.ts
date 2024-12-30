import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';

export class ApkAnalyzer implements PackageAnalyzer {
    private ApkParser: any;

    constructor() {
        try {
            // Use specific parser for better performance
            this.ApkParser = require('app-info-parser/src/apk');
        } catch (error) {
            console.log('Failed to load app-info-parser:', error);
            throw new Error('app-info-parser module is required for APK analysis');
        }
    }

    async canAnalyze(filePath: string): Promise<boolean> {
        if (!filePath) {
            console.log('No file path provided');
            return false;
        }

        try {
            const parser = new this.ApkParser(filePath);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(filePath: string): Promise<PackageMetadata> {
        console.log(`Analyzing APK: ${filePath}`);

        try {
            const parser = new this.ApkParser(filePath);
            const result = await parser.parse();

            console.log('Successfully parsed APK');
            console.log(result);

            if (!result.package) {
                throw new AnalysisError('Invalid APK: missing package name');
            }

            return {
                packageName: result.package,
                versionCode: result.versionCode?.toString() || 'unknown',
                versionName: result.versionName || 'unknown',
                minOsVersion: this.extractMinSdkVersion(result),
                platform: 'android',
                extractedAt: new Date()
            };
        } catch (error) {
            if (error instanceof AnalysisError) {
                throw error;
            }
            throw new AnalysisError(
                `Failed to analyze APK: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    private extractMinSdkVersion(result: any): string {
        try {
            return result.usesSdk?.minSdkVersion?.toString() || 'unknown';
        } catch (error) {
            console.log('Error extracting minSdkVersion:', error);
            return 'unknown';
        }
    }
}