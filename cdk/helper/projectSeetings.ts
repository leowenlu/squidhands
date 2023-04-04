import { ConfigBase } from './base';

export interface ProjectConfig {
  projectName: string;
  userPoolName: string;
  userPoolClientName: string;
}

export class ProjectSettings extends ConfigBase<ProjectSettings> {
  constructor(filePath: string) {
    super(filePath);
  }
}
