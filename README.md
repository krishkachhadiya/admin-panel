# 🚀 LOTAS – Business Website & Admin Management System

A modern full-stack business website and administration system developed using Next.js and React.js.

LOTAS provides a complete content and product management solution with role-based access control, SEO management, CMS functionality, image uploads, and dynamic website administration through a centralized admin dashboard.

---

# 📌 Project Overview

The system is designed to allow administrators and authorized users to manage website content, products, categories, SEO settings, and business information without modifying the source code.

The project follows a scalable architecture using Next.js API Routes, JSON-based data storage, dynamic metadata generation, and structured SEO implementation.

---

# ✨ Core Features

## 🌐 Website Module

### Home Page

* Dynamic Website Content
* Featured Categories
* Featured Products
* SEO Optimized Layout

### Product Module

* Product Listing
* Product Details Page
* Product Image Gallery
* Dynamic Product Information
* SEO-Friendly Product URLs

### CMS Pages

* About Us Page
* Contact Us Page
* Dynamic Content Management
* SEO Metadata Management

### Responsive Design

* Mobile Friendly Layout
* Tablet Compatibility
* Desktop Optimization

---

# 🔐 Authentication & Authorization

* Secure Admin Login System
* Session-Based Authentication
* Protected Admin Routes
* Role-Based Access Control (RBAC)
* Module-Level Permission Management
* Unauthorized Access Protection
* Dynamic User Permission Validation
* Secure Route Authorization

---

# 👥 User & Role Management

* User Management
* Role Management
* Permission Management
* Module Access Control
* Dynamic Role Assignment
* User Authorization System

### Supported Permissions

* Dashboard Access
* Product Management Access
* Category Management Access
* CMS Management Access
* Settings Management Access
* User Management Access

---

# 📦 Product Management

* Add Products
* Edit Products
* Delete Products
* Product Status Control
* Product SEO Management
* Product Image Management
* Dynamic Product Filtering
* Product Metadata Configuration

---

# 🗂️ Category Management

* Create Categories
* Update Categories
* Delete Categories
* Category Status Management
* Dynamic Category Structure

---

# 📄 CMS Management

* About Us Content Management
* Contact Page Content Management
* Dynamic Meta Title Management
* Dynamic Meta Description Management
* SEO Content Management

---

# ⚙️ Website Settings Management

* Company Information
* Business Details
* Contact Information
* Logo Management
* Favicon Management
* Open Graph Image Management
* Social Media Links
* SEO Settings

---

# 🖼️ Media & Upload Management

* Local Image Upload
* Dynamic Image Preview
* Media Selection
* Upload API Handling
* Product Image Gallery Management

### Upload Location

```text
public/uploads
```

---

# 🔍 SEO Features

## Metadata Management

* Dynamic Meta Titles
* Dynamic Meta Descriptions
* Page-Specific SEO Settings

## Social Media Optimization

* Open Graph Tags
* Twitter Card Tags
* Social Sharing Images

## Structured Data (Schema.org)

* Organization Schema
* Product Schema
* CollectionPage Schema
* AboutPage Schema
* ContactPage Schema

## Technical SEO

* Semantic HTML Structure
* Dynamic Metadata Generation
* SEO-Friendly URL Structure

---

# 🛠️ Technology Stack

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| Next.js 16         | Full-Stack Framework        |
| React.js           | User Interface Development  |
| JavaScript         | Application Logic           |
| Tailwind CSS       | Styling & Responsive Design |
| Node.js            | Runtime Environment         |
| JSON Files         | Data Storage                |
| Next.js API Routes | Backend APIs                |

---

# 📁 Project Structure

```text
src/
│
├── app/
│   ├── admin/
│   ├── api/
│   └── frontend/
│
├── components/
│
├── lib/
│
├── data/
│
└── middleware/
│

public/
└── uploads/
```

---

# 🔌 API Modules

```text
/api/login
/api/Admins
/api/roles
/api/products
/api/categories
/api/cms
/api/settings
/api/upload
```

---

# ⚡ Installation Guide

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

# 🏗️ Production Deployment

Generate Production Build:

```bash
npm run build
```

Start Production Server:

```bash
npm start
```

---

# 🌍 Environment Variables

Create:

```env
.env.local
```

Example:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For Production:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

# 🎯 Project Highlights

✅ Complete Admin Management System

✅ Role-Based Access Control (RBAC)

✅ Module-Level Permission Management

✅ Secure Authentication System

✅ Product Management System

✅ Category Management System

✅ CMS Management

✅ Website Settings Management

✅ Dynamic SEO Configuration

✅ Structured Data Implementation

✅ Open Graph & Twitter Cards

✅ Image Upload System

✅ Responsive User Interface

✅ Next.js API Integration

✅ Production Build Tested

---

# 🚧 Future Enhancements

* Database Integration (MongoDB/PostgreSQL)
* Cloud Storage Integration
* Email Notification System
* Advanced Analytics Dashboard
* Activity Logs
* Multi-Language Support
* Two-Factor Authentication (2FA)

---

# 👨‍💻 Developer

**Krish Kachhadiya**

Internship Project – LOTAS Business Website & Admin Management System

Built with ❤️ using Next.js, React.js, Tailwind CSS, and Node.js.
