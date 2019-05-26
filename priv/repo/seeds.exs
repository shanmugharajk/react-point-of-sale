alias Epos.{Accounts, Customers, Products, Vendors, Stocks}

roles = Application.get_env(:epos, Epos.Auth)[:roles]
role = Map.get(roles, :super_admin)

user = %{
  "id" => "shan",
  "password" => "shan",
  "username" => "shan",
  "mobile" => "1234567890",
  "role" => role,
  "active" => true,
  "email" => "email@email.com"
}

Accounts.create_user(user)

customer = %{
  "id" => "shan",
  "name" => "shan",
  "mobile" => "1234567890",
  "description" => "test customer",
  "address" => "test address",
  "email" => "mail@mail.com",
  "active" => true,
  "updated_by" => "shan",
  "created_by" => "shan"
}

Customers.create_customer(customer)

walk_in = %{
  "id" => "walk-in",
  "name" => "walk-in",
  "mobile" => "1234567890",
  "description" => "walk-in customer",
  "address" => "test address",
  "email" => "mail@mail.com",
  "active" => true,
  "updated_by" => "shan",
  "created_by" => "shan"
}

Customers.create_customer(walk_in)

paper = %{
  "created_by" => "shan",
  "description" => "printings business",
  "id" => "paper",
  "updated_by" => "shan"
}

Products.create_product_type(paper)

a4 = %{
  "id" => "A4",
  "product_type_id" => "paper",
  "name" => "A4 paper",
  "description" => "A4 paper",
  "cost_price" => 3000,
  "selling_price" => 3500,
  "updated_by" => "shan",
  "created_by" => "shan"
}

Products.create_product(a4)

a3 = %{
  "id" => "A3",
  "product_type_id" => "paper",
  "name" => "A3 paper",
  "description" => "A3 paper",
  "cost_price" => 10000,
  "selling_price" => 13500,
  "updated_by" => "shan",
  "created_by" => "shan"
}

Products.create_product(a3)

creative_eye = %{
  "id" => "creative_eye",
  "name" => "Creative Eye Solutions",
  "address" => "Bangalore",
  "mobile" => "1234567890",
  "email" => "email@mail.com",
  "received_date" => DateTime.utc_now(),
  "created_by" => "shan",
  "updated_by" => "shan",
  "active" => true
}

Vendors.create_vendor(creative_eye)

r_a3 = %{
  "vendor_id" => "creative_eye",
  "product_id" => "A3",
  "qty" => 60000,
  "price" => 3500,
  "received_date" => DateTime.utc_now(),
  "created_by" => "shan",
  "updated_by" => "shan"
}

Stocks.add_receiving(r_a3)

r_a4 = %{
  "vendor_id" => "creative_eye",
  "product_id" => "A4",
  "qty" => 60000,
  "price" => 4500,
  "received_date" => DateTime.utc_now(),
  "created_by" => "shan",
  "updated_by" => "shan"
}

Stocks.add_receiving(r_a4)
