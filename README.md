# DearThreado 🎁

### A Handmade & Personalized Gifting E-Commerce Platform

> **Crafted with care, chosen with heart.**

DearThreado is a full-stack e-commerce platform focused on handmade, personalized, and meaningful gifting.

The platform provides a complete customer shopping experience along with a dedicated administrative portal for managing products, categories, orders, reviews, custom gift requests, and store activities.

This repository contains the completed **DearThreado MVP developed as an internship project**.

---

## ✨ Project Overview

DearThreado is designed around the idea that a meaningful gift is more than just an object.

The platform brings together handmade products, personalization, customer requests, and a structured ordering experience into one web application.

Customers can explore products, personalize eligible gifts, place orders, track their orders, submit reviews, and communicate unique gift ideas through custom requests.

The Admin Portal provides centralized tools to manage the catalogue, orders, reviews, customer requests, and important store activities.

---

## 🎯 Project Objectives

The main objectives of DearThreado are:

- Provide a simple and user-friendly handmade gifting experience
- Support personalized gifting workflows
- Organize handmade products through meaningful categories and subcategories
- Allow customers to communicate custom gift requirements
- Provide a centralized administrative management system
- Reduce unnecessary communication gaps between customers and administrators
- Provide a complete full-stack e-commerce workflow
- Create a scalable foundation for future development

---

# 👥 Customer Side

The customer-facing application provides the complete shopping and gifting experience.

## 🏠 Home Page

The home page introduces the DearThreado brand and provides access to:

- Brand introduction
- Product categories
- Handmade and gifting content
- Product discovery
- Custom gift request functionality
- Meaningful gifting messages
- Navigation to major customer features

The visual identity follows the DearThreado theme using soft and warm colors, rounded layouts, subtle animations, and handmade-inspired visual elements.

---

## 🌸 Product Categories

The current product organization includes:

### Floral

**Subcategories:**
- Flower Bouquets
- Flower Frames
- Floral Decor

### Pipecleaner

**Subcategories:**
- Pipe Cleaner Flowers
- Pipe Cleaner Characters
- Pipe Cleaner Decor

### Paper Craft

**Subcategories:**
- Handmade Cards
- Scrapbooks
- Paper Flowers
- Paper Decor

### Photo Related Products

**Subcategories:**
- Photo Frames
- Photo Cards
- Photo Gifts

Products follow the structured:

**Main Category → Subcategory → Product**

workflow.

---

## 🛍️ Product Discovery

Customers can:

- Browse product categories
- Browse subcategories
- Filter products
- View product cards
- View product details
- Identify customizable products
- View product pricing
- View product information

---

## 🎨 Product Personalization

Eligible products support product-specific personalization.

Depending on the product, customers can provide required customization information such as:

- Personal text
- Recipient information
- Color selection
- Dropdown selections
- Additional instructions
- Uploaded images

Photo-related customization allows customers to upload images directly from their device.

---

## 🛒 Shopping Cart

Customers can:

- Add products to the cart
- Review selected products
- Manage cart items
- Review quantities
- Review prices
- Review the order summary
- Proceed to checkout

After an order is successfully placed, the purchased items are removed from the active cart so that already-purchased items do not remain in the customer's cart.

---

## 📦 Orders

Customers can access their orders through **My Orders**.

The order workflow supports:

- Order placement
- Order confirmation
- Preparation
- Shipping
- Delivery
- Cancellation where applicable

Order information is maintained separately from the customer's active shopping cart.

---

## ⭐ Reviews & Ratings

Customers can submit reviews for eligible purchased products.

Reviews support:

- Star ratings
- Written review comments

Ratings are based on actual customer-submitted reviews.

Products without actual reviews do not display artificial or pre-filled customer ratings.

---

## 💡 Custom Gift Requests

Customers can submit requests for unique or personalized gift ideas.

A request can contain relevant information such as:

- Gift requirement
- Description
- Budget range
- Reference image
- Customer information

Administrators can review these requests and respond or update their status through the Admin Portal.

---

## 🔔 Notifications

The customer side provides in-app notifications for relevant activities such as:

- Order updates
- Order cancellation
- Review-related activities
- Custom request updates

The notification indicator provides a quick overview of available notifications.

---

## 👤 Customer Profile

Customers can manage their account information through the profile section.

---

# 🛠️ Admin Portal

DearThreado includes a dedicated **Admin Portal** separate from the customer shopping experience.

The Admin Portal is the main administrative entry point and provides centralized control over store operations.

---

## 📊 Admin Dashboard

The Admin Portal dashboard provides an overview of important store activities.

The major dashboard statistics include:

- Total Revenue
- New Orders
- New Requests
- New Reviews
- Delivered Orders
- Cancelled Orders

The dashboard also provides direct access to the major administrative modules.

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
- Maintain product information
- Configure product customization
- Manage product images

---

### 📦 Orders

Administrators can:

- View customer orders
- View order details
- View customer information
- View customization details
- View customer-uploaded customization images
- Download customer-uploaded images when required
- Monitor order status
- Manage order-related information

This allows customer-uploaded images required for personalized products to be accessed directly by the administrator instead of requiring customers to send them through external communication platforms.

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

The Admin Portal provides notifications for important activities, including:

- New orders
- New custom gift requests
- New reviews
- Customer order cancellations
- Other relevant administrative events

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
- SQLite support for local development

## Other Technologies & Tools

- JWT Authentication
- bcrypt Password Hashing
- REST API architecture
- Git
- GitHub
- npm

---

# 🧩 High-Level Architecture

```text
                         DearThreado
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌────────▼────────┐
        │ Customer Side  │         │  Admin Portal    │
        └───────┬────────┘         └────────┬─────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                     ┌────────▼────────┐
                     │   Express API   │
                     │    Backend      │
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │    Database     │
                     │  MySQL / SQLite │
                     └─────────────────┘
