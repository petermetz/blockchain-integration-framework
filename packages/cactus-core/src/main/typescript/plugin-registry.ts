import ReactiveMembrane from "observable-membrane";
import { ReactiveMembraneMutationCallback } from "observable-membrane/dist/types/reactive-membrane";
import { Optional } from "typescript-optional";

import {
  ICactusPlugin,
  IPluginKeychain,
  isICactusPlugin,
  PluginAspect,
} from "@hyperledger/cactus-core-api";

import {
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

/**
 * This interface describes the constructor options object that can be used to provide configuration parameters to
 * the `PluginRegistry` class instances.
 */
export interface IPluginRegistryOptions {
  plugins?: ICactusPlugin[];
  membrane?: ReactiveMembrane;
  logLevel?: LogLevelDesc;
}

/**
 * The plugin registry exists so that plugins can use other plugins as their dependencies in a convenient way where
 * we can pass around the plugin registry itself as a simplified and not overly opinionated inversion of control
 * container.
 * Did consider using libraries made for this specific purpose but they are quite heavy handed and usually require
 * decorators on classes. Also, they do not work with interfaces so we also intend to avoid being forced to use actual
 * classes in place of the interfaces currently describing the plugin architecture.
 */
export class PluginRegistry {
  public readonly log: Logger;
  public readonly plugins: ICactusPlugin[];
  public readonly membrane: ReactiveMembrane;

  constructor(public readonly options: IPluginRegistryOptions = {}) {
    const fnTag = "PluginRegistry#constructor()";
    if (!options) {
      throw new TypeError(`${fnTag} options falsy`);
    }
    if (options.plugins && !Array.isArray(options.plugins)) {
      throw new TypeError(`${fnTag} options.plugins truthy but non-Array`);
    }

    this.plugins = options.plugins || [];

    const level = this.options.logLevel || "INFO";
    const loggerOptions = { label: "plugin-registry", level };
    this.log = LoggerProvider.getOrCreate(loggerOptions);

    const valueMutated: ReactiveMembraneMutationCallback = (
      obj: any,
      key: PropertyKey
    ) => {
      this.log.debug(`ReactiveMembraneMutationCallback %o => %o`, obj, key);
    };

    this.membrane = options.membrane || new ReactiveMembrane({ valueMutated });
  }

  public getPlugins(): ICactusPlugin[] {
    return this.plugins;
  }

  /**
   * The main difference between this method and `findOneByPackageName` is that this throws an Error if there was nothing to
   * return. It is recommended to use this method over `findOneByPackageName` if you have a hard dependency on a certain
   * plugin being loaded for your code.
   *
   * @param packageName The package name of the plugin that you are looking to obtain an instance of from the registry.
   * @throws If there is no plugin in the registry by the package name specificed.
   */
  public getOneById<T extends ICactusPlugin>(packageName: string): T {
    return this.findOneByPackageName(packageName).orElseThrow(
      () => new Error(`Plugin ${packageName} not present in registry`)
    ) as T;
  }

  public getOneByAspect<T extends ICactusPlugin>(aspect: PluginAspect): T {
    return this.findOneByAspect(aspect).orElseThrow(
      () => new Error(`No plugin with aspect: ${aspect}`)
    ) as T;
  }

  public findOneByPackageName<T extends ICactusPlugin>(
    packageName: string
  ): Optional<T> {

    const plugin = this.getPlugins().find(
      (p) => p.getPackageName() === packageName
    );

    if (plugin) {
      const pluginProxy = this.membrane.getReadOnlyProxy(plugin) as T;
      return Optional.ofNullable(pluginProxy);
    } else {
      return Optional.empty();
    }
  }

  public findManyByPackageName<T extends ICactusPlugin>(
    packageName: string
  ): T[] {
    return this.getPlugins().filter(
      (p) => p.getPackageName() === packageName
    )
      .map((p) => this.membrane.getReadOnlyProxy(p)) as T[];
  }

  public findOneByAspect<T extends ICactusPlugin>(
    aspect: PluginAspect
  ): Optional<T> {
    const plugin = this.getPlugins().find((p) => p.getAspect() === aspect);
    if (plugin) {
      const pluginProxy = this.membrane.getReadOnlyProxy(plugin) as T;
      return Optional.ofNullable(pluginProxy);
    } else {
      return Optional.empty();
    }
  }

  public findOneByKeychainId<T extends IPluginKeychain>(keychainId: string): T {
    const fnTag = "PluginRegistry#findOneByKeychainId()";
    if (typeof keychainId !== "string" || keychainId.trim().length < 1) {
      throw new Error(`${fnTag} need keychainId arg as non-blank string.`);
    }

    const plugin = this.findManyByAspect<IPluginKeychain>(
      PluginAspect.KEYCHAIN
    ).find((keychainPlugin) => keychainPlugin.getKeychainId() === keychainId);

    return Optional.ofNullable(plugin as T).orElseThrow(
      () => new Error(`${fnTag} No keychain found for ID ${keychainId}`)
    );
  }

  public findManyByAspect<T extends ICactusPlugin>(aspect: PluginAspect): T[] {
    return this.getPlugins()
      .filter((p) => p.getAspect() === aspect)
      .map((p) => this.membrane.getReadOnlyProxy(p) as T);
  }

  public hasByAspect(aspect: PluginAspect): boolean {
    return this.findOneByAspect(aspect).isPresent();
  }

  public hasByPackageName(packageName: string): boolean {
    return this.findOneByPackageName(packageName).isPresent();
  }

  public deleteByPackageName(packageName: string): [number] {
    let deleteCount: number = 0;
    this.plugins.forEach((p, i) => {
      if (p.getPackageName() === packageName) {
        this.plugins.splice(i, 1);
        deleteCount++;
      }
    });
    return [deleteCount];
  }

  public add(
    plugin: ICactusPlugin,
    replaceOnConflict: boolean = false
  ): [number] {
    if (!isICactusPlugin(plugin)) {
      throw new Error(`PluginRegistry#add() plugin not an ICactusPlugin`);
    }
    const pkgName = plugin.getPackageName();
    const hasConfclit = this.hasByPackageName(pkgName);
    if (hasConfclit && !replaceOnConflict) {
      throw new Error(`PluginRegistry#add() already have plugin: ${pkgName}`);
    }
    let deleteCount: number = 0;
    if (replaceOnConflict) {
      [deleteCount] = this.deleteByPackageName(plugin.getPackageName());
    }
    this.getPlugins().push(plugin);
    return [deleteCount];
  }
}
