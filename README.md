# GeoAttend - Smart Attendance with Location

A React Native mobile application for managing employee attendance with location-based verification.

## Features

- **User Authentication**: Secure login and registration system
- **Location-Based Attendance**: Check in/out with GPS location verification
- **Dashboard**: Overview of attendance statistics and quick actions
- **Attendance History**: View detailed attendance records with filtering options
- **Profile Management**: Update personal information and view statistics
- **Real-time Location**: Get current location and address information
- **Responsive Design**: Modern UI with consistent theming

## Project Structure

```
GeoAttendApp/
├── App.js                  # Main entry point
├── app.json                # Expo configuration
├── package.json            # Dependencies & scripts
├── babel.config.js         # Babel configuration
│
├── 📂 assets/              # Images, icons, fonts
│   ├── icon.png
│   └── ...
│
├── 📂 src/
│   ├── 📂 navigation/      # App navigation setup
│   │   ├── AuthNavigator.js # Login/Register navigation
│   │   ├── AppNavigator.js  # After login navigation
│   │   └── index.js         # Root navigation entry
│   │
│   ├── 📂 screens/         # All app screens
│   │   ├── LandingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── AttendanceScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ProfileScreen.js
│   │
│   ├── 📂 components/      # Reusable UI components
│   │   ├── Button.js
│   │   ├── InputField.js
│   │   ├── Card.js
│   │   └── MapViewComponent.js
│   │
│   ├── 📂 services/        # API calls & helpers
│   │   ├── api.js          # Fetch calls to backend
│   │   ├── auth.js         # Authentication helpers
│   │   └── location.js     # Geolocation functions
│   │
│   └── 📂 styles/          # Centralized styles
│       ├── colors.js
│       ├── typography.js
│       ├── layout.js
│       └── index.js
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GeoAttendApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Dependencies

### Core Dependencies
- **React Native**: 0.79.5
- **Expo**: ~53.0.20
- **React Navigation**: v6 for navigation management

### Key Libraries
- **@react-navigation/native**: Core navigation library
- **@react-navigation/stack**: Stack navigator for authentication flow
- **@react-navigation/bottom-tabs**: Tab navigator for main app
- **expo-location**: Location services and permissions
- **react-native-maps**: Map display component
- **@react-native-async-storage/async-storage**: Local data storage

## Architecture

### Navigation Structure
- **Root Navigator**: Handles authentication state
- **Auth Navigator**: Landing, Login, and Register screens
- **App Navigator**: Main app with bottom tabs (Dashboard, Attendance, History, Profile)

### State Management
- Local state with React hooks
- AsyncStorage for persistent data
- Mock services for development (easily replaceable with real API calls)

### Component Design
- Reusable components with consistent styling
- Centralized theme system (colors, typography, layout)
- Responsive design patterns

## Key Features Implementation

### Authentication Flow
- JWT token-based authentication (mock implementation)
- Persistent login state
- Secure logout functionality

### Location Services
- GPS location permission handling
- Real-time location updates
- Reverse geocoding for address information
- Distance calculations

### Attendance System
- Check-in/out with location verification
- Attendance history tracking
- Statistical overview and reporting

## Customization

### Styling
All styles are centralized in the `src/styles/` directory:
- **colors.js**: Color palette and theme colors
- **typography.js**: Font sizes, weights, and line heights
- **layout.js**: Spacing, margins, and component dimensions

### Components
Reusable components in `src/components/`:
- **Button**: Multiple variants (primary, secondary, outline)
- **InputField**: Form inputs with validation support
- **Card**: Container component with shadows
- **MapViewComponent**: Location display component

## API Integration

The app is designed to easily integrate with backend services:
- **api.js**: Centralized API service with authentication headers
- **auth.js**: Authentication service for user management
- **location.js**: Location services for attendance verification

Replace mock implementations in these files with real API calls to your backend.

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React Native best practices
- Maintain consistent naming conventions
- Use TypeScript for better type safety (optional)

### File Organization
- Group related functionality in dedicated directories
- Use index files for clean imports
- Keep components small and focused
- Separate business logic from UI components

### Testing
- Unit tests for utility functions
- Component testing with React Native Testing Library
- Integration tests for navigation flows

## Deployment

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

### App Store Deployment
1. Configure app.json with proper app details
2. Set up certificates and provisioning profiles
3. Build production version
4. Submit to App Store/Play Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Push notifications for attendance reminders
- [ ] Offline mode support
- [ ] Advanced reporting and analytics
- [ ] Team management features
- [ ] Integration with HR systems
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Biometric authentication

---

**Note**: This is a development version with mock data. Replace mock services with real API implementations before production use.

