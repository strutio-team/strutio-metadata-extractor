// src/analyzers/ipa.ts
import { PackageAnalyzer, PackageMetadata } from '../types';
import { AnalysisError } from '../errors';

export class IpaAnalyzer implements PackageAnalyzer {
    private IpaParser: any;

    constructor() {
        try {
            // Use specific parser for better performance
            this.IpaParser = require('app-info-parser/src/ipa');
        } catch (error) {
            console.log('Failed to load app-info-parser:', error);
            throw new Error('app-info-parser module is required for IPA analysis');
        }
    }

    async canAnalyze(filePath: string): Promise<boolean> {
        if (!filePath) {
            console.log('No file path provided');
            return false;
        }

        try {
            const parser = new this.IpaParser(filePath);
            await parser.parse();
            return true;
        } catch (error) {
            return false;
        }
    }

    async analyze(filePath: string): Promise<PackageMetadata> {
        console.log(`Analyzing IPA: ${filePath}`);

        try {
            const parser = new this.IpaParser(filePath);
            const result = await parser.parse();

            console.log('Successfully parsed IPA');
            console.log(result);
            if (!result.CFBundleIdentifier) {
                throw new AnalysisError('Invalid IPA: missing bundle identifier');
            }

            return {
                packageName: result.CFBundleIdentifier,
                versionCode: result.CFBundleVersion || 'unknown',
                versionName: result.CFBundleShortVersionString || 'unknown',
                minOsVersion: this.extractMinOsVersion(result),
                platform: 'ios',
                extractedAt: new Date()
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
            console.log('Error extracting MinimumOSVersion:', error);
            return 'unknown';
        }
    }
}