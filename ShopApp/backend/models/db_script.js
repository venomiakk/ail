//region create database
// Connect to the appropriate database
// use ail_shop1;

// 1. Collection: categories
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        name: {
          bsonType: "string",
          description: "Must be a string and is required.",
        },
      },
    },
  },
});

// 2. Collection: products
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "name",
        "description",
        "unit_price",
        "unit_weight",
        "category_id",
      ],
      properties: {
        name: {
          bsonType: "string",
          description: "Must be a string and is required.",
        },
        description: {
          bsonType: "string",
          description:
            "Must be a string and is required (preferred HTML format).",
        },
        unit_price: {
          bsonType: "double",
          minimum: 0,
          description: "Must be a positive number.",
        },
        unit_weight: {
          bsonType: "double",
          minimum: 0,
          description: "Must be a positive number.",
        },
        category_id: {
          bsonType: "string",
          description: "Must be a valid category identifier.",
        },
      },
    },
  },
});

// 3. Collection: order_statuses
db.createCollection("order_statuses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        name: {
          bsonType: "string",
          description: "Must be a string and is required.",
        },
      },
    },
  },
});

// 4. Collection: orders
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "user_name",
        "email",
        "phone",
        "items",
        "status_id",
        "date_ordered",
        "date_approved",
      ],
      properties: {
        user_name: {
          bsonType: "string",
          description: "Must be a string and is required.",
        },
        email: {
          bsonType: "string",
          pattern: "^[^@]+@[^@]+.[^@]+$",
          description: "Must be a valid email address.",
        },
        phone: {
          bsonType: "string",
          description: "Must be a string.",
        },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["product_id", "quantity", "unit_price"],
            properties: {
              product_id: {
                bsonType: "string",
                description: "Must be a valid product identifier.",
              },
              quantity: {
                bsonType: "int",
                minimum: 1,
                description: "Must be a positive integer.",
              },
              unit_price: {
                bsonType: "double",
                minimum: 0,
                description:
                  "Must be a positive number representing the unit price.",
              },
            },
          },
          description: "Must be an array containing at least one item.",
        },
        status_id: {
          bsonType: "string",
          description: "Must be a valid order status identifier.",
        },
        date_approved: {
          bsonType: ["date", "null"],
          description: "Must be a date or null.",
        },
        date_ordered: {
          bsonType: "date",
          description: "Must be a valid date and is required.",
        },
      },
    },
  },
});

// 5. Collection: users
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_name", "password", "email", "role"],
      properties: {
        user_name: {
          bsonType: "string",
          description: "Must be a string and is required.",
        },
        password: {
          bsonType: "string",
          description: "Must be a hash of the password and is required.",
        },
        email: {
          bsonType: "string",
          pattern: "^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$",
          description: "Must be a valid email address and is required.",
        },
        role: {
          bsonType: "string",
          enum: ["client", "employee"],
          description: "Must be either 'client' or 'employee' and is required.",
        },
      },
    },
  },
});

// unique idexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ user_name: 1 }, { unique: true });

// region adding stuff

// Initial data for the order_statuses collection
db.order_statuses.insertMany([
  { _id: "status1", name: "UNCONFIRMED" },
  { _id: "status2", name: "CONFIRMED" },
  { _id: "status3", name: "CANCELLED" },
  { _id: "status4", name: "COMPLETED" },
]);

// Initial data for the categories collection
db.categories.insertMany([
  { _id: "cat1", name: "Electronics" },
  { _id: "cat2", name: "Home Appliances" },
  { _id: "cat3", name: "Books" },
  { _id: "cat4", name: "Clothing" },
]);

// Initial products
db.products.insertMany([
  {
    name: "Smartphone",
    description:
      "<p>A high-end smartphone with excellent camera and performance.</p>",
    unit_price: 999.99,
    unit_weight: 0.2,
    category_id: db.categories.findOne({ name: "Electronics" })._id,
  },
  {
    name: "Washing Machine",
    description:
      "<p>An energy-efficient washing machine with smart features.</p>",
    unit_price: 499.99,
    unit_weight: 75.5,
    category_id: db.categories.findOne({ name: "Home Appliances" })._id,
  },
  {
    name: "The Hobbit",
    description: "<p>A fantasy novel by J.R.R. Tolkien.</p>",
    unit_price: 15.99,
    unit_weight: 0.5,
    category_id: db.categories.findOne({ name: "Books" })._id,
  },
  {
    name: "T-shirt",
    description:
      "<p>A comfortable cotton T-shirt available in multiple sizes.</p>",
    unit_price: 19.99,
    unit_weight: 0.25,
    category_id: db.categories.findOne({ name: "Clothing" })._id,
  },
]);

// db.users.insertOne({
//     user_name: "johndoe",
//     password: "hashed_password_here",
//     email: "johndoe@example.com",
//     role: "client"
//   });

// Example of inserting a document into the orders collection
// db.orders.insertOne({
//   user_name: "JohnDoe",
//   email: "john.doe@example.com",
//   phone: "123456789",
//   items: [
//     { product_id: "prod1", quantity: 2, unit_price: 15.5 },
//     { product_id: "prod2", quantity: 1, unit_price: 45.0 }
//   ],
//   status_id: "status1",
//   date_approved: null,
//   date_ordered: new Date()
// });
