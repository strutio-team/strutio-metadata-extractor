// src/analyzer-factory.ts
import { PackageAnalyzer } from './types';
import { ApkAnalyzer } from './analyzers/apk';
import { IpaAnalyzer } from './analyzers/ipa';
import { UnsupportedPackageError } from './errors';
// import { AabAnalyzer } from './analyzers/aab';

export class PackageAnalyzerFactory {
    private static analyzers: PackageAnalyzer[] = [
        new ApkAnalyzer(),
        new IpaAnalyzer(),
        // new AabAnalyzer()
    ];

    static async createAnalyzer(file: File): Promise<PackageAnalyzer> {
        console.log(`Finding analyzer for: ${file.name}`);

        for (const analyzer of this.analyzers) {
            if (await analyzer.canAnalyze(file)) {
                console.log(`Found compatible analyzer: ${analyzer.constructor.name}`);
                return analyzer;
            }
        }

        throw new UnsupportedPackageError(
            `No suitable analyzer found for file: ${file.name}`
        );
    }

    static registerAnalyzer(analyzer: PackageAnalyzer) {
        this.analyzers.push(analyzer);
        console.log(`Registered new analyzer: ${analyzer.constructor.name}`);
    }
}