import React, {useState, useEffect} from 'react';

export const App = () => {
  const [data, setData] = useState<any[]>([]);
  const abort = new AbortController();

  useEffect(() => {
    let reader: ReadableStreamDefaultReader<Uint8Array> | null;
    fetch('https://localhost/api/movies?s=latest', {
      keepalive: true,
      method: 'GET',
      mode: 'cors',
      // credentials: 'include',
      signal: abort.signal,
    })
      .then(res => res.body)
      .then(body => {
        reader = body ? body.getReader() : null;
      });
    const timer = setInterval(() => {
      if (!reader) clearInterval(timer);
      else
        reader
          .read()
          .then(({done, value}) => {
            if (done) {
              console.log('is done');
              reader!.cancel();
              clearInterval(timer);
              return;
            }
            const parsed = JSON.parse(new TextDecoder('utf-8').decode(value));
            console.log('parsed chunk', parsed);
            setData(d => d.concat(parsed));
          })
          .catch(err => {
            console.log('Request finished', err);
            clearInterval(timer);
          });
      console.log('timeout started');
    }, 1000);
  }, []);
  console.log('data is>>>', data);
  return <div>HELLO</div>;
};
