import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';
import * as fs from 'fs';

export class IpaAnalyzer implements PackageAnalyzer {
    private IpaParser: any;

    constructor() {
        try {
            this.IpaParser = require('app-info-parser/src/ipa');
        } catch (error) {
            throw new Error('app-info-parser module is required for IPA analysis');
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

            // Check if file extension is .ipa
            if (!fileObject.name.toLowerCase().endsWith('.ipa')) {
                return false;
            }

            // Create blob from file for parser
            const blob = new Blob([await fileObject.arrayBuffer()], { type: fileObject.type });
            const parser = new this.IpaParser(blob);
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
            const parser = new this.IpaParser(blob);
            const result = await parser.parse();

            if (!result.CFBundleIdentifier) {
                throw new AnalysisError('Invalid IPA: missing bundle identifier');
            }

            return {
                packageName: result.CFBundleIdentifier,
                versionCode: result.CFBundleVersion || 'unknown',
                versionName: result.CFBundleShortVersionString || 'unknown',
                minOsVersion: this.extractMinOsVersion(result),
                platform: 'ios',
                extractedAt: new Date(),
                additionalInfo: {
                    provisioningProfile: result?.mobileProvision?.Name || 'unknown'
                }
            };
        } catch (error) {
            if (error instanceof AnalysisError) {
                throw error;
            }
            throw new AnalysisError(
                `Failed to analyze IPA: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    private extractMinOsVersion(result: any): string {
        try {
            return result.MinimumOSVersion?.toString() || 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }
}