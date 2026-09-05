# DearThreado 🎁

### A Handmade & Personalized Gifting E-Commerce Platform

> **Crafted with care, chosen with heart.**

DearThreado is a full-stack e-commerce platform designed around handmade, personalized, and meaningful gifting.

The platform provides a complete customer shopping experience along with an administrative management portal for managing products, categories, orders, reviews, and custom gift requests.

This repository contains the completed **DearThreado MVP developed as an internship project**.

---

## ✨ Project Overview

DearThreado focuses on making handmade and personalized gifting simple, meaningful, and convenient.

The platform allows customers to:

- Explore handmade and personalized products
- Browse products through categories and subcategories
- View detailed product information
- Personalize eligible products
- Add products to cart
- Place orders
- Track order status
- Cancel orders when applicable
- Submit product reviews and ratings
- Send custom gift requests
- Receive notifications related to their activities

The platform also provides an Admin Portal that enables administrators to manage the store and monitor important activities from a centralized dashboard.

---

## 🎯 Project Objectives

The main objectives of DearThreado are:

- Provide a simple and user-friendly handmade gifting experience
- Support personalized gifting workflows
- Organize handmade products through meaningful categories
- Allow customers to communicate custom gift requirements
- Provide centralized administrative management
- Reduce unnecessary communication gaps between customers and administrators
- Provide a structured full-stack e-commerce workflow
- Create a foundation that can be extended into a larger gifting platform

---

# 👥 User Side

The customer-facing application provides the complete shopping experience.

### 🏠 Home

The home page introduces the DearThreado brand and provides access to:

- Hero section
- Product categories
- Handmade and gifting content
- Product discovery
- Custom gift request functionality
- Meaningful brand-focused sections
- Navigation to major customer features

The platform uses a consistent visual identity based around soft purple, pink, blue and golden/yellow accents.

---

### 🌸 Product Categories

The current product organization includes:

#### Floral
- Flower Bouquets
- Flower Frames
- Floral Decor

#### Pipecleaner
- Pipe Cleaner Flowers
- Pipe Cleaner Characters
- Pipe Cleaner Decor

#### Paper Craft
- Handmade Cards
- Scrapbooks
- Paper Flowers
- Paper Decor

#### Photo Related Products
- Photo Frames
- Photo Cards
- Photo Gifts

Products are organized through the:

**Category → Subcategory → Product**

workflow.

---

### 🛍️ Product Discovery

Customers can:

- Browse products
- Filter products using subcategories
- View product details
- Identify customizable products
- View product pricing
- View available product information
- Open individual product pages

---

### 🎨 Product Personalization

Eligible products support personalization.

Customers can provide the required customization information while ordering a product.

For photo-related personalization, customers can upload the required image directly through the application.

---

### 🛒 Cart

Customers can:

- Add products to the cart
- Review selected products
- Review quantities and prices
- Review order summary
- Proceed toward order placement

After an order is successfully placed, the purchased cart items are cleared from the active cart so that the customer does not accidentally treat already-purchased products as pending cart items.

---

### 📦 Orders

Customers can access their orders through **My Orders**.

The order workflow supports:

- Order placement
- Order confirmation
- Preparation
- Shipping
- Delivery
- Cancellation where applicable

Order information is maintained separately from the customer's active cart.

---

### ⭐ Reviews & Ratings

Customers can submit:

- Product ratings
- Written reviews

Ratings are based on actual submitted customer reviews rather than displaying artificial pre-existing ratings when no reviews exist.

Submitted reviews are also available for administrative management.

---

### 💡 Custom Gift Requests

Customers can submit requests for customized or unique gift ideas.

A request can contain relevant information such as:

- Gift requirement
- Description
- Budget range
- Reference image
- Customer information

This allows customers to communicate ideas beyond the predefined product catalogue.

---

### 🔔 Notifications

The customer side includes notifications for relevant account and order activities.

The notification indicator provides a quick overview of available notifications.

---

### 👤 My Profile

Customers can manage their profile information through the profile section.

---

# 🛠️ Admin Portal

DearThreado includes a dedicated administrative portal separate from the customer shopping experience.

The Admin Portal provides centralized management of the store.

---

## 📊 Admin Dashboard

The Admin Portal dashboard provides an overview of store activity.

Major statistics include:

- Total Revenue
- New Orders
- New Requests
- New Reviews
- Delivered Orders
- Cancelled Orders

The dashboard also provides access to the major management modules.

---

## ⚙️ Admin Management Modules

### 📁 Categories

Administrators can:

- Create categories
- Edit categories
- Delete categories
- Manage subcategories
- Maintain category information
- Manage category images

---

### 🛍️ Products

Administrators can:

- Create products
- Edit products
- Delete products
- Associate products with categories and subcategories
- Configure product information
- Configure customization-related information
- Manage product images

---

### 📦 Orders

Administrators can:

- View customer orders
- View order information
- View customization details
- View customer-uploaded customization images
- Download customer-uploaded images when required
- Monitor order status
- Manage order-related information

---

### ⭐ Reviews

Administrators can:

- View submitted customer reviews
- View ratings
- Monitor customer feedback
- Manage review information through the existing review workflow

---

### 💌 Custom Gift Requests

Administrators can:

- View customer requests
- View request descriptions
- View budget information
- View reference images
- Update request status
- Respond to customer requests

---

## 🔔 Admin Notifications

The Admin Portal includes notifications for important activities.

This includes customer-related events such as:

- New orders
- New requests
- New reviews
- Order cancellation events

The notification indicator provides an overview of relevant unread notifications.

---

# 🏗️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Bootstrap
- Bootstrap Icons
- React Router
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## Database

- MySQL
- SQLite support for local development / fallback workflows

## Development Tools

- Git
- GitHub
- npm
- VS Code / development environment

---

# 🧩 High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      DearThreado     │
                    │      Web Platform    │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐           ┌────────▼────────┐
        │  Customer Side │           │   Admin Portal   │
        └───────┬────────┘           └────────┬────────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                       ┌───────▼────────┐
                       │  Express API   │
                       │    Backend     │
                       └───────┬────────┘
                               │
                       ┌───────▼────────┐
                       │    Database    │
                       │ MySQL / SQLite │
                       └────────────────┘
