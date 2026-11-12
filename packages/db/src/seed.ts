import { db } from "./db";
import { customers } from "./schema";

const sampleCustomers = [
  {
    name: "Ramesh Kumar",
    mobile: "9847012345",
    address: "12, Gandhi Road, Ernakulam",
  },
  { name: "Priya Nair", mobile: "9447256809", email: "priya.nair@example.com" },
  {
    name: "Arjun Menon",
    mobile: "9895123780",
    address: "3/45, MG Road, Thrissur",
  },
  {
    name: "Lakshmi Iyer",
    mobile: "9446078123",
    email: "lakshmi.iyer@example.com",
  },
  {
    name: "Suresh Babu",
    mobile: "9744123890",
    address: "88, Beach Road, Kozhikode",
  },
  { name: "Anitha Ramesh", mobile: "9633214587" },
  {
    name: "Vikram Singh",
    mobile: "9810447256",
    address: "21, Station Road, Palakkad",
  },
  {
    name: "Deepa Krishnan",
    mobile: "9495123400",
    email: "deepa.k@example.com",
  },
  {
    name: "Mohammed Rasheed",
    mobile: "9738621405",
    address: "7, Mosque Lane, Kollam",
  },
  {
    name: "Sneha Thomas",
    mobile: "9645789012",
    email: "sneha.thomas@example.com",
  },
  {
    name: "Rajesh Pillai",
    mobile: "9946337821",
    address: "54, Temple Street, Alappuzha",
  },
  { name: "Kavya Suresh", mobile: "9701256384" },
  {
    name: "Harish Chandra",
    mobile: "9902045731",
    address: "9, Market Junction, Kannur",
  },
];

async function main(): Promise<void> {
  const existing = await db
    .select({ id: customers.id })
    .from(customers)
    .limit(1);
  if (existing.length > 0) {
    console.log("customers table not empty — seed skipped");
    return;
  }

  const rows = await db.insert(customers).values(sampleCustomers).returning({
    id: customers.id,
  });
  console.log(`seeded ${rows.length} customer rows`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
