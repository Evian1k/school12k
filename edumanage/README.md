# EduManage - School Management System

A comprehensive, production-ready School Management System built with React, Vite, Tailwind CSS, and modern web technologies.

## 🚀 Features

### ✅ Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Admin, Teacher, Student, Parent)
- Automatic token expiry handling
- Demo accounts for testing

### ✅ Modern UI/UX
- Responsive design with Tailwind CSS
- Dark/Light theme toggle
- Smooth animations with Framer Motion
- Mobile-first approach
- Clean, modern interface inspired by Notion/Vercel

### ✅ Dashboard Features
- **Admin Dashboard**: Overview statistics, user management, quick actions
- **Teacher Dashboard**: Class management, attendance, grading
- **Student Dashboard**: Profile, grades, attendance, announcements
- **Parent Dashboard**: Child monitoring, academic performance, fee payments

### ✅ Core Functionality
- Student and staff registration
- Attendance tracking system
- Grading and report cards
- Fee management system
- Announcements and messaging
- Profile management

## 🛠️ Tech Stack

- **Frontend**: React 19.1, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand, React Context
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Forms**: React Hook Form

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edumanage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Demo Accounts

The application includes pre-configured demo accounts for testing:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@edumanage.com | admin123 | Full system access |
| **Teacher** | teacher@edumanage.com | teacher123 | Class management, grading |
| **Student** | student@edumanage.com | student123 | Profile, grades, attendance |
| **Parent** | parent@edumanage.com | parent123 | Child monitoring, fees |

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   ├── ui/              # Reusable UI components
│   └── forms/           # Form components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── admin/           # Admin dashboard and pages
│   ├── teacher/         # Teacher dashboard and pages
│   ├── student/         # Student dashboard and pages
│   └── parent/          # Parent dashboard and pages
├── contexts/            # React contexts (Auth, Theme)
├── services/            # API services and utilities
├── utils/               # Helper functions and utilities
└── hooks/               # Custom React hooks
```

## 🎨 Styling

The application uses a modern design system with:
- Custom Tailwind configuration
- Dark/Light theme support
- Responsive breakpoints
- Custom animations and transitions
- Consistent color palette

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup
The app is configured to work with a backend API at `http://localhost:5000/api`. If the backend is not available, it falls back to mock data for demonstration purposes.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Build the app: `npm run build`
2. Deploy the `dist` folder to Netlify

## 🎯 Features in Detail

### Authentication System
- Secure JWT token management
- Automatic session handling
- Role-based route protection
- Remember me functionality

### Dashboard Features
- Real-time statistics
- Quick action buttons
- Recent activity feeds
- Performance charts

### Responsive Design
- Mobile-first approach
- Collapsible sidebar
- Touch-friendly interface
- Optimized for all screen sizes

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Focus indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact via WhatsApp (floating button in app)
- Email: support@edumanage.com

## 🙏 Acknowledgments

- Icons by Lucide React
- UI inspiration from Notion, Vercel, and Linear
- Built with modern React patterns and best practices

---

**EduManage** - Streamlining education management with modern technology 🎓
