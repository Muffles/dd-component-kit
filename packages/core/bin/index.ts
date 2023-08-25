// purposely adding js extensions here so the extensions stay in the output.
import { connect } from './connection.js';
import { generateServiceTypes } from './service-generator.js';
import { generateEntityType } from './entity-generator.js';
import fs from 'fs';
import { DEFAULT_FILENAME } from './constants.js';
import { format, Options } from "prettier";

export interface TypeSyncOptions {
  url: string;
  token: string;
  outDir?: string;
  filename?: string;
  serviceWhitelist?: string[];
  prettier?: {
    options: Options;
    disable: boolean;
  }
}

export async function typeSync({
  url,
  token,
  outDir: _outDir,
  filename = DEFAULT_FILENAME,
  serviceWhitelist = [],
  prettier,
}: TypeSyncOptions) {
  if (!url || !token) {
    throw new Error('Missing url or token arguments');
  }
  const warning = `
  // this is an auto generated file, do not change this manually
  `;
  const { services, states } = await connect(url, token);
  const serviceInterfaces = await generateServiceTypes(services, typeof serviceWhitelist === 'string' ? [serviceWhitelist] : serviceWhitelist.map(x => `${x}`));
  const output = `
    ${warning}
    import { ServiceFunction, ServiceFunctionTypes } from "@hakit/core";
    declare module '@hakit/core' {
      export interface CustomSupportedServices<T extends ServiceFunctionTypes = "target"> {
        ${serviceInterfaces}
      }
      export interface CustomEntityNameContainer {
        names: ${generateEntityType(states)};
      }
    }`;
  const outDir = _outDir || process.cwd();

  const formatted = prettier?.disable ? output: await format(output, {
    parser: 'typescript',
    ...prettier?.options
  });
  // now write the file
  fs.writeFileSync(`${outDir}/${filename}`, formatted);
  console.log(`Succesfully generated types: ${outDir}/${filename}\n\n`);
  // reminder to add the generated file to the tsconfig.json include array
  console.log(`IMPORTANT: Don't forget to add the "${filename}" file to your tsconfig.json include array\n\n`);
}