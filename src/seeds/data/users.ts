import { ValidRoles } from "src/auth/enums";

export const SEED_USERS = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "Aa1$example",
    isActive: true,
    roles: [ValidRoles.user]
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "Aa2$example",
    isActive: true,
    roles: [ValidRoles.admin, ValidRoles.user]
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    password: "Aa3$example",
    isActive: true,
    roles: [ValidRoles.user]
  },
  {
    name: "Alice Williams",
    email: "alice.williams@example.com",
    password: "Aa4$example",
    isActive: true,
    roles: [ValidRoles.user]
  },
  {
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    password: "Aa5$example",
    isActive: true,
    roles: [ValidRoles.admin]
  },
  {
    name: "Daisy Miller",
    email: "daisy.miller@example.com",
    password: "Aa6$example",
    isActive: true,
    roles: [ValidRoles.user]
  },
  {
    name: "Edward Stone",
    email: "edward.stone@example.com",
    password: "Aa7$example",
    isActive: true,
    roles: [ValidRoles.admin]
  },
  {
    name: "Fiona Green",
    email: "fiona.green@example.com",
    password: "Aa8$example",
    isActive: true,
    roles: [ValidRoles.user, ValidRoles.admin]
  },
  {
    name: "George Black",
    email: "george.black@example.com",
    password: "Aa9$example",
    isActive: true,
    roles: [ValidRoles.user]
  },
  {
    name: "Helen White",
    email: "helen.white@example.com",
    password: "Aa0$example",
    isActive: true,
    roles: [ValidRoles.user]
  }
]

