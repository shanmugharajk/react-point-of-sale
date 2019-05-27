defmodule EposWeb.Router do
  use EposWeb, :router

  alias EposWeb.Guardian.{AuthPipeline, SuperAdminAuthPipeline}

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :jwt_authenticated do
    plug(AuthPipeline)
  end

  pipeline :super_admin_authenticated do
    plug(SuperAdminAuthPipeline)
  end

  scope "/api/v1", EposWeb do
    pipe_through :api

    post "/login", SessionController, :login
  end

  # super admin only routes
  scope "/api/v1", EposWeb do
    pipe_through [:api, :super_admin_authenticated]

    # ============================================
    #               USERS
    # ============================================
    resources("/users", UsersController, only: [:index, :create, :update, :show, :delete])

    # ============================================
    #               PRODUCTS-TYPES
    # ============================================

    get("/product-types/search", ProductTypesController, :search)

    resources("/product-types", ProductTypesController,
      only: [:index, :create, :update, :show, :delete]
    )

    # ============================================
    #               PRODUCTS
    # ============================================

    get("/products/search", ProductsController, :search)

    resources("/products", ProductsController, only: [:index, :create, :update, :show, :delete])

    # ============================================
    #               EXPENSES_TYPES
    # ============================================

    resources("/expense-types", ExpenseTypesController,
      only: [:index, :create, :update, :show, :delete]
    )

    # ============================================
    #               EXPENSES
    # ============================================

    resources("/expenses", ExpensesController, only: [:index, :create, :update, :show, :delete])

    # ============================================
    #               CUSTOMERS
    # ============================================

    resources("/customers", CustomersController, only: [:index, :create, :update, :show])

    # ============================================
    #               VENDORS
    # ============================================

    resources("/vendors", VendorsController, only: [:index, :create, :update, :show, :delete])

    # ============================================
    #               SALE
    # ============================================
    get("/sale/:customer_id", SalesController, :init_transaction)

    post("/sale/credit-payment", SalesController, :credit_payment)

    post("/sale/credit-payment-adjustment", SalesController, :adjust_payment)

    get("/sale/:transaction_id/clone", SalesController, :clone_sale)

    put("/sale/:transaction_id/cart/:product_id", SalesController, :update_cart)

    delete("/sale/:transaction_id/cart", SalesController, :empty_cart)

    delete(
      "/sale/:transaction_id/cart/:product_id",
      SalesController,
      :delete_item_from_cart
    )

    post("/sale/:transaction_id/counter-sale/checkout", SalesController, :checkout_counter_sale)

    post("/sale/:transaction_id/credit-sale/checkout", SalesController, :checkout_credit_sale)

    get(
      "/sale/:transaction_id/counter-sale/revert",
      SalesController,
      :revert_checkout_counter_sale
    )

    get(
      "/sale/:transaction_id/credit-sale/revert",
      SalesController,
      :revert_checkout_credit_sale
    )

    # ============================================
    #               RECEIVINGS
    # ============================================
    resources("/receivings", ReceivingsController,
      only: [:index, :create, :update, :show, :delete]
    )
  end
end
