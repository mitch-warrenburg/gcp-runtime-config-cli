#!/usr/bin/env node
import { exec } from 'shelljs';
import { program } from 'commander';
import * as Configstore from 'configstore';

const STORE = new Configstore('runtime-config');
const BASE_CMD = 'gcloud beta runtime-config configs';

const projectOption = () => {
  const project = program.opts().project || STORE.get('default-project') || '';
  return project ? `--project=${project}` : ''.trim();
};

const cli = () => {
  program
    .version('0.0.1')
    .option('-p, --project <project>', 'set GCP project', STORE.get('default-project') || exec('gcloud config get-value project', { silent: true }).trim());

  program
    .command('create <app> <env>')
    .alias('c')
    .description('Create a config.')
    .action((app, env) => {
      exec(`${BASE_CMD} create ${app}_${env} ${projectOption()}`);
    });

  program
    .command('list')
    .alias('l')
    .option('-e, --env [env]', 'Filter by env')
    .option('-a, --app [app]', 'Filter by app name')
    .description('List configs.')
    .action(options => {
      const output = exec(`${BASE_CMD} list ${projectOption()}`, { silent: true });

      if (options.app && options.env) {
        console.log(output.grep(`${options.app}_${options.env}`).trim());
        return;
      }

      if (options.app) {
        console.log(output.grep(`${options.app}_`).trim());
        return;
      }

      if (options.env) {
        console.log(output.grep(`_${options.env}`).trim());
        return;
      }

      console.log(output.trim().replace(/(NAME|DESCRIPTION|\s).*/, ''));
    });

  program
    .command('delete <config>')
    .alias('d')
    .description('Delete a config')
    .action((config => {
      exec(`${BASE_CMD} delete ${config} ${projectOption()}`);
    }));

  program
    .command('variables [config]')
    .alias('v')
    .description('List variables for a config.')
    .action((config => {
      const configName = config || STORE.get('default-config');
      if (configName) {
        exec(`${BASE_CMD} variables list --config-name ${configName} ${projectOption()}`);
      } else {
        console.log('--config-name must be provided if default-config is not set.');
      }
    }));

  program
    .command('set <key> <value> [config]')
    .alias('s')
    .description('Set a property')
    .action((key, value, config) => {
      const configName = config || STORE.get('default-config');

      if (configName) {
        exec(`${BASE_CMD} variables set ${key} ${value} --config-name ${configName} ${projectOption()}`);
      } else {
        console.log('--config-name must be provided if default-config is not set.');
      }
    });

  program
    .command('unset <property> [config]')
    .alias('u')
    .description('Unset a property')
    .action((property, config) => {
      const configName = config || STORE.get('default-config');

      if (configName) {
        exec(`${BASE_CMD} variables unset ${property} --config-name ${configName} ${projectOption()}`);
      } else {
        console.log('--config-name must be provided if default-config is not set.');
      }
    });

  program
    .command('value <property> [config]')
    .alias('val')
    .description('Get the value for a property')
    .action((property, config) => {
      const configName = config || STORE.get('default-config');

      if (configName) {
        exec(`${BASE_CMD} variables get-value ${property} --config-name ${configName} ${projectOption()}`);
      } else {
        console.log('--config-name must be provided if default-config is not set.');
      }
    });


  program
    .command('default-config <config>')
    .alias('dc')
    .description('Set a default config.')
    .action((config => {
      STORE.set('default-config', config);
      console.log(`default config set to: ${STORE.get('default-config')}`);
    }));

  program
    .command('default-project <config>')
    .alias('dp')
    .description('Set a the default GCP project.')
    .action((config => {
      STORE.set('default-project', config);
      console.log(`default config set to: ${STORE.get('default-config')}`);
    }));

  program
    .command('config')
    .alias('conf')
    .description('View CLI config defaults.')
    .action((() => {
      console.log(STORE.all);
    }));

  program.parse(process.argv);
};

cli();
