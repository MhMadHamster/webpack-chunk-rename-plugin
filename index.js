class ChunsRenamePlugin {
  constructor(chunksToRename) {
    Object.keys(chunksToRename).forEach(key => {
      this[key] = chunksToRename[key]
    });
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("ChunkNamePlugin", (compilation, { normalModuleFactory }) => {
      compilation.chunkTemplate.hooks.renderManifest.tap("ChunkNamePlugin", (result, options) => {
        const chunk = options.chunk;
        const outputOptions = options.outputOptions;
        const chunksToRename = Object.keys(this);

        if (this.withEntry && chunk.hasEntryModule()) {
          chunk.filenameTemplate = typeof this.withEntry === "boolean" ? outputOptions.filename : this.withEntry;
        }
        if (this.async && !chunk.isOnlyInitial()) {
          chunk.filenameTemplate = this.async;
          console.log(chunk.filenameTemplate);
        }
        if (this.hasOwnProperty(chunk.name) && typeof this[chunk.name] === "string") {
          chunk.filenameTemplate = this[chunk.name];
        }
      });
    });
  }
}

module.exports = ChunsRenamePlugin;
