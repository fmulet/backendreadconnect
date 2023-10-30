import { registerEnumType } from "@nestjs/graphql";

export enum BookStatus {
  WANTED = 'WANTED',
  READ = 'READ'
}


registerEnumType(BookStatus, {
  name: 'BookStatus',
});
