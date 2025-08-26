# Cart System Setup Guide

## Overview
This guide explains how to set up and use the professional cart system implemented in the Furniture e-commerce application.

## Backend Setup

### 1. Database Schema
Run the following SQL command to create the cart table:

```sql
-- Execute the contents of backend/cart_schema.sql
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  color VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  
  INDEX idx_userId (userId),
  INDEX idx_productId (productId),
  INDEX idx_user_product_color (userId, productId, color)
);
```

### 2. Backend Files Updated
- `backend/controllers/cartController.js` - Complete cart CRUD operations
- `backend/routes/cartRoutes.js` - Protected cart API endpoints
- `backend/controllers/authController.js` - Returns userId on login

### 3. API Endpoints
All cart endpoints require authentication via JWT token:

- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/:userId` - Get user's cart
- `PUT /api/cart/item/:cartItemId` - Update item quantity
- `DELETE /api/cart/item/:cartItemId` - Remove item from cart
- `DELETE /api/cart/:userId` - Clear entire cart
- `GET /api/cart/count/:userId` - Get cart item count

## Frontend Setup

### 1. New Components
- `frontend/src/Pages/Cart.jsx` - Complete cart page with item management
- Updated `frontend/src/Pages/ProductDetails.jsx` - Add to cart functionality
- Updated `frontend/src/components/Navbar.jsx` - Cart icon with badge

### 2. Features Implemented
- **Add to Cart**: From product details page with color selection
- **Cart Management**: View, update quantities, remove items
- **Real-time Updates**: Cart count badge in navbar
- **Responsive Design**: Mobile-friendly cart interface
- **Order Summary**: Subtotal, tax calculation, total

### 3. User Flow
1. User browses products
2. Selects product, color, and quantity
3. Clicks "ADD TO BAG"
4. Item added to cart with success confirmation
5. Cart count updates in navbar
6. User can view cart, modify quantities, or checkout

## Usage Instructions

### 1. Adding Items to Cart
- Navigate to any product detail page
- Select a color (required)
- Choose quantity (1-20)
- Click "ADD TO BAG"
- Confirm to view cart or continue shopping

### 2. Managing Cart
- Click cart icon in navbar to view cart
- Update quantities with +/- buttons
- Remove individual items
- Clear entire cart
- View order summary with tax calculation

### 3. Cart Features
- **Quantity Controls**: Increment/decrement with validation
- **Color Display**: Shows selected color for each item
- **Price Calculation**: Individual item totals and cart summary
- **Tax Calculation**: 15% tax applied to subtotal
- **Responsive Layout**: Works on all device sizes

## Technical Implementation

### 1. State Management
- Cart data stored in component state
- Real-time updates via API calls
- Local storage for user authentication

### 2. API Integration
- Axios for HTTP requests
- JWT token authentication
- Error handling and user feedback

### 3. UI Components
- Tailwind CSS for styling
- Lucide React icons
- Responsive grid layouts
- Loading states and empty states

## Security Features

### 1. Authentication
- All cart operations require valid JWT token
- User ID validation on all endpoints
- Protected routes with middleware

### 2. Data Validation
- Required field validation
- Quantity limits (minimum 1)
- Color selection requirement
- Product existence verification

## Testing the System

### 1. Backend Testing
```bash
# Start backend server
cd backend
npm start

# Test cart endpoints with Postman or similar tool
# Use valid JWT token from login endpoint
```

### 2. Frontend Testing
```bash
# Start frontend development server
cd frontend
npm run dev

# Test user flow:
# 1. Register/Login
# 2. Browse products
# 3. Add items to cart
# 4. View and manage cart
```

## Troubleshooting

### Common Issues
1. **Cart not updating**: Check JWT token validity
2. **Items not adding**: Verify color selection and quantity
3. **Cart count not showing**: Check user authentication status
4. **Database errors**: Verify cart table schema and foreign keys

### Debug Steps
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Confirm database connection
4. Validate JWT token format

## Future Enhancements

### Planned Features
- Checkout process implementation
- Order history and tracking
- Save for later functionality
- Guest cart (local storage)
- Cart sharing between devices
- Bulk operations (select multiple items)

### Performance Optimizations
- Cart data caching
- Optimistic updates
- Debounced API calls
- Lazy loading for large carts 