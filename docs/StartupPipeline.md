# StartupPipeline Documentation

## Overview

The `StartupPipeline` is a centralized orchestration system for the GoPostal iOS app that ensures all critical startup tasks execute in the correct order, with proper error handling and user feedback.

## Purpose

The StartupPipeline solves the problem of scattered, unreliable startup logic by providing:

1. **Guaranteed Execution Order** - Critical tasks always run in sequence
2. **Permission Handling** - Manages iOS system permission dialogs gracefully
3. **Error Resilience** - Continues operation even if non-critical steps fail
4. **Progress Tracking** - Provides real-time status for UI feedback
5. **Re-runnability** - Can be reset and re-executed after logout/login

## Architecture

```
┌─────────────────┐
│     Start()     │
└────────┬────────┘
         ▼
┌─────────────────┐     No    ┌─────────────┐
│  Check Auth     │ ─────────►│ Show Login  │
│  (isAuthenticated)│          └─────────────┘
└────────┬────────┘     Yes
         ▼
┌─────────────────┐
│ Request Location│
│   Permission    │◄── iOS System Dialog
└────────┬────────┘     (30s timeout)
         ▼
┌─────────────────┐
│  Geolocation    │◄── POST /geofence/detect
│    Check        │     Auto-select location
└────────┬────────┘
         ▼
┌─────────────────┐
│   Cache Sync    │◄── GET /aliases/sync
│                 │     Download company data
└────────┬────────┘
         ▼
┌─────────────────┐
│    Complete     │◄── Post StartupComplete
│                 │     notification
└─────────────────┘
```

## Phases

### 1. Checking Auth (10% progress)
- Verifies user authentication status
- If not authenticated: Shows login screen
- If authenticated: Proceeds to permission check

### 2. Requesting Permissions (25% progress)
- Checks current location permission status
- If `notDetermined`: Requests permission and waits for user response (30s timeout)
- If `authorized`: Proceeds to geolocation
- If `denied/restricted`: Skips geolocation, proceeds to cache sync

### 3. Detecting Location (30-50% progress)
- Gets current GPS coordinates
- Calls `POST /api/mobile/v1/geofence/detect`
- Auto-selects closest location within radius
- If multiple locations found: User can select from picker
- If no locations in range: Warns but continues

### 4. Syncing Cache (60-90% progress)
- Downloads company aliases from backend
- Populates local FTS5 search index
- Enables offline company matching
- Failure is non-fatal (app works with empty cache)

### 5. Completed (100% progress)
- Posts `StartupComplete` notification
- App is ready for use
- Main camera screen is active

## Usage

### Starting the Pipeline

```swift
// On app launch or after login
StartupPipeline.shared.start()
```

### Observing Progress

```swift
@StateObject private var pipeline = StartupPipeline.shared

// In View body:
if pipeline.currentPhase != .completed {
    ProgressView(value: pipeline.progress) {
        Text(pipeline.statusMessage)
    }
}
```

### Resetting After Logout

```swift
// After user logs out
StartupPipeline.shared.reset()
// Then after re-login:
StartupPipeline.shared.start()
```

## Error Handling

The pipeline is designed to be resilient:

| Failure Scenario | Behavior |
|-----------------|----------|
| Not authenticated | Shows login screen, pipeline pauses |
| Location permission denied | Skips geolocation, continues to cache sync |
| Geolocation API error | Logs error, continues to cache sync |
| Cache sync error | Logs error, completes pipeline |
| Permission timeout (30s) | Skips geolocation, continues |

## Integration Points

### App Launch (GoPostalApp.swift)
```swift
.onAppear {
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        StartupPipeline.shared.start()
    }
}
```

### After Login (LoginView)
```swift
LoginView(onLoginSuccess: {
    StartupPipeline.shared.reset()
    StartupPipeline.shared.start()
})
```

### Settings Logout
```swift
Button("Log Out") {
    apiClient.logout()
    StartupPipeline.shared.reset()
    // Triggers login flow
}
```

## Permissions

### Required in Info.plist

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required to scan text.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access is used to automatically detect your coworking site when you log in.</string>
```

### Permission Flow

1. **First Launch**: iOS shows system dialog with the description above
2. **User Response**: Pipeline waits up to 30 seconds
3. **Granted**: Proceeds with geolocation
4. **Denied**: Skips geolocation, user can manually select location in Settings

## API Dependencies

The pipeline makes these API calls:

1. **POST /api/mobile/v1/geofence/detect**
   - Request: `{ latitude, longitude, radius_miles }`
   - Response: `{ locations, count, operator_id, closest_location }`

2. **GET /api/mobile/v1/aliases/sync**
   - Query: `?operator_id={uuid}&since={timestamp}`
   - Response: `{ aliases, sync_timestamp, total_count }`

## Testing Scenarios

### Fresh Install
1. Install app
2. Grant camera permission (for scanning)
3. Login with Google
4. **Grant location permission when prompted**
5. Verify geolocation detects location
6. Verify cache sync completes

### Permission Denied
1. Fresh install
2. Login with Google
3. **Deny location permission**
4. Verify app continues without geolocation
5. Open Settings → Verify manual location selection works

### Logout/Login Cycle
1. Be logged in with location detected
2. Tap Logout
3. Login screen appears
4. Login again
5. **Verify geolocation check runs again**
6. Verify location updated if GPS changed

### Network Failure
1. Login successfully
2. Turn off network
3. Verify geolocation fails gracefully
4. Verify cache sync fails gracefully
5. App still usable for offline scanning

## Design Decisions

### Why a Centralized Pipeline?

**Before**: Scattered logic across AppContainer, LoginView, SettingsView
- Duplicated code
- Race conditions
- Inconsistent error handling
- Hard to debug

**After**: Single source of truth
- Clear execution order
- Consistent error handling
- Easy to test
- Self-documenting

### Why Allow Pipeline to Continue on Errors?

Non-critical failures shouldn't block app usage:
- **Geolocation failure**: User can manually select location
- **Cache sync failure**: App works with empty cache (will retry later)
- **Only auth failure is blocking**: Can't use app without authentication

### Why 30-Second Timeout?

- Gives user time to read and respond to permission dialog
- Prevents indefinite hanging if dialog dismissed
- Short enough to not frustrate user
- Logs warning for analytics

## Future Enhancements

Potential improvements:

1. **Background Refresh**: Re-run geolocation periodically while app is open
2. **Smart Retry**: Exponential backoff for failed API calls
3. **Offline Queue**: Queue scans until cache sync succeeds
4. **Analytics**: Track success/failure rates per phase
5. **User Education**: Show onboarding for first-time permission denial

## Related Files

- `GoPostal/Managers/StartupPipeline.swift` - Main implementation
- `GoPostal/Services/LocationService.swift` - Geolocation logic
- `GoPostal/Services/MobileAPIClient.swift` - API client
- `GoPostal/Services/SyncManager.swift` - Cache synchronization
- `GoPostal/GoPostalApp.swift` - App entry point
- `GoPostal/Info.plist` - Permission descriptions
