import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {

  admin = 'ADMIN',
  user = 'USER',
}

registerEnumType(ValidRoles, {
  name: "ValidRoles", // this one is mandatory
  description: "Valid user roles", // this one is optional
});

