import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

export const handleDBErrors = (error: any): never => {


  if (error.code === '23505') {
    throw new BadRequestException(error.detail.replace('Key ', ''));
  }

  if (error.code == 'error-001') {
    throw new BadRequestException(error.detail.replace('Key ', ''));
  }

  throw new InternalServerErrorException('Please check server logs');

}

