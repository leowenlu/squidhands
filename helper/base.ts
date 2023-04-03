import * as fs from 'fs';
import * as yaml from 'js-yaml';


// Define the generic type for the configuration object
interface ConfigObject<T> {
  [key: string]: T;
}

// Define the generic type for the YAML configuration file
interface ConfigFile<T> {
  [key: string]: T;
}

export class ConfigBase<T> {
  public config: ConfigObject<T>;

  constructor(configFile: string) {
    try {
      this.config = yaml.load(fs.readFileSync(configFile, 'utf8')) as ConfigFile<T>;
    } catch (e) {
      console.log(e);
    }
  }
}

