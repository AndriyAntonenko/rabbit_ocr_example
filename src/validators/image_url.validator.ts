import { inject, injectable } from 'inversify';
import { AxiosStatic, AxiosResponse } from 'axios';
import { TYPES } from '../constants/types';
import { Validator } from '../interfaces/validator.interface';

@injectable()
export class ImageUrlValidator implements Validator {
  private readonly axios: AxiosStatic;
  private magic = {
    jpg: 'ffd8ffe0',
    png: '89504e47',
    gif: '47494638'
  };

  constructor(
    @inject(TYPES.Axios) _axios: AxiosStatic,
  ) {
    this.axios = _axios;
  }

  public async validate(data: string): Promise<string> {
    const image: AxiosResponse = await this.axios.get(data, { responseType: 'arraybuffer' });

    const imageBuf: string = image.data.toString('hex', 0, 4);
    if (imageBuf === this.magic.gif || imageBuf === this.magic.jpg || imageBuf === this.magic.png) {
      return data;
    }
    throw new Error('Bad url...');
  }
}
