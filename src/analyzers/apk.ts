import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';
import * as fs from 'fs';

export class ApkAnalyzer implements PackageAnalyzer {
    private ApkParser: any;

    constructor() {
        try {
            this.ApkParser = require('app-info-parser/src/apk');
        } catch (error) {
            throw new Error('app-info-parser module is required for APK analysis');
        }
    }

    private async convertToFile(filePath: string): Promise<File> {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const fileName = filePath.split(/[\\/]/).pop() || '';
            return new File([fileBuffer], fileName, {
                type: 'application/octet-stream',
                lastModified: new Date().getTime()
            });
        } catch (error) {
            throw new AnalysisError(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async canAnalyze(file: File | string): Promise<boolean> {
        if (!file) {
            return false;
        }

        try {
            // Convert to File if string is provided
            const fileObject = typeof file === 'string' ? await this.convertToFile(file) : file;

            // Check if file extension is .apk
            if (!fileObject.name.toLowerCase().endsWith('.apk')) {
                return false;
            }

            // Create blob from file for parser
            const blob = new Blob([await fileObject.arrayBuffer()], { type: fileObject.type });
            const parser = new this.ApkParser(blob);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(file: File | string): Promise<PackageMetadata> {
        try {
            // Convert to File if string is provided
            const fileObject = typeof file === 'string' ? await this.convertToFile(file) : file;

            // Convert File to Blob for parser
            const blob = new Blob([await fileObject.arrayBuffer()], { type: fileObject.type });
            const parser = new this.ApkParser(blob);
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