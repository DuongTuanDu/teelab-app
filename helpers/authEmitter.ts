import mitt from 'mitt';

type Events = {
  tokenChanged: string;
};

export const authEmitter = mitt<Events>();
