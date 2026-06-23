# 📖 Bagdi Atta - REST API Documentation

This document outlines the available REST API endpoints in the Bagdi Atta application, including payloads, response formats, and access rules.

---

## 🔒 Authentication & Authorization

The application uses HTTP-only cookies (`token` and `admin_token`) containing JSON Web Tokens (JWT) for secure authentication. 

* **Regular User Authentication**: Handled via `/api/auth/*` endpoints. Populates the `token` cookie.
* **Distributor Operations**: Accessible to users with `role: 'distributor'`.
* **Administrative Endpoints**: Protected by verifying the `admin_token` cookie. Any endpoint matching `/api/admin/*` requires admin rights.

---

## 👥 Customer & Partner Authentication

### 1. User Register (B2C Client)
* **Endpoint**: `POST /api/auth/signup`
* **Description**: Registers a new customer account.
* **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123",
    "phone": "9876543210",
    "address": "123 Green Street, Jaipur, Rajasthan"
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "60d0fe4f5311236168a109a1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
  ```

### 2. User Login
* **Endpoint**: `POST /api/auth/login`
* **Description**: Authenticates a customer or distributor and sets a session cookie.
* **Payload**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "60d0fe4f5311236168a109a1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
  ```

### 3. Get Logged-In Profile
* **Endpoint**: `GET /api/auth/me`
* **Description**: Fetches current user session profile data.
* **Headers**: Requires valid `token` cookie.
* **Response (Success)**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "60d0fe4f5311236168a109a1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer",
      "phone": "9876543210",
      "address": "123 Green Street, Jaipur, Rajasthan"
    }
  }
  ```

### 4. User Logout
* **Endpoint**: `POST /api/auth/logout`
* **Description**: Clears user session cookies.
* **Response (Success)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 🌾 Public Products Catalog

### 1. Fetch Store Catalog
* **Endpoint**: `GET /api/products`
* **Description**: Fetches all active products, categories, and subcategories for building the catalog UI.
* **Response (Success)**:
  ```json
  {
    "success": true,
    "products": [
      {
        "_id": "60d0fe4f5311236168a109b1",
        "name": "Bagdi Atta Whole Wheat Flour",
        "slug": "bagdi-atta",
        "description": "Traditional stone-ground...",
        "category": { "_id": "60d0fe4f5311236168a109c1", "name": "Flours", "slug": "flours" },
        "subcategory": { "_id": "60d0fe4f5311236168a109d1", "name": "Whole Wheat", "slug": "whole-wheat" },
        "variants": [
          { "size": "5kg", "price": 249, "wholesalePrice": 199, "stock": 500 }
        ]
      }
    ],
    "categories": [
      { "_id": "60d0fe4f5311236168a109c1", "name": "Flours", "slug": "flours" }
    ],
    "subcategories": [
      { "_id": "60d0fe4f5311236168a109d1", "name": "Whole Wheat", "slug": "whole-wheat", "category": "60d0fe4f5311236168a109c1" }
    ]
  }
  ```

### 2. Fetch Single Product
* **Endpoint**: `GET /api/products/[slug]`
* **Description**: Fetch full details (including specifications and nutrition facts) of a single product by its slug.
* **Response (Success)**:
  ```json
  {
    "success": true,
    "product": {
      "_id": "60d0fe4f5311236168a109b1",
      "name": "Bagdi Atta Whole Wheat Flour",
      "slug": "bagdi-atta",
      "variants": [
        { "size": "5kg", "price": 249, "wholesalePrice": 199, "stock": 500 }
      ],
      "nutritionalFacts": [
        { "label": "Energy", "value": "340 kcal" }
      ],
      "specifications": [
        { "label": "Shelf Life", "value": "3 Months" }
      ]
    }
  }
  ```

---

## 🛒 Cart & Wishlist Synchronization

### 1. Sync Shopping Cart
* **Endpoint**: `POST /api/user/cart`
* **Description**: Save the user's local state shopping cart to their profile.
* **Payload**:
  ```json
  {
    "items": [
      {
        "productId": "60d0fe4f5311236168a109b1",
        "size": "5kg",
        "quantity": 2,
        "price": 249
      }
    ]
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "cart": [
      { "productId": "60d0fe4f5311236168a109b1", "size": "5kg", "quantity": 2, "price": 249 }
    ]
  }
  ```

### 2. Sync Wishlist
* **Endpoint**: `POST /api/user/wishlist`
* **Description**: Save the user's wishlist items.
* **Payload**:
  ```json
  {
    "products": ["60d0fe4f5311236168a109b1"]
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "wishlist": ["60d0fe4f5311236168a109b1"]
  }
  ```

---

## 📦 Checkout & Orders

### 1. Place New Order
* **Endpoint**: `POST /api/orders`
* **Description**: Validates order details, calculates subtotal dynamically from the DB, checks wholesale weights if a distributor places it, and saves the order to database.
* **Constraint**: For B2B orders, the total combined weight of products must be at least **100 kg**.
* **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "phone": "9876543210",
    "address": "123 Green Street, Jaipur, Rajasthan",
    "items": [
      {
        "productId": "60d0fe4f5311236168a109b1",
        "size": "5kg",
        "quantity": 20
      }
    ],
    "paymentMethod": "COD",
    "companyName": "Jane Staples Ltd",
    "gstNumber": "08AAAAA0000A1Z5"
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "order": {
      "_id": "60d0fe4f5311236168a109e2",
      "orderId": "ORD-1234567890",
      "price": 3980,
      "status": "pending",
      "orderType": "DISTRIBUTOR"
    }
  }
  ```

