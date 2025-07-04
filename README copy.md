
# Team Performance Review App

A modern, responsive React application for managing team performance reviews and feedback built with Vite, React, Tailwind CSS, and Firebase.

## Features

- 🔐 **Authentication**: Secure login/signup with Firebase Auth
- 👥 **Team Management**: Add, edit, and manage team members
- 📝 **Feedback System**: Provide positive feedback and improvement suggestions
- 📊 **Dashboard**: Real-time performance overview and statistics
- 📈 **Reports**: Generate detailed performance reports with filtering
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Beautiful, animated interface with Tailwind CSS
- ☁️ **Real-time Data**: Firebase Firestore for instant data synchronization

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd team-performance-app
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Get your Firebase configuration
4. **Configure Firebase**

   - Update `src/config/firebase.js` with your Firebase configuration:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```
5. **Set up Firestore Security Rules**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /teamMembers/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }

       match /feedbacks/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```
6. **Start the development server**

   ```bash
   npm run dev
   ```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Feedback/
│   │   └── Feedback.jsx
│   ├── Layout/
│   │   └── Layout.jsx
│   ├── Reports/
│   │   └── Reports.jsx
│   └── TeamMembers/
│       └── TeamMembers.jsx
├── config/
│   └── firebase.js
├── contexts/
│   └── AuthContext.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Features Overview

### Authentication

- Secure user registration and login
- Password validation and visibility toggle
- Protected routes
- User session management

### Dashboard

- Real-time statistics overview
- Team performance metrics
- Recent activity feed
- Quick access to all features

### Team Management

- Add new team members with details
- Edit existing member information
- View team member statistics
- Delete team members (with confirmation)

### Feedback System

- Positive feedback tracking
- Improvement suggestions with action items
- Status management (open/closed)
- Real-time feedback updates

### Reports

- Advanced filtering options
- Export to CSV functionality
- Performance insights
- Visual statistics

## Data Structure

### Team Members

```javascript
{
  id: "auto-generated",
  userId: "user-auth-id",
  name: "string",
  email: "string",
  role: "string",
  experience: "string",
  skills: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Feedbacks

```javascript
{
  id: "auto-generated",
  userId: "user-auth-id",
  memberId: "team-member-id",
  type: "positive" | "improvement",
  project: "string",
  reviewer: "string",
  description: "string",
  actionItems: "string",
  status: "open" | "closed",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Building for Production

```bash
npm run build
```

This will create a `dist` folder with the production build.

## Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```
2. **Login to Firebase**

   ```bash
   firebase login
   ```
3. **Initialize Firebase Hosting**

   ```bash
   firebase init hosting
   ```
4. **Build and deploy**

   ```bash
   npm run build
   firebase deploy
   ```

### Deploy to Vercel

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```
2. **Deploy**

   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**

   ```bash
   npm run build
   ```
2. **Deploy the `dist` folder to Netlify**

## Usage

1. **Sign up/Login**: Create an account or login with existing credentials
2. **Add Team Members**: Navigate to Team Members and add your team
3. **Provide Feedback**: Use the Feedback section to give positive feedback or improvement suggestions
4. **View Dashboard**: Monitor team performance on the dashboard
5. **Generate Reports**: Use the Reports section to analyze performance data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please create an issue in the repository.

## Screenshots

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Team Members

![Team Members](./screenshots/team-members.png)

### Feedback

![Feedback](./screenshots/feedback.png)

### Reports

![Reports](./screenshots/reports.png)

## Roadmap

- [ ] Email notifications for feedback
- [ ] Advanced analytics and charts
- [ ] Team goals and objectives tracking
- [ ] Performance templates
- [ ] Mobile app (React Native)
- [ ] Integration with HR systems
- [ ] Bulk import/export functionality
- [ ] Advanced reporting with PDF export

## Changelog

### v1.0.0 (Current)

- Initial release
- User authentication
- Team member management
- Feedback system
- Dashboard and reports
- Responsive design

## Performance Considerations

- **Bundle Size**: Optimized with Vite for fast loading
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Use WebP format for images
- **Caching**: Service worker implementation for offline support
- **Database**: Efficient Firestore queries with proper indexing

## Security Features

- **Authentication**: Firebase Auth with email/password
- **Data Isolation**: Users can only access their own data
- **Input Validation**: Client and server-side validation
- **HTTPS**: Secure data transmission
- **XSS Protection**: Sanitized user inputs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

1. **Hot Reload**: Changes are reflected immediately during development
2. **TypeScript**: Consider migrating to TypeScript for better type safety
3. **Testing**: Add unit tests with Jest and React Testing Library
4. **ESLint**: Follow the configured linting rules
5. **Component Organization**: Keep components small and focused

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**

   - Ensure your Firebase config is correct
   - Check if authentication and Firestore are enabled
2. **Build Failures**

   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies
3. **Styling Issues**

   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes
4. **Authentication Issues**

   - Verify Firebase project settings
   - Check browser console for detailed error messages

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) section
- Read the [Firebase Documentation](https://firebase.google.com/docs)
- Check [React Documentation](https://reactjs.org/docs)
- Review [Tailwind CSS Documentation](https://tailwindcss.com/docs)
