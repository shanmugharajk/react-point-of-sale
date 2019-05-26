const listeners: any = {};

export default function mockApi(id: string, cb: Function) {
  return {
    subscribe: () => {
      const timerId = setInterval(() => {
        cb(new Date());
      }, 1000);

      listeners[id] = timerId;
    },

    unSubscribe: () => {
      clearTimeout(listeners[id]);
    }
  };
}
