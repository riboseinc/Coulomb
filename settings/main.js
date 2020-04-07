import * as path from 'path';
import * as fs from 'fs-extra';
import * as log from 'electron-log';
import { ipcMain } from 'electron';
import { listen } from '../ipc/main';
import { default as YAMLWrapper } from '../db/isogit-yaml/main/yaml/file';
export class Setting {
    constructor(paneID, 
    /* ID of the pane to show the setting under. */
    id, 
    /* Setting ID should be unique across all settings. */
    input, 
    /* Determines input widget shown by default. */
    required, 
    /* Indicates whether the setting is required for app operation. */
    label, 
    /* Setting label shown to the user should be unique within given pane,
       to avoid confusion. */
    helpText) {
        this.paneID = paneID;
        this.id = id;
        this.input = input;
        this.required = required;
        this.label = label;
        this.helpText = helpText;
    }
    toUseable(val) { return val; }
    /* Converts stored setting value to useable object. */
    toStoreable(val) { return val; }
}
export class SettingManager {
    constructor(appDataPath, settingsFileName) {
        this.appDataPath = appDataPath;
        this.settingsFileName = settingsFileName;
        this.registry = [];
        this.panes = [];
        this.data = null;
        this.settingsPath = path.join(appDataPath, `${settingsFileName}.yaml`);
        log.debug(`C/settings: Configuring w/path ${this.settingsPath}`);
        this.yaml = new YAMLWrapper(appDataPath);
    }
    async listMissingRequiredSettings() {
        var requiredSettingIDs = [];
        for (const setting of this.registry) {
            if (setting.required == true && (await this.getValue(setting.id)) === undefined) {
                requiredSettingIDs.push(setting.id);
            }
        }
        return requiredSettingIDs;
    }
    async getValue(id) {
        const setting = this.get(id);
        if (setting) {
            if (this.data === null) {
                let settingsFileExists;
                try {
                    settingsFileExists = (await fs.stat(this.settingsPath)).isFile();
                }
                catch (e) {
                    settingsFileExists = false;
                }
                if (settingsFileExists) {
                    this.data = (await this.yaml.read(this.settingsFileName)) || {};
                }
                else {
                    this.data = {};
                }
            }
            const rawVal = this.data[id];
            return rawVal !== undefined ? setting.toUseable(rawVal) : undefined;
        }
        else {
            log.warn(`C/settings: Attempted to get value for non-existent setting ${id}`);
            throw new Error(`Setting to get value for is not found: ${id}`);
        }
    }
    async setValue(id, val) {
        // DANGER: Never log setting’s val in raw form
        log.debug(`C/settings: Set value for setting ${id}`);
        const setting = this.get(id);
        if (setting) {
            const storeable = setting.toStoreable(val);
            this.data[id] = storeable;
            await this.commit();
        }
        else {
            throw new Error(`Setting to set value for is not found: ${id}`);
        }
    }
    async deleteValue(id) {
        log.debug(`C/settings: Delete setting: ${id}`);
        delete this.data[id];
        await this.commit();
    }
    async commit() {
        log.info("C/settings: Commit new settings");
        log.debug("C/settings: Commit: Remove file");
        await fs.remove(this.settingsPath);
        log.debug("C/settings: Commit: Write new file");
        await this.yaml.write(this.settingsFileName, this.data);
    }
    get(id) {
        return this.registry.find(s => s.id === id);
    }
    register(setting) {
        log.debug("C/settings: Register setting");
        if (this.panes.find(p => p.id === setting.paneID)) {
            this.registry.push(setting);
        }
        else {
            throw new Error("Invalid pane ID");
        }
    }
    configurePane(pane) {
        this.panes.push(pane);
    }
    setUpIPC() {
        log.verbose("C/settings: Register API endpoints");
        listen('settingPaneList', async () => {
            return { panes: this.panes };
        });
        listen('settingList', async () => {
            return { settings: this.registry };
        });
        listen('settingValue', async ({ name }) => {
            return await this.getValue(name);
        });
        listen('commitSetting', async ({ name, value }) => {
            await this.setValue(name, value);
            return { success: true };
        });
        ipcMain.on('set-setting', async (evt, name, value) => {
            return await this.setValue(name, value);
        });
        ipcMain.on('get-setting', async (evt, name) => {
            const value = await this.getValue(name);
            evt.reply('get-setting', name, value);
        });
        ipcMain.on('clear-setting', async (evt, name) => {
            log.debug(`C/settings: received clear-setting request for ${name}`);
            await this.deleteValue(name);
            evt.reply('clear-setting', 'ok');
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXR0aW5ncy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sS0FBSyxHQUFHLE1BQU0sY0FBYyxDQUFDO0FBRXBDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVyQyxPQUFPLEVBQUUsT0FBTyxJQUFJLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBVTFFLE1BQU0sT0FBTyxPQUFPO0lBQ2xCLFlBRVMsTUFBYztJQUNyQiwrQ0FBK0M7SUFFeEMsRUFBVTtJQUNqQixzREFBc0Q7SUFFL0MsS0FBd0I7SUFDL0IsK0NBQStDO0lBRXhDLFFBQWlCO0lBQ3hCLGtFQUFrRTtJQUUzRCxLQUFhO0lBQ3BCOzZCQUN5QjtJQUVsQixRQUFpQjtRQWhCakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUdkLE9BQUUsR0FBRixFQUFFLENBQVE7UUFHVixVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUd4QixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBR2pCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFJYixhQUFRLEdBQVIsUUFBUSxDQUFTO0lBRXZCLENBQUM7SUFFSixTQUFTLENBQUMsR0FBWSxJQUFPLE9BQU8sR0FBUSxDQUFBLENBQUMsQ0FBQztJQUM5QyxzREFBc0Q7SUFFdEQsV0FBVyxDQUFDLEdBQU0sSUFBUyxPQUFPLEdBQVUsQ0FBQSxDQUFDLENBQUM7Q0FHL0M7QUFHRCxNQUFNLE9BQU8sY0FBYztJQU96QixZQUFtQixXQUFtQixFQUFTLGdCQUF3QjtRQUFwRCxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUFTLHFCQUFnQixHQUFoQixnQkFBZ0Is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LEtBQUssRUFBRSxHQUFRLEVBQUUsSUFBWSxFQUFFLEVBQUU7WUFDekQsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxHQUFRLEVBQUUsSUFBWSxFQUFFLEVBQUU7WUFDM0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxrREFBa0QsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUVwRSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJ2VsZWN0cm9uLWxvZyc7XG5cbmltcG9ydCB7IGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBsaXN0ZW4gfSBmcm9tICcuLi9pcGMvbWFpbic7XG5cbmltcG9ydCB7IGRlZmF1bHQgYXMgWUFNTFdyYXBwZXIgfSBmcm9tICcuLi9kYi9pc29naXQteWFtbC9tYWluL3lhbWwvZmlsZSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBQYW5lIHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgaWNvbj86IHN0cmluZztcbn1cblxuXG5leHBvcnQgY2xhc3MgU2V0dGluZzxUPiB7XG4gIGNvbnN0cnVjdG9yKFxuXG4gICAgcHVibGljIHBhbmVJRDogc3RyaW5nLFxuICAgIC8qIElEIG9mIHRoZSBwYW5lIHRvIHNob3cgdGhlIHNldHRpbmcgdW5kZXIuICovXG5cbiAgICBwdWJsaWMgaWQ6IHN0cmluZyxcbiAgICAvKiBTZXR0aW5nIElEIHNob3VsZCBiZSB1bmlxdWUgYWNyb3NzIGFsbCBzZXR0aW5ncy4gKi9cblxuICAgIHB1YmxpYyBpbnB1dDogJ3RleHQnIHwgJ251bWJlcicsXG4gICAgLyogRGV0ZXJtaW5lcyBpbnB1dCB3aWRnZXQgc2hvd24gYnkgZGVmYXVsdC4gKi9cblxuICAgIHB1YmxpYyByZXF1aXJlZDogYm9vbGVhbixcbiAgICAvKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2V0dGluZyBpcyByZXF1aXJlZCBmb3IgYXBwIG9wZXJhdGlvbi4gKi9cblxuICAgIHB1YmxpYyBsYWJlbDogc3RyaW5nLFxuICAgIC8qIFNldHRpbmcgbGFiZWwgc2hvd24gdG8gdGhlIHVzZXIgc2hvdWxkIGJlIHVuaXF1ZSB3aXRoaW4gZ2l2ZW4gcGFuZSxcbiAgICAgICB0byBhdm9pZCBjb25mdXNpb24uICovXG5cbiAgICBwdWJsaWMgaGVscFRleHQ/OiBzdHJpbmcsXG5cbiAgKSB7fVxuXG4gIHRvVXNlYWJsZSh2YWw6IHVua25vd24pOiBUIHsgcmV0dXJuIHZhbCBhcyBUIH1cbiAgLyogQ29udmVydHMgc3RvcmVkIHNldHRpbmcgdmFsdWUgdG8gdXNlYWJsZSBvYmplY3QuICovXG5cbiAgdG9TdG9yZWFibGUodmFsOiBUKTogYW55IHsgcmV0dXJuIHZhbCBhcyBhbnkgfVxuICAvKiBDb252ZXJ0cyBKUy9UUyBvYmplY3QgdG8gc3RvcmVhYmxlIHZlcnNpb24gb2YgdGhlIHNldHRpbmcuICovXG5cbn1cblxuXG5leHBvcnQgY2xhc3MgU2V0dGluZ01hbmFnZXIge1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBTZXR0aW5nPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIHBhbmVzOiBQYW5lW10gPSBbXTtcbiAgcHJpdmF0ZSBkYXRhOiBhbnkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB5YW1sOiBZQU1MV3JhcHBlcjtcbiAgcHJpdmF0ZSBzZXR0aW5nc1BhdGg6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwRGF0YVBhdGg6IHN0cmluZywgcHVibGljIHNldHRpbmdzRmlsZU5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2V0dGluZ3NQYXRoID0gcGF0aC5qb2luKGFwcERhdGFQYXRoLCBgJHtzZXR0aW5nc0ZpbGVOYW1lfS55YW1sYCk7XG4gICAgbG9nLmRlYnVnKGBDL3NldHRpbmdzOiBDb25maWd1cmluZyB3L3BhdGggJHt0aGlzLnNldHRpbmdzUGF0aH1gKTtcblxuICAgIHRoaXMueWFtbCA9IG5ldyBZQU1MV3JhcHBlcihhcHBEYXRhUGF0aCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbGlzdE1pc3NpbmdSZXF1aXJlZFNldHRpbmdzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICB2YXIgcmVxdWlyZWRTZXR0aW5nSURzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2V0dGluZyBvZiB0aGlzLnJlZ2lzdHJ5KSB7XG4gICAgICBpZiAoc2V0dGluZy5yZXF1aXJlZCA9PSB0cnVlICYmIChhd2FpdCB0aGlzLmdldFZhbHVlKHNldHRpbmcuaWQpKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlcXVpcmVkU2V0dGluZ0lEcy5wdXNoKHNldHRpbmcuaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVxdWlyZWRTZXR0aW5nSURzO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFZhbHVlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICBjb25zdCBzZXR0aW5nID0gdGhpcy5nZXQoaWQpO1xuXG4gICAgaWYgKHNldHRpbmcpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzRmlsZUV4aXN0czogYm9vbGVhbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXR0aW5nc0ZpbGVFeGlzdHMgPSAoYXdhaXQgZnMuc3RhdCh0aGlzLnNldHRpbmdzUGF0aCkpLmlzRmlsZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgc2V0dGluZ3NGaWxlRXhpc3RzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzRmlsZUV4aXN0cykge1xuICAgICAgICAgIHRoaXMuZGF0YSA9IChhd2FpdCB0aGlzLnlhbWwucmVhZCh0aGlzLnNldHRpbmdzRmlsZU5hbWUpKSB8fCB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmF3VmFsID0gdGhpcy5kYXRhW2lkXTtcbiAgICAgIHJldHVybiByYXdWYWwgIT09IHVuZGVmaW5lZCA/IHNldHRpbmcudG9Vc2VhYmxlKHJhd1ZhbCkgOiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGBDL3NldHRpbmdzOiBBdHRlbXB0ZWQgdG8gZ2V0IHZhbHVlIGZvciBub24tZXhpc3RlbnQgc2V0dGluZyAke2lkfWApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXR0aW5nIHRvIGdldCB2YWx1ZSBmb3IgaXMgbm90IGZvdW5kOiAke2lkfWApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShpZDogc3RyaW5nLCB2YWw6IHVua25vd24pIHtcbiAgICAvLyBEQU5HRVI6IE5ldmVyIGxvZyBzZXR0aW5n4oCZcyB2YWwgaW4gcmF3IGZvcm1cblxuICAgIGxvZy5kZWJ1ZyhgQy9zZXR0aW5nczogU2V0IHZhbHVlIGZvciBzZXR0aW5nICR7aWR9YCk7XG5cbiAgICBjb25zdCBzZXR0aW5nID0gdGhpcy5nZXQoaWQpO1xuICAgIGlmIChzZXR0aW5nKSB7XG4gICAgICBjb25zdCBzdG9yZWFibGUgPSBzZXR0aW5nLnRvU3RvcmVhYmxlKHZhbCk7XG4gICAgICB0aGlzLmRhdGFbaWRdID0gc3RvcmVhYmxlO1xuICAgICAgYXdhaXQgdGhpcy5jb21taXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXR0aW5nIHRvIHNldCB2YWx1ZSBmb3IgaXMgbm90IGZvdW5kOiAke2lkfWApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkZWxldGVWYWx1ZShpZDogc3RyaW5nKSB7XG4gICAgbG9nLmRlYnVnKGBDL3NldHRpbmdzOiBEZWxldGUgc2V0dGluZzogJHtpZH1gKTtcbiAgICBkZWxldGUgdGhpcy5kYXRhW2lkXTtcbiAgICBhd2FpdCB0aGlzLmNvbW1pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjb21taXQoKSB7XG4gICAgbG9nLmluZm8oXCJDL3NldHRpbmdzOiBDb21taXQgbmV3IHNldHRpbmdzXCIpO1xuICAgIGxvZy5kZWJ1ZyhcIkMvc2V0dGluZ3M6IENvbW1pdDogUmVtb3ZlIGZpbGVcIik7XG4gICAgYXdhaXQgZnMucmVtb3ZlKHRoaXMuc2V0dGluZ3NQYXRoKTtcbiAgICBsb2cuZGVidWcoXCJDL3NldHRpbmdzOiBDb21taXQ6IFdyaXRlIG5ldyBmaWxlXCIpO1xuICAgIGF3YWl0IHRoaXMueWFtbC53cml0ZSh0aGlzLnNldHRpbmdzRmlsZU5hbWUsIHRoaXMuZGF0YSk7XG4gIH1cblxuICBwcml2YXRlIGdldChpZDogc3RyaW5nKTogU2V0dGluZzxhbnk+IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyeS5maW5kKHMgPT4gcy5pZCA9PT0gaWQpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyKHNldHRpbmc6IFNldHRpbmc8YW55Pikge1xuICAgIGxvZy5kZWJ1ZyhcIkMvc2V0dGluZ3M6IFJlZ2lzdGVyIHNldHRpbmdcIik7XG4gICAgaWYgKHRoaXMucGFuZXMuZmluZChwID0+IHAuaWQgPT09IHNldHRpbmcucGFuZUlEKSkge1xuICAgICAgdGhpcy5yZWdpc3RyeS5wdXNoKHNldHRpbmcpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFuZSBJRFwiKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlUGFuZShwYW5lOiBQYW5lKSB7XG4gICAgdGhpcy5wYW5lcy5wdXNoKHBhbmUpO1xuICB9XG5cbiAgcHVibGljIHNldFVwSVBDKCkge1xuICAgIGxvZy52ZXJib3NlKFwiQy9zZXR0aW5nczogUmVnaXN0ZXIgQVBJIGVuZHBvaW50c1wiKTtcblxuICAgIGxpc3Rlbjx7fSwgeyBwYW5lczogUGFuZVtdIH0+XG4gICAgKCdzZXR0aW5nUGFuZUxpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZXR1cm4geyBwYW5lczogdGhpcy5wYW5lcyB9O1xuICAgIH0pO1xuXG4gICAgbGlzdGVuPHt9LCB7IHNldHRpbmdzOiBTZXR0aW5nPGFueT5bXSB9PlxuICAgICgnc2V0dGluZ0xpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZXR1cm4geyBzZXR0aW5nczogdGhpcy5yZWdpc3RyeSB9O1xuICAgIH0pO1xuXG4gICAgbGlzdGVuPHsgbmFtZTogc3RyaW5nIH0sIHsgdmFsdWU6IGFueSB9PlxuICAgICgnc2V0dGluZ1ZhbHVlJywgYXN5bmMgKHsgbmFtZSB9KSA9PiB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRWYWx1ZShuYW1lKSBhcyBhbnk7XG4gICAgfSk7XG5cbiAgICBsaXN0ZW48eyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkgfSwgeyBzdWNjZXNzOiB0cnVlIH0+XG4gICAgKCdjb21taXRTZXR0aW5nJywgYXN5bmMoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnNldFZhbHVlKG5hbWUsIHZhbHVlKTtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgICB9KVxuXG4gICAgaXBjTWFpbi5vbignc2V0LXNldHRpbmcnLCBhc3luYyAoZXZ0OiBhbnksIG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0VmFsdWUobmFtZSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgaXBjTWFpbi5vbignZ2V0LXNldHRpbmcnLCBhc3luYyAoZXZ0OiBhbnksIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhd2FpdCB0aGlzLmdldFZhbHVlKG5hbWUpO1xuICAgICAgZXZ0LnJlcGx5KCdnZXQtc2V0dGluZycsIG5hbWUsIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4ub24oJ2NsZWFyLXNldHRpbmcnLCBhc3luYyAoZXZ0OiBhbnksIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgbG9nLmRlYnVnKGBDL3NldHRpbmdzOiByZWNlaXZlZCBjbGVhci1zZXR0aW5nIHJlcXVlc3QgZm9yICR7bmFtZX1gKTtcblxuICAgICAgYXdhaXQgdGhpcy5kZWxldGVWYWx1ZShuYW1lKTtcbiAgICAgIGV2dC5yZXBseSgnY2xlYXItc2V0dGluZycsICdvaycpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=