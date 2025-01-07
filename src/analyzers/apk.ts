import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';

export class ApkAnalyzer implements PackageAnalyzer {
    private ApkParser: any;

    constructor() {
        try {
            this.ApkParser = require('app-info-parser/src/apk');
        } catch (error) {
            throw new Error('app-info-parser module is required for APK analysis');
        }
    }

    async canAnalyze(file: File | string): Promise<boolean> {
        if (!file) {
            return false;
        }

        try {
            // Check if file extension is .apk
            const fileName = typeof file === 'string' ? file.split(/[\\/]/).pop() || '' : file.name;
            if (!fileName.toLowerCase().endsWith('.apk')) {
                return false;
            }

            const parser = new this.ApkParser(file);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(file: File | string): Promise<PackageMetadata> {
        try {
            const parser = new this.ApkParser(file);
            const result = await parser.parse();

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
            return 'unknown';
        }
    }
}