---

## 🤝 Distributor Portal Applications

### 1. Submit Distributor Application
* **Endpoint**: `POST /api/distributor/apply`
* **Description**: Submits an application for becoming a B2B partner.
* **Payload**:
  ```json
  {
    "companyName": "Jane Staples Ltd",
    "gstNumber": "08AAAAA0000A1Z5",
    "expectedMonthlyVolume": "500kg"
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "application": {
      "companyName": "Jane Staples Ltd",
      "gstNumber": "08AAAAA0000A1Z5",
      "status": "pending"
    }
  }
  ```

---

## 🤖 Chatbot Settings

### 1. Get Chatbot Config Settings
* **Endpoint**: `GET /api/chatbot/settings`
* **Description**: Fetch all configured chatbot answers (welcome, shipping, MOQ instructions).
* **Response (Success)**:
  ```json
  {
    "success": true,
    "settings": {
      "welcomeMessage": "Hello! Welcome to Bagdi Atta...",
      "moq": "Our wholesale orders require a...",
      "distributor": "To become a distributor...",
      "shipping": "We offer free home...",
      "returns": "We stand by our quality...",
      "products": "We offer premium organic...",
      "whatsapp": "Need immediate support..."
    }
  }
  ```

---

## 🛠️ Administrative Operations (Requires `admin_token` verification)

### 1. Update Chatbot Settings
* **Endpoint**: `POST /api/chatbot/settings`
* **Payload**:
  ```json
  {
    "welcomeMessage": "Welcome to Bagdi Atta support...",
    "moq": "MOQ is 100 kg...",
    "whatsapp": "Chat on https://wa.me/..."
  }
  ```

### 2. Create Categories & Subcategories
* **Endpoint**: `POST /api/admin/categories`
* **Payload (Creating Category)**:
  ```json
  {
    "name": "Spices",
    "description": "Native raw organic spices"
  }
  ```
* **Payload (Creating Subcategory under Category)**:
  ```json
  {
    "name": "Turmeric",
    "description": "Organic turmeric powder",
    "categoryId": "60d0fe4f5311236168a109c1"
  }
  ```

### 3. Create or Edit Products
* **Endpoint**: `POST /api/admin/products`
* **Payload**:
  ```json
  {
    "name": "Organic Turmeric Powder",
    "slug": "turmeric-powder",
    "description": "High curcumin native turmeric...",
    "category": "60d0fe4f5311236168a109c1",
    "variants": [
      { "size": "500g", "price": 120, "wholesalePrice": 95, "stock": 100 }
    ],
    "nutritionalFacts": [
      { "label": "Energy", "value": "350 kcal" }
    ],
    "specifications": [
      { "label": "Ingredients", "value": "100% Turmeric" }
    ],
    "isActive": true
  }
  ```

### 4. Review B2B Distributor Application
* **Endpoint**: `POST /api/admin/distributors`
* **Description**: Approves or Rejects distributor application, promoting the user's role to `'distributor'` if approved.
* **Payload**:
  ```json
  {
    "applicationId": "60d0fe4f5311236168a109a1",
    "status": "approved"
  }
  ```

### 5. Fetch Dashboard Orders
* **Endpoint**: `GET /api/admin/orders`
* **Response (Success)**: Returns list of all orders.

### 6. Update Order Status
* **Endpoint**: `POST /api/admin/orders`
* **Payload**:
  ```json
  {
    "orderId": "60d0fe4f5311236168a109e2",
    "status": "confirmed"
  }
  ```
