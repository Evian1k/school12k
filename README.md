# EduManage - School Management System

A comprehensive, modern, and responsive School Management System built with React, Vite, and TailwindCSS. Designed for educational institutions to manage students, staff, grades, attendance, and more.

## ✨ Features

### 🏫 **Role-Based Access Control**
- **Admin**: Complete system control, user management, reports
- **Teacher**: Class management, grading, attendance tracking
- **Student**: Grade viewing, assignments, timetable access
- **Parent**: Child's progress monitoring, fee status

### 📊 **Comprehensive Management**
- Student enrollment and profile management
- Staff and teacher administration
- Class and subject organization
- Grade and performance tracking
- Attendance monitoring with analytics
- Fee management and payment tracking
- Announcements and notifications
- Assignment creation and submission

### 🎨 **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Dark/Light theme support
- Smooth animations and transitions
- Accessible interface (WCAG compliant)
- Progressive Web App (PWA) support

### 📈 **Analytics & Reporting**
- Interactive charts and graphs
- Performance analytics
- Attendance reports
- Financial overview
- Export capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Demo Authentication

The system uses **email verification codes** for secure authentication:

#### Quick Demo Access:
1. **Use these email addresses** (click the role buttons on login page):
   - **Admin**: admin@school.com
   - **Teacher**: teacher@school.com  
   - **Student**: student@school.com
   - **Parent**: parent@school.com

2. **Enter email** and click "Send Verification Code"
3. **Check the demo verification popup** (top-right corner) or browser console
4. **Copy and enter the 6-digit code** to sign in

#### Registration:
- Create new accounts with any email
- Verification codes are shown in demo popup for testing
- Real production deployment would send actual emails

## 🏗️ Production Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

#### 1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

#### 2. **Server Deployment** (Apache, Nginx)
```bash
npm run build
# Copy dist/ contents to your web server directory
```

#### 3. **Docker Deployment**
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Configuration

For production, update the authentication system in `src/contexts/AuthContext.jsx` to connect to your actual backend API.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── layout/         # Layout components (sidebar, header)
│   └── charts/         # Chart components
├── pages/              # Application pages
│   ├── admin/          # Admin-specific pages
│   ├── teacher/        # Teacher-specific pages
│   ├── student/        # Student-specific pages
│   ├── parent/         # Parent-specific pages
│   ├── auth/           # Authentication pages
│   └── dashboards/     # Role-based dashboards
├── contexts/           # React contexts (auth, theme)
├── lib/                # Utility functions
└── styles/             # CSS and styling
```

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router DOM
- **Build Tool**: Vite
- **Styling**: TailwindCSS, CSS Variables
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: React Context
- **TypeScript**: JavaScript with JSDoc

## 🔧 Configuration

### Theme Customization

Edit `src/index.css` to customize colors and styling:

```css
:root {
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  /* Add your custom colors */
}
```

### Responsive Breakpoints

The application uses TailwindCSS breakpoints:
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

## 🔐 Security Features

- Role-based route protection
- Input validation and sanitization
- XSS protection headers
- Secure authentication flow
- HTTPS enforcement (production)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus management
- Aria labels and descriptions

## 📱 PWA Features

- Offline functionality
- App installation
- Push notifications (ready)
- Fast loading with caching
- Responsive icon sets

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 🚨 Production Checklist

Before deploying to production:

- [ ] Update authentication to use real API
- [ ] Configure environment variables
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (Google Analytics, etc.)
- [ ] Set up monitoring and logging
- [ ] Configure HTTPS and security headers
- [ ] Test all user roles and permissions
- [ ] Verify responsive design on all devices
- [ ] Test PWA functionality
- [ ] Optimize images and assets
- [ ] Set up backup and recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for educational institutions worldwide**