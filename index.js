class ChunksRenamePlugin {
  constructor(chunksToRename = {}) {
    Object.keys(chunksToRename).forEach(key => {
      this[key] = chunksToRename[key]
    });
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("ChunksRenamePlugin", (compilation, { normalModuleFactory }) => {
      compilation.chunkTemplate.hooks.renderManifest.tap("ChunksRenamePlugin", (result, options) => {
        const chunk = options.chunk;
        const outputOptions = options.outputOptions;

        if (this.initialChunksWithEntry && chunk.hasEntryModule() && chunk.isOnlyInitial()) {
          chunk.filenameTemplate = typeof this.initialChunksWithEntry === "boolean" ? outputOptions.filename : this.initialChunksWithEntry;
        }
        if (this.asyncChunks && !chunk.isOnlyInitial()) {
          chunk.filenameTemplate = this.asyncChunks;
        }
        if (this.hasOwnProperty(chunk.name) && typeof this[chunk.name] === "string") {
          chunk.filenameTemplate = this[chunk.name];
        }
      });
    });
  }
}

module.exports = ChunksRenamePlugin;
