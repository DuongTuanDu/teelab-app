import mitt from 'mitt';

type Events = {
  tokenChanged: string;
  createOrder: void
};

export const eventEmitter = mitt<Events>();
