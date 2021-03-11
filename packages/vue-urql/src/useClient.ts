import { App, inject, provide } from 'vue';
import { Client, ClientOptions } from '@urql/core';

type NullableClient = Client | undefined

let outsideClient: NullableClient

export function provideClient(opts: ClientOptions | Client) {
  const client = opts instanceof Client ? opts : new Client(opts);
  outsideClient = client;
  provide('$urql', client);
  return client;
}

export function install(app: App, opts: ClientOptions | Client) {
  const client = opts instanceof Client ? opts : new Client(opts);
  outsideClient = client;
  app.provide('$urql', client);
}

export function useClient(): Client {
  const client = inject('$urql') as Client || outsideClient;
  if (process.env.NODE_ENV !== 'production' && !client) {
    throw new Error(
      'No urql Client was provided. Did you forget to install the plugin or call `provideClient` in a parent?'
    );
  }

  return client;
}
