import * as path from "path";

export class SeedSource {

    async getSeeds() {
      const files = Deno.readDir(`${path.dirname(path.fromFileUrl(import.meta.url)).replace(/\/usr\/src/, '.')}/seeds`);
      let res = []
      for await (const f of files) {
        res.push(f.name)
      }

      return Promise.resolve(res.sort());
    }
  
    getSeedName(seed) {
      return seed.slice(0,-2)+"js";
    }
  
    getSeed(seed)  {
          return import(`./seeds/${seed}`);
    }
  }
  