import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from '../authz.constants';

export const Public = () => SetMetadata(IS_PUBLIC, true);
