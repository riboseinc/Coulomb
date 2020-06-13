import { SettingManager } from '../../../settings/main';
import { FilesystemWrapper } from '../../main/fs-wrapper';
import { BackendClass as BaseBackendClass, BackendStatusReporter as BaseBackendStatusReporter, VersionedFilesystemBackend, ModelManager, FilesystemManager } from '../../main/base';
import { BackendDescription, BackendStatus } from '../base';
interface FixedBackendOptions {
    workDir: string;
    corsProxyURL: string;
    upstreamRepoURL?: string;
    fsWrapperClass: new (baseDir: string) => FilesystemWrapper<any>;
}
interface ConfigurableBackendOptions {
    repoURL: string;
    username: string;
    authorName: string;
    authorEmail: string;
}
declare type BackendOptions = FixedBackendOptions & ConfigurableBackendOptions & {
    fsWrapper: FilesystemWrapper<any>;
};
declare type InitialBackendOptions = FixedBackendOptions & Partial<ConfigurableBackendOptions>;
declare type BackendStatusReporter = BaseBackendStatusReporter<BackendStatus>;
declare class Backend extends VersionedFilesystemBackend {
    private opts;
    private reportBackendStatus;
    private git;
    private fs;
    private managers;
    constructor(opts: BackendOptions, reportBackendStatus: BackendStatusReporter);
    getLocalFilesystemPath(id: string): Promise<string>;
    describe(): Promise<BackendDescription>;
    static registerSettingsForConfigurableOptions(settings: SettingManager, initialOptions: InitialBackendOptions, dbID: string): void;
    static completeOptionsFromSettings(settings: SettingManager, availableOptions: InitialBackendOptions, dbID: string): Promise<{
        workDir: string;
        corsProxyURL: string;
        upstreamRepoURL: string | undefined;
        fsWrapperClass: new (baseDir: string) => FilesystemWrapper<any>;
        fsWrapper: FilesystemWrapper<any>;
        repoURL: string;
        username: string;
        authorName: string;
        authorEmail: string;
    }>;
    registerManager(manager: FilesystemManager & ModelManager<any, any, any>): Promise<void>;
    init(forceReset?: boolean): Promise<void>;
    read(objID: string, metaFields?: string[]): Promise<object>;
    readVersion(objID: string, version: string): Promise<any>;
    create<O extends Record<string, any>>(obj: O, objPath: string, metaFields?: (keyof O)[]): Promise<void>;
    commit(objIDs: string[], message: string, removing?: boolean): Promise<void>;
    discard(objIDs: string[]): Promise<void>;
    listUncommitted(): Promise<string[]>;
    listIDs(query: {
        subdir: string;
    }): Promise<string[]>;
    getIndex(subdir: string, idField: string, onlyIDs?: string[], metaFields?: string[]): Promise<Record<string, any>>;
    update(objID: string, newData: Record<string, any>, metaFields?: string[]): Promise<void>;
    delete(objID: string): Promise<void>;
    resetOrphanedFileChanges(): Promise<void>;
    private readUncommittedFileInfo;
    private getRef;
    private synchronize;
    private checkUncommitted;
    setUpIPC(dbID: string): void;
}
export declare const BackendClass: BaseBackendClass<InitialBackendOptions, BackendOptions, BackendStatus>;
export default Backend;
