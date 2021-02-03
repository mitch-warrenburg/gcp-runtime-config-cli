# gcp-runtime-config-cli

A CLI to quickly manage GCP Runtime Properties.


```shell
Usage: main [options] [command]

Options:
  -V, --version                  output the version number
  -p, --project <project>        set GCP project
  -h, --help                     display help for command

Commands:
  create|c <app> <env>           Create a config.
  list|l [options]               List configs.
  delete|d <config>              Delete a config
  variables|v [config]           List variables for a config.
  set|s <key> <value> [config]   Set a property
  unset|u <property> [config]    Unset a property
  value|val <property> [config]  Get the value for a property
  default-config|dc <config>     Set a default config.
  default-project|dp <config>    Set a the default GCP project.
  config|conf                    View CLI config defaults.
  help [command]                 display help for command
```