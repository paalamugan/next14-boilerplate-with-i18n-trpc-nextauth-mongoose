import { TRPCError } from '@trpc/server';

export class TRPCInternalServerError extends TRPCError {
  constructor(message: string) {
    super({ message, code: 'INTERNAL_SERVER_ERROR' });
    Object.setPrototypeOf(this, TRPCInternalServerError.prototype);
  }
}
export type TRPCInternalServerErrorType = InstanceType<typeof TRPCInternalServerError>;
