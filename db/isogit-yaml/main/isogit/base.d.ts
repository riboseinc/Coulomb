import { GitStatus } from '../../base';
export declare class IsoGitWrapper {
    private fs;
    private repoUrl;
    private upstreamRepoUrl;
    private author;
    workDir: string;
    private corsProxy;
    private statusReporter;
    private auth;
    private pushPending;
    private stagingLock;
    private status;
    private worker;
    private getWorker;
    constructor(fs: any, repoUrl: string, upstreamRepoUrl: string | undefined, username: string, author: {
        name: string;
        email: string;
    }, workDir: string, corsProxy: string | undefined, statusReporter: (payload: GitStatus) => Promise<void>);
    private reportStatus;
    private setStatus;
    getStatus(): GitStatus;
    isInitialized(): Promise<boolean>;
    isUsingRemoteURLs(remoteUrls: {
        origin: string;
    }): Promise<boolean>;
    needsPassword(): boolean;
    getUsername(): string | undefined;
    destroy(): Promise<void>;
    private forceInitialize;
    setPassword(value: string | undefined): Promise<void>;
    configSet(prop: string, val: string): Promise<void>;
    configGet(prop: string): Promise<string>;
    readFileBlobAtCommit(relativeFilePath: string, commitHash: string): Promise<string>;
    pull(): Promise<void>;
    stage(pathSpecs: string[], removing?: boolean): Promise<void>;
    commit(msg: string): Promise<string>;
    push(): Promise<void>;
    resetFiles(paths?: string[]): Promise<void>;
    getOriginUrl(): Promise<string | null>;
    listLocalCommits(): Promise<string[]>;
    listChangedFiles(pathSpecs?: string[]): Promise<string[]>;
    stageAndCommit(pathSpecs: string[], msg: string, removing?: boolean): Promise<number>;
    checkUncommitted(): Promise<boolean>;
    requestPush(): void;
    synchronize(): Promise<void>;
    private unstageAll;
    private _handleGitError;
}
export declare function isGitError(e: Error & {
    code: string;
}): boolean;
