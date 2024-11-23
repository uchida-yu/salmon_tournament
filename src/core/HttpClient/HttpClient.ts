import { Agent } from 'https';

interface CustomRequestInit extends RequestInit {
  agent?: Agent | undefined;
}

type Headers = {
  Authorization?: string;
  'Content-Type'?: string;
};

export default class HttpClient {
  public static get<T>(url: string, options: { headers: Headers; body: string; agent?: Agent }): Promise<T> {
    return fetch(url, {
      headers: options.headers,
      agent: options.agent,
    } as CustomRequestInit)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('error');
      })
      .catch((error) => console.error(error));
  }

  public static post<T>(url: string, options: { headers: Headers; body: string; agent?: Agent }): Promise<T> {
    return fetch(url, {
      method: 'POST',
      headers: options.headers,
      body: options.body,
      agent: options.agent,
    } as CustomRequestInit)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('error');
      })
      .catch((error) => console.error(error));
  }
}
