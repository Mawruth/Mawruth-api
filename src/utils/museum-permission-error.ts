import { UnauthorizedException } from '@nestjs/common';

export function handleMuseumPermissionError(
  museum_id: number,
  userMuseum: number,
) {
  if (userMuseum != museum_id) {
    throw new UnauthorizedException('You not have permission');
  }
}
