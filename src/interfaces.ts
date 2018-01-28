export interface RecentCommitData {
  commitHash: string;
  commitMessage: string;
}

export interface BsTag {
  name: string;
  commitMessage: string;
  commitHash: string;
}

export interface BsPackage {
  name: string;
  currentVersion: string;
  packageDotJsonSpecifiedPackage?: SpecifiedBsPackage;
  tags: BsTag[];
  tagIndexForPackageDotJsonPackageVersion?: number;
  packageVersionSelector: PackageVersionSelectorType;
  selectedTagIndex: number;
  upgradeTagIndex: number;
  selectedBranchName: string;
  specifiedCommitHash: string;
  versionComparison: PackageVersionComparisonType;
  defaultChanged: boolean;
}

export interface SpecifiedBsPackage {
  name: string;
  version: string;
}

export interface SBPMap<T extends SpecifiedBsPackage> {
  [bsPackageName: string]: T;
}
export type SpecifiedBsPackageMap = SBPMap<SpecifiedBsPackage> | {};

export class PackageVersionSelectorType {
  static Tag = 'tag';
  static Branch = 'branch';
  static Commit = 'commitMessage';
  static PackageDotJsonVersion = 'packageDotJsonVersion';
  static Current = 'current';
}
Object.freeze(PackageVersionSelectorType);

export class PackageVersionComparisonType {
  static VersionsEqual = 'equal';
  static CurrentIsNewer = 'currentNewer';
  static SpecifiedIsNewer = 'specifiedNewer';
  static CurrentNotTagged = 'currentNotTagged';
}
Object.freeze(PackageVersionComparisonType);
