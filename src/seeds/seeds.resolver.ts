import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedsService } from './seeds.service';


@Resolver()
export class SeedsResolver {

  constructor(private readonly seedService: SeedsService) { }


  @Mutation(() => Boolean, { name: 'executeSeed', description: 'Ejecuta la construcci—n de la base de datos' })
  async executeSeed(): Promise<boolean> {

    return this.seedService.executeSeed();
  }


}
