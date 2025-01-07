import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';

export class IpaAnalyzer implements PackageAnalyzer {
    private IpaParser: any;

    constructor() {
        try {
            this.IpaParser = require('app-info-parser/src/ipa');
        } catch (error) {
            throw new Error('app-info-parser module is required for IPA analysis');
        }
    }

    async canAnalyze(file: File | string): Promise<boolean> {
        if (!file) {
            return false;
        }

        try {
            // Check if file extension is .ipa
            const fileName = typeof file === 'string' ? file.split(/[\\/]/).pop() || '' : file.name;
            if (!fileName.toLowerCase().endsWith('.ipa')) {
                return false;
            }

            const parser = new this.IpaParser(file);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(file: File | string): Promise<PackageMetadata> {
        try {
            const parser = new this.IpaParser(file);
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