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

    async canAnalyze(file: File): Promise<boolean> {
        if (!file) {
            console.log('No file provided');
            return false;
        }

        try {
            // Check if file extension is .apk
            if (!file.name.toLowerCase().endsWith('.apk')) {
                return false;
            }

            // Create blob from file for parser
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            const parser = new this.ApkParser(blob);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(file: File): Promise<PackageMetadata> {
        console.log(`Analyzing APK: ${file.name}`);

        try {
            // Convert File to Blob for parser
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            const parser = new this.ApkParser(blob);
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