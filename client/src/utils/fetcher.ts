import qs from 'qs';

const abort = new AbortController();

export type FetcherResponse<T = any> = Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  headers: Headers;
  url: string;
  data: T;
  abortCall: () => void;
}>;

export const fetcher = {
  get: async <T = any>({
    url,
    params,
    credentials,
  }: {
    url: string;
    params?: any;
    credentials?: RequestInit['credentials'];
  }) => {
    const response = await fetch(url + (params ? '?' + qs.stringify(params, { skipNulls: true }) : ''), {
      keepalive: true,
      method: 'GET',
      mode: 'cors',
      signal: abort.signal,
      credentials,
    });
    console.log('data recieved>>');
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data: (await response.json()) as T,
      abortCall: abort.abort,
    };
  },

  post: async <T = any>({
    url,
    params,
    body,
    credentials,
  }: {
    url: string;
    params?: { [k: string]: any };
    body?: { [k: string]: any };
    credentials?: RequestInit['credentials'];
  }) => {
    console.log('fetching tto>>', url, params, body, credentials);
    const response = await fetch(url + (params ? '?' + qs.stringify(params, { skipNulls: true }) : ''), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
      body: body ? JSON.stringify(body) : undefined,
      signal: abort.signal,
      credentials,
    });

    console.log('response>>', response);

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data: (await response.json()) as T,
      abortCall: abort.abort,
    };
  },

  patch: async <T = any>({
    url,
    params,
    body,
    credentials,
  }: {
    url: string;
    params?: { [k: string]: any };
    body?: { [k: string]: any };
    credentials?: RequestInit['credentials'];
  }) => {
    const response = await fetch(url + (params ? '?' + qs.stringify(params, { skipNulls: true }) : ''), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      mode: 'cors',
      body: body ? JSON.stringify(body) : undefined,
      signal: abort.signal,
      credentials,
    });

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data: (await response.json()) as T,
      abortCall: abort.abort,
    };
  },

  delete: async <T = any>({
    url,
    params,
    credentials,
  }: {
    url: string;
    params?: any;
    credentials?: RequestInit['credentials'];
  }) => {
    const response = await fetch(url + (params ? '?' + qs.stringify(params, { skipNulls: true }) : ''), {
      method: 'DELETE',
      mode: 'cors',
      signal: abort.signal,
      credentials,
    });

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data: (await response.json()) as T,
      abortCall: abort.abort,
    };
  },

  put: async <T = any>({
    url,
    params,
    body,
    credentials,
  }: {
    url: string;
    params?: any;
    body?: { [k: string]: any };
    credentials?: RequestInit['credentials'];
  }) => {
    const response = await fetch(url + (params ? '?' + qs.stringify(params, { skipNulls: true }) : ''), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      mode: 'cors',
      body: body ? JSON.stringify(body) : undefined,
      signal: abort.signal,
      credentials,
    });

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data: (await response.json()) as T,
      abortCall: abort.abort,
    };
  },

  getStream: async ({
    url,
    params,
    credentials,
  }: {
    url: string;
    params?: any;
    credentials?: RequestInit['credentials'];
  }) => {
    const response = await fetch(url + (params ? '?' + qs.stringify(params, { skipNulls: true }) : ''), {
      keepalive: true,
      method: 'GET',
      mode: 'cors',
      signal: abort.signal,
      credentials,
    });
    const body = await response.body;
    const stream = body ? body.getReader() : null;

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data: stream,
      abortCall: abort.abort,
    };
  },
};
