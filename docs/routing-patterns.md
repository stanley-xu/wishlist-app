# Routing Patterns: React Router vs Expo Router

## The Problem We Were Solving

**Goal**: Automatically redirect users based on authentication state
- If logged in → redirect to main app `/(tabs)`
- If not logged in → redirect to login `/auth/login`
- Handle this seamlessly across app startup, page refresh, and auth state changes

## Traditional React Router Approach

In **React Router (web)**, route components exist in a nested tree and re-render on context changes:

```typescript
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />           {/* ← Always mounted */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  )
}

function Index() {
  const { user } = useAuth()
  
  // This re-renders automatically when auth context changes
  if (user) return <Navigate to="/dashboard" />
  return <Navigate to="/login" />
}
```

**Key Characteristic**: The `Index` component is **always in the React component tree**, so it re-renders when context updates, triggering redirects automatically.

## File-Based Routing Reality (Expo Router)

In **Expo Router**, only the current route component is mounted:

```
Current URL: /auth/login

Component Tree:
├─ _layout.tsx (AuthProvider)        ← Re-renders on context changes ✅
└─ (auth)/
   ├─ _layout.tsx (Stack)            ← Re-renders on context changes ✅  
   └─ login.tsx                      ← Current route - mounted
```

**Key Insight**: `app/index.tsx` is **NOT in the component tree** when you're on `/auth/login`!

### What This Means:

1. **Route components are isolated** - they only exist when that specific route is active
2. **No automatic redirect triggering** - context changes don't cause non-active routes to re-evaluate
3. **Layouts are the only "always mounted" components** - they do re-render on context changes

## Our Solution: Multi-Layered Approach

### 1. Index Route for Entry Points
```typescript
// app/index.tsx - handles app startup, manual navigation, refreshes
export default function Index() {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  if (user) return <Redirect href="/(tabs)" />
  return <Redirect href="/(auth)/login" />
}
```

**Covers**:
- ✅ App startup
- ✅ Manual navigation to `/`  
- ✅ Page refresh (any page)

### 2. Explicit Navigation After Auth Actions
```typescript
// app/(auth)/login.tsx
const handleLogin = async () => {
  await signIn({ email, password })
  router.replace('/(tabs)')  // ← Explicit redirect
}
```

**Covers**:
- ✅ Successful login/register
- ✅ Immediate user feedback
- ✅ No waiting for context re-evaluation

### 3. Session Persistence
```typescript
// lib/auth.tsx - handles session restoration
useEffect(() => {
  async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }
  getSession()
}, [])
```

**Covers**:
- ✅ Automatic session restoration on app start
- ✅ Maintains login state across refreshes

## What We Considered But Didn't Implement

### Layout-Level Navigation Guard
```typescript
// Could be added to _layout.tsx
function NavigationHandler() {
  const { user, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    
    const inAuthGroup = segments[0] === '(auth)'
    
    if (user && inAuthGroup) {
      router.replace('/(tabs)')
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login')
    }
  }, [user, loading, segments])

  return null
}
```

**Why we didn't use this**:
- ❌ Runs on every route change (performance overhead)
- ❌ Harder to debug (multiple redirect sources)
- ❌ Premature optimization (current solution covers all realistic scenarios)

## Key Learnings

### File-Based Routing Trade-offs

**Benefits**:
- ✅ Automatic code splitting
- ✅ Only loads components you need
- ✅ Clear file → route mapping
- ✅ Better performance (smaller bundles)

**Limitations**:
- ❌ Route components don't "listen" for context changes when unmounted
- ❌ Need explicit navigation after state changes
- ❌ Can't rely on traditional "always mounted" redirect patterns

### Layout Components Are Special

**Layouts (`_layout.tsx`) are the only components that**:
- Stay mounted across route changes within their scope
- Re-render on context updates
- Could handle navigation logic (if needed)

**Regular route components**:
- Only exist when that route is active
- Don't re-render when unmounted (obviously!)
- Need explicit navigation logic

### Best Practices for File-Based Routing + Auth

1. **Use index routes for entry point logic** - handles startup and explicit navigation
2. **Add explicit navigation after auth actions** - don't rely on automatic redirects
3. **Implement session persistence** - restore auth state on app start
4. **Keep layout-level guards minimal** - only add if you find gaps in coverage
5. **Start simple, add complexity when proven necessary** - avoid premature optimization

## Current Architecture Benefits

Our chosen approach is:
- ✅ **Explicit and debuggable** - clear where redirects come from
- ✅ **Covers all realistic scenarios** - startup, refresh, auth actions
- ✅ **Performant** - no unnecessary navigation checks
- ✅ **Simple to maintain** - fewer moving parts
- ✅ **Follows file-based routing patterns** - works with the framework, not against it

This demonstrates how **architectural patterns from traditional routing don't always translate directly** to file-based systems, requiring adaptation and new approaches.